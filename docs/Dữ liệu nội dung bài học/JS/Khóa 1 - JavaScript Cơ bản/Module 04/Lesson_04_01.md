---
lessonId: JS1-04.01
title: "Cấu trúc rẽ nhánh cơ bản với if, else và else if"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["if", "else", "else if", "Rẽ nhánh", "Điều kiện"]
prerequisites: ["JS1-03.04"]
---

# Cấu trúc rẽ nhánh cơ bản với if, else và else if

## 1. Khái niệm & Vấn đề thực tế
Cấu trúc điều khiển rẽ nhánh cho phép chương trình đưa ra các quyết định hành động khác nhau tùy thuộc vào điều kiện đúng (`true`) hay sai (`false`).

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
if (dieu_kien_1) {
    // Thực thi khi dieu_kien_1 là true
} else if (dieu_kien_2) {
    // Thực thi khi dieu_kien_1 là false VÀ dieu_kien_2 là true
} else {
    // Thực thi khi tất cả các điều kiện trên đều false
}
```

- Luôn sử dụng cặp ngoặc nhọn `{}` cho khối lệnh ngay cả khi khối lệnh chỉ có 1 dòng (quy chuẩn Clean Code).
- Thứ tự kiểm tra từ trên xuống dưới; ngay khi một nhánh điều kiện thỏa mãn, chương trình sẽ thực hiện khối lệnh đó và bỏ qua toàn bộ các nhánh `else if` hoặc `else` còn lại.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const score = 8.2;

if (score >= 8.5) {
    console.log("Xếp loại: Giỏi");
} else if (score >= 6.5) {
    console.log("Xếp loại: Khá");
} else if (score >= 5.0) {
    console.log("Xếp loại: Trung bình");
} else {
    console.log("Xếp loại: Yếu");
}
```

- Vì `score = 8.2` nhỏ hơn 8.5 nhưng lớn hơn hoặc bằng 6.5, nhánh `else if (score >= 6.5)` được kích hoạt.
- In ra `"Xếp loại: Khá"` và kết thúc khối rẽ nhánh.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Sắp xếp sai thứ tự điều kiện**: Nếu đặt `score >= 5.0` lên trước `score >= 8.5`, thì một điểm 9.0 sẽ rơi vào nhánh `Trung bình` ngay lập tức. Luôn sắp xếp điều kiện theo thứ tự tăng dần hoặc giảm dần chặt chẽ.
- **Dùng dấu gán `=` thay cho so sánh `===`**: `if (a = 5)` sẽ gán 5 cho `a` và điều kiện luôn là Truthy.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cấu trúc `if-else if-else` kiểm tra tuần tự từ trên xuống dưới.
2. Luôn bao bọc khối mã trong `{}` và dùng `===` để so sánh.
