---
lessonId: "CPP-01.01"
title: "Tổng quan ngôn ngữ C++ và Quy trình Biên dịch"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["c++", "compiler", "preprocessor", "linker", "machine code"]
prerequisites: []
---

# Tổng quan ngôn ngữ C++ và Quy trình Biên dịch

## 1. Khái niệm cốt lõi

Máy tính chỉ hiểu duy nhất tín hiệu nhị phân gồm các số `0` và `1` (gọi là **Mã máy - Machine Code**). Để con người có thể viết lệnh cho máy tính dễ dàng mà không cần gõ hàng triệu số nhị phân, các nhà khoa học đã tạo ra **Ngôn ngữ lập trình bậc cao**.

Trong đó, **C++** (ra đời năm 1979 tại Bell Labs) là một trong những ngôn ngữ lập trình mạnh mẽ nhất. C++ kết hợp giữa **tư duy lập trình hiện đại** và **khả năng tương tác trực tiếp với phần cứng**, giúp chương trình đạt tốc độ thực thi rất cao.

| Thuật ngữ | Ý nghĩa thực tế |
| :--- | :--- |
| **Mã nguồn (Source Code)** | File văn bản chứa câu lệnh do bạn viết (đuôi `.cpp`). |
| **Trình biên dịch (Compiler)** | Phần mềm dịch mã nguồn bạn viết sang mã máy mà máy tính hiểu được. |
| **Trình liên kết (Linker)** | Ghép các file mã máy và thư viện hệ thống lại thành file chạy hoàn chỉnh. |
| **File thực thi (Executable)** | File chương trình hoàn thiện có thể nhấp chuột chạy trực tiếp (đuôi `.exe` trên Windows). |

## 2. Cú pháp & Quy tắc hoạt động

C++ là ngôn ngữ **biên dịch (Compiled Language)**. Toàn bộ mã nguồn bạn viết phải trải qua dây chuyền 4 bước chuyển đổi trước khi có thể chạy:

```text
[Mã nguồn .cpp]
      │
      ▼ (1. Tiền xử lý - Preprocessor: mở rộng thư viện #include)
[Mã tiền xử lý .i]
      │
      ▼ (2. Biên dịch - Compiler: kiểm tra cú pháp và dịch sang hợp ngữ)
[Mã hợp ngữ .s]
      │
      ▼ (3. Hợp dịch - Assembler: dịch sang mã máy nhị phân 0-1)
[File đối tượng .obj / .o]
      │
      ▼ (4. Liên kết - Linker: gắn thư viện chuẩn)
[File chạy hoàn chỉnh .exe]
```

## 3. Ví dụ minh họa tinh gọn

Cấu trúc cơ bản nhất của một câu lệnh xuất trong C++:

```cpp
// Thao tác in một dòng chào mừng ra màn hình
std::cout << "Xin chao mung ban den voi C++!";
```

* Trong C++, `std::cout` đại diện cho màn hình hiển thị.
* Dấu `<<` là mũi tên đẩy dữ liệu từ phải sang trái vào màn hình.
* Mỗi câu lệnh phải kết thúc bằng dấu chấm phẩy `;`.

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm lẫn giữa IDE và Trình biên dịch (Compiler)**
> * *Nguyên nhân:* Nhiều bạn nghĩ cài VS Code hay Dev-C++ là code tự chạy được.
> * *Cách phòng tránh:* IDE chỉ là công cụ soạn thảo văn bản thông minh. Máy tính bắt buộc phải cài đặt trình biên dịch (như MinGW/GCC trên Windows) thì mới dịch được file `.cpp` thành `.exe`.

> [!WARNING]
> **2. Lỗi quên dấu chấm phẩy `;` hoặc viết hoa hàm `main`**
> * *Nguyên nhân:* C++ phân biệt chữ hoa và chữ thường. Viết `Main()` hoặc `MAIN()` sẽ bị báo lỗi không tìm thấy điểm bắt đầu.
> * *Cách phòng tránh:* Luôn viết hàm bắt đầu bằng chữ thường `int main()` và nhớ dấu `;` ở cuối mỗi câu lệnh.

## 5. Ghi nhớ trọng tâm

- C++ là ngôn ngữ **biên dịch thuần túy**: cần dịch toàn bộ mã nguồn sang file `.exe` trước khi chạy.
- 4 bước chuyển đổi: **Tiền xử lý ➔ Biên dịch ➔ Hợp dịch ➔ Liên kết**.
- Mọi chương trình C++ đều bắt đầu chạy từ hàm `main()` và các câu lệnh kết thúc bằng dấu `;`.
