---
lessonId: "CPP2-05.01"
title: "Khung Thuật toán Chuẩn STL (<algorithm>): std::sort, std::binary_search"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["stl", "algorithm", "sort", "binary_search", "comparator"]
prerequisites: ["CPP-05.02"]
---

# Khung Thuật toán Chuẩn STL (<algorithm>): std::sort, std::binary_search

## 1. Khái niệm cốt lõi

Thư viện `<algorithm>` của C++ chứa hàng loạt thuật toán được tối ưu hóa cực đỉnh, giúp bạn không cần phải tự viết lại các thuật toán cơ bản từ đầu.

| Thuật toán | Độ phức tạp | Tác dụng |
| :--- | :---: | :--- |
| **`std::sort`** | $O(N \log N)$ | Sắp xếp mảng/vector theo thứ tự tăng dần (hoặc theo hàm tự định nghĩa). |
| **`std::binary_search`** | $O(\log N)$ | Kiểm tra sự tồn tại của phần tử trong mảng **đã sắp xếp**. |
| **`std::reverse`** | $O(N)$ | Đảo ngược thứ tự các phần tử. |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp Iterator [begin, end):
Mọi thuật toán STL đều hoạt động trên khoảng nửa mở: từ con trỏ đầu tiên đến **sau** phần tử cuối cùng:
```cpp
std::sort(v.begin(), v.end());         // Sắp xếp vector
std::sort(a, a + n);                   // Sắp xếp mảng tĩnh n phần tử
std::sort(v.begin(), v.end(), greater<int>()); // Sắp xếp giảm dần
```

## 3. Ví dụ minh họa tinh gọn

```cpp
#include <algorithm>
#include <vector>

std::vector<int> a = {5, 2, 8, 1, 9};

// 1. Sắp xếp tăng dần
std::sort(a.begin(), a.end()); // a trở thành: {1, 2, 5, 8, 9}

// 2. Tìm kiếm nhị phân (chỉ áp dụng sau khi ĐÃ sắp xếp!)
bool timThay = std::binary_search(a.begin(), a.end(), 5); // timThay = true
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Dùng `std::binary_search` trên mảng chưa được sắp xếp**
> * *Hậu quả:* Cho kết quả sai lệch hoàn toàn, vì tìm kiếm nhị phân dựa trên tiền đề mảng đã có thứ tự.

## 5. Ghi nhớ trọng tâm

- `#include <algorithm>` cung cấp các thuật toán chuẩn hiệu năng cao.
- `std::sort` chạy cực nhanh với độ phức tạp $O(N \log N)$.
- Luôn sắp xếp dữ liệu trước khi dùng `std::binary_search`.
