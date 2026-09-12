---
lessonId: "CPP-02.02"
title: "Cấu trúc if, if-else và if - else if - else bậc thang"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["if", "else", "if-else-if", "branching", "conditional", "decision"]
prerequisites: ["CPP-02.01"]
---

## 1. Khái niệm & Vấn đề

Một chương trình chỉ chạy thẳng tuột từ trên xuống dưới sẽ rất đơn điệu và vô dụng trong thực tế. Trong đời thực, chúng ta luôn phải đưa ra các quyết định: *"Nếu đèn xanh thì đi, nếu đèn đỏ thì dừng lại"*; *"Nếu điểm thi từ 8.0 trở lên thì đạt Giỏi, từ 6.5 đến cận 8.0 là Khá, còn lại là Trung bình"*.

Để trao cho máy tính khả năng **ra quyết định thông minh**, ngôn ngữ C++ trang bị bộ 3 cấu trúc rẽ nhánh cơ bản:
1. **`if` đơn:** Quyết định thực hiện một hành động khi điều kiện đúng (nếu sai thì không làm gì).
2. **`if - else` đôi:** Lựa chọn ngã rẽ 1 trong 2: hoặc làm việc A, hoặc làm việc B.
3. **`if - else if - else` bậc thang:** Phân loại nhiều mức giá trị liên tục không chồng chéo.

| Cấu trúc | Số ngã rẽ | Hành vi thực thi | Phép ẩn dụ thực tế |
| :--- | :---: | :--- | :--- |
| **`if`** | 1 | Chỉ chạy khi điều kiện `true`. | Đi ngoài đường, nếu trời mưa thì mặc áo mưa (không mưa thì cứ thế đi). |
| **`if - else`** | 2 | Chọn đúng 1 trong 2 nhánh: nhánh `true` hoặc nhánh `false`. | Cổng soát vé: có vé thì được vào, không có vé thì bị mời ra ngoài. |
| **`if - else if - else`** | N | Kiểm tra tuần tự từ trên xuống dưới; nhánh đầu tiên đúng sẽ chạy và bỏ qua toàn bộ các nhánh còn lại. | Bậc thang phân hạng huy chương: Vàng ➔ Bạc ➔ Đồng ➔ Khuyến khích. |

---

## 2. Cú pháp & Vận hành

### 2.1. Cấu trúc if - else if - else bậc thang
Dưới đây là cú pháp chuẩn mực giải bài toán xếp loại học lực sinh viên:

```cpp
#include <iostream>

int main() {
    double diemTB = 8.2;

    if (diemTB >= 9.0) {
        std::cout << "Xep loai: Xuat sac" << '\n';
    } else if (diemTB >= 8.0) {
        std::cout << "Xep loai: Gioi" << '\n';
    } else if (diemTB >= 6.5) {
        std::cout << "Xep loai: Kha" << '\n';
    } else if (diemTB >= 5.0) {
        std::cout << "Xep loai: Trung binh" << '\n';
    } else {
        std::cout << "Xep loai: Yeu" << '\n';
    }

    return 0;
}
```

### 2.2. Bảng theo dõi thực thi (Execution Trace Table) với `diemTB = 8.2`

| Bước | Biểu thức kiểm tra | Kết quả | Hành động của CPU |
| :---: | :--- | :---: | :--- |
| 1 | `diemTB >= 9.0` | `false` | Bỏ qua khối lệnh Xuất sắc, chuyển sang `else if` tiếp theo. |
| 2 | `diemTB >= 8.0` | **`true`** | **Chạy khối lệnh: In "Xep loai: Gioi"**. |
| 3 | Toàn bộ các nhánh phía dưới | *Bị bỏ qua* | **Nhảy thẳng đến cuối cấu trúc `if`**, kết thúc rẽ nhánh! |

### 2.3. Bẫy tư duy: Các khối `if` độc lập vs Cấu trúc `if - else if`
Rất nhiều học viên mới viết nhầm thành một chuỗi các lệnh `if` rời rạc:

```cpp
// SAI LẦM TAI HẠI:
if (diemTB >= 8.0) std::cout << "Gioi\n";
if (diemTB >= 6.5) std::cout << "Kha\n"; // SẼ BỊ CHẠY TIẾP!
```
Khi `diemTB = 8.5`, vì là 2 lệnh `if` độc lập, màn hình sẽ in ra cả **"Gioi"** lẫn **"Kha"**! Luôn luôn sử dụng `else if` khi các điều kiện có tính chất loại trừ lẫn nhau.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các lỗi cú pháp và logic nguy hiểm:**
> 1. **Dấu chấm phẩy `;` vô duyên ngay sau lệnh `if`:**
>    ```cpp
>    if (a > b); // DẤU CHẤM PHẨY KẾT THÚC LỆNH NGAY TẠI ĐÂY!
>    {
>        std::cout << "a lon hon b"; // Khối lệnh này LUÔN LUÔN ĐƯỢC CHẠY!
>    }
>    ```
> 2. **Quên cặp ngoặc nhọn `{}` cho khối lệnh nhiều dòng:**
>    Nếu không có cặp ngoặc nhọn, chỉ có **duy nhất 1 dòng lệnh đầu tiên** thuộc phạm vi của `if`. Các dòng lệnh tiếp theo sẽ luôn thực thi bất chấp điều kiện.
>    *Quy chuẩn Clean Code Modern C++:* **Luôn luôn đặt ngoặc nhọn `{}`**, kể cả khi thân hàm chỉ có đúng 1 dòng lệnh.

> [!TIP]
> **Sắp xếp thứ tự điều kiện thông minh:**
> Trong bậc thang `if - else if`, hãy sắp xếp các điều kiện xảy ra thường xuyên nhất lên các nhánh đầu tiên để CPU sớm thỏa mãn điều kiện và thoát nhanh, giúp tối ưu chu kỳ máy.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Đoạn mã sau sẽ in ra kết quả gì trên màn hình console?
```cpp
int x = 10;
if (x > 5) {
    std::cout << "A";
} else if (x > 8) {
    std::cout << "B";
} else {
    std::cout << "C";
}
```
* [x] A) `A`
* [ ] B) `AB`
* [ ] C) `B`
* [ ] D) `ABC`

*(Giải thích: Vì điều kiện đầu tiên `x > 5` đã thỏa mãn (`true`), CPU thực thi in 'A' và lập tức nhảy ra khỏi toàn bộ cấu trúc `if - else if`, nhánh `x > 8` không bao giờ được kiểm tra).*

---

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây dùng để tìm số lớn nhất giữa hai số, nhưng kết quả in ra luôn bị sai. Hãy phát hiện lỗi và sửa lại:

```cpp
// Đoạn code lỗi:
#include <iostream>

int main() {
    int a = 5, b = 12;
    int max = a;
    if (b > a);
        max = b;
    std::cout << "Gia tri max: " << max << '\n';
    return 0;
}
```

**Phân tích lỗi & Cách sửa:**
Dòng `if (b > a);` có dấu chấm phẩy `;` ở cuối, làm lệnh `if` kết thúc rỗng. Dòng `max = b;` trở thành lệnh độc lập và luôn chạy.
Sửa lại: Xóa bỏ dấu chấm phẩy sau `if (b > a)` và dùng cặp ngoặc nhọn `{}`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào 3 số thực dương a, b, c đại diện cho độ dài 3 cạnh. Hãy kiểm tra xem 3 cạnh đó có tạo thành một tam giác hay không. Nếu có, hãy phân loại:
* `Tam giac deu`: Nếu 3 cạnh bằng nhau (a = b = c).
* `Tam giac can`: Nếu có ít nhất 2 cạnh bằng nhau.
* `Tam giac vuong`: Nếu thỏa mãn định lý Pytago (a² + b² = c² hoặc a² + c² = b² hoặc b² + c² = a²).
* `Tam giac thuong`: Các trường hợp tam giác hợp lệ còn lại.
* `Khong phai tam giac`: Nếu tổng 2 cạnh bất kỳ không lớn hơn cạnh còn lại.

**Ví dụ:**
* Đầu vào: `3 4 5` ➔ Đầu ra: `Tam giac vuong`
* Đầu vào: `5 5 5` ➔ Đầu ra: `Tam giac deu`
* Đầu vào: `1 2 10` ➔ Đầu ra: `Khong phai tam giac`

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    double a = 0, b = 0, c = 0;
    if (std::cin >> a >> b >> c) {
        // Kiểm tra điều kiện tồn tại tam giác
        if (a + b > c && a + c > b && b + c > a) {
            if (a == b && b == c) {
                std::cout << "Tam giac deu" << '\n';
            } else if (a == b || b == c || a == c) {
                std::cout << "Tam giac can" << '\n';
            } else if (a*a + b*b == c*c || a*a + c*c == b*b || b*b + c*c == a*a) {
                std::cout << "Tam giac vuong" << '\n';
            } else {
                std::cout << "Tam giac thuong" << '\n';
            }
        } else {
            std::cout << "Khong phai tam giac" << '\n';
        }
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Cấu trúc `if - else if - else` chỉ thực thi duy nhất **một** nhánh đầu tiên có điều kiện `true`.
* Tuyệt đối không đặt dấu chấm phẩy `;` ngay sau biểu thức `if (...)`.
* Luôn bao bọc thân lệnh bằng cặp ngoặc nhọn `{}` để giữ mã nguồn an toàn và dễ bảo trì.

Trong bài học tiếp theo **[Bài 2.3: if lồng nhau, Kỹ thuật Early Return và if có khởi tạo (C++17)]**, chúng ta sẽ học cách xử lý các điều kiện đa tầng phức tạp và kỹ thuật viết code Clean Code tránh "thảm họa mũi tên thụt lề".
