(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.FitPicCore = api;
})(globalThis, function () {
  const platforms = [
    { id: 'instagram-feed', name: 'Instagram Feed', network: 'instagram', ratio: [4, 5] },
    { id: 'instagram-square', name: 'Instagram Square', network: 'instagram', ratio: [1, 1] },
    { id: 'instagram-story-reels', name: 'Instagram Story / Reels', network: 'instagram', ratio: [9, 16] },
    { id: 'tiktok', name: 'TikTok', network: 'tiktok', ratio: [9, 16] },
    { id: 'facebook-feed', name: 'Facebook Feed', network: 'facebook', ratio: [4, 5] },
    { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', network: 'youtube', ratio: [16, 9] },
    { id: 'youtube-4-3', name: 'YouTube 4:3', network: 'youtube', ratio: [4, 3] },
    { id: 'youtube-3-4', name: 'YouTube 3:4', network: 'youtube', ratio: [3, 4] },
    { id: 'youtube-shorts', name: 'YouTube Shorts', network: 'youtube', ratio: [9, 16] },
  ];

  const backgrounds = [
    { id: 'blur', name: 'Blur Original' },
    { id: 'white', name: 'White' },
    { id: 'black', name: 'Black' },
    { id: 'custom', name: 'Custom' },
    { id: 'crop', name: 'Crop' },
  ];

  function getPlatform(id) {
    return platforms.find((platform) => platform.id === id) || platforms[0];
  }

  function getCanvasSize(platformId, longEdge) {
    const [ratioWidth, ratioHeight] = getPlatform(platformId).ratio;
    if (ratioWidth >= ratioHeight) {
      return { width: longEdge, height: Math.round((longEdge * ratioHeight) / ratioWidth) };
    }
    return { width: Math.round((longEdge * ratioWidth) / ratioHeight), height: longEdge };
  }

  function getContainRect(sourceWidth, sourceHeight, canvasWidth, canvasHeight) {
    const scale = Math.min(canvasWidth / sourceWidth, canvasHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    return {
      x: (canvasWidth - width) / 2,
      y: (canvasHeight - height) / 2,
      width,
      height,
    };
  }

  function clampUnit(value) {
    if (!Number.isFinite(value)) return 0.5;
    return Math.min(1, Math.max(0, value));
  }

  function getCropRect(sourceWidth, sourceHeight, canvasWidth, canvasHeight, cropX = 0.5, cropY = 0.5) {
    const scale = Math.max(canvasWidth / sourceWidth, canvasHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    const overflowX = Math.max(0, width - canvasWidth);
    const overflowY = Math.max(0, height - canvasHeight);
    const x = overflowX ? -overflowX * clampUnit(cropX) : 0;
    const y = overflowY ? -overflowY * clampUnit(cropY) : 0;

    return {
      x: x === 0 ? 0 : x,
      y: y === 0 ? 0 : y,
      width,
      height,
    };
  }

  function getCoverRect(sourceWidth, sourceHeight, canvasWidth, canvasHeight) {
    return getCropRect(sourceWidth, sourceHeight, canvasWidth, canvasHeight, 0.5, 0.5);
  }

  return {
    platforms,
    backgrounds,
    getPlatform,
    getCanvasSize,
    getContainRect,
    getCoverRect,
    getCropRect,
  };
});
