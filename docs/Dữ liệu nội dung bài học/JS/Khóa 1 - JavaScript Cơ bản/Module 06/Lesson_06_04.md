---
lessonId: JS1-06.04
title: "Cú pháp Arrow Function & Phạm vi hàm (Function Scope)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Arrow Function", "=>", "Implicit return", "Scope", "ES6"]
prerequisites: ["JS1-06.03"]
---

# Cú pháp Arrow Function & Phạm vi hàm (Function Scope)

## 1. Khái niệm & Vấn đề thực tế
Từ ES6, JavaScript giới thiệu cú pháp **Arrow Function (Hàm mũi tên `=>`)** mang lại cách viết hàm cực kỳ ngắn gọn, thanh lịch và trực quan.

Ngoài ra, mỗi hàm khi được gọi sẽ tạo ra một **Phạm vi hàm (Function Scope)**: các biến khai báo bên trong hàm chỉ có thể được truy cập từ bên trong hàm đó, không thể truy cập từ bên ngoài.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Cú pháp đầy đủ**:
  ```javascript
  const add = (a, b) => {
      return a + b;
  };
  ```
- **Cú pháp rút gọn (Implicit Return - Trả về ngầm định)**:
  Nếu thân hàm chỉ có duy nhất một biểu thức tính toán trả về, ta có thể bỏ cả dấu ngoặc nhọn `{}` lẫn từ khóa `return`:
  ```javascript
  const add = (a, b) => a + b;
  ```
- **Nếu chỉ có 1 tham số**: có thể bỏ cả ngoặc tròn:
  ```javascript
  const square = x => x * x;
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Chuyển đổi nhiệt độ C sang F bằng Arrow Function rút gọn
const cToF = c => (c * 9/5) + 32;

console.log("0 độ C = " + cToF(0) + " độ F");   // 32
console.log("100 độ C = " + cToF(100) + " độ F"); // 212
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Bao bọc ngoặc nhọn nhưng quên return**:
  `const add = (a, b) => { a + b };` -> Kết quả trả về `undefined` vì khi dùng `{}` bắt buộc phải có từ khóa `return`!

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `(params) => expression`.
2. Bỏ `{}` thì tự động return giá trị biểu thức.
3. Biến khai báo trong hàm có phạm vi cục bộ riêng biệt.
