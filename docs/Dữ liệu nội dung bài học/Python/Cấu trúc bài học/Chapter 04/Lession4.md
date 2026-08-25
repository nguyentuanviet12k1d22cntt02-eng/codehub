---
lessonId: "LS-02.04"
title: "Toán tử Logic kết hợp"
difficulty: "MEDIUM"
estimatedDuration: 30
keywords: ["logical operators", "and", "or", "not", "nested if", "python basics"]
prerequisites: ["LS-02.03"]
---

# 📘 Lesson 02.04: Toán tử Logic kết hợp

---

## 1. Khái niệm & Vấn đề

Trong lập trình thực tế, các quyết định rẽ nhánh thường phụ thuộc vào sự kết hợp của nhiều điều kiện đồng thời:
* Bạn được đi nghĩa vụ quân sự khi: đủ tuổi **VÀ** có sức khỏe đạt chuẩn.
* Bạn được giảm giá vé xe bus khi: là học sinh **HOẶC** là người cao tuổi.

Để kết hợp các điều kiện so sánh lại với nhau, Python cung cấp ba **Toán tử Logic (Logical Operators)** cốt lõi: `and`, `or`, và `not`.

| Toán tử | Ý nghĩa logic | Quy tắc trả về kết quả | Phép ẩn dụ thực tế |
| :---: | :--- | :--- | :--- |
| **`and`** | Phép VÀ | Trả về `True` nếu **tất cả** các vế đều Đúng. | Giống như **khóa cửa 2 ổ**: phải có cả 2 chìa thì mới mở được cửa. |
| **`or`** | Phép HOẶC | Trả về `True` nếu có **ít nhất một** vế Đúng. | Giống như **nhà có 2 cửa**: chỉ cần 1 trong 2 cửa mở là bạn vào được. |
| **`not`** | Phép PHỦ ĐỊNH | Đảo ngược trạng thái: Đúng thành Sai, Sai thành Đúng. | Giống như **công tắc đảo chiều**: bật thành tắt, tắt thành bật. |

---

## 2. Cú pháp & Vận hành

Hãy xem cách các toán tử logic được sử dụng để lọc điều kiện:

```python
tuoi = 20
co_suc_khoe = True
if tuoi >= 18 and co_suc_khoe:
    print("Đủ điều kiện nhập ngũ.")

la_hoc_sinh = True
la_nguoi_cao_tuoi = False
if la_hoc_sinh or la_nguoi_cao_tuoi:
    print("Được giảm giá vé!")
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `tuoi = 20` | `tuoi: 20` | Khởi tạo biến `tuoi` |
| 2 | `co_suc_khoe = True` | `co_suc_khoe: True` | Khởi tạo biến `co_suc_khoe` |
| 3 | `if tuoi >= 18 and co_suc_khoe:` | `tuoi: 20`, `co_suc_khoe: True` | Đánh giá `20 >= 18` ➔ `True`, `co_suc_khoe` ➔ `True`. Kết quả phép `and` là `True` ➔ chạy khối lệnh con. |
| 4 | `print("Đủ điều...")` | | In dòng chữ "Đủ điều kiện nhập ngũ." |

**Bảng chân trị rút gọn:**
```text
True  and True  ───────► True           True  or False ───────► True
True  and False ───────► False          False or False ───────► False
not True        ───────► False          not False      ───────► True
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các lỗi logic thường gặp:**
> * **Nhầm lẫn giữa `and` và `or` trong khoảng giá trị**:
>   * Để kiểm tra nhiệt độ `t` nằm **trong khoảng** 20 đến 30 độ C, bạn phải dùng `and`: `t > 20 and t < 30`.
>   * Nếu dùng `or` (`t > 20 or t < 30`), biểu thức sẽ luôn trả về `True` với mọi nhiệt độ (ví dụ: `t = 15` tuy không lớn hơn 20 nhưng lại nhỏ hơn 30, thỏa mãn vế sau nên biểu thức vẫn Đúng).
> * **Thứ tự ưu tiên logic**:
>   * Quy tắc ưu tiên: Toán tử so sánh ➔ `not` ➔ `and` ➔ `or`.
>   * *Lời khuyên:* Hãy luôn sử dụng dấu ngoặc đơn `()` để gom nhóm các điều kiện rõ ràng để tránh lỗi chạy sai thứ tự ưu tiên ngoài ý muốn.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Giá trị trả về của biểu thức `not (5 > 3 or 2 > 10)` trong Python là gì?
* [ ] `True`
* [x] `False`
* [ ] `None`
* [ ] Báo lỗi SyntaxError

### Thử thách sửa lỗi (Debug)
Đoạn code sau muốn kiểm tra xem nhiệt độ có nằm trong khoảng lý tưởng từ 20 đến 30 độ C hay không. Tuy nhiên, nó đang bị lỗi logic khiến nhiệt độ nào cũng được coi là lý tưởng. Hãy tìm và sửa lỗi:
```python
# Sửa lại đoạn code kiểm tra nhiệt độ dưới đây:
temp = 35
if temp > 20 or temp < 30:
    print("Nhiệt độ lý tưởng")
else:
    print("Nhiệt độ không lý tưởng")
```

### Bài tập lập trình (Mini-task)
Khai báo 3 biến: `co_the_thanh_vien = True`, `la_cuoi_tuan = True`, và `hoa_don = 250000`. Viết câu lệnh `if` kiểm tra điều kiện để được giảm giá:
* Khách hàng được giảm giá nếu: Có thẻ thành viên **và** hóa đơn lớn hơn `200000` đồng, **hoặc** khách hàng có thẻ thành viên nhưng đi mua sắm vào ngày cuối tuần.
* Nếu thỏa mãn điều kiện, hãy in ra dòng chữ `"Được giảm giá 10%!"`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🤝 Dùng `and` để kết hợp khi tất cả các điều kiện bắt buộc phải Đúng cùng lúc.
* 🚪 Dùng `or` khi chỉ cần ít nhất một trong các điều kiện Đúng.
* 🔄 Dùng `not` để phủ định và đảo ngược trạng thái logic của biểu thức.

Trong chương tiếp theo **[Chapter 05: Cấu trúc lặp]**, chúng ta sẽ học cách tự động hóa những công việc lặp đi lặp lại nhiều lần bằng các vòng lặp thông minh `while` và `for`.
