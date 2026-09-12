---
lessonId: CPP2-05.03
title: "Bài toán N Quân hậu (N-Queens) và Kỹ thuật Cắt tỉa Nhánh cận"
difficulty: "Nâng cao"
estimatedDuration: "85 phút"
keywords: ["N-Queens", "N quân hậu", "nhánh cận", "cắt tỉa", "branch and bound", "đường chéo bàn cờ", "thuật toán kinh điển"]
prerequisites: ["CPP2-05.02"]
---

# Bài toán N Quân hậu (N-Queens) và Kỹ thuật Cắt tỉa Nhánh cận

## 1. Khái niệm & Vấn đề

**Bài toán N Quân hậu (N-Queens Problem)** là một trong những bài toán kinh điển nhất trong lịch sử khoa học máy tính:
> *Hãy xếp N quân hậu lên một bàn cờ vua kích thước N 	imes N sao cho không có bất kỳ hai quân hậu nào có thể khống chế (ăn) được nhau.*

Theo luật cờ vua quốc tế, quân hậu có thể di chuyển không giới hạn số ô theo: **Hàng ngang, Cột dọc, và 2 Đường chéo**.
Điều này đồng nghĩa:
1. Mỗi hàng chỉ được có đúng 1 quân hậu.
2. Mỗi cột chỉ được có đúng 1 quân hậu.
3. Trên mỗi đường chéo chính và phụ chỉ được có tối đa 1 quân hậu.

### Sức mạnh của Kỹ thuật Cắt tỉa (Pruning / Branch and Bound)
Bàn cờ N 	imes N có N² ô. Nếu thử ngẫu nhiên tổ hợp đặt N quân hậu, số lượng trường hợp là cực kỳ khổng lồ.
Với thuật toán Quay lui có Cắt tỉa:
- Ta duyệt đặt quân hậu theo từng hàng (Hàng 1, Hàng 2, ..., Hàng N).
- Tại hàng thứ i, ta thử đặt hậu vào cột j. **Nếu cột j hoặc các đường chéo đi qua ô (i, j) đã bị một quân hậu trước đó khống chế, ta lập tức CẮT BỎ nhánh này ngay lập tức mà không đi tiếp!**
Hành động này chặt đứt hàng triệu nhánh con vô nghiệm, giúp thuật toán tìm ra đáp án trong chớp mắt.

---

## 2. Cú pháp & Vận hành

### Bí quyết Toán học Nhận diện 2 Đường chéo Bàn cờ trong O(1)

Một bàn cờ N 	imes N có:
- 2N - 1 đường chéo xuôi (Chính): Mọi ô trên cùng một đường chéo xuôi đều có hiệu i - j bằng nhau. Để chỉ số mảng không âm, ta dùng công thức:
  	ext{Chỉ số đường chéo xuôi} = i - j + N
- 2N - 1 đường chéo ngược (Phụ): Mọi ô trên cùng một đường chéo ngược đều có tổng i + j bằng nhau:
  	ext{Chỉ số đường chéo ngược} = i + j

```
Minh họa kiểm soát an toàn bằng 3 mảng đánh dấu:
- colUsed[j]: Đánh dấu cột j
- diagMainUsed[i - j + N]: Đánh dấu đường chéo xuôi
- diagAntiUsed[i + j]: Đánh dấu đường chéo ngược
```

### Toàn bộ Mã nguồn Cài đặt N-Queens Chuẩn Mực

```cpp
#include <iostream>
#include <vector>

const int MAX = 30;
int queenPos[MAX]; // queenPos[i] = j nghĩa là quân hậu hàng i nằm ở cột j
bool colUsed[MAX]{false};
bool diagMainUsed[MAX * 2]{false};
bool diagAntiUsed[MAX * 2]{false};

int n;
int solutionCount = 0;

void printBoard() {
    std::cout << "--- LOI GIAI THU " << ++solutionCount << " ---\n";
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (queenPos[i] == j) {
                std::cout << " Q ";
            } else {
                std::cout << " . ";
            }
        }
        std::cout << "\n";
    }
    std::cout << "\n";
}

void solveNQueens(int row) {
    // Duyệt qua tất cả các cột j khả dĩ cho hàng hiện tại
    for (int col = 1; col <= n; ++col) {
        // KIỂM TRA TÍNH HỢP LỆ VÀ CẮT TỈA TRONG O(1):
        if (!colUsed[col] && 
            !diagMainUsed[row - col + n] && 
            !diagAntiUsed[row + col]) {

            // 1. Thử đặt hậu tại (row, col)
            queenPos[row] = col;
            colUsed[col] = true;
            diagMainUsed[row - col + n] = true;
            diagAntiUsed[row + col] = true;

            // 2. Kiểm tra nếu đã đặt xong quân hậu ở hàng cuối cùng
            if (row == n) {
                printBoard();
            } else {
                solveNQueens(row + 1); // Đệ quy xếp tiếp hàng kế tiếp
            }

            // 3. HOÀN TÁC TRẠNG THÁI (BACKTRACK):
            colUsed[col] = false;
            diagMainUsed[row - col + n] = false;
            diagAntiUsed[row + col] = false;
        }
    }
}

int main() {
    n = 4; // Thử nghiệm với bàn cờ 4x4
    std::cout << "Bat dau giai bai toan N-Queens voi N = " << n << ":\n\n";
    solveNQueens(1);
    std::cout << "Tong so loi giai tim duoc: " << solutionCount << "\n";
    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Chỉ số âm trong mảng đường chéo xuôi
> Hiệu số `row - col` có thể âm (ví dụ hàng 1, cột 4 thì `1 - 4 = -3`).
> Nếu bạn viết trực tiếp `diag[row - col] = true;`, chương trình sẽ truy cập vùng nhớ âm ngoài biên của mảng và gây lỗi sập **Segmentation Fault**.
> **Bắt buộc:** Phải cộng thêm độ lệch hằng số N: `row - col + n`.

> [!TIP]
> ### 2. Tối ưu hóa kiểm tra đường chéo bằng Phép toán Bit (Bitwise N-Queens)
> Lập trình viên thi đấu thuật toán đỉnh cao có thể thay thế toàn bộ 3 mảng `bool` bằng 3 biến số nguyên 32-bit và sử dụng các phép toán dịch bit (`<<`, `>>`, `&`) để kiểm tra toàn bộ điều kiện trong đúng 1 chu kỳ xung nhịp CPU!

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Với bàn cờ vua kích thước chuẩn quốc tế N = 8, bài toán 8 Quân hậu có tổng cộng bao nhiêu lời giải phân biệt?
- A. 12
- B. 64
- C. 92
- D. 256

**Đáp án đúng:** **C**
*Giải thích:* Bài toán 8 Quân hậu nổi tiếng có chính xác 92 lời giải hợp lệ (hoặc 12 lời giải độc lập cơ bản nếu loại bỏ các phép xoay và đối xứng bàn cờ).

### 4.2. Thử thách sửa lỗi (Debug)
Một học viên viết hàm kiểm tra đường chéo bằng vòng lặp duyệt lại các hàng trước đó khiến thời gian chạy rất chậm:

```cpp
// ❌ CÁCH LÀM CHẬM O(N)
bool isSafe(int r, int c) {
    for (int prevR = 1; prevR < r; ++prevR) {
        int prevC = queenPos[prevR];
        if (prevC == c || abs(prevR - r) == abs(prevC - c)) return false;
    }
    return true;
}
```
**Nguyên nhân:** Mỗi lần kiểm tra tốn O(N) thao tác lặp.
**Sửa lại chuẩn:**
Sử dụng 3 mảng đánh dấu đường chéo như code mẫu ở mục 2 để kiểm tra trong thời gian tức thì O(1).

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Chạy chương trình N-Queens với N = 8. Đếm và in ra tổng số lời giải trên màn hình console.

---

## 5. Đúc kết & Đi tiếp

- **Kỹ thuật Cắt tỉa nhánh cận** giúp thuật toán Quay lui bỏ qua sớm các nhánh ngõ cụt, tăng tốc hàng nghìn lần so với vét cạn thuần túy.
- Nhận diện đường chéo bằng công thức hằng số: Đường chéo xuôi (i - j + N), Đường chéo ngược (i + j).

*Bài học tiếp theo:* Bước vào **Module 6: Xử lý Ngoại lệ Hệ thống và Tối ưu hóa Hiệu năng Bộ nhớ Cache phần cứng**.
