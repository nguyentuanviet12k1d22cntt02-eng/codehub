---
lessonId: CPP2-02.02
title: "Số học Con trỏ (Pointer Arithmetic), Con trỏ Cấp 2 và Con trỏ Hàm"
difficulty: "Nâng cao"
estimatedDuration: "80 phút"
keywords: ["con trỏ", "số học con trỏ", "pointer arithmetic", "con trỏ cấp 2", "con trỏ hàm", "callback", "qsort"]
prerequisites: ["CPP2-02.01"]
---

# Số học Con trỏ (Pointer Arithmetic), Con trỏ Cấp 2 và Con trỏ Hàm

## 1. Khái niệm & Vấn đề

Trong C++, con trỏ không đơn thuần là một biến chứa địa chỉ, mà là một **thước đo có đơn vị**. Hiểu sâu về con trỏ mở ra ba công cụ quyền lực nhất của lập trình viên hệ thống:
1. **Số học Con trỏ (Pointer Arithmetic):** Phép toán `ptr + 1` không tăng địa chỉ lên 1 byte, mà nhảy vọt qua một đoạn đúng bằng `sizeof(*ptr)`!
2. **Con trỏ Cấp 2 (Pointer to Pointer - `T**`):** Dùng để thay đổi con trỏ từ bên trong hàm và quản lý ma trận động 2 chiều.
3. **Con trỏ Hàm (Function Pointer):** Biến lưu trữ địa chỉ của một đoạn mã thực thi, cho phép truyền logic tính toán vào hàm khác dưới dạng **Hàm gọi lại (Callback)**.

---

## 2. Cú pháp & Vận hành

### 1. Số học Con trỏ (Pointer Arithmetic)

```cpp
#include <iostream>

int main() {
    int arr[4] = {10, 20, 30, 40};
    int* ptr = arr; // arr tương đương &arr[0]

    std::cout << "Địa chỉ ban đầu:   " << (void*)ptr << " | Giá trị: " << *ptr << "\n";

    // Phép cộng con trỏ: Nhảy vọt qua 4 bytes (sizeof(int))
    ptr++;
    std::cout << "Sau khi ptr++:      " << (void*)ptr << " | Giá trị: " << *ptr << " (arr[1])\n";

    // Phép toán chỉ số tương đương: *(arr + i) == arr[i]
    std::cout << "*(arr + 2) tương đương arr[2] = " << *(arr + 2) << "\n";

    return 0;
}
```

### 2. Con trỏ Cấp 2 (T**)

Khi bạn muốn một hàm cấp phát bộ nhớ hoặc thay đổi địa chỉ của một con trỏ ở bên ngoài `main`, truyền con trỏ cấp 1 theo tham trị sẽ thất bại. Bạn bắt buộc phải truyền **Con trỏ Cấp 2 (Địa chỉ của con trỏ)**!

```cpp
#include <iostream>

void allocateMemory(int** ptrToPtr, int value) {
    *ptrToPtr = new int(value); // Thay đổi giá trị con trỏ cấp 1 ở ngoài hàm
}

int main() {
    int* myPtr = nullptr;
    allocateMemory(&myPtr, 888); // Truyền địa chỉ của myPtr

    std::cout << "Giá trị được cấp phát thông qua con trỏ cấp 2: " << *myPtr << "\n";

    delete myPtr;
    return 0;
}
```

### 3. Con trỏ Hàm (Function Pointer) và Callback

```cpp
#include <iostream>

// Hàm so sánh tăng dần
bool compareAsc(int a, int b) { return a > b; }
// Hàm so sánh giảm dần
bool compareDesc(int a, int b) { return a < b; }

// Hàm sắp xếp tổng quát nhận Callback Function Pointer
// Cú pháp con trỏ hàm: bool (*cmpFunc)(int, int)
void customSort(int* arr, int n, bool (*cmpFunc)(int, int)) {
    for (int i = 0; i < n - 1; ++i) {
        for (int j = 0; j < n - 1 - i; ++j) {
            if (cmpFunc(arr[j], arr[j + 1])) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    int data[5] = {5, 2, 8, 1, 9};

    // Truyền hàm compareDesc làm callback:
    customSort(data, 5, compareDesc);
    std::cout << "Sắp xếp giảm dần: ";
    for (int x : data) std::cout << x << " ";
    std::cout << "\n";

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Trừ hai con trỏ không cùng thuộc một mảng
> Phép trừ hai con trỏ `ptr1 - ptr2` trả về khoảng cách số lượng phần tử (`ptrdiff_t`).
> **Quy tắc an toàn:** Phép trừ này CHỈ hợp lệ khi cả hai con trỏ cùng trỏ vào các phần tử của cùng một mảng. Nếu trừ hai con trỏ trỏ vào 2 biến độc lập nằm rải rác trên RAM, kết quả là **Undefined Behavior**.

> [!TIP]
> ### 2. Sử dụng `using` hoặc `typedef` để đơn giản hóa Con trỏ Hàm
> Cú pháp con trỏ hàm gốc `bool (*)(int, int)` rất rườm rà.
> Hãy dùng từ khóa `using` trong Modern C++ để tạo alias trực quan:
> ```cpp
> using Comparator = bool (*)(int, int);
> void sort(int* arr, int n, Comparator cmp);
> ```

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Cho mảng `int a[5] = {10, 20, 30, 40, 50};` và con trỏ `int* p = a + 1;`. Giá trị của biểu thức `*(p + 2)` là bao nhiêu?
- A. 20
- B. 30
- C. 40
- D. 50

**Đáp án đúng:** **C**
*Giải thích:* `a + 1` trỏ tới `a[1]` (giá trị 20). Khi lấy `p + 2`, con trỏ nhảy tiếp 2 phần tử tới `a[3]`. Giá trị `*(a + 3)` là 40.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây cố gắng gán địa chỉ hàm vào con trỏ hàm nhưng bị lỗi cú pháp:

```cpp
// ❌ ĐOẠN CODE LỖI
int multiply(int a, int b) { return a * b; }

int main() {
    int *funcPtr(int, int) = multiply; // Sai cú pháp khai báo con trỏ hàm!
}
```
**Nguyên nhân:** Thiếu cặp ngoặc tròn quanh `*funcPtr`, khiến compiler hiểu lầm đây là một hàm thông thường trả về con trỏ `int*`.
**Sửa lại chuẩn:**
```cpp
// ✅ ĐOẠN CODE CHUẨN
int multiply(int a, int b) { return a * b; }

int main() {
    int (*funcPtr)(int, int) = multiply; // Hoặc: &multiply
    int result = funcPtr(4, 5);
    std::cout << "Tich: " << result << "\n"; // In ra 20
    return 0;
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Viết hàm `void transformArray(int* arr, int n, int (*transform)(int))` duyệt qua mảng số nguyên và áp dụng hàm biến đổi `transform` lên từng phần tử. Kiểm thử với 2 hàm: Hàm nhân đôi giá trị và Hàm bình phương giá trị.

**Code giải mẫu:**
```cpp
#include <iostream>

int doubleVal(int x) { return x * 2; }
int squareVal(int x) { return x * x; }

void transformArray(int* arr, int n, int (*transform)(int)) {
    for (int i = 0; i < n; ++i) {
        arr[i] = transform(arr[i]);
    }
}

int main() {
    int arr[4] = {1, 2, 3, 4};

    transformArray(arr, 4, doubleVal);
    std::cout << "Sau khi nhan doi: ";
    for (int x : arr) std::cout << x << " ";
    std::cout << "\n";

    transformArray(arr, 4, squareVal);
    std::cout << "Sau khi binh phuong: ";
    for (int x : arr) std::cout << x << " ";
    std::cout << "\n";

    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **Số học con trỏ** luôn nhân với `sizeof(T)`. Biểu thức `a[i]` hoàn toàn đồng nhất với `*(a + i)`.
- **Con trỏ cấp 2 (`T**`)** dùng để thay đổi giá trị của con trỏ cấp 1 và cấp phát ma trận 2D động.
- **Con trỏ hàm** là nền tảng của kỹ thuật Callback, cho phép lập trình hướng sự kiện và thiết kế thuật toán tùy biến cao.

*Bài học tiếp theo:* Đối mặt với những nguy cơ thực tế: **Cấp phát động (new/delete) và 4 Thảm họa Bộ nhớ Kinh điển**.
