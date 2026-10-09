# Luyện tập nền tảng vòng lặp `while`

Các bài tập tập trung vào ba thành phần: khởi tạo, điều kiện và cập nhật. Không yêu cầu thuật toán số học nâng cao.

## Mức 1: Kiểm soát điều kiện dừng

### Bài 1: Đếm từ 1 đến N

Nhập `n`. Dùng `while` để in các số từ `1` đến `n`.

### Bài 2: Đếm ngược

Nhập `n`. Dùng `while` để in từ `n` về `1`.

### Bài 3: In các số chẵn

Nhập `n`. In các số chẵn từ `2` đến `n`.

Gợi ý: bắt đầu từ `2` và tăng biến chạy thêm `2`.

### Bài 4: In bội của 5 nhỏ hơn hoặc bằng N

Nhập `n`. In `5, 10, 15, ...` cho đến khi giá trị vượt quá `n`.

## Mức 2: Cộng dồn và xử lý chữ số

### Bài 5: Tổng từ 1 đến N

Nhập `n`. Dùng `while` để tính tổng từ `1` đến `n`.

### Bài 6: Tổng các số lẻ

Nhập `n`. Tính tổng các số lẻ từ `1` đến `n`.

### Bài 7: Đếm chữ số

Nhập số nguyên dương `n`. Đếm số chữ số của `n`.

Gợi ý: sau mỗi lượt, dùng `n //= 10`.

### Bài 8: Tính tổng các chữ số

Nhập số nguyên dương `n`. Tính tổng các chữ số của `n`.

Gợi ý: lấy chữ số cuối bằng `n % 10`, sau đó bỏ chữ số cuối bằng `n //= 10`.

## Mức 3: Dừng theo dữ liệu nhập

### Bài 9: Cộng đến khi gặp 0

Nhập các số nguyên, mỗi số trên một dòng. Khi gặp `0`, dừng và in tổng các số đã nhập trước đó.

### Bài 10: Đếm số dương đến khi gặp số âm

Nhập liên tiếp các số nguyên. Khi gặp số âm, dừng và in số lượng giá trị dương đã nhập.

### Bài 11: Giới hạn ba lần nhập mã PIN

Mã đúng là `1234`. Người dùng được nhập tối đa ba lần. Nếu nhập đúng, in `DUNG` và dừng sớm; nếu hết ba lần vẫn sai, in `KHOA`.

### Bài 12: Tìm chữ số lớn nhất

Nhập số nguyên dương `n`. Dùng `while` để tìm chữ số lớn nhất của `n`.

Gợi ý: lấy từng chữ số bằng `% 10`, so sánh với biến kết quả rồi dùng `// 10`.

### Bài 13: Đảo ngược số nguyên

Nhập số nguyên dương `n`. Tạo và in số có thứ tự chữ số đảo ngược.

### Bài 14: Tính tích từ 1 đến N

Nhập `n >= 0`. Dùng `while` để tính tích từ `1` đến `n`. Với `n = 0`, kết quả là `1`.

### Bài 15: Tìm bội của 5 đầu tiên

Nhập số nguyên `a`. Dùng `while` để tìm số đầu tiên lớn hơn hoặc bằng `a` và chia hết cho `5`.

## Thứ tự luyện tập đề xuất

Làm Bài 1–4 để chắc điều kiện dừng, Bài 5–8 để luyện cập nhật trạng thái, sau đó mới làm Bài 9–15 với dữ liệu đầu vào không biết trước số lượt.
