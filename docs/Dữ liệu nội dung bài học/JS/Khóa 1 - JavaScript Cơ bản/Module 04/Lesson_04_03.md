---
lessonId: JS1-04.03
title: "Lựa chọn đa nhánh với switch, case, break và default"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["switch", "case", "break", "default", "Fall-through", "Đa nhánh"]
prerequisites: ["JS1-04.02"]
---

# Lựa chọn đa nhánh với switch, case, break và default

## 1. Khái niệm & Vấn đề thực tế
Khi một biến cần được so sánh bằng với rất nhiều giá trị cố định cụ thể (ví dụ mã trạng thái HTTP, các ngày trong tuần, lệnh từ người dùng), việc viết liên tiếp nhiều khối `if-else if` sẽ trở nên cồng kềnh. Cấu trúc `switch-case` cung cấp giải pháp trực quan và thanh lịch hơn.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
switch (expression) {
    case value1:
        // Mã thực thi khi expression === value1
        break;
    case value2:
        // Mã thực thi khi expression === value2
        break;
    default:
        // Mã thực thi khi không khớp với bất kỳ case nào
        break;
}
```

- **So sánh nghiêm ngặt**: `switch` so sánh giá trị bằng toán tử so sánh nghiêm ngặt `===`.
- **Lệnh `break`**: Bắt buộc phải có `break` để thoát khỏi cấu trúc `switch`. Nếu thiếu `break`, chương trình sẽ trôi xuống thực thi tiếp các case bên dưới bất kể điều kiện có khớp hay không (**hiện tượng Fall-through**).
- **Gom nhóm case**: Có thể xếp nhiều `case` liên tiếp cùng chia sẻ một khối lệnh.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const dayCode = 6;
let dayType = "";

switch (dayCode) {
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
        dayType = "Ngày trong tuần";
        break;
    case 7:
    case 8: // Chủ nhật
        dayType = "Cuối tuần";
        break;
    default:
        dayType = "Mã ngày không hợp lệ";
        break;
}

console.log(dayType); // "Ngày trong tuần"
```

- Các case từ 2 đến 6 không có lệnh `break` ở giữa, do đó khi `dayCode = 6`, nó rơi vào nhóm và gán `"Ngày trong tuần"`, sau đó gặp lệnh `break` để kết thúc.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên lệnh `break`**: Là lỗi phổ biến nhất, khiến mã của case kế tiếp bị chạy ngoài ý muốn.
- **Khác biệt kiểu dữ liệu**: Vì `switch` so sánh bằng `===`, nên `switch("1")` sẽ **không** khớp với `case 1:`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `switch` so sánh bằng toán tử nghiêm ngặt `===`.
2. Luôn nhớ đặt `break;` ở cuối mỗi case (trừ trường hợp chủ động gom nhóm).
3. Luôn có nhánh `default:` để phòng ngừa các giá trị ngoại lệ.
