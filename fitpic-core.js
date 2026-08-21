(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.FitPicCore = api;
})(globalThis, function () {
  const platforms = [
    { id: 'instagram-feed', name: 'Instagram Feed', ratio: [4, 5] },
    { id: 'instagram-story-reels', name: 'Instagram Story / Reels', ratio: [9, 16] },
    { id: 'tiktok', name: 'TikTok', ratio: [9, 16] },
    { id: 'facebook-feed', name: 'Facebook Feed', ratio: [4, 5] },
    { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', ratio: [16, 9] },
    { id: 'youtube-shorts', name: 'YouTube Shorts', ratio: [9, 16] },
  ];

  const backgrounds = [
    { id: 'blur', name: 'Blur Original' },
    { id: 'white', name: 'White' },
    { id: 'black', name: 'Black' },
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

  function getCoverRect(sourceWidth, sourceHeight, canvasWidth, canvasHeight) {
    const scale = Math.max(canvasWidth / sourceWidth, canvasHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    return {
      x: (canvasWidth - width) / 2,
      y: (canvasHeight - height) / 2,
      width,
      height,
    };
  }

  return { platforms, backgrounds, getPlatform, getCanvasSize, getContainRect, getCoverRect };
});
