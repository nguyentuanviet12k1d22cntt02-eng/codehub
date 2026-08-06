### **15 BÀI TẬP MỨC DỄ**

---

**Bài 1: Khai báo và In Danh sách Đơn giản**

- **Mô tả bài toán:** Tạo và in một danh sách chứa 3 số nguyên bất kỳ.
- **Input:** (Tự nhập)
- **Output:** Danh sách đã tạo.
- **Ví dụ kiểm thử:** `[1, 2, 3]`
- **Gợi ý:** Sử dụng `[]` để tạo danh sách và `print()` để hiển thị.

**Bài 2: Lấy một Phần tử theo Vị trí**

- **Mô tả bài toán:** Cho `colors = ["red", "green", "blue"]`. In phần tử thứ hai.
- **Input:** `colors`
- **Output:** Phần tử thứ hai.
- **Ví dụ kiểm thử:** `green`
- **Gợi ý:** Nhớ chỉ số bắt đầu từ 0.

**Bài 3: Thay đổi Giá trị của một Phần tử**

- **Mô tả bài toán:** Cho `scores = [7, 8, 9]`. Thay đổi điểm đầu tiên thành 10. In danh sách mới.
- **Input:** `scores`
- **Output:** Danh sách đã cập nhật.
- **Ví dụ kiểm thử:** `[10, 8, 9]`
- **Gợi ý:** Gán giá trị mới trực tiếp vào chỉ số.

**Bài 4: Thêm Phần tử vào Cuối Danh sách**

- **Mô tả bài toán:** Cho `fruits = ["apple", "banana"]`. Thêm `"orange"` vào cuối. In danh sách mới.
- **Input:** `fruits`
- **Output:** Danh sách đã thêm.
- **Ví dụ kiểm thử:** `['apple', 'banana', 'orange']`
- **Gợi ý:** Tìm phương thức để thêm vào cuối.

**Bài 5: Xóa một Phần tử cụ thể (theo giá trị)**

- **Mô tả bài toán:** Cho `animals = ["cat", "dog", "fish"]`. Xóa `"dog"`. In danh sách mới.
- **Input:** `animals`
- **Output:** Danh sách đã xóa.
- **Ví dụ kiểm thử:** `['cat', 'fish']`
- **Gợi ý:** Có một phương thức để xóa phần tử theo giá trị.

**Bài 6: Xóa Phần tử theo Vị trí**

- **Mô tả bài toán:** Cho `numbers = [10, 20, 30, 40]`. Xóa phần tử ở chỉ số 2. In danh sách mới.
- **Input:** `numbers`
- **Output:** Danh sách đã xóa.
- **Ví dụ kiểm thử:** `[10, 20, 40]`
- **Gợi ý:** Có thể dùng `del` hoặc `pop()`.

**Bài 7: Kiểm tra Độ dài Danh sách**

- **Mô tả bài toán:** Cho `items = ["laptop", "mouse", "keyboard", "monitor"]`. In số lượng phần tử.
- **Input:** `items`
- **Output:** Số lượng phần tử.
- **Ví dụ kiểm thử:** `4`
- **Gợi ý:** Sử dụng hàm `len()`.

**Bài 8: Kiểm tra Phần tử có Tồn tại không**

- **Mô tả bài toán:** Cho `fruits = ["apple", "banana", "cherry"]`. Kiểm tra `"banana"` có tồn tại không. In `True` hoặc `False`.
- **Input:** `fruits`
- **Output:** `True` hoặc `False`.
- **Ví dụ kiểm thử:** `True`
- **Gợi ý:** Sử dụng toán tử `in`.

**Bài 9: In từng Phần tử của Danh sách**

- **Mô tả bài toán:** Cho `cities = ["Hanoi", "Ho Chi Minh", "Da Nang"]`. Dùng vòng lặp `for` in từng thành phố trên một dòng.
- **Input:** `cities`
- **Output:** Các thành phố (mỗi dòng một thành phố).
- **Ví dụ kiểm thử:**
    
    `Hanoi
    Ho Chi Minh
    Da Nang`
    
- **Gợi ý:** Vòng lặp `for item in list:`.

**Bài 10: Tính Tổng các số trong Danh sách**

- **Mô tả bài toán:** Cho `numbers = [5, 10, 15, 20]`. Tính và in tổng các số.
- **Input:** `numbers`
- **Output:** Tổng các số.
- **Ví dụ kiểm thử:** `50`
- **Gợi ý:** Sử dụng hàm `sum()`.

**Bài 11: Tìm số Lớn nhất trong Danh sách**

- **Mô tả bài toán:** Cho `points = [100, 75, 120, 90]`. Tìm và in số lớn nhất.
- **Input:** `points`
- **Output:** Số lớn nhất.
- **Ví dụ kiểm thử:** `120`
- **Gợi ý:** Sử dụng hàm `max()`.

**Bài 12: Tìm số Nhỏ nhất trong Danh sách**

- **Mô tả bài toán:** Cho `temperatures = [25, 18, 30, 22]`. Tìm và in số nhỏ nhất.
- **Input:** `temperatures`
- **Output:** Số nhỏ nhất.
- **Ví dụ kiểm thử:** `18`
- **Gợi ý:** Sử dụng hàm `min()`.

**Bài 13: Sắp xếp Danh sách Tăng dần**

- **Mô tả bài toán:** Cho `data = [5, 2, 8, 1]`. Sắp xếp tăng dần. In danh sách đã sắp xếp.
- **Input:** `data`
- **Output:** Danh sách đã sắp xếp.
- **Ví dụ kiểm thử:** `[1, 2, 5, 8]`
- **Gợi ý:** Sử dụng phương thức `.sort()`.

**Bài 14: Lấy một Phần của Danh sách (Slicing cơ bản)**

- **Mô tả bài toán:** Cho `alphabet = ["a", "b", "c", "d", "e", "f"]`. Trích xuất và in danh sách con từ chỉ số 1 đến chỉ số 4 (không bao gồm).
- **Input:** `alphabet`
- **Output:** Danh sách con.
- **Ví dụ kiểm thử:** `['b', 'c', 'd', 'e']`
- **Gợi ý:** Nhớ cú pháp `[start:end]`.

**Bài 15: Tạo danh sách từ Dữ liệu người dùng nhập**

- **Mô tả bài toán:** Nhập 3 số nguyên từ người dùng. Tạo danh sách từ 3 số đó. In danh sách.
- **Input:** 3 số nguyên (ví dụ: `10`, `20`, `30`).
- **Output:** Danh sách chứa các số đã nhập.
- **Ví dụ kiểm thử:** `[10, 20, 30]`
- **Gợi ý:** Dùng `input()` và `int()` cho mỗi số, sau đó tạo danh sách.