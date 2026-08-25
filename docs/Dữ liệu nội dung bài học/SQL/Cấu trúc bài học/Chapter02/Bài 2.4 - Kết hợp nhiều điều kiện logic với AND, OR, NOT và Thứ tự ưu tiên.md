---
lessonId: "SQL-02.04"
title: "Kết hợp nhiều điều kiện logic: AND, OR, NOT và Thứ tự ưu tiên toán tử"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["and", "or", "not", "operator-precedence", "parentheses", "three-valued-logic", "t-sql"]
prerequisites: ["SQL-02.03"]
---

# Bài 2.4: Kết hợp nhiều điều kiện logic: AND, OR, NOT và Thứ tự ưu tiên toán tử

---

## 1. Khái niệm & Vấn đề

Trong thực tế, các yêu cầu truy vấn nghiệp vụ thường kết hợp nhiều điều kiện cùng lúc. Ví dụ yêu cầu từ phòng Nhân sự:
> *"Lọc danh sách ứng viên: **Đã tốt nghiệp đại học** VÀ (**Có trên 2 năm kinh nghiệm** HOẶC **Có chứng chỉ Microsoft SQL Server**)."*

Nếu không nắm vững quy tắc kết hợp các toán tử logic **`AND`**, **`OR`**, **`NOT`** và thứ tự ưu tiên thực thi của chúng, câu lệnh SQL sẽ trả về kết quả sai lệch hoàn toàn.

| Toán tử | Tên gọi | Nguyên tắc đánh giá |
| :--- | :--- | :--- |
| **`AND`** | Toán tử VÀ | Bắt buộc **cả hai vế** đều phải thỏa mãn (`TRUE`) |
| **`OR`** | Toán tử HOẶC | Chỉ cần **ít nhất một trong hai vế** thỏa mãn (`TRUE`) |
| **`NOT`** | Toán tử PHỦ ĐỊNH | Đảo ngược giá trị logic (`TRUE` thành `FALSE`, `FALSE` thành `TRUE`) |

---

## 2. Bảng Chân Trị Logic (Truth Table)

| Điều kiện A | Điều kiện B | `A AND B` | `A OR B` | `NOT A` |
| :---: | :---: | :---: | :---: | :---: |
| **TRUE** | **TRUE** | **TRUE** | **TRUE** | **FALSE** |
| **TRUE** | **FALSE** | **FALSE** | **TRUE** | **FALSE** |
| **FALSE** | **TRUE** | **FALSE** | **TRUE** | **TRUE** |
| **FALSE** | **FALSE** | **FALSE** | **FALSE** | **TRUE** |

---

## 3. Thứ Tự Ưu Tiên Toán Tử (Operator Precedence)

Khi câu lệnh chứa đồng thời nhiều toán tử logic mà không dùng dấu ngoặc đơn, SQL Server Engine sẽ luôn thực thi theo thứ tự ưu tiên từ cao xuống thấp:

| Mức ưu tiên | Thành phần | Mô tả |
| :---: | :--- | :--- |
| **1 (Cao nhất)** | `( )` | Cặp ngoặc đơn (luôn được tính toán trước tiên) |
| **2** | `=`, `<>`, `>`, `<`, `>=`, `<=` | Các toán tử so sánh giá trị |
| **3** | `NOT` | Phủ định điều kiện |
| **4** | `AND` | Phép toán logic VÀ (ưu tiên hơn `OR`) |
| **5 (Thấp nhất)** | `OR` | Phép toán logic HOẶC |

---

### Phân tích rủi ro khi không dùng cặp ngoặc đơn `( )`

Xét bài toán thực tế: Tìm khách hàng ở **Hà Nội** HOẶC **Đà Nẵng** VÀ có **Tổng chi tiêu trên 50.000.000 VNĐ**.

#### Câu lệnh viết sai (thiếu ngoặc đơn):
```sql
SELECT CustomerID, FullName, City, TotalSpent
FROM sales.Customers
WHERE City = N'Hà Nội' OR City = N'Đà Nẵng' AND TotalSpent > 50000000;
```

* **Cơ chế thực thi của SQL Server**: Do `AND` có mức ưu tiên cao hơn `OR`, SQL Server tự động gom nhóm thành:
  ```sql
  WHERE City = N'Hà Nội' OR (City = N'Đà Nẵng' AND TotalSpent > 50000000)
  ```
* **Hậu quả**: Tất cả khách hàng ở **Hà Nội** (kể cả người chưa từng mua hàng hay có `TotalSpent = 0`) đều bị lấy ra trong kết quả.

#### Câu lệnh viết đúng (dùng ngoặc đơn):
```sql
SELECT CustomerID, FullName, City, TotalSpent
FROM sales.Customers
WHERE (City = N'Hà Nội' OR City = N'Đà Nẵng') 
  AND TotalSpent > 50000000;
```

---

## 4. Cú pháp & Ví dụ Thực Chiến

### 4.1. Kết hợp `AND` (Tất cả điều kiện phải đúng)
```sql
-- Tìm nhân viên phòng IT có mức lương từ 20.000.000 trở lên
SELECT EmployeeID, FullName, Department, Salary
FROM hr.Employees
WHERE Department = N'Công nghệ thông tin' 
  AND Salary >= 20000000;
```

### 4.2. Kết hợp `OR` (Một trong các điều kiện đúng)
```sql
-- Tìm các sản phẩm thuộc danh mục 'Điện thoại' hoặc 'Laptop'
SELECT ProductID, ProductName, CategoryName
FROM sales.Products
WHERE CategoryName = N'Điện thoại' 
   OR CategoryName = N'Laptop';
```

### 4.3. Sử dụng `NOT` (Phủ định điều kiện)
```sql
-- Lọc các đơn hàng KHÔNG bị hủy và KHÔNG bị trả lại
SELECT OrderID, OrderStatus, TotalAmount
FROM sales.Orders
WHERE NOT (OrderStatus = 'CANCELLED' OR OrderStatus = 'RETURNED');
```

---

## 5. Nguyên Tắc Cần Nhớ (Best Practices)

> [!WARNING]
> 1. **Luôn dùng cặp ngoặc đơn `( )` khi kết hợp `AND` và `OR`**: Việc viết rõ cặp ngoặc `( )` giúp loại bỏ hoàn toàn sự nhập nhằng về logic, giúp câu truy vấn rõ ràng và người khác đọc hiểu ngay ý đồ nghiệp vụ.
> 2. **Cẩn trọng với giá trị `NULL` trong logic 3 trạng thái**: `NOT (NULL)` trong SQL vẫn trả về `UNKNOWN` (chứ không phải `TRUE`). Do đó, các mệnh đề phủ định `NOT` có thể vô tình loại bỏ các bản ghi chứa `NULL`.

---

## 6. Thực hành phân bậc (Scaffolded Practice)

### Level 1: Trắc nghiệm - Câu 1: Thứ tự ưu tiên AND và OR
Cho bảng dữ liệu **`hr.Employees`** và câu lệnh truy vấn dưới đây:

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start my-3">

<div>

**Bảng dữ liệu mẫu `hr.Employees`:**

| EmployeeID | FullName | Age | Department |
| :--- | :--- | :--- | :--- |
| 1 | Nguyễn Văn A | 22 | IT |
| 2 | Trần Thị B | 25 | Sales |
| 3 | Lê Văn C | 35 | Sales |
| 4 | Phạm Minh D | 28 | HR |

</div>

<div>

**Câu lệnh truy vấn:**

```sql
SELECT * 
FROM hr.Employees 
WHERE Age > 30 
  AND Department = 'Sales' 
   OR Department = 'IT';
```

</div>

</div>

Theo thứ tự ưu tiên toán tử logic trong SQL, nhân viên nào sau đây **chắc chắn sẽ xuất hiện** trong kết quả truy vấn?
- A. Một nhân viên 22 tuổi thuộc phòng IT.
- B. Một nhân viên 25 tuổi thuộc phòng Sales.
- C. Một nhân viên 28 tuổi thuộc phòng HR.
- D. Không có nhân viên nào dưới 30 tuổi được chọn.

*(Đáp án đúng: **A** - Do toán tử `AND` có thứ tự ưu tiên cao hơn `OR`, biểu thức logic được thực thi tương đương với `(Age > 30 AND Department = 'Sales') OR (Department = 'IT')`. Bất kỳ nhân viên nào thuộc phòng IT (như Nguyễn Văn A: 22 tuổi, phòng IT) đều thỏa mãn điều kiện `OR Department = 'IT'` mà không cần xét tuổi).*

### Level 1: Trắc nghiệm - Câu 2: Tác dụng của cặp ngoặc đơn ( )
Bạn muốn tìm các khách hàng ở `Hà Nội` hoặc `Đà Nẵng` và có tổng chi tiêu `TotalSpent > 50000000`. Câu lệnh nào sau đây thể hiện đúng ý đồ nghiệp vụ này?
- A. `SELECT * FROM sales.Customers WHERE City = 'Hà Nội' OR City = 'Đà Nẵng' AND TotalSpent > 50000000;`
- B. `SELECT * FROM sales.Customers WHERE (City = 'Hà Nội' OR City = 'Đà Nẵng') AND TotalSpent > 50000000;`
- C. `SELECT * FROM sales.Customers WHERE City = ('Hà Nội' OR 'Đà Nẵng') AND TotalSpent > 50000000;`
- D. `SELECT * FROM sales.Customers WHERE City = 'Hà Nội' AND City = 'Đà Nẵng' OR TotalSpent > 50000000;`

*(Đáp án đúng: **B** - Bắt buộc phải dùng cặp ngoặc tròn `(City = 'Hà Nội' OR City = 'Đà Nẵng')` để ép SQL Server tính toán điều kiện thành phố trước, sau đó mới kết hợp với điều kiện tổng chi tiêu).*

### Level 1: Trắc nghiệm - Câu 3: Toán tử phủ định NOT
Cho biểu thức: `WHERE NOT (Department = 'IT' OR Salary < 10000000)`. Theo luật De Morgan trong logic, biểu thức trên tương đương hoàn toàn với biểu thức nào sau đây?
- A. `WHERE Department <> 'IT' OR Salary >= 10000000`
- B. `WHERE Department <> 'IT' AND Salary >= 10000000`
- C. `WHERE Department = 'IT' AND Salary >= 10000000`
- D. `WHERE NOT Department = 'IT' OR NOT Salary < 10000000`

*(Đáp án đúng: **B** - Theo định luật De Morgan, phủ định của `(A OR B)` chính là `(NOT A AND NOT B)`, tương đương với `Department <> 'IT' AND Salary >= 10000000`).*

### Level 2: Viết câu lệnh truy vấn đa điều kiện
Cho bảng `sales.Products` có các cột: `ProductID`, `ProductName`, `UnitPrice`, `UnitsInStock`, `Discontinued` (kiểu `BIT`: 1 là ngừng kinh doanh, 0 là đang kinh doanh).

**Yêu cầu:** Viết câu lệnh tìm các sản phẩm thỏa mãn đồng thời:
1. Đang còn kinh doanh (`Discontinued = 0`).
2. Có đơn giá trên 10.000.000 VNĐ (`UnitPrice > 10000000`) HOẶC số lượng tồn kho đang ở mức báo động dưới 5 sản phẩm (`UnitsInStock < 5`).

<details>
<summary>👉 Xem code T-SQL mẫu</summary>

```sql
SELECT ProductID, ProductName, UnitPrice, UnitsInStock, Discontinued
FROM sales.Products
WHERE Discontinued = 0 
  AND (UnitPrice > 10000000 OR UnitsInStock < 5);
```
</details>

---

## 7. Tổng kết

* `AND` đòi hỏi tất cả điều kiện đều đúng; `OR` chỉ cần ít nhất một điều kiện đúng; `NOT` đảo ngược kết quả logic.
* Thứ tự ưu tiên mặc định: `( )` → So sánh → `NOT` → `AND` → `OR`.
* Luôn dùng cặp ngoặc đơn `( )` khi câu lệnh kết hợp cả `AND` và `OR`.
