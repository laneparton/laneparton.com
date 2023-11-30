import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import OpenAI from 'openai';
import { remark } from 'remark';
import strip from 'strip-markdown';

async function markdownToPlainText(parsedMarkdown) {
  // Only process the body of the document
  const result = await remark().use(strip).process(parsedMarkdown.content);
  return String(result.value);
}

async function generateDescription(plainText, openAiApiKey) {
  const openAiClient = new OpenAI({
    apiKey: openAiApiKey
  });

  return openAiClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "1. Never exceed the suggested length of 50-160 characters. 2. Output this with no extra words. 3. Do not output the title in the description.",
      },
      { 
        role: "user", 
        content: "What is a good meta description for this text:" + plainText
      },
    ],
    model: "gpt-3.5-turbo",
  });
}

function addDescriptionToFile(filePath, description) {
  const file = fs.readFileSync(filePath, 'utf8');
  const doc = matter(file);
  console.log(doc.data)
  
  doc.data.description = description;
  delete(doc.data.layout)
  const newContent = matter.stringify(doc.content, doc.data);
  
  fs.writeFileSync(filePath, newContent);
  console.log('The file has been updated with the new metadata:', filePath);
}

export function generateMeta({ openAiApiKey }) {
  return {
    name: "generate-meta",
    hooks: {
      "astro:build:setup": async ({ pages, logger }) => {

        let mdPages = []
        pages.forEach((value, key) => {
          if (key.endsWith('.md')) {
            mdPages.push(key)
          }
        });

        try {
          for (const filePath of mdPages) {
            const markdownData = fs.readFileSync(filePath, { encoding: 'utf8' });
            const parsedMarkdown = matter(markdownData);

            if(parsedMarkdown.data.description) {
              logger.info(`Already has description`)
              continue
            }

            const plainTextData = await markdownToPlainText(parsedMarkdown);
            const metaDescriptionResponse = await generateDescription(plainTextData, openAiApiKey);
            const metaDescription = metaDescriptionResponse.choices[0].message.content;

            addDescriptionToFile(filePath, metaDescription);
            logger.info(`Updated file with meta description: ${filePath}`);
          }
        } catch (error) {
          logger.error('An error occurred:', error);
        }
        logger.info("Integration completed.");
      }
    }
  };
}