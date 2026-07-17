---
lessonId: "LS-04.03"
title: "Trả về kết quả (Return)"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["return", "return value", "function output", "none"]
prerequisites: ["LS-04.02"]
---

# 📘 Lesson 04.03: Trả về kết quả (Return)

---

## 1. Khái niệm & Vấn đề

Khi viết một hàm tính toán diện tích hình tròn, nếu ta chỉ in kết quả ra màn hình bằng lệnh `print()`, chương trình chính sẽ không thể sử dụng kết quả đó để tính toán tiếp (ví dụ: nhân với đơn giá đất để ra tổng tiền). Kết quả chỉ hiện lên màn hình rồi biến mất khỏi bộ nhớ của máy tính.

Để chuyển kết quả tính toán từ bên trong hàm ra ngoài chương trình chính, ta phải sử dụng lệnh **`return`**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Return (Trả về)** | Câu lệnh dừng thực thi hàm và gửi trả lại một giá trị từ hàm về nơi gọi nó. | Giống như việc bạn **đưa tiền cho shipper đi mua đồ**. Shipper đi mua (chạy hàm) rồi quay về giao hàng tận tay cho bạn (lệnh return). |

---

## 2. Cú pháp & Vận hành

Để trả về giá trị, ta dùng từ khóa `return` kèm theo giá trị hoặc biến chứa kết quả cần chuyển ra ngoài:

```python
def multiply(a, b):
    result = a * b
    return result

# Nhận giá trị trả về và lưu vào biến
output = multiply(3, 4)
print(output) # In ra: 12
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1-3 | `def multiply(a, b): ...` | Đăng ký hàm | Chưa thực thi |
| 6 | `multiply(3, 4)` | `a: 3, b: 4` | Tính `result = 12` |
| 3 | `return result` | Thoát hàm | Đưa giá trị `12` ra ngoài và gán cho biến `output` |
| 7 | `print(output)` | `output: 12` | Hiển thị `12` lên màn hình |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Nhầm lẫn giữa `print` và `return`:**
> `print()` chỉ hiển thị dữ liệu lên màn hình cho con người đọc. Nó **không** trả về giá trị cho biến. Nếu một hàm không có lệnh `return` mà bạn vẫn gán kết quả của nó vào một biến, biến đó sẽ mang giá trị rỗng **`None`**.
> *Ví dụ:*
> ```python
> def add(a, b):
>     print(a + b) # Chỉ in, không return
> 
> result = add(2, 3) # result sẽ nhận giá trị None
> print(result) # In ra: None
> ```
>
> **Lệnh `return` kết thúc hàm lập tức:**
> Bất kỳ dòng lệnh nào đứng sau lệnh `return` bên trong cùng một khối lệnh của hàm đều sẽ không bao giờ được thực thi (được gọi là dead code).

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Điều gì xảy ra khi chương trình gặp lệnh `return` bên trong một hàm?
* [ ] Hàm tiếp tục thực thi các dòng lệnh bên dưới lệnh return.
* [x] Hàm lập tức dừng hoạt động và gửi trả lại giá trị phía sau return về nơi gọi.
* [ ] Chương trình chính bị dừng hoạt động hoàn toàn.
* [ ] Giá trị của biến toàn cục bị xóa bỏ.

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn tính bình phương của một số và gán kết quả đó vào biến `x` để tiếp tục cộng thêm `10`. Tuy nhiên kết quả in ra màn hình bị lỗi `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`. Hãy sửa lại hàm:
```python
def square(n):
    result = n * n
    print(result)

# Đoạn code lỗi:
x = square(5)
print(x + 10)
```

### Bài tập lập trình (Mini-task)
Định nghĩa một hàm tên là `double_number` nhận vào một tham số `n`. Hàm sẽ nhân đôi giá trị `n` và trả về kết quả đó bằng lệnh `return`. Sau đó hãy gọi hàm này với giá trị truyền vào là `10`, lưu kết quả vào biến `res` rồi in ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🎁 **`return`** gửi kết quả tính toán từ trong hàm ra ngoài chương trình chính.
* 🛑 Lệnh `return` kết thúc hoạt động của hàm ngay lập tức khi được kích hoạt.
* 🚫 Nếu một hàm không có từ khóa `return`, giá trị mặc định trả về là **`None`**.

Trong bài học tiếp theo **[LS-04.04: Phạm vi của Biến (Scope)]**, chúng ta sẽ học về ranh giới kiểm soát biến: tại sao biến khai báo trong hàm không thể gọi được ở ngoài hàm và ngược lại.
