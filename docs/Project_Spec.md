# Project Spec

# 1. Tổng quan

- **Tên sản phẩm:** FitPic
- **Mô tả ngắn:** Công cụ web giúp người dùng đưa một hoặc nhiều ảnh về đúng tỉ lệ phù hợp với nơi muốn đăng trên mạng xã hội, giữ trọn nội dung bằng các background khác nhau hoặc crop đúng vùng mong muốn.
- **Người dùng mục tiêu:** Người dùng mạng xã hội, người bán hàng online và người sáng tạo nội dung cần chuẩn bị ảnh nhanh cho Facebook, Instagram, TikTok và YouTube.
- **Luồng chính:** **Upload ảnh -> Chọn tỉ lệ -> Chọn background / Crop -> Preview -> Save / Download**.
- **Nguyên tắc:** Xử lý toàn bộ ảnh trên thiết bị, không backend, không upload ảnh của người dùng lên server.

# 2. Phạm vi sản phẩm

## 2.1 Upload ảnh nguồn

- Cho phép chọn một hoặc nhiều ảnh trong một lần.
- Hỗ trợ JPG, PNG, WebP và GIF.
- Bỏ qua file không hợp lệ và báo số lượng file bị bỏ qua.
- Batch mới reset preview về ảnh đầu tiên.

## 2.2 Platform / tỉ lệ

- Instagram Feed -> `4:5`
- Instagram Square -> `1:1`
- Instagram Story / Reels -> `9:16`
- TikTok -> `9:16`
- Facebook Feed -> `4:5`
- YouTube Thumbnail -> `16:9`
- YouTube 4:3 -> `4:3`
- YouTube 3:4 -> `3:4`
- YouTube Shorts -> `9:16`

UI selector dùng tile compact với icon mạng xã hội trong khung và ratio bên dưới.

## 2.3 Background / fill modes

Thứ tự bắt buộc:

1. **Blur Original**
2. **White**
3. **Black**
4. **Custom**
5. **Image-based**
6. **Crop**

### Blur Original

- Ảnh nguồn được contain ở foreground.
- Chính ảnh nguồn được cover + blur làm background.
- Đây là mode mặc định.

### White / Black

- Ảnh nguồn được contain ở foreground.
- Phần canvas còn lại dùng nền trắng hoặc đen.

### Custom

- Ảnh nguồn được contain ở foreground.
- Background là màu do người dùng chọn.
- Có preset palette, native color picker và ô HEX.

### Image-based

- Người dùng chọn **một ảnh nền riêng** từ thiết bị.
- Hỗ trợ cùng các định dạng JPG, PNG, WebP và GIF.
- Ảnh nền được xử lý hoàn toàn local.
- Một ảnh nền được dùng chung cho toàn bộ batch.
- Ảnh nền được căn giữa và dùng `cover` để phủ kín canvas đích.
- Ảnh nguồn vẫn dùng center + contain + maximum possible size, không crop foreground.
- Người dùng có thể thay hoặc xóa ảnh nền.
- Khi Image-based đang được chọn nhưng chưa có ảnh nền hợp lệ, nút Save / Download phải disabled.
- Không có opacity, blur amount, filter, reposition background hoặc per-image background trong phiên bản này.

### Crop

- Ảnh nguồn dùng cover để phủ kín canvas.
- Mặc định crop ở center `0.5 / 0.5`.
- Người dùng kéo ảnh trực tiếp trong preview để chỉnh vùng giữ lại.
- Crop position lưu riêng cho từng ảnh bằng normalized `cropX` / `cropY`.
- Có `Đặt lại` để đưa ảnh hiện tại về center.
- Không có zoom, rotate hoặc freeform crop handles.

## 2.4 Preview batch

- Preview hiển thị ảnh tại `previewIndex`.
- Với nhiều ảnh, có Previous / Next và chỉ báo `current / total`.
- Với một ảnh, ẩn navigation.
- ArrowLeft / ArrowRight có thể chuyển preview khi focus không nằm trong form control.
- Ratio và background mode dùng chung cho batch.
- Crop position là per-image.
- Image-based background là shared cho batch.

## 2.5 Save / Download

- Mỗi ảnh được render riêng thành JPG theo đúng composition preview.
- Preview dùng long edge 960px, export dùng long edge 2160px.
- Trên iPhone/iPad có Web Share file support, FitPic ưu tiên truyền toàn bộ JPG vào một lần `navigator.share({ files })`.
- Nếu Safari mất transient user activation trong lúc render, có thể cache file đã chuẩn bị và yêu cầu tap lại để mở share sheet ngay.
- Desktop và browser không hỗ trợ file sharing dùng individual-download fallback.
- Image-based export phải sử dụng đúng ảnh nền đã chọn và cùng cover geometry với preview.

# 3. UI/UX

- Single-page workbench, desktop 2 cột và mobile stack dọc.
- Background selector giữ compact và không mở modal lớn.
- Image-based controls chỉ xuất hiện inline khi mode đó được chọn.
- Image-based controls gồm:
  - Chọn / thay ảnh nền
  - Tên file hiện tại
  - Xóa ảnh nền
- Preview note phản ánh `Crop`, `Image-based` hoặc `Không crop`.
- Crop mới cho phép drag trên canvas; các background mode khác không biến preview thành editor.
- Không thêm thumbnail manager hoặc per-image settings panel.

# 4. Dữ liệu và quyền riêng tư

- Ảnh nguồn và ảnh nền chỉ được đọc bằng browser local file APIs.
- Object URL của ảnh nền phải được revoke khi thay ảnh, xóa ảnh hoặc unload trang.
- Không gửi ảnh nguồn hoặc ảnh nền tới server.
- Không lưu lịch sử ảnh trên backend.
- Không yêu cầu tài khoản hoặc đăng nhập.

# 5. Ngoài phạm vi

- Per-image background image.
- Reposition / crop riêng ảnh nền.
- Background opacity / filters / blur controls.
- Zoom hoặc rotate trong Crop.
- Text, sticker, watermark hoặc editor timeline.
- ZIP export.
- Backend image processing hoặc storage.
- Account / history.

# 6. Tiêu chí hoàn thành

- [ ] Image-based xuất hiện sau Custom và trước Crop.
- [ ] Chọn Image-based hiển thị local image picker inline.
- [ ] Có thể chọn, thay và xóa ảnh nền.
- [ ] Ảnh nền center + cover canvas đích.
- [ ] Foreground giữ center + contain và không crop trong Image-based.
- [ ] Một ảnh nền áp dụng cho toàn bộ batch.
- [ ] Preview Previous / Next vẫn hoạt động với Image-based.
- [ ] Save / Download disabled khi Image-based chưa có ảnh nền.
- [ ] Export từng ảnh dùng đúng ảnh nền và đúng ratio.
- [ ] iPhone/iPad native share flow không bị phá vỡ.
- [ ] Crop per-image và preview navigation hiện tại không bị regress.
- [ ] Ảnh nguồn và ảnh nền vẫn được xử lý hoàn toàn local.
