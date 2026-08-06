import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("site typography uses a readable full-size scale", async () => {
  const [theme, global, typography] = await Promise.all([
    readFile("src/styles/theme.css", "utf8"),
    readFile("src/styles/global.css", "utf8"),
    readFile("src/styles/typography.css", "utf8"),
  ]);

  assert.match(theme, /--text-xs: 0\.75rem;/);
  assert.match(theme, /--text-base: 1rem;/);
  assert.match(theme, /--text-5xl: 3rem;/);
  assert.match(global, /body \{\s+font-size: var\(--text-base\);/);
  assert.match(
    typography,
    /\.app-prose \{[\s\S]*?font-size: var\(--text-base\);/
  );
});
