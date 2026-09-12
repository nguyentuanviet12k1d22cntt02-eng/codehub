---
lessonId: "CPP-01.05"
title: "Bản chất Ép kiểu (Type Casting) và Vấn đề Tràn số (Overflow)"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["type casting", "overflow", "static_cast", "implicit cast"]
prerequisites: ["CPP-01.04"]
---

# Bản chất Ép kiểu (Type Casting) và Vấn đề Tràn số (Overflow)

## 1. Khái niệm cốt lõi

* **Ép kiểu (Type Casting):** Chuyển đổi một giá trị từ kiểu dữ liệu này sang kiểu dữ liệu khác (ví dụ: từ số nguyên `int` sang số thực `double`).
* **Tràn số (Integer Overflow):** Hiện tượng giá trị tính toán vượt quá giới hạn lưu trữ tối đa của kiểu dữ liệu, khiến kết quả bị quay vòng về số âm hoặc số sai lệch hoàn toàn.

| Loại ép kiểu | Cơ chế | Ví dụ |
| :--- | :--- | :--- |
| **Ép kiểu ngầm định (Implicit)** | Trình biên dịch tự động nâng kiểu dữ liệu nhỏ lên kiểu lớn hơn để không làm mất thông tin. | `int` cộng với `double` ➔ Tự động nâng thành `double`. |
| **Ép kiểu tường minh (Explicit)** | Lập trình viên chủ động chỉ thị chuyển đổi kiểu bằng cú pháp `static_cast<Kiểu>(biến)`. | `static_cast<double>(a) / b` để chia ra số thực. |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp ép kiểu chuẩn C++ hiện đại:
```cpp
static_cast<Kiểu_Mới>(giá_trị_cần_chuyển)
```

### Cơ chế tràn số ô nhớ (Hiện tượng đồng hồ quay vòng):
```text
Giả sử kiểu dữ liệu chỉ chứa tối đa giá trị: 2,147,483,647 (giới hạn của int 32-bit).
Nếu bạn lấy: 2,147,483,647 + 1
Kết quả: -2,147,483,648 (Bị tràn sang số âm nhỏ nhất!)

Minh họa vòng tròn:
     [ 0 ] ──► [ 1 ] ──► ... ──► [ Max ]
       ▲                           │ (+1)
       └─────── [ Min Âm ] ◄───────┘
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Dùng `static_cast` để tính trung bình số thực
```cpp
int tongDiem = 15;
int soMon = 2;

// Ép kiểu tongDiem sang double trước khi chia
double diemTB = static_cast<double>(tongDiem) / soMon; // Kết quả: 7.5
```

### Ví dụ 2: Phòng tránh tràn số khi nhân 2 số lớn
```cpp
int a = 1000000;
int b = 1000000;

// Ép kiểu a sang long long trước khi nhân để không bị tràn 32-bit
long long tich = static_cast<long long>(a) * b; // Kết quả: 1,000,000,000,000 (10^12)
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Ép kiểu quá muộn (sau khi phép tính đã bị tràn số)**
> * *Lỗi:* Viết `long long tich = static_cast<long long>(a * b);`.
> * *Nguyên nhân:* Biểu thức `a * b` được tính trước theo kiểu `int`, đã bị tràn số xong xuôi rồi mới ép sang `long long` ➔ Kết quả vẫn sai!
> * *Cách phòng tránh:* Ép kiểu ít nhất một toán hạng **trước** khi nhân: `static_cast<long long>(a) * b`.

> [!WARNING]
> **2. Mất phần thập phân khi ép kiểu từ `double` về `int`**
> * *Hiện tượng:* `static_cast<int>(9.99)` sẽ cho kết quả là `9` (bị chặt bỏ phần thập phân chứ không phải làm tròn).

## 5. Ghi nhớ trọng tâm

- Dùng `static_cast<double>(...)` khi cần thực hiện phép chia ra kết quả số thực từ các biến số nguyên.
- Kiểu `int` chỉ chứa tối đa khoảng 2 tỷ (2 × 10⁹). Khi nhân các số có khả năng vượt 2 tỷ, luôn chuyển sang dùng kiểu `long long`.
- Luôn ép kiểu **trước** khi thực hiện phép toán để ngăn chặn hiện tượng tràn số.
