---
lessonId: "CPP-03.04"
title: "Chuyên đề Số học 1: Số nguyên tố O(√N) và Thuật toán Euclid (GCD/LCM)"
difficulty: "MEDIUM"
estimatedDuration: 30
keywords: ["prime", "square root", "euclidean", "gcd", "lcm", "number theory", "optimization"]
prerequisites: ["CPP-03.03"]
---

## 1. Khái niệm & Vấn đề

Trong mọi cuộc thi lập trình thuật toán và các hệ thống bảo mật mật mã học hiện đại (như mã hóa RSA bảo vệ giao dịch ngân hàng), **Số học (Number Theory)** là trái tim của hệ thống. Hai bài toán nền tảng nhất mà bất kỳ lập trình viên nào cũng phải làm chủ là:
1. **Kiểm tra Số nguyên tố (Prime Number):** Số tự nhiên lớn hơn 1 chỉ có đúng 2 ước là 1 và chính nó.
2. **Ước chung lớn nhất (GCD) và Bội chung nhỏ nhất (LCM):** Tìm ước số chung cực đại của 2 số nguyên.

Nếu kiểm tra số nguyên tố bằng cách duyệt ngây thơ từ 2 đến N - 1, với N = 10⁹, máy tính sẽ mất 10 giây và bị loại vì quá thời gian (Time Limit Exceeded)! Chúng ta sẽ học cách tối ưu thuật toán xuống **O(√N)** (chỉ tốn 30,000 phép tính, chạy trong 0.001 giây) và áp dụng **Thuật toán Euclid** siêu tốc tìm GCD.

| Thuật toán / Khái niệm | Ý tưởng cốt lõi | Độ phức tạp thời gian | Tốc độ thực tế với N = 10⁹ |
| :--- | :--- | :---: | :--- |
| **Kiểm tra nguyên tố ngây thơ** | Duyệt từ 2 đến N - 1. | O(N) | ~10 giây (Quá chậm - TLE). |
| **Kiểm tra nguyên tố tối ưu** | Chỉ duyệt đến √N (i 	imes i ≤ N). | **O(√N)** | **~0.001 giây (Chớp mắt)!** |
| **Thuật toán Euclid (GCD)** | Thay thế phép trừ liên tiếp bằng phép chia lấy dư `%`. | O(\log(\min(a, b))) | Chạy dưới 30 bước lặp cho số 10¹⁸. |

---

## 2. Cú pháp & Vận hành

### 2.1. Bản chất Toán học: Vì sao chỉ cần kiểm tra đến √N?
Nếu số nguyên N có một ước số d > √N, thì bắt buộc nó phải có một ước số cặp tương ứng là d' = N / d thỏa mãn d' < √N. 

Do đó, nếu trong toàn bộ đoạn từ 2 đến √N mà không tìm thấy bất kỳ ước số nào, ta có thể **khẳng định 100% rằng N là số nguyên tố**!

```cpp
#include <iostream>

bool laSoNguyenTo(long long n) {
    if (n < 2) return false; // Số nhỏ hơn 2 không phải nguyên tố
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;

    // Chỉ cần duyệt i * i <= n (tương đương i <= sqrt(n))
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    return true;
}

int main() {
    long long n = 1000000007; // Số nguyên tố 10 chữ số kinh điển
    if (laSoNguyenTo(n)) {
        std::cout << n << " la so nguyen to!\n";
    }
    return 0;
}
```

### 2.2. Thuật toán Euclid tìm Ước chung lớn nhất (GCD)
Nguyên lý Euclid: GCD(a, b) = GCD(b, a ±od b) cho đến khi số dư bằng 0.

```cpp
long long timGCD(long long a, long long b) {
    while (b != 0) {
        long long du = a % b;
        a = b;
        b = du;
    }
    return a; // Khi b == 0, a chính là GCD
}
```

### 2.3. Công thức tính Bội chung nhỏ nhất (LCM) chống tràn số
LCM(a, b) = rac{a 	imes b}{GCD(a, b)} = rac{a}{GCD(a, b)} 	imes b
**Quy tắc chống tràn số:** Luôn chia trước khi nhân! Lấy `(a / timGCD(a, b)) * b` để không bao giờ bị tràn số nguyên.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy toán học cực kỳ nguy hiểm:**
> 1. **Dùng hàm `sqrt(n)` trong điều kiện vòng lặp `for (int i = 2; i <= sqrt(n); ++i)`:**
>    * Hàm `sqrt()` là hàm tính toán số thực trên CPU, tốc độ chậm hơn phép nhân số nguyên rất nhiều.
>    * *Cách tối ưu chuẩn mực:* Viết `for (long long i = 2; i * i <= n; ++i)`.
> 2. **Quên kiểu dữ liệu `long long` khi viết `i * i`:**
>    Khi i ≈ 50,000, biểu thức `i * i` là 2.5 	imes 10⁹ vượt quá giới hạn cực đại của `int` 32-bit làm biến bị tràn thành số âm và vòng lặp bị chạy vô tận! Khai báo biến `i` kiểu `long long`.
> 3. **Nhầm lẫn số 0 và số 1 là số nguyên tố:**
>    Số nguyên tố nhỏ nhất là số **2** (và cũng là số nguyên tố chẵn duy nhất).

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Số lượng phép lặp tối đa mà thuật toán kiểm tra số nguyên tố O(√N) phải thực hiện đối với số N = 1,000,000 (1 triệu) là bao nhiêu?
* [ ] A) 1,000,000 phép lặp
* [x] B) 1,000 phép lặp (√1,000,000 = 1,000)
* [ ] C) 500,000 phép lặp
* [ ] D) 2 phép lặp

---

### Thử thách sửa lỗi (Debug)
Hàm tính Bội chung nhỏ nhất sau đây bị lỗi sai kết quả số âm khi nhập 2 số lớn `a = 1000000`, `b = 2000000`. Hãy tìm lỗi:

```cpp
// Code lỗi:
int timGCD(int a, int b) {
    while (b != 0) {
        int r = a % b; a = b; b = r;
    }
    return a;
}

long long timLCM(int a, int b) {
    return (a * b) / timGCD(a, b); // LỖI TẠI ĐÂY!
}
```

**Sửa lại:** Phép nhân `a * b` bị tràn số kiểu `int` trước khi chia. Sửa thành:
`return (1LL * a / timGCD(a, b)) * b;`

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào 2 số nguyên dương `a` và `b` từ bàn phím (1 ≤ a, b ≤ 10⁹). Hãy tính và in ra trên 2 dòng:
* Dòng 1: `GCD: <ket_qua>`
* Dòng 2: `LCM: <ket_qua>`

**Ví dụ:**
* Đầu vào: `12 18`
* Đầu ra:
  ```text
  GCD: 6
  LCM: 36
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

long long gcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

long long lcm(long long a, long long b) {
    if (a == 0 || b == 0) return 0;
    return (a / gcd(a, b)) * b;
}

int main() {
    long long a = 0, b = 0;
    if (std::cin >> a >> b) {
        std::cout << "GCD: " << gcd(a, b) << '\n';
        std::cout << "LCM: " << lcm(a, b) << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Thuật toán kiểm tra nguyên tố với điều kiện i 	imes i ≤ n giảm độ phức tạp từ O(N) xuống O(√N), tăng tốc chương trình gấp hàng chục ngàn lần.
* Thuật toán Euclid là chuẩn mực vàng để tìm ước chung lớn nhất (GCD).
* Khi tính LCM, luôn thực hiện phép chia trước phép nhân: `(a / gcd(a, b)) * b` để triệt tiêu nguy cơ tràn số.

Trong bài học tiếp theo **[Bài 3.5: Chuyên đề Số học 2: Kỹ thuật Tách chữ số, Số Palindrome, Số Armstrong và Dãy Fibonacci]**, chúng ta sẽ hoàn thiện Module 3 với các bài toán số học kinh điển về tính đối xứng và dãy số.
