# Bộ Bài Tập Thực Hành: Bài 2.1 - Cú pháp lệnh SELECT và FROM

> **Mã bài học:** `SQL-02.01`  
> **Chủ đề:** Truy xuất dữ liệu từ bảng nguồn, chọn lọc cột hiển thị, tối ưu hiệu năng tránh `SELECT *`.

---

## 🗄️ Cấu Trúc Bảng Dữ Liệu Thực Hành

Cho bảng **`sales.Products`** lưu trữ thông tin sản phẩm trong kho hàng:

| ProductID (`INT`) | ProductName (`NVARCHAR`) | CategoryName (`NVARCHAR`) | UnitPrice (`DECIMAL`) | UnitsInStock (`INT`) |
| :--- | :--- | :--- | :--- | :--- |
| `1` | `iPhone 15 Pro Max` | `Điện thoại` | `29990000.00` | `25` |
| `2` | `Samsung Galaxy S24 Ultra` | `Điện thoại` | `27990000.00` | `18` |
| `3` | `MacBook Air M2` | `Laptop` | `24490000.00` | `12` |
| `4` | `Dell XPS 13 Plus` | `Laptop` | `32500000.00` | `8` |
| `5` | `Sony WH-1000XM5` | `Phụ kiện` | `6990000.00` | `40` |

---

## 📝 BÀI TẬP 1: Truy Xuất Thông Tin Menu Bán Hàng (Mức độ: Dễ)

### 📌 Đề bài:
Ứng dụng di động cần hiển thị danh mục sản phẩm cho khách hàng xem. Hãy viết câu lệnh T-SQL để lấy ra **3 thông tin**: Mã sản phẩm (`ProductID`), Tên sản phẩm (`ProductName`), và Đơn giá (`UnitPrice`) từ bảng `sales.Products`.

### 💡 Starter Code:
```sql
-- Viết câu lệnh SELECT chỉ định 3 cột theo yêu cầu
SELECT 
FROM sales.Products;
```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| ProductID | ProductName | UnitPrice |
| :--- | :--- | :--- |
| 1 | iPhone 15 Pro Max | 29990000.00 |
| 2 | Samsung Galaxy S24 Ultra | 27990000.00 |
| 3 | MacBook Air M2 | 24490000.00 |
| 4 | Dell XPS 13 Plus | 32500000.00 |
| 5 | Sony WH-1000XM5 | 6990000.00 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT ProductID, ProductName, UnitPrice 
FROM sales.Products;
```

---

## 📝 BÀI TẬP 2: Báo Cáo Tồn Kho Cho Bộ Phận Kho Vận (Mức độ: Dễ)

### 📌 Đề bài:
Thủ kho cần kiểm tra tình trạng hàng hóa còn lại. Hãy viết truy vấn lấy danh sách gồm: Tên sản phẩm (`ProductName`), Danh mục (`CategoryName`), và Số lượng tồn kho (`UnitsInStock`).

### 💡 Starter Code:
```sql
-- Viết câu lệnh truy vấn tại đây

```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| ProductName | CategoryName | UnitsInStock |
| :--- | :--- | :--- |
| iPhone 15 Pro Max | Điện thoại | 25 |
| Samsung Galaxy S24 Ultra | Điện thoại | 18 |
| MacBook Air M2 | Laptop | 12 |
| Dell XPS 13 Plus | Laptop | 8 |
| Sony WH-1000XM5 | Phụ kiện | 40 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT ProductName, CategoryName, UnitsInStock 
FROM sales.Products;
```

---

## 💡 Ghi Nhớ & Phân Tích Lỗi Sai Thường Gặp
1. **Lỗi `SELECT *`:** Tránh dùng `SELECT *` vì làm lãng phí băng thông mạng và bộ nhớ Buffer Cache của SQL Server khi truyền các cột không sử dụng (`ProductID`, `UnitPrice` trong Bài 2).
2. **Thứ tự cột:** Tên cột trong mệnh đề `SELECT` quyết định thứ tự hiển thị từ trái sang phải của bảng kết quả.
