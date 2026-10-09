---
lessonId: "LS-03.04"
title: "Lesson 3.4: Vòng lặp while và điều kiện dừng"
difficulty: "EASY"
estimatedDuration: 35
prerequisites: ["LS-03.03"]
---

# Lesson 3.4: Vòng lặp while và điều kiện dừng

## Mục tiêu

* Hiểu rõ bản chất vòng lặp `while`: Vòng lặp kiểm soát bằng điều kiện (Condition-controlled loop).
* Nắm vững **Bảng phân loại vàng**: Biết chính xác khi nào nên dùng `for` và khi nào bắt buộc dùng `while`.
* Thiết kế được **điều kiện dừng** chính xác và kiểm soát sự thay đổi của biến điều kiện.
* Xử lý thành thạo mẫu bài toán **Giá trị lính canh (Sentinel value)**: Lặp nhập dữ liệu cho đến khi gặp tín hiệu dừng (nhập số 0, nhập chữ 'quit').
* Nhận diện và thuần thục cách giải cứu chương trình khi vô tình rơi vào vòng lặp vô hạn.

## Kiến thức chính

Vòng lặp `while` trong tiếng Anh có nghĩa là *"trong khi"*. Cú pháp của nó hoạt động như sau:
> *"Trong khi điều kiện này vẫn còn ĐÚNG (`True`), hãy tiếp tục lặp lại các công việc bên trong!"*

```python
while <điều_kiện>:
    # Khối lệnh được lặp lại
```

### Bảng phân loại vàng: So sánh FOR và WHILE

![Infographic so sánh vòng lặp FOR vs WHILE](/images/lessons/module3/for_vs_while.svg)

| Tiêu chí | Vòng lặp `for` | Vòng lặp `while` |
| :--- | :--- | :--- |
| **Bản chất** | Kiểm soát theo **số lượt biết trước**. | Kiểm soát theo **trạng thái điều kiện**. |
| **Khi nào sử dụng?** | Khi đã biết chắc chắn số lần lặp (ví dụ: lặp $N$ lần, duyệt qua 10 phần tử). | Khi **chưa biết trước** sẽ lặp bao nhiêu lần, chỉ biết điều kiện để tiếp tục hoặc dừng. |
| **Cập nhật biến** | **Tự động** tăng/giảm theo hàm `range()`. | **Lập trình viên phải tự cập nhật** biến điều kiện bằng tay bên trong thân vòng lặp. |
| **Nguy cơ lỗi vô hạn**| Rất hiếm khi xảy ra. | Rất dễ xảy ra nếu quên cập nhật biến điều kiện. |
| **Ví dụ điển hình** | In các số từ 1 đến 100, tính tổng dãy số. | Nhập mật khẩu đến khi nào đúng thì thôi; chơi game đến khi hết mạng. |

## Hiểu

### 1. Ẩn dụ thực tế: Cục pin điện thoại và Trò chơi điện tử

* **Cục pin điện thoại cắm sạc:**
  * Bạn cắm sạc điện thoại trước khi đi ngủ. Bạn có biết trước chính xác điện thoại sẽ nhận bao nhiêu xung điện không? Không!
  * Nguyên lý của củ sạc rất đơn giản: *"Trong khi pin < 100%, tiếp tục nạp điện"*. Ngay khi `pin == 100%`, củ sạc tự ngắt điện. Đó chính là vòng lặp `while`!
* **Trò chơi đối kháng:**
  * *"Trong khi máu nhân vật > 0, trò chơi tiếp tục diễn ra"*. Ngay khi `mau <= 0`, vòng lặp kết thúc và màn hình hiện chữ `"GAME OVER"`.

### 2. Sơ đồ cơ chế kiểm tra trước (Pre-check) của `while`

```text
                     [BẮT ĐẦU VÒNG LẶP]
                             │
                             ▼
               ┌──► <Điều kiện còn ĐÚNG?> ──(SAI: False)──► [KẾT THÚC VÒNG LẶP]
               │             │
               │          (ĐÚNG: True)
               │             ▼
               │   [Thực hiện thân lệnh]
               │             │
               │             ▼
               └── [Cập nhật biến điều kiện]
```

> [!NOTE]
> **Cơ chế kiểm tra trước (Pre-test)**: Vòng lặp `while` luôn kiểm tra điều kiện **ngay tại cửa ra vào**. Nếu điều kiện bị SAI (`False`) ngay từ lần đầu tiên, các câu lệnh bên trong thân vòng lặp sẽ **không bao giờ được chạy dù chỉ một lần**.

## Làm theo

### Ví dụ 1: Đếm ngược từ N về 1 bằng `while`

```python
n = int(input())

# Biến n đóng vai trò là biến điều kiện
while n >= 1:
    print(n)
    n -= 1  # Cực kỳ quan trọng: giảm n để tiến dần về 0

print("Hết giờ!")
```

### Bảng theo dõi thực thi khi nhập `n = 3`:

| Lượt lặp | Giá trị `n` đầu lượt | Kiểm tra `n >= 1` | In ra màn hình | Cập nhật `n -= 1` | Trạng thái sau cập nhật |
| :---: | :---: | :---: | :--- | :---: | :--- |
| **Lượt 1** | `3` | `3 >= 1` ➔ **ĐÚNG** | `3` | `3 - 1` | `n = 2` |
| **Lượt 2** | `2` | `2 >= 1` ➔ **ĐÚNG** | `2` | `2 - 1` | `n = 1` |
| **Lượt 3** | `1` | `1 >= 1` ➔ **ĐÚNG** | `1` | `1 - 1` | `n = 0` |
| **Kiểm tra cuối**| `0` | `0 >= 1` ➔ **SAI** | *(Dừng lặp)* | — | Thoát ra ngoài! |

### Ví dụ 2: Giá trị lính canh - Nhập số liên tiếp, gặp 0 thì dừng

Đây là bài toán kinh điển: Chương trình liên tục yêu cầu người dùng nhập số, tính tổng các số đã nhập và chỉ dừng lại khi người dùng gõ số `0`:

```python
tong = 0

# Nhập số đầu tiên trước khi vào vòng lặp
so = int(input())

# Vòng lặp chạy chừng nào số vừa nhập khác 0
while so != 0:
    tong += so
    # Nhập số tiếp theo cho lượt lặp sau
    so = int(input())

print("Tổng các số vừa nhập là:", tong)
```

> [!TIP]
> **Mẹo ghi nhớ cấu trúc lính canh**: Ta nhập 1 lần **trước** vòng lặp (để có giá trị ban đầu kiểm tra điều kiện), và nhập lại ở **cuối** thân vòng lặp (để cập nhật giá trị cho lượt kiểm tra tiếp theo).

## Tự làm & Phòng chống lỗi vô hạn

### 3 nguyên nhân gây ra Vòng lặp vô hạn (Infinite Loop):

```python
# LỖI 1: Quên cập nhật biến điều kiện
i = 1
while i <= 5:
    print(i)
    # Quên mất dòng i += 1 --> i mãi mãi bằng 1!

# LỖI 2: Cập nhật nhầm hướng (đi xa khỏi điểm dừng)
i = 5
while i >= 1:
    print(i)
    i += 1  # Lẽ ra phải giảm thì lại tăng --> i ngày càng lớn!

# LỖI 3: Điều kiện dừng "bước hụt" (nhảy vọt qua điểm dừng)
i = 1
while i != 10:
    print(i)
    i += 2  # i sẽ nhận các giá trị: 1, 3, 5, 7, 9, 11... không bao giờ chạm đúng 10!
```

> [!WARNING]
> **Phím tắt cứu nguy**: Nếu vô tình chạy một đoạn code bị lặp vô hạn và terminal chạy liên tục không ngừng, hãy bấm tổ hợp phím **`Ctrl + C`** trên bàn phím để cưỡng chế dừng chương trình ngay lập tức!

### Thử thách tư duy:
1. Đoạn code sau sẽ in ra những gì?
   ```python
   x = 10
   while x < 5:
       print("Xin chào")
   ```
   *(Gợi ý: Hãy chú ý điều kiện ngay ở lượt đầu tiên).*
2. Hãy viết lại bài toán tính tổng từ 1 đến $N$ bằng vòng lặp `while`.

## Vận dụng

Vòng lặp `while` xuất hiện ở trung tâm của hầu hết các phần mềm trong đời sống thực tế:
* **Hệ thống bảo mật ngân hàng:** Cho phép người dùng nhập mã PIN sai tối đa 3 lần (`while sai < 3 and chua_dung:`).
* **Game Loop:** Vòng lặp chính của mọi trò chơi điện tử (Unity, Unreal Engine) đều chạy bằng một vòng lặp `while is_running:` liên tục lắng nghe bàn phím của người chơi.
* **Cảm biến IoT:** Cảm biến nhiệt độ trong lò ấp trứng: `while nhiet_do < 37.5: bat_den_suoi()`.

---

### 🚀 Bước tiếp theo

Đôi khi vòng lặp đang chạy êm ả, bỗng nhiên có một sự kiện bất ngờ xảy ra: Ta tìm thấy món đồ cần tìm sớm hơn dự kiến, hoặc gặp phải một dữ liệu rác muốn bỏ qua.

Làm thế nào để ra lệnh cho vòng lặp: *"Dừng lại ngay lập tức!"* hoặc *"Bỏ qua người này, đến người kế tiếp ngay!"*?

Hãy cùng khám phá bộ đôi quyền lực trong **Lesson 3.5: Điều khiển vòng lặp với break và continue**!
