---
lessonId: "LS-03.02"
title: "Cắt chuỗi (Slicing)"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["string", "slicing", "substring", "step"]
prerequisites: ["LS-03.01"]
---

# 📘 Lesson 03.02: Cắt chuỗi (Slicing)

---

## 1. Khái niệm & Vấn đề

Nếu như Đánh chỉ số (Indexing) giúp ta lấy ra **một ký tự duy nhất**, thì trong thực tế, ta thường cần trích xuất một **phần của chuỗi** (chuỗi con - substring). Ví dụ: lấy ra mã vùng từ số điện thoại (3 số đầu), lấy ra phần mở rộng của một file (như `.jpg`, `.png`), hoặc đảo ngược cả một chuỗi.

Trong Python, thao tác này gọi là **Cắt chuỗi (Slicing)**, cho phép lấy ra một phần chuỗi bằng cách chỉ ra vị trí bắt đầu, vị trí kết thúc và khoảng cách bước nhảy.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Slicing (Cắt lát)** | Trích xuất một chuỗi con từ chuỗi ban đầu theo khoảng chỉ số xác định. | Giống như **cắt một ổ bánh mì**. Bạn chọn vị trí dao bắt đầu cắt và vị trí dừng lại để lấy lát bánh. |

---

## 2. Cú pháp & Vận hành

Cú pháp cắt chuỗi đầy đủ:
`chuoi[start:stop:step]`

Trong đó:
* `start`: Chỉ số bắt đầu (mặc định là `0` nếu để trống).
* `stop`: Chỉ số kết thúc (mặc định là hết chuỗi nếu để trống). **Lưu ý: Không lấy ký tự tại vị trí `stop` (chạy đến `stop - 1`)**.
* `step`: Bước nhảy (mặc định là `1` nếu để trống). Nếu `step` là số âm, chuỗi sẽ được duyệt ngược lại.

```python
s = "LEARNPYTHON"
sub1 = s[0:5]    # Lấy từ chỉ số 0 đến 4
sub2 = s[5:]     # Lấy từ chỉ số 5 đến hết chuỗi
sub3 = s[::-1]   # Đảo ngược toàn bộ chuỗi
print(sub1)
print(sub2)
print(sub3)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `s = "LEARNPYTHON"` | `s: "LEARNPYTHON"` | Khởi tạo chuỗi |
| 2 | `sub1 = s[0:5]` | `sub1: "LEARN"` | Cắt chuỗi từ chỉ số `0` đến `4` |
| 3 | `sub2 = s[5:]` | `sub2: "PYTHON"` | Cắt chuỗi từ chỉ số `5` đến cuối cùng |
| 4 | `sub3 = s[::-1]` | `sub3: "NOHTYPNRAEL"` | Đảo ngược chuỗi nhờ bước nhảy `-1` |

---

## 3. Lỗi thường gặp & Tối ưu

> [!IMPORTANT]
> **Quy tắc biên bên phải (`stop`):**
> Cắt chuỗi trong Python tuân theo quy tắc nửa khoảng `[start, stop)`. Nghĩa là ký tự tại chỉ số `stop` **không bao giờ** nằm trong kết quả.
> *Ví dụ:* Muốn cắt lấy chữ `"LEARN"` (chỉ số `0, 1, 2, 3, 4`), bạn phải viết là `s[0:5]` chứ không phải `s[0:4]`.
>
> [!TIP]
> **Bỏ qua lỗi chỉ số:**
> Khác với Indexing, Slicing trong Python rất "bao dung". Nếu chỉ số `start` hoặc `stop` vượt quá độ dài chuỗi, Python sẽ tự động điều chỉnh về biên mà không báo lỗi `IndexError`.
> *Ví dụ:* `s[0:100]` với chuỗi `"HELLO"` vẫn chạy bình thường và trả về `"HELLO"`.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Cho chuỗi `filename = "image.png"`. Cách cắt nào sau đây giúp lấy ra phần mở rộng `"png"`?
* [ ] `filename[5:7]`
* [x] `filename[6:]`
* [ ] `filename[-3:-1]`
* [ ] `filename[6:8]`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn in ra 3 ký tự đầu tiên của chuỗi `s` nhưng kết quả hiển thị bị sai. Hãy tìm lỗi và sửa lại:
```python
s = "Python"
# Đoạn code lỗi:
print(s[0:2])

# Kết quả mong muốn: "Pyt"
```

### Bài tập lập trình (Mini-task)
Khai báo biến `code = "MCODE-2026-ACTIVE"`. Hãy cắt chuỗi để lấy ra phần năm `"2026"` và gán vào biến `year`, sau đó in ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* ✂️ Cắt chuỗi dùng cú pháp `[start:stop:step]`.
* 🚫 Biên phải `stop` **không** được tính vào chuỗi con kết quả.
* 🔄 Dùng bước nhảy âm `[::-1]` là cách nhanh nhất để đảo ngược chuỗi trong Python.

Trong bài học tiếp theo **[LS-03.03: Các phương thức chuỗi phổ biến]**, chúng ta sẽ khám phá các công cụ tích hợp sẵn của Python để biến đổi chữ hoa chữ thường, tìm kiếm và thay thế nội dung trong chuỗi.
