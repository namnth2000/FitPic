# Project Spec

# 1. Tổng quan

- **Tên sản phẩm:** FitPic
- **Mô tả ngắn:** Công cụ web giúp người dùng đưa một hoặc nhiều ảnh về đúng tỉ lệ phù hợp với nơi muốn đăng trên mạng xã hội mà không crop hoặc làm mất nội dung ảnh.
- **Vấn đề:** Một ảnh có thể phù hợp với nội dung nhưng không phù hợp với tỉ lệ hiển thị của Facebook, Instagram, TikTok hoặc YouTube. Crop ảnh có thể làm mất phần nội dung người dùng muốn giữ, trong khi việc tự chỉnh canvas và background bằng công cụ chỉnh ảnh thường mất thêm thao tác. Khi có nhiều ảnh cùng cần một định dạng, lặp lại quy trình từng ảnh cũng gây tốn thời gian.
- **Người dùng mục tiêu:** Người dùng mạng xã hội, người bán hàng online và người sáng tạo nội dung cần chuẩn bị ảnh nhanh để đăng lên các nền tảng phổ biến.
- **Giải pháp chính:** Người dùng tải một hoặc nhiều ảnh lên, chọn placement / tỉ lệ và background. FitPic giữ toàn bộ ảnh, căn giữa ảnh trong khung, preview ảnh đầu tiên và tạo file đầu ra cho toàn bộ batch ngay trên thiết bị.
- **Mục tiêu của phiên bản này:** Giữ luồng đơn giản nhưng mở rộng đủ để xử lý batch và thêm các tỉ lệ/background thường dùng: **Upload ảnh -> Chọn tỉ lệ / placement -> Chọn background -> Preview -> Download**.

# 2. Phạm vi sản phẩm

## Luồng sử dụng chính

1. Người dùng mở FitPic và tải một hoặc nhiều ảnh từ thiết bị lên.
2. FitPic đọc ảnh cục bộ và hiển thị preview của ảnh hợp lệ đầu tiên.
3. Người dùng chọn placement / tỉ lệ bằng các tile có icon mạng xã hội và tỉ lệ hiển thị bên dưới.
4. Người dùng chọn Blur Original, White, Black hoặc Custom background.
5. Nếu chọn Custom, người dùng có thể chọn màu preset, dùng system color picker hoặc nhập HEX.
6. FitPic cập nhật preview theo tỉ lệ và background đã chọn mà không crop ảnh.
7. Nếu người dùng chọn nhiều ảnh, cùng một tỉ lệ và background được áp dụng cho toàn bộ batch.
8. Người dùng tải một ảnh hoặc toàn bộ batch xuống thiết bị. Mỗi ảnh trong batch được xuất thành một file JPG riêng.

## Yêu cầu chức năng

### 1. Upload ảnh

- Người dùng có thể chọn một hoặc nhiều ảnh từ thiết bị trong cùng một lần chọn file.
- Hỗ trợ JPG, PNG, WebP và GIF như hiện tại.
- Sau khi có ít nhất một ảnh hợp lệ, FitPic hiển thị preview và cho phép tiếp tục chỉnh định dạng.
- Nếu một số file không hợp lệ hoặc không đọc được, FitPic bỏ qua các file đó và thông báo số lượng bị bỏ qua.
- Nếu không có file hợp lệ nào, FitPic phải thông báo lỗi rõ ràng và không thay thế batch đang dùng bằng dữ liệu hỏng.

### 2. Chọn platform / placement và tỉ lệ

Người dùng không nhập kích thước pixel thủ công. FitPic cung cấp các lựa chọn sau:

- Instagram Feed -> `4:5`
- Instagram Square -> `1:1`
- Instagram Story / Reels -> `9:16`
- TikTok -> `9:16`
- Facebook Feed -> `4:5`
- YouTube Thumbnail -> `16:9`
- YouTube 4:3 -> `4:3`
- YouTube 3:4 -> `3:4`
- YouTube Shorts -> `9:16`

UI của khu chọn tỉ lệ:

- Mỗi lựa chọn là một tile nhỏ.
- Icon mạng xã hội nằm trong khung tile.
- Tỉ lệ nằm ngay bên dưới tile.
- Tên đầy đủ của placement vẫn phải có trong accessible label.
- Không thêm editor toolbar phức tạp.

### 3. Fit ảnh vào khung

- Ảnh gốc luôn giữ nguyên aspect ratio.
- FitPic không crop ảnh.
- Ảnh được căn giữa theo cả chiều ngang và chiều dọc.
- Ảnh được phóng lớn tối đa cho đến khi một chiều chạm cạnh canvas.
- Không chủ động tạo margin hoặc padding cố định ở cả bốn cạnh.
- Phần canvas không được ảnh gốc phủ sẽ dùng background đã chọn.
- Nếu ảnh gốc đã có cùng aspect ratio với khung đích, ảnh phủ toàn bộ canvas và background không xuất hiện.

### 4. Chọn background

Có bốn lựa chọn:

- **Blur Original:** dùng chính ảnh gốc làm background và làm mờ. Đây là lựa chọn mặc định.
- **White:** nền trắng.
- **Black:** nền đen.
- **Custom:** màu nền do người dùng chọn.

Custom background:

- Có palette preset nhỏ dựa trên color set hiện có của StyleSpec.
- Có system color picker.
- Có ô nhập HEX.
- Màu custom phải được phản ánh ngay trong preview và được dùng khi export.

### 5. Batch processing

- Cùng một platform / tỉ lệ và background áp dụng cho tất cả ảnh trong batch.
- Preview chỉ hiển thị ảnh hợp lệ đầu tiên để giữ giao diện gọn.
- UI phải nói rõ preview đang đại diện cho batch và cùng thiết lập sẽ áp dụng cho tất cả ảnh.
- Download button hiển thị số ảnh khi batch có nhiều hơn một ảnh.
- Mỗi ảnh được render riêng ở độ phân giải export và tải xuống thành JPG riêng.
- Không tạo ZIP trong phiên bản này.
- Không có per-image ratio, per-image background, reorder hoặc thumbnail manager trong phiên bản này.

### 6. Preview

- Preview phải thể hiện đúng composition của ảnh đầu tiên trong batch, gồm aspect ratio, vị trí ảnh và background.
- Preview được cập nhật khi người dùng đổi platform / placement, tỉ lệ hoặc background.
- Preview không được làm thay đổi ảnh gốc của người dùng.

### 7. Download

- Người dùng có thể tải ảnh kết quả sau khi đã upload ít nhất một ảnh hợp lệ.
- File tải xuống phải giữ đúng aspect ratio đang được chọn và đúng composition tương ứng với preview.
- Với batch, FitPic tạo một file JPG cho từng ảnh.
- Quá trình download không yêu cầu tài khoản, đăng nhập hoặc upload ảnh lên server.
- Trình duyệt có thể hỏi người dùng cho phép tải nhiều file khi batch có nhiều ảnh.

## Quy tắc sản phẩm

- Giá trị chính của FitPic là đưa ảnh về đúng định dạng social media mà vẫn giữ toàn bộ ảnh.
- Người dùng chọn placement / tỉ lệ bằng các lựa chọn rõ ràng thay vì nhập pixel thủ công.
- FitPic ưu tiên hành vi tự động và dễ hiểu hơn các tùy chỉnh chỉnh ảnh nâng cao.
- Blur Original là background mặc định.
- Ảnh foreground luôn sử dụng cơ chế center + contain + maximum possible size.
- Không crop ảnh tự động hoặc thủ công.
- Không có margin hoặc padding thẩm mỹ mặc định quanh ảnh.
- Batch dùng chung một bộ thiết lập, không biến FitPic thành asset manager.
- Ảnh của người dùng chỉ được xử lý trên thiết bị và không được gửi lên hoặc lưu trên server.

## Ngoài phạm vi

- Kéo ảnh để thay đổi vị trí.
- Thay đổi thủ công kích thước foreground.
- Padding hoặc margin tùy chỉnh.
- Crop ảnh.
- Image editor với text, filter, sticker, watermark hoặc các công cụ chỉnh sửa khác.
- Per-image settings trong batch.
- Thumbnail browser, reorder hoặc quản lý asset.
- ZIP export.
- Xuất một ảnh thành nhiều social sizes cùng lúc.
- Tài khoản người dùng.
- Lịch sử xử lý ảnh.
- Backend lưu trữ hoặc xử lý ảnh.
- API trả phí.

# 3. UI/UX

- **Nền tảng và thiết bị:** Web, sử dụng được trên desktop và mobile.
- **Màn hình hoặc khu vực chính:** Header với wordmark FitPic và nút đổi chủ đề; mô tả ngắn; khu vực upload; khu vực chọn tỉ lệ / placement; khu vực chọn background; custom palette khi cần; preview; nút download.
- **Bố cục và thao tác chính:** Tập trung vào một luồng ngắn trên cùng một trang. Không chuyển sang editor phức tạp.
- **Khu chọn tỉ lệ:** Pattern compact giống hướng tham khảo CapCut - icon mạng xã hội trong khung, ratio ở dưới, trạng thái selected rõ ràng.
- **Custom color:** Hiển thị inline và gọn trong panel background, không dùng modal lớn.
- **Trạng thái cần hiển thị:**
  - Chưa có ảnh: hiển thị khu vực upload rõ ràng.
  - Đã có một ảnh: hiển thị preview và các lựa chọn cần thiết.
  - Đã có nhiều ảnh: hiển thị số lượng, nói rõ preview dùng ảnh đầu tiên và cùng thiết lập áp dụng cho tất cả.
  - Đang đọc/export ảnh: phản hồi trạng thái ngắn gọn.
  - File không hợp lệ hoặc không đọc được: hiển thị lỗi rõ ràng và cho phép chọn lại ảnh.
  - Sẵn sàng tải xuống: nút Download khả dụng và có count khi batch.
- **Brand và tài nguyên:**
  - Logo: wordmark chữ **FitPic**.
  - Brand color: `#047857`, chỉ dùng làm màu nhấn.
  - Hướng thiết kế: minimal, calm, functional, image-first; dùng sans-serif dễ đọc.
  - Hỗ trợ giao diện sáng và tối. Lần đầu mở trang theo preference của thiết bị hoặc trình duyệt; người dùng có thể chuyển theme bằng nút icon nội bộ.
  - Design source of truth chi tiết nằm trong `DESIGN.md`.

# 4. Dữ liệu và quyền riêng tư

- **Dữ liệu đầu vào:** Một hoặc nhiều ảnh do người dùng chọn từ thiết bị, cùng lựa chọn platform / tỉ lệ, background và custom color nếu có.
- **Dữ liệu đầu ra:** Một hoặc nhiều file JPG mới theo aspect ratio đã chọn, giữ toàn bộ nội dung ảnh gốc và sử dụng background tương ứng.
- **Lưu trữ:** Không lưu ảnh hoặc lịch sử xử lý trên backend.
- **Tích hợp bên ngoài:** Không có API hoặc dịch vụ trả phí.
- **Yêu cầu quyền riêng tư hoặc bảo mật:** Ảnh phải được xử lý trên thiết bị của người dùng, không upload hoặc gửi nội dung ảnh tới server. Không yêu cầu tài khoản hoặc đăng nhập.

# 5. Tiêu chí hoàn thành

- [ ] Người dùng có thể upload một hoặc nhiều ảnh hợp lệ.
- [ ] Nếu batch chứa file lỗi, các file hợp lệ vẫn dùng được và số file bị bỏ qua được thông báo.
- [ ] Preview hiển thị ảnh hợp lệ đầu tiên và nói rõ cùng thiết lập áp dụng cho batch.
- [ ] Có các lựa chọn mới Instagram `1:1`, YouTube `4:3` và YouTube `3:4`.
- [ ] Khu chọn tỉ lệ hiển thị icon mạng xã hội trong tile và ratio bên dưới.
- [ ] Tất cả platform / placement áp dụng đúng aspect ratio được định nghĩa trong `fitpic-core.js`.
- [ ] Ảnh foreground luôn giữ nguyên aspect ratio, được căn giữa, phóng lớn tối đa trong khung và không bị crop.
- [ ] Blur Original, White, Black và Custom background đều hoạt động.
- [ ] Custom background hỗ trợ preset palette, system color picker và HEX.
- [ ] Preview cập nhật đúng khi thay đổi tỉ lệ hoặc background.
- [ ] Với batch, cùng một tỉ lệ và background áp dụng cho tất cả ảnh.
- [ ] Download một ảnh vẫn hoạt động.
- [ ] Download batch tạo một JPG riêng cho từng ảnh với đúng tỉ lệ và background.
- [ ] Ảnh được xử lý trên thiết bị và không bị upload hoặc lưu trên server.
- [ ] Không yêu cầu tài khoản, đăng nhập hoặc backend.
- [ ] Giao diện sử dụng được trên desktop và mobile.
- [ ] Không thêm crop, reposition, padding control, per-image editor, ZIP export hoặc image-editor features ngoài phạm vi.
