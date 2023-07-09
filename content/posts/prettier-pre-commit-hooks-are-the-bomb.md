---
title: Prettier + pre-commit hooks are the bomb
published: 2022-07-19
tags:
    - Development
    - Git
---

<aside>
❗ Honestly, I’m putting this here mostly for my own reference on future projects 🙂

</aside>

I can’t imagine a project where this functionality would be undesirable. I’ve been a long-time user of formatOnSave in VSCode - but there always seems to be a barrier or misalignment with team members working on the same project. I’m sure we could commit a .vscode folder - but there is something unnerving about that.

### Enter Git Hooks…

It’s pretty satisfying, watching Git do the work for you. Basically, everything you need to know is here:

[Pre-commit Hook · Prettier](https://prettier.io/docs/en/precommit.html)

But the implementation I’m most interested in boils down to this magic command:

```Shell
npx mrm@2 lint-staged
```

…and voila! You’ve got squeaky clean code coming straight into your `git push` 🎉