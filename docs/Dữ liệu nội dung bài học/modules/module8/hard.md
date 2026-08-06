# Hard

## **5 Bài tập nâng cao về File I/O và Hướng đối tượng (OOP)**

---

### **Bài 1: Hệ thống Quản lý Thư viện (Library Management System)**

- **Mô tả:** Thiết lập hệ thống quản lý sách đơn giản.
- **Yêu cầu:** 
    - Lớp `Book` có các thuộc tính: `isbn`, `tieu_de`, `tac_gia`, và `da_muon` (boolean, mặc định `False`).
    - Lớp `Library` quản lý danh sách sách:
        - Phương thức `them_sach(self, book)`: Thêm một đối tượng sách vào thư viện.
        - Phương thức `tim_sach(self, isbn)`: Tìm kiếm sách theo mã số isbn.
        - Phương thức `muon_sach(self, isbn)`: Đánh dấu sách là đã mượn. Nếu sách đã được mượn trước đó hoặc không tìm thấy, thông báo phù hợp.
        - Phương thức `tra_sach(self, isbn)`: Trả sách và chuyển trạng thái về chưa mượn.

---

### **Bài 2: Hệ thống đọc lỗi log và cảnh báo (Log Analyzer)**

- **Mô tả:** Cho một file log `app.log` có các dòng dữ liệu dạng:
    
    `2023-10-12 10:00:00 INFO User logged in
    2023-10-12 10:05:00 WARNING Low disk space
    2023-10-12 10:10:00 ERROR Database connection failed`
    
- **Yêu cầu:** Viết chương trình đọc file log này, thống kê số lượng bản ghi của từng cấp độ: `INFO`, `WARNING`, `ERROR` và tạo một file báo cáo `log_report.txt` chứa thông tin tóm tắt và danh sách chi tiết các dòng chứa lỗi `ERROR`.

---

### **Bài 3: Tài khoản ngân hàng nâng cao và kế thừa thẻ tín dụng**

- **Mô tả:** Xây dựng mô hình tài khoản ngân hàng thực tế.
- **Yêu cầu:**
    - Lớp cha `TaiKhoan` chứa `chu_tai_khoan`, `so_du`.
    - Lớp con `TaiKhoanTietKiem` thừa kế từ `TaiKhoan`, thêm thuộc tính `lai_suat`. Phương thức `cong_lai_thang(self)` thực hiện: `so_du += so_du * lai_suat`.
    - Lớp con `TaiKhoanTinDung` thừa kế từ `TaiKhoan`, thêm thuộc tính `han_muc_tin_dung` (cho phép số dư âm tối đa bằng hạn mức). Ghi đè phương thức `rut_tien` sao cho tài khoản có thể rút vượt quá số dư hiện tại miễn là không vượt quá hạn mức tín dụng.

---

### **Bài 4: Hệ thống đa hình tính chu vi diện tích hình học (Polymorphism)**

- **Mô tả:** Tạo mô hình tính toán hình học linh hoạt.
- **Yêu cầu:**
    - Lớp base `HinhHoc` chứa phương thức `dien_tich(self)` và `chu_vi(self)` nâng cao ném ra `NotImplementedError`.
    - Lớp con `HinhTron` nhận `ban_kinh`.
    - Lớp con `HinhChuNhat` nhận `chieu_dai`, `chieu_rong`.
    - Viết hàm `hien_thi_thong_tin(ds_hinh)` duyệt qua danh sách các đối tượng hình học và in chu vi, diện tích cụ thể của từng loại hình để kiểm chứng tính đa hình.

---

### **Bài 5: Lưu trữ và phục hồi trạng thái đối tượng dạng JSON**

- **Mô tả:** Serialization trạng thái hệ thống.
- **Yêu cầu:**
    - Định nghĩa một lớp `User` có `username`, `email`, `active` (boolean).
    - Viết phương thức `to_json(self)` trả về chuỗi JSON chứa thông tin trạng thái của user.
    - Viết phương thức tĩnh (staticmethod) hoặc hàm độc lập `from_json(json_string)` nhận vào chuỗi JSON và khôi phục (nạp lại) đối tượng `User` ban đầu.
    - Đọc/Ghi dữ liệu JSON này trực tiếp từ file `users_data.json` để giữ trạng thái sau khi tắt chương trình.
