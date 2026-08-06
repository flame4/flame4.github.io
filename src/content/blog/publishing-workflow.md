---
title: '我的博客发布流程'
description: '用私有 Markdown 源仓库写作，在本地预览，并把公开文章发布到静态网站。'
pubDate: 'Aug 06 2026'
draft: false
---

这个博客采用两个仓库：一个私有仓库保存 Markdown 源文件和草稿，一个公开仓库保存 Astro 网站与发布后的内容。

日常写作都在私有仓库的 `posts/` 目录完成。文章通过 frontmatter 声明标题、简介、发布日期和草稿状态：

```yaml
---
title: '文章标题'
description: '文章简介'
pubDate: 'Aug 06 2026'
draft: false
---
```

本地预览会读取全部源文件，因此公开文章和草稿都能看到。发布时，脚本只把 `draft: false` 的文章同步到公开网站，然后运行生产构建。这样，写作空间保持私有，公开仓库只保存明确发布的内容。
