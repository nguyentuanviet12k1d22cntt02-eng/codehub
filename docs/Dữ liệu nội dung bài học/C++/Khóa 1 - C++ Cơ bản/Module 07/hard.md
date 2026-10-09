# Hệ Thống Bài Tập Thực Hành C++ Cơ Bản - Module 07 (Cấp Độ: Khó / Hard)

---

### Bài 21: Xoay Ma Trận Vuông 90 Độ Theo Chiều Kim Đồng Hồ (rotateMatrix90Degrees)
* **Mục tiêu:** Vận dụng kết hợp phép chuyển vị ma trận (Transpose) và đảo ngược từng hàng (Reverse Rows) để xoay ma trận vuông góc 90 độ theo chiều kim đồng hồ in-place với bộ nhớ phụ O(1).
* **Mô tả:** Cho ma trận vuông A kích thước N x N (1 <= N <= 100). Hãy xoay ma trận A một góc 90 độ theo chiều kim đồng hồ và in ma trận sau khi xoay ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Số nguyên dương N (1 <= N <= 100).
  * N dòng tiếp theo: Mỗi dòng gồm N số nguyên biểu diễn ma trận ban đầu.
* **Đầu ra (Output):** N dòng biểu diễn ma trận sau khi đã xoay 90 độ theo chiều kim đồng hồ.

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
7 4 1
8 5 2
9 6 3
```

**Giải thích chi tiết:**
* Cột đầu tiên [1, 4, 7] xoay thành hàng đầu tiên theo chiều ngược [7, 4, 1]. Cột 2 biến thành hàng 2, cột 3 biến thành hàng 3.

---

### Bài 22: Duyệt Ma Trận Theo Hình Xoắn Ốc (spiralMatrixTraversal)
* **Mục tiêu:** Quản lý 4 con trỏ biên ma trận (top, bottom, left, right) để duyệt các cạnh theo thứ tự xoắn ốc từ ngoài vào trong.
* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Hãy in các phần tử của ma trận theo thứ tự xoắn ốc theo chiều kim đồng hồ, bắt đầu từ góc trên bên trái (ô 0, 0), đi sang phải, xuống dưới, sang trái, lên trên rồi lặp lại cho các vòng bên trong. Tất cả phần tử in trên một dòng cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên.
* **Đầu ra (Output):** Dãy số gồm R * C phần tử theo thứ tự duyệt xoắn ốc trên cùng một dòng.

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
1 2 3 6 9 8 7 4 5
```

**Giải thích chi tiết:**
* Đi từ trái sang phải trên hàng đầu: 1 2 3.
* Đi từ trên xuống dưới trên cột cuối: 6 9.
* Đi từ phải sang trái trên hàng cuối: 8 7.
* Đi từ dưới lên trên trên cột đầu: 4.
* Đi vào tâm ma trận: 5.

---

### Bài 23: Sinh Ma Trận Xoắn Ốc Vuông Cấp N (generateSpiralMatrix)
* **Mục tiêu:** Điền các giá trị tăng dần từ 1 đến N^2 vào ma trận vuông theo đúng quy luật xoắn ốc.
* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 50). Hãy tạo và in ra một ma trận vuông kích thước N x N gồm các số nguyên từ 1 đến N*N được sắp xếp theo hình xoắn ốc theo chiều kim đồng hồ bắt đầu từ ô (0, 0).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa số nguyên dương N (1 <= N <= 50).
* **Đầu ra (Output):** N dòng, mỗi dòng chứa N số nguyên cách nhau một khoảng trắng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3
```

**Khung Đầu ra (Output):**
```text
1 2 3
8 9 4
7 6 5
```

**Giải thích chi tiết:**
* Các số từ 1 đến 9 được điền lần lượt theo thứ tự xoắn ốc vào ma trận 3 x 3.

---

### Bài 24: Tìm Điểm Yên Ngựa Trong Ma Trận (findSaddlePoint)
* **Mục tiêu:** Kết hợp tìm giá trị nhỏ nhất trên hàng và kiểm tra giá trị lớn nhất trên cột tương ứng.
* **Mô tả:** Trong một ma trận số nguyên, một phần tử được gọi là **Điểm yên ngựa (Saddle Point)** nếu nó đồng thời là:
  * Phần tử có giá trị nhỏ nhất trên hàng của nó.
  * Phần tử có giá trị lớn nhất trên cột của nó.
  Hãy tìm giá trị của điểm yên ngựa trong ma trận. Nếu ma trận có điểm yên ngựa, in ra giá trị đó cùng chỉ số hàng và cột của nó. Nếu ma trận không tồn tại điểm yên ngựa nào, in ra `-1`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: C số nguyên mỗi dòng.
* **Đầu ra (Output):** In ra 3 số: Giá_trị Hàng Cột nếu tìm thấy, ngược lại in `-1`.

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
7 2 0
```

**Giải thích chi tiết:**
* Xét hàng 2: giá trị nhỏ nhất là 7 (tại cột 0). Xét cột 0 gồm [1, 4, 7]: giá trị lớn nhất là 7. Do đó phần tử tại (2, 0) với giá trị 7 là điểm yên ngựa.

---

### Bài 25: Mảng Cộng Dồn 2 Chiều và Truy Vấn Hình Chữ Nhật Con (prefixSum2DMatrix)
* **Mục tiêu:** Xây dựng mảng cộng dồn 2 chiều `pref[i][j]` theo công thức bao hàm loại trừ để trả lời các truy vấn tính tổng hình chữ nhật con trong thời gian O(1).
* **Mô tả:** Cho ma trận số nguyên A kích thước R x C (1 <= R, C <= 100) và Q truy vấn. Mỗi truy vấn gồm 4 số nguyên `(r1, c1, r2, c2)` với `0 <= r1 <= r2 < R` và `0 <= c1 <= c2 < C`. Hãy tính tổng các phần tử của hình chữ nhật con có góc trên bên trái là `(r1, c1)` và góc dưới bên phải là `(r2, c2)`. In kết quả mỗi truy vấn trên một dòng.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).
  * R dòng tiếp theo: Ma trận A.
  * Dòng tiếp theo: Số nguyên Q (1 <= Q <= 1000).
  * Q dòng tiếp theo: Mỗi dòng gồm 4 số nguyên r1, c1, r2, c2.
* **Đầu ra (Output):** Q dòng, mỗi dòng là tổng hình chữ nhật con của truy vấn tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 3
1 2 3
4 5 6
7 8 9
2
0 0 1 1
1 1 2 2
```

**Khung Đầu ra (Output):**
```text
12
28
```

**Giải thích chi tiết:**
* Truy vấn 1: Hình chữ nhật từ (0, 0) đến (1, 1) gồm: 1, 2, 4, 5. Tổng = 1 + 2 + 4 + 5 = 12.
* Truy vấn 2: Hình chữ nhật từ (1, 1) đến (2, 2) gồm: 5, 6, 8, 9. Tổng = 5 + 6 + 8 + 9 = 28.

---

### Bài 26: Tìm Hình Vuông Con K x K Có Tổng Lớn Nhất (maxSumSubSquare)
* **Mục tiêu:** Áp dụng kỹ thuật cửa sổ trượt 2D hoặc mảng cộng dồn 2 chiều để tối ưu hóa thời gian tìm kiếm cực trị vùng con.
* **Mô tả:** Cho ma trận số nguyên A kích thước R x C và một số nguyên dương K (1 <= K <= min(R, C)). Hãy tìm và in ra tổng lớn nhất của một hình vuông con kích thước K x K nằm trọn bên trong ma trận A.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Ba số nguyên R, C, K (1 <= K <= min(R, C) <= 100).
  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên của ma trận A.
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng lớn nhất của hình vuông con K x K.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 3 2
1 2 3
4 5 6
7 8 9
```

**Khung Đầu ra (Output):**
```text
28
```

**Giải thích chi tiết:**
* Các hình vuông con 2 x 2:
  * Góc trên trái: 1+2+4+5 = 12
  * Góc trên phải: 2+3+5+6 = 16
  * Góc dưới trái: 4+5+7+8 = 24
  * Góc dưới phải: 5+6+8+9 = 28. Tổng lớn nhất là 28.

---

### Bài 27: Tam Giác Pascal 2D Bằng Quy Nạp (pascalTriangleMatrix)
* **Mục tiêu:** Rèn luyện quy tắc chuyển trạng thái quy hoạch động dạng lưới: `P[i][j] = P[i-1][j] + P[i][j-1]` hoặc tạo tam giác Pascal kinh điển.
* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 20). Hãy xây dựng và in ra ma trận kích thước N x N trong đó:
  * Mọi phần tử ở hàng 0 đều có giá trị bằng 1 (`A[0][j] = 1`).
  * Mọi phần tử ở cột 0 đều có giá trị bằng 1 (`A[i][0] = 1`).
  * Với mọi ô còn lại, giá trị của ô bằng tổng của ô nằm ngay phía trên và ô nằm ngay bên trái: `A[i][j] = A[i-1][j] + A[i][j-1]`.
  In ma trận kết quả gồm N dòng, mỗi dòng N số nguyên.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 20).
* **Đầu ra (Output):** N dòng biểu diễn ma trận Pascal 2D.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3
```

**Khung Đầu ra (Output):**
```text
1 1 1
1 2 3
1 3 6
```

**Giải thích chi tiết:**
* Ô (1, 1) = A[0][1] + A[1][0] = 1 + 1 = 2.
* Ô (1, 2) = A[0][2] + A[1][1] = 1 + 2 = 3.
* Ô (2, 1) = A[1][1] + A[2][0] = 2 + 1 = 3.
* Ô (2, 2) = A[1][2] + A[2][1] = 3 + 3 = 6.

---

### Bài 28: Đếm Số Lượng Vùng Đảo Trên Ma Trận Nhị Phân (countIslandsBinaryMatrix)
* **Mục tiêu:** Ứng dụng thuật toán loang (Flood Fill / DFS cơ bản) bằng mảng đánh dấu hoặc biến đổi trực tiếp trên lưới 2D 4 hướng.
* **Mô tả:** Cho một bản đồ dạng ma trận nhị phân kích thước R x C gồm các số `0` (nước) và `1` (đất liền). Một "hòn đảo" là một vùng các ô đất liền (`1`) kết nối với nhau theo 4 hướng chung cạnh (trên, dưới, trái, phải). Hãy đếm số lượng hòn đảo độc lập có trên bản đồ.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 50).
  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên (chỉ gồm 0 hoặc 1).
* **Đầu ra (Output):** Một số nguyên duy nhất là số lượng hòn đảo tìm được.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
4 4
1 1 0 0
1 0 0 1
0 0 1 1
0 0 0 0
```

**Khung Đầu ra (Output):**
```text
2
```

**Giải thích chi tiết:**
* Đảo thứ nhất ở góc trên bên trái gồm các ô (0,0), (0,1), (1,0).
* Đảo thứ hai gồm các ô (1,3), (2,2), (2,3). Tổng cộng có 2 hòn đảo riêng biệt.

---

### Bài 29: Kiểm Tra Trạng Thái Bàn Cờ Tic-Tac-Toe (checkTicTacToeState)
* **Mục tiêu:** Kiểm tra điều kiện thắng (3 ký tự liên tiếp trên cùng một hàng, một cột hoặc trên một đường chéo) của trò chơi Cờ Caro 3x3.
* **Mô tả:** Cho một bàn cờ Tic-Tac-Toe kích thước 3 x 3 gồm các ký tự: `'X'`, `'O'` hoặc `'.'` (ô trống). Hãy xác định kết quả của ván cờ:
  * In ra `X_WIN` nếu người chơi X đã tạo được 3 ký tự 'X' liên tiếp trên cùng 1 hàng, 1 cột hoặc 1 đường chéo.
  * In ra `O_WIN` nếu người chơi O đã tạo được 3 ký tự 'O' liên tiếp.
  * In ra `DRAW` nếu bàn cờ đã kín (không còn ô trống `'.'`) và không ai thắng.
  * In ra `ONGOING` nếu chưa ai thắng và bàn cờ vẫn còn ô trống.
  (Dữ liệu đảm bảo không xảy ra trường hợp cả X và O cùng đồng thời thắng).

### Quy cách dữ liệu:
* **Đầu vào (Input):** 3 dòng, mỗi dòng chứa một chuỗi gồm 3 ký tự đại diện cho hàng tương ứng của bàn cờ.
* **Đầu ra (Output):** Một trong 4 trạng thái: `X_WIN`, `O_WIN`, `DRAW`, `ONGOING`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
XOX
OXO
O.X
```

**Khung Đầu ra (Output):**
```text
X_WIN
```

**Giải thích chi tiết:**
* Các ô trên đường chéo chính gồm: (0,0)='X', (1,1)='X', (2,2)='X' tạo thành 3 ký tự X thẳng hàng nên người chơi X chiến thắng (`X_WIN`).

---

### Bài 30: Trò Chơi Dò Mìn Tạo Bản Đồ Số Lân Cận (minesweeperBoardGenerator)
* **Mục tiêu:** Áp dụng duyệt 8 hướng lân cận xung quanh mỗi ô (Trên, Dưới, Trái, Phải và 4 đường chéo) để tái tạo bảng số trò chơi Dò mìn kinh điển.
* **Mô tả:** Cho một bảng trò chơi Dò mìn kích thước R x C gồm các ký tự: `'*'` biểu thị vị trí có quả bom, và `'.'` biểu thị vị trí ô đất an toàn. Hãy tạo ra bảng hiển thị kết quả trong đó:
  * Các ô chứa bom giữ nguyên ký tự `'*'`.
  * Mỗi ô an toàn được thay thế bằng một chữ số từ `'0'` đến `'8'` biểu thị số lượng quả bom nằm ở 8 ô xung quanh nó.
  In bảng kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 50).
  * R dòng tiếp theo: Mỗi dòng gồm C ký tự (chỉ gồm `*` hoặc `.`).
* **Đầu ra (Output):** R dòng biểu diễn bảng trò chơi dò mìn hoàn chỉnh.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
3 3
*..
...
..*
```

**Khung Đầu ra (Output):**
```text
*10
121
01*
```

**Giải thích chi tiết:**
* Ô (0, 0) là bom `*`.
* Ô (0, 1) tiếp giáp 1 quả bom ở (0, 0) -> hiển thị 1.
* Ô (1, 1) tiếp giáp 2 quả bom ở (0, 0) và (2, 2) -> hiển thị 2.
* Ô (2, 2) là bom `*`.
