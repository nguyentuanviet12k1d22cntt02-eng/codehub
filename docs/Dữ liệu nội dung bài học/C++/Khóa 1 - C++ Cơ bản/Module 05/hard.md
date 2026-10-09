# Bộ bài tập Thực hành Tổng hợp Module 5: C++ Cơ bản
## Mức độ: KHÓ / THỬ THÁCH (HARD) - 10 Bài tập

> **Phạm vi kiến thức:** Thuật toán kinh điển trên mảng 1 chiều (Thuật toán Kadane, Sàng Eratosthenes, Boyer-Moore Majority Vote, Hai con trỏ Two Pointers nâng cao, Trapping Rain Water, biến đổi tại chỗ In-place).
> **Quy ước:** Tuyệt đối không dùng mảng 2 chiều, không dùng con trỏ hay cấp phát động thủ công malloc/new.

---

## Bài 21: Tìm Đoạn Con Liên Tiếp Có Tổng Lớn Nhất (Thuật toán Kadane)
* **Mục tiêu:** Cài đặt thuật toán Kadane tối ưu tìm dãy con liên tiếp có tổng cực đại trong O(N) thời gian và O(1) bộ nhớ phụ.
* **Mô tả:** Cho mảng gồm N số nguyên (có thể có cả số âm). Hãy tìm một đoạn con liên tiếp gồm ít nhất một phần tử sao cho tổng các phần tử trong đoạn con đó là lớn nhất có thể. In ra giá trị tổng lớn nhất đó.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng đoạn con lớn nhất.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
8
-2 -3 4 -1 -2 1 5 -3
```

**Khung Đầu ra (Output):**
```text
7
```

**Giải thích chi tiết:**
* Đoạn con liên tiếp có tổng lớn nhất là {4, -1, -2, 1, 5} với tổng bằng 4 + (-1) + (-2) + 1 + 5 = 7.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>
  #include <algorithm>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      long long currentSum = a[0];
      long long maxSum = a[0];

      for (int i = 1; i < n; ++i) {
          currentSum = std::max(a[i], currentSum + a[i]);
          maxSum = std::max(maxSum, currentSum);
      }

      std::cout << maxSum << '\n';
      return 0;
  }
  ```

---

## Bài 22: Tìm Cặp Phần Tử Có Tổng Bằng K Bằng Hai Con Trỏ (twoSumSorted)
* **Mục tiêu:** Áp dụng kỹ thuật hai con trỏ trên mảng đã sắp xếp để tìm cặp số có tổng bằng K trong O(N).
* **Mô tả:** Cho mảng gồm N số nguyên đã được sắp xếp tăng dần và một số nguyên K. Hãy tìm một cặp chỉ số i < j (1-indexed) sao cho `A[i] + A[j] == K`. Nếu có nhiều cặp thỏa mãn, hãy in ra cặp có chỉ số `i` nhỏ nhất; nếu không tồn tại cặp nào, in ra `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên N và K (2 <= N <= 10^5, -10^9 <= K <= 10^9).
  * Dòng 2: N số nguyên đã sắp xếp tăng dần.
* **Đầu ra (Output):** Hai chỉ số i và j (1-indexed) cách nhau bởi dấu cách, hoặc NO.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5 9
1 2 4 5 7
```

**Khung Đầu ra (Output):**
```text
2 5
```

**Giải thích chi tiết:**
* A[2] = 2 và A[5] = 7, tổng 2 + 7 = 9.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      long long k = 0;
      if (!(std::cin >> n >> k) || n < 2) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      int left = 0, right = n - 1;
      bool timThay = false;

      while (left < right) {
          long long sum = a[left] + a[right];
          if (sum == k) {
              std::cout << (left + 1) << " " << (right + 1) << '\n';
              timThay = true;
              break;
          } else if (sum < k) {
              left++;
          } else {
              right--;
          }
      }

      if (!timThay) {
          std::cout << "NO\n";
      }

      return 0;
  }
  ```

---

## Bài 23: Sàng Số Nguyên Tố Eratosthenes Bằng Mảng Đánh Dấu (sieveOfEratosthenes)
* **Mục tiêu:** Cài đặt thuật toán Sàng Eratosthenes kinh điển bằng mảng đánh dấu `bool` để tìm tất cả các số nguyên tố trong O(N log log N).
* **Mô tả:** Nhập vào một số nguyên dương N (2 <= N <= 10^6). Hãy sử dụng thuật toán Sàng Eratosthenes để:
  * Dòng 1: In số lượng số nguyên tố không vượt quá N.
  * Dòng 2: In danh sách tất cả các số nguyên tố đó theo thứ tự tăng dần, mỗi số cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (2 <= N <= 10^6).
* **Đầu ra (Output):** Dòng 1 là số lượng, dòng 2 là danh sách các số nguyên tố.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
20
```

**Khung Đầu ra (Output):**
```text
8
2 3 5 7 11 13 17 19
```

**Giải thích chi tiết:**
* Có 8 số nguyên tố <= 20: 2, 3, 5, 7, 11, 13, 17, 19.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n < 2) return 0;

      std::vector<bool> isPrime(n + 1, true);
      isPrime[0] = isPrime[1] = false;

      for (int i = 2; 1LL * i * i <= n; ++i) {
          if (isPrime[i]) {
              for (int j = i * i; j <= n; j += i) {
                  isPrime[j] = false;
              }
          }
      }

      std::vector<int> primes;
      for (int i = 2; i <= n; ++i) {
          if (isPrime[i]) {
              primes.push_back(i);
          }
      }

      std::cout << primes.size() << '\n';
      for (size_t i = 0; i < primes.size(); ++i) {
          std::cout << primes[i] << (i + 1 == primes.size() ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 24: Thuật Toán Bầu Phiếu Boyer-Moore Tìm Phần Tử Đa Số (majorityElement)
* **Mục tiêu:** Cài đặt thuật toán Boyer-Moore Majority Vote Algorithm tìm phần tử chiếm đa số (> N / 2) với O(N) thời gian và O(1) bộ nhớ phụ.
* **Mô tả:** Cho mảng gồm N số nguyên. Phần tử đa số (Majority Element) là phần tử xuất hiện nhiều hơn N / 2 lần trong mảng. Hãy tìm và in ra phần tử đa số đó. Nếu không tồn tại phần tử nào xuất hiện quá N / 2 lần, in ra `-1`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên cách nhau bởi dấu cách (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Giá trị của phần tử đa số hoặc -1.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
7
2 2 1 1 1 2 2
```

**Khung Đầu ra (Output):**
```text
2
```

**Giải thích chi tiết:**
* Số 2 xuất hiện 4 lần trong mảng 7 phần tử (4 > 7 / 2 = 3.5), nên 2 là phần tử đa số.

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

      // Pha 1: Tìm ứng viên bằng thuật toán Boyer-Moore
      long long ungVien = a[0];
      int count = 1;
      for (int i = 1; i < n; ++i) {
          if (count == 0) {
              ungVien = a[i];
              count = 1;
          } else if (a[i] == ungVien) {
              count++;
          } else {
              count--;
          }
      }

      // Pha 2: Kiểm tra lại tần suất thực tế của ứng viên
      int demThucTe = 0;
      for (int i = 0; i < n; ++i) {
          if (a[i] == ungVien) demThucTe++;
      }

      if (demThucTe > n / 2) {
          std::cout << ungVien << '\n';
      } else {
          std::cout << -1 << '\n';
      }

      return 0;
  }
  ```

---

## Bài 25: Dồn Toàn Bộ Số 0 Về Cuối Mảng Giữ Nguyên Thứ Tự Inplace (moveZeroes)
* **Mục tiêu:** Kỹ thuật con trỏ ghi đè tại chỗ (In-place) không tốn bộ nhớ phụ O(1) để dồn các phần tử đặc biệt.
* **Mô tả:** Cho mảng gồm N số nguyên. Hãy di chuyển tất cả các số 0 về cuối mảng, đồng thời phải giữ nguyên thứ tự tương đối của tất cả các phần tử khác 0 ban đầu. Thao tác phải được thực hiện trực tiếp trên mảng hiện tại mà không tạo thêm mảng phụ thứ hai.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng.
* **Đầu ra (Output):** Mảng sau khi đã dồn tất cả các số 0 về cuối.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
0 1 0 3 12 0
```

**Khung Đầu ra (Output):**
```text
1 3 12 0 0 0
```

**Giải thích chi tiết:**
* Các số khác 0 giữ nguyên thứ tự {1, 3, 12}, ba số 0 được dồn về cuối cùng.

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

      int viTriKhacKhong = 0;
      for (int i = 0; i < n; ++i) {
          if (a[i] != 0) {
              std::swap(a[viTriKhacKhong], a[i]);
              viTriKhacKhong++;
          }
      }

      for (int i = 0; i < n; ++i) {
          std::cout << a[i] << (i == n - 1 ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 26: Xóa Phần Tử Trùng Lặp Trên Mảng Đã Sắp Xếp (removeDuplicatesSorted)
* **Mục tiêu:** Áp dụng kỹ thuật hai con trỏ Slow-Fast để loại bỏ các phần tử trùng lặp tại chỗ.
* **Mô tả:** Cho mảng gồm N số nguyên đã được sắp xếp tăng dần. Hãy loại bỏ các phần tử bị trùng lặp sao cho mỗi phần tử duy nhất chỉ xuất hiện đúng một lần.
  * Dòng 1: In số lượng phần tử duy nhất còn lại K.
  * Dòng 2: In K phần tử duy nhất đó theo thứ tự tăng dần.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên đã sắp xếp tăng dần.
* **Đầu ra (Output):** Gồm 2 dòng: dòng 1 là số lượng K, dòng 2 là K phần tử duy nhất.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
1 1 2 2 3 4
```

**Khung Đầu ra (Output):**
```text
4
1 2 3 4
```

**Giải thích chi tiết:**
* Các phần tử duy nhất là {1, 2, 3, 4} (tổng cộng 4 phần tử).

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

      int slow = 0;
      for (int fast = 1; fast < n; ++fast) {
          if (a[fast] != a[slow]) {
              slow++;
              a[slow] = a[fast];
          }
      }

      int k = slow + 1;
      std::cout << k << '\n';
      for (int i = 0; i < k; ++i) {
          std::cout << a[i] << (i == k - 1 ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 27: Tìm Độ Dài Đoạn Con Dài Nhất Có Tổng Bằng 0 (longestSubarrayZeroSum)
* **Mục tiêu:** Kết hợp mảng tiền tố (Prefix Sum) để nhận diện hai vị trí có cùng giá trị tổng tiền tố `Pref[i] == Pref[j]` thì đoạn giữa có tổng bằng 0.
* **Mô tả:** Cho mảng gồm N số nguyên (1 <= N <= 1000). Hãy tìm độ dài của đoạn con liên tiếp dài nhất có tổng các phần tử đúng bằng 0. Nếu không có đoạn con nào có tổng bằng 0, in ra `0`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Một số nguyên duy nhất là độ dài đoạn con dài nhất có tổng bằng 0.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
1 2 -3 3 1 -4
```

**Khung Đầu ra (Output):**
```text
6
```

**Giải thích chi tiết:**
* Toàn bộ mảng: 1 + 2 + (-3) + 3 + 1 + (-4) = 0. Độ dài lớn nhất là 6.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>
  #include <algorithm>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      int maxLen = 0;
      for (int i = 0; i < n; ++i) {
          long long sum = 0;
          for (int j = i; j < n; ++j) {
              sum += a[j];
              if (sum == 0) {
                  maxLen = std::max(maxLen, j - i + 1);
              }
          }
      }

      std::cout << maxLen << '\n';
      return 0;
  }
  ```

---

## Bài 28: Đếm Số Lượng Cặp Nghịch Thế Trong Mảng (countInversions)
* **Mục tiêu:** Hiểu rõ khái niệm cặp nghịch thế (Inversion Pair) đo độ mất trật tự của mảng.
* **Mô tả:** Cho mảng gồm N số nguyên. Một cặp chỉ số (i, j) được gọi là một cặp nghịch thế nếu:
  * `0 <= i < j < N`
  * `A[i] > A[j]`
  Hãy đếm và in ra tổng số lượng cặp nghịch thế trong mảng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 2000).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng.
* **Đầu ra (Output):** Một số nguyên duy nhất là số cặp nghịch thế.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
2 4 1 3 5
```

**Khung Đầu ra (Output):**
```text
3
```

**Giải thích chi tiết:**
* Các cặp nghịch thế là: (2, 1) vì A[0] > A[2], (4, 1) vì A[1] > A[2], và (4, 3) vì A[1] > A[3]. Tổng cộng 3 cặp.

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

      long long count = 0;
      for (int i = 0; i < n - 1; ++i) {
          for (int j = i + 1; j < n; ++j) {
              if (a[i] > a[j]) {
                  count++;
              }
          }
      }

      std::cout << count << '\n';
      return 0;
  }
  ```

---

## Bài 29: Tìm Số Còn Thiếu Trong Dãy Số Từ 1 Đến N+1 (findMissingNumber)
* **Mục tiêu:** Áp dụng kỹ thuật tổng Gauss hoặc toán tử XOR để tìm phần tử duy nhất bị thiếu trong O(N) thời gian và O(1) bộ nhớ phụ.
* **Mô tả:** Cho mảng gồm N số nguyên phân biệt đôi một, tất cả các số đều nằm trong khoảng từ 1 đến N + 1. Điều này có nghĩa là có đúng 1 số nguyên trong khoảng [1, N + 1] bị thiếu. Hãy tìm số nguyên bị thiếu đó.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên phân biệt trong khoảng [1, N + 1].
* **Đầu ra (Output):** Một số nguyên duy nhất là số bị thiếu.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
1 2 4 6 3
```

**Khung Đầu ra (Output):**
```text
5
```

**Giải thích chi tiết:**
* Dãy số đầy đủ từ 1 đến 6 là {1, 2, 3, 4, 5, 6}. Mảng gồm {1, 2, 4, 6, 3} nên số bị thiếu là 5.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      long long xorAll = 0;
      for (int i = 1; i <= n + 1; ++i) {
          xorAll ^= i;
      }

      for (int i = 0; i < n; ++i) {
          long long x = 0;
          std::cin >> x;
          xorAll ^= x;
      }

      std::cout << xorAll << '\n';
      return 0;
  }
  ```

---

## Bài 30: Bài Toán Hứng Nước Mưa Tuyến Tính (Trapping Rain Water Cơ Bản)
* **Mục tiêu:** Áp dụng mảng tiền tố và mảng hậu tố cực đại `maxLeft[i]` và `maxRight[i]` để giải quyết bài toán hứng nước mưa kinh điển trong O(N) thời gian.
* **Mô tả:** Cho mảng gồm N số nguyên không âm đại diện cho bản đồ độ cao của các cột có độ rộng bằng 1. Hãy tính xem sau một cơn mưa, có thể giữ lại được tổng cộng bao nhiêu đơn vị nước mưa giữa các cột.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên không âm đại diện cho độ cao (0 <= A[i] <= 10^5).
* **Đầu ra (Output):** Tổng lượng nước mưa giữ lại được (kiểu `long long`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
3 0 0 2 0 4
```

**Khung Đầu ra (Output):**
```text
10
```

**Giải thích chi tiết:**
* Cột 1 (cao 0): giữ min(3, 4) - 0 = 3 đơn vị nước.
* Cột 2 (cao 0): giữ min(3, 4) - 0 = 3 đơn vị nước.
* Cột 3 (cao 2): giữ min(3, 4) - 2 = 1 đơn vị nước.
* Cột 4 (cao 0): giữ min(3, 4) - 0 = 3 đơn vị nước.
* Tổng cộng lượng nước mưa giữ lại = 3 + 3 + 1 + 3 = 10.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>
  #include <algorithm>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 2) {
          std::cout << 0 << '\n';
          return 0;
      }

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      std::vector<long long> maxLeft(n, 0);
      std::vector<long long> maxRight(n, 0);

      maxLeft[0] = a[0];
      for (int i = 1; i < n; ++i) {
          maxLeft[i] = std::max(maxLeft[i - 1], a[i]);
      }

      maxRight[n - 1] = a[n - 1];
      for (int i = n - 2; i >= 0; --i) {
          maxRight[i] = std::max(maxRight[i + 1], a[i]);
      }

      long long tongNuoc = 0;
      for (int i = 0; i < n; ++i) {
          long long mucNuoc = std::min(maxLeft[i], maxRight[i]);
          if (mucNuoc > a[i]) {
              tongNuoc += (mucNuoc - a[i]);
          }
      }

      std::cout << tongNuoc << '\n';
      return 0;
  }
  ```
