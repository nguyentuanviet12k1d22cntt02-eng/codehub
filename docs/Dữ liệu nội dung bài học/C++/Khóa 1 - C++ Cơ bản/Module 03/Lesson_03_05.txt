---
lessonId: "CPP-03.05"
title: "Chuyên đề Số học 2: Kỹ thuật Tách chữ số, Số Palindrome, Số Armstrong và Dãy Fibonacci"
difficulty: "MEDIUM"
estimatedDuration: 30
keywords: ["digit extraction", "palindrome", "armstrong", "fibonacci", "number theory", "loops"]
prerequisites: ["CPP-03.04"]
---

## 1. Khái niệm & Vấn đề

Tiếp tục hành trình làm chủ tư duy thuật toán với vòng lặp, chúng ta sẽ khảo sát 3 bài toán số học kinh điển xuất hiện trong hầu hết các đề thi học sinh giỏi và bài kiểm tra đầu vào kỹ sư phần mềm:
1. **Số Palindrome (Số đối xứng):** Số đọc từ trái sang phải hay từ phải sang trái đều như nhau (ví dụ: `121`, `12321`, `8888`).
2. **Số Armstrong:** Số có giá trị bằng tổng các chữ số của nó lũy thừa theo số lượng chữ số (ví dụ: 153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153).
3. **Dãy số Fibonacci:** Dãy số tự nhiên bắt đầu bằng 0, 1 và mỗi số hạng tiếp theo bằng tổng hai số hạng liền trước (F_0=0, F_1=1, F_n = F_{n-1} + F_{n-2}).

Để giải quyết các bài toán này, kỹ thuật cốt lõi chúng ta sử dụng là **Kỹ thuật Bóc tách và Tái tạo Chữ số** kết hợp với **Kỹ thuật Tịnh tiến Biến trạng thái** (không cần dùng đệ quy hay mảng).

| Bài toán số học | Bản chất kiểm tra | Kỹ thuật giải quyết cốt lõi |
| :--- | :--- | :--- |
| **Số Palindrome** | Số gốc == Số đảo ngược | Tạo số đảo ngược qua vòng lặp: `rev = rev * 10 + n % 10`. |
| **Số Armstrong** | N = tổng các chữ số lũy thừa k | Đếm số chữ số k, sau đó bóc từng chữ số cộng dồn lũy thừa bậc k. |
| **Dãy Fibonacci** | F_n = F_{n-1} + F_{n-2} | Sử dụng 2 biến tạm `f0`, `f1` và cập nhật tịnh tiến liên tục. |

---

## 2. Cú pháp & Vận hành

### 2.1. Kỹ thuật Tái tạo Số đảo ngược và Kiểm tra Palindrome

```cpp
#include <iostream>

bool laSoPalindrome(long long n) {
    if (n < 0) return false; // Số âm không thể là số đối xứng
    if (n >= 0 && n < 10) return true; // Các số từ 0-9 luôn đối xứng

    long long goc = n;
    long long daoNguoc = 0;

    while (n > 0) {
        int chuSo = n % 10;
        daoNguoc = daoNguoc * 10 + chuSo; // Dịch trái hệ thập phân và cộng chữ số mới
        n /= 10;
    }

    return (goc == daoNguoc);
}

int main() {
    long long x = 12321;
    if (laSoPalindrome(x)) {
        std::cout << x << " la so Palindrome!\n";
    }
    return 0;
}
```

### 2.2. Kỹ thuật Tịnh tiến biến sinh dãy số Fibonacci O(N)
Nhiều người mới học dùng đệ quy để tính Fibonacci khiến chương trình chạy mất hàng phút cho N = 45. Sử dụng vòng lặp tịnh tiến 2 biến đạt tốc độ cực hạn chỉ tốn 0.00001 giây:

```cpp
#include <iostream>

void inDayFibonacci(int n) {
    if (n <= 0) return;
    if (n == 1) { std::cout << "0\n"; return; }

    long long f0 = 0;
    long long f1 = 1;

    std::cout << f0 << ' ' << f1 << ' ';

    for (int i = 3; i <= n; ++i) {
        long long fn = f0 + f1;
        std::cout << fn << ' ';
        // Tịnh tiến trạng thái cho bước lặp kế tiếp
        f0 = f1;
        f1 = fn;
    }
    std::cout << '\n';
}

int main() {
    inDayFibonacci(10); // In 10 số Fibonacci đầu tiên: 0 1 1 2 3 5 8 13 21 34
    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy thường gặp:**
> 1. **Quên lưu giá trị gốc `n` vào biến tạm trước khi vào vòng lặp:**
>    Sau vòng lặp `while (n > 0) { n /= 10; }`, biến `n` sẽ bằng `0`! Nếu không lưu `long long goc = n` từ trước, bạn sẽ không còn giá trị gốc để so sánh `goc == daoNguoc`.
> 2. **Tràn số khi tạo số đảo ngược:**
>    Một số `int` có thể hợp lệ, nhưng khi đảo ngược lại có thể vượt quá 2.14 	imes 10⁹. Luôn khai báo biến lưu số đảo ngược bằng kiểu `long long`.
> 3. **Tràn số trong dãy Fibonacci:**
>    Số Fibonacci tăng theo cấp số nhân (tỉ lệ vàng φ ≈ 1.618). Đến số F₄₇, giá trị vượt quá giới hạn của `int` 32-bit; đến số F₉₃, giá trị vượt quá giới hạn của `long long` 64-bit!

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Số nào sau đây **KHÔNG PHẢI** là một số Palindrome (đối xứng)?
* [ ] A) `1221`
* [ ] B) `9`
* [x] C) `-121` (Dấu âm đứng đầu khiến số đọc ngược lại là 121-, không đối xứng)
* [ ] D) `1331`

---

### Thử thách sửa lỗi (Debug)
Chương trình sau đây kiểm tra số Palindrome nhưng luôn báo kết quả `false` với mọi số. Hãy phát hiện lỗi:

```cpp
// Code lỗi:
#include <iostream>

int main() {
    int n = 121;
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    if (n == rev) { // LỖI TẠI ĐÂY!
        std::cout << "Doi xung";
    } else {
        std::cout << "Khong doi xung";
    }
    return 0;
}
```

**Sửa lại:** Vì `n` đã giảm về 0 sau vòng lặp, nên `n == rev` luôn so sánh `0 == rev`. Cần tạo biến `int goc = n;` trước vòng lặp và so sánh `goc == rev`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào một số nguyên dương `n` từ bàn phím (1 ≤ n ≤ 10¹⁸). Hãy kiểm tra xem `n` có phải là số Palindrome hay không:
* Nếu đúng, in ra: `Doi xung`
* Nếu sai, in ra: `Khong doi xung`

**Ví dụ:**
* Đầu vào: `123454321` ➔ Đầu ra: `Doi xung`
* Đầu vào: `123456` ➔ Đầu ra: `Khong doi xung`

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    long long n = 0;
    if (std::cin >> n) {
        if (n < 0) {
            std::cout << "Khong doi xung\n";
            return 0;
        }

        long long goc = n;
        long long daoNguoc = 0;

        while (n > 0) {
            daoNguoc = daoNguoc * 10 + (n % 10);
            n /= 10;
        }

        if (goc == daoNguoc) {
            std::cout << "Doi xung\n";
        } else {
            std::cout << "Khong doi xung\n";
        }
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Kỹ thuật bóc tách chữ số bằng `% 10` và `/ 10` là công cụ căn bản nhất để xử lý cấu trúc số nguyên.
* Luôn lưu bản sao của số gốc trước khi thực hiện thao tác chia giảm dần trong vòng lặp.
* Kỹ thuật tịnh tiến biến trạng thái giúp tính toán các dãy số quy nạp như Fibonacci đạt độ phức tạp O(N) mà không tốn bộ nhớ lưu trữ.

🎉 **Chúc mừng bạn đã hoàn thành trọn vẹn Module 3: Vòng lặp & Chuyên đề Số học!**
Trong **Module 4: Hàm (Functions) và Kỹ thuật Phân rã Bài toán**, chúng ta sẽ bước lên tầm cao mới của tư duy công nghệ: đóng gói các khối code thành các Hàm độc lập, làm chủ cơ chế truyền tham chiếu `&` và tối ưu hóa bộ nhớ chuyên nghiệp.
