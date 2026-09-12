---
lessonId: "CPP2-05.02"
title: "Cấu trúc Cây Đỏ-Đen: std::set, std::map và Độ phức tạp O(log N)"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["set", "map", "red-black tree", "unique", "sorted"]
prerequisites: ["CPP2-05.01"]
---

# Cấu trúc Cây Đỏ-Đen: std::set, std::map và Độ phức tạp O(log N)

## 1. Khái niệm cốt lõi

* **`std::set` (Tập hợp):** Lưu trữ các phần tử **không trùng lặp** và **tự động sắp xếp tăng dần**.
* **`std::map` (Ánh xạ / Từ điển):** Lưu trữ các cặp **Khóa - Giá trị (`Key - Value`)**, trong đó mỗi khóa là duy nhất và được tự động sắp xếp.
* **Bản chất cấu trúc ngầm:** Cả `set` và `map` đều được xây dựng trên cấu trúc Cây tìm kiếm nhị phân cân bằng (Cây Đỏ-Đen), giúp mọi thao tác tìm kiếm, chèn, xóa đều đạt tốc độ $O(\log N)$.

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa tính chất không trùng lặp và tự sắp xếp:
```text
Thêm lần lượt: 5, 2, 8, 2, 1 vào std::set
Kết quả lưu trong cây: { 1, 2, 5, 8 } (Số 2 trùng lặp bị tự động loại bỏ)
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Loại bỏ trùng lặp với `std::set`
```cpp
#include <set>

std::set<int> s;
s.insert(10);
s.insert(5);
s.insert(10); // Bị bỏ qua vì 10 đã tồn tại

for (int x : s) std::cout << x << ' '; // In ra theo thứ tự: 5 10
```

### Ví dụ 2: Đếm tần suất với `std::map`
```cpp
#include <map>

std::map<std::string, int> diem;
diem["An"] = 9;
diem["Binh"] = 8;

std::cout << "Diem cua An: " << diem["An"]; // In ra: 9
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Truy cập `map[key]` tự động tạo mới phần tử**
> * *Lưu ý:* Nếu `key` chưa tồn tại, câu lệnh `map[key]` sẽ tự động chèn một phần tử mới với giá trị mặc định (0 hoặc rỗng). Để kiểm tra mà không tạo mới, dùng `map.find(key) != map.end()`.

## 5. Ghi nhớ trọng tâm

- `std::set`: Tập hợp các giá trị phân biệt, tự động sắp xếp.
- `std::map`: Ánh xạ Khóa ➔ Giá trị.
- Mọi thao tác tìm, thêm, xóa đều có độ phức tạp an toàn $O(\log N)$.
