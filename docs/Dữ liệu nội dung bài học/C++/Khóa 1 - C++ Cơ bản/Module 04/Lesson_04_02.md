---
lessonId: "CPP-04.02"
title: "Truyền Tham trị (Pass-by-Value) và Truyền Tham chiếu (Pass-by-Reference)"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["pass by value", "pass by reference", "reference variable", "swap"]
prerequisites: ["CPP-04.01"]
---

# Truyền Tham trị (Pass-by-Value) và Truyền Tham chiếu (Pass-by-Reference)

## 1. Khái niệm cốt lõi

Khi ta truyền một biến vào hàm, máy tính sẽ xử lý biến đó như thế nào? C++ cung cấp hai cơ chế truyền tham số quan trọng:

* **Truyền tham trị (Pass-by-Value):** Hàm tạo ra một **bản sao (copy) độc lập** của giá trị truyền vào. Mọi thay đổi bên trong hàm chỉ tác động lên bản sao, biến gốc bên ngoài giữ nguyên 100%.
* **Truyền tham chiếu (Pass-by-Reference):** Hàm nhận vào **chính là ô nhớ gốc** của biến (dùng dấu `&`). Mọi thay đổi bên trong hàm sẽ làm thay đổi trực tiếp biến gốc bên ngoài.

| Tiêu chí | Truyền Tham trị (`Type x`) | Truyền Tham chiếu (`Type& x`) |
| :--- | :--- | :--- |
| **Cú pháp** | Không có dấu `&` | Có dấu `&` sau kiểu dữ liệu |
| **Cơ chế bộ nhớ** | Nhân bản ô nhớ mới để lưu bản sao | Dùng chung ô nhớ gốc (tạo bí danh cho biến) |
| **Biến gốc ngoài hàm** | **Không bao giờ bị thay đổi** | **Bị thay đổi trực tiếp** |
| **Ứng dụng tiêu biểu** | Dữ liệu chỉ dùng để tính toán | Cần hàm thay đổi giá trị biến (như hoán đổi `swap`) |

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa ô nhớ trong RAM:
```text
Giả sử có biến: int x = 10; (nằm tại ô nhớ số #100)

1. Tham trị: void tang(int a)
   RAM tạo thêm ô nhớ mới #200 tên "a", sao chép giá trị 10 sang.
   Tăng a++ ──► Ô #200 thành 11. Ô #100 (biến x gốc) VẪN LÀ 10!

2. Tham chiếu: void tang(int& a)
   Biến "a" chính là tên gọi khác của ô nhớ #100.
   Tăng a++ ──► Ô #100 lập tức thành 11 (Biến x gốc bị thay đổi thành 11!).
```

## 3. Ví dụ minh họa tinh gọn

Hàm hoán đổi giá trị hai biến (`swap` kinh điển):

```cpp
// Truyền tham chiếu với dấu & để tác động trực tiếp vào biến gốc
void hoanDoi(int& a, int& b) {
    int tam = a;
    a = b;
    b = tam;
}

int x = 5, y = 10;
hoanDoi(x, y);
// Sau khi gọi hàm: x nhận giá trị 10, y nhận giá trị 5
```

Nếu bỏ dấu `&` (truyền tham trị), giá trị của `x` và `y` sau khi gọi hàm vẫn giữ nguyên là 5 và 10.

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên dấu `&` khi muốn hàm thay đổi giá trị biến bên ngoài**
> * *Lỗi:* Viết hàm nhập dữ liệu `void nhap(int n) { std::cin >> n; }`.
> * *Hậu quả:* Dữ liệu người dùng gõ vào chỉ được nạp vào bản sao, biến gốc bên ngoài hàm `main` vẫn mang giá trị rác!
> * *Cách sửa:* Bắt buộc thêm dấu `&`: `void nhap(int& n)`.

> [!WARNING]
> **2. Truyền hằng số trực tiếp vào hàm nhận tham chiếu thường**
> * *Lỗi:* Gọi `hoanDoi(5, 10);`.
> * *Hậu quả:* Báo lỗi biên dịch vì `5` và `10` là hằng số cố định, không phải biến có ô nhớ để thay đổi giá trị.

## 5. Ghi nhớ trọng tâm

- Truyền tham trị (`int x`): Tạo bản sao độc lập, bảo vệ biến gốc không bị sửa đổi ngoài ý muốn.
- Truyền tham chiếu (`int& x`): Dùng chung ô nhớ gốc, dùng khi muốn hàm thay đổi giá trị của biến.
- Cần thay đổi biến gốc thì luôn nhớ thêm ký tự `&` sau kiểu dữ liệu.
