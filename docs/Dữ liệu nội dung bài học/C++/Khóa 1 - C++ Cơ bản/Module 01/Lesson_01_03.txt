---
lessonId: "CPP-01.03"
title: "Biến, Hằng số (const & constexpr) và Khởi tạo dữ liệu Clean Code"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["variable", "const", "constexpr", "uniform initialization", "memory", "clean code"]
prerequisites: ["CPP-01.02"]
---

## 1. Khái niệm & Vấn đề

Mọi phần mềm máy tính khi vận hành đều phải làm việc với dữ liệu: số dư tài khoản ngân hàng, tọa độ nhân vật trong game, điểm trung bình của sinh viên. Để máy tính có thể lưu giữ những giá trị này trong lúc chương trình đang chạy, chúng ta cần dùng đến **Biến (Variables)** và **Hằng số (Constants)**.

Về bản chất vật lý, bộ nhớ RAM là một dãy liên tục gồm hàng tỷ "ngăn tủ" nhỏ, mỗi ngăn có một địa chỉ nhị phân phức tạp (ví dụ: `0x7ffee4b6a8`). Thay vì phải nhớ các con số địa chỉ khô khan này, ngôn ngữ C++ cho phép ta đặt một cái **Tên (Tên biến)** đại diện cho một hoặc nhiều ô nhớ trong RAM.

| Thuật ngữ | Định nghĩa kỹ thuật | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Biến (Variable)** | Vùng nhớ được cấp phát trong RAM có tên định danh, giá trị có thể thay đổi trong lúc chạy. | Chiếc hộp giấy có dán nhãn bên ngoài; bạn có thể bỏ đồ vật vào và thay thế bằng món đồ khác bất cứ lúc nào. |
| **Hằng số chạy (`const`)** | Biến chỉ đọc (Read-only); sau khi khởi tạo giá trị ban đầu thì không thể bị ghi đè. | Chiếc hộp bị dán băng keo niêm phong sau khi bỏ đồ vào; chỉ được ngắm chứ không thể thay thế đồ bên trong. |
| **Hằng số biên dịch (`constexpr`)** | Hằng số có giá trị được tính toán cố định ngay từ lúc biên dịch (Compile-time) bởi trình biên dịch. | Tấm bia đá được khắc chữ từ khi xuất xưởng tại lò gạch, máy tính không tốn 1 nano giây nào để tính lại khi chạy. |
| **Giá trị rác (Garbage Value)** | Dữ liệu cũ còn sót lại trong ô nhớ RAM khi lập trình viên khai báo biến mà quên khởi tạo giá trị. | Căn phòng trọ cũ chưa dọn dẹp; người thuê mới vào phòng sẽ thấy toàn bộ rác rưởi của người thuê trước để lại. |
| **Khởi tạo đồng nhất (`{}`)** | Cú pháp khởi tạo biến chuẩn C++11/17 sử dụng cặp ngoặc nhọn `{}` (Uniform Initialization). | Bộ lọc kiểm định chất lượng: ngăn chặn triệt để việc nhét hạt đậu to vào khe nhỏ (Narrowing Conversion). |

---

## 2. Cú pháp & Vận hành

### 2.1. Khởi tạo biến chuẩn Modern C++: Uniform Initialization `{}`
Trong C++ cổ điển, có 3 cách khởi tạo biến. Nhưng từ C++11 đến C++17, chuẩn lập trình hiện đại khuyến nghị sử dụng **Khởi tạo đồng nhất bằng cặp ngoặc nhọn `{}` (Brace Initialization)**:

```cpp
#include <iostream>

int main() {
    // 1. Khởi tạo với giá trị cụ thể (Direct list initialization)
    int studentAge{19};          // Ô nhớ int chứa giá trị 19
    double accountBalance{150.5}; // Ô nhớ double chứa 150.5

    // 2. Khởi tạo mặc định (Value initialization -> bằng 0)
    int totalScore{};            // Tự động mang giá trị 0 an toàn tuyệt đối!

    // 3. Khởi tạo hằng số (const)
    const double PI{3.14159};    // Không thể thay đổi: PI = 3.14 là lỗi ngay!

    // 4. Khởi tạo hằng số thời gian biên dịch (constexpr)
    constexpr int MAX_STUDENTS{50}; // Được tính toán cố định từ lúc compile

    std::cout << "Tuoi sinh vien: " << studentAge << '\n';
    std::cout << "Diem mac dinh: " << totalScore << '\n';
    std::cout << "So luong toi da: " << MAX_STUDENTS << '\n';

    return 0;
}
```

### 2.2. Sức mạnh của Cặp ngoặc nhọn `{}`: Chống mất mát dữ liệu (Narrowing Conversion)
Nếu bạn khởi tạo theo phong cách cũ bằng dấu `=`, trình biên dịch sẽ âm thầm cắt gọt dữ liệu mà không báo lỗi:
```cpp
int x = 4.9; // Cũ: x sẽ bằng 4, phần thập phân 0.9 bị mất sạch mà KHÔNG báo lỗi!
```
Nhưng nếu dùng cặp ngoặc nhọn `{}` chuẩn Modern C++:
```cpp
int x{4.9}; // MỚI: Trình biên dịch báo Compile Error ngay lập tức!
            // "narrowing conversion of '4.9e+0' from 'double' to 'int'"
```
Điều này giúp bạn ngăn chặn những thảm họa sai số phần mềm cực kỳ nguy hiểm.

### 2.3. Bảng so sánh giữa `const` và `constexpr`

| Tiêu chí | `const` | `constexpr` |
| :--- | :--- | :--- |
| **Thời điểm xác định giá trị** | Thời gian chạy (Runtime) hoặc lúc biên dịch. | **Bắt buộc phải biết giá trị ngay lúc biên dịch (Compile-time).** |
| **Khởi tạo từ giá trị nhập** | Cho phép: `const int x = userInput;` | **Tuyệt đối cấm:** `constexpr int x = userInput;` (Lỗi biên dịch). |
| **Hiệu năng thực thi** | Tốt. | **Tối ưu cực hạn:** Trình biên dịch thay trực tiếp con số vào mã máy. |
| **Trường hợp sử dụng** | Dữ liệu không đổi sau khi nhận từ API, File, bàn phím. | Các hằng số toán học, kích thước mảng cố định, cấu hình hệ thống. |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy sống còn khi thao tác với biến:**
> 1. **Bẫy "Biến rác" (Uninitialized Variable):**
>    ```cpp
>    int diemThi; // Quên khởi tạo giá trị!
>    std::cout << diemThi; // Xuất ra số kỳ lạ: -858993460 hoặc 32767
>    ```
>    Trong C++, nếu không gán giá trị, biến sẽ mang giá trị rác ngẫu nhiên còn đọng lại trong RAM. Hãy luôn tạo thói quen khai báo kèm `{}` (ví dụ: `int diemThi{};`).
> 2. **Cố tình thay đổi giá trị hằng số `const`:**
>    ```cpp
>    const int MAX_SPEED = 100;
>    MAX_SPEED = 120; // LỖI BIÊN DỊCH: assignment of read-only variable 'MAX_SPEED'
>    ```
> 3. **Đặt tên biến cẩu thả:** Đặt tên biến một chữ cái như `int a, b, c;` làm mã nguồn trở thành mật mã khó đọc. Hãy đặt tên rõ nghĩa: `itemPrice`, `userAge`, `totalDistance`.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Trong C++17, từ khóa nào sau đây được dùng để định nghĩa một hằng số mà giá trị của nó **bắt buộc phải được tính toán và xác định cố định ngay tại thời điểm biên dịch (Compile-time)**?
* [ ] A) `const`
* [x] B) `constexpr`
* [ ] C) `static`
* [ ] D) `volatile`

*(Giải thích: `constexpr` (Constant Expression) yêu cầu biểu thức phải được tính toán ngay tại thời gian biên dịch, giúp tối ưu hiệu năng tối đa và có thể dùng làm kích thước mảng tĩnh).*

---

### Thử thách sửa lỗi (Debug)
Quan sát đoạn mã C++ dưới đây và tìm ra 2 lỗi sai khiến chương trình không thể biên dịch:

```cpp
// Đoạn code lỗi:
#include <iostream>

int main() {
    const double PI{3.14159};
    PI = 3.14; // Thao tác sai 1

    int age;
    std::cout << "Tuoi: " << age << '\n'; // Thao tác sai 2
    return 0;
}
```

**Phân tích lỗi & Cách sửa:**
1. **Lỗi 1 (Ghi đè hằng số):** Biến `PI` được khai báo là `const` nên không thể thay đổi giá trị sau khi khởi tạo. Cần xóa bỏ dòng gán lại `PI = 3.14;`.
2. **Lỗi 2 (Biến rác chưa khởi tạo):** Biến `age` chưa được gán giá trị đã đem xuất ra màn hình, dẫn đến in ra giá trị rác và gây cảnh báo trình biên dịch.

Code sau khi sửa đúng:
```cpp
#include <iostream>

int main() {
    const double PI{3.14159};
    int age{20};

    std::cout << "PI: " << PI << '\n';
    std::cout << "Tuoi: " << age << '\n';
    return 0;
}
```

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Khai báo hằng số số thực `const double PI = 3.14159;`. Viết chương trình nhận vào bán kính r (số thực) của hình tròn từ bàn phím. Hãy tính và in ra:
* Dòng 1: `Chu vi: <gia_tri>` (Công thức: C = 2 × PI × r)
* Dòng 2: `Dien tich: <gia_tri>` (Công thức: S = PI × r × r)

**Ví dụ:**
* Đầu vào: `5.0`
* Đầu ra:
  ```text
  Chu vi: 31.4159
  Dien tich: 78.5398
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    const double PI{3.14159};
    double r{0.0};

    if (std::cin >> r) {
        double chuVi = 2.0 * PI * r;
        double dienTich = PI * r * r;

        std::cout << "Chu vi: " << chuVi << '\n';
        std::cout << "Dien tich: " << dienTich << '\n';
    }

    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Luôn khởi tạo biến với cú pháp Uniform Initialization `{}` (ví dụ: `int x{};`) để triệt tiêu lỗi giá trị rác và lỗi Narrowing Conversion.
* Sử dụng `const` cho các giá trị không đổi trong thời gian chạy, và `constexpr` cho các giá trị cố định ngay tại thời điểm biên dịch.
* Quy chuẩn đặt tên biến rõ nghĩa giúp mã nguồn tự giải thích (Self-documenting Code).

Trong bài học tiếp theo **[Bài 1.4: Hệ thống Kiểu dữ liệu nguyên thủy và Lỗi tràn số (Overflow)]**, chúng ta sẽ đo đạc chính xác kích thước byte của từng kiểu dữ liệu bằng toán tử `sizeof()` và giải mã bẫy lỗi tràn số nguyên (Integer Overflow) kinh điển trong thi đấu và thực tế.
