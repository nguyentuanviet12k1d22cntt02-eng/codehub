import sqlite3
import sys
import os
import re

# Đảm bảo UTF-8 cho stdout/stderr trên Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

def init_mock_database():
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()

    # 1. Bảng Products
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Products (
        ProductID INTEGER PRIMARY KEY,
        ProductName TEXT NOT NULL,
        CategoryName TEXT NOT NULL,
        UnitPrice REAL NOT NULL,
        UnitsInStock INTEGER NOT NULL,
        Discontinued INTEGER DEFAULT 0
    );
    ''')
    products_data = [
        (1, 'iPhone 15 Pro Max', 'Điện thoại', 29990000.00, 25, 0),
        (2, 'Samsung Galaxy S24 Ultra', 'Điện thoại', 27990000.00, 18, 0),
        (3, 'MacBook Air M2', 'Laptop', 24490000.00, 12, 0),
        (4, 'Dell XPS 13 Plus', 'Laptop', 32500000.00, 8, 0),
        (5, 'Sony WH-1000XM5', 'Phụ kiện', 6990000.00, 40, 0),
        (6, 'Bàn phím cơ văn phòng', 'Phụ kiện', 850000.00, 4, 0),
        (7, 'Samsung Galaxy A15', 'Điện thoại', 4500000.00, 50, 0),
        (8, 'Asus TUF Gaming', 'Laptop', 19500000.00, 3, 0)
    ]
    cursor.executemany('INSERT INTO Products VALUES (?, ?, ?, ?, ?, ?)', products_data)

    # 2. Bảng Customers
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Customers (
        CustomerID INTEGER PRIMARY KEY,
        FullName TEXT NOT NULL,
        City TEXT NOT NULL,
        Country TEXT NOT NULL,
        TotalSpent REAL DEFAULT 0.00
    );
    ''')
    customers_data = [
        (1, 'Nguyễn Văn An', 'Hà Nội', 'Việt Nam', 15000000.00),
        (2, 'Trần Thị Mai', 'TP. Hồ Chí Minh', 'Việt Nam', 4500000.00),
        (3, 'Lê Hoàng Long', 'Hà Nội', 'Việt Nam', 28000000.00),
        (4, 'Phạm Minh Tuấn', 'Đà Nẵng', 'Việt Nam', 0.00),
        (5, 'John Smith', 'Tokyo', 'Nhật Bản', 32000000.00),
        (6, 'Kenji Sato', 'Tokyo', 'Nhật Bản', 8000000.00)
    ]
    cursor.executemany('INSERT INTO Customers VALUES (?, ?, ?, ?, ?)', customers_data)

    # 3. Bảng Employees
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Employees (
        EmployeeID INTEGER PRIMARY KEY,
        FullName TEXT NOT NULL,
        Department TEXT NOT NULL,
        Salary REAL NOT NULL,
        HireDate TEXT NOT NULL
    );
    ''')
    employees_data = [
        (1, 'Trần Văn Bình', 'Công nghệ thông tin', 25000000.00, '2022-03-15'),
        (2, 'Lê Thị Cẩm', 'Kế toán', 16500000.00, '2023-07-01'),
        (3, 'Phạm Quốc Dũng', 'Công nghệ thông tin', 32000000.00, '2021-11-20'),
        (4, 'Nguyễn Hoàng Em', 'Kinh doanh', 14000000.00, '2024-02-10'),
        (5, 'Vũ Thị Hà', 'Kinh doanh', 18500000.00, '2023-01-15'),
        (6, 'Đỗ Minh Trí', 'Nhân sự', 15000000.00, '2022-09-01')
    ]
    cursor.executemany('INSERT INTO Employees VALUES (?, ?, ?, ?, ?)', employees_data)

    # 4. Bảng Inventory
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Inventory (
        ItemID INTEGER PRIMARY KEY,
        ItemName TEXT NOT NULL,
        UnitPrice REAL NOT NULL,
        Quantity INTEGER NOT NULL
    );
    ''')
    inventory_data = [
        (101, 'Bàn Phím Cơ AKKO', 1200000.00, 15),
        (102, 'Chuột Logitech MX Master 3S', 2450000.00, 10),
        (103, 'Màn hình Dell UltraSharp 27"', 8900000.00, 5)
    ]
    cursor.executemany('INSERT INTO Inventory VALUES (?, ?, ?, ?)', inventory_data)

    conn.commit()
    return conn

def execute_user_sql(sql_code: str):
    conn = init_mock_database()
    cursor = conn.cursor()

    # Chuẩn hóa SQL query:
    # 1. Loại bỏ tiền tố Schema: sales.Products -> Products, hr.Employees -> Employees, dbo.X -> X
    normalized = re.sub(r'\b(sales|hr|dbo|Production|Sales|HumanResources)\.([a-zA-Z0-9_]+)\b', r'\2', sql_code)
    # 2. Xóa tiền tố Unicode N'...' -> '...' cho tương thích SQLite
    normalized = re.sub(r"N'([^']*)'", r"'\1'", normalized)
    # 3. Loại bỏ các lệnh GO hoặc USE
    normalized = re.sub(r'\bGO\b', '', normalized, flags=re.IGNORECASE)
    normalized = re.sub(r'\bUSE\s+[\w\[\]]+;?', '', normalized, flags=re.IGNORECASE)

    # Tách các câu lệnh theo dấu ;
    statements = [s.strip() for s in normalized.split(';') if s.strip()]

    if not statements:
        sys.stderr.write("Lỗi: Không tìm thấy câu lệnh SQL hợp lệ.\n")
        sys.exit(1)

    try:
        last_result = None
        col_names = []
        for stmt in statements:
            cursor.execute(stmt)
            if cursor.description:
                col_names = [d[0] for d in cursor.description]
                last_result = cursor.fetchall()

        if last_result is not None:
            # Header
            print(' | '.join(col_names))
            # Data rows
            for row in last_result:
                formatted_row = []
                for val in row:
                    if isinstance(val, float):
                        formatted_row.append(f"{val:.2f}")
                    elif val is None:
                        formatted_row.append("NULL")
                    else:
                        formatted_row.append(str(val))
                print(' | '.join(formatted_row))
        else:
            print("Lệnh đã thực thi thành công (Không có kết quả dạng bảng).")

    except Exception as e:
        sys.stderr.write(f"Lỗi SQL: {e}\n")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            code = f.read()
    else:
        code = sys.stdin.read()

    execute_user_sql(code)
