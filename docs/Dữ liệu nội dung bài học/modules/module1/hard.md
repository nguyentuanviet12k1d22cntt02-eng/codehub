## Giai đoạn 3: Tính toán Phức hợp & Thực tế (10 bài)

**Mục tiêu:**

- Củng cố khả năng **phân tích bài toán** thành các bước tính toán nhỏ.
- Áp dụng nhiều phép toán và công thức trong **một bài toán lớn**.
- Rèn luyện kỹ năng xử lý các **bài toán có nhiều dữ liệu đầu vào**.
- Chuẩn bị cho việc tư duy thuật toán phức tạp hơn.

**Lưu ý:**

- Vẫn chỉ sử dụng các phép toán cơ bản (`+`, `-`, `*`, `/`, `//`, `%`).
- Sử dụng **`PI = 3.1415926535`** khi cần.
- Để tính căn bậc hai, dùng **`x ** 0.5`**.

---

### Bài 21: Tính toán chi phí xây dựng hàng rào

- **Mô tả:** Viết chương trình nhận vào chiều dài `dai` và chiều rộng `rong` của một khu vườn hình chữ nhật. Tính và in ra tổng chi phí để xây dựng hàng rào xung quanh khu vườn, biết rằng chi phí vật liệu là `gia_vat_lieu_tren_met` (VNĐ/mét) và chi phí nhân công là `gia_nhan_cong_tren_met` (VNĐ/mét).
- **Input:**
    - `dai` (số thực), `rong` (số thực)
    - `gia_vat_lieu_tren_met` (số nguyên), `gia_nhan_cong_tren_met` (số nguyên)
- **Output:**
    - Một số nguyên duy nhất là tổng chi phí xây dựng hàng rào.
- **Ví dụ:**
    
    ```python
    # Input:
    # dai = 10.0, rong = 5.0
    # gia_vat_lieu_tren_met = 50000
    # gia_nhan_cong_tren_met = 20000
    # Output:
    # 2100000
    ```
    
- **Giải thích ví dụ:**
    - Chu vi khu vườn: 2×(10.0+5.0)=30.0 mét.
    - Tổng chi phí trên mỗi mét: 50000+20000=70000 VNĐ/mét.
    - Tổng chi phí: 30.0×70000=2100000 VNĐ.

---

### Bài 22: Tính thể tích hình nón

- **Mô tả:** Viết chương trình nhận vào bán kính đáy `ban_kinh_day` và chiều cao `chieu_cao` của một hình nón. Tính và in ra **thể tích** của hình nón đó.
- **Công thức:** Thể tích = `(1/3) * PI * bán_kính_đáy * bán_kính_đáy * chiều_cao`
- **Input:**
    - Hai số thực `ban_kinh_day` và `chieu_cao`.
- **Output:**
    - Một số thực duy nhất là thể tích hình nón.
- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)
    
    ```python
    # Input:
    # ban_kinh_day = 3.0
    # chieu_cao = 4.0
    # Output:
    # 37.699111842
    ```
    
- **Giải thích ví dụ:** 31×PI×3.02×4.0=31×PI×9.0×4.0=12.0×PI≈37.699....

---

### Bài 23: Tính diện tích toàn phần của hình trụ

- **Mô tả:** Viết chương trình nhận vào bán kính đáy `ban_kinh_day` và chiều cao `chieu_cao` của một hình trụ. Tính và in ra **diện tích toàn phần** của hình trụ đó.
- **Công thức:**
    - Diện tích đáy = `PI * bán_kính_đáy * bán_kính_đáy`
    - Diện tích xung quanh = `2 * PI * bán_kính_đáy * chiều_cao`
    - Diện tích toàn phần = `2 * Diện tích đáy + Diện tích xung quanh`
- **Input:**
    - Hai số thực `ban_kinh_day` và `chieu_cao`.
- **Output:**
    - Một số thực duy nhất là diện tích toàn phần hình trụ.
- **Ví dụ:** (Sử dụng `PI = 3.1415926535`)
    
    ```python
    # Input:
    # ban_kinh_day = 2.0
    # chieu_cao = 5.0
    # Output:
    # 87.9645943
    ```
    
- **Giải thích ví dụ:**
    - Diện tích đáy: PI×2.02=4×PI.
    - Diện tích xung quanh: 2×PI×2.0×5.0=20×PI.
    - Diện tích toàn phần: 2×(4×PI)+(20×PI)=8×PI+20×PI=28×PI≈87.964....

---

### Bài 24: Tính diện tích hình bình hành

- **Mô tả:** Viết chương trình nhận vào độ dài cạnh đáy `day` và chiều cao `chieu_cao` tương ứng của một hình bình hành. Tính và in ra **diện tích** của hình bình hành đó.
- **Công thức:** Diện tích = `đáy * chiều_cao`
- **Input:**
    - Hai số thực `day` và `chieu_cao`.
- **Output:**
    - Một số thực duy nhất là diện tích hình bình hành.
- **Ví dụ:**
    
    ```python
    # Input:
    # day = 7.0
    # chieu_cao = 4.0
    # Output:
    # 28.0
    ```
    
- **Giải thích ví dụ:** 7.0×4.0=28.0.

---

### Bài 25: Tính toán chi phí sơn nhà

- **Mô tả:** Viết chương trình nhận vào chiều dài `chieu_dai_phong`, chiều rộng `chieu_rong_phong` và chiều cao `chieu_cao_phong` của một căn phòng. Tính và in ra tổng chi phí để sơn bốn bức tường của căn phòng đó, biết giá sơn là `gia_son_tren_met_vuong` (VNĐ/mét vuông). Bỏ qua diện tích cửa và các vật cản khác.
- **Input:**
    - `chieu_dai_phong` (số thực), `chieu_rong_phong` (số thực), `chieu_cao_phong` (số thực)
    - `gia_son_tren_met_vuong` (số nguyên)
- **Output:**
    - Một số nguyên duy nhất là tổng chi phí sơn.
- **Ví dụ:**
    
    ```python
    # Input:
    # chieu_dai_phong = 5.0, chieu_rong_phong = 4.0, chieu_cao_phong = 3.0
    # gia_son_tren_met_vuong = 25000
    # Output:
    # 1350000
    ```
    
- **Giải thích ví dụ:**
    - Chu vi đáy phòng: 2×(5.0+4.0)=18.0 mét.
    - Diện tích bốn bức tường (diện tích xung quanh): 18.0×3.0=54.0 mét vuông.
    - Tổng chi phí sơn: 54.0×25000=1350000 VNĐ.

---

### Bài 26: Chuyển đổi đơn vị tiền tệ

- **Mô tả:** Viết chương trình nhận vào một số tiền `so_tien_USD` (đô la Mỹ). Chuyển đổi và in ra số tiền này sang VNĐ, Euro và Yên Nhật.
- **Tỷ giá cố định (chỉ dùng cho bài này):**
    
    ```python
    1 USD = 25000 VNĐ
    ```
    
    - `1 USD = 0.92 Euro`
    - `1 USD = 155.0 Yên Nhật`
- **Input:**
    - Một số thực `so_tien_USD`.
- **Output:**
    - Dòng 1: Số tiền VNĐ (số thực).
    - Dòng 2: Số tiền Euro (số thực).
    - Dòng 3: Số tiền Yên Nhật (số thực).
- **Ví dụ:**
    
    ```python
    # Input:
    # so_tien_USD = 100.0
    # Output:
    # 2500000.0
    # 92.0
    # 15500.0
    ```
    

---

### Bài 27: Tính toán lợi nhuận và phần trăm lợi nhuận

- **Mô tả:** Viết chương trình nhận vào giá mua `gia_mua` và giá bán `gia_ban` của một sản phẩm. Tính và in ra **lợi nhuận** và **phần trăm lợi nhuận** (so với giá mua).
- **Công thức:**
    - Lợi nhuận = `Giá bán - Giá mua`
    - Phần trăm lợi nhuận = `(Lợi nhuận / Giá mua) * 100`
- **Input:**
    - Hai số thực `gia_mua` và `gia_ban` (giả sử `gia_mua` luôn dương).
- **Output:**
    - Dòng 1: Lợi nhuận (số thực).
    - Dòng 2: Phần trăm lợi nhuận (số thực).
- **Ví dụ:**
    
    ```python
    # Input:
    # gia_mua = 80.0
    # gia_ban = 100.0
    # Output:
    # 20.0
    # 25.0
    ```
    
- **Giải thích ví dụ:**
    - Lợi nhuận: 100.0−80.0=20.0.
    - Phần trăm lợi nhuận: (20.0/80.0)×100=0.25×100=25.0.

---

### Bài 28: Tính điểm thi cuối kỳ (có trọng số)

- **Mô tả:** Viết chương trình nhận vào điểm bài tập `diem_bai_tap`, điểm giữa kỳ `diem_giua_ky` và điểm cuối kỳ `diem_cuoi_ky`. Tính và in ra **điểm tổng kết** của học sinh, biết rằng mỗi loại điểm có trọng số khác nhau.
- **Trọng số:**
    - Bài tập: 20%
    - Giữa kỳ: 30%
    - Cuối kỳ: 50%
- **Input:**
    - Ba số thực `diem_bai_tap`, `diem_giua_ky`, `diem_cuoi_ky`.
- **Output:**
    - Một số thực duy nhất là điểm tổng kết.
- **Ví dụ:**
    
    ```python
    # Input:
    # diem_bai_tap = 9.0
    # diem_giua_ky = 7.0
    # diem_cuoi_ky = 8.0
    # Output:
    # 7.9
    ```
    
- **Giải thích ví dụ:** (9.0×0.20)+(7.0×0.30)+(8.0×0.50)=1.8+2.1+4.0=7.9.

---

### Bài 29: Tính thời gian di chuyển

- **Mô tả:** Viết chương trình nhận vào khoảng cách `khoang_cach_km` (km) và vận tốc trung bình `van_toc_km_h` (km/giờ). Tính và in ra **thời gian di chuyển** tính bằng **giờ, phút và giây**.
- **Input:**
    - `khoang_cach_km` (số thực)
    - `van_toc_km_h` (số thực, giả sử > 0)
- **Output:**
    - Dòng 1: Số giờ (số nguyên).
    - Dòng 2: Số phút (số nguyên).
    - Dòng 3: Số giây (số nguyên).
- **Ví dụ:**
    
    ```python
    # Input:
    # khoang_cach_km = 100.0
    # van_toc_km_h = 40.0
    # Output:
    # 2
    # 30
    # 0
    ```
    
- **Giải thích ví dụ:**
    - Tổng thời gian (giờ): 100.0/40.0=2.5 giờ.
    - Giờ nguyên: 2 giờ.
    - Phần thập phân của giờ: 0.5 giờ.
    - Số phút: 0.5×60=30 phút.
    - Số giây (trong trường hợp này là 0).

---

### Bài 30: Chuyển đổi giây thành giờ, phút, giây

- **Mô tả:** Viết chương trình nhận vào tổng số giây `tong_so_giay`. Chuyển đổi và in ra số giờ, số phút và số giây còn lại.
- **Input:**
- **Output:**
    - Một số nguyên `tong_so_giay` (giả sử không âm).
    - Dòng 1: Số giờ (số nguyên).
    - Dòng 2: Số phút (số nguyên).
    - Dòng 3: Số giây còn lại (số nguyên).
- **Ví dụ:**
    
    ```python
    # Input:
    # tong_so_giay = 3665
    # Output:
    # 1
    # 1
    # 5
    ```
    
- **Giải thích ví dụ:**
    - Số giờ: 3665÷3600=1 (dư 65)
    - Số phút: 65÷60=1 (dư 5)
    - Số giây còn lại: 5