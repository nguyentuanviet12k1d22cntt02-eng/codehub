---
lessonId: CPP2-03.02
title: "Đọc Ghi Cấu trúc Bản ghi và Định vị Con trỏ Tệp ngẫu nhiên (Random Access)"
difficulty: "Nâng cao"
estimatedDuration: "80 phút"
keywords: ["struct binary I/O", "random access", "seekg", "seekp", "tellg", "tellp", "con trỏ tệp", "bản ghi"]
prerequisites: ["CPP2-03.01", "CPP2-01.02"]
---

# Đọc Ghi Cấu trúc Bản ghi và Định vị Con trỏ Tệp ngẫu nhiên (Random Access)

## 1. Khái niệm & Vấn đề

Trong các hệ thống quản lý cơ sở dữ liệu (DBMS như MySQL, SQLite), một tệp dữ liệu có thể chứa hàng chục triệu dòng. Nếu muốn xem thông tin của khách hàng thứ 500,000, không một hệ thống nào lại điên rồ đọc tuần tự từ bản ghi số 1 đến số 499,999!

Nhờ việc mỗi bản ghi `struct` trong tệp nhị phân có **kích thước cố định (Fixed Size)**, chúng ta có thể tính toán chính xác độ lệch byte (Byte Offset) của bản ghi cần tìm và "nhảy dù" trực tiếp tới vị trí đó trong thời gian O(1)! Kỹ thuật này được gọi là **Truy xuất ngẫu nhiên (Random Access File I/O)**.

C++ cung cấp 4 hàm thao tác với con trỏ tệp:
- **`seekg(offset, origin)` (Seek Get):** Di chuyển con trỏ đọc đến vị trí mong muốn.
- **`tellg()` (Tell Get):** Lấy vị trí byte hiện tại của con trỏ đọc.
- **`seekp(offset, origin)` (Seek Put):** Di chuyển con trỏ ghi đến vị trí cần cập nhật.
- **`tellp()` (Tell Put):** Lấy vị trí byte hiện tại của con trỏ ghi.

---

## 2. Cú pháp & Vận hành

### 1. Định nghĩa Cấu trúc Bản ghi kích thước cố định (POD Struct)

> [!WARNING]
> Để một struct có thể đọc ghi trực tiếp bằng `read()` và `write()`, struct đó bắt buộc phải là một **Plain Old Data (POD)** - nghĩa là chỉ chứa các kiểu dữ liệu nguyên thủy hoặc mảng tĩnh. **Tuyệt đối không chứa con trỏ hoặc `std::string`!** (Vì `std::string` chỉ chứa con trỏ trỏ tới Heap, nếu ghi thô ra đĩa bạn chỉ lưu được địa chỉ con trỏ rác chứ không lưu được văn bản thật).

```cpp
#include <iostream>
#include <fstream>
#include <cstring>

// Struct bản ghi cố định 40 bytes
struct Employee {
    int id;               // 4 bytes
    char name[32];        // 32 bytes (mảng ký tự tĩnh)
    double salary;        // 8 bytes (padding tính thêm nếu cần)
};

int main() {
    const char* dbFile = "employees.db";

    // 1. TẠO FILE VÀ GHI 3 BẢN GHI
    {
        std::ofstream out(dbFile, std::ios::out | std::ios::binary);
        Employee list[3] = {
            {101, "Nguyen Van A", 1500.0},
            {102, "Tran Thi B",   2000.0},
            {103, "Le Van C",     2500.0}
        };
        out.write(reinterpret_cast<const char*>(list), sizeof(list));
        out.close();
    }

    // 2. TRUY XUẤT NGẪU NHIÊN BẢN GHI THỨ 2 (Index = 1) TRONG O(1)
    {
        std::ifstream in(dbFile, std::ios::in | std::ios::binary);
        if (!in) return 1;

        int targetIndex = 1; // Bản ghi Tran Thi B
        // Công thức tính offset: index * sizeof(Struct)
        std::streampos offset = targetIndex * sizeof(Employee);

        // Nhảy thẳng tới vị trí cần đọc từ đầu file (ios::beg)
        in.seekg(offset, std::ios::beg);

        Employee emp;
        in.read(reinterpret_cast<char*>(&emp), sizeof(Employee));

        std::cout << ">> Truy xuất ngẫu nhiên bản ghi index [" << targetIndex << "]:\n";
        std::cout << "   ID:     " << emp.id << "\n";
        std::cout << "   Họ tên: " << emp.name << "\n";
        std::cout << "   Lương:  " << emp.salary << "\n";

        // Tính tổng số bản ghi trong file thông qua tellg()
        in.seekg(0, std::ios::end); // Nhảy tới cuối file
        std::streampos totalBytes = in.tellg();
        int totalRecords = totalBytes / sizeof(Employee);
        std::cout << ">> Tổng số bản ghi trong CSDL: " << totalRecords << "\n";
    }

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Ghi struct chứa `std::string` hoặc con trỏ ra file nhị phân
> Nếu viết:
> ```cpp
> struct BadUser { int id; std::string name; }; // Nguy hiểm!
> file.write((char*)&user, sizeof(user));
> ```
> Bạn chỉ ghi được 24-32 bytes metadata của đối tượng `std::string` (gồm con trỏ trỏ vào RAM hiện tại). Khi mở file này trên máy khác hoặc sau khi tắt máy bật lại, con trỏ đó trở thành Dangling Pointer, chương trình đọc file sẽ bị sập ngay lập tức!
> **Quy tắc vàng:** Dùng mảng ký tự kích thước cố định `char name[64];` hoặc kỹ thuật tuần tự hóa (Serialization).

> [!TIP]
> ### 2. Mở file ở chế độ vừa đọc vừa ghi `std::ios::in | std::ios::out`
> Để sửa đổi một bản ghi trực tiếp trên đĩa mà không cần ghi lại cả file:
> Dùng `std::fstream` với cờ `std::ios::in | std::ios::out | std::ios::binary`. Nhảy con trỏ `seekp` tới đúng offset của bản ghi đó và gọi `write()`, hệ điều hành sẽ ghi đè chính xác các byte của bản ghi cũ!

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Để nhảy con trỏ đọc lùi lại 50 bytes so với vị trí cuối cùng của tệp tin, lệnh nào sau đây là chính xác?
- A. `file.seekg(50, std::ios::beg);`
- B. `file.seekg(-50, std::ios::end);`
- C. `file.seekp(50, std::ios::cur);`
- D. `file.tellg(-50);`

**Đáp án đúng:** **B**
*Giải thích:* `std::ios::end` chỉ định mốc cuối file, giá trị âm `-50` chỉ định dịch chuyển lùi lại 50 bytes.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn cập nhật điểm số của học sinh thứ K trong file nhưng làm hỏng dữ liệu của bản ghi kế tiếp:

```cpp
// ❌ ĐOẠN CODE LỖI
struct Record { int id; float score; };
// Cố cập nhật chỉ riêng trường score của bản ghi thứ 3
file.seekp(3 * sizeof(Record) + sizeof(int), std::ios::beg);
float newScore = 9.5f;
file << newScore; // Dùng toán tử << dạng văn bản trên file nhị phân!
```
**Nguyên nhân:** Toán tử `<<` ghi chuỗi ký tự `"9.5"` (3 bytes) thay vì 4 bytes nhị phân thô của `float`, làm xô lệch toàn bộ các byte phía sau.
**Sửa lại chuẩn:**
Dùng phương thức `write()` nhị phân:
```cpp
// ✅ ĐOẠN CODE CHUẨN
file.seekp(3 * sizeof(Record) + sizeof(int), std::ios::beg);
float newScore = 9.5f;
file.write(reinterpret_cast<const char*>(&newScore), sizeof(newScore));
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình lưu trữ danh sách sản phẩm gồm `id` (`int`) và `price` (`double`). Viết hàm `void updateProductPrice(const char* filename, int recordIndex, double newPrice)` sử dụng `std::fstream` để cập nhật trực tiếp giá của sản phẩm tại chỉ số `recordIndex` mà không tạo file mới.

**Code giải mẫu:**
```cpp
#include <iostream>
#include <fstream>

struct Product {
    int id;
    double price;
};

void updateProductPrice(const char* filename, int recordIndex, double newPrice) {
    std::fstream file(filename, std::ios::in | std::ios::out | std::ios::binary);
    if (!file) {
        std::cerr << "Khong mo duoc file!\n";
        return;
    }

    // Nhảy tới vị trí trường price của bản ghi cần sửa:
    // Offset = recordIndex * sizeof(Product) + offsetof(price)
    std::streampos offset = recordIndex * sizeof(Product) + sizeof(int);
    file.seekp(offset, std::ios::beg);
    file.write(reinterpret_cast<const char*>(&newPrice), sizeof(double));
    file.close();
    std::cout << ">> Da cap nhat gia ban ghi [" << recordIndex << "] thanh: " << newPrice << "\n";
}

int main() {
    const char* db = "store.db";
    // Khởi tạo 2 sản phẩm
    {
        std::ofstream out(db, std::ios::binary);
        Product p[2] = {{1, 10.5}, {2, 20.0}};
        out.write(reinterpret_cast<const char*>(p), sizeof(p));
    }

    // Cập nhật giá sản phẩm index 1 thành 99.9
    updateProductPrice(db, 1, 99.9);

    // Đọc lại để kiểm tra
    {
        std::ifstream in(db, std::ios::binary);
        Product p;
        in.seekg(1 * sizeof(Product), std::ios::beg);
        in.read(reinterpret_cast<char*>(&p), sizeof(Product));
        std::cout << "Gia san pham sau khi sua: " << p.price << "\n";
    }

    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **Truy xuất ngẫu nhiên (Random Access)** đạt độ phức tạp O(1) nhờ tính chất kích thước cố định của các bản ghi struct nhị phân.
- Bộ 4 hàm **`seekg` / `tellg`** (đọc) và **`seekp` / `tellp`** (ghi) là công cụ điều khiển con trỏ tệp.
- Tuyệt đối chỉ đọc/ghi nhị phân trực tiếp trên các struct **POD (Plain Old Data)** không chứa con trỏ.

*Bài học tiếp theo:* Ứng dụng kỹ thuật này để xây dựng một **Mini File Database Engine: Bảng Dữ liệu có Header và Chỉ mục Index**.
