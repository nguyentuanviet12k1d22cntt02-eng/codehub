# Bộ Bài Tập Thực Hành: Bài 2.4 - Kết hợp điều kiện logic với AND, OR, NOT

> **Mã bài học:** `SQL-02.04`  
> **Chủ đề:** Kết hợp đa điều kiện với `AND`, `OR`, `NOT`, kiểm soát thứ tự ưu tiên toán tử bằng cặp dấu ngoặc đơn `( )`.

---

## 🗄️ Cấu Trúc Bảng Dữ Liệu Thực Hành

Cho bảng **`sales.Products`** quản lý các mặt hàng trong chuỗi siêu thị điện máy:

| ProductID (`INT`) | ProductName (`NVARCHAR`) | CategoryName (`NVARCHAR`) | UnitPrice (`DECIMAL`) | UnitsInStock (`INT`) | Discontinued (`BIT`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `iPhone 15 Pro Max` | `Điện thoại` | `29990000.00` | `25` | `0` |
| `2` | `Samsung Galaxy A15` | `Điện thoại` | `4500000.00` | `50` | `0` |
| `3` | `MacBook Air M2` | `Laptop` | `24490000.00` | `12` | `0` |
| `4` | `Asus TUF Gaming` | `Laptop` | `19500000.00` | `3` | `0` |
| `5` | `Tai nghe Airpods 2` | `Phụ kiện` | `2800000.00` | `0` | `1` |
| `6` | `Bàn phím cơ văn phòng` | `Phụ kiện` | `850000.00` | `4` | `0` |

*(Ghi chú: Cột `Discontinued = 1` là đã ngừng kinh doanh, `0` là đang kinh doanh).*

---

## 📝 BÀI TẬP 1: Lọc Điện Thoại Cao Cấp (Toán tử AND) (Mức độ: Dễ)

### 📌 Đề bài:
Cửa hàng đang chạy chương trình khuyến mãi cho dòng điện thoại cao cấp. Hãy viết câu lệnh T-SQL tìm tất cả sản phẩm thỏa mãn đồng thời:
1. Thuộc danh mục **`Điện thoại`** (`CategoryName = N'Điện thoại'`).
2. Có đơn giá từ **`20.000.000 VNĐ trở lên`** (`UnitPrice >= 20000000`).

### 💡 Starter Code:
```sql
SELECT ProductID, ProductName, CategoryName, UnitPrice
FROM sales.Products
WHERE CategoryName = N'Điện thoại'
  AND UnitPrice >= 20000000;
```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| ProductID | ProductName | CategoryName | UnitPrice |
| :--- | :--- | :--- | :--- |
| 1 | iPhone 15 Pro Max | Điện thoại | 29990000.00 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT ProductID, ProductName, CategoryName, UnitPrice
FROM sales.Products
WHERE CategoryName = N'Điện thoại'
  AND UnitPrice >= 20000000;
```

---

## 📝 BÀI TẬP 2: Lọc Danh Mục Đa Ngành (Toán tử OR & NOT) (Mức độ: Trung bình)

### 📌 Đề bài:
Nhân viên quản lý thiết bị số cần danh sách các sản phẩm là **`Điện thoại`** HOẶC **`Laptop`**, nhưng **chỉ lấy những sản phẩm ĐANG KINH DOANH** (`Discontinued = 0` hoặc dùng `NOT Discontinued = 1`).

### 💡 Starter Code:
```sql
-- Kết hợp (CategoryName = N'Điện thoại' OR CategoryName = N'Laptop') VÀ Discontinued = 0

```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| ProductID | ProductName | CategoryName | UnitPrice | Discontinued |
| :--- | :--- | :--- | :--- | :--- |
| 1 | iPhone 15 Pro Max | Điện thoại | 29990000.00 | 0 |
| 2 | Samsung Galaxy A15 | Điện thoại | 4500000.00 | 0 |
| 3 | MacBook Air M2 | Laptop | 24490000.00 | 0 |
| 4 | Asus TUF Gaming | Laptop | 19500000.00 | 0 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT ProductID, ProductName, CategoryName, UnitPrice, Discontinued
FROM sales.Products
WHERE (CategoryName = N'Điện thoại' OR CategoryName = N'Laptop')
  AND Discontinued = 0;
```

---

## 📝 BÀI TẬP 3: Cảnh Báo Hàng Sắp Hết Kho & Giá Trị Cao (Mức độ: Nâng cao)

### 📌 Đề bài:
Bộ phận điều phối kho muốn cảnh báo các sản phẩm cần ưu tiên xử lý:
1. Sản phẩm đang kinh doanh (`Discontinued = 0`).
2. **VÀ** thỏa mãn một trong hai trường hợp:
   - Đang sắp hết hàng trong kho: **Số lượng tồn kho dưới 5 sản phẩm** (`UnitsInStock < 5`).
   - **HOẶC** là sản phẩm có giá trị rất cao: **Đơn giá trên 25.000.000 VNĐ** (`UnitPrice > 25000000`).

### 💡 Starter Code:
```sql
SELECT ProductID, ProductName, UnitPrice, UnitsInStock
FROM sales.Products
WHERE Discontinued = 0
  AND (UnitsInStock < 5 OR UnitPrice > 25000000);
```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| ProductID | ProductName | UnitPrice | UnitsInStock |
| :--- | :--- | :--- | :--- |
| 1 | iPhone 15 Pro Max | 29990000.00 | 25 |
| 4 | Asus TUF Gaming | 19500000.00 | 3 |
| 6 | Bàn phím cơ văn phòng | 850000.00 | 4 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT ProductID, ProductName, UnitPrice, UnitsInStock
FROM sales.Products
WHERE Discontinued = 0
  AND (UnitsInStock < 5 OR UnitPrice > 25000000);
```

---

## 💡 Ghi Nhớ & Phân Tích Lỗi Sai Thường Gặp
1. **Lỗi không bao bọc cặp ngoặc `( )` cho `OR`:** 
   Nếu viết: `WHERE Discontinued = 0 AND UnitsInStock < 5 OR UnitPrice > 25000000;`
   $\rightarrow$ Lệnh sẽ bị hiểu là `(Discontinued = 0 AND UnitsInStock < 5) OR (UnitPrice > 25000000)`. Khi đó, một sản phẩm giá trên 25 triệu kể cả khi **đã ngừng kinh doanh (`Discontinued = 1`)** vẫn bị lọt vào danh sách kết quả!
2. **Quy tắc vàng:** Luôn dùng `( )` khi viết câu lệnh có sự xuất hiện đồng thời của cả `AND` và `OR`.
