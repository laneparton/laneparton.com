import fs from 'fs';
import matter from 'gray-matter';
import OpenAI from 'openai';
import { remark } from 'remark';
import strip from 'strip-markdown';

// Gets the API Key from the environment variable `OPENAI_API_KEY`
const openAiClient = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY
});

async function markdownToPlainText(markdownContent) {
  // Parse the Markdown content
  const parsedMarkdown = matter(markdownContent);

  // Only process the body of the document
  const result = await remark().use(strip).process(parsedMarkdown.content);
  return String(result.value);
}

async function generateDescription(plainText) {
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
  
  doc.data.description = description;
  const newContent = matter.stringify(doc.content, doc.data);
  
  fs.writeFileSync(filePath, newContent);
  console.log('The file has been updated with the new metadata:', filePath);
}

export async function GenerateMeta(filePath) {
  try {
    const markdownData = fs.readFileSync(filePath, { encoding: 'utf8' });
    const plainTextData = await markdownToPlainText(markdownData)
    const metaDescription = await generateDescription(plainTextData);
    
    addDescriptionToFile(filePath, metaDescription.choices[0].message.content);
  } catch(error) {
    console.error('An error occurred:', error);
  }
}