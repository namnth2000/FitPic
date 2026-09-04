# Project

FitPic là web tool giúp đưa một hoặc nhiều ảnh về đúng định dạng social media mà không crop. Yêu cầu sản phẩm và phạm vi nằm trong `docs/Project_Spec.md`. Quyết định design nằm trong `DESIGN.md`.

# Tech

- Static client-side web app.
- Target deployment: Cloudflare Pages.
- Image processing must stay entirely in the browser.
- No backend, account system, server-side image processing, storage, or paid API.
- Keep runtime dependency-free unless a current product requirement cannot be solved simply without one.

# Commands

- `npm run check`: kiểm tra cú pháp JavaScript của app client-side.
- `npm test`: chạy unit test cho mapping platform, output ratio và geometry contain/cover.
- `npm run build`: validation syntax cho static deployment, không có bundling.
- Deploy toàn bộ repository root lên Cloudflare Pages.

# Decisions

- Keep image processing client-side to satisfy the privacy requirement and zero-cost constraint.
- Platform / placement remains the user-facing concept, but the selector visually emphasizes aspect ratio with the social-network icon inside each compact tile.
- Supported ratios are centralized in `fitpic-core.js`.
- Foreground rendering uses center + contain + maximum possible size, never crop.
- Blur Original is the default background.
- Custom background uses a compact palette based on the StyleSpec color set, plus native color and HEX input.
- Multiple uploaded images share the same selected ratio and background. Preview shows the first image and download exports every selected image as an individual JPG.
- Do not add ZIP generation or a new dependency only for batch export unless real usage proves separate browser downloads are insufficient.
- Preview canvas uses a 960px long edge. Download renders each composition again at a 2160px long edge.
- Output examples at 2160px long edge: 1:1 = 2160×2160, 4:5 = 1728×2160, 9:16 = 1215×2160, 16:9 = 2160×1215, 4:3 = 2160×1620, 3:4 = 1620×2160.
- Theme defaults to `prefers-color-scheme`; an explicit user choice is stored locally under `fitpic-theme`.
- Production URL is `https://fitpic.namnth.com/`.

# Known Issues

- Platform image recommendations can change over time. Keep platform-to-ratio mapping centralized and easy to update.
- Large batches and large source images can increase browser memory usage. Prefer simple sequential decode/export before introducing optimization infrastructure.
- Browsers can ask the user to allow multiple downloads when exporting a batch.

# Before completing a task

- Run the relevant checks.
- Fix failures caused by the change.
- Review the changed behavior and diff.
- Report anything that could not be verified.
