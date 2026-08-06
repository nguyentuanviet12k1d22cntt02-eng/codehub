---
lessonId: "LS-05.05"
title: "Thuộc tính và Phương thức"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["attributes", "methods", "OOP", "self parameter"]
prerequisites: ["LS-05.04"]
---

# 📘 Lesson 05.05: Thuộc tính và Phương thức

---

## 1. Khái niệm & Vấn đề

Một đối tượng trong thực tế luôn gồm hai phần:
1. **Đặc điểm trạng thái**: Chiếc xe có màu đỏ, nặng 1.5 tấn, có 4 bánh.
2. **Hành động hoạt động**: Chiếc xe có thể khởi động, tăng tốc, bóp còi.

Trong lập trình hướng đối tượng (OOP), để mô phỏng hai phần này, một Class sẽ chứa:
* **Thuộc tính (Attributes)**: Các biến lưu trữ thông tin của đối tượng.
* **Phương thức (Methods)**: Các hàm định nghĩa hành động mà đối tượng có thể thực hiện.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Attribute (Thuộc tính)** | Biến nằm bên trong đối tượng, đại diện cho dữ liệu tĩnh. | Giống như **chỉ số chiều cao, màu da** của bạn. |
| **Method (Phương thức)** | Hàm nằm bên trong đối tượng, mô tả hành vi động. | Giống như hành động **đi, chạy, nói** của bạn. |

---

## 2. Cú pháp & Vận hành

Để định nghĩa phương thức, ta viết hàm `def` bình thường bên trong Class. Tuy nhiên, tham số đầu tiên của phương thức **bắt buộc phải là `self`** để đại diện cho chính đối tượng đang gọi phương thức đó.

```python
class Dog:
    # Thuộc tính lớp
    species = "Canine"
    
    # Phương thức (phải nhận 'self' làm tham số đầu tiên)
    def bark(self):
        print("Gâu gâu!")

# Tạo đối tượng
my_dog = Dog()

# Truy cập thuộc tính
print(my_dog.species) # In ra: Canine

# Gọi phương thức
my_dog.bark() # In ra: Gâu gâu!
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Vai trò của `self` | Hành động của máy tính |
|:---:|:---|:---|:---|
| 10 | `my_dog = Dog()` | Chưa kích hoạt | Khởi tạo đối tượng cún |
| 13 | `my_dog.species` | Đọc dữ liệu | Truy xuất biến `species` của đối tượng và in ra |
| 16 | `my_dog.bark()` | Gán `self` = `my_dog` | Nhảy vào chạy hàm `bark()`, `self` trỏ trực tiếp đến `my_dog` |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Quên tham số `self` khi định nghĩa phương thức:**
> Nếu bạn viết phương thức mà không khai báo `self` trong ngoặc đơn, khi gọi phương thức đó từ đối tượng, Python sẽ ném ra lỗi `TypeError: method() takes 0 positional arguments but 1 was given`.
> *Ví dụ lỗi:*
> ```python
> class Cat:
>     def meow(): # Thiếu self
>         print("Meo meo")
> 
> cat = Cat()
> cat.meow() # Lỗi TypeError!
> ```
> *Giải thích:* Khi gọi `cat.meow()`, Python tự động dịch thành `Cat.meow(cat)`. Do đó, hàm bắt buộc phải có một tham số đầu tiên để hứng lấy đối tượng `cat` này.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Tham số đầu tiên bắt buộc phải có của mọi phương thức thông thường trong Class của Python là gì?
* [ ] `this`
* [x] `self`
* [ ] `object`
* [ ] `func`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây định nghĩa lớp `Car` có phương thức `run` nhưng đang bị sập lỗi `TypeError` khi gọi chạy. Hãy tìm lỗi và sửa lại:
```python
class Car:
    def run():
        print("Xe đang chạy...")

my_car = Car()
my_car.run()
```

### Bài tập lập trình (Mini-task)
Hãy định nghĩa lớp `Person`. Lớp này có một phương thức tên là `introduce(self)` in ra màn hình dòng chữ `"Tôi là con người."`. Sau đó hãy khởi tạo một đối tượng từ lớp này và gọi phương thức introduce đó.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📦 **Thuộc tính (Attributes)** lưu trữ trạng thái dữ liệu tĩnh của đối tượng.
* ⚙️ **Phương thức (Methods)** là các hành động (hàm) được gắn vào đối tượng.
* 🔑 Luôn khai báo tham số **`self`** làm đối số đầu tiên của mọi phương thức trong Class.

Trong bài học tiếp theo **[LS-05.06: Phương thức Khởi tạo (__init__)]**, chúng ta sẽ tìm hiểu cách thiết lập các thông tin ban đầu (như tên, tuổi) cho đối tượng ngay vào lúc vừa bấm nút khởi tạo đối tượng.
