---
lessonId: JS2-09.05
title: "Optional Chaining (?.) & Nullish Coalescing (??)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Optional Chaining", "?.", "Nullish Coalescing", "??", "TypeError", "ES2020"]
prerequisites: ["JS2-09.04"]
---

# Optional Chaining (?.) & Nullish Coalescing (??)

## 1. Khái niệm & Vấn đề thực tế
Lỗi kinh điển nhất trong toàn bộ thế giới JavaScript là:
`TypeError: Cannot read properties of undefined (reading 'xyz')`.
Lỗi này xảy ra khi cố truy cập thuộc tính con của một đối tượng bị `null` hoặc `undefined`.

ES2020 mang đến hai toán tử cứu cánh:
1. **Optional Chaining (`?.`)**: Dừng ngay và trả về `undefined` nếu vế trước là `null` hoặc `undefined`, không ném ra lỗi!
2. **Nullish Coalescing (`??`)**: Cung cấp giá trị dự phòng (fallback) CHỈ KHI vế trái là `null` hoặc `undefined` (khác với `||` vốn bắt cả `0` và `""`).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Optional Chaining**: `obj?.prop?.subProp`
- **Nullish Coalescing**: `val ?? defaultValue`
  - So sánh với toán tử OR `||`:
    - `0 || 10` -> Kết quả là `10` (vì `0` là Falsy).
    - `0 ?? 10` -> Kết quả là `0` (vì `0` không phải `null` hay `undefined`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const user = {
    id: 1,
    profile: {
        avatar: null
    }
};

// 1. Truy cập an toàn không bị sập chương trình
const street = user?.address?.street; // undefined (không báo lỗi TypeError!)

// 2. Thiết lập giá trị mặc định chính xác với ??
const userScore = 0;
const score = userScore ?? 100; // 0 (giữ nguyên điểm 0 của người dùng!)
console.log("Score:", score);
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dùng nhầm `||` cho các thiết lập số**: Nếu cấu hình cho phép người dùng đặt `timeout = 0` hoặc `volume = 0`, dùng `volume || 50` sẽ biến `0` thành `50` (sai lệch ý muốn). Luôn dùng `volume ?? 50`!

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `?.` để tránh lỗi sụp đổ chương trình khi đọc dữ liệu lồng nhau.
2. Dùng `??` khi muốn đặt giá trị mặc định cho `null` hoặc `undefined` mà vẫn giữ nguyên số `0`, `false` và chuỗi rỗng `""`.
