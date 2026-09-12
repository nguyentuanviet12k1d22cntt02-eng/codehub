---
lessonId: "CPP-05.03"
title: "Kỹ thuật Mảng Đếm (Frequency Array / Hash Table Cơ bản)"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["frequency array", "counting", "hash table", "direct addressing"]
prerequisites: ["CPP-05.01"]
---

# Kỹ thuật Mảng Đếm (Frequency Array / Hash Table Cơ bản)

## 1. Khái niệm cốt lõi

**Bài toán:** Cho một dãy số gồm nhiều phần tử từ 0 đến 9. Hãy cho biết mỗi số xuất hiện bao nhiêu lần?

Nếu với mỗi số, bạn lại dùng một vòng lặp quét qua toàn bộ mảng để đếm, chương trình sẽ phải lặp đi lặp lại rất nhiều lần.

**Kỹ thuật Mảng đếm (Frequency Array):**
* Biến **giá trị của phần tử** thành **chỉ số (index)** của một mảng đếm.
* Ô `dem[x]` sẽ lưu trữ: *Số lần giá trị `x` xuất hiện trong dữ liệu*.

| Giá trị xuất hiện trong mảng | Ô nhớ trong mảng đếm | Thao tác |
| :---: | :---: | :--- |
| Số `5` xuất hiện | `dem[5]` | `dem[5]++` (Tăng số lượng số 5 lên 1) |
| Ký tự `'a'` xuất hiện | `dem['a']` | `dem['a']++` (Tăng số lượng ký tự 'a' lên 1) |

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa cơ chế:
```text
Dữ liệu đầu vào:  [ 2,  5,  2,  1,  2 ]

Mảng đếm dem[] ban đầu toàn 0:
Chỉ số:   [0]  [1]  [2]  [3]  [4]  [5]
Số lượng:  0    0    0    0    0    0

Gặp số 2 ──► dem[2] tăng lên 1
Gặp số 5 ──► dem[5] tăng lên 1
Gặp số 2 ──► dem[2] tăng lên 2
Gặp số 1 ──► dem[1] tăng lên 1
Gặp số 2 ──► dem[2] tăng lên 3

Kết quả mảng đếm: dem[1] = 1, dem[2] = 3, dem[5] = 1.
```

## 3. Ví dụ minh họa tinh gọn

Đếm số lần xuất hiện của các chữ số từ 0 đến 9:

```cpp
int a[6] = {3, 1, 3, 2, 3, 1};
int dem[10] = {0}; // Khởi tạo toàn bộ mảng đếm bằng 0

// Bước 1: Ghi nhận số lần xuất hiện
for (int i = 0; i < 6; ++i) {
    dem[a[i]]++; // Giá trị a[i] làm chỉ số cho mảng dem
}

// Bước 2: In kết quả
for (int x = 0; x < 10; ++x) {
    if (dem[x] > 0) {
        std::cout << "So " << x << " xuat hien " << dem[x] << " lan
";
    }
}
// Kết quả:
// So 1 xuat hien 2 lan
// So 2 xuat hien 1 lan
// So 3 xuat hien 3 lan
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên khởi tạo toàn bộ mảng đếm bằng 0**
> * *Hậu quả:* Mảng `dem` chứa các giá trị rác ngẫu nhiên. Khi bạn viết `dem[x]++`, kết quả sẽ là một con số khổng lồ vô nghĩa!
> * *Cách phòng tránh:* Luôn khởi tạo: `int dem[MAX] = {0};`.

> [!WARNING]
> **2. Dữ liệu có giá trị âm hoặc giá trị quá lớn**
> * *Nguyên nhân:* Chỉ số mảng không được phép là số âm và không thể khai báo mảng có chỉ số hàng tỷ (`dem[1000000000]`).
> * *Quy tắc:* Mảng đếm trực tiếp chỉ áp dụng cho các số nguyên không âm có phạm vi vừa phải (thường <= 10^6).

## 5. Ghi nhớ trọng tâm

- Mảng đếm dùng chính giá trị phần tử làm chỉ số để truy xuất và đếm số lần xuất hiện.
- Thao tác ghi nhận cực nhanh: `dem[x]++`.
- Bắt buộc phải khởi tạo toàn bộ mảng đếm bằng `0` trước khi sử dụng.
