---
lessonId: JS1-02.03
title: "So sánh lỏng lẻo (==, !=) vs So sánh nghiêm ngặt (===, !==)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Strict equality", "Loose equality", "===", "==", "Type coercion"]
prerequisites: ["JS1-02.02"]
---

# So sánh lỏng lẻo (==, !=) vs So sánh nghiêm ngặt (===, !==)

## 1. Khái niệm & Vấn đề thực tế
Một trong những nguồn gốc gây bug phổ biến nhất trong JavaScript là việc phân vân giữa hai bộ toán tử so sánh:
- **So sánh lỏng lẻo (`==`, `!=`)**: Tự động ép kiểu hai vế về cùng kiểu dữ liệu trước khi so sánh (Implicit Type Coercion).
- **So sánh nghiêm ngặt (`===`, `!==`)**: So sánh cả **giá trị** lẫn **kiểu dữ liệu**. Nếu kiểu dữ liệu khác nhau, lập tức trả về `false`.

---

## 2. Cú pháp & Quy tắc cốt lõi
| Biểu thức | Kết quả | Giải thích |
| :--- | :--- | :--- |
| `5 == "5"` | `true` | Chuỗi `"5"` bị ép kiểu thành số `5` |
| `5 === "5"` | `false` | Số `number` khác kiểu chuỗi `string` |
| `0 == false` | `true` | `false` bị ép kiểu thành `0` |
| `0 === false` | `false` | `number` khác `boolean` |
| `null == undefined` | `true` | Quy ước đặc biệt của JS |
| `null === undefined` | `false` | Hai kiểu dữ liệu khác nhau |

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const userInput = "100";
const targetScore = 100;

console.log("So sánh ==:", userInput == targetScore);   // true
console.log("So sánh ===:", userInput === targetScore); // false
```

- Toán tử `==` tự động chuyển `"100"` thành số `100`, dẫn đến kết quả `true`.
- Toán tử `===` phát hiện một bên là `string`, một bên là `number`, trả về ngay `false`.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quy tắc tuyệt đối của lập trình viên chuyên nghiệp**: Luôn luôn dùng `===` và `!==`. Không bao giờ sử dụng `==` hay `!=` trừ những trường hợp kiểm tra `val == null` (để cùng lúc bắt cả `null` và `undefined`).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `==` thực hiện ép kiểu ngầm định; `===` so sánh nghiêm ngặt giá trị và kiểu.
2. 99% trường hợp trong thực tế bắt buộc dùng `===` để tránh sai lệch logic.
