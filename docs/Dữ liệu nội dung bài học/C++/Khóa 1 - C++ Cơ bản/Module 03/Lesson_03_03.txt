---
lessonId: "CPP-03.03"
title: "Vòng lặp lồng nhau (Nested Loops) và Kỹ thuật Vẽ hình tư duy"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["nested loops", "pattern printing", "grid", "nested for", "2d iteration"]
prerequisites: ["CPP-03.02"]
---

## 1. Khái niệm & Vấn đề

Trong lập trình màn hình Console và phát triển thuật toán, chúng ta thường xuyên phải làm việc với dữ liệu 2 chiều dạng lưới hàng và cột: ma trận bảng điểm, bàn cờ vua 8x8, lưới pixel điểm ảnh màn hình hay các bài tập tư duy vẽ hình tam giác sao, hình thoi, bảng cửu chương.

Để quét qua toàn bộ các ô trong một bảng 2 chiều gồm R hàng và C cột, một vòng lặp đơn là không đủ. Chúng ta cần đặt một vòng lặp bên trong một vòng lặp khác (**Vòng lặp lồng nhau - Nested Loops**). 

Quy tắc vàng bất biến của lập trình 2 chiều:
* **Vòng lặp ngoài (Outer Loop):** Điều khiển **Hàng (Row)** chạy từ trên xuống dưới.
* **Vòng lặp trong (Inner Loop):** Điều khiển **Cột (Column)** chạy từ trái sang phải trên từng hàng đó.

| Khái niệm | Vòng lặp phụ trách | Ý nghĩa hoạt động | Phép ẩn dụ thực tế |
| :--- | :--- | :--- | :--- |
| **Chỉ số Hàng (`i`)** | Vòng lặp ngoài (Outer Loop) | Quyết định đang vẽ ở dòng thứ mấy. | Chiếc kim giờ đồng hồ: nhích từng nấc một rất chậm. |
| **Chỉ số Cột (`j`)** | Vòng lặp trong (Inner Loop) | In từng ký tự trên dòng đó từ trái sang phải. | Chiếc kim phút: phải quay đủ 60 phút thì kim giờ mới nhích 1 nấc. |

---

## 2. Cú pháp & Vận hành

### 2.1. Cú pháp cơ bản của Vòng lặp lồng nhau
Dưới đây là chương trình in ra một hình chữ nhật đặc gồm M hàng và N cột dấu sao:

```cpp
#include <iostream>

int main() {
    int soHang = 3;
    int soCot = 5;

    // Vòng lặp ngoài: Quản lý từng hàng i
    for (int i = 1; i <= soHang; ++i) {
        // Vòng lặp trong: Quản lý từng cột j trên hàng i
        for (int j = 1; j <= soCot; ++j) {
            std::cout << "* ";
        }
        std::cout << '\n'; // HẾT 1 HÀNG THÌ XUỐNG DÒNG!
    }

    return 0;
}
```

**Kết quả in ra màn hình:**
```text
* * * * * 
* * * * * 
* * * * * 
```

### 2.2. Kỹ thuật Tư duy Vẽ hình Tam giác Vuông
Để vẽ một tam giác vuông có N dòng, ta nhận xét quy luật hình học:
* Hàng `i = 1` có 1 sao.
* Hàng `i = 2` có 2 sao.
* Hàng `i = 3` có 3 sao.
* ➔ **Tổng quát:** Ở hàng thứ `i`, số lượng sao cần in đúng bằng `i`!
Do đó, vòng lặp trong cho biến cột `j` chạy từ `1` đến `i`:

```cpp
#include <iostream>

int main() {
    int n = 4;

    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= i; ++j) {
            std::cout << "* ";
        }
        std::cout << '\n';
    }

    return 0;
}
```

**Kết quả:**
```text
* 
* * 
* * * 
* * * * 
```

### 2.3. Bảng phân tích độ phức tạp thời gian (Time Complexity)
Nếu vòng lặp ngoài chạy N lần, vòng lặp trong chạy M lần, tổng số lần thân vòng lặp trong được thực thi là:
Total = N 	imes M
Độ phức tạp thời gian đạt mức **O(N²)** khi N = M. Vì vậy, khi viết vòng lặp lồng nhau, luôn phải chú ý giới hạn của N để tránh bị quá tải CPU (Time Limit Exceeded).

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các sai lầm chết người trong vòng lặp lồng:**
> 1. **Dùng chung một biến đếm cho cả 2 vòng lặp:**
>    Viết `for (int i = 0; ...)` ở vòng ngoài và lại viết `for (int i = 0; ...)` ở vòng trong! Vòng lặp trong sẽ ghi đè làm biến `i` bị reset liên tục, gây vòng lặp vô tận.
> 2. **Quên in ký tự xuống dòng `std::cout << '
'` sau vòng lặp trong:**
>    Nếu quên lệnh xuống dòng, toàn bộ các dấu sao sẽ bị dồn hết lên 1 hàng ngang duy nhất.
> 3. **Lệnh `break` trong vòng lặp lồng:**
>    Lệnh `break` chỉ thoát ra khỏi **duy nhất 1 vòng lặp trực tiếp chứa nó** (vòng lặp trong), hoàn toàn không thể làm dừng vòng lặp ngoài.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Đoạn code sau đây in ra màn hình tổng cộng bao nhiêu dấu sao `*`?
```cpp
for (int i = 1; i <= 3; ++i) {
    for (int j = 1; j <= 4; ++j) {
        std::cout << "*";
    }
}
```
* [ ] A) 7 dấu sao
* [x] B) 12 dấu sao (3 hàng × 4 cột = 12)
* [ ] C) 4 dấu sao
* [ ] D) 16 dấu sao

---

### Thử thách sửa lỗi (Debug)
Quan sát đoạn mã in bảng cửu chương 2x2 sau đây và sửa lỗi vòng lặp vô tận do nhầm lẫn biến đếm:

```cpp
// Code lỗi:
#include <iostream>

int main() {
    for (int i = 1; i <= 2; ++i) {
        for (int i = 1; i <= 2; ++i) { // LỖI TRÙNG TÊN BIẾN!
            std::cout << i << ' ';
        }
        std::cout << '\n';
    }
    return 0;
}
```

**Sửa lại:** Đổi biến đếm của vòng lặp bên trong thành `int j = 1; j <= 2; ++j`.

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Nhận vào từ bàn phím một số nguyên dương `n` (1 ≤ n ≤ 20). Hãy in ra tam giác vuông số kích thước `n` theo mẫu:
* Dòng 1: `1`
* Dòng 2: `1 2`
* Dòng 3: `1 2 3`
* ...
* Dòng n: `1 2 3 ... n`

**Ví dụ:**
* Đầu vào: `4`
* Đầu ra:
  ```text
  1 
  1 2 
  1 2 3 
  1 2 3 4 
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

int main() {
    int n = 0;
    if (std::cin >> n && n > 0) {
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= i; ++j) {
                std::cout << j << ' ';
            }
            std::cout << '\n';
        }
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* Vòng lặp lồng nhau là công cụ duy nhất để duyệt qua không gian dữ liệu 2 chiều.
* Quy ước chuẩn mực: Vòng ngoài quản lý chỉ số hàng `i`, vòng trong quản lý chỉ số cột `j`.
* Sau khi kết thúc vòng lặp trong, bắt buộc phải có câu lệnh xuống dòng `std::cout << '
'`.

Trong bài học tiếp theo **[Bài 3.4: Chuyên đề Số học 1: Số nguyên tố O(√N) và Thuật toán Euclid (GCD/LCM)]**, chúng ta sẽ kết hợp vòng lặp để chinh phục 2 thuật toán toán học tối quan trọng trong các kỳ thi học sinh giỏi và phỏng vấn lập trình.
