---
lessonId: "LS-04.06"
title: "Bắt lỗi với Try-Except"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["try-except", "exception handling", "safety", "error recovery"]
prerequisites: ["LS-04.05"]
---

# 📘 Lesson 04.06: Bắt lỗi với Try-Except

---

## 1. Khái niệm & Vấn đề

Chúng ta không muốn ứng dụng ngân hàng hoặc web bán hàng của mình bị dừng hoạt động hoàn toàn chỉ vì một người dùng nhập sai kiểu dữ liệu ở ô tìm kiếm. Chương trình cần phải tự động phát hiện lỗi đó, hiển thị một thông báo hướng dẫn nhẹ nhàng cho người dùng (ví dụ: *"Vui lòng chỉ nhập số nguyên"*) và tiếp tục hoạt động bình thường.

Để làm được việc này, Python cung cấp cấu trúc kiểm soát lỗi **`try - except`** để đón đầu và bắt giữ các ngoại lệ trước khi chúng làm sập hệ thống.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Exception Handling (Xử lý Ngoại lệ)** | Quá trình dự đoán các điểm lỗi tiềm ẩn và định nghĩa luồng xử lý thay thế khi lỗi đó xảy ra. | Giống như việc bạn **mang theo ô (dù)** khi đi ra ngoài. Nếu trời mưa (lỗi xảy ra), bạn bung ô lên để không bị ướt (chương trình chạy luồng xử lý lỗi) thay vì phải đi về giữa chừng. |

---

## 2. Cú pháp & Vận hành

Cú pháp cơ bản của khối lệnh xử lý lỗi:

```python
try:
    # Khối lệnh có nguy cơ xảy ra lỗi
    so_chia = int(input())
    ket_qua = 10 / so_chia
    print(f"Kết quả: {ket_qua}")
except ValueError:
    # Xử lý khi nhập chữ thay vì số
    print("Lỗi: Bạn bắt buộc phải nhập số nguyên!")
except ZeroDivisionError:
    # Xử lý khi chia cho 0
    print("Lỗi: Không được chia cho số 0!")
```

**Bảng theo dõi thực thi khi người dùng nhập vào số `0` (Execution Trace Table):**
| Thứ tự bước | Khối lệnh chạy | Biến/Trạng thái | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `try:` | Bắt đầu giám sát lỗi | Vào khối giám sát |
| 2 | `so_chia = int("0")` | `so_chia: 0` | Ép kiểu thành công số `0` |
| 3 | `ket_qua = 10 / 0` | Phát sinh lỗi `ZeroDivisionError` | Nhảy lập tức khỏi khối `try`, bỏ qua các lệnh in bên dưới |
| 4 | `except ZeroDivisionError:` | Bắt đúng loại lỗi | Nhảy vào khối này thực thi |
| 5 | `print("Lỗi: Không được...")` | In thông báo lỗi | Hiển thị thông báo, chương trình tiếp tục chạy bình thường ngoài khối |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lạm dụng "Bắt lỗi mù" (Bare Except):**
> Viết `except:` không chỉ định tên lỗi cụ thể (ví dụ: `except Exception:`) để giấu tất cả các loại lỗi. Điều này cực kỳ nguy hại vì nó sẽ che giấu cả các lỗi logic ngầm hoặc lỗi viết sai tên biến (NameError) của bạn, làm cho quá trình sửa lỗi (debug) trở nên bất khả thi.
> *Quy tắc vàng:* Chỉ bắt đúng loại lỗi cụ thể mà bạn dự kiến có thể xảy ra (như `ValueError`, `FileNotFoundError`).

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Điều gì xảy ra với các câu lệnh còn lại trong khối `try` ngay sau khi một dòng lệnh ở phía trên nó phát sinh lỗi?
* [ ] Máy tính cố gắng chạy tiếp các dòng bên dưới rồi mới báo lỗi.
* [x] Python lập tức dừng thực thi khối `try` tại vị trí lỗi và nhảy ngay sang khối `except` phù hợp.
* [ ] Chương trình bị tắt ngay lập tức mà không chạy tiếp.
* [ ] Vòng lặp vô hạn được kích hoạt.

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn chuyển đổi điểm số nhập vào từ bàn phím và cộng thêm 1. Nếu người dùng nhập sai, hãy thông báo lỗi thay vì sập ứng dụng. Hãy sửa lại bằng cách thêm `try-except`:
```python
user_input = "chữ"
# Đoạn code lỗi (dễ sập):
score = int(user_input)
print(f"Điểm mới: {score + 1}")
```

### Bài tập lập trình (Mini-task)
Hãy viết chương trình yêu cầu người dùng nhập một chuỗi số nguyên qua `input()`. Sử dụng `try-except` để bắt lỗi `ValueError` nếu người dùng nhập chữ. Nếu ép kiểu thành công, hãy in bình phương số đó ra màn hình. Nếu nhập sai, in ra `"Không phải số nguyên"`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🛡️ Sử dụng **`try`** bao bọc các đoạn code có nguy cơ xảy ra lỗi runtime.
* 🪓 Sử dụng **`except TenLoi`** để xử lý êm xuôi các lỗi cụ thể đó.
* 🚫 Tránh viết `except:` chung chung để không che giấu các lỗi lập trình tiềm ẩn.

Trong bài học tiếp theo **[LS-04.07: Luồng Finally và Ném lỗi chủ động]**, chúng ta sẽ học cách đảm bảo dọn dẹp bộ nhớ (như đóng file) dù lỗi có xảy ra hay không, và cách tự tạo ra lỗi một cách chủ động.
