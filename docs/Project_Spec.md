# Project Spec

# 1. Tổng quan

- **Tên sản phẩm:** FitPic
- **Mô tả ngắn:** Công cụ web giúp người dùng đưa một hoặc nhiều ảnh về đúng tỉ lệ phù hợp với nơi muốn đăng trên mạng xã hội. Người dùng có thể giữ trọn ảnh với background blur, màu hoặc một ảnh nền riêng, tạo lề cân đối và bo góc foreground, hoặc chọn Crop để phủ kín khung và chọn vùng giữ lại.
- **Vấn đề:** Một ảnh có thể phù hợp với nội dung nhưng không phù hợp với tỉ lệ hiển thị của Facebook, Instagram, TikTok hoặc YouTube. Có lúc người dùng muốn giữ trọn nội dung bằng background, thêm khoảng thở đều quanh ảnh, dùng một ảnh khác làm background hoặc muốn ảnh phủ kín khung và chủ động chọn vùng bị crop. Khi có nhiều ảnh cùng cần một định dạng, lặp lại quy trình từng ảnh gây tốn thời gian.
- **Người dùng mục tiêu:** Người dùng mạng xã hội, người bán hàng online và người sáng tạo nội dung cần chuẩn bị ảnh nhanh để đăng lên các nền tảng phổ biến.
- **Giải pháp chính:** Người dùng tải một hoặc nhiều ảnh lên, chọn placement / tỉ lệ và cách lấp khung. FitPic preview từng ảnh trong batch. Với các background thông thường FitPic giữ trọn ảnh; Image-based dùng một ảnh riêng làm background cho toàn bộ batch; Balance tạo lề đều bốn phía và Radius bo góc foreground; Crop phủ kín canvas và cho phép kéo để điều chỉnh vùng giữ lại cho từng ảnh.
- **Mục tiêu của phiên bản này:** Giữ luồng đơn giản: **Upload ảnh -> Chọn tỉ lệ / placement -> Chọn background hoặc Crop -> Tùy chỉnh Layout -> Xem từng preview -> Save / Download**.

# 2. Phạm vi sản phẩm

## Luồng sử dụng chính

1. Người dùng mở FitPic và tải một hoặc nhiều ảnh từ thiết bị lên.
2. FitPic đọc ảnh cục bộ và hiển thị preview của ảnh hợp lệ đầu tiên.
3. Nếu có nhiều ảnh, người dùng dùng mũi tên Previous / Next để xem từng preview.
4. Người dùng chọn placement / tỉ lệ bằng các tile có icon mạng xã hội và tỉ lệ hiển thị bên dưới.
5. Người dùng chọn Blur Original, White, Black, Custom, Image-based hoặc Crop.
6. Nếu chọn Custom, người dùng có thể chọn màu preset, dùng system color picker hoặc nhập HEX.
7. Nếu chọn Image-based, người dùng chọn một ảnh nền riêng từ thiết bị. Ảnh nền dùng chung cho toàn bộ batch, được căn giữa và cover canvas; foreground vẫn được contain để giữ trọn nội dung.
8. Với Blur, White, Black, Custom hoặc Image-based, người dùng có thể bật Balance để tạo lề đều bốn phía và chỉnh Padding bằng slider.
9. Khi Balance bật, người dùng có thể bật Radius để bo góc foreground và chỉnh Corner bằng slider.
10. Nếu chọn Crop, ảnh cover toàn bộ canvas, mặc định căn giữa và có thể kéo để điều chỉnh vùng giữ lại. Balance và Radius không áp dụng cho Crop.
11. Cùng một tỉ lệ, fill mode, Balance và Radius áp dụng cho toàn bộ batch. Crop position vẫn được lưu riêng cho từng ảnh.
12. FitPic tạo một JPG riêng cho từng ảnh. Trên iPhone/iPad hỗ trợ file sharing, FitPic gửi toàn bộ file vào một native share sheet. Trên desktop hoặc browser không hỗ trợ, FitPic dùng download fallback.

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

Áp dụng cho Blur Original, White, Black, Custom và Image-based:

- Ảnh gốc luôn giữ nguyên aspect ratio.
- Ảnh foreground không bị crop.
- Khi Balance tắt, foreground dùng center + contain + maximum possible size trên toàn canvas như hiện tại.
- Khi Balance bật, foreground dùng contain trong một inner frame được inset đều bốn phía.
- Padding của Balance được tính theo phần trăm cạnh ngắn hơn của canvas để lề đều theo pixel ở cả bốn hướng.
- Background luôn phủ toàn bộ canvas, không bị thu nhỏ theo Balance.
- Nếu Radius bật, chỉ foreground được clip bo góc. Background và output canvas không bị bo góc.

### 4. Fill mode

Có sáu lựa chọn theo đúng thứ tự:

- **Blur Original:** dùng chính ảnh gốc làm background và làm mờ. Đây là lựa chọn mặc định.
- **White:** nền trắng.
- **Black:** nền đen.
- **Custom:** màu nền do người dùng chọn.
- **Image-based:** dùng một ảnh riêng do người dùng chọn làm background.
- **Crop:** ảnh gốc phủ kín toàn bộ canvas và phần dư nằm ngoài canvas bị crop.

Custom:

- Có palette preset nhỏ với các màu phổ biến, sắp theo nhóm sáng/pastel, màu tươi và màu đậm.
- Có system color picker.
- Có ô nhập HEX.
- Màu custom phải được phản ánh ngay trong preview và export.

Image-based:

- Nằm sau Custom và trước Crop trong selector.
- Người dùng chọn một ảnh nền riêng từ thiết bị.
- Hỗ trợ JPG, PNG, WebP và GIF.
- Ảnh nền chỉ được đọc local, không upload lên server.
- Một ảnh nền được dùng chung cho toàn bộ batch.
- Ảnh nền được căn giữa và scale theo cover để luôn phủ kín canvas đích.
- Foreground vẫn dùng contain, có thể dùng Balance / Radius như các background khác.
- Người dùng có thể thay hoặc xóa ảnh nền đã chọn.
- Khi đang chọn Image-based nhưng chưa có ảnh nền hợp lệ, Save / Download phải disabled.
- Không có opacity, blur amount, filter, reposition ảnh nền hoặc per-image background image trong version này.

Crop:

- Scale ảnh theo cover để canvas luôn được phủ kín.
- Mặc định `cropX = 0.5`, `cropY = 0.5`.
- Người dùng kéo trực tiếp ảnh trong preview bằng mouse hoặc touch.
- Crop position dùng normalized coordinates trong `[0, 1]`, không lưu pixel preview.
- Movement phải clamp để không lộ khoảng trống trong canvas.
- Hiện rule-of-thirds grid nhẹ trong lúc drag.
- Có nút `Đặt lại` để đưa ảnh hiện tại về center.
- Balance và Radius không tác động tới Crop.
- Không có zoom, rotation hoặc freeform crop rectangle trong version này.

### 5. Layout: Balance và Radius

Balance:

- Là một toggle + slider nhỏ, batch-level.
- Chỉ áp dụng cho Blur Original, White, Black, Custom và Image-based.
- Không áp dụng cho Crop.
- Default state: tắt.
- Khi bật lần đầu dùng `8%`.
- Slider Padding: `0%` đến `20%`, step `1%`.
- Lề được tính từ cạnh ngắn hơn của canvas và inset bằng nhau ở top / right / bottom / left.
- Background vẫn render full canvas; chỉ target frame của foreground thay đổi.

Radius:

- Là một toggle + slider nhỏ, batch-level.
- Chỉ khả dụng khi Balance đang bật và mode hiện tại không phải Crop.
- Default state: tắt.
- Khi bật lần đầu dùng `12px`.
- Slider Corner: `0px` đến `32px`, step `2px`.
- Chỉ bo góc foreground image; không bo background hoặc output canvas.
- Radius phải giữ cảm giác thị giác nhất quán giữa preview 960px và export 2160px.

Crop interaction:

- Khi Crop active, Balance và Radius controls vẫn có thể hiển thị để giữ cấu trúc UI ổn định nhưng phải disabled.
- Hiển thị helper text ngắn `Không áp dụng cho Crop`.
- Chuyển khỏi Crop khôi phục layout settings trước đó.

### 6. Batch processing

- Cùng một platform / tỉ lệ, fill mode, Balance và Radius áp dụng cho tất cả ảnh trong batch.
- Image-based background image là batch-level và dùng chung cho mọi ảnh nguồn.
- Crop position được lưu riêng cho từng ảnh vì mỗi ảnh có framing khác nhau.
- Save / Download button hiển thị số ảnh khi batch có nhiều hơn một ảnh.
- Mỗi ảnh được render riêng ở độ phân giải export và tạo thành một JPG riêng.
- Trên iPhone/iPad có Web Share file support, toàn bộ JPG được truyền vào một lần `navigator.share({ files })`.
- Nếu việc chuẩn bị file làm Safari mất transient user activation, FitPic giữ tạm các file đã render để lần tap tiếp theo có thể mở share sheet ngay.
- Trên desktop hoặc browser không hỗ trợ chia sẻ file, FitPic giữ individual-download fallback.
- Không tạo ZIP trong phiên bản này.
- Không có per-image ratio, per-image background, per-image layout, reorder hoặc thumbnail manager.

### 7. Preview và điều hướng batch

- Preview phải thể hiện đúng composition của ảnh hiện tại, gồm aspect ratio, vị trí ảnh, background, Balance / Radius hoặc crop.
- Batch có nút Previous và Next cùng counter `current / total`.
- Khi chỉ có một ảnh, ẩn navigation.
- Previous disabled ở ảnh đầu; Next disabled ở ảnh cuối.
- `ArrowLeft` / `ArrowRight` có thể điều hướng khi focus không nằm trong form control.
- Chuyển preview không thay đổi output settings.
- Trong Crop, drag chỉ cập nhật crop position của ảnh đang xem.
- Trong Image-based, mọi preview dùng cùng một ảnh nền đã chọn.
- Balance và Radius preview phải khớp với export về composition.
- Preview không được làm thay đổi ảnh gốc.

### 8. Save / Download

- Người dùng có thể lưu hoặc tải ảnh kết quả sau khi đã upload ít nhất một ảnh hợp lệ.
- File đầu ra phải giữ đúng aspect ratio và composition tương ứng với state của từng ảnh.
- Với Image-based, export phải dùng đúng ảnh nền đã chọn và cùng cover geometry với preview.
- Với Balance, export phải dùng cùng padding percentage như preview.
- Với Radius, export phải scale corner radius để giữ cùng cảm giác thị giác với preview.
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
- Các background thông thường dùng contain cho foreground; Balance chỉ thay đổi target frame của contain.
- Image-based dùng một background image shared + center cover, trong khi foreground vẫn contain.
- Radius chỉ là foreground clipping khi Balance active.
- Crop dùng cover + normalized position, mặc định center và hoàn toàn không bị ảnh hưởng bởi Balance / Radius.
- Ratio, fill mode, Balance và Radius là batch-level; chỉ crop position là per-image.
- Preview navigation dùng arrows + counter thay vì thumbnail manager.
- Mobile Apple devices ưu tiên native share sheet cho image export; desktop giữ download behavior quen thuộc.
- Ảnh nguồn và ảnh nền của người dùng chỉ được xử lý trên thiết bị và không được gửi lên hoặc lưu trên server.

## Ngoài phạm vi

- Per-side padding hoặc margin.
- Per-corner radius.
- Border hoặc shadow cho foreground.
- Balance / Radius trong Crop.
- Zoom trong Crop.
- Rotation.
- Freeform crop rectangle hoặc crop handles.
- Thay đổi thủ công kích thước foreground ngoài cơ chế contain / cover.
- Image editor với text, filter, sticker, watermark hoặc các công cụ chỉnh sửa khác.
- Per-image ratio, per-image background mode hoặc per-image layout settings.
- Per-image background image.
- Reposition / crop / blur / opacity controls cho Image-based background.
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
- **Khu vực chính:** Header; upload; chọn tỉ lệ / placement; chọn fill mode; custom palette hoặc Image-based picker khi cần; Layout; preview navigation; preview; crop controls khi cần; nút save / download.
- **Bố cục:** Một luồng ngắn trên cùng một trang, không chuyển sang editor phức tạp.
- **Khu chọn tỉ lệ:** Pattern compact kiểu CapCut - icon mạng xã hội trong khung, ratio ở dưới.
- **Custom color:** Hiển thị inline và gọn trong panel, không dùng modal lớn.
- **Image-based:** Hiển thị inline một file picker gọn, tên file hiện tại và action thay / xóa ảnh nền.
- **Layout:** Một panel nhỏ với Balance toggle + Padding slider và Radius toggle + Corner slider. Chỉ hiện slider khi toggle tương ứng bật.
- **Crop:** Kéo trực tiếp trên preview, hiện grid khi drag, có `Đặt lại`; Layout controls disabled.
- **Batch preview:** Hai mũi tên và `current / total`; ẩn khi chỉ một ảnh.
- **Export trên iPhone/iPad:** Dùng wording `Lưu ảnh` / `Lưu N ảnh` và native share sheet.
- **Trạng thái cần hiển thị:**
  - Chưa có ảnh.
  - Một ảnh.
  - Nhiều ảnh và vị trí hiện tại trong batch.
  - Image-based active nhưng chưa có ảnh nền.
  - Image-based đã có ảnh nền và tên file hiện tại.
  - Balance / Radius active với giá trị hiện tại.
  - Crop active và hướng dẫn kéo; Layout không áp dụng.
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

- **Dữ liệu đầu vào:** Một hoặc nhiều ảnh nguồn, platform / tỉ lệ, fill mode, custom color nếu có, một ảnh nền local nếu dùng Image-based, Balance / Radius settings và normalized crop position cho từng ảnh nếu Crop.
- **Dữ liệu đầu ra:** Một hoặc nhiều file JPG theo aspect ratio và composition đã chọn.
- **Lưu trữ:** Không lưu ảnh hoặc lịch sử xử lý trên backend.
- **Tích hợp bên ngoài:** Không có API hoặc dịch vụ trả phí.
- **Quyền riêng tư:** Ảnh nguồn và ảnh nền phải được xử lý trên thiết bị, không upload hoặc gửi nội dung ảnh tới server. Object URL của ảnh nền phải được revoke khi thay, xóa hoặc unload. Không yêu cầu tài khoản hoặc đăng nhập.

# 5. Tiêu chí hoàn thành

- [ ] Người dùng có thể upload một hoặc nhiều ảnh hợp lệ.
- [ ] Previous / Next cho phép xem từng ảnh trong batch.
- [ ] Có counter `current / total` và navigation ẩn khi chỉ có một ảnh.
- [ ] Có các placement / ratio hiện có và mapping vẫn đúng.
- [ ] Blur Original, White, Black, Custom và Image-based vẫn giữ trọn foreground.
- [ ] Image-based background dùng center + cover; foreground vẫn contain.
- [ ] Balance có toggle + slider từ 0% đến 20%, default 8% khi bật.
- [ ] Balance tạo lề đều bốn hướng và background vẫn phủ full canvas.
- [ ] Balance áp dụng cho Blur / White / Black / Custom / Image-based.
- [ ] Radius có toggle + slider từ 0px đến 32px, default 12px khi bật.
- [ ] Radius chỉ khả dụng khi Balance bật và chỉ bo foreground image.
- [ ] Balance / Radius là batch-level và export khớp preview.
- [ ] Crop không thay đổi behavior và không áp dụng Balance / Radius.
- [ ] Khi Crop active, layout controls disabled và có note rõ ràng.
- [ ] Crop position vẫn được lưu riêng cho từng ảnh.
- [ ] Batch share trên iPhone/iPad vẫn dùng native share flow khi được hỗ trợ.
- [ ] Desktop / unsupported browser vẫn dùng download fallback.
- [ ] Ảnh nguồn và ảnh nền vẫn được xử lý hoàn toàn client-side.
- [ ] Không thêm per-side padding, per-corner radius, border, shadow, zoom, rotation, thumbnail manager, ZIP hoặc full image-editor features.
