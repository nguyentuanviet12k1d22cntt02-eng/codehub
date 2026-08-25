---
lessonId: "SQL-01.03"
title: "Cài đặt SQL Server, làm quen giao diện SSMS & Chạy câu lệnh T-SQL đầu tiên"
difficulty: "EASY"
estimatedDuration: 25
keywords: ["sql-server-installation", "ssms", "object-explorer", "query-editor", "t-sql-basics", "create-database"]
prerequisites: ["SQL-01.01", "SQL-01.02"]
---

# Bài 1.3: Cài đặt SQL Server, làm quen giao diện SSMS & Chạy câu lệnh T-SQL đầu tiên

---

## 1. Khái niệm & Vấn đề

Để làm việc với SQL Server, chúng ta cần phân biệt rõ hai thành phần tách biệt nhưng luôn đồng hành cùng nhau: **Database Engine (Phần lõi máy chủ)** và **Client Tool (Công cụ giao diện thao tác)**.

```
┌──────────────────────────────────────────────────────────┐
│         SQL Server Management Studio (SSMS)              │
│    (Giao diện đồ họa - Viết code, xem bảng, vẽ biểu đồ)   │
└────────────────────────────┬─────────────────────────────┘
                             │ Gửi lệnh T-SQL qua cổng TCP 1433
                             ▼
┌──────────────────────────────────────────────────────────┐
│              SQL Server Database Engine                  │
│       (Dịch vụ chạy ngầm trên máy: Xử lý & Lưu trữ)      │
└──────────────────────────────────────────────────────────┘
```

| Thành phần | Vai trò | Tương đương trong thế giới lập trình |
| :--- | :--- | :--- |
| **SQL Server (Developer / Express)** | Dịch vụ máy chủ (Database Engine Service) chịu trách nhiệm lưu file dữ liệu (.mdf, .ldf), thực thi truy vấn và quản lý bộ nhớ RAM. | Trình thông dịch Python (Python Runtime Engine). |
| **SSMS (SQL Server Management Studio)** | Môi trường phát triển tích hợp (IDE) chuyên dụng của Microsoft dành riêng cho SQL Server. | VS Code hoặc PyCharm. |

---

## 2. Các Bước Thiết Lập Môi Trường Thực Hành

### Bước 1: Cài đặt SQL Server (Bản miễn phí Developer Edition)
1. Tải bản **SQL Server Developer Edition** từ trang chủ Microsoft (Bản đầy đủ tính năng 100% dành cho học tập và nghiên cứu).
2. Khi cài đặt, chọn kiểu **Basic Installation** $\rightarrow$ Chấp nhận điều khoản $\rightarrow$ Nhấn **Install**.
3. Ghi nhớ tên Instance: Mặc định thường là `localhost` hoặc `.` hoặc `MSSQLSERVER`.

### Bước 2: Cài đặt SSMS (SQL Server Management Studio)
1. Tải file cài đặt **SSMS** (miễn phí hoàn toàn).
2. Mở SSMS, tại hộp thoại **Connect to Server**:
   - **Server type:** `Database Engine`
   - **Server name:** `.` hoặc `localhost` (hoặc `.\SQLEXPRESS` nếu dùng bản Express)
   - **Authentication:** `Windows Authentication` (Đăng nhập bằng tài khoản Windows hiện tại)
3. Bấm **Connect**.

---

## 3. Khám Phá Giao Diện SSMS & Viết Script Đầu Tiên

### Các vùng làm việc cốt lõi trong SSMS:
1. **Object Explorer (F8):** Cây thư mục bên trái hiển thị tất cả Databases, Tables, Views, Security...
2. **New Query (Ctrl + N):** Mở cửa sổ soạn thảo script T-SQL.
3. **Execute (F5):** Chạy đoạn script đang viết (hoặc chỉ chạy phần code đang được bôi đen).
4. **Results Grid (Ctrl + R):** Màn hình hiển thị kết quả dạng bảng dữ liệu hoặc thẻ **Messages** thông báo số dòng bị ảnh hưởng (`(1 row affected)`).

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Object Explorer]   │ [Query Editor: SQLQuery1.sql]                     │
│                     │                                                   │
│ ├─ Databases        │  SELECT @@VERSION AS ServerVersion;               │
│ │  ├─ System DBs    │                                                   │
│ │  └─ TechStoreDB   │───────────────────────────────────────────────────│
│ │     └─ Tables     │ [Results Grid]                                    │
│ ├─ Security         │ ServerVersion                                     │
│ └─ Server Objects   │ Microsoft SQL Server 2022 (RTM) - 16.0.1000.6...  │
└─────────────────────┴───────────────────────────────────────────────────┘
```

---

## 4. Script T-SQL Thực Hành Đầu Tiên

Mở cửa sổ Query mới (`Ctrl + N`) và chạy đoạn kịch bản T-SQL sau:

```sql
-- 1. Kiểm tra phiên bản SQL Server đang chạy
SELECT @@VERSION AS [ThongTinPhienBan];

-- 2. Tạo một Cơ sở dữ liệu mới để thực hành
CREATE DATABASE TechStoreDB;
GO

-- 3. Chuyển ngữ cảnh làm việc sang CSDL vừa tạo
USE TechStoreDB;
GO

-- 4. Tạo bảng Categories (Danh mục sản phẩm)
CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(200) NULL
);
GO

-- 5. Chèn dữ liệu mẫu vào bảng
INSERT INTO Categories (CategoryName, Description)
VALUES 
    (N'Điện thoại', N'Smartphones các hãng Apple, Samsung, Xiaomi'),
    (N'Laptop', N'Máy tính xách tay văn phòng và Gaming');
GO

-- 6. Truy vấn hiển thị toàn bộ dữ liệu vừa tạo
SELECT CategoryID, CategoryName, Description 
FROM Categories;
```

**Bảng giải thích các từ khóa T-SQL đặc biệt:**
| Từ khóa / Lệnh | Bản chất kỹ thuật | Ý nghĩa thực tế |
| :--- | :--- | :--- |
| `GO` | Bộ phân tách khối lệnh (Batch Separator) của SSMS, không phải lệnh chuẩn của SQL. | Ra hiệu cho SSMS: "Hãy gửi toàn bộ đoạn code phía trên lên Server thực thi xong rồi mới chuyển sang đoạn tiếp theo". |
| `N'...'` (Tiền tố N) | National Character Set (Unicode). Bắt buộc phải có chữ `N` đứng trước chuỗi tiếng Việt có dấu. | Nếu viết `'Điện thoại'` sẽ bị biến thành `'Đi?n tho?i'`. Viết `N'Điện thoại'` sẽ lưu chuẩn UTF-16. |
| `IDENTITY(1,1)` | Thuộc tính tự tăng: Bắt đầu từ 1 và mỗi dòng mới cộng thêm 1 đơn vị. | Không cần phải tự điền ID bằng tay, CSDL tự sinh mã tự động. |

---

## 5. Lỗi thường gặp & Tối ưu (Best Practices & Pitfalls)

> [!WARNING]
> **Các lỗi "dở khóc dở cười" khi mới dùng SSMS:**
> 1. **Quên chọn đúng Database (Lỗi chạy nhầm vào `master`):** Khi mở New Query, mặc định SSMS thường đứng ở database hệ thống `master`. Luôn nhớ chạy lệnh `USE [TenDatabase];` hoặc nhìn vào ô Dropdown chọn Database ở góc trên bên trái thanh công cụ trước khi tạo bảng!
> 2. **Chạy nhầm một dòng code vô tình bị bôi đen:** Nếu bạn vô tình bôi đen 1 chữ hoặc 1 dòng rồi bấm `F5`, SSMS sẽ **chỉ chạy đúng phần bôi đen đó** thay vì cả file, dẫn đến lỗi `Incorrect syntax`.
> 3. **Quên tiền tố `N` cho chuỗi tiếng Việt:** Luôn viết `N'Họ và tên'` khi làm việc với các cột kiểu `NVARCHAR`.

---

## 6. Thực hành phân bậc (Scaffolded Practice)

### Level 1: Trắc nghiệm - Câu 1: Thao tác giao diện SSMS
Để xem nhanh các dòng dữ liệu của một bảng trong giao diện Object Explorer của SSMS mà không cần tự gõ tay câu lệnh `SELECT`, bạn click chuột phải vào tên bảng và chọn tính năng nào?
- A. Script Table as -> CREATE To.
- B. Select Top 1000 Rows.
- C. View Dependencies.
- D. Storage -> Manage Compression.

*(Đáp án đúng: **B** - Tính năng `Select Top 1000 Rows` trong SSMS sẽ tự động tạo và thực thi ngay câu lệnh `SELECT TOP (1000)` để hiển thị bảng dữ liệu).*

### Level 1: Trắc nghiệm - Câu 2: Ý nghĩa của tiền tố N (Unicode)
Trong câu lệnh T-SQL: `INSERT INTO Categories (CategoryName) VALUES (N'Điện thoại');`, chữ `N` đứng trước chuỗi ký tự có ý nghĩa gì?
- A. Là viết tắt của "New" (tạo dòng mới).
- B. Là tiền tố National Character Set, chỉ định chuỗi lưu theo chuẩn mã hóa Unicode (UTF-16) để không bị lỗi font tiếng Việt có dấu.
- C. Là viết tắt của "Null" (cho phép giá trị rỗng).
- D. Là tên biến hệ thống trong SQL Server.

*(Đáp án đúng: **B** - Tiền tố `N` giúp SQL Server hiểu rằng chuỗi ký tự đi sau là dữ liệu Unicode, tránh việc các ký tự có dấu như 'ệ', 'o', 'ạ' bị biến thành dấu hỏi chấm `?`).*

### Level 1: Trắc nghiệm - Câu 3: Bản chất của lệnh GO trong SSMS
Từ khóa `GO` thường thấy trong các file script SQL Server có bản chất là gì?
- A. Là một câu lệnh T-SQL chuẩn của SQL Server Engine.
- B. Là bộ phân tách lô lệnh (Batch Separator) của công cụ SSMS, dùng để gửi toàn bộ các lệnh phía trước lên máy chủ thực thi theo từng khối riêng biệt.
- C. Là lệnh dùng để bắt đầu một Transaction.
- D. Là câu lệnh dùng để thoát khỏi trình soạn thảo truy vấn.

*(Đáp án đúng: **B** - `GO` không phải là câu lệnh T-SQL mà là tiện ích phân tách khối lệnh (Batch Separator) do SSMS cung cấp).*

### 🛠️ Level 2: Viết & Chạy Script T-SQL hoàn chỉnh
Hãy mở SSMS và viết script thực hiện các yêu cầu sau:
1. Tạo một bảng mới tên là `Products` trong database `TechStoreDB` gồm các cột:
   - `ProductID`: Số nguyên tự tăng (`IDENTITY(1,1)`), Khóa chính.
   - `ProductName`: Chuỗi ký tự Unicode (`NVARCHAR(100)`), không được để trống (`NOT NULL`).
   - `Price`: Số thực lưu giá tiền (`DECIMAL(18,2)`), không được để trống.
   - `CategoryID`: Khóa ngoại tham chiếu về cột `CategoryID` của bảng `Categories`.
2. Chèn 2 sản phẩm mẫu có hỗ trợ tiếng Việt có dấu (ví dụ: `N'iPhone 15 Pro Max'` giá `30000000`, `N'MacBook Air M2'` giá `24000000`).
3. Viết lệnh `SELECT` để hiển thị toàn bộ danh sách sản phẩm.

<details>
<summary><b>👉 Xem code T-SQL mẫu</b></summary>

```sql
USE TechStoreDB;
GO

-- 1. Tạo bảng Products với Khóa ngoại
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(100) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    CategoryID INT NOT NULL,
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID) 
        REFERENCES Categories(CategoryID)
);
GO

-- 2. Chèn 2 sản phẩm mẫu
INSERT INTO Products (ProductName, Price, CategoryID)
VALUES 
    (N'iPhone 15 Pro Max', 30000000.00, 1),
    (N'MacBook Air M2', 24000000.00, 2);
GO

-- 3. Hiển thị dữ liệu
SELECT ProductID, ProductName, Price, CategoryID 
FROM Products;
```
</details>

---

## 7. Đúc kết & Đi tiếp

### 📌 3 Điểm cốt lõi cần nhớ:
1. **SSMS** là công cụ giao diện gửi câu lệnh T-SQL lên **Database Engine** để xử lý và nhận kết quả về.
2. Từ khóa `GO` chia nhỏ các Batch xử lý; tiền tố `N'...'` là bắt buộc đối với dữ liệu Unicode tiếng Việt có dấu.
3. Luôn đảm bảo bạn đang đứng đúng Database ngữ cảnh (`USE [DatabaseName];`) trước khi thực hiện các câu lệnh DDL/DML.

👉 **Chuyển sang Chapter 2:** [Bài 2.1: Lệnh SELECT và FROM: Lấy tất cả cột vs. Lấy cột chỉ định](file:///d:/Project/LearnPython/docs/D%E1%BB%AF%20li%E1%BB%87u%20n%E1%BB%99i%20dung%20b%C3%A0i%20h%E1%BB%8Dc/SQL/C%E1%BA%A5u%20tr%C3%BAc%20b%C3%A0i%20h%E1%BB%8Dc/Chapter%2002/B%C3%A0i%202.1%20-%20L%E1%BB%87nh%20SELECT%20v%C3%A0%20FROM.md) — Bước vào thế giới truy vấn dữ liệu thực thụ với ngôn ngữ DQL!
