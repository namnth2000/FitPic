# Project

FitPic là web tool giúp đưa một hoặc nhiều ảnh về đúng định dạng social media. Yêu cầu sản phẩm và phạm vi nằm trong `docs/Project_Spec.md`. Quyết định design nằm trong `DESIGN.md`.

# Tech

- Static client-side web app.
- Target deployment: Cloudflare Pages.
- Image processing must stay entirely in the browser.
- No backend, account system, server-side image processing, storage, or paid API.
- Keep runtime dependency-free unless a current product requirement cannot be solved simply without one.

# Commands

- `npm run check`: kiểm tra cú pháp JavaScript của app client-side.
- `npm test`: chạy unit test cho mapping platform, background order, output ratio và geometry contain/cover/crop.
- `npm run build`: validation syntax cho static deployment, không có bundling.
- Deploy toàn bộ repository root lên Cloudflare Pages.

# Decisions

- Keep image processing client-side to satisfy the privacy requirement and zero-cost constraint.
- Platform / placement remains the user-facing concept, but the selector visually emphasizes aspect ratio with the social-network icon inside each compact tile.
- Supported ratios and fill/background modes are centralized in `fitpic-core.js`.
- Blur Original is the default background.
- Custom background uses the curated palette plus native color and HEX input.
- Image-based sits after Custom and before Crop. It uses one locally selected background image shared across the batch. The background uses centered cover; foreground images keep center + contain + maximum possible size.
- Image-based must not upload the background image anywhere. Revoke its object URL when replaced or when the page unloads.
- Export is disabled while Image-based is selected without a valid background image.
- Crop fills the canvas with the source image, starts centered and stores normalized `cropX` / `cropY` separately per source image.
- Multiple uploaded images share the same selected ratio and fill/background mode. Preview navigation can inspect each image; Crop position remains per-image.
- On iPhone/iPad, prefer the Web Share API with generated JPG `File` objects so one native share sheet receives the full batch.
- Desktop and browsers without file sharing keep the individual-download fallback.
- If Safari loses user activation while export files are being prepared, cache prepared files so the next tap can open `navigator.share()` immediately.
- Do not add ZIP generation or a new dependency only for batch export unless real usage proves the existing paths insufficient.
- Preview canvas uses a 960px long edge. Export renders each composition again at a 2160px long edge.
- Output examples at 2160px long edge: 1:1 = 2160×2160, 4:5 = 1728×2160, 9:16 = 1215×2160, 16:9 = 2160×1215, 4:3 = 2160×1620, 3:4 = 1620×2160.
- Theme defaults to `prefers-color-scheme`; an explicit user choice is stored locally under `fitpic-theme`.
- Production URL is `https://fitpic.namnth.com/`.

# Known Issues

- Platform image recommendations can change over time. Keep platform-to-ratio mapping centralized and easy to update.
- Large batches and large source/background images can increase browser memory usage. Prefer simple sequential decode/export before introducing optimization infrastructure.
- Web Share file support varies by browser. Keep the existing individual-download fallback for unsupported environments.
- iOS still requires the user to choose the final action in the native share sheet; a web app cannot silently write directly into Photos.

# Before completing a task

- Run the relevant checks.
- Fix failures caused by the change.
- Review the changed behavior and diff.
- Report anything that could not be verified.
