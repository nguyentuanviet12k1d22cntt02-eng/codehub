---
lessonId: JS1-02.02
title: "Toán tử số học, toán tử gán & Thứ tự ưu tiên toán tử"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Toán tử số học", "Modulo", "Lũy thừa", "Toán tử gán", "Operator Precedence"]
prerequisites: ["JS1-02.01"]
---

# Toán tử số học, toán tử gán & Thứ tự ưu tiên toán tử

## 1. Khái niệm & Vấn đề thực tế
Để xử lý các bài toán tài chính, thống kê hay giải thuật, JavaScript cung cấp đầy đủ các toán tử tính toán đại số và các toán tử kết hợp gán giá trị nhằm tối ưu hóa cách viết code.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Các toán tử số học cơ bản**:
  - `+` (Cộng), `-` (Trừ), `*` (Nhân), `/` (Chia thực - kết quả luôn là số thập phân nếu không chia hết).
  - `%` (Chia lấy dư - Modulo).
  - `**` (Lũy thừa - Power, ví dụ: `2 ** 3 = 8`).
- **Toán tử gán mở rộng**:
  - `+=`, `-=`, `*=`, `/=`, `%=`.
- **Thứ tự ưu tiên**:
  - Ngoặc tròn `()` ưu tiên cao nhất.
  - Lũy thừa `**`.
  - Nhân, chia, chia dư `*`, `/`, `%`.
  - Cộng, trừ `+`, `-`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
let balance = 100;
balance += 50;   // balance = 150
balance *= 2;    // balance = 300

const remainder = 17 % 5; // 17 chia 5 dư 2
const power = 3 ** 2;     // 3 mũ 2 = 9

console.log("Remainder:", remainder);
console.log("Power:", power);
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Chia cho số 0**: Trong JavaScript, phép chia `10 / 0` **không** gây crash chương trình mà trả về giá trị đặc biệt `Infinity` (hoặc `-Infinity`). Phép tính `0 / 0` trả về `NaN`.
- **Toán tử tăng giảm tiền tố vs hậu tố**: `++x` (tăng trước rồi lấy giá trị) khác với `x++` (lấy giá trị hiện tại rồi mới tăng).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. JavaScript hỗ trợ toán tử lũy thừa `**` chuẩn ES6 thay cho `Math.pow()`.
2. Phép chia `/` trong JS luôn là phép chia thực số học.
3. Luôn dùng ngoặc đơn `()` khi viết biểu thức phức tạp để kiểm soát thứ tự thực thi.
