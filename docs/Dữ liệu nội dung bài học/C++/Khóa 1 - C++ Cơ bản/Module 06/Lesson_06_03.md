---
lessonId: Lesson_06_03
title: "Các Phương thức Xử lý Chuỗi Cốt lõi và Thuật toán Chuẩn hóa Văn bản"
difficulty: "Trung bình"
estimatedDuration: "75 phút"
keywords: ["std::string", "find", "substr", "stringstream", "chuẩn hóa chuỗi", "xử lý văn bản"]
prerequisites: ["Lesson_06_02"]
---

# Các Phương thức Xử lý Chuỗi Cốt lõi và Thuật toán Chuẩn hóa Văn bản

## 1. Khái niệm & Vấn đề

Trong các ứng dụng thực tế - từ hệ thống ngân hàng, cổng thông tin đăng ký thi tuyển sinh đến các bộ xử lý dữ liệu lớn (NLP), dữ liệu đầu vào do người dùng nhập vào thường rất hỗn độn:
- Thừa thãi khoảng trắng ở đầu, cuối và giữa các từ (ví dụ: `"   ngUYEn   vAn   a  "`).
- Viết hoa viết thường tùy tiện, lộn xộn.
- Dính các ký tự phân cách bất quy tắc.

Để làm sạch dữ liệu (Data Sanitization), chúng ta cần thành thạo **các phương thức cắt ghép chuỗi chuẩn của `std::string`** kết hợp với công cụ bóc tách luồng siêu tiện lợi: **`std::stringstream`**.

---

## 2. Cú pháp & Vận hành

### 1. Bảng phương thức cốt lõi của `std::string`

| Phương thức | Cú pháp mẫu | Mục đích & Độ phức tạp |
| :--- | :--- | :--- |
| `size()` / `length()` | `s.length()` | Trả về số lượng ký tự trong chuỗi - O(1) |
| `substr(pos, count)` | `s.substr(2, 5)` | Trích xuất chuỗi con từ vị trí `pos` với độ dài `count` - O(count) |
| `find(sub)` | `s.find("abc")` | Tìm vị trí đầu tiên xuất hiện của chuỗi con. Trả về `std::string::npos` nếu không thấy |
| `replace(pos, count, str)` | `s.replace(0, 3, "New")` | Thay thế `count` ký tự từ vị trí `pos` bằng `str` |
| `push_back(ch)` | `s.push_back('!')` | Thêm 1 ký tự vào đuôi chuỗi - O(1) trung bình |
| `pop_back()` | `s.pop_back()` | Xóa 1 ký tự cuối cùng - O(1) |

### 2. Thuật toán kinh điển: Bóc tách từng từ với `std::stringstream`

Thư viện `<sstream>` cung cấp lớp `std::stringstream` cho phép biến một chuỗi văn bản thành một luồng dữ liệu (stream) tương tự như bàn phím ảo. Khi ta dùng toán tử `>>` trên stringstream, nó sẽ **tự động loại bỏ toàn bộ các khoảng trắng thừa** và tách riêng từng từ một cách cực kỳ thanh lịch!

```cpp
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <cctype>

// Hàm chuẩn hóa một từ riêng lẻ: Viết hoa chữ đầu, viết thường các chữ sau
void formatWord(std::string& word) {
    if (word.empty()) return;
    word[0] = static_cast<char>(std::toupper(word[0]));
    for (size_t i = 1; i < word.length(); ++i) {
        word[i] = static_cast<char>(std::tolower(word[i]));
    }
}

// Thuật toán Chuẩn hóa Họ Tên người Việt Nam
std::string normalizeName(const std::string& raw) {
    std::stringstream ss(raw);
    std::string word;
    std::string result = "";
    
    while (ss >> word) { // Tự động nhảy qua mọi dấu cách thừa
        formatWord(word);
        if (!result.empty()) {
            result += " "; // Thêm một dấu cách đơn ngăn cách giữa các từ
        }
        result += word;
    }
    
    return result;
}

int main() {
    std::string messyInput = "   vU   tHI   hOaNg   mAi  ";
    std::cout << "Dữ liệu gốc bẩn: [" << messyInput << "]
";
    
    std::string cleanName = normalizeName(messyInput);
    std::cout << "Sau chuẩn hóa:   [" << cleanName << "]
";

    // Minh họa tìm kiếm và cắt chuỗi
    size_t pos = cleanName.find("Hoang");
    if (pos != std::string::npos) {
        std::cout << "Tìm thấy tên lót 'Hoang' tại chỉ số vị trí: " << pos << "
";
        std::string sub = cleanName.substr(pos, 5);
        std::cout << "Cắt chuỗi con: " << sub << "
";
    }

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Quên kiểm tra giá trị `std::string::npos`
> Khi dùng `s.find()`, nếu không tìm thấy chuỗi con cần tìm, hàm sẽ trả về hằng số đặc biệt `std::string::npos` (thường có giá trị là -1 khi biểu diễn unsigned, tức là số nguyên dương cực lớn 2^{64}-1).
> Nếu bạn lấy chỉ số đó truyền thẳng vào `s.substr()` mà không kiểm tra `pos != std::string::npos`, chương trình sẽ bắn ra ngoại lệ `std::out_of_range` và sập ngay tức khắc.

> [!TIP]
> ### 2. Tối ưu phép nối chuỗi trong vòng lặp lớn
> Nếu bạn cần ghép hàng chục nghìn đoạn chuỗi nhỏ lại với nhau, không nên dùng `res = res + part;` vì lệnh này tạo ra một bản sao trung gian mới mỗi lần thực hiện (độ phức tạp lũy tiến O(N²)).
> **Hãy dùng toán tử cộng dồn:** `res += part;` hoặc `res.append(part);` để tận dụng vùng nhớ đệm có sẵn (O(N)).

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Giá trị trả về của biểu thức `"LapTrinhCpp".substr(3, 5)` là gì?
- A. `"Trinh"`
- B. `"TrinhC"`
- C. `"LapTr"`
- D. `"pTrin"`

**Đáp án đúng:** **A**
*Giải thích:* Chỉ số 3 tương ứng với ký tự `'T'` (L=0, a=1, p=2, T=3). Lấy tiếp 5 ký tự tính từ vị trí đó sẽ được chuỗi con `"Trinh"`.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn thay thế tất cả dấu gạch ngang `'-'` trong số điện thoại thành dấu chấm `'.'`:

```cpp
// ❌ ĐOẠN CODE LỖI
#include <iostream>
#include <string>

int main() {
    std::string phone = "098-123-4567";
    size_t pos = phone.find('-');
    phone.replace(pos, 1, "."); // Chỉ thay thế được dấu gạch ngang đầu tiên!
    std::cout << phone;
}
```
**Nguyên nhân:** Lệnh `find` chỉ tìm thấy vị trí đầu tiên. Cần phải đặt trong một vòng lặp để duyệt hết tất cả các ký tự còn lại.
**Sửa lại chuẩn:**
```cpp
// ✅ ĐOẠN CODE CHUẨN
#include <iostream>
#include <string>

int main() {
    std::string phone = "098-123-4567";
    size_t pos = 0;
    while ((pos = phone.find('-', pos)) != std::string::npos) {
        phone.replace(pos, 1, ".");
        pos += 1; // Nhảy qua vị trí vừa thay thế
    }
    std::cout << "So sau khi chuan hoa: " << phone << "
";
    return 0;
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Nhập vào một câu tiếng Anh gồm nhiều từ. Đếm xem trong câu có bao nhiêu từ và in ra từ có độ dài dài nhất.

**Code giải mẫu:**
```cpp
#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string line;
    if (std::getline(std::cin, line)) {
        std::stringstream ss(line);
        std::string word;
        int wordCount = 0;
        std::string longestWord = "";

        while (ss >> word) {
            wordCount++;
            if (word.length() > longestWord.length()) {
                longestWord = word;
            }
        }

        std::cout << "So luong tu: " << wordCount << "
";
        std::cout << "Tu dai nhat: " << longestWord << " (" << longestWord.length() << " ky tu)
";
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **`std::stringstream`** là công cụ đắc lực nhất để bóc tách từ và dọn dẹp khoảng trắng thừa trong chuỗi.
- **`find()` và `substr()`** là bộ đôi hoàn hảo để định vị và trích xuất thông tin có cấu trúc.
- Luôn kiểm tra `pos != std::string::npos` trước khi tiến hành xử lý vị trí tìm thấy.

*Bài học tiếp theo:* Chúc mừng bạn đã chinh phục toàn diện mảng 1 chiều và chuỗi ký tự! Chúng ta sẽ bước sang **Module 7: Mảng 2 chiều và Bài toán Ma trận**, mở ra cánh cửa giải quyết các bài toán bảng số và lập trình Game Caro.
