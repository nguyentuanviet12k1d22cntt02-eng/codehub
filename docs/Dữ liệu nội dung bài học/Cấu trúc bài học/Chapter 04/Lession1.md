---
lessonId: "LS-02.01"
title: "Biểu thức Logic & Toán tử so sánh"
difficulty: "BASIC"
estimatedDuration: 20
keywords: ["logic expression", "boolean expression", "comparison operators", "python basics"]
prerequisites: ["LS-01.07"]
---

# 📘 Lesson 02.01: Biểu thức Logic & Toán tử so sánh

---

## 1. Khái niệm & Vấn đề

Để máy tính có thể tự đưa ra quyết định thông minh (ví dụ: ví tiền có đủ để mua hàng không, mật khẩu nhập vào có khớp không), nó cần có khả năng so sánh các giá trị dữ liệu với nhau. 

Kết quả của một phép so sánh luôn là một giá trị logic Đúng (`True`) hoặc Sai (`False`) - được gọi là **Biểu thức Logic (Boolean Expression)**. Để thực hiện so sánh, Python cung cấp các **Toán tử so sánh (Comparison Operators)**.

| Toán tử | Ý nghĩa so sánh | Ví dụ | Kết quả |
| :---: | :--- | :--- | :--- |
| `==` | So sánh bằng | `5 == 5` | `True` |
| `!=` | So sánh khác (không bằng) | `5 != 3` | `True` |
| `>` | Lớn hơn | `5 > 8` | `False` |
| `<` | Nhỏ hơn | `5 < 8` | `True` |
| `>=` | Lớn hơn hoặc bằng | `5 >= 5` | `True` |
| `<=` | Nhỏ hơn hoặc bằng | `5 <= 3` | `False` |

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Biểu thức Logic** | Một biểu thức toán học hoặc logic chỉ trả về kết quả Đúng (`True`) hoặc Sai (`False`). | Giống như câu hỏi **Đúng/Sai** khi qua cửa an ninh: "Vé của bạn có hợp lệ không?". Câu trả lời chỉ là Có hoặc Không. |

---

## 2. Cú pháp & Vận hành

Chúng ta so sánh hai giá trị hoặc hai biến trực tiếp và có thể lưu kết quả so sánh đó vào một biến Boolean:

```python
tuoi = 18
du_tuoi_bau_cu = (tuoi >= 18)
print(du_tuoi_bau_cu)

diem = 7.5
dat_diem_tuyet_doi = (diem == 10.0)
print(dat_diem_tuyet_doi)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `tuoi = 18` | `tuoi: 18` | Khởi tạo biến `tuoi` |
| 2 | `du_tuoi_bau_cu = (tuoi >= 18)` | `du_tuoi_bau_cu: True` | So sánh `18 >= 18` (Đúng) và gán `True` vào biến |
| 4 | `diem = 7.5` | `diem: 7.5` | Khởi tạo biến `diem` |
| 5 | `dat_diem_tuyet_doi = (diem == 10.0)` | `dat_diem_tuyet_doi: False` | So sánh `7.5 == 10.0` (Sai) và gán `False` vào biến |

**Biểu diễn logic trong bộ nhớ:**
```text
[tuoi (18)]         >=  18  ───────►  True  (bool)
[diem (7.5)]        ==  10  ───────►  False (bool)
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi cực kỳ phổ biến của người mới học:**
> * **Nhầm lẫn giữa `=` và `==`**:
>   * Dấu `=` là phép gán (ví dụ: `x = 5` gán giá trị 5 vào biến `x`).
>   * Dấu `==` là phép so sánh bằng (ví dụ: `x == 5` kiểm tra xem `x` có bằng 5 hay không).
>   * Viết nhầm `x = 5` trong biểu thức so sánh sẽ báo lỗi cú pháp `SyntaxError` hoặc dẫn đến lỗi logic nghiêm trọng.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Kết quả của biểu thức `15 != 15` trong Python là gì?
* [ ] `True`
* [x] `False`
* [ ] `None`
* [ ] Báo lỗi SyntaxError

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây dùng để kiểm tra mật khẩu người dùng nhập vào có đúng không. Tuy nhiên nó bị lỗi cú pháp. Hãy tìm lỗi và sửa lại:
```python
# Sửa lại đoạn code so sánh mật khẩu dưới đây:
mat_khau_dung = "mcode123"
mat_khau_nhap = "mcode123"
hop_le = (mat_khau_nhap = mat_khau_dung)
print(hop_le)
```

### Bài tập lập trình (Mini-task)
Hãy khai báo hai biến `nhiet_do = 38.5` và `nhiet_do_binh_thuong = 37.0`. Hãy tạo biểu thức so sánh kiểm tra xem `nhiet_do` có lớn hơn `nhiet_do_binh_thuong` hay không và lưu kết quả vào biến `is_sot`. In giá trị của biến `is_sot` ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* ⚖️ Toán tử so sánh (`==`, `!=`, `>`, `<`, `>=`, `<=`) dùng để đối chiếu hai giá trị dữ liệu.
* 💡 Kết quả của biểu thức so sánh luôn là một giá trị Boolean: `True` hoặc `False`.

Trong bài học tiếp theo **[LS-02.02: Khái niệm rẽ nhánh và Lệnh if]**, chúng ta sẽ học cách điều khiển máy tính chạy các đoạn code khác nhau dựa trên kết quả của biểu thức so sánh này.
