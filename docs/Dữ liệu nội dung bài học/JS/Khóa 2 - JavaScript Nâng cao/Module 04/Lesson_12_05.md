---
lessonId: JS2-12.05
title: "Phương thức tĩnh static, Getter/Setter & Private Fields (#)"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["static", "get", "set", "Private fields", "#private", "Encapsulation"]
prerequisites: ["JS2-12.04"]
---

# Phương thức tĩnh static, Getter/Setter & Private Fields (#)

## 1. Khái niệm & Vấn đề thực tế
Để hoàn thiện mô hình Lập trình hướng đối tượng (OOP) chuyên nghiệp, JavaScript cung cấp:
1. **`static`**: Thuộc tính/phương thức thuộc về bản thân Class chứ không thuộc về instance (thường dùng làm hàm tiện ích, factory method).
2. **`get` / `set`**: Cho phép truy cập và gán giá trị như thuộc tính thông thường nhưng thực chất chạy qua hàm logic để kiểm định (Validation).
3. **Private Fields (`#field`)**: Tính năng đóng gói bảo mật thực thụ (ra mắt từ ES2022), ngăn chặn tuyệt đối việc truy cập hoặc sửa đổi từ bên ngoài Class.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
class UserAccount {
    // 1. Private field (phải khai báo với dấu # ở đầu)
    #password;

    constructor(username, password) {
        this.username = username;
        this.#password = password;
    }

    // 2. Getter & Setter
    get passwordMasked() {
        return "*".repeat(this.#password.length);
    }

    // 3. Static method
    static compareUsers(u1, u2) {
        return u1.username === u2.username;
    }
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const user = new UserAccount("viet", "super_secret_123");

console.log(user.username);         // "viet"
console.log(user.passwordMasked);   // "****************" (Getter chạy như thuộc tính)

// user.#password -> LỖI SyntaxError: Private field '#password' must be declared in an enclosing class!
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Tên Getter/Setter trùng với tên thuộc tính**: Nếu bạn viết `get age() { return this.age; }`, nó sẽ gọi đệ quy chính nó vô hạn và gây lỗi `RangeError: Maximum call stack size exceeded`. Luôn lưu trữ dữ liệu thực vào biến private như `#age` hoặc `_age`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `static` gọi qua tên Class: `ClassName.method()`.
2. `get prop()` và `set prop(val)` giúp kiểm soát quyền truy cập.
3. Ký tự `#` bảo vệ trường dữ liệu an toàn 100% (Hard Private).
