---
lessonId: "CPP-02.01"
title: "Biểu thức Logic, Toán tử So sánh và Cơ chế Đoản mạch (Short-circuit)"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["logic", "boolean", "short-circuit", "relational operators", "and", "or", "not"]
prerequisites: ["CPP-01.05"]
---

## 1. Khái niệm & Vấn đề

Trong cuộc sống cũng như trong phần mềm, chúng ta luôn phải đưa ra các quyết định dựa trên điều kiện: *"Nếu trời mưa VÀ tôi không có ô thì tôi sẽ ở nhà"*, *"Nếu tài khoản đủ tiền HOẶC thẻ tín dụng còn hạn mức thì giao dịch thành công"*. 

Để máy tính có thể đánh giá tính Đúng (`true`) hoặc Sai (`false`) của một sự kiện, C++ cung cấp hệ thống **Toán tử Quan hệ (Relational Operators)** và **Toán tử Logic (Logical Operators)**. Đặc biệt, C++ sở hữu cơ chế tối ưu hóa cực kỳ thông minh gọi là **Đoản mạch (Short-circuit Evaluation)** giúp chương trình chạy nhanh hơn và tránh được những cú sập phần mềm nghiêm trọng.

| Thuật ngữ | Ký hiệu trong C++ | Ý nghĩa toán học | Phép ẩn dụ thực tế |
| :--- | :--- | :--- | :--- |
| **So sánh bằng** | `==` | So sánh 2 vế có bằng nhau không | Chiếc cân đĩa thăng bằng (khác hoàn toàn dấu `=` gán giá trị). |
| **So sánh khác** | `!=` | Khác nhau | Hai người mang hai màu áo hoàn toàn khác nhau. |
| **Lớn hơn / Nhỏ hơn** | `>`, `<`, `>=`, `<=` | So sánh thứ tự số học | Thước đo chiều cao: ai cao hơn, ai thấp hơn. |
| **Toán tử VÀ (AND)** | `&&` | Đúng khi **TẤT CẢ** điều kiện đều đúng | Ổ khóa 2 chìa: phải cắm đủ cả 2 chìa khóa mới mở được két sắt. |
| **Toán tử HOẶC (OR)** | `||` | Đúng khi **ÍT NHẤT 1** điều kiện đúng | Cửa phòng có 2 lối vào: chỉ cần 1 trong 2 cửa mở là vào được. |
| **Toán tử PHỦ ĐỊNH (NOT)** | `!` | Đảo ngược: Đúng thành Sai, Sai thành Đúng | Chiếc công tắc đảo chiều: bật thành tắt, tắt thành bật. |
| **Cơ chế Đoản mạch** | *Short-circuit* | Dừng kiểm tra nếu kết quả đã ngã ngũ | Cầu chì tự ngắt khi gặp sự cố mà không cần truyền tải tiếp. |

---

## 2. Cú pháp & Vận hành

### 2.1. Cú pháp cơ bản của Biểu thức Logic
Biểu thức logic trong C++ trả về kiểu `bool` với giá trị `true` (quy ước là 1) hoặc `false` (quy ước là 0):

```cpp
#include <iostream>

int main() {
    int tuoi = 20;
    bool coVe = true;

    // Biểu thức VÀ (AND): Cả hai vế đều phải đúng
    bool duocVaoCong = (tuoi >= 18) && coVe;

    std::cout << "Ket qua duoc vao cong: " << duocVaoCong << '\n'; // In ra 1 (true)
    return 0;
}
```

### 2.2. Cơ chế Đoản mạch (Short-circuit Evaluation) - Tấm khiên bảo vệ hệ thống
Khi tính toán biểu thức logic từ trái qua phải:
* **Với phép `&&`:** Nếu vế bên trái là `false`, C++ **lập tức dừng lại** và kết luận cả biểu thức là `false`, bỏ qua hoàn toàn vế bên phải!
* **Với phép `||`:** Nếu vế bên trái là `true`, C++ **lập tức dừng lại** và kết luận cả biểu thức là `true`, không thèm tính vế bên phải!

**Ứng dụng thực tế sống còn: Tránh lỗi chia cho 0 (Divide-by-zero Crash)**
```cpp
int a = 10;
int b = 0;

// AN TOÀN TUYỆT ĐỐI nhờ Short-circuit:
// Vì b != 0 là false, máy tính DỪNG NGAY LẬP TỨC, không bao giờ chạy (a / b > 2)
if (b != 0 && (a / b > 2)) {
    std::cout << "Phep tinh hop le!" << '\n';
} else {
    std::cout << "Mau so bang 0, da chan crash an toan!" << '\n';
}
```

### 2.3. Bảng Chân trị (Truth Table) và Thứ tự Ưu tiên

| Biểu thức A | Biểu thức B | `A && B` | `A || B` | `!A` |
| :---: | :---: | :---: | :---: | :---: |
| `true` | `true` | `true` | `true` | `false` |
| `true` | `false` | `false` | `true` | `false` |
| `false` | `true` | `false` | `true` | `true` |
| `false` | `false` | `false` | `false` | `true` |

* **Thứ tự ưu tiên:** Toán tử Phủ định `!` được ưu tiên cao nhất ➔ Tiếp theo là các phép so sánh (`>`, `<`, `==`, `!=`) ➔ Sau đó đến `&&` ➔ Cuối cùng là `||`.
* **Khuyến nghị Clean Code:** Luôn dùng cặp ngoặc đơn `( )` để gom nhóm biểu thức logic, giúp người đọc không cần phải ghi nhớ bảng ưu tiên phức tạp.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy logic nghiêm trọng:**
> 1. **Gõ nhầm toán tử so sánh `==` thành toán tử gán `=`:**
>    ```cpp
>    int x = 0;
>    if (x = 5) { // NGUY HIỂM: Gán 5 cho x, kết quả biểu thức là 5 (khác 0 -> luôn true!)
>        std::cout << "Cau lenh nay luon chay!";
>    }
>    ```
>    *Cách phòng ngừa (Yoda Conditions):* Một số lập trình viên viết `if (5 == x)`. Nếu bạn vô tình gõ `if (5 = x)`, compiler sẽ báo lỗi ngay lập tức vì không thể gán giá trị cho hằng số 5!
> 2. **Viết điều kiện kẹp kiểu toán học `10 < x < 20`:**
>    Trong toán học ta viết `10 < x < 20`, nhưng trong C++ máy tính sẽ tính `(10 < x)` trước ra `true` (1) hoặc `false` (0), sau đó đem số 0 hoặc 1 so sánh tiếp `< 20` khiến biểu thức LUÔN LUÔN ĐÚNG!
>    *Cách viết chuẩn C++:* `if (x > 10 && x < 20)`.

> [!TIP]
> **Tối ưu hóa hiệu năng biểu thức:**
> Đặt điều kiện có khả năng `false` cao nhất lên đầu tiên trong chuỗi phép `&&`. Đặt điều kiện có khả năng `true` cao nhất lên đầu tiên trong chuỗi phép `||`. Cơ chế đoản mạch sẽ giúp chương trình bỏ qua phần lớn các phép so sánh phía sau.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Quan sát đoạn mã sau, giá trị của biến `x` sau khi chạy xong là bao nhiêu?
```cpp
int x = 5;
int y = 10;
if (y > 5 || ++x > 5) {
    // Thao tac
}
```
* [x] A) `x = 5` (Vì `y > 5` đã là `true`, cơ chế đoản mạch bỏ qua `++x`)
* [ ] B) `x = 6`
* [ ] C) `x = 10`
* [ ] D) Lỗi biên dịch

*(Giải thích: Trong phép toán `||`, vế trái `y > 5` là đúng nên toàn bộ vế phải `++x > 5` không được thực thi. Biến `x` giữ nguyên giá trị 5).*

---

### Thử thách sửa lỗi (Debug)
Đoạn code kiểm tra xem một điểm có nằm trong khoảng từ 0 đến 100 hay không nhưng luôn cho kết quả sai:

```cpp
// Code lỗi:
#include <iostream>

int main() {
    int diem = 150;
    if (0 <= diem <= 100) {
        std::cout << "Diem hop le!" << '\n';
    }
    return 0;
}
```

**Cách sửa đúng:**
```cpp
#include <iostream>

int main() {
    int diem = 150;
    if (diem >= 0 && diem <= 100) {
        std::cout << "Diem hop le!" << '\n';
    } else {
        std::cout << "Diem khong hop le!" << '\n';
    }
    return 0;
}
```

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình nhận vào một số nguyên `n` từ bàn phím. Hãy kiểm tra xem `n` có đồng thời thỏa mãn 2 điều kiện: là **số nguyên dương** VÀ là **số chẵn** hay không.
* Nếu đúng, in ra màn hình: `Hop le`
* Nếu sai, in ra màn hình: `Khong hop le`

**Ví dụ:**
* Đầu vào: `12` ➔ Đầu ra: `Hop le`
* Đầu vào: `-4` ➔ Đầu ra: `Khong hop le` (Vì là số âm)
* Đầu vào: `7` ➔ Đầu ra: `Khong hop le` (Vì là số lẻ)

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    int n = 0;
    if (std::cin >> n) {
        if (n > 0 && n % 2 == 0) {
            std::cout << "Hop le" << '\n';
        } else {
            std::cout << "Khong hop le" << '\n';
        }
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Toán tử so sánh `==` kiểm tra bằng nhau; tuyệt đối không nhầm lẫn với toán tử gán `=`.
* Cơ chế đoản mạch **Short-circuit** dừng đánh giá biểu thức ngay khi kết quả đã được khẳng định; đây là lá chắn hoàn hảo để chặn lỗi chia cho 0 và truy cập bộ nhớ bất hợp pháp.
* Không được viết điều kiện kẹp `a < x < b` mà phải tách thành `x > a && x < b`.

Trong bài học tiếp theo **[Bài 2.2: Cấu trúc if, if-else và if - else if - else bậc thang]**, chúng ta sẽ ứng dụng biểu thức logic để phân chia nhánh luồng chương trình, giải quyết các bài toán xếp loại học lực và phân loại đa điều kiện.
