---
lessonId: "LS-03.02"
title: "Lesson 3.2: Tư duy vòng lặp"
difficulty: "EASY"
estimatedDuration: 30
prerequisites: ["LS-03.01"]
---

# Lesson 3.2: Tư duy vòng lặp

## Mục tiêu

* Nắm vững **4 thành phần cốt lõi** (4 trụ cột) cấu thành nên mọi vòng lặp trong lập trình.
* Đọc và vẽ được **sơ đồ chu trình lặp** (Loop Cycle Diagram) để theo dõi luồng chạy của chương trình.
* Tự tay lập được **Bảng theo dõi thực thi** (Execution Trace Table) để quan sát sự thay đổi giá trị của biến số qua từng lượt lặp.
* Hiểu rõ nguyên nhân và biết cách phòng tránh lỗi kinh điển: **Vòng lặp vô hạn** (Infinite Loop).

## Kiến thức chính

Mọi vòng lặp trong mọi ngôn ngữ lập trình đều được xây dựng dựa trên chu trình 4 bước bất biến:

| Trụ cột | Tên gọi | Nhiệm vụ | Ví dụ đời thực |
| :--- | :--- | :--- | :--- |
| **1. Khởi tạo** | Initialization | Thiết lập giá trị ban đầu cho biến kiểm soát (vạch xuất phát). | Vận động viên đứng ở vạch xuất phát: `vong = 1` |
| **2. Điều kiện** | Condition | Biểu thức Logic kiểm tra xem có được phép chạy tiếp không. | Trọng tài kiểm tra: Đã chạy đủ 5 vòng chưa? (`vong <= 5`) |
| **3. Hành động** | Loop Body | Các câu lệnh thực sự cần làm trong mỗi lượt lặp. | Chạy hết 1 vòng quanh sân vận động (400 mét) |
| **4. Cập nhật** | Update | Thay đổi giá trị biến kiểm soát để tiến gần về điểm dừng. | Trọng tài bấm còi tăng số vòng: `vong = vong + 1` |

> [!IMPORTANT]
> **Quy tắc vàng**: Nếu thiếu bước **4. Cập nhật**, biến kiểm soát sẽ giữ nguyên mãi mãi một giá trị ban đầu, điều kiện sẽ luôn luôn ĐÚNG, dẫn đến chương trình rơi vào **vòng lặp vô hạn** và làm treo máy tính!

## Hiểu

### 1. Ẩn dụ thực tế: Vận động viên chạy 5 vòng sân vận động

Hãy quan sát cách một vận động viên hoàn thành bài tập chạy 5 vòng sân:
1. **Trước khi chạy (Khởi tạo):** Vận động viên chuẩn bị ở vạch xuất phát, ghi nhớ mình đang ở `vong = 1`.
2. **Trước mỗi vòng (Kiểm tra điều kiện):** Tự hỏi: *"Số vòng hiện tại (`vong`) có nhỏ hơn hoặc bằng 5 không?"*
   * Nếu **ĐÚNG** ($\le 5$): Tiếp tục chạy vòng này!
   * Nếu **SAI** ($> 5$): Đã hoàn thành mục tiêu, dừng lại và nghỉ ngơi!
3. **Trong khi chạy (Thực hiện hành động):** Vận động viên sải bước chạy hết một vòng 400m quanh sân.
4. **Vừa cán vạch (Cập nhật biến):** Vận động viên tự nhẩm tăng thêm 1 vòng: `vong = vong + 1`.
5. **Quay lại bước 2:** Lặp lại quy trình trên cho đến khi hoàn thành đủ 5 vòng.

### 2. Sơ đồ chu trình lặp trực quan (Loop Cycle Diagram)

![Sơ đồ chu trình 4 trụ cột của vòng lặp](/images/lessons/module3/loop_pillars.svg)

```text
               [1. KHỞI TẠO]
                (dem = 1)
                    │
                    ▼
         ┌──► [2. KIỂM TRA ĐIỀU KIỆN] ──(SAI: dem > 3)──► [KẾT THÚC VÒNG LẶP]
         │          (dem <= 3?)
         │              │
         │           (ĐÚNG)
         │              ▼
         │    [3. THỰC HIỆN HÀNH ĐỘNG]
         │       (In giá trị dem)
         │              │
         │              ▼
         └─── [4. CẬP NHẬT BIẾN ĐẾM]
                 (dem = dem + 1)
```

Nhìn vào sơ đồ trên, bạn sẽ thấy luồng chạy tạo thành một **vòng tròn khép kín** (Loop). Mũi tên từ bước 4 quay ngược lại bước 2. Chương trình chỉ có thể thoát ra khỏi vòng lặp khi điều kiện ở bước 2 chuyển từ **ĐÚNG (True)** sang **SAI (False)**.

## Làm theo

### Ví dụ 1: Theo dõi biến đếm từ 1 đến 3

Dưới đây là một đoạn mã Python thể hiện chính xác chu trình 4 bước trên:

```python
# Bước 1: Khởi tạo vạch xuất phát
dem = 1

# Bước 2: Kiểm tra điều kiện lặp
while dem <= 3:
    # Bước 3: Thực hiện công việc
    print("Đang ở lượt đếm:", dem)

    # Bước 4: Cập nhật biến đếm (tiến dần về đích)
    dem = dem + 1

print("Vòng lặp đã kết thúc an toàn!")
```

### Bảng theo dõi thực thi từng bước (Execution Trace Table)

Lập bảng theo dõi là "vũ khí tối thượng" giúp lập trình viên nhìn thấu từng mili-giây máy tính suy nghĩ gì:

| Lượt lặp | Giá trị `dem` đầu lượt | Kiểm tra `dem <= 3` | Hành động in ra màn hình | Cập nhật `dem = dem + 1` | Trạng thái sau cập nhật |
| :---: | :---: | :---: | :--- | :---: | :--- |
| **Khởi tạo** | — | — | *(Chưa chạy)* | `dem = 1` | `dem = 1` |
| **Lượt 1** | `1` | `1 <= 3` ➔ **ĐÚNG** | `Đang ở lượt đếm: 1` | `1 + 1` | `dem = 2` |
| **Lượt 2** | `2` | `2 <= 3` ➔ **ĐÚNG** | `Đang ở lượt đếm: 2` | `2 + 1` | `dem = 3` |
| **Lượt 3** | `3` | `3 <= 3` ➔ **ĐÚNG** | `Đang ở lượt đếm: 3` | `3 + 1` | `dem = 4` |
| **Kiểm tra cuối**| `4` | `4 <= 3` ➔ **SAI** | *(Không thực hiện)* | *(Dừng lặp)* | Thoát ra ngoài! |

> [!WARNING]
> **Điều gì xảy ra nếu quên dòng `dem = dem + 1`?**
> Biến `dem` sẽ mãi mãi bằng `1`. Máy tính kiểm tra `1 <= 3` luôn luôn ĐÚNG, và sẽ in ra dòng chữ `"Đang ở lượt đếm: 1"` hàng triệu lần không dừng cho tới khi bạn tắt chương trình. Đó chính là **vòng lặp vô hạn**!

### Ví dụ 2: Tư duy tích lũy (Cộng dồn qua từng lượt)

Ngoài việc đếm số, vòng lặp thường dùng để **cộng dồn** hoặc **nhân dồn** (như tính tổng tiền, tính điểm):

```python
n = 3
tong = 0  # Biến tích lũy ban đầu
so = 1    # Biến đếm bắt đầu từ 1

while so <= n:
    tong = tong + so  # Bỏ thêm giá trị hiện tại vào túi tổng
    so = so + 1       # Tăng số tiếp theo

print("Tổng từ 1 đến", n, "là:", tong)
```

* **Lượt 1:** `tong = 0 + 1 = 1`
* **Lượt 2:** `tong = 1 + 2 = 3`
* **Lượt 3:** `tong = 3 + 3 = 6`
* Kết quả cuối cùng in ra: `6`.

## Tự làm

1. **Thử thách lập bảng Trace:** Hãy lập bảng theo dõi thực thi cho bài toán đếm từ 2 đến 6 với bước nhảy 2 (`dem = dem + 2`). Xác định rõ:
   * Giá trị ban đầu của `dem` là bao nhiêu?
   * Điều kiện dừng là gì?
   * Sau bao nhiêu lượt lặp thì vòng lặp kết thúc?
2. **Thám tử tìm lỗi:** Quan sát đoạn mã sau và chỉ ra lỗi logic:
   ```python
   i = 10
   while i >= 1:
       print(i)
       i = i + 1  # Gợi ý: Hãy nhìn kỹ dấu cộng hay trừ!
   ```
   *Đoạn mã trên có dừng lại được không? Vì sao?*
3. **Tư duy tính tích:** Nếu muốn tính tích từ 1 đến $N$ ($1 \times 2 \times 3 \times ... \times N$), biến `tich` ban đầu phải được khởi tạo bằng `1` hay bằng `0`? Tại sao?

## Vận dụng

Mọi thuật toán phức tạp trên thế giới (từ việc tìm kiếm bài viết trên Facebook đến tính toán quỹ đạo tên lửa) đều bắt nguồn từ tư duy 4 bước này:
* **Hệ thống thanh toán:** Khởi tạo `tong_tien = 0`. Duyệt từng món hàng trong giỏ, cộng giá tiền món hàng vào `tong_tien`, cập nhật sang món hàng tiếp theo.
* **Đếm ngược thời gian:** Khởi tạo `giay = 60`. Sau mỗi giây giảm `giay = giay - 1`. Khi `giay == 0` thì kích hoạt chuông báo thức reo.

---

### 🚀 Bước tiếp theo

Bạn đã nắm vững "khung xương" 4 bước của vòng lặp! Nhưng việc phải tự tay khởi tạo biến và viết dòng cập nhật biến đếm thủ công đôi khi hơi phiền phức và dễ quên.

Hãy cùng đến với **Lesson 3.3: Vòng lặp for và range()** để xem Python cung cấp công cụ tự động hóa thông minh như thế nào nhé!
