# flame4.github.io

Personal blog: Markdown in, static site out. Hosted on GitHub Pages.

- Site: https://flame4.github.io/
- RSS: https://flame4.github.io/rss.xml

## Write a post

Add a Markdown file under `src/content/blog/`:

```md
---
title: 'Hello'
description: 'A short note'
pubDate: 'Aug 03 2026'
---

Your content here.
```

Then:

```sh
git add . && git commit -m "Add post" && git push
```

## Local commands

| Command           | Action                          |
| :---------------- | :------------------------------ |
| `npm install`     | Install dependencies            |
| `npm run dev`     | Dev server at localhost:4321    |
| `npm run build`   | Build to `./dist/`              |
| `npm run preview` | Preview production build        |
