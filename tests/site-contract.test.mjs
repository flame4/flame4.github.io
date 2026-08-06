import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('production build exposes the AstroPaper public surface only', async () => {
  const build = spawnSync('npm', ['run', 'build'], { encoding: 'utf8' });
  assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);

  const home = await readFile('dist/index.html', 'utf8');
  assert.match(home, /data-layout="index"/);
  assert.match(home, /\/posts\/publishing-workflow\//);

  const post = await readFile('dist/posts/publishing-workflow/index.html', 'utf8');
  assert.match(post, /我的博客发布流程/);

  const aboutSource = await readFile('src/content/pages/about.md', 'utf8');
  assert.equal(aboutSource, '---\ntitle: "About"\n---\n');

  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  assert.match(workflow, /concurrency:\n  group: pages\n  cancel-in-progress: true/);

  await assert.rejects(readFile('dist/posts/draft-preview/index.html', 'utf8'), { code: 'ENOENT' });
});
