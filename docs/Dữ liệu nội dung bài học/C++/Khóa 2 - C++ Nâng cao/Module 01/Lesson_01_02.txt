---
lessonId: "CPP2-01.02"
title: "Kiểu cấu trúc struct Nâng cao và Bộ nhớ Đệm Alignment / Padding"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["struct", "memory alignment", "padding", "data layout"]
prerequisites: ["CPP-01.03"]
---

# Kiểu cấu trúc struct Nâng cao và Bộ nhớ Đệm Alignment / Padding

## 1. Khái niệm cốt lõi

* **`struct`:** Cho phép bạn tự định nghĩa một kiểu dữ liệu mới gom nhiều biến có kiểu dữ liệu khác nhau lại (ví dụ: một `HocSinh` gồm `id`, `ten`, `diem`).
* **Hiện tượng Chèn đệm (Padding) & Canh lề (Alignment):** Để CPU truy xuất dữ liệu nhanh nhất, phần cứng yêu cầu dữ liệu phải nằm ở các địa chỉ chia hết cho kích thước của nó. Trình biên dịch sẽ tự động chèn thêm các byte rỗng (padding) vào giữa các trường.

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa ảnh hưởng của thứ tự khai báo trong `struct`:
```text
Trường hợp A: Khai báo xen kẽ (Tốn 12 byte)
struct A {
    char a;    // 1 byte
    // [ Bị chèn 3 byte padding ]
    int b;     // 4 byte
    char c;    // 1 byte
    // [ Bị chèn 3 byte padding ]
};

Trường hợp B: Sắp xếp các trường lớn lên trước (Chỉ tốn 8 byte)
struct B {
    int b;     // 4 byte
    char a;    // 1 byte
    char c;    // 1 byte
    // [ Bị chèn 2 byte padding ]
};
```

## 3. Ví dụ minh họa tinh gọn

```cpp
struct SinhVien {
    int id;
    std::string hoTen;
    double diemTB;
};

SinhVien sv = {101, "Nguyen Van An", 8.5};
std::cout << "MSSV: " << sv.id << " - Diem: " << sv.diemTB << '
';
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nghĩ rằng kích thước `sizeof(struct)` luôn bằng tổng các trường cộng lại**
> * *Thực tế:* Kích thước `struct` thường lớn hơn tổng các trường do có các byte đệm (padding).
> * *Mẹo tối ưu:* Khai báo các trường có kích thước lớn (`double`, `long long`, con trỏ) lên đầu, các trường nhỏ (`int`, `char`, `bool`) xuống sau.

## 5. Ghi nhớ trọng tâm

- `struct` giúp đóng gói nhiều thông tin liên quan vào cùng một thực thể dữ liệu.
- Kích thước của `struct` chịu ảnh hưởng bởi cơ chế Memory Alignment của CPU.
- Thứ tự sắp xếp các trường trong `struct` giúp tiết kiệm dung lượng RAM.
