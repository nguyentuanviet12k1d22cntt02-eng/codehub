---
lessonId: JS2-14.04
title: "Engine xử lý giao dịch tài chính & Tổng kết tư duy JS thuần"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Financial Engine", "Transaction Processing", "Tổng kết khóa học", "JavaScript thuần"]
prerequisites: ["JS2-14.03"]
---

# Engine xử lý giao dịch tài chính & Tổng kết tư duy JS thuần

## 1. Khái niệm & Vấn đề thực tế
Bài toán xử lý dòng giao dịch (Transaction Ledger / Financial Engine) là bài kiểm tra tổng hợp toàn diện nhất:
- Cần mô hình hóa đối tượng tài khoản và giao dịch (OOP).
- Cần kiểm tra điều kiện an toàn, rẽ nhánh logic và bẫy lỗi (Error Handling, try-catch).
- Cần xử lý tập hợp dữ liệu bằng các phương thức mảng hiện đại (filter, map, reduce).

---

## 2. Thiết kế giải pháp
1. `Transaction`: `{ type: "DEPOSIT" | "WITHDRAW", amount: number }`
2. `Account`: Chứa số dư, lịch sử giao dịch và phương thức `applyTransaction()`.
3. Kiểm soát lỗi: Nếu rút quá số dư, ghi nhận giao dịch thất bại và tiếp tục xử lý các giao dịch tiếp theo.

---

## 3. Tổng kết toàn diện tư duy JavaScript thuần
1. **Hiểu bản chất kiểu dữ liệu**: 7 Primitive types vs Reference types (Object/Array).
2. **Cơ chế thực thi**: Execution Context, Call Stack, Scope Chain, Hoisting, Closure.
3. **Mô hình đối tượng**: Prototype Chain, `this` runtime binding, ES6 Classes.
4. **Clean Code & An toàn**: Optional Chaining `?.`, Nullish Coalescing `??`, Destructuring, try-catch-finally.

---

## 4. Checklist tốt nghiệp khóa học
- [x] Tự tin đọc, hiểu và debug mã nguồn JavaScript thuần chuẩn ES6+.
- [x] Xây dựng được các ứng dụng dòng lệnh/thuật toán phức tạp độc lập, không phụ thuộc framework.
