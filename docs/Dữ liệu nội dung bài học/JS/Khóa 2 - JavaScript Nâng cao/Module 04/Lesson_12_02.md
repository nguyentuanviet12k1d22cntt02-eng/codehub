---
lessonId: JS2-12.02
title: "Constructor Function & Cơ chế chia sẻ bộ nhớ prototype"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Constructor Function", "new operator", "prototype", "Tối ưu bộ nhớ", "OOP ES5"]
prerequisites: ["JS2-12.01"]
---

# Constructor Function & Cơ chế chia sẻ bộ nhớ prototype

## 1. Khái niệm & Vấn đề thực tế
Trước khi có từ khóa `class` trong ES6, các lập trình viên JavaScript tạo ra các bản thiết kế (blueprint) để sản xuất hàng loạt đối tượng bằng **Constructor Function (Hàm khởi tạo)** kết hợp với toán tử `new`.

Nếu bạn định nghĩa phương thức trực tiếp bên trong thân Constructor:
`this.sayHello = function() { ... }`
Thì khi tạo 10.000 đối tượng, sẽ có 10.000 hàm giống hệt nhau được sinh ra, gây lãng phí bộ nhớ RAM nghiêm trọng.
Giải pháp: Gắn phương thức vào **`Constructor.prototype`** để 10.000 đối tượng cùng chia sẻ duy nhất một bản sao trong bộ nhớ!

---

## 2. Cú pháp & Quy tắc cốt lõi
1. Tên hàm Constructor viết hoa chữ cái đầu: `function Person(name) { ... }`.
2. Khởi tạo đối tượng bằng toán tử `new Person(...)`.
3. Gắn phương thức dùng chung:
   `Person.prototype.tenPhuongThuc = function() { ... };`

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function Book(title, price) {
    this.title = title;
    this.price = price;
}

// Gắn phương thức vào prototype (chia sẻ bộ nhớ cho mọi instance)
Book.prototype.getInfo = function() {
    return `${this.title} - ${this.price}đ`;
};

const b1 = new Book("JS Core", 120000);
const b2 = new Book("JS Advanced", 150000);

console.log(b1.getInfo()); // "JS Core - 120000đ"
console.log(b1.getInfo === b2.getInfo); // true (dùng chung 1 vùng nhớ!)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên từ khóa `new`**: Nếu gọi `Book("JS", 100)` không có `new`, `this` sẽ trỏ vào đối tượng toàn cầu (Global) và hàm trả về `undefined`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Constructor function dùng `new` để tạo instance.
2. Luôn gắn phương thức vào `Constructor.prototype` để tối ưu RAM.
