---
lessonId: JS2-10.01
title: "Phân rã mảng & đối tượng nâng cao (Destructuring Assignment)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Destructuring", "Array Destructuring", "Object Destructuring", "Hoán đổi biến", "ES6"]
prerequisites: ["JS2-09.05"]
---

# Phân rã mảng & đối tượng nâng cao (Destructuring Assignment)

## 1. Khái niệm & Vấn đề thực tế
Trước ES6, để lấy từng thuộc tính của đối tượng hoặc từng phần tử của mảng gán vào biến riêng, ta phải viết từng dòng lặp đi lặp lại (`const a = obj.a; const b = obj.b;`).

**Destructuring Assignment (Gán phân rã)** cho phép "giải nén" các giá trị từ mảng hoặc thuộc tính từ đối tượng thành các biến riêng biệt chỉ với một dòng mã.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Object Destructuring**:
  ```javascript
  const user = { name: "An", age: 25, role: "admin" };
  const { name, age } = user; // Trích xuất name và age
  const { role: userRole } = user; // Đổi tên biến role thành userRole
  ```
- **Array Destructuring**:
  ```javascript
  const coords = [10.5, 106.8];
  const [lat, lng] = coords;
  ```
- **Kỹ thuật hoán đổi 2 biến không cần biến trung gian `temp`**:
  ```javascript
  let a = 1, b = 2;
  [a, b] = [b, a]; // a thành 2, b thành 1!
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const response = {
    status: 200,
    data: { id: 101, title: "Learn JS" }
};

// Phân rã lồng nhau
const { status, data: { title } } = response;
console.log(status); // 200
console.log(title);  // "Learn JS"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên dấu chấm phẩy trước `[a, b] = [b, a]`**: Khi hoán đổi biến ở đầu dòng, nếu dòng trước đó thiếu `;`, JS Engine sẽ hiểu nhầm thành lời gọi hàm hoặc truy cập index mảng.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `{ prop1, prop2 } = obj` cho Object.
2. Dùng `[first, second] = arr` cho Array.
3. Hoán đổi biến siêu gọn: `[x, y] = [y, x]`.
