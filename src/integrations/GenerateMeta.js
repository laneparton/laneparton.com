import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import OpenAI from 'openai';
import { remark } from 'remark';
import strip from 'strip-markdown';

async function markdownToPlainText(parsedMarkdown) {
  const result = await remark().use(strip).process(parsedMarkdown.content);
  return String(result.value);
}

async function generateDescription(plainText, openAiApiKey) {
  const openAiClient = new OpenAI({ apiKey: openAiApiKey });

  return openAiClient.chat.completions.create({
    messages: [
      { role: "system", content: "1. Never exceed 50-160 characters. 2. No extra words. 3. Exclude title." },
      { role: "user", content: `Generate a meta description for: ${plainText}` }
    ],
    model: "gpt-3.5-turbo",
  });
}

function updateFileWithDescription(filePath, description) {
  const file = fs.readFileSync(filePath, 'utf8');
  const doc = matter(file);

  doc.data.description = description;
  const newContent = matter.stringify(doc.content, doc.data);
  fs.writeFileSync(filePath, newContent);
}

function filterMarkdownPages(pages) {
  return Array.from(pages.keys()).filter(page => page.endsWith('.md'));
}

export function generateMeta({ openAiApiKey }) {
  return {
    name: "generate-meta",
    hooks: {
      "astro:build:setup": async ({ pages, logger }) => {
        const markdownPages = filterMarkdownPages(pages);

        try {
          for (const filePath of markdownPages) {
            const markdownData = fs.readFileSync(filePath, { encoding: 'utf8' });
            const parsedMarkdown = matter(markdownData);

            if (parsedMarkdown.data.description) {
              logger.info(`Description already present in ${filePath}`);
              continue;
            }

            const plainTextData = await markdownToPlainText(parsedMarkdown);
            const metaDescriptionResponse = await generateDescription(plainTextData, openAiApiKey);
            const metaDescription = metaDescriptionResponse.choices[0].message.content;

            updateFileWithDescription(filePath, metaDescription);
            logger.info(`Updated ${filePath} with new meta description.`);
          }
        } catch (error) {
          logger.error(`Error during description generation: ${error.message}`);
        }
        logger.info("Meta description generation completed.");
      }
    }
  };
}