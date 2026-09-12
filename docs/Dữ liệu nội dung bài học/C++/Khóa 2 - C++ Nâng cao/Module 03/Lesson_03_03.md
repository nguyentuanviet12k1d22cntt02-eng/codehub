---
lessonId: "CPP2-03.03"
title: "Xử lý Biểu thức Chính quy (std::regex) trong C++11/17"
difficulty: "HARD"
estimatedDuration: 20
keywords: ["regex", "regular expressions", "pattern matching", "validation"]
prerequisites: ["CPP-06.01"]
---

# Xử lý Biểu thức Chính quy (std::regex) trong C++11/17

## 1. Khái niệm cốt lõi

**Biểu thức chính quy (Regular Expression - Regex):** Là một chuỗi mẫu đặc biệt dùng để mô tả quy luật của văn bản (ví dụ: định dạng email, số điện thoại, ngày tháng năm).

Thay vì phải viết hàng chục câu lệnh `if` kiểm tra ký tự, `std::regex` cho phép kiểm tra tính hợp lệ hoặc tìm kiếm mẫu chỉ với 1 dòng lệnh.

| Hàm | Mục đích sử dụng |
| :--- | :--- |
| **`std::regex_match`** | Kiểm tra **toàn bộ** chuỗi có khớp đúng 100% với mẫu hay không. |
| **`std::regex_search`** | Tìm kiếm xem trong chuỗi có **chứa** đoạn nào khớp với mẫu không. |

## 2. Cú pháp & Quy tắc hoạt động

### Các ký hiệu mẫu cơ bản:
* `\d`: Khớp một chữ số bất kỳ (0-9).
* `+`: Lặp lại 1 hoặc nhiều lần.
* `[A-Z]`: Một chữ cái in hoa.

## 3. Ví dụ minh họa tinh gọn

Kiểm tra định dạng mã sinh viên (gồm chữ "SV" theo sau là 4 chữ số, ví dụ `SV1234`):

```cpp
#include <regex>
#include <string>

std::string mssv = "SV5678";
// Mẫu: bắt đầu bằng SV, theo sau là đúng 4 chữ số
std::regex mau("SV\\d{4}");

if (std::regex_match(mssv, mau)) {
    std::cout << "Ma sinh vien hop le!";
} else {
    std::cout << "Sai dinh dang!";
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên nhân đôi dấu gạch chéo `\\` trong chuỗi C++**
> * *Nguyên nhân:* Ký tự `\` là ký tự thoát trong chuỗi C++. Để truyền `\d` vào regex, bắt buộc phải viết `\\d` (hoặc dùng raw string `R"(\d)"`).

## 5. Ghi nhớ trọng tâm

- `std::regex` là công cụ mạnh mẽ để kiểm tra định dạng văn bản (Email, SĐT, Mã định danh).
- Dùng `std::regex_match` để kiểm tra độ khớp toàn vẹn của chuỗi.
- Thư viện cần dùng: `#include <regex>`.
