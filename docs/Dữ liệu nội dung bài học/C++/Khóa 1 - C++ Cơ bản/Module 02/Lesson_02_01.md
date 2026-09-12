---
lessonId: "CPP-02.01"
title: "Cấu trúc Rẽ nhánh if, else if, else và Khối lệnh {}"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["if", "else", "else if", "branching", "block"]
prerequisites: ["CPP-01.04"]
---

# Cấu trúc Rẽ nhánh if, else if, else và Khối lệnh {}

## 1. Khái niệm cốt lõi

Trong thực tế, cuộc sống luôn có những quyết định phụ thuộc vào điều kiện: *"Nếu trời mưa thì mang ô, ngược lại thì không cần"*. 

Trong lập trình, **Cấu trúc rẽ nhánh** cho phép máy tính kiểm tra một điều kiện (đúng hoặc sai) để quyết định xem đoạn lệnh nào sẽ được thực thi, thay vì chạy tuần tự từ trên xuống dưới một cách máy móc.

| Cấu trúc | Ý nghĩa điều kiện | Khi nào thực thi? |
| :--- | :--- | :--- |
| **`if`** | Nếu điều kiện đúng (`true`) | Thực thi khối lệnh bên trong `if`. |
| **`else if`** | Nếu các điều kiện trước sai, kiểm tra điều kiện này | Chỉ chạy khi nhánh `if` trước sai và điều kiện này đúng. |
| **`else`** | Trường hợp còn lại (ngược lại hoàn toàn) | Chạy khi tất cả các điều kiện `if` và `else if` đều sai. |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp chuẩn:
```cpp
if (điều_kiện_1) {
    // Thực thi khi điều_kiện_1 ĐÚNG
} else if (điều_kiện_2) {
    // Thực thi khi điều_kiện_1 SAI và điều_kiện_2 ĐÚNG
} else {
    // Thực thi khi TẤT CẢ điều kiện trên đều SAI
}
```

### Sơ đồ luồng rẽ nhánh:
```text
           [ Kiểm tra điều_kiện_1 ]
                  │          │
           (Đúng) │          │ (Sai)
                  ▼          ▼
            [ Khối lệnh 1 ]  [ Kiểm tra điều_kiện_2 ]
                             │          │
                      (Đúng) │          │ (Sai)
                             ▼          ▼
                       [ Khối lệnh 2 ]  [ Khối else ]
```

## 3. Ví dụ minh họa tinh gọn

Phân loại học lực dựa trên điểm số:

```cpp
double diem = 8.5;

if (diem >= 8.0) {
    std::cout << "Xep loai Gioi";
} else if (diem >= 6.5) {
    std::cout << "Xep loai Kha";
} else {
    std::cout << "Can co gang them";
}
// Kết quả in ra: Xep loai Gioi
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Nhầm lẫn tai hại giữa toán tử gán `=` và toán tử so sánh bằng `==`**
> * *Lỗi:* Viết `if (x = 5) { ... }`.
> * *Nguyên nhân:* Dấu `=` là phép gán. Biểu thức `x = 5` gán giá trị 5 cho `x` và luôn được hiểu là `true`, khiến khối lệnh luôn luôn chạy bất kể `x` ban đầu là bao nhiêu!
> * *Cách sửa:* Luôn dùng hai dấu bằng `==` để so sánh: `if (x == 5)`.

> [!WARNING]
> **2. Quên cặp dấu ngoặc nhọn `{}` khi khối lệnh có từ 2 câu lệnh trở lên**
> * *Nguyên nhân:* Nếu không có `{ }`, C++ chỉ coi **duy nhất 1 câu lệnh đầu tiên** nằm dưới sự kiểm soát của `if`. Câu lệnh thứ 2 sẽ luôn chạy dù điều kiện đúng hay sai!
> * *Quy tắc an toàn:* Luôn luôn dùng cặp ngoặc `{ }` cho mọi khối `if` và `else`.

## 5. Ghi nhớ trọng tâm

- `if` kiểm tra điều kiện; nếu đúng thực thi khối lệnh tương ứng.
- Chỉ có **tối đa một nhánh** được thực thi trong toàn bộ chuỗi `if - else if - else`.
- Luôn sử dụng toán tử so sánh `==` (không dùng gán `=`) và bao bọc câu lệnh trong cặp ngoặc `{}`.
