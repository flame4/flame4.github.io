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

  const deepCodeReader = await readFile('dist/posts/deep-code-reader/index.html', 'utf8');
  assert.match(deepCodeReader, /让 AI 一劳永逸地读懂代码/);
  assert.match(deepCodeReader, /ABC Loop/);
  assert.match(deepCodeReader, /aria-labelledby="table-of-contents-title"/);
  assert.match(deepCodeReader, /href="#核心方法abc-三个角色互相校验"/);
  assert.match(deepCodeReader, /data-post-content-layout="true"/);
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

  await assert.rejects(readFile('dist/posts/publishing-workflow/index.html', 'utf8'), {
    code: 'ENOENT',
  });

  const aboutSource = await readFile('src/content/pages/about.md', 'utf8');
  assert.equal(aboutSource, '---\ntitle: "About"\n---\n');

  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /concurrency:\n  group: pages\n  cancel-in-progress: true/);

  await assert.rejects(readFile('dist/posts/draft-preview/index.html', 'utf8'), { code: 'ENOENT' });
});
