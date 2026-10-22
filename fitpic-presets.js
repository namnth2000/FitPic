(function (root, factory) {
  const core = typeof module !== 'undefined' && module.exports ? require('./fitpic-core.js') : root.FitPicCore;
  const api = factory(core);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.FitPicPresets = api;
})(globalThis, function ({ platforms, backgrounds }) {
  const storageKey = 'fitpic-presets';
  const settingsKeys = [
    'platformId', 'backgroundId', 'customColor',
    'balanceEnabled', 'balancePadding', 'radiusEnabled', 'radiusPx',
  ];

  function captureSettings(source) {
    return Object.fromEntries(settingsKeys.map((key) => [key, source[key]]));
  }

  function sameSettings(left, right) {
    return settingsKeys.every((key) => left[key] === right[key]);
  }

  function normalizeName(value) {
    if (typeof value !== 'string') return null;
    const name = value.trim().replace(/\s+/g, ' ');
    return name && name.length <= 60 ? name : null;
  }

  function validSettings(settings) {
    return settings && platforms.some(({ id }) => id === settings.platformId)
      && backgrounds.some(({ id }) => id === settings.backgroundId)
      && typeof settings.customColor === 'string' && /^#[0-9a-f]{6}$/i.test(settings.customColor)
      && typeof settings.balanceEnabled === 'boolean'
      && typeof settings.radiusEnabled === 'boolean'
      && (!settings.radiusEnabled || settings.balanceEnabled)
      && Number.isFinite(settings.balancePadding)
      && settings.balancePadding >= 0 && settings.balancePadding <= 0.2
      && Math.abs(settings.balancePadding * 100 - Math.round(settings.balancePadding * 100)) < 1e-8
      && Number.isInteger(settings.radiusPx) && settings.radiusPx >= 0 && settings.radiusPx <= 32
      && settings.radiusPx % 2 === 0;
  }

  function validatePresets(presets) {
    if (!Array.isArray(presets)) return null;
    const ids = new Set();
    const names = new Set();
    const clean = [];
    for (const preset of presets) {
      const name = normalizeName(preset?.name);
      if (!preset || typeof preset.id !== 'string' || !preset.id || preset.id.length > 100
        || !name || ids.has(preset.id) || names.has(name.toLowerCase())
        || !validSettings(preset.settings)) return null;
      ids.add(preset.id);
      names.add(name.toLowerCase());
      const background = preset.background;
      if (background != null && (preset.settings.backgroundId !== 'image'
        || typeof background.id !== 'string' || !background.id
        || typeof background.name !== 'string' || !background.name
        || !(background.blob instanceof Blob) || background.blob.size === 0
        || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(background.blob.type))) return null;
      const entry = { id: preset.id, name, settings: captureSettings(preset.settings) };
      if (background) entry.background = { id: background.id, name: background.name, blob: background.blob };
      clean.push(entry);
    }
    return clean;
  }

  function loadPresets(getStorage) {
    try {
      const raw = getStorage().getItem(storageKey);
      if (raw === null) return { presets: [], error: null };
      const data = JSON.parse(raw);
      const presets = data?.version === 1 ? validatePresets(data.presets) : null;
      return presets ? { presets, error: null } : { presets: [], error: 'invalid' };
    } catch (error) {
      return { presets: [], error: error instanceof SyntaxError ? 'invalid' : 'unavailable' };
    }
  }

  function createPresetStore({ getDatabase, getLegacyStorage }) {
    function openDatabase() {
      return new Promise((resolve, reject) => {
        let blocked = false;
        const request = getDatabase().open(storageKey, 1);
        request.onupgradeneeded = () => request.result.createObjectStore('state');
        request.onerror = () => reject(request.error);
        request.onblocked = () => { blocked = true; reject(new Error('Database blocked')); };
        request.onsuccess = () => {
          if (blocked) request.result.close();
          else resolve(request.result);
        };
      });
    }

    async function access(mode, data) {
      const db = await openDatabase();
      try {
        return await new Promise((resolve, reject) => {
          const transaction = db.transaction('state', mode);
          const store = transaction.objectStore('state');
          const request = mode === 'readonly' ? store.get('presets') : store.put(data, 'presets');
          let result;
          request.onsuccess = () => { result = request.result; };
          transaction.oncomplete = () => resolve(result);
          transaction.onabort = () => reject(transaction.error || new Error('Transaction aborted'));
          transaction.onerror = () => reject(transaction.error);
        });
      } finally {
        db.close();
      }
    }

    async function save(presets) {
      const clean = validatePresets(presets);
      if (!clean) return false;
      try {
        await access('readwrite', { version: 2, presets: clean });
        return true;
      } catch (error) {
        return false;
      }
    }

    async function load() {
      try {
        const data = await access('readonly');
        if (data !== undefined) {
          const presets = data?.version === 2 ? validatePresets(data.presets) : null;
          return presets ? { presets, error: null } : { presets: [], error: 'invalid' };
        }
        const legacy = loadPresets(getLegacyStorage);
        if (legacy.error) return legacy;
        // Commit the complete collection before removing the legacy copy.
        if (!await save(legacy.presets)) return { presets: legacy.presets, error: 'unavailable' };
        try { getLegacyStorage().removeItem(storageKey); } catch (error) { /* Migration is already committed. */ }
        return legacy;
      } catch (error) {
        // Existing settings remain usable if IndexedDB cannot be opened.
        return { presets: loadPresets(getLegacyStorage).presets, error: 'unavailable' };
      }
    }

    return { load, save };
  }

  return { storageKey, captureSettings, sameSettings, normalizeName, loadPresets, validatePresets, createPresetStore };
});
