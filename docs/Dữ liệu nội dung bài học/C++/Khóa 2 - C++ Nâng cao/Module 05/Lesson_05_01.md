---
lessonId: CPP2-05.01
title: "Đệ quy có nhớ (Memoization) - Bước đệm đến Quy hoạch Động"
difficulty: "Nâng cao"
estimatedDuration: "75 phút"
keywords: ["đệ quy có nhớ", "memoization", "quy hoạch động", "fibonacci", "cache table", "tối ưu đệ quy", "O(N)"]
prerequisites: ["Lesson_04_05", "Lesson_05_01"]
---

# Đệ quy có nhớ (Memoization) - Bước đệm đến Quy hoạch Động

## 1. Khái niệm & Vấn đề

Trong bài học đệ quy cơ bản, chúng ta đã từng cài đặt hàm tính số Fibonacci ngây thơ:
```cpp
long long fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

Nếu bạn chạy `fib(40)`, máy tính sẽ mất khoảng 1-2 giây. Nhưng nếu bạn gọi `fib(50)`, máy tính của bạn sẽ **bị đơ cứng suốt nhiều phút hoặc cả tiếng đồng hồ!**
Tại sao một hàm chỉ có 4 dòng lệnh lại khiến CPU tê liệt?

### Khủng hoảng Bùng nổ Hàm mũ: Cây Đệ quy Chồng chéo (Overlapping Subproblems)
Khi tính `fib(5)`, hàm gọi `fib(4)` và `fib(3)`. Nhưng để tính `fib(4)`, nó lại gọi `fib(3)` và `fib(2)`.
Cây đệ quy phân nhánh làm đôi ở mỗi tầng, dẫn đến tổng số phép tính tăng theo cấp số nhân:
	ext{Độ phức tạp thời gian} = O(2ᴺ)
Với N = 50, 2⁵⁰ ≈ 10¹⁵ phép tính. Một CPU hiện đại tính được 10⁸ phép/giây, nghĩa là cần tới hơn 100 ngày liên tục mới xong! Hàng tỷ nhánh con như `fib(3)`, `fib(2)` bị tính đi tính lại hàng triệu lần một cách vô ích!

### Giải pháp Cứu tinh: Kỹ thuật Đệ quy có nhớ (Memoization)
Ý tưởng cực kỳ thông minh và đơn giản: **Tạo một bảng nhớ tạm (Cache Table)**.
- Trước khi tính toán một bài toán con, kiểm tra xem kết quả của nó đã có trong bảng nhớ chưa.
- Nếu **ĐÃ CÓ**: Lấy kết quả ra ngay lập tức trong thời gian O(1)!
- Nếu **CHƯA CÓ**: Tính toán 1 lần duy nhất, ghi kết quả vào bảng nhớ rồi mới trả về.
Thời gian tính toán lập tức rơi thẳng từ O(2ᴺ) xuống còn **O(N) tuyến tính** (với N = 50 chỉ tốn 50 phép tính trong 0.00001 giây)!

---

## 2. Cú pháp & Vận hành

### Cài đặt Đệ quy có nhớ chuẩn C++

```cpp
#include <iostream>
#include <vector>

const int MAX = 100;
// Mảng ghi nhớ kết quả: Khởi tạo toàn bộ bằng -1 (nghĩa là chưa tính)
long long memo[MAX];

long long fibMemo(int n) {
    // 1. Điều kiện dừng cơ sở (Base cases)
    if (n <= 1) return n;

    // 2. Kiểm tra bảng nhớ (Lookup Cache)
    if (memo[n] != -1) {
        return memo[n]; // Trả về ngay trong O(1)!
    }

    // 3. Tính toán và lưu vào bảng nhớ trước khi return
    memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
    return memo[n];
}

int main() {
    // Khởi tạo mảng memo bằng -1
    for (int i = 0; i < MAX; ++i) memo[i] = -1;

    int n = 50;
    std::cout << "Số Fibonacci thứ " << n << " là: " << fibMemo(n) << "\n";
    std::cout << ">> Đã tính toán siêu tốc trong nháy mắt nhờ Memoization!\n";

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Chọn giá trị cờ "chưa tính" trùng với kết quả hợp lệ
> Nếu bài toán có kết quả trả về có thể là số `0`, bạn không được khởi tạo mảng memo bằng `0` (`int memo[N] = {0};`). Vì khi một bài toán con tính ra kết quả là `0`, hàm sẽ lầm tưởng ô đó "chưa được tính" và tiếp tục gọi đệ quy lặp lại vô ích!
> **Quy tắc an toàn:** Dùng giá trị `-1` (nếu bài toán chỉ trả về số không âm) hoặc dùng kiểu `std::optional<T>` trong C++17.

> [!TIP]
> ### 2. Bước đệm từ Memoization (Top-down) sang Quy hoạch Động (Bottom-up)
> - **Top-down (Đệ quy có nhớ):** Đi từ bài toán lớn chia nhỏ dần xuống bài toán con. Dễ cài đặt, chỉ tính những trạng thái cần thiết.
> - **Bottom-up (Quy hoạch động dùng vòng lặp):** Dùng vòng `for` tính từ bài toán nhỏ nhất (`dp[0], dp[1]`) đi lên. Tiết kiệm bộ nhớ Call Stack và chạy nhanh hơn một chút do không tốn chi phí gọi hàm.

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Độ phức tạp thời gian của hàm tính số Fibonacci thứ N khi áp dụng kỹ thuật Đệ quy có nhớ (Memoization) là bao nhiêu?
- A. O(2ᴺ)
- B. O(N²)
- C. O(N)
- D. O(1)

**Đáp án đúng:** **C**
*Giải thích:* Mỗi trạng thái từ 0 đến N chỉ được tính toán đúng một lần duy nhất, các lần gọi sau đều lấy từ mảng trong O(1), do đó tổng thời gian là tuyến tính O(N).

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code tính tổ hợp C(n, k) bằng công thức Pascal C(n, k) = C(n-1, k-1) + C(n-1, k) bị chạy quá thời gian (Time Limit Exceeded) với n = 30:

```cpp
// ❌ ĐOẠN CODE LỖI
long long nCr(int n, int r) {
    if (r == 0 || r == n) return 1;
    return nCr(n - 1, r - 1) + nCr(n - 1, r); // Đệ quy trùng lặp O(2ᴺ)!
}
```
**Sửa lại chuẩn:**
Thêm bảng nhớ 2 chiều `memo[n][r]`:
```cpp
// ✅ ĐOẠN CODE CHUẨN VỚI MEMOIZATION
long long memoComb[50][50]{0};

long long nCr(int n, int r) {
    if (r == 0 || r == n) return 1;
    if (memoComb[n][r] != 0) return memoComb[n][r];
    return memoComb[n][r] = nCr(n - 1, r - 1) + nCr(n - 1, r);
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài (Bài toán Bước thang - Climbing Stairs):** Bạn đang đứng ở bậc thang số 0 của một cầu thang có N bậc. Mỗi bước bạn có thể bước lên 1 bậc hoặc 2 bậc. Hãy tính số cách khác nhau để leo lên tới đỉnh bậc thứ N (1 ≤ N ≤ 45) sử dụng Đệ quy có nhớ.

**Code giải mẫu:**
```cpp
#include <iostream>
#include <vector>

std::vector<long long> memoSteps(50, -1);

long long climb(int n) {
    if (n <= 1) return 1; // n = 0 hoặc n = 1 có đúng 1 cách
    if (memoSteps[n] != -1) return memoSteps[n];
    return memoSteps[n] = climb(n - 1) + climb(n - 2);
}

int main() {
    int n;
    std::cout << "Nhap so bac thang N: ";
    if (std::cin >> n && n >= 0 && n <= 45) {
        std::cout << "So cach khac nhau de leo len dinh: " << climb(n) << "\n";
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **Memoization (Đệ quy có nhớ)** biến đổi một thuật toán đệ quy cấp số nhân O(2ᴺ) thành thuật toán tuyến tính O(N) thần tốc.
- Luôn nhận diện tính chất **Bài toán con gối nhau (Overlapping Subproblems)** trước khi quyết định dùng mảng lưu vết.

*Bài học tiếp theo:* Chinh phục bài toán vét cạn thông minh trong không gian trạng thái: **Kỹ thuật Quay lui (Backtracking): Sinh Chuỗi Nhị phân và Hoán vị**.
