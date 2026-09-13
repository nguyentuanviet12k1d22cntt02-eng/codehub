---
lessonId: JS1-06.02
title: "Tham số, đối số & Tham số mặc định (Default Parameters)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Parameters", "Arguments", "Default Parameters", "ES6", "undefined"]
prerequisites: ["JS1-06.01"]
---

# Tham số, đối số & Tham số mặc định (Default Parameters)

## 1. Khái niệm & Vấn đề thực tế
- **Tham số (Parameter)**: Biến được định nghĩa trong danh sách khai báo hàm (chỗ nhận dữ liệu).
- **Đối số (Argument)**: Giá trị thực tế được truyền vào hàm khi gọi thực thi.

Trước ES6, nếu một đối số bị người dùng bỏ quên không truyền vào, nó sẽ nhận giá trị `undefined`, dễ làm sai lệch phép tính (ví dụ `undefined * 5 = NaN`). Từ ES6, tính năng **Default Parameters** cho phép thiết lập sẵn giá trị mặc định cho tham số.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
function greet(name = "bạn", title = "Học viên") {
    console.log("Xin chào", title, name);
}

greet();                 // "Xin chào Học viên bạn"
greet("Lan");            // "Xin chào Học viên Lan"
greet("Minh", "Giảng viên"); // "Xin chào Giảng viên Minh"
```

- Giá trị mặc định chỉ được kích hoạt khi đối số tương ứng là `undefined` hoặc không được truyền vào.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function calculateBill(price, quantity = 1, discountRate = 0.05) {
    const rawTotal = price * quantity;
    const discount = rawTotal * discountRate;
    return rawTotal - discount;
}

console.log(calculateBill(100000));       // Mua 1 cái, giảm 5% -> 95000
console.log(calculateBill(100000, 3));    // Mua 3 cái, giảm 5% -> 285000
console.log(calculateBill(100000, 3, 0.1)); // Giảm 10% -> 270000
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Đặt tham số mặc định ở đầu danh sách**: Luôn đặt các tham số có giá trị mặc định ở **cuối cùng** trong danh sách tham số để người dùng không phải truyền `undefined` ở các vị trí đầu.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `function fn(param = defaultValue)`.
2. Giá trị mặc định giúp hàm linh hoạt và tránh phát sinh lỗi `NaN`.
