---
lessonId: JS2-11.03
title: "Lexical Scope & Kỹ thuật bao đóng (Closure) trong JavaScript"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Closure", "Lexical Scope", "Encapsulation", "Private State", "Higher-Order Function"]
prerequisites: ["JS2-11.02"]
---

# Lexical Scope & Kỹ thuật bao đóng (Closure) trong JavaScript

## 1. Khái niệm & Vấn đề thực tế
- **Lexical Scope (Phạm vi tĩnh)**: Vị trí của một biến được xác định bởi **nơi hàm được viết trong mã nguồn**, chứ không phụ thuộc vào nơi hàm được gọi thực thi.
- **Closure (Bao đóng)**: Là sự kết hợp giữa một hàm và môi trường từ vựng (Lexical Environment) nơi hàm đó được khai báo.
Nói đơn giản: **Hàm con có khả năng ghi nhớ và truy cập vào các biến của hàm cha ngay cả sau khi hàm cha đã chạy xong và biến mất khỏi Call Stack!**

---

## 2. Cú pháp & Quy tắc cốt lõi
Ứng dụng kinh điển nhất của Closure là **Tạo biến riêng tư (Private Variables / Data Encapsulation)**:
```javascript
function createCounter(initialValue = 0) {
    let count = initialValue; // Biến riêng tư, bên ngoài không thể can thiệp trực tiếp

    return {
        increment() { count++; return count; },
        decrement() { count--; return count; },
        get() { return count; }
    };
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const counter = createCounter(10);

console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.get());       // 11
```

- Mặc dù hàm `createCounter` đã chạy xong từ lâu, biến `count` vẫn được giữ sống trong bộ nhớ nhờ Closure của các phương thức `increment`, `decrement`.
- Bên ngoài không có cách nào sửa lén giá trị `counter.count = 999` vì `count` không phải là thuộc tính của đối tượng trả về.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Memory Leak (Rò rỉ bộ nhớ)**: Vì Closure giữ lại các biến trong phạm vi ngoài trên Heap, nếu giữ tham chiếu đến các đối tượng quá lớn không cần thiết, Garbage Collector sẽ không thể giải phóng vùng nhớ đó.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Closure cho phép hàm con ghi nhớ các biến của hàm cha.
2. Dùng Closure để bảo vệ dữ liệu nội bộ (Private State), không cho mã bên ngoài sửa đổi trực tiếp.
