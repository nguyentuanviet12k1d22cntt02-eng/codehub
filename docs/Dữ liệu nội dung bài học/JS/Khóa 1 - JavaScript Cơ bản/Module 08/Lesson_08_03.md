---
lessonId: JS1-08.03
title: "Tìm kiếm & Trích xuất chuỗi (includes, startsWith, endsWith, slice)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["startsWith", "endsWith", "includes", "slice", "Trích xuất chuỗi"]
prerequisites: ["JS1-08.02"]
---

# Tìm kiếm & Trích xuất chuỗi (includes, startsWith, endsWith, slice)

## 1. Khái niệm & Vấn đề thực tế
Khi kiểm tra định dạng tên tệp (đuôi `.js`, `.png`), mã định danh sinh viên hay kiểm tra một từ khóa có nằm trong văn bản hay không, JavaScript cung cấp bộ công cụ tìm kiếm và cắt chuỗi vô cùng tiện lợi.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Kiểm tra vị trí và tiền tố/hậu tố**:
  - `str.includes(sub)`: Kiểm tra xem `sub` có xuất hiện ở bất kỳ đâu trong chuỗi hay không.
  - `str.startsWith(prefix)`: Kiểm tra xem chuỗi có **bắt đầu** bằng `prefix` hay không.
  - `str.endsWith(suffix)`: Kiểm tra xem chuỗi có **kết thúc** bằng `suffix` hay không.
- **Cắt chuỗi bằng `str.slice(startIndex, endIndex)`**:
  - Trích xuất phần chuỗi từ chỉ mục `startIndex` đến trước `endIndex`.
  - Hỗ trợ chỉ mục âm: `str.slice(-4)` lấy 4 ký tự cuối cùng của chuỗi!

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const filename = "app_server.js";

console.log(filename.startsWith("app")); // true
console.log(filename.endsWith(".js"));   // true

// Lấy phần mở rộng (extension)
const ext = filename.slice(-3);
console.log("Extension:", ext); // ".js"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Phân biệt hoa thường**: Các phương thức tìm kiếm chuỗi phân biệt chữ hoa/thường (`"JS".startsWith("js")` trả về `false`). Hãy đưa về `.toLowerCase()` trước khi kiểm tra nếu cần tìm kiếm không phân biệt hoa thường.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `startsWith()`, `endsWith()`, `includes()` trả về kết quả `boolean`.
2. `slice(start, end)` cho phép dùng chỉ mục âm để cắt từ đuôi chuỗi.
