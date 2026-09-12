---
lessonId: CPP2-06.01
title: "Cơ chế Xử lý Ngoại lệ Hệ thống (try, catch, throw, noexcept)"
difficulty: "Nâng cao"
estimatedDuration: "75 phút"
keywords: ["ngoại lệ", "exception", "try", "catch", "throw", "noexcept", "std::exception", "stack unwinding", "bảo vệ runtime"]
prerequisites: ["CPP2-02.04"]
---

# Cơ chế Xử lý Ngoại lệ Hệ thống (try, catch, throw, noexcept)

## 1. Khái niệm & Vấn đề

Trong một phần mềm thương mại hoạt động 24/7 (như máy chủ ngân hàng, hệ điều hành ô tô tự lái), các tình huống bất thường luôn luôn rình rập:
- Ổ cứng bị đầy không thể ghi file.
- Cạn kiệt bộ nhớ RAM khi cấp phát `new`.
- Người dùng truyền vào tham số chia cho 0 hoặc căn bậc hai của số âm.

Nếu xử lý theo cách cổ điển (trả về mã lỗi âm như `-1` hay `NULL`), mã nguồn sẽ bị phân mảnh bởi hàng trăm câu lệnh `if (err < 0)` rối rắm. Thậm chí tệ hơn, lập trình viên có thể vô tình quên kiểm tra mã lỗi, khiến chương trình tiếp tục chạy trong trạng thái hỏng hóc và gây ra thảm họa.

C++ cung cấp **Hệ thống Xử lý Ngoại lệ (Exception Handling)** với ba từ khóa cốt lõi:
- **`throw`:** Ném ra một tín hiệu cảnh báo lỗi bất thường.
- **`try`:** Bọc vùng code tiềm ẩn nguy cơ xảy ra lỗi.
- **`catch`:** Đón bắt ngoại lệ và thực hiện phương án cứu hộ khẩn cấp mà không làm sập tiến trình.

---

## 2. Cú pháp & Vận hành

### 1. Cơ chế Quấn Ngăn Xếp (Stack Unwinding) và Kế thừa `std::exception`

Khi một ngoại lệ được ném ra bằng `throw`, chương trình sẽ lập tức dừng thực thi hàm hiện tại và "leo ngược" lên các tầng gọi hàm trước đó (Stack Unwinding) để tìm khối `catch` phù hợp.
**Trong quá trình quấn ngăn xếp này, tất cả các đối tượng cục bộ trên Stack của các hàm trung gian ĐỀU ĐƯỢC GỌI DESTRUCTOR TỰ ĐỘNG GIẢI PHÓNG!** (Nếu kết hợp với RAII / Smart Pointers, hoàn toàn không bao giờ lo bị rò rỉ bộ nhớ).

```cpp
#include <iostream>
#include <exception>
#include <string>

// Tự định nghĩa lớp ngoại lệ chuyên nghiệp kế thừa từ std::exception
class BankException : public std::exception {
private:
    std::string message;
public:
    BankException(const std::string& msg) : message(msg) {}

    // Ghi đè phương thức what() với từ khóa noexcept
    const char* what() const noexcept override {
        return message.c_str();
    }
};

class BankAccount {
private:
    double balance;
public:
    BankAccount(double init) : balance(init) {}

    void withdraw(double amount) {
        if (amount <= 0) {
            throw BankException("Loi nghiep vu: So tien rut phai lon hon 0!");
        }
        if (amount > balance) {
            throw BankException("Loi nghiep vu: So du tai khoan khong du de rut!");
        }
        balance -= amount;
        std::cout << ">> Rut tien thanh cong. So du con lai: " << balance << "\n";
    }
};

int main() {
    BankAccount myAcc(500.0);

    try {
        std::cout << "Thu rut 200:\n";
        myAcc.withdraw(200.0);

        std::cout << "\nThu rut tiep 600 (Vuot qua so du):\n";
        myAcc.withdraw(600.0); // Dòng này sẽ kích hoạt throw!

        std::cout << "Dong nay se khong bao gio duoc chay!\n";
    } catch (const BankException& e) {
        // Bắt ngoại lệ theo tham chiếu hằng (const Reference)
        std::cerr << ">> [BAT NGOAI LE NGAN HANG]: " << e.what() << "\n";
    } catch (const std::exception& e) {
        // Khối phòng thủ bắt mọi ngoại lệ chuẩn khác
        std::cerr << ">> [BAT NGOAI LE CHUAN]: " << e.what() << "\n";
    } catch (...) {
        // Bắt mọi loại lỗi còn lại (Catch-all)
        std::cerr << ">> [CANH BAO]: Bat duoc ngoai le khong xac dinh!\n";
    }

    std::cout << "\n>> Chuong trinh tiep tuc chay on dinh ma khong he bi sap!\n";
    return 0;
}
```

### 2. Từ khóa `noexcept` trong Modern C++

Từ C++11, từ khóa `noexcept` đặt sau khai báo hàm để cam kết với compiler: *"Hàm này đảm bảo 100% không bao giờ ném ra bất kỳ ngoại lệ nào"*.
- Giúp trình biên dịch loại bỏ mã máy quản lý Exception Table, làm hàm chạy nhanh hơn và file `.exe` nhẹ hơn.
- Nếu một hàm đánh dấu `noexcept` nhưng bên trong lại vô tình ném lỗi, chương trình sẽ gọi ngay `std::terminate()` để tự sát lập tức thay vì quấn ngăn xếp.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Bắt ngoại lệ theo tham trị (Catch-by-value) gây cắt xén đối tượng
> Nếu bạn viết `catch (std::exception e)` thay vì `catch (const std::exception& e)`:
> Đối tượng lỗi bị sao chép và xảy ra hiện tượng **Cắt xén đối tượng (Object Slicing)**. Mọi thuộc tính và phương thức `what()` tùy biến của lớp con `BankException` sẽ bị vứt bỏ, chỉ còn lại lớp cha chung chung!
> **Quy tắc vàng:** Luôn luôn bắt ngoại lệ theo tham chiếu hằng: `catch (const std::exception& e)`.

> [!WARNING]
> ### 2. Ném ngoại lệ bên trong Destructor
> Tuyệt đối **KHÔNG BAO GIỜ** được ném ngoại lệ từ bên trong một hàm Destructor!
> Nếu một ngoại lệ đang trong quá trình quấn ngăn xếp (Stack Unwinding) để đi tìm khối catch, và trong lúc hủy một biến lại có thêm một ngoại lệ thứ hai xuất hiện từ Destructor: C++ sẽ không biết xử lý ngoại lệ nào và lập tức sập toàn bộ hệ thống!

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Khi một ngoại lệ được ném ra từ trong hàm, cơ chế nào của C++ tự động dọn dẹp và gọi Destructor cho các biến cục bộ trên Stack của các hàm trung gian?
- A. Garbage Collection
- B. Stack Unwinding (Quấn ngăn xếp)
- C. Buffer Overflow
- D. Data Alignment

**Đáp án đúng:** **B**
*Giải thích:* Stack Unwinding là quy trình tự động quét lùi Call Stack để giải phóng biến và tìm khối lệnh `catch` tương thích.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây cố gắng bắt ngoại lệ cấp phát bộ nhớ khi RAM bị tràn nhưng dùng sai kiểu:

```cpp
// ❌ ĐOẠN CODE LỖI
try {
    int* p = new int[1000000000000LL];
} catch (int errorCode) { // new ném ra std::bad_alloc chứ không ném ra mã số int!
    std::cout << "Khong du RAM\n";
}
```
**Sửa lại chuẩn:**
Bắt ngoại lệ `std::bad_alloc` hoặc `std::exception`:
```cpp
// ✅ ĐOẠN CODE CHUẨN
#include <new>

try {
    int* p = new int[1000000000000LL];
} catch (const std::bad_alloc& e) {
    std::cerr << "Loi cap phat: " << e.what() << "\n";
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Viết hàm `double computeSquareRoot(double x)`. Nếu x < 0, ném ra ngoại lệ `std::invalid_argument("Gia tri khong the am")`. Trong hàm `main`, gọi hàm trong khối `try-catch` và in thông báo lỗi thân thiện.

---

## 5. Đúc kết & Đi tiếp

- **Xử lý ngoại lệ** tách biệt rành mạch giữa luồng chạy thông thường và luồng xử lý lỗi khẩn cấp.
- Luôn kế thừa từ **`std::exception`** và luôn bắt ngoại lệ bằng **`const T&`**.
- Đánh dấu **`noexcept`** cho các hàm di chuyển (Move operations) và hàm chắc chắn không lỗi để tối ưu hiệu năng.

*Bài học tiếp theo:* Khám phá chiều sâu phần cứng: **Tối ưu hóa Hiệu năng Cache-friendly Code (Spatial & Temporal Locality)**.
