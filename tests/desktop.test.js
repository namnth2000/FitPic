const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');
const { checkVersion } = require('../scripts/check-desktop-version.cjs');
const { translations } = require('../i18n.js');

function desktop(invoke) {
  const root = { __TAURI__: invoke ? { core: { invoke } } : undefined };
  vm.runInNewContext(readFileSync(require.resolve('../fitpic-desktop.js'), 'utf8'), root);
  return root.FitPicDesktop;
}

const file = (name) => ({ name, arrayBuffer: async () => Uint8Array.of(255, 216, 255, 217).buffer });
const title = (index, total) => `Save ${index}/${total}`;

test('Web never invokes native export', async () => {
  const api = desktop();
  assert.equal(api.isDesktop(), false);
  await assert.rejects(api.saveFiles([file('a.jpg')], title), /only available/);
});

test('Desktop saves exact bytes and names sequentially without accepting destination paths', async () => {
  const calls = [];
  let active = false;
  const api = desktop(async (command, args) => {
    assert.equal(active, false);
    active = true;
    await new Promise((resolve) => setImmediate(resolve));
    calls.push({ command, ...args });
    active = false;
    return true;
  });
  const result = await api.saveFiles([file('a.jpg'), file('b.jpg')], title);
  assert.equal(result.saved, 2);
  assert.equal(result.cancelled, false);
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    { command: 'save_export', name: 'a.jpg', bytes: [255, 216, 255, 217], title: 'Save 1/2' },
    { command: 'save_export', name: 'b.jpg', bytes: [255, 216, 255, 217], title: 'Save 2/2' },
  ]);
});

test('Cancel stops the batch and reports only files already saved', async () => {
  let calls = 0;
  const api = desktop(async () => ++calls === 1);
  const result = await api.saveFiles([file('a.jpg'), file('b.jpg'), file('c.jpg')], title);
  assert.equal(calls, 2);
  assert.equal(result.saved, 1);
  assert.equal(result.cancelled, true);
});

test('Native write failures preserve the saved count and stop the batch', async () => {
  let calls = 0;
  const api = desktop(async () => {
    if (++calls === 2) throw new Error('Access denied');
    return true;
  });
  await assert.rejects(api.saveFiles([file('a.jpg'), file('b.jpg'), file('c.jpg')], title), (error) => {
    assert.equal(error.savedCount, 1);
    assert.match(error.cause.message, /Access denied/);
    return true;
  });
  assert.equal(calls, 2);
});

test('Desktop feedback has matching Vietnamese and English keys', () => {
  const keys = (language) => Object.keys(translations[language]).filter((key) => key.startsWith('desktop.')).sort();
  assert.deepEqual(keys('vi'), keys('en'));
  assert.equal(keys('vi').length, 4);
});

test('Release rejects mismatched tag or Cargo version and identifies prereleases', () => {
  assert.deepEqual(checkVersion('desktop-v1.0.0', '1.0.0', 'version = "1.0.0"'), { version: '1.0.0', prerelease: false });
  assert.equal(checkVersion('desktop-v1.1.0-beta.1', '1.1.0-beta.1', 'version = "1.1.0-beta.1"').prerelease, true);
  assert.throws(() => checkVersion('v1.0.0', '1.0.0', 'version = "1.0.0"'), /must agree/);
  assert.throws(() => checkVersion('desktop-v1.0.0', '1.0.0', 'version = "0.9.0"'), /must agree/);
});
