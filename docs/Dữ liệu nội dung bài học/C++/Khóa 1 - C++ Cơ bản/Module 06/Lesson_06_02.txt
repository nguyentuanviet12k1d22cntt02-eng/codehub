---
lessonId: "CPP-06.02"
title: "Các Thao tác và Phương thức Chuẩn trên std::string"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["string methods", "substr", "find", "length", "size", "push_back"]
prerequisites: ["CPP-06.01"]
---

# Các Thao tác và Phương thức Chuẩn trên std::string

## 1. Khái niệm cốt lõi

Đối tượng `std::string` cung cấp sẵn rất nhiều công cụ hữu ích (gọi là phương thức thành viên) để tìm kiếm, cắt ghép và kiểm tra chuỗi mà không cần phải tự viết vòng lặp thủ công.

| Phương thức | Tác dụng | Ví dụ |
| :--- | :--- | :--- |
| **`.length()` / `.size()`** | Trả về số lượng ký tự trong chuỗi | `"Code".length()` ➔ `4` |
| **`.empty()`** | Kiểm tra chuỗi có rỗng hay không | Trả về `true` nếu chuỗi không có ký tự nào |
| **`.substr(pos, len)`** | Cắt chuỗi con từ vị trí `pos` lấy `len` ký tự | `"LapTrinh".substr(0, 3)` ➔ `"Lap"` |
| **`.find(sub)`** | Tìm vị trí xuất hiện đầu tiên của chuỗi con `sub` | Trả về chỉ số vị trí, hoặc `std::string::npos` nếu không thấy |
| **`.push_back(ch)`** | Thêm 1 ký tự vào cuối chuỗi | `s.push_back('!')` |
| **`.pop_back()`** | Xóa ký tự cuối cùng của chuỗi | `s.pop_back()` |

## 2. Cú pháp & Quy tắc hoạt động

### Chỉ số ký tự trong chuỗi (Index bắt đầu từ 0):
```text
Chuỗi:      " H   E   L   L   O "
Chỉ số:       0   1   2   3   4

s[0] là 'H'
s[4] là 'O'
s.substr(1, 3) bắt đầu từ index 1 lấy 3 ký tự ──► "ELL"
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Cắt chuỗi con với `substr`
```cpp
std::string email = "sinhvien@gmail.com";
std::string tenMien = email.substr(9, 9); // Bắt đầu từ vị trí 9, lấy 9 ký tự -> "gmail.com"
```

### Ví dụ 2: Tìm kiếm chuỗi con với `find`
```cpp
std::string s = "Hoc lap trinh C++";
int pos = s.find("C++");

if (pos != std::string::npos) {
    std::cout << "Tim thay tai vi tri: " << pos; // In ra: 14
} else {
    std::cout << "Khong tim thay";
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. So sánh kết quả của `.find()` với `-1` thay vì `std::string::npos`**
> * *Giải thích:* Phương thức `.find()` trả về kiểu số nguyên không dấu `size_t`. Giá trị đại diện cho "không tìm thấy" là hằng số `std::string::npos`.
> * *Quy tắc chuẩn:* Luôn kiểm tra `if (s.find(...) != std::string::npos)`.

> [!WARNING]
> **2. Nhầm lẫn tham số của `.substr(pos, len)`**
> * *Lưu ý:* Tham số thứ hai là **độ dài cần lấy (length)**, không phải là chỉ số kết thúc!

## 5. Ghi nhớ trọng tâm

- Ký tự trong chuỗi được đánh số từ `0` đến `s.length() - 1`.
- Dùng `s.substr(vị_trí, số_ký_tự)` để trích xuất chuỗi con.
- Dùng `s.find()` và so sánh với `std::string::npos` để kiểm tra sự tồn tại của từ khóa.
