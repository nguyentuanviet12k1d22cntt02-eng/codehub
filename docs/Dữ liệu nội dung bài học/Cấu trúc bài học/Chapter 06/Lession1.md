---
lessonId: "LS-03.01"
title: "Chuỗi như một Mảng: Indexing"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["string", "indexing", "sequence", "char"]
prerequisites: ["LS-01.05"]
---

# 📘 Lesson 03.01: Chuỗi như một Mảng: Indexing

---

## 1. Khái niệm & Vấn đề

Khi làm việc với văn bản (ví dụ: tên đăng nhập, chuỗi mật khẩu), ta thường cần trích xuất một ký tự cụ thể (như ký tự đầu tiên để viết hoa, ký tự cuối cùng để kiểm tra định dạng). Nếu chỉ coi chuỗi là một khối văn bản liền mạch, ta sẽ không thể truy cập vào từng phần tử bên trong nó.

Trong Python, chuỗi (`str`) là một **cấu trúc tuần tự** gồm các ký tự được xếp cạnh nhau. Mỗi vị trí trong chuỗi được đánh dấu bằng một số nguyên gọi là **chỉ số (index)**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Indexing (Đánh chỉ số)** | Hành động truy cập trực tiếp vào một ký tự trong chuỗi bằng vị trí số nguyên của nó. | Giống như **số phòng trong khách sạn**. Tên khách sạn là chuỗi, số phòng là chỉ số để tìm khách. |

Python hỗ trợ hai hệ thống chỉ số:
1. **Chỉ số dương (Positive Index):** Đi từ trái sang phải, bắt đầu từ `0` đến `độ dài - 1`.
2. **Chỉ số âm (Negative Index):** Đi từ phải sang trái, bắt đầu từ `-1` đến `-độ dài`.

---

## 2. Cú pháp & Vận hành

Để lấy một ký tự tại vị trí `index`, ta viết tên biến chuỗi kèm dấu ngoặc vuông `[index]`:

```python
s = "PYTHON"
char_first = s[0]
char_last = s[-1]
print(char_first)
print(char_last)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `s = "PYTHON"` | `s: "PYTHON"` | Tạo chuỗi `s` trong RAM |
| 2 | `char_first = s[0]` | `char_first: "P"` | Lấy ký tự tại chỉ số `0` (ký tự đầu tiên) |
| 3 | `char_last = s[-1]` | `char_last: "N"` | Lấy ký tự tại chỉ số `-1` (ký tự cuối cùng) |

**Sơ đồ chỉ số của chuỗi "PYTHON":**
```text
 Chỉ số dương:    0    1    2    3    4    5
               ┌───┬───┬───┬───┬───┬───┐
 Ký tự:        │ P │ Y │ T │ H │ O │ N │
               └───┴───┴───┴───┴───┴───┘
 Chỉ số âm:     -6   -5   -4   -3   -2   -1
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi `IndexError: string index out of range`:**
> Xảy ra khi bạn cố gắng truy cập vào một chỉ số vượt quá phạm vi giới hạn của chuỗi. 
> *Ví dụ:* Chuỗi `"PYTHON"` có độ dài 6, chỉ số dương cao nhất là `5`. Gọi `s[6]` sẽ báo lỗi ngay lập tức.
>
> **Lỗi gán giá trị (Immutability):**
> Chuỗi trong Python là **bất biến (immutable)**. Bạn không thể thay đổi một ký tự bằng cách gán đè:
> *Ví dụ:* `s[0] = "J"` sẽ gây ra lỗi `TypeError`. Muốn thay đổi, bạn bắt buộc phải tạo chuỗi mới.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Với chuỗi `s = "Lập trình"`, lệnh nào dưới đây trả về ký tự `"L"`?
* [x] `s[0]`
* [ ] `s[1]`
* [ ] `s[-1]`
* [ ] `s[9]`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn thay đổi ký tự đầu tiên của chuỗi `name` thành `"J"` nhưng bị lỗi. Hãy sửa lại:
```python
# Đoạn code lỗi:
name = "Tony"
name[0] = "J"
print(name)

# Sửa lại thành (Gợi ý: Tạo chuỗi mới bằng cách nối ký tự):
```

### Bài tập lập trình (Mini-task)
Khai báo biến `username = "PythonStudent"`. Hãy in ra màn hình ký tự đầu tiên và ký tự cuối cùng của chuỗi này trên 2 dòng riêng biệt.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📍 Chỉ số (Index) trong Python bắt đầu từ **`0`** (dương) hoặc **`-1`** (âm).
* 🔒 Chuỗi là **bất biến** (Immutable), không thể sửa trực tiếp từng ký tự.
* ⚠️ Hãy luôn chú ý độ dài của chuỗi để tránh lỗi **`IndexError`**.

Trong bài học tiếp theo **[LS-03.02: Cắt chuỗi (Slicing)]**, chúng ta sẽ học cách trích xuất cả một cụm từ hoặc một phần của chuỗi thay vì chỉ một ký tự đơn lẻ.
