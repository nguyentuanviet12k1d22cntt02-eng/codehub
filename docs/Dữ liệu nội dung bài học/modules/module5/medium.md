### **15 BÀI TẬP MỨC TRUNG BÌNH**

---

**Bài 16: Đếm số lần xuất hiện của một phần tử**

- **Mô tả bài toán:** Cho một danh sách số nguyên và một số nguyên cần tìm. Đếm xem số đó xuất hiện bao nhiêu lần trong danh sách.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 2, 3, 2, 4]`)
    - Số nguyên cần tìm (ví dụ: `2`)
- **Output:**
    - Số lần xuất hiện.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 2, 3, 2, 4]`, `2`
    - Output: `3`
- **Gợi ý:** Dùng vòng lặp `for` để duyệt từng phần tử và dùng `if` để kiểm tra.

**Bài 17: Tạo danh sách số chẵn/lẻ từ danh sách khác**

- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tạo ra hai danh sách mới: một danh sách chỉ chứa các số chẵn, và một danh sách chỉ chứa các số lẻ.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5, 6]`)
- **Output:**
    - Hai danh sách riêng biệt (danh sách số chẵn, danh sách số lẻ).
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 3, 4, 5, 6]`
    - Output: `Chẵn: [2, 4, 6]`, `Lẻ: [1, 3, 5]`
- **Gợi ý:** Dùng vòng lặp `for` để duyệt, toán tử `%` để kiểm tra chẵn/lẻ, và phương thức `append()` để thêm vào danh sách mới.

**Bài 18: Xóa tất cả các lần xuất hiện của một phần tử**

- **Mô tả bài toán:** Cho một danh sách số nguyên và một số nguyên cần xóa. Xóa **tất cả** các lần số đó xuất hiện trong danh sách.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 2, 3, 2, 4]`)
    - Số nguyên cần xóa (ví dụ: `2`)
- **Output:**
    - Danh sách sau khi đã xóa các phần tử.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 2, 3, 2, 4]`, `2`
    - Output: `[1, 3, 4]`
- **Gợi ý:** Tạo một danh sách mới và chỉ thêm vào đó những phần tử không bị xóa.

**Bài 19: Đảo ngược thứ tự danh sách (không dùng slicing `[::-1]`)**

- **Mô tả bài toán:** Cho một danh sách các số nguyên. Đảo ngược thứ tự các phần tử trong danh sách đó mà không dùng cú pháp cắt lát (slicing) `[::-1]`.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5]`)
- **Output:**
    - Danh sách đã đảo ngược.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 3, 4, 5]`
    - Output: `[5, 4, 3, 2, 1]`
- **Gợi ý:** Dùng vòng lặp `for` để duyệt từ cuối danh sách gốc và thêm vào một danh sách mới, hoặc sử dụng phương thức `.reverse()` nếu đã học.

**Bài 20: Kiểm tra danh sách có chứa phần tử trùng lặp không**

- **Mô tả bài toán:** Cho một danh sách các số nguyên. Kiểm tra xem danh sách đó có bất kỳ phần tử nào bị trùng lặp hay không.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 2]`)
- **Output:**
    - `True` nếu có trùng lặp, `False` nếu không.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 3, 2]`
    - Output: `True`
    - Input: `[1, 2, 3]`
    - Output: `False`
- **Gợi ý:** Dùng vòng lặp lồng nhau để so sánh từng cặp phần tử, hoặc dùng một danh sách phụ để lưu các phần tử đã thấy.

**Bài 21: Nối hai danh sách**

- **Mô tả bài toán:** Cho hai danh sách các số nguyên. Nối chúng lại thành một danh sách duy nhất.
- **Input:**
    - Danh sách 1 (ví dụ: `[1, 2]`)
    - Danh sách 2 (ví dụ: `[3, 4]`)
- **Output:**
    - Danh sách đã nối.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2]`, `[3, 4]`
    - Output: `[1, 2, 3, 4]`
- **Gợi ý:** Sử dụng toán tử `+` để nối danh sách hoặc phương thức `.extend()`.

**Bài 22: Lọc các số dương từ danh sách**

- **Mô tả bài toán:** Cho một danh sách các số nguyên (có thể có số âm, số dương và số 0). Tạo một danh sách mới chỉ chứa các số dương.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[-1, 5, -3, 8, 0]`)
- **Output:**
    - Danh sách các số dương.
- **Ví dụ kiểm thử:**
    - Input: `[-1, 5, -3, 8, 0]`
    - Output: `[5, 8]`
- **Gợi ý:** Dùng vòng lặp `for` và điều kiện `if` để kiểm tra từng số.

**Bài 23: Tính trung bình cộng của các số trong danh sách**

- **Mô tả bài toán:** Cho một danh sách các số nguyên hoặc số thực. Tính trung bình cộng của các số đó. (Giả sử danh sách không rỗng).
- **Input:**
    - Danh sách số (ví dụ: `[10, 20, 30]`)
- **Output:**
    - Trung bình cộng (số thực).
- **Ví dụ kiểm thử:**
    - Input: `[10, 20, 30]`
    - Output: `20.0`
- **Gợi ý:** Sử dụng hàm `sum()` để tính tổng và hàm `len()` để lấy số lượng phần tử.

**Bài 24: Tìm vị trí (chỉ số) của một phần tử**

- **Mô tả bài toán:** Cho một danh sách các số nguyên và một số nguyên cần tìm. Tìm chỉ số của lần xuất hiện **Thứ 2** của số đó trong danh sách. Nếu số đó không có trong danh sách, in ra thông báo "Không tìm thấy".
- **Input:**
    - Danh sách số nguyên (ví dụ: `[10, 20, 30, 20]`)
    - Số nguyên cần tìm (ví dụ: `20`)
- **Output:**
    - 3
- **Ví dụ kiểm thử:**
    - Input: `[10, 20, 30, 20]`, `20`
    - Output: 3
    - Input: `[10, 20, 30]`, `40`
    - Output: `Không tìm thấy`
- **Gợi ý:** Duyệt danh sách bằng chỉ số (`range(len())`), dùng `if` để kiểm tra.

**Bài 25: Lấy N phần tử đầu tiên**

- **Mô tả bài toán:** Cho một danh sách các số nguyên và một số nguyên `N`. Tạo và in một danh sách mới chứa `N` phần tử đầu tiên của danh sách gốc.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5]`)
    - Số `N` (ví dụ: `3`)
- **Output:**
    - Danh sách con chứa `N` phần tử đầu tiên.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 3, 4, 5]`, `3`
    - Output: `[1, 2, 3]`
- **Gợi ý:** Sử dụng slicing `[start:end]`.

**Bài 26: Xóa các phần tử tại các chỉ số cụ thể**

- **Mô tả bài toán:** Cho một danh sách các số nguyên và một danh sách các chỉ số cần xóa. Xóa các phần tử tại những chỉ số đó từ danh sách gốc.
- **Input:**
    - Danh sách gốc (ví dụ: `[10, 20, 30, 40, 50]`)
    - Danh sách chỉ số cần xóa (ví dụ: `[1, 3]`)
- **Output:**
    - Danh sách sau khi xóa.
- **Ví dụ kiểm thử 1:**

- Input: `[10, 20, 30, 40, 50]`, `[1, 3]`
- Output: `[10, 30, 50]`
- **Gợi ý:** Khi xóa nhiều phần tử theo chỉ số, nên tạo danh sách mới hoặc xóa các phần tử từ chỉ số lớn nhất trở xuống để tránh lỗi.

**Bài 27: Nhân đôi các phần tử trong danh sách (tạo danh sách mới)**

- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tạo một danh sách mới trong đó mỗi số của danh sách gốc được lặp lại hai lần.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 3]`)
- **Output:**
    - Danh sách mới với các phần tử được lặp lại.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 3]`
    - Output: `[1, 1, 2, 2, 3, 3]`
- **Gợi ý:** Duyệt danh sách gốc và dùng `append()` hai lần cho mỗi phần tử vào danh sách mới.

**Bài 28: Kiểm tra danh sách rỗng**

- **Mô tả bài toán:** Cho một danh sách bất kỳ. Kiểm tra xem danh sách đó có rỗng (không có phần tử nào) hay không.
- **Input:**
    - Danh sách (ví dụ: `[]` hoặc `[1, 2]`)
- **Output:**
    - `True` nếu rỗng, `False` nếu không rỗng.
- **Ví dụ kiểm thử:**
    - Input: `[]`
    - Output: `True`
    - Input: `[1, 2]`
    - Output: `False`
- **Gợi ý:** Sử dụng hàm `len()` hoặc kiểm tra trực tiếp danh sách trong điều kiện `if`.

**Bài 29: Tính tổng các phần tử chẵn/lẻ trong danh sách**

- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tính riêng tổng của tất cả các số chẵn và tổng của tất cả các số lẻ trong danh sách đó.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5]`)
- **Output:**
    - Tổng số chẵn, tổng số lẻ.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 3, 4, 5]`
    - Output: `Tổng chẵn: 6`, `Tổng lẻ: 9`
- **Gợi ý:** Khởi tạo hai biến tổng riêng biệt cho chẵn và lẻ. Dùng vòng lặp `for` và `if` để phân loại.

**Bài 30: Đếm các số lớn hơn một ngưỡng cho trước**

- **Mô tả bài toán:** Cho một danh sách các số nguyên và một ngưỡng số `X`. Đếm xem có bao nhiêu số trong danh sách lớn hơn `X`.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[10, 20, 5, 30, 15]`)
    - Ngưỡng `X` (ví dụ: `15`)
- **Output:**
    - Số lượng số lớn hơn ngưỡng.
- **Ví dụ kiểm thử:**
    - Input: `[10, 20, 5, 30, 15]`, `15`
    - Output: `2` (là 20 và 30)
- **Gợi ý:** Dùng một biến đếm, lặp qua danh sách và dùng `if` để kiểm tra điều kiện.