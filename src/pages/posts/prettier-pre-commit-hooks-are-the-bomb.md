---
title: Prettier + pre-commit hooks are the bomb
published: 2022-07-19T00:00:00.000Z
tags:
  - Development
  - Git
layout: >-
  /Users/laneparton/Projects/Personal/laneparton.com/src/layouts/BlogLayout.astro
description: >-
  "Learn how to use Git Hooks to automatically clean up your code on every
  commit. Say goodbye to formatting inconsistencies with team members!"
---

<aside>
❗ Honestly, I’m putting this here mostly for my own reference on future projects 🙂

</aside>

I can’t imagine a project where this functionality would be undesirable. I’ve been a long-time user of formatOnSave in VSCode - but there always seems to be a barrier or misalignment with team members working on the same project. I’m sure we could commit a .vscode folder - but there is something unnerving about that.

### Enter Git Hooks…

It’s pretty satisfying, watching Git do the work for you. Basically, everything you need to know is here:

[Pre-commit Hook · Prettier](https://prettier.io/docs/en/precommit.html)

But the implementation I’m most interested in boils down to this magic command:

```
npx mrm@2 lint-staged
```

…and voila! You’ve got squeaky clean code coming straight into your `git push` 🎉
