---
lessonId: "CPP-07.03"
title: "Kỹ thuật Duyệt Lân cận trên Lưới 2D (4 hướng / 8 hướng)"
difficulty: "MEDIUM"
estimatedDuration: 25
keywords: ["grid traversal", "direction vectors", "dx dy", "neighbors", "boundary check"]
prerequisites: ["CPP-07.01"]
---

# Kỹ thuật Duyệt Lân cận trên Lưới 2D (4 hướng / 8 hướng)

## 1. Khái niệm cốt lõi

Trong các bài toán ma trận hay trò chơi (như cờ vua, dò mìn, mê cung): Từ một ô tọa độ hiện tại `(r, c)`, ta thường phải kiểm tra các **ô lân cận xung quanh** nó (trên, dưới, trái, phải hoặc 4 đường chéo).

Nếu viết riêng rẽ từng câu lệnh `if` cho từng hướng, code sẽ rất dài, lặp lại và dễ thiếu sót.

**Kỹ thuật Mảng độ dời (Direction Vectors `dr[]`, `dc[]`):**
Quy định sẵn sự thay đổi về tọa độ hàng và cột của từng hướng đi vào 2 mảng nhỏ, sau đó dùng 1 vòng lặp để duyệt qua tất cả các hướng.

## 2. Cú pháp & Quy tắc hoạt động

### Bảng độ dời 4 hướng (Trên, Phải, Dưới, Trái):
```text
           [Trên: (-1, 0)]
                  ▲
  [Trái: (0, -1)] ◄── (r, c) ──► [Phải: (0, 1)]
                  ▼
          [Dưới: (1, 0)]

Mảng độ dời tương ứng:
int dr[4] = {-1,  0,  1,  0}; // Độ thay đổi hàng
int dc[4] = { 0,  1,  0, -1}; // Độ thay đổi cột
```

Tọa độ ô mới: `newR = r + dr[k]`, `newC = c + dc[k]`.

### Điều kiện Biên bắt buộc:
Ô mới `(newR, newC)` chỉ hợp lệ khi nó **vẫn nằm bên trong ma trận**:
$$0 \le newR < R \quad \text{và} \quad 0 \le newC < C$$

## 3. Ví dụ minh họa tinh gọn

Duyệt và in giá trị 4 ô lân cận của ô `(r, c)`:

```cpp
int dr[4] = {-1, 0, 1, 0};
int dc[4] = {0, 1, 0, -1};

int r = 1, c = 1; // Tọa độ ô hiện tại
int R = 3, C = 3; // Kích thước ma trận

for (int k = 0; k < 4; ++k) {
    int newR = r + dr[k];
    int newC = c + dc[k];

    // Kiểm tra ô mới có nằm trong biên ma trận không
    if (newR >= 0 && newR < R && newC >= 0 && newC < C) {
        std::cout << "O lan can hop le: (" << newR << ", " << newC << ")
";
    }
}
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên kiểm tra điều kiện biên trước khi truy cập `a[newR][newC]`**
> * *Lỗi:* Khi ô `(r, c)` nằm ở mép ma trận (như góc trên cùng `(0, 0)`), ô phía trên sẽ có tọa độ `newR = -1`.
> * *Hậu quả:* Truy cập `a[-1][0]` gây lỗi tràn ô nhớ nghiêm trọng.
> * *Quy tắc sống còn:* **Luôn kiểm tra điều kiện biên hợp lệ TRƯỚC** rồi mới được phép đọc giá trị `a[newR][newC]`.

## 5. Ghi nhớ trọng tâm

- Dùng hai mảng độ dời `dr[4]` và `dc[4]` để duyệt các hướng một cách ngắn gọn.
- Công thức tọa độ ô mới: `newR = r + dr[k]`, `newC = c + dc[k]`.
- Luôn kiểm tra điều kiện biên $0 \le newR < R$ và $0 \le newC < C$ để không bị văng ra ngoài bàn cờ.
