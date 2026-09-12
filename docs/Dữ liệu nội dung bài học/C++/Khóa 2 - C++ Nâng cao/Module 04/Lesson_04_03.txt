---
lessonId: "CPP2-04.03"
title: "Cắt tỉa Nhánh cận (Branch and Bound) và Bài toán N-Queens"
difficulty: "HARD"
estimatedDuration: 25
keywords: ["n-queens", "branch and bound", "pruning", "chessboard"]
prerequisites: ["CPP2-04.02"]
---

# Cắt tỉa Nhánh cận (Branch and Bound) và Bài toán N-Queens

## 1. Khái niệm cốt lõi

Khi không gian tìm kiếm quá khổng lồ, việc thử mọi nhánh sẽ làm chương trình chạy quá chậm.

**Kỹ thuật Cắt tỉa (Pruning / Branch and Bound):**
Ngay khi nhận thấy một hướng đi **chắc chắn không thể dẫn đến kết quả hợp lệ**, ta lập tức chặt bỏ toàn bộ nhánh con đó mà không cần đào sâu thêm, giúp tiết kiệm thời gian.

## 2. Cú pháp & Quy tắc hoạt động

### Bài toán N Quân Hậu (N-Queens):
Đặt $N$ quân hậu lên bàn cờ $N 	imes N$ sao cho không có 2 quân nào khống chế nhau (cùng hàng, cùng cột hoặc cùng đường chéo).

```text
Quy luật kiểm soát:
- Cùng cột j:              Kiểm tra mangCot[j]
- Cùng chéo xuôi (i - j):  Kiểm tra mangCheoXuoi[i - j + N]
- Cùng chéo ngược (i + j): Kiểm tra mangCheoNguoc[i + j]
```

## 3. Ví dụ minh họa tinh gọn

Cắt tỉa điều kiện an toàn khi đặt quân hậu tại hàng `i`, cột `j`:

```cpp
// Điều kiện kiểm tra xem ô (i, j) có an toàn để đặt hậu hay không
bool anToan(int i, int j, int n) {
    return !cot[j] && !cheoXuoi[i - j + n] && !cheoNguoc[i + j];
}

// Đặt hậu và đánh dấu đồng thời cả 3 hướng
void datHau(int i, int j, int n, bool trangThai) {
    cot[j] = trangThai;
    cheoXuoi[i - j + n] = trangThai;
    cheoNguoc[i + j] = trangThai;
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Chỉ số âm trên mảng đường chéo xuôi `i - j`**
> * *Nguyên nhân:* Khi $i < j$, hiệu $i - j$ mang giá trị âm, gây lỗi truy cập chỉ số âm.
> * *Cách sửa chuẩn:* Cộng thêm $N$: `cheoXuoi[i - j + n]`.

## 5. Ghi nhớ trọng tâm

- Cắt tỉa nhánh cận giúp loại bỏ sớm các nhánh tìm kiếm vô vọng.
- Biến đổi kiểm tra đường chéo bàn cờ thành các mảng đánh dấu cờ hiệu $O(1)$.
