
def branch_3(concept_id, concept_name, errors, is_easier, language="PYTHON"):
    cid = concept_id.upper()
    lang = (language or "PYTHON").upper()
    return {
        "title": "Tính Tổng Các Số Chia Hết Cho K" if not is_easier else "Vòng Lặp Tính Tổng Dãy Số Cơ Bản",
        "concept_id": concept_id,
        "concept_name": concept_name,
        "quick_theory": "Vòng lặp for i in range(1, n + 1) kết hợp mệnh đề điều kiện if giúp xử lý tuần tự từng số nguyên.",
        "detailed_theory": """## 1. Khái niệm & Vấn đề
Xử lý các bài toán thống kê, phân tích dữ liệu bán hàng hoặc kiểm tra chu kỳ lặp lại là công việc hàng ngày của lập trình viên Python. Vòng lặp `for` kết hợp bước nhảy `step` hoặc `range()` tối ưu giúp xử lý hàng triệu bản ghi chỉ trong vài mili-giây.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **range(start, stop, step)** | Hàm tạo dãy số nguyên liên tiếp hoặc cách đều theo bước nhảy. | Như các cột mốc cây số trên đường cao tốc: bạn có thể ghé từng cây số hoặc nhảy cóc mỗi K cây số. |

## 2. Cú pháp & Vận hành
Để tính tổng các số chia hết cho K từ 1 đến N:

```python
n, k = 10, 3
tong = sum(i for i in range(1, n + 1) if i % k == 0)
print(tong)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `n, k = 10, 3` | `n: 10, k: 3` | Khởi tạo 2 biến giới hạn trên và bước chia |
| 2 | `tong = sum(...)` | `tong: 18` | Duyệt `i` từ 1 đến 10, lọc ra [3, 6, 9] và tính tổng `3+6+9 = 18` |
| 3 | `print(tong)` | `tong: 18` | In giá trị tổng tích lũy ra console: `18` |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
n, k      ──────────────────► 10, 3
tong      ──────────────────► 18 (Số nguyên tích lũy)
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Quên cộng 1 ở cận trên**: `range(1, n)` chỉ chạy đến `n - 1`. Phải viết `range(1, n + 1)` để xét cả `n`.
> * **Lỗi chia cho số 0**: Khi `k = 0`, phép toán `% k` ném ra `ZeroDivisionError`.

> [!TIP]
> Sử dụng `sum(range(k, n + 1, k))` với bước nhảy `step = k` giúp chương trình bỏ qua mọi số không chia hết, tối ưu thời gian gấp K lần.

## 4. Đúc kết & Đi tiếp
* Cận trên của hàm `range(start, stop)` luôn là độc quyền (exclusive), nhớ thêm `+ 1` khi muốn bao gồm cả giá trị đích.
* Tận dụng hàm `sum()` giúp loại bỏ việc tạo biến đếm thủ công rườm rà.
* Hãy tiến hành thực hành giải bài tập vòng lặp ngay dưới đây!
""",
        "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `sum_multiples(n, k)`.
Nhận vào hai số nguyên dương `n` và `k`. Tính và trả về tổng tất cả các số từ `1` đến `n` chia hết cho `k`.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `n`: Số nguyên dương giới hạn trên (`int`).
- `k`: Số nguyên dương ước số (`int`).

### 📤 Dữ Liệu Đầu Ra (Output)
- Tổng các số chia hết cho `k` (`int`).

---
### 💡 Ví Dụ Minh Họa
- **Input:** `(10, 3)` ➔ **Output:** `18` (vì 3 + 6 + 9 = 18)
- **Input:** `(5, 2)` ➔ **Output:** `6` (vì 2 + 4 = 6)
""",
        "sample_input": "(10, 3)",
        "sample_output": "18",
        "starter_code": "def sum_multiples(n, k):\n    \"\"\"\n    Tính tổng các số từ 1 đến n chia hết cho k.\n    \"\"\"\n    pass",
        "reference_solution": "def sum_multiples(n, k):\n    return sum(i for i in range(1, n + 1) if i % k == 0)",
        "test_cases": [
            {"input": "(10, 3)", "expected_output": "18", "is_hidden": False},
            {"input": "(5, 2)", "expected_output": "6", "is_hidden": False},
            {"input": "(15, 5)", "expected_output": "30", "is_hidden": True}
        ],
        "common_pitfall_warning": "range(1, n) sẽ dừng ở n - 1. Muốn xét cả giá trị n cần viết range(1, n + 1).",
        "difficulty_stars": 1 if is_easier else 2
    }

def branch_4(concept_id, concept_name, errors, is_easier, language="PYTHON"):
    cid = concept_id.upper()
    lang = (language or "PYTHON").upper()
    return {
        "title": "Chuyển Đổi Kiểu Dữ Liệu An Toàn Tránh Lỗi Ép Kiểu",
        "concept_id": concept_id,
        "concept_name": concept_name,
        "quick_theory": "Hàm int() ném ra ValueError nếu chuỗi không hợp lệ, hãy sử dụng try-except để cung cấp giá trị mặc định.",
        "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong các ứng dụng web nhận input từ người dùng qua form hoặc request JSON, các giá trị số thường xuyên được gửi lên dưới dạng chuỗi (`"123"` hoặc thậm chí `"abc"` do người dùng nhập lỗi). Nếu lập tức gọi `int(val)`, ứng dụng sẽ bị crash ngay lập tức vì `ValueError`.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Defensive Type Casting** | Kỹ thuật ép kiểu dữ liệu có bọc lớp phòng vệ bằng ngoại lệ. | Như việc đi qua cửa kiểm tra an ninh: nếu hành lý hợp lệ thì cho qua, nếu có vật thể lạ thì được hướng dẫn sang lối thoát hiểm an toàn. |

## 2. Cú pháp & Vận hành
Để chuyển đổi kiểu dữ liệu an toàn sang `int` với giá trị dự phòng mặc định:

```python
val = "123"
default_val = 0
try:
    number = int(val)
except (ValueError, TypeError):
    number = default_val
print(number)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `val = "123"` | `val: "123"` | Khởi tạo chuỗi đầu vào |
| 2 | `number = int(val)` | `number: 123` | Ép kiểu thành công chuỗi `"123"` thành số nguyên 123 |
| 3 | Bỏ qua khối `except` | `number: 123` | Do không có ngoại lệ phát sinh |
| 4 | `print(number)` | `number: 123` | In giá trị số nguyên ra console: `123` |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
val       ──────────────────► "123" (Chuỗi String)
number    ──────────────────► 123 (Số nguyên Integer)
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Dùng khối `except:` trần trụi**: Bắt cả lỗi `KeyboardInterrupt` hoặc `SystemExit`, gây khó khăn cho việc debug. Luôn chỉ định `except (ValueError, TypeError):`.
> * **Quên xử lý trường hợp `val = None`**: `int(None)` sẽ ném lỗi `TypeError`.

> [!TIP]
> Luôn đặt giá trị mặc định là một số nguyên (như `0` hoặc `-1`) để các phép tính toán phía sau không bị lỗi `TypeError: unsupported operand type`.

## 4. Đúc kết & Đi tiếp
* Kỹ thuật ép kiểu phòng thủ (Defensive Casting) là nguyên tắc sống còn khi nhận dữ liệu từ người dùng.
* Chỉ bắt đúng các ngoại lệ dự kiến (`ValueError`, `TypeError`).
* Hãy bắt đầu giải bài tập ép kiểu dữ liệu an toàn ngay dưới đây!
""",
        "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `safe_convert_to_int(val, default_val=0)`.
Nhận vào tham số `val` (có thể là chuỗi hoặc số) và trả về số nguyên. Nếu không thể chuyển đổi được, trả về `default_val` an toàn.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `val`: Giá trị cần chuyển đổi (`str`, `float`, hoặc bất kỳ).
- `default_val`: Giá trị mặc định trả về nếu gặp lỗi (`int`, mặc định = `0`).

### 📤 Dữ Liệu Đầu Ra (Output)
- Số nguyên (`int`) sau khi chuyển đổi thành công hoặc `default_val`.

---
### 💡 Ví Dụ Minh Họa
- **Input:** `('123', 0)` ➔ **Output:** `123`
- **Input:** `('abc', 0)` ➔ **Output:** `0`
""",
        "sample_input": "('123', 0)",
        "sample_output": "123",
        "starter_code": "def safe_convert_to_int(val, default_val=0):\n    \"\"\"\n    Chuyển đổi kiểu dữ liệu an toàn sang int.\n    \"\"\"\n    pass",
        "reference_solution": "def safe_convert_to_int(val, default_val=0):\n    try:\n        return int(val)\n    except (ValueError, TypeError):\n        return default_val",
        "test_cases": [
            {"input": "('123', 0)", "expected_output": "123", "is_hidden": False},
            {"input": "('abc', 0)", "expected_output": "0", "is_hidden": False},
            {"input": "('-45', 0)", "expected_output": "-45", "is_hidden": True}
        ],
        "common_pitfall_warning": "Ép chuỗi chứa ký tự chữ sang int() sẽ ném ra ngoại lệ ValueError.",
        "difficulty_stars": 1 if is_easier else 2
    }
