---
lessonId: JS1-01.04
title: "Xuất dữ liệu với console.log() & Ghép chuỗi cơ bản"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["console.log", "Ghép chuỗi", "Toán tử +", "Concatenation", "Output"]
prerequisites: ["JS1-01.03"]
---

# Xuất dữ liệu với console.log() & Ghép chuỗi cơ bản

## 1. Khái niệm & Vấn đề thực tế
Trong môi trường lập trình không có giao diện đồ họa (console runtime), việc xuất thông tin có cấu trúc, kèm theo nhãn giải thích là thao tác cốt lõi để theo dõi kết quả thực thi và kiểm tra luồng dữ liệu.

JavaScript cung cấp hàm `console.log()` linh hoạt, hỗ trợ in nhiều giá trị đồng thời ngăn cách bởi dấu phẩy hoặc ghép nối chuỗi bằng toán tử cộng `+`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **In nhiều đối số**: `console.log(val1, val2, val3);` -> Tự động thêm một khoảng trắng giữa các giá trị khi in ra màn hình.
- **Toán tử cộng chuỗi `+`**: Khi có ít nhất một toán hạng là chuỗi, JavaScript sẽ ép các toán hạng còn lại về dạng chuỗi và ghép nối lại với nhau.

```javascript
const item = "Bút bi";
const price = 5000;

// Cách 1: Truyền nhiều tham số (tự có khoảng cách)
console.log("Sản phẩm:", item, "- Giá:", price);

// Cách 2: Ghép chuỗi bằng toán tử +
console.log("Giá tiền: " + price + " VNĐ");
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const name = "Lan";
const scoreMath = 9;
const scorePhys = 8;
const total = scoreMath + scorePhys;

console.log("Học sinh:", name);
console.log("Tổng điểm:", total);
```

- Dòng 4: Tính tổng số học giữa hai số 9 và 8 (`total = 17`).
- Dòng 6: In chuỗi `"Học sinh:"` kèm giá trị của biến `name`.
- Dòng 7: In chuỗi `"Tổng điểm:"` kèm kết quả tính toán `17`.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Thứ tự ưu tiên khi vừa cộng số vừa ghép chuỗi**:
  ```javascript
  console.log("Tổng là: " + 5 + 10); // Kết quả: "Tổng là: 510" (do bị ép chuỗi từ trái qua phải)
  console.log("Tổng là: " + (5 + 10)); // Kết quả: "Tổng là: 15" (dùng ngoặc tròn nhóm phép tính)
  ```

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `console.log(a, b)` tự chèn dấu cách ngăn cách giữa `a` và `b`.
2. Khi dùng toán tử `+` để ghép chuỗi kèm biểu thức toán học, luôn bao bọc phép tính số học trong dấu ngoặc tròn `()`.
