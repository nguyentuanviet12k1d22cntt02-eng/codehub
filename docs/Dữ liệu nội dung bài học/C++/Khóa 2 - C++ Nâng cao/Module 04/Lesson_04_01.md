---
lessonId: "CPP2-04.01"
title: "Kỹ thuật Chia để Trị (Divide and Conquer) và Cây Đệ quy"
difficulty: "HARD"
estimatedDuration: 20
keywords: ["divide and conquer", "recursion tree", "binary search", "merge sort"]
prerequisites: ["CPP-04.05"]
---

# Kỹ thuật Chia để Trị (Divide and Conquer) và Cây Đệ quy

## 1. Khái niệm cốt lõi

**Chia để Trị (Divide and Conquer)** là một trong những tư duy thuật toán quan trọng nhất:
1. **Chia (Divide):** Chia bài toán lớn ban đầu thành các bài toán con nhỏ hơn có cùng tính chất.
2. **Trị (Conquer):** Độc lập giải quyết các bài toán con bằng đệ quy. Nếu bài toán con đủ nhỏ ➔ Giải trực tiếp (Điểm dừng).
3. **Kết hợp (Combine):** Gom kết quả từ các bài toán con để thu được đáp án cho bài toán ban đầu.

## 2. Cú pháp & Quy tắc hoạt động

### Mô hình Cây đệ quy:
```text
                 [ Bài toán lớn: Kích thước N ]
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     [ Bài toán con N/2 ]            [ Bài toán con N/2 ]
              │                               │
         ┌────┴────┐                     ┌────┴────┐
         ▼         ▼                     ▼         ▼
       [ N/4 ]   [ N/4 ]               [ N/4 ]   [ N/4 ]
```

## 3. Ví dụ minh họa tinh gọn

Thuật toán Tìm kiếm Nhị phân đệ quy (Binary Search):

```cpp
int timNhiPhan(int a[], int left, int right, int x) {
    if (left > right) return -1; // Điểm dừng: Không tìm thấy

    int mid = left + (right - left) / 2;

    if (a[mid] == x) return mid; // Tìm thấy tại vị trí giữa!

    if (a[mid] > x) {
        return timNhiPhan(a, left, mid - 1, x);  // Chia đôi: Tìm nửa bên trái
    } else {
        return timNhiPhan(a, mid + 1, right, x); // Chia đôi: Tìm nửa bên phải
    }
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Tính sai chỉ số giữa gây tràn số: `(left + right) / 2`**
> * *Lỗi:* Khi `left` và `right` là các số lớn gần 2 tỷ, phép cộng `left + right` sẽ bị tràn số nguyên.
> * *Cách sửa chuẩn:* Luôn tính `mid = left + (right - left) / 2;`.

## 5. Ghi nhớ trọng tâm

- Chia để trị: Chia bài toán lớn thành các nửa nhỏ hơn, giải quyết bằng đệ quy rồi kết hợp lại.
- Giúp giảm độ phức tạp từ $O(N)$ xuống $O(\log N)$ trong bài toán tìm kiếm nhị phân.
