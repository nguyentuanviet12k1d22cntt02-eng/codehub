---
lessonId: "CPP-04.02"
title: "Cơ chế Tham trị (Pass-by-value) vs Tham chiếu (Pass-by-reference &)"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["pass-by-value", "pass-by-reference", "reference", "alias", "swap", "memory"]
prerequisites: ["CPP-04.01"]
---

## 1. Khái niệm & Vấn đề

Khi bạn truyền một biến vào làm tham số cho một hàm, chuyện gì thực sự xảy ra bên trong bộ nhớ RAM?
* Máy tính sẽ tạo ra một **bản sao chép** giá trị độc lập?
* Hay hàm sẽ can thiệp trực tiếp vào **chính ô nhớ gốc** của biến đó?

Đây là một trong những ranh giới phân biệt sâu sắc nhất giữa lập trình viên nghiệp dư và kỹ sư C++ chuyên nghiệp. Ngôn ngữ C++ cung cấp 2 cơ chế truyền tham số cơ bản:
1. **Truyền tham trị (Pass-by-value):** Nhân bản dữ liệu sang ô nhớ mới. Mọi chỉnh sửa trong hàm hoàn toàn không ảnh hưởng đến biến gốc.
2. **Truyền tham chiếu (Pass-by-reference `&`):** Biến trong hàm trở thành một **Bí danh (Alias)** đại diện trực tiếp cho ô nhớ gốc. Bất kỳ thay đổi nào trong hàm sẽ làm thay đổi trực tiếp giá trị của biến gốc bên ngoài!

| Tiêu chí | Truyền Tham trị (Pass-by-value) | Truyền Tham chiếu (Pass-by-reference `&`) |
| :--- | :--- | :--- |
| **Cú pháp tham số** | `void ham(int x)` | `void ham(int& x)` (Có thêm dấu `&`) |
| **Hành vi bộ nhớ** | Tạo ô nhớ mới trên Stack, sao chép giá trị vào. | Không cấp thêm ô nhớ; dùng chung ô nhớ với biến gốc. |
| **Tác động đến biến gốc** | **Hoàn toàn không đổi** sau khi hàm kết thúc. | **Bị thay đổi trực tiếp** theo các thao tác trong hàm. |
| **Phép ẩn dụ thực tế** | Photocopy tài liệu: bạn vẽ bậy lên bản photo thì bản gốc ở nhà vẫn sạch nguyên. | Đặt biệt danh cho một người: gọi "Tèo" hay "Nguyễn Văn Tèo" thì vẫn là đúng người đó! |

---

## 2. Cú pháp & Vận hành

### 2.1. Thí nghiệm kinh điển: Hàm Hoán vị (Swap) hai số

Hãy quan sát sự khác nhau một trời một vực giữa tham trị và tham chiếu:

#### Trường hợp 1: Truyền tham trị (Thất bại!)
```cpp
void hoanViSai(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
} // Khi hàm kết thúc, bản sao a và b bị hủy! Biến x, y bên ngoài KHÔNG THAY ĐỔI!
```

#### Trường hợp 2: Truyền tham chiếu `&` (Thành công 100%!)
```cpp
#include <iostream>

// Dấu & biến a và b thành tham chiếu đến ô nhớ gốc của x và y
void hoanViDung(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 5, y = 10;
    std::cout << "Truoc hoan vi: x = " << x << ", y = " << y << '\n';

    hoanViDung(x, y); // Truyền trực tiếp x và y vào

    std::cout << "Sau hoan vi:   x = " << x << ", y = " << y << '\n'; 
    // Kết quả: x = 10, y = 5 (Đã hoán đổi thực sự!)
    return 0;
}
```

### 2.2. Sơ đồ trạng thái Bộ nhớ RAM (Stack Memory)

```text
[Trong hàm main]:
Địa chỉ ô nhớ: 0x100 [ x = 10 ]  ◄──┐
Địa chỉ ô nhớ: 0x104 [ y = 5  ]  ◄──┼──┐
                                     │  │ (Dùng chung địa chỉ)
[Trong hàm hoanViDung(int& a, int& b)]: │  │
Biến tham chiếu a trỏ trực tiếp tới ──┘  │
Biến tham chiếu b trỏ trực tiếp tới ─────┘
```

### 2.3. Ứng dụng: Hàm trả về nhiều hơn một giá trị
Mặc định lệnh `return` chỉ có thể trả về duy nhất một giá trị. Bằng cách sử dụng tham chiếu, ta có thể cho hàm ghi kết quả trực tiếp vào nhiều biến cùng lúc:

```cpp
void tinhToan(int a, int b, int& tong, int& hieu, int& tich) {
    tong = a + b;
    hieu = a - b;
    tich = a * b;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy khi thao tác với Tham chiếu:**
> 1. **Truyền giá trị hằng số (Literal) vào tham chiếu không hằng:**
>    ```cpp
>    void tangLen(int& x) { x++; }
>    // tangLen(5); // LỖI BIÊN DỊCH: cannot bind non-const lvalue reference to an rvalue!
>    ```
>    Số `5` là một hằng số tạm thời, nó không có ô nhớ cố định để tham chiếu tới. Tham số `int&` bắt buộc phải nhận vào một biến thực sự có tên định danh.
> 2. **Tác dụng phụ ngoài ý muốn (Side Effects):**
>    Khi truyền tham chiếu `&`, bạn vô tình sửa đổi biến trong hàm mà không hay biết, làm hỏng dữ liệu của hàm gọi bên ngoài.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Đoạn code sau đây sẽ in ra giá trị gì của biến `a`?
```cpp
void nhanDoi(int x) {
    x = x * 2;
}

int main() {
    int a = 10;
    nhanDoi(a);
    std::cout << a;
    return 0;
}
```
* [x] A) `10` (Vì hàm `nhanDoi` dùng truyền tham trị, biến `a` gốc không hề bị đổi)
* [ ] B) `20`
* [ ] C) `0`
* [ ] D) Lỗi biên dịch

---

### Thử thách sửa lỗi (Debug)
Đoạn mã sau muốn tăng giá trị của biến lên gấp đôi nhưng không thành công. Hãy sửa lại bằng cách sử dụng tham chiếu:

```cpp
// Code lỗi:
#include <iostream>

void gapDoi(int n) { // LỖI THAM TRỊ!
    n *= 2;
}

int main() {
    int diem = 50;
    gapDoi(diem);
    std::cout << "Diem sau khi gap doi: " << diem << '\n';
    return 0;
}
```

**Sửa lại:** Thêm dấu `&` vào tham số của hàm: `void gapDoi(int& n)`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình gồm:
1. Hàm `void sapXepTangDan(long long& a, long long& b)` nhận vào 2 tham chiếu số nguyên. Nếu a > b thì hoán đổi giá trị để đảm bảo sau hàm, a ≤ b.
2. Trong hàm `main()`, nhập vào 2 số nguyên a và b từ bàn phím, gọi hàm `sapXepTangDan(a, b)` và in 2 số sau khi sắp xếp cách nhau bởi dấu cách.

**Ví dụ:**
* Đầu vào: `20 15` ➔ Đầu ra: `15 20`
* Đầu vào: `7 9` ➔ Đầu ra: `7 9`

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

void sapXepTangDan(long long& a, long long& b) {
    if (a > b) {
        long long temp = a;
        a = b;
        b = temp;
    }
}

int main() {
    long long x = 0, y = 0;
    if (std::cin >> x >> y) {
        sapXepTangDan(x, y);
        std::cout << x << ' ' << y << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* **Truyền tham trị** sao chép dữ liệu; an toàn cho biến gốc nhưng tốn bộ nhớ nếu đối tượng lớn.
* **Truyền tham chiếu (`&`)** thao tác trực tiếp trên ô nhớ của biến gốc; thay đổi trong hàm sẽ tác động trực tiếp ra bên ngoài.
* Tham chiếu là chìa khóa để xây dựng các hàm hoán vị, cập nhật trạng thái và trả về nhiều kết quả cùng lúc.

Trong bài học tiếp theo **[Bài 4.3: Tham chiếu Hằng (const Reference) - Tiêu chuẩn tối ưu hóa C++]**, chúng ta sẽ khám phá kỹ thuật kết hợp tinh hoa: vừa đạt tốc độ Zero-copy của tham chiếu, vừa đảm bảo an toàn dữ liệu 100% của hằng số.
