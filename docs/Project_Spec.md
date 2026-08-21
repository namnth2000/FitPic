# Project Spec

# 1. Tổng quan

- **Tên sản phẩm:** FitPic
- **Mô tả ngắn:** Công cụ web giúp người dùng đưa một ảnh về đúng định dạng phù hợp với nơi muốn đăng trên mạng xã hội mà không crop hoặc làm mất nội dung ảnh.
- **Vấn đề:** Một ảnh có thể phù hợp với nội dung nhưng không phù hợp với tỉ lệ hiển thị của Facebook, Instagram, TikTok hoặc YouTube. Crop ảnh có thể làm mất phần nội dung người dùng muốn giữ, trong khi việc tự chỉnh canvas và background bằng công cụ chỉnh ảnh thường mất thêm thao tác.
- **Người dùng mục tiêu:** Người dùng mạng xã hội, người bán hàng online và người sáng tạo nội dung cần chuẩn bị ảnh nhanh để đăng lên các nền tảng phổ biến.
- **Giải pháp chính:** Người dùng tải một ảnh lên, chọn nơi muốn đăng và background. FitPic tự chọn tỉ lệ phù hợp, giữ toàn bộ ảnh, căn giữa ảnh trong khung và tạo file ảnh sẵn sàng để tải xuống.
- **Mục tiêu của phiên bản này:** Hoàn thiện một luồng duy nhất, đơn giản và dùng được từ đầu đến cuối: **Upload ảnh → Chọn platform / placement → Chọn background → Preview → Download**.

# 2. Phạm vi sản phẩm

## Luồng sử dụng chính

1. Người dùng mở FitPic và tải một ảnh từ thiết bị lên.
2. FitPic hiển thị preview ảnh.
3. Người dùng chọn nơi muốn sử dụng ảnh.
4. FitPic tự chọn aspect ratio phù hợp với lựa chọn đó.
5. Người dùng chọn một trong ba background: Blur Original, White hoặc Black.
6. FitPic tạo preview theo tỉ lệ đích mà không crop ảnh.
7. Người dùng tải ảnh kết quả xuống thiết bị.

## Yêu cầu chức năng

1. **Upload ảnh**
   - Người dùng có thể chọn một ảnh từ thiết bị.
   - Sau khi ảnh hợp lệ được chọn, FitPic hiển thị preview và cho phép tiếp tục chỉnh định dạng.
   - Nếu file không phải định dạng ảnh được hỗ trợ hoặc không thể đọc, FitPic phải thông báo lỗi rõ ràng và không tiếp tục xử lý file đó.

2. **Chọn platform / placement**
   - Người dùng chọn nơi ảnh sẽ được sử dụng thay vì tự chọn aspect ratio.
   - Phiên bản đầu hỗ trợ:
     - Instagram Feed
     - Instagram Story / Reels
     - TikTok
     - Facebook Feed
     - YouTube Thumbnail
     - YouTube Shorts
   - FitPic tự ánh xạ lựa chọn sang aspect ratio phù hợp:
     - Instagram Feed → 4:5
     - Instagram Story / Reels → 9:16
     - TikTok → 9:16
     - Facebook Feed → 4:5
     - YouTube Thumbnail → 16:9
     - YouTube Shorts → 9:16
   - Người dùng không cần nhập kích thước pixel hoặc aspect ratio thủ công.

3. **Fit ảnh vào khung**
   - Ảnh gốc luôn giữ nguyên aspect ratio.
   - FitPic không crop ảnh.
   - Ảnh được căn giữa theo cả chiều ngang và chiều dọc.
   - Ảnh được phóng lớn tối đa cho đến khi một chiều chạm cạnh canvas.
   - Không chủ động tạo margin hoặc padding cố định ở cả bốn cạnh.
   - Phần canvas không được ảnh gốc phủ sẽ dùng background đã chọn.
   - Nếu ảnh gốc đã có cùng aspect ratio với khung đích, ảnh phủ toàn bộ canvas và background không xuất hiện.

4. **Chọn background**
   - Có ba lựa chọn trong V1:
     - **Blur Original:** dùng chính ảnh gốc làm background và làm mờ. Đây là lựa chọn mặc định.
     - **White:** dùng nền trắng.
     - **Black:** dùng nền đen.
   - Thay đổi background phải được phản ánh trong preview.
   - V1 không hỗ trợ custom background.

5. **Preview**
   - Preview phải thể hiện đúng composition của ảnh đầu ra, gồm aspect ratio, vị trí ảnh và background.
   - Preview được cập nhật khi người dùng đổi platform / placement hoặc background.
   - Preview không được làm thay đổi ảnh gốc của người dùng.

6. **Download**
   - Người dùng có thể tải ảnh kết quả xuống sau khi đã upload ảnh.
   - File tải xuống phải giữ đúng aspect ratio đang được chọn và đúng nội dung nhìn thấy trong preview.
   - Quá trình download không yêu cầu tài khoản, đăng nhập hoặc upload ảnh lên server.

## Quy tắc sản phẩm

- Giá trị chính của FitPic là đưa ảnh về đúng định dạng social media mà vẫn giữ toàn bộ ảnh.
- Người dùng chọn nơi muốn đăng, FitPic chịu trách nhiệm chọn aspect ratio tương ứng.
- FitPic ưu tiên hành vi tự động và dễ hiểu hơn các tùy chỉnh chỉnh ảnh nâng cao.
- Blur Original là background mặc định.
- Ảnh foreground luôn sử dụng cơ chế center + contain + maximum possible size.
- Không crop ảnh tự động hoặc thủ công trong V1.
- Không có margin hoặc padding thẩm mỹ mặc định quanh ảnh.
- Ảnh của người dùng chỉ được xử lý trên thiết bị và không được gửi lên hoặc lưu trên server.

## Ngoài phạm vi

- Custom background.
- Kéo ảnh để thay đổi vị trí.
- Thay đổi thủ công kích thước foreground.
- Padding hoặc margin tùy chỉnh.
- Crop ảnh.
- Image editor với text, filter, sticker, watermark hoặc các công cụ chỉnh sửa khác.
- Batch processing.
- Xuất một ảnh thành nhiều social sizes cùng lúc.
- Tài khoản người dùng.
- Lịch sử xử lý ảnh.
- Backend lưu trữ hoặc xử lý ảnh.
- API trả phí.
- Các công cụ social media khác ngoài flow chính của FitPic.

# 3. UI/UX

- **Nền tảng và thiết bị:** Web, sử dụng được trên desktop và mobile.
- **Màn hình hoặc khu vực chính:** Header với wordmark FitPic; khu vực upload; khu vực chọn platform / placement; khu vực chọn background; preview; nút download.
- **Bố cục và thao tác chính:** Tập trung vào một luồng ngắn trên cùng một trang hoặc một giao diện liên tục. Người dùng không phải chuyển qua editor phức tạp hoặc cấu hình kỹ thuật trước khi tải ảnh xuống.
- **Trạng thái cần hiển thị:**
  - Chưa có ảnh: hiển thị khu vực upload rõ ràng.
  - Đã có ảnh: hiển thị preview và các lựa chọn cần thiết.
  - Đang xử lý ảnh: phản hồi trực quan nếu thao tác cần thời gian đủ để người dùng nhận biết.
  - File không hợp lệ hoặc không đọc được: hiển thị lỗi rõ ràng và cho phép chọn lại ảnh.
  - Sẵn sàng tải xuống: nút Download khả dụng.
- **Brand và tài nguyên:**
  - Logo: wordmark chữ **FitPic**.
  - Brand color: `#047857`, chỉ dùng làm màu nhấn, không phủ quá nhiều giao diện.
  - Hướng thiết kế: đơn giản, nhanh, sạch và tập trung vào ảnh.
- **Sản phẩm tham khảo:** Không có yêu cầu sao chép giao diện cụ thể. FitPic ưu tiên flow đơn giản hơn một image editor đầy đủ.

# 4. Dữ liệu và quyền riêng tư

- **Dữ liệu đầu vào:** Ảnh do người dùng chọn từ thiết bị cùng lựa chọn platform / placement và background.
- **Dữ liệu đầu ra:** Một file ảnh mới theo aspect ratio đã chọn, giữ toàn bộ nội dung ảnh gốc và sử dụng background tương ứng.
- **Lưu trữ:** Không lưu ảnh hoặc lịch sử xử lý trên backend.
- **Tích hợp bên ngoài:** Không có API hoặc dịch vụ trả phí trong V1.
- **Yêu cầu quyền riêng tư hoặc bảo mật:** Ảnh phải được xử lý trên thiết bị của người dùng, không upload hoặc gửi nội dung ảnh tới server. Không yêu cầu tài khoản hoặc đăng nhập.

# 5. Tiêu chí hoàn thành

- [ ] Người dùng có thể upload một ảnh hợp lệ và nhìn thấy preview.
- [ ] File ảnh không hợp lệ hoặc không đọc được được xử lý bằng thông báo rõ ràng và không làm hỏng luồng sử dụng.
- [ ] Người dùng có thể chọn từng platform / placement đã hỗ trợ và FitPic tự áp dụng đúng aspect ratio tương ứng.
- [ ] Ảnh foreground luôn giữ nguyên aspect ratio, được căn giữa, phóng lớn tối đa trong khung và không bị crop.
- [ ] Không có padding cố định ở cả bốn cạnh; phần còn trống chỉ xuất hiện do chênh lệch aspect ratio.
- [ ] Blur Original là background mặc định và hoạt động đúng.
- [ ] White và Black background hoạt động đúng.
- [ ] Preview cập nhật đúng khi thay đổi platform / placement hoặc background.
- [ ] Nếu ảnh gốc đã đúng aspect ratio đích, ảnh phủ toàn bộ canvas mà không xuất hiện background.
- [ ] Người dùng có thể download ảnh và file tải xuống khớp với preview.
- [ ] Toàn bộ luồng **Upload → Platform / Placement → Background → Preview → Download** hoạt động từ đầu đến cuối.
- [ ] Ảnh được xử lý trên thiết bị và không bị upload hoặc lưu trên server.
- [ ] Không yêu cầu tài khoản, đăng nhập hoặc backend.
- [ ] Giao diện sử dụng được trên desktop và mobile.
- [ ] V1 không chứa custom background, reposition, crop, padding control, batch export hoặc các công cụ image editor ngoài phạm vi.
