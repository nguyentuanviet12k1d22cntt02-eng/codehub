---
lessonId: JS2-12.01
title: "Nguyên lý Prototype, __proto__ & Prototype Chain"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Prototype", "__proto__", "Prototype Chain", "Object.create", "Kế thừa nguyên mẫu"]
prerequisites: ["JS2-11.05"]
---

# Nguyên lý Prototype, __proto__ & Prototype Chain

## 1. Khái niệm & Vấn đề thực tế
Không giống các ngôn ngữ như Java hay C++ (vốn sử dụng mô hình Class-based cổ điển), JavaScript ngay từ đầu được xây dựng trên nền tảng **Kế thừa dựa trên nguyên mẫu (Prototypal Inheritance)**.

Mỗi đối tượng trong JavaScript đều có một liên kết nội bộ ẩn trỏ đến một đối tượng khác, gọi là **Prototype (Nguyên mẫu)**. Khi bạn đọc một thuộc tính từ một object mà object đó không có, Engine sẽ lần theo liên kết này để tìm kiếm trên Prototype của nó. Quá trình này tạo thành một chuỗi gọi là **Prototype Chain**.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`Object.create(proto)`**: Tạo ra một đối tượng mới có nguyên mẫu kế thừa trực tiếp từ `proto`.
- **`Object.getPrototypeOf(obj)`**: Phương thức chuẩn mực để lấy prototype của `obj` (thay thế cho thuộc tính kế thừa cũ `__proto__`).
- **Điểm kết thúc của Prototype Chain**: `Object.prototype` (nguyên mẫu cao nhất, prototype của nó là `null`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const animal = {
    isAlive: true,
    eat() {
        return "Đang ăn...";
    }
};

// Tạo rabbit kế thừa từ animal
const rabbit = Object.create(animal);
rabbit.name = "Thỏ trắng";

console.log(rabbit.name);    // "Thỏ trắng" (thuộc tính của chính rabbit)
console.log(rabbit.isAlive); // true (tìm thấy trên prototype animal!)
console.log(rabbit.eat());   // "Đang ăn..." (phương thức kế thừa từ animal)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Ghi đè thuộc tính (Property Shadowing)**: Nếu bạn gán `rabbit.isAlive = false`, thuộc tính `isAlive` sẽ được tạo riêng trên `rabbit`, không làm thay đổi giá trị `isAlive` trên nguyên mẫu `animal`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Mọi đối tượng đều có một prototype.
2. Tra cứu thuộc tính diễn ra dọc theo Prototype Chain từ dưới lên trên.
3. Tạo đối tượng kế thừa chuẩn: `Object.create(parentObj)`.
