---
lessonId: "CPP-06.01"
title: "Bản chất Chuỗi ký tự: Phân biệt C-string và std::string Hiện đại"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["string", "c-string", "null-terminator", "std::string"]
prerequisites: ["CPP-05.01"]
---

# Bản chất Chuỗi ký tự: Phân biệt C-string và std::string Hiện đại

## 1. Khái niệm cốt lõi

Trong máy tính, văn bản là một tập hợp các ký tự nối tiếp nhau (tên người, địa chỉ, lời nhắn...). C++ có hai cách tiếp cận để lưu trữ chuỗi ký tự:

* **Chuỗi kiểu C (C-string):** Là một mảng ký tự `char[]` thuần túy, kết thúc bằng một ký tự đặc biệt gọi là **Ký tự rỗng kết thúc (`'\0'` - Null-terminator)**. Dễ bị tràn bộ nhớ nếu quản lý không cẩn thận.
* **Chuỗi hiện đại (`std::string`):** Là một kiểu dữ liệu thông minh trong thư viện chuẩn `<string>`. Nó tự động co giãn kích thước, tự quản lý bộ nhớ và hỗ trợ các phép toán tự nhiên như cộng chuỗi `+`, so sánh bằng `==`.

| Tiêu chí | C-string (`char[]`) | `std::string` Hiện đại |
| :--- | :--- | :--- |
| **Khai báo** | `char s[50] = "Hello";` | `std::string s = "Hello";` |
| **Quản lý bộ nhớ** | Kích thước cố định, dễ tràn | **Tự động mở rộng khi chuỗi dài thêm** |
| **Nối chuỗi** | Phải dùng hàm `strcat` phức tạp | **Dùng dấu cộng: `s1 + s2`** |
| **Mức độ khuyên dùng** | Hạn chế dùng (chỉ khi làm việc hệ thống cũ) | **Tiêu chuẩn mặc định trong lập trình C++** |

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa cấu trúc chuỗi trong bộ nhớ:
```text
C-string: char s[] = "C++";
RAM:  [ 'C' ] [ '+' ] [ '+' ] [ '\0' ]  ──► Bắt buộc phải có '\0' ở cuối để biết điểm dừng

std::string: std::string s = "C++";
Tự động quản lý độ dài (length = 3), tự động cấp phát bộ nhớ an toàn.
```

## 3. Ví dụ minh họa tinh gọn

```cpp
#include <string>

std::string ho = "Nguyen";
std::string ten = "An";

// Phép nối chuỗi bằng dấu cộng +
std::string hoTen = ho + " " + ten; // "Nguyen An"

// Lấy độ dài chuỗi
int doDai = hoTen.length(); // doDai = 9
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Dùng `std::cin >> s` bị mất chữ sau dấu cách (khoảng trắng)**
> * *Hiện tượng:* Người dùng nhập `"Nguyen Van A"` nhưng `std::cin >> s` chỉ nhận được `"Nguyen"`.
> * *Nguyên nhân:* `cin >>` coi dấu cách và phím Enter là điểm kết thúc của một từ.
> * *Cách khắc phục:* Khi muốn đọc cả dòng có chứa dấu cách, dùng hàm `std::getline(std::cin, s);`.

> [!WARNING]
> **2. Quên xóa ký tự trôi dòng khi dùng `getline` sau `cin >>`**
> * *Hiện tượng:* Sau khi nhập số bằng `cin >> n;`, gọi ngay `getline(cin, s);` thì `s` bị rỗng.
> * *Cách sửa:* Thêm `std::cin.ignore();` sau lệnh `cin >> n` để loại bỏ phím Enter còn sót lại trong bộ đệm.

## 5. Ghi nhớ trọng tâm

- Luôn dùng `std::string` (thay vì mảng `char[]`) cho mọi thao tác văn bản trong C++.
- Dùng dấu cộng `+` để nối chuỗi một cách tự nhiên.
- Dùng `std::cin >> s` để đọc 1 từ; dùng `std::getline(std::cin, s)` để đọc cả dòng có dấu cách.
