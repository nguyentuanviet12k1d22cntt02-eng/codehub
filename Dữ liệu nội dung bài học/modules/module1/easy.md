## Giai đoạn 1: Phép toán & Biến cơ bản (10 bài)

**Mục tiêu:**

- Nắm vững cách **khai báo và gán giá trị** cho biến.

```python
Thực hiện thành thạo các **phép toán số học cơ bản** (+, *,/, //, %).
```

- Hiểu **thứ tự ưu tiên** của các phép toán.
- **In kết quả** ra màn hình theo đúng định dạng yêu cầu.

---

### Bài 1: Tính tổng hai số

- **Mô tả:** Viết chương trình nhận vào hai số nguyên `a` và `b`. Tính và in ra **tổng** của chúng.
- **Input:**
    - Hai số nguyên `a` và `b` được cung cấp.
- **Output:**
    - Một số nguyên duy nhất là tổng của `a` và `b`.
- **Ví dụ:**
    
    ```python
    # Input:
    # a = 5
    # b = 3
    # Output:
    # 8
    ```
    
- **Giải thích ví dụ:** 5+3=8.

---

### Bài 2: Tính hiệu hai số

- **Mô tả:** Viết chương trình nhận vào hai số nguyên `a` và `b`. Tính và in ra **hiệu** của `a` trừ `b`.
- **Input:**
    - Hai số nguyên `a` và `b` được cung cấp.
- **Output:**
    - Một số nguyên duy nhất là hiệu của `a` và `b`.
- **Ví dụ:**
    
    ```python
    # Input:
    # a = 10
    # b = 4
    # Output:
    # 6
    ```
    
- **Giải thích ví dụ:** 10−4=6.

---

### Bài 3: Tính tích ba số

- **Mô tả:** Viết chương trình nhận vào ba số nguyên `x`, `y`, và `z`. Tính và in ra **tích** của chúng.
- **Input:**
    - Ba số nguyên `x`, `y`, và `z` được cung cấp.
- **Output:**
    - Một số nguyên duy nhất là tích của `x`, `y`, và `z`.
- **Ví dụ:**
    
    ```python
    # Input:
    # x = 2
    # y = 3
    # z = 4
    # Output:
    # 24
    ```
    
- **Giải thích ví dụ:** 2×3×4=24.

---

### Bài 4: Tính thương nguyên và phần dư

- **Mô tả:** Viết chương trình nhận vào hai số nguyên `so_bi_chia` và `so_chia`. Tính và in ra **thương nguyên** và **phần dư** của phép chia `so_bi_chia` cho `so_chia`. (Giả sử `so_chia` luôn khác 0).
- **Input:**
    - Hai số nguyên `so_bi_chia` và `so_chia` được cung cấp.
- **Output:**
    - Dòng 1: Thương nguyên.
    - Dòng 2: Phần dư.
- **Ví dụ:**
    
    ```python
    # Input:
    # so_bi_chia = 17
    # so_chia = 5
    # Output:
    # 3
    # 2
    ```
    
- **Giải thích ví dụ:** 17÷5 được thương là 3 và dư 2.

---

### Bài 5: Tính chu vi và diện tích hình chữ nhật

- **Mô tả:** Viết chương trình nhận vào chiều dài `dai` và chiều rộng `rong` của một hình chữ nhật. Tính và in ra **chu vi** và **diện tích** của nó.
- **Input:**
    - Hai số thực `dai` và `rong` được cung cấp.
- **Output:**
    - Dòng 1: Chu vi của hình chữ nhật (số thực).
    - Dòng 2: Diện tích của hình chữ nhật (số thực).
- **Ví dụ:**
    
    ```python
    # Input:
    # dai = 5.0
    # rong = 3.0
    # Output:
    # 16.0
    # 15.0
    ```
    
- **Giải thích ví dụ:**
    - Chu vi: 2×(5.0+3.0)=2×8.0=16.0.
    - Diện tích: 5.0×3.0=15.0.

---

### Bài 6: Chuyển đổi nhiệt độ từ Celsius sang Fahrenheit

- **Mô tả:** Viết chương trình nhận vào nhiệt độ `C` theo độ Celsius. Chuyển đổi và in ra nhiệt độ đó sang độ Fahrenheit.3223
- **Công thức:** F=C×9/5+32
- **Input:**
    - Một số thực `C` (nhiệt độ Celsius) được cung cấp.
- **Output:**
    - Một số thực duy nhất là nhiệt độ theo độ Fahrenheit.
- **Ví dụ:**
    
    ```python
    # Input:
    # C = 25.0
    # Output:
    # 77.0
    ```
    
- **Giải thích ví dụ:** 25.0×9/5+32=45+32=77.0.

---

### Bài 7: Tính tổng tiền mua hàng

- **Mô tả:** Một người mua 3 loại mặt hàng. Viết chương trình nhận vào số lượng và đơn giá của từng loại mặt hàng A, B, C. Tính và in ra **tổng số tiền** người đó phải trả.
- **Input:**
    - `so_luong_A`, `don_gia_A` (số nguyên)
    - `so_luong_B`, `don_gia_B` (số nguyên)
    - `so_luong_C`, `don_gia_C` (số nguyên)
- **Output:**
    - Một số nguyên duy nhất là tổng số tiền phải trả.
- **Ví dụ:**
    
    ```python
    # Input:
    # so_luong_A = 2, don_gia_A = 10000
    # so_luong_B = 1, don_gia_B = 50000
    # so_luong_C = 3, don_gia_C = 5000
    # Output:
    # 85000
    ```
    
- **Giải thích ví dụ:** (2×10000)+(1×50000)+(3×5000)=20000+50000+15000=85000.

---

### Bài 8: Tính điểm trung bình của ba môn

- **Mô tả:** Viết chương trình nhận vào điểm ba môn học: `diem_toan`, `diem_ly`, `diem_hoa`. Tính và in ra **điểm trung bình cộng** của ba môn này.
- **Input:**
    - Ba số thực `diem_toan`, `diem_ly`, `diem_hoa` được cung cấp.
- **Output:**
    - Một số thực duy nhất là điểm trung bình.
- **Ví dụ:**
    
    ```python
    # Input:
    # diem_toan = 8.5
    # diem_ly = 7.0
    # diem_hoa = 9.0
    # Output:
    # 8.166666666666666
    ```
    
- **Giải thích ví dụ:** (8.5+7.0+9.0)/3=24.5/3≈8.166....

---

### Bài 9: Hoán đổi giá trị hai biến

- **Mô tả:** Viết chương trình nhận vào hai số nguyên `x` và `y`. **Hoán đổi** giá trị của chúng (nghĩa là giá trị của `x` sẽ trở thành giá trị của `y` và ngược lại). In ra giá trị mới của `x` và `y`. (Yêu cầu sử dụng một biến tạm để thực hiện hoán đổi).
- **Input:**
    - Hai số nguyên `x` và `y` được cung cấp.
- **Output:**
    - Dòng 1: Giá trị mới của `x`.
        
        ```python
        # Input:
        # x = 10
        # y = 20
        # Output:
        # 20
        # 10
        ```
        
    - Dòng 2: Giá trị mới của `y`.
- **Ví dụ:**
- **Giải thích ví dụ:** Ban đầu x=10,y=20. Sau khi hoán đổi, x trở thành 20 và y trở thành 10.

---

### Bài 10: Tính giá trị biểu thức số học

- **Mô tả:** Viết chương trình nhận vào ba số thực `a`, `b`, `c`. Tính và in ra giá trị của biểu thức: (a+b)×c−(a/b). (Giả sử `b` luôn khác 0).
- **Input:**
    - Ba số thực `a`, `b`, `c` được cung cấp.
- **Output:**
    - Một số thực duy nhất là kết quả của biểu thức.
- **Ví dụ:**
    
    ```python
    # Input:
    # a = 6.0
    # b = 2.0
    # c = 3.0
    # Output:
    # 21.0
    ```
    
- **Giải thích ví dụ:** (6.0+2.0)×3.0−(6.0/2.0)=8.0×3.0−3.0=24.0−3.0=21.0.