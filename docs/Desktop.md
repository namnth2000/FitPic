# FitPic Desktop on Windows

## Architecture

- Tauri v2 wraps the existing vanilla HTML/CSS/JS app. `npm run build` copies an explicit list from `scripts/static-assets.cjs` into `dist/`. Both Cloudflare Pages and `src-tauri/tauri.conf.json` consume this same output.
- Root static files remain deployable for the existing Cloudflare Pages configuration. `_headers`, favicon, privacy page, manifest and SEO assets are copied unchanged. There is no new Web deployment workflow.
- `fitpic-desktop.js` detects Tauri's global API. Only export changes: it sends the already rendered JPG bytes to `save_export`. Rust opens a native Save dialog and writes only its selected destination. The frontend cannot supply a filesystem path. Cancel stops the rest of the batch; completed files remain saved. An error reports the number already saved.
- Canvas rendering, the 960px preview, 2160px export, Crop state, upload inputs, batch logic and presets use shared Web code. Native exports are serialized and cannot be started again while another export is running.
- IndexedDB remains `fitpic-presets`, DB version 1, payload version 2. Settings and background Blobs persist together. Source images, crop positions and export files are not persisted. The app uses a stable `com.namnth.fitpic` identifier and WebView2's normal persistent profile, with no incognito mode. Do not change the identifier or origin between releases without a data migration.
- Desktop storage is separate from browser storage and development storage. Reinstalling, clearing app data or deleting `%LOCALAPPDATA%\com.namnth.fitpic` can remove local presets. There is no preset synchronization.
- Assets are embedded locally. No backend, image upload, paid API, remote processing, service worker, ZIP library or UI framework is added. CSP permits local scripts, inline styles used by the existing color controls, Blob images and Tauri IPC. Only the local main window receives the save permission; no general filesystem plugin is exposed.
- Window and installer icons are generated from the existing `favicon.svg`. The wordmark, UI, colors and favicon stay the same.
- The existing NTRV external link opens in the system browser via Tauri's opener plugin, scoped to that exact URL. Local privacy navigation stays inside FitPic.

## Windows prerequisites

Use Windows 10/11 x64. Install only prerequisites that are missing:

1. Node.js 24 LTS with npm.
2. Visual Studio 2022 Build Tools: **Desktop development with C++**, MSVC and a Windows 10/11 SDK.
3. Rust stable MSVC: install Rust via rustup, then `rustup default stable-msvc`.
4. Microsoft Edge WebView2 Runtime. It is usually already available on Windows 11.

Follow the [official Tauri Windows prerequisites](https://v2.tauri.app/start/prerequisites/#windows). Reopen PowerShell after installations and restart Windows if an installer requires it. Check:

```powershell
node --version
npm --version
rustc --version
cargo --version
npm ci
npm run desktop:info
```

Only the Tauri CLI is an npm development dependency. Rust and npm lockfiles are committed for reproducible builds. Global `@tauri-apps/api` and JS dialog packages are intentionally not installed; the small adapter uses `withGlobalTauri` and the Rust dialog plugin.

## Develop

Run from the repository root:

```powershell
npm run desktop:dev
```

The before-dev hook builds `dist/`. Tauri's built-in static dev server serves those assets without Vite or another framework. After editing root HTML/CSS/JS, run `npm run build` in another terminal to refresh `dist/`; Tauri watches that directory. Rust changes rebuild the shell. Dev and release storage origins differ, so test persistence in the release executable as well.

Web development can continue by serving the repository root, or by serving `dist/` after building. Native Save dialogs are enabled only inside Tauri. For the existing IndexedDB browser suite, serve the root and open `tests/presets-browser.html`.

If the favicon changes, run `npm run desktop:icons`. This also orders ICO entries with the largest first for Tauri's high-DPI window icon. Tauri also generates icons for other platforms; retain the Windows PNG/ICO files and `icon.png` used by this shell, or keep the other generated files when adding those platforms.

## Validate and build

```powershell
npm run check
npm test
npm run build
npm run desktop:check
npm run desktop:test
npm run desktop:build
```

`desktop:build` uses `--locked`, runs the static build hook, compiles the release executable and creates a per-user NSIS installer. Outputs:

- `src-tauri/target/release/fitpic.exe`
- `src-tauri/target/release/bundle/nsis/*-setup.exe`

For a faster executable-only build: `npx tauri build --no-bundle -- --locked`.

The installer bundles WebView2's offline installer so installation can work without downloading a runtime on the target machine. This increases installer size and requires a Microsoft download on the build machine the first time. Rust crates and NSIS tooling also need first-build downloads. After installation, all image workflows run offline. The installer is unsigned unless Windows code signing is configured separately; Windows may show an unknown-publisher prompt. No certificate or signing secret is required by the current workflow.

## Release through GitHub

The tag-only `.github/workflows/desktop-release.yml` runs on `windows-latest`, validates versions, runs JS and Rust tests, builds an NSIS Windows x64 installer, then publishes it using Tauri's GitHub Action and the repository's built-in `GITHUB_TOKEN`. Repository Actions must permit this workflow and release creation. It does not change Cloudflare Pages settings.

Before tagging, update the version in `package.json` and `src-tauri/Cargo.toml`. Refresh lockfiles with `npm install --package-lock-only` and `cargo check --manifest-path src-tauri/Cargo.toml`, then run all checks above and commit the source and lockfile changes. Tauri reads the product version from `package.json`. For version 1.0.0:

```powershell
node scripts/check-desktop-version.cjs desktop-v1.0.0
git tag desktop-v1.0.0
git push origin desktop-v1.0.0
```

Use a new version and tag for each release. For prereleases, use matching versions such as `1.1.0-beta.1` and `desktop-v1.1.0-beta.1`; the workflow marks the GitHub Release as a prerelease. Do not push a release tag until the intended source commit is ready. Tag creation and publishing are explicit maintainer actions, not part of a local build.

## Smoke-test checklist

Run against `src-tauri/target/release/fitpic.exe` and repeat installation checks with the NSIS package:

1. Disconnect networking. Launch FitPic and confirm the wordmark, icon, VI/EN and light/dark UI work.
2. Upload one image, then a mixed JPG/PNG/WebP batch. Navigate each preview. Check all ratios and backgrounds, Balance and Radius.
3. Crop each source differently, switch previews, apply a preset and confirm per-source crop positions are retained.
4. Select Image without a background: export must be disabled. Choose a local background, save an Image preset, fully close and reopen the release app, upload a new source, apply that preset and confirm the saved background returns.
5. Update, rename, reapply and delete presets. Rename with unsaved background edits must preserve the original saved background; settings edits must not auto-save.
6. Export one JPG and a batch via native Save dialogs. Check 2160px long edge, ratio and composition. Test Cancel on the first and later files, overwrite confirmation, and a non-writable destination. Completed-file counts must match disk contents.
7. Open the privacy page and return to the editor. Check Web root and `dist/` separately: download fallback on desktop browsers and native sharing on an actual iPhone/iPad.
8. Install, launch, upgrade and uninstall the NSIS build on a clean Windows machine. Check a machine without WebView2 if offline installation is required. Confirm a tag run attaches the installer to the intended GitHub Release.

Automated bridge tests cover sequential bytes, cancellation and partial errors. They do not by themselves verify a physical native dialog, a clean-machine installer, iOS sharing or a live GitHub Release. Record executed validation separately from this checklist.
