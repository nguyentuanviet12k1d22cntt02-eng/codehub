---
lessonId: "CPP2-02.02"
title: "Ma trận Động 2D Linh hoạt với std::vector lồng nhau"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["2d vector", "dynamic matrix", "jagged array"]
prerequisites: ["CPP2-02.01", "CPP-07.01"]
---

# Ma trận Động 2D Linh hoạt với std::vector lồng nhau

## 1. Khái niệm cốt lõi

Khi số hàng và số cột chỉ được biết trong lúc người dùng nhập vào (chạy chương trình), mảng 2D tĩnh `int a[100][100]` sẽ gây lãng phí bộ nhớ hoặc không đủ chỗ nếu $R, C$ quá lớn.

**`std::vector<std::vector<T>>`** là ma trận động: một vector chứa các vector con, cho phép khởi tạo kích thước $R 	imes C$ chính xác tuyệt đối trong lúc chạy.

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp khởi tạo ma trận $R$ hàng, $C$ cột với giá trị mặc định:
```cpp
std::vector<std::vector<int>> matrix(R, std::vector<int>(C, gia_tri_mac_dinh));
```

Truy xuất phần tử hoàn toàn tương tự mảng 2D thông thường: `matrix[i][j]`.

## 3. Ví dụ minh họa tinh gọn

Khởi tạo ma trận động $3 	imes 4$ với các ô ban đầu đều bằng 0:

```cpp
#include <vector>

int R = 3, C = 4;
// Khởi tạo ma trận 3 hàng, mỗi hàng là vector 4 phần tử mang giá trị 0
std::vector<std::vector<int>> a(R, std::vector<int>(C, 0));

a[1][2] = 99; // Gán giá trị tại hàng 1, cột 2

// Duyệt ma trận bằng range-based for
for (const auto& row : a) {
    for (int val : row) {
        std::cout << val << ' ';
    }
    std::cout << '
';
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Chưa khởi tạo kích thước các hàng mà đã truy cập `matrix[i][j]`**
> * *Lỗi:* Khai báo `std::vector<std::vector<int>> a(R);` nhưng chưa gán kích thước cột cho từng hàng mà đã viết `a[0][0] = 5;`.
> * *Khắc phục:* Luôn chỉ định kích thước cột khi khởi tạo: `(R, std::vector<int>(C))`.

## 5. Ghi nhớ trọng tâm

- `std::vector<std::vector<int>>` cho phép tạo ma trận động có kích thước linh hoạt theo yêu cầu.
- Cú pháp khởi tạo chuẩn: `matrix(R, std::vector<int>(C, 0))`.
- Lấy số hàng bằng `matrix.size()`, số cột bằng `matrix[0].size()`.
