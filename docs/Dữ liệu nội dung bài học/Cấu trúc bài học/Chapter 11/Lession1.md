---
lessonId: "LS-04.08"
title: "Khái niệm Module và Lệnh Import"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["module", "import", "from import", "reusability", "namespace"]
prerequisites: ["LS-04.01"]
---

# 📘 Lesson 04.08: Khái niệm Module và Lệnh Import

---

## 1. Khái niệm & Vấn đề

Khi dự án của bạn phát triển lớn (ví dụ: xây dựng một game), việc nhét tất cả hàng nghìn dòng code bao gồm logic game, tính điểm, vẽ đồ họa, xử lý âm thanh vào trong **một file duy nhất** sẽ biến file đó thành một mớ hỗn độn (spaghetti code), cực kỳ khó đọc và không thể làm việc nhóm.

Để tổ chức mã nguồn chuyên nghiệp, ta cần tách các nhóm tính năng riêng biệt ra thành các file độc lập. Trong Python, mỗi file `.py` được gọi là một **Module**. Ta có thể triệu gọi và sử dụng lại các hàm, biến từ module này sang module khác bằng lệnh **`import`**.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Module** | Một file chứa mã nguồn Python (hàm, lớp, biến) có thể được tái sử dụng trong các file Python khác. | Giống như một **mảnh ghép Lego** chuyên biệt (mảnh bánh xe, mảnh động cơ). Mỗi mảnh nằm riêng và được lắp ghép vào robot chính khi cần. |
| **Import** | Hành động nạp nội dung của một module vào file hiện tại để sử dụng. | Giống như việc **gọi thợ sửa ống nước mang hộp đồ nghề đến nhà bạn** để bạn mượn dụng cụ làm việc. |

---

## 2. Cú pháp & Vận hành

Giả sử ta có hai file nằm trong cùng một thư mục:
1. File `calculator.py` (Module bổ trợ):
```python
def add(a, b):
    return a + b
```

2. File `main.py` (Chương trình chính):
Để sử dụng hàm `add` từ module `calculator`, ta có 3 cách `import` phổ biến:

* **Cách 1: Nạp toàn bộ module (Khuyên dùng vì rõ ràng)**
```python
import calculator
result = calculator.add(5, 7)
print(result)
```

* **Cách 2: Nạp cụ thể hàm cần dùng (Gọn gàng)**
```python
from calculator import add
result = add(5, 7) # Không cần viết calculator. ở đầu
print(result)
```

* **Cách 3: Đổi tên định danh khi nạp (Tránh trùng tên)**
```python
import calculator as calc
result = calc.add(5, 7)
print(result)
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi import vòng tròn (Circular Import):**
> Xảy ra khi file A `import` file B, và đồng thời file B cũng `import` ngược lại file A. Hệ thống sẽ bị rối và báo lỗi không tìm thấy định danh.
> *Cách khắc phục:* Hãy thiết kế cấu trúc thư mục rõ ràng, các module bổ trợ độc lập không nên phụ thuộc chéo vào chương trình chính.
>
> **Lạm dụng `from module import *`:**
> Lệnh này sẽ nạp **tất cả** mọi hàm, biến của module vào file hiện tại. Điều này dễ gây xung đột tên biến (ví dụ: hàm `open` của module khác đè lên hàm `open` mặc định của Python) và làm code cực kỳ khó theo dõi nguồn gốc.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để nạp duy nhất hàm `sqrt` từ module toán học `math` vào chương trình, cú pháp nào sau đây là tối ưu nhất?
* [ ] `import math.sqrt`
* [ ] `import sqrt from math`
* [x] `from math import sqrt`
* [ ] `import math as sqrt`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn dùng hàm `choice` trong thư viện ngẫu nhiên `random` để chọn một phần tử ngẫu nhiên trong danh sách. Tuy nhiên chương trình đang báo lỗi `NameError: name 'choice' is not defined`. Hãy sửa lại dòng import:
```python
import random

items = ["Táo", "Cam", "Bưởi"]
# Đoạn code lỗi:
lucky = choice(items)
print(lucky)
```

### Bài tập lập trình (Mini-task)
Hãy viết câu lệnh import để nạp thư viện toán học **`math`** của Python. Sau đó sử dụng hàm tính căn bậc hai `math.sqrt()` để tính căn bậc hai của số `16` và in kết quả ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 📁 Mỗi file `.py` là một **Module** độc lập chứa các hàm và biến có thể tái sử dụng.
* 🛠️ Dùng `import tên_module` hoặc `from tên_module import tên_hàm` để nạp mã nguồn.
* 🏷️ Dùng từ khóa `as` để rút gọn hoặc đổi tên module khi gọi cho thuận tiện.

Trong bài học tiếp theo **[LS-04.09: Khám phá Standard Library]**, chúng ta sẽ khám phá kho tàng các thư viện được cài đặt sẵn cực kỳ hùng hậu của Python như xử lý toán học, ngày tháng, và sinh dữ liệu ngẫu nhiên.
