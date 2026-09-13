---
lessonId: JS1-04.02
title: "Biểu thức điều kiện ba ngôi (Ternary Operator)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Ternary Operator", "Toán tử ba ngôi", "? :", "Conditional Expression"]
prerequisites: ["JS1-04.01"]
---

# Biểu thức điều kiện ba ngôi (Ternary Operator)

## 1. Khái niệm & Vấn đề thực tế
Khi cần gán giá trị cho một biến dựa trên một điều kiện đơn giản, việc dùng câu lệnh `if-else` truyền thống thường khiến mã nguồn dài dòng (cần 4–6 dòng code và phải dùng biến `let`).

Toán tử ba ngôi (**Ternary Operator**) là toán tử duy nhất trong JavaScript nhận 3 toán hạng, hoạt động như một **biểu thức có giá trị trả về**, cho phép ta gán trực tiếp kết quả vào một hằng số `const`.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
const result = condition ? valueIfTrue : valueIfFalse;
```

- Nếu `condition` là Truthy: trả về `valueIfTrue`.
- Nếu `condition` là Falsy: trả về `valueIfFalse`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const age = 20;

// Sử dụng toán tử ba ngôi để gán trực tiếp vào hằng số const
const status = age >= 18 ? "Người lớn" : "Trẻ vị thành niên";

console.log(status); // "Người lớn"
```

- Dòng 4: Biểu thức `age >= 18` là `true`, do đó chuỗi `"Người lớn"` được trả về và gán cho `status`.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng toán tử ba ngôi lồng nhau (Nested Ternary)**:
  `const res = a ? (b ? c : d) : (e ? f : g);` -> Cực kỳ khó đọc và khó bảo trì! Nếu có nhiều hơn 2 nhánh, hãy quay lại dùng `if-else` hoặc `switch-case`.
- **Dùng toán tử ba ngôi thay thế cho câu lệnh hành động**: Không nên viết `isLoggedIn ? showHome() : showLogin();` mà hãy dùng `if-else` thông thường khi không cần nhận giá trị trả về.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `condition ? exprIfTrue : exprIfFalse`.
2. Chỉ dùng toán tử ba ngôi cho các quyết định gán giá trị đơn giản 1 tầng.
