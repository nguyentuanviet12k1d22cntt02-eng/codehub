---
lessonId: "LS-04.09"
title: "Khám phá Standard Library"
difficulty: "EASY"
estimatedDuration: 15
keywords: ["standard library", "math module", "random module", "datetime module", "built-in batteries"]
prerequisites: ["LS-04.08"]
---

# 📘 Lesson 04.09: Khám phá Standard Library

---

## 1. Khái niệm & Vấn đề

Python nổi tiếng toàn cầu với triết lý **"Batteries Included" (Sẵn sàng pin sử dụng)**. Điều này nghĩa là ngay khi bạn cài đặt Python, bạn đã sở hữu một kho tàng khổng lồ các thư viện chuẩn (Standard Library) giải quyết hầu hết mọi tác vụ lập trình thông dụng mà không cần phải cài đặt thêm bất kỳ phần mềm hay thư viện bên thứ ba nào từ Internet.

Từ các tác vụ toán học nâng cao, xử lý thời gian thực tế, cho đến các hàm sinh số ngẫu nhiên phục vụ lập trình trò chơi hay mô phỏng.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Standard Library (Thư viện chuẩn)** | Tập hợp các module được cài đặt sẵn cùng với trình biên dịch Python, cung cấp các tính năng lập trình hệ thống cốt lõi. | Giống như một **chiếc điện thoại thông minh mới mua**. Nó đã có sẵn ứng dụng Bản đồ, Máy tính, Đồng hồ mà bạn không cần lên App Store để tải về. |

---

## 2. Cú pháp & Vận hành

Dưới đây là 3 thư viện chuẩn phổ biến nhất mà bạn sẽ liên tục sử dụng:

### 1. Thư viện `math` (Toán học chuyên sâu)
Cung cấp các hằng số toán học (như số Pi $\pi$) và các hàm lượng giác, lũy thừa, làm tròn:
```python
import math
print(math.pi)        # Hằng số Pi: 3.141592653589793
print(math.ceil(4.2)) # Làm tròn lên -> 5
```

### 2. Thư viện `random` (Xử lý ngẫu nhiên)
Sử dụng để mô phỏng đổ xúc xắc, chia bài ngẫu nhiên, tạo mã xác thực OTP bảo mật:
```python
import random
print(random.randint(1, 10)) # Sinh số nguyên ngẫu nhiên từ 1 đến 10
items = ["Đỏ", "Đen", "Trắng"]
print(random.choice(items))  # Chọn ngẫu nhiên một phần tử
```

### 3. Thư viện `datetime` (Xử lý ngày giờ hệ thống)
Sử dụng để lấy ngày giờ hiện tại, tính toán khoảng thời gian trôi qua (ví dụ: đếm ngược ngày sinh nhật):
```python
from datetime import datetime
now = datetime.now()
print(now.strftime("%d/%m/%Y %H:%M:%S")) # Định dạng ngày giờ hiển thị
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi trùng tên file dự án với tên thư viện chuẩn:**
> Nếu bạn đặt tên file code của mình là `random.py` hoặc `math.py`, khi bạn viết lệnh `import random` ở một file khác trong cùng thư mục, Python sẽ ưu tiên nạp file code của bạn thay vì thư viện chuẩn của hệ thống. Điều này làm chương trình báo lỗi `AttributeError` vì file của bạn không có các hàm chuẩn kia.
> *Quy tắc an toàn:* Tuyệt đối không đặt tên file trùng với các thư viện chuẩn của Python.

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để sinh một số nguyên ngẫu nhiên trong khoảng từ `1` đến `100` (bao gồm cả biên `1` và `100`), ta dùng hàm nào trong thư viện `random`?
* [ ] `random.random()`
* [x] `random.randint(1, 100)`
* [ ] `random.choice(1, 100)`
* [ ] `random.uniform(1, 100)`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn lấy năm hiện tại từ hệ thống để tính tuổi của người dùng. Tuy nhiên chương trình đang báo lỗi cú pháp / logic. Hãy tìm lỗi và sửa lại:
```python
import datetime

# Đoạn code lỗi:
current_year = datetime.year()
print(f"Năm hiện tại: {current_year}")
```

### Bài tập lập trình (Mini-task)
Hãy viết chương trình sử dụng thư viện `random` để mô phỏng việc tung một quân xúc xắc 6 mặt ngẫu nhiên (sinh số ngẫu nhiên từ 1 đến 6) và in kết quả ra màn hình.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🔋 Triết lý **"Batteries Included"** cung cấp hàng trăm thư viện chuẩn sẵn dùng cho Python.
* 📐 Thư viện `math` phục vụ tính toán toán học nâng cao.
* 🎲 Thư viện `random` dùng để sinh dữ liệu ngẫu nhiên hoặc xáo trộn danh sách.
* 📅 Thư viện `datetime` quản lý và xử lý ngày tháng, thời gian thực của hệ thống.

Chúc mừng bạn đã hoàn thành xuất sắc **Module 04: Tái sử dụng & Tổ chức mã nguồn**! Bạn đã sở hữu tư duy đóng gói mã nguồn và xử lý lỗi chuyên nghiệp. Hãy sẵn sàng bước sang **Module 05: Lưu trữ và Trừu tượng hóa (File & Basic OOP)** để tìm hiểu cách lưu trữ dữ liệu lâu dài vào ổ cứng và tìm hiểu về lập trình hướng đối tượng.
