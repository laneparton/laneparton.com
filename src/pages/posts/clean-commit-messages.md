---
title: The Sacred Art of Clean Commit Messages
published: 2023-09-09
tags:
    - JavaScript
---
We've all been there. It's late at night, you're racing to finish a feature, and you scribble a quick "fix bug" or "oops" as a commit message. No big deal, right?

Wrong. Good commit messages make you stand out as a developer and they are always something you should take the time to craft. Here's why they matter - and how to improve them.

## Why Commit Messages Matter

A commit message isn't just documentation - it's a chance to communicate your code's intentions. Developers, even long after your departure, closely review commit histories to understand the decisions that went into the code. Descriptive commit messages are a nod to both yourself and those who come after you.

To illustrate this...

Bad commit messages lack context:

```
Fix stuff
```

Good commit messages provide clarity:

```
Fix null pointer exception in parser by handling empty inputs
```

Beyond working efficiently, writing solid commit messages also displays communication skills. Communication is a key differentiator in our development careers. Those of us who master this skill (in all facets) will find ourselves highly regarded and welcome among the cross-functional teams we work with.

## Committing to Better Commit Messages

One "hack" I use is to rely on the standards defined in [semantic commit messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) - these clearly explain the why and how of each change. Here are some common conventions:

- **fix:** bug fix (explain the bug)
- **feat:** new feature (explain the feature)
- **docs:** documentation update
- **style:** formatting, missing semi-colons
- **refactor:** improving code without changing functionality
- **test:** tests added, updated, or fixed

I know, writing semantic commit messages takes more time and energy than dashing off a quick note. But it's worth developing the habit. Here are some excuses for skipping commit message best practices - and why they don't hold up:
1. *"I don't have time!"* - Take a little more time now to save everyone time later figuring out messy commit histories.
2. *"I'll go back and clean them up later."* - You'll never go back. Just get in the practice now and it will become second nature!
3. *"No one reads these things anyway."* - You might be surprised! And it still looks sloppy to ignore best practices.

## Key Takeaways

- Commit messages explain and document your code and the decisions that influenced it - take time to write meaningful ones.
- Semantic commit messages are an easy way to clean up your commits.
- Good commit hygiene displays positive traits like care for team members and communication skills.

Personally, I'm committed to improving my commit messages. I feel awkward when I need to quickly commit something. So, whether working on personal projects or professional teams, aim to write commit messages you'd be proud to show off!