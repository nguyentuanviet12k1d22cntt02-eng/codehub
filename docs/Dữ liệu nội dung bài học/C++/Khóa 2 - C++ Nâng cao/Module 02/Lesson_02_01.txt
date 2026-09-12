---
lessonId: "CPP2-02.01"
title: "std::vector: Cơ chế Cấp phát Động Capacity vs Size và Kỹ thuật reserve()"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["vector", "size", "capacity", "reserve", "dynamic array"]
prerequisites: ["CPP-05.01"]
---

# std::vector: Cơ chế Cấp phát Động Capacity vs Size và Kỹ thuật reserve()

## 1. Khái niệm cốt lõi

Khác với mảng tĩnh `int a[100]` có kích thước cố định, **`std::vector`** là một mảng động thông minh có khả năng **tự động tăng kích thước** khi bạn thêm phần tử mới vào.

Hai khái niệm then chốt cần phân biệt:
* **`size()` (Kích thước):** Số lượng phần tử thực tế đang có trong vector.
* **`capacity()` (Sức chứa):** Số lượng ô nhớ đã được chuẩn bị sẵn trong RAM để chứa dữ liệu trước khi cần cấp phát lại.

## 2. Cú pháp & Quy tắc hoạt động

### Cơ chế tự nhân đôi sức chứa (Doubling Capacity):
Khi `size == capacity` mà bạn thêm 1 phần tử mới:
1. Vector sẽ cấp phát một vùng nhớ mới to gấp đôi (`capacity × 2`).
2. Sao chép toàn bộ phần tử cũ sang vùng nhớ mới.
3. Giải phóng vùng nhớ cũ.

```text
Ban đầu: Capacity = 2, Size = 2  [ 10 | 20 ]
push_back(30):
──► Cấp phát vùng nhớ mới Capacity = 4: [ 10 | 20 | 30 | (trống) ]
```

## 3. Ví dụ minh họa tinh gọn

```cpp
#include <vector>

std::vector<int> v;
v.reserve(1000); // Đặt trước sức chứa 1000 ô nhớ, tránh việc phải cấp phát lại nhiều lần

v.push_back(10);
v.push_back(20);

std::cout << "So phan tu: " << v.size() << '
';       // In ra: 2
std::cout << "Suc chua: " << v.capacity() << '
';     // In ra: 1000
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Dùng `reserve()` nhưng lại gán theo chỉ số `v[i] = x`**
> * *Lỗi:* `v.reserve(10); v[0] = 5;`.
> * *Nguyên nhân:* `reserve()` chỉ tăng sức chứa (capacity), `size` vẫn bằng 0! Việc gán `v[0]` là truy cập ngoài kích thước hợp lệ.
> * *Quy tắc:* Muốn thêm phần tử dùng `push_back(x)`. Muốn gán chỉ số thì dùng `resize(10)` hoặc khởi tạo `std::vector<int> v(10);`.

## 5. Ghi nhớ trọng tâm

- `std::vector` là mảng động tự co giãn linh hoạt, chuẩn mực thay thế mảng tĩnh trong C++.
- Phân biệt: `size()` là số phần tử đang có, `capacity()` là sức chứa khả dụng.
- Dùng `.reserve(n)` khi biết trước số lượng phần tử xấp xỉ để tối ưu tốc độ chạy.
