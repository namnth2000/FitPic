const { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync } = require('node:fs');
const path = require('node:path');
const assets = require('./static-assets.cjs');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
// Clean only this repository's fixed output directory, never a supplied path.
if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Invalid output path');
if (existsSync(output) && lstatSync(output).isSymbolicLink()) throw new Error('dist/ must not be a symbolic link');
mkdirSync(output, { recursive: true });
for (const entry of readdirSync(output)) rmSync(path.join(output, entry), { recursive: true, force: true });
for (const asset of assets) copyFileSync(path.join(root, asset), path.join(output, asset));
console.log(`Built ${assets.length} static assets in dist/`);
