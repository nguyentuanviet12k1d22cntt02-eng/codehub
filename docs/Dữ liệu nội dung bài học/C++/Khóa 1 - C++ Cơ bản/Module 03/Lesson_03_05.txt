---
lessonId: "CPP-03.05"
title: "Vòng lặp Lồng nhau (Nested Loops) và Tư duy Không gian 2D"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["nested loops", "matrix", "grid", "2d coordinates", "rows and columns"]
prerequisites: ["CPP-03.01", "CPP-03.04"]
---

# Vòng lặp Lồng nhau (Nested Loops) và Tư duy Không gian 2D

## 1. Khái niệm cốt lõi

Khi một vòng lặp nằm bên trong thân của một vòng lặp khác, ta gọi đó là **Vòng lặp lồng nhau (Nested Loops)**.

Đây là nền tảng cốt lõi để chuyển từ tư duy xử lý đường thẳng (1 chiều) sang **không gian lưới hai chiều (Hàng và Cột)**: bảng cửu chương, ma trận điểm ảnh, bản đồ game tọa độ (x, y).

| Thành phần | Vai trò trong không gian 2D | Quy ước chỉ số |
| :--- | :--- | :---: |
| **Vòng lặp ngoài (`Outer loop`)** | Quản lý từng **Hàng (Row)** từ trên xuống dưới | Biến `i` (chạy từ hàng 0 đến hàng R-1) |
| **Vòng lặp trong (`Inner loop`)** | Quản lý từng **Cột (Col)** trên hàng đó | Biến `j` (chạy từ cột 0 đến cột C-1) |

## 2. Cú pháp & Quy tắc hoạt động

### Cơ chế quét lưới (Scanline):
Vòng lặp ngoài bước 1 bước, vòng lặp trong phải chạy **trọn vẹn toàn bộ các bước** của nó:

```text
Hàng i = 1:  Cột j chạy từ 1 ──► 2 ──► 3  (Xong hàng 1)
Hàng i = 2:  Cột j chạy từ 1 ──► 2 ──► 3  (Xong hàng 2)
Hàng i = 3:  Cột j chạy từ 1 ──► 2 ──► 3  (Xong hàng 3)
```

Tổng số lần thực thi các câu lệnh bên trong = `Số lần lặp ngoài × Số lần lặp trong`.

## 3. Ví dụ minh họa tinh gọn

In ra một hình chữ nhật đặc gồm 3 hàng, mỗi hàng có 4 dấu sao `*`:

```cpp
for (int i = 1; i <= 3; ++i) {        // Lặp qua 3 hàng
    for (int j = 1; j <= 4; ++j) {    // Mỗi hàng in 4 dấu sao
        std::cout << "* ";
    }
    std::cout << '
';                // Hết mỗi hàng bắt buộc phải xuống dòng
}

// Kết quả in ra màn hình:
// * * * *
// * * * *
// * * * *
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên câu lệnh xuống dòng `'
'` ở cuối vòng lặp ngoài**
> * *Hậu quả:* Tất cả các phần tử của mọi hàng sẽ bị dính liền trên cùng một dòng ngang, làm mất cấu trúc dạng lưới 2D.
> * *Cách phòng tránh:* Sau khi vòng lặp trong `j` kết thúc, luôn thêm lệnh `std::cout << '
';`.

> [!WARNING]
> **2. Dùng chung tên biến đếm cho cả hai vòng lặp**
> * *Lỗi:* Viết `for (int i = 0; ...) { for (int i = 0; ...) }`.
> * *Hậu quả:* Vòng lặp trong ghi đè biến `i` của vòng lặp ngoài, gây lỗi biên dịch hoặc vòng lặp chạy sai hoàn toàn. Hãy luôn dùng `i` cho vòng ngoài và `j` cho vòng trong.

## 5. Ghi nhớ trọng tâm

- Vòng lặp lồng nhau là công cụ xử lý không gian lưới 2 chiều (Hàng và Cột).
- Vòng lặp ngoài quản lý chỉ số hàng `i`, vòng lặp trong quản lý chỉ số cột `j`.
- Luôn nhớ lệnh xuống dòng `'
'` ngay sau khi vòng lặp trong hoàn thành một hàng.
