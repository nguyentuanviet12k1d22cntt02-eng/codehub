# Hard

## **5 Bài tập nâng cao về Set (Tập hợp) và Dictionary**

---

### **Bài 1: Phân tích phần tử trùng và độc nhất giữa 2 danh sách khách hàng**

- **Mô tả:** Cho hai danh sách email đăng ký sự kiện của hai ngày khác nhau: `ngay1` và `ngay2`.
- **Yêu cầu:** Hãy viết chương trình sử dụng **Set** để:
    1. Tìm danh sách tất cả các email đã đăng ký tham gia (không trùng lặp).
    2. Tìm danh sách các email tham gia cả hai ngày.
    3. Tìm danh sách các email chỉ tham gia ngày thứ nhất mà không tham gia ngày thứ hai.
    4. Tìm danh sách các email chỉ tham gia duy nhất một trong hai ngày.
- **Thiết lập ban đầu:**
    
    `ngay1 = ["an@gmail.com", "binh@gmail.com", "cuong@gmail.com"]
    ngay2 = ["binh@gmail.com", "duong@gmail.com", "an@gmail.com"]`
    
- **Ví dụ kiểm thử:**
    - **Dữ liệu trên:**
        - Tất cả email: `{'an@gmail.com', 'binh@gmail.com', 'cuong@gmail.com', 'duong@gmail.com'}`
        - Cả hai ngày: `{'an@gmail.com', 'binh@gmail.com'}`
        - Chỉ ngày 1: `{'cuong@gmail.com'}`
        - Chỉ duy nhất 1 ngày: `{'cuong@gmail.com', 'duong@gmail.com'}`

---

### **Bài 2: Hệ thống quản lý Hashtags bài viết**

- **Mô tả:** Cho một dictionary lưu các bài viết và danh sách hashtag tương ứng: `bai_viet = {"id1": {"python", "code"}, "id2": {"code", "web", "learn"}, "id3": {"python", "data"}}`. Cho một danh sách tag tìm kiếm `tieu_chi = {"python", "code"}`.
- **Yêu cầu:** Hãy tìm ra tất cả ID bài viết thỏa mãn **chứa toàn bộ** các thẻ tag trong `tieu_chi`.
- **Thiết lập ban đầu:**
    
    `bai_viet = {
        "id1": {"python", "code", "dev"},
        "id2": {"code", "web", "learn"},
        "id3": {"python", "data", "code"}
    }
    tieu_chi = {"python", "code"}`
    
- **Ví dụ kiểm thử:**
    - **Input:** `bai_viet`, `tieu_chi` ở trên.
    - **Output:** `['id1', 'id3']` (vì cả hai bài này đề chứa tag "python" và "code").

---

### **Bài 3: Loại bỏ từ trùng và hiển thị sắp xếp**

- **Mô tả:** Nhập vào một dòng văn bản chứa các từ phân cách bằng dấu cách.
- **Yêu cầu:** In ra tất cả các từ duy nhất theo thứ tự chữ cái, cách nhau bằng dấu phẩy.
- **Thiết lập ban đầu:**
    
    `van_ban = "hoc python va hoc code va hoc lap trinh"`
    
- **Ví dụ kiểm thử:**
    - **Input:** `"hoc python va hoc code va hoc lap trinh"`
    - **Output:** `code, hoc, lap, python, trinh, va`

---

### **Bài 4: Phép toán hiệu đối xứng tùy biến**

- **Mô tả:** Cho hai danh sách số nguyên `listA` và `listB`.
- **Yêu cầu:** Hãy in ra các số nguyên xuất hiện ở `listA` hoặc `listB` nhưng **không thuộc về cả hai** (loại bỏ trùng lặp và sắp xếp tăng dần).
- **Thiết lập ban đầu:**
    
    `listA = [1, 2, 3, 4, 4]
    listB = [3, 4, 5, 6, 6]`
    
- **Ví dụ kiểm thử:**
    - **Input:** `listA = [1, 2, 3, 4, 4], listB = [3, 4, 5, 6, 6]`
    - **Output:** `[1, 2, 5, 6]`

---

### **Bài 5: Tìm mối quan hệ bạn chung (Social Network)**

- **Mô tả:** Cho một mạng xã hội đơn giản lưu trữ danh sách bạn bè của từng người dưới dạng dictionary các sets: `friends = {"An": {"Binh", "Cuong", "Dat"}, "Binh": {"An", "Cuong", "Giang"}, "Cuong": {"An", "Binh"}}`.
- **Yêu cầu:** Viết hàm `ban_chung(person1, person2, network)` trả về set chứa danh sách bạn chung của `person1` và `person2`.
- **Thiết lập ban đầu:**
    
    `friends = {
        "An": {"Binh", "Cuong", "Dat"},
        "Binh": {"An", "Cuong", "Giang"},
        "Cuong": {"An", "Binh"}
    }`
    
- **Ví dụ kiểm thử:**
    - **Input:** `ban_chung("An", "Binh", friends)`
    - **Output:** `{'Cuong'}`
