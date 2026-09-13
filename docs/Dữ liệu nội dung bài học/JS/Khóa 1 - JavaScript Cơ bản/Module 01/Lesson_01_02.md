---
lessonId: JS1-01.02
title: "Cú pháp câu lệnh, dấu chấm phẩy & Chú thích (Comments)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Semicolon", "ASI", "Single-line comment", "Multi-line comment", "Clean code"]
prerequisites: ["JS1-01.01"]
---

# Cú pháp câu lệnh, dấu chấm phẩy & Chú thích (Comments)

## 1. Khái niệm & Vấn đề thực tế
Một chương trình JavaScript là tập hợp các câu lệnh (statements). JavaScript hỗ trợ cơ chế **Automatic Semicolon Insertion (ASI)** – tự động chèn dấu chấm phẩy khi xuống dòng. Tuy nhiên, việc hiểu sai về ASI có thể dẫn đến các lỗi logic rất khó phát hiện (ví dụ lệnh `return` bị xuống dòng).

Do đó, tiêu chuẩn viết code hiện đại khuyến nghị người học lập trình nên chủ động thêm dấu chấm phẩy `;` rõ ràng ở cuối mỗi câu lệnh.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Chú thích 1 dòng**: Sử dụng `//` (bỏ qua mọi ký tự từ `//` đến hết dòng).
- **Chú thích nhiều dòng**: Sử dụng cặp ký hiệu `/* ... */`.
- **Dấu chấm phẩy `;`**: Ngăn cách giữa các câu lệnh thực thi độc lập.

```javascript
// Đây là chú thích một dòng
/*
   Đây là chú thích
   nhiều dòng (Block comment)
*/
const PI = 3.14159; // Kết thúc câu lệnh bằng dấu chấm phẩy
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// 1. Khởi tạo giá trị
const a = 10;
const b = 20;

// 2. Tính toán và in kết quả
const sum = a + b;
console.log("Tổng là:", sum);
```

- Dòng 2 & 3: Khai báo hai hằng số và kết thúc bằng dấu chấm phẩy rõ ràng.
- Dòng 6: Biểu thức tính toán kết hợp gán giá trị vào biến `sum`.
- Dòng 7: Xuất chuỗi nhãn kèm biến ra màn hình console.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Cạm bẫy ASI với return**:
  ```javascript
  // LỖI NGUY HIỂM DO ASI:
  return
  { name: "JS" };
  // Trình thông dịch tự hiểu thành: return; (trả về undefined)
  ```
- **Lồng chú thích nhiều dòng**: JavaScript **không** cho phép lồng `/* /* */ */`. Gặp dấu `*/` đầu tiên, khối chú thích sẽ kết thúc ngay lập tức.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `//` cho chú thích ngắn một dòng, `/* ... */` cho mô tả tài liệu nhiều dòng.
2. Luôn chủ động đặt dấu `;` ở cuối các câu lệnh để đảm bảo mã nguồn an toàn tuyệt đối.
