---
lessonId: JS1-05.04
title: "Vòng lặp lồng nhau (Nested Loops) & Cú pháp for...of cơ bản"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Nested loops", "for...of", "Ma trận", "Duyệt chuỗi", "ES6"]
prerequisites: ["JS1-05.03"]
---

# Vòng lặp lồng nhau (Nested Loops) & Cú pháp for...of cơ bản

## 1. Khái niệm & Vấn đề thực tế
Khi thao tác với dữ liệu đa chiều (bảng dữ liệu, ma trận 2D, tọa độ lưới) hoặc in các hình mẫu ký tự, ta cần đặt một vòng lặp bên trong một vòng lặp khác (**Nested Loops**).
Bên cạnh đó, ES6 cung cấp cú pháp `for...of` giúp duyệt qua từng giá trị của các đối tượng có thể lặp (Iterable: chuỗi, mảng) một cách cực kỳ trong sáng.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Vòng lặp lồng nhau**:
  - Với mỗi một bước lặp của vòng lặp ngoài (hàng), vòng lặp trong (cột) sẽ chạy trọn vẹn toàn bộ chu kỳ của nó.
- **Cú pháp `for...of`**:
  ```javascript
  for (const item of iterable) {
      // Sử dụng item trực tiếp mà không cần index
  }
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Duyệt từng ký tự trong chuỗi bằng for...of
const message = "MCODE";
for (const char of message) {
    console.log(char);
}
```

- Không cần dùng biến đếm `i` hay truy cập `message[i]`, `for...of` tự động trích xuất từng ký tự một.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Độ phức tạp thời gian ($O(N^2)$)**: Vòng lặp lồng nhau chạy theo cấp số nhân số bước tính. Hãy cẩn thận khi $N$ lớn.
- **Trùng tên biến đếm**: Vòng lặp ngoài thường đặt là `i`, vòng lặp trong đặt là `j`. Tránh dùng chung tên biến `i`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Vòng lặp lồng nhau dùng để xử lý dữ liệu 2 chiều (hàng và cột).
2. Dùng `for (const x of arr/str)` để đọc trực tiếp từng giá trị.
