# Hệ Thống Bài Tập Thực Hành C++ Cơ Bản - Module 07 (Cấp Độ: Dễ / Easy)

---

### Bài 1: Nhập và In Ma Trận Số Nguyên Kích Thước R x C (printMatrix)
* **Mục tiêu:** Làm quen với cú pháp khai báo, nhập và xuất ma trận hai chiều bằng hai vòng lặp lồng nhau trong C++.
* **Mô tả:** Nhập vào hai số nguyên dương R và C lần lượt là số hàng và số cột của ma trận (1 <= R, C <= 100). Tiếp theo là các phần tử của ma trận số nguyên A. Hãy in ma trận A ra màn hình theo đúng dạng bảng: gồm R dòng, mỗi dòng chứa C số nguyên cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C cách nhau một khoảng trắng (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên A[i][j] (-10^4 <= A[i][j] <= 10^4).
* **Đầu ra (Output):** R dòng biểu diễn ma trận theo đúng cấu trúc hàng và cột.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3
1 2 3
4 5 6
```

**Khung Đầu ra (Output):**
```text
1 2 3
4 5 6
```

**Giải thích chi tiết:**
* Ma trận gồm 2 hàng và 3 cột được in ra chính xác theo định dạng lưới 2 chiều.

---

### Bài 2: Tính Tổng và Giá Trị Trung Bình Của Ma Trận (sumAndAverageMatrix)
* **Mục tiêu:** Nắm vững thao tác tích lũy giá trị trên toàn bộ lưới 2D và ép kiểu số thực khi tính trung bình cộng.
* **Mô tả:** Nhập vào ma trận số nguyên kích thước R x C. Hãy tính tổng tất cả các phần tử trong ma trận và giá trị trung bình cộng của chúng. In ra tổng và giá trị trung bình cộng (lấy 2 chữ số thập phân sau dấu phẩy) cách nhau một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên A[i][j] (-10^4 <= A[i][j] <= 10^4).
* **Đầu ra (Output):** Hai giá trị: Tổng (số nguyên) và Giá trị trung bình (làm tròn 2 chữ số thập phân).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 2
10 20
30 40
```

**Khung Đầu ra (Output):**
```text
100 25.00
```

**Giải thích chi tiết:**
* Tổng = 10 + 20 + 30 + 40 = 100.
* Số phần tử = 2 * 2 = 4.
* Trung bình cộng = 100 / 4 = 25.00.

---

### Bài 3: Tìm Phần Tử Lớn Nhất và Tọa Độ Trong Ma Trận (findMaxAndPosition)
* **Mục tiêu:** Duyệt lưới tìm giá trị cực đại đồng thời lưu lại vị trí hàng và cột `(r, c)`.
* **Mô tả:** Nhập vào ma trận số nguyên A kích thước R x C. Hãy tìm giá trị lớn nhất trong ma trận và in ra giá trị đó cùng với chỉ số hàng và chỉ số cột đầu tiên xuất hiện giá trị lớn nhất đó (theo thứ tự ưu tiên duyệt từ hàng trên xuống dưới, từ cột trái sang phải, chỉ số tính từ 0).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên A[i][j].
* **Đầu ra (Output):** In ra 3 số nguyên cách nhau một khoảng trắng: Giá trị lớn nhất, Chỉ số hàng, Chỉ số cột.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 3
1 5 9
8 9 2
3 7 4
```

**Khung Đầu ra (Output):**
```text
9 0 2
```

**Giải thích chi tiết:**
* Giá trị lớn nhất là 9, xuất hiện ở ô (0, 2) và ô (1, 1). Vị trí đầu tiên tìm thấy theo thứ tự duyệt hàng-cột là hàng 0, cột 2.

---

### Bài 4: Tính Tổng Từng Hàng Của Ma Trận (sumOfEachRow)
* **Mục tiêu:** Rèn luyện kỹ thuật gom nhóm dữ liệu theo hàng (vòng lặp ngoài duyệt hàng, reset biến tổng cho mỗi hàng).
* **Mô tả:** Cho ma trận kích thước R x C. Hãy tính tổng các phần tử của từng hàng từ hàng 0 đến hàng R - 1 và in kết quả mỗi hàng trên một dòng riêng biệt.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên.
* **Đầu ra (Output):** R dòng, dòng thứ i chứa tổng các phần tử của hàng thứ i.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 3
1 2 3
4 5 6
7 8 9
```

**Khung Đầu ra (Output):**
```text
6
15
24
```

**Giải thích chi tiết:**
* Hàng 0: 1 + 2 + 3 = 6.
* Hàng 1: 4 + 5 + 6 = 15.
* Hàng 2: 7 + 8 + 9 = 24.

---

### Bài 5: Tính Tổng Từng Cột Của Ma Trận (sumOfEachColumn)
* **Mục tiêu:** Thay đổi thứ tự vòng lặp (vòng lặp ngoài duyệt cột, vòng lặp trong duyệt hàng) để xử lý dữ liệu theo cột.
* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Hãy tính tổng các phần tử trên từng cột từ cột 0 đến cột C - 1. In ra các tổng trên cùng một dòng, cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên.
* **Đầu ra (Output):** Một dòng gồm C số nguyên cách nhau một khoảng trắng biểu diễn tổng của từng cột.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3
1 2 3
4 5 6
```

**Khung Đầu ra (Output):**
```text
5 7 9
```

**Giải thích chi tiết:**
* Cột 0: 1 + 4 = 5.
* Cột 1: 2 + 5 = 7.
* Cột 2: 3 + 6 = 9.

---

### Bài 6: Đếm Số Lượng Chẵn Lẻ và Số Âm Trong Ma Trận (countEvenOddNegative)
* **Mục tiêu:** Áp dụng câu lệnh rẽ nhánh điều kiện lồng trong duyệt mảng 2 chiều.
* **Mô tả:** Nhập vào ma trận số nguyên A kích thước R x C. Hãy đếm và in ra 3 số nguyên cách nhau một khoảng trắng: Số lượng số chẵn, Số lượng số lẻ, Số lượng số âm (< 0). (Lưu ý: Số 0 được tính là số chẵn và không phải số âm).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: C số nguyên mỗi dòng.
* **Đầu ra (Output):** 3 số nguyên cách nhau một khoảng trắng: Số chẵn, Số lẻ, Số âm.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3
-2 0 3
-5 4 -1
```

**Khung Đầu ra (Output):**
```text
3 3 3
```

**Giải thích chi tiết:**
* Số chẵn: -2, 0, 4 (3 số).
* Số lẻ: 3, -5, -1 (3 số).
* Số âm: -2, -5, -1 (3 số).

---

### Bài 7: Tính Tổng Đường Chéo Chính Ma Trận Vuông (sumMainDiagonal)
* **Mục tiêu:** Nắm vững quy luật đường chéo chính của ma trận vuông (chỉ số hàng bằng chỉ số cột `i == j`) và tối ưu độ phức tạp về O(N).
* **Mô tả:** Nhập vào một số nguyên dương N là kích thước của ma trận vuông N x N (1 <= N <= 100) và các phần tử của ma trận. Hãy tính và in ra tổng các phần tử nằm trên đường chéo chính (từ góc trên trái xuống góc dưới phải).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 100).
  * N dòng tiếp theo: Mỗi dòng chứa N số nguyên A[i][j].
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng đường chéo chính.

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
15
```

**Giải thích chi tiết:**
* Các phần tử trên đường chéo chính là A[0][0] = 1, A[1][1] = 5, A[2][2] = 9. Tổng = 1 + 5 + 9 = 15.

---

### Bài 8: Tính Tổng Đường Chéo Phụ Ma Trận Vuông (sumAntiDiagonal)
* **Mục tiêu:** Nắm vững quy luật đường chéo phụ của ma trận vuông (tổng chỉ số hàng và cột `i + j == N - 1` hay `j = N - 1 - i`).
* **Mô tả:** Cho ma trận vuông cấp N (1 <= N <= 100). Hãy tính và in ra tổng của các phần tử nằm trên đường chéo phụ (từ góc trên phải xuống góc dưới trái).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 100).
  * N dòng tiếp theo: Mỗi dòng chứa N số nguyên.
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng đường chéo phụ.

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
15
```

**Giải thích chi tiết:**
* Các phần tử trên đường chéo phụ là A[0][2] = 3, A[1][1] = 5, A[2][0] = 7. Tổng = 3 + 5 + 7 = 15.

---

### Bài 9: Tìm Ma Trận Chuyển Vị (transposeMatrix)
* **Mục tiêu:** Hiểu bản chất phép chuyển vị ma trận (biến hàng i thành cột i: `T[j][i] = A[i][j]`).
* **Mô tả:** Nhập vào ma trận A kích thước R x C. Hãy tạo và in ra ma trận chuyển vị T của A (có kích thước C x R).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên.
* **Đầu ra (Output):** C dòng, mỗi dòng gồm R số nguyên cách nhau một khoảng trắng biểu diễn ma trận chuyển vị.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 3
1 2 3
4 5 6
```

**Khung Đầu ra (Output):**
```text
1 4
2 5
3 6
```

**Giải thích chi tiết:**
* Ma trận ban đầu kích thước 2 x 3 được chuyển thành ma trận mới kích thước 3 x 2, trong đó hàng 1 `[1, 2, 3]` biến thành cột 1, hàng 2 `[4, 5, 6]` biến thành cột 2.

---

### Bài 10: Nhân Ma Trận Với Số Vô Hướng (scalarMultiplyMatrix)
* **Mục tiêu:** Thao tác biến đổi trực tiếp trên từng phần tử ma trận bằng phép nhân vô hướng.
* **Mô tả:** Cho ma trận A kích thước R x C và một số nguyên K. Hãy nhân mọi phần tử của ma trận A với số nguyên K và in ma trận kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên A[i][j].
  * Dòng cuối: Số nguyên K (-1000 <= K <= 1000).
* **Đầu ra (Output):** R dòng biểu diễn ma trận sau khi đã nhân với K.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
2 2
1 2
3 4
3
```

**Khung Đầu ra (Output):**
```text
3 6
9 12
```

**Giải thích chi tiết:**
* Mọi phần tử đều được nhân với K = 3: 1*3=3, 2*3=6, 3*3=9, 4*3=12.
