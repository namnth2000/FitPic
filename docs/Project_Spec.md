# Project Spec

# 1. Tổng quan

- **Tên sản phẩm:** FitPic
- **Mô tả ngắn:** Công cụ web giúp người dùng đưa một hoặc nhiều ảnh về đúng tỉ lệ phù hợp với nơi muốn đăng trên mạng xã hội. Người dùng có thể giữ trọn ảnh với background hoặc chọn Crop để phủ kín khung và chọn vùng giữ lại.
- **Vấn đề:** Một ảnh có thể phù hợp với nội dung nhưng không phù hợp với tỉ lệ hiển thị của Facebook, Instagram, TikTok hoặc YouTube. Có lúc người dùng muốn giữ trọn nội dung bằng background; có lúc họ muốn ảnh phủ kín khung và chủ động chọn vùng bị crop. Khi có nhiều ảnh cùng cần một định dạng, lặp lại quy trình từng ảnh cũng gây tốn thời gian.
- **Người dùng mục tiêu:** Người dùng mạng xã hội, người bán hàng online và người sáng tạo nội dung cần chuẩn bị ảnh nhanh để đăng lên các nền tảng phổ biến.
- **Giải pháp chính:** Người dùng tải một hoặc nhiều ảnh lên, chọn placement / tỉ lệ và cách lấp khung. FitPic preview từng ảnh trong batch. Với các background thông thường FitPic giữ trọn ảnh; với Crop, ảnh phủ kín canvas và người dùng kéo để điều chỉnh vùng giữ lại cho từng ảnh.
- **Mục tiêu của phiên bản này:** Giữ luồng đơn giản: **Upload ảnh -> Chọn tỉ lệ / placement -> Chọn background hoặc Crop -> Xem từng preview -> Save / Download**.

# 2. Phạm vi sản phẩm

## Luồng sử dụng chính

1. Người dùng mở FitPic và tải một hoặc nhiều ảnh từ thiết bị lên.
2. FitPic đọc ảnh cục bộ và hiển thị preview của ảnh hợp lệ đầu tiên.
3. Nếu có nhiều ảnh, người dùng dùng mũi tên Previous / Next để xem từng preview.
4. Người dùng chọn placement / tỉ lệ bằng các tile có icon mạng xã hội và tỉ lệ hiển thị bên dưới.
5. Người dùng chọn Blur Original, White, Black, Custom hoặc Crop.
6. Nếu chọn Custom, người dùng có thể chọn màu preset, dùng system color picker hoặc nhập HEX.
7. Nếu chọn Crop, ảnh tự cover toàn bộ canvas, mặc định căn giữa và có thể kéo để điều chỉnh vùng giữ lại. Crop position được lưu riêng cho từng ảnh.
8. Cùng một tỉ lệ và fill mode áp dụng cho toàn bộ batch.
9. FitPic tạo một JPG riêng cho từng ảnh. Trên iPhone/iPad hỗ trợ file sharing, FitPic gửi toàn bộ các file vào một native share sheet. Trên desktop hoặc browser không hỗ trợ, FitPic dùng download fallback.

## Yêu cầu chức năng

### 1. Upload ảnh

- Người dùng có thể chọn một hoặc nhiều ảnh từ thiết bị trong cùng một lần chọn file.
- Hỗ trợ JPG, PNG, WebP và GIF.
- Sau khi có ít nhất một ảnh hợp lệ, FitPic hiển thị preview và cho phép tiếp tục chỉnh định dạng.
- Nếu một số file không hợp lệ hoặc không đọc được, FitPic bỏ qua các file đó và thông báo số lượng bị bỏ qua.
- Nếu không có file hợp lệ nào, FitPic phải thông báo lỗi rõ ràng và không thay thế batch đang dùng bằng dữ liệu hỏng.
- Batch mới reset preview về ảnh đầu tiên và reset crop position của mọi ảnh về center.

### 2. Chọn platform / placement và tỉ lệ

Người dùng không nhập kích thước pixel thủ công. FitPic cung cấp:

- Instagram Feed -> `4:5`
- Instagram Square -> `1:1`
- Instagram Story / Reels -> `9:16`
- TikTok -> `9:16`
- Facebook Feed -> `4:5`
- YouTube Thumbnail -> `16:9`
- YouTube 4:3 -> `4:3`
- YouTube 3:4 -> `3:4`
- YouTube Shorts -> `9:16`

UI:

- Mỗi lựa chọn là một tile nhỏ.
- Icon mạng xã hội nằm trong khung tile.
- Tỉ lệ nằm ngay bên dưới tile.
- Tên đầy đủ của placement vẫn phải có trong accessible label.
- Không thêm editor toolbar phức tạp.

### 3. Giữ trọn ảnh với background

Áp dụng cho Blur Original, White, Black và Custom:

- Ảnh gốc luôn giữ nguyên aspect ratio.
- Ảnh foreground không bị crop.
- Ảnh được căn giữa theo cả chiều ngang và chiều dọc.
- Ảnh được phóng lớn tối đa cho đến khi một chiều chạm cạnh canvas.
- Không chủ động tạo margin hoặc padding cố định ở cả bốn cạnh.
- Phần canvas không được ảnh gốc phủ sẽ dùng background đã chọn.
- Nếu ảnh gốc đã có cùng aspect ratio với khung đích, ảnh phủ toàn bộ canvas và background không xuất hiện.

### 4. Fill mode

Có năm lựa chọn:

- **Blur Original:** dùng chính ảnh gốc làm background và làm mờ. Đây là lựa chọn mặc định.
- **White:** nền trắng.
- **Black:** nền đen.
- **Custom:** màu nền do người dùng chọn.
- **Crop:** ảnh gốc phủ kín toàn bộ canvas và phần dư nằm ngoài canvas bị crop.

Custom:

- Có palette preset nhỏ với các màu phổ biến, sắp theo nhóm sáng/pastel, màu tươi và màu đậm.
- Có system color picker.
- Có ô nhập HEX.
- Màu custom phải được phản ánh ngay trong preview và export.

Crop:

- Scale ảnh theo cover để canvas luôn được phủ kín.
- Mặc định `cropX = 0.5`, `cropY = 0.5`.
- Người dùng kéo trực tiếp ảnh trong preview bằng mouse hoặc touch.
- Crop position dùng normalized coordinates trong `[0, 1]`, không lưu pixel preview.
- Movement phải clamp để không lộ khoảng trống trong canvas.
- Hiện rule-of-thirds grid nhẹ trong lúc drag.
- Có nút `Đặt lại` để đưa ảnh hiện tại về center.
- Không có zoom, rotation hoặc freeform crop rectangle trong version này.

### 5. Batch processing

- Cùng một platform / tỉ lệ và fill mode áp dụng cho tất cả ảnh trong batch.
- Crop position được lưu riêng cho từng ảnh vì mỗi ảnh có framing khác nhau.
- Save / Download button hiển thị số ảnh khi batch có nhiều hơn một ảnh.
- Mỗi ảnh được render riêng ở độ phân giải export và tạo thành một JPG riêng.
- Trên iPhone/iPad có Web Share file support, toàn bộ JPG được truyền vào một lần `navigator.share({ files })`.
- Nếu việc chuẩn bị file làm Safari mất transient user activation, FitPic giữ tạm các file đã render để lần tap tiếp theo có thể mở share sheet ngay.
- Trên desktop hoặc browser không hỗ trợ chia sẻ file, FitPic giữ individual-download fallback.
- Không tạo ZIP trong phiên bản này.
- Không có per-image ratio, per-image background, reorder hoặc thumbnail manager.

### 6. Preview và điều hướng batch

- Preview phải thể hiện đúng composition của ảnh hiện tại, gồm aspect ratio, vị trí ảnh, background hoặc crop.
- Batch có nút Previous và Next cùng counter `current / total`.
- Khi chỉ có một ảnh, ẩn navigation.
- Previous disabled ở ảnh đầu; Next disabled ở ảnh cuối.
- `ArrowLeft` / `ArrowRight` có thể điều hướng khi focus không nằm trong form control.
- Chuyển preview không thay đổi output settings.
- Trong Crop, drag chỉ cập nhật crop position của ảnh đang xem.
- Preview không được làm thay đổi ảnh gốc.

### 7. Save / Download

- Người dùng có thể lưu hoặc tải ảnh kết quả sau khi đã upload ít nhất một ảnh hợp lệ.
- File đầu ra phải giữ đúng aspect ratio và composition tương ứng với state của từng ảnh.
- Với Crop, export phải dùng đúng normalized crop position của từng ảnh, không dùng pixel offset của preview.
- Với batch, FitPic tạo một file JPG cho từng ảnh.
- Trên iPhone/iPad hỗ trợ Web Share, nút dùng wording `Lưu ảnh` / `Lưu N ảnh` và mở native share sheet.
- FitPic không được tuyên bố đã lưu vào Photos chỉ vì share sheet đã mở.
- Web app không tự ghi ảnh âm thầm vào Photos; hành động cuối cùng vẫn cần người dùng xác nhận trong giao diện hệ thống của iOS.
- Trên browser không hỗ trợ file sharing, FitPic dùng download fallback.
- Quá trình save / download không yêu cầu tài khoản, đăng nhập hoặc upload ảnh lên server.

## Quy tắc sản phẩm

- FitPic giải quyết việc đưa ảnh về đúng định dạng social media, không cố trở thành photo editor đầy đủ.
- Người dùng chọn placement / tỉ lệ bằng các lựa chọn rõ ràng thay vì nhập pixel thủ công.
- Blur Original là fill mode mặc định.
- Các background thông thường dùng center + contain + maximum possible size.
- Crop dùng cover + normalized position, mặc định center.
- Ratio và fill mode là batch-level; chỉ crop position là per-image.
- Preview navigation dùng arrows + counter thay vì thumbnail manager.
- Mobile Apple devices ưu tiên native share sheet cho image export; desktop giữ download behavior quen thuộc.
- Ảnh của người dùng chỉ được xử lý trên thiết bị và không được gửi lên hoặc lưu trên server.

## Ngoài phạm vi

- Zoom trong Crop.
- Rotation.
- Freeform crop rectangle hoặc crop handles.
- Thay đổi thủ công kích thước foreground ngoài cơ chế contain / cover.
- Padding hoặc margin tùy chỉnh.
- Image editor với text, filter, sticker, watermark hoặc các công cụ chỉnh sửa khác.
- Per-image ratio hoặc per-image background mode.
- Thumbnail browser, reorder hoặc quản lý asset.
- ZIP export.
- Tự động ghi thẳng ảnh vào iOS Photos mà không qua user action.
- Xuất một ảnh thành nhiều social sizes cùng lúc.
- Tài khoản người dùng.
- Lịch sử xử lý ảnh.
- Backend lưu trữ hoặc xử lý ảnh.
- API trả phí.

# 3. UI/UX

- **Nền tảng và thiết bị:** Web, sử dụng được trên desktop và mobile.
- **Khu vực chính:** Header; upload; chọn tỉ lệ / placement; chọn fill mode; custom palette khi cần; preview navigation; preview; crop controls khi cần; nút save / download.
- **Bố cục:** Một luồng ngắn trên cùng một trang, không chuyển sang editor phức tạp.
- **Khu chọn tỉ lệ:** Pattern compact kiểu CapCut - icon mạng xã hội trong khung, ratio ở dưới.
- **Custom color:** Hiển thị inline và gọn trong panel, không dùng modal lớn.
- **Crop:** Kéo trực tiếp trên preview, hiện grid khi drag, có `Đặt lại`.
- **Batch preview:** Hai mũi tên và `current / total`; ẩn khi chỉ một ảnh.
- **Export trên iPhone/iPad:** Dùng wording `Lưu ảnh` / `Lưu N ảnh` và native share sheet.
- **Trạng thái cần hiển thị:**
  - Chưa có ảnh.
  - Một ảnh.
  - Nhiều ảnh và vị trí hiện tại trong batch.
  - Crop active và hướng dẫn kéo.
  - Đang đọc/export ảnh.
  - File không hợp lệ hoặc không đọc được.
  - Safari cần tap lại để khôi phục user activation.
- **Brand:**
  - Logo wordmark **FitPic**.
  - Brand color `#047857`, chỉ dùng làm màu nhấn.
  - Minimal, calm, functional, image-first.
  - Hỗ trợ light và dark theme.
  - Design source of truth nằm trong `DESIGN.md`.

# 4. Dữ liệu và quyền riêng tư

- **Dữ liệu đầu vào:** Một hoặc nhiều ảnh, platform / tỉ lệ, fill mode, custom color nếu có và normalized crop position cho từng ảnh nếu Crop.
- **Dữ liệu đầu ra:** Một hoặc nhiều file JPG theo aspect ratio và composition đã chọn.
- **Lưu trữ:** Không lưu ảnh hoặc lịch sử xử lý trên backend.
- **Tích hợp bên ngoài:** Không có API hoặc dịch vụ trả phí.
- **Quyền riêng tư:** Ảnh phải được xử lý trên thiết bị, không upload hoặc gửi nội dung ảnh tới server. Không yêu cầu tài khoản hoặc đăng nhập.

# 5. Tiêu chí hoàn thành

- [ ] Người dùng có thể upload một hoặc nhiều ảnh hợp lệ.
- [ ] Previous / Next cho phép xem từng ảnh trong batch.
- [ ] Có counter `current / total` và navigation ẩn khi chỉ có một ảnh.
- [ ] Có các placement / ratio hiện có và mapping vẫn đúng.
- [ ] Blur Original, White, Black và Custom vẫn giữ trọn foreground như trước.
- [ ] Có option Crop.
- [ ] Crop mặc định center.
- [ ] Có thể drag Crop bằng mouse và touch.
- [ ] Crop được clamp, không lộ khoảng trống.
- [ ] Grid hiển thị trong lúc kéo.
- [ ] `Đặt lại` đưa crop của ảnh hiện tại về center.
- [ ] Crop position được lưu riêng cho từng ảnh.
- [ ] Export dùng đúng crop position của từng ảnh ở 2160px.
- [ ] Batch share trên iPhone/iPad vẫn dùng native share flow khi được hỗ trợ.
- [ ] Desktop / unsupported browser vẫn dùng download fallback.
- [ ] Ảnh vẫn được xử lý hoàn toàn client-side.
- [ ] Không thêm zoom, rotation, thumbnail manager, ZIP hoặc full image-editor features.
