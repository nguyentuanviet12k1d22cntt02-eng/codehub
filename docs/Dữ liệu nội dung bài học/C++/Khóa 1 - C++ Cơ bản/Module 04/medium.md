# Bộ bài tập Thực hành Tổng hợp Module 4: C++ Cơ bản
## Mức độ: TRUNG BÌNH (MEDIUM) - 10 Bài tập

> **Phạm vi kiến thức:** Kỹ thuật phân rã bài toán thành các hàm con chuyên trách, đệ quy số học, đệ quy chia để trị, thuật toán Euclid đệ quy, nạp chồng hàm trong hình học và toán học, truyền tham chiếu giải hệ phương trình.
> **Quy ước:** Tuyệt đối không dùng mảng (array, vector), không dùng con trỏ hay cấp phát động.

---

## Bài 11: Tìm Ước Chung Lớn Nhất (UCLN) Bằng Đệ Quy Euclid
* **Mục tiêu:** Cài đặt thuật toán Euclid kinh điển bằng tư duy đệ quy gọn gàng.
* **Mô tả:** Viết hàm đệ quy `long long ucln(long long a, long long b)`:
  * Nếu b == 0, trả về a.
  * Ngược lại, trả về ucln(b, a % b).
  * Viết hàm `long long bcnn(long long a, long long b)` tính bội chung nhỏ nhất dựa trên hàm ucln: (a / ucln(a, b)) * b.
  * Trong `main()`, nhập hai số nguyên dương a và b (1 <= a, b <= 10^12). In ra UCLN và BCNN cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương a và b cách nhau một khoảng trắng.
* **Đầu ra (Output):** Hai số nguyên tương ứng là UCLN và BCNN.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
24 36
```

**Khung Đầu ra (Output):**
```text
12 72
```

**Giải thích chi tiết:**
* UCLN(24, 36) = 12. BCNN(24, 36) = (24 / 12) * 36 = 72.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long ucln(long long a, long long b) {
      if (b == 0) return a;
      return ucln(b, a % b);
  }

  long long bcnn(long long a, long long b) {
      return (a / ucln(a, b)) * b;
  }

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      std::cout << ucln(a, b) << " " << bcnn(a, b) << '\n';
      return 0;
  }
  ```

---

## Bài 12: Đệ Quy Fibonacci và Đếm Số Lời Gọi Hàm Kích Hoạt
* **Mục tiêu:** Trực quan hóa cây đệ quy và đo lường chi phí gọi hàm bằng tham chiếu đếm.
* **Mô tả:** Viết hàm đệ quy `long long fibo(int n, int &soLoiGoi)` tính số Fibonacci:
  * Mỗi khi hàm được gọi, tăng `soLoiGoi` lên 1 đơn vị.
  * Nếu n == 0, trả về 0.
  * Nếu n == 1, trả về 1.
  * Ngược lại, trả về fibo(n - 1, soLoiGoi) + fibo(n - 2, soLoiGoi).
  * Trong `main()`, nhập số nguyên n (0 <= n <= 25). In ra giá trị F(n) và tổng số lời gọi hàm đã kích hoạt, cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên n (0 <= n <= 25).
* **Đầu ra (Output):** Hai số nguyên: giá trị F(n) và số lời gọi hàm.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
```

**Khung Đầu ra (Output):**
```text
5 15
```

**Giải thích chi tiết:**
* F(5) = 5. Để tính F(5) theo đệ quy thuần túy, hàm fibo được gọi tổng cộng 15 lần (cây đệ quy nhị phân).

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long fibo(int n, int &soLoiGoi) {
      soLoiGoi++;
      if (n == 0) return 0;
      if (n == 1) return 1;
      return fibo(n - 1, soLoiGoi) + fibo(n - 2, soLoiGoi);
  }

  int main() {
      int n = 0;
      std::cin >> n;

      int soLoiGoi = 0;
      long long fn = fibo(n, soLoiGoi);

      std::cout << fn << " " << soLoiGoi << '\n';
      return 0;
  }
  ```

---

## Bài 13: Đệ Quy Lũy Thừa Nhanh Chia Để Trị (Modular Exponentiation)
* **Mục tiêu:** Nắm vững giải thuật chia để trị (Divide and Conquer) với độ phức tạp O(log b) bằng hàm đệ quy.
* **Mô tả:** Viết hàm đệ quy `long long luyThuaNhanh(long long a, long long b, long long m)` tính (a^b) % m:
  * Nếu b == 0, trả về 1 % m.
  * Tính half = luyThuaNhanh(a, b / 2, m).
  * Tính res = (half * half) % m.
  * Nếu b lẻ, res = (res * (a % m)) % m. Trả về res.
  * Trong `main()`, nhập a, b, m (1 <= a, b, m <= 10^9). In ra kết quả (a^b) % m.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên a, b, m cách nhau một khoảng trắng.
* **Đầu ra (Output):** Một số nguyên duy nhất là kết quả (a^b) % m.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 10 1000
```

**Khung Đầu ra (Output):**
```text
24
```

**Giải thích chi tiết:**
* 2^10 = 1024. 1024 % 1000 = 24.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long luyThuaNhanh(long long a, long long b, long long m) {
      if (b == 0) return 1 % m;
      long long half = luyThuaNhanh(a, b / 2, m);
      long long res = (half * half) % m;
      if (b % 2 == 1) {
          res = (res * (a % m)) % m;
      }
      return res;
  }

  int main() {
      long long a = 0, b = 0, m = 0;
      std::cin >> a >> b >> m;

      std::cout << luyThuaNhanh(a, b, m) << '\n';
      return 0;
  }
  ```

---

## Bài 14: Kiểm Tra Số Siêu Nguyên Tố Bằng Kỹ Thuật Phân Rã Hàm
* **Mục tiêu:** Áp dụng kỹ thuật phân rã bài toán (Modular Programming): chia bài toán phức tạp thành các hàm con độc lập.
* **Mô tả:** Một số nguyên dương được gọi là Số siêu nguyên tố nếu bản thân nó là số nguyên tố, và khi ta lần lượt xóa bỏ chữ số tận cùng bên phải thì các số thu được vẫn luôn là số nguyên tố (ví dụ: 2393 -> 239 -> 23 -> 2 đều là số nguyên tố).
  * Viết hàm `bool laNguyenTo(long long n)`.
  * Viết hàm `bool laSieuNguyenTo(long long n)` (liên tục kiểm tra laNguyenTo(n) và chia nguyên n /= 10 cho đến khi n == 0).
  * Trong `main()`, nhập số nguyên dương n (1 <= n <= 10^9). In ra `YES` nếu là số siêu nguyên tố, ngược lại in `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^9).
* **Đầu ra (Output):** In ra `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2393
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* 2393 là số nguyên tố.
* Bỏ chữ số cuối: 239 là số nguyên tố.
* Bỏ tiếp: 23 là số nguyên tố.
* Bỏ tiếp: 2 là số nguyên tố.
* Do đó 2393 là số siêu nguyên tố.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  bool laNguyenTo(long long n) {
      if (n < 2) return false;
      for (long long i = 2; i * i <= n; ++i) {
          if (n % i == 0) return false;
      }
      return true;
  }

  bool laSieuNguyenTo(long long n) {
      if (n < 2) return false;
      while (n > 0) {
          if (!laNguyenTo(n)) return false;
          n /= 10;
      }
      return true;
  }

  int main() {
      long long n = 0;
      std::cin >> n;

      if (laSieuNguyenTo(n)) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
  ```

---

## Bài 15: Phân Rã Rút Gọn Phân Số Bằng Hàm Tham Chiếu (simplifyFraction)
* **Mục tiêu:** Viết hàm nhận 2 tham chiếu biến đổi trực tiếp tử số và mẫu số của phân số về dạng tối giản.
* **Mô tả:** Viết hàm `void rutGonPhanSo(long long &tu, long long &mau)`:
  * Tìm UCLN(|tu|, |mau|).
  * Chia cả `tu` và `mau` cho UCLN.
  * Chuẩn hóa dấu: nếu mẫu số âm (mau < 0), đổi dấu cả tử và mẫu để mẫu luôn dương.
  * Trong `main()`, nhập tử số và mẫu số (mau != 0, -10^12 <= tu, mau <= 10^12).
  * In ra dạng tu/mau nếu mau > 1, hoặc chỉ in tu nếu phân số rút gọn thành số nguyên (mau == 1).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên tu và mau cách nhau một khoảng trắng (mau != 0).
* **Đầu ra (Output):** Dạng rút gọn của phân số.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
-18 -24
```

**Khung Đầu ra (Output):**
```text
3/4
```

**Giải thích chi tiết:**
* -18 / -24 = 18 / 24. UCLN(18, 24) = 6. Chia cho 6 được 3/4.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <cmath>

  long long timUCLN(long long a, long long b) {
      a = std::abs(a);
      b = std::abs(b);
      while (b != 0) {
          long long r = a % b;
          a = b;
          b = r;
      }
      return a;
  }

  void rutGonPhanSo(long long &tu, long long &mau) {
      if (tu == 0) {
          mau = 1;
          return;
      }
      long long uc = timUCLN(tu, mau);
      tu /= uc;
      mau /= uc;
      if (mau < 0) {
          tu = -tu;
          mau = -mau;
      }
  }

  int main() {
      long long tu = 0, mau = 1;
      std::cin >> tu >> mau;

      rutGonPhanSo(tu, mau);

      if (mau == 1) {
          std::cout << tu << '\n';
      } else {
          std::cout << tu << "/" << mau << '\n';
      }

      return 0;
  }
  ```

---

## Bài 16: Đệ Quy In Dãy Số Nhị Phân của N (Không dùng Mảng)
* **Mục tiêu:** Áp dụng đệ quy để đảo ngược thứ tự in tự nhiên của ngăn xếp (Stack frame) mà không cần dùng cấu trúc dữ liệu lưu trữ.
* **Mô tả:** Viết hàm đệ quy `void inNhiPhan(long long n)`:
  * Nếu n == 0, dừng.
  * Gọi đệ quy inNhiPhan(n / 2).
  * In ra n % 2.
  * Trong `main()`, nhập số nguyên không âm n (0 <= n <= 10^18). Nếu n == 0, in ra `0`. Ngược lại gọi inNhiPhan(n) và xuống dòng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên không âm n (0 <= n <= 10^18).
* **Đầu ra (Output):** Chuỗi các bit nhị phân của n.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
29
```

**Khung Đầu ra (Output):**
```text
11101
```

**Giải thích chi tiết:**
* 29 = 16 + 8 + 4 + 1 -> Nhị phân: `11101`. Lời gọi đệ quy giúp in bit có trọng số cao nhất trước.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  void inNhiPhan(long long n) {
      if (n == 0) return;
      inNhiPhan(n / 2);
      std::cout << (n % 2);
  }

  int main() {
      long long n = 0;
      std::cin >> n;

      if (n == 0) {
          std::cout << 0 << '\n';
      } else {
          inNhiPhan(n);
          std::cout << '\n';
      }

      return 0;
  }
  ```

---

## Bài 17: Nạp Chồng Hàm Tính Diện Tích Hình Học Đa Dạng
* **Mục tiêu:** Nạp chồng hàm với số lượng tham số khác nhau để tính toán diện tích nhiều loại hình học khác nhau.
* **Mô tả:** Viết 3 hàm nạp chồng `double tinhDienTich`:
  1. `double tinhDienTich(double r)`: Diện tích hình tròn bán kính r (S = PI * r * r, dùng PI = 3.1415926535).
  2. `double tinhDienTich(double dai, double rong)`: Diện tích hình chữ nhật (S = dai * rong).
  3. `double tinhDienTich(double a, double b, double c)`: Diện tích tam giác theo công thức Heron với p = (a + b + c) / 2 và S = canBacHai(p * (p - a) * (p - b) * (p - c)).
  * Trong `main()`, đọc ký tự `loaiHinh`:
    * 'C' (Circle): đọc tiếp r, in diện tích hình tròn.
    * 'R' (Rectangle): đọc tiếp dai, rong, in diện tích hình chữ nhật.
    * 'T' (Triangle): đọc tiếp a, b, c, in diện tích tam giác.
    * Kết quả in lấy chính xác 2 chữ số thập phân.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ký tự đại diện cho loại hình và các tham số kích thước tương ứng.
* **Đầu ra (Output):** Một số thực là diện tích với 2 chữ số thập phân.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
T 3 4 5
```

**Khung Đầu ra (Output):**
```text
6.00
```

**Giải thích chi tiết:**
* Tam giác có 3 cạnh 3, 4, 5 có nửa chu vi p = 6. S = canBacHai(6 * 3 * 2 * 1) = 6.00.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>
  #include <cmath>

  const double PI = 3.1415926535;

  double tinhDienTich(double r) {
      return PI * r * r;
  }

  double tinhDienTich(double dai, double rong) {
      return dai * rong;
  }

  double tinhDienTich(double a, double b, double c) {
      double p = (a + b + c) / 2.0;
      return std::sqrt(p * (p - a) * (p - b) * (p - c));
  }

  int main() {
      char loaiHinh;
      std::cin >> loaiHinh;

      if (loaiHinh == 'C') {
          double r = 0;
          std::cin >> r;
          std::cout << std::fixed << std::setprecision(2) << tinhDienTich(r) << '\n';
      } else if (loaiHinh == 'R') {
          double dai = 0, rong = 0;
          std::cin >> dai >> rong;
          std::cout << std::fixed << std::setprecision(2) << tinhDienTich(dai, rong) << '\n';
      } else if (loaiHinh == 'T') {
          double a = 0, b = 0, c = 0;
          std::cin >> a >> b >> c;
          std::cout << std::fixed << std::setprecision(2) << tinhDienTich(a, b, c) << '\n';
      }

      return 0;
  }
  ```

---

## Bài 18: Đệ Quy Đảo Ngược Số Nguyên (recursiveReverseNumber)
* **Mục tiêu:** Áp dụng đệ quy đuôi (Tail Recursion) với tham số tích lũy có giá trị mặc định (default argument).
* **Mô tả:** Viết hàm đệ quy `long long daoNguoc(long long n, long long res = 0)`:
  * Nếu n == 0, trả về res.
  * Ngược lại, gọi đệ quy daoNguoc(n / 10, res * 10 + (n % 10)).
  * Trong `main()`, nhập số nguyên dương n (1 <= n <= 10^18). Gọi hàm và in số nguyên đảo ngược ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^18).
* **Đầu ra (Output):** Số đảo ngược của n.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
123456789
```

**Khung Đầu ra (Output):**
```text
987654321
```

**Giải thích chi tiết:**
* Qua các bước đệ quy, chữ số tận cùng được chuyển lên đầu của biến tích lũy res.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long daoNguoc(long long n, long long res = 0) {
      if (n == 0) return res;
      return daoNguoc(n / 10, res * 10 + (n % 10));
  }

  int main() {
      long long n = 0;
      std::cin >> n;

      std::cout << daoNguoc(n) << '\n';
      return 0;
  }
  ```

---

## Bài 19: Hàm Giải Hệ Phương Trình Bậc Nhất 2 Ẩn Bằng Định Thức Cramer
* **Mục tiêu:** Tách bạch thuật toán giải hệ phương trình tuyến tính qua hàm chuyên dụng và trả về nghiệm qua 2 tham chiếu `double &x, double &y`.
* **Mô tả:** Hệ phương trình bậc nhất 2 ẩn có dạng:
  * Phương trình 1: a1 * x + b1 * y = c1
  * Phương trình 2: a2 * x + b2 * y = c2
  Định thức Cramer:
  * D = a1 * b2 - a2 * b1
  * Dx = c1 * b2 - c2 * b1
  * Dy = a1 * c2 - a2 * c1
  Viết hàm `int giaiHePhuongTrinh(double a1, double b1, double c1, double a2, double b2, double c2, double &x, double &y)`:
    * Nếu D != 0: có nghiệm duy nhất x = Dx / D, y = Dy / D, trả về 1.
    * Nếu D == 0:
      * Nếu Dx == 0 và Dy == 0: trả về -1 (vô số nghiệm).
      * Ngược lại: trả về 0 (vô nghiệm).
  * Trong `main()`, nhập 6 hệ số a1, b1, c1, a2, b2, c2.
    * Trả về 1: in `x y` với 2 chữ số thập phân.
    * Trả về 0: in `VO NGHIEM`.
    * Trả về -1: in `VO SO NGHIEM`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** 6 số thực a1, b1, c1, a2, b2, c2 cách nhau bởi dấu cách.
* **Đầu ra (Output):** Nghiệm của hệ hoặc thông báo trạng thái.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 1 4 1 -1 1
```

**Khung Đầu ra (Output):**
```text
1.67 0.67
```

**Giải thích chi tiết:**
* 2x + y = 4 và x - y = 1 => 3x = 5 => x = 5/3 = 1.67, y = 2/3 = 0.67.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>
  #include <cmath>

  int giaiHePhuongTrinh(double a1, double b1, double c1,
                         double a2, double b2, double c2,
                         double &x, double &y) {
      double D = a1 * b2 - a2 * b1;
      double Dx = c1 * b2 - c2 * b1;
      double Dy = a1 * c2 - a2 * c1;

      if (std::abs(D) > 1e-9) {
          x = Dx / D;
          y = Dy / D;
          if (std::abs(x) < 1e-9) x = 0.0;
          if (std::abs(y) < 1e-9) y = 0.0;
          return 1;
      }

      if (std::abs(Dx) < 1e-9 && std::abs(Dy) < 1e-9) {
          return -1; // Vô số nghiệm
      }
      return 0; // Vô nghiệm
  }

  int main() {
      double a1, b1, c1, a2, b2, c2;
      std::cin >> a1 >> b1 >> c1 >> a2 >> b2 >> c2;

      double x = 0, y = 0;
      int trangThai = giaiHePhuongTrinh(a1, b1, c1, a2, b2, c2, x, y);

      if (trangThai == 1) {
          std::cout << std::fixed << std::setprecision(2) << x << " " << y << '\n';
      } else if (trangThai == 0) {
          std::cout << "VO NGHIEM\n";
      } else {
          std::cout << "VO SO NGHIEM\n";
      }

      return 0;
  }
  ```

---

## Bài 20: Đệ Quy Tính Tổ Hợp Chập K của N (Pascal Combination)
* **Mục tiêu:** Cài đặt tính tổ hợp C(n, k) bằng hệ thức đệ quy Pascal C(n, k) = C(n - 1, k - 1) + C(n - 1, k).
* **Mô tả:** Viết hàm đệ quy `long long toHop(int n, int k)`:
  * Nếu k == 0 hoặc k == n, trả về 1.
  * Nếu k > n, trả về 0.
  * Ngược lại, trả về toHop(n - 1, k - 1) + toHop(n - 1, k).
  * Trong `main()`, nhập hai số nguyên n và k (0 <= k <= n <= 25). In ra giá trị của C(n, k).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên n và k cách nhau một khoảng trắng (0 <= k <= n <= 25).
* **Đầu ra (Output):** Giá trị tổ hợp C(n, k).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6 2
```

**Khung Đầu ra (Output):**
```text
15
```

**Giải thích chi tiết:**
* C(6, 2) = 6! / (2! * 4!) = 30 / 2 = 15.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long toHop(int n, int k) {
      if (k == 0 || k == n) return 1;
      if (k > n) return 0;
      return toHop(n - 1, k - 1) + toHop(n - 1, k);
  }

  int main() {
      int n = 0, k = 0;
      std::cin >> n >> k;

      std::cout << toHop(n, k) << '\n';
      return 0;
  }
  ```
