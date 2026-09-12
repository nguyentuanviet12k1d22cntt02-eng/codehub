---
lessonId: "CPP-01.02"
title: "Cấu trúc chương trình C++ chuẩn C++17 và Thao tác I/O cơ bản"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["iostream", "cout", "cin", "endl", "std", "input", "output"]
prerequisites: ["CPP-01.01"]
---

# Cấu trúc chương trình C++ chuẩn C++17 và Thao tác I/O cơ bản

## 1. Khái niệm cốt lõi

**I/O (Input/Output - Nhập/Xuất)** là cách thức duy nhất để chương trình giao tiếp với thế giới bên ngoài:
- **Input (Nhập):** Đón nhận dữ liệu người dùng gõ từ bàn phím.
- **Output (Xuất):** Hiển thị kết quả ra màn hình.

Trong C++, dữ liệu nhập xuất được xem như một **dòng chảy (Stream)** liên tục. Dữ liệu từ bàn phím chảy vào biến, và dữ liệu từ biến chảy ra màn hình.

| Công cụ | Chiều dữ liệu | Ý nghĩa |
| :--- | :---: | :--- |
| **`std::cin`** | `Bàn phím >> Biến` | Nhận dữ liệu từ người dùng và lưu vào biến. |
| **`std::cout`** | `Màn hình << Dữ liệu` | Đẩy dữ liệu hoặc chuỗi chữ ra màn hình. |
| **`'
'`** | Xuống dòng | Chuyển con trỏ hiển thị sang dòng mới. |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp Nhập / Xuất:
```text
Xuất ra màn hình:  std::cout << giá_trị_1 << giá_trị_2;
Nhập từ bàn phím:  std::cin  >> tên_biến_1 >> tên_biến_2;
```

### Minh họa chiều mũi tên luồng dữ liệu:
```text
Xuất dữ liệu:  std::cout  <<===  "Ket qua: "  <<===  tong;
               (Màn hình)       (Dữ liệu đẩy sang trái)

Nhập dữ liệu:  std::cin   ===>>  soA          ===>>  soB;
               (Bàn phím)       (Dữ liệu rót sang phải vào biến)
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: In nhiều giá trị cùng lúc (Stream Chaining)
```cpp
int diem = 10;
std::cout << "Ket qua: " << diem << " diem" << '
';
// Kết quả hiển thị trên màn hình: Ket qua: 10 diem
```

### Ví dụ 2: Nhập liên tiếp nhiều biến
```cpp
int x, y;
std::cin >> x >> y; // Người dùng có thể gõ: 5 10 rồi ấn Enter
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm lẫn chiều dấu mũi tên `<<` và `>>`**
> * *Lỗi:* Viết `std::cin << x;` hoặc `std::cout >> x;`.
> * *Cách nhớ:* Hãy nhìn chiều mũi tên: Với `cout`, dữ liệu đi **vào** màn hình (`<<`). Với `cin`, dữ liệu từ bàn phím rót **vào** biến (`>>`).

> [!WARNING]
> **2. Lạm dụng `std::endl` thay vì `'
'`**
> * *Nguyên nhân:* `std::endl` ngoài việc xuống dòng còn ép máy tính xả bộ đệm (flush buffer) ngay lập tức, làm chương trình chạy chậm đáng kể khi lặp nhiều lần.
> * *Cách phòng tránh:* Luôn dùng `'
'` để xuống dòng nhanh và gọn.

## 5. Ghi nhớ trọng tâm

- Thư viện tiêu chuẩn cho nhập xuất là `#include <iostream>`.
- `std::cout << ...` dùng để in dữ liệu ra màn hình.
- `std::cin >> ...` dùng để nhận dữ liệu từ bàn phím vào biến.
- Dùng ký tự `'
'` để xuống dòng hiệu quả và tối ưu.
