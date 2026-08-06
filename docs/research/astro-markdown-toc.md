# 当前 AstroPaper 文章页面引入 Markdown 目录

研究日期：2026-08-06

## 结论

当前文章页最适合使用 Astro 内容渲染时返回的 `headings` 元数据生成目录：

```ts
const { Content, headings } = await render(post);
```

`headings` 已经与最终 Markdown HTML 的标题 ID 对齐，包含 `depth`、`slug` 和 `text`。文章页只需把它传给一个 Astro 组件，生成静态的 `<nav>` 和 `href="#${heading.slug}"` 链接即可。这个方案不需要在文章 Markdown 中重复维护目录，也不需要客户端脚本。

当前工作树已经有一版符合该方案的接入：文章页读取 `headings` 并渲染 `TableOfContents`，组件筛选 H2-H3、使用 `heading.slug` 建立锚点，并在没有可用标题时隐藏目录。实现位置见[文章页](../../src/pages/posts/%5B...slug%5D/index.astro#L77-L149)和[目录组件](../../src/components/TableOfContents.astro#L1-L42)。

如果需要让导出的 Markdown 文件本身也带有一段目录，则继续使用当前 `remark-toc` 处理链，在 Markdown 中放置约定的 `## Table of contents` 标题。它适合“内容内嵌目录”，页面顶部或侧栏目录仍应使用 `headings` 元数据。

## Astro 官方行为

1. 内容集合通过 `render()` 渲染时，Astro 返回 `<Content />` 和所有已渲染标题的列表；官方文档给出的标题项结构是 `{ depth, slug, text }`。因此目录组件可以直接使用 Astro 返回的 `slug`，不需要自行实现 slug 算法。
2. Markdown 标题会自动获得 `id`，默认 ID 基于 `github-slugger`。Astro 文档说明，处理器插件产生的自定义 ID 会反映到最终 HTML 和标题元数据中；这保证目录链接与正文锚点使用同一份信息。
3. 当前配置使用 `markdown.processor: unified(...)`，这是 Astro 官方用于保留 remark/rehype 处理链的配置方式。Astro 当前配置参考把旧的顶层 `markdown.remarkPlugins` 标记为 deprecated，并建议通过 `@astrojs/markdown-remark` 的 `unified()` 配置插件。
4. 内容集合属于构建时内容，文章页通过 `getStaticPaths()` 生成静态路由；目录也会在构建阶段生成，文章标题修改后随下一次构建更新。

## 当前项目接入点

| 位置 | 当前职责 | 目录相关结论 |
| --- | --- | --- |
| [`src/content.config.ts`](../../src/content.config.ts#L8-L28) | 用 `glob()` 将 `src/content/posts` 中的 `.md/.mdx` 注册为 `posts` 集合 | 目录数据来自集合条目的渲染结果，不需要改变 frontmatter schema |
| [`src/pages/posts/[...slug]/index.astro`](../../src/pages/posts/%5B...slug%5D/index.astro#L20-L48) | 用 `getStaticPaths()` 为文章集合生成静态页面 | 目录随文章页一起在构建期生成 |
| [`src/pages/posts/[...slug]/index.astro`](../../src/pages/posts/%5B...slug%5D/index.astro#L77-L149) | `render(post)` 得到 `Content`，并在正文前渲染目录 | 这是页面目录的主要接入点；标题页外部的 H1 不应重复列入目录 |
| [`src/components/TableOfContents.astro`](../../src/components/TableOfContents.astro#L1-L42) | 接收标题数组，保留 depth 2–3，生成带 `aria-labelledby` 的 `<nav>` | 当前实现已具备可合并的基本结构；目录层级、显示文案和样式集中在组件内 |
| [`astro.config.ts`](../../astro.config.ts#L33-L40) | 使用 `unified()`，启用 `remark-toc`、`remark-collapse` 和 `rehype-callouts` | 已具备 Markdown 内嵌目录的处理能力；页面目录不需要新增处理器 |
| [`src/styles/global.css`](../../src/styles/global.css#L41-L43) | 为 `:target` 设置滚动偏移 | 目录跳转不会把标题贴到视口最顶端，适合保留现有设置 |

## 推荐方案

### 页面目录：使用 `render()` 的 `headings`

页面目录的接入步骤保持为：

1. 在文章页保留 `const { Content, headings } = await render(post)`。
2. 在文章标题/元信息与 `<article>` 之间传入目录组件。
3. 目录组件按文章展示需要筛选标题深度。当前页面的文章标题是外层 H1，Markdown 正文从 H2 开始，因此 H2-H3 是合适的初始范围。
4. 链接目标只使用 `heading.slug`，目录文本使用 `heading.text`。
5. 用语义化 `<nav>` 和可见标题标识目录，保留键盘焦点样式。

这套方案的页面输出是由 Markdown 标题自动投影出来的：增删或重命名标题后，目录会在下次构建中同步，不会产生手写目录与正文不一致的问题。

### Markdown 源文件目录：保留 `remark-toc` 作为可选能力

当前 `astro.config.ts` 中的 `remarkToc` 使用默认匹配规则。根据其官方仓库说明，它会寻找第一个匹配的目录标题，将该标题下直到同级或更高标题之间的内容替换为链接列表；它不会把整篇文档的目录作为独立数据暴露给页面组件。

因此，若要让 Markdown 源文件携带内嵌目录，文章中应放置：

```markdown
## Table of contents
```

当前 `remarkCollapse` 又以 `Table of contents` 为目标标题，会把这段目录包成可展开的 `<details>`。当前 `deep-code-reader.md` 没有该占位标题，所以现有 `remark-toc` 不会在它的正文中插入内嵌目录。内嵌目录的标题约定需要与当前配置保持一致；中文的 `## 目录` 不会匹配现在的英文测试条件。

页面目录和 Markdown 内嵌目录承担不同职责：前者服务 AstroPaper 页面布局，后者服务 Markdown 在其他平台的内容分发。若同时启用，应明确展示位置，避免同一页面出现两份目录。

## 注意事项

- 以 `headings` 返回的 `slug` 为锚点来源，不要在目录组件中重新拼接中文标题或自行实现 slug 规则；重复标题、标点和插件自定义 ID 都交给 Astro 的标题元数据处理。
- 页面外层已经渲染文章标题 H1，目录默认从 H2 开始。需要更深层级时扩展组件筛选范围，并同步处理缩进和窄屏换行。
- 目录组件应保留静态 HTML 输出。当前项目启用了 Astro Client Router，但目录的首版功能不依赖滚动监听或 hydration；若未来增加当前章节高亮，需要额外处理页面切换后的生命周期。
- `remark-toc` 只在 Markdown 中存在匹配的占位标题时生成内容；它不是从 `headings` 自动创建页面侧栏的 API。
- 当前 `markdown.processor` 同时负责项目的 Markdown/MDX 处理链。调整处理器或插件顺序时，应同时检查 callout、代码高亮、内嵌目录和标题锚点。
- 目录跳转依赖正文标题实际存在对应的 `id`。现有文章页脚本还会为正文标题追加 `#` 自链接，这与目录链接是两层独立能力。

## 后续验证清单

- 构建 `deep-code-reader` 页面，确认目录包含 `核心方法：A、B、C 三个角色互相校验` 等 H2，并且链接可以跳转到同名标题。
- 用包含 H3 的文章确认层级缩进，用没有 H2/H3 的短文确认目录自动隐藏。
- 检查窄屏下长标题的换行、键盘焦点和暗色主题对比度。
- 如果需要对外发布 Markdown 内嵌目录，再为文章添加 `## Table of contents`，并检查 `remark-collapse` 生成的展开状态和其他平台对 `<details>` 的支持。

## 来源

- [Astro：Markdown in Astro](https://docs.astro.build/en/guides/markdown-content/)：`render()`、`<Content />`、`getHeadings()`、标题 ID，以及 unified/remark 插件配置。
- [Astro：Content collections](https://docs.astro.build/en/guides/content-collections/)：集合条目的 `render()`、标题列表和静态路由生成。
- [Astro：Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/#markdownprocessor)：`markdown.processor`、`unified()` 和旧 `markdown.remarkPlugins` 配置的状态。
- [Astro 官方仓库：content runtime](https://github.com/withastro/astro/blob/main/packages/astro/src/content/runtime.ts)：`render()` 结果包含 `Content`、`headings` 和处理后的 frontmatter。
- [remark-toc 官方仓库](https://github.com/remarkjs/remark-toc)：占位标题、目录列表、`maxDepth` 和“目录不作为独立数据暴露”的行为。
- [remark-collapse 官方仓库](https://github.com/Rokt33r/remark-collapse)：按目标标题把内容转换为可展开的 `<details>`。
