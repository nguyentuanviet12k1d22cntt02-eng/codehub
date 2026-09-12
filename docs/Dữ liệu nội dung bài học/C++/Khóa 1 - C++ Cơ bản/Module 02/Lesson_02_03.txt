---
lessonId: "CPP-02.03"
title: "Cấu trúc Lựa chọn switch-case và Từ khóa break"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["switch", "case", "break", "default", "selection"]
prerequisites: ["CPP-02.01"]
---

# Cấu trúc Lựa chọn switch-case và Từ khóa break

## 1. Khái niệm cốt lõi

Khi cần so khớp một biến số nguyên hoặc ký tự với **rất nhiều giá trị rời rạc cụ thể** (như chọn menu 1, 2, 3, 4 hoặc tra cứu thứ trong tuần), viết chuỗi `if - else if` liên tiếp sẽ khiến code dài dòng và khó đọc.

Cấu trúc **`switch-case`** cung cấp một giải pháp chọn lựa trực quan: máy tính nhảy trực tiếp tới đúng nhánh giá trị tương ứng để chạy.

| Thành phần | Vai trò |
| :--- | :--- |
| **`switch (biến)`** | Tiếp nhận giá trị cần so khớp (phải là số nguyên hoặc ký tự `char`). |
| **`case giá_trị:`** | Điểm dừng tương ứng khi biến khớp với `giá_trị`. |
| **`break;`** | Lệnh nhảy thoát ngay ra khỏi khối `switch`. |
| **`default:`** | Nhánh mặc định (tương đương `else`), chạy khi không có `case` nào khớp. |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp chuẩn:
```cpp
switch (biến_số) {
    case 1:
        // Câu lệnh khi biến_số == 1
        break; // Thoát khỏi switch
    case 2:
        // Câu lệnh khi biến_số == 2
        break;
    default:
        // Câu lệnh khi không khớp trường hợp nào
        break;
}
```

### Hiện tượng Rơi tự do (Fall-through):
Nếu một nhánh `case` **không có lệnh `break`**, C++ sẽ tự động chạy tràn tiếp xuống toàn bộ các câu lệnh của các `case` bên dưới cho đến khi gặp `break` mới chịu dừng lại!

## 3. Ví dụ minh họa tinh gọn

Tra cứu số ngày theo tháng (tận dụng hiện tượng gộp case):

```cpp
int thang = 4;

switch (thang) {
    case 4:
    case 6:
    case 9:
    case 11:
        std::cout << "Thang co 30 ngay";
        break;
    case 2:
        std::cout << "Thang co 28 hoac 29 ngay";
        break;
    default:
        std::cout << "Thang co 31 ngay";
        break;
}
// Kết quả in ra: Thang co 30 ngay
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên lệnh `break;` ở cuối mỗi case**
> * *Hậu quả:* Chương trình thực hiện luôn các `case` phía sau ngoài ý muốn (lỗi Fall-through kinh điển).
> * *Cách phòng tránh:* Tạo thói quen viết ngay `break;` cho mỗi `case` trước khi viết nội dung.

> [!WARNING]
> **2. Dùng `switch` cho số thực (`double`, `float`) hoặc chuỗi (`string`)**
> * *Quy tắc:* `switch` trong C++ chỉ hỗ trợ các kiểu số nguyên rời rạc (`int`, `char`, `short`, `long`, `enum`). Không được dùng cho số thực như `case 3.14:` hoặc chuỗi.

## 5. Ghi nhớ trọng tâm

- `switch-case` tối ưu khi so sánh giá trị rời rạc cụ thể của số nguyên và ký tự.
- Luôn nhớ đặt lệnh `break;` để tránh hiện tượng chạy tràn qua các case khác.
- Nhánh `default` giúp xử lý an toàn các giá trị nằm ngoài dự kiến.
