---
lessonId: "CPP-01.04"
title: "Hệ thống Toán tử Số học, Gán và Toán tử Tăng/Giảm"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["operator", "arithmetic", "modulo", "increment", "decrement"]
prerequisites: ["CPP-01.03"]
---

# Hệ thống Toán tử Số học, Gán và Toán tử Tăng/Giảm

## 1. Khái niệm cốt lõi

**Toán tử (Operator)** là các ký hiệu đại diện cho một phép xử lý cụ thể trên các giá trị (gọi là toán hạng). C++ hỗ trợ đầy đủ các phép tính từ số học cơ bản đến các phép tăng giảm tiện lợi.

| Phép toán | Ký hiệu | Ví dụ | Ý nghĩa |
| :--- | :---: | :--- | :--- |
| **Cộng, Trừ, Nhân** | `+`, `-`, `*` | `5 + 2 = 7` | Phép tính thông thường. |
| **Chia lấy nguyên** | `/` | `7 / 2 = 3` | Hai số nguyên chia nhau sẽ bỏ phần thập phân. |
| **Chia lấy dư** | `%` | `7 % 2 = 1` | Phép toán Modulo (chỉ áp dụng cho số nguyên). |
| **Tăng/Giảm 1 đơn vị** | `++`, `--` | `x++` hoặc `++x` | Tương đương `x = x + 1`. |
| **Toán tử gán kết hợp**| `+=`, `-=`, `*=` | `x += 5` | Tương đương `x = x + 5`. |

## 2. Cú pháp & Quy tắc hoạt động

### Phân biệt Tiền tố (`++x`) và Hậu tố (`x++`):
```text
++x (Tiền tố - Pre-increment):   Tăng giá trị x lên 1 TRƯỚC, rồi mới dùng giá trị mới.
x++ (Hậu tố - Post-increment):  Lấy giá trị hiện tại của x để DÙNG TRƯỚC, xong mới tăng x lên 1.
```

### Minh họa trực quan:
```text
Giả sử a = 5;
b = ++a;  ──► Bước 1: a tăng lên 6  ──► Bước 2: b nhận giá trị 6  (Cả a và b đều là 6)

Giả sử a = 5;
b = a++;  ──► Bước 1: b nhận giá trị 5  ──► Bước 2: a mới tăng lên 6  (b là 5, a là 6)
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Phép chia lấy nguyên và chia lấy dư
```cpp
int tongKẹo = 14;
int soBan = 4;

int moiBan = tongKẹo / soBan; // Kết quả: 3 (mỗi bạn được 3 cái kẹo)
int conDu = tongKẹo % soBan;  // Kết quả: 2 (dư 2 cái kẹo)
```

### Ví dụ 2: Toán tử gán rút gọn
```cpp
int tong = 100;
tong += 25; // Tương đương: tong = tong + 25; -> tong = 125
tong -= 10; // Tương đương: tong = tong - 10; -> tong = 115
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Bẫy chia nguyên khi muốn tính số thực**
> * *Lỗi:* Viết `double tiLe = 1 / 2;` ➔ Kết quả ra `0.0` chứ không phải `0.5`!
> * *Nguyên nhân:* Cả `1` và `2` đều là số nguyên, nên phép chia `1 / 2` cho kết quả nguyên là `0`.
> * *Cách phòng tránh:* Viết ít nhất một toán hạng dưới dạng số thực: `double tiLe = 1.0 / 2;` ➔ Kết quả ra `0.5`.

> [!WARNING]
> **2. Lỗi chia cho số 0 (Division by Zero)**
> * *Hậu quả:* Máy tính không thể thực hiện phép chia cho 0, chương trình sẽ bị sập ngay lập tức (Crash / Runtime Error).
> * *Cách phòng tránh:* Luôn kiểm tra mẫu số khác 0 trước khi thực hiện phép chia hoặc lấy dư `%`.

## 5. Ghi nhớ trọng tâm

- Phép chia hai số nguyên `/` luôn loại bỏ phần thập phân (lấy phần nguyên).
- Phép `%` chỉ dùng cho số nguyên và rất hữu ích để kiểm tra tính chẵn lẻ (`n % 2 == 0`) hoặc chia nhóm.
- Khi viết độc lập trên một dòng lệnh, `i++` và `++i` đều có tác dụng làm biến tăng thêm 1 đơn vị.
