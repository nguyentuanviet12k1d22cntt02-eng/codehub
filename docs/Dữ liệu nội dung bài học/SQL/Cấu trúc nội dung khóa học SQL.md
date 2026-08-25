# Lộ Trình Khóa Học SQL Server (T-SQL) Toàn Diện

> **Hệ quản trị CSDL chuẩn:** Microsoft SQL Server & T-SQL (Transact-SQL)  
> **Công cụ thực hành:** SQL Server Management Studio (SSMS) / Azure Data Studio

---

## Module 1: Nền tảng & Truy vấn cơ bản (DQL Basics)

### Chapter 1: Tổng quan Cơ sở dữ liệu quan hệ & Môi trường SQL Server
- **Bài 1.1:** Cơ sở dữ liệu quan hệ (RDBMS) là gì? Khái niệm Bảng (Table), Dòng (Row), Cột (Column), Lược đồ (Schema).
- **Bài 1.2:** Khóa chính (Primary Key), Khóa ngoại (Foreign Key) và Mối quan hệ giữa các bảng (1-1, 1-N, N-N).
- **Bài 1.3:** Cài đặt SQL Server, làm quen giao diện SQL Server Management Studio (SSMS) & thực thi câu lệnh T-SQL đầu tiên.

### Chapter 2: Truy xuất & Lọc dữ liệu cơ bản
- **Bài 2.1:** Cú pháp lệnh `SELECT` và `FROM`: Lấy tất cả cột vs. Lấy cột chỉ định.
- **Bài 2.2:** Loại bỏ trùng lặp với `DISTINCT` và đặt tên cột thay thế với bí danh `AS` (Alias).
- **Bài 2.3:** Lọc điều kiện cơ bản với mệnh đề `WHERE` (Toán tử so sánh: `=`, `<>`, `!=`, `>`, `<`, `>=`, `<=`).
- **Bài 2.4:** Kết hợp nhiều điều kiện logic: `AND`, `OR`, `NOT` và thứ tự ưu tiên toán tử.

### Chapter 3: Lọc dữ liệu nâng cao, Sắp xếp & Phân trang
- **Bài 3.1:** Lọc theo khoảng giá trị với `BETWEEN ... AND` và danh sách giá trị với `IN (...)`.
- **Bài 3.2:** Tìm kiếm mẫu chuỗi ký tự với `LIKE` và các ký tự đại diện (`%`, `_`, `[ ]`, `[^ ]`).
- **Bài 3.3:** Xử lý giá trị rỗng: Kiểm tra `IS NULL` và `IS NOT NULL` (Tránh bẫy so sánh `= NULL`).
- **Bài 3.4:** Sắp xếp kết quả với `ORDER BY` (`ASC`, `DESC`, sắp xếp đa cột, `NULLS FIRST/LAST`).
- **Bài 3.5:** Giới hạn kết quả và phân trang chuyên nghiệp trong T-SQL: Mệnh đề `TOP` vs. Cú pháp `OFFSET ... FETCH NEXT`.

---

## Module 2: Ghép bảng & Phân tích tổng hợp (Joins & Aggregations)

### Chapter 4: Kết nối nhiều bảng (Relational Joins)
- **Bài 4.1:** Tư duy kết nối bảng và `INNER JOIN` (Lấy phần giao nhau theo điều kiện `ON`).
- **Bài 4.2:** `LEFT JOIN` (Left Outer Join): Giữ trọn bảng bên trái và kỹ thuật tìm bản ghi mồ côi (Is Orphan/NULL).
- **Bài 4.3:** `RIGHT JOIN` và `FULL OUTER JOIN`: Bản chất và các tình huống ứng dụng thực tế.
- **Bài 4.4:** `CROSS JOIN` (Tích Descartes) và kỹ thuật `SELF JOIN` (Tự kết nối chính bảng đó cho dữ liệu phân cấp).
- **Bài 4.5:** Hợp nhất tập dữ liệu từ nhiều truy vấn: Phân biệt bản chất và hiệu năng giữa `UNION` vs `UNION ALL`.

### Chapter 5: Nhóm dữ liệu & Hàm tổng hợp
- **Bài 5.1:** Các hàm tính toán tổng hợp cơ bản: `COUNT()`, `COUNT(DISTINCT)`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.
- **Bài 5.2:** Gom nhóm dữ liệu với mệnh đề `GROUP BY` (Gom nhóm đơn cột, đa cột và quy tắc chọn cột ở `SELECT`).
- **Bài 5.3:** Lọc điều kiện sau khi tổng hợp với mệnh đề `HAVING`.
- **Bài 5.4:** Phân biệt bản chất hoạt động, thứ tự thực thi (Logical Query Processing) giữa `WHERE` vs `HAVING`.

---

## Module 3: Thao tác dữ liệu & Truy vấn nâng cao (DML & Advanced T-SQL)

### Chapter 6: Thao tác thêm, sửa, xóa dữ liệu (DML)
- **Bài 6.1:** Thêm mới dữ liệu vào bảng: `INSERT INTO ... VALUES`, `INSERT INTO ... SELECT` và lệnh `SELECT INTO`.
- **Bài 6.2:** Cập nhật dữ liệu với `UPDATE` (Kỹ thuật `UPDATE` kết hợp `JOIN` và cảnh báo bắt buộc mệnh đề `WHERE`).
- **Bài 6.3:** Xóa dữ liệu với `DELETE` vs `TRUNCATE TABLE` (So sánh cơ chế Logging, Identity Reset và hiệu năng).
- **Bài 6.4:** Cú pháp đồng bộ dữ liệu nâng cao `MERGE` (Upsert: Insert, Update, Delete trong 1 lệnh).

### Chapter 7: Xử lý dữ liệu đa dạng & Logic điều kiện
- **Bài 7.1:** Xử lý giá trị Null nâng cao trong SQL Server: `ISNULL()`, `COALESCE()`, và `NULLIF()`.
- **Bài 7.2:** Các hàm xử lý chuỗi T-SQL phổ biến: `CONCAT()`, `SUBSTRING()`, `LEN()`, `DATALENGTH()`, `TRIM()`, `REPLACE()`, `CHARINDEX()`.
- **Bài 7.3:** Làm việc với Ngày & Giờ (Date & Time): `GETDATE()`, `SYSDATETIME()`, `DATEADD()`, `DATEDIFF()`, `DATEPART()`, `FORMAT()`.
- **Bài 7.4:** Phân nhánh logic linh hoạt với biểu thức `CASE WHEN ... THEN ... ELSE ... END` (Simple CASE & Searched CASE).

### Chapter 8: Subqueries, CTEs & Window Functions
- **Bài 8.1:** Subquery (Truy vấn con): Scalar Subquery, Correlated Subquery và các toán tử `EXISTS`, `NOT EXISTS`, `IN`, `ALL`, `ANY`.
- **Bài 8.2:** Bảng tạm Common Table Expressions (`WITH CTE`) và ứng dụng CTE đệ quy (Recursive CTE) cho dữ liệu cây/phân cấp.
- **Bài 8.3:** Nhập môn Window Functions: Cú pháp mệnh đề `OVER (PARTITION BY ... ORDER BY ... ROWS/RANGE BETWEEN)`.
- **Bài 8.4:** Xếp hạng dữ liệu: Phân biệt chi tiết `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `NTILE()`.
- **Bài 8.5:** Phân tích giá trị liền kề và tổng tích lũy: Sử dụng `LEAD()`, `LAG()`, `FIRST_VALUE()`, `LAST_VALUE()`.

---

## Module 4: Thiết kế CSDL, Chỉ mục & Quản trị giao dịch (DDL, Indexing & TCL/DCL)

### Chapter 9: Định nghĩa CSDL, Ràng buộc toàn vẹn & Chỉ mục (DDL & Indexing)
- **Bài 9.1:** Các kiểu dữ liệu cốt lõi trong SQL Server (`INT`, `BIGINT`, `VARCHAR`, `NVARCHAR`, `DECIMAL`, `BIT`, `DATETIME2`, `UNIQUEIDENTIFIER`).
- **Bài 9.2:** Tạo và quản lý bảng: `CREATE TABLE`, `DROP TABLE`, thuộc tính tự tăng `IDENTITY`.
- **Bài 9.3:** Chỉnh sửa cấu trúc bảng với `ALTER TABLE` (Thêm cột, sửa kiểu dữ liệu, xóa cột, bật/tắt Constraint).
- **Bài 9.4:** Thiết lập các ràng buộc dữ liệu (Constraints): `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`.
- **Bài 9.5:** Hành vi khóa ngoại liên đới: `ON DELETE CASCADE`, `ON DELETE SET NULL`, `ON UPDATE CASCADE`.
- **Bài 9.6:** Chỉ mục (Indexes) & Tối ưu truy vấn: Phân biệt `Clustered Index` vs `Non-Clustered Index`, Composite Index, và cách đọc Execution Plan (Kế hoạch thực thi) trong SSMS.

### Chapter 10: Chuẩn hóa CSDL, Giao dịch (TCL) & Phân quyền (DCL)
- **Bài 10.1:** Tư duy thiết kế CSDL và quy tắc chuẩn hóa dữ liệu: Dạng chuẩn 1NF, 2NF, 3NF và khi nào nên Denormalize.
- **Bài 10.2:** Tính chất `ACID` trong hệ thống CSDL SQL Server và các cấp độ cô lập giao dịch (Transaction Isolation Levels).
- **Bài 10.3:** Quản lý giao dịch an toàn (TCL): `BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`, `SAVE TRANSACTION` và biến `@@TRANCOUNT`.
- **Bài 10.4:** Quản lý người dùng và phân quyền truy cập (DCL): `CREATE LOGIN`, `CREATE USER`, các lệnh `GRANT`, `REVOKE`, `DENY` và Database Roles.

---

## Module 5: Lập trình CSDL chuyên sâu (Database Programmability)

### Chapter 11: Views & Hàm tự định nghĩa (User-Defined Functions - UDF)
- **Bài 11.1:** Khái niệm và cách tạo Standard View (`CREATE VIEW`, `WITH SCHEMABINDING`).
- **Bài 11.2:** Khung nhìn được lập chỉ mục (Indexed View) trong SQL Server: Tối ưu hiệu năng tổng hợp dữ liệu lớn.
- **Bài 11.3:** Viết hàm trả về giá trị đơn: Scalar Functions (`CREATE FUNCTION ... RETURNS datatype`).
- **Bài 11.4:** Viết hàm trả về bảng: Inline Table-Valued Functions (iTVF) vs Multi-Statement Table-Valued Functions (mTVF) và lưu ý hiệu năng.

### Chapter 12: Thủ tục lưu trữ (Stored Procedures)
- **Bài 12.1:** Cấu trúc và cú pháp tạo Stored Procedure (`CREATE PROCEDURE`, `EXEC / EXECUTE`).
- **Bài 12.2:** Quản lý tham số truyền vào và ra: Tham số mặc định, tham số `OUTPUT`.
- **Bài 12.3:** Cấu trúc điều khiển luồng trong T-SQL: `IF ... ELSE`, `WHILE`, `BREAK`, `CONTINUE`.
- **Bài 12.4:** Bảng tạm (Temporary Tables `#TempTable`, `##GlobalTemp`) vs Biến bảng (`@TableVariable`).
- **Bài 12.5:** Quản lý ngoại lệ và Transaction nâng cao: Khối lệnh `BEGIN TRY ... BEGIN CATCH`, hàm `ERROR_MESSAGE()`, `THROW` và `XACT_ABORT`.

### Chapter 13: Triggers & Con trỏ (Cursors)
- **Bài 13.1:** Khái niệm Trigger và phân loại DML Triggers: `AFTER / FOR Trigger` vs `INSTEAD OF Trigger`.
- **Bài 13.2:** Bản chất hai bảng ảo hệ thống trong SQL Server: Bảng `inserted` và bảng `deleted`.
- **Bài 13.3:** Xây dựng hệ thống Audit Log ghi lịch sử thay đổi dữ liệu chi tiết bằng Trigger.
- **Bài 13.4:** Con trỏ (Cursors) trong T-SQL: Vòng đời Cursor (`DECLARE`, `OPEN`, `FETCH NEXT ... INTO`, `@@FETCH_STATUS`, `CLOSE`, `DEALLOCATE`) và tư duy thay thế bằng Set-based operations.