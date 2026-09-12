---
lessonId: "CPP-03.02"
title: "Vòng lặp while và Kiểm soát Vòng lặp Vô tận"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["while loop", "infinite loop", "condition", "iteration"]
prerequisites: ["CPP-03.01"]
---

# Vòng lặp while và Kiểm soát Vòng lặp Vô tận

## 1. Khái niệm cốt lõi

Khác với vòng lặp `for` thường dùng khi biết trước số lần lặp, **vòng lặp `while`** phù hợp với các bài toán **chưa biết trước chính xác số lần lặp**, chỉ biết rằng thao tác cần tiếp tục chừng nào điều kiện vẫn còn đúng.

* **Bản chất:** Kiểm tra điều kiện TRƯỚC. Nếu đúng thì chạy thân vòng lặp, chạy xong lại quay lên kiểm tra lại.
* **Ứng dụng tiêu biểu:** Rút từng chữ số của một số nguyên, đọc dữ liệu cho đến khi hết file, đợi tín hiệu từ người dùng.

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp chuẩn:
```cpp
while (điều_kiện) {
    // Thực thi khi điều_kiện còn ĐÚNG
    // Bắt buộc phải có câu lệnh làm thay đổi điều_kiện!
}
```

### Sơ đồ hoạt động:
```text
           ┌──► [ Kiểm tra điều_kiện ]
           │            │
           │     (Đúng) │      (Sai)
           │            ▼        ▼
           │     [ Thân vòng lặp ] [ Thoát vòng lặp ]
           └────────────┘
```

## 3. Ví dụ minh họa tinh gọn

Tách và in từng chữ số của một số nguyên từ phải sang trái:

```cpp
int n = 345;

while (n > 0) {
    int chuSoCuoi = n % 10; // Lấy chữ số hàng đơn vị
    std::cout << chuSoCuoi << ' ';
    n /= 10;                // Cắt bỏ chữ số cuối
}
// Kết quả in ra: 5 4 3
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Vòng lặp vô tận (Infinite Loop)**
> * *Lỗi:* Quên không cập nhật giá trị biến điều kiện trong thân `while` (ví dụ quên dòng `n /= 10;`).
> * *Hậu quả:* Điều kiện `n > 0` mãi mãi đúng, chương trình chạy liên tục không bao giờ dừng, ngốn 100% CPU và bị treo.
> * *Cách phòng tránh:* Luôn kiểm tra xem trong thân `while` đã có câu lệnh làm điều kiện tiến dần về `false` hay chưa.

> [!WARNING]
> **2. Vòng lặp không chạy lần nào**
> * *Nguyên nhân:* Nếu điều kiện bị `false` ngay từ lần kiểm tra đầu tiên, toàn bộ thân `while` sẽ bị bỏ qua.

## 5. Ghi nhớ trọng tâm

- `while` kiểm tra điều kiện trước khi thực thi thân vòng lặp.
- Dùng `while` khi số lần lặp phụ thuộc vào trạng thái dữ liệu (chưa biết trước lặp bao nhiêu lần).
- Luôn đảm bảo giá trị của biến điều kiện được thay đổi trong mỗi vòng lặp để tránh treo máy.
