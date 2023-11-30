---
title: Level Up the Vue Developer Experience with ESLint
description: >-
  Boost your Vue development experience with eslint-plugin-vue. Get real-time
  feedback on code quality and conventions, and reinforce good habits.
published: 2023-07-21T00:00:00.000Z
tags:
  - JavaScript
  - Vue.js
  - Tips/Tricks
---

Getting acquainted with a new framework is always interesting. The first few weeks I spent with Vue, I was really impressed with the [Vue Style Guide](https://vuejs.org/style-guide/). It felt like the right amount of information and opinion to follow "best practices" in a framework I wasn't very comfortable with. Though, outside of keeping the style guide open, I wasn't quite sure how to utilize it. It was nice, but inaccessible when I was hard at work.

Not too long after, I was exploring the default project setup using create-vue-app and comparing it with my team's tooling to see what they chose to do (and not to do). I was surprised to find a Vue ESLint plugin installed. That's when I realized just what I had come across.

## Enter eslint-plugin-vue
The ESLint plugin for Vue has been a game changer in leveling up my Vue development experience. By integrating the Vue style guide recommendations into ESLint, I now get realtime feedback as I code instead of having to continually look at documentation. The plugin helps enforce consistent code quality and conventions across my team's codebase. The immediate feedback loop enables me to reinforce good habits and learn the nuances of the framework more quickly.

If you're looking to improve your Vue skills, I highly recommend adding eslint-plugin-vue to your project setup. The developer experience boost is well worth the small setup investment.

## Obligatory Installation Instructions
Via npm:
```bash
npm install --save-dev eslint eslint-plugin-vue
```

Via yarn:
```bash
yarn add -D eslint eslint-plugin-vue
```

Example .eslintrc.js:

```js [.eslintrc.cjs]
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
```
