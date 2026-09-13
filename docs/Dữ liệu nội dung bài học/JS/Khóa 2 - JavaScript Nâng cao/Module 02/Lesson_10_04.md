---
lessonId: JS2-10.04
title: "Shorthand Properties & Computed Property Names trong ES6"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Shorthand Properties", "Computed Property Names", "Object enhancements", "ES6"]
prerequisites: ["JS2-10.03"]
---

# Shorthand Properties & Computed Property Names trong ES6

## 1. Khái niệm & Vấn đề thực tế
Khi khởi tạo Object từ các biến có sẵn, việc lặp lại `{ name: name, age: age }` rất dư thừa.
ES6 mang đến hai cải tiến cú pháp xuất sắc:
1. **Property Value Shorthand**: Khi tên thuộc tính trùng với tên biến, chỉ cần viết `{ name, age }`.
2. **Computed Property Names**: Cho phép đặt tên thuộc tính bằng một biểu thức tính toán động đặt trong cặp ngoặc vuông `[expression]` ngay tại thời điểm khởi tạo Object Literal.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Shorthand property**:
  ```javascript
  const username = "viet";
  const role = "admin";
  const user = { username, role }; // Tự hiểu là { username: "viet", role: "admin" }
  ```
- **Computed Property Names**:
  ```javascript
  const dynamicKey = "score_" + 2026;
  const record = {
      id: 1,
      [dynamicKey]: 95 // Tên thuộc tính được tính toán động
  };
  // record = { id: 1, score_2026: 95 }
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const field = "language";
const langName = "JavaScript";

const course = {
    title: "Web Core",
    [field]: langName // Khởi tạo thuộc tính động 'language': 'JavaScript'
};

console.log(course.language); // "JavaScript"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên dấu ngoặc vuông khi tính toán key**: Viết `{ field: langName }` sẽ tạo ra thuộc tính mang tên chữ `"field"` thay vì giá trị của biến `field`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Tên biến trùng tên key: viết tắt `{ varName }`.
2. Tên key động: bọc trong ngoặc vuông `{[expr]: value}`.
