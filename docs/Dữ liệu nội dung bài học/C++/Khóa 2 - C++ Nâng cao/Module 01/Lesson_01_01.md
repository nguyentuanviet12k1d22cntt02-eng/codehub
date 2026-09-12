---
lessonId: "CPP2-01.01"
title: "Kiểu liệt kê enum class (Scoped Enums) và Kỹ thuật Bit-fields"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["enum class", "scoped enum", "bit-fields", "type safety"]
prerequisites: ["CPP-01.03"]
---

# Kiểu liệt kê enum class (Scoped Enums) và Kỹ thuật Bit-fields

## 1. Khái niệm cốt lõi

Trong C++ truyền thống, kiểu liệt kê `enum` cũ có nhược điểm: các hằng số bị đẩy ra phạm vi toàn cục gây trùng tên và tự động ép kiểu sang số nguyên gây nhầm lẫn.

Từ chuẩn C++11, **`enum class` (Scoped Enums)** ra đời để khắc phục triệt để:
- **Phạm vi an toàn:** Tên hằng số thuộc về không gian của enum đó (`Status::ACTIVE`), không gây xung đột tên.
- **An toàn kiểu (Type Safety):** Không tự động ép kiểu sang số nguyên, bắt buộc phải dùng `static_cast` nếu cần chuyển đổi.

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp khai báo enum class:
```cpp
enum class Tên_Enum : kiểu_lưu_trữ_cơ_sở {
    GIÁ_TRỊ_1,
    GIÁ_TRỊ_2
};
```

### Minh họa cơ chế an toàn kiểu:
```text
enum class TrangThai { BAT, TAT };
enum class KetQua { THANG, THUA };

So sánh: TrangThai::BAT == KetQua::THANG
──► TRÌNH BIÊN DỊCH BÁO LỖI NGAY LẬP TỨC!
    (Ngăn chặn hoàn toàn việc so sánh nhầm hai đại lượng khác loại)
```

## 3. Ví dụ minh họa tinh gọn

```cpp
// Khai báo enum class chiếm đúng 1 byte (uint8_t)
enum class VaiTro : uint8_t {
    HOC_SINH,
    GIAO_VIEN,
    ADMIN
};

VaiTro nguoiDung = VaiTro::HOC_SINH;

if (nguoiDung == VaiTro::HOC_SINH) {
    std::cout << "Xin chao hoc sinh!
";
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên tiền tố tên enum khi sử dụng**
> * *Lỗi:* Viết `VaiTro user = HOC_SINH;`.
> * *Khắc phục:* `enum class` bắt buộc phải đi kèm tên kiểu: `VaiTro::HOC_SINH`.

## 5. Ghi nhớ trọng tâm

- `enum class` giúp gom nhóm các hằng số có ý nghĩa liên quan mà không sợ xung đột tên.
- An toàn kiểu tuyệt đối, không tự động biến thành số nguyên.
- Có thể chỉ định kiểu lưu trữ cơ sở như `: uint8_t` để tiết kiệm bộ nhớ.
