---
lessonId: JS2-09.04
title: "Nested Object & Sao chép tham chiếu vs Deep Clone"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Nested Object", "Reference Type", "Shallow Copy", "Deep Clone", "structuredClone"]
prerequisites: ["JS2-09.03"]
---

# Nested Object & Sao chép tham chiếu vs Deep Clone

## 1. Khái niệm & Vấn đề thực tế
Khác với kiểu dữ liệu nguyên thủy được sao chép theo giá trị (Pass-by-value), Đối tượng trong JavaScript là **Kiểu dữ liệu tham chiếu (Reference Type)**: biến chỉ lưu giữ địa chỉ vùng nhớ trỏ đến đối tượng trên Heap.

Nếu bạn viết `const b = a;`, cả `a` và `b` cùng trỏ chung một vùng nhớ. Khi sửa `b.name`, `a.name` cũng bị thay đổi theo!

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Shallow Copy (Sao chép nông)**:
  - `{ ...obj }` hoặc `Object.assign({}, obj)`
  - Chỉ sao chép các thuộc tính cấp 1. Nếu bên trong có đối tượng con (Nested Object), đối tượng con vẫn bị trỏ chung tham chiếu!
- **Deep Clone (Sao chép sâu)**:
  - Chuẩn hiện đại: `structuredClone(obj)` (hỗ trợ tích hợp sẵn trong Node.js và trình duyệt hiện đại).
  - Tạo ra một bản sao độc lập 100% ở mọi tầng lồng nhau.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const original = {
    user: "Linh",
    settings: { theme: "light" }
};

// Sử dụng structuredClone để sao chép sâu
const deepCopied = structuredClone(original);
deepCopied.settings.theme = "dark";

console.log("Original theme:", original.settings.theme);   // "light" (không bị đổi!)
console.log("Copied theme:", deepCopied.settings.theme);   // "dark"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng `JSON.parse(JSON.stringify(obj))`**: Cách này cũ, chậm và làm mất các giá trị đặc biệt như `Date`, `Map`, `Set`, `undefined`. Hãy dùng `structuredClone()` chuẩn mực.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Phép gán `=` chỉ sao chép địa chỉ tham chiếu.
2. Dùng `{ ...obj }` khi object phẳng (1 cấp).
3. Dùng `structuredClone(obj)` khi object lồng nhau nhiều cấp (Nested Object).
