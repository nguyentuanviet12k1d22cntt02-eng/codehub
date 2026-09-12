---
lessonId: Lesson_07_02
title: "Các Bài toán Ma trận Vuông: Đường chéo chính/phụ và Ma trận Chuyển vị"
difficulty: "Trung bình"
estimatedDuration: "70 phút"
keywords: ["ma trận vuông", "đường chéo chính", "đường chéo phụ", "ma trận chuyển vị", "ma trận đối xứng"]
prerequisites: ["Lesson_07_01"]
---

# Các Bài toán Ma trận Vuông: Đường chéo chính/phụ và Ma trận Chuyển vị

## 1. Khái niệm & Vấn đề

**Ma trận vuông (Square Matrix)** là ma trận có số hàng bằng đúng số cột (R = C = N). Đây là cấu trúc xuất hiện dày đặc nhất trong đại số tuyến tính, đồ họa 3D, lý thuyết đồ thị (ma trận kề) và các bài toán phỏng vấn thuật toán.

Ma trận vuông có hai trục đối xứng vô cùng đặc biệt:
1. **Đường chéo chính (Main Diagonal):** Trải dài từ góc trên bên trái xuống góc dưới bên phải.
   - *Đặc điểm toán học nhận diện:* Tất cả các phần tử đều có **chỉ số hàng bằng chỉ số cột**:
     i == j
2. **Đường chéo phụ (Anti-Diagonal):** Trải dài từ góc trên bên phải xuống góc dưới bên trái.
   - *Đặc điểm toán học nhận diện:* Tổng chỉ số hàng và chỉ số cột luôn bằng **N - 1**:
     i + j == N - 1 \iff j = N - 1 - i

```
Minh họa Ma trận vuông cấp 4 (N = 4):
(0,0)*  (0,1)   (0,2)   (0,3)#
(1,0)   (1,1)*  (1,2)#  (1,3)
(2,0)   (2,1)#  (2,2)*  (2,3)
(3,0)#  (3,1)   (3,2)   (3,3)*

Ghi chú: 
  * : Đường chéo chính (i == j)
  # : Đường chéo phụ (i + j == 3)
```

---

## 2. Cú pháp & Vận hành

### 1. Kỹ thuật duyệt đường chéo siêu tốc O(N) thay vì O(N²)

Người mới học thường dùng 2 vòng lặp lồng nhau rồi kiểm tra điều kiện `if (i == j)` để tính tổng đường chéo (tốn O(N²) thao tác). Lập trình viên chuyên nghiệp chỉ cần **1 vòng lặp duy nhất chạy trong O(N)**!

```cpp
#include <iostream>

const int MAX = 100;

int main() {
    int n;
    std::cout << "Nhập kích thước ma trận vuông n x n: ";
    if (!(std::cin >> n) || n <= 0) return 0;

    int a[MAX][MAX];
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            std::cin >> a[i][j];
        }
    }

    long long sumMain = 0;
    long long sumAnti = 0;

    // ✅ Duyệt cả 2 đường chéo trong duy nhất 1 vòng lặp O(N)
    for (int i = 0; i < n; ++i) {
        sumMain += a[i][i];             // Đường chéo chính
        sumAnti += a[i][n - 1 - i];     // Đường chéo phụ
    }

    std::cout << "Tổng đường chéo chính: " << sumMain << "
";
    std::cout << "Tổng đường chéo phụ:   " << sumAnti << "
";

    return 0;
}
```

### 2. Thuật toán Ma trận chuyển vị (Transpose Matrix)
Ma trận chuyển vị A^T nhận được bằng cách biến **hàng thành cột, cột thành hàng**: A^T[j][i] = A[i][j].
Để chuyển vị tại chỗ (In-place) cho ma trận vuông mà không tốn thêm mảng phụ:
- Ta chỉ duyệt nửa tam giác trên (j > i) và hoán đổi `std::swap(a[i][j], a[j][i])`.

```cpp
void transpose(int a[][MAX], int n) {
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) { // Chỉ duyệt nửa tam giác trên
            std::swap(a[i][j], a[j][i]);
        }
    }
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Lỗi hoán đổi lặp 2 lần khi chuyển vị (Transpose Bug)
> Nếu bạn viết vòng lặp chuyển vị từ `j = 0` đến `n - 1`, khi ở hàng `i = 0, j = 1`, bạn đổi chỗ `a[0][1]` và `a[1][0]`. Nhưng khi vòng lặp chạy đến `i = 1, j = 0`, bạn lại đổi chỗ chúng một lần nữa! Kết quả là ma trận trở về trạng thái y như cũ!
> **Khắc phục:** Luôn nhớ điều kiện giới hạn j xuất phát từ `i + 1`.

> [!TIP]
> ### 2. Tránh tính trùng tâm điểm khi kích thước N là số lẻ
> Nếu N lẻ (ví dụ N = 3), phần tử chính giữa a[1][1] vừa thuộc đường chéo chính, vừa thuộc đường chéo phụ. Nếu bài toán yêu cầu "tính tổng các phần tử thuộc 2 đường chéo", bạn phải trừ đi phần tử tâm bị đếm 2 lần: `totalSum = sumMain + sumAnti - a[n/2][n/2];`.

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Cho ma trận vuông kích thước N = 5. Phần tử thuộc đường chéo phụ nằm ở hàng i = 3 sẽ có chỉ số cột j bằng bao nhiêu?
- A. 1
- B. 2
- C. 3
- D. 4

**Đáp án đúng:** **A**
*Giải thích:* Công thức đường chéo phụ là j = N - 1 - i = 5 - 1 - 3 = 1.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn kiểm tra xem ma trận vuông có phải là **Ma trận đối xứng** qua đường chéo chính (a[i][j] == a[j][i] với mọi i, j) hay không:

```cpp
// ❌ ĐOẠN CODE LỖI
bool isSymmetric = false;
for (int i = 0; i < n; ++i) {
    for (int j = 0; j < n; ++j) {
        if (a[i][j] == a[j][i]) {
            isSymmetric = true; // Sai lầm! Chỉ cần 1 cặp bằng nhau đã vội kết luận!
        }
    }
}
```
**Sửa lại chuẩn:**
Phải giả định ma trận là đối xứng ban đầu. Chỉ cần phát hiện **1 cặp duy nhất vi phạm**, lập tức kết luận sai và ngắt vòng lặp:
```cpp
// ✅ ĐOẠN CODE CHUẨN
bool isSymmetric = true;
for (int i = 0; i < n && isSymmetric; ++i) {
    for (int j = i + 1; j < n; ++j) {
        if (a[i][j] != a[j][i]) {
            isSymmetric = false;
            break;
        }
    }
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào ma trận vuông cấp N. Tính tổng các phần tử nằm ở nửa tam giác trên của đường chéo chính (không bao gồm các phần tử nằm trên đường chéo chính, tức là những vị trí thỏa mãn i < j).

**Code giải mẫu:**
```cpp
#include <iostream>

int main() {
    int n;
    if (!(std::cin >> n) || n <= 0) return 0;

    int a[100][100];
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            std::cin >> a[i][j];
        }
    }

    long long sumUpper = 0;
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) { // Chỉ duyệt các phần tử có j > i
            sumUpper += a[i][j];
        }
    }

    std::cout << "Tong tam giac tren: " << sumUpper << "
";
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **Đường chéo chính:** i == j. Duyệt trong O(N) bằng `a[i][i]`.
- **Đường chéo phụ:** i + j == N - 1 \iff j = N - 1 - i. Duyệt trong O(N) bằng `a[i][n - 1 - i]`.
- **Chuyển vị ma trận vuông tại chỗ:** Duyệt tam giác trên với j = i + 1 	o N - 1 và gọi `std::swap`.

*Bài học tiếp theo:* **Dự án Tổng kết Khóa 1!** Chúng ta sẽ sử dụng mảng động 2 chiều `std::vector<std::vector<T>>` để xây dựng trọn vẹn tựa game **Cờ Caro (Tic-Tac-Toe)** Console hoàn chỉnh có kiểm tra thắng thua.
