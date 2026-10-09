# Bộ bài tập Thực hành Tổng hợp Module 2: C++ Cơ bản
## Mức độ: KHÓ / THỬ THÁCH (HARD) - 10 Bài tập

> **Phạm vi kiến thức:** Cấu trúc rẽ nhánh `if`, `else if`, `else`, khối lệnh `{}`, toán tử so sánh (`==`, `!=`, `<`, `<=`, `>`, `>=`), toán tử logic (`&&`, `||`, `!`), cơ chế đoản mạch (Short-Circuit), `switch-case`, `break`, `default`, toán tử 3 ngôi `? :` và kỹ thuật Early Return.
> **Quy ước:** Tuyệt đối không dùng vòng lặp (`for`, `while`), không dùng mảng (`array`, `vector`).

---

## Bài 21: Tìm Ngày Kế Tiếp trong Lịch (Next Day)
* **Mục tiêu:** Rèn luyện tư duy xử lý chuyển ngày, chuyển tháng, chuyển năm và năm nhuận bằng chuỗi điều kiện logic chặt chẽ.
* **Mô tả:** Nhập vào ngày D, tháng M và năm Y (với dữ liệu ngày tháng năm luôn đảm bảo hợp lệ). Hãy tính và in ra ngày, tháng, năm của **ngày kế tiếp** ngay sau đó (D_next M_next Y_next), cách nhau bởi một khoảng trắng.
* **Chú ý các trường hợp biên:**
  * Ngày cuối tháng chuyển sang ngày 1 của tháng tiếp theo.
  * Ngày cuối năm (31/12) chuyển sang ngày 1/1 của năm mới.
  * Tháng 2 của năm nhuận (29 ngày) và năm thường (28 ngày).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên D, M, Y (1 <= D <= 31, 1 <= M <= 12, 1 <= Y <= 10^5).
* **Đầu ra (Output):** Ba số nguyên D_next M_next Y_next cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
28 2 2024
```

**Khung Đầu ra (Output):**
```text
29 2 2024
```

**Giải thích chi tiết:**
* Năm 2024 là năm nhuận nên tháng 2 có 29 ngày. Sau ngày 28/2 sẽ là ngày 29/2/2024.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int d = 0, m = 0, y = 0;
      std::cin >> d >> m >> y;

      // Xác định số ngày tối đa của tháng m
      int maxNgay = 31;
      if (m == 4 || m == 6 || m == 9 || m == 11) {
          maxNgay = 30;
      } else if (m == 2) {
          bool laNamNhuan = (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
          maxNgay = laNamNhuan ? 29 : 28;
      }

      if (d < maxNgay) {
          d++;
      } else {
          d = 1;
          if (m < 12) {
              m++;
          } else {
              m = 1;
              y++;
          }
      }

      std::cout << d << " " << m << " " << y << '\n';
      return 0;
  }
  ```

---

## Bài 22: Giải và Biện luận Phương trình Bậc Hai ax^2 + bx + c = 0
* **Mục tiêu:** Xử lý toàn diện các trường hợp suy biến khi a = 0 (phương trình bậc nhất) và biệt thức Delta (`b^2 - 4ac`) khi a != 0.
* **Mô tả:** Nhập vào 3 hệ số thực a, b, c. Biện luận số nghiệm:
  * Nếu a == 0: Trở thành `bx + c = 0`:
    * b == 0, c == 0: in `Vo so nghiem`
    * b == 0, c != 0: in `Vo nghiem`
    * b != 0: in 1 nghiệm duy nhất `x = -c / b`
  * Nếu a != 0: Tính delta = b^2 - 4ac:
    * delta < 0: in `Vo nghiem`
    * delta == 0: in 1 nghiệm kép `x = -b / (2*a)`
    * delta > 0: in 2 nghiệm phân biệt `x1 x2` (với x1 <= x2) cách nhau một khoảng trắng.
  * Các nghiệm in làm tròn đúng 2 chữ số thập phân.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số thực a, b, c trên cùng một dòng.
* **Đầu ra (Output):** Chuỗi biện luận hoặc các nghiệm cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1 -5 6
```

**Khung Đầu ra (Output):**
```text
2.00 3.00
```

**Giải thích chi tiết:**
* Delta = (-5)^2 - 4*1*6 = 25 - 24 = 1 > 0.
* Căn delta = 1. Nghiệm x1 = (5 - 1)/2 = 2.00, x2 = (5 + 1)/2 = 3.00.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>
  #include <cmath>

  int main() {
      double a = 0.0, b = 0.0, c = 0.0;
      std::cin >> a >> b >> c;

      std::cout << std::fixed << std::setprecision(2);

      if (a == 0.0) {
          if (b == 0.0) {
              if (c == 0.0) std::cout << "Vo so nghiem\n";
              else std::cout << "Vo nghiem\n";
          } else {
              double x = -c / b;
              if (x == -0.0) x = 0.0;
              std::cout << x << '\n';
          }
          return 0;
      }

      double delta = b * b - 4 * a * c;

      if (delta < 0.0) {
          std::cout << "Vo nghiem\n";
      } else if (delta == 0.0) {
          double x = -b / (2 * a);
          if (x == -0.0) x = 0.0;
          std::cout << x << '\n';
      } else {
          double canDelta = std::sqrt(delta);
          double x1 = (-b - canDelta) / (2 * a);
          double x2 = (-b + canDelta) / (2 * a);
          if (x1 > x2) {
              double tmp = x1; x1 = x2; x2 = tmp;
          }
          if (x1 == -0.0) x1 = 0.0;
          if (x2 == -0.0) x2 = 0.0;
          std::cout << x1 << " " << x2 << '\n';
      }

      return 0;
  }
  ```

---

## Bài 23: Trò chơi Kéo - Búa - Bao (Oẳn tù tì)
* **Mục tiêu:** Rèn luyện kỹ năng kết hợp toán tử logic để xử lý quan hệ vòng tròn (Kéo thắng Bao, Bao thắng Búa, Búa thắng Kéo).
* **Mô tả:** Hai người chơi cùng ra một trong 3 nước:
  * `K`: Kéo
  * `B`: Búa
  * `G`: Giấy (Bao)
  Nhập vào 2 ký tự c1 và c2 lần lượt là lựa chọn của Người 1 và Người 2.
  Hãy in ra:
  * `Nguoi 1 thang` nếu Người 1 thắng.
  * `Nguoi 2 thang` nếu Người 2 thắng.
  * `Hoa` nếu hai người chọn giống nhau.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai ký tự c1 và c2 cách nhau bởi dấu cách ('K', 'B', hoặc 'G').
* **Đầu ra (Output):** Kết quả ván đấu (`Nguoi 1 thang`, `Nguoi 2 thang`, hoặc `Hoa`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
B K
```

**Khung Đầu ra (Output):**
```text
Nguoi 1 thang
```

**Giải thích chi tiết:**
* Người 1 ra Búa ('B'), Người 2 ra Kéo ('K'). Búa đập vỡ Kéo nên Người 1 thắng.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      char c1 = ' ', c2 = ' ';
      std::cin >> c1 >> c2;

      if (c1 == c2) {
          std::cout << "Hoa\n";
      } else if ((c1 == 'K' && c2 == 'G') ||
                 (c1 == 'B' && c2 == 'K') ||
                 (c1 == 'G' && c2 == 'B')) {
          std::cout << "Nguoi 1 thang\n";
      } else {
          std::cout << "Nguoi 2 thang\n";
      }

      return 0;
  }
  ```

---

## Bài 24: Sắp xếp 4 Số Nguyên Tăng Dần không dùng Mảng và Vòng lặp
* **Mục tiêu:** Làm chủ kỹ thuật hoán vị (swap) giá trị của 2 biến bằng biến tạm thời, sắp xếp 4 phần tử bằng mạng so sánh trực tiếp.
* **Mô tả:** Nhập vào 4 số nguyên a, b, c, d từ bàn phím. Hãy in ra 4 số này theo thứ tự tăng dần (không giảm) trên cùng một dòng, cách nhau bởi một khoảng trắng.
* **Ràng buộc:** Tuyệt đối không sử dụng mảng, `std::vector` hay vòng lặp `for`/`while`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Bốn số nguyên a, b, c, d (-10^9 <= a, b, c, d <= 10^9).
* **Đầu ra (Output):** Bốn số đã được sắp xếp tăng dần, cách nhau bởi một dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
9 -2 5 0
```

**Khung Đầu ra (Output):**
```text
-2 0 5 9
```

**Giải thích chi tiết:**
* Sắp xếp từ nhỏ đến lớn: -2 <= 0 <= 5 <= 9.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0, c = 0, d = 0;
      std::cin >> a >> b >> c >> d;

      // Mạng so sánh hoán đổi (Sorting Network cho 4 phần tử)
      long long t = 0;
      if (a > b) { t = a; a = b; b = t; }
      if (c > d) { t = c; c = d; d = t; }
      if (a > c) { t = a; a = c; c = t; }
      if (b > d) { t = b; b = d; d = t; }
      if (b > c) { t = b; b = c; c = t; }

      std::cout << a << " " << b << " " << c << " " << d << '\n';
      return 0;
  }
  ```

---

## Bài 25: Tính Khoảng Cách Thời Gian giữa 2 Thời điểm trong Ngày
* **Mục tiêu:** Quy đổi đơn vị thời gian sang số giây để so sánh, sau đó dùng phép chia nguyên và chia dư để khôi phục lại Giờ - Phút - Giây.
* **Mô tả:** Nhập vào hai thời điểm trong cùng một ngày:
  * Thời điểm 1: h1, m1, s1 (0 <= h1 <= 23, 0 <= m1, s1 <= 59)
  * Thời điểm 2: h2, m2, s2 (0 <= h2 <= 23, 0 <= m2, s2 <= 59)
  Đảm bảo thời điểm 2 luôn diễn ra sau hoặc trùng thời điểm 1 trong ngày.
  Hãy tính khoảng cách thời gian giữa hai thời điểm và in theo định dạng: `H gio M phut S giay`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** 6 số nguyên h1 m1 s1 h2 m2 s2 cách nhau bởi khoảng trắng.
* **Đầu ra (Output):** Chuỗi định dạng khoảng cách thời gian `H gio M phut S giay`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
9 15 30 11 10 20
```

**Khung Đầu ra (Output):**
```text
1 gio 54 phut 50 giay
```

**Giải thích chi tiết:**
* Thời điểm 1: 9 * 3600 + 15 * 60 + 30 = 33,330 giây.
* Thời điểm 2: 11 * 3600 + 10 * 60 + 20 = 40,220 giây.
* Chênh lệch = 40,220 - 33,330 = 6,890 giây.
* 6,890 / 3600 = 1 giờ; phần dư 6,890 % 3600 = 1,690 giây.
* 1,690 / 60 = 54 phút; phần dư 1,690 % 60 = 50 giây.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long h1 = 0, m1 = 0, s1 = 0;
      long long h2 = 0, m2 = 0, s2 = 0;
      std::cin >> h1 >> m1 >> s1 >> h2 >> m2 >> s2;

      long long sec1 = h1 * 3600 + m1 * 60 + s1;
      long long sec2 = h2 * 3600 + m2 * 60 + s2;

      long long diff = sec2 - sec1;

      long long h = diff / 3600;
      diff %= 3600;
      long long m = diff / 60;
      long long s = diff % 60;

      std::cout << h << " gio " << m << " phut " << s << " giay\n";
      return 0;
  }
  ```

---

## Bài 26: Xác định Vị trí Tương đối của 2 Đoạn Thẳng [a, b] và [c, d] trên Trục Số
* **Mục tiêu:** Áp dụng công thức giao hai đoạn thẳng `[max(a, c), min(b, d)]` để tính độ dài phần giao nhau.
* **Mô tả:** Cho hai đoạn thẳng trên trục số thực: đoạn 1 là `[a, b]` (a <= b) và đoạn 2 là `[c, d]` (c <= d).
  * Nếu hai đoạn thẳng giao nhau (có phần chung), in ra độ dài của phần chung đó.
  * Nếu không giao nhau (rời nhau hoàn toàn), in ra `0`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Bốn số thực a, b, c, d (a <= b, c <= d).
* **Đầu ra (Output):** Độ dài phần giao nhau (làm tròn 2 chữ số thập phân).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1.5 7.0 4.0 9.5
```

**Khung Đầu ra (Output):**
```text
3.00
```

**Giải thích chi tiết:**
* Phần giao nhau của [1.5, 7.0] và [4.0, 9.5] là đoạn [4.0, 7.0].
* Độ dài = 7.0 - 4.0 = 3.00.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>

  int main() {
      double a = 0.0, b = 0.0, c = 0.0, d = 0.0;
      std::cin >> a >> b >> c >> d;

      double left = (a > c) ? a : c;
      double right = (b < d) ? b : d;

      std::cout << std::fixed << std::setprecision(2);
      if (left <= right) {
          std::cout << (right - left) << '\n';
      } else {
          std::cout << 0.00 << '\n';
      }

      return 0;
  }
  ```

---

## Bài 27: Xác định Điểm M có Nằm Trong Hình Chữ Nhật
* **Mục tiêu:** Vận dụng hệ bất phương trình tọa độ để xác định vị trí tương đối giữa một điểm và một hình chữ nhật song song trục tọa độ.
* **Mô tả:** Cho một hình chữ nhật có các cạnh song song với hai trục tọa độ:
  * Góc trái-dưới có tọa độ `(x1, y1)`.
  * Góc phải-trên có tọa độ `(x2, y2)` (đảm bảo x1 < x2 và y1 < y2).
  Nhập tọa độ điểm M `(x, y)`. Hãy xác định:
  * Điểm M nằm strictly bên trong hình chữ nhật: in `BEN TRONG`
  * Điểm M nằm trên một trong các cạnh của hình chữ nhật: in `TREN BIEN`
  * Điểm M nằm ngoài hình chữ nhật: in `BEN NGOAI`

### Quy cách dữ liệu:
* **Đầu vào (Input):** 6 số thực: x1 y1 x2 y2 x y.
* **Đầu ra (Output):** `BEN TRONG`, `TREN BIEN`, hoặc `BEN NGOAI`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
0 0 10 10 5 10
```

**Khung Đầu ra (Output):**
```text
TREN BIEN
```

**Giải thích chi tiết:**
* Điểm M(5, 10) có hoành độ 0 < 5 < 10 và tung độ y = 10 đúng bằng cạnh trên của hình chữ nhật, nên nằm `TREN BIEN`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      double x1 = 0.0, y1 = 0.0, x2 = 0.0, y2 = 0.0, x = 0.0, y = 0.0;
      std::cin >> x1 >> y1 >> x2 >> y2 >> x >> y;

      if (x < x1 || x > x2 || y < y1 || y > y2) {
          std::cout << "BEN NGOAI\n";
      } else if (x > x1 && x < x2 && y > y1 && y < y2) {
          std::cout << "BEN TRONG\n";
      } else {
          std::cout << "TREN BIEN\n";
      }

      return 0;
  }
  ```

---

## Bài 28: Đọc Số Có 2 Chữ Số thành Chữ Tiếng Việt
* **Mục tiêu:** Kết hợp tách chữ số hàng chục, hàng đơn vị và cấu trúc `switch-case` để giải quyết bài toán đọc số với các trường hợp đặc biệt (`mười`, `mười lăm`, `hai mươi mốt`, `ba mươi lăm`).
* **Mô tả:** Nhập vào một số nguyên N có đúng 2 chữ số (10 <= N <= 99). Hãy in ra cách đọc số đó bằng tiếng Việt không dấu:
  * Hàng chục: 1 in `Muoi`, 2 in `Hai muoi`, 3 in `Ba muoi`, ..., 9 in `Chin muoi`.
  * Hàng đơn vị (khi hàng đơn vị != 0):
    * Đuôi 1: Nếu hàng chục là 1 đọc là `mot` (viết: `Muoi mot`); nếu hàng chục >= 2 đọc là `mot` theo âm điệu tiếng Việt: `Hai muoi mot`.
    * Đuôi 5: Nếu hàng chục là 1 đọc là `lam` (viết: `Muoi lam`); nếu hàng chục >= 2 đọc là `lam` (viết: `Hai muoi lam`).
    * Các số khác: `hai`, `ba`, `bon`, `sau`, `bay`, `tam`, `chin`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (10 <= N <= 99).
* **Đầu ra (Output):** Cách đọc tiếng Việt tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
35
```

**Khung Đầu ra (Output):**
```text
Ba muoi lam
```

**Giải thích chi tiết:**
* Số 35 gồm hàng chục là 3 ("Ba muoi") và hàng đơn vị là 5 ("lam") -> Kết quả: "Ba muoi lam".

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <string>

  int main() {
      int n = 0;
      std::cin >> n;

      int chuc = n / 10;
      int donVi = n % 10;

      std::string sChuc = "";
      switch (chuc) {
          case 1: sChuc = "Muoi"; break;
          case 2: sChuc = "Hai muoi"; break;
          case 3: sChuc = "Ba muoi"; break;
          case 4: sChuc = "Bon muoi"; break;
          case 5: sChuc = "Nam muoi"; break;
          case 6: sChuc = "Sau muoi"; break;
          case 7: sChuc = "Bay muoi"; break;
          case 8: sChuc = "Tam muoi"; break;
          case 9: sChuc = "Chin muoi"; break;
      }

      if (donVi == 0) {
          std::cout << sChuc << '\n';
          return 0;
      }

      std::string sDonVi = "";
      switch (donVi) {
          case 1: sDonVi = (chuc == 1) ? "mot" : "mot"; break;
          case 2: sDonVi = "hai"; break;
          case 3: sDonVi = "ba"; break;
          case 4: sDonVi = "bon"; break;
          case 5: sDonVi = "lam"; break;
          case 6: sDonVi = "sau"; break;
          case 7: sDonVi = "bay"; break;
          case 8: sDonVi = "tam"; break;
          case 9: sDonVi = "chin"; break;
      }

      std::cout << sChuc << " " << sDonVi << '\n';
      return 0;
  }
  ```

---

## Bài 29: Kiểm tra Tam Giác Có Chứa Điểm Gốc Tọa Độ (0, 0)
* **Mục tiêu:** Áp dụng phương pháp tích có hướng 2D (Cross Product) để kiểm tra điểm nằm trong đa giác lồi mà không dùng vòng lặp.
* **Mô tả:** Cho 3 điểm không thẳng hàng A(x1, y1), B(x2, y2), C(x3, y3) tạo thành tam giác ABC.
  Kiểm tra xem gốc tọa độ O(0, 0) có nằm trong tam giác ABC (bao gồm cả trường hợp nằm trên cạnh tam giác) hay không.
  * Nếu có: in ra `YES`
  * Nếu không: in ra `NO`
* **Công thức gợi ý:** Tích có hướng của hai vector OA x OB = x1 * y2 - x2 * y1.
  Điểm O nằm trong tam giác nếu dấu của cả 3 tích có hướng (OA x OB), (OB x OC), (OC x OA) cùng >= 0 hoặc cùng <= 0.

### Quy cách dữ liệu:
* **Đầu vào (Input):** 6 số nguyên: x1 y1 x2 y2 x3 y3 (-10^4 <= xi, yi <= 10^4).
* **Đầu ra (Output):** `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
-2 -2 4 -2 0 4
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* Tam giác tạo bởi (-2,-2), (4,-2), (0,4) bao quanh điểm O(0,0), nên kết quả là `YES`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long x1 = 0, y1 = 0, x2 = 0, y2 = 0, x3 = 0, y3 = 0;
      std::cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3;

      // cp1 = OA x OB = x1 * y2 - x2 * y1
      long long cp1 = x1 * y2 - x2 * y1;
      // cp2 = OB x OC = x2 * y3 - x3 * y2
      long long cp2 = x2 * y3 - x3 * y2;
      // cp3 = OC x OA = x3 * y1 - x1 * y3
      long long cp3 = x3 * y1 - x1 * y3;

      bool cungDuong = (cp1 >= 0 && cp2 >= 0 && cp3 >= 0);
      bool cungAm = (cp1 <= 0 && cp2 <= 0 && cp3 <= 0);

      if (cungDuong || cungAm) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
  ```

---

## Bài 30: Tính Thuế Thu Nhập Cá Nhân Lũy Tiến Từng Phần
* **Mục tiêu:** Quản lý dữ liệu lớn `long long` và áp dụng biểu thức tính thuế lũy tiến từng phần thực tế.
* **Mô tả:** Biểu thuế thu nhập cá nhân lũy tiến đối với thu nhập chịu thuế T (đồng/tháng) được quy định như sau:
  * Bậc 1: Đến 5 triệu đồng (T <= 5,000,000): Thuế suất 5%.
  * Bậc 2: Trên 5 triệu đến 10 triệu đồng: Thuế suất 10%.
  * Bậc 3: Trên 10 triệu đến 18 triệu đồng: Thuế suất 15%.
  * Bậc 4: Trên 18 triệu đến 32 triệu đồng: Thuế suất 20%.
  * Bậc 5: Trên 32 triệu đồng: Thuế suất 25%.
  Nhập vào thu nhập chịu thuế T (T >= 0). Hãy tính chính xác số tiền thuế phải nộp (đồng, làm tròn đến hàng đơn vị).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên T (0 <= T <= 10^12).
* **Đầu ra (Output):** Số tiền thuế phải nộp (số nguyên `long long`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
15000000
```

**Khung Đầu ra (Output):**
```text
1500000
```

**Giải thích chi tiết:**
* Thu nhập chịu thuế: 15,000,000 đồng:
  * 5,000,000 đầu (Bậc 1): 5,000,000 * 5% = 250,000 đồng.
  * 5,000,000 tiếp theo (Bậc 2, từ 5tr đến 10tr): 5,000,000 * 10% = 500,000 đồng.
  * 5,000,000 còn lại (Bậc 3, từ 10tr đến 15tr): 5,000,000 * 15% = 750,000 đồng.
  * Tổng tiền thuế = 250,000 + 500,000 + 750,000 = 1,500,000 đồng.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long t = 0;
      std::cin >> t;

      double thue = 0.0;

      if (t <= 5000000) {
          thue = t * 0.05;
      } else if (t <= 10000000) {
          thue = 5000000 * 0.05 + (t - 5000000) * 0.10;
      } else if (t <= 18000000) {
          thue = 5000000 * 0.05 + 5000000 * 0.10 + (t - 10000000) * 0.15;
      } else if (t <= 32000000) {
          thue = 5000000 * 0.05 + 5000000 * 0.10 + 8000000 * 0.15 + (t - 18000000) * 0.20;
      } else {
          thue = 5000000 * 0.05 + 5000000 * 0.10 + 8000000 * 0.15 + 14000000 * 0.20 + (t - 32000000) * 0.25;
      }

      long long tienThue = static_cast<long long>(thue + 0.5); // Làm tròn
      std::cout << tienThue << '\n';
      return 0;
  }
  ```
