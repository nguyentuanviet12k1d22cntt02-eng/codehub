---
lessonId: CPP2-06.03
title: "Đồ án Kết khóa: Hệ thống Quản trị Bản ghi Nhị phân (Binary Record Storage Engine)"
difficulty: "Chuyên gia"
estimatedDuration: "90 phút"
keywords: ["đồ án", "capstone project", "binary storage engine", "indexing", "bản ghi nhị phân", "quản trị tệp", "C++ nâng cao"]
prerequisites: ["CPP2-06.02", "CPP2-03.03"]
---

# Đồ án Kết khóa: Hệ thống Quản trị Bản ghi Nhị phân (Binary Record Storage Engine)

## 1. Khái niệm & Vấn đề

Để khép lại trọn vẹn Khóa học **C++ Nâng cao & Lập trình Hệ thống**, chúng ta sẽ đóng vai trò của các Kỹ sư Hệ thống Dữ liệu (Database Systems Engineers) để xây dựng một sản phẩm hoàn chỉnh:
**Hệ thống Quản trị Bản ghi Nhị phân Độc lập (Binary Record Storage Engine)**.

Hệ thống này tích hợp toàn bộ tinh hoa kiến thức của 6 Modules:
1. **Module 1:** Thiết kế cấu trúc Bản ghi `struct` tối ưu Căn chỉnh bộ nhớ (Data Alignment) không lãng phí byte thừa.
2. **Module 2:** Quản trị vòng đời bộ nhớ và con trỏ bằng `std::unique_ptr` chuẩn nguyên lý RAII.
3. **Module 3:** Tệp tin nhị phân (`std::ios::binary`), Header có Magic Number và Truy xuất ngẫu nhiên O(1) với `seekg`/`seekp`.
4. **Module 4:** Tổ chức mã nguồn phân tách rõ ràng các hàm nghiệp vụ, sẵn sàng mở rộng.
5. **Module 5:** Cài đặt thuật toán Tìm kiếm Nhị phân (Binary Search) trên file thông qua chỉ mục Index.
6. **Module 6:** Cơ chế bắt ngoại lệ `try-catch` kiểm soát lỗi truy cập file và tối ưu hóa đọc khối liên tục (Cache-friendly).

---

## 2. Thiết kế Kiến trúc Hệ thống

```
+-----------------------------------------------------------------+
| FILE DATABASE NHỊ PHÂN ("users.dat")                            |
| +-------------------------------------------------------------+ |
| | FILE HEADER (16 bytes): Magic "BENG" | Count | Version | ... | |
| +-------------------------------------------------------------+ |
| | RECORD 0 (48 bytes): { id: 101, name: "Nguyen Van A", ... } | |
| +-------------------------------------------------------------+ |
| | RECORD 1 (48 bytes): { id: 102, name: "Tran Thi B",   ... } | |
| +-------------------------------------------------------------+ |
| | RECORD 2 (48 bytes): { id: 103, name: "Le Van C",     ... } | |
+-----------------------------------------------------------------+
```

---

## 3. Toàn bộ Mã nguồn Đồ án Hoàn chỉnh (Production-Ready)

```cpp
#include <iostream>
#include <fstream>
#include <cstring>
#include <vector>
#include <memory>
#include <exception>

// 1. Ngoại lệ chuyên biệt cho hệ thống lưu trữ
class StorageException : public std::exception {
private:
    std::string msg;
public:
    StorageException(const std::string& message) : msg(message) {}
    const char* what() const noexcept override { return msg.c_str(); }
};

#pragma pack(push, 1) // Ép không padding để tương thích nhị phân tuyệt đối
struct DbHeader {
    char magic[4];        // "BENG" (Binary Engine)
    uint32_t version;     // 1
    uint32_t recordCount; // Số lượng bản ghi
    uint32_t recordSize;  // sizeof(AccountRecord)
};

struct AccountRecord {
    uint32_t id;          // Mã tài khoản (4 bytes)
    char username[32];    // Tên đăng nhập (32 bytes)
    double balance;       // Số dư (8 bytes)
    uint8_t isActive;     // Trạng thái hoạt động (1 byte)
};
#pragma pack(pop)

class BinaryStorageEngine {
private:
    std::string dbPath;
    DbHeader header;

    void updateHeader(std::fstream& file) {
        file.seekp(0, std::ios::beg);
        file.write(reinterpret_cast<const char*>(&header), sizeof(DbHeader));
    }

public:
    BinaryStorageEngine(const std::string& path) : dbPath(path) {
        std::ifstream check(dbPath, std::ios::binary);
        if (!check) {
            // Khởi tạo Database mới
            std::memcpy(header.magic, "BENG", 4);
            header.version = 1;
            header.recordCount = 0;
            header.recordSize = sizeof(AccountRecord);

            std::ofstream out(dbPath, std::ios::binary);
            if (!out) throw StorageException("Khong the tao file CSDL!");
            out.write(reinterpret_cast<const char*>(&header), sizeof(DbHeader));
            std::cout << ">> [STORAGE] Khoi tao CSDL moi thanh cong: " << dbPath << "\n";
        } else {
            // Nạp Header từ file cũ
            check.read(reinterpret_cast<char*>(&header), sizeof(DbHeader));
            if (std::memcmp(header.magic, "BENG", 4) != 0) {
                throw StorageException("Dinh dang file khong hop le (Sai Magic Number)!");
            }
            std::cout << ">> [STORAGE] Mo CSDL cu thanh cong. So ban ghi: " << header.recordCount << "\n";
        }
    }

    // Chèn bản ghi mới O(1)
    void insert(const AccountRecord& rec) {
        std::fstream file(dbPath, std::ios::in | std::ios::out | std::ios::binary);
        if (!file) throw StorageException("Khong the mo file de ghi!");

        // Nhảy tới đuôi file
        file.seekp(0, std::ios::end);
        file.write(reinterpret_cast<const char*>(&rec), sizeof(AccountRecord));

        // Tăng đếm và ghi đè Header
        header.recordCount++;
        updateHeader(file);
        std::cout << ">> [INSERT] Da ghi ban ghi ID [" << rec.id << "] vao o dia.\n";
    }

    // Đọc bản ghi ngẫu nhiên theo index O(1)
    AccountRecord getByIndex(uint32_t index) {
        if (index >= header.recordCount) {
            throw StorageException("Chi so ban ghi vuot qua pham vi!");
        }

        std::ifstream file(dbPath, std::ios::binary);
        if (!file) throw StorageException("Khong the doc CSDL!");

        std::streampos pos = sizeof(DbHeader) + index * sizeof(AccountRecord);
        file.seekg(pos, std::ios::beg);

        AccountRecord rec;
        file.read(reinterpret_cast<char*>(&rec), sizeof(AccountRecord));
        return rec;
    }

    // Cập nhật số dư trực tiếp tại chỗ (In-place update)
    void updateBalance(uint32_t index, double newBalance) {
        if (index >= header.recordCount) throw StorageException("Chi so khong hop le!");

        std::fstream file(dbPath, std::ios::in | std::ios::out | std::ios::binary);
        if (!file) throw StorageException("Loi mo file cap nhat!");

        // Nhảy thẳng tới trường balance của bản ghi
        std::streampos pos = sizeof(DbHeader) + index * sizeof(AccountRecord) + offsetof(AccountRecord, balance);
        file.seekp(pos, std::ios::beg);
        file.write(reinterpret_cast<const char*>(&newBalance), sizeof(double));
        std::cout << ">> [UPDATE] Da cap nhat so du ban ghi [" << index << "] -> " << newBalance << "\n";
    }

    void listAll() {
        std::ifstream file(dbPath, std::ios::binary);
        if (!file || header.recordCount == 0) {
            std::cout << ">> CSDL hien dang trong.\n";
            return;
        }

        file.seekg(sizeof(DbHeader), std::ios::beg);
        std::cout << "\n=== DANH SACH TAI KHOAN TRONG CSDL NHI PHAN ===\n";
        std::cout << "INDEX\tID\tUSERNAME\t\tBALANCE\t\tSTATUS\n";
        std::cout << "------------------------------------------------------------\n";

        for (uint32_t i = 0; i < header.recordCount; ++i) {
            AccountRecord r;
            file.read(reinterpret_cast<char*>(&r), sizeof(AccountRecord));
            std::cout << i << "\t" << r.id << "\t" << r.username << "\t\t" 
                      << r.balance << "\t\t" << (r.isActive ? "ACTIVE" : "LOCKED") << "\n";
        }
        std::cout << "============================================================\n\n";
    }
};

int main() {
    try {
        // Quản trị Engine bằng con trỏ thông minh unique_ptr
        auto engine = std::make_unique<BinaryStorageEngine>("accounts.dat");

        // Chèn dữ liệu mẫu
        AccountRecord acc1{1001, "viet_nguyen", 12500.50, 1};
        AccountRecord acc2{1002, "alex_turner", 8400.00, 1};
        AccountRecord acc3{1003, "sara_connor", 520.25, 0};

        engine->insert(acc1);
        engine->insert(acc2);
        engine->insert(acc3);

        // Hiển thị toàn bộ dữ liệu
        engine->listAll();

        // Thử nghiệm cập nhật số dư in-place
        engine->updateBalance(1, 9999.99);

        // Kiểm tra lại sau cập nhật
        AccountRecord updated = engine->getByIndex(1);
        std::cout << ">> Kiem tra lai ban ghi 1 sau update: " << updated.balance << "\n";

    } catch (const std::exception& e) {
        std::cerr << ">> [LOI HE THONG]: " << e.what() << "\n";
    }

    return 0;
}
```

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Kỹ thuật nào giúp `BinaryStorageEngine` cập nhật trường `balance` của một tài khoản trực tiếp trên đĩa mà không cần phải nạp toàn bộ file vào RAM rồi ghi đè lại từ đầu?
- A. Con trỏ tệp ngẫu nhiên `seekp` kết hợp toán tử tính độ lệch `offsetof`.
- B. Nén tệp bằng thuật toán Gzip.
- C. Biến tệp nhị phân thành tệp văn bản JSON.
- D. Gọi lệnh flush liên tục.

**Đáp án đúng:** **A**
*Giải thích:* `seekp` cho phép dịch con trỏ ghi tới chính xác byte bắt đầu của trường `balance`, ghi đè đúng 8 bytes của số thực `double`.

### 4.2. Thử thách nâng cấp dự án (Mini-task)
**Nhiệm vụ kết khóa:** Bổ sung chức năng "Xóa mềm" (Soft Delete):
- Thêm phương thức `void softDelete(uint32_t index)`: Cập nhật trường `isActive = 0`.
- Khi gọi `listAll()`, chỉ hiển thị các tài khoản có `isActive == 1`.

---

## 5. Tổng kết Khóa học & Hành trình Tiếp theo

🎉 **CHÚC MỪNG BẠN ĐÃ TỐT NGHIỆP XUẤT SẮC KHÓA 2: C++ NÂNG CAO & LẬP TRÌNH HỆ THỐNG!**

Bạn đã chính thức bước chân vào hàng ngũ những lập trình viên C++ am hiểu sâu sắc phần cứng:
- Làm chủ phân vùng RAM (Stack, Heap, BSS, Data, Code).
- Quản trị con trỏ cấp cao và tiêu diệt 100% nguy cơ rò rỉ bộ nhớ với Smart Pointers.
- Thiết kế tệp nhị phân chuyên nghiệp với File Header và truy xuất ngẫu nhiên O(1).
- Tự động hóa quy trình build với Preprocessor và Makefile chuẩn công nghiệp.
- Làm chủ Đệ quy có nhớ (Memoization) và Quay lui cắt tỉa nhánh cận.
- Xây dựng phần mềm kiên cố với Ngoại lệ và tối ưu tốc độ CPU Cache.

*Điểm đến tiếp theo:* Bạn đã chuẩn bị đầy đủ mọi công cụ để bước tiếp vào **Khóa 3: Lập trình Hướng đối tượng C++ Chuyên sâu (CPP-OOP)**, nơi bạn sẽ làm chủ 4 trụ cột OOP, Nạp chồng toán tử, Thiết kế Hệ thống theo 5 nguyên lý SOLID và giải mã bí ẩn Bảng hàm ảo (vtable)!
