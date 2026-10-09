# Bộ bài tập Thực hành Tổng hợp Module 2: C++ Cơ bản
## Mức độ: DỄ (EASY) - 10 Bài tập

> **Phạm vi kiến thức:** Cấu trúc rẽ nhánh `if`, `else if`, `else`, khối lệnh `{}`, toán tử so sánh (`==`, `!=`, `<`, `<=`, `>`, `>=`), toán tử logic (`&&`, `||`, `!`), cơ chế đoản mạch (Short-Circuit), `switch-case`, `break`, `default`, toán tử 3 ngôi `? :` và kỹ thuật Early Return.
> **Quy ước:** Tuyệt đối không dùng vòng lặp (`for`, `while`), không dùng mảng (`array`, `vector`).

---

## Bài 1: Kiểm tra Số Chẵn hay Lẻ (Toán tử 3 ngôi)
* **Mục tiêu:** Áp dụng toán tử chia lấy dư `%` và biểu thức điều kiện 3 ngôi `? :` để xác định tính chẵn lẻ của một số nguyên.
* **Mô tả:** Nhập vào một số nguyên N từ bàn phím. Hãy in ra `CHAN` nếu N là số chẵn, hoặc in ra `LE` nếu N là số lẻ.
* **Ràng buộc:** Bắt buộc sử dụng toán tử 3 ngôi để chọn chuỗi kết quả.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).
* **Đầu ra (Output):** In ra `CHAN` hoặc `LE`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
8
```

**Khung Đầu ra (Output):**
```text
CHAN
```

**Giải thích chi tiết:**
* Số 8 chia hết cho 2 (8 % 2 == 0) nên là số chẵn.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      std::cout << ((n % 2 == 0) ? "CHAN" : "LE") << '\n';
      return 0;
  }
  ```

---

## Bài 2: Tìm Số Lớn Nhất trong 2 số
* **Mục tiêu:** Sử dụng cấu trúc `if-else if-else` cơ bản để so sánh hai số nguyên.
* **Mô tả:** Nhập vào hai số nguyên a và b từ bàn phím. Hãy in ra số có giá trị lớn hơn. Nếu hai số bằng nhau, in ra dòng chữ `BANG NHAU`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên a và b cách nhau một khoảng trắng (-10^9 <= a, b <= 10^9).
* **Đầu ra (Output):** Số lớn hơn hoặc chuỗi `BANG NHAU`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
15 42
```

**Khung Đầu ra (Output):**
```text
42
```

**Giải thích chi tiết:**
* So sánh 15 và 42, ta thấy 42 > 15 nên in ra 42.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      if (a > b) {
          std::cout << a << '\n';
      } else if (b > a) {
          std::cout << b << '\n';
      } else {
          std::cout << "BANG NHAU\n";
      }

      return 0;
  }
  ```

---

## Bài 3: Phân loại Số Dương, Âm hay Bằng Không
* **Mục tiêu:** Rèn luyện phản xạ xây dựng chuỗi điều kiện 3 nhánh hoàn chỉnh.
* **Mô tả:** Nhập vào một số nguyên N. Hãy in ra:
  * `DUONG` nếu N > 0.
  * `AM` nếu N < 0.
  * `KHONG` nếu N == 0.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).
* **Đầu ra (Output):** Chuỗi ký tự tương ứng: `DUONG`, `AM` hoặc `KHONG`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
-75
```

**Khung Đầu ra (Output):**
```text
AM
```

**Giải thích chi tiết:**
* Số -75 nhỏ hơn 0 nên in ra `AM`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      if (n > 0) {
          std::cout << "DUONG\n";
      } else if (n < 0) {
          std::cout << "AM\n";
      } else {
          std::cout << "KHONG\n";
      }

      return 0;
  }
  ```

---

## Bài 4: Kiểm tra Tuổi Bầu Cử (Kỹ thuật Early Return)
* **Mục tiêu:** Áp dụng kỹ thuật Early Return để xử lý và kết thúc luồng chương trình nhanh chóng, giữ cấu trúc code mạch lạc.
* **Mô tả:** Nhập vào tuổi của một công dân. Theo quy định pháp luật:
  * Nếu tuổi hợp lệ và từ 18 tuổi trở lên, in: `DU TUOI`.
  * Nếu tuổi hợp lệ nhưng dưới 18 tuổi, in: `CHUA DU TUOI`.
  * Nếu tuổi < 0 hoặc tuổi > 150 (dữ liệu không hợp lý), in: `KHONG HOP LE`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên Tuoi (-1000 <= Tuoi <= 1000).
* **Đầu ra (Output):** `DU TUOI`, `CHUA DU TUOI` hoặc `KHONG HOP LE`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
19
```

**Khung Đầu ra (Output):**
```text
DU TUOI
```

**Giải thích chi tiết:**
* 19 nằm trong khoảng hợp lệ và >= 18 nên đủ tuổi tham gia bầu cử.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int tuoi = 0;
      std::cin >> tuoi;

      if (tuoi < 0 || tuoi > 150) {
          std::cout << "KHONG HOP LE\n";
          return 0; // Early Return thoát sớm
      }

      if (tuoi >= 18) {
          std::cout << "DU TUOI\n";
      } else {
          std::cout << "CHUA DU TUOI\n";
      }

      return 0;
  }
  ```

---

## Bài 5: Tra cứu Thứ trong Tuần (switch-case)
* **Mục tiêu:** Sử dụng cấu trúc rẽ nhánh `switch-case` với từ khóa `break` và nhánh `default` an toàn.
* **Mô tả:** Nhập vào một số nguyên từ 2 đến 8 đại diện cho ngày trong tuần. Hãy in ra tên thứ tương ứng bằng tiếng Việt không dấu:
  * 2: `Thu Hai`
  * 3: `Thu Ba`
  * 4: `Thu Tu`
  * 5: `Thu Nam`
  * 6: `Thu Sau`
  * 7: `Thu Bay`
  * 8: `Chu Nhat`
  * Các số còn lại: In `KHONG HOP LE`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N.
* **Đầu ra (Output):** Tên thứ tương ứng hoặc `KHONG HOP LE`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
8
```

**Khung Đầu ra (Output):**
```text
Chu Nhat
```

**Giải thích chi tiết:**
* Số 8 ứng với Chủ Nhật theo quy ước lịch Việt Nam.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      switch (n) {
          case 2: std::cout << "Thu Hai\n"; break;
          case 3: std::cout << "Thu Ba\n"; break;
          case 4: std::cout << "Thu Tu\n"; break;
          case 5: std::cout << "Thu Nam\n"; break;
          case 6: std::cout << "Thu Sau\n"; break;
          case 7: std::cout << "Thu Bay\n"; break;
          case 8: std::cout << "Chu Nhat\n"; break;
          default: std::cout << "KHONG HOP LE\n"; break;
      }

      return 0;
  }
  ```

---

## Bài 6: Đánh giá Điểm Học Phần (if-else if)
* **Mục tiêu:** Xếp loại học lực sinh viên dựa trên thang điểm 10 theo thứ tự điều kiện giảm dần.
* **Mô tả:** Nhập vào điểm tổng kết học phần D (số thực, 0 <= D <= 10). Phân loại theo quy định sau:
  * D >= 8.5: `Xuat sac`
  * 7.0 <= D < 8.5: `Gioi`
  * 5.5 <= D < 7.0: `Kha`
  * 4.0 <= D < 5.5: `Trung binh`
  * D < 4.0: `Yeu`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực D (0 <= D <= 10).
* **Đầu ra (Output):** Chuỗi xếp loại học lực tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
7.8
```

**Khung Đầu ra (Output):**
```text
Gioi
```

**Giải thích chi tiết:**
* Điểm 7.8 thỏa mãn 7.0 <= D < 8.5 nên được xếp loại `Gioi`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      double d = 0.0;
      std::cin >> d;

      if (d >= 8.5) {
          std::cout << "Xuat sac\n";
      } else if (d >= 7.0) {
          std::cout << "Gioi\n";
      } else if (d >= 5.5) {
          std::cout << "Kha\n";
      } else if (d >= 4.0) {
          std::cout << "Trung binh\n";
      } else {
          std::cout << "Yeu\n";
      }

      return 0;
  }
  ```

---

## Bài 7: Kiểm tra Ký tự Chữ Hoa, Chữ Thường hay Chữ Số
* **Mục tiêu:** Vận dụng so sánh mã ký tự trong bảng mã ASCII kết hợp toán tử logic `&&`.
* **Mô tả:** Nhập vào một ký tự C bất kỳ từ bàn phím. Xác định ký tự đó thuộc nhóm nào:
  * Nếu C là chữ cái in hoa ('A' đến 'Z'): In `HOA`
  * Nếu C là chữ cái in thường ('a' đến 'z'): In `THUONG`
  * Nếu C là chữ số ('0' đến '9'): In `SO`
  * Ký tự khác: In `KHAC`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự C.
* **Đầu ra (Output):** Chuỗi tương ứng (`HOA`, `THUONG`, `SO`, hoặc `KHAC`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
G
```

**Khung Đầu ra (Output):**
```text
HOA
```

**Giải thích chi tiết:**
* 'G' nằm trong khoảng 'A' đến 'Z' nên là chữ cái in hoa.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      char c = ' ';
      std::cin >> c;

      if (c >= 'A' && c <= 'Z') {
          std::cout << "HOA\n";
      } else if (c >= 'a' && c <= 'z') {
          std::cout << "THUONG\n";
      } else if (c >= '0' && c <= '9') {
          std::cout << "SO\n";
      } else {
          std::cout << "KHAC\n";
      }

      return 0;
  }
  ```

---

## Bài 8: Máy tính Bỏ túi 4 Phép tính Cơ bản
* **Mục tiêu:** Sử dụng `switch-case` để phân nhánh thao tác toán học dựa trên ký tự toán tử và phòng ngừa lỗi chia cho 0.
* **Mô tả:** Nhập vào hai số nguyên a, b và một ký tự toán tử op (`+`, `-`, `*`, `/`). Hãy tính và in ra kết quả của phép tính `a op b`.
* Nếu op là `/` mà b == 0, in ra thông báo: `Loi chia cho 0`.
* Với phép chia `/`, kết quả lấy phần nguyên (chia nguyên).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Gồm số a, ký tự op và số b trên cùng một dòng cách nhau bởi dấu cách.
* **Đầu ra (Output):** Giá trị kết quả hoặc thông báo lỗi.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
20 / 4
```

**Khung Đầu ra (Output):**
```text
5
```

**Giải thích chi tiết:**
* 20 chia 4 được kết quả là 5.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long a = 0, b = 0;
      char op = ' ';
      std::cin >> a >> op >> b;

      switch (op) {
          case '+':
              std::cout << a + b << '\n';
              break;
          case '-':
              std::cout << a - b << '\n';
              break;
          case '*':
              std::cout << a * b << '\n';
              break;
          case '/':
              if (b == 0) {
                  std::cout << "Loi chia cho 0\n";
              } else {
                  std::cout << a / b << '\n';
              }
              break;
          default:
              std::cout << "Toan tu khong hop le\n";
              break;
      }

      return 0;
  }
  ```

---

## Bài 9: Kiểm tra Bội số Đồng thời (Toán tử &&)
* **Mục tiêu:** Luyện tập sử dụng toán tử logic VÀ `&&` để kiểm tra nhiều điều kiện chia hết cùng lúc.
* **Mô tả:** Nhập vào số nguyên dương N. Kiểm tra xem N có đồng thời chia hết cho cả 3 VÀ 5 hay không.
* Nếu thỏa mãn, in ra `YES`. Ngược lại in ra `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^9).
* **Đầu ra (Output):** In ra `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
30
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* 30 % 3 == 0 (đúng) và 30 % 5 == 0 (đúng) -> Cả hai điều kiện đều đúng nên in `YES`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      if (n % 3 == 0 && n % 5 == 0) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
  ```

---

## Bài 10: Trị tuyệt đối không dùng thư viện cmath (Toán tử 3 ngôi)
* **Mục tiêu:** Tự cài đặt hàm trị tuyệt đối dựa trên định nghĩa toán học thuần túy bằng toán tử 3 ngôi.
* **Mô tả:** Nhập vào một số nguyên N bất kỳ. Hãy in ra giá trị tuyệt đối |N| của số đó mà không dùng hàm `abs()` hay `std::abs()` của thư viện `<cmath>`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).
* **Đầu ra (Output):** Giá trị tuyệt đối của N.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
-987654
```

**Khung Đầu ra (Output):**
```text
987654
```

**Giải thích chi tiết:**
* Vì N < 0 nên |N| = -N = -(-987654) = 987654.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long triTuyetDoi = (n >= 0) ? n : -n;

      std::cout << triTuyetDoi << '\n';
      return 0;
  }
  ```
