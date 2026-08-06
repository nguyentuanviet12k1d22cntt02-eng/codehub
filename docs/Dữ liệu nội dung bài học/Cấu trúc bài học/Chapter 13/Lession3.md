---
lessonId: "LS-05.06"
title: "Phương thức Khởi tạo (__init__)"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["__init__", "constructor", "initialization", "self attributes"]
prerequisites: ["LS-05.05"]
---

# 📘 Lesson 05.06: Phương thức Khởi tạo (\_\_init\_\_)

---

## 1. Khái niệm & Vấn đề

Khi khởi tạo một đối tượng học sinh mới từ lớp `Student`, ta muốn đối tượng đó lập tức có sẵn các thông tin riêng biệt như tên là `"Alice"` và điểm số là `9.5`, thay vì phải tạo đối tượng trống rỗng rồi viết nhiều dòng gán thủ công phía sau:
```python
# Cách thủ công tẻ nhạt:
s = Student()
s.name = "Alice"
s.score = 9.5
```

Để tự động hóa việc gán dữ liệu ban đầu này tại thời điểm sinh ra đối tượng, Python cung cấp một phương thức đặc biệt gọi là **Phương thức khởi tạo (Constructor)** có tên định danh cố định là **`__init__`** (hai dấu gạch dưới ở mỗi đầu).

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **`__init__` (Constructor)** | Phương thức đặc biệt của Python, tự động kích hoạt chạy ngay khi đối tượng vừa được tạo ra để thiết lập thuộc tính ban đầu. | Giống như **khai sinh cho em bé**. Ngay khi em bé chào đời (đối tượng sinh ra), bé lập tức được đặt tên và ghi nhận cân nặng (thiết lập thuộc tính). |

---

## 2. Cú pháp & Vận hành

Cú pháp khai báo phương thức khởi tạo sử dụng các tham số truyền vào:

```python
class Student:
    # Constructor khởi tạo
    def __init__(self, name, score):
        # Gán tham số vào thuộc tính của đối tượng (self.name)
        self.name = name
        self.score = score

    def show_info(self):
        print(f"Học sinh {self.name} đạt {self.score} điểm.")

# Truyền đối số trực tiếp khi khởi tạo đối tượng
s1 = Student("Alice", 9.5)
s2 = Student("Bob", 8.0)

s1.show_info() # In ra: Học sinh Alice đạt 9.5 điểm.
s2.show_info() # In ra: Học sinh Bob đạt 8.0 điểm.
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái `self` | Thuộc tính đối tượng được tạo |
|:---:|:---|:---|:---|
| 12 | `s1 = Student("Alice", 9.5)` | `self` trỏ đến `s1` | `s1.name = "Alice"`, `s1.score = 9.5` |
| 13 | `s2 = Student("Bob", 8.0)` | `self` trỏ đến `s2` | `s2.name = "Bob"`, `s2.score = 8.0` |
| 15 | `s1.show_info()` | `self` trỏ đến `s1` | Đọc `self.name` ("Alice") và in ra |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi gán ngược thuộc tính:**
> Lỗi kinh điển của người học OOP là viết ngược lệnh gán bên trong `__init__`.
> *Ví dụ viết sai:*
> `name = self.name` (Hành động này cố gắng lấy thuộc tính chưa tồn tại gán cho biến tham số, khiến thuộc tính đối tượng mãi mãi trống rỗng).
> *Quy tắc ghi nhớ:* **`self.ten_thuoc_tinh = ten_tham_so`** (luôn gán từ phải sang trái).
>
> **Lỗi thiếu đối số khi khởi tạo:**
> Khi gọi `Student()`, bạn bắt buộc phải truyền đủ số đối số tương ứng với các tham số yêu cầu trong `__init__` (trừ tham số `self` do hệ thống tự điền). Nếu thiếu sẽ bị lỗi `TypeError`.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Phương thức `__init__` được tự động chạy vào thời điểm nào của vòng đời đối tượng?
* [ ] Khi đối tượng bị xóa khỏi bộ nhớ.
* [ ] Khi phương thức được gọi thủ công bằng lệnh `s.__init__()`.
* [x] Ngay khi đối tượng vừa được khởi tạo từ Class bằng cú pháp `Class()`.
* [ ] Khi chương trình xảy ra ngoại lệ.

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây định nghĩa lớp `Book` để lưu thông tin sách, tuy nhiên khi khởi tạo đối tượng `b1 = Book("Sách Python")`, chương trình báo lỗi `TypeError`. Hãy sửa lại phương thức `__init__` cho đúng quy định tham số của Python:
```python
class Book:
    # Đoạn code lỗi:
    def __init__(title):
        self.title = title

b1 = Book("Sách Python")
```

### Bài tập lập trình (Mini-task)
Hãy định nghĩa một lớp `Rectangle` (Hình chữ nhật) có phương thức khởi tạo `__init__(self, width, height)`. Sau đó khởi tạo một đối tượng cụ thể từ lớp này với chiều rộng là `10` và chiều cao là `20`, lưu vào biến `rect`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* ⚙️ Phương thức **`__init__`** đóng vai trò là hàm tạo lập trạng thái ban đầu của đối tượng.
* 📦 Dùng cú pháp **`self.tên = giá_trị`** bên trong `__init__` để lưu trữ dữ liệu lâu dài vào đối tượng.
* ⚠️ Nhớ truyền đủ đối số yêu cầu khi tạo đối tượng từ lớp.

Trong bài học tiếp theo **[LS-05.07: Khái quát về Kế thừa (Inheritance)]**, chúng ta sẽ học cách tái sử dụng mã nguồn của Class cũ bằng cách kế thừa các thuộc tính và hành động sang một Class mới nâng cấp hơn.
