---
lessonId: "CPP-01.04"
title: "Hệ thống Kiểu dữ liệu nguyên thủy và Lỗi tràn số (Overflow)"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["data types", "int", "long long", "overflow", "sizeof", "limits", "floating point"]
prerequisites: ["CPP-01.03"]
---

## 1. Khái niệm & Vấn đề

Trong thế giới thực, chúng ta có nhiều loại thông tin khác nhau: tuổi tác là một con số nguyên dương nhỏ (18), số dư tài khoản có thể là số nguyên cực lớn hàng tỷ đồng, điểm trung bình là số thập phân (8.75), và giới tính có thể biểu thị bằng một ký tự đơn ('M' hoặc 'F').

Trong C++, máy tính không tự đoán định được ý nghĩa của dữ liệu nếu lập trình viên không nói rõ. **Kiểu dữ liệu (Data Type)** chính là bản hợp đồng cam kết với máy tính: nó quy định **kích thước bộ nhớ cần cấp phát (bao nhiêu Bytes)** và **cách thức mà CPU giải mã các bit 0/1** trong vùng nhớ đó.

Nếu chọn sai kiểu dữ liệu, chương trình sẽ gặp hiện tượng **Tràn số (Overflow)** — lỗi nguy hiểm bậc nhất từng khiến tên lửa Ariane 5 của châu Âu phát nổ chỉ 37 giây sau khi phóng vào năm 1996, gây thiệt hại hơn 370 triệu USD!

| Kiểu dữ liệu | Kích thước | Miền giá trị xấp xỉ | Phép ẩn dụ thực tế |
| :--- | :--- | :--- | :--- |
| **`bool`** | 1 Byte | `true` (1) hoặc `false` (0) | Công tắc đèn: chỉ có bật hoặc tắt. |
| **`char`** | 1 Byte | Ký tự bảng mã ASCII (`'A'`, `'a'`, `'0'`) | Phím đơn trên bàn phím máy đánh chữ. |
| **`int`** | 4 Bytes (32 bits) | -2.14 × 10⁹ đến +2.14 × 10⁹ (khoảng ±2 tỷ) | Chiếc bình nước dung tích 2 lít. |
| **`long long`** | 8 Bytes (64 bits) | -9.22 × 10¹⁸ đến +9.22 × 10¹⁸ (khoảng ±9 tỷ tỷ) | Thùng chứa dung tích khổng lồ 9 triệu mét khối. |
| **`float`** | 4 Bytes | Số thực độ chính xác đơn (~6-7 chữ số tin cậy) | Thước đo milimet thông thường. |
| **`double`** | 8 Bytes | Số thực độ chính xác kép (~15-16 chữ số tin cậy) | Kính hiển vi quang học đo kích thước tế bào. |

---

## 2. Cú pháp & Vận hành

### 2.1. Đo kích thước kiểu dữ liệu với toán tử `sizeof()`
Toán tử `sizeof()` trong C++ cho phép ta truy vấn trực tiếp kích thước theo đơn vị Byte của bất kỳ kiểu dữ liệu hay biến số nào ngay trên máy tính của bạn:

```cpp
#include <iostream>

int main() {
    std::cout << "Kich thuoc bool:      " << sizeof(bool) << " byte\n";
    std::cout << "Kich thuoc char:      " << sizeof(char) << " byte\n";
    std::cout << "Kich thuoc int:       " << sizeof(int) << " bytes (32-bit)\n";
    std::cout << "Kich thuoc long long: " << sizeof(long long) << " bytes (64-bit)\n";
    std::cout << "Kich thuoc float:     " << sizeof(float) << " bytes\n";
    std::cout << "Kich thuoc double:    " << sizeof(double) << " bytes\n";
    return 0;
}
```

### 2.2. Cơ chế Tràn số nguyên (Integer Overflow)
Kiểu `int` 32-bit có giới hạn cực đại là 2³¹ - 1 = 2,147,483,647. Chuyện gì sẽ xảy ra nếu bạn cộng thêm 1 vào con số cực đại này?

```cpp
#include <iostream>

int main() {
    int maxInt = 2147483647; // Giá trị cực đại của signed int
    std::cout << "Gia tri hien tai: " << maxInt << '\n';

    maxInt = maxInt + 1; // BỊ TRÀN SỐ!
    std::cout << "Sau khi + 1:      " << maxInt << '\n'; 
    // Kết quả in ra: -2147483648 (Bị biến thành số âm cực tiểu!)
    return 0;
}
```
**Bản chất:** Các con số nguyên trong máy tính hoạt động theo vòng tròn khép kín (như đồng hồ công tơ mét xe máy). Khi vượt quá vạch cực đại, các bit cao nhất bị lật thành bit dấu âm, làm giá trị nhảy ngược về đầu bên kia trục số!

### 2.3. Bẫy tràn số ngầm định (Implicit Overflow Trap)
Rất nhiều học viên viết như sau và tin rằng mình đã dùng `long long` an toàn:
```cpp
int a = 1000000; // 10⁶
int b = 1000000; // 10⁶
long long c = a * b; // VẪN BỊ TRÀN SỐ!
std::cout << c; // In ra: -727379968
```
**Tại sao lại tràn?**
Vì `a` và `b` đều là kiểu `int`. CPU sẽ thực hiện phép nhân `int * int` trước (cho ra kết quả `int` bị tràn số thành số âm), rồi sau đó mới gán con số âm đã bị hỏng đó vào biến `long long c`!

**Cách khắc phục chuẩn C++:**
Ép kiểu 1 toán hạng sang `long long` trước khi nhân bằng cách nhân với `1LL` (1 dạng long long literal):
```cpp
long long c = 1LL * a * b; // CHÍNH XÁC: 1LL ép toàn bộ phép tính sang 64-bit!
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy kiểu dữ liệu thường gặp:**
> 1. **Dùng `float` thay vì `double`:** `float` chỉ có 6-7 chữ số có nghĩa. Trong các phép toán tài chính hay tọa độ game, `float` tích lũy sai số cực nhanh. **Quy chuẩn Modern C++:** Luôn ưu tiên dùng `double` làm kiểu số thực mặc định.
> 2. **So sánh bằng giữa 2 số thực (`a == b`):**
>    ```cpp
>    double x = 0.1 + 0.2;
>    if (x == 0.3) { /* Không bao giờ chạy vào đây! */ }
>    ```
>    Do máy tính biểu diễn số thực ở hệ nhị phân, 0.1 + 0.2 = 0.30000000000000004. Để so sánh số thực, phải kiểm tra độ chênh lệch: `std::abs(x - 0.3) < 1e-9`.
> 3. **Nhầm lẫn giữa `char` và `int`:**
>    Ký tự `'5'` có mã ASCII là số `53`, hoàn toàn khác với con số nguyên `5`!

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Cho hai biến nguyên kiểu 32-bit: `int x = 1000000;` (1 triệu) và `int y = 2000000;` (2 triệu). Câu lệnh nào dưới đây tính tích của hai số mà **chắc chắn không bị lỗi tràn số nguyên (Overflow)**?
* [ ] A) `long long ketQua = x * y;`
* [x] B) `long long ketQua = 1LL * x * y;`
* [ ] C) `int ketQua = x * y;`
* [ ] D) `double ketQua = x * y;`

*(Giải thích: Phép nhân `1LL * x * y` ép kiểu biểu thức sang `long long` (64-bit) ngay từ toán hạng đầu tiên, do đó toàn bộ phép nhân được tính trên không gian 64-bit an toàn).*

---

### Thử thách sửa lỗi (Debug)
Một bạn làm bài tập tính bình phương của một số nguyên lớn nhưng kết quả luôn bị sai số âm. Hãy sửa lại đoạn code sau:

```cpp
// Đoạn code lỗi:
#include <iostream>

int main() {
    int n;
    std::cin >> n; // Giả sử nhập n = 100000 (10⁵)
    int binhPhuong = n * n; // n * n = 10^10 vượt quá ngưỡng 2 * 10⁹ của int!
    std::cout << "Binh phuong: " << binhPhuong << '\n';
    return 0;
}
```

**Cách sửa đúng:**
```cpp
#include <iostream>

int main() {
    long long n = 0;
    if (std::cin >> n) {
        long long binhPhuong = n * n;
        std::cout << "Binh phuong: " << binhPhuong << '\n';
    }
    return 0;
}
```

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào 2 số nguyên a và b từ bàn phím (với 1 ≤ a, b ≤ 10⁹). Hãy tính và in ra tích của a × b.

**Ví dụ:**
* Đầu vào: `1000000000 1000000000` (Hai số 10⁹)
* Đầu ra: `1000000000000000000` (10¹⁸)

**Ràng buộc kỹ thuật:**
* Phải sử dụng kiểu dữ liệu `long long` để tránh hoàn toàn lỗi tràn số.

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    long long a = 0;
    long long b = 0;

    if (std::cin >> a >> b) {
        long long tich = a * b;
        std::cout << tich << '\n';
    }

    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Kiểu `int` chỉ chứa tối đa khoảng ±2 tỷ (2 × 10⁹). Khi làm việc với tích của hai số lớn hoặc bài toán lũy thừa, luôn luôn chọn `long long`.
* Chú ý bẫy tràn số ngầm định: `1LL * a * b` để đảm bảo phép nhân diễn ra trên thanh ghi 64-bit.
* Sử dụng `double` thay cho `float` để tránh sai số thập phân.

Trong bài học tiếp theo **[Bài 1.5: Toán tử số học, Toán tử gán và Kỹ thuật Ép kiểu an toàn (static_cast)]**, chúng ta sẽ hoàn thiện Module 1 với bẫy chia lấy nguyên `5 / 2 = 2`, toán tử tăng giảm `++i` vs `i++` và kỹ thuật ép kiểu chuẩn mực `static_cast`.
