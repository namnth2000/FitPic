# Project

FitPic là web tool giúp đưa ảnh về đúng định dạng social media mà không crop. Yêu cầu sản phẩm và phạm vi nằm trong `Project_Spec.md`.

# Tech

- Static client-side web app.
- Target deployment: Cloudflare Pages.
- Image processing must stay entirely in the browser.
- No backend, account system, server-side image processing, storage, or paid API.
- Exact frontend framework and implementation details are not decided yet.

# Commands

- `npm run check`: kiểm tra cú pháp JavaScript của app client-side.
- `npm test`: chạy unit test cho mapping platform, output ratio và geometry contain/cover.
- `npm run build`: validation syntax cho static deployment (không có bundling).
- Deploy toàn bộ repository root lên Cloudflare Pages; không có dependency runtime hoặc backend.

# Decisions

- Keep image processing client-side to satisfy the privacy requirement and zero-cost constraint.
- Platform / placement is the user-facing input; aspect ratio is derived internally.
- Foreground rendering uses center + contain + maximum possible size, never crop.
- Blur Original is the default background.
- Keep V1 as a focused single-image flow instead of an image editor.
- Mapping platform-to-ratio, kích thước canvas và geometry contain/cover nằm trong `fitpic-core.js` để test và cập nhật tập trung.
- Output JPG dùng cạnh dài 2160px: 4:5 = 1728×2160, 9:16 = 1215×2160, 16:9 = 2160×1215.

# Known Issues

- Platform image recommendations can change over time. Keep the platform-to-ratio mapping centralized and easy to update.
- Large source images may have memory/performance implications in the browser; verify this during implementation before adding complexity.
- Preview canvas dùng cạnh dài 960px; download render lại composition ở 2160px để tránh dùng preview-resolution làm output.
- Theme mặc định dùng `prefers-color-scheme`; lựa chọn sáng/tối rõ ràng của người dùng được lưu cục bộ dưới khóa `fitpic-theme`.

# Before completing a task
- Run the relevant checks.
- Fix failures caused by the change.
- Review the changed behavior and diff.
- Report anything that could not be verified.
