---
lessonId: "CPP-02.04"
title: "Toán tử 3 ngôi (Ternary Operator) và Cấu trúc switch-case"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["switch", "case", "ternary", "break", "default", "fallthrough", "c++17"]
prerequisites: ["CPP-02.03"]
---

## 1. Khái niệm & Vấn đề

Khi một biến chỉ nhận các giá trị rời rạc cụ thể (ví dụ: ngày trong tuần từ 2 đến 8, mã phím bấm Menu từ 1 đến 5, ký tự phép toán `+`, `-`, `*`, `/`), việc viết hàng chục câu lệnh `else if (luaChon == 1) ... else if (luaChon == 2) ...` trở nên rất dài dòng và kém hiệu quả.

Để giải quyết bài toán rẽ nhánh theo các giá trị rời rạc với hiệu năng tối đa, C++ cung cấp **Cấu trúc `switch-case`**. Ở cấp độ hợp ngữ, trình biên dịch có thể biến đổi cấu trúc `switch-case` thành một **Bảng nhảy (Jump Table)**, giúp máy tính nhảy thẳng đến nhánh cần thực thi mà không cần phải so sánh tuần tự từng nhánh như `if-else`!

Bên cạnh đó, với các phép gán điều kiện ngắn gọn 2 nhánh, C++ cung cấp **Toán tử điều kiện 3 ngôi (`? :`)** giúp code cô đọng trên duy nhất một dòng.

| Cấu trúc | Bản chất | Trường hợp sử dụng lý tưởng |
| :--- | :--- | :--- |
| **Toán tử 3 ngôi (`? :`)** | Biểu thức trả về giá trị: `dieuKien ? giaTriNeuDung : giaTriNeuSai` | Gán giá trị hoặc in ấn nhanh chóng cho các điều kiện đơn giản. |
| **`switch-case`** | Cấu trúc rẽ nhánh dựa trên so sánh giá trị hằng số nguyên/ký tự. | Menu chức năng, mã lỗi HTTP, phân loại phím bấm, máy tính số học. |
| **Từ khóa `break`** | Lệnh ngắt luồng: nhảy lập tức ra khỏi khối `switch`. | Ngăn chặn hiện tượng "rơi tự do" sang các case phía dưới. |
| **Thuộc tính `[[fallthrough]]`** | Thuộc tính Modern C++17 báo hiệu cố tình rơi tự do. | Khi nhiều case chia sẻ chung một khối lệnh xử lý. |

---

## 2. Cú pháp & Vận hành

### 2.1. Toán tử 3 ngôi (Ternary Operator)
Toán tử 3 ngôi là toán tử duy nhất trong C++ nhận vào 3 toán hạng:

```cpp
#include <iostream>

int main() {
    int a = 15, b = 20;

    // Tìm số lớn nhất: nếu a > b thì lấy a, ngược lại lấy b
    int maxVal = (a > b) ? a : b;

    // Xuất thông báo chẵn lẻ trực tiếp không cần if-else
    std::cout << "So a la: " << ((a % 2 == 0) ? "Chan" : "Le") << '\n';

    return 0;
}
```

### 2.2. Cấu trúc `switch-case` chuẩn C++17
Dưới đây là chương trình xử lý menu điều hướng chức năng:

```cpp
#include <iostream>

int main() {
    char luaChon = 'B';

    switch (luaChon) {
        case 'A':
        case 'a': // Gộp chung nhiều case
            std::cout << "Chuc nang: Them moi ho so\n";
            break;

        case 'B':
        case 'b':
            std::cout << "Chuc nang: Chinh sua ho so\n";
            break;

        case 'X':
            std::cout << "Dang xoa du lieu...\n";
            [[fallthrough]]; // C++17: Khẳng định cố tình rơi xuống case sau
        case 'Q':
            std::cout << "Thoat chuong trinh!\n";
            break;

        default: // Nhánh mặc định khi không khớp case nào
            std::cout << "Lua chon khong hop le!\n";
            break;
    }

    return 0;
}
```

### 2.3. Cơ chế Bảng nhảy (Jump Table) vs if-else
* Với chuỗi 10 nhánh `if - else if`: CPU phải thực hiện trung bình 5-10 phép so sánh tuần tự. Độ phức tạp: O(N).
* Với `switch-case` trên tập giá trị liền kề: Trình biên dịch tạo một mảng chứa địa chỉ lệnh của các case (Jump Table). CPU chỉ tính toán chỉ số và nhảy thẳng trực tiếp đến đích trong 1 nhịp duy nhất! Độ phức tạp: O(1).

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy switch-case kinh điển:**
> 1. **Quên từ khóa `break` (Hiện tượng Fallthrough ngoài ý muốn):**
>    Nếu quên `break`, chương trình sẽ thực thi tiếp toàn bộ mã nguồn của các `case` bên dưới cho đến khi gặp lệnh `break` tiếp theo hoặc hết khối `switch`!
> 2. **Dùng biến hoặc số thực `float`/`double` trong `case`:**
>    Cú pháp `case <gia_tri>:` bắt buộc `<gia_tri>` phải là **Hằng số nguyên** (`int`, `char`, `short`, `enum`) đã biết giá trị lúc biên dịch (Compile-time). Bạn KHÔNG THỂ viết `case x:` (với x là biến) hoặc `case 3.14:` (số thực).
> 3. **Khai báo biến mới tự do trong `case`:**
>    Nếu khai báo biến trong một `case`, bạn phải đặt biến đó trong cặp ngoặc nhọn `{}` riêng biệt, nếu không compiler sẽ báo lỗi `jump to case label crosses initialization`.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Kiểu dữ liệu nào sau đây **KHÔNG THỂ** sử dụng làm biểu thức điều kiện trong cấu trúc `switch-case` của C++?
* [ ] A) `int`
* [ ] B) `char`
* [x] C) `double` (Số thực không được phép dùng trong switch-case)
* [ ] D) `enum`

---

### Thử thách sửa lỗi (Debug)
Chương trình máy tính mini sau đây khi người dùng nhập toán tử `+` thì in ra kết quả của cả phép cộng, phép trừ và phép nhân. Hãy phát hiện lỗi:

```cpp
// Code lỗi:
#include <iostream>

int main() {
    int a = 10, b = 5;
    char op = '+';

    switch (op) {
        case '+':
            std::cout << "Tong: " << (a + b) << '\n';
        case '-':
            std::cout << "Hieu: " << (a - b) << '\n';
        case '*':
            std::cout << "Tich: " << (a * b) << '\n';
            break;
    }
    return 0;
}
```

**Phân tích lỗi & Cách sửa:**
Các nhánh `case '+'` và `case '-'` bị thiếu từ khóa `break;`, dẫn đến việc sau khi tính tổng, CPU rơi tự do xuống tính tiếp cả hiệu và tích.
Sửa lại: Bổ sung `break;` vào cuối mỗi `case`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình mô phỏng máy tính 4 phép toán cơ bản. Nhận vào từ bàn phím 2 số thực a, b và một ký tự toán tử `op` (`+`, `-`, `*`, `/`). Hãy in ra kết quả tương ứng:
* Định dạng: `<gia_tri_phep_tinh>`
* Riêng phép chia `/`: nếu mẫu số b = 0, in ra màn hình: `Loi chia cho 0`
* Nếu toán tử không thuộc 4 ký tự trên, in ra: `Toan tu khong hop le`

**Ví dụ:**
* Đầu vào: `12 4 /` ➔ Đầu ra: `3`
* Đầu vào: `8 0 /` ➔ Đầu ra: `Loi chia cho 0`
* Đầu vào: `7 3 *` ➔ Đầu ra: `21`

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    double a = 0, b = 0;
    char op = ' ';

    if (std::cin >> a >> b >> op) {
        switch (op) {
            case '+':
                std::cout << (a + b) << '\n';
                break;
            case '-':
                std::cout << (a - b) << '\n';
                break;
            case '*':
                std::cout << (a * b) << '\n';
                break;
            case '/':
                if (b == 0) {
                    std::cout << "Loi chia cho 0\n";
                } else {
                    std::cout << (a / b) << '\n';
                }
                break;
            default:
                std::cout << "Toan tu khong hop le\n";
                break;
        }
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Sử dụng **Toán tử 3 ngôi (`? :`)** cho các biểu thức gán có điều kiện ngắn gọn trên một dòng.
* Sử dụng **`switch-case`** khi phân nhánh dựa trên các giá trị rời rạc kiểu số nguyên hoặc ký tự; cấu trúc này được tối ưu bằng Jump Table đạt tốc độ O(1).
* Luôn nhớ lệnh **`break`** ở mỗi case để tránh lỗi rơi tự do ngoài ý muốn (trừ khi có chủ đích và được đánh dấu bằng `[[fallthrough]]`).

🎉 **Chúc mừng bạn đã hoàn thành trọn vẹn Module 2: Cấu trúc Rẽ nhánh!**
Trong **Module 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển**, chúng ta sẽ khai mở sức mạnh tự động hóa hàng triệu phép tính lặp với `for`, `while`, `do-while` và chinh phục các bài toán số học chuyên sâu.
