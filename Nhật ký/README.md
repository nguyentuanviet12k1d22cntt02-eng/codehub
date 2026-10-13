# 📓 Hướng Dẫn & Cấu Trúc Nhật Ký Công Việc

Thư mục này dùng để lưu trữ toàn bộ lịch sử công việc, thay đổi mã nguồn, tính năng mới và các quyết định kỹ thuật do AI và lập trình viên thực hiện trong dự án.

---

## 🎯 Quy ước chung

1. **Quy tắc bắt buộc**: Mỗi khi hoàn thành một tác vụ (sửa lỗi, thêm tính năng, refactor, phân tích, thiết lập...), AI **phải tự động ghi chép lại** vào nhật ký trước khi kết thúc câu trả lời.
2. **Quy tắc đặt tên file**:
   - File nhật ký được phân chia theo từng ngày: `YYYY-MM-DD.md` (ví dụ: `2026-10-12.md`).
   - Nếu trong một ngày có nhiều tác vụ, các tác vụ sẽ được ghi nối tiếp (append) vào file của ngày hôm đó theo thứ tự thời gian.
3. **Định dạng thời gian**: Dùng định dạng 24h `HH:mm` hoặc `HH:mm:ss`.

---

## 📐 Cấu trúc chuẩn cho mỗi mục nhật ký

Mỗi mục trong file nhật ký theo ngày sẽ có cấu trúc như sau:

```markdown
# 📅 Nhật ký công việc - Ngày YYYY-MM-DD

---

## [HH:mm] [Tên công việc / Tóm tắt tác vụ]

### 1. 🎯 Mục tiêu
- Mô tả mục tiêu của yêu cầu từ người dùng hoặc vấn đề cần giải quyết.

### 2. 📂 Phạm vi thay đổi (Files & Components)
- `đường/dẫn/file1.py`: Tạo mới / Cập nhật / Xoá - Tóm tắt ngắn gọn thay đổi.
- `đường/dẫn/file2.ts`: Tạo mới / Cập nhật / Xoá - Tóm tắt ngắn gọn thay đổi.

### 3. 🛠️ Chi tiết triển khai
- **Bước 1**: ...
- **Bước 2**: ...
- **Quyết định kỹ thuật**: (Lý do chọn phương án này nếu có).

### 4. ✅ Kết quả & Kiểm tra (Verification)
- **Lệnh / Kiểm thử đã chạy**: `pytest ...`, `npm run dev`, kiểm tra cú pháp, v.v.
- **Trạng thái**: [Thành công / Cần theo dõi thêm]
- **Kết quả thực tế**: Tóm tắt kết quả kiểm tra.

### 5. 📌 Lưu ý & Bước tiếp theo (Next Steps)
- Những điểm cần người dùng lưu ý khi chạy hoặc mở rộng.
- Tác vụ dự kiến cần làm tiếp theo (nếu có).
```

---

## 📂 Danh mục tài liệu tham khảo trong thư mục
- [`TEMPLATE.md`](./TEMPLATE.md): Bản mẫu chuẩn để sao chép nhanh khi tạo mục mới.
