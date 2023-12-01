---
title: Using Chat GPT To Generate Meta Descriptions
published: 2023-11-30T00:00:00.000Z
tags:
  - Astro
  - Development
  - AI
description: >-
  Learn how to generate and save SEO meta descriptions with GPT-4 and Astro
  during a website's build process. Automate your content optimization!
---
## Overview
I've been using ChatGPT's web interface since launch, but I haven't spent much time actually interfacing with the API. This week, it occurred to me that I am missing meta descriptions and that's an easily solved problem with an LLM like ChatGPT.

In order to generate meta descriptions with ChatGPT, there are a few things to consider:
1. How will I get the markdown files into the prompt? Will I use fine-tuning or just the simple chat method?
2. Can I do this in a way that I only need to do once per post - in other words - can I save the response back to markdown?
3. I've thoroughly enjoyed [Astro](https://astro.build/) - can I bake it into the build process?

### Parsing the Markdown
Before I could get ChatGPT to read my markdown files (those are the files where I write my posts), I had to find them first. I tried different ways to be clever - like getting it from Astro's build hooks, but ultimately landed on a simple `fs` read function.

#### Finding the markdown files
Node's `fs.readdirSync` proved to be the most reliable method. I know my posts are all in one place - and I can pass a variable of that location to the Astro integration should it change. The biggest challenge here was reacquainting myself with handling file pathes in Node.

```js
const rootPath = process.cwd();
const fullPath = path.resolve(rootPath, postsPath);

const files = fs.readdirSync(fullPath);
const markdownFiles = files.filter(file => file.endsWith('.md'));
```

#### Simplifying the input
I realized that I didn't actually need to conserve the markdown formatting. ChatGPT really just needs text to form a description. I also found that passing the frontmatter to ChatGPT often led to the title or other pieces of metadata showing up in the response. In the end, I opted to isolate the prompt to only the markdown content.

```js
async function markdownToPlainText(parsedMarkdown) {
  const result = await remark().use(strip).process(parsedMarkdown.content);
  return String(result.value);
}
```

### Generating a Meta Description with GPT
With the post's content - it was time to interface with ChatGPT. I found this to be the more tedious process - trying to engineer the prompt in a way that produced reliable results. If you have any suggestions here - I'm all ears ([@laneparton](https://twitter.com/laneparton)). What I struggled the most with here was length - for some reason the "system" prompt was not being taken as literally as I expected (and is something I'm still tweaking).

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
I mentioned earlier that I want to preserve the response - so I don't have to fetch a meta description for every post every time I build the site. The most obvious thing to do is to write this back to the markdown file's frontmatter. That's fairly trivial with the packages I've already introduced.

One of the interesting things I found here was that `matter` parses the frontmatter and ultimately changes it from how I originally wrote it. For example, I was getting a `layout` key pointed with an absolute inserted back into my markdown. Ultimately moving it to an Astro integration helped that - because I was able to change the order/timing in which the file is read.

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
Perhaps the most challenging part of this entire exercise was converting the resulting node script into an Astro integration. I tried everything from a Vite plugin to `astro:build:done` but ultimately landed on `astro:build:setup`. Once I decided to just read the files via `fs` - this became even more straightforward.

I did notice that the hook would run on both the client and the server - so I isolated it on the client with a simple conditional.

## The End Result
The end result is an Astro integration that generates and saves a meta description for posts at build time. The most exciting part of this is really the concept rather than the output. It illuminates the endless possibilities of automation that ChatGPT + Astro can provide for a website. And, in the end, I don't have to deal with or worry about writing meta descriptions for my blog posts 🙂

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
