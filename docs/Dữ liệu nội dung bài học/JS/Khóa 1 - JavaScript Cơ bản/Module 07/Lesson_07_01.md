---
lessonId: JS1-07.01
title: "Khởi tạo mảng, chỉ mục index và thuộc tính length"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Array", "Mảng", "index", "length", "Cấu trúc dữ liệu"]
prerequisites: ["JS1-06.04"]
---

# Khởi tạo mảng, chỉ mục index và thuộc tính length

## 1. Khái niệm & Vấn đề thực tế
Mảng (Array) là cấu trúc dữ liệu có thứ tự dùng để lưu trữ một danh sách các phần tử. Trong JavaScript, mảng là mảng động (kích thước tự co giãn) và có thể chứa hỗn hợp nhiều kiểu dữ liệu khác nhau.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Khởi tạo mảng bằng cú pháp mảng nguyên mẫu (Array Literal)**:
  ```javascript
  const fruits = ["Táo", "Cam", "Xoài"];
  const numbers = [10, 20, 30, 40];
  ```
- **Chỉ mục (Zero-based Index)**: Phần tử đầu tiên có chỉ mục `0`, phần tử thứ hai có chỉ mục `1`,...
- **Thuộc tính `length`**: Trả về tổng số phần tử đang có trong mảng.
- **Phần tử cuối cùng**: Luôn nằm ở chỉ mục `arr[arr.length - 1]`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const scores = [8.5, 9.0, 7.5, 10.0];

console.log("Số lượng điểm:", scores.length);       // 4
console.log("Điểm đầu tiên:", scores[0]);           // 8.5
console.log("Điểm cuối cùng:", scores[scores.length - 1]); // 10.0
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Truy cập chỉ mục ngoài phạm vi**: Trong JS, nếu truy cập `scores[100]` khi mảng chỉ có 4 phần tử, chương trình **không báo lỗi IndexOutOfBounds** mà trả về giá trị `undefined`.
- **Gán `arr.length = 0`**: Kỹ thuật này sẽ xóa sạch toàn bộ phần tử trong mảng ngay lập tức.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Mảng bắt đầu từ vị trí index `0`.
2. Phần tử cuối cùng là `arr[arr.length - 1]`.
3. Truy cập index không tồn tại trả về `undefined`.
