---
lessonId: "LS-03.01"
title: "Lesson 3.1: Tại sao cần vòng lặp?"
difficulty: "EASY"
estimatedDuration: 25
prerequisites: ["LS-02.04"]
---

# Lesson 3.1: Tại sao cần vòng lặp?

## Mục tiêu

* Nhận diện được các tình huống có thao tác lặp đi lặp lại trong đời sống và trong bài toán lập trình.
* Hiểu rõ những bất cập (tốn thời gian, dễ nhầm lẫn, khó bảo trì) khi phải sao chép cùng một câu lệnh nhiều lần.
* Trực quan hóa sự khác biệt giữa "sao chép thủ công" và "tự động hóa bằng vòng lặp".
* Biết cách mô tả một công việc cần lặp bằng ngôn ngữ tự nhiên trước khi bắt tay vào viết code.
*(Lưu ý: Chưa cần học cú pháp vòng lặp ở bài học này).*

## Kiến thức chính

* **Thao tác lặp**: Là hành động thực hiện một công việc tương tự nhau nhiều lần liên tiếp để đạt được mục tiêu.
* **Vấn đề của việc sao chép code thủ công (Copy - Paste)**:
  * Khiến chương trình dài dòng, rối mắt và khó quản lý.
  * Tốn công sức và rất dễ gõ nhầm khi số lần lặp tăng lên.
  * Rất khó sửa đổi: khi cần thay đổi nội dung, ta phải chỉnh sửa ở hàng chục, hàng trăm vị trí khác nhau.
* **Tại sao cần vòng lặp?**: Máy tính có thế mạnh xử lý hàng triệu phép tính mỗi giây mà không bao giờ mệt mỏi hay nhầm lẫn. Vòng lặp là cơ chế giúp lập trình viên chỉ cần ra lệnh một lần duy nhất, máy tính sẽ tự động lặp lại công việc đó theo ý muốn.

## Hiểu

Hãy tưởng tượng bạn bị phạt chép phạt câu: *"Em hứa sẽ làm bài tập về nhà đầy đủ"* 100 lần vào vở:
* Chép **1 lần**: Rất nhanh và dễ dàng.
* Chép **5 lần**: Bắt đầu thấy mỏi tay và nhàm chán.
* Chép **100 lần**: Cực kỳ ngán ngẩm, rất dễ viết thiếu chữ hoặc đếm nhầm số dòng! Trong đời thực, chúng ta ước có một chiếc máy in hoặc máy photocopy in một loạt cho xong.

Trong lập trình cũng hoàn toàn tương tự. Nếu bạn cần in ra lời chào cho 1.000 người dùng, hoặc tính điểm trung bình cho 50 học sinh, bạn sẽ không muốn phải ngồi gõ 1.000 hay 50 dòng lệnh giống hệt nhau. Đó chính là lý do vì sao chúng ta cần đến **vòng lặp**.

### Trực quan hóa: Hai cách tiếp cận giải quyết bài toán

```text
CÁCH 1: SAO CHÉP THỦ CÔNG (Copy - Paste) ❌
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  print(...)  │──►│  print(...)  │──►│  print(...)  │ ... x1.000 lần (Ác mộng!)
└──────────────┘   └──────────────┘   └──────────────┘
  * Tốn công sức gõ phím
  * Dễ đếm nhầm số lần
  * Sửa 1 chữ là phải sửa 1.000 chỗ

CÁCH 2: TƯ DUY VÒNG LẶP (Lập trình thông minh) ✅
┌────────────────────────────────────────────────────────┐
│  1. Mô tả công việc DUY NHẤT 1 lần: print(...)         │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  2. Ra lệnh cho máy tính: "Hãy lặp lại việc này 1000x!"│
└────────────────────────────────────────────────────────┘
  * Code ngắn gọn, thanh lịch
  * Độ chính xác 100%
  * Sửa nội dung chỉ mất đúng 3 giây tại 1 vị trí duy nhất
```

> [!NOTE]
> **Bản chất của lập trình**: Máy tính sinh ra là để làm những công việc lặp đi lặp lại với tốc độ siêu nhanh thay cho con người. Đừng bao giờ làm thủ công những gì máy tính có thể tự động hóa!

## Làm theo

Hãy quan sát đoạn code Python dưới đây khi cần in lời chào mừng 3 học viên mới:

```python
print("Chào mừng bạn đến với khóa học Python!")
print("Chào mừng bạn đến với khóa học Python!")
print("Chào mừng bạn đến với khóa học Python!")
```

Chạy thử chương trình, máy tính sẽ in ra 3 dòng chính xác. Bây giờ, bạn hãy dừng lại và tự suy ngẫm 2 câu hỏi sau:

1. **Nếu lớp học có 100 học viên:** Bạn có sẵn sàng nhấn Copy - Paste và đếm đủ 100 dòng `print()` như vậy không? Nếu là 10.000 học viên thì sao?
2. **Nếu muốn đổi câu chào thành:** *"Chào mừng bạn đến với VibeCode!"*
   * Bạn sẽ phải làm gì? Phải tìm và sửa lại từng chữ ở toàn bộ 100 dòng lệnh đó.
   * Chỉ cần sơ suất sửa sót 1 dòng, chương trình sẽ in ra thông báo không đồng nhất.

> [!WARNING]
> **Bẫy "Copy - Paste"**: Trong lập trình chuyên nghiệp, nếu bạn thấy mình bấm `Ctrl + C` và `Ctrl + V` một câu lệnh quá 3 lần, đó là dấu hiệu rõ ràng cho thấy bạn đang viết code chưa tốt và **bắt buộc cần dùng vòng lặp**.

## Tự làm

Hãy dành 1–2 phút tự suy nghĩ và trả lời nhanh các câu hỏi sau để củng cố tư duy:

1. **Tìm thao tác lặp quanh bạn:** Kể tên 3 công việc quen thuộc hàng ngày của bạn có tính chất lặp đi lặp lại (ví dụ: rửa từng chiếc bát trong bồn, tưới từng chậu cây trên ban công, điểm danh từng bạn trong lớp,...).
2. **Mô tả hành động lặp:** Nếu cần đếm số tiền tiết kiệm trong heo đất (gồm nhiều tờ tiền), bạn sẽ mô tả quy trình lặp lại bằng lời như thế nào để một đứa trẻ cũng có thể hiểu và làm theo?
3. **Tự đặt câu hỏi:** Khi viết code mà thấy mình chuẩn bị sao chép một câu lệnh 10 lần, câu hỏi đầu tiên bạn nên tự hỏi bản thân là gì?

## Vận dụng

**Tình huống thực tế:** Viết phần mềm quản lý điểm thi cho một lớp có **45 sinh viên**:
* Mỗi sinh viên đều cần thực hiện chung các bước:
  1. Nhập điểm của sinh viên vào hệ thống.
  2. Cộng điểm vừa nhập vào tổng điểm cả lớp.

* **Nếu không có vòng lặp:**
  Bạn sẽ phải tạo 45 biến riêng lẻ (`diem_1`, `diem_2`, ..., `diem_45`) và viết đi viết lại đoạn code nhập điểm 45 lần. Khi chuyển sang lớp khác có 60 sinh viên, bạn buộc phải viết lại mã nguồn từ đầu.

* **Khi áp dụng tư duy vòng lặp:**
  Bạn chỉ cần viết quy trình cho **1 sinh viên duy nhất**, sau đó yêu cầu máy tính:
  > *"Hãy lặp lại công việc trên 45 lần!"*

Dù sĩ số lớp là 45, 450 hay 4.500 sinh viên, đoạn code của bạn vẫn chỉ ngắn gọn bấy nhiêu dòng mà không cần viết thêm bất kỳ câu lệnh trùng lặp nào.

---

### 🚀 Bước tiếp theo

Python đã chuẩn bị sẵn những cơ chế cực kỳ mạnh mẽ để giúp bạn ra lệnh lặp lại cho máy tính chỉ bằng vài dòng lệnh ngắn gọn.

Hãy cùng bước sang **Lesson 3.2: Tư duy vòng lặp** để khám phá bí quyết 4 bước giúp giải mã và điều khiển mọi vòng lặp trong lập trình!
