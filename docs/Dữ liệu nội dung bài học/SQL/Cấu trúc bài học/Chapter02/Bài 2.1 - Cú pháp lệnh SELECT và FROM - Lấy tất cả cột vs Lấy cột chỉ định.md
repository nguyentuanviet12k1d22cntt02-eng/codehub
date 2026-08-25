---
lessonId: "SQL-02.01"
title: "Cú pháp lệnh SELECT và FROM: Lấy tất cả cột vs. Lấy cột chỉ định"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["select", "from", "dql", "query-basics", "select-star", "performance"]
prerequisites: ["SQL-01.03"]
---

# Bài 2.1: Cú pháp lệnh SELECT và FROM: Lấy tất cả cột vs. Lấy cột chỉ định

---

## 1. Khái niệm & Vấn đề

Trong một siêu thị có hàng chục nghìn sản phẩm, mỗi sản phẩm chứa hơn 30 trường thông tin (mã vạch, tên, giá nhập, giá bán, ngày sản xuất, nhà cung cấp, trọng lượng, kích thước...). Khi nhân viên thu ngân quét mã tính tiền, máy in hóa đơn chỉ cần đúng 3 thông tin: **Tên sản phẩm, Số lượng, và Đơn giá**.

Nếu hệ thống luôn luôn lôi toàn bộ 30 cột ra khỏi ổ cứng và truyền qua mạng, đường truyền sẽ bị nghẽn và hệ thống sẽ chạy chậm chạp như rùa bò! 

Trong SQL, câu lệnh **`SELECT ... FROM`** là công cụ cơ bản và quyền lực nhất thuộc nhóm **DQL (Data Query Language)** giúp bạn chọn lọc chính xác những cột dữ liệu cần thiết.

```
                  ┌──────────────────────────────────────────────┐
                  │          BẢNG DỮ LIỆU: sales.Products         │
                  │ ┌──────────┬──────────────┬──────────┬─────┐ │
                  │ │ProductID │ ProductName  │ Price    │ ... │ │
                  │ ├──────────┼──────────────┼──────────┼─────┤ │
                  │ │ 1        │ iPhone 15    │ 30000000 │ ... │ │
                  │ │ 2        │ Dell XPS 13  │ 28000000 │ ... │ │
                  │ └──────────┴──────────────┴──────────┴─────┘ │
                  └───────────────────────┬──────────────────────┘
                                          │
                  ┌───────────────────────┴──────────────────────┐
                  │          LỆNH TRUY VẤN (T-SQL QUERY)         │
                  │   SELECT ProductName, Price FROM Products;   │
                  └───────────────────────┬──────────────────────┘
                                          │
                                          ▼
                               ┌──────────────────────┐
                               │     KẾT QUẢ TRẢ VỀ   │
                               │ ProductName │ Price  │
                               ├─────────────┼────────┤
                               │ iPhone 15   │ 30000k │
                               │ Dell XPS 13 │ 28000k │
                               └──────────────────────┘
```

| Thành phần | Vai trò cú pháp | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **`FROM [Tên_Bảng]`** | Chỉ định bảng nguồn chứa dữ liệu cần truy xuất. | Đến đúng kệ sách số 5 trong thư viện. |
| **`SELECT [Danh_Sách_Cột]`** | Chỉ định các thuộc tính/cột cụ thể cần lấy ra. | Rút đúng cuốn sách có bìa màu xanh bạn cần thay vì ôm cả kệ sách về. |
| **`SELECT *` (Dấu sao)** | Lấy tất cả các cột hiện có trong bảng theo thứ tự định nghĩa. | Ôm trọn cả kệ sách về bàn đọc. |

---

## 2. Cú pháp & Vận hành trong T-SQL

### 2.1. Cú pháp cơ bản
```sql
-- Cách 1: Lấy tất cả các cột (SELECT ALL)
SELECT * 
FROM sales.Customers;

-- Cách 2: Lấy các cột chỉ định (Khuyến nghị thực tế)
SELECT CustomerID, FullName, PhoneNumber 
FROM sales.Customers;
```

### 2.2. Thứ tự xử lý truy vấn logic (Logical Query Processing)
Một điểm cốt tử mà mọi lập trình viên SQL giỏi đều phải nắm rõ: **Thứ tự máy tính đọc và thực thi câu lệnh khác với thứ tự chúng ta viết!**

```
Bạn viết:     1. SELECT  ───►  2. FROM
Engine chạy:  1. FROM    ───►  2. SELECT
```

1. **Bước 1 (`FROM` chạy trước):** SQL Server tìm đến bảng `sales.Customers` trên ổ đĩa / bộ nhớ đệm (Buffer Cache) để xác định tập dữ liệu nguồn.
2. **Bước 2 (`SELECT` chạy sau):** Sau khi đã xác định được bảng nguồn, Engine mới lọc ra đúng các cột được liệt kê trong mệnh đề `SELECT` để tạo bảng kết quả trả về cho Client.

---

## 3. So Sánh: `SELECT *` vs. `SELECT [Tên Cột Cụ Thể]`

| Tiêu chí | `SELECT *` | `SELECT Cột1, Cột2...` |
| :--- | :--- | :--- |
| **Mục đích sử dụng** | Chỉ nên dùng khi **khám phá dữ liệu nhanh** trong quá trình viết code / kiểm thử trên SSMS. | **Bắt buộc dùng trong ứng dụng thực tế (Production), Backend API, và Stored Procedures.** |
| **Hiệu năng I/O & RAM** | ❌ **Kém:** Đọc thừa nhiều dữ liệu không cần thiết, làm tốn dung lượng RAM của Server. | ✅ **Tối ưu:** Chỉ tải đúng dung lượng cần thiết vào bộ nhớ đệm. |
| **Băng thông mạng (Network)** | ❌ **Lãng phí:** Truyền tải nhiều megabyte dữ liệu thừa từ Database Server về Backend Server. | ✅ **Nhẹ & Nhanh:** Giảm thiểu tối đa độ trễ truyền gói tin mạng. |
| **Độ ổn định mã nguồn** | ❌ **Dễ gãy vỡ (Fragile):** Nếu sau này có ai thêm/xóa cột trong bảng, code Backend có thể bị lỗi do sai lệch vị trí cột. | ✅ **Bền vững (Robust):** Cấu trúc dữ liệu trả về luôn ổn định và nhất quán. |

---

## 4. Lỗi thường gặp & Tối ưu (Best Practices & Pitfalls)

> [!WARNING]
> **Các lỗi cú pháp và thói quen xấu cần loại bỏ ngay:**
> 1. **Dư thừa dấu phẩy ở cột cuối cùng:** 
>    ```sql
>    -- ❌ SAI: Dấu phẩy ở cuối danh sách SELECT
>    SELECT CustomerID, FullName, 
>    FROM sales.Customers;
>    
>    -- ✅ ĐÚNG:
>    SELECT CustomerID, FullName 
>    FROM sales.Customers;
>    ```
> 2. **Lạm dụng `SELECT *` trong dự án thực tế:** Dù bảng hiện tại chỉ có 5 cột, nhưng 6 tháng sau nếu ai đó thêm một cột lưu ảnh lớn (`VARBINARY(MAX)`) hoặc văn bản dài, toàn bộ hệ thống sẽ bị chậm đột ngột.

---

### Level 1: Trắc nghiệm - Câu 1: Thứ tự thực thi logic
Cho câu lệnh truy vấn SQL sau:

```sql
SELECT FullName, Email 
FROM hr.Employees;
```

Theo quy trình xử lý truy vấn logic (Logical Query Processing) của SQL Server Engine, mệnh đề nào sẽ được **thực thi đầu tiên**?
- A. `SELECT` được chạy trước vì nó nằm ở đầu câu lệnh.
- B. `FROM` được chạy trước để nạp tập dữ liệu từ bảng nguồn, sau đó `SELECT` mới lọc danh sách cột.
- C. Cả hai mệnh đề được thực thi song song đồng thời.
- D. Thứ tự chạy phụ thuộc vào việc bảng có được đánh chỉ mục (Index) hay không.

*(Đáp án đúng: **B** - SQL Server Engine luôn thực thi mệnh đề `FROM` trước để nạp dữ liệu từ bảng nguồn `hr.Employees` vào bộ nhớ, sau đó mới thực thi mệnh đề `SELECT` để lọc ra các cột cần hiển thị).*

### Level 1: Trắc nghiệm - Câu 2: Lý do tránh dùng SELECT *
Tại sao các chuyên gia tối ưu cơ sở dữ liệu luôn khuyến cáo KHÔNG NÊN dùng `SELECT *` trong các câu lệnh truy vấn của ứng dụng backend?
- A. Vì `SELECT *` không chạy được trên SQL Server bản Enterprise.
- B. Vì `SELECT *` buộc máy chủ phải đọc toàn bộ dữ liệu từ đĩa, gây tốn băng thông mạng và vô hiệu hóa các chỉ mục tối ưu (Covering Index).
- C. Vì `SELECT *` bắt buộc người dùng phải có quyền Admin mới thực thi được.
- D. Vì `SELECT *` sẽ tự động khóa toàn bộ bảng dữ liệu lại.

*(Đáp án đúng: **B** - Dùng `SELECT *` làm tăng tải đọc/ghi I/O, tốn băng thông đường truyền và có thể làm vỡ ứng dụng nếu sau này bảng được bổ sung thêm các cột mới có dung lượng lớn).*

### Level 1: Trắc nghiệm - Câu 3: Tùy biến thứ tự hiển thị cột
Cho bảng `sales.Customers` có thứ tự các cột được tạo lần lượt là: `CustomerID`, `FullName`, `City`, `TotalSpent`. Câu lệnh nào sau đây sẽ hiển thị danh sách với cột `City` ở vị trí đầu tiên, tiếp theo là `FullName`?
- A. `SELECT City, FullName FROM sales.Customers;`
- B. `SELECT FullName, City FROM sales.Customers ORDER BY City;`
- C. `SELECT * FROM sales.Customers WHERE ColumnOrder = 'City, FullName';`
- D. Thứ tự cột khi hiển thị luôn cố định theo thứ tự lúc tạo bảng và không thể thay đổi được.

*(Đáp án đúng: **A** - Thứ tự các cột trong kết quả truy vấn hoàn toàn phụ thuộc vào thứ tự bạn liệt kê sau từ khóa `SELECT`, không phụ thuộc vào thứ tự vật lý lúc khai báo bảng).*

### 🛠️ Level 2: Viết câu lệnh T-SQL chuẩn xác
Giả sử có bảng `HumanResources.Department` với các cột: `DepartmentID`, `Name`, `GroupName`, `ModifiedDate`.

**Yêu cầu:** 
1. Viết câu lệnh lấy ra tất cả các cột để kiểm tra nhanh dữ liệu.
2. Viết câu lệnh chuẩn hóa cho ứng dụng hiển thị danh sách phòng ban, chỉ lấy 2 cột: Mã phòng ban (`DepartmentID`) và Tên phòng ban (`Name`).

<details>
<summary><b>👉 Xem code T-SQL mẫu</b></summary>

```sql
-- 1. Xem nhanh toàn bộ bảng (Dùng khi debug trên SSMS)
SELECT * 
FROM HumanResources.Department;

-- 2. Câu lệnh chuẩn cho ứng dụng thực tế
SELECT DepartmentID, Name 
FROM HumanResources.Department;
```
</details>

---

## 6. Đúc kết & Đi tiếp

### 📌 3 Điểm cốt lõi cần nhớ:
1. `FROM` xác định bảng nguồn và chạy **trước**; `SELECT` lọc danh sách cột và chạy **sau**.
2. Không bao giờ sử dụng `SELECT *` trong ứng dụng Production — luôn liệt kê tường minh các cột cần lấy.
3. Chỉ lấy đúng những gì cần thiết giúp tiết kiệm RAM, giảm tải Disk I/O và tối ưu băng thông mạng.

👉 **Bài tiếp theo:** [Bài 2.2: Loại bỏ trùng lặp với DISTINCT và Đặt bí danh cột với AS](file:///d:/Project/LearnPython/docs/D%E1%BB%AF%20li%E1%BB%87u%20n%E1%BB%99i%20dung%20b%C3%A0i%20h%E1%BB%8Dc/SQL/C%E1%BA%A5u%20tr%C3%BAc%20b%C3%A0i%20h%E1%BB%8Dc/Chapter02/B%C3%A0i%202.2%20-%20Lo%E1%BA%A1i%20b%E1%BB%8F%20tr%C3%B9ng%20l%E1%BA%B7p%20v%E1%BB%9Bi%20DISTINCT%20v%C3%A0%20%C4%90%E1%BA%B7t%20b%C3%AD%20danh%20c%E1%BB%99t%20v%E1%BB%9Bi%20AS.md) — Khám phá cách làm sạch dữ liệu trùng lặp và biến đổi tiêu đề cột trực quan, chuyên nghiệp!
