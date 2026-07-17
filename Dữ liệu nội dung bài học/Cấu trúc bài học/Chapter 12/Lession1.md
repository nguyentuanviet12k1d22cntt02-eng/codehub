---
lessonId: "LS-05.01"
title: "Cấu trúc bộ nhớ và Hàm open()"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["file handling", "open", "file pointer", "RAM vs Disk"]
prerequisites: ["LS-04.07"]
---

# 📘 Lesson 05.01: Cấu trúc bộ nhớ và Hàm open()

---

## 1. Khái niệm & Vấn đề

Khi chương trình Python của bạn kết thúc chạy, tất cả các biến, mảng hay từ điển bạn vừa tạo đều sẽ **biến mất hoàn toàn** khỏi bộ nhớ RAM của máy tính. Nếu bạn muốn lưu trữ lại lịch sử điểm số của học sinh, thông tin tài khoản người dùng hoặc cấu hình của ứng dụng để lần sau mở máy lên vẫn sử dụng được, bạn bắt buộc phải lưu dữ liệu đó xuống ổ cứng (Disk) dưới dạng các tệp tin (Files).

Để làm việc với tệp tin nằm trên ổ cứng, Python cần thực hiện một động tác liên kết gọi là **mở tập tin**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **RAM vs Disk** | RAM lưu dữ liệu tạm thời khi ứng dụng đang chạy; Disk lưu trữ dữ liệu vĩnh viễn ngay cả khi tắt nguồn điện. | RAM giống như **mặt bàn làm việc** của bạn (dễ dọn dẹp, diện tích nhỏ); Disk giống như **chiếc tủ hồ sơ** đặt ở góc phòng (lớn, lưu trữ lâu dài). |
| **`open()`** | Hàm xây dựng một đường kết nối (file stream) giữa chương trình Python và tệp tin trên ổ cứng. | Giống như việc bạn **cắm chìa khóa và mở cánh cửa tủ hồ sơ** để bắt đầu lấy hoặc cất tài liệu. |

---

## 2. Cú pháp & Vận hành

Để mở một file, ta sử dụng hàm `open()` với cú pháp cơ bản:

```python
# Mở file tên là 'data.txt' ở chế độ đọc ('r' - read)
file = open("data.txt", "r", encoding="utf-8")

# In thông tin đối tượng file
print(file) 

# Đóng liên kết file khi dùng xong để giải phóng bộ nhớ ổ cứng
file.close()
```

### Các chế độ mở file phổ biến (Modes):
* **`'r'` (Read):** Chỉ đọc file. File bắt buộc phải tồn tại từ trước, nếu không sẽ lỗi `FileNotFoundError`.
* **`'w'` (Write):** Ghi đè file. Nếu file chưa có sẽ tự tạo mới. Nếu file đã tồn tại, toàn bộ nội dung cũ sẽ bị xóa sạch để ghi mới.
* **`'a'` (Append):** Ghi tiếp vào cuối file. Không xóa dữ liệu cũ, ghi tiếp dữ liệu mới vào dòng cuối cùng.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Quên đóng file (`file.close()`):**
> Khi bạn mở file mà quên gọi lệnh `close()`, file đó sẽ bị hệ điều hành khóa lại (lock). Các chương trình khác (như Word, Notepad) hoặc chính đoạn code phía sau của bạn sẽ không thể chỉnh sửa, di chuyển hoặc xóa file đó đi. Điều này gây ra lỗi rò rỉ tài nguyên hệ thống.
>
> **Lỗi mã hóa tiếng Việt (UnicodeDecodeError):**
> Khi đọc hoặc ghi file chứa tiếng Việt có dấu, hãy luôn truyền tham số `encoding="utf-8"` vào hàm `open()` để đảm bảo hiển thị đúng chữ, tránh bị lỗi font chữ hoặc sập chương trình.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Chế độ mở file (mode) nào sẽ xóa sạch toàn bộ nội dung cũ của file đó trước khi ghi dữ liệu mới?
* [ ] `'r'`
* [x] `'w'`
* [ ] `'a'`
* [ ] `'x'`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn mở file cấu hình hệ thống để ghi thêm dữ liệu nhưng đang gặp lỗi. Hãy chỉ ra lý do tại sao đoạn code này không an toàn khi chạy lâu dài:
```python
f = open("config.txt", "w")
f.write("Theme: Dark")
# Lỗi thiếu gì ở đây?
```

### Bài tập lập trình (Mini-task)
Hãy viết dòng code mở một file tên là `"output.txt"` ở chế độ ghi tiếp dữ liệu (`'a'`) có thiết lập mã hóa tiếng Việt `"utf-8"`, lưu kết quả vào biến `f`, sau đó đóng file lại ngay lập tức.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 💾 Dữ liệu trên RAM là tạm thời, dữ liệu trên ổ cứng (Disk) dưới dạng file mới là vĩnh viễn.
* 🔑 Sử dụng hàm **`open("tên_file", "mode", encoding="utf-8")`** để bắt đầu kết nối với file.
* 🔒 Luôn ghi nhớ gọi phương thức **`close()`** để đóng file sau khi sử dụng xong.

Trong bài học tiếp theo **[LS-05.02: Đọc và Ghi File Text]**, chúng ta sẽ học các phương thức thực tế để đọc nội dung chữ và ghi các dòng chữ vào file.
