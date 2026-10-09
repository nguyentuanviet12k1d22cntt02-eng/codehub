# Bộ bài tập Thực hành Tổng hợp Module 3: C++ Cơ bản
## Mức độ: DỄ (EASY) - 10 Bài tập

> **Phạm vi kiến thức:** Vòng lặp `for` (xuôi, ngược, bước nhảy), vòng lặp `while` (lặp theo điều kiện), vòng lặp `do-while`, điều hướng vòng lặp bằng `break` và `continue`, vòng lặp lồng nhau (`Nested Loops`) vẽ lưới ký tự 2D đơn giản.
> **Quy ước:** Tuyệt đối không dùng mảng (`array`, `vector`), không dùng hàm con tự định nghĩa hay đệ quy.

---

## Bài 1: In Dãy Số Tự Nhiên từ 1 đến N
* **Mục tiêu:** Sử dụng vòng lặp `for` cơ bản với bước tăng biến đếm `++i` để duyệt qua dãy số nguyên.
* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 1000). Hãy in ra các số tự nhiên từ 1 đến N trên cùng một dòng, mỗi số cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 1000).
* **Đầu ra (Output):** Dãy số từ 1 đến N cách nhau bởi dấu cách, kết thúc bằng ký tự xuống dòng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
```

**Khung Đầu ra (Output):**
```text
1 2 3 4 5 6
```

**Giải thích chi tiết:**
* Vòng lặp `for (int i = 1; i <= 6; ++i)` in lần lượt: 1, 2, 3, 4, 5, 6.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      for (int i = 1; i <= n; ++i) {
          std::cout << i << (i == n ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 2: In Dãy Số Giảm Dần từ N về 1
* **Mục tiêu:** Làm chủ vòng lặp `for` đếm lùi với bước giảm biến đếm `--i`.
* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 1000). Hãy in ra dãy số giảm dần từ N về 1, mỗi số cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 1000).
* **Đầu ra (Output):** Dãy số từ N giảm dần về 1 cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
```

**Khung Đầu ra (Output):**
```text
5 4 3 2 1
```

**Giải thích chi tiết:**
* Vòng lặp bắt đầu từ `i = 5`, giảm dần mỗi bước 1 đơn vị cho đến khi `i = 1`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      for (int i = n; i >= 1; --i) {
          std::cout << i << (i == 1 ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 3: Tính Tổng Dãy Số từ 1 đến N bằng Vòng Lặp
* **Mục tiêu:** Áp dụng biến tích lũy (accumulator) kiểu `long long` trong vòng lặp để tránh tràn số nguyên.
* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 10^6). Sử dụng vòng lặp `for` để tính tổng: `S = 1 + 2 + 3 + ... + N`. In kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^6).
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng S.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
100
```

**Khung Đầu ra (Output):**
```text
5050
```

**Giải thích chi tiết:**
* Tổng từ 1 đến 100 là 5050.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long tong = 0;
      for (long long i = 1; i <= n; ++i) {
          tong += i;
      }

      std::cout << tong << '\n';
      return 0;
  }
  ```

---

## Bài 4: In Bảng Cửu Chương của Số N
* **Mục tiêu:** In bảng cửu chương theo định dạng chuẩn hóa bằng vòng lặp từ 1 đến 10.
* **Mô tả:** Nhập vào một số nguyên N (1 <= N <= 9). Hãy in ra bảng nhân của số N từ 1 đến 10 theo định dạng: `N x i = Result` (mỗi phép nhân trên 1 dòng riêng biệt).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (1 <= N <= 9).
* **Đầu ra (Output):** 10 dòng thể hiện bảng nhân từ 1 đến 10.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
7
```

**Khung Đầu ra (Output):**
```text
7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63
7 x 10 = 70
```

**Giải thích chi tiết:**
* Lần lượt nhân 7 với các số từ 1 đến 10 và in ra đúng mẫu.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      for (int i = 1; i <= 10; ++i) {
          std::cout << n << " x " << i << " = " << n * i << '\n';
      }

      return 0;
  }
  ```

---

## Bài 5: Đếm Số Chữ Số của Một Số Nguyên (while)
* **Mục tiêu:** Áp dụng vòng lặp `while` để bóc tách liên tục các chữ số bằng phép chia nguyên `/= 10`.
* **Mô tả:** Nhập vào một số nguyên không âm N (0 <= N <= 10^18). Hãy đếm và in ra số lượng chữ số của N.
* Chú ý trường hợp biên đặc biệt: Khi N = 0 thì số chữ số là 1.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên không âm N (0 <= N <= 10^18).
* **Đầu ra (Output):** Một số nguyên là số lượng chữ số của N.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
987654321
```

**Khung Đầu ra (Output):**
```text
9
```

**Giải thích chi tiết:**
* Số 987654321 có 9 chữ số.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      if (n == 0) {
          std::cout << 1 << '\n';
          return 0;
      }

      int dem = 0;
      while (n > 0) {
          dem++;
          n /= 10;
      }

      std::cout << dem << '\n';
      return 0;
  }
  ```

---

## Bài 6: Tính Giai Thừa N!
* **Mục tiêu:** Áp dụng biến nhân tích lũy với vòng lặp `for` để tính giai thừa.
* **Mô tả:** Nhập vào số nguyên N (0 <= N <= 20). Hãy tính và in ra giá trị của `N!` (giai thừa của N).
* Quy ước: `0! = 1`, `N! = 1 * 2 * 3 * ... * N`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (0 <= N <= 20).
* **Đầu ra (Output):** Giá trị của N! (kiểu `long long`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
```

**Khung Đầu ra (Output):**
```text
120
```

**Giải thích chi tiết:**
* 5! = 1 * 2 * 3 * 4 * 5 = 120.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      long long giaiThua = 1;
      for (int i = 1; i <= n; ++i) {
          giaiThua *= i;
      }

      std::cout << giaiThua << '\n';
      return 0;
  }
  ```

---

## Bài 7: In Các Số Chẵn Không Vượt Quá N (continue)
* **Mục tiêu:** Luyện tập sử dụng từ khóa `continue` để bỏ qua các bước lặp không thỏa mãn điều kiện.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1000). Duyệt qua các số từ 1 đến N. Nếu gặp số lẻ, hãy dùng lệnh `continue` để bỏ qua; chỉ in ra các số chẵn trên cùng một dòng, cách nhau một dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 1000).
* **Đầu ra (Output):** Các số chẵn từ 1 đến N cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
10
```

**Khung Đầu ra (Output):**
```text
2 4 6 8 10
```

**Giải thích chi tiết:**
* Duyệt từ 1 đến 10, các số lẻ 1, 3, 5, 7, 9 bị bỏ qua, các số chẵn 2, 4, 6, 8, 10 được in ra.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      bool daInDauTien = false;
      for (int i = 1; i <= n; ++i) {
          if (i % 2 != 0) {
              continue; // Bỏ qua số lẻ
          }
          if (daInDauTien) std::cout << " ";
          std::cout << i;
          daInDauTien = true;
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 8: Tìm Số Đầu Tiên Chia Hết Cho 7 Lớn Hơn N (break)
* **Mục tiêu:** Luyện tập sử dụng từ khóa `break` để ngắt sớm vòng lặp ngay khi tìm được kết quả mong muốn.
* **Mô tả:** Nhập vào số nguyên N. Hãy tìm số nguyên đầu tiên lớn hơn N mà chia hết cho 7. Ngay khi tìm thấy, in số đó ra màn hình và dùng câu lệnh `break` để kết thúc vòng lặp.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).
* **Đầu ra (Output):** Số nguyên đầu tiên > N chia hết cho 7.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
22
```

**Khung Đầu ra (Output):**
```text
28
```

**Giải thích chi tiết:**
* Bắt đầu kiểm tra từ 23, 24, 25, 26, 27, 28. Số 28 chia hết cho 7 (28 % 7 == 0) nên in 28 và dừng.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      for (long long i = n + 1; ; ++i) {
          if (i % 7 == 0) {
              std::cout << i << '\n';
              break; // Dừng ngay vòng lặp
          }
      }

      return 0;
  }
  ```

---

## Bài 9: Vẽ Hình Chữ Nhật Đặc Dấu Sao Kích Thước H x W (Nested Loops)
* **Mục tiêu:** Nắm vững tư duy không gian 2D với vòng lặp ngoài quản lý số hàng H và vòng lặp trong quản lý số cột W.
* **Mô tả:** Nhập vào chiều cao H (số hàng) và chiều rộng W (số cột) của hình chữ nhật (1 <= H, W <= 50). Hãy in ra hình chữ nhật đặc bằng ký tự `*`, mỗi ký tự cách nhau 1 khoảng trắng. Hết mỗi hàng phải xuống dòng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên H và W cách nhau bởi dấu cách.
* **Đầu ra (Output):** H hàng, mỗi hàng gồm W ký tự `*` cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 4
```

**Khung Đầu ra (Output):**
```text
* * * *
* * * *
* * * *
```

**Giải thích chi tiết:**
* Hình chữ nhật có 3 hàng, mỗi hàng có 4 dấu sao.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int h = 0, w = 0;
      std::cin >> h >> w;

      for (int i = 1; i <= h; ++i) {
          for (int j = 1; j <= w; ++j) {
              std::cout << "*" << (j == w ? "" : " ");
          }
          std::cout << '\n';
      }

      return 0;
  }
  ```

---

## Bài 10: Nhập và Tính Tổng Cho Đến Khi Gặp Số 0
* **Mục tiêu:** Áp dụng vòng lặp `while` hoặc `do-while` để nhận luồng dữ liệu liên tục cho đến khi gặp tín hiệu dừng (Sentinel Value).
* **Mô tả:** Chương trình đọc liên tục các số nguyên từ bàn phím. Khi gặp số 0 thì quá trình nhập kết thúc. Hãy in ra tổng của tất cả các số đã nhập (không tính số 0).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Chuỗi các số nguyên kết thúc bằng số 0.
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng các số đã nhập.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5 12 -3 8 0
```

**Khung Đầu ra (Output):**
```text
22
```

**Giải thích chi tiết:**
* Tổng = 5 + 12 + (-3) + 8 = 22. Khi gặp số 0 thì dừng lại.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long x = 0;
      long long tong = 0;

      while (std::cin >> x && x != 0) {
          tong += x;
      }

      std::cout << tong << '\n';
      return 0;
  }
  ```
