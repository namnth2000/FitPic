# FitPic

Static, client-side tool to format one or multiple images for common social placements.

FitPic supports Instagram, TikTok, Facebook and YouTube aspect ratios, lets users keep the full image with blur / color / image-based backgrounds, add balanced padding and rounded foreground corners, or switch to Crop. It previews every image in a batch and exports each result locally in the browser.

Image-based background uses one user-selected local image as the shared background for the whole batch. The background is centered and cover-fitted to the target canvas while the foreground image keeps the existing contain behavior.

Balance adds equal padding on all four sides for Blur, White, Black, Custom and Image-based modes. Radius can round the foreground image while Balance is enabled. Crop keeps its existing full-canvas behavior and ignores both layout controls.

## Saved presets

After uploading an image, use **Save preset** above the ratio selector to name and save the current placement / ratio, background mode, custom color, Balance padding and Radius settings. Select a saved preset to apply it to the whole batch, including a newly uploaded batch.

- Adjustments never overwrite a preset automatically. Use **Update preset** to replace its settings, **Save preset** to create another one, or **Reapply** to restore its saved settings.
- Rename and delete actions are available for the selected preset. Deleting a preset keeps the current image settings.
- Presets survive page reloads in the same browser using local storage. They do not sync across browsers or devices, and clearing site data removes them.
- Presets contain settings only, not source images, background files or per-image crop positions. An Image-based preset uses the background already selected in the current session; after reopening the page, choose a background again before exporting.
- If browser storage is blocked, full or unreadable, FitPic shows a message and image editing remains available. A failed preset write does not replace the existing preset list.

## Local checks

Requires Node.js 18 or newer.

```powershell
npm run check
npm test
npm run build
```

For a local preview, serve this folder with any static HTTP server. The app has no runtime dependencies and is ready to deploy as the repository root on Cloudflare Pages.

Product requirements live in `docs/Project_Spec.md`. Visual and interaction decisions live in `DESIGN.md`. Preset persistence and validation live in `fitpic-presets.js`; tests cover settings-only snapshots, persistence, invalid data, storage failures and translations.
