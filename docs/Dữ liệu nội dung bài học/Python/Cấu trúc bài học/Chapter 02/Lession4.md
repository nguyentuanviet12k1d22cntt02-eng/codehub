---
lessonId: "LS-01.07"
title: "Toán tử gán và Cập nhật biến"
difficulty: "BASIC"
estimatedDuration: 20
keywords: ["assignment operators", "shortcut operators", "variable update", "python basics"]
prerequisites: ["LS-01.06"]
---

# 📘 Lesson 01.07: Toán tử gán và Cập nhật biến

---

## 1. Khái niệm & Vấn đề

Trong lập trình, việc cập nhật giá trị của một biến dựa trên chính giá trị hiện tại của nó là cực kỳ phổ biến. Ví dụ: cộng thêm `10` điểm khi người chơi ăn điểm (`diem = diem + 10`), hoặc giảm số lượng hàng tồn kho đi `1` khi có khách mua (`ton_kho = ton_kho - 1`).

Cách viết `diem = diem + 10` bắt buộc ta phải lặp lại tên biến ở hai vế, làm code dài dòng và dễ gõ sai. Để tối ưu hóa, Python cung cấp các **Toán tử gán rút gọn (Shortcut Assignment Operators)**.

| Toán tử gán rút gọn | Viết đầy đủ tương đương | Ý nghĩa hành động |
| :---: | :--- | :--- |
| `+=` | `x = x + y` | Cộng thêm giá trị của vế phải vào biến `x` |
| `-=` | `x = x - y` | Trừ bớt giá trị của vế phải từ biến `x` |
| `*=` | `x = x * y` | Nhân biến `x` với giá trị của vế phải |
| `/=` | `x = x / y` | Chia biến `x` cho giá trị của vế phải |

---

## 2. Cú pháp & Vận hành

Hãy xem cách viết rút gọn hoạt động trong thực tế:

```python
diem = 100
diem += 10    # Tương đương: diem = diem + 10
print(diem)

so_luong = 5
so_luong *= 2  # Tương đương: so_luong = so_luong * 2
print(so_luong)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `diem = 100` | `diem: 100` | Khởi tạo biến `diem` |
| 2 | `diem += 10` | `diem: 110` | Lấy giá trị hiện tại `100` cộng thêm `10` và gán lại vào `diem` |
| 5 | `so_luong = 5` | `so_luong: 5` | Khởi tạo biến `so_luong` |
| 6 | `so_luong *= 2` | `so_luong: 10` | Lấy giá trị hiện tại `5` nhân với `2` và gán lại vào `so_luong` |

**Trạng thái bộ nhớ RAM:**
```text
Trạng thái 1: [diem] ───────► ( Vùng nhớ: 100 )
Trạng thái 2: [diem] ───────► ( Vùng nhớ: 110 )  [100 cũ bị giải phóng]
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi logic cực kỳ nguy hiểm về thứ tự viết ký hiệu:**
> * Ký hiệu toán tử bắt buộc phải đứng **trước** dấu bằng (ví dụ: `+=`, `-=`).
> * Nếu viết ngược lại thành `=+` hoặc `=-`, chương trình **không báo lỗi cú pháp** mà sẽ bị hiểu sai hoàn toàn:
>   * `x =+ 5` tương đương `x = +5` (gán giá trị dương 5 cho `x`).
>   * `x =- 5` tương đương `x = -5` (gán giá trị âm 5 cho `x`).
> * Điều này khiến biến bị ghi đè thay vì cộng dồn, tạo ra lỗi logic rất khó tìm.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Đoạn code sau đây in ra màn hình giá trị bao nhiêu?
```python
x = 10
x =- 2
print(x)
```
* [ ] `8`
* [ ] `12`
* [x] `-2`
* [ ] Lỗi SyntaxError

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây dùng để cộng dồn số tiền tiết kiệm khi nhận thêm học bổng. Tuy nhiên kết quả in ra là `50000` chứ không phải `70000`. Hãy tìm và sửa lỗi:
```python
# Sửa lại đoạn code cập nhật ví tiền dưới đây:
vi_tien = 20000
vi_tien =+ 50000
print(vi_tien)
```

### Bài tập lập trình (Mini-task)
Khởi tạo biến `tien_tiet_kiem = 100000`. Hãy sử dụng toán tử gán rút gọn thực hiện các bước sau:
1. Cộng thêm `50000` đồng nhận từ học bổng.
2. Nhân đôi số tiền tiết kiệm hiện tại khi trúng thưởng.
In giá trị cuối cùng của biến `tien_tiet_kiem` ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📝 Toán tử gán rút gọn (`+=`, `-=`, `*=`, `/=`) giúp mã nguồn ngắn gọn, tối giản và chuyên nghiệp hơn.
* ⚠️ Hãy luôn chú ý đặt toán tử số học trước dấu `=` để tránh lỗi ghi đè nhầm lẫn logic.

Trong bài học tiếp theo **[LS-01.08: Hàm xuất dữ liệu (Print)]**, chúng ta sẽ di chuyển sang **Chapter 03: Tương tác cơ bản** để khám phá sâu hơn các tham số nâng cao của hàm in và giao tiếp kết quả với người dùng.
