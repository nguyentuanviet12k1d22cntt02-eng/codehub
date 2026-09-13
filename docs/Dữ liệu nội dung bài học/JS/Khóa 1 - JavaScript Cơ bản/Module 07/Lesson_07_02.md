---
lessonId: JS1-07.02
title: "Thao tác biến đổi mảng (push, pop, shift, unshift, slice, splice)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["push", "pop", "shift", "unshift", "splice", "slice", "Mutation"]
prerequisites: ["JS1-07.01"]
---

# Thao tác biến đổi mảng (push, pop, shift, unshift, slice, splice)

## 1. Khái niệm & Vấn đề thực tế
Khi quản lý danh sách công việc (Todo List) hay hàng đợi giao dịch, ta liên tục cần thêm mới hoặc loại bỏ phần tử ở đầu/cuối hoặc giữa danh sách.

Trong JavaScript, có hai nhóm phương thức quan trọng:
1. **Mutating Methods (Làm thay đổi mảng gốc)**: `push()`, `pop()`, `shift()`, `unshift()`, `splice()`.
2. **Non-mutating Methods (Trả về mảng mới, giữ nguyên mảng gốc)**: `slice()`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Thao tác ở cuối mảng**:
  - `arr.push(val)`: Thêm phần tử vào **cuối** mảng (trả về length mới).
  - `arr.pop()`: Xóa và trả về phần tử ở **cuối** mảng.
- **Thao tác ở đầu mảng**:
  - `arr.unshift(val)`: Thêm phần tử vào **đầu** mảng.
  - `arr.shift()`: Xóa và trả về phần tử ở **đầu** mảng.
- **Trích xuất & Cắt sửa**:
  - `arr.slice(start, end)`: Trích xuất một mảng con từ chỉ mục `start` đến trước `end` (mảng gốc không đổi).
  - `arr.splice(start, deleteCount, ...items)`: Xóa `deleteCount` phần tử từ `start` và có thể chèn thêm phần tử mới vào vị trí đó (mảng gốc bị thay đổi).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const queue = ["An", "Binh"];

queue.push("Chi"); // ["An", "Binh", "Chi"]
const served = queue.shift(); // Phục vụ "An", queue còn ["Binh", "Chi"]

console.log("Đã phục vụ:", served);
console.log("Còn lại:", queue.join(", "));
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Nhầm lẫn giữa `slice` và `splice`**: `slice` KHÔNG làm thay đổi mảng gốc, còn `splice` CẮT TRỰC TIẾP vào mảng gốc.
- **Hiệu năng của `shift()`/`unshift()`**: Vì phải đánh chỉ mục lại toàn bộ phần tử phía sau, `shift()` chậm hơn nhiều so với `pop()`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cuối mảng: `push` (thêm), `pop` (xóa).
2. Đầu mảng: `unshift` (thêm), `shift` (xóa).
3. `slice` sao chép an toàn; `splice` can thiệp trực tiếp mảng gốc.
