---
lessonId: CPP2-03.01
title: "Phân biệt Tệp Văn bản (Text File) và Tệp Nhị phân (Binary File)"
difficulty: "Trung bình"
estimatedDuration: "65 phút"
keywords: ["file nhị phân", "binary file", "text file", "ios::binary", "read", "write", "reinterpret_cast"]
prerequisites: ["Lesson_01_04", "CPP2-02.01"]
---

# Phân biệt Tệp Văn bản (Text File) và Tệp Nhị phân (Binary File)

## 1. Khái niệm & Vấn đề

Trong lập trình, mọi dữ liệu lưu trữ lâu dài trên ổ đĩa cứng (HDD/SSD) đều thông qua Tệp tin (File). Có hai phương thức lưu trữ tệp cơ bản:
1. **Tệp văn bản (Text File):** Dữ liệu được mã hóa thành các ký tự con người đọc được (ASCII / UTF-8). Số nguyên `123456789` được lưu thành 9 ký tự (`'1'`, `'2'`, ..., `'9'`), tốn đúng 9 bytes.
2. **Tệp nhị phân (Binary File):** Dữ liệu được ghi thẳng dưới dạng các byte thô (Raw Bytes) giống hệt như cách nó đang nằm trong RAM! Số nguyên `int 123456789` chỉ tốn đúng **4 bytes** trong tệp nhị phân, bất kể giá trị lớn đến đâu.

### Tại sao các hệ thống lớn, Cơ sở dữ liệu và Game Engine luôn dùng Binary File?
- **Tốc độ đọc/ghi siêu tốc:** Không tốn thời gian CPU parse từ chuỗi ký tự sang số và ngược lại.
- **Tiết kiệm dung lượng lưu trữ:** Dữ liệu số thực `double` (8 bytes) nếu ghi ra text có thể tốn tới 15-20 ký tự.
- **Bảo toàn độ chính xác tuyệt đối:** Số thực trong text file thường bị mất mát độ chính xác do làm tròn dấu phẩy động.

---

## 2. Cú pháp & Vận hành

### 1. Cú pháp Ghi và Đọc Byte thô bằng `write()` và `read()`

Để thao tác với file nhị phân trong C++, ta mở luồng với cờ `std::ios::binary` và sử dụng hai hàm thành viên:
- `out.write(const char* buffer, std::streamsize size);`
- `in.read(char* buffer, std::streamsize size);`

```cpp
#include <iostream>
#include <fstream>
#include <vector>

int main() {
    const char* filename = "numbers.bin";

    // 1. GHI DỮ LIỆU NHỊ PHÂN RA FILE
    {
        std::ofstream outFile(filename, std::ios::out | std::ios::binary);
        if (!outFile) {
            std::cerr << "Không thể tạo file nhị phân!\n";
            return 1;
        }

        int number = 987654321;
        double pi = 3.141592653589793;

        // Ép kiểu địa chỉ con trỏ sang const char* để ghi byte thô
        outFile.write(reinterpret_cast<const char*>(&number), sizeof(number));
        outFile.write(reinterpret_cast<const char*>(&pi), sizeof(pi));

        std::cout << ">> Đã ghi thành công " << (sizeof(number) + sizeof(pi)) << " bytes ra " << filename << "\n";
    } // Tự động đóng file (RAII)

    // 2. ĐỌC DỮ LIỆU NHỊ PHÂN TỪ FILE
    {
        std::ifstream inFile(filename, std::ios::in | std::ios::binary);
        if (!inFile) {
            std::cerr << "Không thể mở file để đọc!\n";
            return 1;
        }

        int readNum = 0;
        double readPi = 0.0;

        inFile.read(reinterpret_cast<char*>(&readNum), sizeof(readNum));
        inFile.read(reinterpret_cast<char*>(&readPi), sizeof(readPi));

        std::cout << ">> Dữ liệu đọc lại từ file nhị phân:\n";
        std::cout << "   Số nguyên: " << readNum << "\n";
        std::cout << "   Số thực pi: " << readPi << "\n";
    }

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Quên cờ `std::ios::binary` trên hệ điều hành Windows
> Trên Windows, chế độ text file mặc định sẽ tự động chuyển đổi ký tự xuống dòng: byte `0x0A` (`
`) bị biến đổi thành cặp 2 bytes `0x0D 0x0A` (`
`) khi ghi và ngược lại khi đọc.
> Nếu bạn ghi một số nguyên ngẫu nhiên chứa byte có giá trị `0x0A` mà quên cờ `std::ios::binary`, Windows sẽ tự chèn thêm byte `0x0D` vào file, làm hỏng toàn bộ cấu trúc dữ liệu nhị phân!
> **Quy tắc vàng:** Luôn luôn khai báo `std::ios::binary` cho mọi file dữ liệu nhị phân.

> [!TIP]
> ### 2. Ghi mảng lớn trong duy nhất 1 lần gọi hàm
> Thay vì dùng vòng lặp gọi `outFile.write()` 1 triệu lần cho từng phần tử, bạn có thể ghi toàn bộ mảng `N` phần tử trong đúng 1 lệnh duy nhất:
> ```cpp
> outFile.write(reinterpret_cast<const char*>(arr.data()), arr.size() * sizeof(int));
> ```
> Tốc độ ghi sẽ nhanh gấp 50 đến 100 lần nhờ giảm thiểu tối đa số lượng System Call xuống hệ điều hành.

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Số nguyên `int x = 1000000;` khi được ghi ra tệp nhị phân bằng `outFile.write(reinterpret_cast<char*>(&x), sizeof(x))` sẽ chiếm bao nhiêu bytes dung lượng trên đĩa cứng?
- A. 1 byte
- B. 4 bytes
- C. 7 bytes (tương ứng 7 chữ số)
- D. 8 bytes

**Đáp án đúng:** **B**
*Giải thích:* Trong tệp nhị phân, dữ liệu được ghi theo kích thước nguyên bản của kiểu dữ liệu (`sizeof(int) = 4` bytes), không phụ thuộc vào số lượng chữ số biểu diễn ở hệ thập phân.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn đọc dữ liệu từ file nhị phân nhưng kết quả đọc được toàn là số 0:

```cpp
// ❌ ĐOẠN CODE LỖI
#include <iostream>
#include <fstream>

int main() {
    std::ifstream file("data.bin"); // Quên cờ ios::binary và không kiểm tra file mở được hay không!
    int val = 0;
    file.read((char*)&val, sizeof(val));
    std::cout << val;
}
```
**Nguyên nhân:** Thiếu cờ `std::ios::binary` và thiếu lệnh kiểm tra `file.is_open()`. Nếu file không tồn tại, hàm `read()` âm thầm thất bại và biến `val` giữ nguyên giá trị 0.
**Sửa lại chuẩn:**
```cpp
// ✅ ĐOẠN CODE CHUẨN
#include <iostream>
#include <fstream>

int main() {
    std::ifstream file("data.bin", std::ios::in | std::ios::binary);
    if (!file) {
        std::cerr << "Loi: Khong the tim thay tep data.bin!\n";
        return 1;
    }
    int val = 0;
    if (file.read(reinterpret_cast<char*>(&val), sizeof(val))) {
        std::cout << "Doc thanh cong: " << val << "\n";
    }
    return 0;
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình tạo một mảng động gồm 10 số thực `float`. Ghi toàn bộ mảng ra file nhị phân `floats.bin`. Sau đó mở lại file và đọc dữ liệu vào một mảng mới, in các phần tử ra màn hình để chứng minh dữ liệu được bảo toàn nguyên vẹn.

**Code giải mẫu:**
```cpp
#include <iostream>
#include <fstream>
#include <vector>

int main() {
    std::vector<float> original = {1.1f, 2.2f, 3.3f, 4.4f, 5.5f, 6.6f, 7.7f, 8.8f, 9.9f, 10.0f};
    const char* filename = "floats.bin";

    // Ghi mảng ra file nhị phân
    std::ofstream out(filename, std::ios::out | std::ios::binary);
    if (out) {
        out.write(reinterpret_cast<const char*>(original.data()), original.size() * sizeof(float));
        out.close();
    }

    // Đọc ngược lại vào vector mới
    std::vector<float> loaded(10);
    std::ifstream in(filename, std::ios::in | std::ios::binary);
    if (in) {
        in.read(reinterpret_cast<char*>(loaded.data()), loaded.size() * sizeof(float));
        in.close();
    }

    std::cout << "Du lieu doc tu file nhi phan: ";
    for (float f : loaded) {
        std::cout << f << " ";
    }
    std::cout << "\n";

    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **Binary File** lưu trữ nguyên bản các byte trong RAM, mang lại tốc độ đọc/ghi vượt trội và kích thước file tối ưu.
- Cặp hàm **`write()` và `read()`** kết hợp `reinterpret_cast<char*>` là chìa khóa thao tác I/O nhị phân.
- Luôn bật cờ **`std::ios::binary`** để ngăn chặn việc biến đổi ký tự xuống dòng tự động của Windows.

*Bài học tiếp theo:* Nâng tầm lên lưu trữ đối tượng: **Đọc Ghi Cấu trúc Bản ghi và Định vị Con trỏ Tệp ngẫu nhiên (Random Access với seekg, seekp)**.
