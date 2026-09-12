---
lessonId: "CPP-02.04"
title: "Biểu thức Điều kiện 3 ngôi (Ternary Operator) và Kỹ thuật Early Return"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["ternary", "conditional operator", "early return", "clean code"]
prerequisites: ["CPP-02.01"]
---

# Biểu thức Điều kiện 3 ngôi (Ternary Operator) và Kỹ thuật Early Return

## 1. Khái niệm cốt lõi

* **Toán tử 3 ngôi (`? :`):** Là dạng rút gọn của cấu trúc `if-else` trên một dòng biểu thức duy nhất, thường dùng để gán giá trị hoặc in kết quả nhanh gọn.
* **Kỹ thuật Early Return:** Xử lý và kết thúc sớm các trường hợp không hợp lệ (hoặc trường hợp đặc biệt) ngay đầu hàm, giúp mã nguồn không bị thụt đầu dòng quá sâu (Arrow Anti-pattern).

| Kỹ thuật | Cú pháp rút gọn | Mục tiêu chính |
| :--- | :--- | :--- |
| **Toán tử 3 ngôi** | `điều_kiện ? giá_trị_đúng : giá_trị_sai` | Gán giá trị hoặc trả về kết quả tức thì chỉ trong 1 dòng. |
| **Early Return** | `if (điều_kiện_sai) return;` | Loại bỏ việc lồng ghép quá nhiều tầng `if-else` phức tạp. |

## 2. Cú pháp & Quy tắc hoạt động

### So sánh cách viết:
```cpp
// Cách 1: if-else truyền thống (4 dòng)
int maxVal;
if (a > b) maxVal = a;
else maxVal = b;

// Cách 2: Toán tử 3 ngôi (1 dòng duy nhất)
int maxVal = (a > b) ? a : b;
```

### Minh họa Kỹ thuật Early Return:
```text
Cách viết lồng nhau (Khó đọc):        Cách viết Early Return (Rõ ràng):
if (dữ liệu hợp lệ) {                if (!dữ liệu hợp lệ) return; // Thoát ngay!
    if (đủ quyền hạn) {               if (!đủ quyền hạn)   return; // Thoát ngay!
        // Xử lý chính...             
    }                                 // Toàn bộ logic chính nằm ở đây
}                                     // Không bị thụt lề nhiều tầng
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Toán tử 3 ngôi gán trạng thái
```cpp
int diem = 8;
std::string ketQua = (diem >= 5) ? "Qua mon" : "Thi lai";
// ketQua nhận giá trị: "Qua mon"
```

### Ví dụ 2: Early Return kiểm tra tính hợp lệ
```cpp
void chiaTien(int tongTien, int soNguoi) {
    if (soNguoi <= 0) {
        std::cout << "So nguoi khong hop le!
";
        return; // Dừng hàm ngay lập tức
    }

    std::cout << "Moi nguoi duoc: " << tongTien / soNguoi << '
';
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Lạm dụng lồng ghép nhiều toán tử 3 ngôi trên một dòng**
> * *Lỗi:* Viết `int x = a > b ? c > d ? 1 : 2 : 3;`.
> * *Hậu quả:* Code trở nên cực kỳ khó hiểu và dễ nhầm lẫn thứ tự ưu tiên.
> * *Quy tắc:* Chỉ dùng toán tử 3 ngôi cho các phép chọn lựa đơn giản nhị phân (2 trường hợp).

> [!WARNING]
> **2. Bất đồng kiểu dữ liệu ở hai vế `?` và `:`**
> * *Quy tắc:* Cả hai vế sau dấu `?` và sau dấu `:` bắt buộc phải có cùng kiểu dữ liệu (hoặc có thể tự ép kiểu sang nhau).

## 5. Ghi nhớ trọng tâm

- Cú pháp toán tử 3 ngôi: `(điều kiện) ? giá trị khi đúng : giá trị khi sai`.
- Dùng toán tử 3 ngôi giúp code ngắn gọn khi gán giá trị theo điều kiện đơn giản.
- Dùng `Early Return` để kiểm tra điều kiện lỗi và kết thúc sớm, giữ code luôn thẳng hàng và dễ theo dõi.
