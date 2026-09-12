---
lessonId: CPP2-05.02
title: "Kỹ thuật Quay lui (Backtracking): Sinh Chuỗi Nhị phân và Sinh Hoán vị"
difficulty: "Nâng cao"
estimatedDuration: "80 phút"
keywords: ["quay lui", "backtracking", "sinh nhị phân", "sinh hoán vị", "vét cạn", "không gian trạng thái", "DFS"]
prerequisites: ["CPP2-05.01"]
---

# Kỹ thuật Quay lui (Backtracking): Sinh Chuỗi Nhị phân và Sinh Hoán vị

## 1. Khái niệm & Vấn đề

Có những bài toán trong cuộc sống và khoa học máy tính mà không có bất kỳ công thức giải tích trực tiếp nào để tìm ra đáp án (như giải mê cung, xếp lịch thi, xếp hàng hóa lên xe tải, hay phá mật mã). Cách duy nhất là phải **thử tất cả các phương án có thể xảy ra (Vét cạn - Brute Force)**.

Nếu dùng vòng lặp `for` lồng nhau, bạn chỉ có thể giải quyết được bài toán có số lượng biến cố định (ví dụ 3 vòng `for` cho 3 biến). Nếu bài toán yêu cầu tìm cấu hình cho N biến (với N do người dùng nhập vào lúc chạy chương trình), vòng lặp sẽ hoàn toàn bất lực!

Đó là lúc **Thuật toán Quay lui (Backtracking)** lên ngôi:
- Bản chất là một quá trình duyệt theo chiều sâu (DFS) trên **Cây Không Gian Trạng Thái (State Space Tree)**.
- Xây dựng từng bước lời giải X = (x_1, x_2, ..., x_N).
- Khi đi vào một nhánh cụt hoặc đã tìm ra lời giải, thuật toán sẽ **Quay lui (Backtrack)**: Hủy bỏ lựa chọn vừa thử để lùi về bước trước và thử lựa chọn mới!

---

## 2. Cú pháp & Vận hành

### Mô hình Khung Thuật toán Quay lui Tổng quát

```text
Ham_Quay_Lui(buoc_k):
    Voi moi gia tri kha di 'v' cua phan tu thu k:
        1. Thu gan: x[k] = v;
        2. Neu k la buoc cuoi cung (k == N):
               In ket qua hoac ghi nhan loi giai;
           Nguoc lai:
               Goi Ham_Quay_Lui(buoc_k + 1); // De quy di tiep
        3. HOAN TAC (Backtrack): Tra lai trang thai ban dau neu can!
```

### 1. Bài toán 1: Liệt kê tất cả Chuỗi Nhị phân độ dài N

```cpp
#include <iostream>

const int MAX = 20;
int x[MAX];
int n;

void printSolution() {
    for (int i = 1; i <= n; ++i) {
        std::cout << x[i];
    }
    std::cout << "\n";
}

void generateBinary(int k) {
    // Biến k đại diện cho vị trí bit thứ k đang cần điền (0 hoặc 1)
    for (int val = 0; val <= 1; ++val) {
        x[k] = val; // Thử chọn giá trị
        if (k == n) {
            printSolution(); // Đã điền xong bit cuối cùng -> Xuất kết quả
        } else {
            generateBinary(k + 1); // Đệ quy điền bit kế tiếp
        }
        // Với nhị phân, giá trị vòng lặp sau sẽ tự ghi đè x[k] nên không cần lệnh hoàn tác
    }
}

int main() {
    n = 3;
    std::cout << "Tat ca chuoi nhi phan do dai " << n << ":\n";
    generateBinary(1);
    return 0;
}
```

### 2. Bài toán 2: Sinh mọi Hoán vị của tập hợp {1, 2, ..., N}

Trong bài toán hoán vị, mỗi con số chỉ được phép xuất hiện **đúng 1 lần**. Chúng ta cần một mảng đánh dấu `used[val]` để ghi nhận con số nào đã được dùng rồi:

```cpp
#include <iostream>

const int MAX = 20;
int x[MAX];
bool used[MAX]{false}; // Mảng đánh dấu
int n;

void printPermutation() {
    for (int i = 1; i <= n; ++i) {
        std::cout << x[i] << " ";
    }
    std::cout << "\n";
}

void generatePermutations(int k) {
    for (int val = 1; val <= n; ++val) {
        if (!used[val]) { // Chỉ chọn số chưa bị dùng
            x[k] = val;
            used[val] = true; // 1. Đánh dấu đã dùng

            if (k == n) {
                printPermutation();
            } else {
                generatePermutations(k + 1); // 2. Đệ quy nhánh kế tiếp
            }

            // 3. BƯỚC HOÀN TÁC QUAN TRỌNG NHẤT (BACKTRACK STEP):
            used[val] = false; // Bỏ đánh dấu để nhánh rẽ khác có thể sử dụng lại số này!
        }
    }
}

int main() {
    n = 3;
    std::cout << "Tat ca hoan vi cua tap 3 phan tu:\n";
    generatePermutations(1);
    return 0;
}
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> ### 1. Quên lệnh Hoàn tác trạng thái (Backtrack Step)
> Trong bài toán hoán vị ở trên, nếu bạn quên dòng lệnh `used[val] = false;`, một khi con số nào được đánh dấu là `true`, nó sẽ mãi mãi bị khóa. Kết quả là thuật toán chỉ in được duy nhất 1 cấu hình đầu tiên (`1 2 3`) rồi tắt ngúm vì không còn số nào hợp lệ cho các nhánh sau!

> [!TIP]
> ### 2. Thư viện STL sẵn có: `std::next_permutation`
> Trong các kỳ thi lập trình, nếu bài toán chỉ đơn thuần yêu cầu duyệt hoán vị, bạn có thể dùng hàm cực mạnh `std::next_permutation` trong `<algorithm>`:
> ```cpp
> std::vector<int> a = {1, 2, 3};
> do {
>     // Xuất cấu hình a...
> } while (std::next_permutation(a.begin(), a.end()));
> ```

---

## 4. Thực hành phân bậc

### 4.1. Trắc nghiệm nhanh (Warm-up)
**Câu hỏi:** Với tập hợp gồm N = 4 phần tử, thuật toán sinh hoán vị sẽ tạo ra tổng cộng bao nhiêu cấu hình hoán vị khác nhau?
- A. 8
- B. 16
- C. 24
- D. 64

**Đáp án đúng:** **C**
*Giải thích:* Số lượng hoán vị của N phần tử là N! (giai thừa). Với N = 4, 4! = 4 	imes 3 	imes 2 	imes 1 = 24 cấu hình.

### 4.2. Thử thách sửa lỗi (Debug)
Một học viên viết code sinh tất cả các tập con của tập N phần tử nhưng bị lặp vô tận:

```cpp
// ❌ ĐOẠN CODE LỖI
void trySubset(int k) {
    for (int i = 0; i <= 1; ++i) {
        x[k] = i;
        trySubset(k + 1); // Quên điều kiện dừng k == n!
    }
}
```
**Nguyên nhân:** Thiếu điều kiện dừng, biến `k` tăng vô tận dẫn đến tràn ngăn xếp Stack Overflow.
**Sửa lại chuẩn:**
Thêm khối lệnh kiểm tra `if (k == n)` trước khi đệ quy tiếp.

### 4.3. Bài tập lập trình (Mini-task)
**Đề bài:** Áp dụng thuật toán sinh chuỗi nhị phân, hãy in ra tất cả các tập hợp con của tập gồm 3 chữ cái `{'A', 'B', 'C'}` (với quy ước bit 1 là chọn chữ cái đó, bit 0 là không chọn).

---

## 5. Đúc kết & Đi tiếp

- **Thuật toán Quay lui** là chìa khóa vạn năng giải quyết mọi bài toán vét cạn cấu hình N biến.
- Ba nhịp điệu cốt lõi: **Chọn thử -> Đệ quy đi tiếp -> Hoàn tác trạng thái (Backtrack)**.
- Khi không gian tìm kiếm quá lớn, ta cần bổ sung kỹ thuật "Cắt tỉa nhánh cận" để loại bỏ sớm các nhánh vô nghiệm.

*Bài học tiếp theo:* Thử thách trí tuệ đỉnh cao: **Bài toán N Quân hậu (N-Queens) và Kỹ thuật Cắt tỉa Nhánh cận (Branch and Bound)**.
