### **Phần 2: Kết hợp kiến thức cũ và mới (5 bài) - Vận dụng `if/else`, `vòng lặp`, `def`**

**Mục tiêu:** Vận dụng linh hoạt các kiến thức đã học cùng với Dictionary để giải quyết các bài toán nhỏ.

---

**Bài 11: Đếm số lần xuất hiện của các từ**

- **Mô tả:** Cho một chuỗi văn bản. Viết một hàm `dem_tu(van_ban)` nhận vào chuỗi văn bản và trả về một dictionary, trong đó key là các từ (viết thường) và value là số lần xuất hiện của từ đó. Các từ được phân tách bằng dấu cách.
- **Input:** `van_ban` (chuỗi)
- **Output:** `dictionary` (các từ và số lần xuất hiện của chúng)
- **Ví dụ:**
    
    **Python**
    
    ```cpp
    # Input:
    # van_ban = "Python la mot ngon ngu lap trinh Python rat pho bien"
    
    # Expected Output (thứ tự các key có thể khác nhau):
    # {'python': 2, 'la': 1, 'mot': 1, 'ngon': 1, 'ngu': 1, 'lap': 1, 'trinh': 1, 'rat': 1, 'pho': 1, 'bien': 1}
    ```
    
- **Gợi ý:** Dùng `.lower()` và `.split()` cho chuỗi. Dùng `if/else` để kiểm tra từ đã có trong dictionary chưa.

---

**Bài 12: Quản lý điểm học sinh**

- **Mô tả:** Viết hàm `cap_nhat_diem(diem_hoc_sinh, ten_hoc_sinh, mon_hoc, diem)` để cập nhật điểm cho học sinh.
    - `diem_hoc_sinh` là một dictionary có cấu trúc: `{ten_hoc_sinh: {mon_hoc: diem, ...}}`.
    - Nếu học sinh chưa có trong `diem_hoc_sinh`, thêm học sinh đó và điểm môn học.
    - Nếu học sinh đã có, cập nhật điểm cho môn học đó.
    - Hàm trả về dictionary đã được cập nhật.
- **Input:**
    - `diem_hoc_sinh`: dictionary
    - `ten_hoc_sinh`: chuỗi
    - `mon_hoc`: chuỗi
    - `diem`: số
- **Output:** `dictionary` đã cập nhật.
- **Ví dụ:**
    
    **Python**
    
    ```cpp
    # Initial:
    # diem_goc = {"An": {"Toan": 8, "Van": 7}}
    
    # Call 1:
    # diem_cap_nhat = cap_nhat_diem(diem_goc, "An", "Ly", 9)
    # Expected Output (diem_cap_nhat): {"An": {"Toan": 8, "Van": 7, "Ly": 9}}
    
    # Call 2:
    # diem_cap_nhat = cap_nhat_diem(diem_cap_nhat, "Binh", "Toan", 7.5)
    # Expected Output (diem_cap_nhat): {"An": {"Toan": 8, "Van": 7, "Ly": 9}, "Binh": {"Toan": 7.5}}
    ```
    
- **Gợi ý:** Sử dụng `.get()` hoặc kiểm tra `in` để xử lý các trường hợp học sinh/môn học chưa có.

---

**Bài 13: Đếm số lượng phần tử duy nhất trong danh sách**

- **Mô tả:** Viết hàm `dem_phan_tu_duy_nhat(danh_sach)` nhận vào một list các phần tử. Hàm trả về một dictionary, trong đó key là phần tử duy nhất và value là số lần xuất hiện của phần tử đó trong danh sách.
- **Input:** `danh_sach` (list)
- **Output:** `dictionary` (phần tử: số lần xuất hiện)
- **Ví dụ:**
    
    **Python**
    
    ```cpp
    # Input:
    # danh_sach_so = [1, 2, 2, 3, 1, 4, 2, 5]
    
    # Expected Output (thứ tự các key có thể khác nhau):
    # {1: 2, 2: 3, 3: 1, 4: 1, 5: 1}
    ```
    
- **Gợi ý:** Lặp qua list, dùng `if/else` để kiểm tra và cập nhật dictionary.

---

**Bài 14: Tìm giá trị lớn nhất/nhỏ nhất trong Dictionary**

- **Mô tả:** Viết hàm `tim_san_pham_gia_cao_nhat(danh_sach_san_pham)` nhận vào một dictionary có cấu trúc `{"ma_sp": {"ten": "...", "gia": ...}}`. Hàm trả về tên của sản phẩm có giá cao nhất. (Giả sử luôn có ít nhất một sản phẩm).
- **Input:** `danh_sach_san_pham` (dictionary)
- **Output:** `string` (tên sản phẩm)
- **Ví dụ:**
    
    **Python**
    
    ```cpp
    # Input:
    # san_pham_kho = {
    #     "SP001": {"ten": "Chuột", "gia": 200000},
    #     "SP002": {"ten": "Bàn phím", "gia": 700000},
    #     "SP003": {"ten": "Màn hình", "gia": 2500000}
    # }
    
    # Expected Output:
    # "Màn hình"
    ```
    
- **Gợi ý:** Khởi tạo một biến `max_gia` và `ten_san_pham_max`. Lặp qua `.items()` hoặc `.values()` của dictionary để tìm giá trị lớn nhất và cập nhật tên sản phẩm tương ứng.

---

**Bài 15: Chuyển đổi List of Dictionaries sang Dictionary**

- **Mô tả:** Viết hàm `chuyen_doi_danh_sach(danh_sach_dict)` nhận vào một list các dictionary. Mỗi dictionary trong list có key `"id"` duy nhất. Hàm trả về một dictionary mới, trong đó `key` là giá trị của `"id"` và `value` là toàn bộ dictionary gốc đó.
- **Input:** `danh_sach_dict` (list các dictionary)
- **Output:** `dictionary` (id: dictionary gốc)
- **Ví dụ:**
    
    **Python**
    
    ```cpp
    # Input:
    # users = [
    #     {"id": 101, "name": "Alice", "age": 30},
    #     {"id": 102, "name": "Bob", "age": 24},
    #     {"id": 103, "name": "Charlie", "age": 35}
    # ]
    
    # Expected Output:
    # {
    #     101: {"id": 101, "name": "Alice", "age": 30},
    #     102: {"id": 102, "name": "Bob", "age": 24},
    #     103: {"id": 103, "name": "Charlie", "age": 35}
    # }
    ```
    
- **Gợi ý:** Dùng vòng lặp `for` để duyệt qua từng dictionary trong list. Lấy giá trị của key `"id"` để làm key cho dictionary kết quả.

**Bài 16: Đảo ngược dictionary (có trùng value)**

Cho dictionary:

d = {'a': 1, 'b': 2, 'c': 1}

Hãy đảo key ↔ value, nhưng:

- Nếu trùng value → gom thành list

Kết quả:

{1: ['a', 'c'], 2: ['b']}