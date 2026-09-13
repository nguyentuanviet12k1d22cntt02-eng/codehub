---
lessonId: JS2-14.02
title: "Named Export vs Default Export & Nguyên tắc Single Responsibility (SRP)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Named Export", "Default Export", "Single Responsibility", "Clean Architecture", "ESM"]
prerequisites: ["JS2-14.01"]
---

# Named Export vs Default Export & Nguyên tắc Single Responsibility (SRP)

## 1. Khái niệm & Vấn đề thực tế
Trong chuẩn ES Modules, ta có hai cách xuất bản dữ liệu ra bên ngoài:
1. **Named Export**: Xuất nhiều thành phần theo tên cụ thể (`export const A = ...`). Khi import, bắt buộc phải dùng đúng tên đó trong ngoặc nhọn `{ A }`.
2. **Default Export**: Mỗi mô-đun chỉ được có **duy nhất một** Default Export (`export default ...`). Bên import có thể tự do đặt tên tùy ý.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Named Export**:
  ```javascript
  export function formatCurrency(amount) { ... }
  export function formatDate(date) { ... }
  // Import:
  import { formatCurrency, formatDate } from './formatters.js';
  ```
- **Default Export**:
  ```javascript
  export default class UserAuth { ... }
  // Import:
  import UserAuth from './UserAuth.js';
  ```
- **Nguyên tắc Single Responsibility (SRP)**: Mỗi file/module chỉ nên chịu trách nhiệm cho duy nhất một thực thể hoặc một nhóm chức năng liên quan mật thiết.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Mô-đun tiện ích định dạng
const formatters = {
    currency(val) {
        return val.toLocaleString("vi-VN") + " đ";
    },
    percentage(rate) {
        return (rate * 100).toFixed(1) + "%";
    }
};

console.log(formatters.currency(500000)); // "500.000 đ"
console.log(formatters.percentage(0.125)); // "12.5%"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng Default Export**: Đặt tên tự do khi import có thể khiến hai thành viên trong nhóm đặt hai tên khác nhau cho cùng một module, gây khó khăn cho việc tìm kiếm toàn cục (Find in Files). Ưu tiên dùng Named Export cho các thư viện tiện ích.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Một file có thể có nhiều Named Exports nhưng chỉ có 1 Default Export.
2. Thiết kế mô-đun theo nguyên lý SRP: đơn trách nhiệm, dễ kiểm thử.
