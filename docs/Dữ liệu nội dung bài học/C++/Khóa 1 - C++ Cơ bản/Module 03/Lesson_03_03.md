---
lessonId: "CPP-03.03"
title: "Vòng lặp do-while và Ứng dụng Kiểm tra Tính Hợp lệ Dữ liệu"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["do-while", "post-condition", "validation", "menu"]
prerequisites: ["CPP-03.02"]
---

# Vòng lặp do-while và Ứng dụng Kiểm tra Tính Hợp lệ Dữ liệu

## 1. Khái niệm cốt lõi

Cả `for` và `while` đều kiểm tra điều kiện *trước khi chạy*. Nếu điều kiện sai ngay từ đầu, thân vòng lặp sẽ không chạy lần nào.

Ngược lại, **vòng lặp `do-while`** là vòng lặp **kiểm tra sau (Post-condition)**. Nó đảm bảo thân vòng lặp **luôn luôn được thực thi ít nhất 1 lần** trước khi kiểm tra điều kiện.

| Vòng lặp | Thời điểm kiểm tra điều kiện | Số lần chạy tối thiểu |
| :--- | :--- | :---: |
| **`while`** | Kiểm tra **TRƯỚC** khi vào thân | 0 lần |
| **`do-while`** | Kiểm tra **SAU** khi chạy xong thân | **1 lần** |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp chuẩn:
```cpp
do {
    // Khối lệnh thực thi (chắc chắn chạy ít nhất 1 lần)
} while (điều_kiện); // Lưu ý bắt buộc có dấu chấm phẩy ; ở cuối
```

### Sơ đồ luồng:
```text
[ Chạy thân loop lần đầu tiên ]
             │
             ▼
[ Kiểm tra điều_kiện ở cuối ]
       │            │
(Đúng) │            │ (Sai)
       ▼            ▼
 (Quay lại lặp)  [ Thoát loop ]
```

## 3. Ví dụ minh họa tinh gọn

Ứng dụng bắt buộc người dùng nhập điểm số hợp lệ từ 0 đến 10:

```cpp
int diem;
do {
    std::cout << "Nhap diem (0 den 10): ";
    std::cin >> diem;
} while (diem < 0 || diem > 10); // Lặp lại nếu người dùng nhập sai
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên dấu chấm phẩy `;` sau `while (điều_kiện);`**
> * *Quy tắc:* Khác với vòng lặp `for` và `while` thông thường, cú pháp của `do-while` **bắt buộc phải có dấu chấm phẩy `;`** sau từ khóa `while(...)`.

> [!WARNING]
> **2. Nhầm lẫn logic điều kiện lặp lại**
> * *Nguyên nhân:* Điều kiện trong `while` của `do-while` là điều kiện để **tiếp tục lặp** (khi nhập sai), không phải điều kiện để dừng.

## 5. Ghi nhớ trọng tâm

- `do-while` luôn chạy thân vòng lặp ít nhất 1 lần.
- Rất thích hợp cho các bài toán hiển thị Menu lựa chọn hoặc bắt buộc nhập lại dữ liệu cho đến khi đúng chuẩn.
- Nhớ đặt dấu chấm phẩy `;` ở cuối câu lệnh `while(...)`.
