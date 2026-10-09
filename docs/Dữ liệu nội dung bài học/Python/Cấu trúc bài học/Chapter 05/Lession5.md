---
lessonId: "LS-03.05"
title: "Lesson 3.5: Điều khiển vòng lặp với break và continue"
difficulty: "MEDIUM"
estimatedDuration: 30
prerequisites: ["LS-03.04"]
---

# Lesson 3.5: Điều khiển vòng lặp với break và continue

## Mục tiêu

* Hiểu rõ vai trò và cơ chế can thiệp luồng của hai từ khóa đặc biệt: `break` và `continue`.
* Vẽ và giải thích được sơ đồ chuyển hướng của `break` (thoát hẳn) và `continue` (bỏ qua lượt này).
* Ứng dụng `break` để tối ưu hóa hiệu năng trong các bài toán tìm kiếm (dừng ngay khi tìm thấy kết quả).
* Ứng dụng `continue` để lọc và bỏ qua các dữ liệu rác, giá trị không hợp lệ.
* Cảnh giác và khắc phục được bẫy chí mạng: **Dùng `continue` trong vòng lặp `while` gây treo máy**.

## Kiến thức chính

Thông thường, vòng lặp sẽ chạy tuần tự từ đầu đến cuối mọi câu lệnh trong thân vòng lặp. Tuy nhiên, Python cung cấp hai "công tắc điều khiển" giúp bạn can thiệp trực tiếp vào luồng chạy:

| Từ khóa | Hành động | Ẩn dụ thực tế | Hướng di chuyển của con trỏ |
| :--- | :--- | :--- | :--- |
| **`break`** | **DỪNG HẲN** vòng lặp ngay lập tức, không chạy thêm bất kỳ lượt nào nữa. | **Phanh khẩn cấp / Chuông báo cháy**: Buổi chiếu phim dừng ngay lập tức, mọi người sơ tán ra về. | Nhảy vọt ra ngoài, đến câu lệnh đầu tiên **sau** khối vòng lặp. |
| **`continue`** | **BỎ QUA** phần còn lại của lượt lặp hiện tại, chuyển ngay sang **lượt tiếp theo**. | **Nút Skip (Bỏ qua bài hát)**: Không thích bài này thì bấm Next sang bài kế tiếp, playlist vẫn phát tiếp. | Nhảy ngược lên đầu vòng lặp để bắt đầu lượt lặp kế tiếp. |

## Hiểu

### Sơ đồ trực quan: Đường đi của luồng lệnh với `break` và `continue`

![Sơ đồ bẻ hướng luồng chạy của break và continue](/images/lessons/module3/break_continue.svg)

```text
                  VÒNG LẶP FOR / WHILE
               ┌────────────────────────┐
               │ 1. Kiểm tra điều kiện  │◄──────────────┐
               └───────────┬────────────┘               │
                           ▼                            │
               ┌────────────────────────┐               │
          ┌───►│ 2. Các câu lệnh đầu    │               │
          │    └───────────┬────────────┘               │
          │                ▼                            │
          │       <Gặp lệnh continue?> ─────(ĐÚNG)──────┘ (Bỏ qua đoạn dưới,
          │                │ (SAI)                       nhảy ngay sang lượt mới!)
          │                ▼
          │       <Gặp lệnh break?> ────────(ĐÚNG)──────┐ (Bẻ gãy vòng lặp,
          │                │ (SAI)                      │  thoát hiểm khẩn cấp!)
          │                ▼                            │
          │    ┌────────────────────────┐               │
          └─── │ 3. Các câu lệnh sau    │               │
               └────────────────────────┘               │
                                                        ▼
                                             [CÂU LỆNH SAU VÒNG LẶP]
```

## Làm theo

### Ví dụ 1: Tìm kiếm số đầu tiên chia hết cho 7 (Dùng `break` để tiết kiệm tài nguyên)

Giả sử bạn cần tìm số đầu tiên trong khoảng từ 10 đến 50 chia hết cho 7:

```python
for so in range(10, 51):
    if so % 7 == 0:
        print("Đã tìm thấy số đầu tiên chia hết cho 7:", so)
        break  # Đã có kết quả, dừng vòng lặp ngay lập tức!
        
print("Chương trình hoàn tất tìm kiếm.")
```

**Phân tích hiệu năng:**
* Nếu không có `break`: Vòng lặp phải chạy đủ 41 lần (từ 10 đến 50).
* Nhờ có `break`: Khi gặp số `14` (chia hết cho 7), chương trình in ra `14` và `break` ngay ở lượt thứ 5! Tiết kiệm được 36 lượt tính toán vô ích cho máy tính.

---

### Ví dụ 2: In các số lẻ từ 1 đến 7 (Dùng `continue` để bỏ qua số chẵn)

```python
for so in range(1, 8):
    if so % 2 == 0:
        continue  # Nếu là số chẵn: bỏ qua, không in, nhảy sang số tiếp theo!
    print("Số lẻ:", so)
```

### Bảng theo dõi thực thi của ví dụ `continue`:

| Lượt lặp | Giá trị `so` | Kiểm tra `so % 2 == 0` | Hành động của Python | Kết quả in ra |
| :---: | :---: | :---: | :--- | :--- |
| **1** | `1` | `1 % 2 == 0` ➔ **SAI** | Bỏ qua `if`, chạy lệnh `print` bên dưới. | `Số lẻ: 1` |
| **2** | `2` | `2 % 2 == 0` ➔ **ĐÚNG**| **Gặp continue**: Nhảy cóc lên đầu, bỏ lệnh `print`! | *(Không in gì)* |
| **3** | `3` | `3 % 2 == 0` ➔ **SAI** | Bỏ qua `if`, chạy lệnh `print` bên dưới. | `Số lẻ: 3` |
| **4** | `4` | `4 % 2 == 0` ➔ **ĐÚNG**| **Gặp continue**: Nhảy cóc lên đầu, bỏ lệnh `print`! | *(Không in gì)* |
| **5** | `5` | `5 % 2 == 0` ➔ **SAI** | Bỏ qua `if`, chạy lệnh `print` bên dưới. | `Số lẻ: 5` |
| **6** | `6` | `6 % 2 == 0` ➔ **ĐÚNG**| **Gặp continue**: Nhảy cóc lên đầu, bỏ lệnh `print`! | *(Không in gì)* |
| **7** | `7` | `7 % 2 == 0` ➔ **SAI** | Bỏ qua `if`, chạy lệnh `print` bên dưới. | `Số lẻ: 7` |

## Tự làm & Cảnh báo bẫy chết người

> [!WARNING]
> **Bẫy kinh hoàng: Dùng `continue` trong `while` sai vị trí!**
> Quan sát đoạn code bị lỗi nghiêm trọng dưới đây:
> ```python
> i = 1
> while i <= 5:
>     if i == 3:
>         continue  # NGUY HIỂM: Nhảy cóc lên đầu while...
>     print(i)
>     i += 1        # ... và bỏ qua luôn dòng tăng biến đếm này!
> ```
> Khi `i == 3`, `continue` kích hoạt và nhảy ngược lên kiểm tra `while i <= 5`. Dòng `i += 1` bị bỏ qua nên `i` vẫn bằng 3 mãi mãi. Vòng lặp rơi vào trạng thái vô hạn và treo máy!
> 
> **Cách sửa chuẩn xác:** Luôn tăng biến đếm TRƯỚC khi gọi `continue`:
> ```python
> i = 1
> while i <= 5:
>     if i == 3:
>         i += 1    # Tăng trước khi nhảy cóc!
>         continue
>     print(i)
>     i += 1
> ```

### Thử thách tư duy:
Đoạn code sau đây sẽ in ra màn hình những số nào?
```python
for x in range(1, 10):
    if x == 4:
        continue
    if x == 7:
        break
    print(x, end=" ")
```
*Số 4 có được in không? Số 7 có được in không? Số 8 và 9 thì sao?*

## Vận dụng

* **Hệ thống thanh toán / Kiểm định sản phẩm (KCS):** Băng chuyền chuyển 1.000 sản phẩm. Nếu gặp sản phẩm lỗi nhẹ, ghi log và `continue` để kiểm tra tiếp sản phẩm sau. Nếu phát hiện cảm biến nhiệt báo cháy, kích hoạt `break` dừng khẩn cấp toàn bộ nhà máy.
* **Xác thực mật khẩu:** Cho phép nhập lại nếu gõ sai (`continue`), nhưng nếu nhập đúng thì `break` thoát khỏi màn hình đăng nhập để vào trang chủ.

---

### 🚀 Bước tiếp theo

Bạn vừa thấy sức mạnh của việc kết hợp câu lệnh điều kiện `if` bên trong vòng lặp! Đây thực chất là một kỹ thuật nền tảng quan trọng bậc nhất trong lập trình.

Hãy cùng bước sang **Lesson 3.6: Kết hợp vòng lặp với if** để khám phá trọn bộ 4 Mẫu thiết kế thuật toán kinh điển (Đếm, Cộng dồn, Lọc dữ liệu, Cờ hiệu tìm kiếm)!
