---
lessonId: "CPP-05.03"
title: "Các thuật toán sắp xếp cơ bản: Bubble Sort, Selection Sort, Insertion Sort"
difficulty: "MEDIUM"
estimatedDuration: 30
keywords: ["sorting", "bubble sort", "selection sort", "insertion sort", "swap", "on2"]
prerequisites: ["CPP-05.02"]
---

## 1. Khái niệm & Vấn đề

Dữ liệu trong thế giới thực thường ở trạng thái lộn xộn: danh bạ điện thoại chưa sắp tên, điểm thi chưa xếp hạng, danh sách sản phẩm chưa xếp theo giá. 

Để có thể tìm kiếm dữ liệu siêu tốc bằng thuật toán **Tìm kiếm nhị phân (Binary Search - O(\log N))**, điều kiện tiên quyết bắt buộc là **mảng phải được sắp xếp theo thứ tự**.

Ba thuật toán sắp xếp nền tảng nhất mở đầu cho môn Cấu trúc Dữ liệu & Giải thuật (DSA) là:
1. **Bubble Sort (Sắp xếp nổi bọt):** Các phần tử lớn nổi dần về cuối mảng như các bọt khí nổi lên mặt nước.
2. **Selection Sort (Sắp xếp chọn):** Tại mỗi lượt, tìm kiếm phần tử nhỏ nhất trong dãy chưa sắp xếp và đưa về vị trí đầu tiên.
3. **Insertion Sort (Sắp xếp chèn):** Xây dựng dãy đã sắp xếp bằng cách lấy từng phần tử mới chèn vào đúng vị trí thích hợp (tương tự như cách bạn sắp bài tây trên tay).

| Thuật toán | Ý tưởng cốt lõi | Độ phức tạp thời gian | Đánh giá |
| :--- | :--- | :---: | :--- |
| **Bubble Sort** | So sánh và hoán đổi 2 phần tử kề nhau: `a[j] > a[j+1]`. | O(N²) | Rất trực quan; dễ tối ưu bằng cờ hiệu `isSorted`. |
| **Selection Sort** | Tìm phần tử nhỏ nhất đưa về đầu dãy: `min_idx`. | O(N²) | Giảm tối đa số lần hoán đổi bộ nhớ (tối đa N-1 lần swap). |
| **Insertion Sort** | Dời các phần tử lớn hơn sang phải để chèn `key` vào khe trống. | O(N²) | Chạy cực nhanh trên mảng gần như đã được sắp xếp (O(N)). |

---

## 2. Cú pháp & Vận hành

### 2.1. Cài đặt Bubble Sort (Sắp xếp nổi bọt) có tối ưu cờ hiệu
Nếu sau 1 lượt duyệt mà không có bất kỳ cặp số nào bị đổi chỗ, mảng đã được sắp xếp xong ➔ Thoát sớm ngay lập tức!

```cpp
#include <iostream>

void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        bool daSapXep = true;
        for (int j = 0; j < n - i - 1; ++j) {
            if (a[j] > a[j + 1]) {
                std::swap(a[j], a[j + 1]);
                daSapXep = false;
            }
        }
        if (daSapXep) break; // Tối ưu: Dừng sớm nếu mảng đã ngăn nắp
    }
}
```

### 2.2. Cài đặt Selection Sort (Sắp xếp chọn)
```cpp
void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        int viTriMin = i;
        for (int j = i + 1; j < n; ++j) {
            if (a[j] < a[viTriMin]) {
                viTriMin = j;
            }
        }
        if (viTriMin != i) {
            std::swap(a[i], a[viTriMin]);
        }
    }
}
```

### 2.3. Cài đặt Insertion Sort (Sắp xếp chèn)
```cpp
void insertionSort(int a[], int n) {
    for (int i = 1; i < n; ++i) {
        int key = a[i];
        int j = i - 1;

        // Dời các phần tử lớn hơn key sang phải 1 vị trí
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key; // Đặt key vào vị trí thích hợp
    }
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy khi cài đặt thuật toán sắp xếp:**
> 1. **Lỗi tràn biên trong Bubble Sort:**
>    Vòng lặp trong viết `j < n - i`. Khi `j = n - 1`, phép so sánh `a[j] > a[j + 1]` sẽ truy cập vào `a[n]` (nằm ngoài mảng!). Điều kiện chuẩn xác bắt buộc là: `j < n - i - 1`.
> 2. **Quên lưu biến `key` trong Insertion Sort:**
>    Nếu không lưu `int key = a[i]`, khi dời mảng `a[j + 1] = a[j]`, giá trị ban đầu của `a[i]` sẽ bị ghi đè và biến mất vĩnh viễn!

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Thuật toán sắp xếp nào trong 3 thuật toán trên có hiệu năng tốt nhất đạt độ phức tạp tuyến tính O(N) khi mảng đầu vào **đã được sắp xếp sẵn** từ trước?
* [ ] A) Selection Sort
* [x] B) Insertion Sort (Vòng lặp while kiểm tra `a[j] > key` dừng ngay lập tức)
* [ ] C) Cả 3 đều chạy như nhau
* [ ] D) Không thuật toán nào đạt được O(N)

---

### Thử thách sửa lỗi (Debug)
Quan sát đoạn mã Selection Sort sau và phát hiện lỗi logic khiến mảng bị sắp xếp sai:

```cpp
// Code lỗi:
void selectionSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        for (int j = i + 1; j < n; ++j) {
            if (a[j] < a[i]) {
                std::swap(a[i], a[j]); // LỖI: Hoán đổi quá nhiều lần!
            }
        }
    }
}
```

**Phân tích:** Đoạn code trên hoán đổi liên tục mỗi khi thấy số nhỏ hơn, biến Selection Sort thành một biến thể kém hiệu quả. Bản chất Selection Sort chuẩn là **chỉ lưu chỉ số `viTriMin`**, sau khi duyệt hết vòng `j` mới thực hiện duy nhất 1 lần swap!

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào số nguyên dương n (1 ≤ n ≤ 1000) và n số nguyên của mảng a. Hãy cài đặt thuật toán **Bubble Sort** để sắp xếp mảng theo thứ tự **Tăng dần**. In ra mảng sau khi sắp xếp, các số cách nhau bởi một dấu cách.

**Ví dụ:**
* Đầu vào:
  ```text
  6
  5 2 8 1 9 4
  ```
* Đầu ra:
  ```text
  1 2 4 5 8 9
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (a[j] > a[j + 1]) {
                int temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    int n = 0;
    if (std::cin >> n && n > 0 && n <= 1000) {
        int a[1000];
        for (int i = 0; i < n; ++i) {
            std::cin >> a[i];
        }

        bubbleSort(a, n);

        for (int i = 0; i < n; ++i) {
            std::cout << a[i] << ' ';
        }
        std::cout << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Cả 3 thuật toán cơ bản (Bubble, Selection, Insertion) đều có độ phức tạp trung bình là O(N²), phù hợp cho các bài toán dữ liệu nhỏ (N ≤ 1000).
* **Insertion Sort** là thuật toán thực tế tốt nhất trong nhóm O(N²), đặc biệt hiệu quả trên mảng gần như đã sắp xếp.
* Để xử lý các mảng lớn hàng triệu phần tử, trong các khóa học sau chúng ta sẽ học các thuật toán nâng cao O(N \log N) như Quick Sort, Merge Sort và hàm chuẩn `std::sort`.

Trong bài học tiếp theo **[Bài 5.4: std::vector trong Modern C++ - Mảng Động chuẩn công nghiệp và Range-based for]**, chúng ta sẽ tạm biệt các hạn chế của mảng tĩnh để làm quen với container mạnh mẽ bậc nhất của C++: `std::vector`.
