---
lessonId: CPP2-02.03
title: "Cấp phát động (new/delete) và 4 Thảm họa Bộ nhớ Kinh điển"
difficulty: "Nâng cao"
estimatedDuration: "80 phút"
keywords: ["new", "delete", "memory leak", "dangling pointer", "double free", "use after free", "segmentation fault", "valgrind"]
prerequisites: ["CPP2-02.02"]
---

# Cấp phát động (new/delete) và 4 Thảm họa Bộ nhớ Kinh điển

## 1. Khái niệm & Vấn đề

Trong C++, quyền lực tối thượng can thiệp trực tiếp vào bộ nhớ RAM đi kèm với trách nhiệm cực kỳ nặng nề: **Bộ nhớ được cấp phát bằng `new` sẽ tồn tại vĩnh viễn trên Heap cho đến khi bạn tự tay gọi `delete`**. Máy tính không tự dọn rác giúp bạn (No Garbage Collector).

Nếu sử dụng sai, bạn sẽ đối mặt với **4 thảm họa bộ nhớ kinh điển** đã từng gây ra những thiệt hại hàng tỷ USD trong ngành công nghiệp phần mềm:

1. **Rò rỉ Bộ nhớ (Memory Leak):** Cấp phát vùng nhớ Heap nhưng đánh mất con trỏ trỏ tới nó mà chưa kịp giải phóng. RAM của hệ điều hành bị "ngốn" dần cho đến khi cạn kiệt và sập server.
2. **Con trỏ Treo lơ lửng (Dangling Pointer):** Con trỏ vẫn giữ nguyên địa chỉ của vùng nhớ cũ sau khi vùng nhớ đó đã bị `delete`.
3. **Giải phóng Bộ nhớ Trùng lặp (Double Free):** Gọi `delete` 2 lần trên cùng một địa chỉ ô nhớ, làm vỡ bảng quản lý Heap của hệ điều hành.
4. **Sử dụng Bộ nhớ Sau khi Giải phóng (Use-After-Free):** Đọc hoặc ghi dữ liệu vào ô nhớ đã giải phóng, mở ra lỗ hổng bảo mật nghiêm trọng cho Hacker chiếm quyền điều khiển hệ thống.

---

## 2. Cú pháp & Vận hành

### 1. Phân tích Chi tiết 4 Thảm họa Bộ nhớ qua Mã nguồn

```cpp
#include <iostream>

void demonstrateMemoryDisasters() {
    // 💥 THẢM HỌA 1: MEMORY LEAK (Rò rỉ bộ nhớ)
    int* pLeak = new int(100);
    pLeak = new int(200); // Gán đè địa chỉ mới! Vùng nhớ chứa 100 bị mất dấu vĩnh viễn trong RAM!

    // 💥 THẢM HỌA 2: DANGLING POINTER & USE-AFTER-FREE
    int* pDangle = new int(42);
    delete pDangle; // Đã trả lại ô nhớ cho hệ điều hành
    // pDangle lúc này trở thành Con trỏ Treo (Dangling Pointer)
    // std::cout << *pDangle; // Use-After-Free! Đọc dữ liệu ma!

    // 💥 THẢM HỌA 3: DOUBLE FREE (Giải phóng trùng lặp)
    // delete pDangle; // SẬP CHƯƠNG TRÌNH NGAY LẬP TỨC!
}
```

### 2. Kỹ thuật Cấp phát và Thu hồi Mảng Động chuẩn mực

```cpp
#include <iostream>

int main() {
    int n = 5;

    // Cấp phát mảng động trên Heap
    int* arr = new int[n]{10, 20, 30, 40, 50};

    for (int i = 0; i < n; ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << "\n";

    // ✅ NGUYÊN TẮC VÀNG 1: Dùng delete[] cho mảng cấp phát bằng new[]
    delete[] arr;

    // ✅ NGUYÊN TẮC VÀNG 2: Gán ngay nullptr để triệt tiêu Dangling Pointer
    arr = nullptr;

    // Gọi delete trên nullptr là hoàn toàn an toàn trong C++ (không gây lỗi)
    delete[] arr; 

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Nhầm lẫn tai hại giữa `delete` và `delete[]`
> - `delete ptr;` chỉ giải phóng 1 phần tử đơn lẻ và gọi destructor của 1 phần tử.
> - `delete[] arr;` đọc kích thước mảng được ghi trong Header của Heap để giải phóng trọn vẹn toàn bộ mảng và gọi destructor của tất cả phần tử.
> Gọi `delete arr;` trên mảng được cấp phát bằng `new[]` là hành vi **Undefined Behavior** kinh điển làm hỏng bộ quản lý Heap!

> [!TIP]
> ### 2. Nguyên tắc Phòng thủ Gán `nullptr` sau khi Delete
> Mọi con trỏ sau khi giải phóng phải lập tức được gán bằng `nullptr`:
> ```cpp
> delete p;
> p = nullptr;
> ```
> Trong C++, gọi `delete nullptr;` là một thao tác hợp lệ và an toàn tuyệt đối (không làm gì cả), giúp bạn phòng chống triệt để thảm họa Double Free.

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Hiện tượng "Memory Leak" xảy ra trong tình huống nào sau đây?
- A. Truy xuất mảng vượt quá chỉ số cho phép.
- B. Cấp phát động bằng `new` nhưng không gọi `delete` trước khi con trỏ bị mất phạm vi truy cập.
- C. Gọi `delete` hai lần trên cùng một con trỏ.
- D. Đệ quy vô hạn làm cạn kiệt vùng nhớ Stack.

**Đáp án đúng:** **B**
*Giải thích:* Khi vùng nhớ trên Heap không còn bất kỳ con trỏ nào trỏ tới, hệ thống không thể thu hồi nó được nữa và lượng RAM đó bị lãng phí cho đến khi tiến trình kết thúc.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây cố gắng cấp phát mảng số nguyên động nhưng mắc lỗi rò rỉ bộ nhớ nghiêm trọng:

```cpp
// ❌ ĐOẠN CODE LỖI
#include <iostream>

void process() {
    int* data = new int[1000];
    if (true) {
        return; // Thoát sớm nhưng quên giải phóng data -> Rò rỉ 4000 bytes!
    }
    delete[] data;
}
```
**Sửa lại chuẩn:**
Đảm bảo gọi `delete[]` trước mọi điểm thoát (Early Return) hoặc giải phóng bằng kỹ thuật RAII:
```cpp
// ✅ ĐOẠN CODE CHUẨN
#include <iostream>

void process() {
    int* data = new int[1000];
    // Xử lý...
    delete[] data; // Luôn thu hồi bộ nhớ trước khi return
    data = nullptr;
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Viết một chương trình hoàn chỉnh cấp phát động một ma trận 2 chiều kích thước R 	imes C bằng con trỏ cấp 2 `int**`. Nhập các phần tử, tính tổng toàn bộ ma trận, sau đó giải phóng bộ nhớ sạch sẽ 100% không để lại bất kỳ rò rỉ nào.

**Code giải mẫu:**
```cpp
#include <iostream>

int main() {
    int r = 3, c = 4;

    // 1. Cấp phát mảng các con trỏ hàng
    int** matrix = new int*[r];
    for (int i = 0; i < r; ++i) {
        matrix[i] = new int[c]; // Cấp phát từng hàng
    }

    // 2. Điền dữ liệu và tính tổng
    long long totalSum = 0;
    int count = 1;
    for (int i = 0; i < r; ++i) {
        for (int j = 0; j < c; ++j) {
            matrix[i][j] = count++;
            totalSum += matrix[i][j];
        }
    }

    std::cout << "Tong ma tran cap phat dong: " << totalSum << "\n";

    // 3. GIẢI PHÓNG BỘ NHỚ THEO THỨ TỰ NGƯỢC LẠI:
    for (int i = 0; i < r; ++i) {
        delete[] matrix[i]; // Giải phóng từng hàng
        matrix[i] = nullptr;
    }
    delete[] matrix; // Giải phóng mảng con trỏ chính
    matrix = nullptr;

    std::cout << ">> Da giai phong sach se toan bo bo nho Heap!\n";
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- Cấp phát bằng `new` bắt buộc phải thu hồi bằng `delete`. Cấp phát bằng `new[]` bắt buộc dùng `delete[]`.
- Luôn gán con trỏ bằng `nullptr` ngay sau khi `delete` để triệt tiêu Dangling Pointer và Double Free.
- Trong dự án thực tế, các chuyên gia Modern C++ hầu như không bao giờ viết `new/delete` thô mà sử dụng vũ khí tối tân: **Con trỏ Thông minh (Smart Pointers)**.

*Bài học tiếp theo:* Giải pháp triệt tiêu 100% lỗi rò rỉ bộ nhớ trong C++ hiện đại: **Con trỏ Thông minh: std::unique_ptr, std::shared_ptr, std::weak_ptr và Nguyên lý RAII**.
