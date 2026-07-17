---
lessonId: "LS-04.04"
title: "Phạm vi của Biến (Scope)"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["variable scope", "local variable", "global variable", "global keyword", "LEGB"]
prerequisites: ["LS-04.03"]
---

# 📘 Lesson 04.04: Phạm vi của Biến (Scope)

---

## 1. Khái niệm & Vấn đề

Khi chương trình bắt đầu phình to với hàng chục hàm khác nhau, các biến trùng tên bắt đầu xuất hiện. Ví dụ: bạn khai báo một biến `x` trong hàm tính toán A, và một biến khác cũng tên là `x` trong hàm B. 

Nếu các hàm này có thể tự ý sửa đổi biến của nhau mà không có ranh giới bảo vệ, chương trình sẽ rơi vào trạng thái xung đột dữ liệu hỗn loạn. Để ngăn chặn điều này, Python áp dụng cơ chế **Phạm vi của Biến (Variable Scope)**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Local Variable (Biến cục bộ)** | Biến được khai báo **bên trong** một hàm. Chỉ có thể truy cập và sử dụng trong nội bộ hàm đó. | Giống như **chìa khóa phòng của bạn**. Nó chỉ có tác dụng mở cửa phòng của bạn, không thể dùng để mở cửa phòng nhà hàng xóm. |
| **Global Variable (Biến toàn cục)** | Biến được khai báo ở **luồng chính** ngoài cùng của chương trình. Có thể được đọc từ bất kỳ đâu. | Giống như **bóng đèn ngoài đường phố**. Mọi người ở mọi ngôi nhà xung quanh đều có thể nhìn thấy ánh sáng của nó. |

---

## 2. Cú pháp & Vận hành

```python
x = 100 # Biến toàn cục (Global)

def my_func():
    y = 5 # Biến cục bộ (Local)
    print(f"Bên trong hàm: x = {x}, y = {y}")

my_func()
print(f"Bên ngoài hàm: x = {x}")
# print(y) # Lệnh này sẽ lỗi NameError vì y chỉ tồn tại trong hàm!
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến Global | Trạng thái biến Local của hàm | Hành động của máy tính |
|:---:|:---|:---|:---|:---|
| 1 | `x = 100` | `x: 100` | Chưa có | Tạo biến toàn cục `x` |
| 3-5 | `def my_func(): ...` | `x: 100` | Chưa có | Đăng ký hàm |
| 7 | `my_func()` | `x: 100` | `y: 5` (sinh ra khi gọi hàm) | Nhập vào hàm, in ra giá trị `x` và `y` thành công |
| 8 | `print(x)` | `x: 100` | Đã bị hủy | Đọc biến toàn cục `x` ngoài hàm thành công |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi sửa đổi biến toàn cục từ trong hàm:**
> Mặc dù hàm có thể **đọc** giá trị biến toàn cục, nhưng nếu hàm cố tình **sửa đổi** giá trị của nó mà không khai báo, Python sẽ tự hiểu đó là tạo ra biến cục bộ mới trùng tên, hoặc báo lỗi `UnboundLocalError`.
> 
> *Ví dụ sửa đổi không đúng:*
> ```python
> count = 0
> def update():
>     count += 1 # Lỗi UnboundLocalError: local variable 'count' referenced before assignment
> ```
> 
> *Giải pháp (sử dụng từ khóa `global`):*
> ```python
> count = 0
> def update():
>     global count # Khai báo muốn dùng biến toàn cục gốc
>     count += 1
> ```
> *Mẹo tối ưu:* Hạn chế tối đa việc sử dụng từ khóa `global`. Cách tốt nhất là truyền biến vào hàm như đối số và nhận lại giá trị qua `return`.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Một biến được khai báo bên trong một hàm (biến cục bộ) sẽ thế nào sau khi hàm đó thực thi xong và thoát ra ngoài?
* [ ] Biến đó trở thành biến toàn cục.
* [ ] Biến đó vẫn giữ nguyên giá trị trong bộ nhớ để các hàm khác gọi lại.
* [x] Biến đó bị giải phóng (hủy bỏ) khỏi bộ nhớ và không thể truy cập được nữa.
* [ ] Biến đó tự động nhân đôi giá trị.

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn cập nhật giá trị của biến toàn cục `points` tăng thêm 10 sau khi chơi một màn game, nhưng đang gặp lỗi `UnboundLocalError`. Hãy sửa lại hàm:
```python
points = 50

def play_game():
    points = points + 10
    print(f"Điểm trong màn: {points}")

play_game()
print(f"Điểm tổng: {points}")
```

### Bài tập lập trình (Mini-task)
Khai báo biến toàn cục `status = "OFF"`. Hãy định nghĩa hàm `turn_on()` sử dụng từ khóa `global` để thay đổi giá trị của biến `status` thành `"ON"`. Hãy gọi hàm này và in ra màn hình biến `status` sau khi gọi để kiểm tra.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🏠 **Biến cục bộ (Local)** chỉ sống bên trong hàm và bị hủy khi hàm chạy xong.
* 🌍 **Biến toàn cục (Global)** sống suốt chương trình, hàm có thể đọc nhưng không được sửa trực tiếp.
* 🔑 Dùng từ khóa **`global`** trong hàm nếu bắt buộc phải thay đổi giá trị biến toàn cục.

Trong bài học tiếp theo **[LS-04.05: Nhận diện Ngoại lệ (Exceptions)]**, chúng ta sẽ chuyển sang một chương mới cực kỳ quan trọng: quản lý và phòng tránh các lỗi phát sinh làm sập chương trình khi đang chạy.
