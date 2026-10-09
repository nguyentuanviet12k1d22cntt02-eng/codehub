---
lessonId: "LS-03.07"
title: "Lesson 3.7: Vòng lặp lồng nhau"
difficulty: "MEDIUM"
estimatedDuration: 35
prerequisites: ["LS-03.06"]
---

# Lesson 3.7: Vòng lặp lồng nhau

## Mục tiêu

* Hiểu sâu sắc cơ chế hoạt động của **Vòng lặp lồng nhau (Nested Loops)**: Vòng lặp nằm bên trong thân của một vòng lặp khác.
* Nắm vững quy tắc vàng: **"Vòng ngoài nhích 1 bước ➔ Vòng trong chạy trọn vẹn 1 chu kỳ!"**.
* Ánh xạ thành thạo vòng lặp lồng nhau vào không gian 2 chiều: **Vòng ngoài điều khiển HÀNG, Vòng trong điều khiển CỘT**.
* Làm chủ kỹ thuật in ấn định dạng trên cùng một dòng bằng `print(..., end="")` và ngắt dòng bằng `print()`.
* Tự tay xây dựng được các hình khối (hình chữ nhật sao, tam giác) và bảng cửu chương hoàn chỉnh.

## Kiến thức chính

Khi bạn cần xử lý dữ liệu dạng bảng biểu 2 chiều (Hàng và Cột), lưới ma trận (Matrix), hoặc các cặp phần tử kết hợp, ta sẽ lồng một vòng lặp `for` (hoặc `while`) vào bên trong một vòng lặp khác:

```python
for i in range(so_hang):       # VÒNG NGOÀI: Điều khiển từng HÀNG
    for j in range(so_cot):    # VÒNG TRONG: Điều khiển từng CỘT trong hàng đó
        # Thao tác xử lý ô tại tọa độ (hàng i, cột j)
    print()                   # Xuống dòng sau khi in hết một hàng
```

### Công thức số lần chạy:
$$\text{Tổng số lượt chạy của thân vòng trong} = (\text{Số lượt vòng ngoài}) \times (\text{Số lượt vòng trong})$$

*Nếu vòng ngoài chạy 3 lần, vòng trong chạy 4 lần ➔ Tổng cộng câu lệnh bên trong sẽ được thực thi $3 \times 4 = 12$ lần.*

## Hiểu

### 1. Ẩn dụ thực tế: Kim đồng hồ và Lịch tập thể dục

* **Kim phút và Kim giờ:**
  * Kim giờ là **vòng ngoài**: Mỗi lần kim giờ nhích thêm 1 tiếng (từ 1h sang 2h)...
  * Kim phút là **vòng trong**: Kim phút phải quay đủ trọn vẹn 60 nấc (từ phút 0 đến phút 59)!
* **Hiệp tập gym:**
  * Huấn luyện viên giao bài tập: *"Tập 3 hiệp, mỗi hiệp chống đẩy 5 cái"*.
  * Vòng ngoài đếm số hiệp: Hiệp 1, Hiệp 2, Hiệp 3.
  * Vòng trong đếm số lần chống đẩy: Cái 1, cái 2, cái 3, cái 4, cái 5.
  * Tổng cộng bạn phải chống đẩy $3 \times 5 = 15$ cái!

### 2. Sơ đồ ma trận lưới 2D (Grid Matrix):

![Trực quan hóa ma trận 2D với vòng lặp lồng nhau](/images/lessons/module3/nested_loops_grid.svg)

```text
                  CỘT 1 (j=0)       CỘT 2 (j=1)       CỘT 3 (j=2)
                ┌───────────────┬───────────────┬───────────────┐
  HÀNG 1 (i=0)  │  Ô (i=0, j=0) │  Ô (i=0, j=1) │  Ô (i=0, j=2) │ ──► print() xuống dòng
                ├───────────────┼───────────────┼───────────────┤
  HÀNG 2 (i=1)  │  Ô (i=1, j=0) │  Ô (i=1, j=1) │  Ô (i=1, j=2) │ ──► print() xuống dòng
                └───────────────┴───────────────┴───────────────┘
```

> [!NOTE]
> **Vũ khí bí mật: `print(..., end="")`**
> Theo mặc định, mỗi khi gọi lệnh `print("A")`, Python sẽ tự động thêm ký tự xuống dòng `\n` ở cuối.
> Để in các dấu sao liền nhau trên cùng một hàng ngang, ta dùng tham số `end=""`:
> `print("*", end=" ")` ➔ In dấu sao kèm dấu cách, giữ con trỏ ở lại hàng hiện tại.
> Khi in xong hết các cột của 1 hàng, ta gọi `print()` rỗng để đưa con trỏ xuống hàng mới!

## Làm theo

### Ví dụ 1: In hình chữ nhật dấu sao (2 hàng, 4 cột)

```python
so_hang = 2
so_cot = 4

for hang in range(so_hang):
    for cot in range(so_cot):
        print("*", end=" ")  # In dấu sao trên cùng một hàng
    print()                   # Xuống dòng khi hết 1 hàng
```

**Kết quả in ra màn hình:**
```text
* * * * 
* * * * 
```

### Bảng theo dõi thực thi 2 chiều chi tiết:

| Vòng ngoài (`hang`) | Vòng trong (`cot`) | Hành động thực hiện | Màn hình hiển thị thực tế |
| :---: | :---: | :--- | :--- |
| **`hang = 0` (Hàng 1)** | `cot = 0` | In `* ` không xuống dòng | `* ` |
| | `cot = 1` | In `* ` không xuống dòng | `* * ` |
| | `cot = 2` | In `* ` không xuống dòng | `* * * ` |
| | `cot = 3` | In `* ` không xuống dòng | `* * * * ` |
| | *(Hết vòng trong)* | Gọi `print()` xuống dòng | *(Nhảy xuống hàng 2)* |
| **`hang = 1` (Hàng 2)** | `cot = 0` | In `* ` không xuống dòng | `* ` |
| | `cot = 1` | In `* ` không xuống dòng | `* * ` |
| | `cot = 2` | In `* ` không xuống dòng | `* * * ` |
| | `cot = 3` | In `* ` không xuống dòng | `* * * * ` |
| | *(Hết vòng trong)* | Gọi `print()` xuống dòng | *(Nhảy xuống hàng 3)* |
| *(Hết vòng ngoài)* | — | Vòng lặp kết thúc | Hoàn thành hình chữ nhật! |

---

### Ví dụ 2: In Bảng cửu chương nhỏ (Bảng nhân 2 và 3)

```python
# Bảng nhân cho các số từ 2 đến 3
for a in range(2, 4):
    print("--- BẢNG NHÂN", a, "---")
    for b in range(1, 10):
        print(f"{a} x {b} = {a * b}")
    print()  # In một dòng trống ngăn cách giữa 2 bảng
```

**Kết quả hiển thị:**
```text
--- BẢNG NHÂN 2 ---
2 x 1 = 2
2 x 2 = 4
...
2 x 9 = 18

--- BẢNG NHÂN 3 ---
3 x 1 = 3
...
3 x 9 = 27
```

## Tự làm & Bẫy nguy hiểm

> [!WARNING]
> **Bẫy quên lệnh xuống dòng `print()`:**
> Nếu bạn quên mất dòng `print()` ở cuối vòng lặp ngoài:
> ```python
> for hang in range(2):
>     for cot in range(4):
>         print("*", end=" ")
>     # Quên mất lệnh print() xuống dòng ở đây!
> ```
> Toàn bộ 8 dấu sao sẽ bị dính liền trên 1 dòng ngang duy nhất: `* * * * * * * * ` thay vì tạo thành hình chữ nhật 2 hàng!
>
> **Lưu ý hiệu năng (Big-O):**
> Vòng lặp lồng nhau cấp 2 chạy $N^2$ lần, lồng nhau cấp 3 chạy $N^3$ lần. Nếu $N = 1.000$, vòng lặp cấp 3 sẽ chạy $1.000.000.000$ (1 tỷ) phép tính, có thể làm đơ máy tính. Hãy chỉ dùng vòng lặp lồng nhau khi bài toán thực sự có cấu trúc nhiều chiều!

### Thử thách tư duy:
1. Nếu vòng ngoài chạy 5 lần, vòng trong chạy 6 lần, câu lệnh bên trong thân vòng lặp trong sẽ được thực hiện tổng cộng bao nhiêu lần?
2. Viết chương trình in ra hình tam giác sao có dạng:
   ```text
   *
   * *
   * * *
   * * * *
   ```
   *(Gợi ý: Số dấu sao ở hàng `i` phụ thuộc vào chính giá trị của `i`: `range(hang + 1)`).*

## Vận dụng

* **Xử lý hình ảnh kỹ thuật số (Computer Vision):** Mọi bức ảnh kỹ thuật số trên điện thoại đều là một ma trận 2D gồm hàng triệu điểm ảnh (Pixels). Máy tính dùng vòng lặp lồng nhau duyệt qua từng hàng và cột điểm ảnh để chỉnh sáng, đổi màu hoặc làm mờ bức ảnh.
* **Game cờ vua / Caro:** Kiểm tra nước đi trên bàn cờ $8 \times 8$ hoặc bàn cờ caro $15 \times 15$.

---

### 🚀 Bước tiếp theo

Chúc mừng bạn đã chinh phục cấu trúc phức tạp nhất của chuyên đề Vòng lặp! Giờ là lúc kết hợp tất cả các "vũ khí" đã học (`for`, `while`, `range`, `break/continue`, `if`, lồng nhau) vào một trận địa thực chiến.

Hãy cùng bước vào bài học cuối cùng: **Lesson 3.8: Luyện tập tổng hợp và mini project**!
