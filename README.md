# FitPic

Static, client-side tool to format one or multiple images for common social placements without cropping them.

FitPic supports Instagram, TikTok, Facebook and YouTube aspect ratios, applies one shared background setting to the selected batch, previews the first image, and exports each result locally in the browser.

## Local checks

Requires Node.js 18 or newer.

```powershell
npm run check
npm test
npm run build
```

For a local preview, serve this folder with any static HTTP server. The app has no runtime dependencies and is ready to deploy as the repository root on Cloudflare Pages.

Product requirements live in `docs/Project_Spec.md`. Visual and interaction decisions live in `DESIGN.md`.
