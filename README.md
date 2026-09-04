# FitPic

Static, client-side tool to format one or multiple images for common social placements.

FitPic supports Instagram, TikTok, Facebook and YouTube aspect ratios, lets users keep the full image with blur / color / image-based backgrounds, add balanced padding and rounded foreground corners, or switch to Crop. It previews every image in a batch and exports each result locally in the browser.

Image-based background uses one user-selected local image as the shared background for the whole batch. The background is centered and cover-fitted to the target canvas while the foreground image keeps the existing contain behavior.

Balance adds equal padding on all four sides for Blur, White, Black, Custom and Image-based modes. Radius can round the foreground image while Balance is enabled. Crop keeps its existing full-canvas behavior and ignores both layout controls.

## Local checks

Requires Node.js 18 or newer.

```powershell
npm run check
npm test
npm run build
```

For a local preview, serve this folder with any static HTTP server. The app has no runtime dependencies and is ready to deploy as the repository root on Cloudflare Pages.

Product requirements live in `docs/Project_Spec.md`. Visual and interaction decisions live in `DESIGN.md`.
