---
lessonId: "LS-03.08"
title: "Sắp xếp và Tìm kiếm cơ bản"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["sort", "search", "sorted", "index", "in operator"]
prerequisites: ["LS-03.06"]
---

# 📘 Lesson 03.08: Sắp xếp và Tìm kiếm cơ bản

---

## 1. Khái niệm & Vấn đề

Khi quản lý danh sách sản phẩm hoặc học sinh, ta thường cần thực hiện hai thao tác kinh điển:
1. **Tìm kiếm:** Kiểm tra xem một sản phẩm còn hàng hay không, hoặc tìm vị trí của một học sinh trong danh sách.
2. **Sắp xếp:** Sắp xếp danh sách điểm từ cao xuống thấp để trao học bổng, hoặc sắp xếp tên theo thứ tự bảng chữ cái ABC.

Nếu phải viết mã nguồn để tự so sánh và đổi chỗ từng phần tử, chương trình sẽ rất dài và dễ sai sót. Rất may, Python đã tích hợp sẵn các công cụ tìm kiếm và sắp xếp cực mạnh và tối ưu hiệu năng.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Sắp xếp (Sorting)** | Hành động sắp đặt các phần tử trong danh sách theo một tiêu chí thứ tự tăng dần hoặc giảm dần. | Giống như việc **xếp các quyển sách trên kệ** theo chiều cao từ thấp đến cao. |
| **Tìm kiếm (Searching)** | Hành động dò tìm một phần tử cụ thể có nằm trong tập hợp hay không và xác định vị trí của nó. | Giống như việc **tra từ điển** để tìm xem một từ vựng có tồn tại hay không và nằm ở trang nào. |

---

## 2. Cú pháp & Vận hành

### Tìm kiếm phần tử
* Toán tử `in`: Trả về `True` nếu phần tử tồn tại trong danh sách, ngược lại trả về `False`.
* Phương thức `index(value)`: Trả về vị trí (chỉ số index) của phần tử đầu tiên tìm thấy. (Ném ra lỗi `ValueError` nếu không tồn tại).

### Sắp xếp danh sách
* Phương thức `sort()`: Sắp xếp **trực tiếp** danh sách gốc (làm thay đổi thứ tự gốc của danh sách).
* Hàm `sorted(list)`: Tạo ra một **danh sách mới** đã được sắp xếp, danh sách gốc được giữ nguyên.
* Tham số `reverse=True`: Sắp xếp theo chiều **giảm dần** (mặc định là tăng dần).

```python
numbers = [5, 2, 9, 1]

# 1. Tìm kiếm
print(9 in numbers)       # True
print(numbers.index(2))   # 1

# 2. Sắp xếp tạo danh sách mới
new_sorted = sorted(numbers, reverse=True)
print(new_sorted)         # [9, 5, 2, 1]
print(numbers)            # [5, 2, 9, 1] (Gốc không đổi)

# 3. Sắp xếp trực tiếp tại chỗ
numbers.sort()
print(numbers)            # [1, 2, 5, 9] (Gốc đã thay đổi)
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi sắp xếp hỗn hợp kiểu dữ liệu:**
> Bạn không thể sắp xếp một danh sách chứa cả số và chuỗi. Python sẽ báo lỗi `TypeError: '<' not supported between instances of 'str' and 'int'`.
>
> **Lỗi `ValueError` khi dùng `index()`:**
> Gọi `list.index("X")` trên một danh sách không chứa `"X"` sẽ làm chương trình bị dừng do báo lỗi.
> *Quy tắc vàng:* Luôn sử dụng toán tử `in` để kiểm tra trước khi gọi `index()`.
> ```python
> if "X" in my_list:
>     idx = my_list.index("X")
> ```

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để sắp xếp danh sách `scores = [10, 8, 9]` theo thứ tự **giảm dần** mà **không làm thay đổi** danh sách gốc, ta dùng câu lệnh nào?
* [ ] `scores.sort()`
* [ ] `scores.sort(reverse=True)`
* [ ] `sorted(scores)`
* [x] `sorted(scores, reverse=True)`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn tìm vị trí của số `100` trong danh sách để xử lý, nhưng chương trình bị sập do số `100` không có trong danh sách. Hãy sửa lại bằng cách thêm câu lệnh điều kiện bảo vệ:
```python
items = [10, 20, 30]
# Đoạn code lỗi:
position = items.index(100)
print(f"Vị trí tìm thấy: {position}")
```

### Bài tập lập trình (Mini-task)
Khai báo danh sách `prices = [150, 99, 250, 49]`. Hãy sắp xếp danh sách này theo thứ tự **tăng dần** bằng phương thức tác động trực tiếp tại chỗ (in-place) và in danh sách kết quả ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🔍 Dùng toán tử `in` để kiểm tra nhanh sự tồn tại của phần tử trong danh sách.
* 📍 Dùng `.index()` để lấy vị trí chỉ số của phần tử.
* 🔄 Phân biệt rõ giữa `.sort()` (sắp xếp trực tiếp danh sách gốc) và `sorted()` (tạo danh sách đã sắp xếp mới).

Trong bài học tiếp theo **[LS-03.09: Tuple: Danh sách bất biến]**, chúng ta sẽ làm quen với người anh em sinh đôi của List nhưng mang đặc tính an toàn tuyệt đối: không cho phép thêm sửa xóa phần tử sau khi tạo.
