---
lessonId: JS2-09.03
title: "Duyệt Object với for...in, Object.keys, values & entries"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Object.keys", "Object.values", "Object.entries", "for...in", "Duyệt đối tượng"]
prerequisites: ["JS2-09.02"]
---

# Duyệt Object với for...in, Object.keys, values & entries

## 1. Khái niệm & Vấn đề thực tế
Vì Object không có chỉ mục số thứ tự tuần tự như Array, ta không thể dùng vòng lặp `for` thông thường hay `for...of` trực tiếp lên Object.

Modern JavaScript cung cấp bộ ba phương thức tĩnh của `Object` biến đổi đối tượng thành các mảng để dễ dàng duyệt và tính toán:
1. `Object.keys(obj)`: Mảng chứa danh sách các tên thuộc tính (keys).
2. `Object.values(obj)`: Mảng chứa danh sách các giá trị (values).
3. `Object.entries(obj)`: Mảng chứa các cặp `[key, value]`.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
const inventory = { apples: 10, oranges: 5, bananas: 12 };

// 1. Duyệt qua mảng values để tính tổng
const totalItems = Object.values(inventory).reduce((sum, qty) => sum + qty, 0);

// 2. Duyệt qua mảng entries với for...of
for (const [fruit, qty] of Object.entries(inventory)) {
    console.log(`${fruit}: ${qty}`);
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const prices = {
    pen: 5000,
    notebook: 15000,
    ruler: 8000
};

const keys = Object.keys(prices);     // ["pen", "notebook", "ruler"]
const values = Object.values(prices); // [5000, 15000, 8000]

console.log("Số mặt hàng:", keys.length); // 3
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Hạn chế dùng `for...in` thuần túy**: Vòng lặp `for...in` sẽ duyệt qua cả các thuộc tính kế thừa trong prototype chain. Chuẩn mực hiện đại ưu tiên dùng `Object.keys()` hoặc `Object.entries()` kết hợp với `for...of` hoặc Array methods.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `Object.keys()`: Lấy danh sách tên thuộc tính.
2. `Object.values()`: Lấy danh sách giá trị.
3. `Object.entries()`: Lấy mảng các cặp `[key, value]`.
