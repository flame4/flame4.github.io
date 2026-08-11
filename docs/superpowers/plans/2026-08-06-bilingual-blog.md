# Bilingual Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Chinese source posts and AI-generated English translations with localized routes, UI, search, feeds, and a repeatable translation command.

**Architecture:** Chinese Markdown remains the authored source at `raw_blog/posts/<slug>.md`; generated English Markdown lives at `raw_blog/posts/en/<slug>.md` with the same basename. The public Astro collection mirrors that layout, infers locale from the `en/` prefix, keeps Chinese URLs unprefixed, and serves English under `/en/`. Thin English route wrappers reuse the existing Astro pages while locale-aware collection helpers prevent content from crossing language boundaries.

**Tech Stack:** Astro 7 i18n routing, Astro Content Collections, Node.js test runner, Codex CLI non-interactive mode, Pagefind multilingual indexes.

## Global Constraints

- Chinese is the maintained source language and remains unprefixed in public URLs.
- English translations use `/en/` URLs and `en/` content directories.
- Translation preserves Markdown structure, code blocks, link targets, asset references, and non-translatable frontmatter.
- Site changes are implemented with test-first red-green cycles.
- Existing drafts and unrelated worktree changes remain untouched.

---

### Task 1: Locale-aware content and routes

**Files:**
- Create: `src/i18n/locales.ts`
- Create: `src/utils/getPostsByLocale.ts`
- Create: `src/pages/en/**/*.astro`
- Create: `src/pages/en/rss.xml.ts`
- Modify: `astro.config.ts`
- Modify: `astro-paper.config.ts`
- Modify: `src/utils/getPostPaths.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/posts/[...page].astro`
- Modify: `src/pages/posts/[...slug]/index.astro`
- Modify: `src/pages/tags/index.astro`
- Modify: `src/pages/tags/[tag]/[...page].astro`
- Modify: `src/pages/archives/index.astro`
- Modify: `src/pages/rss.xml.ts`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Produces: `getPostLocale(id): Locale`, `getPostsByLocale(posts, locale)`, and identical logical slugs for `posts/<slug>.md` and `posts/en/<slug>.md`.
- Consumes: Astro `getRelativeLocaleUrl()` and the existing content collection.

- [x] **Step 1: Write a failing production-build contract**

Add assertions that `/` contains only Chinese posts, `/en/` contains only English posts, both localized article routes exist, `html[lang]` is correct, and both RSS feeds contain only their locale.

- [x] **Step 2: Run the contract and verify RED**

Run: `npm test -- tests/site-contract.test.mjs`

Expected: FAIL because `/en/index.html` and the English article do not exist.

- [x] **Step 3: Implement locale filtering and route wrappers**

Configure locales as `zh` and `en`, make `zh` the unprefixed default, filter every listing/static path by locale, and add English wrappers that pass localized props into the shared root pages.

- [x] **Step 4: Run the contract and verify GREEN**

Run: `npm test -- tests/site-contract.test.mjs`

Expected: PASS with both localized route trees built.

### Task 2: Localized UI and language switching

**Files:**
- Create: `src/i18n/lang/zh.ts`
- Create: `src/components/LanguageSwitch.astro`
- Modify: `src/i18n/types.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/layouts/PostLayout.astro`
- Modify: `src/pages/posts/[...slug]/index.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/site-contract.test.mjs`

**Interfaces:**
- Produces: language links for equivalent routes and article-specific alternates, plus `hreflang` metadata.
- Consumes: localized routes and post pairing by basename from Task 1.

- [x] **Step 1: Add failing language-switch and metadata assertions**

Assert that Chinese and English pages render localized navigation, link to each other, and expose `zh`/`en` alternate URLs.

- [x] **Step 2: Run the contract and verify RED**

Run: `npm test -- tests/site-contract.test.mjs`

Expected: FAIL because Chinese UI strings and the switch are missing.

- [x] **Step 3: Add Chinese strings, switch UI, and alternates**

Use the current route for ordinary pages and the verified translation pair for article pages. Pass article alternates into layout metadata.

- [x] **Step 4: Run the contract and verify GREEN**

Run: `npm test -- tests/site-contract.test.mjs`

Expected: PASS with localized UI and reciprocal language links.

### Task 3: AI translation command and document contract

**Files:**
- Create: `/Users/lewisliu/ateam/blog/raw_blog/scripts/translation-lib.mjs`
- Create: `/Users/lewisliu/ateam/blog/raw_blog/scripts/translate.mjs`
- Create: `/Users/lewisliu/ateam/blog/raw_blog/test/translate.test.mjs`
- Modify: `/Users/lewisliu/ateam/blog/raw_blog/package.json`
- Modify: `/Users/lewisliu/ateam/blog/raw_blog/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `npm run translate -- <slug>` and an English file at `posts/en/<slug>.md`.
- Consumes: the saved Codex CLI login and a Chinese source file at `posts/<slug>.md`.

- [x] **Step 1: Write failing translation-library tests**

Test slug validation, target path selection, exact preservation of fenced code blocks and non-translatable frontmatter, deterministic `../assets/` rewriting, and refusal to overwrite without `--force`.

- [x] **Step 2: Run the translation tests and verify RED**

Run: `npm test -- test/translate.test.mjs`

Expected: FAIL because the translation modules do not exist.

- [x] **Step 3: Implement Codex-backed translation and validation**

Invoke `codex exec --ephemeral --sandbox read-only` with the source on stdin, capture the final Markdown on stdout, validate the translation contract, and atomically write the English file.

- [x] **Step 4: Run the translation tests and verify GREEN**

Run: `npm test -- test/translate.test.mjs`

Expected: PASS with a fake Codex executable proving the full command path.

- [x] **Step 5: Document the authoring and release workflow**

Document Chinese and English file locations, frontmatter preservation, translation review, preview, publish, and release commands in both repository READMEs.

### Task 4: Translate and publish the first article

**Files:**
- Create: `/Users/lewisliu/ateam/blog/raw_blog/posts/en/deep-code-reader.md`
- Create: `src/content/posts/en/deep-code-reader.md`

**Interfaces:**
- Consumes: `npm run translate -- deep-code-reader` and `npm run publish`.
- Produces: `/en/posts/deep-code-reader/` with reciprocal language switching.

- [x] **Step 1: Run the real AI translation command**

Run: `npm run translate -- deep-code-reader`

Expected: Codex returns validated English Markdown and writes the paired file.

- [x] **Step 2: Publish translated content to the site checkout**

Run: `npm run publish`

Expected: the Chinese source, English translation, and referenced assets are synchronized.

- [x] **Step 3: Run complete verification**

Run in `raw_blog`: `npm test`

Run in `flame4.github.io`: `npm test && npm run lint && npm run format:check && npm run build && git diff --check`

Expected: every command exits 0 and the production output contains both localized articles.
