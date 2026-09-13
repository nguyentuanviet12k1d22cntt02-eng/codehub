---
lessonId: JS1-01.01
title: "Lịch sử JavaScript, ECMAScript & Môi trường thực thi"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["JavaScript", "ECMAScript", "V8 Engine", "Node.js", "Runtime"]
prerequisites: []
---

# Lịch sử JavaScript, ECMAScript & Môi trường thực thi

## 1. Khái niệm & Vấn đề thực tế
Năm 1995, Brendan Eich tạo ra JavaScript trong 10 ngày tại Netscape. Ban đầu chỉ là ngôn ngữ kịch bản chạy trong trình duyệt, ngày nay JavaScript là một trong những ngôn ngữ phổ biến nhất thế giới nhờ chuẩn hóa **ECMAScript (ES)** và các công cụ thực thi hiện đại như Google V8 Engine và Node.js.

Trong khóa học này, chúng ta tiếp cận JavaScript dưới góc độ **ngôn ngữ lập trình thuần túy (Vanilla JS)**: học tư duy thuật toán, cấu trúc dữ liệu và cú pháp lõi độc lập, không phụ thuộc vào giao diện web HTML/DOM hay framework bên ngoài.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **ECMAScript**: Bản đặc tả kỹ thuật tiêu chuẩn (ES5, ES6/ES2015, ES2020,...).
- **JavaScript Engine**: Bộ máy biên dịch JIT (Just-In-Time) mã JS sang mã máy (V8 trên Chrome/Node.js, SpiderMonkey trên Firefox).
- **Môi trường Console/Sandbox**: Mã lệnh được chạy tuần tự từ trên xuống dưới, kết quả xuất ra luồng đầu ra tiêu chuẩn (`stdout`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// In dòng thông báo đầu tiên ra màn hình console
console.log("Xin chào lập trình viên JavaScript!");
console.log(2026);
```

- Dòng 1: Chú thích bắt đầu bằng `//` giải thích mục đích mã.
- Dòng 2: Gọi phương thức `console.log()` để in chuỗi ký tự ra màn hình.
- Dòng 3: In trực tiếp một hằng số nguyên ra console.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Nhầm lẫn Java và JavaScript**: Java và JavaScript là hai ngôn ngữ hoàn toàn khác biệt về cú pháp, triết lý và hệ thống kiểu dữ liệu.
- **Bỏ quên môi trường thực thi**: JavaScript là ngôn ngữ phân biệt chữ hoa/thường (`console.log` khác `Console.log`). Viết sai hoa thường sẽ gây lỗi `ReferenceError`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. JavaScript được chuẩn hóa bởi tổ chức ECMA quốc tế (tiêu chuẩn ECMAScript).
2. Mã JS được thực thi bởi JavaScript Engine (như V8) thông qua cơ chế JIT Compiler.
3. Hàm cơ bản nhất để xuất dữ liệu trong JS thuần là `console.log()`.
