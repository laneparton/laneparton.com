---
title: Visual regression testing might save your ass.
published: 2021-01-21
tags:
  - Testing
  - Visual Regression Testing
---

I recently came across a very powerful tool that allows us developers to leave behind the second-guessing nature of “I changed x, did it break in y?”

BackstopJS will save your ass. Let me show you how easy it is to use.

### Get running in four steps:

1. Install BackstopJS globally: npm install -g backstopjs or yarn global add backstopjs
2. Change into a directory that will host the files and run: `backstop init`
3. Initiate a test: `backstop test`
4. **All good?** Approve the test so that it now becomes the reference: `backstop approve`

### So what might a real config look like?

You might find that it is easier to abstract out an array of scenarios into its own JavaScript file, like `scenarios.js`. In which case, you should look into using a JS based config file as described in this [example](https://github.com/garris/BackstopJS/tree/master/examples/jsBasedConfig).

**Now, your backstopConfig.js file might include:**

```
const scenarios = require('./scenarios.js');

// Further down backstopConfig.js
scenarios: scenarios,
```

**scenarios.js**

```
var scenarios = [
  {
    "label": "US - AMR to AMI Quiz (amr-quiz.php)",
    "cookiePath": "backstop_data/engine_scripts/cookies.json",
    "url": "https://staging.laneparton.com/test/",
    "referenceUrl": "https://laneparton.com/test/"
  },
 ];

 module.exports = scenarios
```

Have questions? Drop me a line on Twitter - [@LaneParton](https://twitter.com/laneparton)