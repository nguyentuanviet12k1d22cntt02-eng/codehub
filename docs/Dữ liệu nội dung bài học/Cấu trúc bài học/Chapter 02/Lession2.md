---
lessonId: "LS-01.05"
title: "Các kiểu dữ liệu nguyên thủy"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["data types", "int", "float", "boolean", "python basics"]
prerequisites: ["LS-01.04"]
---

# 📘 Lesson 01.05: Các kiểu dữ liệu nguyên thủy

---

## 1. Khái niệm & Vấn đề

Trong đời sống, thông tin quanh ta có rất nhiều định dạng khác nhau: tuổi tác là các số nguyên (15, 16 tuổi), điểm số thi là các số lẻ thập phân (8.5, 9.2), còn trạng thái đèn bật/tắt là câu trả lời Đúng/Sai.

Máy tính cũng cần phân loại dữ liệu để lưu trữ tối ưu trong bộ nhớ và biết cách xử lý chúng chính xác. Ví dụ: bạn không thể thực hiện phép cộng số học giữa tên người dùng `"Nam"` và số tuổi `15`, nhưng hoàn toàn có thể cộng tuổi `15` với `1`.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Kiểu dữ liệu (Data Type)** | Phân loại dữ liệu giúp máy tính hiểu giá trị đó đại diện cho cái gì và các phép toán hợp lệ đi kèm. | Giống như **vật chứa chuyên dụng** trong nhà bếp: chai đựng nước (chất lỏng), rổ đựng rau (chất rắn). |

---

## 2. Cú pháp & Vận hành

Python tự động nhận diện kiểu dữ liệu của biến dựa trên giá trị mà bạn gán cho nó (được gọi là định kiểu động).

```python
tuoi = 15          # Python hiểu đây là kiểu Số nguyên (int)
diem_tb = 8.5      # Python hiểu đây là kiểu Số thực (float)
da_nop_bai = True  # Python hiểu đây là kiểu Logic (bool)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `tuoi = 15` | `tuoi: 15` | Khởi tạo biến `tuoi` kiểu số nguyên (`int`) |
| 2 | `diem_tb = 8.5` | `diem_tb: 8.5` | Khởi tạo biến `diem_tb` kiểu số thực (`float`) |
| 3 | `da_nop_bai = True` | `da_nop_bai: True` | Khởi tạo biến `da_nop_bai` kiểu logic (`bool`) |

**Trạng thái bộ nhớ RAM:**
```text
[Stack (Tên biến)]          [Heap (Vùng dữ liệu thực tế)]
     tuoi           ───────►  15                  (Kiểu int)
     diem_tb        ───────►  8.5                 (Kiểu float)
     da_nop_bai     ───────►  True                (Kiểu bool)
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các lỗi cú pháp và logic thường gặp:**
> * **Sai định dạng Boolean**: Python phân biệt chữ hoa/thường. Boolean bắt buộc phải viết hoa chữ cái đầu: `True` và `False`. Viết thường `true` hoặc `false` sẽ gây lỗi `NameError` (biến chưa định nghĩa).
> * **Sai dấu phân tách thập phân**: Phải dùng dấu chấm `.` (ví dụ: `8.5`). Dùng dấu phẩy `,` (ví dụ: `8,5`) sẽ tạo ra kiểu dữ liệu phức tạp khác (tuple) hoặc báo lỗi tính toán.

> [!TIP]
> **Kiểm tra kiểu dữ liệu:**
> * Bạn có thể sử dụng hàm `type(ten_bien)` để biết chính xác kiểu dữ liệu hiện tại của một biến. Ví dụ: `print(type(tuoi))` sẽ in ra `<class 'int'>`.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Kiểu dữ liệu của giá trị `9.0` trong Python là gì?
* [ ] `int`
* [x] `float`
* [ ] `bool`
* [ ] `str` (Chuỗi chữ)

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây bị lỗi. Hãy tìm lỗi và sửa lại cho đúng:
```python
# Sửa lại đoạn code lỗi sau:
da_hoan_thanh = true
chieu_cao = 1,72
```

### Bài tập lập trình (Mini-task)
Hãy khai báo 3 biến: `chieu_dai` gán giá trị số nguyên `10`, `chieu_rong` gán giá trị số thực `4.5`, và `is_hinh_chu_nhat` gán giá trị logic `True`. Sau đó in ra kiểu dữ liệu của biến `chieu_rong` bằng cách kết hợp hàm `print()` và `type()`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🔢 **int (Integer)** lưu trữ các số nguyên không có phần thập phân (dương, âm hoặc số 0).
* 📐 **float (Floating-point)** lưu trữ các số thực có phần thập phân.
* ⚖️ **bool (Boolean)** chỉ nhận một trong hai giá trị duy nhất: `True` (Đúng) hoặc `False` (Sai).

Trong bài học tiếp theo **[LS-01.06: Toán tử số học]**, chúng ta sẽ học cách thực hiện các phép tính cộng, trừ, nhân, chia, lấy dư trên các kiểu dữ liệu số này.
