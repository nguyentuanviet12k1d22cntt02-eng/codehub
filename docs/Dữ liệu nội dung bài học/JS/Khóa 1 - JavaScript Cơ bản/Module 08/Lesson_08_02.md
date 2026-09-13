---
lessonId: JS1-08.02
title: "Độ dài chuỗi, toUpperCase(), toLowerCase() & trim()"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["String immutability", "toUpperCase", "toLowerCase", "trim", "length"]
prerequisites: ["JS1-08.01"]
---

# Độ dài chuỗi, toUpperCase(), toLowerCase() & trim()

## 1. Khái niệm & Vấn đề thực tế
Dữ liệu chuỗi thu nhận từ bàn phím hoặc tệp tin thường bị lẫn khoảng trắng ở đầu và cuối chuỗi, hoặc chữ hoa/chữ thường không đồng nhất.
Để chuẩn hóa dữ liệu so sánh, ta sử dụng các phương thức xử lý chuỗi tích hợp sẵn.

> **QUY TẮC CỐT LÕI**: Chuỗi trong JavaScript là **Bất biến (Immutable)**. Mọi phương thức xử lý chuỗi đều **trả về chuỗi mới**, không bao giờ làm thay đổi chuỗi gốc.

---

## 2. Cú pháp & Quy tắc cốt lõi
- `str.length`: Số lượng ký tự trong chuỗi.
- `str.trim()`: Loại bỏ toàn bộ khoảng trắng, tab, dấu xuống dòng ở hai đầu chuỗi.
- `str.toUpperCase()`: Chuyển toàn bộ thành chữ in hoa.
- `str.toLowerCase()`: Chuyển toàn bộ thành chữ in thường.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const rawEmail = "   Admin@Mcode.com   \n";

// Chuẩn hóa email: xóa khoảng trắng 2 đầu và đưa về chữ thường
const cleanEmail = rawEmail.trim().toLowerCase();

console.log(cleanEmail); // "admin@mcode.com"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Tưởng chuỗi bị thay đổi**:
  ```javascript
  let str = "hello";
  str.toUpperCase();
  console.log(str); // Vẫn là "hello"! Vì chuỗi là immutable, phải gán lại: str = str.toUpperCase();
  ```

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Chuỗi là Immutable: luôn nhận kết quả vào biến mới hoặc gán lại.
2. Luôn dùng `.trim()` và `.toLowerCase()` khi chuẩn hóa tài khoản/email người dùng.
