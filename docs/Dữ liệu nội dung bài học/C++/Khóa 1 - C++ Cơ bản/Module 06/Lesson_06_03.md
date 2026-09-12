---
lessonId: "CPP-06.03"
title: "Kỹ thuật Duyệt và Biến đổi Chuỗi Ký tự"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["cctype", "toupper", "tolower", "isdigit", "isalpha", "char conversion"]
prerequisites: ["CPP-06.02"]
---

# Kỹ thuật Duyệt và Biến đổi Chuỗi Ký tự

## 1. Khái niệm cốt lõi

Khi xử lý văn bản, các tác vụ thường gặp nhất là: chuẩn hóa chữ hoa/chữ thường, đếm số lượng chữ số, lọc bỏ khoảng trắng thừa.

Thư viện chuẩn **`<cctype>`** cung cấp các hàm xử lý nhanh trên từng ký tự đơn lẻ:

| Hàm | Tác dụng | Ví dụ |
| :--- | :--- | :--- |
| **`isalpha(c)`** | Kiểm tra ký tự `c` có phải chữ cái hay không (A-Z, a-z) | `isalpha('A')` ➔ `true` |
| **`isdigit(c)`** | Kiểm tra ký tự `c` có phải chữ số hay không (0-9) | `isdigit('5')` ➔ `true` |
| **`toupper(c)`** | Chuyển chữ cái thường thành chữ hoa | `toupper('a')` ➔ `'A'` |
| **`tolower(c)`** | Chuyển chữ cái hoa thành chữ thường | `tolower('A')` ➔ `'a'` |

## 2. Cú pháp & Quy tắc hoạt động

### Hai cách duyệt chuỗi trong C++:
```cpp
std::string s = "Hello";

// Cách 1: Duyệt theo chỉ số index thông thường
for (int i = 0; i < s.length(); ++i) {
    char c = s[i];
}

// Cách 2: Duyệt bằng Range-based for (ngắn gọn và trực quan)
for (char c : s) {
    // Biến c lần lượt nhận từng ký tự trong chuỗi s
}
```

Nếu muốn sửa trực tiếp ký tự trong chuỗi khi duyệt bằng range-for, dùng tham chiếu: `for (char& c : s)`.

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Chuyển toàn bộ chuỗi sang chữ hoa
```cpp
std::string s = "xin chao";
for (char& c : s) {
    c = toupper(c); // Sửa trực tiếp ký tự thông qua tham chiếu &
}
// s trở thành: "XIN CHAO"
```

### Ví dụ 2: Chuyển đổi ký tự số thành giá trị số nguyên
```cpp
char ch = '7';
// Ký tự số cách số 0 đúng bằng giá trị thực tế của nó trong bảng mã ASCII
int giaTri = ch - '0'; // giaTri = 7 (số nguyên tính toán được)
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm lẫn giữa ký tự số `'0'` và số nguyên `0`**
> * *Lỗi:* Ký tự `'0'` trong bảng mã ASCII có mã là `48`, không phải `0`!
> * *Quy tắc:* Để đổi một ký tự số `c` sang số nguyên tương ứng, luôn trừ đi ký tự `'0'`: `int so = c - '0';`.

## 5. Ghi nhớ trọng tâm

- Thư viện `#include <cctype>` cung cấp các công cụ kiểm tra và biến đổi ký tự (`isalpha`, `isdigit`, `toupper`, `tolower`).
- Dùng vòng lặp `for (char& c : s)` để biến đổi từng ký tự trong chuỗi một cách thanh lịch.
- Kỹ thuật chuyển đổi ký tự số sang số nguyên: `c - '0'`.
