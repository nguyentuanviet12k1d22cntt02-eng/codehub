---
lessonId: JS2-09.02
title: "Thêm, sửa, xóa thuộc tính với delete & Toán tử in"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["delete", "Toán tử in", "hasOwnProperty", "Mutation", "Object properties"]
prerequisites: ["JS2-09.01"]
---

# Thêm, sửa, xóa thuộc tính với delete & Toán tử in

## 1. Khái niệm & Vấn đề thực tế
Một đối tượng trong JavaScript có tính chất mở (open / extensible): ta có thể tự do thêm thuộc tính mới, sửa đổi giá trị thuộc tính cũ hoặc xóa bỏ hoàn toàn thuộc tính nhạy cảm (như mật khẩu trước khi trả dữ liệu về).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Thêm/Sửa thuộc tính**: Gán trực tiếp `obj.newKey = value;`.
- **Xóa thuộc tính**: Dùng toán tử đơn ngôi `delete obj.key;`.
- **Kiểm tra tồn tại**: Dùng toán tử `"key" in obj` (trả về `true` nếu `key` tồn tại trong `obj` hoặc prototype của nó).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const student = {
    name: "Minh",
    age: 20,
    password: "secret_password"
};

// 1. Thêm thuộc tính mới
student.email = "minh@mcode.com";

// 2. Xóa thuộc tính nhạy cảm
delete student.password;

// 3. Kiểm tra xem password còn tồn tại không
console.log("password" in student); // false
console.log("email" in student);    // true
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Gán `obj.key = undefined` KHÔNG tương đương `delete obj.key`**: Gán `undefined` thì thuộc tính vẫn tồn tại trong object (vẫn duyệt thấy trong vòng lặp và `"key" in obj` vẫn trả về `true`). Chỉ có `delete` mới xóa sạch hoàn toàn key khỏi bộ nhớ.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Thêm/sửa bằng phép gán `=`.
2. Xóa key bằng toán tử `delete`.
3. Kiểm tra sự tồn tại của key bằng `"key" in obj`.
