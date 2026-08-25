---
lessonId: "SQL-02.03"
title: "Lọc điều kiện cơ bản với mệnh đề WHERE (Toán tử so sánh)"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["where", "filtering", "comparison-operators", "sargable", "predicate", "t-sql"]
prerequisites: ["SQL-02.01", "SQL-02.02"]
---

# Bài 2.3: Lọc điều kiện cơ bản với mệnh đề WHERE (Toán tử so sánh)

---

## 1. Khái niệm & Vấn đề

Trong một hệ thống bán lẻ có hơn 10.000.000 đơn hàng, nếu bạn chỉ muốn tìm những đơn hàng có giá trị trên **10.000.000 VNĐ** hoặc tìm tất cả sản phẩm đang có số lượng tồn kho bằng **0**, làm sao để yêu cầu Database chỉ trả về đúng những bản ghi đó?

Mệnh đề **`WHERE`** chính là chiếc "cổng an ninh" kiểm soát dữ liệu. Nó đóng vai trò là một **Vị từ lọc (Predicate)**: kiểm tra từng dòng dữ liệu, nếu điều kiện là `TRUE` thì dòng đó được giữ lại; nếu `FALSE` hoặc `UNKNOWN (NULL)` thì dòng đó sẽ bị loại bỏ ngay lập tức!

```
                  ┌─────────────────────────────────────────────────┐
                  │              BẢNG GỐC: 10,000,000 DÒNG           │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │                 MỆNH ĐỀ: WHERE                  │
                  │        (Điều kiện: UnitPrice >= 10000000)       │
                  │                                                 │
                  │   Dòng 1: 15,000,000 >= 10,000,000? -> [ TRUE ] │
                  │   Dòng 2:  3,000,000 >= 10,000,000? -> [FALSE] │
                  └────────────────────────┬────────────────────────┘
                                           │
                                           ▼
                  ┌─────────────────────────────────────────────────┐
                  │            KẾT QUẢ: 1,200 DÒNG THỎA MÃN         │
                  └─────────────────────────────────────────────────┘
```

---

## 2. Bảng Các Toán Tử So Sánh Cốt Lõi Trong T-SQL

| Toán tử | Ý nghĩa | Ví dụ cú pháp T-SQL |
| :---: | :--- | :--- |
| `=` | Bằng | `WHERE Country = N'Việt Nam'` |
| `<>` hoặc `!=` | Khác / Không bằng (`<>` là chuẩn ANSI SQL) | `WHERE Status <> 'CANCELLED'` |
| `>` | Lớn hơn | `WHERE UnitPrice > 1000000` |
| `<` | Nhỏ hơn | `WHERE UnitsInStock < 10` |
| `>=` | Lớn hơn hoặc bằng | `WHERE Age >= 18` |
| `<=` | Nhỏ hơn hoặc bằng | `WHERE DiscountRate <= 0.15` |

---

## 3. Cú pháp & Vận hành theo Từng Kiểu Dữ Liệu

### 3.1. Lọc dữ liệu kiểu Số (Numeric / Integer / Decimal)
Không sử dụng dấu nháy đối với giá trị số:
```sql
-- Tìm tất cả sản phẩm có đơn giá lớn hơn hoặc bằng 20 triệu
SELECT ProductID, ProductName, UnitPrice
FROM sales.Products
WHERE UnitPrice >= 20000000;
```

### 3.2. Lọc dữ liệu kiểu Chuỗi ký tự (Varchar / NVarchar)
> [!IMPORTANT]
> Bắt buộc phải đặt chuỗi trong cặp nháy đơn `'...'`. Đối với chuỗi tiếng Việt có dấu (`NVARCHAR`), **bắt buộc phải có tiền tố `N`** đứng trước:

```sql
-- Lọc theo chuỗi tiếng Việt có dấu
SELECT CustomerID, FullName, City
FROM sales.Customers
WHERE City = N'Đà Nẵng';
```

### 3.3. Lọc dữ liệu kiểu Ngày & Giờ (Date / DateTime)
Chuỗi ngày tháng được đặt trong cặp nháy đơn theo định dạng chuẩn quốc tế `YYYY-MM-DD` (Năm-Tháng-Ngày) hoặc `YYYYMMDD` để tránh bị hiểu nhầm giữa định dạng Mỹ (MM/DD) và Anh/Việt (DD/MM):

```sql
-- Tìm các đơn hàng được đặt từ ngày 01/01/2026 trở về sau
SELECT OrderID, CustomerID, OrderDate, TotalAmount
FROM sales.Orders
WHERE OrderDate >= '2026-01-01';
```

---

## 4. Lỗi thường gặp & Tối ưu (Best Practices & Pitfalls)

> [!WARNING]
> **Các sai lầm nguy hiểm ảnh hưởng đến hiệu năng truy vấn:**
> 1. **Dùng `= NULL` để lọc dữ liệu rỗng:** 
>    - ❌ `WHERE PhoneNumber = NULL;` $\rightarrow$ Luôn trả về rỗng vì không có gì "bằng" một giá trị chưa xác định!
>    - ✅ `WHERE PhoneNumber IS NULL;` *(Sẽ học chi tiết ở bài 3.3)*.
> 2. **Viết biểu thức biến đổi trên cột (Non-SARGable Query):**
>    - Khi viết hàm bao bọc lấy cột trong `WHERE`, SQL Server sẽ không thể sử dụng Index trên cột đó mà phải quét toàn bộ bảng (Table Scan).
>    ```sql
>    -- ❌ CHẬM (Quét toàn bảng): Hàm YEAR() làm mất tác dụng của Index
>    WHERE YEAR(OrderDate) = 2026;
>    
>    -- ✅ NHANH (SARGable): Tận dụng được Index tìm kiếm theo khoảng
>    WHERE OrderDate >= '2026-01-01' AND OrderDate < '2027-01-01';
>    ```

---

### Level 1: Trắc nghiệm - Câu 1: So sánh giá trị 2 cột trong WHERE
Cho bảng dữ liệu **`Production.Product`** với thông tin hàng tồn kho như sau:

**Bảng dữ liệu mẫu `Production.Product`:**

| ProductID | ProductName | UnitsInStock | ReorderPoint |
| :--- | :--- | :--- | :--- |
| 101 | Laptop Dell XPS | 15 | 20 |
| 102 | Chuột Logitech | 50 | 30 |
| 103 | Bàn phím cơ Keychron | 8 | 15 |
| 104 | Màn hình LG 27 inch | 25 | 10 |

Câu lệnh nào sau đây lọc ra các sản phẩm cần nhập thêm hàng khi số lượng tồn kho (`UnitsInStock`) nhỏ hơn điểm đặt hàng tối thiểu (`ReorderPoint`)?
- A. `SELECT * FROM Production.Product WHERE UnitsInStock = ReorderPoint;`
- B. `SELECT * FROM Production.Product WHERE UnitsInStock < ReorderPoint;`
- C. `SELECT * FROM Production.Product WHERE UnitsInStock > ReorderPoint;`
- D. `SELECT * FROM Production.Product WHERE ReorderPoint <= 0;`

*(Đáp án đúng: **B** - Sử dụng toán tử so sánh nhỏ hơn `<` trong mệnh đề `WHERE` để so sánh trực tiếp giá trị giữa 2 cột `UnitsInStock < ReorderPoint`. Các sản phẩm có tồn kho thấp hơn điểm đặt hàng (như Laptop Dell XPS: 15 < 20, Bàn phím Keychron: 8 < 15) sẽ được lọc ra).*

### Level 1: Trắc nghiệm - Câu 2: Toán tử so sánh khác chuẩn ANSI
Toán tử nào sau đây là toán tử so sánh "Khác" (Not Equal) theo chuẩn ISO/ANSI SQL được khuyến nghị sử dụng trên mọi hệ quản trị CSDL?
- A. `!=`
- B. `<>`
- C. `><`
- D. `NOT =`

*(Đáp án đúng: **B** - Toán tử `<>` là chuẩn ANSI SQL chính thức được hỗ trợ trên tất cả các RDBMS (SQL Server, Oracle, PostgreSQL, MySQL), trong khi `!=` là cú pháp mở rộng phi chuẩn).*

### Level 1: Trắc nghiệm - Câu 3: Lọc chuỗi Unicode tiếng Việt
Khi lọc nhân viên thuộc phòng ban `Công nghệ thông tin`, câu lệnh nào sau đây là chuẩn xác nhất để đảm bảo không bị lỗi tìm kiếm tiếng Việt có dấu?
- A. `SELECT * FROM hr.Employees WHERE Department = 'Công nghệ thông tin';`
- B. `SELECT * FROM hr.Employees WHERE Department = N'Công nghệ thông tin';`
- C. `SELECT * FROM hr.Employees WHERE Department == N'Công nghệ thông tin';`
- D. `SELECT * FROM hr.Employees WHERE Department LIKE %Công nghệ thông tin%;`

*(Đáp án đúng: **B** - Trong T-SQL, giá trị chuỗi Unicode phải luôn có tiền tố `N` (National) đứng trước dấu nháy đơn `N'...'` để đảm bảo chuỗi so sánh đúng bảng mã UTF-16).*

### 🛠️ Level 2: Viết câu lệnh truy vấn lọc thực tế
Cho bảng `hr.Employees` có các cột: `EmployeeID`, `FullName`, `Salary`, `HireDate`, `Department`.

**Yêu cầu:**
1. Lấy danh sách nhân viên có mức lương (`Salary`) khác 15.000.000 (sử dụng toán tử chuẩn ANSI).
2. Lấy danh sách nhân viên thuộc phòng IT (`Department = N'Công nghệ thông tin'`).
3. Lấy danh sách nhân viên được tuyển dụng vào công ty trước ngày `2024-01-01`.

<details>
<summary><b>👉 Xem code T-SQL mẫu</b></summary>

```sql
-- 1. Lọc lương khác 15 triệu (Chuẩn ANSI: <>)
SELECT EmployeeID, FullName, Salary
FROM hr.Employees
WHERE Salary <> 15000000;

-- 2. Lọc chuỗi tiếng Việt có tiền tố N
SELECT EmployeeID, FullName, Department
FROM hr.Employees
WHERE Department = N'Công nghệ thông tin';

-- 3. Lọc theo mốc thời gian chuẩn YYYY-MM-DD
SELECT EmployeeID, FullName, HireDate
FROM hr.Employees
WHERE HireDate < '2024-01-01';
```
</details>

---

## 6. Đúc kết & Đi tiếp

### 📌 3 Điểm cốt lõi cần nhớ:
1. Mệnh đề `WHERE` lọc các dòng dữ liệu thỏa mãn điều kiện trước khi dữ liệu được chuyển đến `SELECT`.
2. Luôn dùng tiền tố `N'...'` khi so sánh chuỗi Unicode tiếng Việt có dấu.
3. Sử dụng định dạng ngày chuẩn `YYYY-MM-DD` để tránh lỗi sai lệch ngày/tháng do cài đặt ngôn ngữ của Server.

👉 **Bài tiếp theo:** [Bài 2.4: Kết hợp nhiều điều kiện logic với AND, OR, NOT và Thứ tự ưu tiên](file:///d:/Project/LearnPython/docs/D%E1%BB%AF%20li%E1%BB%87u%20n%E1%BB%99i%20dung%20b%C3%A0i%20h%E1%BB%8Dc/Chapter02/B%C3%A0i%202.4%20-%20K%E1%BA%BFt%20h%E1%BB%A3p%20nhi%E1%BB%81u%20%C4%91i%E1%BB%81u%20ki%E1%BB%87n%20logic%20v%E1%BB%9Bi%20AND%2C%20OR%2C%20NOT%20v%C3%A0%20Th%E1%BB%A9%20t%E1%BB%B1%20%C6%B0u%20ti%C3%AAn.md) — Khám phá cách kết hợp đa tầng điều kiện logic phức tạp mà không bị dính bẫy ưu tiên toán tử!
