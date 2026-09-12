---
lessonId: "CPP-03.01"
title: "Vòng lặp while (Tiền điều kiện) và do-while (Hậu điều kiện)"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["while", "do-while", "loop", "pre-condition", "post-condition", "menu loop"]
prerequisites: ["CPP-02.04"]
---

## 1. Khái niệm & Vấn đề

Máy tính có sức mạnh vượt trội con người không phải vì nó thông minh hơn, mà vì nó có thể lặp đi lặp lại một công việc hàng triệu lần trong 1 giây mà **không bao giờ biết mệt mỏi hay nhầm lẫn**.

Khi cần thực hiện một thao tác lặp mà **chưa biết trước số lần lặp cụ thể** (chỉ biết điều kiện dừng hoặc lặp cho đến khi người dùng yêu cầu thoát), chúng ta sử dụng vòng lặp:
1. **`while` (Vòng lặp tiền điều kiện):** Kiểm tra điều kiện **TRƯỚC** khi chạy. Nếu điều kiện sai ngay từ đầu, thân vòng lặp sẽ **không chạy một lần nào**!
2. **`do-while` (Vòng lặp hậu điều kiện):** Chạy thân vòng lặp trước một lần rồi mới kiểm tra điều kiện. Đảm bảo thân vòng lặp **luôn chạy tối thiểu 1 lần**.

| Cấu trúc | Thời điểm kiểm tra | Số lần lặp tối thiểu | Ứng dụng thực tế phổ biến |
| :--- | :--- | :---: | :--- |
| **`while`** | Kiểm tra trước khi vào thân lặp. | **0 lần** | Bóc tách từng chữ số của một số nguyên, đọc dữ liệu đến hết file. |
| **`do-while`** | Thực hiện thân lặp trước, kiểm tra sau. | **1 lần** | Menu chương trình tương tác, bắt người dùng nhập lại khi nhập sai dữ liệu. |

---

## 2. Cú pháp & Vận hành

### 2.1. Cú pháp vòng lặp `while`
Dưới đây là thuật toán kinh điển bóc tách và tính tổng các chữ số của một số nguyên:

```cpp
#include <iostream>

int main() {
    int n = 1234;
    int tongChuSo = 0;

    while (n > 0) {
        int chuSoCuoi = n % 10; // Bóc tách chữ số hàng đơn vị
        tongChuSo += chuSoCuoi; // Cộng dồn vào tổng
        n = n / 10;             // Vứt bỏ chữ số cuối cùng
    }

    std::cout << "Tong cac chu so: " << tongChuSo << '\n'; // In ra 10 (1+2+3+4)
    return 0;
}
```

### 2.2. Bảng theo dõi thực thi (Execution Trace) của `while (n > 0)` với `n = 1234`

| Vòng lặp | `n` ban đầu | `chuSoCuoi = n % 10` | `tongChuSo` mới | `n = n / 10` | Điều kiện `n > 0` |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 1234 | 4 | 4 | 123 | `true` (Lặp tiếp) |
| 2 | 123 | 3 | 7 | 12 | `true` (Lặp tiếp) |
| 3 | 12 | 2 | 9 | 1 | `true` (Lặp tiếp) |
| 4 | 1 | 1 | 10 | 0 | `false` (Dừng vòng lặp!) |

### 2.3. Cú pháp vòng lặp `do-while` - Ứng dụng làm Menu tương tác
Vòng lặp `do-while` luôn có dấu chấm phẩy `;` ở cuối mệnh đề `while (...)`:

```cpp
#include <iostream>

int main() {
    int luaChon = 0;

    do {
        std::cout << "=== MENU CHUONG TRINH ===\n";
        std::cout << "1. Xem thong tin\n";
        std::cout << "2. Chinh sua ho so\n";
        std::cout << "0. Thoat chuong trinh\n";
        std::cout << "Moi ban chon (0-2): ";
        std::cin >> luaChon;

        std::cout << "Ban da chon chuc nang: " << luaChon << "\n\n";
    } while (luaChon != 0); // Tiếp tục lặp lại nếu người dùng chưa chọn 0

    std::cout << "Tam biet! Hen gap lai!\n";
    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy vòng lặp nguy hiểm nhất:**
> 1. **Vòng lặp vô tận (Infinite Loop Trap):**
>    Quên cập nhật biến điều kiện bên trong thân vòng lặp khiến điều kiện luôn luôn `true`. CPU sẽ bị ép chạy 100% công suất làm treo phần mềm:
>    ```cpp
>    int i = 1;
>    while (i <= 10) {
>        std::cout << i << ' ';
>        // QUÊN i++; -> Biến i mãi mãi bằng 1 -> VÒNG LẶP VÔ TẬN!
>    }
>    ```
> 2. **Quên dấu chấm phẩy `;` ở cuối `do-while`:**
>    Cú pháp đúng là `do { ... } while (dieuKien);`. Bỏ sót dấu `;` sẽ gây lỗi biên dịch.
> 3. **Nhầm lẫn giữa "Điều kiện Tiếp tục" và "Điều kiện Dừng":**
>    Trong `while (dieuKien)`, `dieuKien` là biểu thức để vòng lặp **TIẾP TỤC CHẠY**, không phải điều kiện để dừng lại.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Khẳng định nào sau đây là **CHÍNH XÁC NHẤT** khi so sánh giữa `while` và `do-while`?
* [ ] A) `while` luôn chạy nhanh hơn `do-while` gấp 2 lần.
* [x] B) `while` có thể không chạy lần nào nếu điều kiện sai ngay từ đầu, còn `do-while` chắc chắn chạy tối thiểu 1 lần.
* [ ] C) `do-while` không cho phép dùng lệnh `break`.
* [ ] D) `while` chỉ dùng được với kiểu số nguyên.

---

### Thử thách sửa lỗi (Debug)
Đoạn mã sau có nhiệm vụ in ra các số từ 1 đến 5 nhưng bị treo máy khi chạy. Hãy tìm lỗi và sửa lại:

```cpp
// Code lỗi:
#include <iostream>

int main() {
    int count = 1;
    while (count <= 5) {
        std::cout << count << ' ';
    }
    return 0;
}
```

**Cách sửa đúng:**
Thêm câu lệnh tăng biến đếm `count++;` vào trong thân vòng lặp `while`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình nhận vào một số nguyên dương `n` từ bàn phím. Hãy đếm xem số nguyên `n` có bao nhiêu chữ số và tính tích của tất cả các chữ số đó.
* In ra trên 2 dòng:
  * Dòng 1: `So chu so: <so_luong>`
  * Dòng 2: `Tich cac chu so: <tich>`

**Ví dụ:**
* Đầu vào: `234`
  * Dòng 1: `So chu so: 3`
  * Dòng 2: `Tich cac chu so: 24` (2 × 3 × 4 = 24)

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    long long n = 0;
    if (std::cin >> n && n > 0) {
        int dem = 0;
        long long tich = 1;

        long long temp = n;
        while (temp > 0) {
            int digit = temp % 10;
            tich *= digit;
            dem++;
            temp /= 10;
        }

        std::cout << "So chu so: " << dem << '\n';
        std::cout << "Tich cac chu so: " << tich << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Sử dụng **`while`** khi số lần lặp không cố định và cần kiểm tra điều kiện an toàn trước khi chạy.
* Sử dụng **`do-while`** khi hành động cần được thực thi ít nhất một lần đầu tiên (như hiển thị Menu hoặc nhập dữ liệu).
* Luôn bảo đảm có câu lệnh làm thay đổi biến điều kiện trong thân vòng lặp để tránh thảm họa **Vòng lặp vô tận**.

Trong bài học tiếp theo **[Bài 3.2: Vòng lặp for đếm số và các câu lệnh điều khiển break, continue]**, chúng ta sẽ làm chủ cấu trúc vòng lặp phổ biến nhất thế giới lập trình cùng kỹ thuật ngắt bước lặp thông minh.
