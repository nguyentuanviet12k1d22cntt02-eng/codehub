---
lessonId: "CPP-05.01"
title: "Mảng Tĩnh (Static Array) - Bản chất Bộ nhớ liên tiếp và Truy xuất chỉ số O(1)"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["array", "static array", "contiguous memory", "indexing", "o1 access", "subscript"]
prerequisites: ["CPP-04.05"]
---

## 1. Khái niệm & Vấn đề

Hãy tưởng tượng bạn đang viết phần mềm quản lý điểm thi cho 1,000 học sinh. Nếu không có cấu trúc lưu trữ tập hợp, bạn sẽ phải khai báo 1,000 biến đơn lẻ: `double diem1, diem2, diem3, ..., diem1000;`! Điều này hoàn toàn bất khả thi và ngớ ngẩn.

Để giải quyết nhu cầu lưu trữ và quản lý hàng loạt dữ liệu có cùng tính chất, C++ cung cấp **Mảng (Array)**. 

Về bản chất vật lý trong bộ nhớ RAM: **Mảng tĩnh là một tập hợp các phần tử có CÙNG KIỂU DỮ LIỆU, được sắp xếp nằm LIỀN KỀ NHAU trên một dải ô nhớ liên tiếp**.

| Thuật ngữ | Cú pháp C++ | Ý nghĩa kỹ thuật | Phép ẩn dụ thực tế |
| :--- | :--- | :--- | :--- |
| **Khai báo mảng** | `int arr[100];` | Yêu cầu hệ điều hành cấp 100 ô nhớ liên tiếp kiểu `int`. | Đặt trước 1 dãy 100 ghế ngồi liền nhau trong rạp chiếu phim. |
| **Chỉ số (Index)** | `0, 1, 2, ..., N-1` | Vị trí đánh số của từng phần tử (bắt đầu từ **0**). | Số thứ tự ghế từ 0 đến N-1. |
| **Toán tử truy xuất `[ ]`** | `arr[i]` | Đọc hoặc ghi trực tiếp vào ô nhớ thứ `i`. | Đi thẳng đến chiếc ghế số `i` để ngồi. |
| **Độ phức tạp O(1)** | O(1) | Tốc độ truy xuất tức thì bất kể mảng có 10 phần tử hay 10 triệu phần tử! | Nhờ công thức toán học, CPU tính ra ngay địa chỉ đích mà không cần đi tìm. |

---

## 2. Cú pháp & Vận hành

### 2.1. Cú pháp Khởi tạo và Sử dụng Mảng Tĩnh
```cpp
#include <iostream>

int main() {
    // 1. Khai báo và khởi tạo danh sách phần tử
    int diem[5] = {8, 9, 7, 10, 6};

    // 2. Khởi tạo toàn bộ mảng bằng số 0 (Zero-initialization chuẩn C++11/17)
    int dem[10]{0}; // Toàn bộ 10 phần tử đều mang giá trị 0 an toàn!

    // 3. Truy xuất và thay đổi giá trị bằng chỉ số
    std::cout << "Phan tu dau tien (chi so 0): " << diem[0] << '\n'; // 8
    diem[0] = 10; // Gán lại giá trị mới
    std::cout << "Sau khi sua: " << diem[0] << '\n'; // 10

    // 4. Duyệt toàn bộ mảng bằng vòng lặp for
    std::cout << "Danh sach diem: ";
    for (int i = 0; i < 5; ++i) {
        std::cout << diem[i] << ' ';
    }
    std::cout << '\n';

    return 0;
}
```

### 2.2. Giải mã Bí mật: Vì sao Truy xuất Mảng đạt Tốc độ Tức thì O(1)?
Vì các phần tử nằm liền kề nhau trên RAM, máy tính **không cần tìm kiếm tuần tự**. CPU sử dụng một công thức số học cực nhanh:

	ext{Địa chỉ ô nhớ của } arr[i] = 	ext{Địa chỉ bắt đầu } arr[0] + i 	imes 	ext{sizeof(Kiểu dữ liệu)}

*Ví dụ:* Nếu mảng `int` bắt đầu tại địa chỉ `1000`, mỗi số `int` chiếm 4 bytes:
* `arr[0]` nằm tại: 1000 + 0 	imes 4 = 1000
* `arr[1]` nằm tại: 1000 + 1 	imes 4 = 1004
* `arr[4]` nằm tại: 1000 + 4 	imes 4 = 1016
Phép nhân và phép cộng địa chỉ này được phần cứng CPU xử lý chỉ trong **1 chu kỳ xung nhịp (Clock Cycle)**!

### 2.3. Quy ước 0-indexed (Chỉ số bắt đầu từ 0)
Chỉ số `i` trong `arr[i]` thực chất là **Độ dời (Offset)** so với phần tử đầu tiên:
* Phần tử đầu tiên dời `0` bước ➔ Chỉ số là `0`.
* Với mảng có N phần tử, chỉ số hợp lệ chạy từ **0 đến N - 1**.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Thảm họa Tràn biên mảng (Buffer Overflow / Out-of-bounds):**
> Trong C++, trình biên dịch **KHÔNG TỰ ĐỘNG KIỂM TRA** bạn có truy xuất ngoài biên mảng hay không vì lý do tối ưu tốc độ tối đa:
> ```cpp
> int a[5]; // Chỉ số hợp lệ là: 0, 1, 2, 3, 4
> a[5] = 999;  // NGUY HIỂM: Ghi đè vào ô nhớ của biến khác!
> a[100] = 50; // SẬP CHƯƠNG TRÌNH: Segmentation Fault!
> ```
> *Quy tắc sống còn:* Luôn kiểm tra điều kiện chỉ số 0 ≤ i < N.

> [!TIP]
> **Kích thước Mảng Tĩnh trong chuẩn ISO C++:**
> Kích thước mảng tĩnh `int a[N]` bắt buộc N phải là **Hằng số đã biết lúc biên dịch** (`const` hoặc `constexpr`). Tránh sử dụng biến động `int n; cin >> n; int a[n];` (Variable Length Array - VLA) vì đây là tiện ích mở rộng không chính thức của GCC và bị cấm trong chuẩn C++ ISO.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Một mảng tĩnh được khai báo: `int a[10];`. Các chỉ số hợp lệ để truy xuất mảng này là:
* [ ] A) Từ 1 đến 10
* [x] B) Từ 0 đến 9
* [ ] C) Từ 0 đến 10
* [ ] D) Từ 1 đến 9

---

### Thử thách sửa lỗi (Debug)
Quan sát đoạn mã in mảng sau và sửa lỗi Out-of-bounds:

```cpp
// Code lỗi:
#include <iostream>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    // Duyệt mảng:
    for (int i = 0; i <= 5; ++i) { // LỖI TRÀN BIÊN TẠI i = 5!
        std::cout << arr[i] << ' ';
    }
    return 0;
}
```

**Sửa lại:** Đổi điều kiện lặp thành `i < 5`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào số nguyên dương n (1 ≤ n ≤ 1000) và n số nguyên của mảng a. Hãy in ra các phần tử của mảng theo **thứ tự đảo ngược** (từ phần tử cuối cùng về phần tử đầu tiên), các số cách nhau bởi một dấu cách.

**Ví dụ:**
* Đầu vào:
  ```text
  5
  1 4 9 16 25
  ```
* Đầu ra:
  ```text
  25 16 9 4 1
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    int n = 0;
    if (std::cin >> n && n > 0 && n <= 1000) {
        int a[1000];
        for (int i = 0; i < n; ++i) {
            std::cin >> a[i];
        }

        // In ngược từ n - 1 về 0
        for (int i = n - 1; i >= 0; --i) {
            std::cout << a[i] << ' ';
        }
        std::cout << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Mảng tĩnh là cấu trúc dữ liệu tuyến tính lưu trữ các phần tử liên tiếp trên RAM, hỗ trợ truy xuất ngẫu nhiên O(1).
* Luôn nhớ mảng trong C++ đánh chỉ số từ 0 đến N - 1.
* Tuyệt đối không truy xuất ngoài biên mảng để phòng chống lỗi bảo mật **Buffer Overflow**.

Trong bài học tiếp theo **[Bài 5.2: Kỹ thuật Duyệt mảng, Tìm Min/Max và Mảng đếm tần suất (Counting Array) O(N)]**, chúng ta sẽ học các kỹ thuật thao tác dữ liệu cốt lõi trên mảng và thuật toán đếm tần suất siêu tốc.
