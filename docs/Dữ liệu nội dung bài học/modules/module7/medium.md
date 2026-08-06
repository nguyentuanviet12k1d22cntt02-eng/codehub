# Medium

## **10 Bài tập Hướng hàm và Xử lý Ngoại lệ Trung bình**

---

### **Bài 1: Hàm kiểm tra số nguyên tố**

- **Yêu cầu:** Viết hàm `la_so_nguyen_to(n)` trả về `True` nếu n là số nguyên tố, ngược lại trả về `False`.
- **Ví dụ:** `la_so_nguyen_to(7)` -> `True`, `la_so_nguyen_to(4)` -> `False`.

---

### **Bài 2: Hàm tính giai thừa**

- **Yêu cầu:** Viết hàm `giai_thua(n)` tính giai thừa của một số nguyên không âm $n$.
- **Ví dụ:** `giai_thua(5)` trả về `120`.

---

### **Bài 3: Tìm số tốt nhất (Hàm lọc)**

- **Yêu cầu:** Viết hàm `loc_so_lon_hon(lst, nguong)` nhận vào danh sách số và một ngưỡng số `nguong`. Trả về một danh sách mới chỉ chứa các phần tử lớn hơn `nguong`.
- **Ví dụ:** `loc_so_lon_hon([1, 5, 8, 12, 3], 6)` trả về `[8, 12]`.

---

### **Bài 4: Bắt các loại ngoại lệ lồng nhau**

- **Yêu cầu:** Viết hàm `chia_danh_sach(lst, chi_so, chia)` nhận một danh sách, vị trí chỉ số cần lấy, và số chia.
    - Sử dụng một khối `try-except` tổng hợp để bắt lỗi `IndexError` (chỉ số vượt quá dải danh sách) và `ZeroDivisionError` (số chia là 0). In ra thông báo tương ứng cho từng lỗi.

---

### **Bài 5: Tính lãi kép (Compound Interest)**

- **Yêu cầu:** Viết hàm `lai_kep(goc, lai_suat, nam)` tính số tiền tích lũy dựa trên công thức $A = P \times (1 + r)^t$, với $P$ là số tiền gốc, $r$ là lãi suất năm (dạng số thập phân, ví dụ $0.05$ tương đương $5\%$), và $t$ là số năm. Trả về kết quả làm tròn 2 chữ số thập phân.
- **Ví dụ:** `lai_kep(1000, 0.05, 2)` trả về `1102.5`.

---

### **Bài 6: Đếm số ngày giữa hai thời gian với module `datetime`**

- **Yêu cầu:** Nhập hai ngày dưới dạng chuỗi định dạng "YYYY-MM-DD". Sử dụng module `datetime` để chuyển đổi chuỗi thành các đối tượng ngày, tính khoảng cách (số ngày) giữa hai thời điểm và in kết quả.
- **Ví dụ:** Khoảng cách giữa "2023-10-01" và "2023-10-10" là 9 ngày.

---

### **Bài 7: Hàm chuẩn hóa tên người**

- **Yêu cầu:** Viết hàm `chuan_hoa_ten(ten_tho)` nhận vào tên thô (chứa khoảng trắng thừa, viết hoa lộn xộn) và trả về họ tên đã chuẩn hóa (viết hoa chữ cái đầu mỗi từ).
- **Ví dụ:** `chuan_hoa_ten("   nguYen   tUAn  vIET   ")` trả về `"Nguyen Tuan Viet"`.

---

### **Bài 8: Xử lý ngoại lệ KeyError và IndexError**

- **Yêu cầu:** Cho dictionary `kho = {"tao": 5, "cam": 10}`. Viết khối lệnh try-except cho phép tra cứu số lượng quả. Nếu key không tồn tại, in ra "Sản phẩm không có trong kho" thay vì crash chương trình.

---

### **Bài 9: Hàm chào hỏi linh hoạt (Tham số mặc định)**

- **Yêu cầu:** Viết hàm `gui_thu_moi(ten, tieu_de="Lời mời tham quan", dia_diem="Hà Nội")` in ra lời mời. Cho phép người dùng tùy biến hoặc giữ mặc định các tham số.

---

### **Bài 10: Fibonacci thứ N**

- **Yêu cầu:** Viết hàm `fibonacci(n)` tìm số thứ $n$ trong dãy Fibonacci ($F(1) = 1, F(2) = 1, F(3) = 2...$).
- **Ví dụ:** `fibonacci(6)` trả về `8`.
