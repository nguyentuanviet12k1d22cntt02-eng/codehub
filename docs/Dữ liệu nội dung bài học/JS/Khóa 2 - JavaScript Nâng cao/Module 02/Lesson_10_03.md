---
lessonId: JS2-10.03
title: "Gom tham số với Rest Parameters (...args) trong hàm"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Rest Parameters", "...args", "Variadic function", "arguments", "ES6"]
prerequisites: ["JS2-10.02"]
---

# Gom tham số với Rest Parameters (...args) trong hàm

## 1. Khái niệm & Vấn đề thực tế
Khi viết các hàm tiện ích có thể nhận số lượng đối số không cố định (ví dụ hàm tính tổng `sum(1, 2, 3, 4, ...)`, hàm log định dạng), trước ES6 lập trình viên phải dùng biến ẩn `arguments` (vốn là một đối tượng giống mảng - array-like nhưng không có các hàm như `map`, `reduce`).

ES6 ra mắt **Rest Parameters (`...args`)**, gom toàn bộ các đối số còn lại thành một **mảng JavaScript thực thụ (Array)**.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
function fn(firstParam, ...restParams) {
    // firstParam là đối số đầu tiên
    // restParams là một MẢNG chứa toàn bộ các đối số còn lại
}
```

- **Quy tắc duy nhất**: Rest parameter bắt buộc phải là **tham số cuối cùng** trong danh sách khai báo hàm. Mỗi hàm chỉ được phép có duy nhất một Rest parameter.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function sumAll(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

console.log(sumAll(10, 20));             // 30
console.log(sumAll(1, 2, 3, 4, 5, 6));   // 21
```

- Mọi đối số truyền vào đều được tự động gom vào mảng `numbers`. Ta có thể dùng trực tiếp hàm `.reduce()` của mảng mà không cần chuyển đổi.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Đặt Rest Parameter ở giữa danh sách**: `function test(...args, last) {}` -> Báo lỗi cú pháp `SyntaxError: Rest parameter must be last formal parameter`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `...paramName` ở vị trí cuối cùng trong danh sách tham số.
2. Biến rest là một mảng thuần túy, sở hữu đầy đủ các phương thức `.map()`, `.filter()`, `.reduce()`.
