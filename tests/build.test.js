const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, cpSync, readFileSync, readdirSync, writeFileSync, rmSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const assets = require('../scripts/static-assets.cjs');

test('Static build copies byte-identical runtime assets, cleans stale output and excludes development files', () => {
  const root = path.resolve(__dirname, '..');
  const fixture = mkdtempSync(path.join(os.tmpdir(), 'fitpic-build-'));
  try {
    cpSync(path.join(root, 'scripts'), path.join(fixture, 'scripts'), { recursive: true });
    for (const asset of assets) cpSync(path.join(root, asset), path.join(fixture, asset));
    execFileSync(process.execPath, [path.join(fixture, 'scripts/build.cjs')]);
    writeFileSync(path.join(fixture, 'dist/stale.js'), 'stale');
    execFileSync(process.execPath, [path.join(fixture, 'scripts/build.cjs')]);
    assert.deepEqual(readdirSync(path.join(fixture, 'dist')).sort(), [...assets].sort());
    for (const asset of assets) {
      assert.deepEqual(readFileSync(path.join(fixture, 'dist', asset)), readFileSync(path.join(root, asset)));
    }
    // Every local HTML resource must be included in the deployment surface.
    for (const html of ['index.html', 'privacy.html']) {
      const references = readFileSync(path.join(root, html), 'utf8').matchAll(/(?:src|href)="([^"#]+)"/g);
      for (const [, reference] of references) {
        if (reference !== '/' && !reference.startsWith('https://')) assert.ok(assets.includes(reference), reference);
      }
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
