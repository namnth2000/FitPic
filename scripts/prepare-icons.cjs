const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');

// Tauri uses the first ICO entry for its window icon. Keep the original pixels
// and offsets, but put the largest favicon-derived entry first for high DPI.
const iconPath = path.resolve(__dirname, '../src-tauri/icons/icon.ico');
const icon = readFileSync(iconPath);
const count = icon.readUInt16LE(4);
const entries = Array.from({ length: count }, (_, index) => Buffer.from(icon.subarray(6 + index * 16, 22 + index * 16)));
entries.sort((a, b) => (b[0] || 256) - (a[0] || 256));
entries.forEach((entry, index) => entry.copy(icon, 6 + index * 16));
writeFileSync(iconPath, icon);
