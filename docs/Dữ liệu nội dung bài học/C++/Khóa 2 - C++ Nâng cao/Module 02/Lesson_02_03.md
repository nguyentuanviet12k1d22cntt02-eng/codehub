---
lessonId: "CPP2-02.03"
title: "std::pair, std::tuple và Cú pháp Structured Binding trong C++17"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["pair", "tuple", "structured binding", "multiple return values"]
prerequisites: ["CPP-04.01"]
---

# std::pair, std::tuple và Cú pháp Structured Binding trong C++17

## 1. Khái niệm cốt lõi

* **`std::pair`:** Gom 2 giá trị (có thể khác kiểu) thành một cặp duy nhất (như tọa độ `(x, y)`, cặp `(từ_khóa, số_lần_xuất_hiện)`).
* **`std::tuple`:** Mở rộng của pair, cho phép gom từ 3 giá trị trở lên thành một bộ dữ liệu.
* **Structured Binding (C++17):** Cú pháp giúp "mở gói" các phần tử trong pair hoặc tuple ra các biến riêng biệt chỉ bằng 1 dòng code thanh lịch `auto [x, y] = p;`.

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp Structured Binding (C++17):
```text
Cặp:      std::pair<int, string> p = {10, "A"};
Mở gói:   auto [diem, ten] = p; // diem = 10, ten = "A"
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Sử dụng `std::pair` và Structured Binding
```cpp
#include <utility>

std::pair<int, int> toaDo = {3, 5};

// Cú pháp C++17 mở gói trực tiếp
auto [x, y] = toaDo;
std::cout << "x = " << x << ", y = " << y << '
'; // x = 3, y = 5
```

### Ví dụ 2: Hàm trả về nhiều giá trị cùng lúc
```cpp
#include <tuple>

std::tuple<int, double, std::string> thongTin() {
    return {101, 9.2, "Xuat sac"};
}

auto [id, diem, danhGia] = thongTin();
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm lẫn giữa sao chép và tham chiếu khi mở gói**
> * *Lưu ý:* `auto [x, y] = p;` sẽ tạo bản sao. Nếu muốn sửa trực tiếp giá trị trong pair gốc, dùng tham chiếu: `auto& [x, y] = p;`.

## 5. Ghi nhớ trọng tâm

- `std::pair` gom 2 giá trị; `std::tuple` gom nhiều giá trị.
- Cú pháp C++17 `auto [a, b] = p;` giúp code ngắn gọn, không cần dùng `.first` và `.second` phức tạp.
- Rất tiện lợi khi cần một hàm trả về nhiều kết quả cùng lúc.
