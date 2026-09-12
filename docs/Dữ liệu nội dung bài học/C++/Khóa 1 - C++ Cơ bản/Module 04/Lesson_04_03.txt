---
lessonId: "CPP-04.03"
title: "Tham chiếu Hằng (const Reference) - Tiêu chuẩn tối ưu hóa C++"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["const reference", "optimization", "read-only", "zero copy"]
prerequisites: ["CPP-04.02"]
---

# Tham chiếu Hằng (const Reference) - Tiêu chuẩn tối ưu hóa C++

## 1. Khái niệm cốt lõi

Chúng ta đã biết:
* **Tham trị:** An toàn vì không sợ bị sửa biến gốc, nhưng **bắt buộc phải sao chép** dữ liệu.
* **Tham chiếu thường:** Nhanh vì không cần sao chép, nhưng **có nguy cơ làm biến gốc bị thay đổi**.

Khi làm việc với các đối tượng dữ liệu lớn (như một đoạn văn bản dài hàng nghìn ký tự `std::string`, một danh sách phần tử lớn):
* Nếu truyền tham trị: Máy tính tốn nhiều bộ nhớ và thời gian để sao chép.
* Nếu truyền tham chiếu thường: Hàm có thể vô tình sửa đổi dữ liệu gốc.

Giải pháp chuẩn trong C++ là: **Tham chiếu Hằng (`const Type&`)** — vừa **không tốn thời gian sao chép**, vừa **bảo vệ dữ liệu không bị sửa đổi**.

| Cách truyền | Sao chép dữ liệu? | Cho phép sửa biến gốc? | Mục đích sử dụng |
| :--- | :---: | :---: | :--- |
| **Tham trị (`Type x`)** | Có | Không | Dành cho các kiểu số nguyên thủy nhỏ (`int`, `double`, `bool`, `char`). |
| **Tham chiếu (`Type& x`)** | Không | **Có** | Dùng khi CỐ Ý muốn hàm thay đổi biến gốc (như hàm `swap`). |
| **Tham chiếu Hằng (`const Type& x`)** | **Không (Zero-copy)** | **Tuyệt đối KHÔNG** | **Tiêu chuẩn cho chuỗi (`string`) và các cấu trúc dữ liệu lớn.** |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp:
```cpp
void tên_hàm(const Kiểu_Dữ_Liệu& tên_biến);
```

### Minh họa cơ chế bảo vệ:
```text
Khai báo: void hienThi(const std::string& s)
Truyền vào biến: s = "Xin chao"
      │
      ├─► Đọc giá trị: HỢP LỆ (Hiển thị ra màn hình bình thường)
      │
      └─► Sửa giá trị: s[0] = 'X'; ──► TRÌNH BIÊN DỊCH BÁO LỖI NGAY LẬP TỨC!
                                      (Read-only reference)
```

## 3. Ví dụ minh họa tinh gọn

```cpp
// Truyền chuỗi bằng const Reference: Nhanh và An toàn
void inThongBao(const std::string& loiNhan) {
    std::cout << "Thong bao: " << loiNhan << '
';
    // loiNhan = "Thay doi"; // Lỗi biên dịch: không được phép sửa biến const!
}

std::string loiChao = "Chao mung ban den voi khoa hoc C++";
inThongBao(loiChao);       // Truyền biến bình thường (không tốn công sao chép)
inThongBao("Tam biet");     // const& cho phép truyền trực tiếp cả chuỗi cố định!
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Lạm dụng `const&` cho các kiểu dữ liệu nhỏ cơ bản**
> * *Lỗi:* Viết `void tinhTong(const int& a, const int& b)`.
> * *Giải thích:* Kiểu `int` chỉ có 4 byte, bằng hoặc nhỏ hơn kích thước một con trỏ địa chỉ. Việc truyền tham trị trực tiếp `int a` còn nhanh và gọn hơn.
> * *Quy tắc:* Kiểu nguyên thủy (`int`, `double`, `char`, `bool`) ➔ Truyền tham trị bình thường. Kiểu phức tạp (`string`, cấu trúc lớn) ➔ Dùng `const&`.

## 5. Ghi nhớ trọng tâm

- `const Type&` kết hợp 2 ưu điểm: không sao chép dữ liệu thừa và bảo vệ dữ liệu ở chế độ chỉ đọc (Read-only).
- Luôn ưu tiên dùng `const std::string&` khi truyền chuỗi văn bản vào hàm.
- Với các kiểu dữ liệu nguyên thủy nhỏ như `int`, `double`, hãy truyền tham trị thông thường.
