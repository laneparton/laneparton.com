---
title: Using Chat GPT To Generate Meta Descriptions
published: 2023-11-30T00:00:00.000Z
tags:
  - Astro
  - Development
  - AI
description: >-
  Boost your Astro project's SEO with automatically generated, AI-powered meta
  descriptions using ChatGPT by OpenAI. Streamline development and improve
  visibility.
---
## Overview
In this post, we explore an innovative approach to enhancing SEO in Astro-based web projects by automatically generating meta descriptions using ChatGPT, an AI language model by OpenAI. This method not only streamlines the development process but also ensures that each page has a unique and relevant meta description.

### Parsing the Markdown
The journey begins by parsing Markdown files in an Astro project. The script reads the content of these files, preparing them for AI processing. This step is crucial for accurately extracting the textual content that will be used to generate the meta description.

#### Finding the markdown files

```js
const rootPath = process.cwd();
const fullPath = path.resolve(rootPath, postsPath);

const files = fs.readdirSync(fullPath);
const markdownFiles = files.filter(file => file.endsWith('.md'));
```

#### Simplify the input

```js
async function markdownToPlainText(parsedMarkdown) {
  const result = await remark().use(strip).process(parsedMarkdown.content);
  return String(result.value);
}
```

### Generating a Meta Description with GPT
Once the Markdown content is prepared, the next step involves leveraging ChatGPT's powerful language model. The script sends the extracted text to GPT, which then crafts a concise and relevant meta description. This AI-driven process ensures that the generated descriptions are not only unique but also aligned with the content of each page.

```js
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
```


### Writing it back to the file
After generating the meta description, the script automatically updates the original Markdown file. This seamless integration saves time and reduces manual intervention, making the workflow more efficient.

```js
function updateFileWithDescription(filePath, description) {
  const file = fs.readFileSync(filePath, 'utf8');
  const doc = matter(file);

  doc.data.description = description;
  const newContent = matter.stringify(doc.content, doc.data);
  fs.writeFileSync(filePath, newContent);
}
```

### Navigating the Astro Integration API

## The End Result
The end result is an Astro project with enhanced SEO capabilities, thanks to automatically generated, AI-powered meta descriptions. This approach not only improves search engine visibility but also adds a layer of intelligence to the development process.

```js
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
```