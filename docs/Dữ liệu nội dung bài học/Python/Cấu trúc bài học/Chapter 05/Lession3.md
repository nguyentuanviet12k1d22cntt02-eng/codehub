---
lessonId: "LS-03.03"
title: "Lesson 3.3: Vòng lặp for và range()"
difficulty: "EASY"
estimatedDuration: 35
prerequisites: ["LS-03.02"]
---

# Lesson 3.3: Vòng lặp for và range()

## Mục tiêu

* Hiểu rõ bản chất của vòng lặp `for`: Vòng lặp điều khiển theo số lượt biết trước (Count-controlled loop).
* Làm chủ **3 biến thể** của hàm `range()` để sinh dãy số theo ý muốn: `range(stop)`, `range(start, stop)`, và `range(start, stop, step)`.
* Hiểu cơ chế hoạt động của **biến lặp** (Loop Variable) tự động nhận giá trị qua từng vòng.
* Tránh được bẫy kinh điển: **Lỗi lệch 1 đơn vị (Off-by-one error)** và lỗi đếm lùi không có bước nhảy âm.

## Kiến thức chính

Vòng lặp `for` trong Python được thiết kế để duyệt lần lượt qua từng phần tử của một tập hợp hoặc một dãy số được tạo bởi hàm `range()`.

### Bảng tra cứu 3 dạng của hàm `range()`:

| Dạng hàm | Ý nghĩa | Ví dụ | Dãy số sinh ra |
| :--- | :--- | :--- | :--- |
| **`range(stop)`**<br>*(1 tham số)* | Bắt đầu mặc định từ `0`, tăng mỗi lần `1`, dừng **trước** `stop`. | `range(5)` | `0, 1, 2, 3, 4` *(đủ 5 số)* |
| **`range(start, stop)`**<br>*(2 tham số)* | Bắt đầu từ `start`, tăng mỗi lần `1`, dừng **trước** `stop`. | `range(1, 6)` | `1, 2, 3, 4, 5` |
| **`range(start, stop, step)`**<br>*(3 tham số - Đếm tiến)* | Bắt đầu từ `start`, mỗi lần tăng `step` đơn vị, dừng **trước** `stop`. | `range(2, 11, 2)` | `2, 4, 6, 8, 10` *(số chẵn)* |
| **`range(start, stop, -step)`**<br>*(3 tham số - Đếm lùi)* | Bắt đầu từ `start`, mỗi lần giảm `step` đơn vị, dừng **trước** `stop`. | `range(5, 0, -1)` | `5, 4, 3, 2, 1` *(đếm lùi)* |

> [!IMPORTANT]
> **Quy tắc "Không lấy điểm dừng (Stop)"**:
> Giá trị `stop` **không bao giờ** nằm trong dãy số được sinh ra! Vòng lặp luôn dừng lại ngay trước ngưỡng `stop` (tức là chạy đến `stop - 1` khi đếm tiến, hoặc `stop + 1` khi đếm lùi).

## Hiểu

### 1. Ẩn dụ thực tế: Băng chuyền nhà máy và Chiếc gắp tự động

Hãy tưởng tượng bạn đang quan sát một dây chuyền đóng gói bánh:
* Hàm `range(1, 6)` đóng vai trò như **cỗ máy cấp phát**, lần lượt nhả 5 chiếc bánh có dán nhãn số `1, 2, 3, 4, 5` lên băng chuyền.
* Cú pháp `for banh in range(1, 6):` đóng vai trò như **chiếc gắp tự động**:
  * Lượt 1: Gắp chiếc bánh số `1` đặt vào biến `banh` ➔ Thực hiện đóng gói.
  * Lượt 2: Gắp chiếc bánh số `2` đặt vào biến `banh` ➔ Thực hiện đóng gói.
  * ...
  * Lượt 5: Gắp chiếc bánh số `5` đặt vào biến `banh` ➔ Thực hiện đóng gói.
  * Khi băng chuyền hết bánh: Chiếc gắp tự động dừng lại. Bạn không cần phải tự tăng biến đếm thủ công như ở Lesson 3.2 nữa!

### 2. Trục số trực quan (Visual Number Line)

![Giải mã 4 biến thể của hàm range()](/images/lessons/module3/range_mechanics.svg)

```text
Dạng 1: range(5)  -->  Mặc định bắt đầu từ 0, dừng TRƯỚC 5
Trục số:  [0] ──► [1] ──► [2] ──► [3] ──► [4] ──| (DỪNG, KHÔNG LẤY 5)

Dạng 2: range(1, 6)  -->  Bắt đầu từ 1, dừng TRƯỚC 6
Trục số:  [1] ──► [2] ──► [3] ──► [4] ──► [5] ──| (DỪNG, KHÔNG LẤY 6)

Dạng 3 (Tiến): range(2, 11, 2)  -->  Bước nhảy +2
Trục số:  [2] ────► [4] ────► [6] ────► [8] ────► [10] ──| (DỪNG, KHÔNG LẤY 11/12)

Dạng 3 (Lùi): range(5, 0, -1)  -->  Bước nhảy -1
Trục số:  [5] ──► [4] ──► [3] ──► [2] ──► [1] ──| (DỪNG, KHÔNG LẤY 0)
```

## Làm theo

### Ví dụ 1: In lần lượt các số từ 1 đến N

Muốn in các số từ 1 đến $N$, ta cần đặt điểm dừng là $N + 1$:

```python
n = int(input())

# Vì cần lấy cả số n, ta phải đặt stop là n + 1
for so in range(1, n + 1):
    print(so)
```

### Ví dụ 2: Đếm ngược thời gian đón giao thừa (Đếm lùi)

```python
# Bắt đầu từ 5, dừng trước 0 (lấy đến 1), mỗi lần lùi 1 đơn vị
for giay in range(5, 0, -1):
    print(giay)

print("Chúc mừng năm mới!")
```

### Bảng theo dõi thực thi của vòng lặp đếm lùi:

| Lượt lặp | Giá trị nhận bởi biến `giay` | Hành động in ra màn hình | Kiểm tra phần tử tiếp theo |
| :---: | :---: | :--- | :--- |
| **Lượt 1** | `5` | `5` | Còn số `4` ➔ Tiếp tục |
| **Lượt 2** | `4` | `4` | Còn số `3` ➔ Tiếp tục |
| **Lượt 3** | `3` | `3` | Còn số `2` ➔ Tiếp tục |
| **Lượt 4** | `2` | `2` | Còn số `1` ➔ Tiếp tục |
| **Lượt 5** | `1` | `1` | Chạm ngưỡng `0` ➔ Dừng lại |
| **Sau vòng lặp** | — | `Chúc mừng năm mới!` | Kết thúc chương trình |

### Ví dụ 3: Tính tổng các số chẵn từ 2 đến N

```python
n = 8
tong_chan = 0

for so in range(2, n + 1, 2):
    tong_chan += so
    print("Vừa cộng số:", so, "--> Tổng hiện tại:", tong_chan)

print("Tổng cuối cùng:", tong_chan)
```

* Lượt 1 (`so = 2`): `tong_chan = 0 + 2 = 2`
* Lượt 2 (`so = 4`): `tong_chan = 2 + 4 = 6`
* Lượt 3 (`so = 6`): `tong_chan = 6 + 6 = 12`
* Lượt 4 (`so = 8`): `tong_chan = 12 + 8 = 20`

## Tự làm

1. **Thử thách đọc nhanh:** Đoạn code sau sẽ in ra các số nào?
   ```python
   for i in range(3, 15, 3):
       print(i, end=" ")
   ```
   *Số 15 có được in ra không? Vì sao?*
2. **Bẫy đếm lùi:** Một bạn học sinh muốn đếm từ 10 về 1 và viết code như sau:
   ```python
   for x in range(10, 1):
       print(x)
   ```
   *Khi chạy, chương trình không in ra bất kỳ dòng nào! Bạn hãy giải thích lý do và sửa lại cho đúng.*
3. **Thử thách viết code:** Viết một vòng lặp `for` in ra bảng nhân của số 5 (từ `5 x 1 = 5` đến `5 x 10 = 50`).

## Vận dụng

Vòng lặp `for` kết hợp `range()` là công cụ được sử dụng nhiều nhất trong lập trình khi bạn **đã biết trước số lần cần làm việc**:
* **Xử lý hoạt ảnh trong game:** Cập nhật vị trí nhân vật trong 60 khung hình mỗi giây (`range(60)`).
* **Gửi thông báo hàng loạt:** Duyệt qua danh sách 50 khách hàng trúng thưởng để gửi email chúc mừng.
* **Tạo bảng biểu:** Lặp qua từng hàng và cột trong bảng tính Excel.

---

### 🚀 Bước tiếp theo

Vòng lặp `for` rất tuyệt vời khi ta biết trước số lượt lặp. Nhưng nếu bài toán yêu cầu: *"Cứ lặp cho đến khi người dùng nhập đúng mật khẩu thì mới dừng"* — lúc này ta hoàn toàn không biết người dùng sẽ gõ đúng ở lần thứ 1, thứ 5 hay thứ 100!

Đó chính là lúc chúng ta cần đến người bạn đồng hành tiếp theo: **Lesson 3.4: Vòng lặp while và điều kiện dừng**.
