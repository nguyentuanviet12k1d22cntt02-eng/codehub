---
lessonId: "CPP2-04.02"
title: "Mô hình Quay lui (Backtracking Framework) và Bài toán Sinh Hoán vị"
difficulty: "HARD"
estimatedDuration: 25
keywords: ["backtracking", "permutations", "state space tree", "undo move"]
prerequisites: ["CPP2-04.01"]
---

# Mô hình Quay lui (Backtracking Framework) và Bài toán Sinh Hoán vị

## 1. Khái niệm cốt lõi

**Thuật toán Quay lui (Backtracking)** là phương pháp tìm kiếm vét cạn có hệ thống. Hãy tưởng tượng bạn đang đi trong một mê cung:
- Đi thử từng con đường có thể.
- Nếu gặp ngõ cụt: **Lùi lại 1 bước (Backtrack)**, khôi phục lại trạng thái cũ và thử đi hướng khác.

## 2. Cú pháp & Quy tắc hoạt động

### Khung sườn tổng quát của Thuật toán Quay lui:
```cpp
void Thu(int buoc) {
    for (mỗi khả năng có thể chọn) {
        if (khả năng này hợp lệ) {
            Ghi_nhận_lựa_chọn;

            if (đã đến bước cuối cùng) {
                In_kết_quả;
            } else {
                Thu(buoc + 1); // Đi tiếp bước tiếp theo
            }

            Hủy_ghi_nhận_lựa_chọn; // BƯỚC QUAN TRỌNG: Khôi phục lại trạng thái cũ khi quay lui!
        }
    }
}
```

## 3. Ví dụ minh họa tinh gọn

Cốt lõi khôi phục trạng thái trong sinh hoán vị:

```cpp
bool daDung[10] = {false};
int ketQua[10];

void sinhHoanVi(int i, int n) {
    for (int j = 1; j <= n; ++j) {
        if (!daDung[j]) {
            ketQua[i] = j;
            daDung[j] = true; // Đánh dấu đã dùng

            if (i == n) inKetQua(n);
            else sinhHoanVi(i + 1, n);

            daDung[j] = false; // QUAY LUI: Trả lại trạng thái chưa dùng cho nhánh khác!
        }
    }
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên bước hoàn tác trạng thái (Undo State)**
> * *Hậu quả:* Quên dòng `daDung[j] = false;` sẽ khiến các nhánh tìm kiếm sau đó tưởng rằng phần tử vẫn bị khóa, dẫn đến thiếu nghiệm.

## 5. Ghi nhớ trọng tâm

- Quay lui = Thử ➔ Đi tiếp ➔ Hoàn trả trạng thái cũ (Backtrack) ➔ Thử phương án khác.
- Luôn nhớ hoàn tác trạng thái sau lời gọi đệ quy.
