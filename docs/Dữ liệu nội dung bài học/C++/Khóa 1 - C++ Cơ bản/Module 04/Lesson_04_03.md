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
| **Tham trị (`Type x`)** | Có | Không | Thường phù hợp với kiểu nhỏ, dễ sao chép và khi hàm cần bản sao riêng. |
| **Tham chiếu (`Type& x`)** | Không | **Có** | Dùng khi CỐ Ý muốn hàm thay đổi biến gốc (như hàm `swap`). |
| **Tham chiếu Hằng (`const Type& x`)** | Không sao chép đối tượng | Không qua tham chiếu này | Phù hợp với đối tượng chỉ đọc mà việc sao chép không rẻ. |

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
    std::cout << "Thong bao: " << loiNhan << '\n';
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
> * *Giải thích:* Kích thước của `int`, `double` và con trỏ phụ thuộc nền tảng; không có ngưỡng kích thước phổ quát. Với kiểu nhỏ, sao chép rẻ và biểu đạt ý nghĩa rõ ràng, truyền tham trị thường là lựa chọn tốt. Với đối tượng có chi phí sao chép đáng kể, `const&` thường phù hợp hơn.
> * *Quy tắc:* Chọn cách truyền theo ngữ nghĩa ownership, khả năng thay đổi và chi phí sao chép thực tế; đo đạc nếu đây là điểm nóng hiệu năng.

## 5. Ghi nhớ trọng tâm

- `const Type&` kết hợp 2 ưu điểm: không sao chép dữ liệu thừa và bảo vệ dữ liệu ở chế độ chỉ đọc (Read-only).
- `const std::string&` là lựa chọn hợp lý khi hàm chỉ đọc chuỗi và không cần sở hữu bản sao.
- Với kiểu nhỏ, ưu tiên cách truyền biểu đạt ý nghĩa rõ nhất; không suy luận hiệu năng chỉ từ số byte cố định.
