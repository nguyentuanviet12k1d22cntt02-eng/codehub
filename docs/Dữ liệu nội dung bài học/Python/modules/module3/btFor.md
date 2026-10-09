# Luyện tập nền tảng vòng lặp `for`

Các bài được xếp từ thao tác một bước đến kết hợp vòng lặp với điều kiện. Chỉ sử dụng kiến thức đã học trong Module 1–3: nhập xuất, biến, toán tử, `if`, `for` và `range()`.

## Mức 1: Làm quen với số lượt lặp

### Bài 1: In lời chào N lần

Nhập số nguyên dương `n`. In dòng `Xin chào Python` đúng `n` lần.

Ví dụ: `n = 3` thì in ba dòng giống nhau.

### Bài 2: In từ 1 đến N

Nhập `n`. In các số từ `1` đến `n`, mỗi số trên một dòng.

Gợi ý: giới hạn kết thúc của `range()` không được lấy.

### Bài 3: In các số chẵn

Nhập `n`. In các số chẵn từ `2` đến `n`, mỗi số trên một dòng.

Gợi ý: dùng bước nhảy `2` trong `range()`.

### Bài 4: Đếm ngược bằng `for`

Nhập `n`. In các số từ `n` về `1`.

Gợi ý: bước nhảy phải là số âm.

## Mức 2: Cộng dồn và đếm

### Bài 5: Tổng từ 1 đến N

Nhập `n`. Tính và in tổng `1 + 2 + ... + n`.

### Bài 6: Tổng các số chẵn

Nhập `n`. Tính tổng các số chẵn trong đoạn từ `1` đến `n`.

### Bài 7: Đếm số chia hết cho 3

Nhập `n`. Đếm có bao nhiêu số trong đoạn từ `1` đến `n` chia hết cho `3`.

### Bài 8: Tính tích từ 1 đến N

Nhập `n`. Tính tích `1 × 2 × ... × n`. Với `n = 0`, kết quả là `1`.

Gợi ý: biến tích khởi tạo bằng `1`.

## Mức 3: Kết hợp `for` với điều kiện

### Bài 9: In bảng nhân của một số

Nhập `n`. In bảng nhân của `n` từ `n x 1` đến `n x 10` theo mẫu:

```text
3 x 1 = 3
3 x 2 = 6
```

### Bài 10: Tổng các số chia hết cho 3 hoặc 5

Nhập `n`. Tính tổng các số từ `1` đến `n` chia hết cho `3` hoặc `5`.

### Bài 11: Đếm số trong một đoạn

Nhập hai số nguyên `a`, `b` với `a <= b`. Đếm các số trong đoạn `[a, b]` vừa là số chẵn vừa lớn hơn `0`.

### Bài 12: Tìm số đầu tiên chia hết cho 7

Nhập `a`, `b` với `a <= b`. In số đầu tiên trong đoạn `[a, b]` chia hết cho `7`. Nếu không có, in `KHONG CO`.

Gợi ý: dùng `break` sau khi tìm thấy và một biến logic để ghi nhận kết quả.

### Bài 13: Đếm số lẻ trong đoạn

Nhập `a`, `b` với `a <= b`. Đếm số lẻ trong đoạn `[a, b]`.

### Bài 14: In bình phương từ 1 đến N

Nhập `n`. Với mỗi số từ `1` đến `n`, in bình phương của số đó trên một dòng.

### Bài 15: Tính tổng trong đoạn A đến B

Nhập `a`, `b` với `a <= b`. Tính tổng mọi số nguyên trong đoạn `[a, b]`.

## Thứ tự luyện tập đề xuất

Làm lần lượt Bài 1–4, sau đó Bài 5–8. Chỉ chuyển sang Bài 9–15 khi đã tự viết được ba bước: khởi tạo kết quả, cập nhật trong vòng lặp và in kết quả sau vòng lặp.
