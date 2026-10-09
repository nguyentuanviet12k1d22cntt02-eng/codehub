# BÀI TẬP THỰC HÀNH C++ CƠ BẢN - MODULE 01 (CẤP ĐỘ: KHÓ / THỬ THÁCH)

> **Phạm vi kiến thức áp dụng (Chỉ thuộc Module 01):**
> * Cấu trúc chương trình C++ (`#include <iostream>`, `int main()`, `return 0;`)
> * Nhập/Xuất chuẩn (`std::cin`, `std::cout`, `'\n'`)
> * Kiểu dữ liệu nguyên thủy (`int`, `long long`, `double`, `char`, `bool`)
> * Phòng tránh hiện tượng **Tràn số nguyên (Integer Overflow)** và kỹ thuật chọn kiểu `long long` 64-bit
> * Ép kiểu tường minh `static_cast<long long>` và `static_cast<double>`
> * Nghệ thuật ứng dụng toán tử Modulo (`%`) và Chia nguyên (`/`) để giải quyết bài toán chu kỳ, làm tròn trần và xoay vòng dữ liệu
> * **TUYỆT ĐỐI KHÔNG DÙNG:** Cấu trúc rẽ nhánh (`if/else`), vòng lặp (`for/while`), hàm con hay mảng.

---

## Bài 21: Tích số nguyên cực lớn & Cạm bẫy Tràn số (Integer Overflow)
* **Mục tiêu:** Hiểu sâu sắc cơ chế tràn số ô nhớ 32-bit và bắt buộc ép kiểu sang 64-bit `long long`.
* **Mô tả:** Nhập vào hai số nguyên dương a và b (1 <= a, b <= 1,000,000,000). Hãy tính và in ra tích `a * b`.
* **Cạm bẫy cực kỳ nguy hiểm:**
  * Giới hạn của kiểu `int` 32-bit chỉ đạt xấp xỉ 2 tỷ (2 * 10^9). Khi a = 10^9, b = 10^9 thì tích a * b = 10^18 (vượt quá giới hạn `int`).
  * Nếu khai báo `int a, b;` rồi viết `long long tich = a * b;`, chương trình **VẪN BỊ SAI** (trả về số âm ngẫu nhiên) vì C++ sẽ nhân hai số `int` với nhau trước trong thanh ghi 32-bit gây tràn số, rồi mới gán sang `long long`.
  * *Cách giải quyết:* Khai báo trực tiếp `long long a, b;` hoặc ép kiểu tường minh `static_cast<long long>(a) * b`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên a, b (1 <= a, b <= 10^9).
* **Đầu ra (Output):** Tích của hai số.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1000000000 1000000000
```

**Khung Đầu ra (Output):**
```text
1000000000000000000
```

**Giải thích chi tiết:**
Tích của 10^9 và 10^9 là 10^18, cần biến `long long` 64-bit để lưu trữ chính xác.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      long long tich = a * b;

      std::cout << tich << '\n';
      return 0;
  }
  ```

---

## Bài 22: Tổng dãy số tự nhiên từ 1 đến N (Công thức Gauss)
* **Mục tiêu:** Áp dụng công thức tính tổng `1 + 2 + ... + N = N * (N + 1) / 2` với dữ liệu lớn mà không dùng vòng lặp, kiểm soát thứ tự thực thi để không tràn số.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1,000,000,000). Hãy tính tổng các số tự nhiên từ 1 đến N.
* **Phân tích:** Vì N <= 10^9 nên tích N * (N + 1) xấp xỉ 10^18, bắt buộc phải lưu trữ và tính toán trong kiểu `long long`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (1 <= N <= 10^9).
* **Đầu ra (Output):** Tổng các số từ 1 đến N.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1000000
```

**Khung Đầu ra (Output):**
```text
500000500000
```

**Giải thích chi tiết:**
`S = 1000000 * 1000001 / 2 = 500,000,500,000`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long tong = n * (n + 1) / 2;

      std::cout << tong << '\n';
      return 0;
  }
  ```

---

## Bài 23: Bài toán Chia trần (Ceil Division) không dùng thư viện và if
* **Mục tiêu:** Nắm vững công thức toán học kinh điển trong lập trình thi đấu để làm tròn lên phép chia nguyên.
* **Mô tả:** Một công ty tổ chức dã ngoại cho N nhân viên. Công ty thuê các xe du lịch, mỗi xe chở được tối đa K người. Hãy tính số lượng xe ít nhất cần thuê để chở hết toàn bộ nhân viên (ngay cả khi xe cuối cùng chỉ có 1 người thì vẫn phải tính là 1 xe).
* **Bí quyết thuật toán:**
  * Thông thường phép chia nguyên N / K sẽ làm tròn xuống (Floor).
  * Để làm tròn lên (Ceil) của N / K với N, K > 0 mà không dùng hàm `ceil()` của `cmath` hay lệnh `if`, công thức chuẩn xác là:
    `Số xe = (N + K - 1) / K`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương N và K (K > 0).
* **Đầu ra (Output):** Số lượng xe ít nhất cần thuê.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
31 10
```

**Khung Đầu ra (Output):**
```text
4
```

**Giải thích chi tiết:**
* Đoàn có 31 người, mỗi xe chở tối đa 10 người.
* 3 xe đầu chở được 30 người, còn dư 1 người bắt buộc phải thuê thêm 1 xe nữa.
* Tổng số xe cần thuê là 4 xe.
* Áp dụng công thức: `(31 + 10 - 1) / 10 = 40 / 10 = 4` xe.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0, k = 0;
      std::cin >> n >> k;

      long long soXe = (n + k - 1) / k;

      std::cout << soXe << '\n';
      return 0;
  }
  ```

---

## Bài 24: Đổi tiền theo cơ số tối ưu (Không dùng vòng lặp)
* **Mục tiêu:** Phân rã một số lớn thành chuỗi các mệnh giá tiền tệ giảm dần bằng phép chia lấy nguyên và chia lấy dư liên tiếp.
* **Mô tả:** Một máy ATM cần chi trả số tiền T nghìn đồng (với T là bội số của 10). Máy có 5 loại mệnh giá: 500k, 200k, 100k, 50k, và 10k. Hãy xác định số tờ tiền của từng loại mệnh giá mà máy ATM sẽ nhả ra sao cho tổng số tờ tiền là ít nhất có thể.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên T (nghìn đồng, T >= 10).
* **Đầu ra (Output):** 5 số nguyên cách nhau một khoảng trắng biểu thị lần lượt số tờ: 500k, 200k, 100k, 50k, 10k.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
880
```

**Khung Đầu ra (Output):**
```text
1 1 1 1 3
```

**Giải thích chi tiết:**
* 880 / 500 = 1 tờ 500k, còn dư 380k.
* 380 / 200 = 1 tờ 200k, còn dư 180k.
* 180 / 100 = 1 tờ 100k, còn dư 80k.
* 80 / 50 = 1 tờ 50k, còn dư 30k.
* 30 / 10 = 3 tờ 10k, còn dư 0k.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long t = 0;
      std::cin >> t;

      long long to500 = t / 500;
      t %= 500;

      long long to200 = t / 200;
      t %= 200;

      long long to100 = t / 100;
      t %= 100;

      long long to50 = t / 50;
      t %= 50;

      long long to10 = t / 10;

      std::cout << to500 << " " << to200 << " " << to100 << " " << to50 << " " << to10 << '\n';
      return 0;
  }
  ```

---

## Bài 25: Trích xuất chữ số và đối xứng số 4 chữ số
* **Mục tiêu:** Kỹ thuật bóc tách toàn diện 4 chữ số d1, d2, d3, d4 và tính chênh lệch tổng chẵn - tổng lẻ.
* **Mô tả:** Nhập vào một số nguyên dương N có đúng 4 chữ số (1000 <= N <= 9999).
  * Gọi các chữ số từ trái sang phải lần lượt là d1, d2, d3, d4.
  * Hãy tính hiệu số: `(d1 + d3) - (d2 + d4)`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N có đúng 4 chữ số.
* **Đầu ra (Output):** Một số nguyên là hiệu số tính được.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3852
```

**Khung Đầu ra (Output):**
```text
-2
```

**Giải thích chi tiết:**
* d1 = 3, d2 = 8, d3 = 5, d4 = 2.
* Tổng vị trí lẻ: d1 + d3 = 3 + 5 = 8.
* Tổng vị trí chẵn: d2 + d4 = 8 + 2 = 10.
* Hiệu số = 8 - 10 = -2.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      int d1 = n / 1000;
      int d2 = (n / 100) % 10;
      int d3 = (n / 10) % 10;
      int d4 = n % 10;

      int ketQua = (d1 + d3) - (d2 + d4);

      std::cout << ketQua << '\n';
      return 0;
  }
  ```

---

## Bài 26: Tối ưu tính giá trị đa thức bậc 3 (Lược đồ Horner)
* **Mục tiêu:** Vận dụng biến trung gian và tư duy tối ưu thuật toán giảm số phép nhân.
* **Mô tả:** Cho đa thức bậc 3: `P(x) = a * x^3 + b * x^2 + c * x + d`. Nhập vào các hệ số nguyên a, b, c, d và giá trị x. Hãy tính giá trị P(x) bằng lược đồ Horner:
  `P(x) = ((a * x + b) * x + c) * x + d`

### Quy cách dữ liệu:
* **Đầu vào (Input):** 5 số nguyên a, b, c, d, x trên cùng một dòng cách nhau bởi dấu cách.
* **Đầu ra (Output):** Giá trị của đa thức P(x).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3 -4 5 2
```

**Khung Đầu ra (Output):**
```text
25
```

**Giải thích chi tiết:**
* Thay x = 2: `P(2) = 2*(2^3) + 3*(2^2) - 4*(2) + 5 = 16 + 12 - 8 + 5 = 25`.
* Tính theo Horner: `((2*2 + 3)*2 - 4)*2 + 5 = (7*2 - 4)*2 + 5 = 10*2 + 5 = 25`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0, c = 0, d = 0, x = 0;
      std::cin >> a >> b >> c >> d >> x;

      long long p = ((a * x + b) * x + c) * x + d;

      std::cout << p << '\n';
      return 0;
  }
  ```

---

## Bài 27: Mã hóa Caesar cho 1 chữ cái bằng phép Modulo xoay vòng
* **Mục tiêu:** Ứng dụng toán tử `% 26` để tạo vòng tròn tuần hoàn chữ cái mà không cần câu lệnh điều kiện.
* **Mô tả:** Trong mật mã Caesar, một chữ cái in hoa được mã hóa bằng cách dịch chuyển nó về phía sau K vị trí trong bảng 26 chữ cái tiếng Anh (từ `'A'` đến `'Z'`). Nếu dịch vượt quá chữ `'Z'`, nó sẽ tự động quay trở lại đầu bảng là chữ `'A'`.
  Nhập vào một ký tự in hoa c và số bước dịch chuyển K (K >= 0). Hãy in ra ký tự sau khi mã hóa.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự in hoa c và số nguyên K cách nhau bởi dấu cách.
* **Đầu ra (Output):** Ký tự sau khi đã mã hóa xoay vòng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
Y 4
```

**Khung Đầu ra (Output):**
```text
C
```

**Giải thích chi tiết:**
Chữ 'Y' là chữ thứ 24 (tính từ 0). Dịch 4 bước: `(24 + 4) % 26 = 28 % 26 = 2`, ứng với chữ 'C'.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      char c = ' ';
      int k = 0;
      std::cin >> c >> k;

      int viTriCu = c - 'A';
      int viTriMoi = (viTriCu + k) % 26;
      char ketQua = static_cast<char>('A' + viTriMoi);

      std::cout << ketQua << '\n';
      return 0;
  }
  ```

---

## Bài 28: Tính thời gian tương lai trên đồng hồ 24 giờ
* **Mục tiêu:** Kết hợp hai vòng lặp modulo `% 60` (phút) và `% 24` (giờ) hoàn toàn không cần `if`.
* **Mô tả:** Đồng hồ điện tử hiện tại đang chỉ H giờ M phút (0 <= H <= 23, 0 <= M <= 59). Sau X phút nữa (X >= 0), đồng hồ sẽ hiển thị mấy giờ mấy phút?

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên H, M, X cách nhau bởi dấu cách.
* **Đầu ra (Output):** Hai số nguyên cách nhau một khoảng trắng biểu thị Giờ và Phút mới.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
22 45 150
```

**Khung Đầu ra (Output):**
```text
1 15
```

**Giải thích chi tiết:**
* Tổng phút: `22 * 60 + 45 + 150 = 1515` phút.
* 1 ngày có `24 * 60 = 1440` phút.
* Phút trong ngày mới: `1515 % 1440 = 75` phút.
* Giờ mới: `75 / 60 = 1` giờ; Phút mới: `75 % 60 = 15` phút.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long h = 0, m = 0, x = 0;
      std::cin >> h >> m >> x;

      long long tongPhut = h * 60 + m + x;
      long long phutTrongNgay = tongPhut % (24 * 60);

      long long gioMoi = phutTrongNgay / 60;
      long long phutMoi = phutTrongNgay % 60;

      std::cout << gioMoi << " " << phutMoi << '\n';
      return 0;
  }
  ```

---

## Bài 29: Thể tích và Diện tích toàn phần Hình nón cụt
* **Mục tiêu:** Khai báo hằng số `const double PI = 3.14159265;`, kết hợp các toán tử số học số thực.
* **Mô tả:** Cho một hình nón cụt có bán kính đáy lớn R, bán kính đáy nhỏ r, và chiều cao h (R > r > 0, h > 0).
  Thể tích hình nón cụt được tính theo công thức:
  `V = (1.0 / 3.0) * PI * h * (R * R + r * r + R * r)`
  Viết chương trình nhập vào R, r, h kiểu số thực và in ra thể tích V.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số thực R, r, h cách nhau bởi dấu cách.
* **Đầu ra (Output):** Thể tích V của hình nón cụt.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5.0 2.0 6.0
```

**Khung Đầu ra (Output):**
```text
245.044
```

**Giải thích chi tiết:**
* `V = (1.0 / 3.0) * 3.14159265 * 6.0 * (5.0^2 + 2.0^2 + 5.0 * 2.0)`
* `V = 2.0 * 3.14159265 * (25 + 4 + 10) = 2.0 * 3.14159265 * 39 = 245.044`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      const double PI = 3.14159265;

      double R = 0.0, r = 0.0, h = 0.0;
      std::cin >> R >> r >> h;

      double theTich = (1.0 / 3.0) * PI * h * (R * R + r * r + R * r);

      std::cout << theTich << '\n';
      return 0;
  }
  ```

---

## Bài 30: Kiểm tra tính chia hết không dùng câu lệnh điều kiện
* **Mục tiêu:** Khai thác bản chất của toán tử so sánh bằng `==` và kiểu dữ liệu `bool`.
* **Mô tả:** Cho hai số nguyên dương A và B (B > 0). Hãy in ra `1` (true) nếu A chia hết cho B, ngược lại in ra `0` (false) mà tuyệt đối không dùng câu lệnh `if/else`.
* **Bí quyết:** Biểu thức so sánh `(A % B == 0)` trả về kết quả kiểu `bool`. Khi xuất ra `std::cout`, C++ sẽ tự động in `1` cho `true` và `0` cho `false`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương A và B cách nhau bởi dấu cách.
* **Đầu ra (Output):** In ra `1` nếu A chia hết cho B, ngược lại in ra `0`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
20 5
```

**Khung Đầu ra (Output):**
```text
1
```

**Giải thích chi tiết:**
20 chia hết cho 5 (phép chia dư `20 % 5 == 0` là đúng), chương trình in ra số 1.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      bool chiaHet = (a % b == 0);

      std::cout << chiaHet << '\n';
      return 0;
  }
  ```
