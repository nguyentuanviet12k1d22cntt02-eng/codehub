---
lessonId: CPP2-01.03
title: "Hợp tập Union và std::variant (Type-Safe Union C++17)"
difficulty: "Nâng cao"
estimatedDuration: "65 phút"
keywords: ["union", "std::variant", "std::holds_alternative", "std::get", "type-safe", "bộ nhớ dùng chung", "C++17"]
prerequisites: ["CPP2-01.02"]
---

# Hợp tập Union và std::variant (Type-Safe Union C++17)

## 1. Khái niệm & Vấn đề

Nếu như trong một `struct`, mỗi trường thành viên đều sở hữu một ô nhớ riêng biệt (kích thước của struct bằng tổng các trường cộng thêm padding), thì **`union`** là một cấu trúc dữ liệu đặc biệt mà **tất cả các trường thành viên đều dùng chung MỘT vùng nhớ duy nhất**!
- Kích thước của một `union` bằng đúng kích thước của trường thành viên có độ lớn lớn nhất.
- Tại bất kỳ thời điểm nào, `union` **chỉ có thể chứa một giá trị duy nhất**. Gán giá trị mới cho một trường sẽ ghi đè và hủy hoại dữ liệu của trường trước đó.

### Cơn ác mộng của C-style Union
Trong C, `union` cực kỳ nguy hiểm vì nó không lưu trữ bất kỳ siêu dữ liệu (metadata) nào để biết hiện tại nó đang chứa kiểu dữ liệu gì. Nếu bạn gán một chuỗi `char*` vào union, nhưng sau đó vô tình đọc nó ra dưới dạng `double`, chương trình sẽ đọc các byte rác và gây lỗi thảm khốc mà không có bất kỳ thông báo lỗi nào (Type-unsafe).

Để giải quyết triệt để, Modern C++17 giới thiệu **`std::variant`** (nằm trong thư viện `<variant>`) - được mệnh danh là **Type-safe Union (Union an toàn kiểu)**.

---

## 2. Cú pháp & Vận hành

### 1. C-style Union cổ điển và Bản chất bộ nhớ

```cpp
#include <iostream>

union SharedMemory {
    int intVal;       // 4 bytes
    double doubleVal; // 8 bytes
    char charVal;     // 1 byte
}; // sizeof(SharedMemory) = 8 bytes (bằng kích thước của doubleVal)

int main() {
    SharedMemory u;
    std::cout << "Kích thước union: " << sizeof(u) << " bytes\n";

    u.intVal = 42;
    std::cout << "u.intVal = " << u.intVal << "\n";

    // Gán doubleVal -> Ô nhớ bị ghi đè hoàn toàn!
    u.doubleVal = 3.14159;
    std::cout << "u.doubleVal = " << u.doubleVal << "\n";

    // ⚠️ Đọc nhầm intVal sau khi đã bị doubleVal ghi đè:
    std::cout << "u.intVal (Bị hỏng): " << u.intVal << " (Byte rác!)\n";

    return 0;
}
```

### 2. std::variant Hiện đại chuẩn C++17 (Khuyên dùng 100%)

`std::variant` biết chính xác kiểu dữ liệu nào đang được kích hoạt và ném ra ngoại lệ `std::bad_variant_access` nếu bạn cố tình truy xuất sai kiểu!

```cpp
#include <iostream>
#include <variant>
#include <string>

int main() {
    // Biến v có thể chứa kiểu int, double hoặc std::string
    std::variant<int, double, std::string> v;

    v = 100; // Hiện đang chứa int
    std::cout << "v chứa int: " << std::get<int>(v) << "\n";

    v = "Xin chao Modern C++"; // Tự động chuyển sang chứa std::string an toàn
    std::cout << "v chứa string: " << std::get<std::string>(v) << "\n";

    // ✅ KIỂM TRA AN TOÀN TRƯỚC KHI TRUY XUẤT:
    if (std::holds_alternative<std::string>(v)) {
        std::cout << "Xác nhận: v đang lưu chuỗi văn bản!\n";
    }

    // ❌ NÉM LỖI AN TOÀN NẾU TRUY XUẤT SAI:
    try {
        std::cout << std::get<double>(v); // v đang chứa string, đòi lấy double!
    } catch (const std::bad_variant_access& e) {
        std::cerr << ">> Ngoại lệ bắt được an toàn: " << e.what() << "\n";
    }

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Đọc dữ liệu sai trường trong C-style Union (Type Punning UB)
> Việc ghi một kiểu vào union rồi đọc ra bằng một kiểu khác được gọi là "Type Punning".
> Mặc dù một số lập trình viên nhúng dùng kỹ thuật này để soi từng byte của số thực `float`, chuẩn C++ chính thức định nghĩa hành vi này là **Undefined Behavior (UB)** nếu các kiểu không tương thích. Trình biên dịch tối ưu (như `-O2` hoặc `-O3`) có thể tối ưu hóa và làm kết quả chạy hoàn toàn sai lệch. Hãy dùng `std::memcpy` hoặc `std::bit_cast` (C++20) khi cần thao tác byte thô.

> [!TIP]
> ### 2. Mẫu thiết kế std::visit cực mạnh với Pattern Matching
> Kết hợp `std::variant` và `std::visit` cho phép bạn xử lý từng kiểu dữ liệu một cách cực kỳ thanh lịch mà không cần dùng chuỗi `if-else`:
> ```cpp
> std::visit([](auto&& arg) {
>     std::cout << "Giá trị hiện tại: " << arg << "\n";
> }, v);
> ```

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Cho `std::variant<int, double> v = 3.14;`. Hàm nào sau đây trả về `true`?
- A. `std::holds_alternative<int>(v)`
- B. `std::holds_alternative<double>(v)`
- C. `std::holds_alternative<float>(v)`
- D. `v.empty()`

**Đáp án đúng:** **B**
*Giải thích:* Vì biến `v` vừa được gán giá trị số thực `3.14`, kiểu dữ liệu hiện hành của nó là `double`.

### 4.2. Thử thách sửa lỗi (Debug)
Một học viên viết code lấy giá trị từ variant bằng `std::get` nhưng chương trình bị sập khi gặp lỗi:

```cpp
// ❌ ĐOẠN CODE LỖI
#include <iostream>
#include <variant>

int main() {
    std::variant<int, double> v = 10;
    // Cố lấy double trong khi v đang giữ int
    double d = std::get<double>(v); // Chương trình ném ngoại lệ sập không bắt!
    std::cout << d;
}
```
**Sửa lại chuẩn:**
Sử dụng `std::get_if` để trả về con trỏ (trả về `nullptr` nếu sai kiểu thay vì bắn ngoại lệ sập chương trình):
```cpp
// ✅ ĐOẠN CODE CHUẨN
#include <iostream>
#include <variant>

int main() {
    std::variant<int, double> v = 10;
    if (auto pVal = std::get_if<double>(&v)) {
        std::cout << "Gia tri double: " << *pVal << "\n";
    } else {
        std::cout << "v hien khong chua kieu double!\n";
    }
    return 0;
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Sử dụng `std::variant` để biểu diễn kết quả trả về của một phép tính toán: có thể là một số thực `double` (khi thành công) hoặc một `std::string` thông báo lỗi (khi thất bại, ví dụ chia cho 0 hoặc căn bậc hai của số âm). Viết hàm chia 2 số sử dụng cấu trúc này.

**Code giải mẫu:**
```cpp
#include <iostream>
#include <variant>
#include <string>

using Result = std::variant<double, std::string>;

Result safeDivide(double a, double b) {
    if (b == 0.0) {
        return std::string("Loi: Khong the chia cho 0!");
    }
    return a / b;
}

int main() {
    Result res1 = safeDivide(10.0, 2.0);
    Result res2 = safeDivide(10.0, 0.0);

    if (std::holds_alternative<double>(res1)) {
        std::cout << "Phep tinh 1 hop le: " << std::get<double>(res1) << "\n";
    }

    if (std::holds_alternative<std::string>(res2)) {
        std::cout << "Phep tinh 2 that bai: " << std::get<std::string>(res2) << "\n";
    }

    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **`union`** cho phép chia sẻ chung một vùng nhớ để tiết kiệm tối đa RAM.
- **`std::variant` (C++17)** thay thế hoàn hảo C-style union, mang lại tính an toàn tuyệt đối về kiểu dữ liệu.
- Luôn sử dụng `std::holds_alternative` hoặc `std::get_if` để kiểm tra trước khi trích xuất giá trị.

*Bài học tiếp theo:* Chào mừng bạn đến với **Module 2: Con trỏ Chuyên sâu và Quản trị Bộ nhớ Động** - Bài học đầu tiên sẽ giải mã toàn diện **Kiến trúc phân vùng RAM: Stack, Heap, Data và Code Segment**.
