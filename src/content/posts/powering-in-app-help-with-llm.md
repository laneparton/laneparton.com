---
title: Powering In-App Help With an LLM
published: 2023-12-08T00:00:00.000Z
tags:
  - AI
  - UI/UX
  - Development
description: >-
  Discover how to create efficient in-app help documentation with AI using
  LangChain, Chroma, and Mistral. Elevate your product's user experience today.
---

## The Concept
I've spent some time recently thinking about the best way to integrate in-app help documentation in a product - especially one with complex terminology and concepts. AWS, Google Analytics, Salesforce, etc. all have great documentation and do an excellent job displaying help anchors around their application. How do they do it? 

Probably with huge documentation teams and advanced tools 🙂...

So, how can a small team even compare? What opportunities do they have with little time and budget? I think I found an answer in LLMs.

Specifically using LangChain, Chroma, Mistral, and some new UI components - I'll walk you through the process of:
1. Loading PDF, JSON, and any other relevant data into a vector DB like Chroma
2. Using an open source LLM model like: Mistral, Llama2, orca-mini, [and more](https://ollama.ai/library?sort=popular) to query against the vector database
3. Wrapping things up nicely with an API and a new UI component

## First - if you haven't used LangChain, you're missing out
Think of all those ideas you've had on what to do with AI. [LangChain](https://langchain.com/) is your answer. None of this would be possible without the examples and the accessible resources provided by LangChain. You'll see repeatedly that LangChain is the glue to everything we do here.

## Loading/Preparing the context
LangChain provides a number of handy document loaders. These are functions that easily allow you to split context to be used in a vector database.

For my implementation, I ended up using `DirectoryLoader('context/', glob="**/*.js", loader_cls=TextLoader)` to gather a number of internationalization (i18n) definition files for supplemental application context. Additionally, I used `PyPDFDirectoryLoader("context/")` to load a user guide we distribute with our product. I imagined there might be multiple PDF files in a production environment, so I went with a `DirectoryLoader` there as well, just because it was so easy to do.

All in all, this looked like:
```python
# Load i18n files, for simple definitions and additional context that the PDFs might not cover.
i18n_loader = DirectoryLoader('context/', glob="**/*.js", loader_cls=TextLoader)
i18n_data = i18n_loader.load()


# Load User Guide and any related PDFs
pdf_loader = PyPDFDirectoryLoader("context/")
pdf_data = pdf_loader.load()

  
# Combine Data
data = pdf_data + i18n_data
```


### First, what is a vector database?
Honestly, I had no clue before this week. I asked ChatGPT to help me out here - I'll summarize what it described.

Basically, a vector database is like a library with a librarian who knows the context of every single book. This is made possible through converting text to vectors - unique numerical fingerprints that represent their meaning and context. This allows the "librarian" to quickly match a query or context to a source. It makes storing and looking up context for an LLM efficient.

#### Splitting the data and storing it in Chroma
LangChain, yet again, provides some easy-to-use functions to split the documents/context into vectors and load it into Chroma (a self-hosted vector database).

This looks like:
```python
# Split
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
all_splits = text_splitter.split_documents(data)

  

# Add to vectorDB
vectorstore = Chroma.from_documents( documents=all_splits,
	collection_name="rag-private",
	embedding=GPT4AllEmbeddings(),
)
retriever = vectorstore.as_retriever()
```

## Querying an LLM with the context
Again, LangChain makes this extremely simple. They even provide a prompt template especially for this use case. I opted to pull their prompt template in and customize it to get some markdown formatting - but really the sky is the limit here.

One of my goals from the outset was to use tech that I could self-host and avoid additional cost. That's why I opted for Ollama (using a Mac) and the [recently released Mistral]()

```python
# Prompt
# Optionally, pull from the Hub
# from langchain import hub
# prompt = hub.pull("rlm/rag-prompt")

# Or, define your own:
template = """You are an assistant for question-answering tasks. Format your responses in Markdown for better readability. Do not use headings. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Keep the answer concise and use three sentences maximum.
**Question:** {question}
**Context:** {context}
**Answer:**
"""
prompt = ChatPromptTemplate.from_template(template)

# LLM
ollama_llm = "mistral"
model = ChatOllama(model=ollama_llm)

# RAG chain
chain = (
	RunnableParallel({"context": retriever, "question": RunnablePassthrough()})
	| prompt
	| model
	| StrOutputParser()
)
```

## Making shiny things
So you've imported context into a vector database and queried an LLM - but how do you put a UI on it? Well - LangChain has you covered! They've built a number of templates for various use-cases and this specific one is documented [here](https://github.com/langchain-ai/langchain/tree/master/templates/rag-chroma-private).

Using the API provided by the template, I set out to build a UI component. I'll leave out the boring styling details - and save myself from intellectual property issues, but essentially what you'll be building is a component that:
1. Queries the API endpoint - `axios.post('/query/invoke'`
2. Uses a markdown renderer (if you opted for that) to display the result - `markdownIt`, for example.
3. Keeps the chat window scrolled to the bottom. It looked like ChatGPT used react-scroll-to-bottom, but I opted for a basic JS function that was triggered when the response is loaded. It basically runs `container.scrollTop = container.scrollHeight` 

In the future, I'd love to see [this issue](https://github.com/langchain-ai/langchain/issues/13306) resolved - which would allow Ollama (admittedly only useful for local development) to stream tokens. That would allow the "typing" response that we normally see with ChatGPT.
