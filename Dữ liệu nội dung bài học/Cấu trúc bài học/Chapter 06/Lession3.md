---
lessonId: "LS-03.03"
title: "Các phương thức chuỗi phổ biến"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["string methods", "strip", "replace", "split", "join"]
prerequisites: ["LS-03.02"]
---

# 📘 Lesson 03.03: Các phương thức chuỗi phổ biến

---

## 1. Khái niệm & Vấn đề

Khi người dùng nhập dữ liệu (như nhập email đăng nhập), họ thường vô tình gõ thừa khoảng trắng ở đầu/cuối, hoặc nhập sai chữ hoa chữ thường. Nếu lập trình viên không xử lý chuẩn hóa dữ liệu này trước, hệ thống có thể so khớp sai thông tin đăng nhập hoặc lưu trữ dữ liệu rác vào cơ sở dữ liệu.

Python cung cấp một bộ **phương thức chuỗi (string methods)** cực kỳ phong phú để giúp biến đổi, chuẩn hóa, phân tách và tìm kiếm thông tin văn bản một cách nhanh chóng mà không cần viết các vòng lặp thủ công phức tạp.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **String Method (Phương thức chuỗi)** | Các hàm tích hợp sẵn của riêng kiểu dữ liệu chuỗi để thao tác và xử lý văn bản. | Giống như các **nút tính năng trên máy giặt** (Giặt nhanh, Vắt khô, Giặt len). Mỗi nút thực hiện một công việc làm sạch chuyên biệt trên quần áo của bạn. |

---

## 2. Cú pháp & Vận hành

Vì là phương thức gắn liền với đối tượng chuỗi, ta gọi chúng bằng dấu chấm `.` ngay sau tên biến chuỗi:
`ten_bien.ten_phuong_thuc()`

Dưới đây là các phương thức cốt lõi và ứng dụng của chúng:

| Phương thức | Ý nghĩa | Ví dụ | Kết quả |
| :--- | :--- | :--- | :--- |
| `upper()` / `lower()` | Chuyển toàn bộ thành chữ HOA / chữ thường. | `"Py".upper()` | `"PY"` |
| `strip()` | Loại bỏ khoảng trắng thừa ở hai đầu chuỗi. | `" hello ".strip()` | `"hello"` |
| `replace(old, new)` | Tìm và thay thế chuỗi con. | `"a-b".replace("-", "/")` | `"a/b"` |
| `split(char)` | Cắt chuỗi thành một danh sách (List) các chuỗi con. | `"a,b,c".split(",")` | `["a", "b", "c"]` |
| `join(list)` | Gộp danh sách các chuỗi lại thành một chuỗi duy nhất. | `"-".join(["a", "b"])` | `"a-b"` |

```python
raw_email = "  Admin@Mcode.vn  "
clean_email = raw_email.strip().lower()
print(clean_email)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `raw_email = "  Admin@Mcode.vn  "` | `raw_email: "  Admin@Mcode.vn  "` | Lưu chuỗi thô chưa xử lý |
| 2 | `clean_email = raw_email.strip().lower()` | `clean_email: "admin@mcode.vn"` | Cắt khoảng trắng đầu/cuối, sau đó chuyển hết thành chữ thường |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Phương thức không thay đổi chuỗi gốc:**
> Do chuỗi là **bất biến (immutable)**, các phương thức trên không hề sửa đổi giá trị bên trong biến chuỗi gốc mà luôn trả về một **chuỗi mới**.
> *Ví dụ sai:*
> ```python
> name = "  alice  "
> name.strip() # Gọi phương thức nhưng không gán lại kết quả
> print(name)  # Vẫn hiển thị nguyên khoảng trắng "  alice  "
> ```
> *Ví dụ đúng:* Bạn phải gán đè: `name = name.strip()`.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để tách chuỗi ngày tháng `"16/07/2026"` thành danh sách gồm ngày, tháng, năm độc lập, ta dùng phương thức nào?
* [ ] `replace()`
* [ ] `strip()`
* [x] `split()`
* [ ] `join()`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn chuẩn hóa tên người dùng bằng cách xóa khoảng trắng hai đầu và viết hoa chữ cái đầu tiên, nhưng biến `user` vẫn không thay đổi. Hãy sửa lại:
```python
user = "  bob  "
# Đoạn code lỗi:
user.strip().capitalize()
print(user) # Mong muốn hiển thị: "Bob"
```

### Bài tập lập trình (Mini-task)
Khai báo biến `message = "Python-is-fun"`. Hãy thay thế tất cả dấu gạch ngang `"-"` bằng dấu cách `" "` để thu được chuỗi mới, sau đó in chuỗi đó ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🧼 `strip()` dùng để dọn dẹp các khoảng trắng thừa do người dùng nhập lỗi.
* 🔄 Các phương thức chuỗi **không** thay đổi chuỗi gốc, bạn bắt buộc phải gán lại kết quả vào biến nếu muốn lưu trữ.
* 🧩 `split()` và `join()` là cặp bài trùng để xử lý chuyển đổi qua lại giữa chuỗi và danh sách (List).

Trong bài học tiếp theo **[LS-03.04: Định dạng chuỗi (F-string)]**, chúng ta sẽ học cách ghép các biến số, chuỗi ký tự vào trong một thông báo hiển thị một cách gọn gàng và đẹp mắt nhất.
