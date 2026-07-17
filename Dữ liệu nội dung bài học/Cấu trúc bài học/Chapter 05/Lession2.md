---
lessonId: "LS-02.06"
title: "Dãy số với hàm range()"
difficulty: "BASIC"
estimatedDuration: 25
keywords: ["range function", "sequences", "python range", "python basics"]
prerequisites: ["LS-02.05"]
---

# 📘 Lesson 02.06: Dãy số với hàm range()

---

## 1. Khái niệm & Vấn đề

Khi lập trình, chúng ta rất thường xuyên gặp nhu cầu tạo ra các dãy số có quy luật như:
* Đếm số lần thực hiện công việc từ `1` đến `10`.
* Lọc ra toàn bộ các số lẻ trong khoảng từ `1` đến `99`.
* Thiết lập đồng hồ đếm ngược từ `10` về `1`.

Khai báo thủ công từng con số này vừa mất thời gian vừa tốn bộ nhớ. Python cung cấp hàm **`range()`** để giải quyết bài toán này. Nó giúp tự động sinh ra một dãy số nguyên theo quy luật cực kỳ nhanh chóng và tối ưu hiệu năng.

| Kỹ thuật | Bản chất hoạt động | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Hàm `range()`** | Hàm sinh ra một chuỗi các số nguyên liên tiếp hoặc cách đều dựa trên các tham số cấu hình. | Giống như **khuôn đúc gạch tự động**: Bạn chỉnh thông số, máy sẽ đúc ra gạch đều tăm tắp mà không cần xếp tay. |

---

## 2. Cú pháp & Vận hành

Hàm `range()` có 3 cách sử dụng tùy thuộc vào số lượng tham số truyền vào:

```python
# 1 tham số: range(stop) -> Sinh từ 0 đến stop - 1
print(list(range(3)))  # [0, 1, 2]

# 2 tham số: range(start, stop) -> Sinh từ start đến stop - 1
print(list(range(2, 6)))  # [2, 3, 4, 5]

# 3 tham số: range(start, stop, step) -> Sinh từ start đến stop - 1 với bước nhảy step
print(list(range(1, 10, 2)))  # [1, 3, 5, 7, 9]

# Bước nhảy âm: Dùng để đếm ngược
print(list(range(5, 1, -1)))  # [5, 4, 3, 2]
```

**Bảng trace phân tích luồng sinh số của `range(1, 10, 3)`:**
| Lần chạy | Giá trị hiện tại | Kiểm tra giới hạn (`< stop (10)`) | Kết quả dãy số tích lũy |
|:---:|:---|:---|:---|
| 1 | `1` (giá trị `start`) | `1 < 10` ➔ `True`. Nhận số 1. | `[1]` |
| 2 | `1 + 3 = 4` (cộng thêm `step`) | `4 < 10` ➔ `True`. Nhận số 4. | `[1, 4]` |
| 3 | `4 + 3 = 7` (cộng thêm `step`) | `7 < 10` ➔ `True`. Nhận số 7. | `[1, 4, 7]` |
| 4 | `7 + 3 = 10` (cộng thêm `step`)| `10 < 10` ➔ `False`. Dừng lại. | Trả về kết quả: `[1, 4, 7]` |

**Trực quan hóa trên trục số cho `range(2, 8, 2)`:**
```text
[2] ───(+2)───► [4] ───(+2)───► [6] ───(+2)───► (8: Bị loại trừ)
Kết quả thu được: [2, 4, 6]
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các lỗi logic cực kỳ kinh điển khi dùng range():**
> * **Loại trừ giá trị `stop`**: Dãy số sinh ra bởi `range(start, stop)` chạy đến sát nút chứ **không bao giờ lấy** giá trị `stop` (tức dừng lại ở `stop - 1`). 
>   * *Ví dụ:* Muốn lấy dãy số từ 1 đến 10, viết `range(1, 10)` là sai (chỉ ra từ 1 đến 9). Bạn phải viết là `range(1, 11)`.
> * **In đối tượng range trực tiếp**: Nếu bạn viết `print(range(5))`, Python sẽ in ra chuỗi đại diện `range(0, 5)` chứ không phải là các con số cụ thể. Để xem các số, hãy chuyển nó thành một danh sách bằng hàm `list(range(5))`.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Hàm `range(1, 5)` trong Python sẽ sinh ra dãy số nguyên nào sau đây?
* [ ] `1, 2, 3, 4, 5`
* [x] `1, 2, 3, 4`
* [ ] `0, 1, 2, 3, 4`
* [ ] `2, 3, 4`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn tạo một danh sách các số đếm ngược từ 5 về 1 nhưng lại in ra một danh sách trống `[]`. Hãy tìm lỗi và sửa lại cho đúng:
```python
# Sửa lại đoạn code tạo dãy số đếm ngược dưới đây:
day_so = list(range(5, 1))
print(day_so)
```

### Bài tập lập trình (Mini-task)
Hãy dùng hàm `range()` kết hợp với hàm `list()` để tạo ra và in ra màn hình danh sách các số chia hết cho 5 trong khoảng từ 5 đến 30 (bao gồm cả số 30). Kết quả mong muốn hiển thị là: `[5, 10, 15, 20, 25, 30]`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📏 Hàm `range(start, stop, step)` dùng để tự động tạo một dãy số nguyên có quy luật cách đều.
* 🛑 Luôn ghi nhớ quy tắc loại trừ giá trị `stop` (chỉ chạy tới sát nút).

Trong bài học tiếp theo **[LS-02.07: Vòng lặp for]**, chúng ta sẽ thấy sự kết hợp hoàn hảo giữa vòng lặp và dãy số `range()` để điều khiển số lần lặp vô cùng khoa học.
