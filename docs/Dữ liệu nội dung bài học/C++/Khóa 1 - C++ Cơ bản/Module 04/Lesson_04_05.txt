---
lessonId: "CPP-04.05"
title: "Nhập môn Đệ quy (Recursion), Điều kiện dừng và Nguy cơ Tràn ngăn xếp (Stack Overflow)"
difficulty: "HARD"
estimatedDuration: 30
keywords: ["recursion", "base case", "call stack", "stack overflow", "fibonacci", "factorial"]
prerequisites: ["CPP-04.04"]
---

## 1. Khái niệm & Vấn đề

Trong toán học và thế giới tự nhiên, có những cấu trúc chứa chính bản thân nó ở quy mô nhỏ hơn: cành cây có các nhánh cây con có hình dáng y hệt cành cây lớn, bông hoa tuyết cấu tạo từ các tinh thể hình hoa tuyết mini, hay hình ảnh hai chiếc gương đối diện nhau tạo ra ảo ảnh vô tận.

Trong lập trình, **Đệ quy (Recursion)** là kỹ thuật mà một **Hàm tự gọi lại chính nó** với quy mô dữ liệu nhỏ hơn để giải quyết bài toán lớn.

Một hàm đệ quy bắt buộc phải tuân thủ cấu trúc 2 thành phần sống còn:
1. **Điểm dừng (Base Case):** Trường hợp bài toán nhỏ nhất đã biết trước đáp án, nơi đệ quy dừng lại và quay ngược về.
2. **Bước đệ quy (Recursive Step):** Phân rã bài toán hiện tại thành bài toán cùng loại nhưng có kích thước nhỏ hơn (N 	o N - 1).

| Thành phần Đệ quy | Nhiệm vụ kỹ thuật | Chuyện gì xảy ra nếu thiếu? |
| :--- | :--- | :--- |
| **Điểm dừng (Base Case)** | Phanh hãm: Chặn đứng quá trình tự gọi lại khi đạt tới đáy. | **Thảm họa Tràn ngăn xếp (Stack Overflow Crash)!** Chương trình lập tức bị hệ điều hành tiêu diệt. |
| **Bước đệ quy (Recursive Step)** | Thu nhỏ bài toán và gọi lại hàm: f(N) = N 	imes f(N-1). | Không thể tiến tới điểm dừng, vòng lặp đệ quy bị kẹt vô tận. |

---

## 2. Cú pháp & Vận hành

### 2.1. Giải phẫu hàm Đệ quy tính Giai thừa (N!)
Ta biết: N! = N 	imes (N - 1)!, với 0! = 1.

```cpp
#include <iostream>

long long giaiThua(int n) {
    // 1. ĐIỂM DỪNG (Base Case): Đáy của bài toán
    if (n <= 1) {
        return 1;
    }

    // 2. BƯỚC ĐỆ QUY (Recursive Step): Tự gọi lại chính nó với n - 1
    return n * giaiThua(n - 1);
}

int main() {
    std::cout << "4! = " << giaiThua(4) << '\n'; // In ra 24
    return 0;
}
```

### 2.2. Giải mã Cơ chế Ngăn xếp Lời gọi hàm (Call Stack Mechanism)
Khi chạy `giaiThua(3)`, hệ điều hành quản lý bộ nhớ RAM như thế nào?
Mỗi lần gọi hàm, một khung ô nhớ (**Stack Frame**) được đẩy (PUSH) vào ngăn xếp Call Stack. Khi chạm đến Base Case, các kết quả được rút dần (POP) ra để tính toán ngược lên:

```text
[GIAI ĐOẠN 1: ĐI SÂU VÀO ĐỆ QUY (PUSH)]
giaiThua(3) gọi giaiThua(2)
  └── giaiThua(2) gọi giaiThua(1)
        └── giaiThua(1) chạm Base Case -> Trả về 1!

[GIAI ĐOẠN 2: BẬT NGƯỢC THU KẾT QUẢ (POP)]
        ┌── giaiThua(1) = 1
  ┌─────┴── giaiThua(2) = 2 * 1 = 2
  └──────── giaiThua(3) = 3 * 2 = 6!
```

### 2.3. Nguy cơ Tràn ngăn xếp (Stack Overflow)
Vùng nhớ **Stack** trong RAM dành cho mỗi chương trình chỉ có dung lượng giới hạn (mặc định khoảng 1MB trên Windows và 8MB trên Linux).
Nếu bạn viết đệ quy không có điểm dừng, hoặc gọi đệ quy sâu tới 1,000,000 tầng, hàng triệu Stack Frame sẽ tràn ngập bộ nhớ làm nổ ngăn xếp ➔ Lỗi **Segmentation Fault: Stack Overflow**.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các cạm bẫy đệ quy nguy hiểm:**
> 1. **Thiếu hoặc sai Điểm dừng (Base Case):**
>    Đây là lỗi phổ biến nhất khiến hàm tự gọi vô tận cho đến khi tràn bộ nhớ Stack.
> 2. **Bước đệ quy không tiến về phía Base Case:**
>    Ví dụ Base Case là `n == 0`, nhưng trong hàm lại gọi `f(n + 1)` thay vì `f(n - 1)`. Giá trị `n` ngày càng tăng và không bao giờ chạm được về 0!
> 3. **Bẫy Đệ quy lặp thừa thãi (Cây đệ quy nhị phân):**
>    Hàm tính Fibonacci đệ quy ngây thơ: `int fib(int n) { if (n <= 1) return n; return fib(n-1) + fib(n-2); }`.
>    Hàm này có độ phức tạp hàm mũ **O(2ᴺ)**, tính toán trùng lặp hàng tỷ nhánh giống nhau khiến N = 45 chạy mất cả phút!

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Hiện tượng gì sẽ xảy ra khi một hàm đệ quy không có điều kiện dừng (Base Case)?
* [ ] A) Chương trình tự động chuyển sang vòng lặp `for`.
* [ ] B) Kết quả trả về luôn bằng 0.
* [x] C) Lỗi Tràn ngăn xếp (Stack Overflow) làm chương trình bị sập ngay lập tức.
* [ ] D) Compiler sẽ tự động bổ sung Base Case lúc biên dịch.

---

### Thử thách sửa lỗi (Debug)
Quan sát hàm đệ quy tính tổng từ 1 đến `n` dưới đây và phát hiện nguyên nhân gây lỗi treo máy:

```cpp
// Code lỗi:
#include <iostream>

int tinhTong(int n) {
    // THIẾU ĐIỀU KIỆN DỪNG BASE CASE!
    return n + tinhTong(n - 1);
}

int main() {
    std::cout << tinhTong(5); // SẬP CHƯƠNG TRÌNH!
    return 0;
}
```

**Sửa lại:** Bổ sung Base Case lên đầu hàm:
```cpp
if (n <= 0) return 0;
if (n == 1) return 1;
```

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết hàm đệ quy tính lũy thừa a^n (với a là số nguyên, n là số nguyên không âm):
`long long luyThua(long long a, int n);`
* Công thức đệ quy:
  * Điểm dừng: a^0 = 1
  * Bước đệ quy: a^n = a 	imes a^{n-1}
* Trong hàm `main()`, nhập vào 2 số nguyên a và n (0 ≤ n ≤ 30), gọi hàm và in kết quả.

**Ví dụ:**
* Đầu vào: `2 10` ➔ Đầu ra: `1024`
* Đầu vào: `5 0` ➔ Đầu ra: `1`

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>

long long luyThua(long long a, int n) {
    // Điểm dừng Base Case
    if (n == 0) return 1;

    // Bước đệ quy
    return a * luyThua(a, n - 1);
}

int main() {
    long long a = 0;
    int n = 0;
    if (std::cin >> a >> n && n >= 0) {
        std::cout << luyThua(a, n) << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* **Đệ quy** là tư duy giải bài toán lớn bằng chính nó ở quy mô nhỏ hơn.
* Mọi hàm đệ quy bắt buộc phải có **Điểm dừng (Base Case)** và **Bước đệ quy (Recursive Step)** tiến về phía điểm dừng.
* Cần kiểm soát độ sâu của Call Stack để phòng ngừa thảm họa **Stack Overflow**.

🎉 **Chúc mừng bạn đã hoàn thành trọn vẹn Module 4: Hàm và Kỹ thuật Phân rã Bài toán!**
Trong **Module 5: Mảng 1 Chiều và std::vector Động**, chúng ta sẽ chính thức bước vào thế giới lưu trữ và xử lý tập hợp dữ liệu lớn với mảng tĩnh và container chuẩn công nghiệp `std::vector`.
