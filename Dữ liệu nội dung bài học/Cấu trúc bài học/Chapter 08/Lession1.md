---
lessonId: "LS-03.10"
title: "Set: Tập hợp toán học"
difficulty: "MEDIUM"
estimatedDuration: 15
keywords: ["set", "mathematical set", "unique", "unordered", "curly braces"]
prerequisites: ["LS-03.05"]
---

# 📘 Lesson 03.10: Set: Tập hợp toán học

---

## 1. Khái niệm & Vấn đề

Khi xử lý danh sách khách hàng đăng ký tham gia sự kiện, hệ thống có thể nhận về nhiều lượt đăng ký trùng lặp do người dùng nhấn nút nhiều lần. Hoặc khi bạn cần kiểm tra xem danh sách các môn học đăng ký của học sinh A và học sinh B có những môn nào giống nhau (phép giao) hoặc tất cả các môn của cả hai bạn (phép hợp).

Nếu dùng List, ta phải viết các vòng lặp phức tạp để lọc bỏ phần tử trùng nhau. Python giải quyết vấn đề này bằng cấu trúc dữ liệu **Tập hợp (Set)**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Set (Tập hợp)** | Cấu trúc dữ liệu có thể thay đổi (mutable), **không có thứ tự (unordered)**, và các phần tử bên trong **bắt buộc phải duy nhất (unique)**. | Giống như một **túi kẹo sỏi nhiều màu**. Các viên kẹo nằm lộn xộn không có thứ tự, và nếu bạn ném thêm một viên kẹo cùng màu vào túi, số lượng kẹo độc bản vẫn không thay đổi. |

---

## 2. Cú pháp & Vận hành

Để tạo một Set, ta dùng cặp ngoặc nhọn `{}` (tương tự như toán học). Các phần tử phân tách bởi dấu phẩy `,`:
`ten_set = {phan_tu_1, phan_tu_2, ...}`

Các đặc điểm chính của Set:
* **Loại bỏ trùng lặp tự động:** Nếu khởi tạo Set chứa các phần tử trùng nhau, Set sẽ tự lọc chỉ giữ lại một.
* **Không có thứ tự (Unordered):** Set không hỗ trợ đánh chỉ số index. Lệnh `my_set[0]` sẽ báo lỗi cú pháp.
* **Các phép toán tập hợp toán học:** Hỗ trợ phép Hợp (Union), Giao (Intersection), Hiệu (Difference).

```python
# 1. Khởi tạo set tự lọc trùng lặp
numbers = {1, 2, 2, 3, 3, 3}
print(numbers) # Kết quả: {1, 2, 3}

# 2. Thêm và Xóa
numbers.add(4)
numbers.discard(2)
print(numbers) # Kết quả: {1, 3, 4}

# 3. Phép toán tập hợp
setA = {1, 2, 3}
setB = {3, 4, 5}
print(setA & setB) # Phép Giao -> {3}
print(setA | setB) # Phép Hợp -> {1, 2, 3, 4, 5}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi khởi tạo Set rỗng:**
> Trong Python, nếu bạn viết `empty_set = {}`, hệ thống sẽ mặc định đây là một **Dictionary rỗng** chứ không phải Set rỗng!
> *Cách đúng:* Bạn bắt buộc phải gọi hàm dựng `set()` để tạo Set rỗng: `empty_set = set()`.
>
> **Lỗi truy cập Index:**
> Nhắc lại: Set không có thứ tự nên bạn không được phép dùng `set[0]`. Để duyệt qua các phần tử của Set, hãy sử dụng vòng lặp `for item in my_set`.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Lệnh nào sau đây dùng để tạo một **tập hợp rỗng (Set rỗng)** trong Python?
* [ ] `s = {}`
* [x] `s = set()`
* [ ] `s = []`
* [ ] `s = ()`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn lọc ra các số duy nhất từ danh sách `numbers` bằng cách chuyển sang Set, sau đó in ra số đầu tiên, nhưng chương trình bị sập lỗi. Hãy chỉ ra nguyên nhân và sửa lại cho đúng:
```python
numbers = [1, 2, 2, 3, 4, 4]
unique_numbers = set(numbers)
# Đoạn code lỗi:
first_unique = unique_numbers[0]
print(first_unique)
```

### Bài tập lập trình (Mini-task)
Khai báo hai tập hợp: `set_a = {1, 2, 3}` và `set_b = {3, 4, 5}`. Hãy tìm tập hợp giao (các phần tử chung của cả hai tập hợp) và in kết quả ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🧼 **Set** tự động loại bỏ tất cả các phần tử trùng lặp.
* 🚫 Set **không có thứ tự** (Unordered) và không dùng được chỉ số Index.
* ➕ Dùng `.add()` để thêm, `.discard()` để xóa phần tử an toàn.
* 🧮 Hỗ trợ đắc lực cho các phép toán tập hợp: giao (`&`), hợp (`|`), hiệu (`-`).

Trong bài học tiếp theo **[LS-03.11: Dictionary: Cấu trúc Key-Value]**, chúng ta sẽ làm quen với cấu trúc ánh xạ cực kỳ hữu ích - Từ điển (Dictionary), giúp tổ chức thông tin dưới dạng cặp khóa - giá trị.
