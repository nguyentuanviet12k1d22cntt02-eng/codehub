---
lessonId: "LS-01.09"
title: "Hàm nhập dữ liệu (Input)"
difficulty: "BASIC"
estimatedDuration: 20
keywords: ["input function", "user input", "string output", "python basics"]
prerequisites: ["LS-01.08"]
---

# 📘 Lesson 01.09: Hàm nhập dữ liệu (Input)

---

## 1. Khái niệm & Vấn đề

Nếu một chương trình chỉ có thể in dữ liệu ra ngoài (`print()`) mà không thể tiếp nhận thông tin từ người dùng, nó sẽ hoạt động hoàn toàn thụ động và cố định. 

Để tạo ra các chương trình tương tác thông minh (ví dụ: yêu cầu nhập tên đăng nhập, nhập số tiền muốn rút), Python cung cấp **Hàm nhập dữ liệu (`input()`)**. Khi gặp lệnh này, chương trình sẽ tạm dừng hoạt động và chờ người dùng gõ thông tin từ bàn phím rồi nhấn phím **Enter**.

> [!IMPORTANT]
> **Đặc điểm cốt lõi:**
> Mọi dữ liệu thu nhận được từ bàn phím qua hàm `input()` luôn luôn được Python lưu trữ dưới dạng một **chuỗi ký tự (String - `str`)**, kể cả khi người dùng nhập vào toàn là chữ số (như `25` hay `1000`).

| Khái niệm | Định nghĩa | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Hàm `input()`** | Nhận luồng dữ liệu văn bản do người dùng gõ từ bàn phím và trả về dưới dạng kiểu `str`. | Giống như **quầy tiếp tân**: chương trình dừng lại để lắng nghe thông tin bạn cung cấp trước khi xử lý bước tiếp theo. |

---

## 2. Cú pháp & Vận hành

Chúng ta thường truyền một chuỗi ký tự hướng dẫn (lời nhắc) trực tiếp vào trong dấu ngoặc đơn của hàm `input()` để người dùng biết họ cần phải nhập cái gì.

```python
ten = input("Hãy nhập tên của bạn: ")
print("Xin chào,", ten)

tuoi = input("Hãy nhập tuổi của bạn: ")
print("Kiểu dữ liệu của tuổi là:", type(tuoi))
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| Dòng mã | Lệnh được chạy | Trạng thái biến | Hành động của máy tính |
|:---:|:---|:---|:---|
| 1 | `ten = input(...)` | | Hiển thị lời nhắc `"Hãy nhập tên của bạn: "` và tạm dừng. Chờ người dùng gõ chữ `An` và nhấn Enter. |
| | | `ten: "An"` | Lưu giá trị chuỗi `"An"` vào biến `ten`. |
| 2 | `print("Xin chào,", ten)`| `ten: "An"` | In ra màn hình: `Xin chào, An`. |
| 4 | `tuoi = input(...)` | | Hiển thị lời nhắc `"Hãy nhập tuổi của bạn: "` và tạm dừng. Chờ người dùng gõ số `18` và nhấn Enter. |
| | | `ten: "An"`, `tuoi: "18"` | Lưu giá trị chuỗi `"18"` vào biến `tuoi`. |
| 5 | `print("Kiểu...", type(tuoi))`| | In ra màn hình: `Kiểu dữ liệu của tuổi là: <class 'str'>`. |

**Đường đi của dữ liệu nhập:**
```text
[Bàn phím: 18] ───► input() ───► "18" (kiểu str) ───► Gán vào biến tuoi
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Lỗi logic nghiêm trọng:**
> Do đầu ra của `input()` luôn là chuỗi ký tự (`str`), bạn không thể thực hiện tính toán số học trực tiếp với nó.
> * Ví dụ: `nam_sau = tuoi + 1` sẽ gây sập chương trình với lỗi `TypeError: can only concatenate str (not "int") to str`.
> * *Giải pháp:* Chúng ta phải biến đổi kiểu dữ liệu của biến `tuoi` từ chuỗi (`str`) sang số nguyên (`int`) trước khi tính toán. Hành động này gọi là **Ép kiểu dữ liệu**.

---

## 4. Thực hành phân bậc

### Câu hỏi trắc nghiệm (Warm-up)
Nếu người dùng nhập số `2026` từ bàn phím sau khi chương trình gọi câu lệnh `x = input()`, biến `x` sẽ mang kiểu dữ liệu nào?
* [ ] `int`
* [ ] `float`
* [x] `str`
* [ ] `boolean`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn nhận tên thú cưng của người dùng và in lời chào. Nó chạy không lỗi nhưng chưa được tối ưu và viết khá dài dòng. Hãy gộp lời nhắc in ra trực tiếp vào trong hàm `input()` để code ngắn gọn hơn:
```python
# Tối ưu lại đoạn code dưới đây:
print("Nhập tên thú cưng của bạn: ")
ten_thu_cung = input()
print("Xin chào thú cưng", ten_thu_cung)
```

### Bài tập lập trình (Mini-task)
Hãy viết một chương trình yêu cầu người dùng nhập vào món ăn yêu thích của họ. Sau đó in ra màn hình dòng chữ `"Món ăn yêu thích của bạn là: [tên món ăn]"` trên một dòng.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* ⌨️ Hàm `input()` dùng để nhận dữ liệu từ người dùng thông qua bàn phím.
* ⚠️ Hãy luôn nhớ rằng giá trị trả về của `input()` luôn là kiểu chuỗi ký tự (`str`).

Trong bài học tiếp theo **[LS-01.10: Ép kiểu dữ liệu (Type Casting)]**, chúng ta sẽ học cách chuyển đổi kiểu chuỗi chữ số này sang các kiểu số thực thụ để có thể tính toán số học bình thường.
