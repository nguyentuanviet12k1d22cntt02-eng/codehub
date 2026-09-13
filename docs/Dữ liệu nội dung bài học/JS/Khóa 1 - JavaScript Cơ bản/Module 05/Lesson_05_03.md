---
lessonId: JS1-05.03
title: "Điều khiển luồng lặp với break, continue và tránh lặp vô tận"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["break", "continue", "Điều khiển luồng", "Vòng lặp", "Early exit"]
prerequisites: ["JS1-05.02"]
---

# Điều khiển luồng lặp với break, continue và tránh lặp vô tận

## 1. Khái niệm & Vấn đề thực tế
Trong nhiều bài toán tìm kiếm, ta chỉ cần tìm phần tử đầu tiên thỏa mãn điều kiện rồi dừng lại ngay (để tiết kiệm thời gian chạy). Hoặc khi gặp một số phần tử không hợp lệ, ta muốn bỏ qua bước tính toán đó và chuyển ngay sang lần lặp kế tiếp.

Hai câu lệnh `break` và `continue` cung cấp khả năng can thiệp trực tiếp vào chu kỳ lặp.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`break`**: Thoát ra khỏi vòng lặp gần nhất chứa nó ngay lập tức.
- **`continue`**: Dừng việc thực thi các câu lệnh còn lại của **bước lặp hiện tại** và nhảy ngay sang bước lặp kế tiếp (kiểm tra điều kiện hoặc tăng bước nhảy).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Ví dụ 1: Dùng break để dừng tìm kiếm ngay khi thấy kết quả
for (let i = 1; i <= 100; i++) {
    if (i % 7 === 0 && i % 11 === 0) {
        console.log("Số đầu tiên chia hết cho 7 và 11 là:", i); // 77
        break; // Thoát vòng lặp ngay, không cần chạy tiếp đến 100
    }
}

// Ví dụ 2: Dùng continue để bỏ qua số lẻ, chỉ in số chẵn
for (let i = 1; i <= 5; i++) {
    if (i % 2 !== 0) {
        continue; // Bỏ qua phần in bên dưới nếu i là số lẻ
    }
    console.log("Số chẵn:", i);
}
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng continue trong while**: Trong vòng lặp `while`, nếu đặt `continue` trước câu lệnh tăng biến đếm (`i++`), biến `i` sẽ không bao giờ tăng và dẫn đến **vòng lặp vô hạn**.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `break`: Thoát hẳn khỏi vòng lặp.
2. `continue`: Bỏ qua lượt lặp hiện tại và nhảy tới lượt tiếp theo.
