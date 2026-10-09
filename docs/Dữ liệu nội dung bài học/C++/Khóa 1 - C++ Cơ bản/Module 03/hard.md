# Bộ bài tập Thực hành Tổng hợp Module 3: C++ Cơ bản
## Mức độ: KHÓ / THỬ THÁCH (HARD) - 10 Bài tập

> **Phạm vi kiến thức:** Vòng lặp `for`, `while`, `do-while`, điều hướng vòng lặp bằng `break` và `continue`, vòng lặp lồng nhau (`Nested Loops`), tối ưu số học căn bậc hai `O(sqrt(N))`, tư duy giải thuật không gian bộ nhớ O(1).
> **Quy ước:** Tuyệt đối không dùng mảng (`array`, `vector`), không dùng hàm con tự định nghĩa hay đệ quy.

---

## Bài 21: Kiểm Tra Số Hoàn Hảo (Perfect Number)
* **Mục tiêu:** Áp dụng thuật toán duyệt ước tối ưu `O(sqrt(N))` bằng cách cộng cặp ước `(i, n / i)` để kiểm tra số hoàn hảo với N lớn đến 10^12.
* **Mô tả:** Số hoàn hảo (Perfect Number) là số nguyên dương có tổng tất cả các ước số thực sự (các ước nhỏ hơn chính nó) bằng chính nó.
  * Ví dụ: 6 có các ước thực sự là 1, 2, 3 và 1 + 2 + 3 = 6.
  * 28 có các ước thực sự là 1, 2, 4, 7, 14 và 1 + 2 + 4 + 7 + 14 = 28.
  Nhập vào số nguyên dương N (1 <= N <= 10^12). Hãy kiểm tra xem N có phải là số hoàn hảo hay không. In `YES` nếu đúng, ngược lại in `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^12).
* **Đầu ra (Output):** In ra `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
28
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* Tổng ước nhỏ hơn 28: 1 + 2 + 4 + 7 + 14 = 28 -> Là số hoàn hảo.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      if (n <= 1) {
          std::cout << "NO\n";
          return 0;
      }

      long long tongUoc = 1; // 1 luôn là ước của mọi số > 1
      for (long long i = 2; i * i <= n; ++i) {
          if (n % i == 0) {
              tongUoc += i;
              if (i * i != n) {
                  tongUoc += (n / i);
              }
          }
      }

      if (tongUoc == n) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
  ```

---

## Bài 22: Tìm Chữ Số Lớn Nhất và Nhỏ Nhất của Một Số Nguyên
* **Mục tiêu:** Áp dụng vòng lặp `while` bóc tách từng chữ số và cập nhật cực trị Min/Max đồng thời.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^18). Hãy tìm chữ số nhỏ nhất (Min Digit) và chữ số lớn nhất (Max Digit) xuất hiện trong số N. In ra hai chữ số đó cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).
* **Đầu ra (Output):** Hai số nguyên tương ứng là chữ số nhỏ nhất và chữ số lớn nhất.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
583912
```

**Khung Đầu ra (Output):**
```text
1 9
```

**Giải thích chi tiết:**
* Các chữ số của 583912 là {5, 8, 3, 9, 1, 2}. Nhỏ nhất là 1, lớn nhất là 9.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      int minD = 9;
      int maxD = 0;

      while (n > 0) {
          int d = n % 10;
          if (d < minD) minD = d;
          if (d > maxD) maxD = d;
          n /= 10;
      }

      std::cout << minD << " " << maxD << '\n';
      return 0;
  }
  ```

---

## Bài 23: Vẽ Hình Thoi (Diamond Pattern) Dấu Sao Đối Xứng
* **Mục tiêu:** Tư duy không gian tọa độ 2D đối xứng để tính số lượng dấu cách và dấu sao của từng hàng.
* **Mô tả:** Nhập vào số nguyên N (1 <= N <= 25). Hãy vẽ một hình thoi bằng ký tự `*` có `2*N - 1` hàng:
  * Phần nửa trên gồm N hàng (từ 1 sao tăng dần đến `2*N - 1` sao).
  * Phần nửa dưới gồm N - 1 hàng giảm dần đối xứng.
  * Các dấu sao in liền nhau, các dấu cách phía trước căn giữa hình thoi.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (1 <= N <= 25).
* **Đầu ra (Output):** Hình thoi gồm `2*N - 1` dòng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3
```

**Khung Đầu ra (Output):**
```text
  *
 ***
*****
 ***
  *
```

**Giải thích chi tiết:**
* N = 3: Tổng cộng 5 hàng. Hàng 1 có 2 space 1 sao; hàng 2 có 1 space 3 sao; hàng 3 có 0 space 5 sao; hàng 4 có 1 space 3 sao; hàng 5 có 2 space 1 sao.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      // Nửa trên (từ hàng 1 đến hàng n)
      for (int i = 1; i <= n; ++i) {
          for (int sp = 1; sp <= n - i; ++sp) std::cout << " ";
          for (int st = 1; st <= 2 * i - 1; ++st) std::cout << "*";
          std::cout << '\n';
      }

      // Nửa dưới (từ hàng n-1 về 1)
      for (int i = n - 1; i >= 1; --i) {
          for (int sp = 1; sp <= n - i; ++sp) std::cout << " ";
          for (int st = 1; st <= 2 * i - 1; ++st) std::cout << "*";
          std::cout << '\n';
      }

      return 0;
  }
  ```

---

## Bài 24: Đếm Số Lượng Chữ Số 0 Tận Cùng của N! (Công thức Legendre)
* **Mục tiêu:** Vận dụng công thức Legendre tính số bội của 5 trong tích `1..N` bằng vòng lặp `while (n > 0)` với độ phức tạp `O(log5(N))`.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^9). Hãy tính xem giai thừa `N!` có bao nhiêu chữ số 0 liên tiếp ở tận cùng mà không được tính trực tiếp giá trị của N! (vì N! sẽ tràn số ngay từ N = 21).
* **Công thức Legendre:** Số chữ số 0 tận cùng bằng tổng số thừa số 5 trong phân tích: `Count = N/5 + N/25 + N/125 + ...`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^9).
* **Đầu ra (Output):** Số lượng chữ số 0 tận cùng của N!.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
100
```

**Khung Đầu ra (Output):**
```text
24
```

**Giải thích chi tiết:**
* 100 / 5 = 20
* 100 / 25 = 4
* 100 / 125 = 0
* Tổng số chữ số 0 tận cùng của 100! là 20 + 4 = 24.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long count = 0;
      while (n >= 5) {
          count += (n / 5);
          n /= 5;
      }

      std::cout << count << '\n';
      return 0;
  }
  ```

---

## Bài 25: Chuyển Đổi Số Thập Phân sang Nhị Phân
* **Mục tiêu:** Chuyển đổi cơ số thập phân sang nhị phân mà không dùng mảng bằng cách sử dụng lũy thừa trọng số `weight *= 10` hoặc chuỗi ký tự.
* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 10^9). Hãy in ra biểu diễn hệ nhị phân (gồm các bit 0 và 1) của N.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^9).
* **Đầu ra (Output):** Chuỗi các bit nhị phân đại diện cho N.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
19
```

**Khung Đầu ra (Output):**
```text
10011
```

**Giải thích chi tiết:**
* 19 = 16 + 2 + 1 = 2^4 + 2^1 + 2^0 -> Hệ nhị phân là 10011.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <string>

  int main() {
      long long n = 0;
      std::cin >> n;

      std::string nhiPhan = "";
      while (n > 0) {
          nhiPhan = (n % 2 == 1 ? "1" : "0") + nhiPhan;
          n /= 2;
      }

      std::cout << nhiPhan << '\n';
      return 0;
  }
  ```

---

## Bài 26: Tìm Số Nguyên Tố Thứ K
* **Mục tiêu:** Kết hợp vòng lặp kiểm tra số nguyên tố lồng bên trong vòng lặp đếm để tìm số nguyên tố thứ K.
* **Mô tả:** Nhập vào số nguyên dương K (1 <= K <= 1000). Hãy tìm và in ra số nguyên tố thứ K trong dãy số nguyên tố tăng dần:
  * Số thứ 1 là 2
  * Số thứ 2 là 3
  * Số thứ 3 là 5
  * Số thứ 4 là 7
  * Số thứ 5 là 11...

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương K (1 <= K <= 1000).
* **Đầu ra (Output):** Giá trị số nguyên tố thứ K.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
10
```

**Khung Đầu ra (Output):**
```text
29
```

**Giải thích chi tiết:**
* 10 số nguyên tố đầu tiên: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Số thứ 10 là 29.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int k = 0;
      std::cin >> k;

      int dem = 0;
      long long num = 2;

      while (true) {
          bool laNT = true;
          for (long long i = 2; i * i <= num; ++i) {
              if (num % i == 0) {
                  laNT = false;
                  break;
              }
          }

          if (laNT) {
              dem++;
              if (dem == k) {
                  std::cout << num << '\n';
                  break;
              }
          }
          num++;
      }

      return 0;
  }
  ```

---

## Bài 27: Bài Toán Bánh Xe Collatz (Giả thuyết 3n + 1)
* **Mục tiêu:** Cài đặt thuật toán mô phỏng quá trình lặp theo trạng thái và theo dõi giá trị cực đại đạt được.
* **Mô tả:** Với số nguyên dương n ban đầu:
  * Nếu n là số chẵn: `n = n / 2`
  * Nếu n là số lẻ: `n = 3 * n + 1`
  Quá trình này lặp lại cho đến khi n đạt giá trị 1.
  Nhập vào số nguyên n (1 <= n <= 10^6). Hãy in ra:
  * Dòng 1: Số bước biến đổi để n trở về 1 (n = 1 ban đầu thì số bước là 0).
  * Dòng 2: Giá trị lớn nhất mà n từng đạt được trong suốt quá trình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^6).
* **Đầu ra (Output):** Hai dòng: dòng 1 là số bước, dòng 2 là giá trị cực đại.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
```

**Khung Đầu ra (Output):**
```text
8
16
```

**Giải thích chi tiết:**
* Dãy biến đổi: 6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1.
* Tổng cộng có 8 bước biến đổi và giá trị lớn nhất đạt được là 16.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long buoc = 0;
      long long maxVal = n;

      while (n > 1) {
          if (n % 2 == 0) {
              n /= 2;
          } else {
              n = 3 * n + 1;
          }
          if (n > maxVal) maxVal = n;
          buoc++;
      }

      std::cout << buoc << '\n';
      std::cout << maxVal << '\n';
      return 0;
  }
  ```

---

## Bài 28: Vẽ Tam Giác Pascal Kích Thước N Hàng (Không dùng Mảng 2D)
* **Mục tiêu:** Vận dụng công thức truy hồi tổ hợp `C(n, k) = C(n, k - 1) * (n - k + 1) / k` để in tam giác Pascal trực tiếp với bộ nhớ O(1).
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 20). Hãy in ra tam giác Pascal gồm N hàng:
  * Hàng thứ i (tính từ 0 đến N-1) có `i + 1` phần tử, các phần tử cách nhau bởi dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (1 <= N <= 20).
* **Đầu ra (Output):** N hàng của tam giác Pascal.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
```

**Khung Đầu ra (Output):**
```text
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1
```

**Giải thích chi tiết:**
* Tam giác Pascal 5 hàng tính từ hàng 0 đến hàng 4.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      for (int i = 0; i < n; ++i) {
          long long c = 1;
          for (int j = 0; j <= i; ++j) {
              std::cout << c << (j == i ? "" : " ");
              c = c * (i - j) / (j + 1);
          }
          std::cout << '\n';
      }

      return 0;
  }
  ```

---

## Bài 29: Tìm Cặp Ước Số (a, b) có a * b = N và Tổng (a + b) Nhỏ Nhất
* **Mục tiêu:** Duyệt lùi từ căn bậc hai của N (`floor(sqrt(N))`) về 1 để tìm ngay cặp thừa số gần nhau nhất chỉ trong O(sqrt(N)).
* **Mô tả:** Cho số nguyên dương N (1 <= N <= 10^12). Hãy tìm hai số nguyên dương a và b sao cho:
  * `a <= b`
  * `a * b = N`
  * Tổng `a + b` là nhỏ nhất có thể.
  In ra hai số a và b cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^12).
* **Đầu ra (Output):** Hai số nguyên a và b cách nhau một khoảng trắng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
36
```

**Khung Đầu ra (Output):**
```text
6 6
```

**Giải thích chi tiết:**
* Các cặp ước của 36: (1, 36) tổng 37; (2, 18) tổng 20; (3, 12) tổng 15; (4, 9) tổng 13; (6, 6) tổng 12. Cặp (6, 6) có tổng nhỏ nhất.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <cmath>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long canN = static_cast<long long>(std::sqrt(n));

      // Duyệt lùi từ canN về 1, số đầu tiên chia hết chắc chắn cho tổng nhỏ nhất
      for (long long a = canN; a >= 1; --a) {
          if (n % a == 0) {
              long long b = n / a;
              std::cout << a << " " << b << '\n';
              break;
          }
      }

      return 0;
  }
  ```

---

## Bài 30: Đếm Số Lượng Số May Mắn Chứa Toàn 6 và 8 trong Khoảng [1, N]
* **Mục tiêu:** Áp dụng vòng lặp kiểm tra từng chữ số của mỗi số nguyên trong khoảng `[1, N]`.
* **Mô tả:** Một số nguyên dương được gọi là "Số may mắn" nếu trong biểu diễn thập phân của nó **chỉ chứa** các chữ số `6` hoặc `8` (ví dụ: 6, 8, 66, 68, 86, 88, 668, ...).
  Nhập vào số nguyên dương N (1 <= N <= 10^5). Hãy đếm xem có bao nhiêu số may mắn trong đoạn từ 1 đến N.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^5).
* **Đầu ra (Output):** Số lượng số may mắn trong đoạn [1, N].

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
100
```

**Khung Đầu ra (Output):**
```text
6
```

**Giải thích chi tiết:**
* Các số may mắn <= 100 là: 6, 8, 66, 68, 86, 88 (tổng cộng 6 số).

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      int dem = 0;
      for (int i = 1; i <= n; ++i) {
          int x = i;
          bool laMayMan = true;
          while (x > 0) {
              int d = x % 10;
              if (d != 6 && d != 8) {
                  laMayMan = false;
                  break;
              }
              x /= 10;
          }
          if (laMayMan) dem++;
      }

      std::cout << dem << '\n';
      return 0;
  }
  ```
