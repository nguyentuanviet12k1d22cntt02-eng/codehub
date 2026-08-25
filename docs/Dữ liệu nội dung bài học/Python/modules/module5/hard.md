### **5 BÀI TẬP MỨC KHÓ**

**Bài 31: Tìm phần tử xuất hiện nhiều nhất (Mode)**

- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tìm và in ra phần tử (hoặc các phần tử) xuất hiện nhiều nhất trong danh sách. Nếu có nhiều phần tử có cùng số lần xuất hiện nhiều nhất, in tất cả chúng.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 2, 3, 3, 3, 4]`)
- **Output:**
    - Danh sách các phần tử xuất hiện nhiều nhất.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 2, 3, 3, 3, 4]`
    - Output: `[3]`
    - Input: `[1, 2, 2, 3, 3]`
    - Output: `[2, 3]`
- **Gợi ý:** Dùng vòng lặp để đếm số lần xuất hiện của từng phần tử (có thể dùng phương thức `.count()` hoặc một danh sách/dictionary tạm để lưu trữ tần suất), tìm số lần xuất hiện tối đa, sau đó duyệt lại để thu thập các phần tử có tần suất đó.
    
    lời Giải
    

**Bài 32: Xóa các phần tử trùng lặp và giữ thứ tự (Unique and Ordered)**

- **Mô tả bài toán:** Cho một danh sách các số nguyên. Tạo và in ra một danh sách mới chỉ chứa các phần tử duy nhất (không trùng lặp) từ danh sách gốc, đồng thời giữ nguyên thứ tự xuất hiện lần đầu của chúng.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 2, 3, 1, 4]`)
- **Output:**
    - Danh sách mới chỉ chứa các phần tử duy nhất theo thứ tự.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 2, 3, 1, 4]`
    - Output: `[1, 2, 3, 4]`
- **Gợi ý:** Duyệt qua danh sách gốc. Với mỗi phần tử, kiểm tra xem nó đã có trong danh sách kết quả mới chưa trước khi thêm vào.

**Bài 33: Kiểm tra và sửa lỗi Danh sách đã sắp xếp (Gần đúng)**

- **Mô tả bài toán:** Cho một danh sách các số nguyên. Kiểm tra xem danh sách đó có phải là danh sách đã được sắp xếp tăng dần hay không. Nếu không, in ra vị trí của phần tử đầu tiên làm cho danh sách không còn được sắp xếp (ví dụ: `[1, 5, 3, 8]` thì `3` ở vị trí 2 là lỗi).
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 3, 5, 2, 8]`)
- **Output:**
    - `True` nếu đã sắp xếp, hoặc "Lỗi tại vị trí: [chỉ số lỗi]" nếu không.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 3, 4, 5]`
    - Output: `True`
    - Input: `[1, 3, 5, 2, 8]`
    - Output: `Lỗi tại vị trí: 3` (số 2 làm hỏng thứ tự tăng dần)
- **Gợi ý:** Duyệt danh sách từ phần tử thứ hai. So sánh mỗi phần tử với phần tử đứng ngay trước nó. Nếu tìm thấy một cặp `list[i] < list[i-1]`, thì đó là vị trí lỗi và bạn có thể dừng.

**Bài 34: Tìm cặp số có tổng bằng K**

- **Mô tả bài toán:** Cho một danh sách các số nguyên và một số nguyên `K`. Tìm và in ra tất cả các cặp số trong danh sách có tổng bằng `K`. Mỗi cặp chỉ được in một lần và thứ tự các số trong cặp không quan trọng.l
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 5, 2, 8, 3]`)
    - Số `K` (ví dụ: `10`)
- **Output:**
    - Các cặp số (ví dụ: `(2, 8)`, `(1, 9)` nếu có, hoặc `Không tìm thấy cặp nào` nếu không có).
- **Ví dụ kiểm thử:**
    - Input: `[1, 5, 2, 8, 3]`, `10`
    - Output: `(2, 8)`
    - Input: `[4, 2, 6, 7]`, `10`
    - Output: `(4, 6)`
    - Input: `[1, 2, 3]`, `10`
    - Output: `Không tìm thấy cặp nào`
- **Gợi ý:** Sử dụng vòng lặp lồng nhau để duyệt qua tất cả các cặp số có thể. Cẩn thận tránh in trùng lặp (ví dụ: `(2, 8)` và `(8, 2)`).

**Bài 35: Xoay vòng danh sách (Rotate List)**

- **Mô tả bài toán:** Cho một danh sách các số nguyên và một số nguyên `k`. Xoay danh sách sang phải `k` bước. Nghĩa là, các phần tử ở cuối danh sách sẽ di chuyển về phía trước.
- **Input:**
    - Danh sách số nguyên (ví dụ: `[1, 2, 3, 4, 5]`)
    - Số bước xoay `k` (ví dụ: `2`)
- **Output:**
    - Danh sách sau khi xoay.
- **Ví dụ kiểm thử:**
    - Input: `[1, 2, 3, 4, 5]`, `2`
    - Output: `[4, 5, 1, 2, 3]`
    - Input: `[1, 2, 3]`, `1`
    - Output: `[3, 1, 2]`
- **Gợi ý:** Bạn có thể tính toán `k` hiệu quả bằng `k = k % len(danh_sach)` để xử lý `k` lớn hơn độ dài danh sách. Sau đó, chia danh sách thành hai phần (phần cuối cần xoay lên đầu và phần đầu còn lại) và nối chúng lại. Hoặc dùng vòng lặp để thực hiện từng bước xoay nhỏ (di chuyển phần tử cuối lên đầu).

---