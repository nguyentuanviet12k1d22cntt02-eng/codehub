# Hard

## **5 Bài tập `if-else` nâng cao**

---

### **Bài 1: Tính hóa đơn tiền điện luỹ tiến và thuế suất**

- **Mô tả:** Viết chương trình tính tiền điện tiêu thụ hộ gia đình dựa trên số điện `kwh` tiêu thụ và hộ kinh doanh `la_kinh_doanh` (boolean).
- **Yêu cầu:** 
    - Nếu `la_kinh_doanh` là `True`, tính đồng giá 3.000 VND / kWh. Thuế VAT là 10% tổng tiền.
    - Nếu `la_kinh_doanh` là `False`, tính theo bậc thang như sau:
        - 50 kWh đầu tiên: 1.678 VND / kWh.
        - Từ kWh 51 đến 100: 1.734 VND / kWh.
        - Từ kWh 101 đến 200: 2.014 VND / kWh.
        - Từ kWh 201 trở đi: 2.536 VND / kWh.
        - Thuế VAT cho hộ gia đình là 8% tổng tiền.
    - Kết quả in ra tổng tiền cuối cùng (làm tròn 1 chữ số thập phân).
- **Thiết lập ban đầu:**
    
    `kwh = 120
    la_kinh_doanh = False`
    
- **Ví dụ kiểm thử:**
    - **Input:** `kwh = 120, la_kinh_doanh = False` **Output:** `248558.4` (Tổng tiền trước thuế là 50*1678 + 50*1734 + 20*2014 = 230280 => Sau VAT 8% là 248702.4. Tính lại: 50*1678 + 50*1734 + 20*2014 = 83900 + 86700 + 40280 = 210880. Nhân 1.08 = 227750.4)
    - **Input:** `kwh = 150, la_kinh_doanh = True` **Output:** `495000.0` (150 * 3000 * 1.1 = 495000.0)

---

### **Bài 2: Hệ thống phát hiện giao dịch bất thường (Gian lận)**

- **Mô tả:** Cho số tiền giao dịch `so_tien`, khoảng cách địa lý giao dịch `khoang_cach` (km, so với vị trí trước đó), và cờ thiết bị lạ `thiet_bi_la` (boolean).
- **Yêu cầu:** Xác định độ rủi ro giao dịch (in ra "Rủi ro Cao", "Rủi ro Trung bình", "Giao dịch An toàn").
    - **Rủi ro Cao** nếu:
        - Số tiền >= 50.000.000 AND thiết bị lạ là `True`.
        - HOẶC khoảng cách > 500 km AND thiết bị lạ là `True`.
    - **Rủi ro Trung bình** nếu:
        - Số tiền từ 10.000.000 đến dưới 50.000.000 AND thiết bị lạ là `True`.
        - HOẶC khoảng cách > 100 km (nhưng không quá 500 km) AND thiết bị lạ là `True`.
        - HOẶC số tiền >= 100.000.000 (dù thiết bị quen).
    - **Giao dịch An toàn:** Các trường hợp còn lại.
- **Thiết lập ban đầu:**
    
    `so_tien = 20000000
    khoang_cach = 150
    thiet_bi_la = True`
    
- **Ví dụ kiểm thử:**
    - **Input:** `so_tien = 60000000, khoang_cach = 10, thiet_bi_la = True` **Output:** `Rủi ro Cao`
    - **Input:** `so_tien = 5000000, khoang_cach = 600, thiet_bi_la = True` **Output:** `Rủi ro Cao`
    - **Input:** `so_tien = 20000000, khoang_cach = 150, thiet_bi_la = True` **Output:** `Rủi ro Trung bình`
    - **Input:** `so_tien = 150000000, khoang_cach = 5, thiet_bi_la = False` **Output:** `Rủi ro Trung bình`
    - **Input:** `so_tien = 5000000, khoang_cach = 10, thiet_bi_la = False` **Output:** `Giao dịch An toàn`

---

### **Bài 3: Giải phương trình bậc hai**

- **Mô tả:** Cho 3 hệ số `a`, `b`, `c` của phương trình $ax^2 + bx + c = 0$.
- **Yêu cầu:** Xác định số nghiệm của phương trình và in ra:
    - Nếu `a == 0` (phương trình bậc nhất bx + c = 0):
        - Nếu `b == 0` và `c == 0`, in "Vô số nghiệm".
        - Nếu `b == 0` và `c != 0`, in "Vô nghiệm".
        - Nếu `b != 0`, in "Có 1 nghiệm".
    - Nếu `a != 0`:
        - Tính delta = $b^2 - 4ac$.
        - Nếu delta < 0, in "Vô nghiệm".
        - Nếu delta == 0, in "Có nghiệm kép".
        - Nếu delta > 0, in "Có 2 nghiệm phân biệt".
- **Thiết lập ban đầu:**
    
    `a = 1
    b = -3
    c = 2`
    
- **Ví dụ kiểm thử:**
    - **Input:** `a = 0, b = 2, c = -4` **Output:** `Có 1 nghiệm`
    - **Input:** `a = 1, b = -3, c = 2` **Output:** `Có 2 nghiệm phân biệt`
    - **Input:** `a = 1, b = 2, c = 5` **Output:** `Vô nghiệm`
    - **Input:** `a = 1, b = -2, c = 1` **Output:** `Có nghiệm kép`

---

### **Bài 4: Định vị điểm trong hệ tọa độ 2D**

- **Mô tả:** Cho tọa độ một điểm $(x, y)$ và một hình tròn có tâm $(x_0, y_0)$ bán kính $R$.
- **Yêu cầu:** Xác định vị trí điểm so với hình tròn và in ra:
    - Nếu khoảng cách từ tâm hình tròn tới điểm nhỏ hơn bán kính $R$, in "Nằm trong hình tròn".
    - Nếu bằng $R$, in "Nằm trên biên hình tròn".
    - Nếu lớn hơn $R$, in "Nằm ngoài hình tròn".
    - *Chú ý:* Khoảng cách d = $\sqrt{(x - x_0)^2 + (y - y_0)^2}$. (Có thể so sánh $d^2$ với $R^2$ để tránh căn bậc hai).
- **Thiết lập ban đầu:**
    
    `x = 3
    y = 4
    x0 = 0
    y0 = 0
    R = 5`
    
- **Ví dụ kiểm thử:**
    - **Input:** `x = 3, y = 4, x0 = 0, y0 = 0, R = 5` **Output:** `Nằm trên biên hình tròn`
    - **Input:** `x = 2, y = 2, x0 = 0, y0 = 0, R = 5` **Output:** `Nằm trong hình tròn`
    - **Input:** `x = 6, y = 0, x0 = 0, y0 = 0, R = 5` **Output:** `Nằm ngoài hình tròn`

---

### **Bài 5: Xác định ngày hôm sau (Next Day)**

- **Mô tả:** Cho một ngày hợp lệ gồm `ngay`, `thang`, `nam`. Xác định ngày tiếp theo.
- **Yêu cầu:** Tính và in ra ngày hôm sau dưới dạng `"Ngày mai: [ngày]/[tháng]/[năm]"`.
    - Cần xem xét năm nhuận (tháng 2 có 29 ngày) và các tháng có 30, 31 ngày.
    - Nếu là ngày cuối cùng của tháng, ngày hôm sau sẽ là ngày 1 của tháng tiếp theo.
    - Nếu là ngày cuối của năm (31/12), ngày hôm sau sẽ là 1/1 của năm tiếp theo.
- **Thiết lập ban đầu:**
    
    `ngay = 31
    thang = 12
    nam = 2023`
    
- **Ví dụ kiểm thử:**
    - **Input:** `ngay = 28, thang = 2, nam = 2024` **Output:** `Ngày mai: 29/2/2024` (Năm nhuận)
    - **Input:** `ngay = 28, thang = 2, nam = 2023` **Output:** `Ngày mai: 1/3/2023` (Năm thường)
    - **Input:** `ngay = 31, thang = 12, nam = 2023` **Output:** `Ngày mai: 1/1/2024`
    - **Input:** `ngay = 30, thang = 4, nam = 2023` **Output:** `Ngày mai: 1/5/2023`
