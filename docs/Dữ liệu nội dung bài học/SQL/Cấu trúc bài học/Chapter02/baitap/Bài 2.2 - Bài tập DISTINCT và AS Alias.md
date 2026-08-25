# Bộ Bài Tập Thực Hành: Bài 2.2 - Loại bỏ trùng lặp với DISTINCT và Đặt bí danh với AS

> **Mã bài học:** `SQL-02.02`  
> **Chủ đề:** Sử dụng `DISTINCT` trích xuất danh sách duy nhất, đặt bí danh trực quan với `AS`, tính toán biểu thức cột.

---

## 🗄️ Cấu Trúc Bảng Dữ Liệu Thực Hành

Cho bảng **`sales.Customers`** và bảng **`sales.Inventory`**:

### Bảng `sales.Customers`:
| CustomerID (`INT`) | FullName (`NVARCHAR`) | City (`NVARCHAR`) | Country (`NVARCHAR`) |
| :--- | :--- | :--- | :--- |
| `1` | `Nguyễn Văn An` | `Hà Nội` | `Việt Nam` |
| `2` | `Trần Thị Mai` | `TP. Hồ Chí Minh` | `Việt Nam` |
| `3` | `Lê Hoàng Long` | `Hà Nội` | `Việt Nam` |
| `4` | `Phạm Minh Tuấn` | `Đà Nẵng` | `Việt Nam` |
| `5` | `John Smith` | `Tokyo` | `Nhật Bản` |
| `6` | `Kenji Sato` | `Tokyo` | `Nhật Bản` |

### Bảng `sales.Inventory`:
| ItemID (`INT`) | ItemName (`NVARCHAR`) | UnitPrice (`DECIMAL`) | Quantity (`INT`) |
| :--- | :--- | :--- | :--- |
| `101` | `Bàn Phím Cơ AKKO` | `1200000.00` | `15` |
| `102` | `Chuột Logitech MX Master 3S` | `2450000.00` | `10` |
| `103` | `Màn hình Dell UltraSharp 27"` | `8900000.00` | `5` |

---

## 📝 BÀI TẬP 1: Khảo Sát Thị Trường Thành Phố (Mức độ: Dễ)

### 📌 Đề bài:
Bộ phận Marketing muốn biết công ty hiện có khách hàng ở những thành phố (`City`) nào mà không muốn bị lặp lại tên thành phố nhiều lần. Hãy viết câu lệnh T-SQL để lấy danh sách các thành phố **duy nhất**.

### 💡 Starter Code:
```sql
-- Dùng DISTINCT để lọc các thành phố duy nhất
SELECT 
FROM sales.Customers;
```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| City |
| :--- |
| Hà Nội |
| TP. Hồ Chí Minh |
| Đà Nẵng |
| Tokyo |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT DISTINCT City 
FROM sales.Customers;
```

---

## 📝 BÀI TẬP 2: Báo Cáo Định Giá Tài Sản Tồn Kho (Mức độ: Trung bình)

### 📌 Đề bài:
Ban Giám đốc yêu cầu lập bảng báo cáo tổng giá trị hàng tồn kho từ bảng `sales.Inventory`. Hãy viết câu lệnh T-SQL hiển thị các cột:
1. `ItemName` đổi tên thành **`[Tên Linh Kiện]`**.
2. `UnitPrice` đổi tên thành **`[Đơn Giá]`**.
3. `Quantity` đổi tên thành **`[Số Lượng]`**.
4. Biểu thức tính `UnitPrice * Quantity` đổi tên thành **`[Tổng Giá Trị Kho]`**.

### 💡 Starter Code:
```sql
-- Đặt bí danh cho các cột và biểu thức tính toán
SELECT 
FROM sales.Inventory;
```

### 🎯 Bảng Kết Quả Mong Đợi (Expected Output):
| Tên Linh Kiện | Đơn Giá | Số Lượng | Tổng Giá Trị Kho |
| :--- | :--- | :--- | :--- |
| Bàn Phím Cơ AKKO | 1200000.00 | 15 | 18000000.00 |
| Chuột Logitech MX Master 3S | 2450000.00 | 10 | 24500000.00 |
| Màn hình Dell UltraSharp 27" | 8900000.00 | 5 | 44500000.00 |

### 🔑 Lời Giải Chuẩn (Solution):
```sql
SELECT 
    ItemName AS [Tên Linh Kiện],
    UnitPrice AS [Đơn Giá],
    Quantity AS [Số Lượng],
    UnitPrice * Quantity AS [Tổng Giá Trị Kho]
FROM sales.Inventory;
```

---

## 💡 Ghi Nhớ & Phân Tích Lỗi Sai Thường Gặp
1. **Dấu ngoặc vuông `[ ]` trong bí danh:** Khi bí danh chứa khoảng trắng (space) hoặc tiếng Việt có dấu (ví dụ: `[Tổng Giá Trị Kho]`), bắt buộc phải bọc trong cặp ngoặc vuông `[ ... ]` hoặc nháy đơn `' ... '`.
2. **Không dùng Bí danh trong `WHERE`:** Không thể viết `WHERE [Tổng Giá Trị Kho] > 20000000` vì `WHERE` chạy trước khi `SELECT` kịp tạo ra bí danh.
