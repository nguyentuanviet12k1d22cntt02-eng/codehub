import sys
from js_seeder_helper import save_and_seed_lessons

sys.stdout.reconfigure(encoding='utf-8')

lessons = [
    # ========================================================
    # MODULE 3: Nhập dữ liệu, Ép kiểu & Khái niệm Truthy/Falsy
    # ========================================================
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-03",
        "chapter_id": "JS1-CH-03",
        "module_folder": "Module 03",
        "filename": "Lesson_03_01.md",
        "lesson_id": "JS1-03.01",
        "title": "Bài 3.1: Cơ chế nhập dữ liệu chuẩn stdin trong JavaScript thuần",
        "objective": "Làm chủ cơ chế đọc luồng dữ liệu chuẩn stdin bằng module 'fs' trong Node.js runtime cho JavaScript thuần.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS1-03.01
title: "Cơ chế nhập dữ liệu chuẩn stdin trong JavaScript thuần"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["stdin", "fs.readFileSync", "Node.js", "I/O", "Console Input"]
prerequisites: ["JS1-02.04"]
---

# Cơ chế nhập dữ liệu chuẩn stdin trong JavaScript thuần

## 1. Khái niệm & Vấn đề thực tế
Khác với trình duyệt có hàm `prompt()` làm gián đoạn luồng giao diện, trong môi trường JavaScript dòng lệnh thuần (Console/Backend/Thi thuật toán), chương trình nhận dữ liệu thông qua **luồng đầu vào tiêu chuẩn (Standard Input - stdin)**.

Trong môi trường Node.js / V8 Sandbox chuẩn, cách nhanh nhất và phổ biến nhất để đọc toàn bộ dữ liệu đầu vào là sử dụng hàm đồng bộ `fs.readFileSync(0, 'utf-8')` (với `0` là File Descriptor đại diện cho `stdin`).

---

## 2. Cú pháp & Quy tắc cốt lõi
Mẫu chuẩn (Standard Pattern) để đọc và bóc tách dữ liệu từ stdin:
```javascript
const fs = require('fs');

// Đọc toàn bộ chuỗi từ stdin, loại bỏ khoảng trắng dư thừa và tách thành mảng các từ/số
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

// Lấy các tham số tuần tự
const firstValue = input[0];
const secondValue = input[1];
```

- `.trim()`: Xóa bỏ khoảng trắng thừa, ký tự xuống dòng `\\n` ở đầu và cuối chuỗi.
- `.split(/\\s+/)`: Tách chuỗi theo một hoặc nhiều dấu cách hoặc xuống dòng liên tiếp.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

// Giả sử đầu vào stdin là: "15 25"
const numA = Number(input[0]);
const numB = Number(input[1]);

console.log("Tổng:", numA + numB);
```

- Dòng 1 & 2: Nạp module `fs` và đọc toàn bộ token từ bàn phím vào mảng `input`.
- Dòng 5 & 6: Chuyển đổi từng phần tử chuỗi sang kiểu số `number`.
- Dòng 8: Thực hiện phép cộng số học và in ra console.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dữ liệu stdin luôn là kiểu `string`**: Nếu quên dùng `Number()` hoặc `parseInt()`, phép toán `input[0] + input[1]` sẽ thành phép ghép chuỗi (`"15" + "25" = "1525"`).
- **Xử lý khi stdin rỗng**: Luôn kiểm tra mảng `input` có phần tử hợp lệ trước khi truy cập `input[0]`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Đọc stdin trong JS thuần dùng: `const input = require('fs').readFileSync(0, 'utf-8').trim().split(/\\s+/);`.
2. Mọi dữ liệu đọc từ stdin ban đầu đều là chuỗi ký tự (`string`).
""",
        "exercise": {
            "title": "Tính tổng và tích hai số từ stdin",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng `fs.readFileSync(0, 'utf-8')` để đọc 2 số nguyên từ luồng đầu vào tiêu chuẩn và tính toán.

### Yêu cầu đề bài:
Nhập vào hai số nguyên $A$ và $B$ (ngăn cách nhau bởi dấu cách hoặc xuống dòng).
Hãy tính:
1. Tổng $A + B$
2. Tích $A \\times B$

In kết quả ra màn hình theo đúng định dạng 2 dòng:
```text
Tong: <A + B>
Tich: <A * B>
```

### Ví dụ:
* **Đầu vào:** `10 20`
* **Đầu ra:**
```text
Tong: 30
Tich: 200
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `fs.readFileSync(0, 'utf-8')` để đọc dữ liệu.
* Ép kiểu chuỗi sang số nguyên trước khi tính toán.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["fs","readFileSync","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng fs.readFileSync(0, 'utf-8') để đọc dữ liệu từ stdin."} -->""",
            "starterCode": """const fs = require('fs');

// Đọc dữ liệu từ stdin
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

// Hoàn thành chương trình của bạn tại đây
""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const a = Number(input[0]);
const b = Number(input[1]);

console.log("Tong:", a + b);
console.log("Tich:", a * b);
""",
            "test_cases": [
                {
                    "input": "10 20",
                    "expected_output": "Tong: 30\nTich: 200",
                    "is_hidden": False
                },
                {
                    "input": "7 8",
                    "expected_output": "Tong: 15\nTich: 56",
                    "is_hidden": True
                },
                {
                    "input": "-5 15",
                    "expected_output": "Tong: 10\nTich: -75",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Dữ liệu thu được từ phương thức `fs.readFileSync(0, 'utf-8')` ban đầu có kiểu dữ liệu là gì?",
            "explanation": "Khi truyền tham số mã hóa 'utf-8', fs.readFileSync trả về toàn bộ nội dung đọc được dưới dạng một chuỗi ký tự (string). Ta cần tự ép kiểu sang number khi cần tính toán.",
            "options": [
                {"key": "A", "text": "Kiểu number.", "is_correct": False},
                {"key": "B", "text": "Kiểu string.", "is_correct": True},
                {"key": "C", "text": "Kiểu mảng (Array).", "is_correct": False},
                {"key": "D", "text": "Kiểu boolean.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-03",
        "chapter_id": "JS1-CH-03",
        "module_folder": "Module 03",
        "filename": "Lesson_03_02.md",
        "lesson_id": "JS1-03.02",
        "title": "Bài 3.2: Chuyển đổi kiểu tường minh (String, Number, parseInt, parseFloat)",
        "objective": "Làm chủ các hàm ép kiểu tường minh trong JS, phân biệt Number() vs parseInt()/parseFloat() và định dạng số thập phân toFixed().",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS1-03.02
title: "Chuyển đổi kiểu tường minh (String, Number, parseInt, parseFloat)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Type Conversion", "Number()", "String()", "parseInt()", "parseFloat()", "toFixed()"]
prerequisites: ["JS1-03.01"]
---

# Chuyển đổi kiểu tường minh (String, Number, parseInt, parseFloat)

## 1. Khái niệm & Vấn đề thực tế
Ép kiểu tường minh (Explicit Type Conversion) là việc lập trình viên chủ động dùng các hàm chuyển đổi để biến đổi giá trị từ kiểu này sang kiểu khác nhằm đảm bảo tính toàn vẹn và chính xác cho dữ liệu.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Chuyển đổi sang số**:
  - `Number(val)`: Chuyển toàn bộ chuỗi sang số. Nếu chuỗi chứa bất kỳ ký tự không phải số nào (ngoài khoảng trắng và dấu chấm thập phân), nó trả về `NaN`.
  - `parseInt(str, radix)`: Phân tích cú pháp đọc từ đầu chuỗi đến khi gặp ký tự không phải số nguyên thì dừng lại và trả về phần nguyên. Luôn truyền `radix = 10` cho hệ thập phân.
  - `parseFloat(str)`: Tương tự `parseInt` nhưng đọc cả phần dấu chấm thập phân.
- **Chuyển đổi sang chuỗi**:
  - `String(val)` hoặc `val.toString()`.
- **Làm tròn số thập phân**:
  - `num.toFixed(digits)`: Trả về chuỗi đại diện cho số thập phân được làm tròn với `digits` chữ số sau dấu phẩy.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
console.log(Number("123.45"));      // 123.45
console.log(Number("123px"));       // NaN (thất bại vì có 'px')

console.log(parseInt("123px", 10)); // 123 (đọc được 123 trước khi gặp 'px')
console.log(parseFloat("12.5rem")); // 12.5

const price = 45.6789;
console.log(price.toFixed(2));      // "45.68" (làm tròn 2 chữ số thập phân)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên radix trong parseInt**: Luôn viết `parseInt(str, 10)` để tránh bị hiểu nhầm sang hệ bát phân (octal) trên một số engine cũ.
- **`toFixed()` trả về `string`**: Kết quả của `toFixed()` là chuỗi ký tự, nếu muốn tiếp tục tính toán cần bọc lại bằng `Number()`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `Number()` khi muốn chuyển chuỗi thuần túy sang số nghiêm ngặt.
2. Dùng `parseInt(s, 10)` và `parseFloat(s)` khi chuỗi có chứa đơn vị phía sau (như `100px`, `3.5kg`).
3. Dùng `.toFixed(n)` khi cần xuất kết quả tiền tệ hoặc số đo làm tròn $n$ chữ số thập phân.
""",
        "exercise": {
            "title": "Chuyển đổi đơn vị và tính tiền xăng",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng `parseFloat()` và `toFixed()` để ép kiểu và tính toán chi phí chính xác.

### Yêu cầu đề bài:
Nhập vào 2 chuỗi từ stdin:
1. Chuỗi dung tích xăng đã đổ (ví dụ: `"35.50lit"` hoặc `"40.25lit"`).
2. Chuỗi đơn giá mỗi lít xăng (ví dụ: `"23850"`).

Hãy dùng `parseFloat()` để trích xuất số lít xăng, dùng `Number()` để chuyển đổi đơn giá, sau đó tính tổng tiền:
$$\\text{tongTien} = \\text{litXang} \\times \\text{donGia}$$

In kết quả ra màn hình chính xác theo định dạng 2 dòng:
```text
So lit: <litXang lam tron 2 chu so thap phan>
Thanh tien: <tongTien lam tron 2 chu so thap phan> VNĐ
```

### Ví dụ:
* **Đầu vào:** `35.50lit 23850`
* **Đầu ra:**
```text
So lit: 35.50
Thanh tien: 846675.00 VNĐ
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `parseFloat` và `toFixed(2)`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["parseFloat","toFixed","readFileSync"],"forbiddenKeywords":[],"customErrorMessage":"Cần dùng parseFloat trích xuất số lít và toFixed(2) định dạng kết quả."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

// Trích xuất và tính toán theo yêu cầu

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const liters = parseFloat(input[0]);
const price = Number(input[1]);
const total = liters * price;

console.log("So lit:", liters.toFixed(2));
console.log("Thanh tien: " + total.toFixed(2) + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "35.50lit 23850",
                    "expected_output": "So lit: 35.50\nThanh tien: 846675.00 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "10lit 25000",
                    "expected_output": "So lit: 10.00\nThanh tien: 250000.00 VNĐ",
                    "is_hidden": True
                },
                {
                    "input": "4.255L 22000",
                    "expected_output": "So lit: 4.25\nThanh tien: 93610.00 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Sự khác biệt căn bản giữa `Number(\"50px\")` và `parseInt(\"50px\", 10)` là gì?",
            "explanation": "Number('50px') yêu cầu toàn bộ chuỗi phải là số hợp lệ nên trả về NaN. Trong khi đó, parseInt('50px', 10) đọc từ trái sang phải, trích xuất phần số hợp lệ đầu tiên (50) và dừng lại khi gặp ký tự 'p'.",
            "options": [
                {"key": "A", "text": "Cả hai đều trả về giá trị 50.", "is_correct": False},
                {"key": "B", "text": "Number(\"50px\") trả về NaN, còn parseInt(\"50px\", 10) trả về 50.", "is_correct": True},
                {"key": "C", "text": "Number(\"50px\") trả về 50, còn parseInt(\"50px\", 10) trả về NaN.", "is_correct": False},
                {"key": "D", "text": "Cả hai đều ném ra lỗi cú pháp SyntaxError.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-03",
        "chapter_id": "JS1-CH-03",
        "module_folder": "Module 03",
        "filename": "Lesson_03_03.md",
        "lesson_id": "JS1-03.03",
        "title": "Bài 3.3: Ép kiểu ngầm định (Type Coercion), giá trị NaN & Number.isNaN()",
        "objective": "Hiểu cơ chế ép kiểu ngầm định của JS trong các phép toán, giá trị NaN và kỹ thuật kiểm tra số hợp lệ bằng Number.isNaN().",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS1-03.03
title: "Ép kiểu ngầm định (Type Coercion), giá trị NaN & Number.isNaN()"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Type Coercion", "NaN", "Number.isNaN", "isNaN", "Ép kiểu ngầm"]
prerequisites: ["JS1-03.02"]
---

# Ép kiểu ngầm định (Type Coercion), giá trị NaN & Number.isNaN()

## 1. Khái niệm & Vấn đề thực tế
Khi thực hiện phép toán trên các toán hạng khác kiểu dữ liệu, JavaScript tự động chuyển đổi kiểu dữ liệu của một hoặc cả hai toán hạng mà không báo trước – gọi là **Ép kiểu ngầm định (Type Coercion)**.

Nếu một phép tính số học thất bại hoặc không thể chuyển đổi thành số hợp lệ, kết quả sinh ra là giá trị đặc biệt `NaN` (**Not a Number**).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Phép trừ `-`, nhân `*`, chia `/`**: Luôn ép các toán hạng về `number`.
  ```javascript
  "10" - 2   // 8
  "6" * "3"  // 18
  "abc" - 5  // NaN
  ```
- **Đặc điểm của NaN**:
  - `NaN` là giá trị duy nhất trong JavaScript **không bằng chính nó**: `NaN === NaN` trả về `false`!
- **Kiểm tra NaN**:
  - Không bao giờ dùng `x === NaN`.
  - Dùng `Number.isNaN(val)` (chuẩn ES6 an toàn tuyệt đối).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const validStr = "123";
const invalidStr = "abc";

const num1 = Number(validStr);   // 123
const num2 = Number(invalidStr); // NaN

console.log(Number.isNaN(num1)); // false (là số hợp lệ)
console.log(Number.isNaN(num2)); // true (bị biến thành NaN)
```

- Dòng 4 & 5: Cố gắng chuyển chuỗi sang số. `"abc"` không thể chuyển được nên trở thành `NaN`.
- Dòng 7 & 8: `Number.isNaN()` kiểm tra chính xác giá trị có phải là `NaN` hay không.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Phân biệt `isNaN()` toàn cục vs `Number.isNaN()`**:
  ```javascript
  isNaN("hello");        // true (vì nó cố ép "hello" thành NaN trước rồi mới kiểm tra)
  Number.isNaN("hello"); // false (chỉ trả về true nếu giá trị chính xác là kiểu number mang giá trị NaN)
  ```
  -> Luôn luôn dùng `Number.isNaN()`!

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Phép toán `*`, `/`, `-` luôn ép ngầm định sang `number`; phép `+` ưu tiên ghép chuỗi nếu có ít nhất một chuỗi.
2. `NaN !== NaN` là chân lý trong JavaScript.
3. Luôn dùng `Number.isNaN(x)` để kiểm tra một biến có bị lỗi tính toán số học hay không.
""",
        "exercise": {
            "title": "Kiểm định dữ liệu đầu vào hợp lệ",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng `Number()` và `Number.isNaN()` để kiểm tra dữ liệu chuỗi nhập từ stdin có phải là một con số hợp lệ hay không.

### Yêu cầu đề bài:
Nhập vào một chuỗi `token` từ stdin.
1. Chuyển đổi `token` sang số bằng `Number(token)`.
2. Kiểm tra xem kết quả có phải là `NaN` không bằng `Number.isNaN()`.
3. Nếu là số hợp lệ, in ra:
```text
Gia tri hop le: <gia_tri_so>
```
Nếu không hợp lệ (là `NaN`), in ra:
```text
Loi: Khong phai so hop le
```

### Ví dụ:
* **Đầu vào:** `2026`
* **Đầu ra:** `Gia tri hop le: 2026`
* **Đầu vào:** `javascript`
* **Đầu ra:** `Loi: Khong phai so hop le`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `Number.isNaN()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["Number.isNaN","readFileSync"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng Number.isNaN() để kiểm tra số hợp lệ."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const token = input[0];
// Kiểm tra token theo yêu cầu đề bài

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const token = input[0];
const parsedNumber = Number(token);

if (Number.isNaN(parsedNumber)) {
    console.log("Loi: Khong phai so hop le");
} else {
    console.log("Gia tri hop le:", parsedNumber);
}
""",
            "test_cases": [
                {
                    "input": "2026",
                    "expected_output": "Gia tri hop le: 2026",
                    "is_hidden": False
                },
                {
                    "input": "javascript",
                    "expected_output": "Loi: Khong phai so hop le",
                    "is_hidden": False
                },
                {
                    "input": "3.14159",
                    "expected_output": "Gia tri hop le: 3.14159",
                    "is_hidden": True
                },
                {
                    "input": "abc123xyz",
                    "expected_output": "Loi: Khong phai so hop le",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Vì sao biểu thức `NaN === NaN` lại trả về kết quả là `false` trong JavaScript?",
            "explanation": "Theo chuẩn số thực IEEE 754 (mà JavaScript tuân thủ), NaN đại diện cho một trạng thái tính toán vô nghĩa/không xác định. Hai phép tính vô nghĩa không thể coi là bằng nhau, do đó NaN không bao giờ bằng chính nó.",
            "options": [
                {"key": "A", "text": "Vì đây là lỗi của JavaScript Engine chưa được sửa chữa.", "is_correct": False},
                {"key": "B", "text": "Vì theo chuẩn IEEE 754, một giá trị không xác định không thể được coi là bằng một giá trị không xác định khác.", "is_correct": True},
                {"key": "C", "text": "Vì NaN có kiểu dữ liệu là string chứ không phải number.", "is_correct": False},
                {"key": "D", "text": "Vì NaN chỉ bằng chính nó khi so sánh lỏng lẻo (==).", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-03",
        "chapter_id": "JS1-CH-03",
        "module_folder": "Module 03",
        "filename": "Lesson_03_04.md",
        "lesson_id": "JS1-03.04",
        "title": "Bài 3.4: Khái niệm Truthy, Falsy & Kỹ thuật chuyển đổi Boolean kép (!!)",
        "objective": "Làm chủ danh sách 8 giá trị Falsy trong JS, khái niệm Truthy và kỹ thuật ép kiểu nhanh sang boolean bằng toán tử !!.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS1-03.04
title: "Khái niệm Truthy, Falsy & Kỹ thuật chuyển đổi Boolean kép (!!)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Truthy", "Falsy", "Boolean", "Toán tử !!", "Ép kiểu Boolean"]
prerequisites: ["JS1-03.03"]
---

# Khái niệm Truthy, Falsy & Kỹ thuật chuyển đổi Boolean kép (!!)

## 1. Khái niệm & Vấn đề thực tế
Trong JavaScript, khi bất kỳ giá trị nào được đặt vào ngữ cảnh điều kiện logic (như câu lệnh `if`, vòng lặp `while`), nó sẽ tự động được chuyển đổi sang kiểu `boolean`.

- **Falsy**: Là những giá trị khi chuyển sang boolean sẽ cho kết quả là `false`.
- **Truthy**: Là TẤT CẢ các giá trị còn lại (cho kết quả `true`).

---

## 2. Cú pháp & Quy tắc cốt lõi
Trong JavaScript, chỉ có duy nhất **8 giá trị Falsy**:
1. `false`
2. `0`, `-0`, `0n` (BigInt 0)
3. `""` (chuỗi rỗng)
4. `null`
5. `undefined`
6. `NaN`

> Mọi giá trị khác (kể cả chuỗi `"0"`, chuỗi `"false"`, mảng rỗng `[]`, object rỗng `{}`) ĐỀU LÀ **TRUTHY**!

- **Toán tử phủ định kép `!!`**:
  - Dấu `!` thứ nhất: Ép giá trị về boolean và đảo ngược nó.
  - Dấu `!` thứ hai: Đảo ngược lại lần nữa để thu được đúng chân trị boolean của giá trị ban đầu.
  - `!!value` tương đương với `Boolean(value)`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
console.log(!!"hello"); // true (chuỗi không rỗng là Truthy)
console.log(!!"");      // false (chuỗi rỗng là Falsy)
console.log(!!0);       // false (số 0 là Falsy)
console.log(!!"0");     // true (chuỗi chứa ký tự '0' là Truthy!)
console.log(!![]);      // true (mảng rỗng là Truthy!)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Chuỗi `"0"` và chuỗi `" "` (có dấu cách) là Truthy**: Chỉ có chuỗi hoàn toàn rỗng `""` (length = 0) mới là Falsy.
- **Mảng rỗng `[]` là Truthy**: Đừng kiểm tra mảng rỗng bằng `if (arr)` vì nó luôn luôn là `true`. Hãy kiểm tra `if (arr.length > 0)`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Thuộc lòng 8 giá trị Falsy: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.
2. Mọi đối tượng, mảng (kể cả rỗng) đều là Truthy.
3. Dùng `!!val` để ép nhanh một biến về kiểu boolean thuần túy.
""",
        "exercise": {
            "title": "Kiểm tra trạng thái Truthy/Falsy của biến",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Thực hành sử dụng toán tử phủ định kép `!!` để kiểm tra tính Truthy/Falsy của các giá trị.

### Yêu cầu đề bài:
Cho 4 biến:
* `const v1 = "";`
* `const v2 = "0";`
* `const v3 = 0;`
* `const v4 = null;`

Hãy dùng toán tử `!!` để chuyển đổi từng biến sang boolean và in kết quả ra màn hình theo đúng định dạng 4 dòng:
```text
v1: false
v2: true
v3: false
v4: false
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cú pháp toán tử phủ định kép `!!`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["!!","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng cú pháp toán tử phủ định kép !!."} -->""",
            "starterCode": """const v1 = "";
const v2 = "0";
const v3 = 0;
const v4 = null;

// In kết quả boolean của từng biến bằng toán tử !!

""",
            "solutionCode": """const v1 = "";
const v2 = "0";
const v3 = 0;
const v4 = null;

console.log("v1:", !!v1);
console.log("v2:", !!v2);
console.log("v3:", !!v3);
console.log("v4:", !!v4);
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "v1: false\nv2: true\nv3: false\nv4: false",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Trong các giá trị sau đây, giá trị nào là TRUTHY trong JavaScript?",
            "explanation": "Trong JavaScript, chỉ chuỗi rỗng \"\" mới là Falsy. Chuỗi ký tự \"0\" có chứa 1 ký tự nên nó là một Truthy value. Các giá trị null, NaN, 0 đều thuộc 8 giá trị Falsy.",
            "options": [
                {"key": "A", "text": "0", "is_correct": False},
                {"key": "B", "text": "null", "is_correct": False},
                {"key": "C", "text": "\"0\"", "is_correct": True},
                {"key": "D", "text": "NaN", "is_correct": False}
            ]
        }
    },

    # ========================================================
    # MODULE 4: Cấu trúc điều khiển & Rẽ nhánh
    # ========================================================
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-04",
        "chapter_id": "JS1-CH-04",
        "module_folder": "Module 04",
        "filename": "Lesson_04_01.md",
        "lesson_id": "JS1-04.01",
        "title": "Bài 4.1: Cấu trúc rẽ nhánh cơ bản với if, else và else if",
        "objective": "Làm chủ cấu trúc if-else, luồng rẽ nhánh đa điều kiện và thuật toán xếp loại học lực theo thang điểm.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS1-04.01
title: "Cấu trúc rẽ nhánh cơ bản với if, else và else if"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["if", "else", "else if", "Rẽ nhánh", "Điều kiện"]
prerequisites: ["JS1-03.04"]
---

# Cấu trúc rẽ nhánh cơ bản với if, else và else if

## 1. Khái niệm & Vấn đề thực tế
Cấu trúc điều khiển rẽ nhánh cho phép chương trình đưa ra các quyết định hành động khác nhau tùy thuộc vào điều kiện đúng (`true`) hay sai (`false`).

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
if (dieu_kien_1) {
    // Thực thi khi dieu_kien_1 là true
} else if (dieu_kien_2) {
    // Thực thi khi dieu_kien_1 là false VÀ dieu_kien_2 là true
} else {
    // Thực thi khi tất cả các điều kiện trên đều false
}
```

- Luôn sử dụng cặp ngoặc nhọn `{}` cho khối lệnh ngay cả khi khối lệnh chỉ có 1 dòng (quy chuẩn Clean Code).
- Thứ tự kiểm tra từ trên xuống dưới; ngay khi một nhánh điều kiện thỏa mãn, chương trình sẽ thực hiện khối lệnh đó và bỏ qua toàn bộ các nhánh `else if` hoặc `else` còn lại.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const score = 8.2;

if (score >= 8.5) {
    console.log("Xếp loại: Giỏi");
} else if (score >= 6.5) {
    console.log("Xếp loại: Khá");
} else if (score >= 5.0) {
    console.log("Xếp loại: Trung bình");
} else {
    console.log("Xếp loại: Yếu");
}
```

- Vì `score = 8.2` nhỏ hơn 8.5 nhưng lớn hơn hoặc bằng 6.5, nhánh `else if (score >= 6.5)` được kích hoạt.
- In ra `"Xếp loại: Khá"` và kết thúc khối rẽ nhánh.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Sắp xếp sai thứ tự điều kiện**: Nếu đặt `score >= 5.0` lên trước `score >= 8.5`, thì một điểm 9.0 sẽ rơi vào nhánh `Trung bình` ngay lập tức. Luôn sắp xếp điều kiện theo thứ tự tăng dần hoặc giảm dần chặt chẽ.
- **Dùng dấu gán `=` thay cho so sánh `===`**: `if (a = 5)` sẽ gán 5 cho `a` và điều kiện luôn là Truthy.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cấu trúc `if-else if-else` kiểm tra tuần tự từ trên xuống dưới.
2. Luôn bao bọc khối mã trong `{}` và dùng `===` để so sánh.
""",
        "exercise": {
            "title": "Xếp loại kết quả học tập",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng cấu trúc `if-else if-else` để phân loại học lực của sinh viên dựa trên điểm trung bình từ stdin.

### Yêu cầu đề bài:
Nhập vào một số thực `score` đại diện cho điểm trung bình (từ 0.0 đến 10.0).
Quy tắc xếp loại:
* `score >= 8.5`: In `Xep loai: GIOI`
* `score >= 6.5` và `< 8.5`: In `Xep loai: KHA`
* `score >= 5.0` và `< 6.5`: In `Xep loai: TRUNG BINH`
* Còn lại (`< 5.0`): In `Xep loai: YEU`

### Ví dụ:
* **Đầu vào:** `7.8`
* **Đầu ra:** `Xep loai: KHA`
* **Đầu vào:** `9.2`
* **Đầu ra:** `Xep loai: GIOI`

### Ràng buộc kỹ thuật:
* Sử dụng cấu trúc `if`, `else if`, `else`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["if","else","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Cần sử dụng cấu trúc if-else if-else để giải quyết bài toán."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const score = parseFloat(input[0]);

// Thực hiện xếp loại và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const score = parseFloat(input[0]);

if (score >= 8.5) {
    console.log("Xep loai: GIOI");
} else if (score >= 6.5) {
    console.log("Xep loai: KHA");
} else if (score >= 5.0) {
    console.log("Xep loai: TRUNG BINH");
} else {
    console.log("Xep loai: YEU");
}
""",
            "test_cases": [
                {
                    "input": "7.8",
                    "expected_output": "Xep loai: KHA",
                    "is_hidden": False
                },
                {
                    "input": "9.2",
                    "expected_output": "Xep loai: GIOI",
                    "is_hidden": True
                },
                {
                    "input": "5.5",
                    "expected_output": "Xep loai: TRUNG BINH",
                    "is_hidden": True
                },
                {
                    "input": "3.5",
                    "expected_output": "Xep loai: YEU",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Điều gì sẽ xảy ra nếu một biến `x = 10` chạy qua cấu trúc:\nif (x > 5) console.log(\"A\");\nelse if (x > 8) console.log(\"B\");",
            "explanation": "Vì điều kiện đầu tiên (x > 5) đã thỏa mãn là true, JavaScript Engine sẽ thực thi in 'A' và kết thúc toàn bộ cấu trúc rẽ nhánh, bỏ qua hoàn toàn nhánh 'else if (x > 8)'.",
            "options": [
                {"key": "A", "text": "Chỉ in ra \"A\".", "is_correct": True},
                {"key": "B", "text": "Chỉ in ra \"B\".", "is_correct": False},
                {"key": "C", "text": "In ra cả \"A\" và \"B\".", "is_correct": False},
                {"key": "D", "text": "Báo lỗi cú pháp SyntaxError.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-04",
        "chapter_id": "JS1-CH-04",
        "module_folder": "Module 04",
        "filename": "Lesson_04_02.md",
        "lesson_id": "JS1-04.02",
        "title": "Bài 4.2: Biểu thức điều kiện ba ngôi (Ternary Operator)",
        "objective": "Làm chủ cú pháp toán tử ba ngôi (condition ? expr1 : expr2), gán biến trực tiếp và viết code ngắn gọn.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS1-04.02
title: "Biểu thức điều kiện ba ngôi (Ternary Operator)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Ternary Operator", "Toán tử ba ngôi", "? :", "Conditional Expression"]
prerequisites: ["JS1-04.01"]
---

# Biểu thức điều kiện ba ngôi (Ternary Operator)

## 1. Khái niệm & Vấn đề thực tế
Khi cần gán giá trị cho một biến dựa trên một điều kiện đơn giản, việc dùng câu lệnh `if-else` truyền thống thường khiến mã nguồn dài dòng (cần 4–6 dòng code và phải dùng biến `let`).

Toán tử ba ngôi (**Ternary Operator**) là toán tử duy nhất trong JavaScript nhận 3 toán hạng, hoạt động như một **biểu thức có giá trị trả về**, cho phép ta gán trực tiếp kết quả vào một hằng số `const`.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
const result = condition ? valueIfTrue : valueIfFalse;
```

- Nếu `condition` là Truthy: trả về `valueIfTrue`.
- Nếu `condition` là Falsy: trả về `valueIfFalse`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const age = 20;

// Sử dụng toán tử ba ngôi để gán trực tiếp vào hằng số const
const status = age >= 18 ? "Người lớn" : "Trẻ vị thành niên";

console.log(status); // "Người lớn"
```

- Dòng 4: Biểu thức `age >= 18` là `true`, do đó chuỗi `"Người lớn"` được trả về và gán cho `status`.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng toán tử ba ngôi lồng nhau (Nested Ternary)**:
  `const res = a ? (b ? c : d) : (e ? f : g);` -> Cực kỳ khó đọc và khó bảo trì! Nếu có nhiều hơn 2 nhánh, hãy quay lại dùng `if-else` hoặc `switch-case`.
- **Dùng toán tử ba ngôi thay thế cho câu lệnh hành động**: Không nên viết `isLoggedIn ? showHome() : showLogin();` mà hãy dùng `if-else` thông thường khi không cần nhận giá trị trả về.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `condition ? exprIfTrue : exprIfFalse`.
2. Chỉ dùng toán tử ba ngôi cho các quyết định gán giá trị đơn giản 1 tầng.
""",
        "exercise": {
            "title": "Kiểm tra số chẵn lẻ và dấu âm dương",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng toán tử ba ngôi `? :` để phân loại số nguyên nhập từ stdin.

### Yêu cầu đề bài:
Nhập vào một số nguyên `n` từ stdin.
1. Dùng toán tử ba ngôi để xác định `parity`: nếu `n % 2 === 0` thì `"CHAN"`, ngược lại là `"LE"`.
2. Dùng toán tử ba ngôi để xác định `sign`: nếu `n >= 0` thì `"DUONG"`, ngược lại là `"AM"`.

In ra màn hình theo định dạng 2 dòng:
```text
Chan le: <parity>
Dau: <sign>
```

### Ví dụ:
* **Đầu vào:** `14`
* **Đầu ra:**
```text
Chan le: CHAN
Dau: DUONG
```
* **Đầu vào:** `-7`
* **Đầu ra:**
```text
Chan le: LE
Dau: AM
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng toán tử ba ngôi `? :`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["? ",":","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng toán tử ba ngôi ? :."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const n = parseInt(input[0], 10);

// Sử dụng toán tử ba ngôi để xác định parity và sign

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const n = parseInt(input[0], 10);

const parity = (n % 2 === 0) ? "CHAN" : "LE";
const sign = (n >= 0) ? "DUONG" : "AM";

console.log("Chan le:", parity);
console.log("Dau:", sign);
""",
            "test_cases": [
                {
                    "input": "14",
                    "expected_output": "Chan le: CHAN\nDau: DUONG",
                    "is_hidden": False
                },
                {
                    "input": "-7",
                    "expected_output": "Chan le: LE\nDau: AM",
                    "is_hidden": True
                },
                {
                    "input": "0",
                    "expected_output": "Chan le: CHAN\nDau: DUONG",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Ưu điểm lớn nhất của toán tử ba ngôi (Ternary Operator) so với câu lệnh if-else truyền thống là gì?",
            "explanation": "Toán tử ba ngôi là một biểu thức (expression) có giá trị trả về, cho phép ta gán trực tiếp kết quả vào một hằng số khai báo bằng 'const' mà không cần tạo biến tạm bằng 'let' rồi mới gán trong khối lệnh.",
            "options": [
                {"key": "A", "text": "Nó có thể xử lý được 100 nhánh điều kiện một cách dễ dàng.", "is_correct": False},
                {"key": "B", "text": "Nó là biểu thức có giá trị trả về, giúp gán trực tiếp cho hằng số const một cách gọn gàng.", "is_correct": True},
                {"key": "C", "text": "Nó giúp chương trình chạy nhanh gấp 10 lần so với if-else.", "is_correct": False},
                {"key": "D", "text": "Nó tự động sửa lỗi NaN.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-04",
        "chapter_id": "JS1-CH-04",
        "module_folder": "Module 04",
        "filename": "Lesson_04_03.md",
        "lesson_id": "JS1-04.03",
        "title": "Bài 4.3: Lựa chọn đa nhánh với switch, case, break và default",
        "objective": "Nắm vững cấu trúc switch-case, cơ chế fall-through khi thiếu break và cách gom nhóm các trường hợp case.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS1-04.03
title: "Lựa chọn đa nhánh với switch, case, break và default"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["switch", "case", "break", "default", "Fall-through", "Đa nhánh"]
prerequisites: ["JS1-04.02"]
---

# Lựa chọn đa nhánh với switch, case, break và default

## 1. Khái niệm & Vấn đề thực tế
Khi một biến cần được so sánh bằng với rất nhiều giá trị cố định cụ thể (ví dụ mã trạng thái HTTP, các ngày trong tuần, lệnh từ người dùng), việc viết liên tiếp nhiều khối `if-else if` sẽ trở nên cồng kềnh. Cấu trúc `switch-case` cung cấp giải pháp trực quan và thanh lịch hơn.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
switch (expression) {
    case value1:
        // Mã thực thi khi expression === value1
        break;
    case value2:
        // Mã thực thi khi expression === value2
        break;
    default:
        // Mã thực thi khi không khớp với bất kỳ case nào
        break;
}
```

- **So sánh nghiêm ngặt**: `switch` so sánh giá trị bằng toán tử so sánh nghiêm ngặt `===`.
- **Lệnh `break`**: Bắt buộc phải có `break` để thoát khỏi cấu trúc `switch`. Nếu thiếu `break`, chương trình sẽ trôi xuống thực thi tiếp các case bên dưới bất kể điều kiện có khớp hay không (**hiện tượng Fall-through**).
- **Gom nhóm case**: Có thể xếp nhiều `case` liên tiếp cùng chia sẻ một khối lệnh.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const dayCode = 6;
let dayType = "";

switch (dayCode) {
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
        dayType = "Ngày trong tuần";
        break;
    case 7:
    case 8: // Chủ nhật
        dayType = "Cuối tuần";
        break;
    default:
        dayType = "Mã ngày không hợp lệ";
        break;
}

console.log(dayType); // "Ngày trong tuần"
```

- Các case từ 2 đến 6 không có lệnh `break` ở giữa, do đó khi `dayCode = 6`, nó rơi vào nhóm và gán `"Ngày trong tuần"`, sau đó gặp lệnh `break` để kết thúc.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên lệnh `break`**: Là lỗi phổ biến nhất, khiến mã của case kế tiếp bị chạy ngoài ý muốn.
- **Khác biệt kiểu dữ liệu**: Vì `switch` so sánh bằng `===`, nên `switch("1")` sẽ **không** khớp với `case 1:`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `switch` so sánh bằng toán tử nghiêm ngặt `===`.
2. Luôn nhớ đặt `break;` ở cuối mỗi case (trừ trường hợp chủ động gom nhóm).
3. Luôn có nhánh `default:` để phòng ngừa các giá trị ngoại lệ.
""",
        "exercise": {
            "title": "Tra cứu mã lỗi HTTP thường gặp",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng cấu trúc `switch-case-default` để tra cứu thông điệp phản hồi từ mã trạng thái HTTP nhận từ stdin.

### Yêu cầu đề bài:
Nhập vào một số nguyên `statusCode` từ stdin.
Hãy dùng `switch-case` để in ra thông báo tương ứng:
* `200`: `200 - OK`
* `400`: `400 - Bad Request`
* `401`: `401 - Unauthorized`
* `404`: `404 - Not Found`
* `500`: `500 - Internal Server Error`
* Mọi mã khác: `Loi khong xac dinh`

### Ví dụ:
* **Đầu vào:** `404`
* **Đầu ra:** `404 - Not Found`
* **Đầu vào:** `999`
* **Đầu ra:** `Loi khong xac dinh`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cấu trúc `switch`, `case`, `break`, `default`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["switch","case","break","default","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng đầy đủ cú pháp switch, case, break, default."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const statusCode = parseInt(input[0], 10);

// Sử dụng switch-case để in thông điệp tương ứng

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const statusCode = parseInt(input[0], 10);

switch (statusCode) {
    case 200:
        console.log("200 - OK");
        break;
    case 400:
        console.log("400 - Bad Request");
        break;
    case 401:
        console.log("401 - Unauthorized");
        break;
    case 404:
        console.log("404 - Not Found");
        break;
    case 500:
        console.log("500 - Internal Server Error");
        break;
    default:
        console.log("Loi khong xac dinh");
        break;
}
""",
            "test_cases": [
                {
                    "input": "404",
                    "expected_output": "404 - Not Found",
                    "is_hidden": False
                },
                {
                    "input": "200",
                    "expected_output": "200 - OK",
                    "is_hidden": True
                },
                {
                    "input": "500",
                    "expected_output": "500 - Internal Server Error",
                    "is_hidden": True
                },
                {
                    "input": "999",
                    "expected_output": "Loi khong xac dinh",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Cơ chế so sánh giữa biến đầu vào của switch và các giá trị trong case hoạt động theo toán tử nào?",
            "explanation": "Cấu trúc switch-case trong JavaScript so sánh bằng toán tử nghiêm ngặt '===', nghĩa là cả kiểu dữ liệu và giá trị đều phải khớp nhau.",
            "options": [
                {"key": "A", "text": "Toán tử so sánh lỏng lẻo ==", "is_correct": False},
                {"key": "B", "text": "Toán tử so sánh nghiêm ngặt ===", "is_correct": True},
                {"key": "C", "text": "Toán tử gán giá trị =", "is_correct": False},
                {"key": "D", "text": "Toán tử Object.is()", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-04",
        "chapter_id": "JS1-CH-04",
        "module_folder": "Module 04",
        "filename": "Lesson_04_04.md",
        "lesson_id": "JS1-04.04",
        "title": "Bài 4.4: Điều kiện lồng nhau & Xây dựng thuật toán kiểm tra dữ liệu phức hợp",
        "objective": "Kết hợp linh hoạt các câu lệnh điều kiện lồng nhau, kỹ thuật Guard Clauses (thoát sớm) để giải bài toán cước phí vận chuyển.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS1-04.04
title: "Điều kiện lồng nhau & Xây dựng thuật toán kiểm tra dữ liệu phức hợp"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Nested if", "Guard Clauses", "Thuật toán rẽ nhánh", "Validation", "Clean code"]
prerequisites: ["JS1-04.03"]
---

# Điều kiện lồng nhau & Xây dựng thuật toán kiểm tra dữ liệu phức hợp

## 1. Khái niệm & Vấn đề thực tế
Trong các bài toán thực tế (tính thuế, tính cước vận chuyển, kiểm duyệt đơn hàng), quyết định logic thường phụ thuộc vào nhiều tầng điều kiện lồng nhau (Nested Conditions).

Nếu lồng quá nhiều tầng `if` trong `if`, mã nguồn sẽ bị hiện tượng **"Kim tự tháp địa ngục (Pyramid of Doom)"**, gây khó đọc và dễ nhầm lẫn. Lập trình viên chuyên nghiệp áp dụng kỹ thuật **Guard Clauses (Lính gác / Thoát sớm)** để làm phẳng cấu trúc mã.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Cấu trúc điều kiện lồng nhau**:
  ```javascript
  if (isVip) {
      if (orderTotal > 500000) {
          discount = 0.2;
      } else {
          discount = 0.1;
      }
  } else {
      discount = 0.0;
  }
  ```
- **Kỹ thuật Guard Clauses**: Kiểm tra và xử lý các trường hợp lỗi hoặc điều kiện biên ngay ở đầu, giúp luồng chính luôn thông thoáng.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const weight = 3.5; // kg
const distance = 120; // km

let fee = 20000; // Cước cơ bản

// Tính thêm phụ phí trọng lượng
if (weight > 2.0) {
    fee += (weight - 2.0) * 5000;
}

// Tính thêm phụ phí khoảng cách
if (distance > 100) {
    fee += 15000;
}

console.log("Tổng cước:", fee);
```

- Bằng cách phân tách các điều kiện độc lập thành các khối `if` tuần tự, ta tránh được việc lồng ghép phức tạp.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lồng nhau quá 3 cấp độ**: Nếu mã nguồn của bạn có nhiều hơn 3 cấp ngoặc nhọn `{ { { } } }`, hãy cân nhắc tách nhỏ logic hoặc áp dụng toán tử logic `&&`, `||`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Điều kiện lồng nhau giúp phân loại dữ liệu đa chiều.
2. Áp dụng kỹ thuật phân tách điều kiện và Guard Clauses để mã nguồn luôn phẳng và dễ bảo trì.
""",
        "exercise": {
            "title": "Tính cước phí giao hàng theo trọng lượng và khoảng cách",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Xây dựng thuật toán phân nhánh đa điều kiện để tính tổng cước phí giao hàng từ dữ liệu stdin.

### Yêu cầu đề bài:
Nhập vào 2 số thực từ stdin:
1. `weight`: Trọng lượng bưu kiện (kg).
2. `distance`: Khoảng cách giao hàng (km).

Quy tắc tính cước:
1. **Cước cơ bản**:
   * Nếu `distance <= 10`: Cước cơ bản là `15000` VNĐ.
   * Nếu `distance > 10` và `<= 50`: Cước cơ bản là `30000` VNĐ.
   * Nếu `distance > 50`: Cước cơ bản là `50000` VNĐ.
2. **Phụ phí vượt cân**:
   * Nếu `weight > 2.0` (kg), mỗi kg vượt quá sẽ cộng thêm `5000` VNĐ:
     $$\\text{phuPhi} = (\\text{weight} - 2.0) \\times 5000$$
   * Nếu `weight <= 2.0`, phụ phí bằng `0`.
3. **Tổng cước**: $\\text{tongCuoc} = \\text{cuocCoBan} + \\text{phuPhi}$.

In ra màn hình theo định dạng 3 dòng:
```text
Cuoc co ban: <cuocCoBan> VNĐ
Phu phi: <phuPhi> VNĐ
Tong cuoc: <tongCuoc> VNĐ
```

### Ví dụ:
* **Đầu vào:** `3.5 25`
* **Đầu ra:**
```text
Cuoc co ban: 30000 VNĐ
Phu phi: 7500 VNĐ
Tong cuoc: 37500 VNĐ
```

### Ràng buộc kỹ thuật:
* Sử dụng cấu trúc điều kiện `if`, `else if`, `else`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["if","else","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Cần sử dụng câu lệnh điều kiện if-else để tính toán cước phí."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const weight = parseFloat(input[0]);
const distance = parseFloat(input[1]);

// Tính toán cước phí và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const weight = parseFloat(input[0]);
const distance = parseFloat(input[1]);

let baseFee = 0;
if (distance <= 10) {
    baseFee = 15000;
} else if (distance <= 50) {
    baseFee = 30000;
} else {
    baseFee = 50000;
}

let extraFee = 0;
if (weight > 2.0) {
    extraFee = (weight - 2.0) * 5000;
}

const totalFee = baseFee + extraFee;

console.log("Cuoc co ban: " + baseFee + " VNĐ");
console.log("Phu phi: " + extraFee + " VNĐ");
console.log("Tong cuoc: " + totalFee + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "3.5 25",
                    "expected_output": "Cuoc co ban: 30000 VNĐ\nPhu phi: 7500 VNĐ\nTong cuoc: 37500 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "1.5 5",
                    "expected_output": "Cuoc co ban: 15000 VNĐ\nPhu phi: 0 VNĐ\nTong cuoc: 15000 VNĐ",
                    "is_hidden": True
                },
                {
                    "input": "5.0 120",
                    "expected_output": "Cuoc co ban: 50000 VNĐ\nPhu phi: 15000 VNĐ\nTong cuoc: 65000 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Kỹ thuật 'Guard Clauses' trong lập trình có mục đích chính là gì?",
            "explanation": "Guard Clauses xử lý và loại trừ sớm các trường hợp ngoại lệ hoặc điều kiện biên ngay ở phần đầu hàm/khối lệnh, giúp tránh việc lồng ghép nhiều tầng if lồng nhau (Pyramid of Doom) và giữ cho luồng xử lý chính được rõ ràng, phẳng hơn.",
            "options": [
                {"key": "A", "text": "Tự động mã hóa dữ liệu người dùng để bảo mật.", "is_correct": False},
                {"key": "B", "text": "Thoát sớm khi gặp điều kiện biên để tránh lồng ghép nhiều tầng if, giữ mã nguồn phẳng và dễ đọc.", "is_correct": True},
                {"key": "C", "text": "Ngăn chặn người dùng nhập dữ liệu số âm.", "is_correct": False},
                {"key": "D", "text": "Tự động chèn dấu chấm phẩy vào cuối câu lệnh.", "is_correct": False}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"🚀 Seeding Course 1 Modules 3 & 4 ({len(lessons)} lessons)...")
    save_and_seed_lessons("Khóa 1 - JavaScript Cơ bản", lessons)
