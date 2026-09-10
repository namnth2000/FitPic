const test = require('node:test');
const assert = require('node:assert/strict');
const {
  resolveLanguage,
  setLanguage,
  t,
} = require('../i18n.js');

test('uses an explicit saved FitPic language before browser preferences', () => {
  assert.equal(resolveLanguage(['en-US'], 'vi'), 'vi');
  assert.equal(resolveLanguage(['vi-VN'], 'en'), 'en');
});

test('detects Vietnamese and English from browser language tags', () => {
  assert.equal(resolveLanguage(['vi-VN', 'en-US']), 'vi');
  assert.equal(resolveLanguage(['en-GB', 'vi-VN']), 'en');
});

test('falls back to English for unsupported browser languages', () => {
  assert.equal(resolveLanguage(['fr-FR', 'ja-JP']), 'en');
  assert.equal(resolveLanguage([], null), 'en');
});

test('translates and interpolates runtime copy', () => {
  setLanguage('vi', { persist: false });
  assert.equal(t('app.downloadMany', { count: 3 }), 'Tải 3 ảnh JPG');
  assert.equal(t('home.ntrvPromo'), 'Muốn tạo bố cục nhiều ảnh hoặc chỉnh sửa nhiều hơn?');
  assert.equal(t('home.ntrvPromoLink'), 'Thử NTRV.');

  setLanguage('en', { persist: false });
  assert.equal(t('app.downloadMany', { count: 3 }), 'Download 3 JPGs');
  assert.equal(t('home.ntrvPromo'), 'Want to create multi-photo layouts or edit more?');
  assert.equal(t('home.ntrvPromoLink'), 'Try NTRV.');
});
