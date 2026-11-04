from typing import Dict, Any

from .json_support import generate_json_content, extract_json_from_llm


class LegacyExplanationMixin:

    def _generate_concept_explanation(self, concept: Dict[str, Any], language: str, user_msg: str) -> str:
        """Biên soạn bài giảng chi tiết, chuẩn sư phạm cho concept và ngôn ngữ được yêu cầu"""
        concept_name = concept.get("concept_name", "Khái niệm Lập trình")
        concept_id = concept.get("concept_id") or concept.get("id", "")
        lang = (language or "PYTHON").upper()

        # 1. Thử gọi LLM sinh bài giảng chất lượng cao
        system_prompt = f"""Bạn là Giáo sư Khoa học Máy tính & Giảng viên Cao cấp Lập trình {lang}.
Nhiệm vụ: Soạn một bài giảng lý thuyết chuẩn mực, trực quan, chuyên sâu nhưng dễ hiểu cho học viên về:
Chủ đề: {concept_name} (Mã: {concept_id})
Ngôn ngữ: {lang}

Yêu cầu định dạng Markdown gồm 5 phần chuẩn sư phạm:
## 1. 💡 Tổng Quan & Bản Chất Vấn Đề
- Đặt vấn đề trong thế giới thực và lý do tại sao phải dùng {concept_name}.
- Bảng phân tích thuật ngữ cốt lõi (Thuật ngữ | Định nghĩa | Ý nghĩa thực tế).

## 2. 🏛️ Các Đặc Tính / Nguyên Lý Cốt Lõi
- Phân tích chi tiết các nguyên lý nền tảng (ví dụ với OOP C++: Đóng gói Encapsulation, Kế thừa Inheritance, Đa hình Polymorphism, Trừu tượng Abstraction).

## 3. 💻 Cú Pháp & Ví Dụ Minh Họa Code Thực Chiến ({lang})
- Đoạn mã nguồn hoàn chỉnh, viết đẹp chuẩn {lang} hiện đại (có chú thích rõ ràng).
- Bảng giải thích chi tiết hoạt động của từng dòng lệnh quan trọng.

## 4. ⚠️ Bẫy Lỗi Thường Gặp & Lưu Ý Sống Còn
- Cảnh báo ít nhất 2 lỗi kinh điển khi lập trình {lang} với chủ đề này (ví dụ: memory leak, dangling pointer, undefined behavior...).

## 5. 🎯 Đúc Kết & Thử Thách Vận Dụng
- 3 gạch đầu dòng then chốt.
- 1 câu hỏi/thử thách nhỏ để học viên tự luyện tập.
"""
        try:
            raw = generate_json_content(f"Yêu cầu từ học viên: '{user_msg}'. Hãy biên soạn bài giảng chi tiết.", system_prompt)
            if raw and len(raw.strip()) > 200:
                raw_str = raw.strip()
                if raw_str.startswith("{"):
                    try:
                        parsed = extract_json_from_llm(raw_str)
                        if isinstance(parsed, dict):
                            md_lines = []
                            if "title" in parsed:
                                md_lines.append(f"# 📖 {parsed['title']}\n")
                            for k, v in parsed.items():
                                if k in ["title", "course_code"]:
                                    continue
                                header_name = k.replace("_", " ").title()
                                if isinstance(v, str):
                                    md_lines.append(f"## {header_name}\n{v}\n")
                                elif isinstance(v, dict):
                                    md_lines.append(f"## {header_name}")
                                    for sk, sv in v.items():
                                        sub_title = sk.replace("_", " ").title()
                                        if isinstance(sv, str):
                                            md_lines.append(f"### {sub_title}\n{sv}\n")
                                        elif isinstance(sv, list):
                                            md_lines.append(f"### {sub_title}")
                                            for itm in sv:
                                                if isinstance(itm, dict):
                                                    md_lines.append("- " + ", ".join(f"**{ik}**: {iv}" for ik, iv in itm.items()))
                                                else:
                                                    md_lines.append(f"- {itm}")
                                            md_lines.append("")
                            if md_lines:
                                return "\n".join(md_lines)
                    except Exception:
                        pass
                return raw_str
        except Exception as e:
            print(f"[_generate_concept_explanation LLM Error]: {e}")

        # 2. Fallback chất lượng cao cho C++ OOP nếu LLM chưa phản hồi
        if lang in ["CPP", "C++"] and ("OOP" in concept_id or "STRUCT" in concept_id or "oop" in concept_name.lower()):
            return """## 1. 💡 Tổng Quan & Bản Chất Vấn Đề
Trong kỹ nghệ phần mềm C++, **Lập trình Hướng Đối Tượng (Object-Oriented Programming - OOP)** là phương pháp luận mô hình hóa thế giới thực thành các **Đối tượng (Objects)** gồm hai thành phần cốt lõi:
- **Thuộc tính (State / Attributes):** Dữ liệu lưu trữ trạng thái của đối tượng.
- **Hành vi (Behavior / Methods):** Các hàm thao tác trên dữ liệu đó.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ thực tế |
| :--- | :--- | :--- |
| **Class (Lớp)** | Bản thiết kế (Blueprint) định nghĩa cấu trúc dữ liệu và hành vi. | Bản vẽ kỹ thuật của một chiếc ô tô. |
| **Object (Đối tượng)** | Thực thể cụ thể (Instance) được cấp phát bộ nhớ từ Class. | Chiếc xe hơi Toyota lăn bánh trên đường. |
| **Encapsulation** | Đóng gói dữ liệu và ẩn giấu chi tiết cài đặt qua `private`. | Vỏ động cơ xe hơi: người lái chỉ đạp ga chứ không sờ trực tiếp buồng đốt. |

---

## 2. 🏛️ 4 Trụ Cột Cốt Lõi Của OOP Trong C++
1. **Tính Đóng Gói (Encapsulation):** Bảo vệ dữ liệu bằng các phạm vi truy cập (`private`, `protected`, `public`), chỉ cho phép thay đổi qua Getter/Setter hợp lệ.
2. **Tính Trừu Tượng (Abstraction):** Ẩn giấu sự phức tạp của hệ thống, chỉ cung cấp giao diện (Interface / Pure Virtual Function `= 0`) cho bên ngoài.
3. **Tính Kế Thừa (Inheritance):** Tái sử dụng mã nguồn, cho phép lớp con kế thừa thuộc tính và phương thức của lớp cha (`class Car : public Vehicle`).
4. **Tính Đa Hình (Polymorphism):** Cùng một thông điệp (hàm) nhưng các đối tượng thuộc lớp khác nhau sẽ phản ứng khác nhau qua cơ chế `virtual` và `override`.

---

## 3. 💻 Cú Pháp & Code Minh Họa Thực Chiến (C++17/20)
```cpp
#include <iostream>
#include <string>
#include <memory>
#include <vector>

// 1. Base Class: Lớp trừu tượng (Interface)
class Employee {
private:
    std::string name;
    int id;

protected:
    double baseSalary;

public:
    Employee(std::string empName, int empId, double salary)
        : name(std::move(empName)), id(empId), baseSalary(salary) {}

    virtual ~Employee() = default; // QUAN TRỌNG: Virtual Destructor chống Memory Leak

    // Pure Virtual Function -> Tính Trừu tượng & Đa hình
    virtual double calculateBonus() const = 0;

    void displayInfo() const {
        std::cout << "[" << id << "] " << name << " - Luong CB: " << baseSalary << " USD\n";
    }
};

// 2. Derived Class: Lớp con kế thừa
class SoftwareEngineer : public Employee {
private:
    int bugsFixed;

public:
    SoftwareEngineer(std::string name, int id, double salary, int bugs)
        : Employee(std::move(name), id, salary), bugsFixed(bugs) {}

    // Ghi đè phương thức đa hình với override
    double calculateBonus() const override {
        return baseSalary * 0.15 + (bugsFixed * 10.0);
    }
};

int main() {
    // Sử dụng Smart Pointer std::unique_ptr (RAII) để quản lý bộ nhớ an toàn
    std::vector<std::unique_ptr<Employee>> team;
    team.push_back(std::make_unique<SoftwareEngineer>("Nguyen Van A", 101, 2000.0, 45));

    for (const auto& member : team) {
        member->displayInfo();
        std::cout << "=> Thuong cuoi nam: " << member->calculateBonus() << " USD\n";
    }

    return 0;
}
```

---

## 4. ⚠️ Bẫy Lỗi Thường Gặp Trong C++ OOP
> [!WARNING]
> **1. Quên khai báo Virtual Destructor (`virtual ~Base()`)**:
> Khi xóa đối tượng lớp con thông qua con trỏ lớp cha (`delete basePtr`), nếu destructor không phải là `virtual`, destructor của lớp con sẽ KHÔNG được gọi ➔ Gây rò rỉ bộ nhớ nghiêm trọng (Memory Leak)!

> [!WARNING]
> **2. Hiện tượng Cắt gọt Đối tượng (Object Slicing)**:
> Xảy ra khi truyền đối tượng bằng giá trị (Pass-by-value) thay vì truyền bằng tham chiếu (`const Base&`) hoặc con trỏ (`Base*`). Phần dữ liệu riêng của lớp con sẽ bị "cắt gọt" hoàn toàn, làm mất tính đa hình.

---

## 5. 🎯 Đúc Kết & Thử Thách Vận Dụng
* **Quy tắc vàng:** Luôn dùng `virtual` cho Destructor của Base Class và dùng từ khóa `override` ở Derived Class để trình biên dịch phát hiện lỗi sai chữ ký hàm.
* **Thử thách nhỏ:** Hãy thử tạo thêm lớp `ProjectManager` kế thừa từ `Employee` với công thức thưởng là `baseSalary * 0.20 + projectsCompleted * 100.0`."""

        # Fallback chung
        return f"""### 📖 Nội Dung Bài Học: {concept_name} ({lang})

Chào bạn! Khái niệm `{concept_name}` là một trong những mắt xích then chốt trong chương trình lập trình {lang}.

#### 1. Trọng tâm kiến thức:
- Hiểu rõ cú pháp, cách thức khai báo và tổ chức mã nguồn chuẩn của {lang}.
- Tối ưu hóa cách cấp phát bộ nhớ và luồng thực thi.
- Phòng tránh các bẫy lỗi biên dịch và lỗi thời gian chạy (Runtime Error).

Bạn muốn mình tạo một bài tập thực hành thích ứng về `{concept_name}` để bạn bắt tay vào gõ code ngay không?"""
