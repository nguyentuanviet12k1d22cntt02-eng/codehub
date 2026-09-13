---
lessonId: JS2-13.02
title: "Bắt lỗi an toàn với khối try...catch...finally"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["try", "catch", "finally", "Exception Handling", "JSON.parse"]
prerequisites: ["JS2-13.01"]
---

# Bắt lỗi an toàn với khối try...catch...finally

## 1. Khái niệm & Vấn đề thực tế
Khi làm việc với dữ liệu bên ngoài (đọc tệp, phân tích cú pháp JSON nhận từ người dùng), lỗi có thể xảy ra bất cứ lúc nào. Nếu không được bao bọc kiểm soát, chương trình sẽ lập tức bị crash (sập toàn bộ tiến trình).

Khối `try...catch...finally` cung cấp cơ chế xử lý ngoại lệ duy nhứt giúp chương trình tiếp tục hoạt động an toàn.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
try {
    // 1. Khối mã có nguy cơ phát sinh lỗi
} catch (error) {
    // 2. Khối mã xử lý khi có lỗi xảy ra (error.message, error.name)
} finally {
    // 3. Khối mã LUÔN LUÔN CHẠY bất kể có lỗi hay không (dọn dẹp tài nguyên)
}
```

- Khối `finally` đảm bảo chạy ngay cả khi bên trong `try` hoặc `catch` có câu lệnh `return`!

---

## 3. Ví dụ trực quan: Phân tích JSON an toàn

```javascript
function safeParseJson(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    } finally {
        console.log("Hoàn tất tiến trình parse");
    }
}

console.log(safeParseJson('{"name": "JS"}'));
console.log(safeParseJson('invalid json string'));
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng try-catch rỗng**: Viết `catch (e) {}` và giấu nhẹm lỗi sẽ biến các bug nghiêm trọng thành lỗi ẩn không thể điều tra. Luôn log hoặc xử lý lỗi rõ ràng.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Đặt mã có nguy cơ sập vào `try`.
2. Xử lý phục hồi trong `catch`.
3. Đặt các tác vụ dọn dẹp (đóng file, reset kết nối) vào `finally`.
