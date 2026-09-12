---
lessonId: "CPP2-06.02"
title: "Cơ chế Bắt và Ném Ngoại lệ An toàn (try, catch, throw, std::exception)"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["exception", "try catch", "throw", "error handling"]
prerequisites: ["CPP-04.01"]
---

# Cơ chế Bắt và Ném Ngoại lệ An toàn (try, catch, throw, std::exception)

## 1. Khái niệm cốt lõi

Khi chương trình gặp sự cố bất thường trong lúc chạy (hết bộ nhớ, chia cho 0, mở file không tồn tại), nếu không có cơ chế xử lý, hệ điều hành sẽ lập tức buộc dừng chương trình (Crash).

**Cơ chế Xử lý Ngoại lệ (Exception Handling)** giúp chương trình:
* **Ném lỗi (`throw`):** Khi phát hiện sự cố, hàm ném ra một thông báo lỗi.
* **Bắt và xử lý lỗi (`try - catch`):** Đón nhận lỗi an toàn và hiển thị thông báo thân thiện cho người dùng thay vì để ứng dụng bị sập.

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp chuẩn:
```cpp
try {
    // Đoạn code có nguy cơ xảy ra lỗi
} catch (const std::exception& e) {
    // Bắt và xử lý lỗi an toàn tại đây
    std::cout << "Loi: " << e.what() << '
';
}
```

## 3. Ví dụ minh họa tinh gọn

```cpp
#include <stdexcept>

double chiaSo(double a, double b) {
    if (b == 0) {
        throw std::runtime_error("Loi: Khong the chia cho so 0!");
    }
    return a / b;
}

try {
    double kq = chiaSo(10, 0);
} catch (const std::runtime_error& e) {
    std::cout << e.what() << '
'; // Bắt lỗi an toàn, chương trình không bị sập!
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Bắt ngoại lệ bằng tham trị thay vì tham chiếu hằng (`const&`)**
> * *Lỗi:* Viết `catch (std::exception e)`.
> * *Hậu quả:* Gây hiện tượng cắt xén đối tượng (Object Slicing).
> * *Quy tắc chuẩn:* Luôn bắt ngoại lệ bằng tham chiếu hằng: `catch (const std::exception& e)`.

## 5. Ghi nhớ trọng tâm

- Dùng `throw` để phát tín hiệu khi xảy ra lỗi nghiêm trọng.
- Dùng khối `try - catch` để bao bọc và xử lý lỗi an toàn.
- Luôn bắt lỗi dạng `const std::exception& e` và in ra thông báo bằng `e.what()`.
