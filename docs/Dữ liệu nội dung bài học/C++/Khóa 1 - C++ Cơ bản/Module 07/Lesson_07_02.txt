---
lessonId: "CPP-07.02"
title: "Ma trận Vuông: Quy luật Đường chéo Chính, Phụ và Ma trận Chuyển vị"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["square matrix", "main diagonal", "anti-diagonal", "transpose", "matrix symmetry"]
prerequisites: ["CPP-07.01"]
---

# Ma trận Vuông: Quy luật Đường chéo Chính, Phụ và Ma trận Chuyển vị

## 1. Khái niệm cốt lõi

**Ma trận vuông** là ma trận có số hàng bằng số cột ($N \times N$). Đây là dạng ma trận có tính đối xứng hình học đặc biệt và xuất hiện trong rất nhiều bài toán thuật toán:

* **Đường chéo chính (Main Diagonal):** Dải phần tử chạy từ góc trên bên trái xuống góc dưới bên phải.
* **Đường chéo phụ (Anti-Diagonal):** Dải phần tử chạy từ góc trên bên phải xuống góc dưới bên trái.
* **Ma trận chuyển vị (Transpose):** Biến đổi hàng của ma trận ban đầu thành cột của ma trận mới.

## 2. Cú pháp & Quy tắc hoạt động

### Sơ đồ quy luật chỉ số của Ma trận vuông cấp $N = 3$:
```text
              Cột 0     Cột 1     Cột 2
Hàng 0:    [ (0,0)  ,  (0,1)  ,  (0,2) ]
Hàng 1:    [ (1,0)  ,  (1,1)  ,  (1,2) ]
Hàng 2:    [ (2,0)  ,  (2,1)  ,  (2,2) ]

QUY LUẬT CHỈ SỐ VÀNG:
1. Đường chéo chính:  Chỉ số hàng bằng chỉ số cột  ──►  i == j  [(0,0), (1,1), (2,2)]
   - Nửa trên chéo chính: i < j
   - Nửa dưới chéo chính: i > j

2. Đường chéo phụ:    Tổng hai chỉ số luôn cố định  ──►  i + j == N - 1
   - Phần tử tại hàng i có chỉ số cột là: j = N - 1 - i  [(0,2), (1,1), (2,0)]
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Tính tổng đường chéo chính (Tối ưu chỉ 1 vòng lặp $O(N)$)
```cpp
int a[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

int tongChéoChinh = 0;
// Chỉ cần 1 vòng lặp duy nhất vì i == j
for (int i = 0; i < 3; ++i) {
    tongChéoChinh += a[i][i]; // 1 + 5 + 9 = 15
}
```

### Ví dụ 2: Tính tổng đường chéo phụ (1 vòng lặp)
```cpp
int n = 3;
int tongChéoPhu = 0;
for (int i = 0; i < n; ++i) {
    tongChéoPhu += a[i][n - 1 - i]; // 3 + 5 + 7 = 15
}
```

### Ví dụ 3: Ma trận chuyển vị (Đổi hàng thành cột)
```cpp
// Phần tử b[j][i] nhận giá trị từ a[i][j]
b[j][i] = a[i][j];
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Dùng 2 vòng lặp lồng nhau $O(N^2)$ để duyệt đường chéo**
> * *Lỗi:* Viết 2 vòng lặp `for (i)` rồi `for (j)` và kiểm tra `if (i == j)`.
> * *Khắc phục:* Trên đường chéo chính, chỉ số hàng và cột luôn là `a[i][i]`. Chỉ cần **1 vòng lặp đơn** chạy từ `0` đến `N - 1` là đủ.

## 5. Ghi nhớ trọng tâm

- Ma trận vuông có số hàng bằng số cột ($N \times N$).
- Đường chéo chính: phần tử có tọa độ `a[i][i]`.
- Đường chéo phụ: phần tử có tọa độ `a[i][N - 1 - i]`.
- Chuyển vị ma trận: hoán vị vị trí hàng và cột `b[j][i] = a[i][j]`.
