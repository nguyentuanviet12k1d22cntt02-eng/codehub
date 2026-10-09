# BÀI TẬP THỰC HÀNH C++ CƠ BẢN - MODULE 01 (CẤP ĐỘ: TRUNG BÌNH)

> **Phạm vi kiến thức áp dụng (Chỉ thuộc Module 01):**
> * Cấu trúc chương trình C++ (`#include <iostream>`, `int main()`, `return 0;`)
> * Nhập/Xuất chuẩn (`std::cin`, `std::cout`, `'\n'`)
> * Kiểu dữ liệu nguyên thủy (`int`, `long long`, `double`, `char`, `bool`)
> * Toán tử số học (`+`, `-`, `*`, `/`, `%`), phân biệt chia nguyên `/` và chia dư `%`
> * Ép kiểu tường minh bằng `static_cast<double>` và `static_cast<char>`
> * Phân biệt tiền tố (`++x`) và hậu tố (`x++`)
> * **TUYỆT ĐỐI KHÔNG DÙNG:** Cấu trúc rẽ nhánh (`if/else`), vòng lặp (`for/while`), hàm con hay mảng.

---

## Bài 11: Điểm trung bình ba môn (Bẫy chia số nguyên)
* **Mục tiêu:** Nhận biết cạm bẫy chia hai số nguyên trong C++ và áp dụng ép kiểu `static_cast<double>`.
* **Mô tả:** Nhập vào điểm thi 3 môn Toán, Văn, Anh của một học sinh là các số nguyên từ 0 đến 10. Hãy tính và in ra điểm trung bình cộng của 3 môn này dưới dạng số thực `double`.
* **Cạm bẫy cần tránh:** Nếu viết `(toan + van + anh) / 3`, C++ sẽ thực hiện phép chia nguyên và vứt bỏ toàn bộ phần thập phân. Cần ép kiểu sang `double` trước khi chia.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên cách nhau một khoảng trắng.
* **Đầu ra (Output):** Một số thực duy nhất là điểm trung bình cộng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
8 7 8
```

**Khung Đầu ra (Output):**
```text
7.66667
```

**Giải thích chi tiết:**
Tổng điểm = 8 + 7 + 8 = 23. Điểm trung bình = 23 / 3 = 7.66667.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int toan = 0, van = 0, anh = 0;
      std::cin >> toan >> van >> anh;

      int tongDiem = toan + van + anh;
      double diemTB = static_cast<double>(tongDiem) / 3.0;

      std::cout << diemTB << '\n';
      return 0;
  }
  ```

---

## Bài 12: Đổi thời gian từ Giây sang Giờ - Phút - Giây
* **Mục tiêu:** Vận dụng linh hoạt kết hợp phép chia lấy nguyên `/` và chia lấy dư `%`.
* **Mô tả:** Nhập vào tổng số giây N (N >= 0). Hãy quy đổi thời gian trên thành số giờ, số phút và số giây tương ứng.
* **Quy tắc tính:**
  * 1 giờ = 3600 giây
  * 1 phút = 60 giây

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (0 <= N <= 86400).
* **Đầu ra (Output):** Ba số nguyên lần lượt là số Giờ, số Phút, số Giây cách nhau bởi dấu hai chấm `:`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3754
```

**Khung Đầu ra (Output):**
```text
1:2:34
```

**Giải thích chi tiết:**
* 3754 / 3600 = 1 giờ, số giây còn lại là 3754 % 3600 = 154 giây.
* 154 / 60 = 2 phút, số giây còn lại là 154 % 60 = 34 giây.
* Kết quả: 1:2:34.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      int gio = n / 3600;
      int duGiay = n % 3600;
      int phut = duGiay / 60;
      int giay = duGiay % 60;

      std::cout << gio << ":" << phut << ":" << giay << '\n';
      return 0;
  }
  ```

---

## Bài 13: Tách và tính tổng các chữ số của số có 3 chữ số
* **Mục tiêu:** Kỹ thuật bóc tách từng chữ số của một số nguyên bằng toán tử `/` và `%`.
* **Mô tả:** Nhập vào một số nguyên dương N có đúng 3 chữ số (từ 100 đến 999). Hãy bóc tách chữ số hàng trăm, hàng chục, hàng đơn vị và in ra tổng của 3 chữ số này.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N.
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng các chữ số.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
845
```

**Khung Đầu ra (Output):**
```text
17
```

**Giải thích chi tiết:**
* Hàng trăm: 845 / 100 = 8.
* Hàng chục: (845 / 10) % 10 = 84 % 10 = 4.
* Hàng đơn vị: 845 % 10 = 5.
* Tổng = 8 + 4 + 5 = 17.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      int hangTram = n / 100;
      int hangChuc = (n / 10) % 10;
      int hangDonVi = n % 10;

      int tong = hangTram + hangChuc + hangDonVi;

      std::cout << tong << '\n';
      return 0;
  }
  ```

---

## Bài 14: Đảo ngược số nguyên có 2 chữ số
* **Mục tiêu:** Tách chữ số và tái cấu trúc lại giá trị số học mới.
* **Mô tả:** Nhập vào một số nguyên dương N có 2 chữ số (10 <= N <= 99). Hãy tạo ra và in ra số đảo ngược của N.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N.
* **Đầu ra (Output):** Số đảo ngược của N.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
73
```

**Khung Đầu ra (Output):**
```text
37
```

**Giải thích chi tiết:**
Số 73 có hàng chục là 7, hàng đơn vị là 3. Số đảo ngược là `3 * 10 + 7 = 37`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      int chuc = n / 10;
      int donVi = n % 10;

      int daoNguoc = donVi * 10 + chuc;

      std::cout << daoNguoc << '\n';
      return 0;
  }
  ```

---

## Bài 15: Đổi ký tự thường sang ký tự hoa bằng mã ASCII
* **Mục tiêu:** Hiểu quy luật mã ASCII và ép kiểu nguyên về ký tự `static_cast<char>`.
* **Mô tả:** Trong bảng mã ASCII, mã của chữ thường `'a'` là 97, còn mã của chữ hoa `'A'` là 65. Khoảng cách chênh lệch giữa chữ thường và chữ hoa luôn là 32. Nhập vào một ký tự thường c (từ `'a'` đến `'z'`), hãy in ra ký tự in hoa tương ứng mà không dùng hàm thư viện có sẵn.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự c.
* **Đầu ra (Output):** Ký tự in hoa tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
g
```

**Khung Đầu ra (Output):**
```text
G
```

**Giải thích chi tiết:**
Trừ 32 đơn vị để chuyển từ mã chữ thường sang mã chữ hoa: `static_cast<char>(c - 32)`.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      char c = ' ';
      std::cin >> c;

      char hoa = static_cast<char>(c - 32);

      std::cout << hoa << '\n';
      return 0;
  }
  ```

---

## Bài 16: Tính cước viễn thông và thuế VAT
* **Mục tiêu:** Áp dụng hằng số `const`, tính toán biểu thức tiền tệ số thực.
* **Mô tả:** Một thuê bao điện thoại có cách tính cước hàng tháng như sau:
  * Phí thuê bao cố định hàng tháng: 25000 VNĐ.
  * Mỗi phút gọi tốn 1200 VNĐ.
  * Thuế giá trị gia tăng (VAT) là 10% trên tổng cước phí dịch vụ.
  Nhập vào số phút gọi m trong tháng của khách hàng. Hãy tính tổng số tiền (bao gồm VAT) khách hàng phải thanh toán.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên m (m >= 0).
* **Đầu ra (Output):** Một số thực là tổng tiền cước thanh toán.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
50
```

**Khung Đầu ra (Output):**
```text
93500
```

**Giải thích chi tiết:**
Cước dịch vụ = 25000 + 50 * 1200 = 85000. Thuế VAT 10% = 8500. Tổng tiền = 85000 + 8500 = 93500 VNĐ.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      const int CUOC_CO_DINH = 25000;
      const int GIA_MOI_PHUT = 1200;
      const double VAT = 0.10;

      int m = 0;
      std::cin >> m;

      int cuocDichVu = CUOC_CO_DINH + m * GIA_MOI_PHUT;
      double tongThanhToan = cuocDichVu + cuocDichVu * VAT;

      std::cout << tongThanhToan << '\n';
      return 0;
  }
  ```

---

## Bài 17: Tính tiền mua xăng và tiền thừa hoàn lại
* **Mục tiêu:** Tính toán liên hợp các phép nhân số thực và phép trừ số nguyên.
* **Mô tả:** Bác Nam mang M đồng vào cây xăng. Bác mua L lít xăng với đơn giá P đồng/lít (P là số nguyên, L là số thực). Hãy tính:
  1. Số tiền bác Nam cần trả cho lượng xăng đã mua (lấy phần nguyên).
  2. Số tiền thừa nhân viên cần trả lại cho bác Nam.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba giá trị M (số nguyên), L (số thực), P (số nguyên) trên cùng một dòng.
* **Đầu ra (Output):** Hai số nguyên cách nhau một khoảng trắng: tiền xăng và tiền thừa.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
200000 7.5 24000
```

**Khung Đầu ra (Output):**
```text
180000 20000
```

**Giải thích chi tiết:**
Tiền xăng = 7.5 * 24000 = 180000 VNĐ. Tiền thừa = 200000 - 180000 = 20000 VNĐ.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long m = 0;
      double l = 0.0;
      long long p = 0;

      std::cin >> m >> l >> p;

      long long tienXang = static_cast<long long>(l * p);
      long long tienThua = m - tienXang;

      std::cout << tienXang << " " << tienThua << '\n';
      return 0;
  }
  ```

---

## Bài 18: Thấu hiểu toán tử Tiền tố và Hậu tố (++x vs x++)
* **Mục tiêu:** Củng cố sự khác biệt sống còn giữa toán tử tăng trước (`++x`) và tăng sau (`x++`).
* **Mô tả:** Cho biến nguyên x được nhập từ bàn phím.
  1. Tính `y = x++ * 2`.
  2. Tiếp tục tính `z = ++x * 2`.
  In ra giá trị của y, z và giá trị cuối cùng của x trên cùng một dòng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên x.
* **Đầu ra (Output):** Ba số nguyên y, z, x cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
```

**Khung Đầu ra (Output):**
```text
10 14 7
```

**Giải thích chi tiết:**
* Ban đầu x = 5.
* `y = x++ * 2`: Dùng giá trị cũ x = 5 tính y = 5 * 2 = 10, sau đó x tăng lên 6.
* `z = ++x * 2`: x tăng lên 7 trước, sau đó tính z = 7 * 2 = 14.
* Giá trị cuối cùng của x là 7.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int x = 0;
      std::cin >> x;

      int y = x++ * 2;
      int z = ++x * 2;

      std::cout << y << " " << z << " " << x << '\n';
      return 0;
  }
  ```

---

## Bài 19: Tính lương thực lĩnh sau thuế và bảo hiểm
* **Mục tiêu:** Sử dụng toán tử gán kết hợp và tính toán số thực phần trăm.
* **Mô tả:** Lương thực lĩnh của kỹ sư phần mềm được tính như sau:
  * Lương gộp = Lương cơ bản * Hệ số lương.
  * Trừ bảo hiểm xã hội bắt buộc: 10.5% của Lương gộp.
  * Trừ thuế thu nhập cá nhân: 5% của Lương gộp.
  Nhập vào Lương cơ bản (số nguyên) và Hệ số lương (số thực). Hãy tính và in ra Lương thực lĩnh.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Lương cơ bản (nguyên) và Hệ số (thực) cách nhau bởi dấu cách.
* **Đầu ra (Output):** Lương thực lĩnh (số thực).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
10000000 1.5
```

**Khung Đầu ra (Output):**
```text
12675000
```

**Giải thích chi tiết:**
Lương gộp = 10000000 * 1.5 = 15000000. Tổng trích trừ = 10.5% + 5% = 15.5%. Lương thực lĩnh = 15000000 * (1 - 0.155) = 12675000 VNĐ.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      long long luongCoBan = 0;
      double heSo = 0.0;
      std::cin >> luongCoBan >> heSo;

      double luongGop = luongCoBan * heSo;
      double thucLinh = luongGop * (1.0 - 0.155);

      std::cout << thucLinh << '\n';
      return 0;
  }
  ```

---

## Bài 20: Bình phương khoảng cách hình học phẳng
* **Mục tiêu:** Tính toán biểu thức số học trên tọa độ hai chiều.
* **Mô tả:** Trong mặt phẳng tọa độ Oxy, cho 2 điểm A(x1, y1) và B(x2, y2) có tọa độ là các số nguyên. Khoảng cách Euclidean giữa hai điểm là d = căn bậc hai của `(x2 - x1)^2 + (y2 - y1)^2`. Hãy tính và in ra **bình phương khoảng cách** `d^2 = (x2 - x1)^2 + (y2 - y1)^2`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Bốn số nguyên x1, y1, x2, y2 trên cùng một dòng cách nhau bởi dấu cách.
* **Đầu ra (Output):** Một số nguyên là bình phương khoảng cách giữa hai điểm.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
1 2 4 6
```

**Khung Đầu ra (Output):**
```text
25
```

**Giải thích chi tiết:**
dx = 4 - 1 = 3, dy = 6 - 2 = 4. Bình phương khoảng cách = 3 * 3 + 4 * 4 = 9 + 16 = 25.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>

  int main() {
      int x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      std::cin >> x1 >> y1 >> x2 >> y2;

      int dx = x2 - x1;
      int dy = y2 - y1;
      int dSquared = dx * dx + dy * dy;

      std::cout << dSquared << '\n';
      return 0;
  }
  ```
