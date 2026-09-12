---
lessonId: "CPP-05.02"
title: "Kỹ thuật Duyệt mảng, Tìm Min/Max và Mảng đếm tần suất (Counting Array) O(N)"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["array traversal", "min max", "counting array", "frequency", "linear scan"]
prerequisites: ["CPP-05.01"]
---

## 1. Khái niệm & Vấn đề

Sau khi đã lưu trữ được một mảng dữ liệu, các bài toán thực tế thường đòi hỏi chúng ta phải xử lý thông tin: *"Ai là học sinh có điểm thi cao nhất?"*, *"Nhiệt độ thấp nhất trong tuần là bao nhiêu?"*, *"Mỗi mặt xúc xắc xuất hiện bao nhiêu lần trong 10,000 lần gieo?"*.

Để giải quyết các bài toán này, chúng ta cần làm chủ 3 kỹ thuật kinh điển:
1. **Kỹ thuật Quét tuyến tính (Linear Scan):** Duyệt qua từng phần tử của mảng một lần duy nhất với độ phức tạp O(N).
2. **Kỹ thuật Tìm Cực trị (Min/Max):** Duy trì một biến kỷ lục và cập nhật liên tục khi phát hiện giá trị tốt hơn.
3. **Kỹ thuật Mảng đếm tần suất (Counting Array):** Ứng dụng đột phá dùng **chính giá trị của phần tử làm chỉ số mảng** để đếm số lần xuất hiện với tốc độ cực hạn O(1) cho mỗi lần đếm!

| Kỹ thuật | Bản chất | Độ phức tạp thời gian | Ứng dụng |
| :--- | :--- | :---: | :--- |
| **Tìm Min/Max** | So sánh từng phần tử với biến kỷ lục hiện tại. | O(N) | Tìm điểm thủ khoa, tìm giá cổ phiếu cao nhất. |
| **Mảng đếm (Counting Array)** | `freq[a[i]]++`: Tăng giá trị ô đếm tương ứng. | O(N) | Thống kê phiếu bầu cử, đếm ký tự, thuật toán Counting Sort. |

---

## 2. Cú pháp & Vận hành

### 2.1. Kỹ thuật Tìm Phần tử Lớn nhất và Nhỏ nhất chuẩn mực
Quy tắc vàng: **Luôn gán giá trị kỷ lục ban đầu bằng phần tử đầu tiên của mảng (`a[0]`)**, sau đó duyệt từ phần tử thứ 2 (`i = 1`):

```cpp
#include <iostream>

int main() {
    int a[] = {12, 45, -8, 89, 23, 89, 10};
    int n = sizeof(a) / sizeof(a[0]); // Đếm số phần tử của mảng

    int maxVal = a[0];
    int minVal = a[0];

    for (int i = 1; i < n; ++i) {
        if (a[i] > maxVal) {
            maxVal = a[i]; // Phá vỡ kỷ lục Max
        }
        if (a[i] < minVal) {
            minVal = a[i]; // Phá vỡ kỷ lục Min
        }
    }

    std::cout << "Max: " << maxVal << ", Min: " << minVal << '\n';
    return 0;
}
```

### 2.2. Đột phá Tư duy: Mảng đếm tần suất (Counting Array)
Giả sử bạn có mảng điểm thi tốt nghiệp từ 0 đến 10 của 1,000 học sinh. Làm sao để đếm có bao nhiêu bạn đạt điểm 10, bao nhiêu bạn đạt điểm 8?
* Nếu dùng 2 vòng for lồng nhau: Tốn 10 	imes 1,000 = 10,000 phép tính (O(N²)).
* Nếu dùng **Mảng đếm tần suất**: Tạo mảng `int freq[11]{0}`. Khi gặp học sinh điểm `x`, chỉ cần chạy đúng 1 lệnh: `freq[x]++`! Toàn bộ bài toán giải quyết trong đúng 1,000 phép tính (O(N))!

```cpp
#include <iostream>

int main() {
    int diemThi[] = {8, 10, 9, 8, 7, 10, 8, 9};
    int n = sizeof(diemThi) / sizeof(diemThi[0]);

    // Mảng đếm tần suất cho điểm từ 0 đến 10 (khởi tạo toàn 0)
    int freq[11]{0};

    // Đếm tần suất trong duy nhất 1 vòng for O(N)
    for (int i = 0; i < n; ++i) {
        freq[diemThi[i]]++;
    }

    // In thống kê các điểm số có xuất hiện
    for (int diem = 0; diem <= 10; ++diem) {
        if (freq[diem] > 0) {
            std::cout << "Diem " << diem << " xuat hien: " << freq[diem] << " lan\n";
        }
    }
    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy cực kỳ phổ biến:**
> 1. **Khởi tạo `maxVal = 0` hoặc `minVal = 0`:**
>    Nếu mảng chứa toàn số âm (ví dụ: `{-5, -12, -3, -9}`), việc gán `maxVal = 0` sẽ cho kết quả Max là `0` (hoàn toàn sai vì 0 không có trong mảng!). **Luôn gán `maxVal = a[0]`**.
> 2. **Dùng số âm làm chỉ số cho mảng đếm tần suất:**
>    Chỉ số mảng bắt buộc phải là số không âm (i ≥ 0). Nếu phần tử a[i] = -5, lệnh `freq[a[i]]++` sẽ truy cập vào `freq[-5]` làm sập chương trình ngay lập tức!
>    *Cách xử lý:* Nếu mảng có số âm, cần cộng thêm một lượng bù (Offset) để đưa về số dương.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Khi tìm giá trị nhỏ nhất (Min) của một mảng số nguyên bất kỳ, cách khởi tạo biến `minVal` nào sau đây là **CHUẨN XÁC VÀ AN TOÀN NHẤT**?
* [ ] A) `int minVal = 0;`
* [ ] B) `int minVal = 1000;`
* [x] C) `int minVal = a[0];`
* [ ] D) `int minVal = -1;`

---

### Thử thách sửa lỗi (Debug)
Một bạn học sinh viết code tìm số lớn nhất nhưng bị sai kết quả với mảng số âm. Hãy sửa lại:

```cpp
// Code lỗi:
#include <iostream>

int main() {
    int a[] = {-10, -25, -5, -40};
    int max = 0; // LỖI KHỞI TẠO!
    for (int i = 0; i < 4; ++i) {
        if (a[i] > max) max = a[i];
    }
    std::cout << "Max: " << max << '\n'; // In ra 0 thay vì -5!
    return 0;
}
```

**Sửa lại:** Sửa dòng khởi tạo thành: `int max = a[0];` và cho vòng for chạy từ `i = 1`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào số nguyên dương n (1 ≤ n ≤ 1000) và n số nguyên của mảng (các số nguyên dương trong khoảng từ 1 đến 1000). Hãy tìm số có **tần suất xuất hiện nhiều lần nhất** trong mảng. Nếu có nhiều số có cùng số lần xuất hiện nhiều nhất, hãy in ra số có giá trị nhỏ nhất.
* In ra trên 2 dòng:
  * Dòng 1: `Gia tri: <so_xuat_hien_nhieu_nhat>`
  * Dòng 2: `So lan: <so_lan>`

**Ví dụ:**
* Đầu vào:
  ```text
  7
  3 5 3 2 5 3 1
  ```
* Đầu ra:
  ```text
  Gia tri: 3
  So lan: 3
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    int n = 0;
    if (std::cin >> n && n > 0 && n <= 1000) {
        int a[1000];
        int freq[1001]{0}; // Khởi tạo mảng đếm toàn bộ bằng 0

        for (int i = 0; i < n; ++i) {
            std::cin >> a[i];
            if (a[i] >= 1 && a[i] <= 1000) {
                freq[a[i]]++;
            }
        }

        int maxFreq = 0;
        int resVal = 0;

        for (int val = 1; val <= 1000; ++val) {
            if (freq[val] > maxFreq) {
                maxFreq = freq[val];
                resVal = val;
            }
        }

        std::cout << "Gia tri: " << resVal << '\n';
        std::cout << "So lan: " << maxFreq << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Khi tìm Min/Max, luôn khởi tạo kỷ lục bằng `a[0]` để bảo đảm tính đúng đắn cho mọi tập dữ liệu (kể cả mảng toàn số âm).
* **Mảng đếm tần suất (Counting Array)** chuyển đổi bài toán tìm kiếm từ O(N) xuống O(1), là tiền đề của cấu trúc Hash Table.
* Chỉ áp dụng mảng đếm khi giá trị của phần tử nằm trong khoảng giới hạn vừa phải (a[i] ≤ 10⁷).

Trong bài học tiếp theo **[Bài 5.3: Các thuật toán sắp xếp cơ bản: Bubble Sort, Selection Sort, Insertion Sort]**, chúng ta sẽ khám phá cách tổ chức lại trật tự dữ liệu của mảng với 3 thuật toán sắp xếp kinh điển.
