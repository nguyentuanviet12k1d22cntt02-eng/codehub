---
lessonId: JS2-13.01
title: "Phân loại lỗi: SyntaxError, TypeError, ReferenceError, RangeError"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["SyntaxError", "TypeError", "ReferenceError", "RangeError", "Error types"]
prerequisites: ["JS2-12.05"]
---

# Phân loại lỗi: SyntaxError, TypeError, ReferenceError, RangeError

## 1. Khái niệm & Vấn đề thực tế
Khi một chương trình JavaScript gặp sự cố, Engine sẽ dừng thực thi và ném ra một đối tượng lỗi (Error Object) kèm theo tên loại lỗi và thông điệp mô tả.
Hiểu đúng bản chất của từng loại lỗi giúp lập trình viên khoanh vùng và khắc phục sự cố ngay lập tức.

---

## 2. Cú pháp & Quy tắc cốt lõi
1. **`SyntaxError` (Lỗi cú pháp)**: Xảy ra trong pha biên dịch khi mã vi phạm ngữ pháp của ngôn ngữ (ví dụ: thiếu ngoặc, gán giá trị cho biểu thức `10 = x`).
2. **`ReferenceError` (Lỗi tham chiếu)**: Xảy ra khi cố gắng truy cập vào một biến chưa hề được khai báo hoặc đang nằm trong vùng TDZ.
3. **`TypeError` (Lỗi kiểu dữ liệu)**: Xảy ra khi thực hiện thao tác không hợp lệ trên một kiểu dữ liệu (ví dụ: gọi một biến không phải hàm `x()`, truy cập thuộc tính trên `null`/`undefined`, gán lại biến `const`).
4. **`RangeError` (Lỗi vượt ngưỡng)**: Xảy ra khi truyền tham số nằm ngoài phạm vi cho phép (ví dụ: `new Array(-1)`, đệ quy vô tận làm tràn ngăn xếp `Maximum call stack size exceeded`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Ví dụ 1: ReferenceError
// console.log(notDefinedVar);

// Ví dụ 2: TypeError
const num = 123;
// num.toUpperCase(); // TypeError: num.toUpperCase is not a function

// Ví dụ 3: RangeError
// (123.45).toFixed(200); // RangeError: toFixed() digits argument must be between 0 and 100
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Bỏ qua tên loại lỗi khi đọc log**: Luôn đọc từ đầu thông điệp lỗi để biết đó là `TypeError` hay `ReferenceError` trước khi đọc đến dòng code chỉ định.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `ReferenceError`: Biến không tồn tại.
2. `TypeError`: Thao tác sai kiểu dữ liệu.
3. `RangeError`: Giá trị vượt quá dải cho phép.
