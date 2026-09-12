---
lessonId: "CPP2-06.01"
title: "Phép Toán Bit (Bitwise Operations) và Ứng dụng Quản lý Cờ Hiệu (Bitmask)"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["bitwise", "and", "or", "xor", "bit shift", "bitmask"]
prerequisites: ["CPP-01.04"]
---

# Phép Toán Bit (Bitwise Operations) và Ứng dụng Quản lý Cờ Hiệu (Bitmask)

## 1. Khái niệm cốt lõi

Tất cả dữ liệu trong máy tính thực chất đều là các bit nhị phân `0` và `1`. **Toán tử thao tác bit (Bitwise)** cho phép ta can thiệp và tính toán trực tiếp trên từng bit đơn lẻ với tốc độ phần cứng tối đa.

| Phép toán | Ký hiệu | Quy tắc |
| :--- | :---: | :--- |
| **AND** | `&` | Ra `1` khi **cả hai** bit đều là `1` |
| **OR** | `|` | Ra `1` khi **có ít nhất một** bit là `1` |
| **XOR** | `^` | Ra `1` khi **hai bit khác nhau** |
| **Dịch trái** | `<<` | `x << k` tương đương nhân $x 	imes 2^k$ |
| **Dịch phải** | `>>` | `x >> k` tương đương chia $x / 2^k$ |

## 2. Cú pháp & Quy tắc hoạt động

### Ứng dụng Bitmask quản lý cờ hiệu (Flag):
Thay vì tạo 8 biến `bool` tốn 8 byte, ta chỉ cần 1 số nguyên `uint8_t` (1 byte) để quản lý cùng lúc 8 trạng thái khác nhau.

```text
Bit 0: Đang bay
Bit 1: Đang bơi
Bit 2: Bất tử

Bật trạng thái thứ k:   mask |= (1 << k)
Tắt trạng thái thứ k:   mask &= ~(1 << k)
Kiểm tra trạng thái k:  (mask >> k) & 1
```

## 3. Ví dụ minh họa tinh gọn

```cpp
// 1. Kiểm tra số chẵn lẻ bằng bit cuối cùng
int n = 7;
if (n & 1) {
    std::cout << n << " la so le
"; // Bit cuối là 1 -> Số lẻ
}

// 2. Nhân đôi siêu nhanh bằng dịch bit trái
int x = 5;
int nhanHai = x << 1; // 5 * 2 = 10
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm lẫn toán tử bit (`&`, `|`) với toán tử logic (`&&`, `||`)**
> * *Lưu ý:* `&&` và `||` dùng trong câu lệnh điều kiện `if` và có cơ chế đoản mạch. `&` và `|` là tính toán nhị phân trên từng bit.

## 5. Ghi nhớ trọng tâm

- Thao tác bit làm việc trực tiếp trên biểu diễn nhị phân, tốc độ thực thi cực nhanh.
- Phép `n & 1` kiểm tra tính chẵn lẻ hiệu quả.
- Kỹ thuật Bitmask giúp quản lý nhiều trạng thái bật/tắt trong 1 biến duy nhất.
