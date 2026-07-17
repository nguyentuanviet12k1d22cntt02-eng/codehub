---
lessonId: "LS-01.08"
title: "Hàm xuất dữ liệu (Print)"
difficulty: "BASIC"
estimatedDuration: 20
keywords: ["print function", "sep parameter", "end parameter", "output", "python basics"]
prerequisites: ["LS-01.07"]
---

# 📘 Lesson 01.08: Hàm xuất dữ liệu (Print)

---

## 1. Khái niệm & Vấn đề

Máy tính có thể xử lý hàng triệu phép tính mỗi giây, nhưng nếu nó không thể hiển thị kết quả ra ngoài cho con người nhìn thấy, chương trình sẽ trở nên vô dụng. 

Để thực hiện giao tiếp một chiều từ máy tính đến con người, chúng ta sử dụng **Hàm xuất dữ liệu (`print()`)**. Đây là công cụ cơ bản nhất giúp chúng ta "nhìn" thấy những gì đang diễn ra bên trong bộ nhớ máy tính.

| Kỹ thuật | Vai trò | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Hàm `print()`** | Xuất văn bản, kết quả tính toán hoặc trạng thái của biến ra màn hình console. | Giống như **chiếc loa phát thanh** hoặc màn hình hiển thị thông tin ở sân bay: phát thông tin ra ngoài cho mọi người cùng biết. |

---

## 2. Cú pháp & Vận hành

Mặc định, hàm `print()` sẽ tự động chèn một khoảng trắng giữa các giá trị được ngăn cách bằng dấu phẩy và tự động xuống dòng sau khi in xong. Chúng ta có thể tùy biến hành vi này bằng hai tham số đặc biệt là `sep` (ký tự phân tách) và `end` (ký tự kết thúc).

```python
ten = "Python"
phien_ban = 3.10
print("Xin chào,", ten, "phiên bản", phien_ban)

# Sử dụng sep để thay đổi ký tự phân tách
print("A", "B", "C", sep="-")

# Sử dụng end để không xuống dòng
print("Học lập trình", end=" ")
print("tại mCode")
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính (Đầu ra màn hình) |
|:---:|:---|:---|:---|
| 1 | `ten = "Python"` | `ten: "Python"` | Khởi tạo biến `ten` |
| 2 | `phien_ban = 3.10` | `phien_ban: 3.10` | Khởi tạo biến `phien_ban` |
| 3 | `print("Xin chào,", ...)` | | Xuất ra màn hình: `Xin chào, Python phiên bản 3.10` (sau đó xuống dòng). |
| 6 | `print("A", "B", ...)` | | Xuất ra màn hình: `A-B-C` (phân tách bởi `-` và xuống dòng). |
| 9 | `print("Học...", end=" ")`| | Xuất ra màn hình: `Học lập trình ` (kết thúc bằng dấu cách, không xuống dòng). |
| 10| `print("tại mCode")` | | Xuất tiếp nối dòng trên: `tại mCode` (sau đó xuống dòng). |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các lỗi cú pháp thường gặp khi dùng print():**
> * **Lỗi viết hoa tên hàm**: Python phân biệt chữ hoa chữ thường. Viết `Print("Hello")` thay vì `print("Hello")` sẽ báo lỗi `NameError: name 'Print' is not defined`.
> * **Lỗi quên dấu phẩy `,` phân tách**: Khi in nhiều giá trị cùng lúc, bắt buộc phải ngăn cách chúng bằng dấu phẩy `,` (ví dụ: `print("Tuổi của bạn là" tuoi)` là sai, phải viết là `print("Tuổi của bạn là", tuoi)`).

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Để in nhiều giá trị trên cùng một dòng và ngăn cách chúng bởi dấu gạch chéo `/` (ví dụ: `16/07/2026`), ta cần thiết lập tham số nào trong hàm `print()`?
* [ ] `end="/" `
* [x] `sep="/" `
* [ ] `split="/" `
* [ ] `join="/" `

### Thử thách sửa lỗi (Debug)
Đoạn code dưới đây bị lỗi khi chạy. Hãy tìm lỗi cú pháp và sửa lại cho đúng:
```python
# Sửa lại đoạn code in lỗi dưới đây:
ten_khoa_hoc = "Python Nền Tảng"
Print("Chào mừng bạn đến với khóa học" ten_khoa_hoc)
```

### Bài tập lập trình (Mini-task)
Hãy khai báo 3 biến chứa ngày tháng năm: `ngay = 16`, `thang = 7`, `nam = 2026`. Sử dụng một câu lệnh `print()` duy nhất với tham số `sep` để in ra màn hình chuỗi ngày tháng năm có dạng `16/7/2026`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📢 Hàm `print()` dùng để hiển thị dữ liệu ra màn hình console cho người dùng xem.
* ⚙️ Có thể tinh chỉnh cách in bằng tham số `sep` (phân tách phần tử) và `end` (kết thúc dòng).

Trong bài học tiếp theo **[LS-01.09: Hàm nhập dữ liệu (Input)]**, chúng ta sẽ mở rộng giao tiếp thành hai chiều bằng cách cho phép người dùng nhập thông tin từ bàn phím vào chương trình.
