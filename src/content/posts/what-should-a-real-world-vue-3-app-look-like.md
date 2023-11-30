---
title: What should a real-world Vue 3 app look like?
description: >-
  Explore the next-gen Vue 3 app development world, learning about new industry
  best practices, state management, composables usage, and more.
published: 2023-01-05T00:00:00.000Z
hero: 'https://frontendmasters.com/static-assets/learn/og-learning-path-vue.jpg'
tags:
  - Development
  - JavaScript
  - Learning
  - Vue.js
---

## Introduction

Two months ago I started a new role building and maintaining a Vue 2 application. As we set our sights on 2023 - we’ve started to ask ourselves what a next-gen Vue 3 application might look like. What has changed in the industry over the past few years? What are the industry's best practices?

<aside>
💡 Most importantly (at this stage), how do we organize our code in an elegant way that adheres to Vue’s style guide?
</aside>

During my research, I noticed a handful of patterns and practices that stood out - especially from the perspective of organization:

1. The entrypoint is split into separate files
2. It follows casing standards religiously
3. Its type organization is predictable
4. It uses next-gen state management (hint: Pinia)
5. It makes heavy use of composables

## 1. The entrypoint is split into separate files

In Vue, the entrypoint is responsible for bootstrapping the app and setting up the main Vue instance. It might be named `main.ts`, `index.ts` , `app-setup.ts`, etc. In a large and complex application, it can get a little out of hand to keep adding bootstrap functions to this single file as your application and its dependencies grow.

In the examples I looked at, it was common practice to split this file into smaller files organized by functionality/dependency. Generally, this allows for better readability, easier debugging, and an overall cleaner structure.

I found the naming convention for where these were located to be interesting. In some instances it was `/plugins/` while in others it was `/modules/`. I’d love to find more examples to solidify my own preference, but in the end it’s all personal/team preference.

### Examples

1. [vue3-realworld-example-app/src/plugins at master · mutoe/vue3-realworld-example-app](https://github.com/mutoe/vue3-realworld-example-app/tree/master/src/plugins)
2. [vitesse/src/modules at main · antfu/vitesse](https://github.com/antfu/vitesse/tree/main/src/modules)
3. [hoppscotch/packages/hoppscotch-common/src/modules at main · hoppscotch/hoppscotch](https://github.com/hoppscotch/hoppscotch/tree/main/packages/hoppscotch-common/src/modules)

## 2.  It follows casing standards religiously

camelCase, kebab-case, and PascalCase are casing patterns used for naming folders and files within an application. Vue does a good job of documenting best-practices in this area.

According to the Vue docs on ****[Single-file component filename casing](https://vuejs.org/style-guide/rules-strongly-recommended.html#single-file-component-filename-casing):**

> Filenames of single-file components should either be always PascalCase or always kebab-case.

PascalCase works best with autocompletion in code editors, as it's consistent with how we reference components in JS(X) and templates, wherever possible. However, mixed case filenames can sometimes create issues on case-insensitive file systems, which is why kebab-case is also perfectly acceptable.
> 

In the examples I found, there was a mix of casing standards. Most of them favored PascalCase SFC with camelCase JS/TS. Although, my own preference after seeing all of them is the kebab-case everywhere that [Directus](https://github.com/directus/directus/tree/main/app/src/components) uses (something about it just felt more cohesive).

### PascalCase SFC, camelCase JavaScript/TypeScript, and kebab-case directories

1. [hoppscotch/packages/hoppscotch-common/src at main · hoppscotch/hoppscotch](https://github.com/hoppscotch/hoppscotch/tree/main/packages/hoppscotch-common/src)
2. [vitesse/src at main · antfu/vitesse](https://github.com/antfu/vitesse/tree/main/src)
3. [slidev/packages/client at main · slidevjs/slidev](https://github.com/slidevjs/slidev/tree/main/packages/client)

### PascalCase SFC and kebab-case everything else

1. [vue3-realworld-example-app/src at master · mutoe/vue3-realworld-example-app](https://github.com/mutoe/vue3-realworld-example-app/tree/master/src)

### Kebab-case everywhere

1. [directus/app/src/components at main · directus/directus](https://github.com/directus/directus/tree/main/app/src/components)

## 3. Type organization is predictable

By placing your global types in a central location, you can easily import and use them throughout your application. For example, if you have a global type for a user object, you can import it into any component that needs to work with user data.

This not only helps with code organization, but it also makes it easier to maintain and update types as your project evolves. Additionally, keeping your types organized in a separate folder can help to improve the readability and understanding of your code for other developers working on the project.

Finally - local types are colocated alongside or inside the files that need them.

### Examples

1. [directus/app/src/types at main · directus/directus](https://github.com/directus/directus/tree/main/app/src/types)
2. [slidev/types.ts at main · slidevjs/slidev](https://github.com/slidevjs/slidev/blob/main/packages/client/internals/types.ts)
3. [vue3-realworld-example-app/src/types at master · mutoe/vue3-realworld-example-app](https://github.com/mutoe/vue3-realworld-example-app/tree/master/src/types)

## 4. It uses next-gen state management (hint: Pinia)

Using a state management system can help improve the organization and maintainability of your code, especially in larger applications with many components that need to share data. It can also make it easier to debug your application and understand how different pieces interact with one another.

In the applications that I looked at (specifically for Vue 3), I found that most projects were using Pinia. While digging around on opinions, I found a tweet that provides some context around the direction of Vue’s preferred state management library:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Pinia is de facto Vuex 5! At this point it’s really a naming/branding issue.</p>&mdash; Evan You (@youyuxi) <a href="https://twitter.com/youyuxi/status/1463429442076745730?ref_src=twsrc%5Etfw">November 24, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

You can also read further about this directly in the [Vue documentation](https://vuejs.org/guide/scaling-up/state-management.html#pinia) (which I found later 😀).

### Examples

1. [vue3-realworld-example-app/src at master · mutoe/vue3-realworld-example-app](https://github.com/mutoe/vue3-realworld-example-app/tree/master/src)
2. [directus/app/src at main · directus/directus](https://github.com/directus/directus/tree/main/app/src)
3. [vitesse/src at main · antfu/vitesse](https://github.com/antfu/vitesse/tree/main/src)

## 5. It makes heavy use of composables (hence, the Composition API)

Vue 3 introduces a new feature called composables, which are essentially reusable pieces of logic that can be shared across components. These composables are created using a new function-based API and are designed to make it easier to share logic and functionality between components.

One of the key benefits of composables is that they can improve the readability and maintainability of your code. Since they are self-contained and can be easily imported and used in multiple components, you can avoid duplicating code and keep your components lean and focused. Composables also make it easier to test and debug your code, since you can isolate and test individual pieces of logic separately.

Overall, composables are a powerful and useful addition to the Vue ecosystem, and they are sure to become an essential tool for developers working with Vue 3. There is so much content around composables, that it warrants an entire post dedicated to their usage 🎉

### Learn More

[Composables | Vue.js](https://vuejs.org/guide/reusability/composables.html#conventions-and-best-practices)

### Examples

1. [directus/app/src/composables at main · directus/directus](https://github.com/directus/directus/tree/main/app/src/composables)
2. [slidev/packages/client/composables at main · slidevjs/slidev](https://github.com/slidevjs/slidev/tree/main/packages/client/composables)
3. [vue3-realworld-example-app/src/composable at master · mutoe/vue3-realworld-example-app](https://github.com/mutoe/vue3-realworld-example-app/tree/master/src/composable)
4. [vitesse/src/composables at main · antfu/vitesse](https://github.com/antfu/vitesse/tree/main/src/composables)
5. [hoppscotch/packages/hoppscotch-common/src/composables at main · hoppscotch/hoppscotch](https://github.com/hoppscotch/hoppscotch/tree/main/packages/hoppscotch-common/src/composables)

## There’s plenty more to explore…

These were just five of the organizational aspects I observed in a handful of open-source projects. I’ll continue exploring examples of large scale, production-grade Vue 3 projects. There is a lot to cover - and I’m thoroughly enjoying the Vue ecosystem.
