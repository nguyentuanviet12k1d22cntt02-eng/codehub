### **Bài tập 1: Đếm số lượng số chẵn và lẻ từ 1 đến n**

- **Mô tả**:
Nhập một số nguyên dương n và đếm số lượng số chẵn và số lẻ từ 1 đến n.
- **Input**:
Một số nguyên dương n (ví dụ: 10).
- **Output**:
Số lượng số chẵn và số lẻ từ 1 đến n (ví dụ: "Số chẵn: 5, Số lẻ: 5").

### **Bài 2: Tính tổng các số chẵn**

- **Mô tả**: Nhập một số nguyên dương `n` và tính tổng các số chẵn từ 1 đến `n`.
- **Input**: Một số nguyên dương `n` (ví dụ: 10).
- **Output**: Tổng các số chẵn từ 1 đến `n` (ví dụ: 30, vì 2 + 4 + 6 + 8 + 10 = 30).
- **Gợi ý**: Dùng vòng lặp `for` từ 1 đến `n`, dùng `if` để kiểm tra số chẵn (`số % 2 == 0`), rồi cộng vào biến tổng.

### **Bài 3: Tìm số lớn nhất trong danh sách**

- **Mô tả**: Nhập số lượng phần tử và danh sách các số nguyên, sau đó tìm số lớn nhất.
- **Input**: Số lượng phần tử `n`, rồi `n` số nguyên (ví dụ: 5, rồi 3 1 4 1 5).
- **Output**: Số lớn nhất (ví dụ: 5).
- **Gợi ý**: Khởi tạo biến `max_value` bằng số đầu tiên, dùng vòng lặp `for` để so sánh từng số với `max_value`, nếu lớn hơn thì cập nhật lại `max_value`.

### **Bài 4: In bảng cửu chương**

- **Mô tả**: Nhập một số nguyên dương `n` và in bảng cửu chương từ 1 đến `n`.
- **Input**: Một số nguyên dương `n` (ví dụ: 3).
- **Output**: Bảng cửu chương từ 1 đến `n` (ví dụ:
    
    ```
    1x1 = 1
    1x2 = 2
    1x3 = 3
    ...
    1x10 = 10
    ....
    
    2x1 =2
    ..
    2x10 = 20
    
    ```
    
- **Gợi ý**: Dùng hai vòng lặp `for` lồng nhau: vòng ngoài từ 1 đến `n` (hàng), vòng trong từ 1 đến `n` (cột), in ra phép nhân.

### **Bài 5: Kiểm tra chuỗi palindrome**

- **Mô tả**: Nhập một chuỗi và kiểm tra xem nó có phải chuỗi palindrome không (chuỗi đọc xuôi ngược đều giống nhau).
- **Input**: Một chuỗi `s` (ví dụ: "radar").
- **Output**: "YES" nếu là palindrome, "NO" nếu không phải (ví dụ: "YES").
- **Gợi ý**: Dùng vòng lặp `for` để so sánh ký tự từ đầu và cuối chuỗi, nếu có cặp nào khác nhau thì in "NO", ngược lại in "YES".

### **Bài 6: Tính giai thừa**

- **Mô tả**: Nhập một số nguyên dương `n` và tính giai thừa của nó (giai thừa là tích các số từ 1 đến `n`).
- **Input**: Một số nguyên dương `n` (ví dụ: 5).
- **Output**: Giai thừa của `n` (ví dụ: 120, vì 1 * 2 * 3 * 4 * 5 = 120).
- **Gợi ý**: Dùng vòng lặp `for` từ 1 đến `n`, nhân từng số vào biến kết quả.

### **Bài 7: Đảo ngược danh sách**

- **Mô tả**: Nhập số lượng phần tử và danh sách các số nguyên, sau đó in danh sách theo thứ tự đảo ngược.
- **Input**: Số lượng phần tử `n`, rồi `n` số nguyên (ví dụ: 4, rồi 1 2 3 4).
- **Output**: Danh sách đảo ngược (ví dụ: 4 3 2 1).
- **Gợi ý**: Lưu danh sách vào một biến, dùng vòng lặp `for` từ chỉ số cuối về đầu để in ra từng phần tử.

### **Bài 8: Tìm số Fibonacci thứ n**

- **Mô tả**: Nhập một số nguyên dương `n` và tính số Fibonacci thứ `n` (dãy Fibonacci: 0, 1, 1, 2, 3, 5, 8, ...).
- **Input**: Một số nguyên dương `n` (ví dụ: 6).
- **Output**: Số Fibonacci thứ `n` (ví dụ: 5, vì dãy là 0 1 1 2 3 5).
- **Gợi ý**: Dùng vòng lặp `for`, khởi tạo hai số đầu (0 và 1), sau đó tính số tiếp theo bằng tổng hai số trước.

### **Bài 9: Kiểm tra số hoàn hảo**

- **Mô tả**: Nhập một số nguyên dương `n` và kiểm tra xem nó có phải số hoàn hảo không (số hoàn hảo là số bằng tổng các ước của nó trừ chính nó).
- **Input**: Một số nguyên dương `n` (ví dụ: 6).
- **Output**: "YES" nếu là số hoàn hảo, "NO" nếu không phải (ví dụ: "YES", vì 1 + 2 + 3 = 6).
- **Gợi ý**: Dùng vòng lặp `for` từ 1 đến `n-1`, kiểm tra ước bằng `%`, tính tổng các ước và so sánh với `n`.

### BÀi 10: Tính tổng các số đảo ngược

Nhập số n sao cho n > 1 và n < 100 

in ra các số có tận cùng là 3,5,7, 9 và là số nguyên tố trong khoảng từ 1 đến n 

ví dụ n=13 

In ra: 3,5,7,13

n=17 

In ra: 

3,5,7,13,17

---

### **Bài 11: Tìm ước chung lớn nhất (GCD)**

- **Mô tả**: Nhập hai số nguyên dương `a` và `b`, tìm ước chung lớn nhất của chúng.
- **Input**: Hai số nguyên dương `a`, `b` (ví dụ: 12 và 18).
- **Output**: Ước chung lớn nhất (ví dụ: 6).
- **Gợi ý**:
    - Dùng thuật toán Euclid:
        - Trong khi `b != 0`, thay thế `a = b` và `b = a % b`.
        - Khi `b == 0`, `a` là GCD.

---

### **Bài 12: Đếm ký tự nguyên âm trong chuỗi**

- **Mô tả**: Nhập một chuỗi và đếm số lượng ký tự nguyên âm (`a, e, i, o, u`, không phân biệt hoa/thường).
- **Input**: Một chuỗi `s` (ví dụ: "Hello World").
- **Output**: Số lượng nguyên âm (ví dụ: 3).
- **Gợi ý**:
    - Chuyển chuỗi về chữ thường (`s.lower()`), sau đó dùng vòng lặp `for` để kiểm tra từng ký tự.

---

### Bài 13: Tính tổng dãy số nhập từ người dùng

- **Mô tả**: Nhập các số nguyên từ người dùng cho đến khi nhập `1`, sau đó tính tổng các số đã nhập.
- **Input**: Dãy số nguyên (ví dụ: 5, 3, -1).
- **Output**: Tổng các số (ví dụ: 8).
- **Gợi ý**:
    - Dùng vòng lặp `while True` để nhập liên tục, dùng `if` để kiểm tra nếu nhập `1` thì dừng.

---

### **Bài 14: In bảng số nguyên từ 1 đến n²**

- **Mô tả**: Nhập một số nguyên dương `n`, in ra bảng số nguyên từ `1` đến `n²` theo dạng ma trận `n x n`.
- **Input**: Một số nguyên dương `n` (ví dụ: 3).
- **Output**:
    
    ```
    1 2 3
    4 5 6
    7 8 9
    
    ```
    
- **Gợi ý**:
    - Dùng hai vòng lặp `for`: vòng ngoài quản lý hàng, vòng trong quản lý cột.

---

### **Bài 15: Tính tổng các chữ số của một số**

- **Mô tả**: Nhập một số nguyên dương `n`, tính tổng các chữ số của `n`.
- **Input**: Một số nguyên dương `n` (ví dụ: 123).
- **Output**: Tổng các chữ số (ví dụ: 6).
- **Gợi ý**:
    - Dùng vòng lặp `while` hoặc `for` kết hợp với phép chia `%` và `//`.