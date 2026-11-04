
def cpp_fallback(concept_id, concept_name, errors, is_easier, language="PYTHON"):
    cid = concept_id.upper()
    lang = (language or "PYTHON").upper()
    return {
        "title": "Hệ Thống Quản Lý Tài Khoản Ngân Hàng (C++ Bank Account OOP)" if not is_easier else "Khởi Tạo Lớp Đối Tượng Cơ Bản C++",
        "concept_id": concept_id,
        "concept_name": concept_name,
        "quick_theory": "Sử dụng Class, Access Specifiers (public/private), Constructor để đóng gói dữ liệu an toàn trong C++.",
        "detailed_theory": """## 1. Khái niệm & Vấn đề\nLập trình hướng đối tượng (OOP) trong C++ giúp mô hình hóa thực thể với thuộc tính private và phương thức public.\n\n## 2. Cú pháp & Vận hành\n```cpp\nclass BankAccount {\nprivate:\n    double balance;\npublic:\n    BankAccount(double init) : balance(init) {}\n    void deposit(double m) { balance += m; }\n    double getBalance() const { return balance; }\n};\n```\n\n## 3. Lỗi thường gặp\n> [!WARNING]\n> Không để thuộc tính trạng thái ở phạm vi public!\n\n## 4. Đúc kết\n* Luôn dùng constructor để khởi tạo giá trị ban đầu.""",
        "problem_statement": """### 📌 Yêu Cầu Đề Bài\nĐịnh nghĩa class `BankAccount` với thuộc tính private `balance` (số dư) và các phương thức `deposit(double amount)`, `withdraw(double amount)`, `getBalance()`.\n\n---\n### 📥 Dữ Liệu Đầu Vào\n- Lệnh thao tác nạp/rút tiền.\n\n### 📤 Dữ Liệu Đầu Ra\n- Số dư tài khoản sau thao tác.""",
        "sample_input": "deposit 100, withdraw 30",
        "sample_output": "70",
        "starter_code": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass BankAccount {\nprivate:\n    double balance;\npublic:\n    BankAccount(double initialBalance = 0.0) : balance(initialBalance) {}\n    \n    void deposit(double amount) {\n        // Viết mã nạp tiền\n    }\n    \n    bool withdraw(double amount) {\n        // Viết mã rút tiền\n        return false;\n    }\n    \n    double getBalance() const {\n        return balance;\n    }\n};\n",
        "reference_solution": "#include <iostream>\nusing namespace std;\nclass BankAccount {\nprivate:\n    double balance;\npublic:\n    BankAccount(double initialBalance = 0.0) : balance(initialBalance) {}\n    void deposit(double amount) { balance += amount; }\n    bool withdraw(double amount) { if(amount <= balance) { balance -= amount; return true; } return false; }\n    double getBalance() const { return balance; }\n};\n",
        "test_cases": [
            {"input": "100 deposit, 30 withdraw", "expected_output": "70", "is_hidden": False, "explanation": "Rút tiền hợp lệ"},
            {"input": "50 deposit, 100 withdraw", "expected_output": "50", "is_hidden": True, "explanation": "Rút vượt số dư thất bại"}
        ],
        "common_pitfall_warning": "Không được để thuộc tính balance ở phạm vi public; luôn kiểm tra điều kiện rút tiền để tránh số dư âm.",
        "difficulty_stars": 1 if is_easier else 2
    }
