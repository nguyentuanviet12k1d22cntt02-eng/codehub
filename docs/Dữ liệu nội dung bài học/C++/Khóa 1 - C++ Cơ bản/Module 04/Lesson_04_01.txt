---
lessonId: "CPP-04.01"
title: "Khai báo Hàm, Định nghĩa Hàm và Nguyên mẫu hàm (Function Prototype)"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["function", "prototype", "declaration", "definition", "modular programming", "return type"]
prerequisites: ["CPP-03.05"]
---

## 1. Khái niệm & Vấn đề

Khi một chương trình bắt đầu phình to lên hàng trăm hoặc hàng ngàn dòng code, nếu dồn toàn bộ logic vào trong duy nhất hàm `main()`, mã nguồn sẽ trở thành một đống bòng bong không thể đọc hiểu, không thể tái sử dụng và cực kỳ khó gỡ lỗi. 

Nguyên lý cốt lõi của công nghệ phần mềm là **Chia để trị (Divide and Conquer)**: phân rã một bài toán lớn phức tạp thành các bài toán con nhỏ hơn, độc lập và dễ giải quyết. Trong C++, công cụ hiện thực hóa triết lý này chính là **Hàm (Functions)**.

Một hàm là một khối mã nguồn độc lập được đặt tên, nhận dữ liệu đầu vào (Tham số - Parameters), xử lý logic và trả về kết quả (Giá trị trả về - Return Value).

| Thuật ngữ | Cú pháp trong C++ | Ý nghĩa kỹ thuật | Phép ẩn dụ thực tế |
| :--- | :--- | :--- | :--- |
| **Nguyên mẫu hàm (Prototype)** | `int tinhTong(int a, int b);` | Khai báo trước cho trình biên dịch biết tên hàm, tham số và kiểu trả về. | Bản vẽ kỹ thuật giới thiệu món đồ trước khi sản xuất thực tế. |
| **Định nghĩa hàm (Definition)** | `int tinhTong(int a, int b) { ... }` | Thân hàm chứa toàn bộ mã nguồn logic xử lý thực tế. | Nhà xưởng thi công lắp ráp sản phẩm hoàn chỉnh theo bản vẽ. |
| **Kiểu trả về (Return Type)** | `int`, `double`, `void`, ... | Kiểu dữ liệu của kết quả mà hàm bắn về cho nơi gọi nó. | Kiểu bưu kiện mà nhân viên giao hàng trao tận tay bạn. |
| **Hàm không trả về (`void`)** | `void inThongBao();` | Hàm chỉ thực thi hành động (như in ấn, lưu file) mà không gửi lại kết quả. | Loa phát thanh: chỉ phát tin cho mọi người nghe mà không nhận lại hồi đáp. |

---

## 2. Cú pháp & Vận hành

### 2.1. Cú pháp hoàn chỉnh của một Hàm trong C++
```cpp
#include <iostream>

// 1. NGUYÊN MẪU HÀM (Function Prototype): Đặt ở đầu file
long long tinhGiaiThua(int n);

// 2. HÀM MAIN: Cổng vào điều phối chương trình
int main() {
    int so = 5;
    long long ketQua = tinhGiaiThua(so); // Lời gọi hàm (Function Call)
    std::cout << so << "! = " << ketQua << '\n'; // In ra 120
    return 0;
}

// 3. ĐỊNH NGHĨA HÀM (Function Definition): Đặt ở cuối file
long long tinhGiaiThua(int n) {
    if (n <= 1) return 1;
    long long gt = 1;
    for (int i = 2; i <= n; ++i) {
        gt *= i;
    }
    return gt; // Trả kết quả về cho nơi gọi hàm
}
```

### 2.2. Vì sao cần Nguyên mẫu hàm (Function Prototype)?
Trình biên dịch C++ đọc mã nguồn theo chiều tuần tự **từ trên xuống dưới**:
* Nếu bạn gọi `tinhGiaiThua(5)` trong hàm `main()` mà hàm này được định nghĩa ở tuốt phía dưới, compiler sẽ lập tức báo lỗi: `'tinhGiaiThua' was not declared in this scope`.
* **Giải pháp chuẩn công nghiệp:** Đặt các dòng Nguyên mẫu hàm (Function Prototype) ở đầu file hoặc tách vào file tiêu đề `.h`. Điều này cho phép các lập trình viên đọc nhanh bản danh sách chức năng của chương trình mà không cần cuộn qua hàng trăm dòng code chi tiết!

### 2.3. Cơ chế Hoạt động của Lệnh `return`
1. Lệnh `return <gia_tri>;` kết thúc hàm lập tức và chuyển giá trị về nơi gọi hàm.
2. Mọi câu lệnh nằm bên dưới lệnh `return` trong cùng một khối lệnh sẽ bị **bỏ qua hoàn toàn (Dead Code)**.
3. Với hàm có kiểu trả về `void`, có thể dùng `return;` (không có giá trị) để chủ động thoát khỏi hàm sớm khi gặp điều kiện biên.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các sai lầm phổ biến khi viết hàm:**
> 1. **Quên lệnh `return` trong hàm có kiểu trả về khác `void`:**
>    Nếu hàm khai báo `int tinhTong(...)` nhưng lại quên viết lệnh `return`, chương trình sẽ gây ra hiện tượng **Hành vi bất định (Undefined Behavior)** — hàm có thể trả về một con số rác ngẫu nhiên!
> 2. **Trùng tên tham số với tên biến trong hàm:**
>    Khai báo tham số `void xuLy(int x)` nhưng bên trong lại viết `int x = 10;` sẽ bị compiler báo lỗi `redeclaration of 'int x'`.
> 3. **Nhầm lẫn giữa In ra màn hình (`std::cout`) và Trả về kết quả (`return`):**
>    In ra màn hình chỉ là xuất chữ cho mắt người đọc. Muốn lấy kết quả để tính toán tiếp thì bắt buộc phải dùng lệnh `return`.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Mục đích chính của dòng **Nguyên mẫu hàm (Function Prototype)** đặt ở đầu file C++ là gì?
* [ ] A) Giúp chương trình chạy nhanh gấp đôi.
* [x] B) Thông báo trước cho trình biên dịch biết chữ ký của hàm (tên hàm, kiểu trả về, tham số) trước khi hàm được gọi thực tế.
* [ ] C) Bắt buộc hàm phải sử dụng biến toàn cục.
* [ ] D) Tự động gán giá trị 0 cho mọi biến trong hàm.

---

### Thử thách sửa lỗi (Debug)
Hàm sau đây có nhiệm vụ tính diện tích hình chữ nhật nhưng bị cảnh báo trình biên dịch nghiêm trọng. Hãy phát hiện lỗi:

```cpp
// Code lỗi:
#include <iostream>

double tinhDienTich(double dai, double rong) {
    double s = dai * rong;
    std::cout << "Dien tich: " << s << '\n';
    // THIẾU LỆNH RETURN!
}

int main() {
    double dt = tinhDienTich(4.5, 2.0);
    return 0;
}
```

**Sửa lại:** Bổ sung `return s;` ở cuối hàm `tinhDienTich`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** 
1. Khai báo nguyên mẫu hàm: `long long tinhGiaiThua(int n);`
2. Định nghĩa hàm `tinhGiaiThua` nhận vào số nguyên n (0 ≤ n ≤ 20) và trả về giá trị n! = 1 	imes 2 	imes ... 	imes n (Quy ước: 0! = 1).
3. Trong hàm `main()`, nhập vào số nguyên n từ bàn phím, gọi hàm và in kết quả ra màn hình: `<ket_qua>`

**Ví dụ:**
* Đầu vào: `5` ➔ Đầu ra: `120`
* Đầu vào: `0` ➔ Đầu ra: `1`
* Đầu vào: `10` ➔ Đầu ra: `3628800`

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

// Nguyên mẫu hàm
long long tinhGiaiThua(int n);

int main() {
    int n = 0;
    if (std::cin >> n && n >= 0 && n <= 20) {
        std::cout << tinhGiaiThua(n) << '\n';
    }
    return 0;
}

// Định nghĩa hàm
long long tinhGiaiThua(int n) {
    if (n == 0 || n == 1) return 1;
    long long res = 1;
    for (int i = 2; i <= n; ++i) {
        res *= i;
    }
    return res;
}
```

---

## 5. Đúc kết & Đi tiếp

* Hàm là công cụ số 1 để module hóa mã nguồn, tái sử dụng logic và giữ hàm `main()` luôn sạch sẽ.
* Khai báo **Nguyên mẫu hàm (Function Prototype)** ở đầu file để compiler nhận diện trước chữ ký của hàm.
* Hàm có kiểu trả về khác `void` bắt buộc phải có câu lệnh `return` hợp lệ trên mọi nhánh điều kiện.

Trong bài học tiếp theo **[Bài 4.2: Cơ chế Tham trị (Pass-by-value) vs Tham chiếu (Pass-by-reference &)]**, chúng ta sẽ bóc tách cơ chế ô nhớ RAM khi truyền dữ liệu vào hàm và làm chủ dấu `&` đầy quyền năng của C++.
