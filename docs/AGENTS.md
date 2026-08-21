# Project

FitPic là web tool giúp đưa ảnh về đúng định dạng social media mà không crop. Yêu cầu sản phẩm và phạm vi nằm trong `Project_Spec.md`.

# Tech

- Static client-side web app.
- Target deployment: Cloudflare Pages.
- Image processing must stay entirely in the browser.
- No backend, account system, server-side image processing, storage, or paid API.
- Exact frontend framework and implementation details are not decided yet.

# Commands

Project chưa được khởi tạo. Bổ sung run, test và build commands sau khi chọn implementation trong bước Implement.

# Decisions

- Keep image processing client-side to satisfy the privacy requirement and zero-cost constraint.
- Platform / placement is the user-facing input; aspect ratio is derived internally.
- Foreground rendering uses center + contain + maximum possible size, never crop.
- Blur Original is the default background.
- Keep V1 as a focused single-image flow instead of an image editor.

# Known Issues

- Platform image recommendations can change over time. Keep the platform-to-ratio mapping centralized and easy to update.
- Large source images may have memory/performance implications in the browser; verify this during implementation before adding complexity.

# Before completing a task
- Run the relevant checks.
- Fix failures caused by the change.
- Review the changed behavior and diff.
- Report anything that could not be verified.
