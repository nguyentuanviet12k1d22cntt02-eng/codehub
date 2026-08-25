---
lessonId: "LS-03.06"
title: "Cập nhật & Sửa đổi List"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["list modification", "append", "insert", "remove", "pop", "mutable"]
prerequisites: ["LS-03.05"]
---

# 📘 Lesson 03.06: Cập nhật & Sửa đổi List

---

## 1. Khái niệm & Vấn đề

Không giống như chuỗi ký tự (đã tạo ra là không thể thay đổi từng phần tử), danh sách (List) trong Python là một cấu trúc dữ liệu **có thể thay đổi (mutable)**. 

Trong các chương trình thực tế, dữ liệu liên tục biến động: người dùng thêm một sản phẩm vào giỏ hàng, xóa một công việc đã hoàn thành khỏi danh sách cần làm (To-Do List), hoặc cập nhật số điện thoại mới. Do đó, kỹ năng thêm, sửa, xóa phần tử trong List là cực kỳ thiết yếu.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Mutable (Có thể thay đổi)** | Khả năng cho phép sửa đổi nội dung bên trong vùng nhớ của đối tượng mà không cần tạo đối tượng mới. | Giống như một **bảng viết phấn**. Bạn có thể xóa chữ cũ, viết thêm chữ mới lên bảng tùy ý. |

---

## 2. Cú pháp & Vận hành

### Sửa đổi phần tử trực tiếp qua Index
Để thay đổi giá trị của một phần tử tại vị trí cụ thể, ta dùng toán tử gán `=` trực tiếp:
`ten_list[index] = gia_tri_moi`

### Thêm phần tử mới
* `append(value)`: Thêm một phần tử vào **cuối** danh sách.
* `insert(index, value)`: Chèn một phần tử vào **vị trí chỉ định**, dịch các phần tử phía sau sang phải.

### Xóa phần tử
* `remove(value)`: Tìm và xóa phần tử đầu tiên có giá trị trùng khớp (báo lỗi nếu không tìm thấy).
* `pop(index)`: Xóa phần tử tại vị trí `index` và trả về giá trị của phần tử đó (nếu bỏ trống index, mặc định xóa phần tử cuối cùng).

```python
shopping_cart = ["Sữa", "Trứng"]
shopping_cart.append("Bánh mì")
shopping_cart[1] = "Bơ" # Thay "Trứng" bằng "Bơ"
shopping_cart.pop(0) # Xóa "Sữa"
print(shopping_cart)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến `shopping_cart` | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `shopping_cart = ["Sữa", "Trứng"]` | `["Sữa", "Trứng"]` | Khởi tạo giỏ hàng |
| 2 | `shopping_cart.append("Bánh mì")` | `["Sữa", "Trứng", "Bánh mì"]` | Thêm "Bánh mì" vào cuối |
| 3 | `shopping_cart[1] = "Bơ"` | `["Sữa", "Bơ", "Bánh mì"]` | Thay thế giá trị tại chỉ số 1 |
| 4 | `shopping_cart.pop(0)` | `["Bơ", "Bánh mì"]` | Xóa phần tử ở vị trí đầu tiên |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi `ValueError` khi `remove()`:**
> Nếu bạn gọi `list.remove("X")` mà `"X"` không tồn tại trong danh sách, Python sẽ lập tức báo lỗi `ValueError: list.remove(x): x not in list`.
> *Mẹo an toàn:* Nên kiểm tra sự tồn tại của phần tử trước bằng toán tử `in`:
> ```python
> if "X" in my_list:
>     my_list.remove("X")
> ```
>
> **Nhầm lẫn phương thức thay đổi tại chỗ (In-place modification):**
> Các phương thức như `append()`, `insert()`, `remove()` trực tiếp thay đổi danh sách gốc và **không** trả về giá trị gì (trả về `None`). Do đó, bạn không được gán ngược lại biến:
> *Ví dụ sai:* `my_list = my_list.append("A")` -> Biến `my_list` sẽ bị biến thành `None`!

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Lệnh nào sau đây dùng để chèn phần tử `"Apple"` vào ngay **đầu** danh sách `fruits`?
* [ ] `fruits.append("Apple")`
* [x] `fruits.insert(0, "Apple")`
* [ ] `fruits.remove(0)`
* [ ] `fruits[0] = "Apple"`

### Thử thách sửa lỗi (Debug)
Đoạn code sau muốn thêm phần tử `"Blue"` vào danh sách màu sắc nhưng biến `colors` lại bị mất dữ liệu (trở thành `None`). Hãy sửa lại cho đúng:
```python
colors = ["Red", "Green"]
# Đoạn code lỗi:
colors = colors.append("Blue")
print(colors)
```

### Bài tập lập trình (Mini-task)
Khai báo danh sách `tasks = ["Học bài", "Quét nhà"]`. Hãy thêm phần tử `"Nấu cơm"` vào cuối danh sách, sau đó xóa phần tử đầu tiên `"Học bài"` ra khỏi danh sách. In danh sách `tasks` cuối cùng ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📝 List có tính chất **Mutable** (có thể chỉnh sửa trực tiếp mà không đổi địa chỉ bộ nhớ).
* ➕ Dùng `append()` để thêm vào cuối, `insert()` để chèn vào vị trí bất kỳ.
* ➖ Dùng `remove()` để xóa theo giá trị, `pop()` để xóa theo chỉ số (index).

Trong bài học tiếp theo **[LS-03.07: Duyệt mảng bằng Vòng lặp]**, chúng ta sẽ học cách quét qua từng phần tử của danh sách bằng vòng lặp để thực hiện tính toán tự động trên hàng loạt dữ liệu.
