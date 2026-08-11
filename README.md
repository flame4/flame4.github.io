# flame4.github.io

AstroPaper site generated from the private `flame4/Blog` writing repository and hosted on GitHub Pages.

- Site: https://flame4.github.io/
- RSS: https://flame4.github.io/rss.xml
- English: https://flame4.github.io/en/
- English RSS: https://flame4.github.io/en/rss.xml

## Content boundary

Published Markdown is generated into `src/content/posts/` by the private source repository. Write, preview, and release posts from the sibling `raw_blog` checkout:

```sh
cd ../raw_blog
npm run dev
npm run translate -- article-slug
npm run release -- "Publish article title"
```

## Bilingual content contract

- Chinese source: `src/content/posts/<slug>.md`, published at `/posts/<slug>/`
- English translation: `src/content/posts/en/<slug>.md`, published at `/en/posts/<slug>/`
- Translation pairing: identical `<slug>` basenames
- Shared assets: `src/content/posts/assets/`; English Markdown reaches them with `../assets/...`

Chinese is the default locale and keeps unprefixed URLs. Each listing, tag page, archive, RSS feed, and Pagefind index includes only its own language. Article pages expose reciprocal language links and `hreflang` metadata when both files exist.

Local previews include entries marked `draft: true`; production builds exclude them.

## Local commands

| Command           | Action                       |
| :---------------- | :--------------------------- |
| `npm install`     | Install dependencies         |
| `npm run dev`     | Dev server at localhost:4321 |
| `npm run build`   | Build to `./dist/`           |
| `npm run preview` | Preview production build     |
