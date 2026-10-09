---
lessonId: "CPP2-05.03"
title: "Bảng Băm Hiện đại: std::unordered_set và std::unordered_map O(1)"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["hash table", "unordered_set", "unordered_map", "O(1)"]
prerequisites: ["CPP2-05.02"]
---

# Bảng Băm Hiện đại: std::unordered_set và std::unordered_map O(1)

## 1. Khái niệm cốt lõi

Trong khi `set` và `map` thông thường dùng cây cân bằng ($O(\log N)$), **`std::unordered_set`** và **`std::unordered_map`** sử dụng cấu trúc **Bảng băm (Hash Table)**.

Dữ liệu không được sắp xếp theo thứ tự khóa. Với hàm băm và phân bố bucket tốt, tìm kiếm/chèn có độ phức tạp **trung bình $O(1)$**; trường hợp xấu nhất vẫn có thể là $O(N)$.

| Tiêu chí | `std::set` / `std::map` | `std::unordered_set` / `std::unordered_map` |
| :--- | :--- | :--- |
| **Cấu trúc ngầm** | Cây nhị phân cân bằng | Bảng băm (Hash Table) |
| **Thứ tự phần tử** | **Được sắp xếp theo comparator** | **Thứ tự duyệt không được bảo đảm** |
| **Tốc độ tìm kiếm** | $O(\log N)$ | **Trung bình $O(1)$** |
| **Khi nào nên dùng?** | Cần in theo thứ tự hoặc tìm phần tử nhỏ/lớn kế tiếp | Chỉ cần tra cứu nhanh tồn tại hay không |

## 2. Cú pháp & Quy tắc hoạt động

### Cách hoạt động của Hàm băm (Hash Function):
```text
Khóa: "apple" ──► [ Hàm băm ] ──► Tính ra ô nhớ số 4
Khóa: "banana" ──► [ Hàm băm ] ──► Tính ra ô nhớ số 9
(Tìm bucket theo hash; hiệu năng trung bình phụ thuộc hàm băm, load factor và dữ liệu.)
```

## 3. Ví dụ minh họa tinh gọn

```cpp
#include <unordered_map>
#include <string>

std::unordered_map<std::string, int> soLuong;
soLuong["but"] = 5;
soLuong["vo"] = 12;

// Tra cứu siêu tốc độ O(1)
if (soLuong.find("but") != soLuong.end()) {
    std::cout << "Co but trong kho!\\n";
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm tưởng dữ liệu được in ra theo thứ tự thêm vào**
> * *Quy tắc:* `unordered_...` không cam kết thứ tự duyệt hay thứ tự chèn. Rehash có thể làm iterator bị invalidated theo quy tắc của container.

## 5. Ghi nhớ trọng tâm

- `unordered_set` và `unordered_map` có tốc độ tra cứu trung bình $O(1)$, không phải bảo đảm $O(1)$ trong mọi dữ liệu.
- Không có thứ tự duyệt được bảo đảm.
- Chọn chúng khi không cần thứ tự và đặc tính hash phù hợp với bài toán.
