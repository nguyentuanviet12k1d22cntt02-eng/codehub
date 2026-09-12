---
lessonId: "CPP-02.02"
title: "Toán tử So sánh, Toán tử Logic và Cơ chế Đoản mạch (Short-Circuit)"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["comparison", "logical", "and", "or", "not", "short-circuit"]
prerequisites: ["CPP-02.01"]
---

# Toán tử So sánh, Toán tử Logic và Cơ chế Đoản mạch (Short-Circuit)

## 1. Khái niệm cốt lõi

* **Toán tử so sánh:** Dùng để so khớp hai giá trị và trả về kết quả kiểu `bool` (`true` hoặc `false`).
* **Toán tử logic:** Dùng để kết hợp nhiều điều kiện đơn lẻ lại với nhau để tạo thành điều kiện phức hợp.

| Toán tử | Tên gọi | Điều kiện cho kết quả `true` | Ví dụ |
| :---: | :--- | :--- | :--- |
| **`==`**, **`!=`** | Bằng, Khác | Giá trị bằng nhau / khác nhau | `5 != 3` ➔ `true` |
| **`<`**, **`<=`**, **`>`**, **`>=`** | So sánh thứ tự | Nhỏ hơn, nhỏ hơn hoặc bằng, v.v. | `10 >= 8` ➔ `true` |
| **`&&`** | VÀ (AND logic) | **Tất cả** các điều kiện đều phải đúng | `(tuoi >= 18) && (coBangLai)` |
| **`||`** | HOẶC (OR logic) | Chỉ cần **ít nhất một** điều kiện đúng | `(laChuNhat) || (laNgayLe)` |
| **`!`** | PHỦ ĐỊNH (NOT) | Đảo ngược: đúng thành sai, sai thành đúng | `!daDau` |

## 2. Cú pháp & Quy tắc hoạt động

### Cơ chế Đoản mạch (Short-Circuit Evaluation):
C++ đánh giá biểu thức logic từ trái sang phải và **dừng lại ngay lập tức** khi đã biết chắc chắn kết quả chung cuộc:
* **Với phép `&&` (VÀ):** Nếu vế trái là `false`, C++ lập tức kết luận cả biểu thức là `false` và **bỏ qua hoàn toàn vế phải**!
* **Với phép `||` (HOẶC):** Nếu vế trái là `true`, C++ lập tức kết luận cả biểu thức là `true` và **bỏ qua hoàn toàn vế phải**!

```text
[ Vế trái: false ]  &&  [ Vế phải: không bao giờ chạy ]  ──► Kết quả chắc chắn: false
[ Vế trái: true  ]  ||  [ Vế phải: không bao giờ chạy ]  ──► Kết quả chắc chắn: true
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Kết hợp điều kiện logic
```cpp
int tuoi = 20;
bool coThe = true;

// Cả hai điều kiện đều phải thỏa mãn
if (tuoi >= 18 && coThe) {
    std::cout << "Du dieu kien tham gia";
}
```

### Ví dụ 2: Tận dụng đoản mạch để phòng ngừa lỗi chia cho 0
```cpp
int mauSo = 0;
int tuSo = 10;

// Nếu mauSo == 0, vế phải (tuSo / mauSo) sẽ KHÔNG bị thực thi -> An toàn tuyệt đối!
if (mauSo != 0 && (tuSo / mauSo > 2)) {
    std::cout << "Hop le";
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Viết bất đẳng thức kép theo kiểu toán học `a < x < b`**
> * *Lỗi:* Viết `if (3 < x < 10)`.
> * *Nguyên nhân:* C++ tính `3 < x` trước ra `true` (1) hoặc `false` (0), sau đó mới so sánh `1 < 10` (luôn luôn `true`) ➔ Code chạy sai hoàn toàn!
> * *Cách sửa:* Bắt buộc tách thành hai mệnh đề nối bằng `&&`: `if (x > 3 && x < 10)`.

> [!WARNING]
> **2. Dùng nhầm toán tử bit `&` và `|` thay cho toán tử logic `&&` và `||`**
> * *Quy tắc:* `&&` và `||` dùng cho so sánh điều kiện logic. `&` và `|` là toán tử thao tác nhị phân (Bitwise) không có cơ chế đoản mạch an toàn.

## 5. Ghi nhớ trọng tâm

- `&&` chỉ đúng khi mọi vế đều đúng; `||` đúng khi có ít nhất một vế đúng.
- Cơ chế đoản mạch giúp chương trình tiết kiệm thời gian và ngăn chặn lỗi truy cập ô nhớ rác hoặc chia cho 0.
- Luôn tách bất đẳng thức kép `a < x < b` thành `(x > a && x < b)`.
