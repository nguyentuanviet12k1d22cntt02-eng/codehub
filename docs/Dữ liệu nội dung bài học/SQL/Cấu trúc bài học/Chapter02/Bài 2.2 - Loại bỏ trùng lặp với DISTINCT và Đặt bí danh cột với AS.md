---
lessonId: "SQL-02.02"
title: "Loại bỏ trùng lặp với DISTINCT và Đặt bí danh cột với AS"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["distinct", "as", "alias", "column-alias", "logical-processing", "duplicate-removal"]
prerequisites: ["SQL-02.01"]
---

# Bài 2.2: Loại bỏ trùng lặp với DISTINCT và Đặt bí danh cột với AS

---

## 1. Khái niệm & Vấn đề

Hãy hình dung bạn có danh sách 100.000 đơn hàng. Khi muốn biết: *"Công ty chúng ta đã từng giao hàng tới những thành phố nào?"*, nếu chỉ `SELECT City FROM Orders`, bạn sẽ nhận về 100.000 dòng với từ "Hà Nội", "TP. Hồ Chí Minh" lặp đi lặp lại hàng nghìn lần! Bạn chỉ muốn một danh sách các thành phố **duy nhất, không trùng lặp**.

Mặt khác, khi hiển thị dữ liệu ra báo cáo hoặc tính toán (ví dụ: `Price * Quantity`), kết quả trả về thường có tên cột khó hiểu (như `c102`) hoặc mang nhãn `(No column name)`.

Để giải quyết hai bài toán này, SQL cung cấp hai từ khóa hữu dụng: **`DISTINCT`** (Loại bỏ trùng lặp) và **`AS`** (Đặt bí danh - Alias).

```
   BẢNG GỐC: Customers                     KẾT QUẢ KHI DÙNG DISTINCT
┌────────────┬────────────────┐           ┌────────────────┐
│ CustomerID │ City           │           │ City           │
├────────────┼────────────────┤           ├────────────────┤
│ 1          │ Hà Nội         │   ───►    │ Hà Nội         │
│ 2          │ TP. Hồ Chí Minh│           │ TP. Hồ Chí Minh│
│ 3          │ Hà Nội         │           │ Đà Nẵng        │
│ 4          │ Đà Nẵng        │           └────────────────┘
│ 5          │ TP. Hồ Chí Minh│            (Chỉ giữ lại 3 giá trị duy nhất)
└────────────┴────────────────┘
```

| Từ khóa | Chức năng kỹ thuật | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **`DISTINCT`** | Loại bỏ tất cả các dòng trùng lặp hoàn toàn trong tập kết quả trả về. | Bộ lọc thông minh chỉ lấy danh sách các địa danh không trùng tên. |
| **`AS` (Alias)** | Đặt lại tên tạm thời cho cột hoặc bảng trong quá trình hiển thị kết quả truy vấn. | Đặt "biệt danh" hoặc dán nhãn tiếng Việt dễ hiểu cho một cột dữ liệu. |

---

## 2. Cú pháp & Vận hành trong T-SQL

### 2.1. Loại bỏ trùng lặp với `DISTINCT`

#### A. Dùng `DISTINCT` trên 1 cột:
```sql
-- Lấy danh sách các tỉnh/thành phố duy nhất có khách hàng
SELECT DISTINCT City 
FROM sales.Customers;
```

#### B. Dùng `DISTINCT` trên nhiều cột:
> [!NOTE]
> Khi viết `SELECT DISTINCT Col1, Col2`, SQL Server sẽ kiểm tra **cặp giá trị tổ hợp `(Col1, Col2)`**. Dòng chỉ bị coi là trùng lặp khi **tất cả** các cột trong danh sách đều giống hệt nhau!

```text
City             Country        --> Có bị loại bỏ không?
─────────────────────────────
Hà Nội           Việt Nam       (Giữ dòng đầu)
Hà Nội           Việt Nam       (BỊ LOẠI BỎ vì trùng cả City và Country)
Hà Nội           Nhật Bản       (VẪN GIỮ vì tổ hợp khác nhau)
```

```sql
SELECT DISTINCT City, Country 
FROM sales.Customers;
```

---

### 2.2. Đặt bí danh cột với từ khóa `AS`

Khi tính toán biểu thức hoặc muốn tiêu đề cột thân thiện hơn:

```sql
-- Đặt bí danh cho cột và biểu thức tính toán
SELECT 
    ProductName AS [Tên Sản Phẩm],
    UnitPrice AS [Đơn Giá Gốc],
    UnitPrice * 0.9 AS [Giá Sau Khuyến Mãi]
FROM sales.Products;
```

#### 3 cách đặt bí danh trong SQL Server:
1. **Dùng từ khóa `AS` kèm dấu ngoặc vuông `[ ]` (Khuyên dùng khi có dấu cách hoặc tiếng Việt):**  
   `SELECT ProductName AS [Tên Sản Phẩm]`
2. **Dùng dấu ngoặc vuông bỏ từ khóa `AS`:**  
   `SELECT ProductName [Tên Sản Phẩm]`
3. **Dùng dấu gán `=` (Cú pháp riêng của T-SQL):**  
   `SELECT [Tên Sản Phẩm] = ProductName`

---

## 3. Thứ tự xử lý logic & "Cái bẫy" Bí danh trong `WHERE`

> [!WARNING]
> **Cạm bẫy kinh điển:** Tại sao bạn **KHÔNG THỂ** dùng Bí danh (Alias) trong mệnh đề `WHERE`?

Xét đoạn code lỗi sau:
```sql
-- ❌ BỊ LỖI: Invalid column name 'GiaKhuyenMai'
SELECT ProductName, UnitPrice * 0.9 AS GiaKhuyenMai
FROM sales.Products
WHERE GiaKhuyenMai < 500000;
```

### Nguyên nhân từ thứ tự thực thi (Logical Processing Order):
```
1. FROM sales.Products        (Xác định bảng nguồn)
2. WHERE GiaKhuyenMai < 500000 (Lọc dữ liệu - TẠI ĐÂY CHƯA HỀ CÓ BIẾN GiaKhuyenMai!)
3. SELECT ... AS GiaKhuyenMai (Mệnh đề SELECT sinh ra bí danh sau cùng)
```
Vì mệnh đề `WHERE` chạy **trước** mệnh đề `SELECT`, tại thời điểm lọc điều kiện, SQL Server **chưa hề biết** bí danh `GiaKhuyenMai` là gì.

✅ **Cách viết đúng chuẩn:**
```sql
SELECT ProductName, UnitPrice * 0.9 AS GiaKhuyenMai
FROM sales.Products
WHERE (UnitPrice * 0.9) < 500000;
```

---

## 4. Tối ưu hiệu năng với `DISTINCT` (Best Practices)

* **Chi phí của `DISTINCT`:** Để loại bỏ trùng lặp, SQL Server Engine bắt buộc phải thực hiện thao tác **Sắp xếp (Sort)** hoặc **Băm (Hash Aggregate)** toàn bộ tập dữ liệu trong bộ nhớ RAM. 
* Trên bảng có hàng chục triệu dòng, lệnh `DISTINCT` có thể gây tốn rất nhiều CPU và bộ nhớ. 
* **Quy tắc vàng:** Chỉ dùng `DISTINCT` khi thực sự có nhu cầu nghiệp vụ cần dữ liệu duy nhất. Không lạm dụng `DISTINCT` để "chữa cháy" cho các câu lệnh ghép bảng (`JOIN`) bị viết sai sinh ra dữ liệu nhân đôi!

---

## 5. Thực hành phân bậc (Scaffolded Practice)

### Level 1: Trắc nghiệm - Câu 1: Loại bỏ trùng lặp với DISTINCT
Cho bảng dữ liệu **`hr.Employees`** và câu lệnh truy vấn dưới đây:

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start my-3">

<div>

**Bảng dữ liệu mẫu `hr.Employees` (10 dòng):**

| ID | FullName | Department |
| :--- | :--- | :--- |
| 1 | Nguyễn Văn A | IT |
| 2 | Trần Thị B | IT |
| 3 | Lê Văn C | IT |
| 4 | Phạm Minh D | IT |
| 5 | Hoàng Thị E | Kế Toán |
| 6 | Đỗ Văn F | Kế Toán |
| 7 | Vũ Thị G | Kế Toán |
| 8 | Bùi Văn H | Kế Toán |
| 9 | Ngô Thị K | Nhân Sự |
| 10 | Đặng Văn M | Nhân Sự |

</div>

<div>

**Câu lệnh truy vấn:**

```sql
SELECT DISTINCT Department 
FROM hr.Employees;
```

</div>

</div>

Khi thực thi câu lệnh truy vấn trên, bảng kết quả trả về sẽ có **bao nhiêu dòng dữ liệu**?
- A. 10 dòng.
- B. 3 dòng.
- C. 1 dòng.
- D. Báo lỗi cú pháp.

*(Đáp án đúng: **B** - Từ khóa `DISTINCT` loại bỏ toàn bộ các giá trị trùng lặp. Cột `Department` ban đầu có 10 dòng với 3 phòng ban khác nhau ('IT', 'Kế Toán', 'Nhân Sự'). Sau khi lọc trùng, tập kết quả chỉ còn đúng 3 dòng duy nhất tương ứng với 3 phòng ban).*

### Level 1: Trắc nghiệm - Câu 2: Quy tắc đặt bí danh AS
Khi bạn muốn đặt bí danh cho cột có chứa khoảng trắng hoặc chữ tiếng Việt có dấu (ví dụ: `Tổng Doanh Thu`), cú pháp chuẩn xác trong T-SQL là gì?
- A. `SELECT TotalAmount AS Tổng Doanh Thu FROM sales.Orders;`
- B. `SELECT TotalAmount AS [Tổng Doanh Thu] FROM sales.Orders;`
- C. `SELECT TotalAmount AS {Tổng Doanh Thu} FROM sales.Orders;`
- D. `SELECT TotalAmount AS <Tổng Doanh Thu> FROM sales.Orders;`

*(Đáp án đúng: **B** - Trong T-SQL, nếu bí danh cột chứa khoảng cách (space) hoặc ký tự đặc biệt/tiếng Việt, bắt buộc phải bao bọc trong cặp ngoặc vuông `[ ... ]` hoặc nháy đơn `' ... '`).*

### Level 1: Trắc nghiệm - Câu 3: Phạm vi tác dụng của DISTINCT đa cột
Cho câu lệnh: `SELECT DISTINCT City, Country FROM sales.Customers;`. Từ khóa `DISTINCT` sẽ lọc trùng lặp như thế nào?
- A. Chỉ lọc trùng trên cột `City`, cột `Country` vẫn giữ nguyên.
- B. Chỉ lọc trùng trên cột `Country`, cột `City` vẫn giữ nguyên.
- C. Lọc các dòng có sự trùng lặp đồng thời trên TỔ HỢP CẢ HAI CỘT (`City` và `Country`).
- D. Báo lỗi vì `DISTINCT` chỉ được phép dùng với 1 cột duy nhất.

*(Đáp án đúng: **C** - Từ khóa `DISTINCT` tác động lên toàn bộ danh sách các cột sau `SELECT`. Hai dòng chỉ bị coi là trùng lặp và bị loại bỏ khi cả giá trị `City` VÀ `Country` của chúng đều giống nhau).*

### 🛠️ Level 2: Viết câu lệnh hoàn chỉnh
Từ bảng `Sales.Orders` chứa các cột: `OrderID`, `CustomerID`, `OrderDate`, `Freight` (Phí vận chuyển).

**Yêu cầu:** 
1. Lấy danh sách tất cả các mã khách hàng (`CustomerID`) **duy nhất** đã từng đặt hàng trong hệ thống.
2. Hiển thị thông tin đơn hàng gồm: Mã đơn hàng (`OrderID`), Phí vận chuyển gốc (`Freight`) đặt tên là `[Phí Gốc]`, và Phí vận chuyển có thuế 10% (`Freight * 1.1`) đặt tên là `[Phí Có Thuế]`.

<details>
<summary><b>👉 Xem code T-SQL mẫu</b></summary>

```sql
-- 1. Lấy danh sách mã khách hàng duy nhất
SELECT DISTINCT CustomerID 
FROM Sales.Orders;

-- 2. Đặt bí danh cho các cột tính toán
SELECT 
    OrderID,
    Freight AS [Phí Gốc],
    Freight * 1.1 AS [Phí Có Thuế]
FROM Sales.Orders;
```
</details>

---

## 6. Đúc kết & Đi tiếp

### 📌 3 Điểm cốt lõi cần nhớ:
1. `DISTINCT` loại bỏ toàn bộ các dòng trùng lặp trên tổ hợp tất cả các cột được chọn trong `SELECT`.
2. Từ khóa `AS` giúp đặt tên hiển thị trực quan cho cột, đặc biệt là các cột tính toán biểu thức.
3. Bí danh cột được sinh ra ở `SELECT` (sau `WHERE`), do đó không thể dùng bí danh cột bên trong điều kiện lọc `WHERE`.

👉 **Bài tiếp theo:** [Bài 2.3: Lọc điều kiện cơ bản với mệnh đề WHERE](file:///d:/Project/LearnPython/docs/D%E1%BB%AF%20li%E1%BB%87u%20n%E1%BB%99i%20dung%20b%C3%A0i%20h%E1%BB%8Dc/Chapter02/B%C3%A0i%202.3%20-%20L%E1%BB%8Dc%20%C4%91i%E1%BB%81u%20ki%E1%BB%87n%20c%C6%A1%20b%E1%BA%A3n%20v%E1%BB%9Bi%20m%E1%BB%87nh%20%C4%91%E1%BB%81%20WHERE.md) — Khám phá cách lọc và trích xuất chính xác những bản ghi thỏa mãn điều kiện mong muốn!
