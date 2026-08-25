## **15 Bài tập Vòng lặp `while`**

**Mục tiêu:**

- Vận dụng thành thạo vòng lặp `while` để giải quyết các bài toán khi số lần lặp không cố định.
- Rèn luyện kỹ năng kiểm soát điều kiện dừng của vòng lặp.
- Sử dụng các lệnh `break` và `continue` để điều khiển luồng lặp.

**Lưu ý:**

- Sử dụng vòng lặp `while` cho tất cả các bài tập này.
- Nhớ cập nhật các biến bên trong vòng lặp để điều kiện dừng có thể thay đổi, tránh vòng lặp vô hạn.
- Đối với căn bậc hai, có thể dùng `x ** 0.5`.

---

### **Bài 1: Đếm ngược đơn giản**

- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để đếm ngược từ `n` về 1 và in ra từng số.
- **Input:**
    - Một số nguyên dương `n` (ví dụ: `5`).
- **Output:**
    - Các số được in trên từng dòng, đếm ngược từ `n` về 1.
- **Ví dụ:**
    
    `# Input:
    # 5
    # Output:
    # 5
    # 4
    # 3
    # 2
    # 1`
    

---

### **Bài 2: Tính tổng các số từ 1 đến N**

- **Mô tả:** Nhập một số nguyên dương `N`. Sử dụng vòng lặp `while` để tính và in ra tổng các số nguyên từ 1 đến `N`.
- **Input:**
    - Một số nguyên dương `N` (ví dụ: `10`).
- **Output:**
    - Một số nguyên duy nhất là tổng.
- **Ví dụ:**
    
    `# Input:
    # 10
    # Output:
    # 55`
    
- **Giải thích ví dụ:** `1 + 2 + ... + 10 = 55`.

---

### **Bài 3: Nhập số đến khi gặp số âm**

- **Mô tả:** Yêu cầu người dùng nhập các số nguyên dương. Tính tổng các số đã nhập. Dừng việc nhập và in ra tổng khi người dùng nhập một số âm.
- **Input:**
    - Các số nguyên (ví dụ: `5`, `10`, `3`, `1`).
- **Output:**
    - Một số nguyên duy nhất là tổng các số dương đã nhập.
- **Ví dụ:**
    
    `# Input:
    # 5
    # 10
    # 3
    # -1
    # Output:
    # 18`
    
- **Gợi ý:** Dùng `while True` và lệnh `break`.

---

### **Bài 4: Đếm chữ số của một số nguyên**

- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để đếm xem số đó có bao nhiêu chữ số.
- **Input:**
    - Một số nguyên dương `n` (ví dụ: `12345`).
- **Output:**
    - Một số nguyên duy nhất là số lượng chữ số.
- **Ví dụ:**
    
    `# Input:
    # 12345
    # Output:
    # 5`
    
- **Gợi ý:** Trong mỗi lần lặp, chia số cho 10 (chia nguyên) và tăng biến đếm.

---

### **Bài 5: Đảo ngược một số nguyên**

- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để đảo ngược các chữ số của nó và in ra số mới.
- **Input:**
    - Một số nguyên dương `n` (ví dụ: `123`).
- **Output:**
    - Một số nguyên duy nhất là số đã đảo ngược.
- **Ví dụ:**
    
    `# Input:
    # 123
    # Output:
    # 321`
    
- **Gợi ý:** Dùng phép chia lấy dư (`% 10`) để lấy chữ số cuối cùng và phép chia nguyên (`// 10`) để loại bỏ chữ số cuối cùng. Xây dựng số đảo ngược.

---

### **Bài 6: Kiểm tra số Palindrome (Số)**

- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để kiểm tra xem số đó có phải là số Palindrome không (đọc xuôi hay ngược đều giống nhau).
- **Input:**
    - Một số nguyên dương `n` (ví dụ: `121`).
- **Output:**
    - `YES` nếu là số Palindrome, `NO` nếu không.
- **Ví dụ:**
    
    `# Input:
    # 121
    # Output:
    # YES
    
    # Input:
    # 123
    # Output:
    # NO`
    
- **Gợi ý:** Tạo một bản sao của số ban đầu. Sau đó, đảo ngược bản sao và so sánh với số ban đầu.

---

### **Bài 7: Tìm chữ số lớn nhất của một số**

- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để tìm và in ra chữ số lớn nhất trong số đó.
- **Input:**
    - Một số nguyên dương `n` (ví dụ: `51823`).
- **Output:**
    - Một số nguyên duy nhất là chữ số lớn nhất.
- **Ví dụ:**
    
    `# Input:
    # 51823
    # Output:
    # 8`
    
- **Gợi ý:** Khởi tạo `max_chu_so` bằng 0. Trong mỗi lần lặp, lấy chữ số cuối cùng (`% 10`), so sánh với `max_chu_so` và cập nhật.

---

### **Bài 8: Tính lũy thừa (không dùng `*`*)**

- **Mô tả:** Nhập một số nguyên `co_so` và một số nguyên dương `so_mu`. Sử dụng vòng lặp `while` để tính `co_so` mũ `so_mu` (ví dụ: 23=8) và in ra kết quả.
- **Input:**
    - Hai số nguyên `co_so`, `so_mu` (ví dụ: `2`, `3`).
- **Output:**
    - Một số nguyên duy nhất là kết quả lũy thừa.
- **Ví dụ:**
    
    `# Input:
    # 2
    # 3
    # Output:
    # 8`
    
- **Gợi ý:** Khởi tạo kết quả bằng 1. Lặp `so_mu` lần, mỗi lần nhân kết quả với `co_so`.

---

### **Bài 9: Kiểm tra số nguyên tố**

- **Mô tả:** Nhập một số nguyên dương `n` (lớn hơn 1). Sử dụng vòng lặp `while` để kiểm tra xem `n` có phải là số nguyên tố không (chỉ chia hết cho 1 và chính nó).
- **Input:**
    - Một số nguyên dương `n` (ví dụ: `7`).
- **Output:**
    - `YES` nếu là số nguyên tố, `NO` nếu không.
- **Ví dụ:**
    
    `# Input:
    # 7
    # Output:
    # YES
    
    # Input:
    # 9
    # Output:
    # NO`
    
- **Gợi ý:** Bắt đầu kiểm tra từ 2. Nếu `n` chia hết cho bất kỳ số nào từ 2 đến `sqrt(n)` thì không phải số nguyên tố. Dùng `break` khi tìm thấy ước.

---

### **Bài 10: Ước chung lớn nhất (GCD) - Thuật toán Euclid**

- **Mô tả:** Nhập hai số nguyên dương `a` và `b`. Sử dụng vòng lặp `while` để tìm và in ra ước chung lớn nhất (GCD) của chúng bằng thuật toán Euclid.
- **Input:**
    - Hai số nguyên dương `a`, `b` (ví dụ: `12`, `18`).
- **Output:**
    - Một số nguyên duy nhất là GCD.
- **Ví dụ:**
    
    `# Input:
    # 12
    # 18
    # Output:
    # 6`
    
- **Gợi ý:** Thuật toán Euclid: Trong khi `b` khác 0, thay thế `a` bằng `b` và `b` bằng phần dư của `a` chia `b` (`a % b`). Khi `b` bằng 0, `a` chính là GCD.

---

### **Bài 11: Bội chung nhỏ nhất (LCM)**

- **Mô tả:** Nhập hai số nguyên dương `a` và `b`. Sử dụng vòng lặp `while` và kết hợp với GCD để tìm và in ra bội chung nhỏ nhất (LCM) của chúng.
- **Công thức:** `LCM(a, b) = (a * b) / GCD(a, b)`
- **Input:**
    - Hai số nguyên dương `a`, `b` (ví dụ: `4`, `6`).
- **Output:**
    - Một số nguyên duy nhất là LCM.
- **Ví dụ:**
    
    `# Input:
    # 4
    # 6
    # Output:
    # 12`
    
- **Gợi ý:** Trước hết, tính GCD của `a` và `b` bằng vòng lặp `while` (như Bài 10). Sau đó áp dụng công thức.

---

### **Bài 12: Dãy Fibonacci đến N**

- **Mô tả:** Nhập một số nguyên dương `N`. In ra tất cả các số trong dãy Fibonacci nhỏ hơn hoặc bằng `N`.
- **Dãy Fibonacci:** Bắt đầu bằng 0, 1. Số tiếp theo là tổng của hai số liền trước (ví dụ: 0, 1, 1, 2, 3, 5, 8, ...).
- **Input:**
    - Một số nguyên dương `N` (ví dụ: `10`).
- **Output:**
    - Các số Fibonacci, mỗi số trên một dòng.
- **Ví dụ:**
    
    `# Input:
    # 10
    # Output:
    # 0
    # 1
    # 1
    # 2
    # 3
    # 5
    # 8`
    
- **Gợi ý:** Khởi tạo hai biến `a = 0`, `b = 1`. Dùng `while` với điều kiện `a <= N`.

---

### **Bài 13: Vòng lặp với số tiền rút từ ATM**

- **Mô tả:** Bạn có `so_tien_ban_dau`. Người dùng muốn rút `so_tien_muon_rut`. Yêu cầu người dùng nhập số tiền muốn rút. Nếu số tiền rút lớn hơn số tiền bạn có, hoặc số tiền rút không phải là bội số của 50 (VD: ATM chỉ cho rút 50k, 100k, 150k...), yêu cầu nhập lại. In ra số tiền còn lại sau khi rút thành công.
- **Input:**
    - Dòng 1: `so_tien_ban_dau` (số nguyên, ví dụ: 500)
    - Các dòng tiếp theo: `so_tien_muon_rut` cho đến khi hợp lệ (ví dụ: `70`, `120`, `100`).
- **Output:**
    - Số tiền còn lại (số nguyên).
- **Ví dụ:**
    
    `# Input:
    # 500
    # 70
    # 120
    # 100
    # Output:
    # 400`
    
- **Gợi ý:** Dùng `while True` và `break` khi điều kiện hợp lệ. Kiểm tra hai điều kiện: `so_tien_muon_rut <= so_tien_ban_dau` và `so_tien_muon_rut % 50 == 0`.

---

### **Bài 14: Đếm số ước của một số**

- **Mô tả:** Nhập một số nguyên dương `n`. Sử dụng vòng lặp `while` để đếm và in ra tổng số lượng ước số của `n` (bao gồm 1 và chính nó).
- **Input:**
    - Một số nguyên dương `n` (ví dụ: `12`).
- **Output:**
    - Một số nguyên duy nhất là tổng số ước.
- **Ví dụ:**
    
    `# Input:
    # 12
    # Output:
    # 6`
    
- **Giải thích ví dụ:** Các ước của 12 là 1, 2, 3, 4, 6, 12 (có 6 ước).
- **Gợi ý:** Dùng một biến `dem = 1`, và một biến `so_uoc = 0`. Lặp `while dem <= n`.

---

### **Bài 15: Kiểm tra số Armstrong**

- **Mô tả:** Nhập một số nguyên dương `n`. Kiểm tra xem `n` có phải là số Armstrong hay không. Một số Armstrong là số mà tổng lập phương của các chữ số của nó bằng chính số đó. (Ví dụ: 153 = 13+53+33=1+125+27=153).
- **Input:**
    - Một số nguyên dương `n` (ví dụ: `153`).
- **Output:**
    - `YES` nếu là số Armstrong, `NO` nếu không.
- **Ví dụ:**
    
    `# Input:
    # 153
    # Output:
    # YES
    
    # Input:
    # 123
    # Output:
    # NO`
    
- **Gợi ý:** Tạo một bản sao của `n`. Dùng `while` để lặp qua từng chữ số của bản sao (lấy chữ số cuối `% 10`, loại bỏ chữ số cuối `// 10`), tính tổng lập phương và so sánh với số `n` ban đầu.

---