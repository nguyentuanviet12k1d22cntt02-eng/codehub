---
lessonId: JS2-11.04
title: "Từ khóa 'this' trong Object Method & Sự khác biệt với Arrow Function"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["this", "Object Method", "Arrow Function", "Lexical this", "Runtime Binding"]
prerequisites: ["JS2-11.03"]
---

# Từ khóa 'this' trong Object Method & Sự khác biệt với Arrow Function

## 1. Khái niệm & Vấn đề thực tế
Từ khóa `this` trong JavaScript đại diện cho **ngữ cảnh thực thi hiện tại (Execution Context)**.
Khác với đa số ngôn ngữ lập trình hướng đối tượng khác (nơi `this` gắn cố định vào lớp), trong JavaScript truyền thống, giá trị của `this` phụ thuộc vào **CÁCH MÀ HÀM ĐƯỢC GỌI TẠI RUNTIME (Call-site)** chứ không phụ thuộc vào nơi hàm được khai báo.

---

## 2. Cú pháp & Quy tắc cốt lõi
1. **Trong một Object Method (hàm thông thường)**: `this` trỏ trực tiếp đến đối tượng đứng trước dấu chấm khi gọi hàm (`obj.method()` $\rightarrow$ `this === obj`).
2. **Trong Arrow Function**: **Arrow Function KHÔNG CÓ `this` RIÊNG**. Nó giữ nguyên giá trị `this` từ phạm vi cha bao bọc nó tại thời điểm định nghĩa (**Lexical `this`**).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const user = {
    name: "Tuấn",
    regularMethod() {
        console.log("Regular this:", this.name); // "Tuấn" (this là user)
    },
    arrowMethod: () => {
        console.log("Arrow this:", this.name); // undefined (this kế thừa từ phạm vi ngoài, không phải user!)
    }
};

user.regularMethod();
user.arrowMethod();
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **KHÔNG BAO GIỜ dùng Arrow Function làm Object Method**: Như ví dụ trên, dùng `() =>` làm phương thức đối tượng sẽ khiến `this` bị trỏ ra ngoài toàn cục và không đọc được thuộc tính của object.
- **DÙNG Arrow Function bên trong callback của Object Method**: Khi dùng `setTimeout` hay `forEach` bên trong method, Arrow Function giúp giữ nguyên `this` trỏ về object mà không bị mất ngữ cảnh.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Gọi `obj.method()`: `this` là `obj`.
2. Arrow Function không có `this`, kế thừa `this` từ phạm vi ngoài.
3. Không định nghĩa phương thức của object bằng Arrow Function.
