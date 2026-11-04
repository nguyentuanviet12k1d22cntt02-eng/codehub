
def branch_0(concept_id, concept_name, errors, is_easier, language="PYTHON"):
    cid = concept_id.upper()
    lang = (language or "PYTHON").upper()
    return {
        "title": "Tra cứu Điểm Thi Học Viên An Toàn (Safe Dictionary Lookup)" if not is_easier else "Kiểm Tra Khóa Trong Từ Điển",
        "concept_id": concept_id,
        "concept_name": concept_name,
        "quick_theory": "Phương thức dict.get(key, default) giúp tra cứu giá trị an toàn mà không làm dừng chương trình do KeyError.",
        "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong các hệ thống thực tế (như kiểm tra giỏ hàng, tra cứu thông tin học viên, gọi API), dữ liệu từ điển thường xuyên bị thiếu trường (missing keys). Nếu truy cập trực tiếp `dict[key]`, chương trình sẽ bị sập ngay lập tức bởi ngoại lệ `KeyError`!

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **dict.get(key, default)** | Phương thức tra cứu giá trị theo khóa an toàn trong từ điển. | Như việc mở tủ có khóa dự phòng: nếu ngăn tủ rỗng thì tự động lấy món đồ dự phòng đã chuẩn bị sẵn. |

## 2. Cú pháp & Vận hành
Để tra cứu giá trị an toàn trong Dictionary và tránh hoàn toàn lỗi `KeyError`:

```python
scores = {'Toan': 9.5, 'Ly': 8.0}
mon_hoc = 'Hoa'
diem = scores.get(mon_hoc, 0)
print(diem)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `scores = {'Toan': 9.5, 'Ly': 8.0}` | `scores`: Dict 2 phần tử | Cấp phát bảng băm Dictionary trong bộ nhớ RAM Heap |
| 2 | `mon_hoc = 'Hoa'` | `mon_hoc: 'Hoa'` | Khởi tạo chuỗi tên môn cần tra cứu |
| 3 | `diem = scores.get(mon_hoc, 0)` | `diem: 0` | Không thấy khóa 'Hoa' trong bảng băm ➔ Trả về giá trị mặc định 0 |
| 4 | `print(diem)` | `diem: 0` | Đọc biến `diem` và in ra màn hình console: `0` |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
scores    ──────────────────► { 'Toan': 9.5, 'Ly': 8.0 }
mon_hoc   ──────────────────► 'Hoa' (Không có trong keys)
diem      ──────────────────► 0 (Giá trị mặc định fallback)
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Truy xuất trực tiếp bằng ngoặc vuông**: `scores['Hoa']` ➔ Ném lỗi `KeyError` và crash ứng dụng.
> * **Nhầm lẫn giữa key không tồn tại và key có giá trị None**: Nếu key có sẵn với giá trị `None`, `.get(key, 0)` vẫn trả về `None`!

> [!TIP]
> Luôn xác định giá trị mặc định fallback phù hợp: với điểm số nên là `0` hoặc `-1`, với danh sách nên là `[]`, với chuỗi nên là `""`.

## 4. Đúc kết & Đi tiếp
* Phương thức `.get()` là chuẩn mực bắt buộc của Senior Python Developer khi làm việc với Dictionary không xác định trước các khóa.
* Luôn dự phòng giá trị `default` để luồng xử lý phía sau không bị gián đoạn.
* Bây giờ, hãy thực hành giải quyết bài toán tra cứu điểm thi bên dưới!
""",
        "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `get_student_score(scores_dict, student_name, default_score=0)`.
Tra cứu điểm số của học viên trong từ điển điểm số. Nếu học viên không có tên trong danh sách, trả về giá trị mặc định `default_score` một cách an toàn mà không gây lỗi `KeyError`.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `scores_dict`: Từ điển ánh xạ `{tên_học_viên: điểm_số}` (`dict[str, float]`).
- `student_name`: Tên học viên cần tra cứu (`str`).
- `default_score`: Điểm trả về mặc định nếu không tìm thấy (`int` hoặc `float`, mặc định = `0`).

### 📤 Dữ Liệu Đầu Ra (Output)
- Điểm số của học viên (`float` / `int`) hoặc `default_score`.

---
### 💡 Ví Dụ Minh Họa
- **Input:** `({'Toan': 9.5, 'Ly': 8.0}, 'Toan', 0)` ➔ **Output:** `9.5`
- **Input:** `({'Toan': 9.5, 'Ly': 8.0}, 'Hoa', 0)` ➔ **Output:** `0`
""",
        "sample_input": "({'Toan': 9.5, 'Ly': 8.0}, 'Toan', 0)",
        "sample_output": "9.5",
        "starter_code": "def get_student_score(scores_dict, student_name, default_score=0):\n    # Sử dụng .get() để tra cứu điểm an toàn\n    pass",
        "reference_solution": "def get_student_score(scores_dict, student_name, default_score=0):\n    return scores_dict.get(student_name, default_score)",
        "test_cases": [
            {"input": "({'Toan': 9.5, 'Ly': 8.0}, 'Toan', 0)", "expected_output": "9.5", "is_hidden": False},
            {"input": "({'Toan': 9.5, 'Ly': 8.0}, 'Hoa', 0)", "expected_output": "0", "is_hidden": False},
            {"input": "({'Toan': 10, 'Van': 7.5}, 'Anh', -1)", "expected_output": "-1", "is_hidden": True}
        ],
        "common_pitfall_warning": "Truy xuất trực tiếp scores_dict[student_name] khi key chưa có sẽ ném ra lỗi KeyError.",
        "difficulty_stars": 1 if is_easier else 2
    }

def branch_1(concept_id, concept_name, errors, is_easier, language="PYTHON"):
    cid = concept_id.upper()
    lang = (language or "PYTHON").upper()
    return {
        "title": "Lọc Các Phần Tử Thỏa Mãn Điều Kiện Trong List" if not is_easier else "Lấy Các Số Chẵn Trong Danh Sách",
        "concept_id": concept_id,
        "concept_name": concept_name,
        "quick_theory": "Duyệt danh sách hoặc dùng List Comprehension [x for x in lst if condition] giúp lọc dữ liệu ngắn gọn và tối ưu.",
        "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong các bài toán xử lý dữ liệu backend hoặc phân tích (như lọc danh sách đơn hàng đã thanh toán, chọn ra các giao dịch hợp lệ, tìm user active), kỹ năng duyệt và lọc danh sách (Filter List) là nền tảng cốt lõi được sử dụng mỗi ngày.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **List Comprehension** | Cú pháp viết ngắn gọn để tạo danh sách mới từ danh sách có sẵn dựa trên điều kiện lọc. | Như một chiếc rây lọc cát: chỉ những hạt thỏa mãn kích thước yêu cầu mới rơi xuống khay chứa mới. |

## 2. Cú pháp & Vận hành
Để lọc các phần tử thỏa mãn điều kiện trong Python bằng List Comprehension:

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = [x for x in numbers if x % 2 == 0]
print(evens)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `numbers = [1, 2, 3, 4, 5, 6]` | `numbers`: List 6 phần tử | Khởi tạo mảng động các số nguyên trong RAM Heap |
| 2 | `evens = [x for x in numbers if x % 2 == 0]` | `evens: [2, 4, 6]` | Duyệt tuần tự `x`, kiểm tra chia hết cho 2 và nạp vào list mới |
| 3 | `print(evens)` | `evens: [2, 4, 6]` | In danh sách kết quả ra console: `[2, 4, 6]` |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
numbers   ──────────────────► [ 1, 2, 3, 4, 5, 6 ]
evens     ──────────────────► [ 2, 4, 6 ] (Danh sách mới độc lập)
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Xóa phần tử trực tiếp khi đang duyệt**: `for x in numbers: numbers.remove(x)` ➔ Làm trượt chỉ mục (Index Shifting) dẫn đến sót phần tử.
> * **Không xử lý danh sách rỗng**: Khi input là `[]`, phải trả về `[]` an toàn chứ không được gây lỗi.

> [!TIP]
> List Comprehension chạy ở tầng CPython nên có tốc độ nhanh hơn từ 25% đến 40% so với vòng lặp `for` kết hợp `list.append()`.

## 4. Đúc kết & Đi tiếp
* List Comprehension là công cụ kinh điển của Python giúp mã nguồn ngắn gọn, dễ đọc và hiệu năng cao.
* Luôn tạo một danh sách mới độc lập thay vì sửa đổi trực tiếp trên danh sách gốc đang duyệt.
* Hãy bắt đầu giải bài tập thực hành lọc danh sách ngay dưới đây!
""",
        "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `filter_even_numbers(numbers)`.
Nhận vào một danh sách các số nguyên và trả về danh sách mới chỉ chứa các số chẵn theo đúng thứ tự ban đầu.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `numbers`: Danh sách các số nguyên (`list[int]`), ví dụ: `[1, 2, 3, 4, 5, 6]`.

### 📤 Dữ Liệu Đầu Ra (Output)
- Danh sách mới (`list[int]`) chỉ chứa các số chẵn. Nếu không có số chẵn nào hoặc danh sách ban đầu rỗng, trả về `[]`.

---
### 💡 Ví Dụ Minh Họa
- **Input:** `([1, 2, 3, 4, 5, 6],)` ➔ **Output:** `[2, 4, 6]`
- **Input:** `([1, 3, 5],)` ➔ **Output:** `[]`
- **Input:** `([2, 4, 8, 10],)` ➔ **Output:** `[2, 4, 8, 10]`
""",
        "sample_input": "([1, 2, 3, 4, 5, 6],)",
        "sample_output": "[2, 4, 6]",
        "starter_code": "def filter_even_numbers(numbers):\n    \"\"\"\n    Lọc và trả về danh sách các số chẵn từ danh sách ban đầu.\n    \"\"\"\n    # Viết code lọc số chẵn ở đây\n    pass",
        "reference_solution": "def filter_even_numbers(numbers):\n    return [x for x in numbers if x % 2 == 0]",
        "test_cases": [
            {"input": "([1, 2, 3, 4, 5, 6],)", "expected_output": "[2, 4, 6]", "is_hidden": False},
            {"input": "([1, 3, 5],)", "expected_output": "[]", "is_hidden": False},
            {"input": "([2, 4, 8, 10],)", "expected_output": "[2, 4, 8, 10]", "is_hidden": True}
        ],
        "common_pitfall_warning": "Tránh xóa trực tiếp phần tử trong list khi đang duyệt vòng lặp for.",
        "difficulty_stars": 1 if is_easier else 2
    }

def branch_2(concept_id, concept_name, errors, is_easier, language="PYTHON"):
    cid = concept_id.upper()
    lang = (language or "PYTHON").upper()
    return {
        "title": "Trích Xuất Tên Miền Email Bằng Xử Lý Chuỗi" if not is_easier else "Tách Chuỗi Với Ký Tự Phân Tách",
        "concept_id": concept_id,
        "concept_name": concept_name,
        "quick_theory": "Phương thức str.split(delimiter) chia chuỗi thành danh sách các chuỗi con dựa trên ký tự phân tách.",
        "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong các hệ thống phân tích dữ liệu, xử lý file log, hoặc bóc tách thông tin người dùng từ form đăng ký, chuỗi ký tự (String) là định dạng phổ biến nhất. Kỹ thuật tách chuỗi (`str.split()`) và kiểm tra sự tồn tại của ký tự phân cách giúp hệ thống trích xuất dữ liệu chính xác và không bao giờ bị dừng đột ngột.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **str.split(sep)** | Cắt một chuỗi thành danh sách các chuỗi con tại vị trí xuất hiện ký tự phân tách. | Như dùng kéo cắt dải ruy-băng tại các vạch đánh dấu đã định sẵn. |

## 2. Cú pháp & Vận hành
Để trích xuất an toàn phần tên miền từ địa chỉ email:

```python
email = "student@codehub.edu.vn"
domain = email.split('@')[-1] if '@' in email else ''
print(domain)
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `email = "student@codehub.edu.vn"` | `email: "student@codehub..."` | Lưu chuỗi ký tự bất biến (Immutable String) vào Heap |
| 2 | `domain = email.split('@')[-1]...` | `domain: "codehub.edu.vn"` | Kiểm tra có ký tự '@', tách thành 2 mảnh và lấy mảnh cuối |
| 3 | `print(domain)` | `domain: "codehub.edu.vn"` | In kết quả tên miền ra màn hình console |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
email     ──────────────────► "student@codehub.edu.vn"
domain    ──────────────────► "codehub.edu.vn"
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Truy xuất trực tiếp `split('@')[1]`**: Nếu chuỗi không có ký tự `@`, lệnh sẽ ném lỗi `IndexError` và làm sập server!
> * **Chuỗi là bất biến (Immutable)**: Mọi thao tác trên chuỗi đều trả về chuỗi mới, không thể gán `str[0] = 'a'`.

> [!TIP]
> Sử dụng chỉ mục âm `[-1]` kết hợp toán tử điều kiện `if '@' in email else ''` giúp mã nguồn đạt chuẩn phòng thủ Zero-Crash.

## 4. Đúc kết & Đi tiếp
* Luôn kiểm tra sự tồn tại của ký tự phân cách trước khi truy xuất chỉ số sau khi cắt chuỗi.
* Trả về chuỗi rỗng `""` thay vì để ngoại lệ `IndexError` phát sinh không kiểm soát.
* Hãy tiến hành thực hành bài tập tách tên miền bên dưới!
""",
        "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết hàm `extract_domain(email)`.
Nhận vào một chuỗi email dạng `'user@domain.com'` và trả về phần tên miền (domain) phía sau ký tự `'@'`. Nếu không có ký tự `'@'` trong chuỗi, trả về chuỗi rỗng `""`.

---
### 📥 Dữ Liệu Đầu Vào (Input)
- `email`: Chuỗi ký tự biểu diễn email (`str`).

### 📤 Dữ Liệu Đầu Ra (Output)
- Chuỗi tên miền (`str`) hoặc chuỗi rỗng `""`.

---
### 💡 Ví Dụ Minh Họa
- **Input:** `('student@codehub.edu.vn',)` ➔ **Output:** `codehub.edu.vn`
- **Input:** `('invalid_email',)` ➔ **Output:** `""`
""",
        "sample_input": "('student@codehub.edu.vn',)",
        "sample_output": "codehub.edu.vn",
        "starter_code": "def extract_domain(email):\n    \"\"\"\n    Trích xuất domain từ email.\n    \"\"\"\n    # Tách và lấy phần domain\n    pass",
        "reference_solution": "def extract_domain(email):\n    return email.split('@')[-1] if '@' in email else ''",
        "test_cases": [
            {"input": "('student@codehub.edu.vn',)", "expected_output": "codehub.edu.vn", "is_hidden": False},
            {"input": "('admin@python.org',)", "expected_output": "python.org", "is_hidden": False},
            {"input": "('invalid_email',)", "expected_output": "", "is_hidden": True}
        ],
        "common_pitfall_warning": "Nếu chuỗi không chứa ký tự phân cách, truy xuất chỉ số có thể ném ra IndexError.",
        "difficulty_stars": 1 if is_easier else 2
    }
