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
* **Hiện tượng Chèn đệm (Padding) & Canh lề (Alignment):** Compiler tuân theo yêu cầu căn lề của ABI và nền tảng đích. Vì vậy nó có thể chèn byte đệm giữa các trường hoặc cuối `struct`; đây là cơ chế bố cục dữ liệu, không phải một kích thước cố định áp dụng cho mọi CPU và compiler.

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa ảnh hưởng của thứ tự khai báo trong `struct`:
```text
Trường hợp A: Khai báo xen kẽ (một bố cục thường gặp có thể tốn 12 byte)
struct A {
    char a;    // 1 byte
    // [ Bị chèn 3 byte padding ]
    int b;     // 4 byte
    char c;    // 1 byte
    // [ Bị chèn 3 byte padding ]
};

Trường hợp B: Sắp xếp các trường lớn lên trước (một bố cục thường gặp có thể tốn 8 byte)
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
std::cout << "MSSV: " << sv.id << " - Diem: " << sv.diemTB << '\n';
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nghĩ rằng kích thước `sizeof(struct)` luôn bằng tổng các trường cộng lại**
> * *Thực tế:* Kích thước `struct` có thể lớn hơn tổng kích thước trường do padding và căn lề; hãy đo bằng `sizeof` và `alignof` trên compiler đang triển khai.
> * *Mẹo tối ưu:* Nhóm trường có yêu cầu căn lề lớn trước có thể giảm padding, nhưng chỉ áp dụng khi layout là vấn đề thật sự và vẫn phải giữ API/dữ liệu dễ hiểu.

## 5. Ghi nhớ trọng tâm

- `struct` giúp đóng gói nhiều thông tin liên quan vào cùng một thực thể dữ liệu.
- Kích thước của `struct` chịu ảnh hưởng bởi cơ chế Memory Alignment của CPU.
- Thứ tự sắp xếp các trường trong `struct` giúp tiết kiệm dung lượng RAM.
