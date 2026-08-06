# Hard

## **5 Bài tập nâng cao về Hàm và Xử lý Ngoại lệ**

---

### **Bài 1: Thuật toán Tìm kiếm Nhị phân (Binary Search)**

- **Mô tả:** Cho một danh sách số nguyên đã được sắp xếp tăng dần và một số nguyên `x`.
- **Yêu cầu:** Viết hàm đệ quy `BinarySearch(lst, x, low, high)` trả về chỉ số của `x` trong danh sách `lst`. Nếu không tìm thấy, trả về `-1`.
- **Thiết lập ban đầu:**
    
    `arr = [2, 3, 4, 10, 40]
    target = 10`
    
- **Ví dụ kiểm thử:**
    - **Input:** `BinarySearch(arr, 10, 0, len(arr)-1)` **Output:** `3`
    - **Input:** `BinarySearch(arr, 5, 0, len(arr)-1)` **Output:** `-1`

---

### **Bài 2: Custom Exception - Lỗi số âm**

- **Mô tả:** Lập trình viên cần kiểm soát việc nhập tuổi của học viên. Tuổi không được phép là số âm.
- **Yêu cầu:**
    1. Tạo một lớp ngoại lệ tự định nghĩa có tên `SoAmError` kế thừa từ `Exception`.
    2. Viết kiểm tra điều kiện trong hàm `nhap_tuoi(tuoi)`. Nếu `tuoi < 0`, ném ra lỗi `SoAmError` bằng từ khóa `raise`.
    3. Trong khối code chính, gọi hàm `nhap_tuoi` với giá trị kiểm tra và dùng `try-except` để bắt `SoAmError`, in ra thông báo tương ứng.

---

### **Bài 3: Giao dịch rút tiền ATM an toàn**

- **Mô tả:** Cho số dư ban đầu `so_du = 10000000` (10 triệu) và hạn mức rút tối đa mỗi lần là `5000000` (5 triệu).
- **Yêu cầu:** Viết hàm `rut_tien(so_tien)` thực thi việc rút tiền.
    - Ném ra `ValueError` nếu số tiền gửi yêu cầu không phải là bội số của `50000` hoặc nhỏ hơn `50000`.
    - Ném ra một custom exception `SoDuKhongDuError` nếu số tiền rút lớn hơn số dư hiện hữu.
    - Ném ra custom exception `VuotHanMucError` nếu số tiền rút vượt quá hạn mức tối đa mỗi lần.
    - Bắt toàn bộ lỗi và in ra các thông điệp thích hợp giúp chương trình không bị tắt.

---

### **Bài 4: Tự thiết kế thư viện toán học riêng và nạp**

- **Mô tả:** Yêu cầu tổ chức mã nguồn thành cấu trúc thư mục gồm 2 file:
    - File thứ nhất `my_math.py`: chứa hàm `tinh_ucln(a, b)` (ước chung lớn nhất) và `tinh_bcnn(a, b)` (bội chung nhỏ nhất).
    - File thứ hai `main.py`: import 2 hàm từ file `my_math.py` để tính toán và in kết quả.

---

### **Bài 5: Khử trùng lặp chuỗi dùng đệ quy**

- **Mô tả:** Cho một chuỗi ký tự bất kỳ.
- **Yêu cầu:** Viết một hàm đệ quy `loai_bo_trung_lap_ke_tiep(s)` loại bỏ các ký tự trùng nhau đứng cạnh nhau trong chuỗi (ví dụ: `"abbaca"` -> `"abaca"` -> `"aca"`).
- **Ví dụ kiểm thử:**
    - **Input:** `"abbaca"` **Output:** `"ca"` (sau khi loại bỏ "bb" còn "aaca", loại bỏ "aa" còn "ca").
