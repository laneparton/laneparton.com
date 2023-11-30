---
title: Bun's Release Hype - A Step Towards Getting Acquired
description: >-
  A deep dive into the recent release of Bun 1.0 and its move towards Node.js.
  Explore the hype, concerns, and the driving force behind Bun's ROI.
published: 2023-09-13T00:00:00.000Z
tags:
  - Hype
  - Opinion
  - JavaScript
layout: >-
  /Users/laneparton/Projects/Personal/laneparton.com/src/layouts/BlogLayout.astro
---
Last Friday, [Bun 1.0 was released](https://twitter.com/bunjavascript/status/1700148056706949627?ref_src=twsrc%5Etfw) - moving the conversation from [DHH and TypeScript](https://world.hey.com/dhh/turbo-8-is-dropping-typescript-70165c01) towards Node.js and a new competitor. Just like the battle that waged before it - this one was fueled by hype and passion. As the hype train rolled through Twitter, many were excited about a shiny new runtime, while others voiced concerns.
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I *really* like what <a href="https://twitter.com/jarredsumner?ref_src=twsrc%5Etfw">@jarredsumner</a> is doing with Bun, but I&#39;m a bit frustrated by their compatibility claim with <a href="https://twitter.com/nodejs?ref_src=twsrc%5Etfw">@nodejs</a>. It&#39;s not fully compatible, and many inner details are different. This results in many random issues over my repos asking for fixes for Bun incompatibilities,… <a href="https://t.co/p8t72natBF">pic.twitter.com/p8t72natBF</a></p>&mdash; Matteo Collina (@matteocollina) <a href="https://twitter.com/matteocollina/status/1700489064867123674?ref_src=twsrc%5Etfw">September 9, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Matteo's chief complaint about Bun could have been resolved with clearer messaging by Jarred and his team - especially surrounding the 1.0 release itself.

I found myself wondering *why* would they make this mistake? *Why* did they even need to release a 1.0 without certain drop-in compatibility? *Why* did they even need a production-grade video to introduce Bun (don't we all already know about it)?

While discussing this on Discord, a user pointed out the obvious - **they're ready to raise more capital (or get acquired)**.

## What is Driving Bun's ROI?

> The plan is to run our own servers on the edge in datacenters around the world. Oven will leverage end-to-end integration of the entire JavaScript stack (down to the hardware) to make new things possible.
- [Oven.sh](https://oven.sh/):

Bun's business model relies on building Oven - their own edge computing platform. I don't know much about build a PaaS or the capital required to establish one, but I can imagine that $7m might not make it very far. Additionally - what makes a brand new PaaS so exciting and relevant (hint: its not a runtime that anyone can support)? I would expect Oven to need significant investment in time and resources building the various pieces a PaaS requires: DNS management, cert management, routing and proxies, databases, storage, and elegant/branded UIs to configure and simplify all the above.

It wouldn't surprise me if they skip the work required to build Oven altogether - I mean, why are they only hiring low level systems programming engineers if they were expecting to ship a major service?

Only time will tell - but my guess is they're positioned to be acquired - and I would rank Vercel as one of the top buyers.
