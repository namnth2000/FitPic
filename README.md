# FitPic

Static, client-side tool to format one or multiple images for common social placements.

FitPic supports Instagram, TikTok, Facebook and YouTube aspect ratios. Users can preserve the whole image with blur/color backgrounds or choose Crop to fill the frame and drag each photo to the preferred position. Batch previews can be browsed with Previous / Next controls before exporting locally in the browser.

## Local checks

Requires Node.js 18 or newer.

```powershell
npm run check
npm test
npm run build
```

For a local preview, serve this folder with any static HTTP server. The app has no runtime dependencies and is ready to deploy as the repository root on Cloudflare Pages.

Product requirements live in `docs/Project_Spec.md`. Visual and interaction decisions live in `DESIGN.md`.
