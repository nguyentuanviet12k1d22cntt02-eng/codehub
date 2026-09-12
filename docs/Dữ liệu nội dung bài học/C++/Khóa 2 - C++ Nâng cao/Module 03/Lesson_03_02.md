---
lessonId: "CPP2-03.02"
title: "Chuỗi Không Sao chép std::string_view và Tối ưu hóa Bộ nhớ Tạm"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["string_view", "zero-copy", "read-only", "performance"]
prerequisites: ["CPP-06.01"]
---

# Chuỗi Không Sao chép std::string_view và Tối ưu hóa Bộ nhớ Tạm

## 1. Khái niệm cốt lõi

Khi bạn truyền một chuỗi `std::string` vào hàm hoặc thực hiện thao tác cắt chuỗi `.substr()`, hệ thống thường phải cấp phát bộ nhớ mới để tạo bản sao.

Từ C++17, **`std::string_view`** cung cấp một giải pháp: Nó không sở hữu bộ nhớ, mà chỉ đóng vai trò như một **chiếc cửa sổ nhìn vào (view)** một đoạn văn bản có sẵn trong bộ nhớ.
* Chi phí sao chép: **Bằng 0 (Zero-copy)**.
* Chỉ lưu 2 thông tin: Con trỏ trỏ tới ký tự đầu tiên và độ dài chuỗi (tổng cộng 16 byte).

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa chiếc cửa sổ nhìn vào bộ nhớ:
```text
Chuỗi gốc:     [ H | e | l | l | o |   | W | o | r | l | d ]
                                         ▲
string_view:                            Con trỏ trỏ vào 'W', độ dài = 5
(Không tốn byte RAM nào để nhân bản chuỗi "World"!)
```

## 3. Ví dụ minh họa tinh gọn

```cpp
#include <string_view>

// Hàm nhận string_view: Nhận được cả string lẫn chuỗi cố định mà không tốn công copy!
void inChuoi(std::string_view sv) {
    std::cout << "Noi dung: " << sv << " (do dai: " << sv.length() << ")
";
}

inChuoi("Xin chao"); // Cực kỳ nhanh và tối ưu
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Lỗi con trỏ lơ lửng (Dangling Pointer) khi chuỗi gốc bị hủy**
> * *Nguy cơ:* Vì `string_view` không sở hữu bộ nhớ, nếu chuỗi gốc bị hủy thì `string_view` sẽ nhìn vào vùng nhớ rác!
> * *Quy tắc:* Chỉ dùng `string_view` làm tham số hàm truyền vào (Read-only view). Không dùng nó để lưu trữ lâu dài biến cục bộ tạm thời.

## 5. Ghi nhớ trọng tâm

- `std::string_view` là chiếc cửa sổ nhìn vào chuỗi, loại bỏ chi phí sao chép bộ nhớ.
- Tuyệt đối chỉ đọc (Read-only), không cho phép sửa đổi nội dung.
- Thích hợp nhất làm tham số nhận chuỗi trong các hàm.
