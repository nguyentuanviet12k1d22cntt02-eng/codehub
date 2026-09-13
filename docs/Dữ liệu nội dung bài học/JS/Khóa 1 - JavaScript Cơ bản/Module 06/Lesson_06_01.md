---
lessonId: JS1-06.01
title: "Khai báo hàm (Function Declaration) vs Biểu thức hàm (Function Expression)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Function Declaration", "Function Expression", "Hoisting", "Hàm", "Cú pháp hàm"]
prerequisites: ["JS1-05.04"]
---

# Khai báo hàm (Function Declaration) vs Biểu thức hàm (Function Expression)

## 1. Khái niệm & Vấn đề thực tế
Hàm (Function) là khối mã độc lập được đặt tên, thực hiện một nhiệm vụ cụ thể và có thể được tái sử dụng nhiều lần trong toàn bộ chương trình, giúp tuân thủ nguyên lý **DRY (Don't Repeat Yourself)**.

Trong JavaScript, có hai cách định nghĩa hàm truyền thống:
1. **Function Declaration**: `function tenHam() { ... }`
2. **Function Expression**: `const tenHam = function() { ... };`

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Function Declaration**:
  - Được hưởng cơ chế **Hoisting** toàn bộ: có thể gọi hàm trước dòng khai báo mà không bị lỗi.
- **Function Expression**:
  - Hàm được gán vào một biến. Biến tuân theo quy tắc khai báo (`const`/`let`), KHÔNG thể gọi hàm trước dòng khởi tạo biến đó.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// 1. Function Declaration (có thể gọi trước)
sayHello(); // Chạy bình thường!

function sayHello() {
    console.log("Xin chào!");
}

// 2. Function Expression
const calculateArea = function(width, height) {
    return width * height;
};

console.log(calculateArea(5, 10)); // 50
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Gọi Function Expression trước khi gán**: Sẽ gây lỗi `ReferenceError: Cannot access before initialization`.
- **Thực hành tốt nhất**: Đặt tên hàm bằng động từ (ví dụ `calculateTotal`, `getUserName`, `validateEmail`) để thể hiện rõ hành động.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Function Declaration được hoisted lên đầu phạm vi.
2. Function Expression gán hàm vào biến `const`, an toàn và dễ kiểm soát luồng mã.
