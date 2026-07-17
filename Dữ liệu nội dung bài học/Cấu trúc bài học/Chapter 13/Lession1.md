---
lessonId: "LS-05.04"
title: "Tư duy Hướng đối tượng (Class vs Object)"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["OOP", "class", "object", "instance", "blueprint"]
prerequisites: ["LS-05.03"]
---

# 📘 Lesson 05.04: Tư duy Hướng đối tượng (Class vs Object)

---

## 1. Khái niệm & Vấn đề

Khi lập trình các chương trình lớn (như một game nhập vai RPG), nếu bạn chỉ sử dụng các biến rời rạc như `hero_name = "Arthur"`, `hero_hp = 100`, `hero_mp = 50`, chương trình sẽ cực kỳ lộn xộn khi có thêm hàng trăm quái vật và nhân vật khác. Bạn cần một phương pháp để gom nhóm toàn bộ dữ liệu (tên, máu) và hành động (tấn công, hồi máu) của một thực thể lại với nhau.

Đó chính là lý do ra đời của **Lập trình Hướng đối tượng (Object-Oriented Programming - OOP)**. OOP giúp chúng ta trừu tượng hóa các thực thể ngoài đời thực vào trong thế giới lập trình thông qua khái niệm **Lớp (Class)** và **Đối tượng (Object)**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Class (Lớp)** | Bản thiết kế (blueprint) định hình nên các đặc tính và hành động chung của một nhóm thực thể. | Giống như **bản vẽ kỹ thuật trên giấy** của một chiếc ô tô hoặc **khuôn đúc bánh**. Bản vẽ/khuôn bánh không thể tự chạy hay ăn được. |
| **Object (Đối tượng / Instance)** | Một thực thể cụ thể được tạo ra từ bản thiết kế Class đó, mang dữ liệu thực tế. | Giống như **chiếc xe ô tô thực tế** lăn bánh trên đường được sản xuất từ bản vẽ, hoặc **chiếc bánh thật** được nướng ra từ khuôn. |

---

## 2. Cú pháp & Vận hành

Để định nghĩa một lớp, ta dùng từ khóa `class`, theo sau là tên lớp viết hoa chữ cái đầu (quy tắc PascalCase):

```python
# Định nghĩa lớp Hero (bản thiết kế)
class Hero:
    pass

# Tạo ra các đối tượng cụ thể (instantiation)
hero1 = Hero()
hero2 = Hero()

print(type(hero1)) # In ra: <class '__main__.Hero'>
print(hero1)       # In ra địa chỉ ô nhớ lưu đối tượng
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái bộ nhớ | Hành động của máy tính |
|:---:|:---|:---|:---|
| 2-3 | `class Hero: ...` | Khởi tạo kiểu dữ liệu mới `Hero` | Máy tính lưu trữ bản thiết kế `Hero` vào bộ nhớ |
| 6 | `hero1 = Hero()` | Tạo đối tượng `hero1` | Máy tính cấp phát ô nhớ riêng lưu trữ đối tượng `hero1` |
| 7 | `hero2 = Hero()` | Tạo đối tượng `hero2` | Máy tính cấp phát ô nhớ riêng lưu trữ đối tượng `hero2` độc lập |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Nhầm lẫn giữa Class và Object:**
> Lỗi phổ biến nhất là cố gắng gán trực tiếp dữ liệu hoặc gọi các hành động trên tên của **Class** thay vì gọi trên **Object** cụ thể đã được tạo ra.
> *Ví dụ sai:*
> `Hero.hp = 100` (Thao tác trực tiếp trên bản vẽ thiết kế là sai logic).
> *Cách đúng:*
> ```python
> my_hero = Hero()
> my_hero.hp = 100
> ```

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Mối quan hệ giữa **Class (Lớp)** và **Object (Đối tượng)** có thể được mô tả như thế nào?
* [x] Class là bản thiết kế, Object là thực thể cụ thể được tạo ra từ bản thiết kế đó.
* [ ] Object là bản thiết kế, Class là thực thể cụ thể.
* [ ] Cả hai hoàn toàn độc lập và không có liên quan gì đến nhau.
* [ ] Class chỉ có thể chứa số, Object chỉ có thể chứa chữ.

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn định nghĩa một Class tên là `SmartPhone` và tạo ra một đối tượng `phone1` từ lớp đó. Tuy nhiên chương trình đang báo lỗi cú pháp. Hãy tìm và sửa lại cho đúng:
```python
# Đoạn code lỗi:
define class SmartPhone
    pass

phone1 = SmartPhone()
```

### Bài tập lập trình (Mini-task)
Hãy định nghĩa một lớp trống tên là `Student` (sử dụng từ khóa `pass`). Sau đó, hãy khởi tạo một đối tượng cụ thể từ lớp này và gán vào biến `student_a`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🏗️ **Class** là khuôn mẫu, bản thiết kế định nghĩa các thuộc tính và hành động.
* 🚗 **Object** là thực thể thực tế được sinh ra từ khuôn mẫu Class đó.
* 🛠️ Dùng từ khóa **`class`** để khai báo lớp và gọi `Class()` để khởi tạo đối tượng.

Trong bài học tiếp theo **[LS-05.05: Thuộc tính và Phương thức]**, chúng ta sẽ học cách thổi hồn vào Class bằng cách thêm dữ liệu (Thuộc tính) và hành động (Phương thức) cho nó.
