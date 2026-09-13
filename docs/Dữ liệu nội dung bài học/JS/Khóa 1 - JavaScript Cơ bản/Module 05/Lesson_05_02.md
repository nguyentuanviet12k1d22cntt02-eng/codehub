---
lessonId: JS1-05.02
title: "Vòng lặp điều kiện while và do...while"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["while", "do while", "Vòng lặp điều kiện", "Euclid", "UCLN"]
prerequisites: ["JS1-05.01"]
---

# Vòng lặp điều kiện while và do...while

## 1. Khái niệm & Vấn đề thực tế
Khi số lần lặp **chưa biết trước** mà phụ thuộc vào một trạng thái hoặc điều kiện biến đổi liên tục (ví dụ: chia dần số cho đến khi bằng 0, lặp đến khi đạt độ chính xác sai số), vòng lặp `while` và `do...while` là lựa chọn tối ưu.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Vòng lặp `while` (Kiểm tra trước)**:
  ```javascript
  while (condition) {
      // Thực thi khi condition là true
      // Cần có câu lệnh làm thay đổi condition để tránh lặp vô hạn
  }
  ```
  Nếu `condition` ngay từ đầu là `false`, khối lệnh **không bao giờ chạy**.

- **Vòng lặp `do...while` (Kiểm tra sau)**:
  ```javascript
  do {
      // Luôn chạy ÍT NHẤT 1 LẦN trước khi kiểm tra điều kiện
  } while (condition);
  ```

---

## 3. Ví dụ trực quan: Thuật toán Euclid tìm Ước chung lớn nhất (UCLN)

```javascript
let a = 48;
let b = 18;

// Thuật toán Euclid lặp: UCLN(a, b) = UCLN(b, a % b) cho đến khi b === 0
while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
}

console.log("UCLN là:", a); // 6
```

- Vòng lặp tự động kết thúc ngay khi `b === 0`, giá trị còn lại của `a` chính là UCLN.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên câu lệnh cập nhật**: Nếu trong thân `while` không có dòng lệnh nào làm biến đổi điều kiện dừng, CPU sẽ bị chiếm dụng 100% (treo chương trình).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `while` khi số lần lặp phụ thuộc điều kiện biến thiên.
2. Dùng `do...while` khi chắc chắn cần khối lệnh chạy ít nhất một lần.
