# Bộ bài tập Thực hành Tổng hợp Module 4: C++ Cơ bản
## Mức độ: DỄ (EASY) - 10 Bài tập

> **Phạm vi kiến thức:** Khai báo và định nghĩa hàm (Functions), tham số hình thức, đối số, kiểu trả về (return), cơ chế truyền tham trị (Pass-by-value) vs truyền tham chiếu (Pass-by-reference &), tham chiếu hằng (const &), biến tĩnh (static), nạp chồng hàm (Function Overloading) cơ bản, đệ quy cơ bản.
> **Quy ước:** Tuyệt đối không dùng mảng (array, vector), không dùng con trỏ hay cấp phát động.

---

## Bài 1: Viết Hàm Tính Luỹ Thừa Bậc K (power)
* **Mục tiêu:** Rèn luyện kỹ năng định nghĩa hàm có tham số và trả về giá trị kiểu `long long`.
* **Mô tả:** Viết hàm `long long luyThua(long long a, int k)` nhận vào cơ số `a` và số mũ nguyên không âm `k`, tính và trả về giá trị a^k.
  * Trong hàm `main()`, nhập hai số nguyên `a` và `k` (-10 <= a <= 10, 0 <= k <= 15), gọi hàm `luyThua` và in kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên a và k cách nhau một khoảng trắng.
* **Đầu ra (Output):** Một số nguyên duy nhất là kết quả a^k.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 4
```

**Khung Đầu ra (Output):**
```text
81
```

**Giải thích chi tiết:**
* 3 lũy thừa 4: 3 * 3 * 3 * 3 = 81.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long luyThua(long long a, int k) {
      long long res = 1;
      for (int i = 0; i < k; ++i) {
          res *= a;
      }
      return res;
  }

  int main() {
      long long a = 0;
      int k = 0;
      std::cin >> a >> k;

      std::cout << luyThua(a, k) << '\n';
      return 0;
  }
  ```

---

## Bài 2: Viết Hàm Kiểm Tra Số Chính Phương (isSquare)
* **Mục tiêu:** Rèn luyện viết hàm trả về kiểu `bool` (`true`/`false`).
* **Mô tả:** Số chính phương là số nguyên không âm có căn bậc hai là một số nguyên (ví dụ: 0, 1, 4, 9, 16...).
  * Viết hàm `bool kiemTraChinhPhuong(long long n)` trả về `true` nếu `n` là số chính phương, ngược lại trả về `false`.
  * Trong `main()`, nhập số nguyên `n` (-10^12 <= n <= 10^12). In ra `YES` nếu là số chính phương, ngược lại in `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên n (-10^12 <= n <= 10^12).
* **Đầu ra (Output):** In ra `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
49
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* 49 = 7 * 7, là bình phương của số nguyên 7 nên là số chính phương.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <cmath>

  bool kiemTraChinhPhuong(long long n) {
      if (n < 0) return false;
      long long can = static_cast<long long>(std::round(std::sqrt(n)));
      return can * can == n;
  }

  int main() {
      long long n = 0;
      std::cin >> n;

      if (kiemTraChinhPhuong(n)) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
  ```

---

## Bài 3: Hoán Vị Hai Biến Bằng Tham Chiếu (swapByReference)
* **Mục tiêu:** Hiểu rõ bản chất truyền tham chiếu `&` (Pass-by-reference) để làm thay đổi trực tiếp giá trị của đối số ngoài hàm.
* **Mô tả:** Viết hàm `void hoanVi(long long &a, long long &b)` để đổi chỗ giá trị của hai biến `a` và `b`.
  * Trong `main()`, nhập vào hai số nguyên `x` và `y`, gọi hàm `hoanVi(x, y)` rồi in ra hai số sau khi hoán vị cách nhau một dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên x và y cách nhau một khoảng trắng (-10^18 <= x, y <= 10^18).
* **Đầu ra (Output):** Hai số nguyên sau khi đổi chỗ cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
15 99
```

**Khung Đầu ra (Output):**
```text
99 15
```

**Giải thích chi tiết:**
* Sau khi qua hàm `hoanVi`, biến thứ nhất nhận giá trị 99 và biến thứ hai nhận giá trị 15.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  void hoanVi(long long &a, long long &b) {
      long long temp = a;
      a = b;
      b = temp;
  }

  int main() {
      long long x = 0, y = 0;
      std::cin >> x >> y;

      hoanVi(x, y);

      std::cout << x << " " << y << '\n';
      return 0;
  }
  ```

---

## Bài 4: Hàm Giải Phương Trình Bậc Nhất Với Tham Chiếu Nghiệm
* **Mục tiêu:** Áp dụng kết hợp kiểu trả về mã trạng thái (`int`) và truyền tham chiếu `double &` để trả về kết quả tính toán.
* **Mô tả:** Viết hàm `int giaiBacNhat(double a, double b, double &nghiem)` giải phương trình a * x + b = 0:
  * Nếu phương trình vô nghiệm: trả về `0`.
  * Nếu phương trình vô số nghiệm: trả về `-1`.
  * Nếu phương trình có nghiệm duy nhất: gán nghiệm vào tham chiếu `nghiem` và trả về `1`.
  * Trong `main()`, nhập `a` và `b`. Dựa vào giá trị trả về của hàm, in ra:
    * `VO NGHIEM` (nếu trả về 0)
    * `VO SO NGHIEM` (nếu trả về -1)
    * In giá trị nghiệm lấy chính xác 2 chữ số thập phân (nếu trả về 1).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số thực a và b cách nhau một khoảng trắng.
* **Đầu ra (Output):** Kết quả theo đúng quy ước.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 -5
```

**Khung Đầu ra (Output):**
```text
2.50
```

**Giải thích chi tiết:**
* Phương trình 2 * x - 5 = 0 <=> x = 2.5. Hàm trả về 1 và gán nghiệm x = 2.50.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>

  int giaiBacNhat(double a, double b, double &nghiem) {
      if (a == 0) {
          if (b == 0) return -1; // Vô số nghiệm
          return 0;              // Vô nghiệm
      }
      nghiem = -b / a;
      if (nghiem == 0.0) nghiem = 0.0; // Tránh -0.00
      return 1;
  }

  int main() {
      double a = 0, b = 0;
      std::cin >> a >> b;

      double x = 0;
      int trangThai = giaiBacNhat(a, b, x);

      if (trangThai == 0) {
          std::cout << "VO NGHIEM\n";
      } else if (trangThai == -1) {
          std::cout << "VO SO NGHIEM\n";
      } else {
          std::cout << std::fixed << std::setprecision(2) << x << '\n';
      }

      return 0;
  }
  ```

---

## Bài 5: Nạp Chồng Hàm Tìm Giá Trị Lớn Nhất (Function Overloading)
* **Mục tiêu:** Rèn luyện kỹ năng nạp chồng hàm (Function Overloading) với số lượng và kiểu dữ liệu tham số khác nhau.
* **Mô tả:** Viết các hàm nạp chồng có cùng tên `timMax`:
  * `int timMax(int a, int b)`: Tìm max của 2 số nguyên.
  * `double timMax(double a, double b)`: Tìm max của 2 số thực.
  * `int timMax(int a, int b, int c)`: Tìm max của 3 số nguyên.
  * Trong `main()`, đọc vào ký tự chế độ `mode`:
    * Nếu `mode == 'A'`: Nhập tiếp 2 số nguyên a, b, gọi `timMax(a, b)` và in kết quả.
    * Nếu `mode == 'B'`: Nhập tiếp 2 số thực a, b, gọi `timMax(a, b)` và in kết quả lấy 2 chữ số thập phân.
    * Nếu `mode == 'C'`: Nhập tiếp 3 số nguyên a, b, c, gọi `timMax(a, b, c)` và in kết quả.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ký tự mode ('A', 'B' hoặc 'C') và các số tương ứng.
* **Đầu ra (Output):** Giá trị lớn nhất tìm được.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
C 12 45 30
```

**Khung Đầu ra (Output):**
```text
45
```

**Giải thích chi tiết:**
* Chế độ 'C' gọi hàm `timMax(int, int, int)` với ba giá trị 12, 45, 30. Số lớn nhất là 45.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>

  int timMax(int a, int b) {
      return (a > b) ? a : b;
  }

  double timMax(double a, double b) {
      return (a > b) ? a : b;
  }

  int timMax(int a, int b, int c) {
      int m = (a > b) ? a : b;
      return (m > c) ? m : c;
  }

  int main() {
      char mode;
      std::cin >> mode;

      if (mode == 'A') {
          int a = 0, b = 0;
          std::cin >> a >> b;
          std::cout << timMax(a, b) << '\n';
      } else if (mode == 'B') {
          double a = 0, b = 0;
          std::cin >> a >> b;
          std::cout << std::fixed << std::setprecision(2) << timMax(a, b) << '\n';
      } else if (mode == 'C') {
          int a = 0, b = 0, c = 0;
          std::cin >> a >> b >> c;
          std::cout << timMax(a, b, c) << '\n';
      }

      return 0;
  }
  ```

---

## Bài 6: Hàm Tính Chỉ Số Khối Cơ Thể BMI Với Tham Chiếu Hằng (const &)
* **Mục tiêu:** Áp dụng tham chiếu hằng (`const double &`) để truyền dữ liệu an toàn và tối ưu bộ nhớ.
* **Mô tả:** Viết hai hàm:
  1. `double tinhBMI(const double &canNang, const double &chieuCao)`: Tính chỉ số BMI = canNang / (chieuCao * chieuCao) (cân nặng tính bằng kg, chiều cao tính bằng mét).
  2. `std::string phanLoaiBMI(const double &bmi)`:
     * BMI < 18.5: trả về "GAY"
     * 18.5 <= BMI < 25.0: trả về "BINH THUONG"
     * 25.0 <= BMI < 30.0: trả về "TIEN BEO PHI"
     * BMI >= 30.0: trả về "BEO PHI"
  * Trong `main()`, nhập cân nặng (kg) và chiều cao (m). In ra chỉ số BMI (lấy 2 chữ số thập phân) và phân loại, cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số thực cân nặng (kg) và chiều cao (m).
* **Đầu ra (Output):** Chỉ số BMI và tên phân loại.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
65.0 1.70
```

**Khung Đầu ra (Output):**
```text
22.49 BINH THUONG
```

**Giải thích chi tiết:**
* BMI = 65 / (1.70 * 1.70) = 22.49. Chỉ số nằm trong khoảng [18.5, 25.0) nên phân loại là BINH THUONG.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>
  #include <string>

  double tinhBMI(const double &canNang, const double &chieuCao) {
      return canNang / (chieuCao * chieuCao);
  }

  std::string phanLoaiBMI(const double &bmi) {
      if (bmi < 18.5) return "GAY";
      if (bmi < 25.0) return "BINH THUONG";
      if (bmi < 30.0) return "TIEN BEO PHI";
      return "BEO PHI";
  }

  int main() {
      double canNang = 0, chieuCao = 0;
      std::cin >> canNang >> chieuCao;

      double bmi = tinhBMI(canNang, chieuCao);
      std::string phanLoai = phanLoaiBMI(bmi);

      std::cout << std::fixed << std::setprecision(2) << bmi << " " << phanLoai << '\n';
      return 0;
  }
  ```

---

## Bài 7: Biến Tĩnh Trong Hàm Đếm Số Lần Gọi Hàm (static variable)
* **Mục tiêu:** Hiểu rõ vòng đời (Lifetime) của biến cục bộ có từ khóa `static` (tồn tại suốt chương trình và giữ nguyên giá trị giữa các lần gọi).
* **Mô tả:** Viết hàm `int demSoLanGoi()` bên trong có biến `static int count = 0;`. Mỗi lần gọi hàm, `count` tăng thêm 1 và hàm trả về giá trị `count`.
  * Trong `main()`, nhập vào số nguyên dương N (1 <= N <= 100). Sử dụng vòng lặp để gọi hàm `demSoLanGoi()` N lần và in ra kết quả của từng lần gọi trên cùng một dòng, cách nhau bởi dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 100).
* **Đầu ra (Output):** Dãy số từ 1 đến N thể hiện số lần gọi hàm.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
```

**Khung Đầu ra (Output):**
```text
1 2 3 4 5
```

**Giải thích chi tiết:**
* Lần 1 gọi hàm: count = 1. Lần 2: count = 2... Biến `static` không bị khởi tạo lại mỗi khi hàm kết thúc.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int demSoLanGoi() {
      static int count = 0;
      count++;
      return count;
  }

  int main() {
      int n = 0;
      std::cin >> n;

      for (int i = 1; i <= n; ++i) {
          std::cout << demSoLanGoi() << (i == n ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 8: Hàm Tính Giai Thừa Bằng Đệ Quy Cơ Bản (factorialRecursion)
* **Mục tiêu:** Làm quen với cơ chế đệ quy: điều kiện dừng (Base case) và bước đệ quy (Recursive step).
* **Mô tả:** Viết hàm đệ quy `long long giaiThua(int n)` để tính N!:
  * Điều kiện dừng: nếu n <= 1, trả về 1.
  * Bước đệ quy: trả về n * giaiThua(n - 1).
  * Trong `main()`, nhập số nguyên n (0 <= n <= 20). In ra giá trị của n!.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên n (0 <= n <= 20).
* **Đầu ra (Output):** Giá trị của n! (kiểu `long long`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
```

**Khung Đầu ra (Output):**
```text
720
```

**Giải thích chi tiết:**
* 6! = 6 * 5! = 6 * 120 = 720.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long giaiThua(int n) {
      if (n <= 1) return 1;
      return n * giaiThua(n - 1);
  }

  int main() {
      int n = 0;
      std::cin >> n;

      std::cout << giaiThua(n) << '\n';
      return 0;
  }
  ```

---

## Bài 9: Hàm Đệ Quy Tính Tổng Chữ Số của Số Nguyên (sumDigitsRecursion)
* **Mục tiêu:** Vận dụng đệ quy bóc tách dữ liệu số học mà không cần vòng lặp.
* **Mô tả:** Viết hàm đệ quy `long long tongChuSo(long long n)`:
  * Nếu n < 10, trả về n.
  * Ngược lại, trả về (n % 10) + tongChuSo(n / 10).
  * Trong `main()`, nhập số nguyên dương n (1 <= n <= 10^18). In ra tổng các chữ số của n.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^18).
* **Đầu ra (Output):** Tổng các chữ số của n.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
9875
```

**Khung Đầu ra (Output):**
```text
29
```

**Giải thích chi tiết:**
* tongChuSo(9875) = 5 + tongChuSo(987) = 5 + 7 + tongChuSo(98) = 5 + 7 + 8 + 9 = 29.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  long long tongChuSo(long long n) {
      if (n < 10) return n;
      return (n % 10) + tongChuSo(n / 10);
  }

  int main() {
      long long n = 0;
      std::cin >> n;

      std::cout << tongChuSo(n) << '\n';
      return 0;
  }
  ```

---

## Bài 10: Hàm Tách Giờ:Phút:Giây Qua Nhiều Tham Chiếu
* **Mục tiêu:** Sử dụng nhiều tham chiếu trong cùng một hàm `void` để trả về đồng thời nhiều kết quả.
* **Mô tả:** Viết hàm `void chuyenDoiThoiGian(long long tongGiay, int &gio, int &phut, int &giay)`:
  * Quy đổi tổng số giây thành: số giờ, số phút và số giây còn lại.
  * Trong `main()`, nhập số nguyên không âm `tongGiay` (0 <= tongGiay <= 10^9).
  * In ra định dạng chuẩn `HH:MM:SS` (nếu giá trị nhỏ hơn 10 thì đệm thêm số `0` ở đầu).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên không âm tongGiay (0 <= tongGiay <= 10^9).
* **Đầu ra (Output):** Chuỗi thời gian định dạng `HH:MM:SS`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3665
```

**Khung Đầu ra (Output):**
```text
01:01:05
```

**Giải thích chi tiết:**
* 3665 giây = 1 giờ (3600s) + 1 phút (60s) + 5 giây -> `01:01:05`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>

  void chuyenDoiThoiGian(long long tongGiay, int &gio, int &phut, int &giay) {
      gio = static_cast<int>(tongGiay / 3600);
      long long du = tongGiay % 3600;
      phut = static_cast<int>(du / 60);
      giay = static_cast<int>(du % 60);
  }

  int main() {
      long long tongGiay = 0;
      std::cin >> tongGiay;

      int h = 0, m = 0, s = 0;
      chuyenDoiThoiGian(tongGiay, h, m, s);

      std::cout << std::setfill('0') << std::setw(2) << h << ":"
                << std::setfill('0') << std::setw(2) << m << ":"
                << std::setfill('0') << std::setw(2) << s << '\n';

      return 0;
  }
  ```
