---
lessonId: JS2-12.04
title: "Kế thừa hướng đối tượng với extends & Hàm khởi tạo cha super()"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["extends", "super", "Inheritance", "Kế thừa", "Method Overriding"]
prerequisites: ["JS2-12.03"]
---

# Kế thừa hướng đối tượng với extends & Hàm khởi tạo cha super()

## 1. Khái niệm & Vấn đề thực tế
Kế thừa (Inheritance) cho phép một lớp con (Subclass / Child class) tái sử dụng toàn bộ thuộc tính và phương thức của lớp cha (Superclass / Parent class), đồng thời bổ sung thêm các đặc tính chuyên biệt của riêng mình.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getDetails() {
        return `${this.name}, ${this.age} tuổi`;
    }
}

// Kế thừa bằng extends
class Student extends Person {
    constructor(name, age, studentId) {
        // BẮT BUỘC gọi super() trước khi dùng 'this' trong lớp con
        super(name, age);
        this.studentId = studentId;
    }

    // Ghi đè phương thức (Method Overriding)
    getDetails() {
        return `${super.getDetails()} - Mã SV: ${this.studentId}`;
    }
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const sv = new Student("Văn Nam", 21, "SV2026");
console.log(sv.getDetails());
// "Văn Nam, 21 tuổi - Mã SV: SV2026"
```

- Dòng `super(name, age)` gọi hàm khởi tạo của lớp cha `Person`, thiết lập xong các trường `name` và `age`.
- `super.getDetails()` gọi phương thức của lớp cha rồi nối thêm dữ liệu.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dùng `this` trước `super()`**: Trong constructor của lớp con, nếu bạn viết `this.studentId = id;` trước `super()`, JavaScript Engine sẽ ném lỗi ngay: `ReferenceError: Must call super constructor in derived class before accessing 'this'`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `class Child extends Parent` để kế thừa.
2. Bắt buộc gọi `super(...)` ở dòng đầu tiên trong constructor của lớp con.
3. Dùng `super.methodName()` để tái sử dụng logic của lớp cha khi override.
