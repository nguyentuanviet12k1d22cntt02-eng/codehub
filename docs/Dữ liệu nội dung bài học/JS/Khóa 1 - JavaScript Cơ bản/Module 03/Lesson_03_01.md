---
lessonId: JS1-03.01
title: "Cơ chế nhập dữ liệu chuẩn stdin trong JavaScript thuần"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["stdin", "fs.readFileSync", "Node.js", "I/O", "Console Input"]
prerequisites: ["JS1-02.04"]
---

# Cơ chế nhập dữ liệu chuẩn stdin trong JavaScript thuần

## 1. Khái niệm & Vấn đề thực tế
Khác với trình duyệt có hàm `prompt()` làm gián đoạn luồng giao diện, trong môi trường JavaScript dòng lệnh thuần (Console/Backend/Thi thuật toán), chương trình nhận dữ liệu thông qua **luồng đầu vào tiêu chuẩn (Standard Input - stdin)**.

Trong môi trường Node.js / V8 Sandbox chuẩn, cách nhanh nhất và phổ biến nhất để đọc toàn bộ dữ liệu đầu vào là sử dụng hàm đồng bộ `fs.readFileSync(0, 'utf-8')` (với `0` là File Descriptor đại diện cho `stdin`).

---

## 2. Cú pháp & Quy tắc cốt lõi
Mẫu chuẩn (Standard Pattern) để đọc và bóc tách dữ liệu từ stdin:
```javascript
const fs = require('fs');

// Đọc toàn bộ chuỗi từ stdin, loại bỏ khoảng trắng dư thừa và tách thành mảng các từ/số
const input = fs.readFileSync(0, 'utf-8').trim().split(/\s+/);

// Lấy các tham số tuần tự
const firstValue = input[0];
const secondValue = input[1];
```

- `.trim()`: Xóa bỏ khoảng trắng thừa, ký tự xuống dòng `\n` ở đầu và cuối chuỗi.
- `.split(/\s+/)`: Tách chuỗi theo một hoặc nhiều dấu cách hoặc xuống dòng liên tiếp.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\s+/);

// Giả sử đầu vào stdin là: "15 25"
const numA = Number(input[0]);
const numB = Number(input[1]);

console.log("Tổng:", numA + numB);
```

- Dòng 1 & 2: Nạp module `fs` và đọc toàn bộ token từ bàn phím vào mảng `input`.
- Dòng 5 & 6: Chuyển đổi từng phần tử chuỗi sang kiểu số `number`.
- Dòng 8: Thực hiện phép cộng số học và in ra console.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dữ liệu stdin luôn là kiểu `string`**: Nếu quên dùng `Number()` hoặc `parseInt()`, phép toán `input[0] + input[1]` sẽ thành phép ghép chuỗi (`"15" + "25" = "1525"`).
- **Xử lý khi stdin rỗng**: Luôn kiểm tra mảng `input` có phần tử hợp lệ trước khi truy cập `input[0]`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Đọc stdin trong JS thuần dùng: `const input = require('fs').readFileSync(0, 'utf-8').trim().split(/\s+/);`.
2. Mọi dữ liệu đọc từ stdin ban đầu đều là chuỗi ký tự (`string`).
