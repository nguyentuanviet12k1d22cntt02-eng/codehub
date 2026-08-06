---
lessonId: "LS-05.03"
title: "Context Manager với từ khóa 'with'"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["with statement", "context manager", "auto close", "file safety"]
prerequisites: ["LS-05.02"]
---

# 📘 Lesson 05.03: Context Manager với từ khóa 'with'

---

## 1. Khái niệm & Vấn đề

Chúng ta đã biết việc quên gọi lệnh `file.close()` sẽ gây ra rò rỉ tài nguyên. Đáng sợ hơn, ngay cả khi bạn có viết lệnh `close()` ở cuối code, nhưng ở giữa chừng khi đang đọc file lại xảy ra lỗi hệ thống (ví dụ: `ValueError` do dữ liệu lỗi), chương trình sẽ dừng chạy lập tức và dòng lệnh `close()` ở cuối sẽ **bị bỏ qua hoàn toàn**. File vẫn bị khóa trong hệ điều hành.

Để đảm bảo tệp tin **chắc chắn được đóng lại** trong mọi trường hợp (kể cả khi chương trình bị crash), Python giới thiệu cấu trúc quản lý ngữ cảnh (Context Manager) bằng từ khóa **`with`**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Context Manager (`with`)** | Khối lệnh tự động hóa việc chuẩn bị tài nguyên khi vào khối và tự động dọn dẹp (đóng file) khi thoát ra ngoài. | Giống như phòng họp tự động thông minh: Khi bạn bước vào (`with`), đèn tự bật; khi bạn thảo luận xong bước ra ngoài (dù vui vẻ hay cãi nhau), **đèn và cửa tự động đóng lại** mà không cần ai tắt. |

---

## 2. Cú pháp & Vận hành

Cú pháp sử dụng từ khóa `with` để mở file:

```python
# Mở file bằng with, biến file được gán sau từ khóa 'as'
with open("data.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content)
    # File đang mở ở đây

# Ra khỏi khối thụt lề, Python tự động gọi file.close() dưới nền!
print("File đã được đóng an toàn!")
```

**Bảng so sánh quy trình hoạt động:**
| Tính năng | Dùng `open` và `close` truyền thống | Dùng cấu trúc `with open` |
| :--- | :--- | :--- |
| **Cú pháp** | Dài dòng, dễ quên `close()`. | Ngắn gọn, lồng vào khối thụt lề. |
| **Khi xảy ra lỗi giữa chừng** | Lệnh `close()` bị bỏ qua $\rightarrow$ Rò rỉ tài nguyên. | Python lập tức đóng file trước khi báo lỗi ra màn hình. |
| **Mức độ khuyên dùng** | Thấp (chỉ dùng khi test nhanh). | Rất cao (Chuẩn công nghiệp - Best Practice). |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi đọc ghi file ngoài khối `with`:**
> Rất nhiều lập trình viên mới học cố gắng gọi lệnh đọc hoặc ghi dữ liệu lên biến đại diện file sau khi đã thoát khỏi khối thụt lề của `with`. Hành động này sẽ ném ra lỗi `ValueError: I/O operation on closed file`.
> *Ví dụ sai:*
> ```python
> with open("test.txt", "w") as f:
>     f.write("Hello")
> 
> f.write("World") # Lỗi ValueError vì file đã bị đóng tự động rồi!
> ```

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Lợi ích cốt lõi của việc sử dụng từ khóa `with` khi mở file trong Python là gì?
* [ ] Nó giúp file đọc ghi nhanh hơn gấp 2 lần.
* [ ] Nó tự động mã hóa bảo mật nội dung file.
* [x] Nó đảm bảo file luôn được đóng tự động và an toàn khi thoát khỏi khối lệnh, kể cả khi xảy ra lỗi.
* [ ] Nó giúp chuyển file văn bản thành file ảnh.

### Thử thách sửa lỗi (Debug)
Đoạn code dưới đây ghi thông tin cấu hình hệ thống nhưng bị lỗi do viết sai cấu trúc `with`. Hãy sửa lại cho đúng cú pháp:
```python
# Đoạn code lỗi:
with f = open("settings.txt", "w")
    f.write("Volume: 80")
```

### Bài tập lập trình (Mini-task)
Hãy viết chương trình sử dụng cấu trúc `with` để mở một file tên là `"output.txt"` ở chế độ ghi đè (`'w'`), mã hóa `"utf-8"`. Hãy ghi chuỗi chữ `"Hoàn thành khóa học Python"` vào file đó.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🛡️ Sử dụng **`with open(...) as f:`** là phương pháp chuẩn mực và an toàn nhất để làm việc với file trong Python.
* 🚪 Hệ thống tự động đóng file (giải phóng tài nguyên) ngay khi luồng code chạy ra ngoài khối thụt lề.

Chúc mừng bạn đã làm chủ được luồng xử lý File I/O! Trong bài học tiếp theo **[LS-05.04: Tư duy Hướng đối tượng (Class vs Object)]**, chúng ta sẽ chính thức bước vào thế giới của **OOP (Lập trình hướng đối tượng)**, học cách trừu tượng hóa các thực thể ngoài đời thực vào trong code.
