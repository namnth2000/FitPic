(function (root, factory) {
  const api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.FitPicDesktop = api;
})(globalThis, function (root) {
  function isDesktop() {
    return typeof root.__TAURI__?.core?.invoke === 'function';
  }

  async function saveFiles(files, titleForFile) {
    if (!isDesktop()) throw new Error('Native export is only available in FitPic Desktop');
    let saved = 0;
    try {
      for (const file of files) {
        const bytes = Array.from(new Uint8Array(await file.arrayBuffer()));
        const written = await root.__TAURI__.core.invoke('save_export', {
          name: file.name,
          bytes,
          title: titleForFile(saved + 1, files.length),
        });
        // Cancel stops the rest of the batch. Already saved files remain on disk.
        if (!written) return { saved, cancelled: true };
        saved += 1;
      }
      return { saved, cancelled: false };
    } catch (cause) {
      throw Object.assign(new Error('Native export failed', { cause }), { savedCount: saved });
    }
  }

  return { isDesktop, saveFiles };
});
