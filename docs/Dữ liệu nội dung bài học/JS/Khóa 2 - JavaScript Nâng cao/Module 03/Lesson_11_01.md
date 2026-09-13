---
lessonId: JS2-11.01
title: "Execution Context, Call Stack & Cơ chế Hoisting"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Execution Context", "Call Stack", "Hoisting", "Creation Phase", "V8 Engine"]
prerequisites: ["JS2-10.05"]
---

# Execution Context, Call Stack & Cơ chế Hoisting

## 1. Khái niệm & Vấn đề thực tế
Mọi đoạn mã JavaScript khi chạy đều nằm trong một môi trường gọi là **Ngữ cảnh thực thi (Execution Context - EC)**.
Khi JavaScript Engine (như V8) chạy mã, nó luôn trải qua 2 giai đoạn:
1. **Creation Phase (Pha khởi tạo)**: Engine quét qua toàn bộ mã nguồn, cấp phát bộ nhớ cho biến và hàm.
2. **Execution Phase (Pha thực thi)**: Chạy từng dòng lệnh từ trên xuống dưới.

Chính vì bộ nhớ đã được cấp phát từ Pha khởi tạo trước khi một dòng code nào thực sự chạy, hiện tượng **Hoisting (kéo lên đầu)** xuất hiện.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Function Declaration**: Được hoisted toàn bộ (cả tên và thân hàm). Ta có thể gọi hàm trước dòng định nghĩa.
- **Biến `var`**: Được hoisted nhưng chỉ gán giá trị mặc định là `undefined`. Nếu truy cập trước dòng gán, nhận về `undefined`.
- **Biến `let` và `const`**: CŨNG ĐƯỢC HOISTED, nhưng bị đưa vào **Vùng chết tạm thời (Temporal Dead Zone - TDZ)**. Nếu truy cập trước khi tới dòng khai báo, Engine ném ra lỗi `ReferenceError: Cannot access before initialization`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
console.log(a); // In ra: undefined (do var được hoisted và gán undefined)
var a = 10;

// console.log(b); // LỖI ReferenceError (nằm trong TDZ!)
let b = 20;

sayHi(); // Chạy bình thường!
function sayHi() {
    console.log("Hi from Hoisting!");
}
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lầm tưởng `let`/`const` không bị hoisted**: Chúng thực chất có bị hoisted ở pha khởi tạo, nhưng engine cố tình cấm truy cập trong vùng TDZ để bảo vệ mã nguồn không dùng biến rác.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. JavaScript chạy 2 pha: Khởi tạo (quét biến & hàm) $\rightarrow$ Thực thi.
2. `var` khởi tạo `undefined`; `let` và `const` nằm trong TDZ cho tới khi được gán.
