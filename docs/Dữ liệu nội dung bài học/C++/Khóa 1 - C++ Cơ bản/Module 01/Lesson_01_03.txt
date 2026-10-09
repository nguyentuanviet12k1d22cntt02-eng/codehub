---
lessonId: "CPP-01.03"
title: "Hệ thống Biến, Hằng số (const) và Các Kiểu dữ liệu Nguyên thủy"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["variable", "const", "int", "double", "char", "bool", "datatype"]
prerequisites: ["CPP-01.02"]
---

# Hệ thống Biến, Hằng số (const) và Các Kiểu dữ liệu Nguyên thủy

## 1. Khái niệm cốt lõi

* **Biến (Variable):** Một ô nhớ trong bộ nhớ RAM được đặt tên để lưu trữ giá trị, và giá trị này có thể thay đổi trong quá trình chạy chương trình.
* **Hằng số (`const`):** Ô nhớ có giá trị cố định, một khi đã khởi tạo thì không được phép thay đổi.
* **Kiểu dữ liệu (Data Type):** Quy định kích thước bộ nhớ cần cấp phát và loại giá trị được phép chứa trong ô nhớ (số nguyên, số thực, ký tự...).

| Kiểu dữ liệu | Kích thước thường gặp trên máy 64-bit | Phạm vi giá trị thường gặp | Ứng dụng tiêu biểu |
| :--- | :---: | :--- | :--- |
| **`int`** | thường 4 byte | thường khoảng -2 tỷ đến +2 tỷ | Đếm số lượng, chỉ số vòng lặp. |
| **`long long`** | ít nhất 8 byte | ít nhất khoảng -9 × 10¹⁸ đến +9 × 10¹⁸ | Bài toán số lớn, tính giai thừa, lũy thừa. |
| **`double`** | thường 8 byte | thường có khoảng 15 chữ số chính xác | Số đo thực tế; tiền tệ cần kiểu/chiến lược phù hợp miền bài toán. |
| **`char`** | 1 byte C++ | một đơn vị mã; không đồng nghĩa luôn là một ký tự Unicode | Ký tự byte và dữ liệu văn bản mức thấp. |
| **`bool`** | phụ thuộc implementation | chỉ nhận `true` hoặc `false` | Trạng thái cờ hiệu, điều kiện logic. |

> Kích thước thực tế của nhiều kiểu phụ thuộc compiler và nền tảng. Khi kích thước là yêu cầu của bài toán, hãy kiểm tra bằng `sizeof`, `std::numeric_limits` hoặc dùng kiểu có độ rộng xác định trong `<cstdint>` như `std::int32_t` khi kiểu đó tồn tại.

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp khai báo:
```cpp
kiểu_dữ_liệu tên_biến = giá_trị_ban_đầu;
const kiểu_dữ_liệu TÊN_HẰNG_SỐ = giá_trị_cố_định;
```

### Minh họa ô nhớ trong RAM:
```text
Khai báo: int tuoi = 18;
Trong RAM: [ Ô nhớ có kích thước do implementation quyết định ] ──► Lưu giá trị: 18

Khai báo: const double PI = 3.14;
Trong RAM: [ Đối tượng double ]   ──► Không thể gán lại qua tên PI sau khi khởi tạo
```

## 3. Ví dụ minh họa tinh gọn

```cpp
int tuoi = 16;
double diemTrungBinh = 8.75;
char hangTotNghiep = 'A';
bool daDauKyThi = true;

const double TI_LE_THUE = 0.1; // Hằng số: không thể gán lại TI_LE_THUE = 0.15
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Sử dụng biến chưa khởi tạo giá trị ban đầu**
> * *Lỗi:* Viết `int sum; sum = sum + 5;`.
> * *Hậu quả:* Biến `sum` sẽ mang giá trị rác ngẫu nhiên còn sót lại trong ô RAM, dẫn đến kết quả sai hoàn toàn.
> * *Cách phòng tránh:* Luôn gán giá trị mặc định khi khai báo: `int sum = 0;`.

> [!WARNING]
> **2. Nhầm lẫn giữa dấu nháy đơn `' '` và nháy kép `" "`**
> * *Quy tắc:* Dấu nháy đơn `'A'` dành cho kiểu `char` (1 ký tự). Dấu nháy kép `"A"` là chuỗi ký tự (String). Không được viết `char c = "A";`.

## 5. Ghi nhớ trọng tâm

- Chọn kiểu dữ liệu phù hợp với nhu cầu: `int` cho số nguyên thông thường, `long long` khi giá trị vượt 2 tỷ, `double` cho số thực.
- Luôn khởi tạo giá trị ban đầu cho biến ngay khi khai báo.
- Dùng từ khóa `const` để bảo vệ các giá trị không được phép thay đổi.
