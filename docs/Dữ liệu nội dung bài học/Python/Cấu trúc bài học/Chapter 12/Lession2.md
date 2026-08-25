---
lessonId: "LS-05.02"
title: "Đọc và Ghi File Text"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["read", "readline", "write", "writelines", "file text"]
prerequisites: ["LS-05.01"]
---

# 📘 Lesson 05.02: Đọc và Ghi File Text

---

## 1. Khái niệm & Vấn đề

Khi đã liên kết thành công với file bằng hàm `open()`, ta cần thực hiện các thao tác trao đổi dữ liệu:
* Đọc dữ liệu từ file để phân tích, hiển thị lên giao diện người dùng.
* Ghi kết quả tính toán hoặc các hành động người dùng lưu vào file text để lưu giữ.

Python cung cấp các phương thức tích hợp sẵn cho đối tượng file để giúp việc đọc và ghi dữ liệu văn bản (text) trở nên cực kỳ trực quan.

---

## 2. Cú pháp & Vận hành

### 1. Ghi dữ liệu vào File
Sử dụng phương thức `.write(string)` để ghi nội dung chuỗi vào file:

```python
file = open("notes.txt", "w", encoding="utf-8")
file.write("Học Python tại MCode.\n")
file.write("Lập trình rất vui!\n")
file.close()
```

### 2. Đọc dữ liệu từ File
Có 3 cách đọc dữ liệu phổ biến tùy thuộc vào mục đích sử dụng:

* **Cách 1: Đọc toàn bộ nội dung file cùng một lúc (`.read()`)**
```python
file = open("notes.txt", "r", encoding="utf-8")
content = file.read()
print(content)
file.close()
```

* **Cách 2: Đọc từng dòng đơn lẻ (`.readline()`)**
```python
file = open("notes.txt", "r", encoding="utf-8")
line1 = file.readline() # Đọc dòng 1
print(line1)
file.close()
```

* **Cách 3: Duyệt qua từng dòng bằng vòng lặp `for` (Tối ưu bộ nhớ RAM nhất)**
```python
file = open("notes.txt", "r", encoding="utf-8")
for line in file:
    # Xóa ký tự xuống dòng dư thừa bằng strip()
    print(line.strip()) 
file.close()
```

---

## 3. Lỗi thường gặp & Tối ưu

> [!WARNING]
> **Nhầm lẫn giá trị đầu vào của `.write()`:**
> Phương thức `.write()` chỉ chấp nhận tham số truyền vào là **kiểu Chuỗi (String)**. Nếu bạn cố tình truyền số nguyên, số thực hay một danh sách (List), chương trình sẽ báo lỗi `TypeError`.
> *Ví dụ sai:*
> ```python
> f = open("data.txt", "w")
> f.write(123) # Lỗi TypeError: write() argument must be str, not int
> ```
> *Cách sửa:*
> ```python
> f.write(str(123)) # Phải ép kiểu sang string trước khi ghi
> ```

---

## 4. Luyện tập

### Câu hỏi trắc nghiệm (Warm-up)
Để đọc từng dòng một của file văn bản tuần tự mỗi lần gọi mà không tải toàn bộ file lên bộ nhớ RAM, ta nên dùng phương thức nào?
* [ ] `.read()`
* [x] `.readline()`
* [ ] `.readlines()`
* [ ] `.write()`

### Thử thách sửa lỗi (Debug)
Đoạn code sau đây muốn ghi một danh sách các món ăn vào file, mỗi món một dòng, nhưng đang gặp lỗi sập chương trình. Hãy tìm lỗi và sửa lại:
```python
food_list = ["Phở", "Bún chả", "Cơm tấm"]

f = open("menu.txt", "w", encoding="utf-8")
# Đoạn code lỗi:
f.write(food_list)
f.close()
```

### Bài tập lập trình (Mini-task)
Hãy viết chương trình mở file `"input.txt"` ở chế độ đọc, duyệt qua từng dòng của file bằng vòng lặp `for` và in ra màn hình nội dung của từng dòng đó (được loại bỏ khoảng trắng và ký tự xuống dòng thừa ở hai đầu bằng `.strip()`). Đừng quên đóng file.
```python
# Nhập code của bạn ở đây
```

---

## 5. Đúc kết & Đi tiếp

* ✍️ Sử dụng phương thức **`.write()`** để ghi dữ liệu chuỗi vào file (nhớ ép kiểu dữ liệu phi chuỗi thành string).
* 📖 Sử dụng phương thức **`.read()`** để đọc hết nội dung file, hoặc dùng vòng lặp **`for line in file`** để duyệt qua từng dòng một cách tiết kiệm RAM.

Trong bài học tiếp theo **[LS-05.03: Context Manager với từ khóa 'with']**, chúng ta sẽ học một cú pháp hiện đại và an toàn tuyệt đối giúp tự động đóng file mà không bao giờ lo bị quên gọi lệnh `close()`.
