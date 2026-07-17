---
lessonId: "LS-01.06"
title: "Toán tử số học"
difficulty: "BASIC"
estimatedDuration: 30
keywords: ["arithmetic operators", "math", "addition", "division", "modulo", "python basics"]
prerequisites: ["LS-01.05"]
---

# 📘 Lesson 01.06: Toán tử số học

---

## 1. Khái niệm & Vấn đề

Khi lập trình, chúng ta liên tục phải tính toán: tính tổng hóa đơn mua hàng, tính điểm trung bình học tập, hay đơn giản là chia đều một số tiền cho nhóm bạn. 

Để máy tính hiểu được chúng ta muốn thực hiện phép tính nào, Python cung cấp các ký hiệu toán học đặc biệt gọi là **Toán tử số học (Arithmetic Operators)**.

| Toán tử | Ý nghĩa toán học | Ví dụ trong Python | Kết quả |
| :---: | :--- | :--- | :--- |
| `+` | Phép cộng | `5 + 3` | `8` |
| `-` | Phép trừ | `5 - 3` | `2` |
| `*` | Phép nhân | `5 * 3` | `15` |
| `/` | Phép chia thường | `5 / 2` | `2.5` (luôn là float) |
| `//` | Phép chia lấy phần nguyên | `5 // 2` | `2` (bỏ phần thập phân) |
| `%` | Phép chia lấy phần dư | `5 % 2` | `1` (lấy số dư của phép chia) |
| `**` | Phép lũy thừa (mũ) | `2 ** 3` | `8` (nghĩa là 2 mũ 3) |

---

## 2. Cú pháp & Vận hành

Cú pháp thực hiện tính toán số học rất trực quan, giống như cách bạn viết biểu thức toán học thông thường:

```python
a = 10
b = 3
chia_thuong = a / b
chia_lay_du = a % b
print(chia_thuong)
print(chia_lay_du)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `a = 10` | `a: 10` | Khởi tạo biến `a` |
| 2 | `b = 3` | `a: 10, b: 3` | Khởi tạo biến `b` |
| 3 | `chia_thuong = a / b` | `chia_thuong: 3.333...` | Thực hiện chia thường và lưu kết quả |
| 4 | `chia_lay_du = a % b` | `chia_lay_du: 1` | Thực hiện chia lấy số dư (10 chia 3 dư 1) |

**Trạng thái bộ nhớ RAM:**
```text
[Stack (Tên biến)]          [Heap (Vùng dữ liệu thực tế)]
     a              ───────►  10                  (Kiểu int)
     b              ───────►  3                   (Kiểu int)
     chia_thuong    ───────►  3.3333333333333335  (Kiểu float)
     chia_lay_du    ───────►  1                   (Kiểu int)
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các lỗi tính toán cần đặc biệt lưu ý:**
> * **Lỗi chia cho 0 (`ZeroDivisionError`)**: Bất kỳ phép chia thường `/`, chia lấy nguyên `//`, hay chia lấy dư `%` với số chia là `0` đều làm sập chương trình ngay lập tức. Hãy đảm bảo số chia luôn khác 0.
> * **Thứ tự ưu tiên toán tử**: Python tuân thủ quy tắc toán học (Nhân chia trước, cộng trừ sau). Dùng cặp ngoặc đơn `()` để ép nhóm tính toán trước. Ví dụ: `(a + b) / 2` để tính trung bình cộng, viết `a + b / 2` sẽ ra kết quả sai.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Kết quả của phép toán `7 % 3` và `7 // 3` trong Python lần lượt là gì?
* [ ] `1` và `2.33`
* [ ] `2` và `1`
* [x] `1` và `2`
* [ ] `2` và `2`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây dùng để tính trung bình cộng của 2 số `8` và `4`. Tuy nhiên kết quả in ra màn hình lại là `10.0` thay vì `6.0`. Hãy tìm lỗi sai và sửa lại:
```python
# Sửa lại đoạn code tính trung bình cộng dưới đây:
a = 8
b = 4
trung_binh = a + b / 2
print(trung_binh)
```

### Bài tập lập trình (Mini-task)
Một nhóm bạn gồm `4` người đi ăn pizza hết tổng cộng `350000` đồng. Hãy viết chương trình tính:
1. Số tiền mỗi người phải trả khi chia đều (lưu vào biến `so_tien_moi_nguoi`).
2. Số tiền lẻ còn dư không thể chia đều (lưu vào biến `so_tien_du`).
In cả hai giá trị biến này ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* ➕ Dùng `+`, `-`, `*`, `/` cho các phép toán cộng, trừ, nhân, chia cơ bản.
* 🧩 Dùng `//` để lấy phần nguyên và `%` để lấy phần dư của phép chia.
* ⚡ Dùng `**` để tính lũy thừa một cách nhanh chóng.

Trong bài học tiếp theo **[LS-01.07: Toán tử gán và Cập nhật biến]**, chúng ta sẽ khám phá cách viết tắt các phép tính số học này trực tiếp lên chính biến đó để code ngắn gọn hơn.
