---
lessonId: "LS-01.04"
title: "Khái niệm Biến và Cách đặt tên"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["variable", "naming conventions", "python basic", "pep8", "snake_case"]
prerequisites: ["LS-01.03"]
---

# 📘 Lesson 01.04: Khái niệm Biến và Cách đặt tên

---

## 1. Khái niệm & Vấn đề

Hãy tưởng tượng bạn đang quản lý một kho hàng lớn với hàng nghìn loại sản phẩm khác nhau. Nếu bạn chỉ đặt sản phẩm bừa bãi trên sàn nhà mà không dán nhãn hoặc xếp vào các hộp chuyên dụng, việc tìm kiếm và cập nhật số lượng hàng sẽ trở thành một cơn ác mộng.

Trong lập trình máy tính cũng vậy, khi chương trình hoạt động, nó cần ghi nhớ dữ liệu tạm thời (như điểm số trò chơi, tên người dùng) để tính toán. Nếu không có biến, mọi dữ liệu sẽ là "tĩnh" (hardcoded) và chúng ta không thể thực hiện tính toán động.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Biến (Variable)** | Tên đại diện được liên kết với một vùng nhớ trong RAM để lưu trữ dữ liệu. | Như một **chiếc hộp dán nhãn**. Giá trị trong hộp là dữ liệu, nhãn dán là tên biến. |

---

## 2. Cú pháp & Vận hành

Để khai báo và gán giá trị cho biến trong Python, ta dùng toán tử gán `=`:

```python
tuoi = 15
print(tuoi)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `tuoi = 15` | `tuoi: 15` | Khởi tạo biến `tuoi`, gán giá trị số nguyên 15 |
| 2 | `print(tuoi)` | `tuoi: 15` | Đọc giá trị từ biến `tuoi` và hiển thị ra màn hình |

**Trạng thái bộ nhớ RAM:**
```text
[Stack (Tên biến)]          [Heap (Vùng dữ liệu thực tế)]
     tuoi           ───────►  15                  (Kiểu Integer)
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các quy tắc đặt tên biến bắt buộc để tránh lỗi cú pháp (`SyntaxError`):**
> * **Không bắt đầu bằng số**: `1st_place = 100` là sai (phải viết `place_1st = 100`).
> * **Không chứa khoảng trắng / ký tự đặc biệt**: `user name = "Alice"` hay `user-name` là sai (phải viết `user_name`).
> * **Không trùng từ khóa hệ thống**: Tránh dùng `if`, `else`, `while`, `print` làm tên biến.
> * **Lỗi `NameError`**: Xảy ra khi bạn gọi một biến khi chưa khởi tạo gán giá trị (ví dụ: `print(y)` khi chưa có dòng `y = ...`).

> [!TIP]
> **Quy tắc viết code đẹp (Best Practices):**
> * Tuân thủ chuẩn **snake_case** theo PEP 8: Viết chữ thường toàn bộ, các từ cách nhau bởi dấu gạch dưới (ví dụ: `student_name`, `total_amount`).
> * Đặt tên rõ nghĩa, mô tả đúng mục đích của biến (ví dụ: `price_per_item` thay vì đặt `p`).

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Tên biến nào sau đây là **hợp lệ** trong Python?
* [ ] `student-name`
* [ ] `2nd_score`
* [x] `class_name`
* [ ] `is$happy`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây bị lỗi. Hãy tìm lỗi và sửa lại cho đúng:
```python
# Sửa lại đoạn code lỗi sau:
user name = "Alice"
print(user name)
```

### Bài tập lập trình (Mini-task)
Khai báo biến `apples` gán giá trị bằng `10`, biến `bananas` gán bằng `5`. Tính tổng số trái cây gán vào biến `total` và in giá trị biến `total` ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📦 **Biến** lưu trữ dữ liệu tạm thời trong RAM máy tính để tái sử dụng.
* ✍️ Sử dụng toán tử `=` để gán dữ liệu vào biến theo chiều từ **phải sang trái**.
* 🐍 Luôn đặt tên biến rõ nghĩa theo chuẩn **snake_case** và tuân thủ các quy tắc đặt tên hợp lệ.

Trong bài học tiếp theo **[LS-01.05: Các kiểu dữ liệu nguyên thủy]**, chúng ta sẽ khám phá ba nhóm kiểu dữ liệu nền tảng nhất: Số nguyên (`int`), Số thực (`float`), và Logic (`boolean`) để biết cách Python quản lý dữ liệu hiệu quả.