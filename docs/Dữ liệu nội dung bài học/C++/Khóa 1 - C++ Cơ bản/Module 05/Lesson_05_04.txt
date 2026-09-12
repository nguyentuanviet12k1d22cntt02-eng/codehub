---
lessonId: "CPP-05.04"
title: "Kỹ thuật Chèn, Xóa và Dịch chuyển Phần tử trên Mảng"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["insert", "delete", "shift elements", "array manipulation"]
prerequisites: ["CPP-05.01"]
---

# Kỹ thuật Chèn, Xóa và Dịch chuyển Phần tử trên Mảng

## 1. Khái niệm cốt lõi

Vì các phần tử của mảng được xếp nằm sát cạnh nhau liên tiếp trong RAM:
* **Khi chèn thêm một phần tử:** Ta phải **dồn các phần tử phía sau sang phải** 1 ô để tạo chỗ trống.
* **Khi xóa bớt một phần tử:** Ta phải **kéo các phần tử phía sau sang trái** 1 ô để lấp kín khoảng trống vừa bị xóa.

| Thao tác | Hướng dịch chuyển | Chiều duyệt vòng lặp |
| :--- | :--- | :--- |
| **Chèn tại vị trí `pos`** | Dịch sang **Phải** | Duyệt **từ cuối mảng lùi về** `pos` (để không đè mất dữ liệu) |
| **Xóa tại vị trí `pos`** | Kéo sang **Trái** | Duyệt **từ `pos` tiến dần về cuối** |

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa thao tác Chèn:
```text
Mảng ban đầu: [ 10,  20,  30,  40 ] (n = 4 phần tử)
Muốn chèn giá trị 99 vào vị trí index 1:

Bước 1: Dời 40 sang phải, dời 30 sang phải, dời 20 sang phải
        [ 10,  (trống),  20,  30,  40 ]
Bước 2: Đặt 99 vào chỗ trống index 1
        [ 10,    99,     20,  30,  40 ] (n tăng lên 5)
```

### Minh họa thao tác Xóa:
```text
Mảng ban đầu: [ 10,  20,  30,  40 ] (n = 4 phần tử)
Muốn xóa phần tử tại vị trí index 1 (số 20):

Bước 1: Kéo 30 sang trái đè lên 20, kéo 40 sang trái đè lên 30
        [ 10,  30,  40,  (bỏ qua) ]
Bước 2: Giảm kích thước n xuống còn 3
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Chèn giá trị `val` vào vị trí `pos`
```cpp
// Dịch các phần tử từ cuối về pos sang phải 1 bước
for (int i = n; i > pos; --i) {
    a[i] = a[i - 1];
}
a[pos] = val; // Đặt giá trị mới vào
n++;          // Tăng số lượng phần tử của mảng
```

### Ví dụ 2: Xóa phần tử tại vị trí `pos`
```cpp
// Kéo các phần tử phía sau đè lên vị trí pos
for (int i = pos; i < n - 1; ++i) {
    a[i] = a[i + 1];
}
n--; // Giảm số lượng phần tử của mảng
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Dịch chuyển sai hướng khi chèn phần tử**
> * *Lỗi:* Khi chèn lại duyệt xuôi từ `pos` đến `n`: `a[i + 1] = a[i]`.
> * *Hậu quả:* Phần tử `a[pos]` bị sao chép tràn đè lên toàn bộ các phần tử phía sau, làm mất sạch dữ liệu gốc!
> * *Quy tắc:* Khi dời sang phải để chèn, bắt buộc phải duyệt **lùi từ cuối về**.

> [!WARNING]
> **2. Quên cập nhật số lượng phần tử `n`**
> * *Quy tắc:* Sau khi chèn phải tăng `n++`, sau khi xóa phải giảm `n--`.

## 5. Ghi nhớ trọng tâm

- Chèn phần tử: Dịch các phần tử sang phải (duyệt lùi) và tăng kích thước `n`.
- Xóa phần tử: Kéo các phần tử sang trái (duyệt xuôi) và giảm kích thước `n`.
- Luôn cẩn thận thứ tự dịch chuyển để không ghi đè mất dữ liệu.
