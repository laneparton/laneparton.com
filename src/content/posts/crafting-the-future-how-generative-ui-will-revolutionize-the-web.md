---
title: 'Crafting the Future: How Generative UI Will Revolutionize the Web'
published: 2024-03-20T00:00:00.000Z
tags:
  - AI
  - Technology
  - LLM
description: >-
  Explore how Generative UI is shaping the web's future by offering personalized, AI-driven user experiences that revolutionize accessibility and user onboarding.
---
I've been thinking a lot about the future of the internet - specifically from the perspective of user experience. I've been wondering - what does the future look like? Should we even be arguing about what web framework to use? Should we be looking past our present day problems towards a future where AI is even more accessible and even more embedded in our lives?

Generative UI is where my mind keeps landing - but until now I haven't taken the time to actually consider the problems it solves and how it might differ from our present day patterns. It's difficult to conceptualize, in part, because it could look completely different than anything we've seen or done on the web thus far.

## What is Generative UI?
As the renowned Jakob Nielsen describes(1), Generative UI is the application of AI to produce (mostly) custom user experiences to end users - specifically tailored to the individual's problems and personality.

It's easy to imagine this way: ChatGPT generates text-based markdown responses to your queries - but what if it could produce entire user interfaces? What if it could illustrate the answer in a meaningful way? What if it could guide you through an experience - layering in UI components as it provides solutions to your problems?

![A mockup of a generated UI](/images/Generative_UI_Example.png)

## What problems does it solve?
In my research, there appears to be a few obvious problems this solves - things like:
1. Accessibility - Jakob Nielsen specifically calls out the ability for AI to bridge the gap in web accessibility, an area known for its challenges - especially for small teams. (1)
2. Onboarding Users - Another idea mentioned by Nielsen - you can imagine the value of simplifying experiences for new users and slowly layering in advanced features. (1)

What I'm most interested in is taking it a step further. What if we built experiences that completely revolved around you, the user? What problems might we solve?
1. Query by words, instead of digging through filters
2. Surface answers to implicit questions/problems - what information does a user journey tell an LLM when you pair it with enough knowledge about your product?
3. Tailored landing pages/dashboards - If the UI has enough information about the user and what they care about (can easily be inferred from the product) can we automatically show them exactly what they're looking for?

### How is this different from existing personalization techniques?
I've worked in the marketing world before - specifically with Marketo's web personalization APIs. I would imagine adding in the layer of data acquired from a product's user auth system would only enrich what a UI can do - and that's all without the magic of AI. So that begs the question... what's different here?

This is a question I'm still asking myself and I think the answer depends a little bit on the "magic" of the integration between prebuilt components and the LLM's ability to use them (ideally very dynamically). Previous personalization efforts might have been more static and more basic. The biggest difference I can imagine is simply: **generative UI can be completely freeform.** Imagine specifying (through open-ended text input) what you want to see.

## Who is pushing it forward?
I'd argue that Vercel was the first to advance this concept, with v0 and their subsequent ai/rsc SDK. They've done a great job illustrating what could be possible and what this might look like via [their demo](https://sdk.vercel.ai/demo).

Outside of our little developer world, I've seen this come up in a few places. Arc and Google seem to be utilizing similar concepts where they build the UI on the fly in response to searching the web. See for yourself!

### Arc Search
Arc Search essentially condenses searching to its own UI. It's able to walk through websites and generate a uniform UI inside the app based on the websites it visits.

<iframe width="560" height="315" src="https://www.youtube.com/embed/WIeJF3kL5ng?si=yFGGJt0UyJaKVtfX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Google Search Generative Experience
Similar to Arc Search, Google's new Search Generative Experience will build its own UI on the fly as you ask it questions - expanding beyond just markdown/text.

<iframe width="560" height="315" src="https://www.youtube.com/embed/dVsiusLQy5Q?si=J0_o4vTYOKaxpn0v" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## This is only the beginning
I love the internet and building user experiences. I would be lying if I said this didn't make me a little uneasy. That said - I'm ready to embrace whatever changes AI brings, because it's inevitable. Generative UI is a specifically interesting solution to personalizing and simplifying your experience on the web - and I can't wait to get my hands on the `ai/rsc` SDK (I will likely post a follow-up with a code demo).

## References
1. [Accessibility Has Failed: Try Generative UI = Individualized UX](https://jakobnielsenphd.substack.com/p/accessibility-generative-ui)

### Misc Reading:
- https://makedraft.com/pricing
- https://axbom.com/nielsen-generative-ui-failure/
- https://joefletcher.medium.com/generative-ui-and-the-downfall-of-digital-experiences-the-swift-path-to-average-5408f3fbdc6d
- https://sdk.vercel.ai/docs/concepts/ai-rsc
