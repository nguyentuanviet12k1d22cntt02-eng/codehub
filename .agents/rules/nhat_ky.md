---
trigger: always_on
description: Quy định bắt buộc ghi nhật ký công việc vào thư mục 'Nhật ký/' sau mỗi tác vụ hoàn thành.
---

## 📓 Quy định ghi Nhật ký công việc (Mandatory Work Log)

Sau khi hoàn thành bất kỳ yêu cầu, sửa lỗi, phát triển tính năng hay thay đổi mã nguồn nào cho người dùng, AI **BẮT BUỘC** phải ghi lại nhật ký công việc vào thư mục `Nhật ký/`:

1. **Vị trí lưu trữ**: `Nhật ký/YYYY-MM-DD.md` (theo ngày hiện tại, ví dụ: `Nhật ký/2026-10-12.md`).
   - Nếu file ngày đó chưa tồn tại, tạo mới với tiêu đề `# 📅 Nhật ký công việc - Ngày YYYY-MM-DD`.
   - Nếu file ngày đó đã có sẵn, nối tiếp (append) mục mới vào cuối file theo thứ tự thời gian.
2. **Cấu trúc mỗi mục ghi**:
   - Tuân thủ đúng mẫu trong [`Nhật ký/TEMPLATE.md`](file:///d:/Project/LearnPython/Nhật ký/TEMPLATE.md):
     - `## [HH:mm] [Tên công việc / Tóm tắt tác vụ]`
     - `### 1. 🎯 Mục tiêu`
     - `### 2. 📂 Phạm vi thay đổi (Files & Components)`
     - `### 3. 🛠️ Chi tiết triển khai`
     - `### 4. ✅ Kết quả & Kiểm tra (Verification)`
     - `### 5. 📌 Lưu ý & Bước tiếp theo (Next Steps)`
3. **Tính liên tục & Không bỏ qua**:
   - Trước khi gửi câu trả lời kết luận hoặc báo cáo hoàn thành cho người dùng, phải đảm bảo file nhật ký đã được cập nhật thành công.
