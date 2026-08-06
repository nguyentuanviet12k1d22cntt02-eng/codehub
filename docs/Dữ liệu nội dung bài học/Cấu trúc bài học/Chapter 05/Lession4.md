---
lessonId: "LS-02.08"
title: "Điều hướng lặp: break & continue"
difficulty: "MEDIUM"
estimatedDuration: 30
keywords: ["break statement", "continue statement", "loop control", "python basics"]
prerequisites: ["LS-02.07"]
---

# 📘 Lesson 02.08: Điều hướng lặp: break & continue

---

## 1. Khái niệm & Vấn đề

Thông thường, một vòng lặp sẽ chạy tuần tự từ đầu đến cuối cho đến khi điều kiện dừng chuyển thành Sai (`False`) mới dừng lại. Tuy nhiên, trong thực tế phát triển phần mềm, ta thường cần can thiệp sâu hơn vào luồng chạy:
1. **Dừng vòng lặp khẩn cấp**: Khi tìm thấy giá trị cần tìm (ví dụ: tìm kiếm một tài khoản trong danh sách 1 triệu người), ta muốn dừng ngay lập tức để tiết kiệm tài nguyên.
2. **Bỏ qua một lượt lặp**: Khi gặp một phần tử không hợp lệ (ví dụ: số âm trong danh sách tính tuổi), ta muốn bỏ qua lượt này để xử lý phần tử tiếp theo.

Python cung cấp hai từ khóa điều hướng vòng lặp mạnh mẽ là **`break`** và **`continue`**.

| Từ khóa | Hành động | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **`break`** | Thoát hoàn toàn khỏi vòng lặp chứa nó ngay lập tức. | Giống như **nút dừng khẩn cấp** trên thang cuốn: Nhấn nút một cái là toàn bộ thang dừng hoạt động, mọi người đi ra ngoài. |
| **`continue`** | Bỏ qua phần code còn lại của lượt lặp hiện tại, chuyển ngay tới lượt lặp tiếp theo. | Giống như việc **nhảy qua vũng nước**: Bạn không dừng hành trình đi bộ, bạn chỉ tránh vũng nước đó rồi bước tiếp các bước sau. |

---

## 2. Cú pháp & Vận hành

Cú pháp của hai từ khóa này cực kỳ ngắn gọn và luôn đi kèm bên trong các khối lệnh điều kiện `if` đặt trong vòng lặp.

```python
print("--- Thử nghiệm break ---")
for i in range(1, 6):
    if i == 3:
        break
    print(i)

print("--- Thử nghiệm continue ---")
for i in range(1, 6):
    if i == 3:
        continue
    print(i)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
* **Với vòng lặp `break` (in số từ 1 đến 5, gặp 3 dừng):**
  | Lượt lặp | Giá trị `i` | Kiểm tra điều kiện `i == 3` | Kết quả xuất màn hình |
  |:---:|:---|:---|:---|
  | 1 | `i: 1` | `1 == 3` ➔ `False`. Bỏ qua khối `if`. | In: `1` |
  | 2 | `i: 2` | `2 == 3` ➔ `False`. Bỏ qua khối `if`. | In: `2` |
  | 3 | `i: 3` | `3 == 3` ➔ `True`. Chạy lệnh `break`. | **Không in gì**. Thoát khỏi vòng lặp ngay lập tức. |

* **Với vòng lặp `continue` (in số từ 1 đến 5, gặp 3 bỏ qua):**
  | Lượt lặp | Giá trị `i` | Kiểm tra điều kiện `i == 3` | Kết quả xuất màn hình |
  |:---:|:---|:---|:---|
  | 1 | `i: 1` | `1 == 3` ➔ `False`. Bỏ qua khối `if`. | In: `1` |
  | 2 | `i: 2` | `2 == 3` ➔ `False`. Bỏ qua khối `if`. | In: `2` |
  | 3 | `i: 3` | `3 == 3` ➔ `True`. Chạy lệnh `continue`. | **Không in gì**. Bỏ qua lệnh `print` bên dưới, quay lại đầu vòng lặp lấy `i: 4`. |
  | 4 | `i: 4` | `4 == 3` ➔ `False`. Bỏ qua khối `if`. | In: `4` |
  | 5 | `i: 5` | `5 == 3` ➔ `False`. Bỏ qua khối `if`. | In: `5` |

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Các lỗi cú pháp và logic thường gặp:**
> * **Đặt break/continue ngoài vòng lặp**: Lệnh `break` và `continue` bắt buộc phải nằm bên trong thân vòng lặp (`for` hoặc `while`). Nếu đặt ngoài, Python sẽ báo lỗi `SyntaxError: 'break' outside loop`.
> * **Lỗi mã nguồn không bao giờ chạm tới (Unreachable Code)**: Viết các câu lệnh khác ngay phía dưới `break` hoặc `continue` cùng cấp thụt lề sẽ khiến các câu lệnh đó không bao giờ được thực thi, do chương trình đã chuyển hướng trước khi đọc tới chúng.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Đoạn code sau đây sẽ in ra kết quả nào trên màn hình?
```python
for x in range(1, 4):
    if x == 2:
        continue
    print(x, end=" ")
```
* [ ] `1 2 3`
* [ ] `1 2`
* [x] `1 3`
* [ ] `1`

### Thử thách sửa lỗi (Debug)
Đoạn code sau muốn duyệt các số từ 1 đến 5, nếu gặp số chia hết cho 3 thì dừng vòng lặp. Tuy nhiên chương trình đang báo lỗi cú pháp `SyntaxError`. Hãy sửa lại cho đúng cấu trúc:
```python
# Sửa lại đoạn code lỗi dưới đây:
if x == 3:
    break
for x in range(1, 6):
    print(x)
```

### Bài tập lập trình (Mini-task)
Hãy viết chương trình sử dụng vòng lặp `for` duyệt qua các số trong `range(1, 6)`. Nếu gặp số `4`, hãy dùng lệnh `break` để thoát vòng lặp. Với các số khác, hãy in giá trị của số đó ra màn hình (mỗi số trên một dòng).
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* 🛑 Lệnh `break` dùng để kết thúc và thoát hoàn toàn khỏi vòng lặp ngay lập tức.
* ⏭️ Lệnh `continue` dùng để bỏ qua lượt lặp hiện tại và chuyển sang lượt lặp tiếp theo của vòng lặp.

Chúc mừng bạn đã hoàn thành **Chapter 05: Cấu trúc lặp** và kết thúc toàn bộ kiến thức của **Module 2: Luồng điều khiển chương trình**! Trong module tiếp theo, chúng ta sẽ bắt đầu tìm hiểu về **Module 3: Cấu trúc dữ liệu cốt lõi**, bắt đầu với cách thao tác chuyên sâu trên Chuỗi văn bản (`String`).
