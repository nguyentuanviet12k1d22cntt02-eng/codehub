import sys
from js_seeder_helper import save_and_seed_lessons

sys.stdout.reconfigure(encoding='utf-8')

lessons = [
    # ========================================================
    # MODULE 13: Xử lý lỗi (Error Handling), Debugging & Data Validation
    # ========================================================
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-13",
        "chapter_id": "JS2-CH-13",
        "module_folder": "Module 05",
        "filename": "Lesson_13_01.md",
        "lesson_id": "JS2-13.01",
        "title": "Bài 13.1: Phân loại lỗi: SyntaxError, TypeError, ReferenceError, RangeError",
        "objective": "Nhận diện và phân biệt chính xác 4 loại lỗi runtime phổ biến nhất trong JavaScript để định hướng debug nhanh chóng.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS2-13.01
title: "Phân loại lỗi: SyntaxError, TypeError, ReferenceError, RangeError"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["SyntaxError", "TypeError", "ReferenceError", "RangeError", "Error types"]
prerequisites: ["JS2-12.05"]
---

# Phân loại lỗi: SyntaxError, TypeError, ReferenceError, RangeError

## 1. Khái niệm & Vấn đề thực tế
Khi một chương trình JavaScript gặp sự cố, Engine sẽ dừng thực thi và ném ra một đối tượng lỗi (Error Object) kèm theo tên loại lỗi và thông điệp mô tả.
Hiểu đúng bản chất của từng loại lỗi giúp lập trình viên khoanh vùng và khắc phục sự cố ngay lập tức.

---

## 2. Cú pháp & Quy tắc cốt lõi
1. **`SyntaxError` (Lỗi cú pháp)**: Xảy ra trong pha biên dịch khi mã vi phạm ngữ pháp của ngôn ngữ (ví dụ: thiếu ngoặc, gán giá trị cho biểu thức `10 = x`).
2. **`ReferenceError` (Lỗi tham chiếu)**: Xảy ra khi cố gắng truy cập vào một biến chưa hề được khai báo hoặc đang nằm trong vùng TDZ.
3. **`TypeError` (Lỗi kiểu dữ liệu)**: Xảy ra khi thực hiện thao tác không hợp lệ trên một kiểu dữ liệu (ví dụ: gọi một biến không phải hàm `x()`, truy cập thuộc tính trên `null`/`undefined`, gán lại biến `const`).
4. **`RangeError` (Lỗi vượt ngưỡng)**: Xảy ra khi truyền tham số nằm ngoài phạm vi cho phép (ví dụ: `new Array(-1)`, đệ quy vô tận làm tràn ngăn xếp `Maximum call stack size exceeded`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Ví dụ 1: ReferenceError
// console.log(notDefinedVar);

// Ví dụ 2: TypeError
const num = 123;
// num.toUpperCase(); // TypeError: num.toUpperCase is not a function

// Ví dụ 3: RangeError
// (123.45).toFixed(200); // RangeError: toFixed() digits argument must be between 0 and 100
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Bỏ qua tên loại lỗi khi đọc log**: Luôn đọc từ đầu thông điệp lỗi để biết đó là `TypeError` hay `ReferenceError` trước khi đọc đến dòng code chỉ định.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `ReferenceError`: Biến không tồn tại.
2. `TypeError`: Thao tác sai kiểu dữ liệu.
3. `RangeError`: Giá trị vượt quá dải cho phép.
""",
        "exercise": {
            "title": "Nhận diện phân loại lỗi runtime",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Viết chương trình bắt lỗi bằng `try...catch` và in ra tên chính xác của loại lỗi (`error.name`).

### Yêu cầu đề bài:
Cho một chuỗi mã lỗi `errType` từ stdin:
* Nếu `errType === "REF"`: cố tình truy cập biến chưa khai báo để sinh `ReferenceError`.
* Nếu `errType === "TYPE"`: cố tình gọi phương thức không tồn tại trên số `(123).toUpperCase()` để sinh `TypeError`.
* Nếu `errType === "RANGE"`: tạo mảng có kích thước âm `new Array(-5)` để sinh `RangeError`.

Sử dụng khối `try...catch` để bắt lỗi và in ra tên của loại lỗi:
```text
Loai loi bat duoc: <error.name>
```

### Ví dụ:
* **Đầu vào:** `TYPE`
* **Đầu ra:** `Loai loi bat duoc: TypeError`
* **Đầu vào:** `REF`
* **Đầu ra:** `Loai loi bat duoc: ReferenceError`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng khối `try...catch` và in thuộc tính `error.name`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["try","catch","error.name","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng try...catch và in ra error.name."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const errType = input[0];

// Dùng try...catch để kích hoạt và bắt lỗi theo yêu cầu

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const errType = input[0];

try {
    if (errType === "REF") {
        // @ts-ignore
        console.log(undefinedVariableABC);
    } else if (errType === "TYPE") {
        const n = 123;
        // @ts-ignore
        n.toUpperCase();
    } else if (errType === "RANGE") {
        const arr = new Array(-5);
    }
} catch (error) {
    console.log("Loai loi bat duoc:", error.name);
}
""",
            "test_cases": [
                {
                    "input": "TYPE",
                    "expected_output": "Loai loi bat duoc: TypeError",
                    "is_hidden": False
                },
                {
                    "input": "REF",
                    "expected_output": "Loai loi bat duoc: ReferenceError",
                    "is_hidden": True
                },
                {
                    "input": "RANGE",
                    "expected_output": "Loai loi bat duoc: RangeError",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Đoạn mã `const user = null; console.log(user.profile.name);` sẽ làm phát sinh loại lỗi nào?",
            "explanation": "Biến user mang giá trị null. Khi cố gắng truy cập thuộc tính '.profile' của giá trị null, JavaScript Engine sẽ ném ra lỗi TypeError (Cannot read properties of null).",
            "options": [
                {"key": "A", "text": "ReferenceError", "is_correct": False},
                {"key": "B", "text": "TypeError", "is_correct": True},
                {"key": "C", "text": "SyntaxError", "is_correct": False},
                {"key": "D", "text": "RangeError", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-13",
        "chapter_id": "JS2-CH-13",
        "module_folder": "Module 05",
        "filename": "Lesson_13_02.md",
        "lesson_id": "JS2-13.02",
        "title": "Bài 13.2: Bắt lỗi an toàn với khối try...catch...finally",
        "objective": "Làm chủ cơ chế phòng thủ với try, xử lý ngoại lệ trong catch và đảm bảo dọn dẹp tài nguyên với khối finally luôn luôn chạy.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS2-13.02
title: "Bắt lỗi an toàn với khối try...catch...finally"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["try", "catch", "finally", "Exception Handling", "JSON.parse"]
prerequisites: ["JS2-13.01"]
---

# Bắt lỗi an toàn với khối try...catch...finally

## 1. Khái niệm & Vấn đề thực tế
Khi làm việc với dữ liệu bên ngoài (đọc tệp, phân tích cú pháp JSON nhận từ người dùng), lỗi có thể xảy ra bất cứ lúc nào. Nếu không được bao bọc kiểm soát, chương trình sẽ lập tức bị crash (sập toàn bộ tiến trình).

Khối `try...catch...finally` cung cấp cơ chế xử lý ngoại lệ duy nhứt giúp chương trình tiếp tục hoạt động an toàn.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
try {
    // 1. Khối mã có nguy cơ phát sinh lỗi
} catch (error) {
    // 2. Khối mã xử lý khi có lỗi xảy ra (error.message, error.name)
} finally {
    // 3. Khối mã LUÔN LUÔN CHẠY bất kể có lỗi hay không (dọn dẹp tài nguyên)
}
```

- Khối `finally` đảm bảo chạy ngay cả khi bên trong `try` hoặc `catch` có câu lệnh `return`!

---

## 3. Ví dụ trực quan: Phân tích JSON an toàn

```javascript
function safeParseJson(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    } finally {
        console.log("Hoàn tất tiến trình parse");
    }
}

console.log(safeParseJson('{"name": "JS"}'));
console.log(safeParseJson('invalid json string'));
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng try-catch rỗng**: Viết `catch (e) {}` và giấu nhẹm lỗi sẽ biến các bug nghiêm trọng thành lỗi ẩn không thể điều tra. Luôn log hoặc xử lý lỗi rõ ràng.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Đặt mã có nguy cơ sập vào `try`.
2. Xử lý phục hồi trong `catch`.
3. Đặt các tác vụ dọn dẹp (đóng file, reset kết nối) vào `finally`.
""",
        "exercise": {
            "title": "Phân tích cú pháp chuỗi JSON an toàn",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng `try...catch...finally` để phân tích cú pháp một chuỗi JSON nhận từ stdin mà không làm chương trình bị crash khi chuỗi bị lỗi.

### Yêu cầu đề bài:
Nhập vào một chuỗi `rawJson` từ stdin.
1. Trong khối `try`: dùng `JSON.parse(rawJson)` để phân tích cú pháp. Nếu thành công, in ra `Parse thanh cong: <data.id>`.
2. Trong khối `catch (err)`: in ra `Parse that bai: <err.name>`.
3. Trong khối `finally`: luôn in ra dòng `Ket thuc tien trinh`.

### Ví dụ:
* **Đầu vào:** `{"id":101,"name":"MCode"}`
* **Đầu ra:**
```text
Parse thanh cong: 101
Ket thuc tien trinh
```
* **Đầu vào:** `{bad_json_string}`
* **Đầu ra:**
```text
Parse that bai: SyntaxError
Ket thuc tien trinh
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng đầy đủ 3 khối `try`, `catch`, `finally`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["try","catch","finally","JSON.parse","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng đầy đủ cả 3 khối try, catch, finally."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();

// Phân tích chuỗi JSON an toàn với try...catch...finally

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();

try {
    const data = JSON.parse(input);
    console.log("Parse thanh cong:", data.id);
} catch (err) {
    console.log("Parse that bai:", err.name);
} finally {
    console.log("Ket thuc tien trinh");
}
""",
            "test_cases": [
                {
                    "input": "{\"id\":101,\"name\":\"MCode\"}",
                    "expected_output": "Parse thanh cong: 101\nKet thuc tien trinh",
                    "is_hidden": False
                },
                {
                    "input": "{bad_json_string}",
                    "expected_output": "Parse that bai: SyntaxError\nKet thuc tien trinh",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Đặc tính nào sau đây của khối `finally` là ĐÚNG?",
            "explanation": "Khối 'finally' luôn luôn được thực thi trong mọi tình huống (dù có lỗi hay không có lỗi xảy ra trong khối try, và kể cả khi khối try hoặc catch đã gặp câu lệnh return).",
            "options": [
                {"key": "A", "text": "Khối finally chỉ chạy khi có lỗi xảy ra trong khối try.", "is_correct": False},
                {"key": "B", "text": "Khối finally luôn luôn được thực thi bất kể có lỗi hay không, ngay cả khi try hoặc catch có lệnh return.", "is_correct": True},
                {"key": "C", "text": "Khối finally tự động bỏ qua nếu catch đã chạy.", "is_correct": False},
                {"key": "D", "text": "finally chỉ dùng được trong môi trường Node.js.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-13",
        "chapter_id": "JS2-CH-13",
        "module_folder": "Module 05",
        "filename": "Lesson_13_03.md",
        "lesson_id": "JS2-13.03",
        "title": "Bài 13.3: Chủ động ném lỗi với throw & Custom Error Class",
        "objective": "Làm chủ lệnh throw để chủ động ném ngoại lệ, tạo lớp lỗi chuyên biệt Custom Error kế thừa lớp chuẩn Error.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS2-13.03
title: "Chủ động ném lỗi với throw & Custom Error Class"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["throw", "Custom Error", "class ValidationError extends Error", "Tạo lỗi tùy chỉnh"]
prerequisites: ["JS2-13.02"]
---

# Chủ động ném lỗi với throw & Custom Error Class

## 1. Khái niệm & Vấn đề thực tế
Ngoài các lỗi hệ thống do JavaScript Engine tự sinh, trong quá trình xử lý nghiệp vụ kinh doanh (Business Logic) như kiểm tra số dư không đủ, tuổi không hợp lệ, email sai định dạng, ta cần **chủ động ném ra lỗi (throw Error)** để chặn đứng chu trình xử lý sai lệch.

Để phân biệt lỗi nghiệp vụ với các lỗi hệ thống khác, chuẩn mực tốt nhất là tạo ra các **Custom Error Classes** kế thừa từ lớp cha `Error`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Lệnh `throw`**:
  `throw new Error("Thông điệp mô tả lỗi");`
- **Tạo Custom Error Class**:
  ```javascript
  class ValidationError extends Error {
      constructor(message) {
          super(message);
          this.name = "ValidationError";
      }
  }
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
class InsufficientFundsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InsufficientFundsError";
    }
}

function withdraw(balance, amount) {
    if (amount > balance) {
        throw new InsufficientFundsError("Số dư không đủ để thực hiện giao dịch!");
    }
    return balance - amount;
}

try {
    withdraw(50000, 100000);
} catch (err) {
    console.log(`${err.name}: ${err.message}`);
}
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Ném chuỗi nguyên thủy**: Tránh viết `throw "Lỗi rồi";` vì chuỗi thông thường không chứa thông tin Stack Trace. Luôn ném một đối tượng `new Error(...)` hoặc Custom Error.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `throw new Error(...)` để chủ động báo lỗi nghiệp vụ.
2. Tạo Custom Error bằng cách `class MyError extends Error`.
""",
        "exercise": {
            "title": "Kiểm tra độ tuổi với Custom ValidationError",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Xây dựng lớp lỗi tùy chỉnh `ValidationError extends Error` và sử dụng câu lệnh `throw` để kiểm tra độ tuổi đăng ký lái xe.

### Yêu cầu đề bài:
Nhập vào một số nguyên `age` từ stdin.
1. Định nghĩa lớp `ValidationError extends Error`:
```javascript
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
```
2. Viết hàm `validateAge(age)`:
   * Nếu `age < 18`: ném ra `new ValidationError("Chua du 18 tuoi")`.
   * Nếu `age > 100`: ném ra `new ValidationError("Do tuoi khong hop le")`.
   * Ngược lại: trả về chuỗi `"Hop le"`.
3. Gọi hàm bên trong `try...catch`:
   * Nếu hợp lệ: in `Ket qua: Hop le`
   * Nếu bắt được lỗi: in `Loi: <err.name> - <err.message>`

### Ví dụ:
* **Đầu vào:** `15`
* **Đầu ra:** `Loi: ValidationError - Chua du 18 tuoi`
* **Đầu vào:** `20`
* **Đầu ra:** `Ket qua: Hop le`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `class ValidationError extends Error` và `throw new ValidationError(...)`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["class ValidationError extends Error","throw new ValidationError","try","catch","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng class ValidationError extends Error và lệnh throw."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const age = parseInt(input[0], 10);

// Xây dựng ValidationError và hàm validateAge

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const age = parseInt(input[0], 10);

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

function validateAge(a) {
    if (a < 18) {
        throw new ValidationError("Chua du 18 tuoi");
    }
    if (a > 100) {
        throw new ValidationError("Do tuoi khong hop le");
    }
    return "Hop le";
}

try {
    const res = validateAge(age);
    console.log("Ket qua:", res);
} catch (err) {
    console.log(`Loi: ${err.name} - ${err.message}`);
}
""",
            "test_cases": [
                {
                    "input": "15",
                    "expected_output": "Loi: ValidationError - Chua du 18 tuoi",
                    "is_hidden": False
                },
                {
                    "input": "20",
                    "expected_output": "Ket qua: Hop le",
                    "is_hidden": False
                },
                {
                    "input": "105",
                    "expected_output": "Loi: ValidationError - Do tuoi khong hop le",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Vì sao việc kế thừa từ lớp chuẩn `Error` (`class MyError extends Error`) được coi là quy chuẩn tốt nhất khi tạo lỗi tùy biến trong JavaScript?",
            "explanation": "Kế thừa từ lớp Error chuẩn đảm bảo đối tượng lỗi tùy biến tự động có đầy đủ thuộc tính 'message', 'name' và đặc biệt là thông tin dấu vết thực thi 'stack trace' giúp lập trình viên xác định chính xác dòng mã nguồn gây lỗi.",
            "options": [
                {"key": "A", "text": "Vì nếu không kế thừa từ Error thì không thể dùng được câu lệnh throw.", "is_correct": False},
                {"key": "B", "text": "Vì kế thừa từ Error giúp đối tượng lỗi tự động có đầy đủ thuộc tính chuẩn (name, message) và dấu vết ngăn xếp (stack trace) phục vụ debug.", "is_correct": True},
                {"key": "C", "text": "Vì lớp Error chạy nhanh hơn các object thông thường.", "is_correct": False},
                {"key": "D", "text": "Vì trình duyệt sẽ tự động gửi email cho người phát triển.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-13",
        "chapter_id": "JS2-CH-13",
        "module_folder": "Module 05",
        "filename": "Lesson_13_04.md",
        "lesson_id": "JS2-13.04",
        "title": "Bài 13.4: Chiến lược Data Validation & Debugging với console và Stack Trace",
        "objective": "Thiết lập tư duy kiểm thử và xác thực dữ liệu đầu vào (Input Validation Pipeline), phân tích Stack Trace và sử dụng các công cụ console chuyên sâu.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS2-13.04
title: "Chiến lược Data Validation & Debugging với console và Stack Trace"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Data Validation", "Stack Trace", "console.table", "console.time", "Debugging"]
prerequisites: ["JS2-13.03"]
---

# Chiến lược Data Validation & Debugging với console và Stack Trace

## 1. Khái niệm & Vấn đề thực tế
Nguyên tắc cốt lõi của lập trình an toàn: **"Never trust user input" (Không bao giờ tin tưởng dữ liệu người dùng nhập vào)**.
Mọi dữ liệu tiếp nhận từ bên ngoài đều phải đi qua một bộ lọc xác thực (**Validation Pipeline**) trước khi được đưa vào xử lý tính toán.

Bên cạnh đó, việc đọc hiểu vết thực thi (**Stack Trace**) là kỹ năng sống còn giúp xác định vị trí chuỗi hàm nào đã gọi hàm gây lỗi.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Các phương thức console nâng cao**:
  - `console.table(data)`: In mảng hoặc đối tượng dưới dạng bảng trực quan.
  - `console.time("label")` & `console.timeEnd("label")`: Đo chính xác thời gian thực thi của một đoạn mã.
  - `console.trace()`: In ra dấu vết Call Stack tại vị trí hiện tại.
- **Mô hình Validation kết hợp danh sách lỗi**:
  Gom tất cả các lỗi vi phạm vào một mảng thay vì dừng lại ở lỗi đầu tiên, giúp người dùng biết toàn bộ các lỗi cần sửa cùng một lúc.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function validateUser(user) {
    const errors = [];

    if (!user.username || user.username.length < 3) {
        errors.push("Username phải có ít nhất 3 ký tự");
    }
    if (!user.email || !user.email.includes("@")) {
        errors.push("Email không hợp lệ");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên xóa các dòng `console.log` debug rác** trước khi triển khai sản phẩm.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Luôn validate dữ liệu ngay tại ranh giới đầu vào.
2. Dùng `console.table()` để trực quan hóa dữ liệu mảng/đối tượng khi debug.
""",
        "exercise": {
            "title": "Xây dựng hàm kiểm định hồ sơ người dùng",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Xây dựng hàm xác thực dữ liệu đầu vào gom danh sách lỗi và in báo cáo chuẩn hóa.

### Yêu cầu đề bài:
Nhập vào 3 thông tin từ stdin:
1. `username`: Tên đăng nhập (chuỗi).
2. `email`: Địa chỉ email (chuỗi).
3. `score`: Điểm số (số nguyên).

Quy tắc xác thực:
1. `username` phải có độ dài ít nhất 4 ký tự (`username.length >= 4`). Nếu sai, thêm lỗi: `"Username qua ngan"`.
2. `email` phải chứa ký tự `"@"` (`email.includes("@")`). Nếu sai, thêm lỗi: `"Email khong hop le"`.
3. `score` phải nằm trong đoạn từ 0 đến 100 (`score >= 0 && score <= 100`). Nếu sai, thêm lỗi: `"Diem khong hop le"`.

Nếu không có lỗi nào: in ra dòng:
```text
Trang thai: HOP LE
```
Nếu có lỗi: in ra 2 dòng:
```text
Trang thai: KHONG HOP LE
Loi: <cac_loi_cach_nhau_boi_dau_cham_phay_va_khoang_trang>
```

### Ví dụ:
* **Đầu vào:** `admin admin@mcode.com 95`
* **Đầu ra:**
```text
Trang thai: HOP LE
```
* **Đầu vào:** `abc admin_mcode.com 150`
* **Đầu ra:**
```text
Trang thai: KHONG HOP LE
Loi: Username qua ngan; Email khong hop le; Diem khong hop le
```

### Ràng buộc kỹ thuật:
* Thu thập toàn bộ lỗi vào một mảng `errors` và nối bằng `.join("; ")`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["errors","join","; ","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu gom các lỗi vào mảng errors và nối lại bằng .join('; ')."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const username = input[0];
const email = input[1];
const score = parseInt(input[2], 10);

// Thực hiện xác thực dữ liệu và in báo cáo

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const username = input[0];
const email = input[1];
const score = parseInt(input[2], 10);

const errors = [];

if (username.length < 4) {
    errors.push("Username qua ngan");
}
if (!email.includes("@")) {
    errors.push("Email khong hop le");
}
if (score < 0 || score > 100) {
    errors.push("Diem khong hop le");
}

if (errors.length === 0) {
    console.log("Trang thai: HOP LE");
} else {
    console.log("Trang thai: KHONG HOP LE");
    console.log("Loi:", errors.join("; "));
}
""",
            "test_cases": [
                {
                    "input": "admin admin@mcode.com 95",
                    "expected_output": "Trang thai: HOP LE",
                    "is_hidden": False
                },
                {
                    "input": "abc admin_mcode.com 150",
                    "expected_output": "Trang thai: KHONG HOP LE\nLoi: Username qua ngan; Email khong hop le; Diem khong hop le",
                    "is_hidden": False
                },
                {
                    "input": "dev test@test.com -5",
                    "expected_output": "Trang thai: KHONG HOP LE\nLoi: Diem khong hop le",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Thuộc tính `error.stack` (Stack Trace) trong đối tượng Error cung cấp thông tin quý giá nào?",
            "explanation": "Stack Trace cung cấp bản đồ chuỗi các hàm đã được gọi tuần tự (Call Stack) dẫn tới vị trí xảy ra lỗi, kèm theo tên tệp tin và số dòng cụ thể nơi lỗi phát sinh.",
            "options": [
                {"key": "A", "text": "Dung lượng bộ nhớ RAM còn trống của máy tính.", "is_correct": False},
                {"key": "B", "text": "Chuỗi thứ tự các hàm đã được gọi trong Call Stack dẫn đến vị trí xảy ra lỗi kèm theo tên file và số dòng cụ thể.", "is_correct": True},
                {"key": "C", "text": "Địa chỉ IP của người dùng truy cập.", "is_correct": False},
                {"key": "D", "text": "Tất cả các biến toàn cục trong hệ điều hành.", "is_correct": False}
            ]
        }
    },

    # ========================================================
    # MODULE 14: Module hóa mã nguồn & Dự án thuần JavaScript
    # ========================================================
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-14",
        "chapter_id": "JS2-CH-14",
        "module_folder": "Module 06",
        "filename": "Lesson_14_01.md",
        "lesson_id": "JS2-14.01",
        "title": "Bài 14.1: Hệ thống mô-đun: CommonJS (require) vs ES Modules (import/export)",
        "objective": "Phân biệt hai chuẩn mô-đun hóa chính trong hệ sinh thái JavaScript: CommonJS (đồng bộ, runtime) và ES Modules (chuẩn hóa ECMAScript, tĩnh, bất đồng bộ).",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS2-14.01
title: "Hệ thống mô-đun: CommonJS (require) vs ES Modules (import/export)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["CommonJS", "ES Modules", "require", "module.exports", "import", "export"]
prerequisites: ["JS2-13.04"]
---

# Hệ thống mô-đun: CommonJS (require) vs ES Modules (import/export)

## 1. Khái niệm & Vấn đề thực tế
Khi dự án phát triển từ vài chục dòng lên hàng nghìn dòng, việc nhồi nhét tất cả mã nguồn vào một file duy nhất sẽ dẫn đến thảm họa bảo trì. **Module hóa (Modularization)** là kỹ thuật chia nhỏ chương trình thành các file độc lập, mỗi file đảm nhận một chức năng duy nhất.

Hai hệ thống mô-đun chủ đạo:
1. **CommonJS (CJS)**: Chuẩn truyền thống của Node.js, sử dụng `require()` và `module.exports`.
2. **ES Modules (ESM)**: Chuẩn chính thức của ECMAScript từ ES6, sử dụng cú pháp `import` và `export`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **CommonJS (CJS)**:
  ```javascript
  // mathUtils.js
  const add = (a, b) => a + b;
  module.exports = { add };

  // main.js
  const { add } = require('./mathUtils');
  ```
- **ES Modules (ESM)**:
  ```javascript
  // mathUtils.mjs
  export const add = (a, b) => a + b;

  // main.mjs
  import { add } from './mathUtils.mjs';
  ```

---

## 3. So sánh đối chiếu kỹ thuật
| Tiêu chí | CommonJS (CJS) | ES Modules (ESM) |
| :--- | :--- | :--- |
| **Cú pháp** | `require()` / `module.exports` | `import` / `export` |
| **Thời điểm tải** | Động tại Runtime (Synchronous) | Tĩnh tại Compile time (Static/Async) |
| **Tree Shaking** | Khó tối ưu hóa | Hỗ trợ loại bỏ mã chết tuyệt vời |
| **Môi trường** | Mặc định Node.js cổ điển | Chuẩn Modern JS, Browser & Node hiện đại |

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Trộn lẫn CJS và ESM**: Không thể dùng `import` bên trong file CommonJS mà chưa cấu hình `"type": "module"` trong `package.json`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. CJS dùng `require` / `module.exports`.
2. ESM dùng `import` / `export` - là tiêu chuẩn cho tương lai.
""",
        "exercise": {
            "title": "Thiết kế mô-đun tính toán hình học chuẩn CommonJS",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Tổ chức và xuất các hàm tính toán hình học vào đối tượng `module.exports` theo chuẩn CommonJS.

### Yêu cầu đề bài:
Nhập vào bán kính hình tròn $R$ (số thực) từ stdin.
Định nghĩa đối tượng mô-đun hình học:
```javascript
const geometry = {
    PI: 3.14159,
    circleArea(r) {
        return this.PI * r * r;
    },
    circlePerimeter(r) {
        return 2 * this.PI * r;
    }
};
```
Tính diện tích và chu vi của hình tròn bán kính $R$, làm tròn 2 chữ số thập phân.
In kết quả ra màn hình theo đúng định dạng 2 dòng:
```text
Dien tich: <dienTich lam tron 2 chu so>
Chu vi: <chuVi lam tron 2 chu so>
```

### Ví dụ:
* **Đầu vào:** `5`
* **Đầu ra:**
```text
Dien tich: 78.54
Chu vi: 31.42
```

### Ràng buộc kỹ thuật:
* Sử dụng đối tượng mô phỏng module `geometry` và phương thức `.toFixed(2)`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["circleArea","circlePerimeter","toFixed","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu viết các phương thức circleArea và circlePerimeter trong geometry."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const r = parseFloat(input[0]);

// Thiết kế mô-đun geometry và in kết quả tính toán

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const r = parseFloat(input[0]);

const geometry = {
    PI: 3.14159,
    circleArea(radius) {
        return this.PI * radius * radius;
    },
    circlePerimeter(radius) {
        return 2 * this.PI * radius;
    }
};

console.log("Dien tich:", geometry.circleArea(r).toFixed(2));
console.log("Chu vi:", geometry.circlePerimeter(r).toFixed(2));
""",
            "test_cases": [
                {
                    "input": "5",
                    "expected_output": "Dien tich: 78.54\nChu vi: 31.42",
                    "is_hidden": False
                },
                {
                    "input": "10",
                    "expected_output": "Dien tich: 314.16\nChu vi: 62.83",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Ưu điểm kỹ thuật vượt trội nhất của ES Modules (import/export) so với CommonJS (require) là gì?",
            "explanation": "ES Modules có cấu trúc nhập xuất tĩnh (Static Structure), nghĩa là các phụ thuộc được xác định ngay trong pha phân tích cú pháp trước khi chạy mã. Điều này cho phép các công cụ đóng gói (bundlers) thực hiện kỹ thuật 'Tree Shaking' để tự động loại bỏ các đoạn mã thừa không dùng đến.",
            "options": [
                {"key": "A", "text": "ES Modules không cần dùng bộ nhớ RAM.", "is_correct": False},
                {"key": "B", "text": "Cấu trúc tĩnh (Static) cho phép tối ưu hóa loại bỏ mã thừa (Tree Shaking) ngay tại thời điểm biên dịch.", "is_correct": True},
                {"key": "C", "text": "CommonJS không thể chạy được trên Node.js.", "is_correct": False},
                {"key": "D", "text": "ES Modules chỉ xuất được chuỗi văn bản.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-14",
        "chapter_id": "JS2-CH-14",
        "module_folder": "Module 06",
        "filename": "Lesson_14_02.md",
        "lesson_id": "JS2-14.02",
        "title": "Bài 14.2: Named Export vs Default Export & Nguyên tắc Single Responsibility (SRP)",
        "objective": "Phân biệt Named Export và Default Export trong mô-đun, áp dụng nguyên lý đơn trách nhiệm (Single Responsibility Principle) để thiết kế mô-đun sạch.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS2-14.02
title: "Named Export vs Default Export & Nguyên tắc Single Responsibility (SRP)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Named Export", "Default Export", "Single Responsibility", "Clean Architecture", "ESM"]
prerequisites: ["JS2-14.01"]
---

# Named Export vs Default Export & Nguyên tắc Single Responsibility (SRP)

## 1. Khái niệm & Vấn đề thực tế
Trong chuẩn ES Modules, ta có hai cách xuất bản dữ liệu ra bên ngoài:
1. **Named Export**: Xuất nhiều thành phần theo tên cụ thể (`export const A = ...`). Khi import, bắt buộc phải dùng đúng tên đó trong ngoặc nhọn `{ A }`.
2. **Default Export**: Mỗi mô-đun chỉ được có **duy nhất một** Default Export (`export default ...`). Bên import có thể tự do đặt tên tùy ý.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Named Export**:
  ```javascript
  export function formatCurrency(amount) { ... }
  export function formatDate(date) { ... }
  // Import:
  import { formatCurrency, formatDate } from './formatters.js';
  ```
- **Default Export**:
  ```javascript
  export default class UserAuth { ... }
  // Import:
  import UserAuth from './UserAuth.js';
  ```
- **Nguyên tắc Single Responsibility (SRP)**: Mỗi file/module chỉ nên chịu trách nhiệm cho duy nhất một thực thể hoặc một nhóm chức năng liên quan mật thiết.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Mô-đun tiện ích định dạng
const formatters = {
    currency(val) {
        return val.toLocaleString("vi-VN") + " đ";
    },
    percentage(rate) {
        return (rate * 100).toFixed(1) + "%";
    }
};

console.log(formatters.currency(500000)); // "500.000 đ"
console.log(formatters.percentage(0.125)); // "12.5%"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng Default Export**: Đặt tên tự do khi import có thể khiến hai thành viên trong nhóm đặt hai tên khác nhau cho cùng một module, gây khó khăn cho việc tìm kiếm toàn cục (Find in Files). Ưu tiên dùng Named Export cho các thư viện tiện ích.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Một file có thể có nhiều Named Exports nhưng chỉ có 1 Default Export.
2. Thiết kế mô-đun theo nguyên lý SRP: đơn trách nhiệm, dễ kiểm thử.
""",
        "exercise": {
            "title": "Mô-đun định dạng dữ liệu tài chính",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Xây dựng mô-đun định dạng tài chính chứa các phương thức định dạng tiền tệ và tỷ lệ phần trăm.

### Yêu cầu đề bài:
Nhập vào từ stdin một số nguyên `amount` (ví dụ `1250000`) và một số thực `rate` (ví dụ `0.085`).
Xây dựng đối tượng `financeFormatter`:
* Phương thức `formatVND(num)`: trả về `<num> VNĐ`.
* Phương thức `formatPercent(r)`: trả về `<(r * 100).toFixed(1)>%`.

In ra màn hình theo định dạng 2 dòng:
```text
So tien: <financeFormatter.formatVND(amount)>
Ti le: <financeFormatter.formatPercent(rate)>
```

### Ví dụ:
* **Đầu vào:** `1250000 0.085`
* **Đầu ra:**
```text
So tien: 1250000 VNĐ
Ti le: 8.5%
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng đối tượng `financeFormatter` có chứa 2 phương thức `formatVND` và `formatPercent`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["formatVND","formatPercent","toFixed","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng financeFormatter chứa formatVND và formatPercent."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const amount = parseInt(input[0], 10);
const rate = parseFloat(input[1]);

// Xây dựng financeFormatter và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const amount = parseInt(input[0], 10);
const rate = parseFloat(input[1]);

const financeFormatter = {
    formatVND(num) {
        return num + " VNĐ";
    },
    formatPercent(r) {
        return (r * 100).toFixed(1) + "%";
    }
};

console.log("So tien:", financeFormatter.formatVND(amount));
console.log("Ti le:", financeFormatter.formatPercent(rate));
""",
            "test_cases": [
                {
                    "input": "1250000 0.085",
                    "expected_output": "So tien: 1250000 VNĐ\nTi le: 8.5%",
                    "is_hidden": False
                },
                {
                    "input": "500000 0.12",
                    "expected_output": "So tien: 500000 VNĐ\nTi le: 12.0%",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Một tệp mô-đun ES Module (ESM) có thể có tối đa bao nhiêu `export default`?",
            "explanation": "Theo chuẩn đặc tả ECMAScript, mỗi tệp mô-đun chỉ được phép có duy nhất MỘT export default. Nếu cố tình khai báo nhiều hơn một export default trong cùng một file, JavaScript Engine sẽ báo lỗi SyntaxError.",
            "options": [
                {"key": "A", "text": "Không giới hạn số lượng.", "is_correct": False},
                {"key": "B", "text": "Chỉ duy nhất một (1).", "is_correct": True},
                {"key": "C", "text": "Tối đa hai (2).", "is_correct": False},
                {"key": "D", "text": "Phụ thuộc vào dung lượng tệp.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-14",
        "chapter_id": "JS2-CH-14",
        "module_folder": "Module 06",
        "filename": "Lesson_14_03.md",
        "lesson_id": "JS2-14.03",
        "title": "Bài 14.3: Dự án Mini Console: Hệ thống quản lý thực thể sinh viên",
        "objective": "Tích hợp toàn bộ kiến thức về Array, Object, Class và Higher-Order Methods để xây dựng hệ thống quản lý sinh viên CRUD trong bộ nhớ.",
        "difficulty": "HARD",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS2-14.03
title: "Dự án Mini Console: Hệ thống quản lý thực thể sinh viên"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Mini Project", "CRUD in memory", "StudentManager", "OOP Integration"]
prerequisites: ["JS2-14.02"]
---

# Dự án Mini Console: Hệ thống quản lý thực thể sinh viên

## 1. Khái niệm & Vấn đề thực tế
Trong bài toán thực tế của các ứng dụng quản lý dữ liệu trong bộ nhớ (In-memory Store / Repository Pattern), ta cần xây dựng một lớp chuyên trách chịu trách nhiệm toàn bộ các thao tác:
- **C (Create)**: Thêm sinh viên mới.
- **R (Read)**: Tìm kiếm sinh viên theo mã định danh hoặc tính điểm trung bình toàn khóa.
- **U (Update)**: Cập nhật thông tin điểm.
- **D (Delete)**: Xóa sinh viên khỏi hệ thống.

---

## 2. Cấu trúc thiết kế hệ thống
- Lớp `Student`: Đại diện cho một đối tượng sinh viên đơn lẻ.
- Lớp `StudentManager`: Quản lý danh sách sinh viên nội bộ và cung cấp các phương thức nghiệp vụ.

---

## 3. Ví dụ trực quan

```javascript
class StudentManager {
    constructor() {
        this.students = [];
    }
    addStudent(id, name, score) {
        this.students.push({ id, name, score });
    }
    findStudent(id) {
        return this.students.find(s => s.id === id);
    }
    getAverageScore() {
        if (this.students.length === 0) return 0;
        const total = this.students.reduce((sum, s) => sum + s.score, 0);
        return total / this.students.length;
    }
}
```

---

## 4. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Đóng gói danh sách thực thể bên trong lớp quản lý.
2. Vận dụng `find()`, `filter()`, `reduce()` để xử lý nghiệp vụ nhanh chóng.
""",
        "exercise": {
            "title": "Xây dựng hệ thống quản lý thực thể sinh viên StudentManager",
            "difficulty": "HARD",
            "problem_description": """### Mục tiêu:
Xây dựng lớp `StudentManager` quản lý danh sách sinh viên, hỗ trợ thêm sinh viên, tìm kiếm và tính điểm trung bình.

### Yêu cầu đề bài:
Nhập vào từ stdin danh sách gồm 2 sinh viên (mỗi sinh viên gồm 3 trường: `id name score`):
Ví dụ: `SV01 An 8.5 SV02 Binh 7.5`

Xây dựng lớp `StudentManager`:
* `constructor()`: khởi tạo mảng rỗng `this.students = [];`
* `add(id, name, score)`: thêm đối tượng `{ id, name, score }` vào mảng.
* `findById(id)`: dùng `find()` tìm sinh viên theo `id`.
* `getAverage()`: dùng `reduce()` tính điểm trung bình của toàn bộ sinh viên, làm tròn 2 chữ số thập phân.

Thực hiện:
1. Thêm 2 sinh viên đọc từ stdin vào hệ thống.
2. Tìm sinh viên có mã `"SV01"`.
3. In ra thông tin sinh viên `"SV01"` và điểm trung bình toàn khóa:
```text
Tim thay SV01: <student.name> - Diem: <student.score>
Diem trung binh khoa: <manager.getAverage()>
```

### Ví dụ:
* **Đầu vào:** `SV01 An 8.5 SV02 Binh 7.5`
* **Đầu ra:**
```text
Tim thay SV01: An - Diem: 8.5
Diem trung binh khoa: 8.00
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `class StudentManager`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["class StudentManager","add","findById","getAverage","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng class StudentManager với các phương thức add, findById, getAverage."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

// Xây dựng StudentManager và xử lý danh sách sinh viên

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

class StudentManager {
    constructor() {
        this.students = [];
    }
    add(id, name, score) {
        this.students.push({ id, name, score: Number(score) });
    }
    findById(id) {
        return this.students.find(s => s.id === id);
    }
    getAverage() {
        if (this.students.length === 0) return (0).toFixed(2);
        const sum = this.students.reduce((total, s) => total + s.score, 0);
        return (sum / this.students.length).toFixed(2);
    }
}

const manager = new StudentManager();
manager.add(input[0], input[1], input[2]);
manager.add(input[3], input[4], input[5]);

const sv1 = manager.findById("SV01");

console.log(`Tim thay SV01: ${sv1.name} - Diem: ${sv1.score}`);
console.log("Diem trung binh khoa:", manager.getAverage());
""",
            "test_cases": [
                {
                    "input": "SV01 An 8.5 SV02 Binh 7.5",
                    "expected_output": "Tim thay SV01: An - Diem: 8.5\nDiem trung binh khoa: 8.00",
                    "is_hidden": False
                },
                {
                    "input": "SV01 Minh 9.0 SV02 Hoa 9.0",
                    "expected_output": "Tim thay SV01: Minh - Diem: 9\nDiem trung binh khoa: 9.00",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Trong thiết kế hướng đối tượng, vì sao nên gom các thao tác thêm, xóa, tìm kiếm vào một lớp quản lý (như `StudentManager`) thay vì thao tác trực tiếp trên một biến mảng toàn cục?",
            "explanation": "Đóng gói danh sách dữ liệu vào một lớp quản lý giúp bảo vệ tính toàn vẹn của dữ liệu (Data Integrity), dễ dàng thêm các logic kiểm định (Validation), tái sử dụng mã nguồn và tuân thủ các nguyên lý thiết kế Clean Architecture.",
            "options": [
                {"key": "A", "text": "Vì biến mảng toàn cục không thể chứa được nhiều hơn 10 phần tử.", "is_correct": False},
                {"key": "B", "text": "Vì đóng gói vào lớp giúp che giấu chi tiết cài đặt, đảm bảo toàn vẹn dữ liệu và dễ mở rộng, bảo trì hơn.", "is_correct": True},
                {"key": "C", "text": "Vì class tự động lưu dữ liệu xuống ổ cứng vĩnh viễn.", "is_correct": False},
                {"key": "D", "text": "Vì JavaScript cấm sử dụng mảng toàn cục.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-14",
        "chapter_id": "JS2-CH-14",
        "module_folder": "Module 06",
        "filename": "Lesson_14_04.md",
        "lesson_id": "JS2-14.04",
        "title": "Bài 14.4: Engine xử lý giao dịch tài chính & Tổng kết tư duy JS thuần",
        "objective": "Xây dựng Transaction Engine hoàn chỉnh mô phỏng ngân hàng: xử lý danh sách giao dịch, phát hiện giao dịch không hợp lệ bằng Custom Error và tổng kết tư duy JavaScript thuần.",
        "difficulty": "HARD",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS2-14.04
title: "Engine xử lý giao dịch tài chính & Tổng kết tư duy JS thuần"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Financial Engine", "Transaction Processing", "Tổng kết khóa học", "JavaScript thuần"]
prerequisites: ["JS2-14.03"]
---

# Engine xử lý giao dịch tài chính & Tổng kết tư duy JS thuần

## 1. Khái niệm & Vấn đề thực tế
Bài toán xử lý dòng giao dịch (Transaction Ledger / Financial Engine) là bài kiểm tra tổng hợp toàn diện nhất:
- Cần mô hình hóa đối tượng tài khoản và giao dịch (OOP).
- Cần kiểm tra điều kiện an toàn, rẽ nhánh logic và bẫy lỗi (Error Handling, try-catch).
- Cần xử lý tập hợp dữ liệu bằng các phương thức mảng hiện đại (filter, map, reduce).

---

## 2. Thiết kế giải pháp
1. `Transaction`: `{ type: "DEPOSIT" | "WITHDRAW", amount: number }`
2. `Account`: Chứa số dư, lịch sử giao dịch và phương thức `applyTransaction()`.
3. Kiểm soát lỗi: Nếu rút quá số dư, ghi nhận giao dịch thất bại và tiếp tục xử lý các giao dịch tiếp theo.

---

## 3. Tổng kết toàn diện tư duy JavaScript thuần
1. **Hiểu bản chất kiểu dữ liệu**: 7 Primitive types vs Reference types (Object/Array).
2. **Cơ chế thực thi**: Execution Context, Call Stack, Scope Chain, Hoisting, Closure.
3. **Mô hình đối tượng**: Prototype Chain, `this` runtime binding, ES6 Classes.
4. **Clean Code & An toàn**: Optional Chaining `?.`, Nullish Coalescing `??`, Destructuring, try-catch-finally.

---

## 4. Checklist tốt nghiệp khóa học
- [x] Tự tin đọc, hiểu và debug mã nguồn JavaScript thuần chuẩn ES6+.
- [x] Xây dựng được các ứng dụng dòng lệnh/thuật toán phức tạp độc lập, không phụ thuộc framework.
""",
        "exercise": {
            "title": "Xây dựng Transaction Engine xử lý sổ cái ngân hàng",
            "difficulty": "HARD",
            "problem_description": """### Mục tiêu:
Xây dựng lớp `TransactionEngine` xử lý danh sách các lệnh giao dịch tài chính trong bộ nhớ.

### Yêu cầu đề bài:
Nhập vào từ stdin:
1. `initBalance`: Số dư khởi tạo ban đầu.
2. Danh sách 4 giao dịch (mỗi giao dịch gồm 2 từ: `LOAI_GIAO_DICH SO_TIEN`), ví dụ: `DEP 50000 WITH 20000 WITH 100000 DEP 30000`.

Quy tắc xử lý của `TransactionEngine`:
* Khởi tạo: `balance = initBalance`, `successCount = 0`, `failCount = 0`.
* Duyệt qua từng giao dịch:
  - Nếu `DEP`: `balance += amount`, tăng `successCount`.
  - Nếu `WITH`:
    - Nếu `balance >= amount`: `balance -= amount`, tăng `successCount`.
    - Nếu `balance < amount`: không trừ tiền (thất bại do số dư không đủ), tăng `failCount`.

In ra kết quả báo cáo cuối cùng gồm 3 dòng:
```text
So du cuoi: <balance> VNĐ
Giao dich thanh cong: <successCount>
Giao dich that bai: <failCount>
```

### Ví dụ:
* **Đầu vào:** `100000 DEP 50000 WITH 20000 WITH 200000 DEP 30000`
* **Đầu ra:**
```text
So du cuoi: 160000 VNĐ
Giao dich thanh cong: 3
Giao dich that bai: 1
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cấu trúc `class TransactionEngine`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["class TransactionEngine","balance","successCount","failCount","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng class TransactionEngine để quản lý và xử lý giao dịch."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const initBalance = parseInt(input[0], 10);

// Xây dựng class TransactionEngine và xử lý các giao dịch

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const initBalance = parseInt(input[0], 10);

class TransactionEngine {
    constructor(initialBalance) {
        this.balance = initialBalance;
        this.successCount = 0;
        this.failCount = 0;
    }
    process(type, amount) {
        if (type === "DEP") {
            this.balance += amount;
            this.successCount++;
        } else if (type === "WITH") {
            if (this.balance >= amount) {
                this.balance -= amount;
                this.successCount++;
            } else {
                this.failCount++;
            }
        }
    }
}

const engine = new TransactionEngine(initBalance);

// Duyệt qua các cặp giao dịch từ index 1
for (let i = 1; i < input.length; i += 2) {
    const type = input[i];
    const amount = parseInt(input[i + 1], 10);
    engine.process(type, amount);
}

console.log("So du cuoi: " + engine.balance + " VNĐ");
console.log("Giao dich thanh cong:", engine.successCount);
console.log("Giao dich that bai:", engine.failCount);
""",
            "test_cases": [
                {
                    "input": "100000 DEP 50000 WITH 20000 WITH 200000 DEP 30000",
                    "expected_output": "So du cuoi: 160000 VNĐ\nGiao dich thanh cong: 3\nGiao dich that bai: 1",
                    "is_hidden": False
                },
                {
                    "input": "50000 WITH 60000 WITH 70000 DEP 10000",
                    "expected_output": "So du cuoi: 60000 VNĐ\nGiao dich thanh cong: 1\nGiao dich that bai: 2",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Khi thiết kế một hệ thống phần mềm lớn bằng JavaScript thuần, vì sao việc phân tách trách nhiệm (Separation of Concerns) và tuân thủ mô hình Module hóa lại mang ý nghĩa sống còn?",
            "explanation": "Phân tách trách nhiệm và module hóa giúp giảm sự phụ thuộc chéo (coupling), tăng tính gắn kết nội tại (cohesion), cho phép kiểm thử tự động (Unit Testing) từng thành phần riêng lẻ và giúp nhóm lập trình viên có thể làm việc song song mà không bị xung đột mã nguồn.",
            "options": [
                {"key": "A", "text": "Vì nó giúp chương trình không cần phải biên dịch sang mã máy.", "is_correct": False},
                {"key": "B", "text": "Giảm phụ thuộc chéo, dễ dàng kiểm thử độc lập và cho phép nhiều lập trình viên phát triển song song hiệu quả.", "is_correct": True},
                {"key": "C", "text": "Vì JavaScript Engine bắt buộc mỗi file chỉ được dài tối đa 50 dòng.", "is_correct": False},
                {"key": "D", "text": "Để tăng dung lượng tải xuống của ứng dụng.", "is_correct": False}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"🚀 Seeding Course 2 Modules 13 & 14 ({len(lessons)} lessons)...")
    save_and_seed_lessons("Khóa 2 - JavaScript Nâng cao", lessons)
