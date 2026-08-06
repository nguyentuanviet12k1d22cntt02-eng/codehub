---
lessonId: "LS-03.12"
title: "Thao tác trên Dictionary"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["dictionary operations", "get method", "keys", "values", "items", "del"]
prerequisites: ["LS-03.11"]
---

# 📘 Lesson 03.12: Thao tác trên Dictionary

---

## 1. Khái niệm & Vấn đề

Khi xây dựng các tính năng như giỏ hàng hoặc hồ sơ cá nhân, Dictionary cần được cập nhật liên tục: thêm sản phẩm mới vào danh sách, thay đổi số lượng, xóa sản phẩm khỏi giỏ hàng, hoặc hiển thị báo cáo danh sách tất cả các Key và Value hiện có.

Ngoài ra, để tránh việc chương trình bị sập đột ngột do lỗi `KeyError` khi tra cứu các Key chưa có sẵn, Python cung cấp phương thức truy cập an toàn cùng các bộ công cụ duyệt dữ liệu Dictionary mạnh mẽ.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Dictionary Operations (Thao tác Từ điển)** | Các hành động thêm, cập nhật, xóa các cặp Key-Value và duyệt qua cấu trúc ánh xạ của Dictionary. | Giống như việc **quản lý tủ đồ siêu thị**. Bạn có thể cất thêm đồ vào hộc tủ mới, thay thế đồ trong hộc cũ, hoặc dọn sạch một hộc tủ khi khách trả khóa. |

---

## 2. Cú pháp & Vận hành

### Thêm & Cập nhật cặp Key-Value
Nếu Key chưa tồn tại, Python sẽ **thêm mới**. Nếu Key đã có, Python sẽ **ghi đè giá trị mới**:
`ten_dict[key] = gia_tri_moi`

### Truy xuất an toàn với phương thức `get()`
Phương thức `get(key, default_value)` giúp lấy giá trị của Key. Nếu Key không tồn tại, nó sẽ trả về `default_value` (mặc định là `None`) thay vì làm sập chương trình với lỗi `KeyError`.

### Xóa phần tử
* Lệnh `del ten_dict[key]`: Xóa cặp Key-Value tương ứng (báo lỗi nếu Key không tồn tại).
* Phương thức `pop(key)`: Xóa và trả về giá trị của Key đó.

### Các hàm hỗ trợ duyệt Dictionary
* `keys()`: Trả về danh sách tất cả các Khóa.
* `values()`: Trả về danh sách tất cả các Giá trị.
* `items()`: Trả về danh sách các cặp Tuple `(key, value)`.

```python
user = {"id": 101, "role": "member"}

# 1. Thêm & Cập nhật
user["name"] = "Alice"   # Thêm mới
user["role"] = "admin"   # Cập nhật

# 2. Truy cập an toàn
email = user.get("email", "chua_co_email@example.com")

# 3. Duyệt Dictionary bằng items()
for key, val in user.items():
    print(f"{key}: {val}")
```

**Bảng theo dõi thực thi của vòng lặp items() (Execution Trace Table):**
| Vòng lặp số | Giá trị biến `key` | Giá trị biến `val` | Kết quả hiển thị |
|:---:|:---|:---|:---|
| 1 | `"id"` | `101` | `id: 101` |
| 2 | `"role"` | `"admin"` | `role: admin` |
| 3 | `"name"` | `"Alice"` | `name: Alice` |

---

## 3. Lỗi thường gặp & Tối ưu

> [!TIP]
> **Quy tắc vàng khi tra cứu:**
> Hãy luôn dùng phương thức `.get()` thay vì gọi trực tiếp `dict[key]` khi bạn không chắc chắn Key đó có tồn tại hay không. Điều này giúp chương trình hoạt động ổn định và chuyên nghiệp hơn rất nhiều.
> *Ví dụ:*
> `score = student.get("math", 0)` -> Nếu học sinh chưa có điểm toán, biến `score` sẽ tự động nhận giá trị mặc định là `0` thay vì báo lỗi.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để duyệt qua từ điển và lấy ra đồng thời cả **Key** lẫn **Value** của từng phần tử trong vòng lặp `for`, ta nên sử dụng phương thức nào?
* [ ] `keys()`
* [ ] `values()`
* [x] `items()`
* [ ] `get()`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn tăng số lượng mặt hàng `"apple"` thêm 5 đơn vị. Tuy nhiên chương trình bị sập do mặt hàng `"apple"` ban đầu chưa có trong kho (`inventory`). Hãy dùng phương thức `.get()` để sửa lại code sao cho chạy an toàn:
```python
inventory = {
    "banana": 10,
    "orange": 15
}
# Đoạn code lỗi:
inventory["apple"] = inventory["apple"] + 5
print(inventory)
```

### Bài tập lập trình (Mini-task)
Khai báo từ điển `scores = {"Math": 8, "English": 7}`. Hãy thêm môn `"Physics"` với điểm số là `9` vào từ điển, sau đó cập nhật điểm môn `"English"` lên `8`. In từ điển `scores` cuối cùng ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* ➕ Thêm hoặc sửa cặp Key-Value bằng cú pháp gán trực tiếp `dict[key] = value`.
* 🛡️ Phương thức `.get(key, default)` là giải pháp tra cứu an toàn tuyệt đối tránh lỗi sập chương trình.
* 🔁 Dùng `.keys()`, `.values()`, và đặc biệt `.items()` để duyệt qua từ điển một cách linh hoạt.

Chúc mừng bạn đã hoàn thành **Module 03: Cấu trúc dữ liệu cốt lõi**! Bạn đã nắm giữ toàn bộ các công cụ lưu trữ nền tảng nhất của Python. Hãy chuẩn bị bước sang **Module 04: Tái sử dụng & Tổ chức mã nguồn** để học cách đóng gói các đoạn code thành các hàm (Function) chuyên biệt có thể tái sử dụng nhiều lần.
