---
lessonId: "CPP-04.03"
title: "Tham chiếu Hằng (const Reference) - Tiêu chuẩn tối ưu hóa C++"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["const reference", "optimization", "clean code", "zero copy", "read-only"]
prerequisites: ["CPP-04.02"]
---

## 1. Khái niệm & Vấn đề

Chúng ta đã biết:
* Truyền tham trị (`Type x`): An toàn không sợ bị sửa biến gốc, nhưng **bắt buộc phải sao chép** dữ liệu.
* Truyền tham chiếu (`Type& x`): Không tốn thời gian sao chép (Zero-copy), nhưng **nguy hiểm** vì hàm có thể vô tình làm thay đổi giá trị gốc bên ngoài.

Chuyện gì sẽ xảy ra nếu chúng ta cần truyền một chuỗi văn bản dài hàng triệu ký tự (`std::string`), một bức ảnh độ phân giải 4K hay một danh sách chứa 100,000 khách hàng vào một hàm chỉ để hiển thị hoặc kiểm tra?
* Nếu truyền tham trị: Máy tính phải cấp phát thêm bộ nhớ khổng lồ để sao chép toàn bộ dữ liệu ➔ **Chương trình chạy chậm rì và giật lag!**
* Nếu truyền tham chiếu thường: Hàm có thể vô tình làm hỏng dữ liệu gốc ➔ **Không an toàn!**

Giải pháp tối thượng chuẩn công nghiệp của ngôn ngữ C++ là: **Tham chiếu Hằng (`const Type&`)** — sự kết hợp hoàn hảo giữa **Hiệu năng tốc độ cực hạn (Zero-copy)** và **Độ an toàn dữ liệu tuyệt đối (Read-only)**.

| Cách truyền tham số | Chi phí sao chép bộ nhớ | Cho phép sửa biến gốc? | Mức độ khuyên dùng |
| :--- | :---: | :---: | :--- |
| **Tham trị (`Type x`)** | **Rất đắt** nếu dữ liệu lớn | Không | Dành cho kiểu nguyên thủy nhỏ (`int`, `char`, `double`, `bool`). |
| **Tham chiếu (`Type& x`)** | **Bằng 0 (Zero-copy)** | **Có** (Nguy cơ lỗi) | Dùng khi CỐ TÌNH muốn hàm thay đổi biến gốc (như hàm `swap`). |
| **Tham chiếu Hằng (`const Type& x`)** | **Bằng 0 (Zero-copy)** | **Tuyệt đối CẤM** | **Chuẩn mực mặc định cho mọi kiểu dữ liệu phức tạp (`string`, `vector`, `struct`, `class`)!** |

---

## 2. Cú pháp & Vận hành

### 2.1. Cú pháp chuẩn của Tham chiếu Hằng
Để khai báo tham chiếu hằng, ta thêm từ khóa `const` trước kiểu dữ liệu và dấu `&` sau kiểu dữ liệu:

```cpp
#include <iostream>
#include <string>

// Truyền chuỗi bằng const Reference: Cực nhanh và An toàn tuyệt đối!
void inLoiChao(const std::string& tenNguoiDung) {
    std::cout << "Xin chao mung: " << tenNguoiDung << "!\n";

    // tenNguoiDung = "Hacker"; // LỖI BIÊN DỊCH NGAY LẬP TỨC!
    // "assignment of read-only reference 'tenNguoiDung'"
}

int main() {
    std::string hoTen = "Nguyen Tuan Viet";
    inLoiChao(hoTen); // Không tốn một nano giây nào để sao chép chuỗi!

    inLoiChao("Tran Thi B"); // ĐẶC BIỆT: const& cho phép truyền cả hằng chuỗi trực tiếp!
    return 0;
}
```

### 2.2. Điểm siêu việt của `const&`: Nhận được cả Giá trị tạm thời (Rvalue)
Với tham chiếu thường `std::string&`, bạn không thể truyền chuỗi ký tự trực tiếp như `inLoiChao("Alice")` vì "Alice" là một giá trị tạm thời.
Nhưng với **`const std::string&`**, trình biên dịch C++ cho phép kéo dài vòng đời của giá trị tạm thời đó, giúp hàm nhận được cả biến số lẫn giá trị hằng số cố định!

### 2.3. Quy tắc vàng lựa chọn cách truyền tham số trong C++
1. **Kiểu dữ liệu nguyên thủy cơ bản** (`int`, `long long`, `double`, `char`, `bool`): Kích thước của chúng chỉ từ 1 đến 8 byte (bằng hoặc nhỏ hơn kích thước con trỏ địa chỉ 8 byte trên hệ điều hành 64-bit). ➔ **Luôn truyền bằng Tham trị (Pass-by-value)**.
2. **Kiểu dữ liệu đối tượng, chuỗi, mảng động** (`std::string`, `std::vector`, `struct`, `class`): ➔ **Luôn luôn truyền bằng Tham chiếu Hằng (`const Type&`)**.
3. **Khi hàm cần thay đổi trực tiếp giá trị của đối số truyền vào**: ➔ **Dùng Tham chiếu thường (`Type&`)**.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các sai lầm cần lưu ý:**
> 1. **Cố tình ép kiểu để ghi đè lên tham chiếu const (Const Cast Hack):**
>    Một số người dùng kỹ thuật ép kiểu đen tối `const_cast` để sửa biến const. Đây là điều cấm kỵ vì nó phá vỡ cam kết bảo mật bộ nhớ của hàm và gây Undefined Behavior.
> 2. **Lạm dụng `const &` cho kiểu `int`:**
>    Viết `void cong(const int& a, const int& b)`. Việc này không sai về mặt cú pháp nhưng làm chậm chương trình vì máy tính phải giải con trỏ địa chỉ thay vì đọc trực tiếp giá trị từ thanh ghi CPU!

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Tại sao trong C++, các lập trình viên chuyên nghiệp luôn khuyến nghị truyền biến kiểu `std::string` vào hàm dưới dạng `const std::string&` thay vì `std::string`?
* [ ] A) Vì `const std::string&` giúp chuỗi tự động viết hoa toàn bộ chữ cái.
* [x] B) Vì giúp loại bỏ hoàn toàn chi phí sao chép bộ nhớ (Zero-copy) đồng thời bảo vệ chuỗi gốc không bị sửa đổi ngoài ý muốn.
* [ ] C) Vì nếu truyền `std::string` thì chương trình sẽ bị tràn số nguyên.
* [ ] D) Vì chuẩn C++17 đã khai tử việc truyền tham trị.

---

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây bị lỗi biên dịch. Hãy chỉ ra nguyên nhân:

```cpp
// Code lỗi:
#include <iostream>
#include <string>

void chuanHoa(const std::string& s) {
    if (!s.empty()) {
        s[0] = 'A'; // LỖI BIÊN DỊCH TẠI ĐÂY!
    }
}
```

**Nguyên nhân & Cách sửa:**
Tham số `s` được khai báo là `const std::string&` (chỉ đọc), do đó lệnh gán `s[0] = 'A'` bị trình biên dịch chặn lại vì vi phạm tính bất biến (Const-correctness). Nếu muốn sửa đổi, phải bỏ từ khóa `const`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình gồm hàm:
`void inThongTin(const std::string& tieuDe, long long giaTien);`
Nhận vào tiêu đề món hàng và giá tiền. In ra thông tin theo đúng định dạng:
`San pham: <tieu_de> | Gia: <gia_tien> VND`

Trong hàm `main()`, nhập vào tiêu đề (chuỗi có khoảng trắng) và giá tiền, sau đó gọi hàm trên để in ra màn hình.

**Ví dụ:**
* Đầu vào:
  ```text
  Ban phim co C++
  1500000
  ```
* Đầu ra:
  ```text
  San pham: Ban phim co C++ | Gia: 1500000 VND
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>
#include <string>

void inThongTin(const std::string& tieuDe, long long giaTien) {
    std::cout << "San pham: " << tieuDe << " | Gia: " << giaTien << " VND\n";
}

int main() {
    std::string ten;
    long long gia = 0;

    if (std::getline(std::cin, ten) && std::cin >> gia) {
        inThongTin(ten, gia);
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* **Tham chiếu hằng (`const Type&`)** là tiêu chuẩn vàng của Modern C++ khi làm việc với chuỗi văn bản và đối tượng dữ liệu lớn.
* Mang lại hiệu năng tối đa nhờ cơ chế **Zero-copy** và cam kết an toàn dữ liệu tuyệt đối nhờ tính chất **Read-only**.
* Có khả năng đón nhận cả biến lvalue thông thường lẫn các giá trị hằng số rvalue tạm thời.

Trong bài học tiếp theo **[Bài 4.4: Phạm vi biến (Scope), Vòng đời (Lifetime) và Nạp chồng hàm (Function Overloading)]**, chúng ta sẽ tìm hiểu không gian tồn tại của các biến và cách đặt cùng một tên hàm cho nhiều kiểu dữ liệu khác nhau.
