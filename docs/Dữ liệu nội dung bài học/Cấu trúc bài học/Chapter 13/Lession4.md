---
lessonId: "LS-05.07"
title: "Khái quát về Kế thừa (Inheritance)"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["inheritance", "subclass", "superclass", "parent class", "child class", "method overriding"]
prerequisites: ["LS-05.06"]
---

# 📘 Lesson 05.07: Khái quát về Kế thừa (Inheritance)

---

## 1. Khái niệm & Vấn đề

Giả sử bạn đang viết mã nguồn cho các nhân vật trong game. Bạn đã định nghĩa xong lớp `Hero` chứa thuộc tính `name`, `hp` và phương thức `attack()`. Tiếp theo, bạn muốn tạo thêm lớp `Mage` (Pháp sư) và `Warrior` (Chiến binh). Cả hai lớp mới này đều cần có tên, HP và hành động tấn công giống hệt `Hero`, nhưng lại có thêm các thuộc tính riêng (như năng lượng `mp` cho Pháp sư, giáp `armor` cho Chiến binh).

Nếu bạn copy-paste toàn bộ code từ `Hero` sang hai lớp này, mã nguồn của bạn sẽ bị trùng lặp và cực kỳ khó cập nhật khi logic cốt lõi của game thay đổi. 

Để giải quyết vấn đề này, OOP cung cấp tính chất **Kế thừa (Inheritance)**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Superclass / Parent Class (Lớp cha)** | Lớp chứa các thuộc tính và hành động chung ban đầu được chia sẻ. | Giống như **cha mẹ truyền lại gen** (màu mắt, nhóm máu) cho con cái. |
| **Subclass / Child Class (Lớp con)** | Lớp kế thừa từ lớp cha, tự động sở hữu các đặc tính của cha và có thể mở rộng thêm tính năng riêng. | Giống như **người con** thừa hưởng gen của cha mẹ và tự đi học thêm kỹ năng vẽ tranh (tính năng riêng biệt mới). |

---

## 2. Cú pháp & Vận hành

Để khai báo lớp con kế thừa từ lớp cha, ta đặt tên lớp cha vào trong cặp dấu ngoặc đơn của định nghĩa lớp con:

```python
# Lớp Cha (Parent Class)
class Animal:
    def __init__(self, name):
        self.name = name

    def eat(self):
        print(f"{self.name} đang ăn...")

# Lớp Con (Child Class) kế thừa từ Animal
class Cat(Animal):
    def meow(self):
        print(f"{self.name} kêu Meo meo!")

# Khởi tạo đối tượng lớp con
my_cat = Cat("Miu Miu")

# Gọi phương thức kế thừa từ lớp cha
my_cat.eat()  # In ra: Miu Miu đang ăn...

# Gọi phương thức riêng của lớp con
my_cat.meow() # In ra: Miu Miu kêu Meo meo!
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!IMPORTANT]
> **Ghi đè phương thức (Method Overriding):**
> Đôi khi lớp con kế thừa một hành động từ lớp cha nhưng muốn thay đổi nội dung hoạt động cho phù hợp với đặc thù riêng của mình. Ta chỉ cần định nghĩa lại phương thức trùng tên đó ngay bên trong lớp con.
> 
> *Ví dụ:*
> ```python
> class Animal:
>     def make_sound(self):
>         print("Tiếng động vật")
> 
> class Dog(Animal):
>     # Ghi đè phương thức make_sound của cha
>     def make_sound(self):
>         print("Gâu gâu")
> ```
> 
> [!TIP]
> **Hàm `super()`**:
> Khi muốn gọi phương thức khởi tạo của lớp cha từ bên trong lớp con để tránh lặp lại mã nguồn gán thuộc tính, hãy sử dụng hàm `super()`:
> ```python
> class Dog(Animal):
>     def __init__(self, name, breed):
>         super().__init__(name) # Gọi constructor của Animal để gán name
>         self.breed = breed     # Gán thuộc tính mới của Dog
> ```

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Cú pháp nào sau đây định nghĩa chính xác lớp `Car` kế thừa từ lớp `Vehicle` trong Python?
* [ ] `class Car extends Vehicle:`
* [x] `class Car(Vehicle):`
* [ ] `class Car inherit Vehicle:`
* [ ] `class Vehicle(Car):`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây định nghĩa lớp `Bird` và lớp con `Penguin` kế thừa từ `Bird`. Chương trình muốn chim cánh cụt bơi thay vì bay. Hãy bổ sung phương thức ghi đè (overriding) cho phương thức `fly` của lớp con để in ra chuỗi `"Chim cánh cụt không biết bay, chỉ biết bơi."`:
```python
class Bird:
    def fly(self):
        print("Chim đang bay...")

class Penguin(Bird):
    # Hãy ghi đè phương thức fly ở đây
    pass

p = Penguin()
p.fly()
```

### Bài tập lập trình (Mini-task)
Định nghĩa một lớp cha `Vehicle` có phương thức khởi tạo nhận vào một thuộc tính `brand`. Định nghĩa lớp con `ElectricCar` kế thừa từ `Vehicle` và sử dụng hàm `super().__init__(brand)` để khởi động thương hiệu cho xe điện.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🧬 **Kế thừa (Inheritance)** giúp tái sử dụng mã nguồn, cho phép lớp con lấy lại toàn bộ thuộc tính và hành động của lớp cha.
* 🛡️ Sử dụng cú pháp **`class LopCon(LopCha):`** để thiết lập quan hệ kế thừa.
* 🔄 Sử dụng kỹ thuật **Method Overriding** (ghi đè phương thức) để tùy biến hành vi của lớp con.
* ⚡ Sử dụng **`super()`** để gọi các phương thức gốc của lớp cha.

Chúc mừng bạn đã hoàn thành xuất sắc toàn bộ khóa học **Lập trình Python cơ bản**! Bạn đã nắm giữ được đầy đủ các kiến thức từ tính toán cơ bản, cấu trúc điều khiển, xử lý dữ liệu phức tạp, làm việc với file, và tư duy lập trình hướng đối tượng chuyên nghiệp. Hãy tiếp tục thực hành làm dự án thực tế để mài giũa kỹ năng của mình!
