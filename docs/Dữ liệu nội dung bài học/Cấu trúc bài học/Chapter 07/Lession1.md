---
lessonId: "LS-03.05"
title: "Khái niệm List & Khởi tạo"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["list", "array", "initialization", "element"]
prerequisites: ["LS-03.01"]
---

# 📘 Lesson 03.05: Khái niệm List & Khởi tạo

---

## 1. Khái niệm & Vấn đề

Hãy tưởng tượng bạn cần lưu trữ danh sách điểm số của 40 học sinh trong một lớp. Nếu sử dụng biến đơn lẻ, bạn sẽ phải khai báo 40 biến khác nhau: `diem_1`, `diem_2`, ..., `diem_40`. Điều này làm mã nguồn trở nên cực kỳ cồng kềnh, không thể mở rộng và việc tính toán trung bình điểm sẽ cực kỳ thủ công.

Để giải quyết vấn đề này, Python cung cấp cấu trúc dữ liệu **Danh sách (List)**. List là một tập hợp tuần tự chứa nhiều phần tử, cho phép lưu trữ và quản lý hàng loạt dữ liệu chỉ bằng một biến duy nhất.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **List (Danh sách)** | Một cấu trúc dữ liệu tuần tự có thứ tự, có thể thay đổi (mutable), cho phép lưu trữ nhiều loại phần tử khác nhau. | Giống như một **đoàn tàu chở hàng**. Mỗi toa tàu là một ngăn (phần tử) chứa hàng hóa, được đánh số thứ tự từ đầu toa đến cuối toa. |

---

## 2. Cú pháp & Vận hành

Để tạo một List trong Python, ta dùng cặp ngoặc vuông `[]`. Các phần tử cách nhau bởi dấu phẩy `,`:
`ten_danh_sach = [phan_tu_1, phan_tu_2, ...]`

List của Python rất linh hoạt:
* Có thể chứa các phần tử có kiểu dữ liệu khác nhau (số, chuỗi, boolean, hoặc thậm chí là List khác).
* Có thể rỗng (không chứa phần tử nào): `empty_list = []`.
* Các phần tử trong List được đánh chỉ số (index) giống hệt chuỗi (bắt đầu từ `0` đến `độ dài - 1`).

```python
diem_so = [8.5, 9.0, 7.5, 10.0]
trai_cay = ["Táo", "Chuối", "Cam"]
hon_hop = ["Học sinh A", 10, True]

print(diem_so[0])    # Lấy phần tử đầu tiên
print(len(trai_cay)) # Độ dài của danh sách
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `diem_so = [8.5, 9.0, 7.5, 10.0]` | `diem_so: [8.5, 9.0, 7.5, 10.0]` | Khởi tạo mảng số thực |
| 2 | `print(diem_so[0])` | `diem_so[0]: 8.5` | Lấy giá trị tại chỉ số 0 và in ra |
| 3 | `len(trai_cay)` | `len(trai_cay): 3` | Đếm số phần tử trong danh sách `trai_cay` |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi chỉ số vượt quá phạm vi (`IndexError`):**
> Giống như chuỗi, việc truy cập vào một chỉ số không tồn tại trong List sẽ gây lỗi.
> *Ví dụ:* `ds = [1, 2, 3]`. Vì danh sách chỉ có 3 phần tử (chỉ số tối đa là 2), lệnh `print(ds[3])` sẽ làm chương trình bị sập ngay lập tức với thông báo lỗi `IndexError: list index out of range`.
>
> [!TIP]
> **Hàm `len()` đa năng:**
> Luôn dùng hàm `len(ten_list)` để xác định nhanh số lượng phần tử hiện tại có trong List, từ đó kiểm soát chỉ số an toàn.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để khởi tạo một danh sách rỗng, cách khai báo nào sau đây là đúng?
* [x] `my_list = []`
* [ ] `my_list = {}`
* [ ] `my_list = ()`
* [ ] `my_list = ""`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây cố gắng lấy phần tử cuối cùng của danh sách `scores` nhưng đang bị lỗi sập chương trình. Hãy tìm lỗi và sửa lại:
```python
scores = [90, 85, 88]
# Đoạn code lỗi:
last_score = scores[3]
print(last_score)

# Gợi ý: Hãy dùng chỉ số âm để lấy phần tử cuối cùng một cách an toàn.
```

### Bài tập lập trình (Mini-task)
Hãy khởi tạo một danh sách tên là `my_hobbies` chứa 3 sở thích của bạn (dưới dạng chuỗi). Hãy in ra màn hình phần tử thứ hai (chỉ số 1) của danh sách đó.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📦 **List** là cấu trúc chứa nhiều phần tử, khai báo bằng cặp ngoặc vuông `[]`.
* 🔢 Các phần tử có thứ tự và được truy xuất qua chỉ số **Index** (bắt đầu từ `0`).
* 📏 Dùng **`len(list)`** để kiểm tra số lượng phần tử của danh sách.

Trong bài học tiếp theo **[LS-03.06: Cập nhật & Sửa đổi List]**, chúng ta sẽ học cách thêm phần tử mới, xóa bỏ hoặc sửa đổi các phần tử hiện có trong một danh sách một cách động.
