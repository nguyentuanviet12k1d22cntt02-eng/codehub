---
lessonId: JS1-06.03
title: "Lệnh return, giá trị trả về và hàm không trả về (undefined)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["return", "Giá trị trả về", "undefined", "Void function", "Hàm thuần"]
prerequisites: ["JS1-06.02"]
---

# Lệnh return, giá trị trả về và hàm không trả về (undefined)

## 1. Khái niệm & Vấn đề thực tế
Một hàm thường nhận dữ liệu đầu vào (parameters), tính toán xử lý và xuất kết quả đầu ra cho nơi gọi hàm sử dụng tiếp thông qua lệnh `return`.

Nếu một hàm không có lệnh `return`, hoặc chỉ viết `return;` mà không chỉ định giá trị, JavaScript sẽ tự động trả về giá trị đặc biệt là `undefined`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`return expression;`**: Đánh giá biểu thức `expression`, gửi kết quả về cho bên gọi và **kết thúc thực thi hàm ngay lập tức**.
- Mọi câu lệnh đặt phía sau lệnh `return` trong cùng khối hàm đều là **mã chết (unreachable code)** và không bao giờ được chạy.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function findMax(a, b, c) {
    let max = a;
    if (b > max) max = b;
    if (c > max) max = c;
    return max; // Trả về giá trị lớn nhất
}

const result = findMax(12, 45, 29);
console.log("Số lớn nhất:", result); // 45
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Xuống dòng ngay sau `return`**: Như đã học ở bài ASI, không xuống dòng giữa từ khóa `return` và biểu thức trả về.
- **Nhầm lẫn giữa `console.log()` và `return`**: `console.log()` chỉ in chữ ra màn hình, KHÔNG trả về giá trị cho biến nhận. Muốn nhận kết quả để tính toán tiếp, bắt buộc phải dùng `return`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `return` trả kết quả và dừng hàm lập tức.
2. Hàm không có `return` ngầm định trả về `undefined`.
