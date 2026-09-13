---
lessonId: JS1-08.01
title: "Khai báo chuỗi, ký tự thoát & Template Literals (ES6)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Template Literals", "Backtick", "Escape Sequence", "Nội suy chuỗi", "ES6"]
prerequisites: ["JS1-07.04"]
---

# Khai báo chuỗi, ký tự thoát & Template Literals (ES6)

## 1. Khái niệm & Vấn đề thực tế
Trước ES6, để ghép biến và biểu thức vào một chuỗi dài nhiều dòng, lập trình viên phải dùng toán tử `+` và ký tự xuống dòng `\n` rất rối mắt và dễ nhầm lẫn.

ES6 giới thiệu **Template Literals** (sử dụng dấu huyền - backtick `` ` ``), cho phép nội suy biến trực tiếp với cú pháp `${expression}` và viết chuỗi nhiều dòng hoàn toàn tự nhiên.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Ký tự thoát (Escape Sequences)**:
  - `\n`: Xuống dòng.
  - `\t`: Tab cách dòng.
  - `\"`, `\'`: Thoát dấu ngoặc kép / đơn.
  - `\\`: Ký tự dấu gạch chéo ngược.
- **Template Literals**:
  ```javascript
  const name = "Hoàng";
  const year = 2026;
  const message = `Xin chào ${name}, chào mừng đến năm ${year}!`;
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const item = "Khóa học JavaScript";
const price = 450000;
const vat = 0.1;

// Nội suy biểu thức toán học trực tiếp trong chuỗi
const invoice = `Đơn hàng: ${item}
Tổng thanh toán: ${price * (1 + vat)} VNĐ`;

console.log(invoice);
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Nhầm dấu backtick `` ` `` với dấu nháy đơn `'`**: Cú pháp `${...}` chỉ hoạt động bên trong cặp dấu backtick `` ` ``.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng backtick `` ` `` cho mọi chuỗi có chứa biến hoặc cần xuống dòng.
2. Cú pháp `${biểu_thức}` cho phép đặt bất kỳ phép tính hoặc lời gọi hàm hợp lệ nào vào bên trong chuỗi.
