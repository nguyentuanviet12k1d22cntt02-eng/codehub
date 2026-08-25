---
lessonId: "SQL-01.01"
title: "Cơ sở dữ liệu quan hệ (RDBMS) là gì? Khái niệm Bảng, Dòng, Cột, Schema"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["rdbms", "database", "table", "row", "column", "schema", "t-sql"]
prerequisites: []
---

# Bài 1.1: Cơ sở dữ liệu quan hệ (RDBMS) là gì? Khái niệm Bảng (Table), Dòng (Row), Cột (Column), Lược đồ (Schema)

---

## 1. Khái niệm & Vấn đề

Hãy tưởng tượng bạn đang quản lý thông tin bán hàng của một cửa hàng điện máy chỉ bằng một file Excel khổng lồ chứa hàng trăm nghìn dòng. Mỗi khi nhân viên bán hàng sửa đổi dữ liệu cùng một lúc, file sẽ bị đơ, trùng lặp thông tin khách hàng ở khắp nơi, và một lỗi vô tình có thể xóa trắng toàn bộ lịch sử đơn hàng! 

Để giải quyết vấn đề lưu trữ, truy xuất dữ liệu an toàn, nhất quán và cho phép hàng triệu người dùng truy cập đồng thời, các hệ thống **Cơ sở dữ liệu quan hệ (RDBMS)** ra đời.

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (Cơ sở dữ liệu)                 │
│                                                             │
│   ┌────────────────────────┐       ┌────────────────────┐   │
│   │    Schema: sales       │       │    Schema: hr      │   │
│   │  ┌──────────────────┐  │       │  ┌──────────────┐  │   │
│   │  │ Table: Customers │  │       │  │ Table: Staff │  │   │
│   │  │ Table: Orders    │  │       │  └──────────────┘  │   │
│   │  └──────────────────┘  │       └────────────────────┘   │
│   └────────────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

| Thuật ngữ | Định nghĩa kỹ thuật | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Database (CSDL)** | Tập hợp dữ liệu có cấu trúc được lưu trữ và quản lý tập trung trên ổ đĩa. | Một tủ hồ sơ điện tử khổng lồ của toàn bộ doanh nghiệp. |
| **RDBMS** | Hệ thống phần mềm quản lý, bảo vệ và tối ưu hóa thao tác trên CSDL quan hệ. | Người thủ thư thông minh, nghiêm ngặt kiểm soát việc đọc/ghi hồ sơ. |
| **Schema (Lược đồ)** | Không gian tên (Namespace) logic giúp phân nhóm và gom các bảng có liên quan. | Các ngăn kéo riêng biệt trong tủ: ngăn `sales`, ngăn `hr`, ngăn `inventory`. |
| **Table (Bảng)** | Cấu trúc dữ liệu 2 chiều gồm các cột và các dòng lưu trữ thông tin về một thực thể. | Một bảng tính Excel chuyên biệt (ví dụ: chỉ lưu `Khách hàng`). |
| **Column / Field (Cột)** | Một thuộc tính cụ thể mang một kiểu dữ liệu cố định. | Tiêu đề cột trong Excel: `HoTen`, `NgaySinh`, `SoDienThoai`. |
| **Row / Record (Dòng/Bản ghi)** | Một thể hiện (instance) cụ thể chứa toàn bộ thông tin của một đối tượng. | Một dòng dữ liệu duy nhất đại diện cho khách hàng "Nguyễn Văn A". |

---

## 2. Cú pháp & Vận hành

Trong Microsoft SQL Server (T-SQL), bảng dữ liệu luôn thuộc về một **Schema** (mặc định là `dbo` - Database Owner).

### Mô hình Bảng Dữ liệu mẫu `sales.Customers`:

```text
Cột:     CustomerID (INT)   FullName (NVARCHAR)   Email (VARCHAR)       TotalSpent (DECIMAL)
         ────────────────   ───────────────────   ───────────────────   ────────────────────
Dòng 1:  1                  Nguyễn Văn A          a.nguyen@email.com    15000000.00
Dòng 2:  2                  Trần Thị B            b.tran@email.com      4500000.50
Dòng 3:  3                  Lê Văn C              c.le@email.com        0.00
```

### Cách SQL Server định danh một đối tượng:
Cú pháp đầy đủ theo chuẩn 4 phần (Four-part naming convention) trong SQL Server:
```sql
[ServerName].[DatabaseName].[SchemaName].[ObjectName]
```
Ví dụ thực tế trong truy vấn nội bộ:
```sql
-- Truy xuất dữ liệu từ bảng Customers thuộc Schema sales
SELECT CustomerID, FullName, Email, TotalSpent
FROM SalesDB.sales.Customers;
```

**Bảng giải thích thứ tự xử lý dữ liệu:**
| Thành phần | Ý nghĩa trong câu lệnh | Kết quả máy tính thực hiện |
| :--- | :--- | :--- |
| `FROM SalesDB.sales.Customers` | Xác định vị trí bảng vật lý | Engine đọc đĩa, tải các trang dữ liệu (8KB Data Pages) của bảng `Customers` vào bộ nhớ đệm (Buffer Pool). |
| `SELECT CustomerID, ...` | Chỉ định các cột cần lấy | Engine lọc đúng các trường dữ liệu được yêu cầu và trả về kết quả dạng bảng 2 chiều cho client. |

---

## 3. Lỗi thường gặp & Tối ưu (Best Practices & Pitfalls)

> [!WARNING]
> **Các sai lầm cốt tử người mới thường mắc phải:**
> 1. **Bỏ quên Schema:** Không định nghĩa Schema rõ ràng và để tất cả bảng vào `dbo`. Khi dự án phình to lên hàng trăm bảng, việc phân quyền bảo mật cho từng phòng ban sẽ trở thành thảm họa.
> 2. **Xem RDBMS như file Excel tự do:** Nhập văn bản vào cột số, hoặc gộp họ tên, ngày sinh, địa chỉ vào chung một ô. Trong CSDL quan hệ, mỗi cột bắt buộc phải có kiểu dữ liệu nguyên tử (Atomic Data Value - Tiêu chuẩn 1NF).
> 3. **Nhầm lẫn giữa `NULL` và Chuỗi rỗng `''` hoặc số `0`:** `NULL` nghĩa là "chưa xác định / không có dữ liệu", hoàn toàn khác với `0` (số lượng bằng không) hoặc `''` (chuỗi có độ dài bằng 0).

---

### Level 1: Trắc nghiệm - Câu 1: Bản ghi (Row/Record)
Cho bảng dữ liệu **`Sales.Orders`** lưu thông tin các đơn hàng như sau:

**Bảng dữ liệu mẫu `Sales.Orders`:**

| OrderID | OrderDate | CustomerID | TotalAmount |
| :--- | :--- | :--- | :--- |
| 1001 | 2026-01-15 | CUST_01 | 2500000 |
| 1002 | 2026-01-16 | CUST_02 | 1200000 |
| 1003 | 2026-01-16 | CUST_01 | 4800000 |

Mỗi đơn hàng cụ thể của khách hàng (ví dụ dòng có `OrderID = 1001`) tương ứng với thành phần nào trong mô hình cơ sở dữ liệu quan hệ (RDBMS)?
- A. Một Schema (Lược đồ).
- B. Một Column (Cột / Trường thuộc tính).
- C. Một Row / Record (Dòng / Bản ghi).
- D. Một Database (Cơ sở dữ liệu).

*(Đáp án đúng: **C** - Mỗi đơn hàng cụ thể là một Row (Dòng / Bản ghi) đại diện cho một đối tượng đơn lẻ trong bảng, trong khi các thuộc tính như `OrderID`, `TotalAmount` là các Column (Cột)).*

### Level 1: Trắc nghiệm - Câu 2: Bản chất của giá trị NULL
Trong hệ quản trị cơ sở dữ liệu quan hệ RDBMS, giá trị `NULL` trong một ô dữ liệu được hiểu chính xác là gì?
- A. Là số 0 (Số không nguyên vẹn).
- B. Là chuỗi ký tự rỗng `''` có độ dài bằng 0.
- C. Là giá trị chưa xác định hoặc không tồn tại dữ liệu tại thời điểm ghi nhận.
- D. Là một chuỗi ký tự đặc biệt có chữ "NULL".

*(Đáp án đúng: **C** - `NULL` trong RDBMS đại diện cho dữ liệu bị thiếu hoặc chưa xác định (Unknown/Missing value), hoàn toàn khác với số `0` hoặc chuỗi rỗng `''`).*

### Level 1: Trắc nghiệm - Câu 3: Khái niệm Schema (Lược đồ)
Trong SQL Server, tiền tố `sales` trong tên bảng `sales.Customers` đóng vai trò là gì?
- A. Là tên của tệp tin lưu trữ vật lý trên ổ cứng.
- B. Là Schema (Lược đồ) dùng để phân nhóm logic và phân quyền quản trị bảng.
- C. Là tên máy chủ cơ sở dữ liệu (Server Name).
- D. Là một câu lệnh truy vấn viết tắt.

*(Đáp án đúng: **B** - Schema là một không gian tên logic (Namespace) giúp nhóm các bảng có cùng nghiệp vụ (như `sales`, `hr`, `production`) và hỗ trợ phân quyền bảo mật riêng cho từng bộ phận).*

### 🛠️ Level 2: Phân tích & Sửa sai
Một lập trình viên thiết kế một bảng lưu trữ thông tin nhân viên như sau:

```text
Table: NhanVien
-------------------------------------------------------------------------------
MaNV (INT) | ThongTinChung (NVARCHAR)
-------------------------------------------------------------------------------
1          | Tên: Lê Hoàng Long, Tuổi: 25, Phòng: IT, Lương: 20000000
2          | Tên: Phạm Minh Tuấn, Tuổi: 30, Phòng: Kế Toán, Lương: 25000000
-------------------------------------------------------------------------------
```
**Yêu cầu:** Hãy chỉ ra 2 nhược điểm nghiêm trọng của thiết kế trên khi muốn tính tổng lương hoặc lọc nhân viên phòng IT bằng SQL. Đề xuất lại các cột chuẩn cho bảng `NhanVien`.

<details>
<summary><b>👉 Xem gợi ý & Lời giải</b></summary>

**Nhược điểm:**
1. Vi phạm tính nguyên tử của dữ liệu: Không thể dùng các hàm toán học như `SUM(Luong)`, `AVG(Luong)` hoặc điều kiện `WHERE Phong = 'IT'` trực tiếp mà phải cắt chuỗi (String manipulation), khiến tốc độ truy vấn cực kỳ chậm và dễ lỗi.
2. Không ràng buộc được kiểu dữ liệu cho từng trường (ví dụ không ép được Tuổi là số nguyên dương).

**Thiết kế chuẩn hóa:**
- `MaNV` (INT)
- `HoTen` (NVARCHAR(100))
- `Tuoi` (TINYINT)
- `PhongBan` (NVARCHAR(50))
- `Luong` (DECIMAL(18,2))
</details>

---

## 5. Đúc kết & Đi tiếp

### 📌 3 Điểm cốt lõi cần nhớ:
1. **RDBMS** quản lý dữ liệu dưới dạng các bảng 2 chiều liên kết chặt chẽ với nhau, đảm bảo an toàn, nhất quán và hiệu năng cao.
2. Dữ liệu có cấu trúc: **Database** $\rightarrow$ **Schema** $\rightarrow$ **Table** $\rightarrow$ **Row (Bản ghi)** & **Column (Cột thuộc tính)**.
3. Mỗi cột trong bảng bắt buộc phải có một kiểu dữ liệu xác định và mang giá trị nguyên tử.

👉 **Bài tiếp theo:** [Bài 1.2: Khóa chính (Primary Key), Khóa ngoại (Foreign Key) và Mối quan hệ giữa các bảng](file:///d:/Project/LearnPython/docs/D%E1%BB%AF%20li%E1%BB%87u%20n%E1%BB%99i%20dung%20b%C3%A0i%20h%E1%BB%8Dc/SQL/C%E1%BA%A5u%20tr%C3%BAc%20b%C3%A0i%20h%E1%BB%8Dc/Chapter%2001/B%C3%A0i%201.2%20-%20Kh%C3%B3a%20ch%C3%ADnh%2C%20Kh%C3%B3a%20ngo%E1%BA%A1i%20v%C3%A0%20M%E1%BB%91i%20quan%20h%E1%BB%87%20gi%E1%BB%AFa%20c%C3%A1c%20b%E1%BA%A3ng.md) — Khám phá trái tim của CSDL quan hệ: Cách kết nối và tạo liên kết dữ liệu an toàn tuyệt đối.
