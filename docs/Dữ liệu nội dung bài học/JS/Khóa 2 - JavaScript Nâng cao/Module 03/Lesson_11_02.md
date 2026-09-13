---
lessonId: JS2-11.02
title: "Scope Chain & Kỹ thuật che khuất biến (Variable Shadowing)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Scope Chain", "Global Scope", "Block Scope", "Variable Shadowing", "Lexical Environment"]
prerequisites: ["JS2-11.01"]
---

# Scope Chain & Kỹ thuật che khuất biến (Variable Shadowing)

## 1. Khái niệm & Vấn đề thực tế
Phạm vi (Scope) xác định ranh giới mà một biến có thể được nhìn thấy và truy cập.
Khi bạn truy cập một biến, JavaScript Engine sẽ tìm kiếm theo thứ tự:
1. Phạm vi khối hiện tại (Local/Block Scope).
2. Nếu không thấy, tìm ngược ra phạm vi cha bao bọc nó (Outer Scope).
3. Tiếp tục tìm dần lên cho tới khi gặp Phạm vi toàn cục (Global Scope).
Chuỗi tìm kiếm này gọi là **Chuỗi phạm vi (Scope Chain)**.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Global Scope**: Biến khai báo ngoài cùng của file, mọi nơi đều đọc được.
- **Function Scope**: Biến khai báo trong hàm, chỉ hàm đó và các hàm con lồng bên trong thấy được.
- **Block Scope**: Giới hạn trong cặp ngoặc nhọn `{ ... }` (dành riêng cho `let` và `const`).
- **Variable Shadowing (Che khuất biến)**: Khi một biến cục bộ có cùng tên với một biến ở phạm vi bên ngoài, biến cục bộ sẽ tạm thời "che khuất" biến bên ngoài trong phạm vi của nó.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const role = "GUEST"; // Toàn cục

function enterRoom() {
    const role = "ADMIN"; // Che khuất biến role toàn cục trong phạm vi enterRoom
    if (true) {
        const role = "SUPER_USER"; // Che khuất tiếp trong block if
        console.log("Trong block:", role); // "SUPER_USER"
    }
    console.log("Trong ham:", role); // "ADMIN"
}

enterRoom();
console.log("Toan cuc:", role); // "GUEST"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên từ khóa khai báo (`role = "ADMIN"`)**: Nếu gán biến mà không có `let/const/var`, JavaScript sẽ tự động tạo một biến toàn cục ở Global Scope (rất nguy hiểm, gây rò rỉ dữ liệu).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Scope Chain tìm kiếm biến từ trong ra ngoài.
2. `let` và `const` tuân thủ nghiêm ngặt Block Scope `{}`.
