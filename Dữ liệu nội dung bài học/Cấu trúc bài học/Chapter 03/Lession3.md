---
lessonId: "LS-01.10"
title: "Ép kiểu dữ liệu (Type Casting)"
difficulty: "BASIC"
estimatedDuration: 25
keywords: ["type casting", "type conversion", "int()", "float()", "str()", "python basics"]
prerequisites: ["LS-01.09"]
---

# 📘 Lesson 01.10: Ép kiểu dữ liệu (Type Casting)

---

## 1. Khái niệm & Vấn đề

Như đã biết, dữ liệu nhận về từ hàm `input()` luôn luôn là kiểu chuỗi ký tự (`str`). Khi người dùng nhập tuổi là `18`, Python sẽ lưu dưới dạng chuỗi `"18"`. Việc thực hiện phép toán cộng `"18" + 1` sẽ báo lỗi ngay lập tức vì Python không thể cộng một chuỗi chữ với một số nguyên.

Để xử lý bài toán này, chúng ta cần chuyển đổi giá trị chuỗi đó thành số nguyên thực sự trước khi tính toán. Quá trình chuyển đổi chủ động một giá trị từ kiểu dữ liệu này sang kiểu dữ liệu khác được gọi là **Ép kiểu dữ liệu (Type Casting)**.

Python cung cấp 3 hàm ép kiểu cơ bản và phổ biến nhất:
* **`int(x)`**: Chuyển đổi `x` thành số nguyên.
* **`float(x)`**: Chuyển đổi `x` thành số thực.
* **`str(x)`**: Chuyển đổi `x` thành chuỗi ký tự.

| Khái niệm | Định nghĩa | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Ép kiểu dữ liệu (Type Casting)** | Việc chuyển đổi thủ công một giá trị từ kiểu dữ liệu này sang kiểu dữ liệu khác bằng các hàm dựng sẵn. | Giống như **tái chế rác thải**: biến một chai nhựa cũ thành các sợi nhựa để dệt thành quần áo mới. |

---

## 2. Cú pháp & Vận hành

Chúng ta bọc biến hoặc giá trị cần ép kiểu bên trong dấu ngoặc đơn của các hàm ép kiểu tương ứng:

```python
tuoi_chuoi = "18"
tuoi_so = int(tuoi_chuoi)
tuoi_nam_sau = tuoi_so + 1
print("Tuổi năm sau:", tuoi_nam_sau)

chieu_cao = float("1.75")
print("Chiều cao thực tế:", chieu_cao)

diem_chuoi = str(9.5)
print("Điểm số dạng văn bản: " + diem_chuoi)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `tuoi_chuoi = "18"` | `tuoi_chuoi: "18"` | Khởi tạo biến chuỗi `tuoi_chuoi` |
| 2 | `tuoi_so = int(tuoi_chuoi)`| `tuoi_so: 18` | Ép chuỗi `"18"` thành số nguyên `18` và gán vào biến |
| 3 | `tuoi_nam_sau = tuoi_so + 1`| `tuoi_nam_sau: 19` | Thực hiện phép cộng số nguyên `18 + 1` |
| 4 | `print("Tuổi năm sau:", ...)`| | In ra màn hình kết quả `Tuổi năm sau: 19` |
| 6 | `chieu_cao = float("1.75")`| `chieu_cao: 1.75` | Ép chuỗi `"1.75"` thành số thực `1.75` và gán vào biến |
| 9 | `diem_chuoi = str(9.5)` | `diem_chuoi: "9.5"` | Ép số thực `9.5` thành chuỗi `"9.5"` và gán vào biến |

**Sơ đồ chuyển đổi:**
```text
"18" (str)      ─── int()   ───► 18 (int)
"1.75" (str)    ─── float() ───► 1.75 (float)
9.5 (float)     ─── str()   ───► "9.5" (str)
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Cảnh báo lỗi ép giá trị không hợp lệ (`ValueError`):**
> * Bạn không thể ép kiểu một chuỗi chứa chữ cái hoặc ký tự đặc biệt sang kiểu số (ví dụ: `int("mcode")` hoặc `float("1.75m")`). Hành động này sẽ gây lỗi sập chương trình `ValueError`.
> * Bạn cũng không thể dùng `int()` để ép kiểu một chuỗi chứa số thập phân trực tiếp (ví dụ: `int("1.75")` sẽ báo lỗi, bạn cần ép qua `float("1.75")` trước rồi mới ép sang `int()`).

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Kết quả hiển thị trên màn hình của câu lệnh `print(int(3.9))` trong Python là gì?
* [ ] `4`
* [x] `3`
* [ ] `3.9`
* [ ] Báo lỗi ValueError

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây nhận chiều cao (đơn vị mét) từ người dùng và cộng thêm `0.1` mét (10cm). Tuy nhiên khi chạy nó bị sập chương trình do lỗi không tương thích kiểu dữ liệu. Hãy sửa lỗi này:
```python
# Sửa lại đoạn code tính chiều cao dưới đây:
chieu_cao_nhap = input("Nhập chiều cao của bạn (mét): ")
chieu_cao_moi = chieu_cao_nhap + 0.1
print("Chiều cao sau khi cộng thêm 10cm là:", chieu_cao_moi)
```

### Bài tập lập trình (Mini-task)
Hãy viết một chương trình yêu cầu người dùng nhập vào một số nguyên từ bàn phím. Hãy cộng số đó với `100` rồi in kết quả ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🔄 Ép kiểu dữ liệu là chuyển đổi một giá trị từ kiểu dữ liệu này sang kiểu dữ liệu khác.
* 🛠️ Sử dụng `int()`, `float()`, `str()` tùy theo mục đích tính toán hoặc ghép chuỗi văn bản.

Trong chương tiếp theo **[Chapter 04: Cấu trúc rẽ nhánh]**, chúng ta sẽ học cách điều khiển chương trình đưa ra các quyết định rẽ nhánh tự động dựa trên các giá trị so sánh thu được.
