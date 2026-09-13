---
lessonId: JS1-07.03
title: "Tìm kiếm và kiểm tra trong mảng (indexOf, includes, find, some, every)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["includes", "indexOf", "find", "some", "every", "Tìm kiếm mảng"]
prerequisites: ["JS1-07.02"]
---

# Tìm kiếm và kiểm tra trong mảng (indexOf, includes, find, some, every)

## 1. Khái niệm & Vấn đề thực tế
Khi làm việc với danh sách dữ liệu, việc kiểm tra xem một phần tử có tồn tại hay không, tìm vị trí của nó hoặc kiểm định xem tất cả/ít nhất một phần tử có thỏa mãn tiêu chí nào đó là thao tác xảy ra thường xuyên.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Kiểm tra sự tồn tại đơn giản**:
  - `arr.includes(val)`: Trả về `true` nếu mảng chứa `val`, ngược lại `false`.
  - `arr.indexOf(val)`: Trả về chỉ mục index đầu tiên tìm thấy, hoặc `-1` nếu không có.
- **Kiểm tra theo hàm điều kiện (Predicate Function)**:
  - `arr.find(item => condition)`: Trả về **phần tử đầu tiên** thỏa mãn điều kiện (hoặc `undefined` nếu không tìm thấy).
  - `arr.some(item => condition)`: Trả về `true` nếu có **ít nhất một** phần tử thỏa mãn điều kiện.
  - `arr.every(item => condition)`: Trả về `true` khi và chỉ khi **toàn bộ** các phần tử đều thỏa mãn điều kiện.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const scores = [6.5, 8.0, 4.5, 9.5];

// Có bạn nào bị điểm dưới trung bình (< 5.0) không?
const hasFailed = scores.some(score => score < 5.0);
console.log("Có điểm dưới TB:", hasFailed); // true (vì có 4.5)

// Tất cả đều trên 4.0 chứ?
const allAbove4 = scores.every(score => score >= 4.0);
console.log("Tất cả >= 4.0:", allAbove4); // true
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dùng `indexOf` kiểm tra tồn tại**: Trước ES6, người ta phải viết `arr.indexOf(x) !== -1`. Từ ES7 (ES2016), hãy dùng `arr.includes(x)` để mã nguồn trực quan hơn.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `includes()`: Kiểm tra giá trị trực tiếp.
2. `some()`: Ít nhất 1 phần tử thỏa mãn.
3. `every()`: 100% phần tử phải thỏa mãn.
