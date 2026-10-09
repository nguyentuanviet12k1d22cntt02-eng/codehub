# Bộ bài tập Thực hành Tổng hợp Module 5: C++ Cơ bản
## Mức độ: DỄ (EASY) - 10 Bài tập

> **Phạm vi kiến thức:** Mảng tĩnh 1 chiều (Static Array), mảng động std::vector, duyệt mảng xuôi/ngược, truy xuất phần tử theo chỉ số index O(1), Range-based for, tìm kiếm tuyến tính (Linear Search), tìm Min/Max cơ bản, đảo ngược và chèn/xóa phần tử.
> **Quy ước:** Tuyệt đối không dùng mảng 2 chiều, không dùng con trỏ hay cấp phát động thủ công malloc/new.

---

## Bài 1: Nhập và In Mảng Số Nguyên Ngược Chiều (reversePrintArray)
* **Mục tiêu:** Nắm vững cấu trúc mảng 1 chiều, truy xuất phần tử theo chỉ số và duyệt mảng từ cuối về đầu.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1000) và mảng gồm N số nguyên. Hãy in các phần tử của mảng theo thứ tự đảo ngược từ phần tử cuối cùng về phần tử đầu tiên, mỗi số cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Một số nguyên dương N (1 <= N <= 1000).
  * Dòng 2: N số nguyên A[0], A[1], ..., A[N-1] cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Dãy số gồm N phần tử theo thứ tự ngược lại trên cùng một dòng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
10 20 30 40 50
```

**Khung Đầu ra (Output):**
```text
50 40 30 20 10
```

**Giải thích chi tiết:**
* Phần tử cuối cùng là 50 được in đầu tiên, tiếp theo là 40, 30, 20 và phần tử đầu tiên là 10 được in cuối cùng.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      for (int i = n - 1; i >= 0; --i) {
          std::cout << a[i] << (i == 0 ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 2: Tính Tổng và Trung Bình Cộng Các Phần Tử Mảng (sumAverageArray)
* **Mục tiêu:** Duyệt mảng để tích lũy tổng vào biến `long long` tránh tràn số và ép kiểu tính trung bình cộng chính xác.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^5) và mảng N số nguyên.
  * Dòng 1: In tổng của tất cả các phần tử trong mảng.
  * Dòng 2: In giá trị trung bình cộng của mảng lấy chính xác 2 chữ số thập phân.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên cách nhau bởi dấu cách (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Gồm 2 dòng: dòng 1 là tổng, dòng 2 là trung bình cộng với 2 chữ số thập phân.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
4
5 12 7 9
```

**Khung Đầu ra (Output):**
```text
33
8.25
```

**Giải thích chi tiết:**
* Tổng = 5 + 12 + 7 + 9 = 33.
* Trung bình cộng = 33 / 4 = 8.25.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>
  #include <iomanip>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> a(n);
      long long tong = 0;
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
          tong += a[i];
      }

      double tbc = static_cast<double>(tong) / n;

      std::cout << tong << '\n';
      std::cout << std::fixed << std::setprecision(2) << tbc << '\n';

      return 0;
  }
  ```

---

## Bài 3: Tìm Phần Tử Lớn Nhất và Vị Trí Đầu Tiên Xuất Hiện (findMaxIndex)
* **Mục tiêu:** Áp dụng thuật toán tìm kiếm cực trị trên mảng và ghi nhớ chỉ số (Index).
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^5) và mảng N số nguyên. Hãy tìm giá trị lớn nhất trong mảng và chỉ số đầu tiên (0-indexed) đạt giá trị đó. In ra giá trị lớn nhất và chỉ số cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^18 <= A[i] <= 10^18).
* **Đầu ra (Output):** Giá trị lớn nhất và chỉ số đầu tiên của nó (0-indexed).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
3 9 1 9 4 2
```

**Khung Đầu ra (Output):**
```text
9 1
```

**Giải thích chi tiết:**
* Giá trị lớn nhất trong mảng là 9, xuất hiện lần đầu tiên tại vị trí chỉ số 1.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      long long maxVal = a[0];
      int maxIdx = 0;

      for (int i = 1; i < n; ++i) {
          if (a[i] > maxVal) {
              maxVal = a[i];
              maxIdx = i;
          }
      }

      std::cout << maxVal << " " << maxIdx << '\n';
      return 0;
  }
  ```

---

## Bài 4: Đếm Số Lượng Số Chẵn và Số Lẻ trong Mảng (countEvenOdd)
* **Mục tiêu:** Luyện tập duyệt mảng kết hợp điều kiện phân nhánh toán tử chia dư `%`.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^5) và mảng N số nguyên. Hãy đếm xem trong mảng có bao nhiêu số chẵn và bao nhiêu số lẻ. In hai kết quả cách nhau một khoảng trắng (số chẵn trước, số lẻ sau).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Hai số nguyên tương ứng là số lượng số chẵn và số lượng số lẻ.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
2 7 4 9 6
```

**Khung Đầu ra (Output):**
```text
3 2
```

**Giải thích chi tiết:**
* Các số chẵn: {2, 4, 6} (3 số).
* Các số lẻ: {7, 9} (2 số).

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      int demChan = 0, demLe = 0;
      for (int i = 0; i < n; ++i) {
          long long x = 0;
          std::cin >> x;
          if (x % 2 == 0) demChan++;
          else demLe++;
      }

      std::cout << demChan << " " << demLe << '\n';
      return 0;
  }
  ```

---

## Bài 5: Tìm Kiếm Tuyến Tính Phần Tử X (linearSearch)
* **Mục tiêu:** Cài đặt thuật toán tìm kiếm tuần tự (Linear Search) cơ bản với độ phức tạp thời gian O(N).
* **Mô tả:** Cho mảng gồm N số nguyên và một giá trị cần tìm X. Hãy tìm vị trí xuất hiện đầu tiên của X trong mảng (tính theo chỉ số từ 0). Nếu tìm thấy, in ra chỉ số đó; nếu X không tồn tại trong mảng, in ra `-1`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên N và X (1 <= N <= 10^5, -10^9 <= X <= 10^9).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng.
* **Đầu ra (Output):** Chỉ số đầu tiên tìm thấy X (0-indexed) hoặc -1.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6 25
10 15 20 25 30 25
```

**Khung Đầu ra (Output):**
```text
3
```

**Giải thích chi tiết:**
* Số 25 xuất hiện lần đầu tiên tại vị trí chỉ số 3 (A[3] = 25).

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      long long x = 0;
      if (!(std::cin >> n >> x) || n <= 0) return 0;

      std::vector<long long> a(n);
      int viTri = -1;

      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
          if (a[i] == x && viTri == -1) {
              viTri = i;
          }
      }

      std::cout << viTri << '\n';
      return 0;
  }
  ```

---

## Bài 6: Đảo Ngược Mảng Tại Chỗ Bằng Hai Con Trỏ (reverseArrayInplace)
* **Mục tiêu:** Áp dụng kỹ thuật hai con trỏ (Two Pointers) từ hai đầu mảng `left = 0, right = N - 1` để đảo ngược mảng tại chỗ với O(1) bộ nhớ phụ.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1000) và mảng N số nguyên. Hãy thực hiện đảo ngược mảng trực tiếp trên bộ nhớ (in-place) bằng cách hoán vị `std::swap(A[left], A[right])`. In mảng sau khi đảo ngược ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).
  * Dòng 2: N số nguyên cách nhau bởi dấu cách.
* **Đầu ra (Output):** Dãy số sau khi đảo ngược.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
1 2 3 4 5 6
```

**Khung Đầu ra (Output):**
```text
6 5 4 3 2 1
```

**Giải thích chi tiết:**
* Các cặp (1, 6), (2, 5), (3, 4) được hoán vị lần lượt để thu được mảng đảo ngược hoàn chỉnh.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>
  #include <utility>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      int left = 0, right = n - 1;
      while (left < right) {
          std::swap(a[left], a[right]);
          left++;
          right--;
      }

      for (int i = 0; i < n; ++i) {
          std::cout << a[i] << (i == n - 1 ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 7: Lọc Các Số Nguyên Tố Trong Mảng (filterPrimeNumbers)
* **Mục tiêu:** Kết hợp hàm kiểm tra số nguyên tố với thao tác duyệt lọc phần tử mảng.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1000) và mảng N số nguyên. Hãy in ra tất cả các số nguyên tố có trong mảng theo đúng thứ tự xuất hiện ban đầu, mỗi số cách nhau một khoảng trắng. Nếu mảng không có số nguyên tố nào, in ra chuỗi `NONE`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Các số nguyên tố tìm được cách nhau bởi dấu cách, hoặc NONE.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
7
4 7 12 13 1 2 15
```

**Khung Đầu ra (Output):**
```text
7 13 2
```

**Giải thích chi tiết:**
* Các số 7, 13, 2 là số nguyên tố và được in ra theo đúng thứ tự. Số 1 và các hợp số 4, 12, 15 bị loại bỏ.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  bool laNguyenTo(long long n) {
      if (n < 2) return false;
      for (long long i = 2; i * i <= n; ++i) {
          if (n % i == 0) return false;
      }
      return true;
  }

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> primes;
      for (int i = 0; i < n; ++i) {
          long long x = 0;
          std::cin >> x;
          if (laNguyenTo(x)) {
              primes.push_back(x);
          }
      }

      if (primes.empty()) {
          std::cout << "NONE\n";
      } else {
          for (size_t i = 0; i < primes.size(); ++i) {
              std::cout << primes[i] << (i + 1 == primes.size() ? "" : " ");
          }
          std::cout << '\n';
      }

      return 0;
  }
  ```

---

## Bài 8: Kiểm Tra Mảng Đã Được Sắp Xếp Tăng Dần Chưa (isSortedAscending)
* **Mục tiêu:** Rèn luyện kỹ năng so sánh hai phần tử liền kề `A[i]` và `A[i + 1]` trong vòng lặp kiểm tra.
* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^5) và mảng N số nguyên. Hãy kiểm tra xem mảng đã được sắp xếp theo thứ tự không giảm (tăng dần hoặc bằng nhau: A[0] <= A[1] <= ... <= A[N-1]) hay chưa. In ra `YES` nếu đúng, ngược lại in `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng.
* **Đầu ra (Output):** In ra `YES` hoặc `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
2 4 4 7 10
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* 2 <= 4 <= 4 <= 7 <= 10, các phần tử luôn không giảm nên mảng đã được sắp xếp tăng dần.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      bool daSapXep = true;
      for (int i = 0; i < n - 1; ++i) {
          if (a[i] > a[i + 1]) {
              daSapXep = false;
              break;
          }
      }

      std::cout << (daSapXep ? "YES" : "NO") << '\n';
      return 0;
  }
  ```

---

## Bài 9: Xóa Phần Tử Tại Vị Trí K Trong Mảng (deleteElementAtK)
* **Mục tiêu:** Nắm vững thao tác dịch chuyển các phần tử mảng sang trái từ vị trí chỉ số K để xóa một phần tử.
* **Mô tả:** Cho mảng gồm N số nguyên và chỉ số K cần xóa (0 <= K < N). Hãy xóa phần tử tại chỉ số K và in ra mảng gồm N - 1 phần tử còn lại, mỗi số cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên N và K (1 <= N <= 1000, 0 <= K < N).
  * Dòng 2: N số nguyên cách nhau bởi dấu cách.
* **Đầu ra (Output):** N - 1 số nguyên sau khi xóa phần tử tại chỉ số K.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5 2
10 20 30 40 50
```

**Khung Đầu ra (Output):**
```text
10 20 40 50
```

**Giải thích chi tiết:**
* Phần tử tại chỉ số 2 là 30 bị xóa bỏ. Các phần tử còn lại là {10, 20, 40, 50}.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0, k = 0;
      if (!(std::cin >> n >> k) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      // Xóa phần tử tại chỉ số k bằng std::vector::erase hoặc dồn mảng
      if (k >= 0 && k < n) {
          a.erase(a.begin() + k);
      }

      for (size_t i = 0; i < a.size(); ++i) {
          std::cout << a[i] << (i + 1 == a.size() ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 10: Chèn Phần Tử X Vào Vị Trí K Trong Mảng (insertElementAtK)
* **Mục tiêu:** Nắm vững thao tác mở rộng mảng và chèn phần tử mới vào vị trí chỉ số K bất kỳ.
* **Mô tả:** Cho mảng gồm N số nguyên. Nhập vị trí chỉ số K (0 <= K <= N) và giá trị X cần chèn. Hãy chèn giá trị X vào vị trí chỉ số K và in ra mảng mới gồm N + 1 phần tử.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng.
  * Dòng 3: Hai số nguyên K và X (0 <= K <= N, -10^9 <= X <= 10^9).
* **Đầu ra (Output):** N + 1 số nguyên của mảng sau khi chèn.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
4
1 2 4 5
2 99
```

**Khung Đầu ra (Output):**
```text
1 2 99 4 5
```

**Giải thích chi tiết:**
* Chèn số 99 vào vị trí chỉ số 2. Các phần tử từ vị trí 2 cũ bị đẩy lùi sang phải 1 bước: kết quả là {1, 2, 99, 4, 5}.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      int k = 0;
      long long x = 0;
      std::cin >> k >> x;

      if (k >= 0 && k <= static_cast<int>(a.size())) {
          a.insert(a.begin() + k, x);
      }

      for (size_t i = 0; i < a.size(); ++i) {
          std::cout << a[i] << (i + 1 == a.size() ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```
