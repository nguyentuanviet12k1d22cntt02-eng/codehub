---
lessonId: JS1-03.02
title: "Chuyển đổi kiểu tường minh (String, Number, parseInt, parseFloat)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Type Conversion", "Number()", "String()", "parseInt()", "parseFloat()", "toFixed()"]
prerequisites: ["JS1-03.01"]
---

# Chuyển đổi kiểu tường minh (String, Number, parseInt, parseFloat)

## 1. Khái niệm & Vấn đề thực tế
Ép kiểu tường minh (Explicit Type Conversion) là việc lập trình viên chủ động dùng các hàm chuyển đổi để biến đổi giá trị từ kiểu này sang kiểu khác nhằm đảm bảo tính toàn vẹn và chính xác cho dữ liệu.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Chuyển đổi sang số**:
  - `Number(val)`: Chuyển toàn bộ chuỗi sang số. Nếu chuỗi chứa bất kỳ ký tự không phải số nào (ngoài khoảng trắng và dấu chấm thập phân), nó trả về `NaN`.
  - `parseInt(str, radix)`: Phân tích cú pháp đọc từ đầu chuỗi đến khi gặp ký tự không phải số nguyên thì dừng lại và trả về phần nguyên. Luôn truyền `radix = 10` cho hệ thập phân.
  - `parseFloat(str)`: Tương tự `parseInt` nhưng đọc cả phần dấu chấm thập phân.
- **Chuyển đổi sang chuỗi**:
  - `String(val)` hoặc `val.toString()`.
- **Làm tròn số thập phân**:
  - `num.toFixed(digits)`: Trả về chuỗi đại diện cho số thập phân được làm tròn với `digits` chữ số sau dấu phẩy.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
console.log(Number("123.45"));      // 123.45
console.log(Number("123px"));       // NaN (thất bại vì có 'px')

console.log(parseInt("123px", 10)); // 123 (đọc được 123 trước khi gặp 'px')
console.log(parseFloat("12.5rem")); // 12.5

const price = 45.6789;
console.log(price.toFixed(2));      // "45.68" (làm tròn 2 chữ số thập phân)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên radix trong parseInt**: Luôn viết `parseInt(str, 10)` để tránh bị hiểu nhầm sang hệ bát phân (octal) trên một số engine cũ.
- **`toFixed()` trả về `string`**: Kết quả của `toFixed()` là chuỗi ký tự, nếu muốn tiếp tục tính toán cần bọc lại bằng `Number()`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `Number()` khi muốn chuyển chuỗi thuần túy sang số nghiêm ngặt.
2. Dùng `parseInt(s, 10)` và `parseFloat(s)` khi chuỗi có chứa đơn vị phía sau (như `100px`, `3.5kg`).
3. Dùng `.toFixed(n)` khi cần xuất kết quả tiền tệ hoặc số đo làm tròn $n$ chữ số thập phân.
