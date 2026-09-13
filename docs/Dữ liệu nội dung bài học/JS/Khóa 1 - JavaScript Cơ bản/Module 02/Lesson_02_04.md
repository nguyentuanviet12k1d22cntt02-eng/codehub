---
lessonId: JS1-02.04
title: "Toán tử logic (&&, ||, !) & Đánh giá ngắn mạch (Short-circuit)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Logical operators", "AND &&", "OR ||", "NOT !", "Short-circuit evaluation"]
prerequisites: ["JS1-02.03"]
---

# Toán tử logic (&&, ||, !) & Đánh giá ngắn mạch (Short-circuit)

## 1. Khái niệm & Vấn đề thực tế
Các toán tử logic cho phép kết hợp hoặc đảo ngược nhiều điều kiện so sánh để đưa ra quyết định trong chương trình.
Bên cạnh bảng chân trị cơ bản, JavaScript có cơ chế **Đánh giá ngắn mạch (Short-circuit evaluation)**: dừng kiểm tra ngay khi kết quả tổng thể đã được xác định chắc chắn.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`&&` (AND logic)**: Trả về `true` khi và chỉ khi TẤT CẢ toán hạng đều `true`. Nếu gặp toán hạng đầu tiên là `false`, nó dừng ngay lập tức và trả về giá trị đó (ngắn mạch).
- **`||` (OR logic)**: Trả về `true` chỉ cần ÍT NHẤT MỘT toán hạng là `true`. Nếu gặp toán hạng đầu tiên là `true`, nó dừng ngay và trả về giá trị đó.
- **`!` (NOT logic)**: Đảo ngược chân trị (`!true` thành `false`, `!false` thành `true`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const gpa = 8.5;
const conductScore = 90;

// Điều kiện học bổng: GPA >= 8.0 VÀ điểm rèn luyện >= 85
const isScholarship = (gpa >= 8.0) && (conductScore >= 85);
console.log("Được học bổng:", isScholarship); // true

// Hoặc là con thương binh, hoặc điểm thi xuất sắc
const isPrivileged = false;
const hasSpecialOffer = isPrivileged || (gpa >= 9.0);
console.log("Ưu đãi đặc biệt:", hasSpecialOffer); // false
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Giá trị trả về của `&&` và `||` không chỉ là boolean**:
  ```javascript
  console.log("Hello" && 123); // 123 (vì cả hai đều truthy, trả về toán hạng cuối)
  console.log(null || "Default"); // "Default" (gặp truthy đầu tiên trả về ngay)
  ```
- Kỹ thuật này thường được dùng để đặt giá trị dự phòng (fallback default value).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `&&` cần tất cả đúng; `||` chỉ cần một điều kiện đúng.
2. Short-circuit giúp tiết kiệm tài nguyên CPU và tránh lỗi truy cập bộ nhớ khi vế trái không hợp lệ.
