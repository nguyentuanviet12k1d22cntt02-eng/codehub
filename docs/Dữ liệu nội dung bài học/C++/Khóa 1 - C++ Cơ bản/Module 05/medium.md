# Bộ bài tập Thực hành Tổng hợp Module 5: C++ Cơ bản
## Mức độ: TRUNG BÌNH (MEDIUM) - 10 Bài tập

> **Phạm vi kiến thức:** Kỹ thuật mảng đếm tần suất (Frequency Array), thuật toán sắp xếp kinh điển (Bubble Sort, Selection Sort), tìm kiếm nhị phân (Binary Search), mảng cộng dồn (Prefix Sum Array), kỹ thuật hai con trỏ (Two Pointers) gộp mảng, dịch vòng mảng.
> **Quy ước:** Tuyệt đối không dùng mảng 2 chiều, không dùng con trỏ hay cấp phát động thủ công malloc/new.

---

## Bài 11: Tìm Phần Tử Lớn Thứ Nhì Trong Mảng (secondLargest)
* **Mục tiêu:** Nắm vững thuật toán theo dõi đồng thời 2 giá trị cực trị Max1 và Max2 trong 1 lượt duyệt O(N).
* **Mô tả:** Nhập vào số nguyên dương N (2 <= N <= 10^5) và mảng N số nguyên. Hãy tìm phần tử có giá trị lớn thứ nhì (nghiêm ngặt nhỏ hơn giá trị lớn nhất) trong mảng. Nếu tất cả các phần tử trong mảng đều bằng nhau (không tồn tại phần tử lớn thứ nhì), in ra `-1`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (2 <= N <= 10^5).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Giá trị lớn thứ nhì hoặc -1.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5
12 35 1 10 34
```

**Khung Đầu ra (Output):**
```text
34
```

**Giải thích chi tiết:**
* Phần tử lớn nhất là 35. Phần tử lớn thứ nhì nghiêm ngặt là 34.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n < 2) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      long long max1 = a[0];
      for (int i = 1; i < n; ++i) {
          if (a[i] > max1) max1 = a[i];
      }

      bool timThay = false;
      long long max2 = -1;

      for (int i = 0; i < n; ++i) {
          if (a[i] < max1) {
              if (!timThay || a[i] > max2) {
                  max2 = a[i];
                  timThay = true;
              }
          }
      }

      if (timThay) {
          std::cout << max2 << '\n';
      } else {
          std::cout << -1 << '\n';
      }

      return 0;
  }
  ```

---

## Bài 12: Đếm Tần Suất Xuất Hiện Bằng Mảng Đếm (frequencyArray)
* **Mục tiêu:** Áp dụng kỹ thuật mảng đếm tần suất (Frequency Array) với chỉ số là giá trị phần tử để đạt độ phức tạp O(N).
* **Mô tả:** Cho mảng gồm N số nguyên không âm có giá trị trong khoảng từ 0 đến 1000. Hãy thống kê tần suất xuất hiện của mỗi giá trị trong mảng và in ra theo thứ tự tăng dần của các giá trị theo định dạng: `GiaTri: TanSuat` (mỗi giá trị trên một dòng riêng biệt).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên không âm (0 <= A[i] <= 1000).
* **Đầu ra (Output):** Mỗi dòng gồm giá trị và số lần xuất hiện theo định dạng `GiaTri: TanSuat`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6
5 2 5 8 2 2
```

**Khung Đầu ra (Output):**
```text
2: 3
5: 2
8: 1
```

**Giải thích chi tiết:**
* Số 2 xuất hiện 3 lần, số 5 xuất hiện 2 lần, số 8 xuất hiện 1 lần. Các giá trị được sắp xếp tăng dần.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<int> cnt(1001, 0);
      for (int i = 0; i < n; ++i) {
          int x = 0;
          std::cin >> x;
          if (x >= 0 && x <= 1000) {
              cnt[x]++;
          }
      }

      for (int val = 0; val <= 1000; ++val) {
          if (cnt[val] > 0) {
              std::cout << val << ": " << cnt[val] << '\n';
          }
      }

      return 0;
  }
  ```

---

## Bài 13: Tìm Phần Tử Xuất Hiện Nhiều Nhất Trong Mảng (mostFrequentElement)
* **Mục tiêu:** Tìm cực trị tần suất kết hợp quy tắc giải quyết hòa (Tie-breaking) ưu tiên giá trị nhỏ hơn.
* **Mô tả:** Cho mảng gồm N số nguyên không âm (0 <= A[i] <= 1000). Hãy tìm phần tử có tần suất xuất hiện nhiều nhất trong mảng. Nếu có nhiều phần tử cùng có tần suất xuất hiện lớn nhất, hãy in ra phần tử có giá trị nhỏ nhất.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên không âm cách nhau một khoảng trắng.
* **Đầu ra (Output):** Giá trị phần tử xuất hiện nhiều nhất.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
7
4 7 2 4 7 1 9
```

**Khung Đầu ra (Output):**
```text
4
```

**Giải thích chi tiết:**
* Cả 4 và 7 đều xuất hiện 2 lần (nhiều nhất). Theo quy tắc ưu tiên giá trị nhỏ hơn, kết quả in ra là 4.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<int> cnt(1001, 0);
      for (int i = 0; i < n; ++i) {
          int x = 0;
          std::cin >> x;
          if (x >= 0 && x <= 1000) {
              cnt[x]++;
          }
      }

      int maxFreq = 0;
      int bestVal = 0;

      for (int val = 0; val <= 1000; ++val) {
          if (cnt[val] > maxFreq) {
              maxFreq = cnt[val];
              bestVal = val;
          }
      }

      std::cout << bestVal << '\n';
      return 0;
  }
  ```

---

## Bài 14: Sắp Xếp Nổi Bọt và Đếm Số Lần Hoán Vị (Bubble Sort)
* **Mục tiêu:** Cài đặt thuật toán Bubble Sort và đo lường độ nghịch thế qua số lần hoán vị (swaps).
* **Mô tả:** Nhập vào mảng gồm N số nguyên (1 <= N <= 1000). Hãy cài đặt thuật toán sắp xếp nổi bọt (Bubble Sort) để sắp xếp mảng theo thứ tự tăng dần.
  * Dòng 1: In mảng sau khi đã sắp xếp tăng dần, mỗi số cách nhau một khoảng trắng.
  * Dòng 2: In tổng số lần hoán vị phần tử (swap) đã diễn ra.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).
  * Dòng 2: N số nguyên (-10^9 <= A[i] <= 10^9).
* **Đầu ra (Output):** Gồm 2 dòng: mảng sau khi sắp xếp và số lần hoán vị.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
4
4 3 2 1
```

**Khung Đầu ra (Output):**
```text
1 2 3 4
6
```

**Giải thích chi tiết:**
* Mảng nghịch đảo hoàn toàn {4, 3, 2, 1} cần đúng 6 lần hoán vị để đưa về thứ tự tăng dần {1, 2, 3, 4}.

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

      long long soLanSwap = 0;
      for (int i = 0; i < n - 1; ++i) {
          for (int j = 0; j < n - 1 - i; ++j) {
              if (a[j] > a[j + 1]) {
                  std::swap(a[j], a[j + 1]);
                  soLanSwap++;
              }
          }
      }

      for (int i = 0; i < n; ++i) {
          std::cout << a[i] << (i == n - 1 ? "" : " ");
      }
      std::cout << '\n';
      std::cout << soLanSwap << '\n';

      return 0;
  }
  ```

---

## Bài 15: Sắp Xếp Chọn và In Trạng Thái Mảng Từng Bước (Selection Sort)
* **Mục tiêu:** Hiểu rõ cơ chế tìm phần tử nhỏ nhất và đưa về đầu mảng ở từng vòng lặp của Selection Sort.
* **Mô tả:** Cho mảng gồm N số nguyên (1 <= N <= 50). Hãy cài đặt thuật toán sắp xếp chọn (Selection Sort).
  * Ở mỗi bước lặp `i` từ 0 đến N - 2: tìm phần tử nhỏ nhất trong đoạn từ chỉ số `i` đến `N - 1`, hoán vị nó với phần tử tại chỉ số `i`.
  * Sau mỗi bước hoán vị đó, hãy in ra toàn bộ trạng thái mảng hiện tại trên một dòng riêng biệt.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 50).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng.
* **Đầu ra (Output):** N - 1 dòng, mỗi dòng thể hiện trạng thái mảng sau bước lặp tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
4
5 3 1 2
```

**Khung Đầu ra (Output):**
```text
1 3 5 2
1 2 5 3
1 2 3 5
```

**Giải thích chi tiết:**
* Bước 1 (i=0): Số 1 nhỏ nhất hoán vị với 5 -> {1, 3, 5, 2}.
* Bước 2 (i=1): Số 2 nhỏ nhất trong {3, 5, 2} hoán vị với 3 -> {1, 2, 5, 3}.
* Bước 3 (i=2): Số 3 nhỏ nhất trong {5, 3} hoán vị với 5 -> {1, 2, 3, 5}.

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

      for (int i = 0; i < n - 1; ++i) {
          int minIdx = i;
          for (int j = i + 1; j < n; ++j) {
              if (a[j] < a[minIdx]) {
                  minIdx = j;
              }
          }
          std::swap(a[i], a[minIdx]);

          for (int k = 0; k < n; ++k) {
              std::cout << a[k] << (k == n - 1 ? "" : " ");
          }
          std::cout << '\n';
      }

      return 0;
  }
  ```

---

## Bài 16: Mảng Cộng Dồn và Truy Vấn Tổng Đoạn [L, R] (Prefix Sum)
* **Mục tiêu:** Áp dụng mảng tiền tố (Prefix Sum) để trả lời truy vấn tổng đoạn trong O(1) thời gian.
* **Mô tả:** Cho mảng A gồm N số nguyên và Q truy vấn. Mỗi truy vấn gồm hai chỉ số L và R (1-indexed với 1 <= L <= R <= N). Hãy tính và in ra tổng các phần tử từ vị trí L đến vị trí R: `A[L] + A[L+1] + ... + A[R]`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên N và Q (1 <= N, Q <= 10^5).
  * Dòng 2: N số nguyên cách nhau bởi dấu cách (-10^9 <= A[i] <= 10^9).
  * Q dòng tiếp theo: mỗi dòng gồm hai số nguyên L và R cách nhau bởi dấu cách.
* **Đầu ra (Output):** Q dòng, mỗi dòng là kết quả tổng đoạn tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5 3
2 4 6 8 10
1 3
2 4
1 5
```

**Khung Đầu ra (Output):**
```text
12
18
30
```

**Giải thích chi tiết:**
* Tổng từ 1 đến 3: 2 + 4 + 6 = 12.
* Tổng từ 2 đến 4: 4 + 6 + 8 = 18.
* Tổng từ 1 đến 5: 2 + 4 + 6 + 8 + 10 = 30.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      std::ios_base::sync_with_stdio(false);
      std::cin.tie(NULL);

      int n = 0, q = 0;
      if (!(std::cin >> n >> q) || n <= 0) return 0;

      std::vector<long long> pref(n + 1, 0);
      for (int i = 1; i <= n; ++i) {
          long long x = 0;
          std::cin >> x;
          pref[i] = pref[i - 1] + x;
      }

      for (int k = 0; k < q; ++k) {
          int l = 0, r = 0;
          std::cin >> l >> r;
          std::cout << pref[r] - pref[l - 1] << '\n';
      }

      return 0;
  }
  ```

---

## Bài 17: Tìm Kiếm Nhị Phân (Binary Search)
* **Mục tiêu:** Cài đặt thuật toán tìm kiếm nhị phân với độ phức tạp O(log N) trên mảng đã sắp xếp.
* **Mô tả:** Cho mảng gồm N số nguyên đã được sắp xếp theo thứ tự tăng dần và một giá trị X cần tìm. Hãy áp dụng thuật toán tìm kiếm nhị phân để xác định xem X có trong mảng hay không. Nếu có, in ra chỉ số (0-indexed) của X; nếu không có, in ra `-1`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên N và X (1 <= N <= 10^5, -10^9 <= X <= 10^9).
  * Dòng 2: N số nguyên đã sắp xếp tăng dần.
* **Đầu ra (Output):** Chỉ số tìm thấy X (0-indexed) hoặc -1.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
6 15
3 7 10 15 22 30
```

**Khung Đầu ra (Output):**
```text
3
```

**Giải thích chi tiết:**
* Số 15 nằm tại vị trí chỉ số 3 (A[3] = 15).

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      long long x = 0;
      if (!(std::cin >> n >> x) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      int left = 0, right = n - 1;
      int res = -1;

      while (left <= right) {
          int mid = left + (right - left) / 2;
          if (a[mid] == x) {
              res = mid;
              break;
          } else if (a[mid] < x) {
              left = mid + 1;
          } else {
              right = mid - 1;
          }
      }

      std::cout << res << '\n';
      return 0;
  }
  ```

---

## Bài 18: Gộp Hai Mảng Đã Sắp Xếp Bằng Hai Con Trỏ (mergeTwoSortedArrays)
* **Mục tiêu:** Áp dụng kỹ thuật hai con trỏ để gộp 2 mảng tăng dần thành 1 mảng tăng dần trong thời gian O(N + M) (nền tảng của Merge Sort).
* **Mô tả:** Cho hai mảng số nguyên A (gồm N phần tử) và B (gồm M phần tử) đều đã được sắp xếp tăng dần. Hãy gộp hai mảng thành một mảng duy nhất gồm N + M phần tử theo thứ tự tăng dần mà không dùng hàm `std::sort`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên N và M (1 <= N, M <= 10^5).
  * Dòng 2: N số nguyên của mảng A đã sắp xếp.
  * Dòng 3: M số nguyên của mảng B đã sắp xếp.
* **Đầu ra (Output):** N + M số nguyên của mảng sau khi gộp theo thứ tự tăng dần.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 4
1 5 9
2 4 6 8
```

**Khung Đầu ra (Output):**
```text
1 2 4 5 6 8 9
```

**Giải thích chi tiết:**
* So sánh từng cặp phần tử đầu của 2 mảng, chọn phần tử nhỏ hơn đưa vào mảng kết quả: {1, 2, 4, 5, 6, 8, 9}.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0, m = 0;
      if (!(std::cin >> n >> m) || n <= 0 || m <= 0) return 0;

      std::vector<long long> a(n), b(m);
      for (int i = 0; i < n; ++i) std::cin >> a[i];
      for (int j = 0; j < m; ++j) std::cin >> b[j];

      std::vector<long long> c;
      c.reserve(n + m);

      int i = 0, j = 0;
      while (i < n && j < m) {
          if (a[i] <= b[j]) {
              c.push_back(a[i++]);
          } else {
              c.push_back(b[j++]);
          }
      }

      while (i < n) c.push_back(a[i++]);
      while (j < m) c.push_back(b[j++]);

      for (size_t k = 0; k < c.size(); ++k) {
          std::cout << c[k] << (k + 1 == c.size() ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 19: Dịch Vòng Mảng Sang Phải K Vị Trí (rotateArrayRight)
* **Mục tiêu:** Áp dụng phép chia dư `(i + K) % N` hoặc kỹ thuật 3 lần đảo ngược mảng để dịch chuyển vòng tuần hoàn.
* **Mô tả:** Cho mảng gồm N số nguyên và số bước dịch K (K >= 0). Hãy dịch chuyển xoay vòng các phần tử của mảng sang phải K vị trí (mỗi lần dịch sang phải 1 vị trí thì phần tử cuối cùng chuyển lên vị trí đầu tiên). In mảng kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên N và K (1 <= N <= 10^5, 0 <= K <= 10^9).
  * Dòng 2: N số nguyên cách nhau một khoảng trắng.
* **Đầu ra (Output):** Mảng sau khi dịch vòng sang phải K bước.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
5 2
1 2 3 4 5
```

**Khung Đầu ra (Output):**
```text
4 5 1 2 3
```

**Giải thích chi tiết:**
* Dịch phải 1 bước: {5, 1, 2, 3, 4}.
* Dịch phải 2 bước: {4, 5, 1, 2, 3}.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      long long k = 0;
      if (!(std::cin >> n >> k) || n <= 0) return 0;

      std::vector<long long> a(n);
      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
      }

      int kReal = static_cast<int>(k % n);
      std::vector<long long> res(n);

      for (int i = 0; i < n; ++i) {
          res[(i + kReal) % n] = a[i];
      }

      for (int i = 0; i < n; ++i) {
          std::cout << res[i] << (i == n - 1 ? "" : " ");
      }
      std::cout << '\n';

      return 0;
  }
  ```

---

## Bài 20: Liệt Kê Các Phần Tử Xuất Hiện Đúng Một Lần (uniqueElements)
* **Mục tiêu:** Kết hợp mảng đếm tần suất với thứ tự xuất hiện ban đầu để lọc ra các phần tử độc nhất (Unique).
* **Mô tả:** Cho mảng gồm N số nguyên không âm (0 <= A[i] <= 1000). Hãy liệt kê các phần tử xuất hiện đúng 1 lần (tần suất bằng 1) theo đúng thứ tự xuất hiện ban đầu trong mảng. Nếu không có phần tử nào thỏa mãn, in ra `NONE`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).
  * Dòng 2: N số nguyên không âm cách nhau một khoảng trắng.
* **Đầu ra (Output):** Các phần tử độc nhất cách nhau một khoảng trắng, hoặc NONE.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
7
12 5 8 12 7 5 3
```

**Khung Đầu ra (Output):**
```text
8 7 3
```

**Giải thích chi tiết:**
* Số 12 xuất hiện 2 lần, số 5 xuất hiện 2 lần. Các số chỉ xuất hiện đúng 1 lần theo thứ tự ban đầu là: 8, 7, 3.

* **Code C++ mẫu:**
  ```cpp
  #include <iostream>
  #include <vector>

  int main() {
      int n = 0;
      if (!(std::cin >> n) || n <= 0) return 0;

      std::vector<int> a(n);
      std::vector<int> cnt(1001, 0);

      for (int i = 0; i < n; ++i) {
          std::cin >> a[i];
          if (a[i] >= 0 && a[i] <= 1000) {
              cnt[a[i]]++;
          }
      }

      bool coIn = false;
      for (int i = 0; i < n; ++i) {
          if (cnt[a[i]] == 1) {
              if (coIn) std::cout << " ";
              std::cout << a[i];
              coIn = true;
          }
      }

      if (!coIn) {
          std::cout << "NONE";
      }
      std::cout << '\n';

      return 0;
  }
  ```
