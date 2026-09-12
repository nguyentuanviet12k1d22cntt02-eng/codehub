---
lessonId: "CPP-04.04"
title: "Phạm vi Biến (Scope), Thời gian sống và Kỹ thuật Nạp chồng Hàm (Overloading)"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["scope", "lifetime", "global variable", "local variable", "overloading"]
prerequisites: ["CPP-04.01"]
---

# Phạm vi Biến (Scope), Thời gian sống và Kỹ thuật Nạp chồng Hàm (Overloading)

## 1. Khái niệm cốt lõi

* **Phạm vi biến (Scope):** Khu vực trong mã nguồn nơi mà một biến có thể được nhìn thấy và sử dụng.
* **Thời gian sống (Lifetime):** Khoảng thời gian ô nhớ của biến tồn tại trong RAM kể từ lúc khởi tạo cho đến khi bị giải phóng.
* **Nạp chồng hàm (Function Overloading):** Tính năng cho phép định nghĩa **nhiều hàm cùng tên**, miễn là danh sách tham số của chúng khác nhau (về số lượng hoặc kiểu dữ liệu).

| Loại biến | Vị trí khai báo | Phạm vi truy cập | Thời gian sống |
| :--- | :--- | :--- | :--- |
| **Biến cục bộ (Local)** | Bên trong một khối lệnh `{ }` hoặc thân hàm | Chỉ dùng được bên trong cặp ngoặc `{ }` đó | Sinh ra khi vào khối lệnh, hủy ngay khi ra khỏi dấu `}` |
| **Biến toàn cục (Global)** | Bên ngoài tất cả các hàm | Mọi hàm trong file đều truy cập được | Tồn tại suốt toàn bộ thời gian chạy chương trình |

## 2. Cú pháp & Quy tắc hoạt động

### Quy tắc Nạp chồng hàm (Overloading):
Trình biên dịch phân biệt các hàm cùng tên bằng cách so khớp **danh sách tham số** (Signature):
```text
CÙNG TÊN HÀM: cong()
├── cong(int a, int b)          ➔ Nhận 2 số nguyên
├── cong(double a, double b)    ➔ Nhận 2 số thực
└── cong(int a, int b, int c)   ➔ Nhận 3 số nguyên
```
*(Lưu ý: Chỉ khác nhau về kiểu trả về KHÔNG được coi là nạp chồng hợp lệ).*

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Phạm vi biến cục bộ
```cpp
void viDu() {
    int x = 10; // Biến cục bộ của viDu()
    if (x > 5) {
        int y = 20; // Biến cục bộ của khối if
        std::cout << x + y; // Hợp lệ: dùng được cả x và y
    }
    // std::cout << y; // LỖI BIÊN DỊCH: biến y đã bị hủy ngoài khối if!
}
```

### Ví dụ 2: Nạp chồng hàm tính diện tích
```cpp
// Tính diện tích hình vuông
int dienTich(int canh) {
    return canh * canh;
}

// Tính diện tích hình chữ nhật (cùng tên hàm nhưng nhận 2 tham số)
int dienTich(int dai, int rong) {
    return dai * rong;
}

int s1 = dienTich(5);    // Tự động gọi hàm 1 tham số -> 25
int s2 = dienTich(4, 6); // Tự động gọi hàm 2 tham số -> 24
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Lạm dụng biến toàn cục (Global Variable)**
> * *Nguy cơ:* Vì bất kỳ hàm nào cũng có thể sửa đổi biến toàn cục, chương trình sẽ rất khó kiểm soát và khó tìm nguyên nhân khi xảy ra lỗi logic.
> * *Quy tắc:* Luôn ưu tiên dùng biến cục bộ và truyền dữ liệu qua tham số của hàm.

> [!WARNING]
> **2. Nạp chồng hàm chỉ khác nhau ở kiểu trả về**
> * *Lỗi:* Khai báo `int tinh(int a)` và `double tinh(int a)`.
> * *Hậu quả:* Báo lỗi biên dịch vì khi bạn gọi `tinh(5)`, trình biên dịch không thể biết bạn muốn gọi hàm nào.

## 5. Ghi nhớ trọng tâm

- Biến khai báo trong cặp ngoặc `{}` nào thì chỉ có giá trị sử dụng bên trong cặp ngoặc đó.
- Nạp chồng hàm cho phép các hàm có cùng tên, giúp code trực quan và thống nhất.
- Để nạp chồng hợp lệ, danh sách tham số bắt buộc phải khác nhau về kiểu hoặc số lượng.
