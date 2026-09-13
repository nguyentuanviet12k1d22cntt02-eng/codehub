---
lessonId: JS2-10.02
title: "Toán tử lan truyền (Spread Operator ...) cho Array và Object"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Spread Operator", "...", "Gộp mảng", "Hợp nhất Object", "ES6"]
prerequisites: ["JS2-10.01"]
---

# Toán tử lan truyền (Spread Operator ...) cho Array và Object

## 1. Khái niệm & Vấn đề thực tế
Toán tử lan truyền (**Spread Operator `...`**) cho phép "trải phẳng" toàn bộ các phần tử của một mảng hoặc các cặp key-value của một đối tượng vào một mảng hoặc đối tượng mới.

Đây là công cụ chủ chốt giúp viết code theo phong cách **Bất biến (Immutable State)**: tạo dữ liệu mới dựa trên dữ liệu cũ mà không làm biến đổi mảng hay đối tượng gốc.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Trải mảng**:
  ```javascript
  const arr1 = [1, 2];
  const arr2 = [3, 4];
  const mergedArr = [...arr1, ...arr2, 5]; // [1, 2, 3, 4, 5]
  ```
- **Hợp nhất đối tượng**:
  ```javascript
  const defaultSettings = { theme: "light", fontSize: 14 };
  const userSettings = { fontSize: 16 };

  // Thuộc tính xuất hiện sau sẽ ghi đè thuộc tính phía trước
  const finalSettings = { ...defaultSettings, ...userSettings };
  // { theme: "light", fontSize: 16 }
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const numbers = [12, 45, 7, 89];

// Dùng spread để truyền mảng vào hàm Math.max()
const maxVal = Math.max(...numbers);
console.log("Số lớn nhất:", maxVal); // 89
```

- `Math.max()` yêu cầu các đối số riêng lẻ (`Math.max(a, b, c)`). Toán tử `...numbers` đã bóc tách mảng thành các đối số độc lập.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Thứ tự ghi đè khi Spread Object**: Thuộc tính nào đặt phía sau sẽ đè lên thuộc tính phía trước có cùng tên.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `...arr`: Trải phẳng phần tử mảng.
2. `...obj`: Sao chép và hợp nhất thuộc tính đối tượng.
3. Luôn đặt thuộc tính tùy chỉnh phía sau thuộc tính mặc định để ghi đè.
