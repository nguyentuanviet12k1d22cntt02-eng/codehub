---
lessonId: JS2-11.05
title: "Ràng buộc ngữ cảnh thực thi với bind(), call() và apply()"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["bind", "call", "apply", "Explicit Binding", "Method Borrowing"]
prerequisites: ["JS2-11.04"]
---

# Ràng buộc ngữ cảnh thực thi với bind(), call() và apply()

## 1. Khái niệm & Vấn đề thực tế
Khi truyền một phương thức của đối tượng làm tham số callback (ví dụ trong sự kiện hoặc timer), phương thức đó thường bị tách rời khỏi đối tượng gốc, dẫn đến `this` bị mất ngữ cảnh (`this` trở thành `undefined`).

Để chủ động chỉ định chính xác đối tượng nào sẽ là `this` của một hàm, JavaScript cung cấp 3 phương thức: **`call()`**, **`apply()`** và **`bind()`** (kỹ thuật **Explicit Binding**).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`fn.call(thisArg, arg1, arg2, ...)`**:
  - Gán `this = thisArg` và **gọi hàm thực thi ngay lập tức**.
  - Các đối số truyền vào phân tách nhau bởi dấu phẩy.
- **`fn.apply(thisArg, [arg1, arg2, ...])`**:
  - Gán `this = thisArg` và **gọi hàm thực thi ngay lập tức**.
  - Các đối số truyền vào dưới dạng **một mảng**.
- **`fn.bind(thisArg, arg1, ...)`**:
  - **KHÔNG gọi hàm ngay**, mà trả về một **hàm mới** với `this` đã được "khóa cứng" (permanently bound) vào `thisArg`.

---

## 3. Ví dụ trực quan: Kỹ thuật mượn hàm (Method Borrowing)

```javascript
function introduce(greeting, punct) {
    return `${greeting}, tôi là ${this.name}${punct}`;
}

const person1 = { name: "Hoàng" };
const person2 = { name: "Thảo" };

// 1. Dùng call: truyền tham số rời
console.log(introduce.call(person1, "Xin chào", "!")); // "Xin chào, tôi là Hoàng!"

// 2. Dùng apply: truyền mảng tham số
console.log(introduce.apply(person2, ["Chào bạn", "."])); // "Chào bạn, tôi là Thảo."

// 3. Dùng bind: tạo hàm mới
const introduceHoang = introduce.bind(person1, "Hello");
console.log(introduceHoang("~")); // "Hello, tôi là Hoàng~"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Phân biệt `call` vs `apply`**: "A for Array" -> `apply` nhận mảng các đối số; `call` nhận danh sách cách nhau bởi dấu phẩy.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `call(this, a, b)`: chạy ngay, tham số liệt kê.
2. `apply(this, [a, b])`: chạy ngay, tham số là mảng.
3. `bind(this)`: trả về hàm mới để gọi sau.
