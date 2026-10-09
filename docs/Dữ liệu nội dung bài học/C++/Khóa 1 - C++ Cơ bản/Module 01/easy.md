# BÀI TẬP THỰC HÀNH C++ CƠ BẢN - MODULE 01 (CẤP ĐỘ: DỄ)

> **Phạm vi kiến thức áp dụng (Chỉ thuộc Module 01):**
> * Cấu trúc chương trình C++ (`#include <iostream>`, `int main()`, `return 0;`)
> * Nhập/Xuất chuẩn qua bàn phím và màn hình (`std::cin`, `std::cout`, `'\n'`)
> * Biến, Hằng số (`const`), Kiểu dữ liệu nguyên thủy (`int`, `long long`, `double`, `char`, `bool`)
> * Toán tử số học cơ bản (`+`, `-`, `*`, `/`, `%`) và gán kết hợp (`+=`, `-=`, `*=`, `/=`)
> * **TUYỆT ĐỐI KHÔNG DÙNG:** Cấu trúc rẽ nhánh (`if/else`), vòng lặp (`for/while`), hàm con hay mảng.

---

## Bài 1: Lời chào lập trình viên C++
* **Mục tiêu:** Nắm vững cấu trúc chương trình C++ tối giản và lệnh in nhiều dòng bằng `std::cout`.
* **Mô tả:** Viết chương trình in ra thông điệp chào mừng sau đây ra màn hình (mỗi câu nằm trên 1 dòng riêng biệt):
  ```text
  Chao mung ban den voi ngon ngu C++!
  Phien ban chuan: C++17.
  Chuc ban hoc tot!
  ```

### Quy cách dữ liệu:
* **Đầu vào (Input):** Không có dữ liệu đầu vào.
* **Đầu ra (Output):** 3 dòng văn bản chính xác như mô tả.
* **Ràng buộc:** Bắt buộc sử dụng `std::cout` và ký tự xuống dòng `'\n'`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
(Không có đầu vào)
```

**Khung Đầu ra (Output):**
```text
Chao mung ban den voi ngon ngu C++!
Phien ban chuan: C++17.
Chuc ban hoc tot!
```

**Giải thích:** Chương trình in lần lượt 3 dòng chữ ra màn hình console và kết thúc bằng `return 0;`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      std::cout << "Chao mung ban den voi ngon ngu C++!\n";
      std::cout << "Phien ban chuan: C++17.\n";
      std::cout << "Chuc ban hoc tot!\n";
      return 0;
  }
  ```

---

## Bài 2: Tính tổng, hiệu và tích của hai số nguyên
* **Mục tiêu:** Sử dụng `std::cin` để nhận dữ liệu và thực hiện các phép toán số học `+`, `-`, `*`.
* **Mô tả:** Nhập vào hai số nguyên a và b từ bàn phím. Hãy tính và in ra:
  * Dòng 1: Tổng của a và b (a + b)
  * Dòng 2: Hiệu của a trừ b (a - b)
  * Dòng 3: Tích của a và b (a * b)

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên a và b cách nhau bởi dấu cách (-10000 <= a, b <= 10000).
* **Đầu ra (Output):** 3 dòng tương ứng lần lượt là tổng, hiệu và tích.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
12 5
```

**Khung Đầu ra (Output):**
```text
17
7
60
```

**Giải thích chi tiết:**
* Tổng: 12 + 5 = 17
* Hiệu: 12 - 5 = 7
* Tích: 12 * 5 = 60

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int a = 0, b = 0;
      std::cin >> a >> b;

      std::cout << a + b << '\n';
      std::cout << a - b << '\n';
      std::cout << a * b << '\n';

      return 0;
  }
  ```

---

## Bài 3: Chu vi và Diện tích Hình chữ nhật
* **Mục tiêu:** Khai báo biến, thực hiện biểu thức số học có dấu ngoặc và gán kết quả.
* **Mô tả:** Một mảnh đất hình chữ nhật có chiều dài d và chiều rộng r là các số nguyên dương. Viết chương trình tính chu vi và diện tích mảnh đất.
  * Chu vi = 2 * (d + r)
  * Diện tích = d * r

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương d, r (1 <= d, r <= 1000).
* **Đầu ra (Output):** Chu vi và diện tích in trên cùng một dòng, cách nhau một khoảng trắng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
8 5
```

**Khung Đầu ra (Output):**
```text
26 40
```

**Giải thích chi tiết:**
* Chu vi = 2 * (8 + 5) = 2 * 13 = 26.
* Diện tích = 8 * 5 = 40.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int d = 0, r = 0;
      std::cin >> d >> r;

      int chuVi = 2 * (d + r);
      int dienTich = d * r;

      std::cout << chuVi << " " << dienTich << '\n';
      return 0;
  }
  ```

---

## Bài 4: Phép chia lấy nguyên và chia lấy dư (Chia kẹo)
* **Mục tiêu:** Hiểu rõ sự khác biệt giữa toán tử chia nguyên `/` và chia lấy dư `%` trên kiểu `int`.
* **Mô tả:** Cô giáo có N cái kẹo cần chia đều cho K bạn học sinh. Em hãy tính xem mỗi bạn được nhận bao nhiêu cái kẹo trọn vẹn và còn thừa lại bao nhiêu cái không thể chia đều.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương N và K (K > 0, N >= 0).
* **Đầu ra (Output):** Hai số nguyên cách nhau một khoảng trắng: số kẹo mỗi bạn nhận và số kẹo còn dư.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
27 5
```

**Khung Đầu ra (Output):**
```text
5 2
```

**Giải thích chi tiết:**
* 27 chia 5 được thương là 5 (mỗi bạn nhận 5 cái kẹo).
* 27 chia 5 dư 2 (còn thừa 2 cái kẹo không thể chia tiếp).

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0, k = 0;
      std::cin >> n >> k;

      int moiBan = n / k;
      int conDu = n % k;

      std::cout << moiBan << " " << conDu << '\n';
      return 0;
  }
  ```

---

## Bài 5: Cập nhật biến với toán tử gán rút gọn
* **Mục tiêu:** Sử dụng các toán tử gán kết hợp (`+=`, `-=`, `*=`).
* **Mô tả:** Ban đầu bạn có một tài khoản tiết kiệm với số tiền S nghìn đồng.
  1. Bạn được thưởng thêm X nghìn đồng (`S += X`).
  2. Bạn mua đồ dùng học tập hết Y nghìn đồng (`S -= Y`).
  3. Số tiền còn lại được ngân hàng nhân đôi lên nhân dịp khuyến mãi (`S *= 2`).
  Hãy in ra số tiền cuối cùng trong tài khoản của bạn.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên S, X, Y (S >= 0, X >= 0, Y >= 0, S + X >= Y).
* **Đầu ra (Output):** Một số nguyên duy nhất là số tiền sau 3 bước cập nhật.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
100 50 30
```

**Khung Đầu ra (Output):**
```text
240
```

**Giải thích chi tiết:**
* Ban đầu S = 100.
* Thưởng thêm 50: S = 100 + 50 = 150.
* Tiêu dùng 30: S = 150 - 30 = 120.
* Nhân đôi: S = 120 * 2 = 240 nghìn đồng.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int s = 0, x = 0, y = 0;
      std::cin >> s >> x >> y;

      s += x; // Thưởng thêm x
      s -= y; // Tiêu dùng y
      s *= 2; // Nhân đôi

      std::cout << s << '\n';
      return 0;
  }
  ```

---

## Bài 6: Đổi nhiệt độ từ Celsius sang Fahrenheit
* **Mục tiêu:** Làm việc với kiểu dữ liệu số thực `double` và phép nhân chia số thực.
* **Mô tả:** Viết chương trình nhập vào nhiệt độ C (độ Celsius). Hãy chuyển đổi và in ra nhiệt độ tương ứng theo thang độ Fahrenheit (F).
* **Công thức:** `F = C * 1.8 + 32`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực C (kiểu `double`).
* **Đầu ra (Output):** Một số thực F kết quả.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
25.5
```

**Khung Đầu ra (Output):**
```text
77.9
```

**Giải thích chi tiết:**
`F = 25.5 * 1.8 + 32 = 45.9 + 32 = 77.9` độ Fahrenheit.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      double c = 0.0;
      std::cin >> c;

      double f = c * 1.8 + 32.0;

      std::cout << f << '\n';
      return 0;
  }
  ```

---

## Bài 7: Tìm ký tự liền sau trong bảng mã ASCII
* **Mục tiêu:** Hiểu bản chất kiểu ký tự `char` được ánh xạ qua số nguyên mã ASCII, sử dụng toán tử tăng `++`.
* **Mô tả:** Nhập vào một ký tự chữ cái thường c (từ `'a'` đến `'y'`). Hãy in ra ký tự đứng ngay sau nó trong bảng chữ cái tiếng Anh.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự c kiểu `char`.
* **Đầu ra (Output):** Ký tự liền sau c.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
m
```

**Khung Đầu ra (Output):**
```text
n
```

**Giải thích chi tiết:**
Ký tự đứng ngay sau chữ `'m'` là chữ `'n'` (mã ASCII của 'm' là 109, tăng lên 1 thành 110 là mã của 'n').

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      char c = ' ';
      std::cin >> c;

      c++; // Tăng mã ASCII lên 1 đơn vị
      std::cout << c << '\n';

      return 0;
  }
  ```

---

## Bài 8: Khám phá kiểu Logic (bool)
* **Mục tiêu:** Khởi tạo biến `bool`, hiểu cách C++ hiển thị giá trị `true` là `1` và `false` là `0`.
* **Mô tả:** Viết chương trình khai báo một biến `bool` mang tên `daHoanThanhBaiHoc` và gán giá trị `true`. Tiếp tục khai báo biến `bool` mang tên `canXemLai` và gán giá trị `false`. Xuất lần lượt giá trị của hai biến ra màn hình trên cùng một dòng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Không có dữ liệu đầu vào.
* **Đầu ra (Output):** Giá trị số nguyên đại diện cho `true` và `false` trong C++.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
(Không có đầu vào)
```

**Khung Đầu ra (Output):**
```text
1 0
```

**Giải thích chi tiết:** Trong C++, giá trị logic `true` được xuất thành số `1`, còn giá trị `false` được xuất thành số `0`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      bool daHoanThanhBaiHoc = true;
      bool canXemLai = false;

      std::cout << daHoanThanhBaiHoc << " " << canXemLai << '\n';
      return 0;
  }
  ```

---

## Bài 9: Hằng số tính Chu vi và Diện tích Hình tròn
* **Mục tiêu:** Sử dụng từ khóa `const` để bảo vệ hằng số toán học không bị ghi đè.
* **Mô tả:** Nhập vào bán kính R (R > 0) của một hình tròn. Định nghĩa hằng số `PI = 3.14159` bằng từ khóa `const double`. Tính chu vi và diện tích của hình tròn.
  * Chu vi = `2 * PI * R`
  * Diện tích = `PI * R * R`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực R (kiểu `double`).
* **Đầu ra (Output):** Chu vi và diện tích trên 2 dòng riêng biệt.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
4.5
```

**Khung Đầu ra (Output):**
```text
28.2743
63.6172
```

**Giải thích chi tiết:**
* Chu vi = 2 * 3.14159 * 4.5 = 28.2743
* Diện tích = 3.14159 * 4.5 * 4.5 = 63.6172

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      const double PI = 3.14159;
      double r = 0.0;
      std::cin >> r;

      double chuVi = 2 * PI * r;
      double dienTich = PI * r * r;

      std::cout << chuVi << '\n';
      std::cout << dienTich << '\n';

      return 0;
  }
  ```

---

## Bài 10: Hoán đổi giá trị hai biến dùng biến trung gian
* **Mục tiêu:** Luyện tư duy gán giá trị ô nhớ tuần tự, không bị mất dữ liệu ban đầu.
* **Mô tả:** Nhập vào hai số nguyên A và B. Hãy hoán đổi giá trị của A và B cho nhau (bằng cách dùng một biến tạm `temp`), sau đó in ra giá trị mới của A và B.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên A, B cách nhau bởi dấu cách.
* **Đầu ra (Output):** Hai số A, B sau khi đã đổi chỗ.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
10 99
```

**Khung Đầu ra (Output):**
```text
99 10
```

**Giải thích chi tiết:**
Biến tạm `temp` lưu giữ giá trị 10 của A, sau đó gán A = B (99), rồi gán B = temp (10). Kết quả A và B đã hoán đổi hoàn hảo.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int a = 0, b = 0;
      std::cin >> a >> b;

      // Dùng biến tạm để lưu trữ giá trị của a trước khi bị ghi đè
      int temp = a;
      a = b;
      b = temp;

      std::cout << a << " " << b << '\n';
      return 0;
  }
  ```
