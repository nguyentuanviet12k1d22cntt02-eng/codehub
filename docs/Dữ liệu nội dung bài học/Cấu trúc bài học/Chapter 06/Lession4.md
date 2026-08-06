---
lessonId: "LS-03.04"
title: "Định dạng chuỗi (F-string)"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["f-string", "string formatting", "interpolation"]
prerequisites: ["LS-03.03"]
---

# 📘 Lesson 03.04: Định dạng chuỗi (F-string)

---

## 1. Khái niệm & Vấn đề

Khi lập trình, chúng ta thường xuyên cần xuất ra các câu thông báo chứa thông tin động từ các biến. Ví dụ: *"Chào bạn Alice, điểm của bạn là 9.5"* với `"Alice"` (chuỗi) và `9.5` (số thực) được lấy từ cơ sở dữ liệu.

Nếu sử dụng toán tử cộng chuỗi thông thường `+`, ta sẽ phải viết code rất rối rắm vì phải ép kiểu số sang chuỗi theo cách thủ công:
`"Chào bạn " + name + ", điểm của bạn là " + str(score)`

Để giải quyết vấn đề này, Python giới thiệu cơ chế **Định dạng chuỗi F-string** (Formatted String Literals), giúp chèn trực tiếp giá trị của các biến và biểu thức vào trong chuỗi một cách tự nhiên, trực quan và tối ưu hiệu năng nhất.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **F-string** | Chuỗi ký tự có tiền tố `f` (hoặc `F`), cho phép chèn các biểu thức vào bên trong cặp ngoặc nhọn `{}` để tự động tính toán và hiển thị giá trị. | Giống như **mẫu thư mời có sẵn khoảng trống**. Bạn chỉ cần ghi tên và thời gian vào các chỗ trống chừa sẵn trên mẫu thư. |

---

## 2. Cú pháp & Vận hành

Để khai báo một f-string, ta viết ký tự `f` ngay trước dấu nháy kép hoặc nháy đơn của chuỗi. Mọi tên biến hoặc biểu thức cần chèn sẽ được đặt trong cặp dấu ngoặc nhọn `{}`:
`f"Văn bản {bien} văn bản"`

```python
ten = "Minh"
tuoi = 16
thong_bao = f"Học viên {ten} năm nay {tuoi} tuổi."
print(thong_bao)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `ten = "Minh"` | `ten: "Minh"` | Khởi tạo biến lưu tên |
| 2 | `tuoi = 16` | `tuoi: 16` | Khởi tạo biến lưu tuổi |
| 3 | `thong_bao = f"..."` | `thong_bao: "Học viên Minh năm nay 16 tuổi."` | Biên dịch biểu thức nhúng trong chuỗi và sinh ra chuỗi hoàn thiện |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Quên ký tự tiền tố `f`:**
> Đây là lỗi cực kỳ phổ biến. Nếu thiếu chữ `f` ở đầu, Python sẽ đối xử với chuỗi như một văn bản tĩnh thông thường, in nguyên văn cả dấu ngoặc nhọn ra màn hình.
> *Ví dụ:*
> ```python
> x = 10
> print("Giá trị là {x}") # In ra: "Giá trị là {x}" (Lỗi do thiếu f ở đầu)
> print(f"Giá trị là {x}") # In ra: "Giá trị là 10" (Đúng)
> ```
>
> [!TIP]
> **Nhúng biểu thức tính toán trực tiếp:**
> Bên trong cặp `{}` của F-string, bạn không chỉ được viết tên biến mà còn có thể thực hiện tính toán số học, gọi hàm hoặc xử lý chuỗi:
> *Ví dụ:* `f"Tổng cộng: {2 + 3} USD"` sẽ in ra `"Tổng cộng: 5 USD"`.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để in ra chuỗi `"1 + 1 = 2"` bằng f-string khi đã có biến `x = 2`, lệnh nào sau đây viết **đúng** cú pháp?
* [ ] `print("1 + 1 = {x}")`
* [ ] `print(f"1 + 1 = x")`
* [x] `print(f"1 + 1 = {x}")`
* [ ] `print(f1 + 1 = {x})`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây bị lỗi không hiển thị đúng kết quả tính toán điểm trung bình. Hãy tìm lỗi và sửa lại:
```python
diem_toan = 8
diem_van = 9
# Đoạn code lỗi:
print("Điểm trung bình của bạn là {(diem_toan + diem_van) / 2}")
```

### Bài tập lập trình (Mini-task)
Khai báo biến `mon_hoc = "Python"` và `so_luong = 12`. Sử dụng F-string để in ra màn hình thông báo: `"Lớp học Python có 12 học viên."`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🏷️ F-string bắt đầu bằng chữ **`f`** đứng sát trước dấu nháy mở của chuỗi.
* 📦 Dùng cặp ngoặc nhọn **`{}`** để nhúng các biến hoặc biểu thức lập trình vào chuỗi văn bản.
* ⚡ F-string có tốc độ thực thi nhanh hơn và dễ đọc hơn nhiều so với việc nối chuỗi bằng toán tử cộng `+`.

Trong bài học tiếp theo **[LS-03.05: Khái niệm List & Khởi tạo]**, chúng ta sẽ chính thức bước sang cấu trúc dữ liệu tuần tự đa năng nhất của Python - Danh sách (List), để lưu trữ nhiều phần tử cùng lúc thay vì các biến đơn lẻ.
