---
lessonId: JS1-03.03
title: "Ép kiểu ngầm định (Type Coercion), giá trị NaN & Number.isNaN()"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Type Coercion", "NaN", "Number.isNaN", "isNaN", "Ép kiểu ngầm"]
prerequisites: ["JS1-03.02"]
---

# Ép kiểu ngầm định (Type Coercion), giá trị NaN & Number.isNaN()

## 1. Khái niệm & Vấn đề thực tế
Khi thực hiện phép toán trên các toán hạng khác kiểu dữ liệu, JavaScript tự động chuyển đổi kiểu dữ liệu của một hoặc cả hai toán hạng mà không báo trước – gọi là **Ép kiểu ngầm định (Type Coercion)**.

Nếu một phép tính số học thất bại hoặc không thể chuyển đổi thành số hợp lệ, kết quả sinh ra là giá trị đặc biệt `NaN` (**Not a Number**).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Phép trừ `-`, nhân `*`, chia `/`**: Luôn ép các toán hạng về `number`.
  ```javascript
  "10" - 2   // 8
  "6" * "3"  // 18
  "abc" - 5  // NaN
  ```
- **Đặc điểm của NaN**:
  - `NaN` là giá trị duy nhất trong JavaScript **không bằng chính nó**: `NaN === NaN` trả về `false`!
- **Kiểm tra NaN**:
  - Không bao giờ dùng `x === NaN`.
  - Dùng `Number.isNaN(val)` (chuẩn ES6 an toàn tuyệt đối).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const validStr = "123";
const invalidStr = "abc";

const num1 = Number(validStr);   // 123
const num2 = Number(invalidStr); // NaN

console.log(Number.isNaN(num1)); // false (là số hợp lệ)
console.log(Number.isNaN(num2)); // true (bị biến thành NaN)
```

- Dòng 4 & 5: Cố gắng chuyển chuỗi sang số. `"abc"` không thể chuyển được nên trở thành `NaN`.
- Dòng 7 & 8: `Number.isNaN()` kiểm tra chính xác giá trị có phải là `NaN` hay không.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Phân biệt `isNaN()` toàn cục vs `Number.isNaN()`**:
  ```javascript
  isNaN("hello");        // true (vì nó cố ép "hello" thành NaN trước rồi mới kiểm tra)
  Number.isNaN("hello"); // false (chỉ trả về true nếu giá trị chính xác là kiểu number mang giá trị NaN)
  ```
  -> Luôn luôn dùng `Number.isNaN()`!

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Phép toán `*`, `/`, `-` luôn ép ngầm định sang `number`; phép `+` ưu tiên ghép chuỗi nếu có ít nhất một chuỗi.
2. `NaN !== NaN` là chân lý trong JavaScript.
3. Luôn dùng `Number.isNaN(x)` để kiểm tra một biến có bị lỗi tính toán số học hay không.
