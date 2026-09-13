---
lessonId: JS1-05.01
title: "Vòng lặp for cơ bản và kỹ thuật duyệt dãy số"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["for loop", "Vòng lặp for", "Biến đếm", "Tích lũy", "Iteration"]
prerequisites: ["JS1-04.04"]
---

# Vòng lặp for cơ bản và kỹ thuật duyệt dãy số

## 1. Khái niệm & Vấn đề thực tế
Khi cần thực hiện một công việc lặp đi lặp lại nhiều lần với số lần lặp biết trước (ví dụ: in từ 1 đến 100, tính tổng các số chẵn, duyệt qua từng phần tử), vòng lặp `for` là công cụ kinh điển và hiệu quả nhất.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
for (khoi_tao; dieu_kien_lap; buoc_nhay) {
    // Khối mã được thực thi mỗi lần lặp
}
```

1. **Khởi tạo (`khoi_tao`)**: Chạy duy nhất 1 lần khi bắt đầu vòng lặp (thường là `let i = 0`).
2. **Điều kiện lặp (`dieu_kien_lap`)**: Được kiểm tra trước mỗi vòng lặp. Nếu `true` thì chạy tiếp, nếu `false` thì thoát vòng lặp.
3. **Bước nhảy (`buoc_nhay`)**: Chạy sau mỗi lần thân vòng lặp hoàn thành (ví dụ `i++`, `i += 2`, `i--`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
let total = 0;

for (let i = 1; i <= 5; i++) {
    total += i; // Cộng dồn i vào total
}

console.log("Tổng từ 1 đến 5 là:", total); // 15
```

- Vòng lặp chạy 5 lần với `i` lần lượt nhận giá trị: 1, 2, 3, 4, 5.
- Tại `i = 6`, điều kiện `6 <= 5` trở thành `false`, vòng lặp dừng lại.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dùng `var` thay vì `let` cho biến đếm**: Nếu dùng `var i`, biến `i` sẽ bị rò rỉ ra ngoài phạm vi vòng lặp. Luôn luôn khai báo `let i = 0`.
- **Lỗi lặp vô tận (Infinite Loop)**: Quên cập nhật bước nhảy hoặc viết sai điều kiện khiến điều kiện luôn luôn là `true`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cấu trúc `for (let i = start; i <= end; i++)`.
2. Luôn dùng `let` để biến đếm có phạm vi cục bộ (block scope) bên trong vòng lặp.
