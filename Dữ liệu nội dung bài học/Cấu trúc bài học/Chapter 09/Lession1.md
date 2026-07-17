---
lessonId: "LS-04.01"
title: "Tư duy đóng gói và Lệnh def"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["function", "def", "reusability", "encapsulation"]
prerequisites: ["LS-01.07"]
---

# 📘 Lesson 04.01: Tư duy đóng gói và Lệnh def

---

## 1. Khái niệm & Vấn đề

Hãy tưởng tượng bạn đang viết một ứng dụng quản lý bán hàng. Trong chương trình có rất nhiều nơi cần tính tiền thuế VAT (10% giá trị sản phẩm). Nếu ở mỗi chỗ tính toán, bạn đều viết lại công thức `tax = price * 0.1`, mã nguồn của bạn sẽ bị lặp lại ở khắp mọi nơi (duplication). Khi chính sách thuế thay đổi thành 8%, bạn sẽ phải tìm kiếm và sửa đổi thủ công ở từng dòng code, điều này vô cùng dễ sót và mất thời gian.

Để giải quyết vấn đề này, lập trình viên sử dụng tư duy **đóng gói (encapsulation)** bằng cách tạo ra các **Hàm (Functions)**. Hàm giúp gom một nhóm các câu lệnh thực hiện cùng một nhiệm vụ lại thành một khối mã có tên gọi, cho phép tái sử dụng ở bất kỳ đâu chỉ qua tên gọi đó.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Function (Hàm)** | Một khối mã lệnh độc lập được đặt tên, có thể được gọi chạy nhiều lần trong chương trình. | Giống như một **công thức làm bánh đóng hộp**. Mỗi lần muốn ăn bánh, bạn không cần tự đi gom nguyên liệu và học lại từ đầu, chỉ cần mua hộp bánh đó về và thực hiện theo hướng dẫn (gọi hàm). |

---

## 2. Cú pháp & Vận hành

Để định nghĩa một hàm trong Python, ta dùng từ khóa `def` (viết tắt của define), theo sau là tên hàm, cặp ngoặc đơn `()` và dấu hai chấm `:`. Các lệnh bên trong hàm phải được thụt lề (indentation):

```python
def say_hello():
    print("Chào mừng bạn đến với MCode!")

# Gọi hàm chạy
say_hello()
say_hello()
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái chương trình | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1-2 | `def say_hello(): ...` | Đăng ký hàm `say_hello` vào bộ nhớ | Máy tính lưu thông tin khối lệnh nhưng chưa chạy |
| 5 | `say_hello()` | Nhảy vào hàm `say_hello` | Thực thi lệnh `print("Chào mừng...")` |
| 6 | `say_hello()` | Nhảy vào hàm `say_hello` lần 2 | Thực thi lệnh `print("Chào mừng...")` lần nữa |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Định nghĩa hàm nhưng quên gọi hàm:**
> Lỗi phổ biến của người mới học là viết định nghĩa hàm bằng `def` rất chi tiết nhưng chạy chương trình không thấy có kết quả gì xuất hiện trên màn hình. Đó là vì bạn chưa viết câu lệnh **gọi hàm** (ví dụ: `say_hello()`).
>
> **Lỗi thứ tự định nghĩa (NameError):**
> Python biên dịch code từ trên xuống dưới. Bạn không thể gọi một hàm trước khi định nghĩa nó.
> *Ví dụ sai:*
> ```python
> run_task() # Gây ra lỗi NameError: name 'run_task' is not defined
> def run_task():
>     print("Done")
> ```

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Từ khóa nào trong Python được sử dụng để bắt đầu định nghĩa một hàm mới?
* [x] `def`
* [ ] `function`
* [ ] `define`
* [ ] `class`

### Thử thách sửa lỗi (Debug)
Đoạn code dưới đây muốn định nghĩa một hàm in ra lời chào buổi sáng, nhưng khi chạy chương trình lại không hiển thị gì trên màn hình. Hãy tìm lỗi và sửa lại:
```python
def greet_morning():
    print("Good morning!")
```

### Bài tập lập trình (Mini-task)
Hãy định nghĩa một hàm tên là `show_banner` in ra màn hình chuỗi kí tự `"=== PYTHON COURSE ==="`. Đừng quên viết lệnh gọi hàm đó hoạt động ở dòng cuối cùng.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📦 **Hàm (Function)** giúp gom nhóm mã nguồn, tăng tính tái sử dụng và dễ bảo trì.
* 🔑 Dùng từ khóa **`def`** để định nghĩa hàm và cặp ngoặc đơn `()` để kích hoạt/gọi hàm.
* ⚠️ Phải định nghĩa hàm trước rồi mới được gọi hàm ở phía dưới.

Trong bài học tiếp theo **[LS-04.02: Tham số và Đối số]**, chúng ta sẽ học cách truyền dữ liệu đầu vào cho hàm để hàm xử lý linh động thay vì chỉ in ra các dòng chữ tĩnh cố định.
