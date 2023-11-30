---
title: Gatsby + Netlify Redirects = Easy
published: 2020-05-29T00:00:00.000Z
tags:
  - Development
  - Gatsby
description: >-
  Discover a convenient solution for managing redirects on your Gatsby site with
  Netlify. Plus, explore alternative options for non-Netlify users.
---

Redirects are essential to web development, especially when renaming pages… Next time you find yourself updating a URL on a Gatsby site, Netlify has your back. [gatsby-plugin-netlify](https://www.gatsbyjs.org/packages/gatsby-plugin-netlify/) to be specific. *createRedirect* seems like a nifty tool to use in your *gatsby-node.js* file, but in the time crunch I found myself in; it didn’t work.

### Enter /static/_redirects

This was simple, easy, and worked without a single issue. You just add redirects like so:

```
# Manual Redirects
/home   /
/contact    /contact-us
```

If you want to get fancy, you can use the [Netlify playground](https://play.netlify.com/redirects) to test redirect rules. Simple, quick, and convenient. Let me know if you find issues or have other thoughts on easier ways to implement redirects.

### What if I’m not on Netlify?

The Actions page on Gatsby.org outlines a few more options for S3 and simple static hosts. I suggest you dig into those, [here](https://www.gatsbyjs.org/docs/actions/#createRedirect)!
