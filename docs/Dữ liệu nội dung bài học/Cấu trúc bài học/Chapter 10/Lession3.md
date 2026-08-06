---
lessonId: "LS-04.07"
title: "Luồng Finally và Ném lỗi chủ động"
difficulty: "MEDIUM"
estimatedDuration: 20
keywords: ["finally", "raise", "custom error", "resource cleanup"]
prerequisites: ["LS-04.06"]
---

# 📘 Lesson 04.07: Luồng Finally và Ném lỗi chủ động

---

## 1. Khái niệm & Vấn đề

Khi lập trình các tác vụ hệ thống (như mở file ghi nhật ký, kết nối cơ sở dữ liệu), chương trình sẽ chiếm dụng tài nguyên của máy tính. Nếu trong lúc đọc ghi dữ liệu xảy ra lỗi và chương trình thoát đột ngột khỏi hàm, các kết nối hay file đó có thể mãi mãi bị kẹt ở trạng thái mở, gây lãng phí tài nguyên và rò rỉ bộ nhớ (memory leak). Ta cần một cơ chế để **chắc chắn dọn dẹp** các tài nguyên này dù lỗi có xảy ra hay không.

Mặt khác, trong một số nghiệp vụ, dữ liệu đầu vào đúng kiểu nhưng lại sai về mặt logic thực tế (ví dụ: tuổi là số nguyên nhưng có giá trị âm `-5`, hoặc điểm số lớn hơn `10`). Python không coi đây là lỗi hệ thống, nhưng chúng ta cần chương trình phát hiện và **ném lỗi chủ động** để cảnh báo.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **`finally`** | Khối mã lệnh **luôn luôn được thực thi** sau khi thoát khỏi các khối `try` và `except`, bất kể có lỗi xảy ra hay không. | Giống như việc bạn **mượn sách ở thư viện**. Dù bạn đọc xong cuốn sách hay làm rách (gây lỗi), bạn **vẫn bắt buộc phải trả thẻ thư viện** trước khi ra về. |
| **`raise`** | Từ khóa dùng để chủ động kích hoạt và ném ra một ngoại lệ cụ thể nhằm ngắt luồng xử lý không hợp lệ. | Giống như trọng tài **thổi còi phạt thẻ đỏ** khi cầu thủ phạm lỗi thô bạo trên sân cỏ, dù luật bóng vật lý không cấm hành động đó. |

---

## 2. Cú pháp & Vận hành

```python
def check_age(age):
    if age < 0:
        # Chủ động ném lỗi nếu tuổi âm
        raise ValueError("Tuổi không được là số âm!")
    print(f"Tuổi hợp lệ: {age}")

try:
    check_age(-5)
except ValueError as error:
    print(f"Bắt được lỗi: {error}")
finally:
    # Luôn luôn chạy dù có lỗi hay không
    print("Hoàn thành quy trình kiểm tra.")
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái / Biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 7 | `try:` | Giám sát ngoại lệ | Vào khối try |
| 8 | `check_age(-5)` | Nhảy vào hàm `check_age` | Gọi hàm với `age = -5` |
| 2-3 | `if age < 0:` | Điều kiện thỏa mãn | Kích hoạt `raise ValueError(...)` |
| 9 | `except ValueError as error:` | Bắt lỗi gán vào biến `error` | In thông báo: `Bắt được lỗi: Tuổi không được...` |
| 11-12 | `finally:` | Chạy khối dọn dẹp cuối | In thông báo: `Hoàn thành quy trình kiểm tra.` |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Nhầm lẫn giữa `finally` và code đứng ngoài khối `try-except`:**
> Người mới thường hỏi: *"Tại sao phải dùng finally khi ta có thể viết lệnh in bình thường ở bên dưới khối try-except?"*
> *Giải thích:* Nếu trong khối `except` lại xảy ra một lỗi mới không được bắt giữ, hoặc có lệnh `return` thoát hàm đột ngột bên trong `try`, các dòng code nằm ngoài khối sẽ **bị bỏ qua hoàn toàn**. Trong khi đó, khối **`finally`** vẫn được hệ thống ưu tiên chạy trước khi thoát.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Khối lệnh đặt bên trong từ khóa nào sau đây **luôn luôn được thực thi** bất kể chương trình có xảy ra ngoại lệ (lỗi) hay không?
* [ ] `try`
* [ ] `except`
* [x] `finally`
* [ ] `raise`

### Thử thách sửa lỗi (Debug)
Đoạn code dưới đây muốn kiểm tra số tiền rút từ tài khoản. Nếu số tiền lớn hơn số dư hiện có (`balance = 100`), chương trình cần ném lỗi chủ động. Tuy nhiên đang viết sai từ khóa kích hoạt lỗi. Hãy sửa lại:
```python
balance = 100
withdraw = 150

# Đoạn code lỗi:
if withdraw > balance:
    throw ValueError("Số dư không đủ để rút tiền!")
```

### Bài tập lập trình (Mini-task)
Hãy viết hàm `tinh_thuong(diem)` nhận vào điểm số. Nếu điểm lớn hơn `10` hoặc nhỏ hơn `0`, hãy dùng lệnh `raise ValueError("Điểm không hợp lệ")`. Bao bọc lệnh gọi hàm bằng `try-except-finally` để in ra lỗi nếu có và luôn in ra chữ `"Kết thúc"` trong khối `finally`.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🧹 Khối **`finally`** là nơi lý tưởng để giải phóng tài nguyên (đóng file, ngắt kết nối mạng) vì nó luôn luôn được chạy.
* 🛑 Sử dụng từ khóa **`raise`** để chủ động phát hiện dữ liệu phi logic và ném lỗi ngăn chặn hệ thống xử lý sai.

Trong bài học tiếp theo **[LS-04.08: Khái niệm Module và Lệnh Import]**, chúng ta sẽ học cách chia nhỏ chương trình thành các file mã nguồn độc lập (Module) để quản lý mã nguồn sạch sẽ, khoa học hơn.
