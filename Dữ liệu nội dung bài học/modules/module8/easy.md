# Easy

## **10 Bài tập Cơ bản về File I/O và OOP**

---

### **Bài 1: Ghi thông điệp vào tập tin**

- **Yêu cầu:** Viết chương trình tạo một file văn bản định dạng `.txt` có tên `hello.txt` và ghi chuỗi `"Chào mừng tới lập trình Python!"` vào đó.

---

### **Bài 2: Đọc dữ liệu từ tập tin**

- **Yêu cầu:** Đọc toàn bộ nội dung từ file `hello.txt` vừa tạo ở Bài 1 và in thông tin ra màn hình.

---

### **Bài 3: Ghi thêm dòng mới (Append)**

- **Yêu cầu:** Sử dụng từ khóa `with open()` mở file `hello.txt` ở mode ghi nối tiếp (`'a'`) để ghi thêm dòng chữ `"Chúc bạn học tốt!"` ở một dòng mới.

---

### **Bài 4: Lớp Học Sinh cơ bản**

- **Yêu cầu:** Thiết kế lớp `HocSinh` rỗng (sử dụng từ khóa `pass`). Sau đó tạo một đối tượng (instance) của lớp này có tên `hs1` và in loại kiểu dữ liệu của `hs1` ra màn hình.

---

### **Bài 5: Lớp có constructor định nghĩa thuộc tính**

- **Yêu cầu:** Thiết kế lớp `SinhVien` có hàm khởi tạo `__init__` nhận vào các thông số `ho_ten` và `tuoi`. Tiến hành tạo đối tượng sinh viên với tên là `"Nam"`, `20` tuổi và in thuộc tính của đối tượng.

---

### **Bài 6: Định nghĩa phương thức hoạt động**

- **Yêu cầu:** Tiếp tục nâng cấp lớp `SinhVien` ở Bài 5, thêm phương thức `gioi_thieu(self)` thực hiện in lời chào dạng: `"Tôi tên là [ten], năm nay [tuoi] tuổi"`.

---

### **Bài 7: Lớp tính diện tích hình tròn**

- **Yêu cầu:** Thiết kế lớp `HinhTron` có thuộc tính bán kính `r` lưu giữ bán kính. Định nghĩa phương thức `tinh_dien_tich(self)` trả về diện tích hình tròn ($S = 3.14 \times r^2$).

---

### **Bài 8: Đọc file theo dòng**

- **Yêu cầu:** Tạo một file có tên `danh_sach.txt` chứa danh sách tên các học sinh (mỗi tên trên một dòng). Viết chương trình đọc file này dòng theo dòng và in ra thứ tự kèm tên từng học sinh (ví dụ: `1. An`, `2. Binh`).

---

### **Bài 9: Ghi danh sách số vào tập tin**

- **Yêu cầu:** Ghi các số từ 1 đến 5 vào file `numbers.txt`, mỗi số nằm trên một dòng riêng.

---

### **Bài 10: Đọc số và tính tổng**

- **Yêu cầu:** Đọc file `numbers.txt` cũ, ép kiểu mỗi dòng về số nguyên, cộng dồn tổng và in kết quả ra màn hình.
