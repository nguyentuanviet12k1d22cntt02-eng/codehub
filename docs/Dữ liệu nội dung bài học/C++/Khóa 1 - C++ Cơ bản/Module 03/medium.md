# Bộ bài tập Thực hành Tổng hợp Module 3: C++ Cơ bản
## Mức độ: TRUNG BÌNH (MEDIUM) - 10 Bài tập

> **Phạm vi kiến thức:** Vòng lặp `for`, `while`, `do-while`, điều hướng vòng lặp bằng `break` và `continue`, vòng lặp lồng nhau (`Nested Loops`), tối ưu số học căn bậc hai `O(sqrt(N))`, thuật toán Euclid.
> **Quy ước:** Tuyệt đối không dùng mảng (`array`, `vector`), không dùng hàm con tự định nghĩa hay đệ quy.

---

## Bài 11: Đếm và Liệt Kê Các Ước Số của Số Nguyên N
* **Mục tiêu:** Áp dụng vòng lặp duyệt qua các ước số và tích lũy số lượng.
* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 10^5).
  * Dòng 1: In ra số lượng ước số dương của N.
  * Dòng 2: In lần lượt các ước số của N theo thứ tự tăng dần, mỗi số cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^5).
* **Đầu ra (Output):** Gồm 2 dòng: dòng 1 là số lượng ước, dòng 2 là danh sách các ước số.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
12
```

**Khung Đầu ra (Output):**
```text
6
1 2 3 4 6 12
```

**Giải thích chi tiết:**
* Số 12 có 6 ước số gồm: 1, 2, 3, 4, 6, 12.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      int dem = 0;
      for (int i = 1; i <= n; ++i) {
          if (n % i == 0) dem++;
      }

      std::cout << dem << '\n';

      bool daIn = false;
      for (int i = 1; i <= n; ++i) {
          if (n % i == 0) {
              if (daIn) std::cout << " ";
              std::cout << i;
              daIn = true;
          }
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 12: Kiểm Tra Số Nguyên Tố (Tối ưu O(sqrt(N)))
* **Mục tiêu:** Nắm vững thuật toán kiểm tra số nguyên tố tối ưu chạy đến căn bậc hai của N bằng điều kiện `i * i <= n`.
* **Mô tả:** Nhập vào một số nguyên N (-10^9 <= N <= 10^9). Hãy kiểm tra xem N có phải là số nguyên tố hay không.
  * Số nguyên tố là số nguyên lớn hơn 1 và chỉ có đúng 2 ước dương là 1 và chính nó.
  * Nếu là số nguyên tố, in ra `YES`.
  * Nếu không phải, in ra `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).
* **Đầu ra (Output):** In ra `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
29
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* 29 > 1 và không chia hết cho bất kỳ số nào từ 2 đến căn bậc hai của 29 (khoảng 5.38), nên 29 là số nguyên tố.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      if (n < 2) {
          std::cout << "NO\n";
          return 0;
      }

      bool laNguyenTo = true;
      for (long long i = 2; i * i <= n; ++i) {
          if (n % i == 0) {
              laNguyenTo = false;
              break; // Dừng sớm ngay khi thấy ước
          }
      }

      std::cout << (laNguyenTo ? "YES" : "NO") << '\n';
      return 0;
  }
  ```

---

## Bài 13: Đảo Ngược Một Số Nguyên (Reverse Number)
* **Mục tiêu:** Áp dụng thuật toán xây dựng số đảo ngược theo công thức `dao = dao * 10 + chuSoCuoi` bằng vòng lặp `while`.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^18). Hãy in ra số nguyên đảo ngược của N (bỏ qua các chữ số 0 vô nghĩa ở đầu kết quả nếu có).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).
* **Đầu ra (Output):** Số đảo ngược của N (kiểu `long long`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1204500
```

**Khung Đầu ra (Output):**
```text
54021
```

**Giải thích chi tiết:**
* Số 1204500 đảo ngược lại là 0054021, biểu diễn thành số nguyên hợp lệ là 54021.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long daoNguoc = 0;
      while (n > 0) {
          long long chuSo = n % 10;
          daoNguoc = daoNguoc * 10 + chuSo;
          n /= 10;
      }

      std::cout << daoNguoc << '\n';
      return 0;
  }
  ```

---

## Bài 14: Kiểm Tra Số Đối Xứng (Palindrome Number)
* **Mục tiêu:** Kết hợp thuật toán đảo ngược số với phép so sánh bằng `==` để kiểm tra tính đối xứng.
* **Mô tả:** Một số nguyên dương được gọi là số đối xứng (Palindrome) nếu đọc từ trái sang phải hay từ phải sang trái đều thu được cùng một giá trị (ví dụ: 121, 1331, 7).
* Nhập vào số nguyên dương N (1 <= N <= 10^18). Hãy in ra `YES` nếu N là số đối xứng, ngược lại in `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).
* **Đầu ra (Output):** In ra `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1234321
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* 1234321 khi đảo ngược lại vẫn là 1234321 nên là số đối xứng.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long goc = n;
      long long daoNguoc = 0;

      while (n > 0) {
          daoNguoc = daoNguoc * 10 + (n % 10);
          n /= 10;
      }

      if (daoNguoc == goc) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
  ```

---

## Bài 15: Tìm Ước Chung Lớn Nhất (UCLN) bằng Thuật Toán Euclid
* **Mục tiêu:** Cài đặt thuật toán Euclid kinh điển bằng vòng lặp `while (b != 0)` với độ phức tạp logarit cực nhanh.
* **Mô tả:** Nhập vào hai số nguyên dương a và b (1 <= a, b <= 10^12). Hãy tìm và in ra ước chung lớn nhất UCLN(a, b).
* **Thuật toán Euclid:** Ở mỗi bước, thay `a = b` và `b = a % b` cho đến khi `b == 0` thì UCLN chính là `a`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương a và b cách nhau một khoảng trắng.
* **Đầu ra (Output):** Giá trị UCLN(a, b).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
48 18
```

**Khung Đầu ra (Output):**
```text
6
```

**Giải thích chi tiết:**
* 48 % 18 = 12
* 18 % 12 = 6
* 12 % 6 = 0 -> UCLN là 6.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      while (b != 0) {
          long long r = a % b;
          a = b;
          b = r;
      }

      std::cout << a << '\n';
      return 0;
  }
  ```

---

## Bài 16: Tìm Bội Chung Nhỏ Nhất (BCNN) của Hai Số Nguyên
* **Mục tiêu:** Áp dụng hệ quả `BCNN(a, b) = (a * b) / UCLN(a, b)` kết hợp thứ tự tính `(a / UCLN) * b` để triệt tiêu nguy cơ tràn số nguyên.
* **Mô tả:** Nhập vào hai số nguyên dương a và b (1 <= a, b <= 10^9). Hãy tìm và in ra bội chung nhỏ nhất BCNN(a, b).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương a và b.
* **Đầu ra (Output):** Giá trị BCNN(a, b) (kiểu `long long`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
12 18
```

**Khung Đầu ra (Output):**
```text
36
```

**Giải thích chi tiết:**
* UCLN(12, 18) = 6. BCNN(12, 18) = (12 * 18) / 6 = 36.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      long long x = a, y = b;
      while (y != 0) {
          long long r = x % y;
          x = y;
          y = r;
      }

      long long ucln = x;
      long long bcnn = (a / ucln) * b;

      std::cout << bcnn << '\n';
      return 0;
  }
  ```

---

## Bài 17: Tính Số Fibonacci Thứ N bằng Vòng Lặp
* **Mục tiêu:** Tính số Fibonacci bằng kỹ thuật trượt 3 biến với vòng lặp `for` có độ phức tạp không gian O(1) (không dùng mảng hay đệ quy).
* **Mô tả:** Dãy Fibonacci được định nghĩa:
  * `F(0) = 0`, `F(1) = 1`
  * `F(n) = F(n-1) + F(n-2)` với mọi n >= 2.
  Nhập vào số nguyên n (0 <= n <= 80). Hãy tính và in ra giá trị của `F(n)`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên n (0 <= n <= 80).
* **Đầu ra (Output):** Giá trị F(n) (kiểu `long long`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
10
```

**Khung Đầu ra (Output):**
```text
55
```

**Giải thích chi tiết:**
* Dãy số: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 -> F(10) = 55.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      if (n == 0) {
          std::cout << 0 << '\n';
          return 0;
      }
      if (n == 1) {
          std::cout << 1 << '\n';
          return 0;
      }

      long long f0 = 0, f1 = 1, fn = 0;
      for (int i = 2; i <= n; ++i) {
          fn = f0 + f1;
          f0 = f1;
          f1 = fn;
      }

      std::cout << fn << '\n';
      return 0;
  }
  ```

---

## Bài 18: Vẽ Tam Giác Vuông Cân Rỗng Dấu Sao (Nested Loops & if-else)
* **Mục tiêu:** Kết hợp vòng lặp lồng nhau với điều kiện biên tọa độ để in hình rỗng.
* **Mô tả:** Nhập vào chiều cao H (2 <= H <= 30). Hãy in ra một tam giác vuông cân rỗng kích thước H x H:
  * Cạnh góc vuông dọc (cột đầu tiên `j == 1`): in `*`
  * Cạnh góc vuông đáy (hàng cuối cùng `i == H`): in `*`
  * Cạnh huyền (đường chéo chính `j == i`): in `*`
  * Các vị trí bên trong: in dấu cách ` `
  * Mỗi ký tự trên một dòng cách nhau 1 dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Chiều cao H (2 <= H <= 30).
* **Đầu ra (Output):** Tam giác vuông cân rỗng theo đúng mẫu.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
```

**Khung Đầu ra (Output):**
```text
*
* *
*   *
*     *
* * * * *
```

**Giải thích chi tiết:**
* Hàng 1 có 1 sao; hàng 2 có 2 sao; hàng 3, 4 có sao ở 2 đầu và rỗng ở giữa; hàng 5 có 5 sao đặc.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int h = 0;
      std::cin >> h;

      for (int i = 1; i <= h; ++i) {
          for (int j = 1; j <= i; ++j) {
              if (j == 1 || j == i || i == h) {
                  std::cout << "*";
              } else {
                  std::cout << " ";
              }
              if (j < i) std::cout << " ";
          }
          std::cout << '\n';
      }

      return 0;
  }
  ```

---

## Bài 19: Tính Tổng Các Chữ Số của Một Số Nguyên Lớn
* **Mục tiêu:** Áp dụng vòng lặp `while` để cộng dồn từng chữ số của một số nguyên 64-bit.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^18). Hãy tính và in ra tổng các chữ số của N.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).
* **Đầu ra (Output):** Một số nguyên là tổng các chữ số của N.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
4587
```

**Khung Đầu ra (Output):**
```text
24
```

**Giải thích chi tiết:**
* 4 + 5 + 8 + 7 = 24.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long tong = 0;
      while (n > 0) {
          tong += (n % 10);
          n /= 10;
      }

      std::cout << tong << '\n';
      return 0;
  }
  ```

---

## Bài 20: Phân Tích Thừa Số Nguyên Tố (Prime Factorization)
* **Mục tiêu:** Vận dụng vòng lặp `while` lồng trong vòng lặp `for` để phân tích thừa số nguyên tố của một số.
* **Mô tả:** Nhập vào một số nguyên dương N (2 <= N <= 10^9). Hãy phân tích N thành tích các thừa số nguyên tố và in ra các thừa số theo thứ tự tăng dần, mỗi số cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (2 <= N <= 10^9).
* **Đầu ra (Output):** Dãy các thừa số nguyên tố tăng dần cách nhau một khoảng trắng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
60
```

**Khung Đầu ra (Output):**
```text
2 2 3 5
```

**Giải thích chi tiết:**
* 60 = 2 * 2 * 3 * 5.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      bool daIn = false;
      for (long long i = 2; i * i <= n; ++i) {
          while (n % i == 0) {
              if (daIn) std::cout << " ";
              std::cout << i;
              daIn = true;
              n /= i;
          }
      }

      if (n > 1) {
          if (daIn) std::cout << " ";
          std::cout << n;
      }
      std::cout << '\n';

      return 0;
  }
  ```
