---
lessonId: "CPP-04.04"
title: "Phạm vi biến (Scope), Vòng đời (Lifetime) và Nạp chồng hàm (Function Overloading)"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["scope", "lifetime", "overloading", "shadowing", "global", "local"]
prerequisites: ["CPP-04.03"]
---

## 1. Khái niệm & Vấn đề

Trong một dự án C++ lớn với hàng trăm hàm, việc quản lý **sự tồn tại của các biến** và **cách đặt tên hàm** là yếu tố quyết định mã nguồn có trong sạch hay không:
1. **Phạm vi (Scope) & Vòng đời (Lifetime):** Biến sinh ra ở đâu và khi nào thì bị hủy khỏi bộ nhớ RAM? Biến khai báo trong hàm này thì hàm khác có nhìn thấy được không?
2. **Nạp chồng hàm (Function Overloading):** Nếu chúng ta cần viết một hàm tính tổng cho 2 số nguyên, 1 hàm tính tổng cho 2 số thực, và 1 hàm tính tổng cho 3 số nguyên, liệu ta có phải đặt 3 cái tên xấu xí như `tinhTongInt`, `tinhTongDouble`, `tinhTong3So`? 
   C++ cung cấp tính năng **Nạp chồng hàm**, cho phép nhiều hàm **dùng chung một tên duy nhất**, miễn là danh sách tham số của chúng khác nhau!

| Thuật ngữ | Khái niệm cốt lõi | Ý nghĩa thực tế |
| :--- | :--- | :--- |
| **Biến Cục bộ (Local Variable)** | Khai báo bên trong cặp ngoặc nhọn `{}`. | Chỉ tồn tại và sống trong khối `{}` đó; ra ngoài sẽ lập tức bị giải phóng. |
| **Biến Toàn cục (Global Variable)** | Khai báo bên ngoài mọi hàm. | Sống suốt vòng đời chương trình; hàm nào cũng có thể truy cập và sửa đổi. |
| **Che bóng biến (Variable Shadowing)** | Biến cục bộ đặt trùng tên với biến toàn cục. | Biến cục bộ sẽ che khuất biến toàn cục bên trong phạm vi của nó. |
| **Nạp chồng hàm (Overloading)** | Các hàm cùng tên nhưng khác kiểu dữ liệu hoặc số lượng tham số. | Trình biên dịch tự động nhận diện hàm cần gọi dựa trên kiểu đối số truyền vào. |

---

## 2. Cú pháp & Vận hành

### 2.1. Phạm vi biến (Scope) và Toán tử phân giải phạm vi `::`
```cpp
#include <iostream>

int diem = 100; // BIẾN TOÀN CỤC (Global Scope)

int main() {
    int diem = 50; // BIẾN CỤC BỘ che bóng biến toàn cục (Shadowing)

    std::cout << "Diem cuc bo:   " << diem << '\n';   // In ra 50
    std::cout << "Diem toan cuc: " << ::diem << '\n'; // Toán tử :: truy xuất biến toàn cục (In ra 100)

    {
        int bienTrongNgoac = 999;
        std::cout << "Trong khoi block: " << bienTrongNgoac << '\n';
    } // bienTrongNgoac BỊ HỦY KHỎI RAM NGAY TẠI ĐÂY!

    // std::cout << bienTrongNgoac; // LỖI BIÊN DỊCH!
    return 0;
}
```

### 2.2. Kỹ thuật Nạp chồng hàm (Function Overloading)
Trình biên dịch C++ phân biệt các hàm nạp chồng dựa trên **Chữ ký hàm (Function Signature)** gồm: **Tên hàm + Danh sách kiểu tham số**:

```cpp
#include <iostream>

// 1. Tính tổng 2 số nguyên
int tinhTong(int a, int b) {
    return a + b;
}

// 2. Tính tổng 2 số thực (Cùng tên tinhTong nhưng tham số là double)
double tinhTong(double a, double b) {
    return a + b;
}

// 3. Tính tổng 3 số nguyên (Cùng tên tinhTong nhưng có 3 tham số)
int tinhTong(int a, int b, int c) {
    return a + b + c;
}

int main() {
    std::cout << tinhTong(3, 5) << '\n';         // Tự động gọi hàm (1) -> in 8
    std::cout << tinhTong(2.5, 4.2) << '\n';     // Tự động gọi hàm (2) -> in 6.7
    std::cout << tinhTong(1, 2, 3) << '\n';      // Tự động gọi hàm (3) -> in 6
    return 0;
}
```

### 2.3. Cơ chế Name Mangling của Compiler C++
Tại sao C++ làm được điều này mà ngôn ngữ C cổ điển thì không?
Ở cấp độ mã máy, Compiler C++ thực hiện kỹ thuật mã hóa tên hàm gọi là **Name Mangling**. Ví dụ hàm `tinhTong(int, int)` sẽ được đổi tên nội bộ thành `_Z8tinhTongii`, còn `tinhTong(double, double)` thành `_Z8tinhTongdd`. Vì vậy với CPU, chúng vẫn là các hàm hoàn toàn khác nhau!

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy cần tránh:**
> 1. **Nạp chồng chỉ khác nhau mỗi Kiểu trả về (Return Type):**
>    ```cpp
>    int layGiaTri();
>    double layGiaTri(); // LỖI BIÊN DỊCH: ambiguous / conflicting declaration!
>    ```
>    C++ **KHÔNG CHO PHÉP** nạp chồng nếu hai hàm có cùng tên và cùng danh sách tham số nhưng chỉ khác mỗi kiểu trả về.
> 2. **Lạm dụng Biến toàn cục (Global Variable Anti-pattern):**
>    Biến toàn cục làm mất tính độc lập của hàm, khiến bất kỳ hàm nào cũng có thể sửa lén dữ liệu của nhau, gây ra các lỗi ẩn cực kỳ khó dò tìm. **Quy chuẩn Clean Code:** Hạn chế tối đa biến toàn cục.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Điều kiện nào sau đây là **BẮT BUỘC** để hai hàm có thể nạp chồng (Overloading) được với nhau trong C++?
* [ ] A) Chúng phải có kiểu trả về khác nhau.
* [x] B) Chúng phải có cùng tên nhưng danh sách tham số phải khác nhau (khác số lượng hoặc khác kiểu dữ liệu).
* [ ] C) Chúng phải được viết trong hai file khác nhau.
* [ ] D) Chúng phải được đánh dấu bằng từ khóa `virtual`.

---

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây bị lỗi biên dịch vì vi phạm quy tắc nạp chồng hàm. Hãy chỉ ra lỗi:

```cpp
// Code lỗi:
#include <iostream>

int layDiem(int id) {
    return id * 10;
}

double layDiem(int id) { // LỖI BIÊN DỊCH!
    return id * 10.5;
}
```

**Giải thích:** Hai hàm trên có tên giống nhau và cùng nhận 1 tham số kiểu `int id`, chỉ khác kiểu trả về `int` và `double`. Compiler không thể xác định cần gọi hàm nào khi người dùng viết `layDiem(5);`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết 2 hàm nạp chồng có tên `timMax`:
1. `int timMax(int a, int b)`: Trả về số lớn nhất giữa 2 số nguyên.
2. `double timMax(double a, double b, double c)`: Trả về số lớn nhất giữa 3 số thực.

Trong hàm `main()`, kiểm tra cả 2 hàm với dữ liệu nhập từ bàn phím.

**Ví dụ:**
* Đầu vào:
  ```text
  15 28
  3.5 9.2 1.8
  ```
* Đầu ra:
  ```text
  Max 2 so: 28
  Max 3 so: 9.2
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int timMax(int a, int b) {
    return (a > b) ? a : b;
}

double timMax(double a, double b, double c) {
    double m = a;
    if (b > m) m = b;
    if (c > m) m = c;
    return m;
}

int main() {
    int x = 0, y = 0;
    double d1 = 0, d2 = 0, d3 = 0;

    if (std::cin >> x >> y >> d1 >> d2 >> d3) {
        std::cout << "Max 2 so: " << timMax(x, y) << '\n';
        std::cout << "Max 3 so: " << timMax(d1, d2, d3) << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* **Biến cục bộ** chỉ sống trong cặp ngoặc nhọn `{}` khai báo nó; **Biến toàn cục** sống suốt vòng đời ứng dụng nhưng cần hạn chế tối đa.
* **Nạp chồng hàm (Function Overloading)** cho phép các hàm có cùng tên chia sẻ cùng một ý niệm xử lý, giúp mã nguồn tự nhiên và trực quan.
* Nạp chồng bắt buộc phải khác biệt về danh sách tham số; không thể nạp chồng nếu chỉ khác nhau kiểu trả về.

Trong bài học tiếp theo **[Bài 4.5: Nhập môn Đệ quy (Recursion) và Nguy cơ Tràn ngăn xếp (Stack Overflow)]**, chúng ta sẽ chinh phục một trong những kỹ thuật tư duy lập trình kỳ ảo nhất: Hàm tự gọi lại chính mình.
