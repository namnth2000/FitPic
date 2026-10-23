# Desktop validation - 2026-10-23

Executed locally on Windows x64 with Rust MSVC 1.98.1 and WebView2 155.0.4283.62. No tag or GitHub Release was pushed during implementation.

## Passed

- `npm run check` and `npm run build`: syntax validation and 18 static deployment assets in `dist/`.
- `npm test`: 28 tests passed. Covers existing geometry/presets/i18n plus byte-identical static output, stale-output cleanup, native bridge serialization, Cancel, partial failures and release version validation.
- `npm run desktop:check`, `npm run desktop:test` and `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`: passed; one Rust export-input validation test passed.
- `node scripts/check-desktop-version.cjs desktop-v1.0.0`: package and Cargo versions agree. Unit tests also cover mismatches and prerelease detection.
- Edge's real IndexedDB browser suite: six cases passed for Blob bytes, metadata, migration, rename, replacement/deletion, aborts and empty-collection behavior.
- Browser smoke tests against both repository root and `dist/`: upload two PNG fixtures, navigate previews, exercise all nine placement choices and all backgrounds, retain crop pixels across navigation, enable Balance/Radius, save/reload/apply an Image preset, then download two JPGs. Output dimensions match the selected preview ratio with a 2160px long edge. No JavaScript runtime errors were observed. Editing and export were tested with network emulation offline after local assets loaded.
- Release executable: native upload, preview, Crop, layout controls and Image preset restoration passed. A full reload under offline network emulation succeeded from embedded `http://tauri.localhost/` assets.
- Native Windows Save dialogs: two batch JPGs were saved. Cancel at the first dialog reported zero saved. A separate batch saved its first image to the test directory, then cancelled at the second dialog; feedback correctly reported one saved. The actual saved JPG decoded to 1215x2160, with 34,408 bytes.
- Full process exit/restart: a copy of the release executable restored the same Image preset and its 8,046-byte background Blob, original filename, Balance and Radius settings. Source images were selected again. The restart/reload/apply path also worked offline.
- Native window and dialog screenshots were inspected. The existing FitPic UI, native titlebar/icon, JPEG filter, numbered Save title and disabled parent window were present. ICO entries put the 256px image first for high DPI.

- `npm run desktop:build`: completed successfully with one NSIS bundle, `FitPic_1.0.0_x64-setup.exe`, 219,684,250 bytes (209.51 MiB), including the offline WebView2 installer. SHA-256: `F94FA146B3F0ACF2737B50F9E6DF272544B4733BC7E2429ADDD8A4A473A70F34`.
- `npm run desktop:dev -- --no-watch`: launched successfully using Tauri's built-in server at `http://127.0.0.1:1430/`. The native bridge and two-image upload/preview worked; no JavaScript or CSP errors were observed after reload.

The first installer attempt was blocked by the sandbox's network policy while fetching NSIS. A later attempt conflicted with the running test executable. The final successful build ran with that executable closed and the downloaded packaging tools available. Repeating an already patched incremental Tauri build also emitted a bundle-type warning; this project has no updater plugin, and installer generation completed successfully.

## Evidence

- [Web output preview](evidence/desktop/web-preview.png)
- [Native release preview after saving one file and cancelling the next](evidence/desktop/native-preview.png)
- [Native preset restored after process restart](evidence/desktop/native-reopened.png)

The synthetic source and background fixtures contain only colored rectangles. Test screenshots do not include the user's source photos or native file-dialog folder listings.

## Remaining manual acceptance

- Install/upgrade/uninstall on a clean Windows machine, including one without WebView2, and verify the offline runtime installation there.
- Live GitHub Actions execution and GitHub Release upload after a maintainer pushes the intended `desktop-v*` tag.
- Physical iPhone/iPad share-sheet behavior and production Cloudflare Pages deployment. Their application paths were preserved; this run did not publish the Web app or exercise an iOS device.
- Actual disk-full/access-denied behavior and overwrite confirmation remain manual checks. The bridge's partial-error handling is unit-tested.

No Windows code-signing certificate or auto-updater was added. See [Desktop.md](Desktop.md) for development, build, release and the full manual checklist.
