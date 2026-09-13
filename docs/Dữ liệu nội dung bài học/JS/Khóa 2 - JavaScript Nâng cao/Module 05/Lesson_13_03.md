---
lessonId: JS2-13.03
title: "Chủ động ném lỗi với throw & Custom Error Class"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["throw", "Custom Error", "class ValidationError extends Error", "Tạo lỗi tùy chỉnh"]
prerequisites: ["JS2-13.02"]
---

# Chủ động ném lỗi với throw & Custom Error Class

## 1. Khái niệm & Vấn đề thực tế
Ngoài các lỗi hệ thống do JavaScript Engine tự sinh, trong quá trình xử lý nghiệp vụ kinh doanh (Business Logic) như kiểm tra số dư không đủ, tuổi không hợp lệ, email sai định dạng, ta cần **chủ động ném ra lỗi (throw Error)** để chặn đứng chu trình xử lý sai lệch.

Để phân biệt lỗi nghiệp vụ với các lỗi hệ thống khác, chuẩn mực tốt nhất là tạo ra các **Custom Error Classes** kế thừa từ lớp cha `Error`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Lệnh `throw`**:
  `throw new Error("Thông điệp mô tả lỗi");`
- **Tạo Custom Error Class**:
  ```javascript
  class ValidationError extends Error {
      constructor(message) {
          super(message);
          this.name = "ValidationError";
      }
  }
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
class InsufficientFundsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InsufficientFundsError";
    }
}

function withdraw(balance, amount) {
    if (amount > balance) {
        throw new InsufficientFundsError("Số dư không đủ để thực hiện giao dịch!");
    }
    return balance - amount;
}

try {
    withdraw(50000, 100000);
} catch (err) {
    console.log(`${err.name}: ${err.message}`);
}
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Ném chuỗi nguyên thủy**: Tránh viết `throw "Lỗi rồi";` vì chuỗi thông thường không chứa thông tin Stack Trace. Luôn ném một đối tượng `new Error(...)` hoặc Custom Error.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `throw new Error(...)` để chủ động báo lỗi nghiệp vụ.
2. Tạo Custom Error bằng cách `class MyError extends Error`.
