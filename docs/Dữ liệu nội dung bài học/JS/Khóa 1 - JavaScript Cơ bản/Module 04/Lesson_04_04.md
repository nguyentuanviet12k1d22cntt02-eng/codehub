---
lessonId: JS1-04.04
title: "Điều kiện lồng nhau & Xây dựng thuật toán kiểm tra dữ liệu phức hợp"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Nested if", "Guard Clauses", "Thuật toán rẽ nhánh", "Validation", "Clean code"]
prerequisites: ["JS1-04.03"]
---

# Điều kiện lồng nhau & Xây dựng thuật toán kiểm tra dữ liệu phức hợp

## 1. Khái niệm & Vấn đề thực tế
Trong các bài toán thực tế (tính thuế, tính cước vận chuyển, kiểm duyệt đơn hàng), quyết định logic thường phụ thuộc vào nhiều tầng điều kiện lồng nhau (Nested Conditions).

Nếu lồng quá nhiều tầng `if` trong `if`, mã nguồn sẽ bị hiện tượng **"Kim tự tháp địa ngục (Pyramid of Doom)"**, gây khó đọc và dễ nhầm lẫn. Lập trình viên chuyên nghiệp áp dụng kỹ thuật **Guard Clauses (Lính gác / Thoát sớm)** để làm phẳng cấu trúc mã.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Cấu trúc điều kiện lồng nhau**:
  ```javascript
  if (isVip) {
      if (orderTotal > 500000) {
          discount = 0.2;
      } else {
          discount = 0.1;
      }
  } else {
      discount = 0.0;
  }
  ```
- **Kỹ thuật Guard Clauses**: Kiểm tra và xử lý các trường hợp lỗi hoặc điều kiện biên ngay ở đầu, giúp luồng chính luôn thông thoáng.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const weight = 3.5; // kg
const distance = 120; // km

let fee = 20000; // Cước cơ bản

// Tính thêm phụ phí trọng lượng
if (weight > 2.0) {
    fee += (weight - 2.0) * 5000;
}

// Tính thêm phụ phí khoảng cách
if (distance > 100) {
    fee += 15000;
}

console.log("Tổng cước:", fee);
```

- Bằng cách phân tách các điều kiện độc lập thành các khối `if` tuần tự, ta tránh được việc lồng ghép phức tạp.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lồng nhau quá 3 cấp độ**: Nếu mã nguồn của bạn có nhiều hơn 3 cấp ngoặc nhọn `{ { { } } }`, hãy cân nhắc tách nhỏ logic hoặc áp dụng toán tử logic `&&`, `||`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Điều kiện lồng nhau giúp phân loại dữ liệu đa chiều.
2. Áp dụng kỹ thuật phân tách điều kiện và Guard Clauses để mã nguồn luôn phẳng và dễ bảo trì.
