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
      clean.push({ id: preset.id, name, settings: captureSettings(preset.settings) });
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

  function savePresets(getStorage, presets) {
    const clean = validatePresets(presets);
    if (!clean) return false;
    try {
      getStorage().setItem(storageKey, JSON.stringify({ version: 1, presets: clean }));
      return true;
    } catch (error) {
      return false;
    }
  }

  return { storageKey, captureSettings, sameSettings, normalizeName, loadPresets, savePresets };
});
