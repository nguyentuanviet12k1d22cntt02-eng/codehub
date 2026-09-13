---
lessonId: JS2-09.01
title: "Khởi tạo Object (Object Literal), Dot notation vs Bracket notation"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Object Literal", "Dot notation", "Bracket notation", "Properties", "Key-Value"]
prerequisites: ["JS1-08.04"]
---

# Khởi tạo Object (Object Literal), Dot notation vs Bracket notation

## 1. Khái niệm & Vấn đề thực tế
Trong khi mảng (Array) lưu danh sách có thứ tự theo số nguyên, thì Đối tượng (Object) lưu trữ tập hợp các cặp **khóa - giá trị (Key - Value)** không có thứ tự, đại diện cho các thực thể trong đời thực (Người dùng, Sản phẩm, Cấu hình hệ thống).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Khởi tạo Object Literal**:
  ```javascript
  const user = {
      name: "Hoàng",
      age: 22,
      "user-role": "admin" // Khóa có ký tự đặc biệt phải bọc trong nháy
  };
  ```
- **Dot notation (Dấu chấm)**: `user.name` (ngắn gọn, trực quan nhưng chỉ dùng khi tên khóa là định danh hợp lệ).
- **Bracket notation (Dấu ngoặc vuông)**: `user["name"]` hoặc `user[variableKey]` (bắt buộc khi tên khóa chứa ký tự đặc biệt hoặc được lưu trong một biến động).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const car = {
    brand: "Toyota",
    year: 2024
};

const propName = "brand";
console.log(car.brand);      // "Toyota" (Dot notation)
console.log(car[propName]);   // "Toyota" (Bracket notation với biến động)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên đặt dấu ngoặc kép khi dùng bracket**: `obj[name]` sẽ tìm biến `name` thay vì chuỗi `"name"`.
- **Lỗi `obj.prop-name`**: Dấu gạch ngang bị hiểu nhầm là phép trừ, phải viết `obj["prop-name"]`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `obj.key` cho thuộc tính cố định.
2. Dùng `obj[key]` khi tên thuộc tính đến từ biến hoặc chứa dấu gạch ngang/khoảng trắng.
