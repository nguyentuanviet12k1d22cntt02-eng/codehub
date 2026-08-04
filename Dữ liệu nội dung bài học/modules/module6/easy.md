## **Bài tập Dictionary (Từ điển) trong Python**

### **Phần 1: Làm quen với Dictionary**

**Mục tiêu:** Hiểu cách tạo, truy cập, thêm, sửa, xóa và lặp cơ bản với Dictionary.

**Bài 1: Tạo Dictionary và truy cập giá trị**

- **Mô tả:** Tạo một dictionary lưu trữ thông tin của một người với các key `"ten"`, `"tuoi"`, `"thanh_pho"`. Sau đó, in ra tên và thành phố của người đó.
- **Input:** Không có (tạo dictionary cố định trong code).
- **Output:**
    
    `Tên: [Tên người]
    Thành phố: [Thành phố]`
    
- **Ví dụ:**
    
    **Python**
    
    `# Input (trong code):
    # thong_tin_nguoi = {"ten": "An", "tuoi": 25, "thanh_pho": "Hà Nội"}
    
    # Output:
    # Tên: An
    # Thành phố: Hà Nội`
    

---

**Bài 2: Thêm cặp key-value mới**

- **Mô tả:** Cho một dictionary `sinh_vien = {"ma_sv": "SV001", "ten": "Bình"}`. Thêm key `"lop"` với giá trị `"K21"` và key `"diem_tb"` với giá trị `8.8` vào dictionary này. Sau đó in toàn bộ dictionary.
- **Input:** Không có.
- **Output:**
    
    `{'ma_sv': 'SV001', 'ten': 'Bình', 'lop': 'K21', 'diem_tb': 8.8}`
    

---

**Bài 3: Sửa đổi giá trị**

- **Mô tả:** Cho dictionary `san_pham = {"ten": "Laptop", "gia": 15000000, "so_luong": 5}`. Cập nhật `gia` thành `14500000` và `so_luong` thành `7`. Sau đó in toàn bộ dictionary.
- **Input:** Không có.
- **Output:**
    
    `{'ten': 'Laptop', 'gia': 14500000, 'so_luong': 7}`
    

---

**Bài 4: Xóa cặp key-value**

- **Mô tả:** Cho dictionary `cau_hinh = {"CPU": "i7", "RAM": "16GB", "SSD": "512GB", "VGA": "RTX 3060"}`. Xóa key `"VGA"`. Sau đó in toàn bộ dictionary.
- **Input:** Không có.
- **Output:**
    
    `{'CPU': 'i7', 'RAM': '16GB', 'SSD': '512GB'}`
    

---

**Bài 5: Kiểm tra sự tồn tại của key**

- **Mô tả:** Cho dictionary `thoi_tiet = {"Ha Noi": "Mưa", "Sai Gon": "Nắng"}`. Kiểm tra xem key `"Da Nang"` có trong dictionary không. In ra thông báo thích hợp.
- **Input:** Không có.
- **Output:**
    
    `Có thông tin thời tiết của Da Nang. (hoặc) Không có thông tin thời tiết của Da Nang.`
    

---

**Bài 6: Lặp qua các key**

- **Mô tả:** Cho dictionary `khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}` (tên khóa học: số lượng học viên). In ra tất cả các tên khóa học (chỉ key).
- **Input:** Không có.
- **Output:**
    
    `Python
    Java
    C++`
    

---

**Bài 7: Lặp qua các value**

- **Mô tả:** Cho dictionary `khoa_hoc` như bài 6. In ra tất cả số lượng học viên (chỉ value).
- **Input:** Không có.
- **Output:**
    
    `10
    8
    7`
    

---

**Bài 8: Lặp qua cả key và value**

- **Mô tả:** Cho dictionary `khoa_hoc` như bài 6. In ra từng cặp "Tên khóa học: Số lượng học viên".
- **Input:** Không có.
- **Output:**
    
    `Python: 10
    Java: 8
    C++: 7`
    

---

**Bài 9: Sử dụng `.get()` với giá trị mặc định**

- **Mô tả:** Cho dictionary `diem_thi = {"Toan": 9, "Ly": 8}`. Lấy điểm môn "Hoa". Nếu môn "Hoa" không có, trả về `0`. In ra điểm môn "Hoa".
- **Input:** Không có.
- **Output:**
    
    `Điểm môn Hoa: 0`
    

---

**Bài 10: Kích thước của Dictionary**

- **Mô tả:** Cho dictionary `danh_ba = {"An": "0912345678", "Binh": "0987654321", "Cuong": "0909090909"}`. In ra tổng số liên lạc trong danh bạ.
- **Input:** Không có.
- **Output:**
    
    `Tổng số liên lạc: 3`