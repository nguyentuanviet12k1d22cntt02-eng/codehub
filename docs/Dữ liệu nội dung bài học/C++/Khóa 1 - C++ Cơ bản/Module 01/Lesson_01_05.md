---
lessonId: "CPP-01.05"
title: "Toán tử số học, Toán tử gán và Kỹ thuật Ép kiểu an toàn (static_cast)"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["operators", "arithmetic", "static_cast", "type casting", "modulo", "increment", "decrement"]
prerequisites: ["CPP-01.04"]
---

## 1. Khái niệm & Vấn đề

Máy tính bản chất là một bộ xử lý số học cực mạnh. Để thực hiện các phép tính từ đơn giản như cộng trừ nhân chia đến các phép toán logic phức tạp trong game 3D, chúng ta sử dụng các **Toán tử (Operators)**.

Tuy nhiên, C++ có những quy tắc tính toán rất chặt chẽ và khác biệt so với toán học thông thường. Ví dụ: trong toán học, 5 ÷ 2 = 2.5. Nhưng trong C++, nếu bạn viết `5 / 2`, kết quả máy tính trả về sẽ là **`2`**! Đây là **Bẫy phép chia số nguyên (Integer Division)** khiến vô số người mới học ngơ ngác không hiểu vì sao chương trình của mình tính sai kết quả.

Để xử lý triệt để vấn đề này, C++ cung cấp cơ chế **Ép kiểu an toàn (Type Casting)** với từ khóa chuẩn mực **`static_cast`**.

| Thuật ngữ | Định nghĩa kỹ thuật | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Toán tử số học** | Các ký hiệu đại số: `+`, `-`, `*`, `/`, `%` (chia lấy dư). | Các nút chức năng cơ bản trên bàn phím máy tính Casio bỏ túi. |
| **Chia số nguyên (`/`)** | Phép chia giữa 2 số nguyên, kết quả luôn bị chặt bỏ phần thập phân để giữ lại phần nguyên. | Chia 5 quả cam cho 2 người mà không có dao bổ cam: mỗi người chỉ được đúng 2 quả nguyên, quả lẻ còn lại bị bỏ đi. |
| **Chia lấy dư (`%`)** | Phép toán tìm số dư của phép chia 2 số nguyên (chỉ áp dụng cho số nguyên). | Đếm số chiếc bánh còn sót lại sau khi đã đóng vào các hộp cố định. |
| **Tiền tố (`++i`)** | Tăng biến lên 1 đơn vị **trước khi** giá trị của biến được dùng trong biểu thức. | Nạp tiền vào tài khoản trước rồi mới quẹt thẻ thanh toán đơn hàng. |
| **Hậu tố (`i++`)** | Lấy giá trị hiện tại của biến ra dùng **rồi mới** tăng biến lên 1 đơn vị. | Quẹt thẻ tín dụng mua sắm trước, tháng sau mới trả tiền tăng thêm. |
| **`static_cast<Type>`** | Kỹ thuật ép kiểu tường minh an toàn trong thời gian biên dịch của C++. | Chiếc máy ép khuôn kim loại: biến phôi sắt vuông thành khối sắt tròn có sự kiểm tra an toàn của máy đo. |

---

## 2. Cú pháp & Vận hành

### 2.1. Phép chia nguyên và Kỹ thuật Ép kiểu với `static_cast`
Hãy quan sát sự khác nhau giữa phép chia nguyên và phép chia có ép kiểu:

```cpp
#include <iostream>

int main() {
    int a = 5;
    int b = 2;

    // 1. Chia số nguyên: int / int -> ra kết quả int!
    int kqNguyen = a / b; // = 2 (Phần 0.5 bị chặt bỏ hoàn toàn)

    // 2. Chia số thực: static_cast ép kiểu một toán hạng sang double
    double kqThuc = static_cast<double>(a) / b; // = 2.5 (Chính xác 100%!)

    std::cout << "Chia nguyen: " << kqNguyen << '\n';
    std::cout << "Chia thuc:   " << kqThuc << '\n';

    return 0;
}
```

### 2.2. Toán tử chia lấy dư (`%`) và Ứng dụng thực tế
Toán tử `%` là công cụ đắc lực nhất trong lập trình thuật toán:
* **Kiểm tra chẵn lẻ:** `n % 2 == 0` (Số chẵn), `n % 2 != 0` (Số lẻ).
* **Tách từng chữ số của một số:** `chuSoCuoi = n % 10`.
* **Quy đổi đơn vị:** Đổi từ tổng số giây sang Giờ, Phút, Giây:
  * Số giây lẻ: `giay = tongGiay % 60`
  * Số phút lẻ: `phut = (tongGiay / 60) % 60`
  * Số giờ: `gio = tongGiay / 3600`

### 2.3. Bảng phân biệt: Tiền tố `++i` vs Hậu tố `i++`

```cpp
int a = 5;
int b = ++a; // a tăng lên 6 trước, sau đó gán 6 cho b -> a = 6, b = 6

int x = 5;
int y = x++; // gán 5 cho y trước, sau đó x mới tăng lên 6 -> x = 6, y = 5
```

> [!TIP]
> **Quy tắc vàng của kỹ sư C++:** Trong các vòng lặp độc lập như `for (int i = 0; i < n; ++i)`, **luôn ưu tiên sử dụng tiền tố `++i`**.
> Lý do: Với kiểu dữ liệu phức tạp (con trỏ, iterator trong STL), `i++` bắt buộc phải tạo ra một bản sao tạm thời (temporary object) lưu giá trị cũ rồi mới tăng giá trị mới, gây tốn bộ nhớ và chậm hơn `++i`!

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các bẫy toán tử nghiêm trọng cần tránh:**
> 1. **Dùng toán tử `%` cho số thực:**
>    ```cpp
>    double x = 5.5, y = 2.0;
>    double r = x % y; // LỖI BIÊN DỊCH: invalid operands of types 'double' and 'double' to binary 'operator%'
>    ```
>    Toán tử `%` chỉ được phép dùng với số nguyên (`int`, `long long`, `char`). Để chia dư số thực, phải dùng hàm `std::fmod(x, y)` trong `<cmath>`.
> 2. **Lạm dụng C-style cast nguy hiểm:**
>    Viết `(double)a` (kiểu C cũ) không an toàn vì nó ép kiểu bất chấp mà không kiểm tra tính tương thích. Trong C++, hãy luôn dùng `static_cast<double>(a)`.
> 3. **Toán tử gán (`=`) và Toán tử so sánh (`==`):**
>    Viết nhầm `if (x = 5)` thay vì `if (x == 5)` là lỗi logic cực kỳ tai hại khiến điều kiện luôn đúng và biến `x` bị thay đổi ngoài ý muốn!

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Đoạn mã C++ sau đây sẽ in ra giá trị gì trên màn hình console?
```cpp
int a = 7;
int b = 2;
double c = static_cast<double>(a) / b;
std::cout << c;
```
* [ ] A) `3`
* [x] B) `3.5`
* [ ] C) `3.0`
* [ ] D) Lỗi biên dịch

*(Giải thích: `static_cast<double>(a)` biến đổi giá trị của `a` thành số thực `7.0`. Khi một số thực chia cho một số nguyên (`7.0 / 2`), C++ tự động nâng cấp toán hạng còn lại thành số thực, cho kết quả chính xác là `3.5`).*

---

### Thử thách sửa lỗi (Debug)
Một học viên viết hàm tính điểm trung bình cộng của 3 môn học Toán, Lý, Hóa nhưng kết quả luôn bị làm tròn thành số nguyên. Hãy chỉ ra lỗi và sửa lại:

```cpp
// Đoạn code lỗi:
#include <iostream>

int main() {
    int toan = 8, ly = 7, hoa = 8;
    double dtb = (toan + ly + hoa) / 3; // Lỗi tại đây!
    std::cout << "Diem TB: " << dtb << '\n';
    return 0;
}
```

**Phân tích lỗi & Cách sửa:**
Biểu thức `(toan + ly + hoa)` có kết quả là số nguyên `23`. Phép chia `23 / 3` là phép chia 2 số nguyên nên kết quả bằng `7` (phần `.666` bị vứt bỏ), sau đó số `7` mới được gán vào biến `dtb` làm `7.0`.

Cách sửa đúng (chỉ cần đổi `3` thành `3.0` hoặc dùng `static_cast`):
```cpp
#include <iostream>

int main() {
    int toan = 8, ly = 7, hoa = 8;
    double dtb = static_cast<double>(toan + ly + hoa) / 3.0;
    std::cout << "Diem TB: " << dtb << '\n';
    return 0;
}
```

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình nhận vào một số nguyên dương T biểu thị tổng số giây. Hãy quy đổi và in ra thời gian theo định dạng:
`<gio> gio <phut> phut <giay> giay`

**Ví dụ:**
* Đầu vào: `3665`
* Đầu ra: `1 gio 1 phut 5 giay`

**Gợi ý thuật toán:**
* 1 giờ = 3600 giây.
* 1 phút = 60 giây.
* Số giờ = `T / 3600`.
* Số phút = `(T % 3600) / 60`.
* Số giây = `T % 60`.

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    int tongGiay = 0;
    if (std::cin >> tongGiay) {
        int gio = tongGiay / 3600;
        int phut = (tongGiay % 3600) / 60;
        int giay = tongGiay % 60;

        std::cout << gio << " gio " << phut << " phut " << giay << " giay\n";
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Phép chia 2 số nguyên trong C++ luôn cho kết quả là số nguyên. Muốn chia ra số thực, bắt buộc ít nhất một trong hai toán hạng phải là số thực (sử dụng `static_cast<double>`).
* Toán tử `%` chỉ dùng cho số nguyên và là chìa khóa để giải các bài toán quy đổi đơn vị, chẵn lẻ và xử lý chữ số.
* Luôn ưu tiên tiền tố `++i` thay vì `i++` để đảm bảo hiệu năng cao nhất.

🎉 **Chúc mừng bạn đã xuất sắc hoàn thành toàn bộ 5 bài học của Module 1!**
Trong **Module 2: Cấu trúc Rẽ nhánh và Tư duy Logic Điều kiện**, chúng ta sẽ bước sang một nấc thang tư duy mới: lập trình đưa ra quyết định thông minh với `if`, `else if`, `else`, cấu trúc `switch-case` và kỹ thuật `Early Return` chống rối mã nguồn.
