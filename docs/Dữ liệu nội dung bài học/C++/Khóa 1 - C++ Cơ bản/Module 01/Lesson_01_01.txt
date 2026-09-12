---
lessonId: "CPP-01.01"
title: "Tổng quan ngôn ngữ C++ và Quy trình Biên dịch"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["c++", "compiler", "preprocessor", "linker", "executable", "machine code"]
prerequisites: []
---

## 1. Khái niệm & Vấn đề

Máy tính chỉ có thể hiểu và thực thi trực tiếp các tín hiệu nhị phân gồm các số `0` và `1` (Mã máy - Machine Code). Để con người có thể ra lệnh cho máy tính mà không cần viết hàng triệu số nhị phân vụn vặt, các nhà khoa học đã phát minh ra **Ngôn ngữ Lập trình bậc cao**.

Trong số các ngôn ngữ lập trình, **C++** (ra đời bởi Bjarne Stroustrup vào năm 1979 tại Bell Labs) là một tượng đài bất tử. C++ kết hợp hoàn hảo giữa **tư duy trừu tượng cấp cao** (hướng đối tượng, lập trình tổng quát) và **khả năng kiểm soát phần cứng cấp thấp** (thao tác trực tiếp trên ô nhớ RAM). Chính vì lý do này, toàn bộ các hệ điều hành lớn (Windows, Linux, macOS), các Game Engine đồ họa khủng (Unreal Engine), các trình duyệt web (Google Chrome, Safari) và lõi các thư viện AI hàng đầu (PyTorch, TensorFlow) đều được viết bằng C++.

| Thuật ngữ | Định nghĩa kỹ thuật | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Mã nguồn (Source Code)** | File văn bản chứa các dòng lệnh do lập trình viên viết (đuôi `.cpp`, `.h`). | Bản vẽ thiết kế kỹ thuật của một cỗ máy trên giấy. |
| **Trình tiền xử lý (Preprocessor)** | Bước chuẩn bị mã nguồn: mở rộng thư viện `#include`, thay thế `#define`. | Người phụ tá chuẩn bị nguyên vật liệu và bản vẽ trước khi đưa vào xưởng. |
| **Trình biên dịch (Compiler)** | Phần mềm chuyển đổi mã nguồn C++ sang mã máy nhị phân mà CPU hiểu được. | Nhà máy luyện kim biến bản vẽ thành các khối linh kiện cơ khí rời rạc. |
| **Trình liên kết (Linker)** | Công cụ kết nối các file đối tượng (`.obj` / `.o`) và thư viện hệ thống thành file chạy hoàn chỉnh. | Kỹ sư lắp ráp ghép nối các linh kiện rời rạc lại thành chiếc ô tô có thể chạy được. |
| **Tệp thực thi (Executable)** | File chương trình hoàn thiện có thể tự chạy trên hệ điều hành (đuôi `.exe` trên Windows hoặc ELF trên Linux). | Chiếc ô tô hoàn chỉnh sẵn sàng nổ máy lăn bánh trên đường. |

---

## 2. Cú pháp & Vận hành

### 2.1. Cấu trúc chương trình C++ đầu tiên
Dưới đây là một chương trình C++17 tối giản xuất lời chào ra màn hình:

```cpp
#include <iostream>

int main() {
    std::cout << "Chao mung ban den voi lap trinh C++!" << '\n';
    return 0;
}
```

### 2.2. Quy trình 4 Giai đoạn từ Mã nguồn đến File Chạy (.exe)
Khác với Python là ngôn ngữ *thông dịch* (chạy từng dòng), C++ là ngôn ngữ **biên dịch thuần túy**. Toàn bộ mã nguồn phải đi qua dây chuyền 4 bước nghiêm ngặt trước khi có thể chạy:

```text
[1. Mã nguồn main.cpp]
         │
         ▼ (Trình tiền xử lý - Preprocessor)
[2. Mã mở rộng main.i] (Đã gộp đầy đủ nội dung file iostream)
         │
         ▼ (Trình biên dịch - Compiler)
[3. Mã hợp ngữ main.s] ──► (Assembler) ──► [File đối tượng main.o / main.obj]
                                                     │
                                                     ▼ (Trình liên kết - Linker + Thư viện C++)
                                           [4. File thực thi main.exe]
```

### 2.3. Bảng theo dõi thực thi lệnh biên dịch bằng Command Line (GCC/G++)

| Lệnh chạy trong Terminal | Giai đoạn thực thi | Kết quả sinh ra | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| `g++ -E main.cpp -o main.i` | Tiền xử lý (Preprocessing) | File `main.i` | Gộp nội dung header `<iostream>` vào file. |
| `g++ -S main.i -o main.s` | Biên dịch (Compilation) | File `main.s` | Chuyển đổi mã C++ sang hợp ngữ (Assembly). |
| `g++ -c main.s -o main.o` | Hợp dịch (Assembly) | File `main.o` | Đưa về mã máy nhị phân 0-1 (Machine Code). |
| `g++ main.o -o main.exe` | Liên kết (Linking) | File `main.exe` | Gắn kết runtime hệ thống tạo file thực thi độc lập. |
| **`g++ -std=c++17 -Wall main.cpp -o main.exe`** | **Biên dịch trọn gói 1 bước** | **File `main.exe`** | **Lệnh tiêu chuẩn dùng trong thực tế và thi đấu.** |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các quan niệm sai lầm và lỗi cơ bản người mới hay mắc phải:**
> 1. **Nhầm lẫn giữa IDE và Trình biên dịch (Compiler):** VS Code, Dev-C++, Code::Blocks chỉ là phần mềm soạn thảo (IDE/Editor). Để code chạy được, máy tính bắt buộc phải cài Compiler thực thụ như **GCC (MinGW trên Windows)**, **Clang**, hoặc **MSVC**.
> 2. **Lỗi `undefined reference to 'main'`:** Trình liên kết (Linker) báo lỗi không tìm thấy cổng vào chương trình. Nguyên nhân: bạn quên viết hàm `main()` hoặc gõ sai tên hàm thành `Main()` (chữ M viết hoa). C++ phân biệt chữ hoa/chữ thường tuyệt đối.
> 3. **Lỗi `cannot open output file ... Permission denied`:** Bạn vừa chạy chương trình cũ xong và file `.exe` vẫn đang chạy ngầm trong task manager. Khi biên dịch lại, compiler không thể ghi đè lên file đang chạy được. Hãy tắt cửa sổ console cũ đi trước khi biên dịch lại.

> [!TIP]
> **Quy chuẩn lập trình tốt (Best Practice):**
> Luôn luôn bật cờ cảnh báo `-Wall` (Warning All) và chỉ định phiên bản `-std=c++17` khi biên dịch bằng g++. Cờ `-Wall` sẽ giúp trình biên dịch phát hiện sớm 90% lỗi logic tiềm ẩn trước khi bạn chạy thử chương trình.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Giai đoạn nào trong quá trình xây dựng chương trình C++ chịu trách nhiệm kết hợp các file đối tượng (`.obj`) và nạp các thư viện chuẩn (như thư viện in xuất `<iostream>`) để tạo ra file thực thi cuối cùng `.exe`?
* [ ] A) Preprocessor (Trình tiền xử lý)
* [ ] B) Compiler (Trình biên dịch)
* [ ] C) Assembler (Trình hợp dịch)
* [x] D) Linker (Trình liên kết)

*(Giải thích: Linker là bước thứ 4 có nhiệm vụ kết nối các hàm ngoài và thư viện chuẩn vào file mã máy để tạo ra tệp `.exe`).*

---

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây khi đem biên dịch bằng lệnh `g++ main.cpp` sẽ lập tức bị báo lỗi biên dịch (`Compile Error`). Bạn hãy quan sát kỹ và phát hiện 2 điểm sai cú pháp:

```cpp
// Đoạn code lỗi:
#include <iostream>

void Main() {
    std::cout << "Xin chao"
}
```

**Phân tích lỗi & Cách sửa:**
1. **Lỗi 1 (Hàm main sai):** C++ bắt buộc hàm cổng vào phải có tên là `main` (chữ thường toàn bộ) và kiểu trả về chuẩn là `int`, không được dùng `void Main()`.
2. **Lỗi 2 (Thiếu chấm phẩy):** Cuối câu lệnh `std::cout << "Xin chao"` thiếu dấu chấm phẩy `;`. Trong C++, dấu `;` là bắt buộc để kết thúc một câu lệnh.

Code sau khi sửa đúng:
```cpp
#include <iostream>

int main() {
    std::cout << "Xin chao";
    return 0;
}
```

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Hãy viết một chương trình C++ hoàn chỉnh xuất ra màn hình 2 dòng thông tin giới thiệu bản thân:
* Dòng 1: Họ và tên của bạn.
* Dòng 2: Mục tiêu học tập C++ (ví dụ: `Muc tieu: Lam chu lap trinh he thong va game!`).

**Yêu cầu kỹ thuật:**
* Mỗi thông tin nằm trên 1 dòng riêng biệt.
* Sử dụng ký tự xuống dòng `'\n'`.
* Chương trình kết thúc trả về mã `0`.

**Mã nguồn tham khảo:**
```cpp
#include <iostream>

int main() {
    std::cout << "Ho va ten: Nguyen Tuan Viet" << '\n';
    std::cout << "Muc tieu: Lam chu C++ va tro thanh Backend / Game Engineer!" << '\n';
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* C++ là ngôn ngữ **biên dịch bậc cao có khả năng can thiệp trực tiếp phần cứng**, giúp tạo ra các phần mềm có tốc độ xử lý nhanh nhất thế giới.
* Dây chuyền tạo file chạy của C++ gồm 4 công đoạn độc lập: **Tiền xử lý (Preprocessor) ➔ Biên dịch (Compiler) ➔ Hợp dịch (Assembler) ➔ Liên kết (Linker)**.
* Mọi chương trình C++ đều bắt đầu thực thi từ hàm **`int main()`** và các câu lệnh kết thúc bằng dấu chấm phẩy **`;`**.

Trong bài học tiếp theo **[Bài 1.2: Cấu trúc chương trình C++ chuẩn C++17 và Thao tác I/O cơ bản]**, chúng ta sẽ bóc tách chi tiết từng thành phần của file C++, làm chủ cơ chế xuất/nhập dòng dữ liệu `std::cout` / `std::cin` và làm rõ sự khác biệt hiệu năng giữa `std::endl` và `'\n'`.
