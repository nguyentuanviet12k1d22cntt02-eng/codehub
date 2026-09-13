---
lessonId: JS1-07.04
title: "Biến đổi và tổng hợp mảng (map, filter, reduce, sort)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["map", "filter", "reduce", "sort", "Higher-Order Function", "Functional Programming"]
prerequisites: ["JS1-07.03"]
---

# Biến đổi và tổng hợp mảng (map, filter, reduce, sort)

## 1. Khái niệm & Vấn đề thực tế
Bộ 4 phương thức `map`, `filter`, `reduce` và `sort` tạo nên linh hồn của phong cách viết code JavaScript hiện đại: thay vì dùng vòng lặp `for` thủ công dài dòng, ta sử dụng các hàm bậc cao để biến đổi dữ liệu một cách trong sáng, biểu cảm (Declarative Programming).

---

## 2. Cú pháp & Quy tắc cốt lõi
1. **`filter(fn)`**: Lọc và trả về mảng mới chỉ chứa các phần tử thỏa mãn hàm điều kiện.
2. **`map(fn)`**: Biến đổi từng phần tử thành một giá trị mới và trả về mảng kết quả có cùng độ dài.
3. **`reduce((acc, cur) => ..., initialVal)`**: Tích lũy toàn bộ mảng thành một giá trị duy nhất (tổng, tích, object gom nhóm).
4. **`sort((a, b) => a - b)`**: Sắp xếp mảng (mặc định JS sắp xếp theo chuỗi UTF-16, do đó muốn sắp xếp số bắt buộc phải truyền comparator `(a, b) => a - b`).

---

## 3. Ví dụ trực quan: Xâu chuỗi phương thức (Chaining)

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

// Lấy các số chẵn, bình phương lên rồi tính tổng
const total = numbers
    .filter(n => n % 2 === 0) // [2, 4, 6]
    .map(n => n * n)          // [4, 16, 36]
    .reduce((sum, n) => sum + n, 0); // 56

console.log("Tổng bình phương các số chẵn:", total); // 56
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lỗi `sort()` không truyền comparator**: `[10, 2, 5].sort()` sẽ cho ra `[10, 2, 5]` vì `"10"` đứng trước `"2"` theo bảng mã ký tự! Luôn viết `arr.sort((a, b) => a - b)`.
- **`sort()` biến đổi trực tiếp mảng gốc**: Nếu không muốn mảng gốc bị đổi vị trí, hãy sao chép trước: `[...arr].sort(...)`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `filter`: lọc bớt phần tử.
2. `map`: biến đổi từng phần tử.
3. `reduce`: gom toàn bộ mảng về 1 giá trị.
4. `sort`: luôn truyền `(a, b) => a - b` khi sắp xếp số.
