---
lessonId: "LS-03.07"
title: "Duyệt mảng bằng Vòng lặp"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["list iteration", "for loop", "index loop", "enumerate"]
prerequisites: ["LS-03.05", "LS-02.07"]
---

# 📘 Lesson 03.07: Duyệt mảng bằng Vòng lặp

---

## 1. Khái niệm & Vấn đề

Khi làm việc với danh sách chứa nhiều phần tử (ví dụ: danh sách điểm số của học sinh), ta hiếm khi gọi thủ công `diem[0]`, `diem[1]`, `diem[2]` vì số lượng phần tử có thể lên đến hàng trăm, hàng nghìn. Để tính tổng điểm, lọc ra những học sinh đạt điểm giỏi, hoặc gửi email thông báo đồng loạt, ta cần duyệt qua toàn bộ phần tử trong danh sách một cách tự động.

Trong lập trình, hành động này gọi là **Duyệt mảng (List Iteration)**, thường được thực hiện kết hợp giữa danh sách và các vòng lặp (`for` hoặc `while`).

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Iteration (Duyệt/Lặp qua)** | Quá trình đi qua lần lượt từng phần tử của một tập hợp dữ liệu từ đầu đến cuối. | Giống như **nhân viên soát vé xe buýt**. Đi dọc lối đi và kiểm tra lần lượt từng hành khách từ hàng ghế đầu đến hàng ghế cuối. |

---

## 2. Cú pháp & Vận hành

Python hỗ trợ 3 cách duyệt danh sách phổ biến bằng vòng lặp `for`:

### Cách 1: Duyệt trực tiếp theo phần tử (Khuyên dùng khi không cần chỉ số)
```python
names = ["An", "Bình", "Chi"]
for name in names:
    print(name)
```

### Cách 2: Duyệt qua chỉ số Index (Dùng khi cần biết vị trí phần tử)
```python
for i in range(len(names)):
    print(f"Học sinh số {i + 1} là {names[i]}")
```

### Cách 3: Sử dụng hàm `enumerate()` (Lấy cả chỉ số và giá trị)
```python
for index, name in enumerate(names):
    print(f"Vị trí {index}: {name}")
```

**Bảng theo dõi thực thi của Cách 1 (Execution Trace Table):**
| Vòng lặp số | Giá trị của biến `name` | Kết quả in ra màn hình |
|:---:|:---|:---|
| 1 | `"An"` (phần tử đầu tiên) | `An` |
| 2 | `"Bình"` (phần tử kế tiếp) | `Bình` |
| 3 | `"Chi"` (phần tử cuối cùng) | `Chi` |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi thay đổi kích thước mảng khi đang duyệt:**
> Tránh việc thêm hoặc xóa phần tử khỏi danh sách ngay bên trong vòng lặp đang duyệt qua chính danh sách đó. Điều này sẽ làm xáo trộn chỉ số lặp của Python và gây ra các hành vi bỏ sót phần tử hoặc sập chương trình ngoài ý muốn.
> *Mẹo tối ưu:* Nếu cần lọc phần tử, hãy duyệt danh sách gốc và thêm các phần tử thỏa mãn vào một danh sách mới.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để lấy ra cả **chỉ số (index)** và **giá trị (value)** của từng phần tử trong danh sách bằng vòng lặp `for`, ta nên sử dụng hàm bổ trợ nào?
* [ ] `range()`
* [ ] `list()`
* [x] `enumerate()`
* [ ] `len()`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây tính tổng các số trong danh sách `numbers` nhưng đang bị lỗi cú pháp / logic. Hãy tìm lỗi và sửa lại:
```python
numbers = [10, 20, 30]
tong = 0
# Đoạn code lỗi:
for num in range(numbers):
    tong += num
print(tong) # Mong muốn in ra: 60
```

### Bài tập lập trình (Mini-task)
Cho danh sách điểm số `scores = [7, 8, 5, 9, 6]`. Hãy viết chương trình duyệt qua danh sách này và in ra màn hình chỉ những điểm số lớn hơn hoặc bằng `7`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🔁 Duyệt mảng bằng cách kết hợp vòng lặp `for` và danh sách là thao tác vô cùng phổ biến.
* 🏷️ Sử dụng `for item in my_list` nếu chỉ cần đọc giá trị của phần tử.
* 📍 Sử dụng `for i, item in enumerate(my_list)` khi cần dùng cả vị trí và giá trị phần tử.

Trong bài học tiếp theo **[LS-03.08: Sắp xếp và Tìm kiếm cơ bản]**, chúng ta sẽ học cách sắp xếp các phần tử trong danh sách theo thứ tự tăng/giảm dần và tìm kiếm xem phần tử có nằm trong danh sách hay không.
