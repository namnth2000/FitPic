const { readFileSync, appendFileSync } = require('node:fs');
const path = require('node:path');

function checkVersion(tag, version, cargoManifest) {
  const cargoVersion = cargoManifest.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
  if (tag !== `desktop-v${version}` || cargoVersion !== version) {
    throw new Error(`Release tag, package.json and Cargo.toml must agree: desktop-v${version} (Cargo: ${cargoVersion})`);
  }
  return { version, prerelease: version.includes('-') };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const { version } = require('../package.json');
  const manifest = readFileSync(path.join(root, 'src-tauri/Cargo.toml'), 'utf8');
  const result = checkVersion(process.env.RELEASE_TAG || process.argv[2], version, manifest);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `prerelease=${result.prerelease}\n`);
  console.log(`Desktop release version: ${result.version}`);
}

module.exports = { checkVersion };
