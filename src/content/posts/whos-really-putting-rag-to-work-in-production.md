---
title: Who's Really Putting RAG to Work in Production?
description: >-
  Is RAG is just a tech demo or a viable production tool? Let's break down the real-world applications and challenges of deploying RAG.
published: 2024-04-30T00:00:00.000Z
hero: 'https://frontendmasters.com/static-assets/learn/og-learning-path-vue.jpg'
tags:
  - RAG
  - LLM
  - AI
---
Honestly, I've wanted to write (in depth) about RAG for a long a time. I've spent a considerable amount of time digging into it. I've seen an array of highly interesting techniques, explored endless open-source repositories, and have dabbled in all the  mainstream frameworks.  There are so many different topics I could explore, all within RAG. Many of which live in my unpublished drafts 🙂

So I've found myself wondering: why have I never finished any of them? Why do I always seem to jump ship half way through? What is my intuition telling me?

Consider these alongside more practical questions: what does a production RAG even look like? Is it reliable enough to put in front of anybody? And why isn't there a go-to RAG solution you and I use everyday? Why is production RAG so elusive?

## Maybe RAG is a hack for current LLM capabilities
With Google [claiming that](https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/#context-window) Gemini 1.5 supports a 1M context window - it begs the question: is RAG just a workaround for the limitations of the LLMs of yesterday. With roughly 700,000 words - do we really need to support a complicated RAG pipeline? Could that workflow be augmented with UI/UX instead of retrieval?

It looks like RAG might just be a stepping stone, not the end-all solution for the issues companies face when they're pulling info from various sources.

## Maybe there are just too many opportunities for failure
Between the retrieval of relevant documents and the generation of coherent responses, the complexity of RAG only multiplies. Each layer adds potential points of failure, from misinterpretations of the query to retrieving outdated or irrelevant information.

[@gabhubert](https://twitter.com/gabhubert) from [@dust4ai](https://twitter.com/dust4ai) outlines eight points of failure when deploying RAG in production in [this tweet](https://twitter.com/GregKamradt/status/1750991668118266282). Who has time to monitor and maintain all of those?
### A note on Robustness vs. Precision...
With RAG, the more data and complex questions you throw at it, the clearer it becomes: you're juggling reliability with getting the right, spot-on answers. In a high-stakes environment serving an entire enterprise - this becomes extremely critical.

## Maybe RAG is too unpredictable
New techniques for dealing with the complexities around retrieval pop up everyday. So much so that it begs the question - what is the gold standard today? How drastic will it change tomorrow? This ever-evolving landscape makes it incredibly difficult to set benchmarks and determine what is actually worth deploying to production.

Pouring time and resources into maintaining these pipelines and trying out new techniques only makes it harder to guess how things will pan out.

## Is (production) RAG even worth it?
I think we've all been caught up in the excitement of querying against our own data. We've been caught up in the glimmer of hope that the basic RAG demos offer. I know the feeling - you spin up a LangChain example with a handful of fancy new techniques (reranking, multi-query, routing, self-correction, etc.) and you feel the endless possibilities at your fingertips...

I always find myself at the end of this exercise asking - what does this look like in production? What happens when you plug in a terabyte of enterprise data (in all its glory)? Will it perform? What happens when a non-developer starts querying it? What happens when you start asking it philosophical questions - does it understand you're not asking for retrieval at that point? Is it performant for thousands of users? Is all of this headache even worth it?

Maybe... 🙂

## Obligatory Footnote...
New ideas around RAG pop up everyday. I hope none of what I've said here comes off as 100% concrete, unwavering facts... I'm actually really interested in RAG and how it will evolve as LLMs evolve! 😁 And... chances are I'll write about RAG again.

Until then!