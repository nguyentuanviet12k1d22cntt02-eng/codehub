---
lessonId: "LS-04.05"
title: "Nhận diện Ngoại lệ (Exceptions)"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["exceptions", "runtime errors", "ValueError", "ZeroDivisionError", "TypeError"]
prerequisites: ["LS-01.10"]
---

# 📘 Lesson 04.05: Nhận diện Ngoại lệ (Exceptions)

---

## 1. Khái niệm & Vấn đề

Ngay cả khi mã nguồn của bạn hoàn toàn đúng cú pháp (không bị lỗi biên dịch ban đầu), chương trình vẫn có thể đột ngột sụp đổ (crash) khi đang chạy do các tình huống bất ngờ từ dữ liệu thực tế. Ví dụ: người dùng nhập vào chữ `"abc"` khi chương trình yêu cầu nhập số tuổi, hoặc thực hiện phép chia cho số `0`, hoặc mở một tệp tin không hề tồn tại trên ổ đĩa.

Trong lập trình, các sự cố phát sinh trong quá trình chạy chương trình này được gọi là **Ngoại lệ (Exceptions) / Lỗi Runtime**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Exception (Ngoại lệ)** | Một sự kiện bất thường xảy ra trong khi chạy chương trình, làm gián đoạn luồng thực thi bình thường của mã nguồn. | Giống như việc bạn đang **lái xe trên đường** thì gặp một **hố sụt khẩn cấp** hoặc đá lở chắn ngang đường, khiến xe không thể tiếp tục đi tiếp. |

---

## 2. Cú pháp & Vận hành

Khi gặp sự cố, Python sẽ lập tức dừng mọi câu lệnh phía sau và ném ra một thông báo lỗi kèm tên kiểu ngoại lệ tương ứng. Dưới đây là các loại ngoại lệ kinh điển bạn sẽ liên tục gặp phải:

| Tên ngoại lệ | Nguyên nhân xảy ra | Ví dụ thực tế |
| :--- | :--- | :--- |
| **`ZeroDivisionError`** | Thực hiện phép chia cho số `0`. | `10 / 0` |
| **`ValueError`** | Truyền đối số có kiểu dữ liệu đúng nhưng giá trị không phù hợp. | `int("abc")` |
| **`TypeError`** | Thực hiện phép toán trên hai kiểu dữ liệu không tương thích. | `"Tuổi: " + 16` |
| **`IndexError`** | Truy cập chỉ số index vượt quá giới hạn của chuỗi/mảng. | `[1, 2][5]` |
| **`KeyError`** | Tra cứu một Key không tồn tại trong Dictionary. | `{}["name"]` |

```python
# Lệnh gây sập chương trình ngay lập tức:
n = int("chữ_số") 
print("Lệnh này sẽ không bao giờ được chạy!")
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!IMPORTANT]
> **Phân biệt Lỗi Cú pháp (Syntax Error) và Ngoại lệ (Exception):**
> * **Syntax Error (Lỗi cú pháp):** Chương trình bị sai cấu trúc ngữ pháp viết code (ví dụ thiếu dấu hai chấm `:` ở dòng `if`). Chương trình sẽ **không thể bắt đầu chạy** vì trình biên dịch từ chối chạy.
> * **Exception (Ngoại lệ):** Cú pháp hoàn toàn đúng, chương trình **đang chạy bình thường** thì bất ngờ gặp dữ liệu sai hoặc môi trường lỗi nên bị sập giữa chừng.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Khi chạy dòng lệnh `10 / 0`, Python sẽ ném ra ngoại lệ nào dưới đây?
* [ ] `ValueError`
* [ ] `TypeError`
* [x] `ZeroDivisionError`
* [ ] `IndexError`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn hiển thị phần mở rộng của danh sách người dùng nhưng gặp lỗi sập chương trình. Hãy chỉ ra tên ngoại lệ (Exception) xuất hiện trong console khi chạy đoạn code này:
```python
users = ["Alice", "Bob"]
print(users[2])

# Ngoại lệ xảy ra là:
```

### Bài tập lập trình (Mini-task)
Hãy viết một dòng code Python thực hiện một phép toán hoặc ép kiểu gây ra lỗi **`TypeError`** (ví dụ: cộng chuỗi với số nguyên).
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🚨 **Ngoại lệ (Exception)** là lỗi phát sinh trong lúc chương trình đang chạy (Runtime), làm chương trình sập ngay lập tức.
* 📋 Các loại ngoại lệ phổ biến: `ZeroDivisionError`, `ValueError`, `TypeError`, `IndexError`, `KeyError`.
* 🛡️ Lập trình viên giỏi cần học cách nhận diện tên các lỗi này để chuẩn bị phương án phòng thủ.

Trong bài học tiếp theo **[LS-04.06: Bắt lỗi với Try-Except]**, chúng ta sẽ học cách dựng "lá chắn phòng thủ" để khi gặp các lỗi này, chương trình vẫn bình an chạy tiếp chứ không bị sập đột ngột.
