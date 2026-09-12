---
lessonId: "CPP2-06.03"
title: "Con trỏ Thông minh Hiện đại: std::unique_ptr, std::shared_ptr và RAII"
difficulty: "HARD"
estimatedDuration: 25
keywords: ["smart pointers", "unique_ptr", "shared_ptr", "RAII", "memory leak"]
prerequisites: ["CPP2-01.02"]
---

# Con trỏ Thông minh Hiện đại: std::unique_ptr, std::shared_ptr và RAII

## 1. Khái niệm cốt lõi

Trong C++ cổ điển, khi cấp phát động bằng `new`, lập trình viên bắt buộc phải nhớ gọi `delete`. Nếu quên, bộ nhớ sẽ bị thất lạc vĩnh viễn (**Rò rỉ bộ nhớ - Memory Leak**).

Từ C++11, thư viện `<memory>` mang đến **Con trỏ thông minh (Smart Pointers)** áp dụng triết lý **RAII**: Con trỏ tự động giải phóng vùng nhớ ô RAM ngay khi nó đi ra khỏi phạm vi sử dụng, bạn không bao giờ phải gõ chữ `delete` thủ công nữa!

| Loại con trỏ | Quyền sở hữu ô nhớ | Ứng dụng |
| :--- | :--- | :--- |
| **`std::unique_ptr`** | **Độc quyền:** Chỉ duy nhất 1 con trỏ được trỏ vào ô nhớ đó | Lựa chọn mặc định, siêu nhẹ và an toàn |
| **`std::shared_ptr`** | **Chia sẻ:** Nhiều con trỏ có thể cùng trỏ vào ô nhớ (có bộ đếm) | Vùng nhớ dùng chung giữa nhiều đối tượng |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp tạo con trỏ an toàn (C++14):
```cpp
auto p = std::make_unique<Kiểu>(giá_trị);
```

### Cơ chế tự thu dọn của `std::unique_ptr`:
```text
{
    auto ptr = std::make_unique<int>(100);
    // Sử dụng bình thường: *ptr = 100
} // RA KHỎI DẤU NGOẶC: ptr tự động gọi delete giải phóng ô nhớ ngay lập tức!
```

## 3. Ví dụ minh họa tinh gọn

```cpp
#include <memory>

void lamViec() {
    // Tự động cấp phát ô nhớ cho số nguyên 99
    std::unique_ptr<int> p = std::make_unique<int>(99);

    std::cout << "Gia tri: " << *p << '
'; // Truy xuất bằng dấu * giống con trỏ thường

    // Khi hàm lamViec() kết thúc, vùng nhớ tự động được giải phóng an toàn 100%!
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Sao chép `std::unique_ptr`**
> * *Lỗi:* Viết `auto p2 = p1;` với `unique_ptr`.
> * *Hậu quả:* Báo lỗi biên dịch vì `unique_ptr` có quyền sở hữu độc quyền, không cho phép sao chép. Nếu muốn chuyển giao quyền sở hữu sang con trỏ khác, phải dùng `std::move(p1)`.

## 5. Ghi nhớ trọng tâm

- Con trỏ thông minh tự động thu dọn bộ nhớ, giải quyết triệt để nguy cơ Memory Leak.
- Luôn ưu tiên dùng `std::unique_ptr` với `std::make_unique`.
- Không bao giờ cần dùng `new` và `delete` thủ công trong C++ hiện đại.
