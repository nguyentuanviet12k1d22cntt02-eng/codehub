---
lessonId: CPP2-03.03
title: "Xây dựng Mini Database Engine: File Header, Bản ghi và Chỉ mục Index"
difficulty: "Nâng cao"
estimatedDuration: "85 phút"
keywords: ["database engine", "file header", "magic number", "metadata", "indexing", "bản ghi nhị phân", "mini project"]
prerequisites: ["CPP2-03.02"]
---

# Xây dựng Mini Database Engine: File Header, Bản ghi và Chỉ mục Index

## 1. Khái niệm & Vấn đề

Làm thế nào mà hệ điều hành nhận biết một file là file ảnh `.png`, file nén `.zip` hay file cơ sở dữ liệu SQLite? 
Câu trả lời nằm ở **File Header (Tiêu đề tệp)**: Những byte đầu tiên của file luôn được dành riêng để lưu trữ thông tin nhận dạng (Magic Number), phiên bản dữ liệu và các siêu dữ liệu quản lý (Metadata).

Một cấu trúc tệp cơ sở dữ liệu nhị phân chuẩn công nghiệp luôn gồm 2 phần:
1. **File Header (Cố định ở đầu file):**
   - `magicNumber`: Chuỗi 4 bytes định danh (ví dụ `"MDB1"`).
   - `version`: Phiên bản cấu trúc bảng (ví dụ `1`).
   - `recordCount`: Số lượng bản ghi hiện có trong bảng.
   - `recordSize`: Kích thước của mỗi bản ghi (để kiểm tra tương thích).
2. **Data Payload (Dữ liệu các bản ghi nối tiếp):**
   - Bản ghi 0, Bản ghi 1, ..., Bản ghi N-1.

---

## 2. Cú pháp & Vận hành

### Thiết kế Kiến trúc Mini Database Engine hoàn chỉnh

```cpp
#include <iostream>
#include <fstream>
#include <cstring>

// 1. Cấu trúc File Header chứa thông tin quản trị
struct FileHeader {
    char magic[4];          // "MYDB"
    uint32_t version;       // 1
    uint32_t recordCount;   // Số lượng bản ghi hiện có
    uint32_t recordSize;    // sizeof(Record)
};

// 2. Cấu trúc bản ghi học viên
struct StudentRecord {
    uint32_t id;
    char name[32];
    float gpa;
};

class MiniDB {
private:
    std::string filename;
    FileHeader header;

public:
    MiniDB(const std::string& dbPath) : filename(dbPath) {
        std::ifstream file(filename, std::ios::binary);
        if (!file) {
            // Nếu file chưa tồn tại -> Khởi tạo database mới với Header rỗng
            std::memcpy(header.magic, "MYDB", 4);
            header.version = 1;
            header.recordCount = 0;
            header.recordSize = sizeof(StudentRecord);

            std::ofstream newFile(filename, std::ios::binary);
            newFile.write(reinterpret_cast<const char*>(&header), sizeof(FileHeader));
            std::cout << ">> [INIT] Đã tạo mới cơ sở dữ liệu: " << filename << "\n";
        } else {
            // Đọc Header hiện có
            file.read(reinterpret_cast<char*>(&header), sizeof(FileHeader));
            std::cout << ">> [LOAD] Đã mở CSDL. Số bản ghi hiện tại: " << header.recordCount << "\n";
        }
    }

    // Thêm một bản ghi mới vào cuối file O(1)
    void insertRecord(const StudentRecord& record) {
        std::fstream file(filename, std::ios::in | std::ios::out | std::ios::binary);
        if (!file) return;

        // Nhảy tới cuối file để chèn
        file.seekp(0, std::ios::end);
        file.write(reinterpret_cast<const char*>(&record), sizeof(StudentRecord));

        // Cập nhật lại số lượng bản ghi trong Header
        header.recordCount++;
        file.seekp(0, std::ios::beg);
        file.write(reinterpret_cast<const char*>(&header), sizeof(FileHeader));

        std::cout << ">> [INSERT] Chèn thành công học viên: " << record.name << "\n";
    }

    // Tra cứu học viên theo chỉ số O(1)
    bool getRecord(uint32_t index, StudentRecord& outRecord) {
        if (index >= header.recordCount) return false;

        std::ifstream file(filename, std::ios::binary);
        // Bỏ qua FileHeader, nhảy tới vị trí index
        std::streampos pos = sizeof(FileHeader) + index * sizeof(StudentRecord);
        file.seekg(pos, std::ios::beg);
        file.read(reinterpret_cast<char*>(&outRecord), sizeof(StudentRecord));
        return true;
    }
};

int main() {
    MiniDB db("school.mydb");

    StudentRecord s1{1001, "Le Quoc Anh", 3.8f};
    StudentRecord s2{1002, "Pham Hoang Mai", 3.95f};

    db.insertRecord(s1);
    db.insertRecord(s2);

    StudentRecord res;
    if (db.getRecord(1, res)) {
        std::cout << ">> [QUERY] Tìm thấy bản ghi index 1:\n";
        std::cout << "   ID:   " << res.id << "\n";
        std::cout << "   Tên:  " << res.name << "\n";
        std::cout << "   GPA:  " << res.gpa << "\n";
    }

    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Quên cập nhật lại Header sau khi chèn hoặc xóa
> Nếu bạn ghi thêm 10 bản ghi vào đuôi file nhưng quên nhảy `seekp(0, ios::beg)` để cập nhật biến `recordCount` trong File Header, ở lần mở tiếp theo database engine sẽ coi như 10 bản ghi đó không hề tồn tại!

> [!TIP]
> ### 2. Kiểm tra Magic Number để ngăn chặn mở file rác
> Luôn kiểm tra `std::memcmp(header.magic, "MYDB", 4) == 0`. Nếu người dùng vô tình mở một file `.mp3` hoặc file văn bản bằng database engine của bạn, Magic Number không trùng khớp sẽ giúp chương trình báo lỗi an toàn thay vì đọc dữ liệu rác làm hỏng bộ nhớ.

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Mục đích quan trọng nhất của trường `magic` (Magic Number) ở đầu File Header trong các tệp nhị phân là gì?
- A. Tăng tốc độ đọc của đĩa cứng.
- B. Định danh định dạng file và xác thực tính hợp lệ của tệp dữ liệu trước khi xử lý.
- C. Mã hóa bảo mật file bằng mật khẩu.
- D. Tự động sao lưu dữ liệu lên đám mây.

**Đáp án đúng:** **B**
*Giải thích:* Magic Number đóng vai trò là "chữ ký" nhận diện duy nhất của định dạng file.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây cố gắng đọc bản ghi thứ K nhưng bị lệch do tính sai vị trí:

```cpp
// ❌ ĐOẠN CODE LỖI
std::streampos pos = index * sizeof(StudentRecord); // Quên cộng kích thước File Header!
file.seekg(pos, std::ios::beg);
```
**Sửa lại chuẩn:**
Bắt buộc phải cộng thêm phần Header nằm ở đầu file:
```cpp
// ✅ ĐOẠN CODE CHUẨN
std::streampos pos = sizeof(FileHeader) + index * sizeof(StudentRecord);
file.seekg(pos, std::ios::beg);
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Bổ sung phương thức `void printAll()` cho lớp `MiniDB` ở trên để đọc và in danh sách toàn bộ học viên đang lưu trữ trong database ra màn hình theo dạng bảng thẳng hàng đều đẹp.

---

## 5. Đúc kết & Đi tiếp

- **File Header** là thành phần sống còn để biến một file nhị phân vô danh thành một cơ sở dữ liệu có cấu trúc và phiên bản rõ ràng.
- Toàn bộ công thức truy xuất bản ghi trong database engine: `Offset = sizeof(Header) + Index * sizeof(Record)`.

*Bài học tiếp theo:* Chúng ta sẽ chuyển sang **Module 4: Tiền xử lý (Preprocessor) và Quản trị Dự án Đa tệp (.h và .cpp)**, học cách tổ chức mã nguồn chuyên nghiệp của các kỹ sư phần mềm C++ quốc tế.
