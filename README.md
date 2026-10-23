# FitPic

Static, client-side tool to format one or multiple images for common social placements, on the Web and in FitPic Desktop for Windows (Tauri v2).

FitPic supports Instagram, TikTok, Facebook and YouTube aspect ratios, lets users keep the full image with blur / color / image-based backgrounds, add balanced padding and rounded foreground corners, or switch to Crop. It previews every image in a batch and exports each result locally in the browser.

Image-based background uses one user-selected local image as the shared background for the whole batch. The background is centered and cover-fitted to the target canvas while the foreground image keeps the existing contain behavior.

Balance adds equal padding on all four sides for Blur, White, Black, Custom and Image-based modes. Radius can round the foreground image while Balance is enabled. Crop keeps its existing full-canvas behavior and ignores both layout controls.

## Saved presets

After uploading an image, use **Save preset** above the ratio selector to name and save the current placement / ratio, background mode, custom color, Balance padding and Radius settings. Select a saved preset to apply it to the whole batch, including a newly uploaded batch.

- Adjustments never overwrite a preset automatically. Use **Update preset** to replace its settings, **Save preset** to create another one, or **Reapply** to restore its saved settings.
- Rename and delete actions are available for the selected preset. Deleting a preset keeps the current image settings.
- Presets survive page reloads in the same browser using IndexedDB. They do not sync across browsers or devices, and clearing site data removes them.
- Image-based presets save a local copy of their background file and restore it automatically, including after reopening the page. Choosing or clearing a background marks the preset as modified; only Save / Update commits the change. Source images and per-image crop positions are never saved.
- Existing local-storage presets migrate automatically after a successful IndexedDB transaction. Older Image-based presets need a background selected and an explicit Update once, because the original version did not store files.
- Settings and background files are written together in one transaction. Replacing or deleting a preset removes its obsolete background copy without affecting other presets.
- If browser storage is blocked, full or unreadable, FitPic shows a message and image editing remains available. A failed preset write does not replace the existing preset list.

## Local checks

Requires Node.js 18 or newer for the Web checks. Desktop development uses Node.js 24 LTS plus the Windows prerequisites below.

```powershell
npm run check
npm test
npm run build
```

For a local preview, serve this folder with any static HTTP server. `npm run build` validates JavaScript and copies only the app's static assets into `dist/`, including `_headers`. There is no bundler or Web runtime dependency.

Cloudflare Pages can use build command `npm run build` and output directory `dist`. Existing deployments that serve the repository root keep working without a dashboard change. No Web deployment workflow is replaced or triggered by the Desktop release workflow.

## FitPic Desktop (Windows)

The Desktop app bundles the same HTML, CSS, canvas rendering and IndexedDB preset code. Upload, preview, batch settings, per-image Crop and saved background Blobs use the existing browser APIs inside WebView2. Processing works offline. Presets are local to the Desktop app and separate from presets in your browser.

Install Node.js 24 LTS, Rust stable with the MSVC toolchain, Visual Studio C++ Build Tools with a Windows SDK, and Microsoft Edge WebView2. Then, in PowerShell at the repository root:

```powershell
npm ci
npm run desktop:info
npm run desktop:dev
```

To validate and build the Windows installer:

```powershell
npm run check
npm test
npm run build
npm run desktop:check
npm run desktop:test
npm run desktop:build
```

The executable is `src-tauri/target/release/fitpic.exe`. The NSIS installer is in `src-tauri/target/release/bundle/nsis/`. It includes the offline WebView2 installer for machines without that runtime. Build tools and dependencies need network access on the first build; image processing does not.

Desktop export opens a native **Save As** dialog for each JPG, sequentially for a batch. Cancel stops the remaining files and reports how many were saved. Web download and iPhone/iPad share behavior stay the same.

Push a matching `desktop-v*` tag to build and publish a Windows x64 installer to GitHub Releases. Keep `package.json`, `package-lock.json`, `src-tauri/Cargo.toml` and `src-tauri/Cargo.lock` versions in sync first. The workflow rejects a mismatched tag. Full setup, release commands and the smoke-test checklist are in [docs/Desktop.md](docs/Desktop.md). Executed checks and remaining manual acceptance are recorded in [docs/Desktop_Validation.md](docs/Desktop_Validation.md).

Open `tests/presets-browser.html` through the same static server to run the native IndexedDB regression tests for Blob persistence, migration, replacement/deletion and transaction failures. The page reports PASS/FAIL without installing test dependencies.

Product requirements live in `docs/Project_Spec.md`. Visual and interaction decisions live in `DESIGN.md`. Preset persistence and validation live in `fitpic-presets.js`; tests cover settings-only snapshots, persistence, invalid data, storage failures and translations.
