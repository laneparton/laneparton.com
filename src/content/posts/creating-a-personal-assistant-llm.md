---
title: Creating a Personal Assistant with an LLM
published: 2024-01-25T00:00:00.000Z
tags:
  - LLM
  - LangChain
  - Development
description: ""
---

I've been getting increasingly frustrated with ChatGPT - especially when I want to provide it a meaningful amount of background or context. This week, I set out to setup an LLM locally with as much personal context as I could find. My goal was simple: can I ask basic life/schedule/note-related questions to my own little personal assistant LLM?

<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="https://twitter.com/obsdmd?ref_src=twsrc%5Etfw">@obsdmd</a> vault + <a href="https://twitter.com/NotionHQ?ref_src=twsrc%5Etfw">@NotionHQ</a> dump + <a href="https://twitter.com/MistralAI?ref_src=twsrc%5Etfw">@MistralAI</a> via <a href="https://twitter.com/LangChainAI?ref_src=twsrc%5Etfw">@LangChainAI</a> ... this should be fun. How smart can my little assistant get? What else can I do to improve the responses?<br><br>Can I add this to <a href="https://twitter.com/raycastapp?ref_src=twsrc%5Etfw">@raycastapp</a> or something and tie it into my workflow? Is anyone doing this already?</p>&mdash; lane (@laneparton) <a href="https://twitter.com/laneparton/status/1749604321665118706?ref_src=twsrc%5Etfw">January 23, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

As you can see from my tweet - the premise was simple. Can I write a RAG chatbot based on the following data:
- Obsidian - My current, everyday note-taking application
- Notion - My previous note-taking application, where I've archived a number of old, still relevant notes.

It's extremely straightforward with LangChain - so straightforward that I can outline it in an ordered list...
1. Clone the [RAG Chroma LangChain example](https://github.com/langchain-ai/langchain/tree/master/templates/rag-chroma-private)
2. Point a [DirectoryLoader](https://python.langchain.com/docs/modules/data_connection/document_loaders/file_directory) at the file directory where the Markdown files are (1)
3. ...profit? Not quite...

I quickly realized two things. First, Notion doesn't export any useful date information when you export all your documents. Second, I needed to enrich my Obsidian notes with metadata (like modified date) - where I found/used [this](https://github.com/langchain-ai/langchain/discussions/13462). This allowed me to query things like "What's for lunch on Tuesday?" (referring my Weekly Meal Plan) or "What tasks am I working on tomorrow" (referring to my Work Notepad) without getting results from deeper in my archive.

After posting it on X/Twitter it became apparent that this was just the beginning. Someone mentioned the idea of "re-ranking" - which is totally foreign to me. Googling around landed me at [this repo](https://github.com/snexus/llm-search/tree/main). As you can see, there are a ton of things to think about to improve this. To quote the README:

> better document parsing, hybrid search, HyDE enabled search, deep linking, re-ranking, the ability to customize embeddings, and more. The package is designed to work with custom Large Language Models (LLMs) – whether from OpenAI or installed locally.

That's just a quick recap - leading me to even more ideas and things to research 🙂