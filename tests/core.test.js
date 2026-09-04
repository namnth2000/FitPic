const test = require('node:test');
const assert = require('node:assert/strict');
const {
  backgrounds,
  getCanvasSize,
  getContainRect,
  getCoverRect,
  getCropRect,
  getPlatform,
} = require('../fitpic-core.js');

function assertRectClose(actual, expected) {
  for (const [key, value] of Object.entries(expected)) {
    assert.ok(Math.abs(actual[key] - value) < 0.000001, `${key}: expected ${value}, received ${actual[key]}`);
  }
}

test('maps every supported placement to its specified aspect ratio', () => {
  assert.deepEqual(getPlatform('instagram-feed').ratio, [4, 5]);
  assert.deepEqual(getPlatform('instagram-square').ratio, [1, 1]);
  assert.deepEqual(getPlatform('instagram-story-reels').ratio, [9, 16]);
  assert.deepEqual(getPlatform('tiktok').ratio, [9, 16]);
  assert.deepEqual(getPlatform('facebook-feed').ratio, [4, 5]);
  assert.deepEqual(getPlatform('youtube-thumbnail').ratio, [16, 9]);
  assert.deepEqual(getPlatform('youtube-4-3').ratio, [4, 3]);
  assert.deepEqual(getPlatform('youtube-3-4').ratio, [3, 4]);
  assert.deepEqual(getPlatform('youtube-shorts').ratio, [9, 16]);
});

test('exposes Crop alongside the existing background choices', () => {
  assert.deepEqual(backgrounds.map((background) => background.id), ['blur', 'white', 'black', 'custom', 'crop']);
});

test('uses an exact output ratio with the requested long edge', () => {
  assert.deepEqual(getCanvasSize('instagram-feed', 2160), { width: 1728, height: 2160 });
  assert.deepEqual(getCanvasSize('instagram-square', 2160), { width: 2160, height: 2160 });
  assert.deepEqual(getCanvasSize('tiktok', 2160), { width: 1215, height: 2160 });
  assert.deepEqual(getCanvasSize('youtube-thumbnail', 2160), { width: 2160, height: 1215 });
  assert.deepEqual(getCanvasSize('youtube-4-3', 2160), { width: 2160, height: 1620 });
  assert.deepEqual(getCanvasSize('youtube-3-4', 2160), { width: 1620, height: 2160 });
});

test('contain rectangle centers image at its largest uncropped size', () => {
  assertRectClose(getContainRect(1600, 900, 1728, 2160), { x: 0, y: 594, width: 1728, height: 972 });
  assertRectClose(getContainRect(900, 1600, 2160, 1215), { x: 738.28125, y: 0, width: 683.4375, height: 1215 });
});

test('centers a landscape foreground vertically inside a 9:16 canvas without cropping', () => {
  const { width, height } = getCanvasSize('instagram-story-reels', 2160);
  assertRectClose(getContainRect(1600, 900, width, height), {
    x: 0,
    y: 738.28125,
    width: 1215,
    height: 683.4375,
  });
});

test('cover rectangle fills the blur background canvas', () => {
  assert.deepEqual(getCoverRect(1600, 900, 1728, 2160), { x: -1056, y: 0, width: 3840, height: 2160 });
});

test('crop rectangle defaults to centered cover and moves across overflow with normalized focus', () => {
  assert.deepEqual(getCropRect(1600, 900, 1728, 2160), {
    x: -1056,
    y: 0,
    width: 3840,
    height: 2160,
  });
  assert.deepEqual(getCropRect(1600, 900, 1728, 2160, 0, 0.5), {
    x: 0,
    y: 0,
    width: 3840,
    height: 2160,
  });
  assert.deepEqual(getCropRect(1600, 900, 1728, 2160, 1, 0.5), {
    x: -2112,
    y: 0,
    width: 3840,
    height: 2160,
  });
});

test('crop rectangle supports vertical positioning and clamps focus into the image', () => {
  assert.deepEqual(getCropRect(900, 1600, 2160, 1215, 0.5, 0.25), {
    x: 0,
    y: -656.25,
    width: 2160,
    height: 3840,
  });
  assert.deepEqual(getCropRect(900, 1600, 2160, 1215, -1, 2), {
    x: 0,
    y: -2625,
    width: 2160,
    height: 3840,
  });
});
