---
lessonId: JS1-01.03
title: "Khai báo biến với let, const, var & Quy tắc đặt tên"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["let", "const", "var", "camelCase", "Biến", "Hằng số"]
prerequisites: ["JS1-01.02"]
---

# Khai báo biến với let, const, var & Quy tắc đặt tên

## 1. Khái niệm & Vấn đề thực tế
Biến là vùng nhớ được đặt tên để lưu trữ dữ liệu trong suốt thời gian chương trình hoạt động. Trước ES6 (2015), JavaScript chỉ có `var` với cơ chế phạm vi hàm (function scope) tiềm ẩn nhiều rủi ro. Từ ES6, `let` và `const` ra đời với phạm vi khối lệnh (block scope), trở thành chuẩn mực bắt buộc cho Modern JavaScript.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`const`**: Dùng để khai báo **hằng số** (giá trị không được gán lại sau khi khởi tạo). Luôn ưu tiên dùng `const` mặc định.
- **`let`**: Dùng để khai báo **biến** khi giá trị cần được thay đổi hoặc tính toán lại (ví dụ biến đếm, tổng tích lũy).
- **`var`**: Cú pháp kế thừa cũ (legacy). Tránh sử dụng trong dự án hiện đại.
- **Quy tắc đặt tên (Identifier Rules)**:
  - Bắt đầu bằng chữ cái (`a-z`, `A-Z`), gạch dưới (`_`) hoặc dấu đô la (`$`).
  - Không bắt đầu bằng chữ số, không chứa khoảng trắng hay ký tự đặc biệt khác.
  - Phân biệt hoa thường (`total` khác `Total`).
  - Sử dụng chuẩn quy ước **camelCase** (ví dụ: `studentName`, `totalPrice`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const courseCode = "JS-BASIC"; // Hằng số: không thể gán lại
let studentCount = 30;          // Biến: có thể thay đổi giá trị

// Cập nhật giá trị cho biến
studentCount = studentCount + 5;

console.log(courseCode);
console.log(studentCount);
```

- Dòng 1: Khai báo hằng số `courseCode` lưu mã khóa học.
- Dòng 2: Khởi tạo biến `studentCount` mang giá trị ban đầu là 30.
- Dòng 5: Cộng thêm 5 học viên vào biến `studentCount`.
- Dòng 7 & 8: In kết quả ra màn hình.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Gán lại giá trị cho `const`**: Sẽ gây lỗi nghiêm trọng `TypeError: Assignment to constant variable`.
- **Khai báo không gán giá trị cho `const`**: Bắt buộc phải khởi tạo giá trị ngay khi khai báo `const a;` -> Lỗi cú pháp.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Nguyên tắc vàng: Mặc định luôn dùng `const`. Chỉ đổi sang `let` khi chắc chắn cần gán lại giá trị.
2. Tuyệt đối không dùng `var` trong các đoạn mã mới.
3. Đặt tên biến theo chuẩn `camelCase`, mang ý nghĩa rõ ràng, tránh đặt tên tối nghĩa như `x`, `y`, `temp`.
