---
lessonId: "CPP-05.01"
title: "Mảng 1 Chiều (Fixed-size Array): Bản chất Ô nhớ và Khai báo"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["array", "fixed-size array", "index", "memory layout", "0-based indexing"]
prerequisites: ["CPP-03.01"]
---

# Mảng 1 Chiều (Fixed-size Array): Bản chất Ô nhớ và Khai báo

## 1. Khái niệm cốt lõi

Nếu cần lưu điểm số của 3 học sinh, bạn có thể tạo 3 biến: `d1, d2, d3`. Nhưng nếu cần lưu điểm của 1,000 học sinh, việc khai báo 1,000 biến đơn lẻ là không thể thực hiện được.

**Mảng 1 chiều (Array)** là một tập hợp các phần tử có **cùng kiểu dữ liệu**, được lưu trữ tại **các ô nhớ nằm liên tiếp nhau** trong bộ nhớ RAM.

| Đặc điểm của Mảng | Ý nghĩa |
| :--- | :--- |
| **Cùng kiểu dữ liệu** | Toàn bộ phần tử trong mảng phải là cùng kiểu `int`, cùng kiểu `double`... |
| **Kích thước cố định** | Số lượng phần tử phải được xác định khi khai báo và không thể co giãn sau đó. |
| **Chỉ số (Index) bắt đầu từ 0** | Phần tử đầu tiên có chỉ số `0`, phần tử cuối cùng có chỉ số `N - 1`. |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp khai báo:
```cpp
kiểu_dữ_liệu tên_mảng[số_lượng_phần_tử];
```

### Minh họa cấu trúc ô nhớ liên tiếp trong RAM:
```text
Khai báo: int a[5] = {10, 20, 30, 40, 50};

Chỉ số (Index):    [0]     [1]     [2]     [3]     [4]
Giá trị lưu trữ:   10      20      30      40      50
Địa chỉ ô nhớ:    #100    #104    #108    #112    #116  (Mỗi phần tử int chiếm 4 byte)
```

Truy xuất phần tử: dùng cú pháp `tên_mảng[chỉ_số]`. Ví dụ: `a[0]` có giá trị 10, `a[2]` có giá trị 30.

## 3. Ví dụ minh họa tinh gọn

```cpp
// Khai báo mảng 5 phần tử và khởi tạo giá trị
int diemSo[5] = {8, 9, 7, 10, 6};

// Đọc và sửa giá trị phần tử
diemSo[0] = 10; // Thay đổi giá trị phần tử đầu tiên thành 10

// Duyệt và in tất cả các phần tử trong mảng
for (int i = 0; i < 5; ++i) {
    std::cout << diemSo[i] << ' ';
}
// Kết quả in ra: 10 9 7 10 6
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Lỗi truy cập vượt quá giới hạn mảng (Out of Bounds)**
> * *Lỗi:* Mảng có 5 phần tử `int a[5];` (chỉ số hợp lệ từ `0` đến `4`), nhưng cố truy cập `a[5]` hoặc `a[10]`.
> * *Hậu quả:* C++ không tự kiểm tra biên mảng. Việc truy cập này sẽ đọc hoặc ghi đè vào vùng nhớ của biến khác, gây sai số nghiêm trọng hoặc làm sập chương trình (Segmentation Fault).
> * *Quy tắc:* Mảng `N` phần tử thì chỉ số chỉ được chạy từ `0` đến `N - 1`.

> [!WARNING]
> **2. Khai báo kích thước mảng bằng biến số chưa xác định**
> * *Lỗi:* Viết `int n; std::cin >> n; int a[n];` trong C++ tiêu chuẩn.
> * *Quy tắc:* Trong C++ chuẩn, kích thước mảng tĩnh bắt buộc phải là một hằng số cố định đã biết trước lúc biên dịch (ví dụ: `const int MAX = 1000; int a[MAX];`).

## 5. Ghi nhớ trọng tâm

- Mảng là dãy các ô nhớ liên tiếp cùng kiểu dữ liệu.
- Trong C++, chỉ số phần tử luôn bắt đầu từ `0` và kết thúc tại `N - 1`.
- Luôn kiểm soát chỉ số vòng lặp `for (int i = 0; i < N; ++i)` để không vượt quá kích thước mảng.
