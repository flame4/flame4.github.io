# flame4.github.io

AstroPaper site generated from the private `flame4/Blog` writing repository and hosted on GitHub Pages.

- Site: https://flame4.github.io/
- RSS: https://flame4.github.io/rss.xml

## Content boundary

Published Markdown is generated into `src/content/posts/` by the private source repository. Write, preview, and release posts from the sibling `raw_blog` checkout:

```sh
cd ../raw_blog
npm run dev
npm run release -- "Publish article title"
```

Local previews include entries marked `draft: true`; production builds exclude them.

## Local commands

| Command           | Action                       |
| :---------------- | :--------------------------- |
| `npm install`     | Install dependencies         |
| `npm run dev`     | Dev server at localhost:4321 |
| `npm run build`   | Build to `./dist/`           |
| `npm run preview` | Preview production build     |
