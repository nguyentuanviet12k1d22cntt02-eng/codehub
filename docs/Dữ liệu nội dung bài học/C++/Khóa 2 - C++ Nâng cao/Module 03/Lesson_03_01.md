---
lessonId: "CPP2-03.01"
title: "Phân tích Cú pháp và Tách từ với std::stringstream"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["stringstream", "parsing", "tokenization", "word split"]
prerequisites: ["CPP-06.01"]
---

# Phân tích Cú pháp và Tách từ với std::stringstream

## 1. Khái niệm cốt lõi

Khi nhận được một chuỗi văn bản dài chứa nhiều từ hoặc nhiều con số cách nhau bởi khoảng trắng (ví dụ: `"10 20 30 40"` hoặc `"Hoc lap trinh C++"`), làm thế nào để tách riêng từng phần tử một cách nhanh chóng?

**`std::stringstream`** trong thư viện `<sstream>` biến một chuỗi văn bản thành một **luồng nhập dữ liệu ảo**, cho phép ta dùng toán tử trích luồng `>>` để hút từng từ hoặc tự động đổi chữ thành số tương tự như khi gõ từ bàn phím với `cin`!

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa cơ chế tách từ:
```text
Chuỗi ban đầu: "Ha Noi 2026"
Đưa vào stringstream ──► [ Luồng ảo: "Ha" "Noi" "2026" ]
ss >> tu1 ──► tu1 = "Ha"
ss >> tu2 ──► tu2 = "Noi"
ss >> nam ──► nam = 2026 (Tự động chuyển thành số nguyên int!)
```

## 3. Ví dụ minh họa tinh gọn

Tách và đếm các từ trong một câu:

```cpp
#include <sstream>
#include <string>

std::string cau = "Lap trinh C++ that thu vi";
std::stringstream ss(cau);

std::string tu;
// Vòng lặp tự động dừng khi đã hút hết các từ trong chuỗi
while (ss >> tu) {
    std::cout << "[" << tu << "]
";
}
// Kết quả in ra từng dòng: [Lap], [trinh], [C++], [that], [thu], [vi]
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Tái sử dụng `stringstream` mà quên gọi `.clear()`**
> * *Lưu ý:* Khi đã đọc hết chuỗi, luồng sẽ bật cờ hiệu kết thúc (`eof`). Nếu muốn nạp chuỗi mới vào để đọc tiếp, bắt buộc phải gọi `ss.clear();` rồi mới `ss.str(chuoiMoi);`.

## 5. Ghi nhớ trọng tâm

- `std::stringstream` là công cụ số 1 để tách từ cách nhau bởi khoảng trắng.
- Tự động chuyển đổi chuỗi thành số: `ss >> soNguyen;`.
- Thư viện cần dùng: `#include <sstream>`.
