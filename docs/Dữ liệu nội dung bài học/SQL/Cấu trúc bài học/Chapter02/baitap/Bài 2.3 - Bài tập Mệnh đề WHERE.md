# Bộ Bài Tập Thực Hành: Bài 2.3 - Lọc điều kiện cơ bản với mệnh đề WHERE

> **Mã bài học:** `SQL-02.03`  
> **Chủ đề:** Sử dụng mệnh đề `WHERE`, các toán tử so sánh (`=`, `<>`, `>`, `<`, `>=`, `<=`), lọc dữ liệu chuỗi Unicode và Ngày tháng.

---

## 🗄️ Cấu Trúc Bảng Dữ Liệu Thực Hành

Cho bảng **`hr.Employees`** quản lý danh sách nhân sự của công ty:

| EmployeeID (`INT`) | FullName (`NVARCHAR`) | Department (`NVARCHAR`) | Salary (`DECIMAL`) | HireDate (`DATE`) |
| :--- | :--- | :--- | :--- | :--- |
| `1` | `Trần Văn Bình` | `Công nghệ thông tin` | `25000000.00` | `2022-03-15` |
| `2` | `Lê Thị Cẩm` | `Kế toán` | `16500000.00` | `2023-07-01` |
| `3` | `Phạm Quốc Dũng` | `Công nghệ thông tin` | `32000000.00` | `2021-11-20` |
| `4` | `Nguyễn Hoàng Em` | `Kinh doanh` | `14000000.00` | `2024-02-10` |
| `5` | `Vũ Thị Hà` | `Kinh doanh` | `18500000.00` | `2023-01-15` |
| `6` | `Đỗ Minh Trí` | `Nhân sự` | `15000000.00` | `2022-09-01` |

---

## 📝 BÀI TẬP 1: Tìm Kiếm Nhân Sự Khối Công Nghệ (Mức độ: Dễ)

### 📌 Đề bài:
Trưởng phòng IT cần danh sách các nhân viên đang làm việc tại phòng **`Công nghệ thông tin`**. Hãy viết câu lệnh T-SQL lấy ra: `EmployeeID`, `FullName`, `Department`, và `Salary`.

### 💡 Starter Code:
```sql
SELECT EmployeeID, FullName, Department, Salary
FROM hr.Employees
WHERE Department = -- Điền chuỗi Unicode có tiền tố N tại đây
;
```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| EmployeeID | FullName | Department | Salary |
| :--- | :--- | :--- | :--- |
| 1 | Trần Văn Bình | Công nghệ thông tin | 25000000.00 |
| 3 | Phạm Quốc Dũng | Công nghệ thông tin | 32000000.00 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT EmployeeID, FullName, Department, Salary
FROM hr.Employees
WHERE Department = N'Công nghệ thông tin';
```

---

## 📝 BÀI TẬP 2: Lọc Danh Sách Nhân Viên Mức Lương Cao (Mức độ: Dễ)

### 📌 Đề bài:
Ban Giám đốc cần rà soát chính sách thuế thu nhập cá nhân đối với các nhân sự có mức lương từ **`18.000.000 VNĐ trở lên`** (`Salary >= 18000000`). Hãy hiển thị: `FullName`, `Department`, và `Salary`.

### 💡 Starter Code:
```sql
-- Viết câu lệnh lọc lương >= 18 triệu

```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| FullName | Department | Salary |
| :--- | :--- | :--- |
| Trần Văn Bình | Công nghệ thông tin | 25000000.00 |
| Phạm Quốc Dũng | Công nghệ thông tin | 32000000.00 |
| Vũ Thị Hà | Kinh doanh | 18500000.00 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT FullName, Department, Salary
FROM hr.Employees
WHERE Salary >= 18000000;
```

---

## 📝 BÀI TẬP 3: Lọc Nhân Viên Gia Nhập Trước Năm 2023 (Mức độ: Trung bình)

### 📌 Đề bài:
Công ty chuẩn bị trao kỷ niệm chương gắn bó thâm niên cho những nhân viên được tuyển dụng **trước ngày `01/01/2023`** (`HireDate < '2023-01-01'`). Hãy viết câu lệnh lấy thông tin: `EmployeeID`, `FullName`, `HireDate`.

### 💡 Starter Code:
```sql
SELECT EmployeeID, FullName, HireDate
FROM hr.Employees
WHERE HireDate < '2023-01-01';
```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| EmployeeID | FullName | HireDate |
| :--- | :--- | :--- |
| 1 | Trần Văn Bình | 2022-03-15 |
| 3 | Phạm Quốc Dũng | 2021-11-20 |
| 6 | Đỗ Minh Trí | 2022-09-01 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT EmployeeID, FullName, HireDate
FROM hr.Employees
WHERE HireDate < '2023-01-01';
```

---

## 💡 Ghi Nhớ & Phân Tích Lỗi Sai Thường Gặp
1. **Quên tiền tố `N` khi lọc tiếng Việt:** Nếu viết `WHERE Department = 'Công nghệ thông tin'` (thiếu chữ `N`), SQL Server sẽ coi chuỗi là ASCII không dấu `Cong nghe thong tin` và kết quả trả về **0 dòng**.
2. **Định dạng ngày chuẩn:** Luôn viết chuỗi ngày tháng dạng `'YYYY-MM-DD'` (ví dụ: `'2023-01-01'`) để câu lệnh chạy chính xác độc lập với mọi thiết lập ngày tháng của máy chủ SQL Server.
