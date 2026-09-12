---
lessonId: "CPP-05.02"
title: "Các Thuật toán Duyệt và Tìm kiếm Cơ bản trên Mảng (Linear Search, Min/Max)"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["linear search", "min", "max", "array traversal"]
prerequisites: ["CPP-05.01"]
---

# Các Thuật toán Duyệt và Tìm kiếm Cơ bản trên Mảng

## 1. Khái niệm cốt lõi

Khi đã lưu trữ dữ liệu trong mảng, hai thao tác nền tảng nhất là:
1. **Tìm kiếm tuyến tính (Linear Search):** Lần lượt kiểm tra từng phần tử từ đầu đến cuối mảng xem có phần tử nào khớp với giá trị cần tìm hay không.
2. **Tìm giá trị Lớn nhất / Nhỏ nhất (Min / Max):** Quét qua mảng và duy trì một biến lưu giá trị tối ưu nhất tính đến thời điểm hiện tại.

## 2. Cú pháp & Quy tắc hoạt động

### Thuật toán Tìm Min / Max (Tư duy người giữ cúp):
1. **Giả định:** Coi phần tử đầu tiên `a[0]` là nhà vô địch tạm thời (`maxVal = a[0]`).
2. **Thách đấu:** Cho các phần tử tiếp theo từ `1` đến `n - 1` lần lượt so tài với `maxVal`.
3. **Đổi ngôi:** Nếu gặp phần tử nào lớn hơn `maxVal`, gán lại `maxVal = a[i]`.

```text
Mảng: [ 4,  9,  2,  11,  5 ]
Bước 0: Giả sử maxVal = a[0] = 4
Bước 1: So với 9  ──► 9 > 4  ──► maxVal đổi thành 9
Bước 2: So với 2  ──► 2 < 9  ──► maxVal giữ nguyên 9
Bước 3: So với 11 ──► 11 > 9 ──► maxVal đổi thành 11
Bước 4: So với 5  ──► 5 < 11 ──► maxVal giữ nguyên 11
Kết quả: 11 là giá trị lớn nhất.
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Tìm giá trị lớn nhất trong mảng
```cpp
int a[5] = {12, 45, 7, 89, 23};
int maxVal = a[0]; // Khởi tạo bằng phần tử đầu tiên

for (int i = 1; i < 5; ++i) {
    if (a[i] > maxVal) {
        maxVal = a[i]; // Cập nhật kỷ lục mới
    }
}
// maxVal có giá trị là 89
```

### Ví dụ 2: Tìm kiếm một số `x` trong mảng (Linear Search)
```cpp
int a[5] = {3, 7, 1, 9, 5};
int x = 9;
int viTri = -1; // Mặc định -1 nghĩa là không tìm thấy

for (int i = 0; i < 5; ++i) {
    if (a[i] == x) {
        viTri = i; // Đã tìm thấy tại vị trí i
        break;     // Thoát ngay khi tìm thấy
    }
}
// viTri có giá trị là 3 (a[3] == 9)
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Khởi tạo `maxVal = 0` hoặc `minVal = 0` một cách tùy tiện**
> * *Lỗi:* Tìm số lớn nhất trong mảng toàn số âm `{-5, -2, -9}` nhưng lại gán `int maxVal = 0;`.
> * *Hậu quả:* Kết quả in ra `0` (sai hoàn toàn vì số 0 không có trong mảng và lớn hơn mọi số âm trong mảng).
> * *Quy tắc chuẩn:* Luôn khởi tạo `maxVal = a[0]` và `minVal = a[0]`.

## 5. Ghi nhớ trọng tâm

- Duyệt mảng bằng vòng lặp `for (int i = 0; i < n; ++i)`.
- Tìm kiếm tuyến tính quét lần lượt từng phần tử, dùng `break` khi đã tìm thấy.
- Tìm Min/Max: Luôn gán giá trị khởi tạo bằng phần tử đầu tiên `a[0]`.
