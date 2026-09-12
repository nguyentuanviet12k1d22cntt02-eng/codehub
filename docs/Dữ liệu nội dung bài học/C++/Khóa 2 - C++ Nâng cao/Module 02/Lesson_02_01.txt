---
lessonId: CPP2-02.01
title: "Kiến trúc Bộ nhớ Máy tính: Phân tích Stack, Heap, Data & Code Segment"
difficulty: "Nâng cao"
estimatedDuration: "75 phút"
keywords: ["kiến trúc bộ nhớ", "stack", "heap", "data segment", "bss", "code segment", "virtual memory", "call stack"]
prerequisites: ["Lesson_04_04", "CPP2-01.02"]
---

# Kiến trúc Bộ nhớ Máy tính: Phân tích Stack, Heap, Data & Code Segment

## 1. Khái niệm & Vấn đề

Khi bạn viết một dòng code C++ và ấn Run, hệ điều hành (OS) sẽ nạp file thực thi `.exe` từ ổ cứng vào bộ nhớ RAM và cấp phát cho nó một **Không gian Địa chỉ Ảo (Virtual Address Space)** riêng biệt (thường có dung lượng lý thuyết lên tới 128 Terabytes trên Windows/Linux 64-bit).

Để quản lý hàng triệu dòng lệnh và biến số một cách trật tự, không gian bộ nhớ của tiến trình được phân chia nghiêm ngặt thành **5 phân vùng cốt lõi**:

```
[Địa chỉ Cao: 0x7FFF...]
+------------------------------------+
|  STACK (Ngăn xếp - Tự động)       |  <-- Phát triển dốc XUỐNG dưới (Low Addresses)
|  - Biến cục bộ, tham số hàm       |
|  - Con trỏ lệnh trở về (RET ADDR)  |
+------------------------------------+
|                |                   |
|                v                   |
|       (Vùng trống dự trữ)          |
|                ^                   |
|                |                   |
+------------------------------------+
|  HEAP (Vùng nhớ Động)              |  <-- Phát triển dốc LÊN trên (High Addresses)
|  - Cấp phát bằng new, malloc       |
|  - Do lập trình viên tự giải phóng |
+------------------------------------+
|  BSS SEGMENT (Uninitialized Data)  |  <-- Biến toàn cục / static CHƯA khởi tạo (mặc định = 0)
+------------------------------------+
|  DATA SEGMENT (Initialized Data)   |  <-- Biến toàn cục / static ĐÃ khởi tạo giá trị
+------------------------------------+
|  TEXT / CODE SEGMENT (Chỉ đọc)     |  <-- Chứa mã máy nhị phân của hàm & Hằng chuỗi
+------------------------------------+
[Địa chỉ Thấp: 0x0000...]
```

---

## 2. Cú pháp & Vận hành

### Mã nguồn soi chiếu địa chỉ của các biến trong từng phân vùng

```cpp
#include <iostream>

// 1. DATA SEGMENT: Biến toàn cục đã khởi tạo giá trị
int g_initializedVar = 100;

// 2. BSS SEGMENT: Biến toàn cục chưa khởi tạo (hệ thống tự điền 0)
int g_uninitializedVar;

// 3. TEXT/CODE SEGMENT: Hàm chứa các chỉ lệnh CPU (Read-only)
void demoFunction() {
    // 4. STACK SEGMENT: Biến cục bộ nằm trong Stack Frame của hàm
    int localStackVar = 42;
    std::cout << "  [Stack] Địa chỉ biến cục bộ:       " << (void*)&localStackVar << "\n";
}

int main() {
    std::cout << "=== BẢN ĐỒ ĐỊA CHỈ BỘ NHỚ TIẾN TRÌNH C++ ===\n\n";

    // Địa chỉ của Text/Code Segment (rất thấp)
    std::cout << "  [Code]  Địa chỉ hàm demoFunction:   " << (void*)&demoFunction << "\n";

    // Địa chỉ của Data Segment
    std::cout << "  [Data]  Địa chỉ g_initializedVar:   " << (void*)&g_initializedVar << "\n";

    // Địa chỉ của BSS Segment
    std::cout << "  [BSS]   Địa chỉ g_uninitializedVar: " << (void*)&g_uninitializedVar << "\n";

    // 5. HEAP SEGMENT: Cấp phát động bằng toán tử new
    int* pHeapVar = new int(999);
    std::cout << "  [Heap]  Địa chỉ vùng nhớ Heap:      " << (void*)pHeapVar << "\n";
    std::cout << "  [Stack] Địa chỉ con trỏ pHeapVar:   " << (void*)&pHeapVar << "\n";

    demoFunction();

    delete pHeapVar; // Giải phóng Heap
    return 0;
}
```

### So sánh Đặc tính Kỹ thuật giữa Stack và Heap

| Tiêu chí | Stack (Ngăn xếp) | Heap (Đống bộ nhớ) |
| :--- | :--- | :--- |
| **Cơ chế quản lý** | Tự động hoàn toàn bởi CPU (Đẩy vào / Rút ra theo LIFO) | Lập trình viên phải tự quản lý thủ công (`new`/`delete`) |
| **Tốc độ truy xuất** | **Siêu tốc** (Chỉ cần dịch thanh ghi con trỏ `ESP`/`RSP`) | **Chậm hơn** (Phải tìm kiếm block bộ nhớ trống trong OS) |
| **Giới hạn dung lượng** | Rất nhỏ (Mặc định 1MB trên Windows, 8MB trên Linux) | Rất lớn (Giới hạn bởi tổng dung lượng RAM vật lý + Pagefile) |
| **Nguy cơ lỗi** | **Stack Overflow** (khi đệ quy sâu hoặc mảng cục bộ quá lớn) | **Memory Leak**, Phân mảnh bộ nhớ (Fragmentation) |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Trả về con trỏ trỏ tới biến cục bộ trên Stack (Dangling Pointer)
> Khi một hàm kết thúc, toàn bộ Stack Frame của hàm đó bị thu hồi (vùng nhớ đó bị đánh dấu là tự do).
> Nếu bạn viết `int* getNumber() { int x = 10; return &x; }`, con trỏ trả về trỏ vào một vùng nhớ "ma". Khi hàm khác được gọi, vùng nhớ đó sẽ bị ghi đè dữ liệu mới, dẫn đến lỗi giá trị sai lệch bất thường hoặc sập chương trình.

> [!TIP]
> ### 2. Khai báo mảng khổng lồ (> 1 triệu phần tử) trong hàm
> Lệnh `int arr[1000000];` bên trong hàm `main()` sẽ yêu cầu ngay lập tức 4 MB bộ nhớ.
> Vì Stack của Windows mặc định chỉ có 1 MB, chương trình sẽ sập lập tức với mã lỗi `0xC00000FD (Stack Overflow)` trước khi kịp chạy dòng lệnh đầu tiên!
> **Giải pháp:** Nếu mảng lớn hơn 100,000 phần tử, hãy dùng `std::vector<int>` (dữ liệu nằm trên Heap) hoặc khai báo `static int arr[1000000];` (nằm trên BSS Segment).

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Vùng nhớ nào sau đây trong RAM có tốc độ cấp phát nhanh nhất và tự động giải phóng khi biến ra khỏi phạm vi (scope)?
- A. Heap Segment
- B. Stack Segment
- C. BSS Segment
- D. Text Segment

**Đáp án đúng:** **B**
*Giải thích:* Vùng Stack được quản lý trực tiếp bằng thanh ghi phần cứng của CPU, việc cấp phát và giải phóng chỉ tốn đúng một lệnh cộng/trừ con trỏ ngăn xếp trong một chu kỳ CPU.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây bị lỗi treo chương trình ngay khi vừa khởi động:

```cpp
// ❌ ĐOẠN CODE LỖI
#include <iostream>

void processBigData() {
    double buffer[200000]; // 200,000 * 8 bytes = 1.6 MB -> Tràn Stack!
    std::cout << "Da cap phat thanh cong\n";
}

int main() {
    processBigData();
    return 0;
}
```
**Nguyên nhân:** Kích thước mảng vượt quá giới hạn 1 MB của Stack.
**Sửa lại chuẩn:**
Chuyển sang sử dụng `std::vector` để lưu trữ trên vùng nhớ Heap rộng lớn:
```cpp
// ✅ ĐOẠN CODE CHUẨN
#include <iostream>
#include <vector>

void processBigData() {
    std::vector<double> buffer(200000); // Nằm an toàn trên Heap
    std::cout << "Da cap phat thanh cong tren Heap! Size: " << buffer.size() << "\n";
}

int main() {
    processBigData();
    return 0;
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình kiểm tra xem trên máy tính của bạn: Vùng nhớ Stack phát triển dốc xuống (Địa chỉ biến sau nhỏ hơn địa chỉ biến trước) hay dốc lên bằng cách khai báo 2 biến cục bộ liên tiếp và in ra hiệu số địa chỉ giữa chúng.

**Code giải mẫu:**
```cpp
#include <iostream>

int main() {
    int firstVar = 1;
    int secondVar = 2;

    std::cout << "Dia chi firstVar:  " << (void*)&firstVar << "\n";
    std::cout << "Dia chi secondVar: " << (void*)&secondVar << "\n";

    if (&secondVar < &firstVar) {
        std::cout << ">> Ket luan: Vung nho Stack phat trien doc XUONG (High -> Low Address)\n";
    } else {
        std::cout << ">> Ket luan: Vung nho Stack phat trien doc LEN (Low -> High Address)\n";
    }

    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **Bản đồ 5 phân vùng bộ nhớ:** Text (Code), Data (Init), BSS (Zero-init), Heap (Dynamic), Stack (Auto).
- **Stack** siêu nhanh nhưng hữu hạn (1-8 MB), **Heap** khổng lồ nhưng phải quản lý cẩn thận.
- Tuyệt đối không trả về địa chỉ của biến cục bộ trên Stack.

*Bài học tiếp theo:* Chúng ta sẽ bước vào thế giới kỹ thuật: **Số học Con trỏ (Pointer Arithmetic), Con trỏ Cấp 2 và Con trỏ Hàm (Function Pointers & Callbacks)**.
