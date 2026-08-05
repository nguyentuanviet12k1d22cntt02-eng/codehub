## Giai đoạn 2: Tính toán Hình học Nâng cao (10 bài)

**Mục tiêu:**

- Vận dụng thành thạo các **công thức hình học phức tạp hơn**.
- Quản lý các **biến trung gian** và thực hiện tính toán qua **nhiều bước**.
- Làm quen với việc sử dụng **hằng số** (ví dụ: PI).
- Rèn luyện tư duy phân tích bài toán thành các phép tính nhỏ.

**Lưu ý:**

- Các bài này sẽ yêu cầu sử dụng các phép toán như `+`, `-`, `*`, `/`.
- Một số bài có thể cần sử dụng giá trị `PI` (số Pi). Hãy coi `PI` là một hằng số được gán trước, ví dụ: **`PI = 3.1415926535`**.
- Đối với căn bậc hai, có thể dùng **`x ** 0.5`** (đây là cách tính lũy thừa bậc 0.5, tương đương với căn bậc hai).

---

### Bài 11: Tính diện tích hình tam giác (khi biết đáy và chiều cao)

- **Mô tả:** Viết chương trình nhận vào độ dài cạnh đáy `day` và chiều cao `chieu_cao` tương ứng của một hình tam giác. Tính và in ra **diện tích** của tam giác đó.
- **Công thức:** Diện tích = `(đáy * chiều_cao) / 2`
- **Input:**
    - Hai số thực `day` và `chieu_cao`.
- **Output:**
    - Một số thực duy nhất là diện tích hình tam giác.
- **Ví dụ:**
    
    ```python
    # Input:
    # day = 10.0
    # chieu_cao = 5.0
    # Output:
    # 25.0
    ```
    
- **Giải thích ví dụ:** `(10.0 * 5.0) / 2 = 25.0`.

---

### Bài 12: Tính chu vi và diện tích hình tròn

- **Mô tả:** Viết chương trình nhận vào bán kính `ban_kinh` của một hình tròn. Tính và in ra **chu vi** và **diện tích** của hình tròn đó.
- **Công thức:**
    - Chu vi = `2 * PI * bán_kính`
    - Diện tích = `PI * bán_kính * bán_kính` (hoặc `PI * bán_kính^2`)
- **Input:**
    - Một số thực `ban_kinh`.
- **Output:**
    - Dòng 1: Chu vi hình tròn (số thực).
    - Dòng 2: Diện tích hình tròn (số thực).
- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)
    
    ```python
    # Input:
    # ban_kinh = 3.0
    # Output:
    # 18.849555921
    # 28.2743338815
    ```
    

---

### Bài 13: Tính diện tích hình thang

- **Mô tả:** Viết chương trình nhận vào độ dài hai đáy `day_lon`, `day_be` và chiều cao `chieu_cao` của một hình thang. Tính và in ra **diện tích** của hình thang đó.
- **Công thức:** Diện tích = `((đáy_lớn + đáy_bé) * chiều_cao) / 2`
- **Input:**
    - Ba số thực `day_lon`, `day_be`, `chieu_cao`.
- **Output:**
    - Một số thực duy nhất là diện tích hình thang.
- **Ví dụ:**
    
    ```python
    # Input:
    # day_lon = 8.0
    # day_be = 4.0
    # chieu_cao = 6.0
    # Output:
    # 36.0
    ```
    
- **Giải thích ví dụ:** `((8.0 + 4.0) * 6.0) / 2 = (12.0 * 6.0) / 2 = 72.0 / 2 = 36.0`.

---

### Bài 14: Tính thể tích hình hộp chữ nhật

- **Mô tả:** Viết chương trình nhận vào chiều dài `dai`, chiều rộng `rong` và chiều cao `cao` của một hình hộp chữ nhật. Tính và in ra **thể tích** của nó.
- **Công thức:** Thể tích = `dài * rộng * cao`
- **Input:**
    - Ba số thực `dai`, `rong`, `cao`.
- **Output:**
    - Một số thực duy nhất là thể tích hình hộp.
- **Ví dụ:**
    
    ```python
    # Input:
    # dai = 4.0
    # rong = 2.0
    # cao = 3.0
    # Output:
    # 24.0
    ```
    
- **Giải thích ví dụ:** `4.0 * 2.0 * 3.0 = 24.0`.

---

### Bài 15: Tính diện tích bề mặt và thể tích hình cầu

- **Mô tả:** Viết chương trình nhận vào bán kính `ban_kinh` của một hình cầu. Tính và in ra **diện tích bề mặt** và **thể tích** của hình cầu đó.
- **Công thức:**
    - Diện tích bề mặt = `4 * PI * bán_kính * bán_kính` (hoặc `4 * PI * bán_kính^2`)
    - Thể tích = `(4/3) * PI * bán_kính * bán_kính * bán_kính` (hoặc `(4/3) * PI * bán_kính^3`)
- **Input:**
    - Một số thực `ban_kinh`.
- **Output:**
    - Dòng 1: Diện tích bề mặt hình cầu (số thực).
    - Dòng 2: Thể tích hình cầu (số thực).
- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)
    
    ```python
    # Input:
    # ban_kinh = 2.0
    # Output:
    # 50.265482456
    # 33.510321637333336
    ```
    

---

### Bài 16: Tính độ dài cạnh huyền của tam giác vuông

- **Mô tả:** Viết chương trình nhận vào độ dài hai cạnh góc vuông `canh_a` và `canh_b` của một tam giác vuông. Tính và in ra **độ dài cạnh huyền**.
- **Công thức (Định lý Pitago):** Cạnh huyền = `căn bậc hai của (canh_a^2 + canh_b^2)`
    - **Gợi ý:** Để tính căn bậc hai mà không dùng thư viện, bạn có thể dùng phép lũy thừa `* 0.5`. Ví dụ: `ket_qua ** 0.5`.
- **Input:**
    - Hai số thực `canh_a` và `canh_b`.
- **Output:**
    - Một số thực duy nhất là độ dài cạnh huyền.
- **Ví dụ:**
    
    ```python
    # Input:
    # canh_a = 3.0
    # canh_b = 4.0
    # Output:
    # 5.0
    ```
    
- **Giải thích ví dụ:** `căn bậc hai của (3.0^2 + 4.0^2) = căn bậc hai của (9.0 + 16.0) = căn bậc hai của (25.0) = 5.0`.

---

### Bài 17: Tính diện tích hình vành khăn (hình tròn đồng tâm)

- **Mô tả:** Viết chương trình nhận vào bán kính của hai hình tròn đồng tâm: `ban_kinh_lon` (hình tròn lớn) và `ban_kinh_be` (hình tròn nhỏ). Tính và in ra **diện tích** của hình vành khăn (phần diện tích giữa hai hình tròn).
- **Công thức:** Diện tích vành khăn = `Diện tích hình tròn lớn - Diện tích hình tròn nhỏ`
    - (Trong đó: Diện tích hình tròn = `PI * bán_kính * bán_kính`)
- **Input:**
    - Hai số thực `ban_kinh_lon` và `ban_kinh_be` (giả sử `ban_kinh_lon > ban_kinh_be`).
- **Output:**
    - Một số thực duy nhất là diện tích hình vành khăn.
- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)
    
    ```python
    # Input:
    # ban_kinh_lon = 5.0
    # ban_kinh_be = 3.0
    # Output:
    # 50.265482456
    ```
    
- **Giải thích ví dụ:**
    - Diện tích lớn: `PI * 5.0 * 5.0 = 25 * PI`.
    - Diện tích bé: `PI * 3.0 * 3.0 = 9 * PI`.
    - Vành khăn: `(25 - 9) * PI = 16 * PI ≈ 50.265...`.

---

### Bài 18: Tính thể tích hình trụ

- **Mô tả:** Viết chương trình nhận vào bán kính đáy `ban_kinh_day` và chiều cao `chieu_cao` của một hình trụ. Tính và in ra **thể tích** của hình trụ đó.
- **Công thức:** Thể tích = `PI * bán_kính_đáy * bán_kính_đáy * chiều_cao` (hoặc `PI * bán_kính_đáy^2 * chiều_cao`)
- **Input:**
    - Hai số thực `ban_kinh_day` và `chieu_cao`.
- **Output:**
    - Một số thực duy nhất là thể tích hình trụ.
- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)
    
    ```python
    # Input:
    # ban_kinh_day = 2.0
    # chieu_cao = 5.0
    # Output:
    # 62.83185307
    ```
    
- **Giải thích ví dụ:** `PI * 2.0 * 2.0 * 5.0 = PI * 20.0 ≈ 62.831...`.

---

### Bài 19: Tính tọa độ trung điểm của đoạn thẳng trong mặt phẳng 2D

- **Mô tả:** Viết chương trình nhận vào tọa độ hai điểm A(`x1`, `y1`) và B(`x2`, `y2`) trong mặt phẳng 2D. Tính và in ra **tọa độ trung điểm** M(`xm`, `ym`) của đoạn thẳng AB.
- **Công thức:**
    - `xm = (x1 + x2) / 2`
    - `ym = (y1 + y2) / 2`
- **Input:**
    - Bốn số thực `x1`, `y1`, `x2`, `y2`.
- **Output:**
    - Dòng 1: Tọa độ `xm` (số thực).
    - Dòng 2: Tọa độ `ym` (số thực).
- **Ví dụ:**
    
    ```python
    # Input:
    # x1 = 1.0, y1 = 1.0
    # x2 = 5.0, y2 = 5.0
    # Output:
    # 3.0
    # 3.0
    ```
    
- **Giải thích ví dụ:**
    - `xm = (1.0 + 5.0) / 2 = 6.0 / 2 = 3.0`.
    - `ym = (1.0 + 5.0) / 2 = 6.0 / 2 = 3.0`.

---

### Bài 20: Tính khoảng cách giữa hai điểm trong mặt phẳng 2D

- **Mô tả:** Viết chương trình nhận vào tọa độ hai điểm A(`x1`, `y1`) và B(`x2`, `y2`) trong mặt phẳng 2D. Tính và in ra **khoảng cách** giữa hai điểm này.
- **Công thức:** Khoảng cách = `căn bậc hai của ((x2 - x1)^2 + (y2 - y1)^2)`
    - **Gợi ý:** Để tính căn bậc hai mà không dùng thư viện, bạn có thể dùng phép lũy thừa `* 0.5`.
- **Input:**
    - Bốn số thực `x1`, `y1`, `x2`, `y2`.
- **Output:**
    - Một số thực duy nhất là khoảng cách giữa hai điểm.
- **Ví dụ:**
    
    ```python
    # Input:
    # x1 = 1.0, y1 = 1.0
    # x2 = 4.0, y2 = 5.0
    # Output:
    # 5.0
    ```
    
- **Giải thích ví dụ:** `căn bậc hai của ((4.0 - 1.0)^2 + (5.0 - 1.0)^2) = căn bậc hai của (3.0^2 + 4.0^2) = căn bậc hai của (9.0 + 16.0) = căn bậc hai của (25.0) = 5.0`.