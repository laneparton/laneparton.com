---
title: Sage 9 + WPEngine
published: 2020-07-21T00:00:00.000Z
tags:
  - Development
  - PHP
  - WordPress
description: >-
  Learn how to fix the deployment of Sage 9 to WPEngine by swapping a simple
  line of code. Get your theme up and running in no time with this easy
  solution.
---

While working on a site recently, I dove headfirst into Sage 9. It was an amazing experience that I’ll document later. One trivial note I wanted to enforce in the land of Google and searching for common problems is the fix I found when deploying Sage 9 to WPEngine.

Thanks to the user *[pi_mont* on the Sage 9 forum](https://discourse.roots.io/t/sage-9-on-wpengine/9090/24) there is a fairly simple fix that will get your Sage 9 theme working in no time.

The trick is to swap *‘compiled’ => wp_upload_dir()[‘basedir’].’/cache’,* to *‘compiled’ => ‘/tmp/sage-cache’,* like so:

### ./config/view.php

```
/*
|----------------------------------------------------------------------
| Compiled View Path
|----------------------------------------------------------------------
|
| This option determines where all the compiled Blade templates will be
| stored for your application. Typically, this is within the uploads
| directory. However, as usual, you are free to change this value.
|
*/

'compiled' => '/tmp/sage-cache',
// 'compiled' => wp_upload_dir()['basedir'].'/cache',
```
