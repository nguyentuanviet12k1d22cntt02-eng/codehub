---
lessonId: JS2-12.03
title: "Cú pháp class, constructor & Instance Methods trong Modern JS"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["class", "constructor", "Instance Method", "ES6 Classes", "OOP"]
prerequisites: ["JS2-12.02"]
---

# Cú pháp class, constructor & Instance Methods trong Modern JS

## 1. Khái niệm & Vấn đề thực tế
Từ ES6, JavaScript bổ sung từ khóa `class` giúp cú pháp lập trình hướng đối tượng trở nên thân thuộc, trực quan và chuẩn mực giống như các ngôn ngữ hiện đại khác.

Bản chất bên dưới: `class` trong JavaScript thực chất là **Đường cú pháp (Syntactic Sugar)** bao bọc lấy cơ chế Prototype truyền thống. Khi khai báo phương thức trong `class`, nó tự động được gắn vào `Class.prototype`.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
class BankAccount {
    // Hàm khởi tạo: chạy khi gọi new BankAccount(...)
    constructor(accountNumber, balance = 0) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    // Instance Method: tự động nằm trên BankAccount.prototype
    deposit(amount) {
        this.balance += amount;
        return this.balance;
    }

    withdraw(amount) {
        if (amount > this.balance) return false;
        this.balance -= amount;
        return true;
    }
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const acc = new BankAccount("VIB-101", 100000);
acc.deposit(50000);
console.log("Số dư sau nạp:", acc.balance); // 150000

acc.withdraw(30000);
console.log("Số dư sau rút:", acc.balance); // 120000
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Class KHÔNG được hoisted**: Bạn không thể tạo instance bằng `new MyClass()` trước dòng khai báo `class MyClass`. Class tuân thủ quy tắc TDZ giống như `let` và `const`.
- **Class luôn chạy ở chế độ Strict Mode (`"use strict"`)** một cách tự động.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `class Name { constructor() {} method() {} }`.
2. Phương thức trong class tự động nằm trên prototype.
3. Không thể gọi class nếu thiếu từ khóa `new`.
