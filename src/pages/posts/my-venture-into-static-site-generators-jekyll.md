---
title: My Venture into Static Site Generators - Jekyll
published: 2020-01-12T00:00:00.000Z
tags:
  - Development
  - Jekyll
  - SSG
layout: >-
  /Users/laneparton/Projects/Personal/laneparton.com/src/layouts/BlogLayout.astro
description: >-
  Discover the convenience and efficiency of using Jekyll and Gatsby to build
  static websites. Learn how Jekyll's simplicity and clear syntax can turn you
  from a beginner to a pro in no time, and stay tuned for an exciting future
  post exploring Gatsby. #webdevelopment #staticsites
---

Back in February, my team was tasked with updating the content on the Sensus Reach site, a site that promotes and supports our annual utility conference. While gathering requirements from internal stakeholders, it became apparent that more time would be spent working in the nuances of *The Keynote*, a WordPress theme, than it would take to build an entirely new site from the ground up.

Additionally, it became clear that the site really didn’t need WordPress behind it. The content was minimal and infrequently changed. When content was to be changed, it fell on our team anyway. Thus eliminating the need for any sort of page-builder administration functionality. With this in mind, I started pitching the idea of a static site, one that didn’t need a database nor a server-side language like PHP.

Enter Static Site Generators…

## **Jekyll - From Zero to Hero**

Well, I guess “hero” is a little stretch for such a simple tool, but that’s how it felt after a week into development. Our strategy was simple: get a design planned out and develop it immediately. [Jekyll](https://jekyllrb.com/) allowed us to build a static website in HTML using [Bootstrap](https://getbootstrap.com/), a framework everyone is familiar with, in no time. When development steered towards the inner-most pages, we found that Jekyll allowed us to standardize a template with ease. Our data came from Markdown files, allowing us to use YAML, called [Front Matter](https://jekyllrb.com/docs/front-matter/), to conveniently build custom fields with minimal configuration.

Jekyll’s convenience provided us with the means to generate pages, build navigation menus, use conditional logic in HTML templates, and organize our files in a meaningful way. Its clear syntax allowed us to go from **zero to hero** in under a month.

## **Gatsby - Taking the Next Step**

My eyes were set on [Gatsby](https://www.gatsbyjs.com/) from the moment the project came to fruition. I wanted to pitch it early on, but I knew the tight deadline would be inappropriate for such an experiment.

I had to wait for the next iteration of the site. Fortunately for me, that iteration has begun. I look forward to detailing my venture into Gatsby in a future post. In the meantime, **have you used Jekyll on any projects? Is Jekyll still relevant in 2020? What pitfalls have you found in Jekyll?**
