---
lessonId: "LS-04.02"
title: "Tham số và Đối số"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["parameters", "arguments", "positional arguments", "keyword arguments"]
prerequisites: ["LS-04.01"]
---

# 📘 Lesson 04.02: Tham số và Đối số

---

## 1. Khái niệm & Vấn đề

Nếu một hàm chỉ thực hiện các câu lệnh cố định (ví dụ: luôn in ra `"Chào bạn Minh"`), hàm đó sẽ có tính ứng dụng rất hạn chế. Trong thực tế, ta muốn hàm đó có thể chào bất kỳ ai tùy vào tên người dùng truyền vào khi gọi hàm.

Để làm được điều này, hàm cần nhận dữ liệu từ bên ngoài vào lúc chạy. Dữ liệu này được định nghĩa thông qua các **Tham số (Parameters)** và được truyền vào qua các **Đối số (Arguments)**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Parameter (Tham số)** | Các biến được khai báo ở phần định nghĩa hàm (trong dấu ngoặc đơn), đóng vai trò như các "hộp chứa" chờ nhận dữ liệu. | Giống như các **khay trống** trong tủ lạnh được dán nhãn: khay đựng trứng, khay đựng rau. |
| **Argument (Đối số)** | Giá trị thực tế được truyền vào cho tham số khi gọi hàm chạy. | Giống như **quả trứng thực tế** hoặc **cây rau** bạn bỏ vào các khay trống tương ứng đó. |

---

## 2. Cú pháp & Vận hành

```python
# 'name' là tham số (parameter)
def greet(name):
    print(f"Xin chào, {name}!")

# "Alice" và "Bob" là đối số (arguments)
greet("Alice")
greet("Bob")
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến tham số | Kết quả màn hình |
|:---:|:---|:---|:---|
| 1-2 | `def greet(name): ...` | `name` được khai báo | Chưa chạy |
| 5 | `greet("Alice")` | `name` nhận giá trị `"Alice"` | `Xin chào, Alice!` |
| 6 | `greet("Bob")` | `name` nhận giá trị `"Bob"` | `Xin chào, Bob!` |

Python hỗ trợ các cách truyền đối số linh hoạt:
1. **Đối số vị trí (Positional Arguments):** Truyền đối số theo đúng thứ tự khai báo của các tham số.
2. **Đối số từ khóa (Keyword Arguments):** Chỉ rõ tên tham số khi truyền đối số để không phụ thuộc vào thứ tự: `greet(name="Alice")`.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi thiếu đối số (`TypeError`):**
> Nếu hàm định nghĩa yêu cầu truyền 2 tham số, nhưng lúc gọi bạn chỉ truyền vào 1 đối số, Python sẽ báo lỗi `TypeError: missing required positional argument`.
> *Ví dụ:*
> ```python
> def tinh_tong(a, b):
>     print(a + b)
> 
> tinh_tong(5) # Lỗi TypeError: tinh_tong() missing 1 required positional argument: 'b'
> ```
>
> [!TIP]
> **Tham số mặc định (Default Parameters):**
> Ta có thể gán giá trị mặc định cho tham số phòng trường hợp người dùng không truyền đối số vào:
> ```python
> def welcome(name="Học viên"):
>     print(f"Chào mừng {name}")
> 
> welcome() # In ra: Chào mừng Học viên
> ```

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Khẳng định nào sau đây mô tả đúng nhất về sự khác biệt giữa **Tham số (Parameter)** và **Đối số (Argument)**?
* [ ] Tham số là giá trị thực tế truyền vào, đối số là tên biến khai báo trong hàm.
* [x] Tham số là biến khai báo trong định nghĩa hàm, đối số là giá trị thực tế truyền vào khi gọi hàm.
* [ ] Cả hai là cách gọi hoàn toàn giống nhau, không có sự khác biệt.
* [ ] Tham số chỉ nhận dữ liệu chuỗi, đối số chỉ nhận dữ liệu số.

### Thử thách sửa lỗi (Debug)
Đoạn code dưới đây định nghĩa hàm tính tiền sau thuế của sản phẩm với thuế mặc định là `0.1` (10%). Tuy nhiên chương trình đang báo lỗi cú pháp do đặt sai thứ tự tham số mặc định. Hãy sửa lại cho đúng quy tắc của Python (Gợi ý: tham số mặc định phải nằm sau các tham số thông thường):
```python
# Đoạn code lỗi:
def calc_total(tax=0.1, price):
    print(price + (price * tax))

calc_total(100)
```

### Bài tập lập trình (Mini-task)
Định nghĩa một hàm tên là `print_info` nhận vào hai tham số là `name` và `age`. Hàm sẽ in ra màn hình thông báo: `"{name} năm nay {age} tuổi."`. Hãy gọi hàm này với đối số cụ thể.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📥 **Tham số** (Parameter) hoạt động như các biến đại diện bên trong hàm.
* 📤 **Đối số** (Argument) là giá trị cụ thể được gán vào tham số lúc gọi hàm.
* ⚖️ Đảm bảo truyền đúng số lượng đối số tương ứng với số lượng tham số yêu cầu để tránh lỗi `TypeError`.
* 🛡️ Sử dụng **tham số mặc định** ở phía sau danh sách tham số để tăng tính linh động.

Trong bài học tiếp theo **[LS-04.03: Trả về kết quả (Return)]**, chúng ta sẽ học cách đưa kết quả tính toán của hàm ra ngoài chương trình để tiếp tục sử dụng thay vì chỉ in ra màn hình.
