# Hệ Thống Bài Tập Thực Hành C++ Cơ Bản - Module 07 (Cấp Độ: Trung Bình / Medium)

---

### Bài 11: Cộng Hai Ma Trận Cùng Kích Thước (addTwoMatrices)
* **Mục tiêu:** Áp dụng phép toán đại số cộng hai ma trận cùng kích thước `C[i][j] = A[i][j] + B[i][j]`.
* **Mô tả:** Nhập vào hai số nguyên R và C (1 <= R, C <= 100). Tiếp theo là hai ma trận số nguyên A và B đều có kích thước R x C. Hãy tính và in ra ma trận tổng C = A + B.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C cách nhau một khoảng trắng.
  * R dòng tiếp theo: Ma trận A.
  * R dòng tiếp theo: Ma trận B.
* **Đầu ra (Output):** R dòng biểu diễn ma trận tổng C, mỗi hàng gồm C số nguyên cách nhau một khoảng trắng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 2
1 2
3 4
5 6
7 8
```

**Khung Đầu ra (Output):**
```text
6 8
10 12
```

**Giải thích chi tiết:**
* C[0][0] = 1 + 5 = 6.
* C[0][1] = 2 + 6 = 8.
* C[1][0] = 3 + 7 = 10.
* C[1][1] = 4 + 8 = 12.

---

### Bài 12: Kiểm Tra Ma Trận Đối Xứng Qua Đường Chéo Chính (isSymmetricMatrix)
* **Mục tiêu:** Nắm vững tính chất đối xứng hình học của ma trận vuông (`A[i][j] == A[j][i]` với mọi i, j).
* **Mô tả:** Nhập vào một số nguyên dương N và ma trận vuông cấp N x N. Hãy kiểm tra xem ma trận này có phải là ma trận đối xứng qua đường chéo chính hay không (nghĩa là ma trận ban đầu trùng khớp hoàn toàn với ma trận chuyển vị của nó). In ra `YES` nếu đối xứng, ngược lại in ra `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 100).
  * N dòng tiếp theo: Mỗi dòng gồm N số nguyên biểu diễn ma trận.
* **Đầu ra (Output):** In `YES` nếu đối xứng, ngược lại in `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3
1 2 3
2 4 5
3 5 6
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* A[0][1] == A[1][0] == 2, A[0][2] == A[2][0] == 3, A[1][2] == A[2][1] == 5. Ma trận hoàn toàn đối xứng qua đường chéo chính nên in `YES`.

---

### Bài 13: Tính Tổng Các Phần Tử Thuộc Tam Giác Trên (sumUpperTriangle)
* **Mục tiêu:** Luyện tập duyệt nửa ma trận vuông với điều kiện chỉ số hàng và cột `i <= j`.
* **Mô tả:** Cho ma trận vuông cấp N (1 <= N <= 100). Nửa tam giác trên của ma trận bao gồm các phần tử nằm trên đường chéo chính và toàn bộ các phần tử nằm ở phía trên đường chéo chính (tương ứng với các ô có `i <= j`). Hãy tính và in ra tổng của tất cả các phần tử thuộc nửa tam giác trên này.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 100).
  * N dòng tiếp theo: Mỗi dòng gồm N số nguyên.
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng tam giác trên.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3
1 2 3
4 5 6
7 8 9
```

**Khung Đầu ra (Output):**
```text
26
```

**Giải thích chi tiết:**
* Các phần tử thuộc tam giác trên gồm:
  * Hàng 0: A[0][0] = 1, A[0][1] = 2, A[0][2] = 3.
  * Hàng 1: A[1][1] = 5, A[1][2] = 6.
  * Hàng 2: A[2][2] = 9.
* Tổng = 1 + 2 + 3 + 5 + 6 + 9 = 26.

---

### Bài 14: Tính Tổng Các Phần Tử Thuộc Tam Giác Dưới (sumLowerTriangle)
* **Mục tiêu:** Luyện tập duyệt nửa ma trận vuông với điều kiện chỉ số hàng và cột `i >= j`.
* **Mô tả:** Cho ma trận vuông cấp N (1 <= N <= 100). Nửa tam giác dưới của ma trận bao gồm các phần tử nằm trên đường chéo chính và toàn bộ các phần tử nằm ở phía dưới đường chéo chính (tương ứng với các ô có `i >= j`). Hãy tính và in ra tổng của tất cả các phần tử thuộc nửa tam giác dưới.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 100).
  * N dòng tiếp theo: Mỗi dòng gồm N số nguyên.
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng tam giác dưới.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3
1 2 3
4 5 6
7 8 9
```

**Khung Đầu ra (Output):**
```text
34
```

**Giải thích chi tiết:**
* Các phần tử tam giác dưới:
  * Hàng 0: A[0][0] = 1.
  * Hàng 1: A[1][0] = 4, A[1][1] = 5.
  * Hàng 2: A[2][0] = 7, A[2][1] = 8, A[2][2] = 9.
* Tổng = 1 + 4 + 5 + 7 + 8 + 9 = 34.

---

### Bài 15: Hoán Đổi Hai Hàng Trong Ma Trận (swapTwoRows)
* **Mục tiêu:** Rèn luyện kỹ thuật hoán đổi dữ liệu hàng loạt trong mảng 2 chiều bằng hàm `std::swap`.
* **Mô tả:** Cho ma trận A kích thước R x C. Nhập hai chỉ số hàng u và v (0 <= u, v < R). Hãy hoán đổi toàn bộ các phần tử của hàng u với hàng v và in ma trận kết quả sau khi hoán đổi ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên của ma trận A.
  * Dòng cuối: Hai số nguyên u và v (0 <= u, v < R).
* **Đầu ra (Output):** R dòng biểu diễn ma trận sau khi đổi chỗ hàng u và hàng v.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 3
1 1 1
2 2 2
3 3 3
0 2
```

**Khung Đầu ra (Output):**
```text
3 3 3
2 2 2
1 1 1
```

**Giải thích chi tiết:**
* Hàng 0 `[1, 1, 1]` được hoán đổi vị trí cho hàng 2 `[3, 3, 3]`. Hàng 1 giữ nguyên.

---

### Bài 16: Hoán Đổi Hai Cột Trong Ma Trận (swapTwoColumns)
* **Mục tiêu:** Thao tác hoán đổi phần tử trên từng hàng tại hai vị trí cột u và v.
* **Mô tả:** Cho ma trận A kích thước R x C. Nhập hai chỉ số cột u và v (0 <= u, v < C). Hãy hoán đổi toàn bộ các phần tử thuộc cột u với cột v và in ma trận kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên của ma trận A.
  * Dòng cuối: Hai chỉ số cột u và v (0 <= u, v < C).
* **Đầu ra (Output):** R dòng biểu diễn ma trận sau khi hoán đổi cột u và cột v.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3
1 2 3
4 5 6
0 2
```

**Khung Đầu ra (Output):**
```text
3 2 1
6 5 4
```

**Giải thích chi tiết:**
* Cột 0 và cột 2 đổi chỗ cho nhau, cột 1 ở giữa giữ nguyên.

---

### Bài 17: Sắp Xếp Từng Hàng Của Ma Trận Tăng Dần (sortEachRowAscending)
* **Mục tiêu:** Áp dụng thuật toán sắp xếp (`std::sort` hoặc giải thuật sắp xếp thủ công) trên từng lát cắt hàng 1 chiều của ma trận.
* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Hãy sắp xếp các phần tử trên mỗi hàng theo thứ tự tăng dần từ trái sang phải, các hàng độc lập với nhau. In ma trận sau khi đã sắp xếp.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: C số nguyên mỗi dòng.
* **Đầu ra (Output):** R dòng biểu diễn ma trận sau khi từng hàng đã được sắp xếp tăng dần.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3
9 1 5
8 3 7
```

**Khung Đầu ra (Output):**
```text
1 5 9
3 7 8
```

**Giải thích chi tiết:**
* Hàng 1 sắp xếp `[9, 1, 5]` thành `[1, 5, 9]`.
* Hàng 2 sắp xếp `[8, 3, 7]` thành `[3, 7, 8]`.

---

### Bài 18: Đếm Số Lượng Phần Tử Cực Đại Địa Phương (countLocalMaxima)
* **Mục tiêu:** Làm chủ kỹ thuật duyệt 4 hướng lân cận chung cạnh (Trên, Dưới, Trái, Phải) kèm kiểm tra điều kiện biên ma trận.
* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Một phần tử `A[i][j]` được gọi là **cực đại địa phương** nếu giá trị của nó lớn hơn nghiêm ngặt tất cả các phần tử lân cận chung cạnh hợp lệ xung quanh nó (tối đa 4 ô lân cận: `(i-1, j)`, `(i+1, j)`, `(i, j-1)`, `(i, j+1)` nằm trong biên của ma trận). Hãy đếm xem ma trận có bao nhiêu phần tử cực đại địa phương.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: C số nguyên mỗi dòng.
* **Đầu ra (Output):** Một số nguyên duy nhất là số lượng phần tử cực đại địa phương.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 3
1 2 1
2 5 2
1 2 1
```

**Khung Đầu ra (Output):**
```text
1
```

**Giải thích chi tiết:**
* Phần tử `A[1][1] = 5` có 4 ô lân cận là 2, 2, 2, 2. Vì 5 > 2 nên ô (1, 1) là cực đại địa phương. Các ô khác không thỏa mãn. Tổng cộng có 1 ô.

---

### Bài 19: Tính Tổng Các Phần Tử Trên Đường Viền Ma Trận (sumBoundaryElements)
* **Mục tiêu:** Nhận diện các phần tử biên của ma trận (`i == 0` hoặc `i == R - 1` hoặc `j == 0` hoặc `j == C - 1`) tránh cộng trùng lặp 4 góc.
* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Đường viền của ma trận gồm toàn bộ các phần tử thuộc hàng đầu tiên, hàng cuối cùng, cột đầu tiên và cột cuối cùng. Hãy tính và in ra tổng của tất cả các phần tử nằm trên đường viền này.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: C số nguyên mỗi dòng.
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng các phần tử biên.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 3
1 2 3
4 9 5
6 7 8
```

**Khung Đầu ra (Output):**
```text
36
```

**Giải thích chi tiết:**
* Phần tử bên trong duy nhất là 9 (tại ô 1, 1). Tổng toàn bộ ma trận là 45. Tổng đường viền = 45 - 9 = 36.

---

### Bài 20: Nhân Hai Ma Trận Kích Thước M x N và N x P (matrixMultiplication)
* **Mục tiêu:** Cài đặt thuật toán nhân hai ma trận kinh điển bằng 3 vòng lặp lồng nhau với độ phức tạp thời gian O(M * N * P).
* **Mô tả:** Nhập vào ba số nguyên dương M, N, P (1 <= M, N, P <= 50). Tiếp theo là ma trận A kích thước M x N và ma trận B kích thước N x P. Hãy tính ma trận tích C = A * B (có kích thước M x P) theo công thức tích vô hướng: `C[i][j] = Tổng (A[i][k] * B[k][j])` với k chạy từ 0 đến N - 1. In ma trận tích C ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Ba số nguyên M, N, P cách nhau một khoảng trắng.
  * M dòng tiếp theo: Ma trận A (M hàng, mỗi hàng N số).
  * N dòng tiếp theo: Ma trận B (N hàng, mỗi hàng P số).
* **Đầu ra (Output):** M dòng, mỗi dòng chứa P số nguyên cách nhau một khoảng trắng biểu diễn ma trận tích C.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3 2
1 2 3
4 5 6
7 8
9 1
2 3
```

**Khung Đầu ra (Output):**
```text
31 19
85 55
```

**Giải thích chi tiết:**
* C[0][0] = 1*7 + 2*9 + 3*2 = 7 + 18 + 6 = 31.
* C[0][1] = 1*8 + 2*1 + 3*3 = 8 + 2 + 9 = 19.
* C[1][0] = 4*7 + 5*9 + 6*2 = 28 + 45 + 12 = 85.
* C[1][1] = 4*8 + 5*1 + 6*3 = 32 + 5 + 18 = 55.
