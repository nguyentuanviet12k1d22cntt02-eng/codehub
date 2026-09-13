---
lessonId: JS1-02.01
title: "Hệ thống kiểu dữ liệu nguyên thủy & Toán tử typeof"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Primitive Types", "typeof", "number", "string", "boolean", "undefined", "null", "bigint", "symbol"]
prerequisites: ["JS1-01.04"]
---

# Hệ thống kiểu dữ liệu nguyên thủy & Toán tử typeof

## 1. Khái niệm & Vấn đề thực tế
JavaScript là ngôn ngữ có hệ thống kiểu động (**Dynamically Typed**): kiểu dữ liệu gắn liền với giá trị tại thời điểm thực thi chứ không gắn cố định vào tên biến.

Trong JavaScript, có **7 kiểu dữ liệu nguyên thủy (Primitive Data Types)**:
1. `number`: Số nguyên và số thực (kèm theo các giá trị đặc biệt như `Infinity`, `-Infinity`, `NaN`).
2. `string`: Chuỗi ký tự.
3. `boolean`: Giá trị đúng/sai (`true` hoặc `false`).
4. `undefined`: Biến đã khai báo nhưng chưa được gán giá trị.
5. `null`: Đại diện cho giá trị rỗng/không tồn tại có chủ đích.
6. `bigint`: Số nguyên có kích thước tùy ý vượt qua ngưỡng an toàn của number ($2^{53} - 1$).
7. `symbol`: Giá trị định danh duy nhất và bất biến.

---

## 2. Cú pháp & Quy tắc cốt lõi
Để kiểm tra kiểu dữ liệu của một giá trị hoặc biến, ta sử dụng toán tử đơn ngôi `typeof`:
```javascript
typeof value;
// hoặc typeof(value);
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
console.log(typeof 42);           // "number"
console.log(typeof "Hello");      // "string"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof 9007199254740995n); // "bigint"
```

- Dòng 1: Số 42 thuộc kiểu `number`.
- Dòng 2: Chuỗi đặt trong ngoặc kép thuộc kiểu `string`.
- Dòng 3: `true` thuộc kiểu `boolean`.
- Dòng 5: Hậu tố `n` biểu thị kiểu `bigint`.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lỗi lịch sử `typeof null === "object"`**: Đây là một bug có từ phiên bản đầu tiên của JavaScript (do biểu diễn nhị phân của tag type). Dù là kiểu nguyên thủy, `typeof null` luôn trả về chuỗi `"object"`. Hãy ghi nhớ kỹ điều này!
- **`NaN` có kiểu là `number`**: `typeof NaN` trả về `"number"` dù NaN viết tắt của "Not a Number".

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. JavaScript có 7 kiểu dữ liệu nguyên thủy.
2. Dùng `typeof` để xác định kiểu dữ liệu của biến hoặc giá trị.
3. Đặc biệt lưu ý: `typeof null` trả về `"object"`.
