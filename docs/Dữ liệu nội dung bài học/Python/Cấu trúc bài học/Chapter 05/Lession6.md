---
lessonId: "LS-03.06"
title: "Lesson 3.6: Kết hợp vòng lặp với if"
difficulty: "MEDIUM"
estimatedDuration: 40
prerequisites: ["LS-03.05"]
---

# Lesson 3.6: Kết hợp vòng lặp với if

## Mục tiêu

* Hiểu sâu sắc sự phối hợp nhịp nhàng giữa **Cấu trúc lặp** (duyệt qua từng phần tử) và **Cấu trúc rẽ nhánh `if`** (thẩm định và phân loại từng phần tử).
* Nắm vững như lòng bàn tay **4 mẫu thuật toán kinh điển** trong xử lý dữ liệu:
  1. Mẫu Đếm (Counter Pattern)
  2. Mẫu Cộng dồn / Tích lũy (Accumulator Pattern)
  3. Mẫu Lọc dữ liệu (Filter Pattern)
  4. Mẫu Cờ hiệu tìm kiếm (Search Flag Pattern)
* Thành thạo quy tắc đặt phạm vi biến (Variable Scope) và thụt lề chuẩn xác để tránh lỗi reset biến.

## Kiến thức chính

Nếu như vòng lặp đóng vai trò là "đôi chân" bước qua từng phần tử, thì câu lệnh `if` chính là "đôi mắt" quan sát và quyết định xem phần tử đó có đáng giá để xử lý hay không.

### 4 Mẫu thuật toán kinh điển khi kết hợp Vòng lặp + If:

| Mẫu thuật toán | Mục đích | Cách thiết lập biến phụ | Ví dụ bài toán thực tế |
| :--- | :--- | :--- | :--- |
| **1. Mẫu Đếm (Counter)** | Đếm xem có bao nhiêu phần tử thỏa mãn điều kiện. | Khởi tạo `dem = 0` **trước** vòng lặp. Thỏa điều kiện thì `dem += 1`. | Đếm số lượng học sinh đạt điểm Giỏi trong lớp. |
| **2. Mẫu Cộng dồn (Accumulator)** | Tính tổng các giá trị thỏa mãn tiêu chí. | Khởi tạo `tong = 0` **trước** vòng lặp. Thỏa điều kiện thì `tong += gia_tri`. | Tính tổng tiền của các hóa đơn trên 500.000đ. |
| **3. Mẫu Lọc (Filter)** | Chỉ hiển thị hoặc trích xuất những giá trị đạt chuẩn. | Không nhất thiết cần biến phụ, chỉ `print()` khi điều kiện `if` đúng. | In ra danh sách các số chẵn trong một đoạn. |
| **4. Mẫu Cờ hiệu (Flag)** | Kiểm tra xem một phần tử có tồn tại hay không, hoặc lấy phần tử đầu tiên. | Khởi tạo `tim_thay = False`. Khi gặp thì gán `True` và dùng `break`. | Kiểm tra xem lớp học có học sinh nào đạt điểm 10 không. |

## Hiểu

### Ẩn dụ thực tế: Máy phân loại cam tự động

Hãy tưởng tượng một chiếc máy phân loại trái cây trên dây chuyền:
1. **Vòng lặp (`for`):** Băng chuyền chuyển từng quả cam đi qua mắt thần cảm biến.
2. **Cảm biến (`if`):** Mắt thần quét đường kính quả cam:
   * Nếu quả cam to ($\ge 8\text{ cm}$): Kích hoạt cần gạt đẩy vào thùng "Cam loại 1" và nhảy số bộ đếm: `so_cam_to += 1`.
   * Nếu quả cam nhỏ ($< 8\text{ cm}$): Bỏ qua, để quả cam trôi tiếp sang thùng cam thường.

### Sơ đồ luồng logic trực quan:

```text
               [Khởi tạo: dem = 0, tong = 0]
                             │
                             ▼
              ┌──► [Lấy phần tử tiếp theo] ──(Hết dữ liệu)──► [In dem, tong]
              │              │
              │              ▼
              │      <Thỏa điều kiện if?>
              │       │                │
              │    (ĐÚNG)            (SAI)
              │       ▼                ▼
              │  [XỬ LÝ DỮ LIỆU]   [BỎ QUA]
              │    dem += 1            │
              │    tong += so          │
              │       │                │
              └───────┴────────────────┘
```

## Làm theo

### Ví dụ 1: Đếm số lượng số chẵn trong đoạn từ A đến B (Mẫu Đếm)

```python
a = int(input())
b = int(input())

dem_chan = 0  # BƯỚC 1: Khởi tạo biến đếm TRƯỚC vòng lặp

for so in range(a, b + 1):
    if so % 2 == 0:  # BƯỚC 2: Kiểm tra điều kiện chẵn
        dem_chan += 1  # BƯỚC 3: Thỏa mãn thì tăng đếm thêm 1

# BƯỚC 4: In kết quả SAU KHI vòng lặp chạy xong toàn bộ
print("Số lượng số chẵn là:", dem_chan)
```

---

### Ví dụ 2: Tính tổng các số chia hết cho 5 từ 1 đến N (Mẫu Cộng dồn)

```python
n = int(input())
tong_chia_5 = 0  # Bắt đầu với tổng bằng 0

for so in range(1, n + 1):
    if so % 5 == 0:
        tong_chia_5 += so

print("Tổng các số chia hết cho 5 là:", tong_chia_5)
```

### Bảng theo dõi thực thi khi nhập `n = 15`:

| Lượt lặp | Giá trị `so` | Kiểm tra `so % 5 == 0` | Xử lý biến `tong_chia_5` | Trạng thái tổng sau lượt |
| :---: | :---: | :---: | :--- | :---: |
| **1..4** | `1, 2, 3, 4` | **SAI** | Bỏ qua | `0` |
| **5** | `5` | **ĐÚNG** | `tong_chia_5 = 0 + 5` | `5` |
| **6..9** | `6, 7, 8, 9` | **SAI** | Bỏ qua | `5` |
| **10** | `10` | **ĐÚNG** | `tong_chia_5 = 5 + 10` | `15` |
| **11..14**| `11, 12, 13, 14` | **SAI** | Bỏ qua | `15` |
| **15** | `15` | **ĐÚNG** | `tong_chia_5 = 15 + 15` | `30` |
| **Kết quả**| — | — | In ra màn hình | `30` |

---

### Ví dụ 3: Tìm điểm đạt (>= 5) đầu tiên trong danh sách (Mẫu Cờ hiệu + Break)

```python
# Cho danh sách các điểm kiểm tra: 2, 3, 7, 4, 9
n = int(input())  # Số lượng bài thi
diem_dau_tien = -1  # Dùng -1 để đánh dấu nếu không tìm thấy

for _ in range(n):
    diem = float(input())
    if diem >= 5.0:
        diem_dau_tien = diem
        break  # Tìm thấy điểm đạt đầu tiên là dừng ngay!

if diem_dau_tien != -1:
    print("Điểm đạt đầu tiên tìm thấy là:", diem_dau_tien)
else:
    print("Không có bài thi nào đạt điểm từ 5 trở lên.")
```

## Tự làm & Cảnh báo 2 bẫy phổ biến nhất

> [!WARNING]
> **Bẫy 1: Khởi tạo biến đếm BÊN TRONG vòng lặp!**
> ```python
> for so in range(1, 10):
>     dem = 0  # SAI LẦM: Cứ mỗi vòng lặp dem lại bị reset về 0!
>     if so % 2 == 0:
>         dem += 1
> print(dem)   # Kết quả in ra luôn luôn là 1 hoặc 0!
> ```
> 👉 **Quy tắc vàng:** Biến tích lũy (`dem`, `tong`) **bắt buộc phải nằm TRƯỚC** vòng lặp!
>
> **Bẫy 2: Thụt lề sai lệnh `print` kết quả:**
> ```python
> for so in range(1, 6):
>     tong += so
>     print(tong)  # Thụt lề sai: Lệnh print bị lặp lại 5 lần thay vì chỉ in kết quả cuối cùng!
> ```

### Thử thách tư duy:
Viết chương trình nhập vào số nguyên dương $N$. Đếm xem trong khoảng từ 1 đến $N$ có bao nhiêu số vừa chia hết cho 2 vừa chia hết cho 3 (tức chia hết cho 6).

## Vận dụng

Kỹ thuật kết hợp `vòng lặp + if` là xương sống của mọi hệ thống xử lý Big Data và thương mại điện tử:
* **Shopee / Lazada:** Lọc ra tất cả các sản phẩm có đánh giá $\ge 4.5$ sao và miễn phí vận chuyển.
* **Hệ thống cảnh báo an ninh:** Duyệt nhật ký đăng nhập, đếm số lần đăng nhập thất bại liên tiếp để khóa tài khoản.

---

### 🚀 Bước tiếp theo

Bạn đã có thể duyệt qua một dãy số 1 chiều và lọc dữ liệu cực kỳ nhuần nhuyễn. Nhưng nếu dữ liệu có dạng **Bảng 2 chiều** (như hàng và cột trong Excel, ma trận bàn cờ, hoặc in ra các hình chữ nhật dấu sao) thì một vòng lặp đơn lẻ là chưa đủ!

Hãy cùng chinh phục thử thách đỉnh cao tiếp theo: **Lesson 3.7: Vòng lặp lồng nhau (Nested Loops)**!
