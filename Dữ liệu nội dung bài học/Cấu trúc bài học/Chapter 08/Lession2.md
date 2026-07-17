---
lessonId: "LS-03.11"
title: "Dictionary: Cấu trúc Key-Value"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["dictionary", "key-value", "mapping", "curly braces"]
prerequisites: ["LS-03.05"]
---

# 📘 Lesson 03.11: Dictionary: Cấu trúc Key-Value

---

## 1. Khái niệm & Vấn đề

Khi cần lưu thông tin chi tiết của một học sinh bao gồm: Tên, Tuổi, Điểm trung bình. Nếu dùng List, ta phải quy ước ngầm: index `0` là tên, index `1` là tuổi, index `2` là điểm:
`student = ["Minh", 16, 8.5]`
Cách làm này rất dễ gây nhầm lẫn nếu danh sách thay đổi thứ tự hoặc tăng thêm thông tin. Nó cũng không trực quan vì ta phải nhớ ý nghĩa của từng chỉ số index số nguyên.

Để lưu trữ thông tin thực tế dạng đối tượng có cấu trúc rõ ràng, Python cung cấp kiểu dữ liệu **Dictionary (Từ điển - viết tắt là Dict)**. Dictionary liên kết thông tin dưới dạng các cặp **khóa - giá trị (Key-Value)**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Dictionary (Từ điển)** | Một cấu trúc dữ liệu có thể thay đổi (mutable), lưu trữ dữ liệu dạng ánh xạ giữa khóa (Key) duy nhất và giá trị (Value) tương ứng. | Giống như một **danh bạ điện thoại**. Tên người là **Key** (không trùng nhau), số điện thoại là **Value** tương ứng cần tìm kiếm. |

---

## 2. Cú pháp & Vận hành

Dictionary sử dụng cặp ngoặc nhọn `{}`. Mỗi phần tử là một cặp `key: value`, phân cách nhau bởi dấu phẩy `,`:
`ten_dict = {key_1: value_1, key_2: value_2, ...}`

* **Key (Khóa):** Phải là duy nhất (không được trùng lặp) và thuộc kiểu dữ liệu bất biến (như chuỗi, số).
* **Value (Giá trị):** Có thể trùng lặp, thuộc bất kỳ kiểu dữ liệu nào (số, chuỗi, danh sách...).
* **Truy xuất:** Thay vì dùng chỉ số index số nguyên `0, 1, 2`, ta truy cập bằng chính **Key** của nó: `dict[key]`.

```python
# Khởi tạo dictionary
hoc_sinh = {
    "ten": "Minh",
    "tuoi": 16,
    "diem": 8.5
}

# Truy xuất giá trị qua Key
print(hoc_sinh["ten"])  # Kết quả: Minh
print(hoc_sinh["diem"]) # Kết quả: 8.5
```

**Bảng so sánh List và Dictionary:**
| Đặc trưng | List `[]` | Dictionary `{}` |
| :--- | :--- | :--- |
| **Chỉ số truy cập** | Index dạng số nguyên `0, 1, 2...` | Key tự định nghĩa (chuỗi, số...) |
| **Độ độc bản** | Cho phép trùng lặp phần tử | Key phải là duy nhất |
| **Tốc độ tra cứu** | Chậm hơn đối với danh sách lớn | Cực kỳ nhanh, không phụ thuộc kích thước dữ liệu |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi `KeyError`:**
> Xảy ra khi bạn cố gắng truy cập vào một Key không hề tồn tại trong Dictionary.
> *Ví dụ:* `print(hoc_sinh["email"])` sẽ sập chương trình ngay do Key `"email"` chưa được định nghĩa.
> 
> **Quy tắc đè Key trùng:**
> Nếu bạn cố tình khai báo hai cặp trùng Key, Python sẽ tự lấy giá trị của cặp khai báo sau cùng làm giá trị chính thức (giá trị cũ bị ghi đè).

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để truy cập lấy giá trị `"Hà Nội"` từ từ điển `capital = {"Vietnam": "Hà Nội", "Japan": "Tokyo"}`, câu lệnh nào sau đây là đúng?
* [ ] `capital[0]`
* [x] `capital["Vietnam"]`
* [ ] `capital["Hà Nội"]`
* [ ] `capital.index("Hà Nội")`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây truy xuất thông tin giá cả của sản phẩm sữa nhưng bị lỗi sập chương trình. Hãy sửa lại cho đúng:
```python
menu = {
    "coffee": 30000,
    "tea": 25000
}
# Đoạn code lỗi:
milk_price = menu["milk"]
print(milk_price)
```

### Bài tập lập trình (Mini-task)
Hãy khởi tạo một Dictionary tên là `car` lưu trữ thông tin về một chiếc xe gồm: hãng xe (`brand`) là `"Toyota"`, và năm sản xuất (`year`) là `2020`. In ra màn hình giá trị của hãng xe (`brand`) từ từ điển đó.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🔑 **Dictionary** lưu trữ dữ liệu dưới dạng cặp **Key-Value** trong cặp ngoặc nhọn `{}`.
* 🛡️ **Key** phải là duy nhất và không đổi, được dùng thay thế cho chỉ số index số nguyên để tra cứu.
* ⚠️ Cẩn thận lỗi **`KeyError`** khi gọi Key không tồn tại.

Trong bài học tiếp theo **[LS-03.12: Thao tác trên Dictionary]**, chúng ta sẽ học cách thêm, sửa, xóa các cặp Key-Value động và cách duyệt qua một từ điển bằng vòng lặp.
