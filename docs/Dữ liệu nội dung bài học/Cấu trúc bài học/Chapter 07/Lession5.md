---
lessonId: "LS-03.09"
title: "Tuple: Danh sách bất biến"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["tuple", "immutable sequence", "parentheses", "data protection"]
prerequisites: ["LS-03.05"]
---

# 📘 Lesson 03.09: Tuple: Danh sách bất biến

---

## 1. Khái niệm & Vấn đề

Trong lập trình, có những tập hợp dữ liệu cố định không bao giờ được phép thay đổi trong suốt quá trình chạy chương trình. Ví dụ: hệ tọa độ của một điểm `(x, y)`, danh sách các tháng trong năm, hoặc các hằng số cấu hình hệ thống (như địa chỉ IP và số cổng kết nối). 

Nếu dùng List để lưu trữ, các đoạn mã nguồn khác có thể vô tình sửa đổi hoặc xóa mất dữ liệu này, dẫn đến các lỗi hệ thống nghiêm trọng. Để đảm bảo dữ liệu quan trọng luôn được bảo vệ an toàn và không bị thay đổi ngoài ý muốn, Python cung cấp cấu trúc dữ liệu **Tuple**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Tuple (Bộ dữ liệu)** | Một cấu trúc dữ liệu tuần tự có thứ tự nhưng **bất biến (immutable)**. Không cho phép thêm, sửa, hoặc xóa phần tử sau khi khởi tạo. | Giống như một **bức ảnh đã được in ra giấy**. Bạn có thể ngắm nhìn các chi tiết trên ảnh nhưng không thể thay đổi vị trí hay chỉnh sửa các đối tượng trong ảnh đó được nữa. |

---

## 2. Cú pháp & Vận hành

Để tạo một Tuple, ta dùng cặp ngoặc đơn `()` thay vì ngoặc vuông `[]`. Các phần tử cách nhau bởi dấu phẩy `,`:
`ten_tuple = (phan_tu_1, phan_tu_2, ...)`

Các đặc trưng của Tuple:
* Truy cập các phần tử bằng chỉ số Index và cắt Tuple (Slicing) giống hệt như List.
* Cho phép chứa nhiều kiểu dữ liệu khác nhau.
* Hiệu năng xử lý và tốc độ đọc của Tuple nhanh hơn List do hệ thống biết rõ kích thước của nó là cố định.

```python
toa_do = (10, 20)
print(toa_do[0]) # Lấy phần tử tại index 0 -> 10
print(len(toa_do)) # Độ dài của tuple -> 2
```

**Bảng so sánh chi tiết List và Tuple:**
| Tính chất | List `[]` | Tuple `()` |
| :--- | :--- | :--- |
| **Khả năng thay đổi** | Mutable (Thay đổi được) | Immutable (Không đổi được) |
| **Các phương thức hỗ trợ** | `append()`, `insert()`, `remove()`, `pop()`, `sort()` | Chỉ có `count()`, `index()` |
| **Tốc độ & Bộ nhớ** | Chậm hơn, tốn bộ nhớ hơn | Nhanh hơn, tối ưu bộ nhớ hơn |
| **Mục đích sử dụng** | Lưu trữ danh sách động, biến động | Lưu hằng số, bảo vệ dữ liệu cố định |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi gán đè phần tử (`TypeError`):**
> Do Tuple là bất biến, mọi hành động cố tình thay đổi giá trị phần tử sau khi tạo sẽ gặp lỗi cú pháp.
> *Ví dụ:*
> ```python
> coordinates = (100, 200)
> coordinates[0] = 150 # Lỗi sập chương trình: TypeError: 'tuple' object does not support item assignment
> ```
>
> **Lưu ý đặc biệt khi tạo Tuple có 1 phần tử:**
> Nếu bạn viết `t = (5)`, Python sẽ hiểu đây là số nguyên `5` đặt trong ngoặc toán học thông thường. Để Python nhận diện là một Tuple có 1 phần tử, bạn bắt buộc phải viết thêm dấu phẩy ở cuối: `t = (5,)`.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Khai báo nào dưới đây tạo ra một Tuple có **1 phần tử** hợp lệ?
* [ ] `my_tuple = (10)`
* [x] `my_tuple = (10,)`
* [ ] `my_tuple = [10]`
* [ ] `my_tuple = (10, 20)`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn cập nhật giá trị tọa độ x trong bộ dữ liệu `point` nhưng bị lỗi hệ thống. Hãy sửa lại cho đúng (Gợi ý: Tạo một Tuple mới dựa trên các phần tử cũ):
```python
point = (10, 20)
# Đoạn code lỗi:
point[0] = 15
print(point)
```

### Bài tập lập trình (Mini-task)
Khai báo một Tuple tên là `db_config` chứa 3 thông tin lần lượt là: `"localhost"` (host), `3306` (port), và `"root"` (user). Hãy in ra màn hình thông tin cổng kết nối (`3306`) nằm trong Tuple đó.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🔒 **Tuple** là danh sách **bất biến**, khai báo bằng cặp ngoặc đơn `()`.
* ⚡ Tuple tối ưu bộ nhớ và có tốc độ xử lý nhanh hơn List.
* 🛡️ Sử dụng Tuple để lưu trữ các dữ liệu mang tính cấu hình, tọa độ hoặc thông tin không được phép thay đổi.

Trong bài học tiếp theo **[LS-03.10: Set: Tập hợp toán học]**, chúng ta sẽ khám phá cấu trúc dữ liệu Tập hợp (Set) độc đáo với đặc trưng không chứa phần tử trùng lặp và không có thứ tự.
