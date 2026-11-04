
def branch_5(concept_id, concept_name, errors, is_easier, language="PYTHON"):
    cid = concept_id.upper()
    lang = (language or "PYTHON").upper()
    return {
        "title": "Xây Dựng Class Student & Quản Lý Điểm Số",
        "concept_id": concept_id,
        "concept_name": concept_name,
        "quick_theory": "Class là bản thiết kế đối tượng, hàm __init__(self, ...) khởi tạo thuộc tính khi tạo instance.",
        "detailed_theory": """## 1. Khái niệm & Vấn đề
Trong lập trình hướng đối tượng (OOP), Class giống như một bản thiết kế (blueprint) của ngôi nhà, còn Object là ngôi nhà thực tế được xây dựng từ bản thiết kế đó. Hàm khởi tạo `__init__` cùng tham số `self` giúp gán các thuộc tính riêng biệt cho từng đối tượng.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **Class** | Bản thiết kế định nghĩa các thuộc tính và hành vi của đối tượng. | Khuôn đúc bánh kẹo trong dây chuyền sản xuất. |
| **Object (Instance)** | Thực thể cụ thể được tạo ra từ Class mang dữ liệu riêng biệt. | Chiếc bánh được đúc ra từ chiếc khuôn mẫu. |
| **self & __init__** | Đại diện cho chính thực thể đang được khởi tạo để gán giá trị thuộc tính. | Chiếc thẻ căn cước gắn trực tiếp lên người mỗi nhân viên. |

## 2. Cú pháp & Vận hành
Khai báo Class `Student` với hàm khởi tạo và phương thức tính xếp loại:

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score
        
    def get_rank(self):
        return "Xuat Sac" if self.score >= 9.0 else "Dat"

s = Student("Hoang", 9.5)
print(s.get_rank())
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `class Student:` | `Student`: Class Type | Nạp định nghĩa lớp vào namespace bộ nhớ |
| 2 | `s = Student("Hoang", 9.5)` | `s`: Instance Student | Cấp phát vùng nhớ Heap cho đối tượng, chạy `__init__` gán name, score |
| 3 | `print(s.get_rank())` | `"Xuat Sac"` | Gọi method `get_rank` trên thực thể `s` và in kết quả |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
s         ──────────────────► Student Object:
                              ├── name: "Hoang"
                              └── score: 9.5
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Quên tham số `self`**: Trong method của Class, tham số đầu tiên bắt buộc phải là `self`.
> * **Viết sai tên hàm khởi tạo**: Viết thành `_init_` (1 dấu gạch dưới) thay vì `__init__` (2 dấu gạch dưới).

> [!TIP]
> Luôn đặt tên Class theo chuẩn **PascalCase** (ví dụ: `StudentProfile`, `BankAccount`) và tên hàm/phương thức theo chuẩn **snake_case**.

## 4. Đúc kết & Đi tiếp
* Class đóng gói dữ liệu và hành vi giúp code sạch sẽ, dễ mở rộng và tái sử dụng.
* Hãy bắt tay vào thực hành xây dựng Class ngay bên dưới!
""",
        "problem_statement": """### 📌 Yêu Cầu Đề Bài
Viết Class `Student` gồm:
- Hàm khởi tạo `__init__(self, name, score)` lưu trữ `name` (`str`) và `score` (`float` hoặc `int`).
- Phương thức `get_rank(self)` trả về chuỗi:
  - `"Xuat Sac"` nếu `score >= 9.0`
  - `"Gioi"` nếu `score >= 8.0` và `< 9.0`
  - `"Kha"` nếu `score >= 6.5` và `< 8.0`
  - `"Trung Binh"` nếu `score < 6.5`

---
### 📥 Dữ Liệu Đầu Vào (Input)
- Khởi tạo đối tượng `Student(name, score)`.

### 📤 Dữ Liệu Đầu Ra (Output)
- Kết quả của lời gọi phương thức `student.get_rank()`.

---
### 💡 Ví Dụ Minh Họa
- **Code gọi:** `s = Student("An", 9.2); print(s.get_rank())` ➔ **Output:** `"Xuat Sac"`
- **Code gọi:** `s = Student("Binh", 7.5); print(s.get_rank())` ➔ **Output:** `"Kha"`
""",
        "sample_input": "s = Student('An', 9.2); print(s.get_rank())",
        "sample_output": "Xuat Sac",
        "starter_code": "class Student:\n    def __init__(self, name, score):\n        # Khởi tạo thuộc tính\n        pass\n        \n    def get_rank(self):\n        # Trả về xếp loại\n        pass",
        "reference_solution": "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n        \n    def get_rank(self):\n        if self.score >= 9.0:\n            return 'Xuat Sac'\n        elif self.score >= 8.0:\n            return 'Gioi'\n        elif self.score >= 6.5:\n            return 'Kha'\n        return 'Trung Binh'",
        "test_cases": [
            {"input": "s = Student('An', 9.2); print(s.get_rank())", "expected_output": "Xuat Sac", "is_hidden": False},
            {"input": "s = Student('Binh', 7.5); print(s.get_rank())", "expected_output": "Kha", "is_hidden": False},
            {"input": "s = Student('Cuong', 5.0); print(s.get_rank())", "expected_output": "Trung Binh", "is_hidden": True}
        ],
        "common_pitfall_warning": "Quên tham số self ở hàm __init__ và các methods.",
        "difficulty_stars": 2
    }

def default_fallback(concept_id, concept_name, errors, is_easier, language="PYTHON"):
    cid = concept_id.upper()
    lang = (language or "PYTHON").upper()
    return {
        "title": f"Thực Hành Chuyên Sâu: {concept_name}",
        "concept_id": concept_id,
        "concept_name": concept_name,
        "quick_theory": f"Nắm vững nguyên lý cốt lõi của {concept_name} trong Python.",
        "detailed_theory": f"""## 1. Khái niệm & Vấn đề
Trong hệ thống phần mềm, kỹ năng **{concept_name}** đóng vai trò thiết yếu giúp xử lý nghiệp vụ chính xác, an toàn và tối ưu tài nguyên.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **{concept_name}** | Thành phần kỹ thuật cốt lõi trong ngôn ngữ Python. | Như công cụ chuyên dụng trong bộ đồ nghề của kỹ sư phần mềm. |

## 2. Cú pháp & Vận hành
Triển khai giải thuật xử lý:

```python
def process_data(items):
    return [x for x in items if x]

print(process_data([1, 2, 3]))
```

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | `def process_data` | `process_data`: function | Định nghĩa hàm vào bộ nhớ |
| 2 | `print(...)` | `[1, 2, 3]` | Xử lý dữ liệu và xuất kết quả |

**Trạng thái bộ nhớ RAM:**
```text
[RAM Stack]                       [RAM Heap]
items     ──────────────────► [ 1, 2, 3 ]
```

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> Cần kiểm tra kỹ các trường hợp biên và ngoại lệ trước khi truy xuất dữ liệu.

> [!TIP]
> Luôn giữ code chuẩn **PEP 8** và viết giải thuật rõ ràng, tối ưu thời gian thực thi.

## 4. Đúc kết & Đi tiếp
* Nắm chắc cú pháp và thực hành kiểm thử với nhiều kịch bản khác nhau.
""",
        "problem_statement": f"### 📌 Yêu Cầu Đề Bài\nViết giải thuật xử lý dữ liệu cho bài toán **{concept_name}**.",
        "sample_input": "([1, 2, 3],)",
        "sample_output": "[1, 2, 3]",
        "starter_code": "def process_data(items):\n    # Viết logic xử lý\n    pass",
        "reference_solution": "def process_data(items):\n    return [x for x in items if x]",
        "test_cases": [
            {"input": "([1, 2, 3],)", "expected_output": "[1, 2, 3]", "is_hidden": False},
            {"input": "([],)", "expected_output": "[]", "is_hidden": True}
        ],
        "common_pitfall_warning": "Chú ý kiểu dữ liệu và giá trị biên.",
        "difficulty_stars": 1
    }
