---
lessonId: "LS-03.08"
title: "Lesson 3.8: Luyện tập tổng hợp và mini project"
difficulty: "MEDIUM"
estimatedDuration: 45
prerequisites: ["LS-03.07"]
---

# Lesson 3.8: Luyện tập tổng hợp và mini project

## Mục tiêu

* Hệ thống hóa và kết nối toàn bộ các mắt xích kiến thức của Module 3: Vòng lặp `for`, vòng lặp `while`, hàm `range()`, phanh khẩn cấp `break`, bỏ qua `continue`, kết hợp điều kiện `if`, và vòng lặp lồng nhau.
* Làm chủ **Cây quyết định (Decision Tree)**: Đứng trước một bài toán bất kỳ, biết cách lựa chọn chính xác công cụ lặp tối ưu nhất.
* Áp dụng thành thạo **Quy trình 4 câu hỏi vàng** để bẻ khóa bài toán từ yêu cầu bằng lời thành những dòng mã sạch đẹp.
* Hoàn thiện 2 Mini Project thực chiến: **Hệ thống thống kê điểm thi** và **Báo cáo phân tích nhiệt độ**.

## Kiến thức chính

### Cây quyết định: Chọn chiến lược vòng lặp tối ưu

```text
                           [BẮT ĐẦU BÀI TOÁN]
                                    │
                     Đã biết trước số lần lặp chưa?
                      /                           \
                  (CÓ)                            (CHƯA)
                   ▼                                ▼
            Dùng [FOR + RANGE]                 Dùng [WHILE]
                   │                                │
            Cần lọc / tính toán?            Cần lọc / điều kiện dừng?
                   │                                │
              Kết hợp [IF]                    Cập nhật biến điều kiện
                   │                                │
          Cần xử lý bảng / 2D?             Có tình huống ngắt sớm?
                   │                                │
           Dùng [VÒNG LẶP LỒNG]               Dùng [BREAK / CONTINUE]
```

### Bộ 4 câu hỏi vàng khi phân tích bài toán thực tế:
1. **Lặp cái gì?** Đối tượng lặp là các số trong một đoạn, danh sách nhập vào, hay các hàng trong bảng?
2. **Khi nào dừng?** Đủ $N$ lượt hay dừng khi người dùng gõ số 0, hay dừng khi gặp kết quả đầu tiên?
3. **Cần thu thập gì?** Cần biến đếm (`dem = 0`), biến tổng (`tong = 0`), hay biến cờ hiệu (`tim_thay = False`)?
4. **Có ngoại lệ nào không?** Dữ liệu rác cần bỏ qua (`continue`) hay sự cố nghiêm trọng cần dừng khẩn cấp (`break`)?

## Hiểu & Làm theo: Mini Project 1

### Dự án: Hệ Thống Thống Kê Điểm Lớp Học

**Mô tả bài toán:**
Giáo viên cần nhập sĩ số lớp học $N$, sau đó lần lượt nhập điểm của $N$ học viên. Hệ thống cần tính:
1. Tổng điểm của cả lớp.
2. Số lượng học viên đạt chuẩn (điểm $\ge 5.0$).
3. Điểm trung bình của cả lớp.

```python
# BƯỚC 1: Nhập sĩ số lớp
n = int(input())

# BƯỚC 2: Khởi tạo các biến tích lũy trước vòng lặp
tong_diem = 0.0
so_hoc_vien_dat = 0

# BƯỚC 3: Dùng vòng lặp for vì đã biết trước sĩ số n
for i in range(1, n + 1):
    diem = float(input())
    
    # Cộng dồn điểm vào tổng
    tong_diem += diem
    
    # Kiểm tra điều kiện đạt
    if diem >= 5.0:
        so_hoc_vien_dat += 1

# BƯỚC 4: Tính toán kết quả sau khi duyệt xong toàn bộ
diem_trung_binh = tong_diem / n if n > 0 else 0

# BƯỚC 5: In báo cáo tổng hợp
print("Tổng điểm cả lớp:", tong_diem)
print("Số học viên đạt chuẩn:", so_hoc_vien_dat)
print("Điểm trung bình:", round(diem_trung_binh, 2))
```

### Bảng trace kịch bản chạy thử nghiệm với $N = 3$, điểm: `4.0, 7.5, 8.5`:

| Học viên | Điểm nhập | `tong_diem` cộng dồn | Kiểm tra $\ge 5.0$ | `so_hoc_vien_dat` |
| :---: | :---: | :---: | :---: | :---: |
| **Khởi tạo** | — | `0.0` | — | `0` |
| **HV 1** | `4.0` | `0.0 + 4.0 = 4.0` | **SAI** | `0` |
| **HV 2** | `7.5` | `4.0 + 7.5 = 11.5` | **ĐÚNG** | `1` |
| **HV 3** | `8.5` | `11.5 + 8.5 = 20.0`| **ĐÚNG** | `2` |
| **Tổng kết** | — | `tong_diem = 20.0` | Trung bình: $20.0 / 3 \approx 6.67$ | `so_hoc_vien_dat = 2` |

---

## Hiểu & Làm theo: Mini Project 2

### Dự án: Báo Cáo Thời Tiết & Cảnh Báo Nhiệt Độ

**Mô tả bài toán:**
Nhập số ngày theo dõi thời tiết $N$ và nhiệt độ của từng ngày trong tuần. Chương trình cần đếm số ngày nắng nóng gay gắt (nhiệt độ $\ge 35^\circ\text{C}$), tính nhiệt độ trung bình và tìm ngày nóng nhất.

```python
so_ngay = int(input())

dem_nang_nong = 0
tong_nhiet_do = 0.0
nhiet_do_cao_nhat = -999.0  # Khởi tạo giá trị cực nhỏ để tìm Max

for ngay in range(1, so_ngay + 1):
    t = float(input())
    tong_nhiet_do += t
    
    # Đếm số ngày nắng nóng gay gắt
    if t >= 35.0:
        dem_nang_nong += 1
        
    # Cập nhật kỷ lục nhiệt độ cao nhất
    if t > nhiet_do_cao_nhat:
        nhiet_do_cao_nhat = t

print("Số ngày nắng nóng gay gắt:", dem_nang_nong)
print("Nhiệt độ cao nhất ghi nhận:", nhiet_do_cao_nhat)
print("Nhiệt độ trung bình cả đợt:", round(tong_nhiet_do / so_ngay, 1))
```

> [!TIP]
> **Kỹ thuật tìm Lớn nhất / Nhỏ nhất (Max / Min Pattern)**:
> Để tìm giá trị lớn nhất trong một dãy số, ta tạo một biến `max_val` ban đầu có giá trị rất nhỏ (hoặc bằng chính phần tử đầu tiên). Mỗi khi gặp một số lớn hơn `max_val`, ta lập tức cập nhật `max_val = so_moi`!

## Tự làm & Mở rộng

Hãy thử thách bản thân với 2 bài tập nâng cao:
1. **Thẩm định dữ liệu đầu vào (Input Validation):** Trong Mini Project 1, nếu người dùng lỡ tay nhập điểm âm (ví dụ: `-2`) hoặc điểm lớn hơn 10 (ví dụ: `15`), hãy dùng vòng lặp `while` để bắt buộc người dùng phải nhập lại cho đến khi điểm hợp lệ nằm trong khoảng $[0, 10]$ mới cho tiếp tục.
2. **Vẽ biểu đồ tần suất:** Nhập vào $N$ số nguyên dương. Với mỗi số, hãy in ra trên màn hình một dòng chứa bấy nhiêu dấu sao `*` tương ứng (sử dụng vòng lặp lồng nhau hoặc phép nhân chuỗi).

## Vận dụng

Những kỹ thuật bạn vừa thực hành trong bài này chính là cốt lõi của các hệ thống giám sát và báo cáo tài chính hàng đầu thế giới:
* **Hệ thống theo dõi máy chủ (Server Monitoring):** Quét nhiệt độ CPU mỗi 5 giây, đếm số lần nhiệt độ vượt ngưỡng an toàn để tự động bật quạt tản nhiệt hoặc gửi tin nhắn cảnh báo tới kỹ sư.
* **Sàn chứng khoán:** Duyệt qua hàng triệu giao dịch mỗi ngày, tìm mức giá đỉnh (Peak Price) và đáy (Dip Price) của từng mã cổ phiếu.

---

### 🏆 Chúc mừng bạn đã hoàn thành xuất sắc Module 3!

Vòng lặp là "hòn đá thử vàng" lớn nhất đối với bất kỳ ai mới bước chân vào con đường lập trình. Vượt qua được Module 3 đồng nghĩa với việc tư duy logic và kỹ năng điều khiển máy tính của bạn đã tăng lên một tầm cao mới!

Từ những lệnh cơ bản, bạn đã có thể xử lý hàng triệu phép toán chỉ với vài dòng mã thanh lịch.

**Điểm đến tiếp theo:**  
Trong **Module 4: Xử lý Chuỗi (String)**, chúng ta sẽ áp dụng chính những vòng lặp mạnh mẽ này để "mổ xẻ", tìm kiếm và phân tích các đoạn văn bản, chuẩn bị bước vào thế giới ứng dụng thực tế!
