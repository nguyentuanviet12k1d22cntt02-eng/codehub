---
lessonId: JS1-03.04
title: "Khái niệm Truthy, Falsy & Kỹ thuật chuyển đổi Boolean kép (!!)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Truthy", "Falsy", "Boolean", "Toán tử !!", "Ép kiểu Boolean"]
prerequisites: ["JS1-03.03"]
---

# Khái niệm Truthy, Falsy & Kỹ thuật chuyển đổi Boolean kép (!!)

## 1. Khái niệm & Vấn đề thực tế
Trong JavaScript, khi bất kỳ giá trị nào được đặt vào ngữ cảnh điều kiện logic (như câu lệnh `if`, vòng lặp `while`), nó sẽ tự động được chuyển đổi sang kiểu `boolean`.

- **Falsy**: Là những giá trị khi chuyển sang boolean sẽ cho kết quả là `false`.
- **Truthy**: Là TẤT CẢ các giá trị còn lại (cho kết quả `true`).

---

## 2. Cú pháp & Quy tắc cốt lõi
Trong JavaScript, chỉ có duy nhất **8 giá trị Falsy**:
1. `false`
2. `0`, `-0`, `0n` (BigInt 0)
3. `""` (chuỗi rỗng)
4. `null`
5. `undefined`
6. `NaN`

> Mọi giá trị khác (kể cả chuỗi `"0"`, chuỗi `"false"`, mảng rỗng `[]`, object rỗng `{}`) ĐỀU LÀ **TRUTHY**!

- **Toán tử phủ định kép `!!`**:
  - Dấu `!` thứ nhất: Ép giá trị về boolean và đảo ngược nó.
  - Dấu `!` thứ hai: Đảo ngược lại lần nữa để thu được đúng chân trị boolean của giá trị ban đầu.
  - `!!value` tương đương với `Boolean(value)`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
console.log(!!"hello"); // true (chuỗi không rỗng là Truthy)
console.log(!!"");      // false (chuỗi rỗng là Falsy)
console.log(!!0);       // false (số 0 là Falsy)
console.log(!!"0");     // true (chuỗi chứa ký tự '0' là Truthy!)
console.log(!![]);      // true (mảng rỗng là Truthy!)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Chuỗi `"0"` và chuỗi `" "` (có dấu cách) là Truthy**: Chỉ có chuỗi hoàn toàn rỗng `""` (length = 0) mới là Falsy.
- **Mảng rỗng `[]` là Truthy**: Đừng kiểm tra mảng rỗng bằng `if (arr)` vì nó luôn luôn là `true`. Hãy kiểm tra `if (arr.length > 0)`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Thuộc lòng 8 giá trị Falsy: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.
2. Mọi đối tượng, mảng (kể cả rỗng) đều là Truthy.
3. Dùng `!!val` để ép nhanh một biến về kiểu boolean thuần túy.
