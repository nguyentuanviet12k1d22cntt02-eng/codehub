# Bộ bài tập Thực hành Tổng hợp Module 2: C++ Cơ bản
## Mức độ: TRUNG BÌNH (MEDIUM) - 10 Bài tập

> **Phạm vi kiến thức:** Cấu trúc rẽ nhánh `if`, `else if`, `else`, khối lệnh `{}`, toán tử so sánh (`==`, `!=`, `<`, `<=`, `>`, `>=`), toán tử logic (`&&`, `||`, `!`), cơ chế đoản mạch (Short-Circuit), `switch-case`, `break`, `default`, toán tử 3 ngôi `? :` và kỹ thuật Early Return.
> **Quy ước:** Tuyệt đối không dùng vòng lặp (`for`, `while`), không dùng mảng (`array`, `vector`).

---

## Bài 11: Tìm Số Lớn Nhất và Nhỏ Nhất trong 3 số
* **Mục tiêu:** Rèn luyện kỹ năng lồng ghép điều kiện hoặc dùng biến gán cực trị để tìm Max và Min trong 3 số.
* **Mô tả:** Nhập vào 3 số nguyên a, b, c từ bàn phím. Hãy tìm và in ra giá trị nhỏ nhất (Min) và giá trị lớn nhất (Max) trong 3 số đó, cách nhau bởi một dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên a, b, c (-10^9 <= a, b, c <= 10^9).
* **Đầu ra (Output):** Hai số nguyên tương ứng là Min và Max, cách nhau một khoảng trắng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
14 -5 29
```

**Khung Đầu ra (Output):**
```text
-5 29
```

**Giải thích chi tiết:**
* Trong 3 số 14, -5, 29 thì -5 là số nhỏ nhất, 29 là số lớn nhất.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0, c = 0;
      std::cin >> a >> b >> c;

      long long minVal = a;
      if (b < minVal) minVal = b;
      if (c < minVal) minVal = c;

      long long maxVal = a;
      if (b > maxVal) maxVal = b;
      if (c > maxVal) maxVal = c;

      std::cout << minVal << " " << maxVal << '\n';
      return 0;
  }
  ```

---

## Bài 12: Kiểm tra Điều kiện Tam giác và Phân loại
* **Mục tiêu:** Vận dụng bất đẳng thức tam giác và định lý Pytago để phân loại tam giác.
* **Mô tả:** Nhập vào 3 số nguyên dương a, b, c đại diện cho độ dài 3 cạnh.
  1. Kiểm tra 3 cạnh có tạo thành tam giác hợp lệ hay không (tổng 2 cạnh bất kỳ phải lớn hơn cạnh còn lại: a + b > c && a + c > b && b + c > a).
  2. Nếu không tạo thành tam giác, in ra: `Khong phai tam giac`.
  3. Nếu tạo thành tam giác, phân loại theo thứ tự ưu tiên:
     * Tam giác đều (a == b && b == c): in `Deu`
     * Tam giác vuông (thỏa mãn định lý Pytago a^2 + b^2 == c^2 hoặc b^2 + c^2 == a^2 hoặc a^2 + c^2 == b^2): in `Vuong`
     * Tam giác cân (có ít nhất 2 cạnh bằng nhau): in `Can`
     * Tam giác thường: in `Thuong`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên dương a, b, c (1 <= a, b, c <= 10^4).
* **Đầu ra (Output):** Chuỗi phân loại tam giác tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 4 5
```

**Khung Đầu ra (Output):**
```text
Vuong
```

**Giải thích chi tiết:**
* 3 + 4 > 5, 3 + 5 > 4, 4 + 5 > 3 -> Tạo thành tam giác.
* 3^2 + 4^2 = 9 + 16 = 25 = 5^2 -> Thỏa mãn Pytago nên là tam giác vuông.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0, c = 0;
      std::cin >> a >> b >> c;

      // 1. Kiểm tra điều kiện tam giác
      if (a + b <= c || a + c <= b || b + c <= a) {
          std::cout << "Khong phai tam giac\n";
          return 0;
      }

      // 2. Phân loại theo thứ tự ưu tiên
      if (a == b && b == c) {
          std::cout << "Deu\n";
      } else if (a * a + b * b == c * c || a * a + c * c == b * b || b * b + c * c == a * a) {
          std::cout << "Vuong\n";
      } else if (a == b || b == c || a == c) {
          std::cout << "Can\n";
      } else {
          std::cout << "Thuong\n";
      }

      return 0;
  }
  ```

---

## Bài 13: Xác định Quý trong Năm (switch gộp case)
* **Mục tiêu:** Áp dụng kỹ thuật gộp nhiều case liên tiếp trong `switch-case` (tận dụng Fall-through có chủ đích).
* **Mô tả:** Nhập vào tháng M trong năm (1 <= M <= 12). Hãy in ra quý tương ứng:
  * Tháng 1, 2, 3: in `Quy 1`
  * Tháng 4, 5, 6: in `Quy 2`
  * Tháng 7, 8, 9: in `Quy 3`
  * Tháng 10, 11, 12: in `Quy 4`
  * Nếu tháng không hợp lệ (ngoài khoảng 1-12): in `Loi`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên M.
* **Đầu ra (Output):** Chuỗi quý tương ứng hoặc `Loi`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
8
```

**Khung Đầu ra (Output):**
```text
Quy 3
```

**Giải thích chi tiết:**
* Tháng 8 thuộc Quý 3 (gồm tháng 7, 8, 9).

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int m = 0;
      std::cin >> m;

      switch (m) {
          case 1:
          case 2:
          case 3:
              std::cout << "Quy 1\n";
              break;
          case 4:
          case 5:
          case 6:
              std::cout << "Quy 2\n";
              break;
          case 7:
          case 8:
          case 9:
              std::cout << "Quy 3\n";
              break;
          case 10:
          case 11:
          case 12:
              std::cout << "Quy 4\n";
              break;
          default:
              std::cout << "Loi\n";
              break;
      }

      return 0;
  }
  ```

---

## Bài 14: Tính Tiền Điện Bậc Thang Sinh Hoạt
* **Mục tiêu:** Rèn luyện tư duy tính toán theo khoảng giá bậc thang bằng các khối lệnh rẽ nhánh không lặp.
* **Mô tả:** Biểu giá điện sinh hoạt được tính lũy tiến theo các bậc như sau:
  * Bậc 1: Cho 50 kWh đầu tiên, giá 1,678 đồng/kWh.
  * Bậc 2: Từ kWh thứ 51 đến 100, giá 1,734 đồng/kWh.
  * Bậc 3: Từ kWh thứ 101 trở lên, giá 2,014 đồng/kWh.
  Nhập vào số kWh điện tiêu thụ (số nguyên K >= 0). Hãy tính tổng tiền điện phải trả (đồng).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên K (0 <= K <= 10^6).
* **Đầu ra (Output):** Một số nguyên là tổng số tiền điện phải trả.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
75
```

**Khung Đầu ra (Output):**
```text
127250
```

**Giải thích chi tiết:**
* Tiêu thụ 75 kWh:
  * 50 kWh đầu: 50 * 1678 = 83,900 đồng.
  * 25 kWh tiếp theo (ở Bậc 2): 25 * 1734 = 43,350 đồng.
  * Tổng tiền = 83,900 + 43,350 = 127,250 đồng.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long k = 0;
      std::cin >> k;

      long long tongTien = 0;

      if (k <= 50) {
          tongTien = k * 1678;
      } else if (k <= 100) {
          tongTien = 50 * 1678 + (k - 50) * 1734;
      } else {
          tongTien = 50 * 1678 + 50 * 1734 + (k - 100) * 2014;
      }

      std::cout << tongTien << '\n';
      return 0;
  }
  ```

---

## Bài 15: Kiểm tra Điểm thuộc Góc Phần Tư Tọa độ Oxy
* **Mục tiêu:** Kết hợp dấu của tọa độ x, y để xác định vị trí của một điểm trên mặt phẳng tọa độ Decartes.
* **Mô tả:** Nhập vào tọa độ (x, y) của điểm M (với x, y là số thực khác 0). Xác định điểm M nằm ở góc phần tư nào:
  * Góc I: x > 0 và y > 0
  * Góc II: x < 0 và y > 0
  * Góc III: x < 0 và y < 0
  * Góc IV: x > 0 và y < 0

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số thực x và y cách nhau một khoảng trắng.
* **Đầu ra (Output):** In ra `Goc I`, `Goc II`, `Goc III` hoặc `Goc IV`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
-4.5 8.2
```

**Khung Đầu ra (Output):**
```text
Goc II
```

**Giải thích chi tiết:**
* Điểm có hoành độ x = -4.5 < 0 và tung độ y = 8.2 > 0 thuộc góc phần tư thứ II.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      double x = 0.0, y = 0.0;
      std::cin >> x >> y;

      if (x > 0 && y > 0) {
          std::cout << "Goc I\n";
      } else if (x < 0 && y > 0) {
          std::cout << "Goc II\n";
      } else if (x < 0 && y < 0) {
          std::cout << "Goc III\n";
      } else if (x > 0 && y < 0) {
          std::cout << "Goc IV\n";
      }

      return 0;
  }
  ```

---

## Bài 16: Kiểm tra Năm Nhuận (Leap Year)
* **Mục tiêu:** Nắm vững quy tắc thiên văn lịch Gregory về năm nhuận bằng toán tử logic kết hợp `&&` và `||`.
* **Mô tả:** Năm Y (số nguyên dương) là năm nhuận nếu:
  * Năm đó chia hết cho 400, HOẶC
  * Năm đó chia hết cho 4 nhưng KHÔNG chia hết cho 100.
  Ngược lại là năm thường.
  Hãy nhập năm Y và in ra `NAM NHUAN` hoặc `NAM THUONG`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương Y (1 <= Y <= 10^5).
* **Đầu ra (Output):** `NAM NHUAN` hoặc `NAM THUONG`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2000
```

**Khung Đầu ra (Output):**
```text
NAM NHUAN
```

**Giải thích chi tiết:**
* 2000 chia hết cho 400 nên là năm nhuận thế kỷ.
* Trong khi đó năm 1900 chia hết cho 100 nhưng không chia hết cho 400 nên là năm thường.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int y = 0;
      std::cin >> y;

      if ((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)) {
          std::cout << "NAM NHUAN\n";
      } else {
          std::cout << "NAM THUONG\n";
      }

      return 0;
  }
  ```

---

## Bài 17: Tính Số Ngày trong Tháng của Năm Bất Kỳ
* **Mục tiêu:** Kết hợp thuật toán năm nhuận với cấu trúc `switch-case` để xác định chính xác số ngày của một tháng.
* **Mô tả:** Nhập vào tháng M (1 <= M <= 12) và năm Y (1 <= Y <= 10^5). Hãy in ra số ngày của tháng đó.
  * Các tháng có 31 ngày: 1, 3, 5, 7, 8, 10, 12.
  * Các tháng có 30 ngày: 4, 6, 9, 11.
  * Tháng 2: Nếu là năm nhuận có 29 ngày; nếu năm thường có 28 ngày.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên M và Y cách nhau bởi dấu cách.
* **Đầu ra (Output):** Một số nguyên là số ngày của tháng M trong năm Y.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 2024
```

**Khung Đầu ra (Output):**
```text
29
```

**Giải thích chi tiết:**
* Năm 2024 là năm nhuận (chia hết cho 4 và không chia hết cho 100), do đó tháng 2 có 29 ngày.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int m = 0, y = 0;
      std::cin >> m >> y;

      switch (m) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
              std::cout << 31 << '\n';
              break;
          case 4:
          case 6:
          case 9:
          case 11:
              std::cout << 30 << '\n';
              break;
          case 2: {
              bool laNamNhuan = (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
              std::cout << (laNamNhuan ? 29 : 28) << '\n';
              break;
          }
      }

      return 0;
  }
  ```

---

## Bài 18: Giải và Biện luận Phương trình Bậc Nhất ax + b = 0
* **Mục tiêu:** Rèn luyện tư duy toán học logic biện luận đầy đủ mọi trường hợp của hệ số a và b.
* **Mô tả:** Nhập vào hai hệ số thực a và b của phương trình bậc nhất `ax + b = 0`. Biện luận nghiệm:
  * Nếu a == 0 và b == 0: in `Vo so nghiem`
  * Nếu a == 0 và b != 0: in `Vo nghiem`
  * Nếu a != 0: Phương trình có nghiệm duy nhất `x = -b / a`. In kết quả làm tròn đúng 2 chữ số sau dấu phẩy.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số thực a và b.
* **Đầu ra (Output):** Chuỗi biện luận hoặc giá trị nghiệm duy nhất.

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
* 2x - 5 = 0 <=> 2x = 5 <=> x = 2.50.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <iomanip>

  int main() {
      double a = 0.0, b = 0.0;
      std::cin >> a >> b;

      if (a == 0.0) {
          if (b == 0.0) {
              std::cout << "Vo so nghiem\n";
          } else {
              std::cout << "Vo nghiem\n";
          }
      } else {
          double x = -b / a;
          // Tránh in -0.00
          if (x == -0.0) x = 0.0;
          std::cout << std::fixed << std::setprecision(2) << x << '\n';
      }

      return 0;
  }
  ```

---

## Bài 19: Tính Cước Taxi theo Cự ly di chuyển
* **Mục tiêu:** Áp dụng cấu trúc rẽ nhánh để tính cước phí dịch vụ theo từng dặm đường thực tế.
* **Mô tả:** Cước phí đi taxi được tính như sau:
  * Km đầu tiên (0 < d <= 1): Giá mở cửa là 15,000 đồng.
  * Từ km thứ 2 đến km thứ 30 (1 < d <= 30): Giá 13,000 đồng/km.
  * Từ km thứ 31 trở lên (d > 30): Giá 11,000 đồng/km.
  Nhập vào quãng đường d (km, số thực dương). Hãy in ra tổng tiền cước (lấy phần nguyên).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực dương d (0 < d <= 1000).
* **Đầu ra (Output):** Số tiền nguyên (đồng).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
35
```

**Khung Đầu ra (Output):**
```text
447000
```

**Giải thích chi tiết:**
* 1 km đầu: 15,000 đồng.
* 29 km tiếp theo (từ km 2 đến km 30): 29 * 13,000 = 377,000 đồng.
* 5 km còn lại (từ km 31 đến km 35): 5 * 11,000 = 55,000 đồng.
* Tổng tiền = 15,000 + 377,000 + 55,000 = 447,000 đồng.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      double d = 0.0;
      std::cin >> d;

      double tongTien = 0.0;

      if (d <= 1.0) {
          tongTien = d * 15000.0;
      } else if (d <= 30.0) {
          tongTien = 1.0 * 15000.0 + (d - 1.0) * 13000.0;
      } else {
          tongTien = 1.0 * 15000.0 + 29.0 * 13000.0 + (d - 30.0) * 11000.0;
      }

      long long ketQua = static_cast<long long>(tongTien);
      std::cout << ketQua << '\n';
      return 0;
  }
  ```

---

## Bài 20: Chuyển đổi Ký tự Hoa - Thường (Kỹ thuật mã ASCII)
* **Mục tiêu:** Thao tác chuyển đổi chữ cái hoa/thường bằng phép dịch chuyển độ lệch `('a' - 'A') = 32` kết hợp `if-else`.
* **Mô tả:** Nhập vào một ký tự C bất kỳ:
  * Nếu C là chữ cái in thường: chuyển thành chữ cái in hoa tương ứng.
  * Nếu C là chữ cái in hoa: chuyển thành chữ cái in thường tương ứng.
  * Nếu C không phải chữ cái: giữ nguyên ký tự đó.
  In ký tự kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự C.
* **Đầu ra (Output):** Ký tự sau khi chuyển đổi.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
m
```

**Khung Đầu ra (Output):**
```text
M
```

**Giải thích chi tiết:**
* 'm' là chữ cái in thường, chuyển thành chữ cái in hoa tương ứng là 'M'.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      char c = ' ';
      std::cin >> c;

      if (c >= 'a' && c <= 'z') {
          c = static_cast<char>(c - ('a' - 'A'));
      } else if (c >= 'A' && c <= 'Z') {
          c = static_cast<char>(c + ('a' - 'A'));
      }

      std::cout << c << '\n';
      return 0;
  }
  ```
