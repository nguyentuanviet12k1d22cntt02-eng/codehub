---
lessonId: JS1-08.04
title: "Tách ghép & Thay thế chuỗi (split, join, replace, replaceAll)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["split", "join", "replace", "replaceAll", "Chuẩn hóa chuỗi"]
prerequisites: ["JS1-08.03"]
---

# Tách ghép & Thay thế chuỗi (split, join, replace, replaceAll)

## 1. Khái niệm & Vấn đề thực tế
Cặp đôi `split()` và `join()` là cầu nối trực tiếp giữa hai cấu trúc dữ liệu cơ bản nhất trong JavaScript: **String** và **Array**.
- `split()`: Băm nhỏ một chuỗi thành mảng các từ/thành phần con dựa trên dấu phân cách.
- `join()`: Ghép các phần tử trong mảng lại thành một chuỗi duy nhất.

Ngoài ra, `replace()` và `replaceAll()` (ES2021) giúp thay thế nhanh chóng các từ hoặc mẫu ký tự trong văn bản.

---

## 2. Cú pháp & Quy tắc cốt lõi
- `str.split(separator)`: Tách chuỗi thành mảng.
- `arr.join(separator)`: Ghép mảng thành chuỗi.
- `str.replace(target, replacement)`: Chỉ thay thế **lần xuất hiện đầu tiên** của `target`.
- `str.replaceAll(target, replacement)`: Thay thế **tất cả mọi lần xuất hiện** của `target`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const sentence = "hoc-lap-trinh-javascript-thuan";

// 1. Tách chuỗi thành mảng các từ
const words = sentence.split("-"); // ["hoc", "lap", "trinh", "javascript", "thuan"]

// 2. Ghép lại bằng dấu cách
const cleanSentence = words.join(" ");
console.log(cleanSentence); // "hoc lap trinh javascript thuan"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lầm tưởng `replace()` thay thế toàn bộ**: `str.replace("a", "b")` chỉ đổi đúng chữ `a` đầu tiên. Muốn đổi hết hãy dùng `str.replaceAll("a", "b")` hoặc biểu thức chính quy `/a/g`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `split` biến Chuỗi thành Mảng.
2. `join` biến Mảng thành Chuỗi.
3. Dùng `replaceAll` khi cần đổi tất cả ký tự trong toàn bộ văn bản.
