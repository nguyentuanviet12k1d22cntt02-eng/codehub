---
lessonId: "SQL-01.02"
title: "Khóa chính (Primary Key), Khóa ngoại (Foreign Key) và Mối quan hệ giữa các bảng"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["primary-key", "foreign-key", "relationships", "one-to-many", "many-to-many", "junction-table", "referential-integrity"]
prerequisites: ["SQL-01.01"]
---

# Bài 1.2: Khóa chính (Primary Key), Khóa ngoại (Foreign Key) và Mối quan hệ giữa các bảng

---

## 1. Khái niệm & Vấn đề

Trong một trường đại học, nếu có 5 sinh viên cùng tên "Nguyễn Văn An", làm sao hệ thống biết chính xác điểm số 9.5 của môn Cơ sở dữ liệu thuộc về bạn An nào? Hay trong hệ thống bán hàng, nếu xóa một khách hàng thì các hóa đơn trước đây của họ có bị biến thành "hóa đơn ma" không ai sở hữu?

Để định danh duy nhất từng bản ghi và thiết lập các sợi dây liên kết an toàn giữa các bảng, CSDL quan hệ sử dụng **Khóa chính (Primary Key)** và **Khóa ngoại (Foreign Key)**.

```
  BẢNG: Customers (Bảng Cha - Parent)         BẢNG: Orders (Bảng Con - Child)
┌─────────────────────────────────┐         ┌──────────────────────────────────────┐
│ PK: CustomerID │ CustomerName   │         │ PK: OrderID │ FK: CustomerID │ Total │
├────────────────┼────────────────┤         ├─────────────┼────────────────┼───────┤
│ 101            │ Nguyễn Văn An  │◄───┐    │ 5001        │ 101            │ 250k  │
│ 102            │ Trần Thị Mai   │    │    │ 5002        │ 101            │ 980k  │
│ 103            │ Lê Hoàng Long  │    └───►│ 5003        │ 102            │ 450k  │
└─────────────────────────────────┘         └──────────────────────────────────────┘
                   (1) ────────── Mối quan hệ 1 - N ────────── (N)
```

| Khái niệm | Đặc điểm kỹ thuật | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Khóa chính (Primary Key - PK)** | Cột (hoặc cụm cột) có giá trị duy nhất (`UNIQUE`), không được phép `NULL`, dùng để định danh 1 dòng. | Số Căn cước công dân (CCCD) / Mã định danh cá nhân của mỗi người. |
| **Khóa ngoại (Foreign Key - FK)** | Cột ở bảng con tham chiếu đến khóa chính của bảng cha, đảm bảo tính toàn vẹn tham chiếu. | Chiếc thẻ xe ghi đúng biển số xe của bạn trong bãi đỗ. |
| **Tính toàn vẹn tham chiếu (Referential Integrity)** | Cơ chế ngăn chặn việc tạo ra dữ liệu "mồ côi" (ví dụ: tạo đơn hàng với mã khách hàng không tồn tại). | Không thể cấp thẻ chung cư cho người không có trong danh sách cư dân. |

---

## 2. Các Loại Mối Quan Hệ & Cách Tổ Chức

### 1. Quan hệ 1 - Nhiều (1 - N / One-to-Many) - *Phổ biến nhất (90%)*
- **Quy tắc:** 1 bản ghi ở Bảng A liên kết với nhiều bản ghi ở Bảng B, nhưng mỗi bản ghi ở Bảng B chỉ thuộc về đúng 1 bản ghi ở Bảng A.
- **Cách cài đặt:** Đặt Khóa ngoại (FK) tại **Bảng Nhiều (Bảng con)**.
- **Ví dụ:** 1 Khách hàng (`Customers`) có thể có nhiều Đơn hàng (`Orders`).

### 2. Quan hệ Nhiều - Nhiều (N - N / Many-to-Many)
- **Quy tắc:** 1 Sinh viên học nhiều Môn học; 1 Môn học có nhiều Sinh viên đăng ký.
- **Cách cài đặt:** Bắt buộc phải tách ra và sử dụng 1 **Bảng trung gian (Junction / Bridge Table)** chứa 2 Khóa ngoại trỏ về 2 bảng gốc.

```text
[Students] (1) ──── (N) [Enrollments] (Junction Table) (N) ──── (1) [Courses]
 StudentID (PK)           StudentID (FK)                             CourseID (PK)
 FullName                 CourseID (FK)                              CourseName
                          EnrolledDate
```

### 3. Quan hệ 1 - 1 (1 - One-to-One)
- **Quy tắc:** 1 Người chỉ có 1 Hộ chiếu (`Passport`); 1 Hộ chiếu chỉ thuộc về 1 Người.
- **Cách cài đặt:** Đặt Khóa ngoại ở một trong hai bảng và gán thêm ràng buộc `UNIQUE` trên cột khóa ngoại đó.

---

## 3. Cú pháp & Vận hành trong T-SQL

Minh họa tạo bảng với ràng buộc Khóa chính và Khóa ngoại trong SQL Server:

```sql
-- 1. Tạo bảng Cha (Customers) với Khóa chính
CREATE TABLE sales.Customers (
    CustomerID INT IDENTITY(1,1) CONSTRAINT PK_Customers PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE
);

-- 2. Tạo bảng Con (Orders) với Khóa ngoại tham chiếu về Customers
CREATE TABLE sales.Orders (
    OrderID INT IDENTITY(1000,1) CONSTRAINT PK_Orders PRIMARY KEY,
    OrderDate DATETIME2 DEFAULT SYSDATETIME(),
    TotalAmount DECIMAL(18,2) NOT NULL,
    CustomerID INT NOT NULL,
    -- Thiết lập ràng buộc Khóa ngoại
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerID)
        REFERENCES sales.Customers(CustomerID)
        ON DELETE NO ACTION -- Chặn xóa khách hàng nếu còn đơn hàng
);
```

**Bảng theo dõi hành vi kiểm tra của SQL Server (Referential Integrity Check):**
| Thao tác T-SQL | Dữ liệu kiểm tra | Kết quả từ SQL Server Engine |
| :--- | :--- | :--- |
| `INSERT INTO sales.Orders (CustomerID, TotalAmount) VALUES (999, 500000);` | Mã `CustomerID = 999` chưa hề tồn tại trong bảng `Customers`. | ❌ **Error (Bị chặn):** `The INSERT statement conflicted with the FOREIGN KEY constraint "FK_Orders_Customers"`. |
| `DELETE FROM sales.Customers WHERE CustomerID = 101;` | Khách hàng 101 đang có 2 đơn hàng trong bảng `Orders`. | ❌ **Error (Bị chặn):** Không cho phép xóa vì sẽ làm các đơn hàng trở thành bản ghi mồ côi. |

---

## 4. Lỗi thường gặp & Tối ưu (Best Practices & Pitfalls)

> [!WARNING]
> **Các cạm bẫy thiết kế Cơ sở dữ liệu cần tránh:**
> 1. **Dùng cột có thể thay đổi làm Khóa chính:** Không nên dùng Số điện thoại, Email, hay Biển số xe làm Khóa chính vì người dùng có thể đổi số/email. Hãy ưu tiên dùng **Khóa thay thế nhân tạo (Surrogate Key)** dạng số nguyên tự tăng (`INT IDENTITY`) hoặc `GUID (UNIQUEIDENTIFIER)`.
> 2. **Quên đánh Index cho Khóa ngoại:** Trong SQL Server, tạo Khóa chính sẽ tự động sinh `Clustered Index`, nhưng tạo Khóa ngoại **KHÔNG** tự động tạo Index. Hãy luôn chủ động tạo Non-clustered Index trên các cột Khóa ngoại để tăng tốc độ lệnh `JOIN`.
> 3. **Lạm dụng `ON DELETE CASCADE`:** Xóa 1 bản ghi ở bảng cha sẽ tự động xóa sạch hàng loạt dữ liệu ở các bảng con mà không hề cảnh báo, rất dễ dẫn đến mất mát dữ liệu nghiêm trọng trong môi trường Production.

---

### Level 1: Trắc nghiệm - Câu 1: Xác định loại quan hệ (N-N)
Một hệ thống quản lý bệnh viện muốn thiết kế mối quan hệ giữa **Bác sĩ (`Doctors`)** và **Bệnh nhân (`Patients`)**:

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start my-3">

<div>

**Bảng `Doctors` (1 Bác sĩ khám nhiều Bệnh nhân):**

| DoctorID (PK) | DoctorName | Specialty |
| :--- | :--- | :--- |
| D01 | BS. Nguyễn Văn A | Nội tim mạch |
| D02 | BS. Trần Thị B | Ngoại tổng quát |

</div>

<div>

**Bảng `Patients` (1 Bệnh nhân có thể khám nhiều Bác sĩ):**

| PatientID (PK) | PatientName | Gender |
| :--- | :--- | :--- |
| P01 | Lê Văn C | Nam |
| P02 | Phạm Thị D | Nữ |

</div>

</div>

Đây là loại quan hệ gì trong cơ sở dữ liệu quan hệ và cần thiết kế như thế nào?
- A. Quan hệ 1 - 1, thêm cột `DoctorID` vào bảng `Patients`.
- B. Quan hệ 1 - N, thêm cột `PatientID` vào bảng `Doctors`.
- C. Quan hệ N - N (Nhiều - Nhiều), cần tạo thêm bảng trung gian `MedicalAppointments` chứa cả `DoctorID (FK)` và `PatientID (FK)`.
- D. Không thể biểu diễn quan hệ này trong mô hình CSDL quan hệ RDBMS.

*(Đáp án đúng: **C** - Vì một bác sĩ có thể khám cho nhiều bệnh nhân và một bệnh nhân có thể được khám bởi nhiều bác sĩ chuyên khoa khác nhau, đây là mối quan hệ Nhiều - Nhiều (N - N). Trong RDBMS, quan hệ N - N bắt buộc phải tách thông qua một bảng trung gian chứa 2 khóa ngoại liên kết).*

### Level 1: Trắc nghiệm - Câu 2: Đặc tính của Khóa chính (Primary Key)
Hai điều kiện bắt buộc mà bất kỳ cột nào làm Khóa chính (Primary Key) trong RDBMS đều phải thỏa mãn là gì?
- A. Giá trị phải là số nguyên dương và có tính tự tăng.
- B. Giá trị phải là DUY NHẤT (Unique) trên toàn bảng và KHÔNG ĐƯỢC PHÉP CHỨA NULL (Not Null).
- C. Phải có độ dài tối đa không quá 50 ký tự.
- D. Phải được liên kết với một bảng khác thông qua khóa ngoại.

*(Đáp án đúng: **B** - Khóa chính (Primary Key) có nhiệm vụ định danh duy nhất từng bản ghi, do đó bắt buộc phải thỏa mãn đồng thời 2 ràng buộc: `UNIQUE` (không trùng lặp) và `NOT NULL` (không được để trống)).*

### Level 1: Trắc nghiệm - Câu 3: Ràng buộc toàn vẹn của Khóa ngoại (Foreign Key)
Điều gì sẽ xảy ra nếu bạn cố gắng chèn (INSERT) một dòng mới vào bảng `Sales.Orders` với `CustomerID = 999`, trong khi trong bảng `Sales.Customers` chưa từng tồn tại khách hàng nào có mã `999`?
- A. SQL Server tự động tạo mới khách hàng `999` bên bảng `Sales.Customers`.
- B. Câu lệnh chạy thành công nhưng gán giá trị `CustomerID` về `NULL`.
- C. Báo lỗi vi phạm ràng buộc toàn vẹn tham chiếu (FOREIGN KEY Constraint Violation) và từ chối thêm đơn hàng.
- D. Hệ thống xóa toàn bộ đơn hàng của khách hàng cũ.

*(Đáp án đúng: **C** - Khóa ngoại ngăn chặn việc tạo ra "dữ liệu mồ côi". Nếu giá trị khóa ngoại không tồn tại trong cột khóa chính của bảng cha, SQL Server sẽ lập tức báo lỗi vi phạm ràng buộc và chặn câu lệnh).*

### 🛠️ Level 2: Phát hiện lỗi thiết kế
Cho thiết kế bảng bán sách sau:
```text
Table: Books
BookID (PK), Title, AuthorName, PublisherName

Table: Orders
OrderID (PK), CustomerName, BookList (Lưu chuỗi: "Book01, Book05, Book09")
```
**Yêu cầu:** Hãy chỉ ra lỗi vi phạm trong bảng `Orders` và vẽ lại lược đồ chuẩn quan hệ giữa `Orders` và `Books`.

<details>
<summary><b>👉 Xem gợi ý & Lời giải</b></summary>

**Lỗi vi phạm:** Cột `BookList` gộp nhiều mã sách vào 1 ô, vi phạm dạng chuẩn 1NF, không thể tính tồn kho từng cuốn hay kiểm tra giá sách.

**Mô hình chuẩn hóa (N - N):**
1. Bảng `Orders`: `OrderID (PK)`, `CustomerID (FK)`, `OrderDate`.
2. Bảng `Books`: `BookID (PK)`, `Title`, `Price`.
3. Bảng trung gian `OrderDetails`: `OrderID (FK)`, `BookID (FK)`, `Quantity`, `UnitPrice` $\rightarrow$ Khóa chính phức hợp: `PK (OrderID, BookID)`.
</details>

---

## 6. Đúc kết & Đi tiếp

### 📌 3 Điểm cốt lõi cần nhớ:
1. **Khóa chính (PK)** định danh duy nhất từng dòng; **Khóa ngoại (FK)** tạo sợi dây liên kết logic và bảo vệ dữ liệu khỏi bị sai lệch.
2. Mối quan hệ **1 - N** đặt FK ở bảng con; mối quan hệ **N - N** bắt buộc giải quyết bằng **Bảng trung gian (Junction Table)**.
3. Ràng buộc toàn vẹn tham chiếu ngăn chặn triệt để tình trạng dữ liệu mồ côi.

👉 **Bài tiếp theo:** [Bài 1.3: Cài đặt SQL Server, làm quen giao diện SSMS & Chạy câu lệnh T-SQL đầu tiên](file:///d:/Project/LearnPython/docs/D%E1%BB%AF%20li%E1%BB%87u%20n%E1%BB%99i%20dung%20b%C3%A0i%20h%E1%BB%8Dc/SQL/C%E1%BA%A5u%20tr%C3%BAc%20b%C3%A0i%20h%E1%BB%8Dc/Chapter%2001/B%C3%A0i%201.3%20-%20C%C3%A0i%20%C4%91%E1%BA%B7t%20SQL%20Server%2C%20l%C3%A0m%20quen%20SSMS%20v%C3%A0%20Ch%E1%BA%A1y%20c%C3%A2u%20l%E1%BB%87nh%20T-SQL%20%C4%91%E1%BA%A7u%20ti%C3%AAn.md) — Bắt tay vào cài đặt môi trường, mở SSMS và viết những dòng script T-SQL thực chiến đầu tiên!
