# Bộ bài tập Thực hành Tổng hợp Module 4: C++ Cơ bản
## Mức độ: KHÓ / THỬ THÁCH (HARD) - 10 Bài tập

> **Phạm vi kiến thức:** Thuật toán đệ quy kinh điển trong khoa học máy tính (Tháp Hà Nội, Euclid mở rộng, hàm Ackermann, xấp xỉ Newton-Raphson, chia để trị), phân rã bài toán đa tầng, tham chiếu sâu và kiểm soát ngăn xếp đệ quy (Call Stack).
> **Quy ước:** Tuyệt đối không dùng mảng (array, vector), không dùng con trỏ hay cấp phát động.

---

## Bài 21: Bài Toán Tháp Hà Nội (Tower of Hanoi)
* **Mục tiêu:** Nắm vững giải thuật đệ quy phân rã kinh điển của bài toán Tháp Hà Nội.
* **Mô tả:** Có 3 cọc A, B, C và N chiếc đĩa kích thước khác nhau xếp chồng lên cọc A theo thứ tự nhỏ ở trên, lớn ở dưới. Cần chuyển toàn bộ đĩa sang cọc C với cọc B làm trung gian, tuân theo quy tắc: mỗi lần chỉ chuyển 1 đĩa và không bao giờ đặt đĩa lớn lên trên đĩa nhỏ.
  * Viết hàm đệ quy `void thapHaNoi(int n, char nguon, char dich, char trungGian, int &soBuoc)`:
    * Chuyển n - 1 đĩa từ nguon sang trungGian.
    * Chuyển đĩa thứ n từ nguon sang dich: in ra dòng `nguon -> dich` và tăng soBuoc.
    * Chuyển n - 1 đĩa từ trungGian sang dich.
  * Trong `main()`, nhập N (1 <= N <= 10).
    * In từng bước chuyển đĩa theo định dạng `A -> C` trên từng dòng.
    * Dòng cuối cùng in tổng số bước đã thực hiện.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10).
* **Đầu ra (Output):** Các bước chuyển đĩa và tổng số bước ở dòng cuối cùng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3
```

**Khung Đầu ra (Output):**
```text
A -> C
A -> B
C -> B
A -> C
B -> A
B -> C
A -> C
7
```

**Giải thích chi tiết:**
* Với 3 đĩa, số bước tối thiểu cần thực hiện là 2^3 - 1 = 7 bước.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  void thapHaNoi(int n, char nguon, char dich, char trungGian, int &soBuoc) {
      if (n == 1) {
          std::cout << nguon << " -> " << dich << '\n';
          soBuoc++;
          return;
      }
      thapHaNoi(n - 1, nguon, trungGian, dich, soBuoc);
      std::cout << nguon << " -> " << dich << '\n';
      soBuoc++;
      thapHaNoi(n - 1, trungGian, dich, nguon, soBuoc);
  }

  int main() {
      int n = 0;
      std::cin >> n;

      int soBuoc = 0;
      thapHaNoi(n, 'A', 'C', 'B', soBuoc);
      std::cout << soBuoc << '\n';

      return 0;
  }
  ```

---

## Bài 22: Thuật Toán Euclid Mở Rộng Bằng Hàm Đệ Quy (Extended Euclidean)
* **Mục tiêu:** Vận dụng đệ quy truy ngược tham chiếu để tìm hệ số Bezout (x, y) thỏa mãn đẳng thức a * x + b * y = UCLN(a, b).
* **Mô tả:** Viết hàm đệ quy `long long euclidMoRong(long long a, long long b, long long &x, long long &y)`:
  * Nếu b == 0, gán x = 1, y = 0 và trả về a.
  * Ngược lại, gọi đệ quy `long long g = euclidMoRong(b, a % b, x1, y1)`.
  * Cập nhật: x = y1, y = x1 - (a / b) * y1. Trả về g.
  * Trong `main()`, nhập hai số nguyên dương a và b (1 <= a, b <= 10^9).
  * In ra g, x, y cách nhau bởi dấu cách (với g là UCLN của a và b).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương a và b cách nhau một khoảng trắng (1 <= a, b <= 10^9).
* **Đầu ra (Output):** Ba số nguyên g, x, y cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
30 20
```

**Khung Đầu ra (Output):**
```text
10 1 -1
```

**Giải thích chi tiết:**
* UCLN(30, 20) = 10. Hệ số x = 1, y = -1 vì 30 * 1 + 20 * (-1) = 10.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long euclidMoRong(long long a, long long b, long long &x, long long &y) {
      if (b == 0) {
          x = 1;
          y = 0;
          return a;
      }
      long long x1 = 0, y1 = 0;
      long long g = euclidMoRong(b, a % b, x1, y1);
      x = y1;
      y = x1 - (a / b) * y1;
      return g;
  }

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      long long x = 0, y = 0;
      long long g = euclidMoRong(a, b, x, y);

      std::cout << g << " " << x << " " << y << '\n';
      return 0;
  }
  ```

---

## Bài 23: Đếm Số Cách Bước Lên Cầu Thang (Staircase Problem)
* **Mục tiêu:** Áp dụng tư duy chia bài toán thành các bài toán con và tối ưu đệ quy với biến trượt để tính toán trong O(N) mà không dùng mảng.
* **Mô tả:** Một chiếc cầu thang có N bậc. Mỗi bước bạn có thể bước lên 1 bậc hoặc 2 bậc.
  * Viết hàm `long long demCachBuoc(int n)`:
    * Trả về số cách khác nhau để bước lên đỉnh của cầu thang gồm N bậc.
    * Quy ước: với N = 1 có 1 cách, N = 2 có 2 cách (1+1 hoặc 2). Với N >= 3, số cách bằng tổng số cách của N - 1 và N - 2.
    * Để hàm chạy nhanh với N <= 45 trong O(N), sử dụng kỹ thuật đệ quy có truyền tích lũy hoặc vòng lặp nội bộ trong hàm.
  * Trong `main()`, nhập N (1 <= N <= 45). In ra số cách bước lên cầu thang.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 45).
* **Đầu ra (Output):** Số cách bước lên cầu thang.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
4
```

**Khung Đầu ra (Output):**
```text
5
```

**Giải thích chi tiết:**
* Với 4 bậc: (1+1+1+1), (1+1+2), (1+2+1), (2+1+1), (2+2) -> Tổng cộng 5 cách.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long demCachBuoc(int n, long long a = 1, long long b = 2) {
      if (n == 1) return a;
      if (n == 2) return b;
      for (int i = 3; i <= n; ++i) {
          long long c = a + b;
          a = b;
          b = c;
      }
      return b;
  }

  int main() {
      int n = 0;
      std::cin >> n;

      std::cout << demCachBuoc(n) << '\n';
      return 0;
  }
  ```

---

## Bài 24: Hàm Ackermann (Ackermann Function)
* **Mục tiêu:** Trải nghiệm hàm đệ quy không sơ cấp (non-primitive recursive) nổi tiếng trong lý thuyết độ phức tạp tính toán.
* **Mô tả:** Hàm Ackermann A(m, n) được định nghĩa đệ quy như sau:
  * A(0, n) = n + 1
  * A(m, 0) = A(m - 1, 1) với m > 0
  * A(m, n) = A(m - 1, A(m, n - 1)) với m > 0 và n > 0.
  * Viết hàm đệ quy `long long ackermann(long long m, long long n)`.
  * Trong `main()`, nhập hai số nguyên m và n (0 <= m <= 3, 0 <= n <= 10). In ra giá trị của A(m, n).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên không âm m và n cách nhau một khoảng trắng.
* **Đầu ra (Output):** Giá trị A(m, n).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3
```

**Khung Đầu ra (Output):**
```text
9
```

**Giải thích chi tiết:**
* A(2, 3) = A(1, A(2, 2)) = ... = 2 * 3 + 3 = 9.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long ackermann(long long m, long long n) {
      if (m == 0) return n + 1;
      if (m > 0 && n == 0) return ackermann(m - 1, 1);
      return ackermann(m - 1, ackermann(m, n - 1));
  }

  int main() {
      long long m = 0, n = 0;
      std::cin >> m >> n;

      std::cout << ackermann(m, n) << '\n';
      return 0;
  }
  ```

---

## Bài 25: Phân Rã Kiểm Tra Số Thuần Nguyên Tố (Pure Prime)
* **Mục tiêu:** Luyện tập thiết kế kiến trúc phân rã thành nhiều hàm con chuyên trách rõ ràng.
* **Mô tả:** Một số nguyên dương được gọi là Số thuần nguyên tố nếu nó thỏa mãn đồng thời 3 điều kiện:
  1. Bản thân nó là số nguyên tố.
  2. Tất cả các chữ số của nó đều là số nguyên tố (chỉ chứa các chữ số: 2, 3, 5, 7).
  3. Tổng tất cả các chữ số của nó cũng là một số nguyên tố.
  * Hãy xây dựng các hàm độc lập:
    * `bool laNguyenTo(long long n)`
    * `bool cacChuSoLaNguyenTo(long long n)`
    * `long long tinhTongChuSo(long long n)`
    * `bool laThuanNguyenTo(long long n)`
  * Trong `main()`, nhập hai số nguyên A và B (1 <= A <= B <= 10^5). Đếm xem có bao nhiêu số thuần nguyên tố trong đoạn [A, B].

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên A và B cách nhau bởi dấu cách.
* **Đầu ra (Output):** Số lượng số thuần nguyên tố trong đoạn [A, B].

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1 100
```

**Khung Đầu ra (Output):**
```text
4
```

**Giải thích chi tiết:**
* Trong khoảng [1, 100], có 4 số thuần nguyên tố là: 23, 37, 53, 73.

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

  bool cacChuSoLaNguyenTo(long long n) {
      while (n > 0) {
          int d = n % 10;
          if (d != 2 && d != 3 && d != 5 && d != 7) return false;
          n /= 10;
      }
      return true;
  }

  long long tinhTongChuSo(long long n) {
      long long sum = 0;
      while (n > 0) {
          sum += (n % 10);
          n /= 10;
      }
      return sum;
  }

  bool laThuanNguyenTo(long long n) {
      return cacChuSoLaNguyenTo(n) && laNguyenTo(tinhTongChuSo(n)) && laNguyenTo(n);
  }

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      int dem = 0;
      for (long long i = a; i <= b; ++i) {
          if (laThuanNguyenTo(i)) dem++;
      }

      std::cout << dem << '\n';
      return 0;
  }
  ```

---

## Bài 26: Đệ Quy Mô Phỏng Dãy Collatz và Tìm Đỉnh Cực Đại
* **Mục tiêu:** Dùng hàm đệ quy để biến đổi trạng thái số học và truyền tham chiếu theo dõi biến số lớn nhất đạt được.
* **Mô tả:** Viết hàm đệ quy `void collatz(long long n, long long &soBuoc, long long &maxVal)`:
  * Cập nhật: nếu n > maxVal thì maxVal = n.
  * Nếu n == 1, dừng đệ quy.
  * Tăng soBuoc lên 1 đơn vị.
  * Nếu n chẵn: gọi đệ quy collatz(n / 2, soBuoc, maxVal).
  * Nếu n lẻ: gọi đệ quy collatz(3 * n + 1, soBuoc, maxVal).
  * Trong `main()`, nhập số nguyên dương n (1 <= n <= 10^6). In ra số bước và giá trị cực đại đạt được, cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^6).
* **Đầu ra (Output):** Hai số nguyên: số bước biến đổi và giá trị cực đại.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
7
```

**Khung Đầu ra (Output):**
```text
16 52
```

**Giải thích chi tiết:**
* Từ 7 mất 16 bước đệ quy để về 1, đỉnh lớn nhất đạt được trong dãy là 52.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  void collatz(long long n, long long &soBuoc, long long &maxVal) {
      if (n > maxVal) maxVal = n;
      if (n == 1) return;
      soBuoc++;
      if (n % 2 == 0) {
          collatz(n / 2, soBuoc, maxVal);
      } else {
          collatz(3 * n + 1, soBuoc, maxVal);
      }
  }

  int main() {
      long long n = 0;
      std::cin >> n;

      long long soBuoc = 0;
      long long maxVal = n;
      collatz(n, soBuoc, maxVal);

      std::cout << soBuoc << " " << maxVal << '\n';
      return 0;
  }
  ```

---

## Bài 27: Đệ Quy Tính Căn Bậc Hai Bằng Phương Pháp Newton-Raphson
* **Mục tiêu:** Cài đặt phương pháp lặp xấp xỉ số học nổi tiếng bằng hàm đệ quy với điều kiện dừng theo sai số.
* **Mô tả:** Phương pháp Newton-Raphson tìm căn bậc hai của số dương S:
  * Bắt đầu với phỏng đoán ban đầu x_0 = S.
  * Công thức lặp: nextX = (x + S / x) / 2.0.
  * Quá trình dừng khi |nextX - x| < 1e-7.
  * Viết hàm đệ quy `double canBacHaiNewton(double s, double x)`:
    * Tính nextX = (x + s / x) / 2.0.
    * Nếu |nextX - x| < 1e-7, trả về nextX.
    * Ngược lại, gọi đệ quy canBacHaiNewton(s, nextX).
  * Trong `main()`, nhập số thực dương S (0 < S <= 10^9). In kết quả căn bậc hai với 5 chữ số thập phân.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực dương S.
* **Đầu ra (Output):** Giá trị căn bậc hai của S với 5 chữ số thập phân.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
10.0
```

**Khung Đầu ra (Output):**
```text
3.16228
```

**Giải thích chi tiết:**
* canBacHai(10) xấp xỉ 3.16227766..., làm tròn 5 chữ số thập phân là 3.16228.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>
  #include <cmath>

  double canBacHaiNewton(double s, double x) {
      double nextX = (x + s / x) / 2.0;
      if (std::abs(nextX - x) < 1e-7) {
          return nextX;
      }
      return canBacHaiNewton(s, nextX);
  }

  int main() {
      double s = 0;
      std::cin >> s;

      double kq = canBacHaiNewton(s, s);

      std::cout << std::fixed << std::setprecision(5) << kq << '\n';
      return 0;
  }
  ```

---

## Bài 28: Đệ Quy Đếm Số Lượng Số Có Tổng Chữ Số Bằng S
* **Mục tiêu:** Kết hợp hàm tính tổng chữ số đệ quy với vòng lặp duyệt đoạn để giải quyết bài toán đếm số học.
* **Mô tả:** Viết hàm đệ quy `int tongChuSo(long long n)`:
  * Trả về tổng các chữ số của n.
  * Trong `main()`, nhập ba số nguyên A, B và S (1 <= A <= B <= 10^6, 1 <= S <= 60).
  * Hãy đếm xem có bao nhiêu số nguyên trong đoạn [A, B] có tổng các chữ số đúng bằng S.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên A, B, S cách nhau một khoảng trắng.
* **Đầu ra (Output):** Số lượng số thỏa mãn điều kiện.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1 100 10
```

**Khung Đầu ra (Output):**
```text
9
```

**Giải thích chi tiết:**
* Các số <= 100 có tổng chữ số bằng 10 là: 19, 28, 37, 46, 55, 64, 73, 82, 91 (tổng cộng 9 số).

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int tongChuSo(long long n) {
      if (n < 10) return static_cast<int>(n);
      return static_cast<int>(n % 10) + tongChuSo(n / 10);
  }

  int main() {
      long long a = 0, b = 0;
      int s = 0;
      std::cin >> a >> b >> s;

      int dem = 0;
      for (long long i = a; i <= b; ++i) {
          if (tongChuSo(i) == s) dem++;
      }

      std::cout << dem << '\n';
      return 0;
  }
  ```

---

## Bài 29: Đệ Quy Kiểm Tra Dãy Dấu Ngoặc Hợp Lệ Dạng Chuỗi (Không dùng Stack)
* **Mục tiêu:** Vận dụng truyền tham chiếu hằng chuỗi ký tự (`const std::string &`) kết hợp con trỏ chỉ số đệ quy để giải quyết bài toán kiểm tra cú pháp.
* **Mô tả:** Một chuỗi chỉ gồm các ký tự mở ngoặc '(' và đóng ngoặc ')' được gọi là hợp lệ nếu số dấu mở ngoặc luôn lớn hơn hoặc bằng số dấu đóng ngoặc tại mọi vị trí, và kết thúc chuỗi số mở ngoặc bằng số đóng ngoặc.
  * Viết hàm đệ quy `bool kiemTraNgoac(const std::string &s, size_t index, int count)`:
    * Nếu count < 0: trả về false (vi phạm cấu trúc đóng trước mở).
    * Nếu index == s.length(): trả về count == 0.
    * Nếu s[index] == '(': gọi đệ quy kiemTraNgoac(s, index + 1, count + 1).
    * Nếu s[index] == ')': gọi đệ quy kiemTraNgoac(s, index + 1, count - 1).
  * Trong `main()`, nhập chuỗi `s` độ dài từ 1 đến 100. In ra `YES` nếu chuỗi hợp lệ, ngược lại in `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một chuỗi ký tự s chỉ chứa '(' và ')'.
* **Đầu ra (Output):** In ra `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
(())()
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* Dãy ngoặc đóng mở lồng nhau hoàn toàn hợp lệ.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <string>

  bool kiemTraNgoac(const std::string &s, size_t index, int count) {
      if (count < 0) return false;
      if (index == s.length()) return count == 0;
      if (s[index] == '(') {
          return kiemTraNgoac(s, index + 1, count + 1);
      } else if (s[index] == ')') {
          return kiemTraNgoac(s, index + 1, count - 1);
      }
      return kiemTraNgoac(s, index + 1, count);
  }

  int main() {
      std::string s;
      std::cin >> s;

      if (kiemTraNgoac(s, 0, 0)) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
  ```

---

## Bài 30: Đệ Quy Tìm Chữ Số Lớn Nhất Bằng Kỹ Thuật Chia Để Trị
* **Mục tiêu:** Áp dụng tư duy chia để trị (Divide and Conquer): phân rã số nguyên N và đệ quy tìm giá trị lớn nhất.
* **Mô tả:** Viết hàm đệ quy `int chuSoLonNhat(long long n)`:
  * Nếu n < 10, trả về n.
  * Phân rã n: lấy chữ số cuối d = n % 10 và phần còn lại n / 10.
  * Trả về giá trị lớn hơn giữa d và chuSoLonNhat(n / 10).
  * Trong `main()`, nhập số nguyên dương N (1 <= N <= 10^18). In ra chữ số lớn nhất của N.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).
* **Đầu ra (Output):** Một số nguyên từ 0 đến 9 là chữ số lớn nhất.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
382914
```

**Khung Đầu ra (Output):**
```text
9
```

**Giải thích chi tiết:**
* Trong các chữ số {3, 8, 2, 9, 1, 4}, chữ số lớn nhất là 9.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <algorithm>

  int chuSoLonNhat(long long n) {
      if (n < 10) return static_cast<int>(n);
      int d = static_cast<int>(n % 10);
      int maxTruoc = chuSoLonNhat(n / 10);
      return (d > maxTruoc) ? d : maxTruoc;
  }

  int main() {
      long long n = 0;
      std::cin >> n;

      std::cout << chuSoLonNhat(n) << '\n';
      return 0;
  }
  ```
