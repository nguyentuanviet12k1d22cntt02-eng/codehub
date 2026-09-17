import sys
from js_seeder_helper import save_and_seed_lessons

sys.stdout.reconfigure(encoding='utf-8')

lessons = [
    # ========================================================
    # MODULE 1: Làm quen với JavaScript & Khai báo biến
    # ========================================================
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-01",
        "chapter_id": "JS1-CH-01",
        "module_folder": "Module 01",
        "filename": "Lesson_01_01.md",
        "lesson_id": "JS1-01.01",
        "title": "Bài 1.1: Lịch sử JavaScript, ECMAScript & Môi trường thực thi",
        "objective": "Hiểu nguồn gốc JavaScript, vai trò của chuẩn ECMAScript và cách thực thi mã JS thuần trên runtime Node.js/V8.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS1-01.01
title: "Lịch sử JavaScript, ECMAScript & Môi trường thực thi"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["JavaScript", "ECMAScript", "V8 Engine", "Node.js", "Runtime"]
prerequisites: []
---

# Lịch sử JavaScript, ECMAScript & Môi trường thực thi

## 1. Khái niệm & Vấn đề thực tế
Năm 1995, Brendan Eich tạo ra JavaScript trong 10 ngày tại Netscape. Ban đầu chỉ là ngôn ngữ kịch bản chạy trong trình duyệt, ngày nay JavaScript là một trong những ngôn ngữ phổ biến nhất thế giới nhờ chuẩn hóa **ECMAScript (ES)** và các công cụ thực thi hiện đại như Google V8 Engine và Node.js.

Trong khóa học này, chúng ta tiếp cận JavaScript dưới góc độ **ngôn ngữ lập trình thuần túy (Vanilla JS)**: học tư duy thuật toán, cấu trúc dữ liệu và cú pháp lõi độc lập, không phụ thuộc vào giao diện web HTML/DOM hay framework bên ngoài.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **ECMAScript**: Bản đặc tả kỹ thuật tiêu chuẩn (ES5, ES6/ES2015, ES2020,...).
- **JavaScript Engine**: Bộ máy biên dịch JIT (Just-In-Time) mã JS sang mã máy (V8 trên Chrome/Node.js, SpiderMonkey trên Firefox).
- **Môi trường Console/Sandbox**: Mã lệnh được chạy tuần tự từ trên xuống dưới, kết quả xuất ra luồng đầu ra tiêu chuẩn (`stdout`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// In dòng thông báo đầu tiên ra màn hình console
console.log("Xin chào lập trình viên JavaScript!");
console.log(2026);
```

- Dòng 1: Chú thích bắt đầu bằng `//` giải thích mục đích mã.
- Dòng 2: Gọi phương thức `console.log()` để in chuỗi ký tự ra màn hình.
- Dòng 3: In trực tiếp một hằng số nguyên ra console.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Nhầm lẫn Java và JavaScript**: Java và JavaScript là hai ngôn ngữ hoàn toàn khác biệt về cú pháp, triết lý và hệ thống kiểu dữ liệu.
- **Bỏ quên môi trường thực thi**: JavaScript là ngôn ngữ phân biệt chữ hoa/thường (`console.log` khác `Console.log`). Viết sai hoa thường sẽ gây lỗi `ReferenceError`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. JavaScript được chuẩn hóa bởi tổ chức ECMA quốc tế (tiêu chuẩn ECMAScript).
2. Mã JS được thực thi bởi JavaScript Engine (như V8) thông qua cơ chế JIT Compiler.
3. Hàm cơ bản nhất để xuất dữ liệu trong JS thuần là `console.log()`.
""",
        "exercise": {
            "title": "In thông điệp chào mừng JavaScript 2026",
            "difficulty": "EASY",
            "problem_description": """### Yêu cầu
Viết chương trình JavaScript sử dụng hàm `console.log()` để in chính xác 2 dòng thông điệp ra màn hình console.
Chương trình bắt buộc phải có ít nhất 1 dòng chú thích (sử dụng `//` hoặc `/* ... */`).

### Ví dụ
**Output**
```text
MCODE - JavaScript Foundations
Năm học: 2026
```

<!-- CONSTRAINTS: {"requireComment":true,"requiredKeywords":["console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng console.log() và có ít nhất 1 dòng chú thích //."} -->""",
            "starterCode": """// Viết mã JavaScript của bạn bên dưới
// Gợi ý: Dùng console.log(...) để in từng dòng theo yêu cầu đề bài

""",
            "solutionCode": """// In thông điệp chào mừng khóa học
console.log("MCODE - JavaScript Foundations");
console.log("Năm học: 2026");
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "MCODE - JavaScript Foundations\nNăm học: 2026",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Mối quan hệ giữa JavaScript và ECMAScript là gì?",
            "explanation": "ECMAScript là bản đặc tả kỹ thuật tiêu chuẩn quốc tế (specification), còn JavaScript là ngôn ngữ lập trình cụ thể tuân thủ và triển khai (implementation) theo bản đặc tả đó.",
            "options": [
                {"key": "A", "text": "ECMAScript là một thư viện được viết bằng JavaScript.", "is_correct": False},
                {"key": "B", "text": "ECMAScript là bản đặc tả tiêu chuẩn, còn JavaScript là ngôn ngữ triển khai chuẩn đó.", "is_correct": True},
                {"key": "C", "text": "JavaScript là bản đặc tả, còn ECMAScript là trình thông dịch V8.", "is_correct": False},
                {"key": "D", "text": "ECMAScript và JavaScript là hai ngôn ngữ hoàn toàn khác nhau do hai công ty cạnh tranh tạo ra.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-01",
        "chapter_id": "JS1-CH-01",
        "module_folder": "Module 01",
        "filename": "Lesson_01_02.md",
        "lesson_id": "JS1-01.02",
        "title": "Bài 1.2: Cú pháp câu lệnh, dấu chấm phẩy & Chú thích (Comments)",
        "objective": "Nắm vững quy tắc cấu trúc câu lệnh, cơ chế chèn dấu chấm phẩy tự động (ASI) và cách viết chú thích chuyên nghiệp.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS1-01.02
title: "Cú pháp câu lệnh, dấu chấm phẩy & Chú thích (Comments)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Semicolon", "ASI", "Single-line comment", "Multi-line comment", "Clean code"]
prerequisites: ["JS1-01.01"]
---

# Cú pháp câu lệnh, dấu chấm phẩy & Chú thích (Comments)

## 1. Khái niệm & Vấn đề thực tế
Một chương trình JavaScript là tập hợp các câu lệnh (statements). JavaScript hỗ trợ cơ chế **Automatic Semicolon Insertion (ASI)** – tự động chèn dấu chấm phẩy khi xuống dòng. Tuy nhiên, việc hiểu sai về ASI có thể dẫn đến các lỗi logic rất khó phát hiện (ví dụ lệnh `return` bị xuống dòng).

Do đó, tiêu chuẩn viết code hiện đại khuyến nghị người học lập trình nên chủ động thêm dấu chấm phẩy `;` rõ ràng ở cuối mỗi câu lệnh.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Chú thích 1 dòng**: Sử dụng `//` (bỏ qua mọi ký tự từ `//` đến hết dòng).
- **Chú thích nhiều dòng**: Sử dụng cặp ký hiệu `/* ... */`.
- **Dấu chấm phẩy `;`**: Ngăn cách giữa các câu lệnh thực thi độc lập.

```javascript
// Đây là chú thích một dòng
/*
   Đây là chú thích
   nhiều dòng (Block comment)
*/
const PI = 3.14159; // Kết thúc câu lệnh bằng dấu chấm phẩy
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// 1. Khởi tạo giá trị
const a = 10;
const b = 20;

// 2. Tính toán và in kết quả
const sum = a + b;
console.log("Tổng là:", sum);
```

- Dòng 2 & 3: Khai báo hai hằng số và kết thúc bằng dấu chấm phẩy rõ ràng.
- Dòng 6: Biểu thức tính toán kết hợp gán giá trị vào biến `sum`.
- Dòng 7: Xuất chuỗi nhãn kèm biến ra màn hình console.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Cạm bẫy ASI với return**:
  ```javascript
  // LỖI NGUY HIỂM DO ASI:
  return
  { name: "JS" };
  // Trình thông dịch tự hiểu thành: return; (trả về undefined)
  ```
- **Lồng chú thích nhiều dòng**: JavaScript **không** cho phép lồng `/* /* */ */`. Gặp dấu `*/` đầu tiên, khối chú thích sẽ kết thúc ngay lập tức.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `//` cho chú thích ngắn một dòng, `/* ... */` cho mô tả tài liệu nhiều dòng.
2. Luôn chủ động đặt dấu `;` ở cuối các câu lệnh để đảm bảo mã nguồn an toàn tuyệt đối.
""",
        "exercise": {
            "title": "Viết chú thích chuẩn mực và in khẩu hiệu",
            "difficulty": "EASY",
            "problem_description": """### Yêu cầu
Viết chương trình JavaScript sử dụng hàm `console.log()` và kết thúc các câu lệnh bằng dấu chấm phẩy `;` để in chính xác 3 dòng khẩu hiệu ra màn hình console.
Mã nguồn phải chứa:
1. Ít nhất một chú thích đơn dòng (`//`).
2. Ít nhất một chú thích nhiều dòng (`/* ... */`).

### Ví dụ
**Output**
```text
Cú pháp rõ ràng
Dấu chấm phẩy an toàn
Mã nguồn dễ đọc
```

<!-- CONSTRAINTS: {"requireComment":true,"requiredKeywords":["console.log","/*","*/",";"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng cả chú thích // và /* */ cùng dấu chấm phẩy ; kết thúc lệnh."} -->""",
            "starterCode": """// Viết mã của bạn tại đây
// Chú thích 1 dòng: ...
/*
   Chú thích nhiều dòng: ...
*/

""",
            "solutionCode": """// Chú thích một dòng: Khẩu hiệu học lập trình
/*
   Chú thích nhiều dòng:
   Tuân thủ quy chuẩn mã sạch (Clean Code)
*/
console.log("Cú pháp rõ ràng");
console.log("Dấu chấm phẩy an toàn");
console.log("Mã nguồn dễ đọc");
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "Cú pháp rõ ràng\nDấu chấm phẩy an toàn\nMã nguồn dễ đọc",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Trong JavaScript, điều gì xảy ra nếu bạn viết lệnh return bị xuống dòng như sau:\nreturn\n100;",
            "explanation": "Cơ chế ASI (Automatic Semicolon Insertion) sẽ tự động chèn dấu chấm phẩy ngay sau từ khóa 'return', khiến hàm kết thúc ngay lập tức và trả về giá trị 'undefined'. Dòng '100;' trở thành mã chết không được chạy.",
            "options": [
                {"key": "A", "text": "Hàm vẫn trả về giá trị 100 bình thường.", "is_correct": False},
                {"key": "B", "text": "Trình thông dịch báo lỗi cú pháp SyntaxError ngay lập tức.", "is_correct": False},
                {"key": "C", "text": "Cơ chế ASI chèn dấu chấm phẩy sau return, hàm trả về undefined.", "is_correct": True},
                {"key": "D", "text": "Chương trình sẽ rơi vào vòng lặp vô tận.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-01",
        "chapter_id": "JS1-CH-01",
        "module_folder": "Module 01",
        "filename": "Lesson_01_03.md",
        "lesson_id": "JS1-01.03",
        "title": "Bài 1.3: Khai báo biến với let, const, var & Quy tắc đặt tên",
        "objective": "Làm chủ sự khác biệt giữa let, const và var, quy ước đặt tên CamelCase và nguyên tắc bất biến với const.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS1-01.03
title: "Khai báo biến với let, const, var & Quy tắc đặt tên"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["let", "const", "var", "camelCase", "Biến", "Hằng số"]
prerequisites: ["JS1-01.02"]
---

# Khai báo biến với let, const, var & Quy tắc đặt tên

## 1. Khái niệm & Vấn đề thực tế
Biến là vùng nhớ được đặt tên để lưu trữ dữ liệu trong suốt thời gian chương trình hoạt động. Trước ES6 (2015), JavaScript chỉ có `var` với cơ chế phạm vi hàm (function scope) tiềm ẩn nhiều rủi ro. Từ ES6, `let` và `const` ra đời với phạm vi khối lệnh (block scope), trở thành chuẩn mực bắt buộc cho Modern JavaScript.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`const`**: Dùng để khai báo **hằng số** (giá trị không được gán lại sau khi khởi tạo). Luôn ưu tiên dùng `const` mặc định.
- **`let`**: Dùng để khai báo **biến** khi giá trị cần được thay đổi hoặc tính toán lại (ví dụ biến đếm, tổng tích lũy).
- **`var`**: Cú pháp kế thừa cũ (legacy). Tránh sử dụng trong dự án hiện đại.
- **Quy tắc đặt tên (Identifier Rules)**:
  - Bắt đầu bằng chữ cái (`a-z`, `A-Z`), gạch dưới (`_`) hoặc dấu đô la (`$`).
  - Không bắt đầu bằng chữ số, không chứa khoảng trắng hay ký tự đặc biệt khác.
  - Phân biệt hoa thường (`total` khác `Total`).
  - Sử dụng chuẩn quy ước **camelCase** (ví dụ: `studentName`, `totalPrice`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const courseCode = "JS-BASIC"; // Hằng số: không thể gán lại
let studentCount = 30;          // Biến: có thể thay đổi giá trị

// Cập nhật giá trị cho biến
studentCount = studentCount + 5;

console.log(courseCode);
console.log(studentCount);
```

- Dòng 1: Khai báo hằng số `courseCode` lưu mã khóa học.
- Dòng 2: Khởi tạo biến `studentCount` mang giá trị ban đầu là 30.
- Dòng 5: Cộng thêm 5 học viên vào biến `studentCount`.
- Dòng 7 & 8: In kết quả ra màn hình.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Gán lại giá trị cho `const`**: Sẽ gây lỗi nghiêm trọng `TypeError: Assignment to constant variable`.
- **Khai báo không gán giá trị cho `const`**: Bắt buộc phải khởi tạo giá trị ngay khi khai báo `const a;` -> Lỗi cú pháp.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Nguyên tắc vàng: Mặc định luôn dùng `const`. Chỉ đổi sang `let` khi chắc chắn cần gán lại giá trị.
2. Tuyệt đối không dùng `var` trong các đoạn mã mới.
3. Đặt tên biến theo chuẩn `camelCase`, mang ý nghĩa rõ ràng, tránh đặt tên tối nghĩa như `x`, `y`, `temp`.
""",
        "exercise": {
            "title": "Quản lý thông tin khóa học với const và let",
            "difficulty": "EASY",
            "problem_description": """### Yêu cầu
Thực hiện các thao tác quản lý thông tin lớp học:
1. Dùng từ khóa `const` khai báo hằng số `courseName` có giá trị `"JavaScript Foundations"`.
2. Dùng từ khóa `const` khai báo hằng số `maxStudents` có giá trị `50`.
3. Dùng từ khóa `let` khai báo biến `currentStudents` có giá trị ban đầu là `42`.
4. Cập nhật `currentStudents` bằng cách cộng thêm `5` học viên mới đăng ký (`+= 5` hoặc `+ 5`).
5. In thông tin ra màn hình console trên 3 dòng theo đúng định dạng.

*(Lưu ý: Tuyệt đối không dùng từ khóa `var`).*

### Ví dụ
**Output**
```text
Khóa học: JavaScript Foundations
Sĩ số tối đa: 50
Sĩ số hiện tại: 47
```

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["const","let","courseName","maxStudents","currentStudents"],"forbiddenKeywords":["var"],"customErrorMessage":"Đề bài yêu cầu khai báo đúng các biến courseName, maxStudents (bằng const) và currentStudents (bằng let). Không dùng var."} -->""",
            "starterCode": """// Khai báo hằng số và biến theo yêu cầu đề bài

""",
            "solutionCode": """const courseName = "JavaScript Foundations";
const maxStudents = 50;
let currentStudents = 42;

currentStudents += 5;

console.log("Khóa học:", courseName);
console.log("Sĩ số tối đa:", maxStudents);
console.log("Sĩ số hiện tại:", currentStudents);
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "Khóa học: JavaScript Foundations\nSĩ số tối đa: 50\nSĩ số hiện tại: 47",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Điều gì xảy ra khi bạn cố gắng gán lại giá trị cho một biến được khai báo bằng từ khóa const trong JavaScript?",
            "explanation": "Từ khóa const tạo ra liên kết bất biến (read-only reference). Khi cố gắng gán lại giá trị mới cho biến const, JavaScript Engine sẽ lập tức ném ra lỗi TypeError: Assignment to constant variable.",
            "options": [
                {"key": "A", "text": "Biến tự động chuyển thành let và nhận giá trị mới.", "is_correct": False},
                {"key": "B", "text": "JavaScript Engine ném ra lỗi TypeError: Assignment to constant variable.", "is_correct": True},
                {"key": "C", "text": "Chương trình chạy tiếp nhưng giá trị mới bị bỏ qua không lưu lại.", "is_correct": False},
                {"key": "D", "text": "Giá trị biến chuyển thành undefined.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-01",
        "chapter_id": "JS1-CH-01",
        "module_folder": "Module 01",
        "filename": "Lesson_01_04.md",
        "lesson_id": "JS1-01.04",
        "title": "Bài 1.4: Xuất dữ liệu với console.log() & Ghép chuỗi cơ bản",
        "objective": "Làm chủ hàm console.log với nhiều đối số, toán tử ghép chuỗi + và tính toán biểu thức trực tiếp khi in.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS1-01.04
title: "Xuất dữ liệu với console.log() & Ghép chuỗi cơ bản"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["console.log", "Ghép chuỗi", "Toán tử +", "Concatenation", "Output"]
prerequisites: ["JS1-01.03"]
---

# Xuất dữ liệu với console.log() & Ghép chuỗi cơ bản

## 1. Khái niệm & Vấn đề thực tế
Trong môi trường lập trình không có giao diện đồ họa (console runtime), việc xuất thông tin có cấu trúc, kèm theo nhãn giải thích là thao tác cốt lõi để theo dõi kết quả thực thi và kiểm tra luồng dữ liệu.

JavaScript cung cấp hàm `console.log()` linh hoạt, hỗ trợ in nhiều giá trị đồng thời ngăn cách bởi dấu phẩy hoặc ghép nối chuỗi bằng toán tử cộng `+`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **In nhiều đối số**: `console.log(val1, val2, val3);` -> Tự động thêm một khoảng trắng giữa các giá trị khi in ra màn hình.
- **Toán tử cộng chuỗi `+`**: Khi có ít nhất một toán hạng là chuỗi, JavaScript sẽ ép các toán hạng còn lại về dạng chuỗi và ghép nối lại với nhau.

```javascript
const item = "Bút bi";
const price = 5000;

// Cách 1: Truyền nhiều tham số (tự có khoảng cách)
console.log("Sản phẩm:", item, "- Giá:", price);

// Cách 2: Ghép chuỗi bằng toán tử +
console.log("Giá tiền: " + price + " VNĐ");
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const name = "Lan";
const scoreMath = 9;
const scorePhys = 8;
const total = scoreMath + scorePhys;

console.log("Học sinh:", name);
console.log("Tổng điểm:", total);
```

- Dòng 4: Tính tổng số học giữa hai số 9 và 8 (`total = 17`).
- Dòng 6: In chuỗi `"Học sinh:"` kèm giá trị của biến `name`.
- Dòng 7: In chuỗi `"Tổng điểm:"` kèm kết quả tính toán `17`.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Thứ tự ưu tiên khi vừa cộng số vừa ghép chuỗi**:
  ```javascript
  console.log("Tổng là: " + 5 + 10); // Kết quả: "Tổng là: 510" (do bị ép chuỗi từ trái qua phải)
  console.log("Tổng là: " + (5 + 10)); // Kết quả: "Tổng là: 15" (dùng ngoặc tròn nhóm phép tính)
  ```

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `console.log(a, b)` tự chèn dấu cách ngăn cách giữa `a` và `b`.
2. Khi dùng toán tử `+` để ghép chuỗi kèm biểu thức toán học, luôn bao bọc phép tính số học trong dấu ngoặc tròn `()`.
""",
        "exercise": {
            "title": "In hóa đơn thanh toán sách lập trình",
            "difficulty": "EASY",
            "problem_description": """### Yêu cầu
Khai báo các hằng số bằng từ khóa `const` để quản lý thông tin mua sách:
- `bookTitle = "JavaScript Nang Cao"`
- `unitPrice = 120000`
- `quantity = 3`
- `totalPrice = unitPrice * quantity`

Sử dụng hàm `console.log()` để in thông tin hóa đơn ra màn hình trên 3 dòng theo định dạng mẫu.

### Ví dụ
**Output**
```text
Sách: JavaScript Nang Cao
Số lượng: 3
Tổng tiền: 360000 VNĐ
```

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["console.log","const","bookTitle","unitPrice","quantity"],"forbiddenKeywords":[],"customErrorMessage":"Cần khai báo đúng các hằng số bookTitle, unitPrice, quantity và in tổng tiền."} -->""",
            "starterCode": """// Khai báo thông tin và in hóa đơn thanh toán

""",
            "solutionCode": """const bookTitle = "JavaScript Nang Cao";
const unitPrice = 120000;
const quantity = 3;
const totalPrice = unitPrice * quantity;

console.log("Sách:", bookTitle);
console.log("Số lượng:", quantity);
console.log("Tổng tiền: " + totalPrice + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "Sách: JavaScript Nang Cao\nSố lượng: 3\nTổng tiền: 360000 VNĐ",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Biểu thức sau sẽ in ra kết quả gì trên màn hình console?\nconsole.log(\"Ket qua: \" + 10 + 20);",
            "explanation": "Toán tử '+' có độ ưu tiên từ trái sang phải. Biểu thức 'Ket qua: ' + 10 tạo thành chuỗi 'Ket qua: 10'. Sau đó chuỗi này tiếp tục cộng với số 20 tạo thành chuỗi 'Ket qua: 1020'.",
            "options": [
                {"key": "A", "text": "Ket qua: 30", "is_correct": False},
                {"key": "B", "text": "Ket qua: 10 20", "is_correct": False},
                {"key": "C", "text": "Ket qua: 1020", "is_correct": True},
                {"key": "D", "text": "NaN", "is_correct": False}
            ]
        }
    },

    # ========================================================
    # MODULE 2: Kiểu dữ liệu nguyên thủy & Toán tử
    # ========================================================
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-02",
        "chapter_id": "JS1-CH-02",
        "module_folder": "Module 02",
        "filename": "Lesson_02_01.md",
        "lesson_id": "JS1-02.01",
        "title": "Bài 2.1: Hệ thống kiểu dữ liệu nguyên thủy (Primitive Types) & Toán tử typeof",
        "objective": "Nắm vững 7 kiểu dữ liệu nguyên thủy trong JS, tính năng động (Dynamic Typing) và cách kiểm tra kiểu với typeof.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS1-02.01
title: "Hệ thống kiểu dữ liệu nguyên thủy & Toán tử typeof"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Primitive Types", "typeof", "number", "string", "boolean", "undefined", "null", "bigint", "symbol"]
prerequisites: ["JS1-01.04"]
---

# Hệ thống kiểu dữ liệu nguyên thủy & Toán tử typeof

## 1. Khái niệm & Vấn đề thực tế
JavaScript là ngôn ngữ có hệ thống kiểu động (**Dynamically Typed**): kiểu dữ liệu gắn liền với giá trị tại thời điểm thực thi chứ không gắn cố định vào tên biến.

Trong JavaScript, có **7 kiểu dữ liệu nguyên thủy (Primitive Data Types)**:
1. `number`: Số nguyên và số thực (kèm theo các giá trị đặc biệt như `Infinity`, `-Infinity`, `NaN`).
2. `string`: Chuỗi ký tự.
3. `boolean`: Giá trị đúng/sai (`true` hoặc `false`).
4. `undefined`: Biến đã khai báo nhưng chưa được gán giá trị.
5. `null`: Đại diện cho giá trị rỗng/không tồn tại có chủ đích.
6. `bigint`: Số nguyên có kích thước tùy ý vượt qua ngưỡng an toàn của number ($2^{53} - 1$).
7. `symbol`: Giá trị định danh duy nhất và bất biến.

---

## 2. Cú pháp & Quy tắc cốt lõi
Để kiểm tra kiểu dữ liệu của một giá trị hoặc biến, ta sử dụng toán tử đơn ngôi `typeof`:
```javascript
typeof value;
// hoặc typeof(value);
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
console.log(typeof 42);           // "number"
console.log(typeof "Hello");      // "string"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof 9007199254740995n); // "bigint"
```

- Dòng 1: Số 42 thuộc kiểu `number`.
- Dòng 2: Chuỗi đặt trong ngoặc kép thuộc kiểu `string`.
- Dòng 3: `true` thuộc kiểu `boolean`.
- Dòng 5: Hậu tố `n` biểu thị kiểu `bigint`.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lỗi lịch sử `typeof null === "object"`**: Đây là một bug có từ phiên bản đầu tiên của JavaScript (do biểu diễn nhị phân của tag type). Dù là kiểu nguyên thủy, `typeof null` luôn trả về chuỗi `"object"`. Hãy ghi nhớ kỹ điều này!
- **`NaN` có kiểu là `number`**: `typeof NaN` trả về `"number"` dù NaN viết tắt của "Not a Number".

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. JavaScript có 7 kiểu dữ liệu nguyên thủy.
2. Dùng `typeof` để xác định kiểu dữ liệu của biến hoặc giá trị.
3. Đặc biệt lưu ý: `typeof null` trả về `"object"`.
""",
        "exercise": {
            "title": "Kiểm tra kiểu dữ liệu các định danh",
            "difficulty": "EASY",
            "problem_description": """### Yêu cầu
Khai báo 4 biến sau:
1. `score = 9.5`
2. `subject = "JavaScript"`
3. `isPassed = true`
4. `emptySlot = null`

Sử dụng toán tử `typeof` và hàm `console.log()` để in ra kiểu dữ liệu của từng biến trên 4 dòng theo định dạng: `{tên biến}: {kiểu dữ liệu}`.

### Ví dụ
**Output**
```text
score: number
subject: string
isPassed: boolean
emptySlot: object
```

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["typeof","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng toán tử typeof để in kiểu dữ liệu."} -->""",
            "starterCode": """// Khai báo các biến và in kiểu dữ liệu với typeof

""",
            "solutionCode": """const score = 9.5;
const subject = "JavaScript";
const isPassed = true;
const emptySlot = null;

console.log("score:", typeof score);
console.log("subject:", typeof subject);
console.log("isPassed:", typeof isPassed);
console.log("emptySlot:", typeof emptySlot);
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "score: number\nsubject: string\nisPassed: boolean\nemptySlot: object",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Kết quả của biểu thức `typeof null` trong JavaScript là gì?",
            "explanation": "`typeof null` trả về chuỗi 'object'. Đây là một lỗi lịch sử (historical bug) từ bản thiết kế sơ khai của JS do cách lưu trữ cờ kiểu nhị phân (type tag 000 trùng với object), và được giữ nguyên để đảm bảo tương thích ngược.",
            "options": [
                {"key": "A", "text": "\"null\"", "is_correct": False},
                {"key": "B", "text": "\"undefined\"", "is_correct": False},
                {"key": "C", "text": "\"object\"", "is_correct": True},
                {"key": "D", "text": "\"boolean\"", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-02",
        "chapter_id": "JS1-CH-02",
        "module_folder": "Module 02",
        "filename": "Lesson_02_02.md",
        "lesson_id": "JS1-02.02",
        "title": "Bài 2.2: Toán tử số học, toán tử gán & Thứ tự ưu tiên toán tử",
        "objective": "Làm chủ các phép tính số học (+, -, *, /, %, **), toán tử tăng giảm (++ / --) và độ ưu tiên toán tử.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS1-02.02
title: "Toán tử số học, toán tử gán & Thứ tự ưu tiên toán tử"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Toán tử số học", "Modulo", "Lũy thừa", "Toán tử gán", "Operator Precedence"]
prerequisites: ["JS1-02.01"]
---

# Toán tử số học, toán tử gán & Thứ tự ưu tiên toán tử

## 1. Khái niệm & Vấn đề thực tế
Để xử lý các bài toán tài chính, thống kê hay giải thuật, JavaScript cung cấp đầy đủ các toán tử tính toán đại số và các toán tử kết hợp gán giá trị nhằm tối ưu hóa cách viết code.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Các toán tử số học cơ bản**:
  - `+` (Cộng), `-` (Trừ), `*` (Nhân), `/` (Chia thực - kết quả luôn là số thập phân nếu không chia hết).
  - `%` (Chia lấy dư - Modulo).
  - `**` (Lũy thừa - Power, ví dụ: `2 ** 3 = 8`).
- **Toán tử gán mở rộng**:
  - `+=`, `-=`, `*=`, `/=`, `%=`.
- **Thứ tự ưu tiên**:
  - Ngoặc tròn `()` ưu tiên cao nhất.
  - Lũy thừa `**`.
  - Nhân, chia, chia dư `*`, `/`, `%`.
  - Cộng, trừ `+`, `-`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
let balance = 100;
balance += 50;   // balance = 150
balance *= 2;    // balance = 300

const remainder = 17 % 5; // 17 chia 5 dư 2
const power = 3 ** 2;     // 3 mũ 2 = 9

console.log("Remainder:", remainder);
console.log("Power:", power);
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Chia cho số 0**: Trong JavaScript, phép chia `10 / 0` **không** gây crash chương trình mà trả về giá trị đặc biệt `Infinity` (hoặc `-Infinity`). Phép tính `0 / 0` trả về `NaN`.
- **Toán tử tăng giảm tiền tố vs hậu tố**: `++x` (tăng trước rồi lấy giá trị) khác với `x++` (lấy giá trị hiện tại rồi mới tăng).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. JavaScript hỗ trợ toán tử lũy thừa `**` chuẩn ES6 thay cho `Math.pow()`.
2. Phép chia `/` trong JS luôn là phép chia thực số học.
3. Luôn dùng ngoặc đơn `()` khi viết biểu thức phức tạp để kiểm soát thứ tự thực thi.
""",
        "exercise": {
            "title": "Tính toán chu vi, diện tích và chia kẹo",
            "difficulty": "EASY",
            "problem_description": """### Yêu cầu
Cho các giá trị: hình chữ nhật có `length = 8`, `width = 5`; và `candies = 47` chiếc kẹo chia đều cho `children = 6` bạn nhỏ.
Hãy tính và in kết quả ra màn hình trên 4 dòng:
1. Chu vi hình chữ nhật: `(length + width) * 2`
2. Diện tích hình chữ nhật: `length * width`
3. Số kẹo mỗi bạn nhận được: lấy phần nguyên bằng `Math.floor(candies / children)`
4. Số kẹo còn dư: sử dụng toán tử chia lấy dư `%`

### Ví dụ
**Output**
```text
Chu vi: 26
Dien tich: 40
Moi ban: 7
Con du: 5
```

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["%","*","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng các toán tử số học và toán tử % chia lấy dư."} -->""",
            "starterCode": """// Tính chu vi, diện tích và chia kẹo theo yêu cầu

""",
            "solutionCode": """const length = 8;
const width = 5;
const perimeter = (length + width) * 2;
const area = length * width;

const candies = 47;
const children = 6;
const eachChild = Math.floor(candies / children);
const remaining = candies % children;

console.log("Chu vi:", perimeter);
console.log("Dien tich:", area);
console.log("Moi ban:", eachChild);
console.log("Con du:", remaining);
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "Chu vi: 26\nDien tich: 40\nMoi ban: 7\nCon du: 5",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Kết quả của biểu thức `10 / 0` trong JavaScript là gì?",
            "explanation": "Trong chuẩn số học dấu phẩy động IEEE 754 của JavaScript, việc chia một số dương cho 0 không làm dừng chương trình mà tạo ra giá trị đặc biệt Infinity.",
            "options": [
                {"key": "A", "text": "Báo lỗi ZeroDivisionError dừng chương trình.", "is_correct": False},
                {"key": "B", "text": "Trả về giá trị đặc biệt Infinity.", "is_correct": True},
                {"key": "C", "text": "Trả về null.", "is_correct": False},
                {"key": "D", "text": "Trả về 0.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-02",
        "chapter_id": "JS1-CH-02",
        "module_folder": "Module 02",
        "filename": "Lesson_02_03.md",
        "lesson_id": "JS1-02.03",
        "title": "Bài 2.3: So sánh lỏng lẻo (==, !=) vs So sánh nghiêm ngặt (===, !==)",
        "objective": "Hiểu rõ cơ chế ép kiểu ngầm định của toán tử == và vì sao bắt buộc sử dụng toán tử so sánh nghiêm ngặt === trong dự án thực tế.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS1-02.03
title: "So sánh lỏng lẻo (==, !=) vs So sánh nghiêm ngặt (===, !==)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Strict equality", "Loose equality", "===", "==", "Type coercion"]
prerequisites: ["JS1-02.02"]
---

# So sánh lỏng lẻo (==, !=) vs So sánh nghiêm ngặt (===, !==)

## 1. Khái niệm & Vấn đề thực tế
Một trong những nguồn gốc gây bug phổ biến nhất trong JavaScript là việc phân vân giữa hai bộ toán tử so sánh:
- **So sánh lỏng lẻo (`==`, `!=`)**: Tự động ép kiểu hai vế về cùng kiểu dữ liệu trước khi so sánh (Implicit Type Coercion).
- **So sánh nghiêm ngặt (`===`, `!==`)**: So sánh cả **giá trị** lẫn **kiểu dữ liệu**. Nếu kiểu dữ liệu khác nhau, lập tức trả về `false`.

---

## 2. Cú pháp & Quy tắc cốt lõi
| Biểu thức | Kết quả | Giải thích |
| :--- | :--- | :--- |
| `5 == "5"` | `true` | Chuỗi `"5"` bị ép kiểu thành số `5` |
| `5 === "5"` | `false` | Số `number` khác kiểu chuỗi `string` |
| `0 == false` | `true` | `false` bị ép kiểu thành `0` |
| `0 === false` | `false` | `number` khác `boolean` |
| `null == undefined` | `true` | Quy ước đặc biệt của JS |
| `null === undefined` | `false` | Hai kiểu dữ liệu khác nhau |

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const userInput = "100";
const targetScore = 100;

console.log("So sánh ==:", userInput == targetScore);   // true
console.log("So sánh ===:", userInput === targetScore); // false
```

- Toán tử `==` tự động chuyển `"100"` thành số `100`, dẫn đến kết quả `true`.
- Toán tử `===` phát hiện một bên là `string`, một bên là `number`, trả về ngay `false`.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quy tắc tuyệt đối của lập trình viên chuyên nghiệp**: Luôn luôn dùng `===` và `!==`. Không bao giờ sử dụng `==` hay `!=` trừ những trường hợp kiểm tra `val == null` (để cùng lúc bắt cả `null` và `undefined`).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `==` thực hiện ép kiểu ngầm định; `===` so sánh nghiêm ngặt giá trị và kiểu.
2. 99% trường hợp trong thực tế bắt buộc dùng `===` để tránh sai lệch logic.
""",
        "exercise": {
            "title": "Phân biệt so sánh nghiêm ngặt và lỏng lẻo",
            "difficulty": "EASY",
            "problem_description": """### Yêu cầu
Cho hai biến:
- `const a = 0;`
- `const b = false;`

Hãy sử dụng các toán tử so sánh `==`, `===`, `!=`, `!==` và hàm `console.log()` để in ra kết quả của 4 phép so sánh trên 4 dòng theo định dạng:
1. `a == b: {kết quả}`
2. `a === b: {kết quả}`
3. `a != b: {kết quả}`
4. `a !== b: {kết quả}`

### Ví dụ
**Output**
```text
a == b: true
a === b: false
a != b: false
a !== b: true
```

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["==","===","!=","!==","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Cần sử dụng cả 4 toán tử so sánh: ==, ===, !=, !==."} -->""",
            "starterCode": """const a = 0;
const b = false;

// Thực hiện in kết quả 4 phép so sánh

""",
            "solutionCode": """const a = 0;
const b = false;

console.log("a == b:", a == b);
console.log("a === b:", a === b);
console.log("a != b:", a != b);
console.log("a !== b:", a !== b);
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "a == b: true\na === b: false\na != b: false\na !== b: true",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Vì sao các tiêu chuẩn viết mã chuyên nghiệp (Clean Code / ESLint) đều khuyến nghị sử dụng === thay vì ==?",
            "explanation": "Toán tử === so sánh cả giá trị lẫn kiểu dữ liệu mà không thực hiện ép kiểu ngầm định phức tạp và khó lường, giúp ngăn ngừa các lỗi logic ngầm phát sinh do chuyển đổi kiểu ngoài ý muốn.",
            "options": [
                {"key": "A", "text": "Vì === thực hiện phép tính nhanh hơn 100 lần so với ==.", "is_correct": False},
                {"key": "B", "text": "Vì === ngăn ngừa các lỗi logic do ép kiểu ngầm định (Type Coercion) khó lường.", "is_correct": True},
                {"key": "C", "text": "Vì toán tử == sắp bị loại bỏ khỏi chuẩn ECMAScript.", "is_correct": False},
                {"key": "D", "text": "Vì == chỉ so sánh được kiểu số thực.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-02",
        "chapter_id": "JS1-CH-02",
        "module_folder": "Module 02",
        "filename": "Lesson_02_04.md",
        "lesson_id": "JS1-02.04",
        "title": "Bài 2.4: Toán tử logic (&&, ||, !) & Đánh giá ngắn mạch (Short-circuit)",
        "objective": "Làm chủ toán tử logic AND (&&), OR (||), NOT (!) và nguyên lý Short-circuit evaluation trong biểu thức điều kiện.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS1-02.04
title: "Toán tử logic (&&, ||, !) & Đánh giá ngắn mạch (Short-circuit)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Logical operators", "AND &&", "OR ||", "NOT !", "Short-circuit evaluation"]
prerequisites: ["JS1-02.03"]
---

# Toán tử logic (&&, ||, !) & Đánh giá ngắn mạch (Short-circuit)

## 1. Khái niệm & Vấn đề thực tế
Các toán tử logic cho phép kết hợp hoặc đảo ngược nhiều điều kiện so sánh để đưa ra quyết định trong chương trình.
Bên cạnh bảng chân trị cơ bản, JavaScript có cơ chế **Đánh giá ngắn mạch (Short-circuit evaluation)**: dừng kiểm tra ngay khi kết quả tổng thể đã được xác định chắc chắn.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`&&` (AND logic)**: Trả về `true` khi và chỉ khi TẤT CẢ toán hạng đều `true`. Nếu gặp toán hạng đầu tiên là `false`, nó dừng ngay lập tức và trả về giá trị đó (ngắn mạch).
- **`||` (OR logic)**: Trả về `true` chỉ cần ÍT NHẤT MỘT toán hạng là `true`. Nếu gặp toán hạng đầu tiên là `true`, nó dừng ngay và trả về giá trị đó.
- **`!` (NOT logic)**: Đảo ngược chân trị (`!true` thành `false`, `!false` thành `true`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const gpa = 8.5;
const conductScore = 90;

// Điều kiện học bổng: GPA >= 8.0 VÀ điểm rèn luyện >= 85
const isScholarship = (gpa >= 8.0) && (conductScore >= 85);
console.log("Được học bổng:", isScholarship); // true

// Hoặc là con thương binh, hoặc điểm thi xuất sắc
const isPrivileged = false;
const hasSpecialOffer = isPrivileged || (gpa >= 9.0);
console.log("Ưu đãi đặc biệt:", hasSpecialOffer); // false
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Giá trị trả về của `&&` và `||` không chỉ là boolean**:
  ```javascript
  console.log("Hello" && 123); // 123 (vì cả hai đều truthy, trả về toán hạng cuối)
  console.log(null || "Default"); // "Default" (gặp truthy đầu tiên trả về ngay)
  ```
- Kỹ thuật này thường được dùng để đặt giá trị dự phòng (fallback default value).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `&&` cần tất cả đúng; `||` chỉ cần một điều kiện đúng.
2. Short-circuit giúp tiết kiệm tài nguyên CPU và tránh lỗi truy cập bộ nhớ khi vế trái không hợp lệ.
""",
        "exercise": {
            "title": "Kiểm tra điều kiện cấp chứng chỉ xuất sắc",
            "difficulty": "EASY",
            "problem_description": """### Yêu cầu
Cho thông tin học tập của một sinh viên:
- Điểm lý thuyết: `theoryScore = 8.5`
- Điểm thực hành: `practiceScore = 9.0`
- Tỷ lệ chuyên cần (%): `attendance = 80`
- Nộp bài tập lớn: `hasProject = true`

Sử dụng toán tử so sánh và toán tử logic (`&&`, `||`) để tính toán:
1. `isPassed`: Điểm lý thuyết $\ge 5.0$ VÀ điểm thực hành $\ge 5.0$ VÀ tỷ lệ chuyên cần $\ge 75\%$.
2. `isExcellent`: `isPassed` là `true` VÀ (điểm thực hành $\ge 9.0$ HOẶC có nộp bài tập lớn).

In kết quả ra màn hình console trên 2 dòng theo đúng định dạng.

### Ví dụ
**Output**
```text
Đỗ khóa học: true
Xuất sắc: true
```

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["&&","||","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng toán tử logic && và ||."} -->""",
            "starterCode": """const theoryScore = 8.5;
const practiceScore = 9.0;
const attendance = 80;
const hasProject = true;

// Tính toán isPassed và isExcellent theo yêu cầu

""",
            "solutionCode": """const theoryScore = 8.5;
const practiceScore = 9.0;
const attendance = 80;
const hasProject = true;

const isPassed = (theoryScore >= 5.0) && (practiceScore >= 5.0) && (attendance >= 75);
const isExcellent = isPassed && ((practiceScore >= 9.0) || hasProject);

console.log("Đỗ khóa học:", isPassed);
console.log("Xuất sắc:", isExcellent);
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "Đỗ khóa học: true\nXuất sắc: true",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Trong biểu thức `false && doSomething()`, hàm `doSomething()` có được thực thi hay không?",
            "explanation": "Do toán tử '&&' áp dụng nguyên lý Short-circuit (ngắn mạch), khi vế trái đã là false thì toàn bộ biểu thức chắc chắn là false, JavaScript Engine sẽ dừng lại ngay lập tức và không bao giờ gọi hàm doSomething().",
            "options": [
                {"key": "A", "text": "Có, cả hai vế luôn luôn được thực thi trước khi đánh giá.", "is_correct": False},
                {"key": "B", "text": "Không, vì vế trái là false nên biểu thức bị ngắn mạch và dừng kiểm tra ngay.", "is_correct": True},
                {"key": "C", "text": "Chương trình sẽ báo lỗi SyntaxError.", "is_correct": False},
                {"key": "D", "text": "Chỉ thực thi khi chạy ở chế độ Strict Mode.", "is_correct": False}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"🚀 Seeding Course 1 Modules 1 & 2 ({len(lessons)} lessons)...")
    save_and_seed_lessons("Khóa 1 - JavaScript Cơ bản", lessons)
