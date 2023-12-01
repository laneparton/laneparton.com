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
      { role: "system", content: "Generate an SEO meta description. The description must be no more than 160 characters." },
      { role: "user", content: `Generate a meta description for: ${plainText}` }
    ],
    model: "gpt-4",
  });
}

function updateFileWithDescription(filePath, description) {
  const file = fs.readFileSync(filePath, 'utf8');
  const doc = matter(file);

  doc.data.description = description;
  const newContent = matter.stringify(doc.content, doc.data);
  fs.writeFileSync(filePath, newContent);
}

function filterMarkdownPages(fullPath) {
  const files = fs.readdirSync(fullPath);
  return files.filter(file => file.endsWith('.md'));
}

export function generateMeta({ openAiApiKey, postsPath = './src/content/posts' }) {
  return {
    name: "generate-meta",
    hooks: {
      "astro:build:setup": async ({ logger, target}) => {
        if(target === 'client') {
          return
        }

        // Resolving the path relative to the project root
        const rootPath = process.cwd(); // This gets the root directory
        const fullPath = path.resolve(rootPath, postsPath);

        const markdownPages = filterMarkdownPages(fullPath);

        try {
          for (const pagePath of markdownPages) {
            const filePath = path.join(fullPath, pagePath)
            const markdownData = fs.readFileSync(filePath, { encoding: 'utf8' });
            const parsedMarkdown = matter(markdownData);

            if (parsedMarkdown.data.description) {
              logger.info(`Description already present in ${pagePath}`);
              continue;
            }

            const plainTextData = await markdownToPlainText(parsedMarkdown);
            const metaDescriptionResponse = await generateDescription(plainTextData, openAiApiKey);
            const metaDescription = metaDescriptionResponse.choices[0].message.content;

            updateFileWithDescription(filePath, metaDescription);
            logger.info(`Updated ${pagePath} with new meta description.`);
          }
        } catch (error) {
          logger.error(`Error during description generation: ${error.message}`);
        }
        logger.info("Meta description generation completed.");
      }
    }
  };
}