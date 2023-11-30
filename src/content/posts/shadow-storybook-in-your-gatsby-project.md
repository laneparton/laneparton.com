---
title: Split Storybook from Your Gatsby Project with Shadowing
published: 2022-01-28T00:00:00.000Z
tags:
  - Development
  - Gatsby
  - JavaScript
description: >-
  Build UI components and pages in isolation with Storybook, an open source
  tool. Simplify UI development, testing, and documentation. Learn how to create
  a shadowed Storybook project using Gatsby theme shadowing.
---

In some projects, like our flagship project at Duke, your Gatsby project might become overwhelming large. What happens when you want to add another tool to it? Should you increase the complexity and organization of your project? What if you could split it out into its own repo? Should you?

### What’s Storybook again?

Storybook is an open source tool for building UI components and pages in isolation. It streamlines UI development, testing, and documentation.

### Enter, Gatsby theme shadowing

Shadowing is a powerful tool. It is a necessity in order to adopt the influx of developers moving from the CMS space to the Jamstack ecosystem.  I’ll leave [their documentation for the work of “how”](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/) and jump into what your project might look like as a shadowed Storybook project.

```
/
|-- /.storybook
		|-- fsMock.js
		|-- main.js
		|-- preview.js
|-- /stories
    |-- Follow your component folder's structure here.
|-- gatsby-config.js
```

### Get the easy parts over with 😊

The folks at Gatsby have written enough to get us going. The important parts are to add your parent project in `gatsby-config.js` and scaffold out the must-have storybook configuration files.

### Now, let’s get to the real challenge

This isn’t 100% the end-all be-all solution, as most aren’t. This is simply what I discovered while trying to do this myself.

You want to make sure that Webpack is aware of the un-transpiled code in **Gatsby AND in your parent theme**. There are also a couple “gotchas” you should be aware of.

1. Exclude all the code in node_modules, except for Gatsby and your parent theme.
    
    ```jsx
    // Exclude vs include. I don't know why exclude wins (I tried both). These are negated matches so that it excludes everything in node_modules except the matches below
    config.module.rules[0].exclude = {
      and: []
    }
    
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude['and'].push(/node_modules\/(?!(gatsby)\/)/)
    // Transpile Sitespro the same
    config.module.rules[0].exclude['and'].push(/node_modules\/(?!(@dws-contributes\/sitespro-gatsby-base)\/)/)
    ```
    
2. Specify the staticQueryDir because this babel plugin's default is wrong (might be outdated).
    
    ```jsx
    // Use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    config.module.rules[0].use[0].options.plugins.push(
      [
        require.resolve('babel-plugin-remove-graphql-queries'),
        {
          stage: config.mode === `development` ? 'develop-html' : 'build-html',
          // Specify the staticQueryDir because this babel plugin's default is wrong (might be outdated).
          staticQueryDir: 'page-data/sq/d',
        },
      ]
    )
    ```
    
3. Fix and resolve any packages/errors it is struggling to find with aliases
    
    ```jsx
    config.resolve.alias = {
      ...config.resolve.alias,
      // Resolve a 'fs' error in storybook
      'fs': path.resolve(__dirname, 'fsMock.js'),
      // Resolve to the correct Gatsby reach router until it is patched
      '@reach/router': path.resolve(__dirname, '..', 'node_modules/@gatsbyjs/reach-router'),
      // Resolve to the right path for htmlparser2
      'entities': path.resolve(__dirname, '..', 'node_modules/htmlparser2/node_modules/entities')
    };
    ```
    

And voila, you now have a child-based storybook repository. Enjoy 🙂
