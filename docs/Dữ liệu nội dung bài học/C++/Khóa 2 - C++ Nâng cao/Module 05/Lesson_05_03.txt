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

Dữ liệu không được sắp xếp theo thứ tự, nhưng tốc độ tìm kiếm và chèn đạt mức trung bình **tức thì $O(1)$**!

| Tiêu chí | `std::set` / `std::map` | `std::unordered_set` / `std::unordered_map` |
| :--- | :--- | :--- |
| **Cấu trúc ngầm** | Cây nhị phân cân bằng | Bảng băm (Hash Table) |
| **Thứ tự phần tử** | **Luôn sắp xếp tăng dần** | **Thứ tự ngẫu nhiên (không sắp xếp)** |
| **Tốc độ tìm kiếm** | $O(\log N)$ | **Trung bình $O(1)$** |
| **Khi nào nên dùng?** | Cần in theo thứ tự hoặc tìm phần tử nhỏ/lớn kế tiếp | Chỉ cần tra cứu nhanh tồn tại hay không |

## 2. Cú pháp & Quy tắc hoạt động

### Cách hoạt động của Hàm băm (Hash Function):
```text
Khóa: "apple" ──► [ Hàm băm ] ──► Tính ra ô nhớ số 4
Khóa: "banana" ──► [ Hàm băm ] ──► Tính ra ô nhớ số 9
(Truy cập thẳng vào ô nhớ chỉ trong 1 bước duy nhất O(1))
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
    std::cout << "Co but trong kho!
";
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm tưởng dữ liệu được in ra theo thứ tự thêm vào**
> * *Quy tắc:* `unordered_...` lưu theo giá trị băm ngẫu nhiên, hoàn toàn không đảm bảo thứ tự ban đầu.

## 5. Ghi nhớ trọng tâm

- `unordered_set` và `unordered_map` có tốc độ tra cứu trung bình $O(1)$.
- Không duy trì thứ tự phần tử.
- Là lựa chọn tối ưu nhất khi bài toán đòi hỏi tốc độ kiểm tra tồn tại nhanh nhất có thể.
