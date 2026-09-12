---
lessonId: "CPP-03.04"
title: "Kiểm soát Dòng lặp với break và continue"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["break", "continue", "loop control", "skip"]
prerequisites: ["CPP-03.01"]
---

# Kiểm soát Dòng lặp với break và continue

## 1. Khái niệm cốt lõi

Trong khi vòng lặp đang diễn ra, đôi khi ta cần can thiệp để thay đổi dòng chảy thực thi:
* **Tìm thấy kết quả sớm:** Không cần lặp tiếp nữa ➔ Dừng vòng lặp ngay lập tức.
* **Gặp phần tử không hợp lệ:** Bỏ qua phần tử này ➔ Nhảy ngay sang lần lặp tiếp theo.

C++ cung cấp hai lệnh điều hướng mạnh mẽ: **`break`** và **`continue`**.

| Lệnh | Hành động | Điểm đến tiếp theo |
| :--- | :--- | :--- |
| **`break`** | **Dừng hoàn toàn** vòng lặp ngay lập tức | Nhảy ra khỏi vòng lặp đến câu lệnh nằm sau dấu `}`. |
| **`continue`** | **Bỏ qua phần còn lại** của lần lặp hiện tại | Nhảy ngay đến bước cập nhật biến đếm để sang lần lặp mới. |

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa sự khác biệt:
```text
Vòng lặp: 1 ──► 2 ──► [ Gặp break ] ────────────► [ THOÁT HẲN VÒNG LẶP ]
                                                  (Các bước 3, 4, 5 bị hủy)

Vòng lặp: 1 ──► 2 ──► [ Gặp continue ] ──► 3 ──► 4 ──► 5
                      (Bỏ qua thân bước 2)
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Dùng `break` dừng sớm khi tìm thấy phần tử
```cpp
// Tìm xem số 7 có trong dãy lặp hay không
for (int i = 1; i <= 10; ++i) {
    if (i == 7) {
        std::cout << "Da tim thay 7!";
        break; // Thoát ngay, không cần kiểm tra 8, 9, 10
    }
}
```

### Ví dụ 2: Dùng `continue` để chỉ in các số lẻ
```cpp
for (int i = 1; i <= 6; ++i) {
    if (i % 2 == 0) continue; // Bỏ qua số chẵn
    std::cout << i << ' ';
}
// Kết quả in ra: 1 3 5
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm lẫn phạm vi của `break` khi có vòng lặp lồng nhau**
> * *Quy tắc:* Lệnh `break` chỉ thoát ra khỏi **vòng lặp gần nhất** chứa nó. Nó không làm thoát khỏi toàn bộ các vòng lặp bên ngoài.

> [!WARNING]
> **2. Lỗi quên bước tăng biến khi dùng `continue` trong `while`**
> * *Lỗi:* Đặt `continue` trước dòng `i++` trong vòng lặp `while`.
> * *Hậu quả:* Lệnh `continue` nhảy về đầu `while` khiến dòng `i++` không bao giờ được chạy ➔ Biến `i` không đổi và gây lặp vô tận!

## 5. Ghi nhớ trọng tâm

- `break` dùng để dừng và thoát hẳn khỏi vòng lặp sớm.
- `continue` dùng để bỏ qua các câu lệnh còn lại trong lần lặp đó để chuyển sang lần lặp kế tiếp.
- Chỉ tác động lên vòng lặp trực tiếp bao quanh nó.
