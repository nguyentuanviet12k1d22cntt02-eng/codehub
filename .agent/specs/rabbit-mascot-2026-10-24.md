# Thay mascot bằng bộ frame thỏ có sẵn

## Phạm vi

- Nguồn: assets/img/full frame.png, 1450×1085, 4×2 ô, nền caro đã baked-in.
- Tách lossless tám ô; chỉ ô hàng 2 cột 4 tạo lại đầu nhìn 10h30 (trái màn hình,
  chéo lên). Bảy hướng còn lại chỉ làm nét/tách nền, không thiết kế lại.
- Dùng imagegen cho cải thiện/tách nền và sửa đầu. Không sửa ảnh gốc.
- Chuẩn hóa canvas/neo cổ, ghép cùng một lớp thân để thân/áo/logo/chân không
  đổi pixel khi chuyển hướng. Kiểm tra alpha, biên/cắt tai và hướng của từng ô.
- Chỉ thay thành phần mascot và CSS liên quan, không thay logic AI/chấm bài.

## Tích hợp và nghiệm thu

- Tám ảnh PNG riêng, cùng kích thước, nền alpha thật; một bộ copy trong public.
- Ánh xạ n/ne/e/se/s/sw/w/nw; nw là 10h30, không xoay ảnh/mirror logo/thân.
- Lớp thân cố định, chuyển đầu bằng opacity, preload/decode trước khi hiển thị;
  lọc rung ở ranh giới hướng, giới hạn cập nhật, cleanup pointer/animation.
- Giữ vị trí trên trái và hợp đồng mood từ khung trợ giảng; không lắc/scale thân.
- Giữ reduced-motion và hành vi không theo chuột trên cảm ứng.
- Kiểm tra type/build, ánh xạ tám hướng, alpha/thân cố định và trình duyệt thật.
- Ghi kết quả thật và phần chưa xác minh vào nhật ký sau khi hoàn tất.

## Kết quả

- Đã xuất 8 PNG RGBA 576×768 và ZIP, không ghi đè ảnh gốc. NW nhìn lên trái
  10h30; không mirror áo/logo. Ảnh được xử lý bằng built-in image_gen, bộ prompt
  và quy trình đóng gói được lưu tại assets/img/rabbit-mascot/README.md.
- Kiểm tra pixel: vùng thân y>=470 giống hệt ở tám file, mismatch=0; không có
  pixel chạm biên canvas, nền có alpha thật và cạnh anti-alias.
- UI dùng một lớp thân + tám lớp đầu 192×256 (273060 bytes tổng), preload/decode
  trước khi theo chuột. Không có chuyển src, remount hoặc transform thân.
- Unit 4/4 đạt; eslint ba file mascot/helper đạt; frontend production build đạt.
- Browser fixture dùng pointer thật đã kiểm tra n/ne/e/se/s/sw/w/nw; mọi ảnh
  tải thành công, bounding rect thân luôn [602,252,76,84]. Nút fixture không gán
  state hướng, chỉ cung cấp vị trí để di chuyển chuột.
- Trang thực hành có đăng nhập QA: một thỏ, không còn cáo, tọa độ tương đối với
  góc khung là [11,13], kích thước [76,84]. Nền sáng/tối đều quan sát được,
  không thấy nền caro. Viewport 375: khung rộng 315, mascot [58,64], không tràn.
- Khôi phục viewport/theme sau kiểm tra. Reduced-motion/cảm ứng có nhánh xử lý
  và kiểm tra nguồn; chưa thử trên thiết bị cảm ứng vật lý hay đổi cài đặt OS.
- Không đổi backend, AI, grader, dữ liệu người học hay thêm thư viện. Chỉ QA
  bằng tài khoản cô lập; chưa triển khai website từ xa.
