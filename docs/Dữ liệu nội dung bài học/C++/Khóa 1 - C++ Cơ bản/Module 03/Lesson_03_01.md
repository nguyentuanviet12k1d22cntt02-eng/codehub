---
lessonId: "CPP-03.01"
title: "Vòng lặp for Cơ bản và Vòng đời Biến đếm"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["for loop", "loop variable", "iteration", "step"]
prerequisites: ["CPP-02.01"]
---

# Vòng lặp for Cơ bản và Vòng đời Biến đếm

## 1. Khái niệm cốt lõi

Khi bạn cần thực hiện một thao tác lặp đi lặp lại nhiều lần (ví dụ: in ra các số từ 1 đến 100, tính tổng dãy số), việc sao chép 100 dòng lệnh là không khả thi.

**Vòng lặp `for`** được thiết kế chuyên biệt cho các bài toán **biết trước số lần lặp**, giúp gom toàn bộ logic khởi tạo, kiểm tra điều kiện và bước nhảy vào một câu lệnh duy nhất.

| Thành phần | Vị trí | Ý nghĩa |
| :--- | :--- | :--- |
| **Khởi tạo (`init`)** | Đầu tiên | Khởi tạo biến đếm (chỉ chạy duy nhất 1 lần khi bắt đầu). |
| **Điều kiện (`condition`)** | Giữa | Kiểm tra trước mỗi lần lặp. Nếu `true` thì lặp tiếp, nếu `false` thì dừng. |
| **Bước nhảy (`update`)** | Cuối cùng | Cập nhật biến đếm sau mỗi lần thực hiện xong thân vòng lặp. |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp chuẩn:
```cpp
for (khởi_tạo; điều_kiện; bước_nhảy) {
    // Thân vòng lặp: các câu lệnh cần lặp lại
}
```

### Chu trình hoạt động 4 bước:
```text
[1. Khởi tạo: int i = 0] ──► [2. Kiểm tra: i < n ?]
                                     │
                     ┌───────────────┴───────────────┐
                     ▼ (Đúng)                        ▼ (Sai)
             [3. Chạy thân loop]              [DỪNG VÒNG LẶP]
                     │
                     ▼
             [4. Bước nhảy: ++i] ──► (Quay lại bước 2)
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: In các số từ 1 đến 5
```cpp
for (int i = 1; i <= 5; ++i) {
    std::cout << i << ' ';
}
// Kết quả in ra: 1 2 3 4 5
```

### Ví dụ 2: Lặp lùi từ 5 về 1
```cpp
for (int i = 5; i >= 1; --i) {
    std::cout << i << ' ';
}
// Kết quả in ra: 5 4 3 2 1
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Lỗi Lệch 1 (Off-By-One Error)**
> * *Lỗi:* Muốn lặp 5 lần nhưng viết `for (int i = 0; i <= 5; ++i)`.
> * *Nguyên nhân:* Biến `i` chạy từ 0, 1, 2, 3, 4, 5 (tổng cộng 6 lần lặp!).
> * *Quy tắc chuẩn:* Muốn lặp `n` lần tính từ 0: dùng `for (int i = 0; i < n; ++i)`.

> [!WARNING]
> **2. Vòng đời của biến đếm khai báo trong `for`**
> * *Nguyên nhân:* Biến `i` khai báo dạng `for (int i = 0; ...)` chỉ tồn tại bên trong phạm vi thân vòng lặp. Ra ngoài dấu `}` của `for`, biến `i` sẽ bị hủy và không thể truy cập được nữa.

## 5. Ghi nhớ trọng tâm

- `for` là lựa chọn hàng đầu khi đã biết trước số lần lặp.
- Thứ tự chạy: Khởi tạo ➔ Kiểm tra điều kiện ➔ Chạy thân lặp ➔ Cập nhật bước nhảy.
- Mẫu lặp chuẩn `n` lần trong C++: `for (int i = 0; i < n; ++i)`.
