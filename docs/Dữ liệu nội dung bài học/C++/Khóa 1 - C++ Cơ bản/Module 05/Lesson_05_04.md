---
lessonId: "CPP-05.04"
title: "std::vector trong Modern C++ - Mảng Động chuẩn công nghiệp và Range-based for"
difficulty: "MEDIUM"
estimatedDuration: 30
keywords: ["vector", "std::vector", "dynamic array", "range-based for", "push_back", "stl"]
prerequisites: ["CPP-05.03"]
---

## 1. Khái niệm & Vấn đề

Mặc dù Mảng tĩnh (`int a[100]`) rất nhanh, nhưng nó có 2 nhược điểm chí mạng khiến các kỹ sư phần mềm chuyên nghiệp hầu như không bao giờ sử dụng trong các ứng dụng thực tế:
1. **Kích thước cố định (Fixed Size):** Bạn phải đoán trước kích thước lúc viết code. Nếu khai báo quá nhỏ ➔ Thiếu bộ nhớ làm crash chương trình. Nếu khai báo quá lớn ➔ Lãng phí RAM nghiêm trọng.
2. **Không thể co giãn linh hoạt:** Bạn không thể thêm phần tử vào đuôi hay xóa bớt phần tử khi không cần thiết.

Để giải quyết triệt để vấn đề này, thư viện chuẩn C++ (STL) cung cấp **`std::vector`** — **Mảng Động (Dynamic Array) chuẩn công nghiệp**.

`std::vector` tự động quản lý bộ nhớ, tự động tăng kích thước khi đầy, tự động giải phóng RAM khi không dùng và cung cấp hàng loạt hàm tiện ích cực mạnh.

| Tiêu chí so sánh | Mảng tĩnh (`int arr[N]`) | Mảng động `std::vector<int>` |
| :--- | :--- | :--- |
| **Khai báo kích thước** | Bắt buộc cố định từ lúc biên dịch. | Hoàn toàn linh hoạt; khởi tạo rỗng và phình to khi cần. |
| **Thêm phần tử** | Không thể. | Cực dễ với phương thức `vec.push_back(x)`. |
| **Biết số lượng phần tử** | Phải tự duy trì một biến `int n` đếm rời. | Gọi ngay hàm `vec.size()`. |
| **Bộ nhớ lưu trữ** | Vùng nhớ Stack (giới hạn ~1MB). | Vùng nhớ Heap (thoải mái hàng Gigabytes). |
| **Duyệt mảng** | Vòng for truyền thống theo chỉ số. | Hỗ trợ cú pháp hiện đại **Range-based for loop**. |

---

## 2. Cú pháp & Vận hành

### 2.1. Khởi tạo và Các phương thức Cốt lõi của `std::vector`
Để sử dụng vector, bạn cần thêm thư viện `#include <vector>`:

```cpp
#include <iostream>
#include <vector>

int main() {
    // 1. Khởi tạo một vector rỗng chứa các số nguyên
    std::vector<int> numbers;

    // 2. Thêm phần tử vào cuối vector (O(1) amortized)
    numbers.push_back(10);
    numbers.push_back(25);
    numbers.push_back(40);

    std::cout << "Kich thuoc vector: " << numbers.size() << '\n'; // 3

    // 3. Truy xuất phần tử theo chỉ số (giống hệt mảng tĩnh)
    std::cout << "Phan tu dau: " << numbers[0] << '\n'; // 10
    std::cout << "Phan tu cuoi: " << numbers.back() << '\n'; // 40

    // 4. Xóa phần tử cuối cùng
    numbers.pop_back(); // Xóa số 40

    // 5. Duyệt vector bằng cú pháp Modern C++: Range-based for loop
    std::cout << "Cac phan tu con lai: ";
    for (const auto& val : numbers) {
        std::cout << val << ' ';
    }
    std::cout << '\n'; // 10 25

    return 0;
}
```

### 2.2. Cơ chế Tự Động Co Giãn: `size` vs `capacity`
Bên trong `std::vector` có 2 khái niệm quan trọng:
* **`size()`**: Số lượng phần tử thực tế đang có trong vector.
* **`capacity()`**: Sức chứa tối đa của vùng nhớ RAM mà vector đã xin cấp phát trước.

Khi bạn `push_back()` làm cho `size == capacity`, vector sẽ tự động thực hiện 3 bước:
1. Cấp phát một vùng nhớ mới trên Heap có kích thước **gấp đôi dung lượng cũ**.
2. Sao chép toàn bộ phần tử cũ sang vùng nhớ mới.
3. Giải phóng vùng nhớ cũ.

```text
[Ban đầu (Capacity = 2)]: [ 10 | 20 ]  (Đầy!)
         │
         ▼ push_back(30) -> Tự động nhân đôi Capacity lên 4!
[Mới (Capacity = 4)]:     [ 10 | 20 | 30 | (trống) ]
```

### 2.3. Cú pháp Duyệt Range-based for loop đỉnh cao
Thay vì viết vòng for chỉ số rườm rà, Modern C++ khuyến nghị sử dụng:
* `for (auto x : vec)`: Nếu muốn sao chép giá trị (với kiểu số nguyên nhỏ).
* `for (const auto& x : vec)`: **Chuẩn mực tốt nhất** — Tham chiếu hằng, không sao chép và an toàn tuyệt đối.
* `for (auto& x : vec)`: Khi muốn thay đổi trực tiếp giá trị các phần tử trong vector.

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các sai lầm nguy hiểm khi dùng vector:**
> 1. **Gán chỉ số khi vector đang rỗng:**
>    ```cpp
>    std::vector<int> v; // size = 0
>    v[0] = 10; // SẬP CHƯƠNG TRÌNH: Vector chưa có phần tử nào!
>    ```
>    *Cách sửa đúng:* Dùng `v.push_back(10);` hoặc khởi tạo kích thước trước: `std::vector<int> v(5, 0);`.
> 2. **Truyền vector vào hàm bằng Tham trị (Pass-by-value):**
>    Viết `void xuLy(std::vector<int> v)` sẽ khiến toàn bộ hàng ngàn phần tử bị sao chép vào ô nhớ mới, làm chậm chương trình gấp hàng trăm lần! **Luôn truyền bằng `const std::vector<int>& v`**.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Phương thức nào sau đây của `std::vector` được dùng để bổ sung một phần tử mới vào vị trí cuối cùng của mảng động?
* [ ] A) `vec.append()`
* [ ] B) `vec.insert_end()`
* [x] C) `vec.push_back()`
* [ ] D) `vec.add()`

---

### Thử thách sửa lỗi (Debug)
Đoạn code sau muốn nhập 5 số vào vector nhưng bị lỗi sập chương trình khi chạy. Hãy phát hiện nguyên nhân:

```cpp
// Code lỗi:
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    for (int i = 0; i < 5; ++i) {
        std::cin >> v[i]; // LỖI SẬP CHƯƠNG TRÌNH!
    }
    return 0;
}
```

**Sửa lại:** Vì vector `v` ban đầu có `size = 0`, không thể truy cập `v[i]`. Cách sửa:
```cpp
for (int i = 0; i < 5; ++i) {
    int x;
    std::cin >> x;
    v.push_back(x);
}
```

---

### Bài tập lập trình (Mini-task)
**Đề bài:** Viết chương trình nhận vào số nguyên dương n từ bàn phím và n số nguyên tiếp theo vào một `std::vector<int>`. Hãy:
1. Lọc và chỉ giữ lại các số là **số lẻ**.
2. In ra số lượng các số lẻ trên dòng 1.
3. In ra danh sách các số lẻ đó trên dòng 2, cách nhau bởi một dấu cách.

**Ví dụ:**
* Đầu vào:
  ```text
  6
  4 7 2 9 11 8
  ```
* Đầu ra:
  ```text
  3
  7 9 11
  ```

**Mã nguồn chuẩn C++17:**
```cpp
#include <iostream>
#include <vector>

int main() {
    int n = 0;
    if (std::cin >> n && n > 0) {
        std::vector<int> soLe;

        for (int i = 0; i < n; ++i) {
            int val = 0;
            std::cin >> val;
            if (val % 2 != 0) {
                soLe.push_back(val);
            }
        }

        std::cout << soLe.size() << '\n';
        for (const auto& x : soLe) {
            std::cout << x << ' ';
        }
        std::cout << '\n';
    }
    return 0;
}
```

---

## 5. Đúc kết & Đi tiếp

* **`std::vector`** là sự thay thế hoàn hảo cho mảng tĩnh trong Modern C++, cung cấp khả năng co giãn kích thước động an toàn.
* Sử dụng `push_back()` để nạp phần tử, `size()` để truy vấn số lượng phần tử và `pop_back()` để xóa phần tử cuối.
* Kết hợp với **Range-based for loop (`const auto& x : vec`)** để tạo ra các dòng mã nguồn tinh gọn, hiện đại và đạt hiệu năng tối đa.

🎉 **Chúc mừng bạn đã hoàn thành trọn vẹn Module 5: Mảng 1 Chiều & std::vector!**
Trong **Module 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản**, chúng ta sẽ làm chủ việc xử lý ngôn ngữ tự nhiên, kỹ thuật hóa giải hiện tượng "trôi lệnh" kinh điển và các phương thức xử lý văn bản chuyên nghiệp.
