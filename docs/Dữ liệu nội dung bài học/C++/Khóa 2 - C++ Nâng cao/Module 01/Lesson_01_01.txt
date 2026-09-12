---
lessonId: CPP2-01.01
title: "Kiểu liệt kê enum class (Scoped Enums) và Kỹ thuật Bit-fields"
difficulty: "Trung bình"
estimatedDuration: "60 phút"
keywords: ["enum class", "scoped enum", "bit-fields", "tiết kiệm bộ nhớ", "lập trình nhúng", "giao thức mạng"]
prerequisites: ["Lesson_01_04", "Lesson_02_01"]
---

# Kiểu liệt kê enum class (Scoped Enums) và Kỹ thuật Bit-fields

## 1. Khái niệm & Vấn đề

Trong C++ truyền thống (kế thừa từ C), kiểu liệt kê `enum` tồn tại hai nhược điểm chết người:
1. **Ô nhiễm không gian tên (Namespace Pollution / Unscoped):** Các hằng số định nghĩa trong enum bị đẩy trực tiếp ra phạm vi toàn cục. Nếu hai enum khác nhau cùng chứa một tên định danh (ví dụ `enum Color { RED, GREEN };` và `enum TrafficLight { RED, YELLOW, GREEN };`), chương trình sẽ lập tức báo lỗi xung đột tên (Name Collision).
2. **Ép kiểu ngầm định nguy hiểm (Implicit Conversion to int):** `enum` cổ điển tự động ép kiểu về số nguyên, cho phép so sánh vô lý như `if (Color::RED == TrafficLight::RED)` hoặc `if (Color::RED == 0)` mà compiler không hề đưa ra cảnh báo.

Modern C++ (từ C++11 trở lên) giới thiệu **`enum class` (Scoped Enums)** để giải quyết triệt để vấn đề này.

Bên cạnh đó, trong các hệ thống đòi hỏi tối ưu bộ nhớ khắt khe (Lập trình vi điều khiển, Lập trình nhúng, Thiết kế gói tin Network Packet Header), mỗi byte bộ nhớ đều quý như vàng. C++ cho phép ta chỉ định số bit cụ thể cho từng trường dữ liệu thông qua kỹ thuật **Bit-fields**.

---

## 2. Cú pháp & Vận hành

### 1. Cú pháp enum class chuẩn Modern C++

```cpp
#include <iostream>
#include <cstdint> // Chứa các kiểu số nguyên có kích thước cố định

// Khai báo enum class có phạm vi riêng và chỉ định kiểu lưu trữ cơ sở là 1 byte (uint8_t)
enum class Status : uint8_t {
    PENDING = 0,
    ACTIVE = 1,
    SUSPENDED = 2,
    BANNED = 3
};

enum class HttpMethod : uint8_t {
    GET,
    POST,
    PUT,
    DELETE
};

int main() {
    Status userStatus = Status::ACTIVE;

    // ❌ LỖI BIÊN DỊCH: Không thể ép kiểu ngầm định sang int!
    // int val = userStatus; 

    // ✅ ÉP KIỂU TƯỜNG MINH khi thực sự cần thiết:
    int numericValue = static_cast<int>(userStatus);
    std::cout << "Mã trạng thái người dùng: " << numericValue << "\n";

    // ✅ Kích thước của Status chỉ chiếm đúng 1 byte (thay vì 4 bytes mặc định)
    std::cout << "Kích thước của Status trong RAM: " << sizeof(Status) << " byte\n";

    return 0;
}
```

### 2. Kỹ thuật Bit-fields trong Struct

Bit-field cho phép bạn khai báo biến chỉ chiếm một số lượng bit nhất định thay vì trọn vẹn cả byte (8 bits).

```cpp
#include <iostream>

// Struct quản lý cờ trạng thái kết nối mạng
struct NetworkPacketHeader {
    unsigned int version     : 4;  // 4 bits biểu diễn phiên bản (0 đến 15)
    unsigned int isEncrypted : 1;  // 1 bit: 0 = Không mã hóa, 1 = Có mã hóa
    unsigned int priority    : 3;  // 3 bits mức độ ưu tiên (0 đến 7)
    unsigned int packetType  : 8;  // 8 bits loại gói tin (0 đến 255)
    // Tổng cộng: 4 + 1 + 3 + 8 = 16 bits = đúng 2 bytes!
};

int main() {
    NetworkPacketHeader header;
    header.version = 6;      // IPv6
    header.isEncrypted = 1;  // Bật mã hóa SSL
    header.priority = 5;     // Ưu tiên cao
    header.packetType = 200;

    std::cout << "Kích thước struct sau khi nén bit: " << sizeof(NetworkPacketHeader) << " bytes\n";
    std::cout << "Version: " << header.version << "\n";
    std::cout << "Mã hóa: " << (header.isEncrypted ? "YES" : "NO") << "\n";
    
    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Gán giá trị vượt quá số bit đã cấp phát trong Bit-field
> Nếu một trường bit được khai báo `unsigned int priority : 3;`, giá trị tối đa mà 3 bits biểu diễn được là 2³ - 1 = 7.
> Nếu bạn gán `header.priority = 10;` (10 ở hệ nhị phân là `1010`), hệ thống sẽ bị cắt cụt (Truncation) và chỉ giữ lại 3 bit cuối là `010` (tương đương giá trị 2). Đây là lỗi logic cực kỳ khó phát hiện nếu không soi nhị phân!

> [!TIP]
> ### 2. Luôn chỉ định kiểu lưu trữ cơ sở (Underlying Type) cho enum class
> Mặc định trong C++, một enum class sẽ sử dụng kiểu `int` (chiếm 4 bytes trên hệ thống 32/64 bit).
> Nếu enum của bạn chỉ có vài giá trị nhỏ, hãy luôn chỉ định `: uint8_t` (chỉ 1 byte). Khi lưu trữ mảng 1 triệu phần tử trạng thái, việc này giúp tiết kiệm ngay lập tức 3 MB bộ nhớ RAM!

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Cho enum class sau: `enum class Color : uint8_t { RED = 10, GREEN, BLUE };`. Giá trị số học của `Color::BLUE` sau khi ép kiểu bằng `static_cast<int>` là bao nhiêu?
- A. 0
- B. 2
- C. 11
- D. 12

**Đáp án đúng:** **D**
*Giải thích:* Trong C++, các giá trị kế tiếp trong enum tự động tăng lên 1 nếu không chỉ định giá trị mới. RED = 10 -> GREEN = 11 -> BLUE = 12.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây cố gắng lấy địa chỉ của một trường bit-field để in ra màn hình nhưng bị trình biên dịch từ chối:

```cpp
// ❌ ĐOẠN CODE LỖI
#include <iostream>

struct DeviceFlags {
    unsigned int powerOn : 1;
    unsigned int errorFlag : 1;
};

int main() {
    DeviceFlags dev;
    dev.powerOn = 1;
    std::cout << &(dev.powerOn); // Lỗi biên dịch: Cannot take address of bit-field!
}
```
**Nguyên nhân:** Kiến trúc phần cứng máy tính đánh địa chỉ bộ nhớ theo từng Byte, không thể đánh địa chỉ riêng lẻ cho từng Bit. Do đó toán tử lấy địa chỉ `&` hoàn toàn bị cấm đối với các thành phần bit-field.
**Sửa lại chuẩn:**
Sao chép giá trị ra một biến số nguyên thông thường trước khi lấy địa chỉ hoặc in trực tiếp giá trị:
```cpp
// ✅ ĐOẠN CODE CHUẨN
#include <iostream>

struct DeviceFlags {
    unsigned int powerOn : 1;
    unsigned int errorFlag : 1;
};

int main() {
    DeviceFlags dev;
    dev.powerOn = 1;
    unsigned int val = dev.powerOn;
    std::cout << "Gia tri: " << val << " tai dia chi struct: " << &dev << "\n";
    return 0;
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Thiết kế một cấu trúc `DateCompact` sử dụng bit-field để lưu trữ ngày (1-31), tháng (1-12) và năm (0-2047) sao cho toàn bộ cấu trúc chỉ chiếm tối đa 3 bytes (24 bits) hoặc 4 bytes. Viết hàm kiểm tra năm nhuận trên cấu trúc này.

**Code giải mẫu:**
```cpp
#include <iostream>

struct DateCompact {
    unsigned int day   : 5;  // 1-31 cần 5 bits (2⁵ = 32)
    unsigned int month : 4;  // 1-12 cần 4 bits (2⁴ = 16)
    unsigned int year  : 12; // 0-2047 cần 11-12 bits (2¹² = 4096)
};

bool isLeapYear(const DateCompact& d) {
    unsigned int y = d.year;
    return (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
}

int main() {
    DateCompact date;
    date.day = 29;
    date.month = 2;
    date.year = 2024;

    std::cout << "Kich thuoc DateCompact: " << sizeof(DateCompact) << " bytes\n";
    std::cout << "Ngay: " << date.day << "/" << date.month << "/" << date.year << "\n";
    std::cout << (isLeapYear(date) ? "Nam nhuan" : "Khong nhuan") << "\n";

    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **`enum class`** loại bỏ hoàn toàn nguy cơ ô nhiễm định danh và ép kiểu bừa bãi của C-style enum.
- **Bit-fields** là vũ khí tối thượng để nén dữ liệu trong lập trình nhúng, giao thức mạng và đồ họa game.
- Không bao giờ lấy địa chỉ `&` của một trường bit-field vì máy tính đánh địa chỉ theo Byte.

*Bài học tiếp theo:* Chúng ta sẽ đi sâu vào bí mật phần cứng: **Cấu trúc struct và Cơ chế Căn chỉnh Bộ nhớ (Memory Padding & Alignment)**.
