---
lessonId: CPP2-02.04
title: "Con trỏ Thông minh Modern C++ (Smart Pointers) và Nguyên lý RAII"
difficulty: "Nâng cao"
estimatedDuration: "85 phút"
keywords: ["smart pointers", "std::unique_ptr", "std::shared_ptr", "std::weak_ptr", "RAII", "reference counting", "make_unique", "make_shared"]
prerequisites: ["CPP2-02.03"]
---

# Con trỏ Thông minh Modern C++ (Smart Pointers) và Nguyên lý RAII

## 1. Khái niệm & Vấn đề

Trong C++ cổ điển, việc phải tự tay ghi nhớ từng lệnh `delete` ở tất cả các nhánh thoát của hàm (if, return, throw exception) giống như việc bước đi trên một bãi mìn. Chỉ cần một nhánh ngoại lệ bị ném ra trước dòng `delete`, vùng nhớ đó sẽ bị rò rỉ vĩnh viễn.

Modern C++ (từ C++11 trở lên) mang đến một cuộc cách mạng mang tên **Nguyên lý RAII (Resource Acquisition Is Initialization - Thu nạp Tài nguyên là Khởi tạo)**:
- Tài nguyên (Bộ nhớ Heap, File, Socket) được gói gọn bên trong một đối tượng trên Stack.
- Khi đối tượng được sinh ra: Tự động cấp phát tài nguyên trong Constructor.
- **Khi đối tượng đi ra khỏi phạm vi (Scope): Destructor của đối tượng trên Stack CHẮC CHẮN được gọi tự động bởi CPU, và Destructor sẽ tự động `delete` bộ nhớ Heap giúp bạn!**

Bộ ba **Con trỏ Thông minh (Smart Pointers)** nằm trong thư viện `<memory>` hiện thực hóa hoàn hảo nguyên lý này:
1. **`std::unique_ptr`:** Sở hữu độc quyền (Exclusive Ownership). Không thể sao chép, chỉ có thể di chuyển (Move). Siêu nhẹ và có chi phí phụ trội bằng 0 (Zero-cost abstraction).
2. **`std::shared_ptr`:** Sở hữu chung (Shared Ownership). Sử dụng bộ đếm tham chiếu (Reference Counter). Chỉ giải phóng bộ nhớ khi người sở hữu cuối cùng biến mất.
3. **`std::weak_ptr`:** Con trỏ yếu (Weak Reference). Quan sát nhưng không sở hữu, dùng để phá vỡ vòng lặp tham chiếu tròn (Circular Dependency).

---

## 2. Cú pháp & Vận hành

### 1. Làm chủ `std::unique_ptr` với `std::make_unique` (C++14)

```cpp
#include <iostream>
#include <memory> // Bắt buộc phải include thư viện memory

class DatabaseConnection {
public:
    DatabaseConnection() { std::cout << ">> [OPEN] Ket noi Database thanh cong!\n"; }
    ~DatabaseConnection() { std::cout << ">> [CLOSE] Tu dong ngat ket noi va giai phong RAM!\n"; }
    void query(const std::string& sql) { std::cout << "   Thuc thi SQL: " << sql << "\n"; }
};

void processData() {
    // Khởi tạo con trỏ thông minh unique_ptr
    // Khuyên dùng std::make_unique thay vì new
    std::unique_ptr<DatabaseConnection> db = std::make_unique<DatabaseConnection>();

    db->query("SELECT * FROM Users");

    // Khi hàm processData kết thúc, biến db trên Stack tự động biến mất
    // Destructor được gọi ngay lập tức mà KHÔNG CẦN BẤT KỲ LỆNH DELETE NÀO!
}

int main() {
    std::cout << "Bat dau goi ham processData:\n";
    processData();
    std::cout << "Ket thuc goi ham processData!\n";
    return 0;
}
```

### 2. Sở hữu chia sẻ với `std::shared_ptr` và Cơ chế Đếm Tham chiếu

```cpp
#include <iostream>
#include <memory>

int main() {
    // Tạo shared_ptr đầu tiên: Reference count = 1
    std::shared_ptr<int> p1 = std::make_shared<int>(42);
    std::cout << "p1 khoi tao, use_count: " << p1.use_count() << "\n"; // 1

    {
        // Chia sẻ quyền sở hữu sang p2: Reference count tăng lên 2
        std::shared_ptr<int> p2 = p1;
        std::cout << "Trong scope con, use_count: " << p1.use_count() << "\n"; // 2
        std::cout << "p2 tro toi gia tri: " << *p2 << "\n";
    } // p2 ra khỏi scope và biến mất -> Reference count giảm về 1

    std::cout << "Ngoai scope con, use_count: " << p1.use_count() << "\n"; // 1

    // Khi main() kết thúc, p1 biến mất -> count = 0 -> Bộ nhớ tự động delete!
    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Cố tình sao chép `std::unique_ptr`
> `std::unique_ptr` được thiết kế để sở hữu độc quyền.
> Lệnh `std::unique_ptr<int> p2 = p1;` sẽ gây **Lỗi Biên Dịch (Compile Error)** vì Copy Constructor của nó đã bị xóa (`= delete`).
> Nếu muốn chuyển giao quyền sở hữu cho người khác, bạn phải dùng ngữ nghĩa di chuyển (Move Semantics):
> ```cpp
> std::unique_ptr<int> p2 = std::move(p1); // p1 tro thanh nullptr, p2 so huu tai nguyen
> ```

> [!WARNING]
> ### 2. Vòng tròn Tham chiếu (Circular Reference) với `std::shared_ptr`
> Nếu Đối tượng A giữ `shared_ptr` trỏ tới B, và B lại giữ `shared_ptr` trỏ ngược lại A:
> Reference count của cả 2 không bao giờ giảm về 0, dẫn đến rò rỉ bộ nhớ vĩnh viễn!
> **Khắc phục:** Một trong 2 chiều bắt buộc phải sử dụng `std::weak_ptr`.

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Câu lệnh nào sau đây là chuẩn mực và an toàn nhất để khởi tạo một `std::unique_ptr` quản lý một số nguyên giá trị 100 trong C++14/17?
- A. `std::unique_ptr<int> p = new int(100);`
- B. `std::unique_ptr<int> p = std::make_unique<int>(100);`
- C. `auto p = std::make_shared<int>(100);`
- D. `std::unique_ptr<int> p(malloc(sizeof(int)));`

**Đáp án đúng:** **B**
*Giải thích:* `std::make_unique` là hàm chuẩn mực, an toàn ngoại lệ và tối ưu nhất của C++14 để tạo `std::unique_ptr`.

### 4.2. Thử thách sửa lỗi (Debug)
Đoạn code sau đây cố gắng gán trực tiếp con trỏ thô vào `std::unique_ptr` nhưng bị báo lỗi:

```cpp
// ❌ ĐOẠN CODE LỖI
#include <memory>

int main() {
    std::unique_ptr<int> p = new int(50); // Lỗi biên dịch: Conversion from int* to unique_ptr!
}
```
**Nguyên nhân:** Constructor nhận con trỏ thô của `unique_ptr` được đánh dấu là `explicit`, ngăn chặn việc gán ngầm định.
**Sửa lại chuẩn:**
```cpp
// ✅ ĐOẠN CODE CHUẨN
#include <memory>

int main() {
    // Cách 1: Khởi tạo trực tiếp tường minh
    std::unique_ptr<int> p1(new int(50));
    // Cách 2 (Khuyên dùng): Dùng make_unique
    auto p2 = std::make_unique<int>(50);
}
```

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Tạo một lớp `Sensor` có thuộc tính `sensorId` (`int`). Sử dụng `std::vector<std::unique_ptr<Sensor>>` để quản lý danh sách các cảm biến. Viết hàm thêm cảm biến mới vào vector và chứng minh khi vector bị xóa (`clear()`), toàn bộ các đối tượng Sensor tự động được gọi Destructor giải phóng.

**Code giải mẫu:**
```cpp
#include <iostream>
#include <vector>
#include <memory>

class Sensor {
private:
    int id;
public:
    Sensor(int sensorId) : id(sensorId) {
        std::cout << "Sensor [" << id << "] da duoc bat.\n";
    }
    ~Sensor() {
        std::cout << "Sensor [" << id << "] da duoc tat va huy an toan!\n";
    }
    void readData() const {
        std::cout << "Sensor [" << id << "] dang doc tin hieu...\n";
    }
};

int main() {
    std::vector<std::unique_ptr<Sensor>> sensorList;

    sensorList.push_back(std::make_unique<Sensor>(101));
    sensorList.push_back(std::make_unique<Sensor>(102));

    for (const auto& s : sensorList) {
        s->readData();
    }

    std::cout << "Goi sensorList.clear()...\n";
    sensorList.clear(); // Tự động kích hoạt Destructor giải phóng cả 2 Sensor!

    std::cout << "Chuong trinh ket thuc.\n";
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

- **Nguyên lý RAII** là hòn đá tảng của Modern C++: Tự động hóa quản lý tài nguyên bằng vòng đời của biến trên Stack.
- Mặc định hãy luôn dùng **`std::unique_ptr`** (nhẹ, nhanh, không tốn thêm byte phụ trội).
- Chỉ dùng **`std::shared_ptr`** khi thực sự cần chia sẻ quyền sở hữu tài nguyên cho nhiều thực thể độc lập.

*Bài học tiếp theo:* Chúng ta sẽ bước sang **Module 3: Tệp tin Nhị phân (Binary File I/O) và Cơ sở Dữ liệu Bản ghi**, học cách lưu trữ và truy xuất ngẫu nhiên dữ liệu thô với tốc độ siêu thanh.
