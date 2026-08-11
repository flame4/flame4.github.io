import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('production build exposes the AstroPaper public surface only', async () => {
  const build = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
  assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);

  const home = await readFile('dist/index.html', 'utf8');
  assert.match(home, /\/posts\/deep-code-reader\//);
  assert.match(home, /data-layout="index"/);
  assert.match(home, /<html[^>]+lang="zh"/);
  assert.match(home, />文章</);
  assert.match(home, /href="https:\/\/flame4\.github\.io\/rss\.xml"/);
  assert.doesNotMatch(home, /rss\.xml\//);
  assert.doesNotMatch(home, /href="\/en\/posts\/deep-code-reader\/"[^>]*>[^<]*让 AI/);

  const englishHome = await readFile('dist/en/index.html', 'utf8');
  assert.match(englishHome, /\/en\/posts\/deep-code-reader\//);
  assert.match(englishHome, /<html[^>]+lang="en"/);
  assert.match(englishHome, />Posts</);
  assert.match(englishHome, /href="https:\/\/flame4\.github\.io\/en\/rss\.xml"/);
  assert.doesNotMatch(englishHome, /en\/rss\.xml\//);
  assert.doesNotMatch(englishHome, /让 AI 一劳永逸地读懂代码/);

  const deepCodeReader = await readFile('dist/posts/deep-code-reader/index.html', 'utf8');
  assert.match(deepCodeReader, /让 AI 一劳永逸地读懂代码/);
  assert.match(deepCodeReader, /ABC Loop/);
  assert.match(deepCodeReader, /aria-labelledby="table-of-contents-title"/);
  assert.match(deepCodeReader, /href="#核心方法abc-三个角色互相校验"/);
  assert.match(deepCodeReader, /data-post-content-layout="true"/);
  assert.match(deepCodeReader, /2026年8月6日/);
  assert.match(
    deepCodeReader,
    /lg:grid-cols-\[minmax\(0,1fr\)_16rem\]/
  );
  const tocSidebar = deepCodeReader.match(
    /<aside\b[^>]*data-table-of-contents="true"[^>]*>/
  )?.[0];
  assert.ok(tocSidebar, "article TOC should be rendered in a sidebar");
  assert.match(tocSidebar, /lg:sticky/);
  assert.match(tocSidebar, /lg:top-8/);
  assert.match(deepCodeReader, /href="\/en\/posts\/deep-code-reader\/"/);
  assert.match(deepCodeReader, /hreflang="en"/);
  assert.match(
    deepCodeReader,
    /<a\b[^>]*data-language-switch[^>]*>\s*中\s*<\/a>/
  );

  const englishDeepCodeReader = await readFile(
    'dist/en/posts/deep-code-reader/index.html',
    'utf8'
  );
  assert.match(englishDeepCodeReader, /<html[^>]+lang="en"/);
  assert.match(englishDeepCodeReader, /href="\/posts\/deep-code-reader\/"/);
  assert.match(englishDeepCodeReader, /hreflang="zh"/);
  assert.match(
    englishDeepCodeReader,
    /<a\b[^>]*data-language-switch[^>]*>\s*EN\s*<\/a>/
  );
  assert.doesNotMatch(englishDeepCodeReader, /前段时间我在给 OpenClaw 做扩展/);
  assert.match(englishDeepCodeReader, /6 Aug 2026/);

  const chineseRss = await readFile('dist/rss.xml', 'utf8');
  assert.match(chineseRss, /\/posts\/deep-code-reader\//);
  assert.doesNotMatch(chineseRss, /\/en\/posts\/deep-code-reader\//);

  const englishRss = await readFile('dist/en/rss.xml', 'utf8');
  assert.match(englishRss, /\/en\/posts\/deep-code-reader\//);
  assert.doesNotMatch(englishRss, /让 AI 一劳永逸地读懂代码/);

  await assert.rejects(readFile('dist/posts/publishing-workflow/index.html', 'utf8'), {
    code: 'ENOENT',
  });

  const aboutSource = await readFile('src/content/pages/about.md', 'utf8');
  assert.equal(aboutSource, '---\ntitle: "关于"\n---\n');
  const englishAboutSource = await readFile('src/content/pages/en/about.md', 'utf8');
  assert.equal(englishAboutSource, '---\ntitle: "About"\n---\n');

  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /concurrency:\n  group: pages\n  cancel-in-progress: true/);

  await assert.rejects(readFile('dist/posts/draft-preview/index.html', 'utf8'), { code: 'ENOENT' });
});
