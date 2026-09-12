---
lessonId: "CPP-03.02"
title: "Vòng lặp for đếm số và các câu lệnh điều khiển break, continue"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["for loop", "break", "continue", "counter", "iteration", "off-by-one"]
prerequisites: ["CPP-03.01"]
---

## 1. Khái niệm & Vấn đề

Khi bài toán yêu cầu lặp lại một hành động với **số lần đã biết trước** (ví dụ: in từ 1 đến 100, duyệt qua danh sách 50 học sinh, tính tổng 1000 phần tử), cấu trúc **`for`** là lựa chọn số 1 của mọi lập trình viên. 

Vòng lặp `for` gom toàn bộ 3 thành phần cốt lõi của một quá trình lặp (**Khởi tạo**, **Điều kiện dừng**, **Bước nhảy biến đếm**) lên cùng một dòng duy nhất, giúp mã nguồn cực kỳ gọn gàng, trong sáng và loại trừ triệt để nguy cơ quên tăng biến đếm gây lặp vô tận.

Ngoài ra, C++ cung cấp 2 "vô lăng" điều khiển luồng cực mạnh bên trong vòng lặp:
* **`break`:** Chiếc phanh khẩn cấp: lập tức dừng và thoát vĩnh viễn khỏi vòng lặp.
* **`continue`:** Chiếc bàn đạp ga nhảy cóc: lập tức bỏ qua phần còn lại của lần lặp hiện tại để phóng sang lần lặp kế tiếp.

| Cú pháp / Từ khóa | Chức năng cốt lõi | Hành vi thực thi |
| :--- | :--- | :--- |
| **`for (init; cond; step)`** | Vòng lặp kiểm soát biến đếm | Gom Khởi tạo, Điều kiện, Bước nhảy trên 1 dòng duy nhất. |
| **`break`** | Phanh dừng khẩn cấp | Phá vỡ vòng lặp ngay tại vị trí gọi, nhảy ra lệnh kế tiếp ngoài vòng lặp. |
| **`continue`** | Nhảy cóc bước lặp | Bỏ qua các câu lệnh phía sau, nhảy ngay đến biểu thức bước nhảy (`step`). |

---

## 2. Cú pháp & Vận hành

### 2.1. Cấu trúc 3 thành phần của vòng lặp `for`
```cpp
#include <iostream>

int main() {
    // In các số chẵn từ 2 đến 10
    for (int i = 2; i <= 10; i += 2) {
        std::cout << i << ' ';
    }
    std::cout << '\n'; // In ra: 2 4 6 8 10
    return 0;
}
```

### 2.2. Vòng đời 4 bước chạy của vòng `for`
1. **Bước 1 (Chỉ chạy duy nhất 1 lần đầu):** Thực thi biểu thức khởi tạo `int i = 2`.
2. **Bước 2:** Kiểm tra điều kiện lặp `i <= 10`. Nếu `false` ➔ Dừng vòng lặp. Nếu `true` ➔ Đi tiếp sang Bước 3.
3. **Bước 3:** Thực thi thân vòng lặp (`std::cout << i << ' ';`).
4. **Bước 4:** Thực thi biểu thức bước nhảy (`i += 2`). Sau đó quay trở lại **Bước 2**.

```text
[1. Khởi tạo: int i = 2]
         │
         ▼
 ┌──►[2. Kiểm tra: i <= 10] ──(Nếu false)──► [Thoát vòng lặp]
 │       │ (Nếu true)
 │       ▼
 │   [3. Thân lệnh: in i]
 │       │
 │       ▼
 └───[4. Bước nhảy: i += 2]
```

### 2.3. Điều khiển bước lặp với `break` và `continue`

```cpp
#include <iostream>

int main() {
    std::cout << "Vi du continue (Bo qua so 3):\n";
    for (int i = 1; i <= 5; ++i) {
        if (i == 3) {
            continue; // Bỏ qua in số 3, nhảy thẳng lên ++i
        }
        std::cout << i << ' ';
    }
    // Kết quả: 1 2 4 5

    std::cout << "\nVi du break (Dung khi gap so 4):\n";
    for (int i = 1; i <= 10; ++i) {
        if (i == 4) {
            break; // Thoát vòng lặp ngay lập tức
        }
        std::cout << i << ' ';
    }
    // Kết quả: 1 2 3
    std::cout << '\n';

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy vòng for kinh điển:**
> 1. **Lỗi lệch 1 phần tử (Off-by-one Error):**
>    Nhầm lẫn giữa dấu `<` và `<=`. Ví dụ muốn lặp N lần từ 1 đến N mà viết `i < N` sẽ làm mất phần tử cuối cùng. Muốn lặp N lần với chỉ số từ 0, cú pháp chuẩn là: `for (int i = 0; i < N; ++i)`.
> 2. **Tự ý thay đổi biến đếm `i` bên trong thân vòng lặp:**
>    Thay đổi giá trị biến `i` một cách tùy tiện trong thân vòng `for` làm mất kiểm soát bước lặp, khiến code rất khó debug.
> 3. **Truy cập biến đếm `i` bên ngoài vòng for:**
>    Biến khai báo `for (int i = ...)` chỉ tồn tại cục bộ bên trong vòng lặp. Ra ngoài vòng for, biến `i` không còn tồn tại.

> [!TIP]
> **Quy chuẩn Modern C++:** Luôn ưu tiên dùng tiền tố `++i` thay vì `i++` trong bước nhảy của vòng for để giữ thói quen tối ưu hiệu năng tốt nhất cho con trỏ và iterator sau này.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Đoạn code sau đây sẽ in ra bao nhiêu số trên màn hình console?
```cpp
for (int i = 1; i <= 10; ++i) {
    if (i % 2 == 0) continue;
    if (i > 7) break;
    std::cout << i << ' ';
}
```
* [ ] A) 10 số
* [ ] B) 5 số
* [x] C) 4 số (Các số được in ra là: 1, 3, 5, 7)
* [ ] D) 3 số

*(Giải thích: Số chẵn 2, 4, 6, 8 bị `continue` bỏ qua. Các số lẻ 1, 3, 5, 7 được in ra. Đến số lẻ tiếp theo là 9, điều kiện `i > 7` thỏa mãn làm kích hoạt `break` dừng vòng lặp lập tức).*

---

### Thử thách sửa lỗi (Debug)
Một học viên viết code tính tổng các số từ 1 đến `n` nhưng kết quả luôn bị thiếu số cuối cùng. Hãy chỉ ra lỗi:

```cpp
// Code lỗi:
#include <iostream>

int main() {
    int n = 5;
    int tong = 0;
    for (int i = 1; i < n; ++i) {
        tong += i;
    }
    std::cout << "Tong: " << tong << '\n'; // Ra 10 thay vì 15!
    return 0;
}
```

**Sửa lại:** Đổi điều kiện lặp từ `i < n` thành `i <= n`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào một số nguyên dương `n` từ bàn phím (1 ≤ n ≤ 10⁶). Hãy tính tổng của dãy số:
S = 1 + 2 + 3 + ... + n

**Ràng buộc kỹ thuật:**
* Phải sử dụng kiểu dữ liệu `long long` cho biến tích lũy tổng để tránh hoàn toàn lỗi tràn số khi `n` lớn.

**Ví dụ:**
* Đầu vào: `10` ➔ Đầu ra: `55`
* Đầu vào: `100000` ➔ Đầu ra: `5000050000`

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    long long n = 0;
    if (std::cin >> n && n > 0) {
        long long tong = 0;
        for (long long i = 1; i <= n; ++i) {
            tong += i;
        }
        std::cout << tong << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Vòng lặp **`for`** là lựa chọn tối ưu cho các bài toán lặp có biến đếm và biết trước số lần lặp.
* Sử dụng **`break`** để ngắt vòng lặp khẩn cấp khi đã tìm thấy kết quả; sử dụng **`continue`** để bỏ qua lần lặp hiện tại.
* Luôn sử dụng kiểu `long long` cho các biến tích lũy tổng để phòng chống lỗi tràn số nguyên.

Trong bài học tiếp theo **[Bài 3.3: Vòng lặp lồng nhau (Nested Loops) và Kỹ thuật Vẽ hình tư duy]**, chúng ta sẽ phát triển tư duy không gian 2 chiều để giải các bài toán in hình nghệ thuật, bảng cửu chương và lưới ma trận.
