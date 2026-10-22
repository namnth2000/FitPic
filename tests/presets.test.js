const test = require('node:test');
const assert = require('node:assert/strict');
const {
  storageKey, captureSettings, sameSettings, normalizeName, loadPresets, savePresets,
} = require('../fitpic-presets.js');

const settings = {
  platformId: 'instagram-square', backgroundId: 'custom', customColor: '#FFCCAA',
  balanceEnabled: true, balancePadding: 0.13, radiusEnabled: true, radiusPx: 18,
};
const preset = { id: 'square', name: 'Instagram vuông', settings };

function memoryStorage(initial = null) {
  let value = initial;
  return {
    getItem(key) { assert.equal(key, storageKey); return value; },
    setItem(key, next) { assert.equal(key, storageKey); value = next; },
  };
}

test('settings snapshots exclude image files, URLs, crop positions and export state', () => {
  const snapshot = captureSettings({
    ...settings, images: [{ file: 'private.jpg', cropX: 0.1 }], backgroundImage: 'blob:private',
    cropX: 0.1, pendingShareFiles: ['cached.jpg'], previewIndex: 2,
  });
  assert.deepEqual(snapshot, settings);
  snapshot.radiusPx = 4;
  assert.equal(settings.radiusPx, 18);
});

test('presets survive a storage round trip without changing layout units or disabled values', () => {
  const storage = memoryStorage();
  assert.deepEqual(loadPresets(() => storage), { presets: [], error: null });
  const entries = [preset, {
    id: 'crop', name: 'Crop', settings: { ...settings, backgroundId: 'crop' },
  }, {
    id: 'no-layout', name: 'No layout',
    settings: { ...settings, balanceEnabled: false, radiusEnabled: false },
  }, {
    id: 'image', name: 'Image', settings: { ...settings, backgroundId: 'image' },
  }];
  assert.equal(savePresets(() => storage, entries), true);
  assert.deepEqual(loadPresets(() => storage), { presets: entries, error: null });
  assert.deepEqual(JSON.parse(storage.getItem(storageKey)), { version: 1, presets: entries });
});

test('changed settings are detected without treating source images or crop movement as preset changes', () => {
  assert.equal(sameSettings(settings, { ...settings, cropX: 0.9, images: ['new.jpg'] }), true);
  for (const [key, value] of Object.entries({
    platformId: 'tiktok', backgroundId: 'white', customColor: '#000000',
    balanceEnabled: false, balancePadding: 0.2, radiusEnabled: false, radiusPx: 0,
  })) {
    assert.equal(sameSettings(settings, { ...settings, [key]: value }), false, key);
  }
});

test('normalizes names and rejects empty, non-text and overlong names', () => {
  assert.equal(normalizeName('  Instagram   vuông  '), 'Instagram vuông');
  for (const name of ['', '   ', null, 3, 'x'.repeat(61)]) assert.equal(normalizeName(name), null);
  assert.equal(normalizeName('x'.repeat(60)), 'x'.repeat(60));
});

test('malformed, unsupported or invalid saved data fails safely', () => {
  const malformed = [
    '{bad', 'null', '[]', JSON.stringify({ version: 2, presets: [preset] }),
    JSON.stringify({ version: 1, presets: {} }),
  ];
  const invalidSettings = [
    { platformId: 'unknown' }, { backgroundId: 'unknown' }, { customColor: 'red' },
    { balancePadding: -0.01 }, { balancePadding: 0.21 }, { balancePadding: 0.015 },
    { balancePadding: null }, { radiusPx: 33 }, { radiusPx: 3 }, { radiusPx: '12' },
    { balanceEnabled: false, radiusEnabled: true }, { balanceEnabled: 'true' },
  ];
  for (const patch of invalidSettings) {
    malformed.push(JSON.stringify({ version: 1, presets: [{ ...preset, settings: { ...settings, ...patch } }] }));
  }
  malformed.push(JSON.stringify({ version: 1, presets: [preset, preset] }));
  malformed.push(JSON.stringify({ version: 1, presets: [preset, { ...preset, id: 'other', name: 'instagram VUÔNG' }] }));
  for (const raw of malformed) {
    assert.deepEqual(loadPresets(() => memoryStorage(raw)), { presets: [], error: 'invalid' });
  }
});

test('blocked storage and quota errors do not report successful saves or replace existing data', () => {
  const blocked = () => { throw new Error('SecurityError'); };
  assert.deepEqual(loadPresets(blocked), { presets: [], error: 'unavailable' });
  assert.equal(savePresets(blocked, [preset]), false);
  const raw = JSON.stringify({ version: 1, presets: [preset] });
  const storage = memoryStorage(raw);
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.equal(savePresets(() => storage, []), false);
  assert.deepEqual(loadPresets(() => storage).presets, [preset]);
});
