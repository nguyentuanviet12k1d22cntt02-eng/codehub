# Medium

### **Chương 2: Cấu Trúc Điều Kiện `if-else` và Logic (15 Bài Tập Mức Trung Bình)**

Các bài tập này sẽ thử thách khả năng "ra quyết định" của chương trình dựa trên nhiều điều kiện phức tạp. Bạn sẽ cần vận dụng linh hoạt `if`, `elif`, `else` cùng các phép so sánh và toán tử logic (`and`, `or`, `not`).

---

**Bài 1: Xác định Loại Năm (Năm Nhuận Nâng Cao)**

- **Mô tả bài toán:** Cho một năm `nam`. Xác định xem đó có phải là năm nhuận hay không.
- **Input:** Một số nguyên `nam`.
- **Output:** In ra "Đây là năm nhuận." hoặc "Đây KHÔNG phải là năm nhuận."
- **Ràng buộc:** `0 <= nam <= 3000`
- **Điều kiện năm nhuận:**
    1. Năm đó chia hết cho 400.
    2. HOẶC năm đó chia hết cho 4 nhưng KHÔNG chia hết cho 100.
- **Ví dụ kiểm thử:**
    
    ```python
    Input: nam = 2000
    Output: Đây là năm nhuận.
    
    Input: nam = 2024
    Output: Đây là năm nhuận.
    
    Input: nam = 1900
    Output: Đây KHÔNG phải là năm nhuận.
    
    Input: nam = 2023
    Output: Đây KHÔNG phải là năm nhuận.
    ```
    

**Bài 2: Hệ Thống Đánh Giá Học Sinh Toàn Diện**

- **Mô tả bài toán:** Cho điểm môn Toán `diem_toan`, điểm môn Văn `diem_van`, và số buổi học vắng `so_buoi_vang`.
- **Input:**
    - `diem_toan`: Một số thực (0.0 - 10.0).
    - `diem_van`: Một số thực (0.0 - 10.0).
    - `so_buoi_vang`: Một số nguyên không âm.
- **Output:** In ra xếp loại học lực của học sinh.
- **Ràng buộc:** `0.0 <= diem_toan, diem_van <= 10.0`, `0 <= so_buoi_vang <= 100`
- **Xếp loại:**
    - **Xuất sắc:** Trung bình cộng 2 môn >= 9.0 VÀ số buổi vắng < 3.
    - **Giỏi:** Trung bình cộng 2 môn >= 8.0 VÀ không có môn nào dưới 6.5 VÀ số buổi vắng < 5.
    - **Khá:** Trung bình cộng 2 môn >= 6.5 VÀ không có môn nào dưới 5.0 VÀ số buổi vắng < 7.
    - **Trung bình:** Trung bình cộng 2 môn >= 5.0 HOẶC chỉ có 1 môn dưới 5.0 VÀ số buổi vắng < 10.
    - **Yếu:** Các trường hợp còn lại.
- **Ví dụ kiểm thử:**
    
    ```python
    Input: diem_toan = 9.5, diem_van = 9.0, so_buoi_vang = 2
    Output: Học sinh Xuất sắc.
    
    Input: diem_toan = 8.0, diem_van = 8.5, so_buoi_vang = 4
    Output: Học sinh Giỏi.
    
    Input: diem_toan = 7.0, diem_van = 6.0, so_buoi_vang = 6
    Output: Học sinh Khá.
    
    Input: diem_toan = 4.0, diem_van = 7.0, so_buoi_vang = 8
    Output: Học sinh Trung bình.
    
    Input: diem_toan = 3.0, diem_van = 4.0, so_buoi_vang = 12
    Output: Học sinh Yếu.
    ```
    

**Bài 3: Hệ Thống Giá Cước Taxi**

- **Mô tả bài toán:** Một hãng taxi tính giá cước dựa trên khoảng cách `khoang_cach` (km) và thời gian trong ngày `thoi_gian_trong_ngay` (chuỗi: "ngay" hoặc "dem").
- **Input:**
    - `khoang_cach`: Một số thực dương.
    - `thoi_gian_trong_ngay`: Chuỗi ("ngay" hoặc "dem").
- **Output:** In ra tổng số tiền cước taxi.
- **Ràng buộc:** `khoang_cach > 0`, `thoi_gian_trong_ngay` là "ngay" hoặc "dem".
- **Mức giá:**
    - **Ban ngày:**
        - 1 km đầu: 15.000 VND
        - Từ km thứ 2 đến km thứ 10: 12.000 VND/km
        - Từ km thứ 11 trở đi: 10.000 VND/km
    - **Ban đêm (từ 22h - 6h sáng hôm sau):**
        - 1 km đầu: 18.000 VND
        - Từ km thứ 2 đến km thứ 10: 15.000 VND/km
        - Từ km thứ 11 trở đi: 13.000 VND/km
- **Ví dụ kiểm thử:**
    
    ```python
    Input: khoang_cach = 0.5, thoi_gian_trong_ngay = "ngay"
    Output: Tổng tiền cước: 15000.0 VND
    
    Input: khoang_cach = 7.0, thoi_gian_trong_ngay = "ngay"
    Output: Tổng tiền cước: 90000.0 VND
    
    Input: khoang_cach = 15.0, thoi_gian_trong_ngay = "dem"
    Output: Tổng tiền cước: 200000.0 VND
    ```
    

**Bài 4: Phân Loại Thời Tiết và Hoạt Động Gợi Ý**

- **Mô tả bài toán:** Cho nhiệt độ `nhiet_do` (độ C) và trạng thái trời `trang_thai_troi` (chuỗi: "nang", "nhieu may", "mua", "tuyet").
- **Input:**
    - `nhiet_do`: Một số thực.
    - `trang_thai_troi`: Chuỗi ("nang", "nhieu may", "mua", "tuyet").
- **Output:** In ra dự báo thời tiết và gợi ý hoạt động.
- **Ràng buộc:** `50 <= nhiet_do <= 50`
- **Phân loại nhiệt độ:**
    - **Nhiệt độ >= 30:** "Nóng"
    - **Nhiệt độ 20-29:** "Ấm áp"
    - **Nhiệt độ 10-19:** "Mát mẻ"
    - **Nhiệt độ 0-9:** "Lạnh"
    - **Nhiệt độ < 0:** "Rất lạnh"
- **Gợi ý hoạt động (dựa trên thời tiết tổng thể):**
    - **Trời nắng (nang) và Nóng/Ấm áp:** "Thích hợp đi chơi ngoài trời!"
    - **Trời mưa (mua):** "Nên ở trong nhà, đọc sách hoặc xem phim."
    - **Trời tuyết (tuyet) và Rất lạnh:** "Cẩn thận trượt ngã, mặc ấm và ở trong nhà."
    - **Các trường hợp còn lại:** "Hoạt động bình thường."
- **Ví dụ kiểm thử:**
    
    ```python
    Input: nhiet_do = 32, trang_thai_troi = "nang"
    Output: Thời tiết: Nóng. Gợi ý: Thích hợp đi chơi ngoài trời!
    
    Input: nhiet_do = 15, trang_thai_troi = "mua"
    Output: Thời tiết: Mát mẻ. Gợi ý: Nên ở trong nhà, đọc sách hoặc xem phim.
    
    Input: nhiet_do = -5, trang_thai_troi = "tuyet"
    Output: Thời tiết: Rất lạnh. Gợi ý: Cẩn thận trượt ngã, mặc ấm và ở trong nhà.
    
    Input: nhiet_do = 22, trang_thai_troi = "nhieu may"
    Output: Thời tiết: Ấm áp. Gợi ý: Hoạt động bình thường.
    ```
    

**Bài 5: Xác định Phân Loại Thu Nhập và Thuế**

- **Mô tả bài toán:** Cho tổng thu nhập hàng năm `thu_nhap_nam`. Tính mức thuế phải đóng và phân loại thu nhập.
- **Input:** Một số thực dương `thu_nhap_nam`.
- **Output:** In ra "Phân loại thu nhập: [Phân loại]", "Thuế phải đóng: [Số tiền thuế]".
- **Ràng buộc:** `thu_nhap_nam >= 0`
- **Phân loại và Thuế suất:**
    - **Dưới 100 triệu:** "Thấp". Thuế 5%.
    - **Từ 100 triệu đến dưới 300 triệu:** "Trung bình". Thuế 10%.
    - **Từ 300 triệu đến dưới 500 triệu:** "Khá". Thuế 15%.
    - **Từ 500 triệu trở lên:** "Cao". Thuế 20%.
- **Ví dụ kiểm thử:**
    
    ```python
    Input: thu_nhap_nam = 75000000
    Output: Phân loại thu nhập: Thấp. Thuế phải đóng: 3750000.0 VND
    
    Input: thu_nhap_nam = 200000000
    Output: Phân loại thu nhập: Trung bình. Thuế phải đóng: 20000000.0 VND
    
    Input: thu_nhap_nam = 600000000
    Output: Phân loại thu nhập: Cao. Thuế phải đóng: 120000000.0 VND
    ```
    

**Bài 6: Quyết Định Giảm Giá Đơn Hàng (Nâng Cao)**

- **Mô tả bài toán:** Một cửa hàng có nhiều chính sách giảm giá dựa trên tổng giá trị đơn hàng `tong_gia_tri_don_hang`, số lượng mặt hàng `so_luong_mat_hang`, và việc khách hàng có là thành viên thân thiết hay không `la_thanh_vien_than_thiet` (Boolean).
- **Input:**
    - `tong_gia_tri_don_hang`: Một số thực dương.
    - `so_luong_mat_hang`: Một số nguyên dương.
    - `la_thanh_vien_than_thiet`: Boolean (`True` hoặc `False`).
- **Output:** In ra tổng giá trị đơn hàng cuối cùng sau khi áp dụng giảm giá và lý do giảm giá.
- **Ràng buộc:** `tong_gia_tri_don_hang > 0`, `so_luong_mat_hang > 0`
- **Chính sách giảm giá (ưu tiên từ trên xuống):**
    1. **Siêu giảm giá:** Nếu `tong_gia_tri_don_hang` >= 5.000.000 VND HOẶC (`so_luong_mat_hang` >= 20 VÀ `la_thanh_vien_than_thiet` là `True`): Giảm 20% tổng giá trị.
    2. **Giảm giá đặc biệt:** Nếu `tong_gia_tri_don_hang` >= 2.000.000 VND HOẶC `so_luong_mat_hang` >= 10: Giảm 10% tổng giá trị.
    3. **Giảm giá cho thành viên:** Nếu `la_thanh_vien_than_thiet` là `True` (và không thuộc các trường hợp trên): Giảm 5% tổng giá trị.
    4. **Không giảm giá:** Các trường hợp còn lại.
- **Ví dụ kiểm thử:**
    
    ```python
    Input: tong_gia_tri_don_hang = 6000000, so_luong_mat_hang = 5, la_thanh_vien_than_thiet = False
    Output: Tổng tiền sau giảm giá 20%: 4800000.0 VND (Siêu giảm giá)
    
    Input: tong_gia_tri_don_hang = 1000000, so_luong_mat_hang = 25, la_thanh_vien_than_thiet = True
    Output: Tổng tiền sau giảm giá 20%: 800000.0 VND (Siêu giảm giá)
    
    Input: tong_gia_tri_don_hang = 2500000, so_luong_mat_hang = 8, la_thanh_vien_than_thiet = False
    Output: Tổng tiền sau giảm giá 10%: 2250000.0 VND (Giảm giá đặc biệt)
    
    Input: tong_gia_tri_don_hang = 500000, so_luong_mat_hang = 3, la_thanh_vien_than_thiet = True
    Output: Tổng tiền sau giảm giá 5%: 475000.0 VND (Giảm giá cho thành viên)
    
    Input: tong_gia_tri_don_hang = 100000, so_luong_mat_hang = 2, la_thanh_vien_than_thiet = False
    Output: Không có giảm giá. Tổng tiền: 100000.0 VND
    ```
    

**Bài 7: Xác định Phân Loại Số Học (Dương/Âm, Chẵn/Lẻ, Chia hết cho 3/5)**

- **Mô tả bài toán:** Cho một số nguyên `so_nguyen`. Phân loại số đó dựa trên tính chẵn/lẻ, dương/âm, và khả năng chia hết cho 3 hoặc 5.
- **Input:** Một số nguyên `so_nguyen`.
- **Output:** In ra phân loại của số.
- **Ràng buộc:** `1000 <= so_nguyen <= 1000`
- **Phân loại (ưu tiên từ trên xuống):**
    - Nếu `so_nguyen` là 0: "Số 0."
    - Nếu `so_nguyen` là số dương:
        - Nếu `so_nguyen` chia hết cho cả 3 và 5: "Số dương, chia hết cho 3 và 5."
        - Nếu `so_nguyen` chỉ chia hết cho 3 (không chia hết cho 5): "Số dương, chỉ chia hết cho 3."
        - Nếu `so_nguyen` chỉ chia hết cho 5 (không chia hết cho 3): "Số dương, chỉ chia hết cho 5."
        - Nếu `so_nguyen` là số chẵn (và không thuộc các trường hợp trên): "Số dương chẵn."
        - Nếu `so_nguyen` là số lẻ (và không thuộc các trường hợp trên): "Số dương lẻ."
    - Nếu `so_nguyen` là số âm:
        - Nếu `so_nguyen` chia hết cho 2: "Số âm chẵn."
            - Nếu `so_nguyen` không chia hết cho 2: "Số âm lẻ."
- **Ví dụ kiểm thử:**
    
    ```python
    Input: so_nguyen = 0
    Output: Số 0.
    
    Input: so_nguyen = 15
    Output: Số dương, chia hết cho 3 và 5.
    
    Input: so_nguyen = 6
    Output: Số dương, chỉ chia hết cho 3.
    
    Input: so_nguyen = 10
    Output: Số dương, chỉ chia hết cho 5.
    
    Input: so_nguyen = 4
    Output: Số dương chẵn.
    
    Input: so_nguyen = 7
    Output: Số dương lẻ.
    
    Input: so_nguyen = -4
    Output: Số âm chẵn.
    
    Input: so_nguyen = -7
    Output: Số âm lẻ.
    ```
    

**Bài 8: Kiểm Tra và Đánh Giá Mật Khẩu Đơn Giản**

- **Mô tả bài toán:** Cho một chuỗi `mat_khau`. Đánh giá độ mạnh của mật khẩu dựa trên các tiêu chí đơn giản. (Để đơn giản hóa, học sinh có thể dùng vòng lặp để kiểm tra từng ký tự hoặc dùng các phương thức chuỗi nếu đã học).
- **Input:** Một chuỗi `mat_khau`.
- **Output:** In ra "Mật khẩu [Độ mạnh]" và lý do.
- **Ràng buộc:** Độ dài chuỗi từ 1 đến 50 ký tự.
- **Tiêu chí:**
    - **Rất mạnh:** Độ dài >= 12 ký tự VÀ (có chứa ít nhất một chữ hoa) VÀ (có chứa ít nhất một chữ số).
    - **Mạnh:** Độ dài >= 8 ký tự VÀ ((có chứa ít nhất một chữ hoa) HOẶC (có chứa ít nhất một chữ số)).
    - **Trung bình:** Độ dài >= 6 ký tự.
    - **Yếu:** Các trường hợp còn lại.
    - *(Gợi ý nếu chưa học vòng lặp/any(): Để kiểm tra "có chứa ít nhất một chữ hoa", bạn có thể đơn giản hóa bằng cách: "Có ký tự nào là chữ hoa trong 'A'...'Z' không?" (và tương tự cho chữ số).)*
- **Ví dụ kiểm thử:**
    
    ```python
    Input: mat_khau = "Password123"
    Output: Mật khẩu Rất mạnh.
    
    Input: mat_khau = "mypassword"
    Output: Mật khẩu Yếu.
    
    Input: mat_khau = "MyPass1"
    Output: Mật khẩu Mạnh.
    
    Input: mat_khau = "short"
    Output: Mật khẩu Yếu.
    
    Input: mat_khau = "LongEnough"
    Output: Mật khẩu Mạnh.
    ```
    

**Bài 9: Xử Lý Đơn Hàng Online (Trạng thái và Thông báo)**

- **Mô tả bài toán:** Một hệ thống quản lý đơn hàng có các trạng thái `trang_thai_don_hang` (chuỗi: "cho xu ly", "dang van chuyen", "da giao", "da huy") và cờ `co_van_de` (Boolean: `True` nếu có vấn đề, `False` nếu không).
- **Input:**
    - `trang_thai_don_hang`: Chuỗi trạng thái.
    - `co_van_de`: Boolean.
- **Output:** In ra thông báo cho khách hàng về trạng thái đơn hàng.
- **Ràng buộc:** `trang_thai_don_hang` là một trong các giá trị cho trước.
- **Thông báo (ưu tiên từ trên xuống):**
    - Nếu `trang_thai_don_hang` là "da huy": "Đơn hàng của bạn đã bị hủy."
    - Nếu `co_van_de` là `True`: "Đơn hàng của bạn có vấn đề. Vui lòng liên hệ hỗ trợ."
    - Nếu `trang_thai_don_hang` là "da giao": "Đơn hàng của bạn đã được giao thành công!"
    - Nếu `trang_thai_don_hang` là "dang van chuyen": "Đơn hàng của bạn đang trên đường vận chuyển."
    - Nếu `trang_thai_don_hang` là "cho xu ly": "Đơn hàng của bạn đang chờ xử lý."
    - Nếu `trang_thai_don_hang` không hợp lệ: "Trạng thái đơn hàng không xác định."
- **Ví dụ kiểm thử:**
    
    ```python
    Input: trang_thai_don_hang = "da huy", co_van_de = False
    Output: Đơn hàng của bạn đã bị hủy.
    
    Input: trang_thai_don_hang = "dang van chuyen", co_van_de = True
    Output: Đơn hàng của bạn có vấn đề. Vui lòng liên hệ hỗ trợ.
    
    Input: trang_thai_don_hang = "da giao", co_van_de = False
    Output: Đơn hàng của bạn đã được giao thành công!
    
    Input: trang_thai_don_hang = "cho xu ly", co_van_de = False
    Output: Đơn hàng của bạn đang chờ xử lý.
    ```
    

**Bài 10: Xếp Loại Điểm Chuẩn cho Nhập Học**

- **Mô tả bài toán:** Một trường học xét tuyển dựa trên điểm phỏng vấn `diem_phong_van` và số lượng giải thưởng `so_giai_thuong` mà học sinh đạt được.
- **Input:**
    - `diem_phong_van`: Một số thực (0.0 - 10.0).
    - `so_giai_thuong`: Một số nguyên không âm.
- **Output:** In ra trạng thái "Được chấp nhận" hoặc "Bị từ chối" cùng với lý do.
- **Ràng buộc:** `0.0 <= diem_phong_van <= 10.0`, `0 <= so_giai_thuong <= 100`
- **Tiêu chí tuyển dụng:**
    - **Được chấp nhận:**
        - Điểm phỏng vấn >= 9.0 (được chấp nhận thẳng).
        - HOẶC Điểm phỏng vấn >= 8.0 VÀ số giải thưởng >= 3.
        - HOẶC Điểm phỏng vấn >= 7.0 VÀ số giải thưởng >= 5.
    - **Bị từ chối:** Các trường hợp còn lại.
- **Ví dụ kiểm thử:**
    
    ```python
    Input: diem_phong_van = 9.2, so_giai_thuong = 1
    Output: Được chấp nhận (Điểm cao).
    
    Input: diem_phong_van = 8.5, so_giai_thuong = 4
    Output: Được chấp nhận (Điểm tốt và nhiều giải thưởng).
    
    Input: diem_phong_van = 7.5, so_giai_thuong = 2
    Output: Bị từ chối (Chưa đủ điều kiện).
    
    Input: diem_phong_van = 7.0, so_giai_thuong = 5
    Output: Được chấp nhận (Điểm vừa và nhiều giải thưởng).
    ```
    

**Bài 11: Kiểm Tra Tính Hợp Lệ Của Ngày (Tháng có 30, 31, 28/29 ngày)**

- **Mô tả bài toán:** Cho `ngay` và `thang`. Kiểm tra xem ngày đó có hợp lệ trong năm (không xét năm nhuận ở đây, tháng 2 luôn có 28 ngày) hay không.
- **Input:**
    - `ngay`: Một số nguyên.
    - `thang`: Một số nguyên.
- **Output:** In ra "Ngày hợp lệ." hoặc "Ngày KHÔNG hợp lệ."
- **Ràng buộc:** `ngay >= 1`, `thang >= 1`
- **Quy tắc:**
    - Các tháng có 31 ngày: 1, 3, 5, 7, 8, 10, 12.
    - Các tháng có 30 ngày: 4, 6, 9, 11.
    - Tháng 2: Có 28 ngày.
    - Kiểm tra `ngay` phải nằm trong giới hạn của `thang` đó.
- **Ví dụ kiểm thử:**
    
    ```python
    Input: ngay = 31, thang = 1
    Output: Ngày hợp lệ.
    
    Input: ngay = 31, thang = 4
    Output: Ngày KHÔNG hợp lệ.
    
    Input: ngay = 29, thang = 2
    Output: Ngày KHÔNG hợp lệ.
    
    Input: ngay = 15, thang = 10
    Output: Ngày hợp lệ.
    
    Input: ngay = 0, thang = 5
    Output: Ngày KHÔNG hợp lệ.
    ```
    

**Bài 12: Phân Loại Phản Hồi Khách Hàng**

- **Mô tả bài toán:** Cho điểm hài lòng `diem_hai_long` (1-5) và một cờ `co_tu_ngu_tieu_cuc` (Boolean: `True` nếu phản hồi chứa từ ngữ tiêu cực như "tệ", "xấu", `False` nếu không).
- **Input:**
    - `diem_hai_long`: Một số nguyên (1-5).
    - `co_tu_ngu_tieu_cuc`: Boolean.
- **Output:** In ra phân loại phản hồi chi tiết.
- **Ràng buộc:** `1 <= diem_hai_long <= 5`
- **Phân loại (ưu tiên từ trên xuống):**
    - Nếu `diem_hai_long` = 5:
        - Nếu `co_tu_ngu_tieu_cuc` là `True`: "Phản hồi mâu thuẫn (Điểm cao nhưng có từ ngữ tiêu cực)."
        - Nếu `co_tu_ngu_tieu_cuc` là `False`: "Phản hồi Rất tích cực."
    - Nếu `diem_hai_long` = 4: "Phản hồi Tích cực."
    - Nếu `diem_hai_long` = 3: "Phản hồi Trung lập."
    - Nếu `diem_hai_long` = 1 HOẶC `diem_hai_long` = 2:
        - Nếu `co_tu_ngu_tieu_cuc` là `True`: "Phản hồi Rất tiêu cực, có chi tiết."
        - Nếu `co_tu_ngu_tieu_cuc` là `False`: "Phản hồi Tiêu cực (không có chi tiết)."
- **Ví dụ kiểm thử:**
    
    ```python
    Input: diem_hai_long = 5, co_tu_ngu_tieu_cuc = True
    Output: Phản hồi mâu thuẫn (Điểm cao nhưng có từ ngữ tiêu cực).
    
    Input: diem_hai_long = 5, co_tu_ngu_tieu_cuc = False
    Output: Phản hồi Rất tích cực.
    
    Input: diem_hai_long = 3, co_tu_ngu_tieu_cuc = False
    Output: Phản hồi Trung lập.
    
    Input: diem_hai_long = 1, co_tu_ngu_tieu_cuc = True
    Output: Phản hồi Rất tiêu cực, có chi tiết.
    
    Input: diem_hai_long = 2, co_tu_ngu_tieu_cuc = False
    Output: Phản hồi Tiêu cực (không có chi tiết).
    ```
    

**Bài 13: Quyết Định Tuyển Dụng Nhân Sự**

- **Mô tả bài toán:** Một công ty tuyển dụng dựa trên điểm phỏng vấn `diem_phong_van`, kinh nghiệm làm việc `so_nam_kinh_nghiem`, và việc có bằng cấp liên quan `co_bang_cap_lien_quan` (Boolean).
- **Input:**
    - `diem_phong_van`: Một số thực (0.0 - 10.0).
    - `so_nam_kinh_nghiem`: Một số nguyên không âm.
    - `co_bang_cap_lien_quan`: Boolean.
- **Output:** In ra "Ứng viên [Trạng thái]" và lý do.
- **Ràng buộc:** `0.0 <= diem_phong_van <= 10.0`, `0 <= so_nam_kinh_nghiem <= 50`
- **Tiêu chí tuyển dụng (ưu tiên từ trên xuống):**
    - **Tuyển thẳng:** `diem_phong_van` >= 9.0 VÀ `so_nam_kinh_nghiem` >= 5.
    - **Xem xét thêm:** `diem_phong_van` >= 7.0 HOẶC (`so_nam_kinh_nghiem` >= 3 VÀ `co_bang_cap_lien_quan` là `True`).
    - **Từ chối (không đủ điều kiện cơ bản):** `diem_phong_van` < 5.0.
    - **Phỏng vấn lại:** Các trường hợp còn lại.
- **Ví dụ kiểm thử:**
    
    ```python
    Input: diem_phong_van = 9.5, so_nam_kinh_nghiem = 6, co_bang_cap_lien_quan = True
    Output: Ứng viên Tuyển thẳng (Điểm cao và kinh nghiệm).
    
    Input: diem_phong_van = 7.5, so_nam_kinh_nghiem = 2, co_bang_cap_lien_quan = True
    Output: Ứng viên Xem xét thêm (Điểm tốt).
    
    Input: diem_phong_van = 6.0, so_nam_kinh_nghiem = 4, co_bang_cap_lien_quan = False
    Output: Ứng viên Phỏng vấn lại.
    
    Input: diem_phong_van = 4.0, so_nam_kinh_nghiem = 1, co_bang_cap_lien_quan = True
    Output: Ứng viên Từ chối (Không đủ điều kiện cơ bản).
    ```
    

**Bài 14: Xác định Điểm Đến của Người Dùng (Theo Thời gian và Sở thích)**

- **Mô tả bài toán:** Một ứng dụng gợi ý địa điểm dựa trên `gio_hien_tai` (số nguyên 0-23) và `so_thich_nguoi_dung` (chuỗi: "am thuc", "thien nhien", "mua sam", "khac").
- **Input:**
    - `gio_hien_tai`: Một số nguyên (0-23).
    - `so_thich_nguoi_dung`: Chuỗi.
- **Output:** In ra gợi ý điểm đến.
- **Ràng buộc:** `0 <= gio_hien_tai <= 23`
- **Gợi ý:**
    - **Buổi sáng (6h-11h):**
        - Nếu `so_thich_nguoi_dung` là "thien nhien": "Gợi ý: Công viên hoặc hồ."
        - Nếu `so_thich_nguoi_dung` là "am thuc": "Gợi ý: Quán ăn sáng hoặc cafe."
        - Các sở thích khác: "Gợi ý: Khu vực trung tâm thành phố."
    - **Buổi trưa/chiều (12h-17h):**
        - Nếu `so_thich_nguoi_dung` là "mua sam": "Gợi ý: Trung tâm thương mại."
        - Nếu `so_thich_nguoi_dung` là "am thuc": "Gợi ý: Nhà hàng ăn trưa."
        - Các sở thích khác: "Gợi ý: Bảo tàng hoặc phòng trưng bày."
    - **Buổi tối (18h-23h):**
        - Nếu `so_thich_nguoi_dung` là "am thuc": "Gợi ý: Quán ăn tối hoặc bar/pub."
        - Các sở thích khác: "Gợi ý: Rạp chiếu phim hoặc nhà hát."
    - **Đêm khuya/sáng sớm (0h-5h):** "Gợi ý: Hãy nghỉ ngơi, trời đã muộn rồi."
- **Ví dụ kiểm thử:**
    
    ```python
    Input: gio_hien_tai = 8, so_thich_nguoi_dung = "thien nhien"
    Output: Gợi ý: Công viên hoặc hồ.
    
    Input: gio_hien_tai = 14, so_thich_nguoi_dung = "mua sam"
    Output: Gợi ý: Trung tâm thương mại.
    
    Input: gio_hien_tai = 20, so_thich_nguoi_dung = "am thuc"
    Output: Gợi ý: Quán ăn tối hoặc bar/pub.
    
    Input: gio_hien_tai = 3, so_thich_nguoi_dung = "khac"
    Output: Gợi ý: Hãy nghỉ ngơi, trời đã muộn rồi.
    ```
    

**Bài 15: Mô Phỏng Điều Khiển Đèn Giao Thông Đơn Giản**

- **Mô tả bài toán:** Mô phỏng hoạt động của đèn giao thông dựa trên `mau_den_hien_tai` (chuỗi: "do", "vang", "xanh") và `co_xe_uu_tien` (Boolean: `True` nếu có xe ưu tiên).
- **Input:**
    - `mau_den_hien_tai`: Chuỗi.
    - `co_xe_uu_tien`: Boolean.
- **Output:** In ra hành động được phép cho phương tiện.
- **Ràng buộc:** `mau_den_hien_tai` là "do", "vang", "xanh".
- **Quy tắc (ưu tiên từ trên xuống):**
    - Nếu `co_xe_uu_tien` là `True`: "Đèn ưu tiên: Xe ưu tiên được đi."
    - Nếu `mau_den_hien_tai` là "do": "Dừng lại."
    - Nếu `mau_den_hien_tai` là "vang": "Chuẩn bị dừng hoặc tăng tốc cẩn thận."
    - Nếu `mau_den_hien_tai` là "xanh": "Được phép đi."
    - Nếu `mau_den_hien_tai` không hợp lệ: "Trạng thái đèn không xác định."
- **Ví dụ kiểm thử:**
    
    ```python
    Input: mau_den_hien_tai = "do", co_xe_uu_tien = True
    Output: Đèn ưu tiên: Xe ưu tiên được đi.
    
    Input: mau_den_hien_tai = "xanh", co_xe_uu_tien = False
    Output: Được phép đi.
    
    Input: mau_den_hien_tai = "do", co_xe_uu_tien = False
    Output: Dừng lại.
    
    Input: mau_den_hien_tai = "vang", co_xe_uu_tien = False
    Output: Chuẩn bị dừng hoặc tăng tốc cẩn thận.
    ```
    
