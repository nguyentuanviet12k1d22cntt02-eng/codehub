---
lessonId: "CPP2-01.03"
title: "Bản chất Kiểu Hợp union và std::variant An toàn trong C++17"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["union", "variant", "type-safe union", "std::holds_alternative"]
prerequisites: ["CPP2-01.02"]
---

# Bản chất Kiểu Hợp union và std::variant An toàn trong C++17

## 1. Khái niệm cốt lõi

* **`union` truyền thống:** Cho phép nhiều biến khác nhau **dùng chung duy nhất một vùng nhớ**. Kích thước của `union` chỉ bằng kích thước của trường lớn nhất. Tuy nhiên, `union` cũ không ghi nhớ kiểu dữ liệu nào đang được lưu, rất dễ gây lỗi đọc nhầm ô nhớ.
* **`std::variant` (C++17):** Là giải pháp hiện đại thay thế `union`, vừa tiết kiệm bộ nhớ vừa ghi nhớ chính xác kiểu dữ liệu hiện tại, tuyệt đối an toàn.

| Tiêu chí | `union` Cổ điển | `std::variant` (C++17) |
| :--- | :--- | :--- |
| **Vùng nhớ** | Dùng chung | Dùng chung có kèm thẻ nhận diện |
| **Biết kiểu dữ liệu hiện tại?** | Không (Dễ đọc sai) | Có (An toàn kiểu) |
| **Mức độ khuyên dùng** | Hạn chế | **Khuyên dùng trong Modern C++** |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp `std::variant`:
```cpp
#include <variant>

// Biến data có thể chứa int HOẶC double HOẶC std::string
std::variant<int, double, std::string> duLieu;
```

## 3. Ví dụ minh họa tinh gọn

```cpp
#include <variant>

std::variant<int, std::string> giaTri = 100; // Đang chứa số nguyên

giaTri = "Mot tram"; // Tự động chuyển sang chứa chuỗi

// Kiểm tra kiểu dữ liệu đang chứa
if (std::holds_alternative<std::string>(giaTri)) {
    std::cout << "Dang chua chuoi: " << std::get<std::string>(giaTri) << '
';
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Đọc sai kiểu dữ liệu đang có trong `variant`**
> * *Lỗi:* `giaTri` đang chứa chuỗi nhưng cố tình gọi `std::get<int>(giaTri)`.
> * *Hậu quả:* Chương trình ném ra ngoại lệ `std::bad_variant_access` và dừng chương trình.
> * *Cách phòng tránh:* Luôn kiểm tra bằng `std::holds_alternative<Kiểu>(...)` trước khi lấy dữ liệu.

## 5. Ghi nhớ trọng tâm

- `std::variant` trong C++17 là giải pháp an toàn để một biến có thể luân phiên chứa các kiểu dữ liệu khác nhau.
- Dùng `std::holds_alternative<Kiểu>(v)` để kiểm tra kiểu hiện tại.
- Dùng `std::get<Kiểu>(v)` để trích xuất giá trị.
