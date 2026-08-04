# Easy

## **10 Bài tập `if-else`**

---

### **Bài 1: Kiểm tra tính hợp lệ của tuổi và điểm**

- **Mô tả:** Cho tuổi `tuoi` và điểm số `diem`. Kiểm tra xem một người có đủ điều kiện để tham gia một cuộc thi hay không.
- **Yêu cầu:** In ra "Đủ điều kiện tham gia" nếu **tuổi từ 18 trở lên AND điểm số từ 70 trở lên**. Ngược lại, in ra "Không đủ điều kiện tham gia".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `tuoi = 20 # Thay đổi giá trị này
    diem = 85 # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `tuoi = 25, diem = 90` **Output:** `Đủ điều kiện tham gia`
    - **Input:** `tuoi = 17, diem = 80` **Output:** `Không đủ điều kiện tham gia`
    - **Input:** `tuoi = 18, diem = 65` **Output:** `Không đủ điều kiện tham gia`
    - **Input:** `tuoi = 18, diem = 70` **Output:** `Đủ điều kiện tham gia`

---

### **Bài 2: Xác định loại số phức tạp**

- **Mô tả:** Cho một số nguyên `num`. Xác định tính chất của số đó.
- **Yêu cầu:**
    - Nếu `num` là **số dương VÀ là số chẵn**, in ra "Số dương chẵn".
    - Nếu `num` là **số dương VÀ là số lẻ**, in ra "Số dương lẻ".
    - Nếu `num` là **số âm**, in ra "Số âm".
    - Nếu `num` là **0**, in ra "Số 0".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `num = -5 # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `num = 4` **Output:** `Số dương chẵn`
    - **Input:** `num = 7` **Output:** `Số dương lẻ`
    - **Input:** `num = -3` **Output:** `Số âm`
    - **Input:** `num = 0` **Output:** `Số 0`

---

### **Bài 3: Quyết định mở/đóng cửa hàng theo giờ và ngày**

- **Mô tả:** Cho giờ hiện tại `gio_hien_tai` (số nguyên từ 0 đến 23) và `la_cuoi_tuan` (boolean, `True` nếu là cuối tuần, `False` nếu không). Cửa hàng mở cửa từ 9h đến 18h các ngày trong tuần, và đóng cửa vào cuối tuần.
- **Yêu cầu:** In ra "Cửa hàng đang mở" hoặc "Cửa hàng đang đóng".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `gio_hien_tai = 10 # Thay đổi giá trị này
    la_cuoi_tuan = False # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `gio_hien_tai = 12, la_cuoi_tuan = False` **Output:** `Cửa hàng đang mở`
    - **Input:** `gio_hien_tai = 8, la_cuoi_tuan = False` **Output:** `Cửa hàng đang đóng`
    - **Input:** `gio_hien_tai = 19, la_cuoi_tuan = False` **Output:** `Cửa hàng đang đóng`
    - **Input:** `gio_hien_tai = 12, la_cuoi_tuan = True` **Output:** `Cửa hàng đang đóng`

---

### **Bài 4: Xác định loại nhiệt độ**

- **Mô tả:** Cho nhiệt độ `temp` (số nguyên).
- **Yêu cầu:**
    - Nếu `temp` lớn hơn hoặc bằng 30, in ra "Rất nóng".
    - Nếu `temp` từ 20 đến 29 (bao gồm), in ra "Ấm áp".
    - Nếu `temp` từ 10 đến 19 (bao gồm), in ra "Mát mẻ".
    - Ngược lại (dưới 10), in ra "Lạnh".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `temp = 15 # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `temp = 35` **Output:** `Rất nóng`
    - **Input:** `temp = 25` **Output:** `Ấm áp`
    - **Input:** `temp = 10` **Output:** `Mát mẻ`
    - **Input:** `temp = 5` **Output:** `Lạnh`

---

### **Bài 5: Kiểm tra số có 2 chữ số**

- **Mô tả:** Cho một số nguyên `so`. Kiểm tra xem số đó có phải là số có hai chữ số hay không (từ 10 đến 99 hoặc từ -99 đến -10).
- **Yêu cầu:** In ra "Đây là số có hai chữ số" nếu đúng. Ngược lại, in ra "Đây KHÔNG phải là số có hai chữ số".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `so = 42 # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `so = 25` **Output:** `Đây là số có hai chữ số`
    - **Input:** `so = 7` **Output:** `Đây KHÔNG phải là số có hai chữ số`
    - **Input:** `so = 100` **Output:** `Đây KHÔNG phải là số có hai chữ số`
    - **Input:** `so = -55` **Output:** `Đây là số có hai chữ số`
    - **Input:** `so = -5` **Output:** `Đây KHÔNG phải là số có hai chữ số`

---

### **Bài 6: Xác định loại hình học (Tam giác cân/đều)**

- **Mô tả:** Cho ba cạnh của một tam giác `canh1`, `canh2`, `canh3`.
- **Yêu cầu:**
    - Nếu ba cạnh bằng nhau, in ra "Tam giác đều".
    - Nếu có ít nhất hai cạnh bằng nhau (nhưng không phải cả ba), in ra "Tam giác cân".
    - Ngược lại, in ra "Tam giác thường".
    - (Bỏ qua điều kiện kiểm tra tam giác hợp lệ để tập trung vào if-else).
- **Thiết lập ban đầu:**
    
    **Python**
    
    `canh1 = 5 # Thay đổi giá trị này
    canh2 = 5 # Thay đổi giá trị này
    canh3 = 3 # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `canh1 = 3, canh2 = 3, canh3 = 3` **Output:** `Tam giác đều`
    - **Input:** `canh1 = 4, canh2 = 4, canh3 = 5` **Output:** `Tam giác cân`
    - **Input:** `canh1 = 6, canh2 = 8, canh3 = 10` **Output:** `Tam giác thường`
    - **Input:** `canh1 = 5, canh2 = 3, canh3 = 5` **Output:** `Tam giác cân`

---

### **Bài 7: Kiểm tra ký tự đầu tiên của chuỗi**

- **Mô tả:** Cho một chuỗi `ten`. Kiểm tra ký tự đầu tiên của chuỗi đó.
- **Yêu cầu:**
    - Nếu ký tự đầu tiên là 'A' hoặc 'a', in ra "Tên bắt đầu bằng chữ A".
    - Ngược lại, in ra "Tên KHÔNG bắt đầu bằng chữ A".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `ten = "An" # Thay đổi giá trị này (ví dụ: "Binh", "Alice")`
    
- **Ví dụ kiểm thử:**
    - **Input:** `ten = "An"` **Output:** `Tên bắt đầu bằng chữ A`
    - **Input:** `ten = "Alice"` **Output:** `Tên bắt đầu bằng chữ A`
    - **Input:** `ten = "Binh"` **Output:** `Tên KHÔNG bắt đầu bằng chữ A`
    - **Input:** `ten = "apple"` **Output:** `Tên bắt đầu bằng chữ A`

---

### **Bài 8: Quyết định xem phim theo tuổi và thể loại**

- **Mô tả:** Cho tuổi của người xem `tuoi_xem` và thể loại phim `the_loai` (chuỗi: "kinh dị", "hành động", "hài hước").
    - Phim kinh dị yêu cầu tuổi từ 18 trở lên.
    - Phim hành động yêu cầu tuổi từ 13 trở lên.
    - Phim hài hước không giới hạn tuổi.
- **Yêu cầu:** In ra "Có thể xem phim" hoặc "Không thể xem phim".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `tuoi_xem = 15 # Thay đổi giá trị này
    the_loai = "hành động" # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `tuoi_xem = 20, the_loai = "kinh dị"` **Output:** `Có thể xem phim`
    - **Input:** `tuoi_xem = 15, the_loai = "kinh dị"` **Output:** `Không thể xem phim`
    - **Input:** `tuoi_xem = 12, the_loai = "hành động"` **Output:** `Không thể xem phim`
    - **Input:** `tuoi_xem = 15, the_loai = "hành động"` **Output:** `Có thể xem phim`
    - **Input:** `tuoi_xem = 10, the_loai = "hài hước"` **Output:** `Có thể xem phim`

---

### **Bài 9: Phân loại điểm số chi tiết**

- **Mô tả:** Cho điểm số `diem`. Phân loại học lực chi tiết.
- **Yêu cầu:**
    - Nếu `diem` từ 90 trở lên, in ra "Xuất sắc".
    - Nếu `diem` từ 80 đến 89, in ra "Giỏi".
    - Nếu `diem` từ 70 đến 79, in ra "Khá".
    - Nếu `diem` từ 50 đến 69, in ra "Trung bình".
    - Ngược lại (dưới 50), in ra "Yếu".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `diem = 78 # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `diem = 95` **Output:** `Xuất sắc`
    - **Input:** `diem = 82` **Output:** `Giỏi`
    - **Input:** `diem = 70` **Output:** `Khá`
    - **Input:** `diem = 65` **Output:** `Trung bình`
    - **Input:** `diem = 45` **Output:** `Yếu`

---

### **Bài 10: Kiểm tra trạng thái nước**

- **Mô tả:** Cho nhiệt độ của nước `nhiet_do_nuoc` (số nguyên). Biết rằng nước đóng băng ở 0 độ C và sôi ở 100 độ C.
- **Yêu cầu:**
    - Nếu `nhiet_do_nuoc` nhỏ hơn hoặc bằng 0, in ra "Nước ở thể rắn (đóng băng)".
    - Nếu `nhiet_do_nuoc` lớn hơn 0 VÀ nhỏ hơn 100, in ra "Nước ở thể lỏng".
    - Nếu `nhiet_do_nuoc` lớn hơn hoặc bằng 100, in ra "Nước ở thể khí (hơi nước)".
- **Thiết lập ban đầu:**
    
    **Python**
    
    `nhiet_do_nuoc = 50 # Thay đổi giá trị này`
    
- **Ví dụ kiểm thử:**
    - **Input:** `nhiet_do_nuoc = -5` **Output:** `Nước ở thể rắn (đóng băng)`
    - **Input:** `nhiet_do_nuoc = 0` **Output:** `Nước ở thể rắn (đóng băng)`
    - **Input:** `nhiet_do_nuoc = 25` **Output:** `Nước ở thể lỏng`
    - **Input:** `nhiet_do_nuoc = 99` **Output:** `Nước ở thể lỏng`
    - **Input:** `nhiet_do_nuoc = 100` **Output:** `Nước ở thể khí (hơi nước)`
    - **Input:** `nhiet_do_nuoc = 120` **Output:** `Nước ở thể khí (hơi nước)`