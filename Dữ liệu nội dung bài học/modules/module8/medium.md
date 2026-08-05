# Medium

## **10 Bài tập Tệp tin và OOP Trung bình**

---

### **Bài 1: Đếm số lượng từ trong tập tin văn bản**

- **Yêu cầu:** Viết chương trình đọc một file văn bản bất kỳ có tên `doc.txt` và đếm tổng số lượng từ (đầu từ cách nhau bằng dấu trắng) trong tập tin đó.

---

### **Bài 2: Sao chép tệp văn bản**

- **Yêu cầu:** Viết mã sao chép toàn bộ nội dung từ file `source.txt` sang file mới tên là `backup.txt` bằng cách đọc dòng theo dòng gốc.

---

### **Bài 3: Lớp Nhân viên tính lương thực lĩnh**

- **Yêu cầu:** Thiết kế lớp `NhanVien` có các thuộc tính: `ten`, `luong_co_ban`, và `he_so_luong`.
    - Viết phương thức `tinh_luong(self)` trả về số lương thực lĩnh: `luong = luong_co_ban * he_so_luong`.
    - Viết phương thức hiển thị thông tin chi tiết của nhân viên.

---

### **Bài 4: Lớp Phân Số (Fraction)**

- **Yêu cầu:** Thiết kế lớp `PhanSo` có thuộc tính `tu_so` và `mau_so`.
    - Viết hàm constructor kiểm tra mẫu số khác `0`.
    - Viết phương thức `rut_gon(self)` để tối giản phân số. (Gợi ý: Tìm ucln của tử và mẫu rồi chia cả hai cho ucln).

---

### **Bài 5: Lập trình kế thừa Động vật kêu**

- **Yêu cầu:** 
    - Định nghĩa lớp cha `DongVat` có phương thức `keu(self)` in ra `"Động vật đang phát tiếng kêu"`.
    - Định nghĩa 2 lớp con `Cho` và `Meo` kế thừa từ `DongVat` và ghi đè (override) phương thức `keu(self)` thành `"Gâu gâu"` và `"Meo meo"`.
    - Tạo các đối tượng và gọi phương thức hoạt động.

---

### **Bài 6: Xử lý tệp dữ liệu CSV kiểu mộc**

- **Yêu cầu:** Cho một file `diem.csv` chứa điểm thi của sinh viên dưới dạng:
    
    `An,8,9
    Binh,7,6
    Chi,10,9`
    
    - Viết chương trình đọc file này, tính điểm trung bình của mỗi sinh viên và in ra dạng bảng đẹp.

---

### **Bài 7: Lớp Tài khoản ngân hàng (Account)**

- **Yêu cầu:** Thiết kế lớp `TaiKhoan` có thuộc tính `chu_tai_khoan` và `so_du`.
    - Phương thức `nap_tien(self, so_tien)` thực hiện cộng thêm vào số dư.
    - Phương thức `rut_tien(self, so_tien)` thực hiện trừ đi số dư nếu đủ tiền mặt, ngược lại thông báo lỗi và không trừ tiền.

---

### **Bài 8: Kiểm tra và tính chu vi Tam giác**

- **Yêu cầu:** Thiết kế lớp `TamGiac` nhận vào 3 cạnh `a`, `b`, `c`.
    - Hàm constructor kiểm tra xem 3 cạnh có lập thành tam giác hợp lệ không ($a+b>c$, $a+c>b$, $b+c>a$). Nếu không hợp lệ, ném ra lỗi `ValueError`.
    - Viết phương thức `tinh_chu_vi(self)` và `tinh_dien_tich(self)` (sử dụng công thức Heron).

---

### **Bài 9: Ghi đè biểu thức biểu diễn đối tượng (`__str__`)**

- **Yêu cầu:** Thiết kế lớp `Book` có `title`, `author`. Ghi đè phương thức magic `__str__(self)` trả về chuỗi định dạng: `"[Tiêu đề sách] - tác giả [Tác giả]"`.

---

### **Bài 10: Đọc tệp, lọc dữ liệu và xuất báo cáo**

- **Yêu cầu:** Cho file `diem_sinh_vien.txt` lưu thông tin mỗi học sinh gồm: Tên và Điểm toán học, cách nhau bằng dấu phẩy.
    - Viết chương trình đọc từ file, lọc ra các sinh viên có điểm từ `8.0` trở lên, sau đó ghi danh sách sinh viên ưu tú này vào file mới có tên `hoc_sinh_tot.txt`.
