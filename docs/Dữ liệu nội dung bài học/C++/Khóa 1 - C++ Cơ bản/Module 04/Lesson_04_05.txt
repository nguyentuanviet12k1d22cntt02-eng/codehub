---
lessonId: "CPP-04.05"
title: "Cơ chế Đệ quy (Recursion) Cơ bản và Điều kiện Dừng"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["recursion", "base case", "call stack", "factorial"]
prerequisites: ["CPP-04.01"]
---

# Cơ chế Đệ quy (Recursion) Cơ bản và Điều kiện Dừng

## 1. Khái niệm cốt lõi

**Đệ quy (Recursion)** là hiện tượng một hàm **tự gọi lại chính nó** trong quá trình thực thi để giải quyết một bài toán con tương tự nhưng có quy mô nhỏ hơn.

Mọi hàm đệ quy bắt buộc phải có đủ 2 thành phần cốt lõi:
1. **Điểm dừng (Base Case):** Trường hợp đơn giản nhất có thể trả về kết quả ngay mà không cần gọi lại hàm nữa.
2. **Bước đệ quy (Recursive Step):** Phân rã bài toán lớn thành bài toán nhỏ hơn và gọi lại chính hàm đó với tham số tiến dần về điểm dừng.

## 2. Cú pháp & Quy tắc hoạt động

### Cơ chế xếp chồng hàm trong bộ nhớ (Call Stack):
Khi gọi hàm đệ quy, mỗi lần gọi mới sẽ được đặt chồng lên trên các lần gọi trước trong bộ nhớ Call Stack. Khi chạm điểm dừng, các hàm sẽ lần lượt trả kết quả và thu dọn theo thứ tự ngược lại (Vào sau - Ra trước):

```text
Tính giai thừa 3! = giaiThua(3):
giaiThua(3) = 3 * giaiThua(2)   (Chờ kết quả...)
                 │
                 ▼
          giaiThua(2) = 2 * giaiThua(1)  (Chờ kết quả...)
                           │
                           ▼
                    giaiThua(1) = 1  ──► [ CHẠM ĐIỂM DỪNG! ]
                           │
                 ◄─────────┘ Trả về 1: 2 * 1 = 2
                 │
       ◄─────────┘ Trả về 2: 3 * 2 = 6 (Kết quả cuối cùng)
```

## 3. Ví dụ minh họa tinh gọn

Tính giai thừa của một số nguyên dương `n` ($n! = 1 	imes 2 	imes \dots 	imes n$):

```cpp
int giaiThua(int n) {
    // 1. Điểm dừng (Base Case)
    if (n <= 1) {
        return 1;
    }
    // 2. Bước đệ quy (Recursive Step)
    return n * giaiThua(n - 1);
}

int ketQua = giaiThua(4); // ketQua nhận giá trị 24 (4 * 3 * 2 * 1)
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên điểm dừng hoặc điểm dừng không bao giờ chạm tới**
> * *Hậu quả:* Hàm tự gọi nó vô tận cho đến khi tràn bộ nhớ ngăn xếp (lỗi kinh điển **Stack Overflow**), khiến chương trình bị sập ngay lập tức.
> * *Quy tắc số 1 của đệ quy:* Luôn viết và kiểm tra điều kiện dừng (`Base Case`) đầu tiên!

> [!WARNING]
> **2. Tham số đệ quy không tiến dần về điểm dừng**
> * *Lỗi:* Viết `return n * giaiThua(n + 1);`.
> * *Nguyên nhân:* Biến `n` ngày càng tăng ra xa điểm dừng `n <= 1`, cũng gây tràn bộ nhớ Stack Overflow.

## 5. Ghi nhớ trọng tâm

- Đệ quy là hàm tự gọi lại chính nó với quy mô bài toán nhỏ hơn.
- Luôn phải có **Điểm dừng (Base Case)** rõ ràng được đặt ở ngay đầu hàm.
- Tham số đệ quy bắt buộc phải giảm dần để tiến về điểm dừng sau hữu hạn bước.
