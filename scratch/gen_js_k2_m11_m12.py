import sys
from js_seeder_helper import save_and_seed_lessons

sys.stdout.reconfigure(encoding='utf-8')

lessons = [
    # ========================================================
    # MODULE 11: Cơ chế cốt lõi: Scope, Hoisting, Closure & "this"
    # ========================================================
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-11",
        "chapter_id": "JS2-CH-11",
        "module_folder": "Module 03",
        "filename": "Lesson_11_01.md",
        "lesson_id": "JS2-11.01",
        "title": "Bài 11.1: Execution Context, Call Stack & Cơ chế Hoisting",
        "objective": "Hiểu tường tận 2 pha thực thi của JavaScript Engine (Creation Phase và Execution Phase), cơ chế Call Stack và bản chất Hoisting của var, let, const.",
        "difficulty": "HARD",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS2-11.01
title: "Execution Context, Call Stack & Cơ chế Hoisting"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Execution Context", "Call Stack", "Hoisting", "Creation Phase", "V8 Engine"]
prerequisites: ["JS2-10.05"]
---

# Execution Context, Call Stack & Cơ chế Hoisting

## 1. Khái niệm & Vấn đề thực tế
Mọi đoạn mã JavaScript khi chạy đều nằm trong một môi trường gọi là **Ngữ cảnh thực thi (Execution Context - EC)**.
Khi JavaScript Engine (như V8) chạy mã, nó luôn trải qua 2 giai đoạn:
1. **Creation Phase (Pha khởi tạo)**: Engine quét qua toàn bộ mã nguồn, cấp phát bộ nhớ cho biến và hàm.
2. **Execution Phase (Pha thực thi)**: Chạy từng dòng lệnh từ trên xuống dưới.

Chính vì bộ nhớ đã được cấp phát từ Pha khởi tạo trước khi một dòng code nào thực sự chạy, hiện tượng **Hoisting (kéo lên đầu)** xuất hiện.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Function Declaration**: Được hoisted toàn bộ (cả tên và thân hàm). Ta có thể gọi hàm trước dòng định nghĩa.
- **Biến `var`**: Được hoisted nhưng chỉ gán giá trị mặc định là `undefined`. Nếu truy cập trước dòng gán, nhận về `undefined`.
- **Biến `let` và `const`**: CŨNG ĐƯỢC HOISTED, nhưng bị đưa vào **Vùng chết tạm thời (Temporal Dead Zone - TDZ)**. Nếu truy cập trước khi tới dòng khai báo, Engine ném ra lỗi `ReferenceError: Cannot access before initialization`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
console.log(a); // In ra: undefined (do var được hoisted và gán undefined)
var a = 10;

// console.log(b); // LỖI ReferenceError (nằm trong TDZ!)
let b = 20;

sayHi(); // Chạy bình thường!
function sayHi() {
    console.log("Hi from Hoisting!");
}
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lầm tưởng `let`/`const` không bị hoisted**: Chúng thực chất có bị hoisted ở pha khởi tạo, nhưng engine cố tình cấm truy cập trong vùng TDZ để bảo vệ mã nguồn không dùng biến rác.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. JavaScript chạy 2 pha: Khởi tạo (quét biến & hàm) $\\rightarrow$ Thực thi.
2. `var` khởi tạo `undefined`; `let` và `const` nằm trong TDZ cho tới khi được gán.
""",
        "exercise": {
            "title": "Mô phỏng hành vi Hoisting và thứ tự thực thi",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Quan sát và ghi lại giá trị thực tế của biến `var` khi truy cập trước dòng gán giá trị để kiểm chứng hiện tượng Hoisting.

### Yêu cầu đề bài:
Viết chương trình chứa một biến `var score = 100;`.
Trước dòng khai báo `score`, hãy in giá trị của `score` ra màn hình:
```text
Truoc khi gan: <typeof score> - <score>
```
Sau dòng gán `score = 100`, in ra:
```text
Sau khi gan: <typeof score> - <score>
```

Định dạng in chính xác:
```text
Truoc khi gan: undefined - undefined
Sau khi gan: number - 100
```

### Ràng buộc kỹ thuật:
* Khai báo biến bằng `var score = 100`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["var score","typeof score","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng biến var score và in trạng thái trước và sau khi gán."} -->""",
            "starterCode": """// Minh họa hành vi Hoisting của var

""",
            "solutionCode": """console.log("Truoc khi gan: " + typeof score + " - " + score);
var score = 100;
console.log("Sau khi gan: " + typeof score + " - " + score);
""",
            "test_cases": [
                {
                    "input": "",
                    "expected_output": "Truoc khi gan: undefined - undefined\nSau khi gan: number - 100",
                    "is_hidden": False
                }
            ]
        },
        "quiz": {
            "question": "Vì sao việc cố gắng truy cập biến `let x = 10;` trước dòng khai báo lại ném ra lỗi `ReferenceError` thay vì trả về `undefined` như `var`?",
            "explanation": "Biến 'let' và 'const' vẫn được cấp phát bộ nhớ ở pha khởi tạo, nhưng JavaScript Engine đặt biến này vào trạng thái 'Temporal Dead Zone' (TDZ - Vùng chết tạm thời). Mọi truy cập vào biến trong vùng TDZ đều bị ném lỗi ReferenceError để ngăn chặn việc sử dụng biến trước khi khởi tạo.",
            "options": [
                {"key": "A", "text": "Vì let và const hoàn toàn không được hoisted lên đầu phạm vi.", "is_correct": False},
                {"key": "B", "text": "Vì biến let bị giữ trong Temporal Dead Zone (TDZ) từ đầu khối lệnh cho đến khi dòng khai báo được chạy tới.", "is_correct": True},
                {"key": "C", "text": "Vì let chỉ lưu được số thực.", "is_correct": False},
                {"key": "D", "text": "Vì let tiêu tốn bộ nhớ Heap.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-11",
        "chapter_id": "JS2-CH-11",
        "module_folder": "Module 03",
        "filename": "Lesson_11_02.md",
        "lesson_id": "JS2-11.02",
        "title": "Bài 11.2: Scope Chain & Kỹ thuật che khuất biến (Variable Shadowing)",
        "objective": "Làm chủ chuỗi phạm vi (Scope Chain), phân biệt Global Scope, Function Scope và Block Scope, hiểu hiện tượng Variable Shadowing.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS2-11.02
title: "Scope Chain & Kỹ thuật che khuất biến (Variable Shadowing)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Scope Chain", "Global Scope", "Block Scope", "Variable Shadowing", "Lexical Environment"]
prerequisites: ["JS2-11.01"]
---

# Scope Chain & Kỹ thuật che khuất biến (Variable Shadowing)

## 1. Khái niệm & Vấn đề thực tế
Phạm vi (Scope) xác định ranh giới mà một biến có thể được nhìn thấy và truy cập.
Khi bạn truy cập một biến, JavaScript Engine sẽ tìm kiếm theo thứ tự:
1. Phạm vi khối hiện tại (Local/Block Scope).
2. Nếu không thấy, tìm ngược ra phạm vi cha bao bọc nó (Outer Scope).
3. Tiếp tục tìm dần lên cho tới khi gặp Phạm vi toàn cục (Global Scope).
Chuỗi tìm kiếm này gọi là **Chuỗi phạm vi (Scope Chain)**.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Global Scope**: Biến khai báo ngoài cùng của file, mọi nơi đều đọc được.
- **Function Scope**: Biến khai báo trong hàm, chỉ hàm đó và các hàm con lồng bên trong thấy được.
- **Block Scope**: Giới hạn trong cặp ngoặc nhọn `{ ... }` (dành riêng cho `let` và `const`).
- **Variable Shadowing (Che khuất biến)**: Khi một biến cục bộ có cùng tên với một biến ở phạm vi bên ngoài, biến cục bộ sẽ tạm thời "che khuất" biến bên ngoài trong phạm vi của nó.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const role = "GUEST"; // Toàn cục

function enterRoom() {
    const role = "ADMIN"; // Che khuất biến role toàn cục trong phạm vi enterRoom
    if (true) {
        const role = "SUPER_USER"; // Che khuất tiếp trong block if
        console.log("Trong block:", role); // "SUPER_USER"
    }
    console.log("Trong ham:", role); // "ADMIN"
}

enterRoom();
console.log("Toan cuc:", role); // "GUEST"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên từ khóa khai báo (`role = "ADMIN"`)**: Nếu gán biến mà không có `let/const/var`, JavaScript sẽ tự động tạo một biến toàn cục ở Global Scope (rất nguy hiểm, gây rò rỉ dữ liệu).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Scope Chain tìm kiếm biến từ trong ra ngoài.
2. `let` và `const` tuân thủ nghiêm ngặt Block Scope `{}`.
""",
        "exercise": {
            "title": "Minh họa hiện tượng che khuất biến Variable Shadowing",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Tạo cấu trúc phạm vi lồng nhau để chứng minh hiện tượng Variable Shadowing và Scope Chain.

### Yêu cầu đề bài:
Nhập vào một số nguyên `inputVal` từ stdin.
1. Khai báo hằng số toàn cục: `const x = 100;`
2. Viết hàm `function testShadowing(paramVal)`:
   * Bên trong hàm, khai báo `const x = paramVal;` (che khuất `x` toàn cục).
   * In ra: `Gia tri trong ham: <x>`
3. Sau khi gọi hàm với đối số `inputVal`, in ra giá trị biến `x` toàn cục:
   * In ra: `Gia tri toan cuc: <x>`

### Ví dụ:
* **Đầu vào:** `50`
* **Đầu ra:**
```text
Gia tri trong ham: 50
Gia tri toan cuc: 100
```

### Ràng buộc kỹ thuật:
* Bắt buộc có biến `const x` ở cả 2 phạm vi (Global và Function) để thể hiện Variable Shadowing.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["const x = 100","const x = paramVal","testShadowing","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu khai báo const x ở cả phạm vi ngoài và trong hàm testShadowing."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const inputVal = parseInt(input[0], 10);

// Khai báo x toàn cục và hàm testShadowing

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const inputVal = parseInt(input[0], 10);

const x = 100;

function testShadowing(paramVal) {
    const x = paramVal;
    console.log("Gia tri trong ham:", x);
}

testShadowing(inputVal);
console.log("Gia tri toan cuc:", x);
""",
            "test_cases": [
                {
                    "input": "50",
                    "expected_output": "Gia tri trong ham: 50\nGia tri toan cuc: 100",
                    "is_hidden": False
                },
                {
                    "input": "999",
                    "expected_output": "Gia tri trong ham: 999\nGia tri toan cuc: 100",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Scope Chain trong JavaScript tìm kiếm định danh của một biến theo thứ tự nào?",
            "explanation": "JavaScript Engine luôn tìm kiếm biến bắt đầu từ phạm vi cục bộ hiện tại (Current Scope), nếu không thấy sẽ tìm ngược dần ra các phạm vi cha bên ngoài (Outer Scopes) và cuối cùng dừng lại ở phạm vi toàn cục (Global Scope).",
            "options": [
                {"key": "A", "text": "Tìm từ Global Scope trước rồi mới đi vào bên trong các hàm con.", "is_correct": False},
                {"key": "B", "text": "Tìm kiếm ngẫu nhiên trong bộ nhớ Heap.", "is_correct": False},
                {"key": "C", "text": "Tìm từ phạm vi cục bộ hiện tại ngược dần ra các phạm vi cha bên ngoài cho tới phạm vi toàn cục.", "is_correct": True},
                {"key": "D", "text": "Chỉ tìm trong phạm vi hàm hiện tại, không bao giờ tìm ra ngoài.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-11",
        "chapter_id": "JS2-CH-11",
        "module_folder": "Module 03",
        "filename": "Lesson_11_03.md",
        "lesson_id": "JS2-11.03",
        "title": "Bài 11.3: Lexical Scope & Kỹ thuật bao đóng (Closure) trong JavaScript",
        "objective": "Hiểu bản chất Lexical Scope, cơ chế tạo Closure khi một hàm ghi nhớ môi trường nơi nó được sinh ra và ứng dụng đóng gói dữ liệu riêng tư (Private State).",
        "difficulty": "HARD",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS2-11.03
title: "Lexical Scope & Kỹ thuật bao đóng (Closure) trong JavaScript"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Closure", "Lexical Scope", "Encapsulation", "Private State", "Higher-Order Function"]
prerequisites: ["JS2-11.02"]
---

# Lexical Scope & Kỹ thuật bao đóng (Closure) trong JavaScript

## 1. Khái niệm & Vấn đề thực tế
- **Lexical Scope (Phạm vi tĩnh)**: Vị trí của một biến được xác định bởi **nơi hàm được viết trong mã nguồn**, chứ không phụ thuộc vào nơi hàm được gọi thực thi.
- **Closure (Bao đóng)**: Là sự kết hợp giữa một hàm và môi trường từ vựng (Lexical Environment) nơi hàm đó được khai báo.
Nói đơn giản: **Hàm con có khả năng ghi nhớ và truy cập vào các biến của hàm cha ngay cả sau khi hàm cha đã chạy xong và biến mất khỏi Call Stack!**

---

## 2. Cú pháp & Quy tắc cốt lõi
Ứng dụng kinh điển nhất của Closure là **Tạo biến riêng tư (Private Variables / Data Encapsulation)**:
```javascript
function createCounter(initialValue = 0) {
    let count = initialValue; // Biến riêng tư, bên ngoài không thể can thiệp trực tiếp

    return {
        increment() { count++; return count; },
        decrement() { count--; return count; },
        get() { return count; }
    };
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const counter = createCounter(10);

console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.get());       // 11
```

- Mặc dù hàm `createCounter` đã chạy xong từ lâu, biến `count` vẫn được giữ sống trong bộ nhớ nhờ Closure của các phương thức `increment`, `decrement`.
- Bên ngoài không có cách nào sửa lén giá trị `counter.count = 999` vì `count` không phải là thuộc tính của đối tượng trả về.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Memory Leak (Rò rỉ bộ nhớ)**: Vì Closure giữ lại các biến trong phạm vi ngoài trên Heap, nếu giữ tham chiếu đến các đối tượng quá lớn không cần thiết, Garbage Collector sẽ không thể giải phóng vùng nhớ đó.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Closure cho phép hàm con ghi nhớ các biến của hàm cha.
2. Dùng Closure để bảo vệ dữ liệu nội bộ (Private State), không cho mã bên ngoài sửa đổi trực tiếp.
""",
        "exercise": {
            "title": "Tạo bộ đếm tự tăng độc lập bằng Closure",
            "difficulty": "HARD",
            "problem_description": """### Mục tiêu:
Cài đặt hàm `createCounter(initialVal)` ứng dụng kỹ thuật Closure để quản lý biến đếm riêng tư.

### Yêu cầu đề bài:
Nhập vào một số nguyên `init` từ stdin đại diện cho giá trị khởi đầu.
Viết hàm:
`function createCounter(initialVal)`
* Chứa biến riêng tư `let count = initialVal;`
* Trả về một đối tượng chứa 3 phương thức:
  - `increment()`: Tăng `count` lên 1 và trả về giá trị mới.
  - `decrement()`: Giảm `count` đi 1 và trả về giá trị mới.
  - `getValue()`: Trả về giá trị hiện tại của `count`.

Khởi tạo bộ đếm: `const counter = createCounter(init);`
Thực hiện tuần tự:
1. Gọi `counter.increment()` 2 lần.
2. Gọi `counter.decrement()` 1 lần.
3. In ra kết quả cuối cùng qua `counter.getValue()` theo định dạng:
```text
Gia tri cuoi: <counter.getValue()>
```

### Ví dụ:
* **Đầu vào:** `10`
* **Đầu ra:** `Gia tri cuoi: 11` (vì $10 + 1 + 1 - 1 = 11$)

### Ràng buộc kỹ thuật:
* Biến `count` phải là biến cục bộ trong hàm `createCounter` (không được đặt làm thuộc tính `this.count`).

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["function createCounter","let count","increment","decrement","getValue","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng Closure với let count bên trong createCounter."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const init = parseInt(input[0], 10);

// Viết hàm createCounter áp dụng Closure

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const init = parseInt(input[0], 10);

function createCounter(initialVal) {
    let count = initialVal;
    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        },
        getValue() {
            return count;
        }
    };
}

const counter = createCounter(init);
counter.increment();
counter.increment();
counter.decrement();

console.log("Gia tri cuoi:", counter.getValue());
""",
            "test_cases": [
                {
                    "input": "10",
                    "expected_output": "Gia tri cuoi: 11",
                    "is_hidden": False
                },
                {
                    "input": "0",
                    "expected_output": "Gia tri cuoi: 1",
                    "is_hidden": True
                },
                {
                    "input": "100",
                    "expected_output": "Gia tri cuoi: 101",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Đặc điểm bản chất giúp một Closure hoạt động trong JavaScript là gì?",
            "explanation": "Closure hoạt động được vì các hàm trong JavaScript duy trì một liên kết ẩn tham chiếu đến môi trường từ vựng (Lexical Environment) nơi chúng được định nghĩa, ngăn không cho bộ gom rác (Garbage Collector) dọn dẹp các biến đó khi hàm cha đã kết thúc.",
            "options": [
                {"key": "A", "text": "Hàm con tạo ra một luồng xử lý đa luồng (Multi-threading).", "is_correct": False},
                {"key": "B", "text": "Hàm con lưu giữ một tham chiếu đến môi trường từ vựng của hàm cha ngay cả khi hàm cha đã kết thúc.", "is_correct": True},
                {"key": "C", "text": "Biến của hàm cha tự động trở thành biến toàn cục window.", "is_correct": False},
                {"key": "D", "text": "Closure chỉ hoạt động với các biến kiểu chuỗi.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-11",
        "chapter_id": "JS2-CH-11",
        "module_folder": "Module 03",
        "filename": "Lesson_11_04.md",
        "lesson_id": "JS2-11.04",
        "title": "Bài 11.4: Từ khóa 'this' trong Object Method & Sự khác biệt với Arrow Function",
        "objective": "Làm chủ quy tắc xác định con trỏ 'this' tại runtime: phương thức đối tượng (trỏ vào object gọi hàm) vs Arrow Function (kế thừa this từ ngữ cảnh bao bọc từ vựng).",
        "difficulty": "HARD",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS2-11.04
title: "Từ khóa 'this' trong Object Method & Sự khác biệt với Arrow Function"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["this", "Object Method", "Arrow Function", "Lexical this", "Runtime Binding"]
prerequisites: ["JS2-11.03"]
---

# Từ khóa 'this' trong Object Method & Sự khác biệt với Arrow Function

## 1. Khái niệm & Vấn đề thực tế
Từ khóa `this` trong JavaScript đại diện cho **ngữ cảnh thực thi hiện tại (Execution Context)**.
Khác với đa số ngôn ngữ lập trình hướng đối tượng khác (nơi `this` gắn cố định vào lớp), trong JavaScript truyền thống, giá trị của `this` phụ thuộc vào **CÁCH MÀ HÀM ĐƯỢC GỌI TẠI RUNTIME (Call-site)** chứ không phụ thuộc vào nơi hàm được khai báo.

---

## 2. Cú pháp & Quy tắc cốt lõi
1. **Trong một Object Method (hàm thông thường)**: `this` trỏ trực tiếp đến đối tượng đứng trước dấu chấm khi gọi hàm (`obj.method()` $\\rightarrow$ `this === obj`).
2. **Trong Arrow Function**: **Arrow Function KHÔNG CÓ `this` RIÊNG**. Nó giữ nguyên giá trị `this` từ phạm vi cha bao bọc nó tại thời điểm định nghĩa (**Lexical `this`**).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const user = {
    name: "Tuấn",
    regularMethod() {
        console.log("Regular this:", this.name); // "Tuấn" (this là user)
    },
    arrowMethod: () => {
        console.log("Arrow this:", this.name); // undefined (this kế thừa từ phạm vi ngoài, không phải user!)
    }
};

user.regularMethod();
user.arrowMethod();
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **KHÔNG BAO GIỜ dùng Arrow Function làm Object Method**: Như ví dụ trên, dùng `() =>` làm phương thức đối tượng sẽ khiến `this` bị trỏ ra ngoài toàn cục và không đọc được thuộc tính của object.
- **DÙNG Arrow Function bên trong callback của Object Method**: Khi dùng `setTimeout` hay `forEach` bên trong method, Arrow Function giúp giữ nguyên `this` trỏ về object mà không bị mất ngữ cảnh.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Gọi `obj.method()`: `this` là `obj`.
2. Arrow Function không có `this`, kế thừa `this` từ phạm vi ngoài.
3. Không định nghĩa phương thức của object bằng Arrow Function.
""",
        "exercise": {
            "title": "Xây dựng đối tượng ví điện tử sử dụng con trỏ this",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Định nghĩa đối tượng có các phương thức thao tác trên thuộc tính của chính nó thông qua từ khóa `this`.

### Yêu cầu đề bài:
Nhập vào 2 số nguyên từ stdin:
1. `initialBalance`: Số dư ban đầu.
2. `depositAmount`: Số tiền muốn nạp thêm.

Khởi tạo đối tượng `wallet`:
```javascript
const wallet = {
    balance: initialBalance,
    deposit(amount) {
        this.balance += amount;
    },
    getBalance() {
        return this.balance;
    }
};
```
Thực hiện nạp tiền `wallet.deposit(depositAmount)` và in ra số dư cuối cùng theo định dạng:
```text
So du hien tai: <wallet.getBalance()> VNĐ
```

### Ví dụ:
* **Đầu vào:** `50000 20000`
* **Đầu ra:** `So du hien tai: 70000 VNĐ`

### Ràng buộc kỹ thuật:
* Các phương thức trong `wallet` phải truy cập số dư thông qua `this.balance`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["this.balance","deposit","getBalance","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng từ khóa this.balance trong các phương thức của wallet."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const initialBalance = parseInt(input[0], 10);
const depositAmount = parseInt(input[1], 10);

// Khởi tạo đối tượng wallet dùng this.balance và in số dư

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const initialBalance = parseInt(input[0], 10);
const depositAmount = parseInt(input[1], 10);

const wallet = {
    balance: initialBalance,
    deposit(amount) {
        this.balance += amount;
    },
    getBalance() {
        return this.balance;
    }
};

wallet.deposit(depositAmount);
console.log("So du hien tai: " + wallet.getBalance() + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "50000 20000",
                    "expected_output": "So du hien tai: 70000 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "100000 500000",
                    "expected_output": "So du hien tai: 600000 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Tại sao không nên sử dụng Arrow Function để khai báo một Object Method cần truy cập dữ liệu của chính đối tượng đó?",
            "explanation": "Arrow Function không có từ khóa 'this' riêng biệt; nó kế thừa giá trị 'this' từ phạm vi từ vựng bao bọc bên ngoài đối tượng (thường là Global Object hoặc module). Do đó, 'this' bên trong Arrow Method sẽ không trỏ vào đối tượng chứa nó.",
            "options": [
                {"key": "A", "text": "Vì Arrow Function chạy chậm hơn hàm thông thường.", "is_correct": False},
                {"key": "B", "text": "Vì Arrow Function không có ngữ cảnh this riêng, nó kế thừa this từ phạm vi bên ngoài thay vì trỏ vào object.", "is_correct": True},
                {"key": "C", "text": "Vì Arrow Function không thể nhận tham số truyền vào.", "is_correct": False},
                {"key": "D", "text": "Vì Arrow Function chỉ dùng được trong môi trường trình duyệt.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-11",
        "chapter_id": "JS2-CH-11",
        "module_folder": "Module 03",
        "filename": "Lesson_11_05.md",
        "lesson_id": "JS2-11.05",
        "title": "Bài 11.5: Ràng buộc ngữ cảnh thực thi với bind(), call() và apply()",
        "objective": "Làm chủ 3 phương thức điều khiển con trỏ this chủ động (Explicit Binding): call() và apply() (thực thi ngay), bind() (tạo hàm mới với this cố định).",
        "difficulty": "HARD",
        "duration_minutes": 25,
        "order_index": 5,
        "content": """---
lessonId: JS2-11.05
title: "Ràng buộc ngữ cảnh thực thi với bind(), call() và apply()"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["bind", "call", "apply", "Explicit Binding", "Method Borrowing"]
prerequisites: ["JS2-11.04"]
---

# Ràng buộc ngữ cảnh thực thi với bind(), call() và apply()

## 1. Khái niệm & Vấn đề thực tế
Khi truyền một phương thức của đối tượng làm tham số callback (ví dụ trong sự kiện hoặc timer), phương thức đó thường bị tách rời khỏi đối tượng gốc, dẫn đến `this` bị mất ngữ cảnh (`this` trở thành `undefined`).

Để chủ động chỉ định chính xác đối tượng nào sẽ là `this` của một hàm, JavaScript cung cấp 3 phương thức: **`call()`**, **`apply()`** và **`bind()`** (kỹ thuật **Explicit Binding**).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`fn.call(thisArg, arg1, arg2, ...)`**:
  - Gán `this = thisArg` và **gọi hàm thực thi ngay lập tức**.
  - Các đối số truyền vào phân tách nhau bởi dấu phẩy.
- **`fn.apply(thisArg, [arg1, arg2, ...])`**:
  - Gán `this = thisArg` và **gọi hàm thực thi ngay lập tức**.
  - Các đối số truyền vào dưới dạng **một mảng**.
- **`fn.bind(thisArg, arg1, ...)`**:
  - **KHÔNG gọi hàm ngay**, mà trả về một **hàm mới** với `this` đã được "khóa cứng" (permanently bound) vào `thisArg`.

---

## 3. Ví dụ trực quan: Kỹ thuật mượn hàm (Method Borrowing)

```javascript
function introduce(greeting, punct) {
    return `${greeting}, tôi là ${this.name}${punct}`;
}

const person1 = { name: "Hoàng" };
const person2 = { name: "Thảo" };

// 1. Dùng call: truyền tham số rời
console.log(introduce.call(person1, "Xin chào", "!")); // "Xin chào, tôi là Hoàng!"

// 2. Dùng apply: truyền mảng tham số
console.log(introduce.apply(person2, ["Chào bạn", "."])); // "Chào bạn, tôi là Thảo."

// 3. Dùng bind: tạo hàm mới
const introduceHoang = introduce.bind(person1, "Hello");
console.log(introduceHoang("~")); // "Hello, tôi là Hoàng~"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Phân biệt `call` vs `apply`**: "A for Array" -> `apply` nhận mảng các đối số; `call` nhận danh sách cách nhau bởi dấu phẩy.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `call(this, a, b)`: chạy ngay, tham số liệt kê.
2. `apply(this, [a, b])`: chạy ngay, tham số là mảng.
3. `bind(this)`: trả về hàm mới để gọi sau.
""",
        "exercise": {
            "title": "Mượn hàm tính thuế sản phẩm bằng call và apply",
            "difficulty": "HARD",
            "problem_description": """### Mục tiêu:
Sử dụng phương thức `call()` và `apply()` để mượn hàm tính tổng tiền sau thuế cho các đối tượng khác nhau.

### Yêu cầu đề bài:
Cho hàm tính tiền:
```javascript
function computeWithTax(vatRate, shippingFee) {
    const tax = this.price * vatRate;
    return this.price + tax + shippingFee;
}
```
Cho hai đối tượng sản phẩm:
```javascript
const itemA = { name: "Bàn phím", price: 800000 };
const itemB = { name: "Chuột quang", price: 400000 };
```

Nhập vào từ stdin một số thực `vatRate` (ví dụ `0.1`) và một số nguyên `shippingFee` (ví dụ `30000`).
1. Dùng `.call()` trên `computeWithTax` để tính cho `itemA`.
2. Dùng `.apply()` trên `computeWithTax` để tính cho `itemB` (truyền tham số dạng mảng `[vatRate, shippingFee]`).

In kết quả ra màn hình theo định dạng 2 dòng:
```text
Item A tong: <ket_qua_itemA> VNĐ
Item B tong: <ket_qua_itemB> VNĐ
```

### Ví dụ:
* **Đầu vào:** `0.1 30000`
* **Đầu ra:**
```text
Item A tong: 910000 VNĐ
Item B tong: 470000 VNĐ
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cả `computeWithTax.call()` và `computeWithTax.apply()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["computeWithTax.call","computeWithTax.apply","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng computeWithTax.call và computeWithTax.apply."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

function computeWithTax(vatRate, shippingFee) {
    const tax = this.price * vatRate;
    return this.price + tax + shippingFee;
}

const itemA = { name: "Bàn phím", price: 800000 };
const itemB = { name: "Chuột quang", price: 400000 };

const vatRate = parseFloat(input[0]);
const shippingFee = parseInt(input[1], 10);

// Áp dụng call và apply theo yêu cầu đề bài

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

function computeWithTax(vatRate, shippingFee) {
    const tax = this.price * vatRate;
    return this.price + tax + shippingFee;
}

const itemA = { name: "Bàn phím", price: 800000 };
const itemB = { name: "Chuột quang", price: 400000 };

const vatRate = parseFloat(input[0]);
const shippingFee = parseInt(input[1], 10);

const totalA = computeWithTax.call(itemA, vatRate, shippingFee);
const totalB = computeWithTax.apply(itemB, [vatRate, shippingFee]);

console.log("Item A tong: " + totalA + " VNĐ");
console.log("Item B tong: " + totalB + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "0.1 30000",
                    "expected_output": "Item A tong: 910000 VNĐ\nItem B tong: 470000 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "0.05 20000",
                    "expected_output": "Item A tong: 860000 VNĐ\nItem B tong: 440000 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Sự khác biệt căn bản giữa `bind()` so với `call()` và `apply()` là gì?",
            "explanation": "call() và apply() ngay lập tức thực thi hàm với ngữ cảnh this đã chỉ định. Trong khi đó, bind() không thực thi hàm ngay mà trả về một hàm mới (bound function) với ngữ cảnh this đã được gắn cố định để người lập trình có thể gọi vào thời điểm sau này.",
            "options": [
                {"key": "A", "text": "bind() thực thi hàm nhanh hơn call() và apply().", "is_correct": False},
                {"key": "B", "text": "bind() không gọi hàm ngay mà trả về một hàm mới đã được khóa cố định con trỏ this.", "is_correct": True},
                {"key": "C", "text": "bind() chỉ dùng được với các đối tượng rỗng {}.", "is_correct": False},
                {"key": "D", "text": "call() và apply() không thể truyền tham số.", "is_correct": False}
            ]
        }
    },

    # ========================================================
    # MODULE 12: Prototype, OOP & ES6 Classes
    # ========================================================
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-12",
        "chapter_id": "JS2-CH-12",
        "module_folder": "Module 04",
        "filename": "Lesson_12_01.md",
        "lesson_id": "JS2-12.01",
        "title": "Bài 12.1: Nguyên lý Prototype, __proto__ & Prototype Chain",
        "objective": "Hiểu mô hình kế thừa dựa trên nguyên mẫu (Prototype-based Inheritance) của JavaScript, thuộc tính ẩn [[Prototype]] (__proto__) và cơ chế tra cứu thuộc tính.",
        "difficulty": "HARD",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS2-12.01
title: "Nguyên lý Prototype, __proto__ & Prototype Chain"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Prototype", "__proto__", "Prototype Chain", "Object.create", "Kế thừa nguyên mẫu"]
prerequisites: ["JS2-11.05"]
---

# Nguyên lý Prototype, __proto__ & Prototype Chain

## 1. Khái niệm & Vấn đề thực tế
Không giống các ngôn ngữ như Java hay C++ (vốn sử dụng mô hình Class-based cổ điển), JavaScript ngay từ đầu được xây dựng trên nền tảng **Kế thừa dựa trên nguyên mẫu (Prototypal Inheritance)**.

Mỗi đối tượng trong JavaScript đều có một liên kết nội bộ ẩn trỏ đến một đối tượng khác, gọi là **Prototype (Nguyên mẫu)**. Khi bạn đọc một thuộc tính từ một object mà object đó không có, Engine sẽ lần theo liên kết này để tìm kiếm trên Prototype của nó. Quá trình này tạo thành một chuỗi gọi là **Prototype Chain**.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`Object.create(proto)`**: Tạo ra một đối tượng mới có nguyên mẫu kế thừa trực tiếp từ `proto`.
- **`Object.getPrototypeOf(obj)`**: Phương thức chuẩn mực để lấy prototype của `obj` (thay thế cho thuộc tính kế thừa cũ `__proto__`).
- **Điểm kết thúc của Prototype Chain**: `Object.prototype` (nguyên mẫu cao nhất, prototype của nó là `null`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const animal = {
    isAlive: true,
    eat() {
        return "Đang ăn...";
    }
};

// Tạo rabbit kế thừa từ animal
const rabbit = Object.create(animal);
rabbit.name = "Thỏ trắng";

console.log(rabbit.name);    // "Thỏ trắng" (thuộc tính của chính rabbit)
console.log(rabbit.isAlive); // true (tìm thấy trên prototype animal!)
console.log(rabbit.eat());   // "Đang ăn..." (phương thức kế thừa từ animal)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Ghi đè thuộc tính (Property Shadowing)**: Nếu bạn gán `rabbit.isAlive = false`, thuộc tính `isAlive` sẽ được tạo riêng trên `rabbit`, không làm thay đổi giá trị `isAlive` trên nguyên mẫu `animal`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Mọi đối tượng đều có một prototype.
2. Tra cứu thuộc tính diễn ra dọc theo Prototype Chain từ dưới lên trên.
3. Tạo đối tượng kế thừa chuẩn: `Object.create(parentObj)`.
""",
        "exercise": {
            "title": "Thiết lập chuỗi kế thừa Prototype với Object.create",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng `Object.create()` để thiết lập quan hệ kế thừa giữa đối tượng `device` và đối tượng `smartPhone`.

### Yêu cầu đề bài:
Cho đối tượng nguyên mẫu:
```javascript
const device = {
    category: "ELECTRONIC",
    powerOn() {
        return "Device is ready";
    }
};
```

Đọc từ stdin một chuỗi `phoneModel` (ví dụ `"Pixel 9"`).
1. Dùng `Object.create(device)` để tạo đối tượng `smartPhone`.
2. Gán thuộc tính riêng `smartPhone.model = phoneModel`.
3. In ra màn hình 3 dòng:
```text
Model: <smartPhone.model>
Category: <smartPhone.category>
Status: <smartPhone.powerOn()>
```

### Ví dụ:
* **Đầu vào:** `Pixel_9`
* **Đầu ra:**
```text
Model: Pixel_9
Category: ELECTRONIC
Status: Device is ready
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `Object.create(device)`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["Object.create(device)","smartPhone.model","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng Object.create(device) để tạo đối tượng kế thừa."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const device = {
    category: "ELECTRONIC",
    powerOn() {
        return "Device is ready";
    }
};

const phoneModel = input[0];

// Tạo smartPhone kế thừa từ device và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const device = {
    category: "ELECTRONIC",
    powerOn() {
        return "Device is ready";
    }
};

const phoneModel = input[0];

const smartPhone = Object.create(device);
smartPhone.model = phoneModel;

console.log("Model:", smartPhone.model);
console.log("Category:", smartPhone.category);
console.log("Status:", smartPhone.powerOn());
""",
            "test_cases": [
                {
                    "input": "Pixel_9",
                    "expected_output": "Model: Pixel_9\nCategory: ELECTRONIC\nStatus: Device is ready",
                    "is_hidden": False
                },
                {
                    "input": "iPhone_16",
                    "expected_output": "Model: iPhone_16\nCategory: ELECTRONIC\nStatus: Device is ready",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Điểm kết thúc (tận cùng) của một chuỗi Prototype Chain trong JavaScript là giá trị nào?",
            "explanation": "Mọi chuỗi kế thừa nguyên mẫu trong JavaScript đều dẫn đến Object.prototype ở đỉnh. Prototype của Object.prototype chính là 'null', đánh dấu điểm kết thúc của chuỗi tìm kiếm.",
            "options": [
                {"key": "A", "text": "undefined", "is_correct": False},
                {"key": "B", "text": "Object.prototype", "is_correct": False},
                {"key": "C", "text": "null", "is_correct": True},
                {"key": "D", "text": "Function.prototype", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-12",
        "chapter_id": "JS2-CH-12",
        "module_folder": "Module 04",
        "filename": "Lesson_12_02.md",
        "lesson_id": "JS2-12.02",
        "title": "Bài 12.2: Constructor Function & Cơ chế chia sẻ bộ nhớ prototype",
        "objective": "Làm chủ hàm khởi tạo Constructor Function, toán tử new và kỹ thuật tối ưu hóa bộ nhớ bằng cách gắn phương thức vào Constructor.prototype.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS2-12.02
title: "Constructor Function & Cơ chế chia sẻ bộ nhớ prototype"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Constructor Function", "new operator", "prototype", "Tối ưu bộ nhớ", "OOP ES5"]
prerequisites: ["JS2-12.01"]
---

# Constructor Function & Cơ chế chia sẻ bộ nhớ prototype

## 1. Khái niệm & Vấn đề thực tế
Trước khi có từ khóa `class` trong ES6, các lập trình viên JavaScript tạo ra các bản thiết kế (blueprint) để sản xuất hàng loạt đối tượng bằng **Constructor Function (Hàm khởi tạo)** kết hợp với toán tử `new`.

Nếu bạn định nghĩa phương thức trực tiếp bên trong thân Constructor:
`this.sayHello = function() { ... }`
Thì khi tạo 10.000 đối tượng, sẽ có 10.000 hàm giống hệt nhau được sinh ra, gây lãng phí bộ nhớ RAM nghiêm trọng.
Giải pháp: Gắn phương thức vào **`Constructor.prototype`** để 10.000 đối tượng cùng chia sẻ duy nhất một bản sao trong bộ nhớ!

---

## 2. Cú pháp & Quy tắc cốt lõi
1. Tên hàm Constructor viết hoa chữ cái đầu: `function Person(name) { ... }`.
2. Khởi tạo đối tượng bằng toán tử `new Person(...)`.
3. Gắn phương thức dùng chung:
   `Person.prototype.tenPhuongThuc = function() { ... };`

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function Book(title, price) {
    this.title = title;
    this.price = price;
}

// Gắn phương thức vào prototype (chia sẻ bộ nhớ cho mọi instance)
Book.prototype.getInfo = function() {
    return `${this.title} - ${this.price}đ`;
};

const b1 = new Book("JS Core", 120000);
const b2 = new Book("JS Advanced", 150000);

console.log(b1.getInfo()); // "JS Core - 120000đ"
console.log(b1.getInfo === b2.getInfo); // true (dùng chung 1 vùng nhớ!)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên từ khóa `new`**: Nếu gọi `Book("JS", 100)` không có `new`, `this` sẽ trỏ vào đối tượng toàn cầu (Global) và hàm trả về `undefined`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Constructor function dùng `new` để tạo instance.
2. Luôn gắn phương thức vào `Constructor.prototype` để tối ưu RAM.
""",
        "exercise": {
            "title": "Thiết kế Constructor Function cho khóa học",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Định nghĩa Constructor Function `Course(title, price)` và gắn phương thức `getFormattedPrice()` vào `Course.prototype`.

### Yêu cầu đề bài:
Nhập vào từ stdin:
1. `title`: Tên khóa học (chuỗi).
2. `price`: Học phí (số nguyên).

1. Định nghĩa Constructor Function:
```javascript
function Course(title, price) {
    this.title = title;
    this.price = price;
}
```
2. Gắn phương thức vào prototype:
```javascript
Course.prototype.getFormattedPrice = function() {
    return this.price.toLocaleString("vi-VN") + " VNĐ";
};
```
3. Khởi tạo một đối tượng: `const c = new Course(title, price);`
4. In ra 2 dòng:
```text
Khoa hoc: <c.title>
Hoc phi: <c.getFormattedPrice()>
```

### Ví dụ:
* **Đầu vào:** `JavaScript_Pro 1500000`
* **Đầu ra:**
```text
Khoa hoc: JavaScript_Pro
Hoc phi: 1.500.000 VNĐ
```

### Ràng buộc kỹ thuật:
* Bắt buộc khai báo Constructor function `Course` và gán phương thức qua `Course.prototype.getFormattedPrice`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["function Course","Course.prototype.getFormattedPrice","new Course","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng Constructor function Course và Course.prototype.getFormattedPrice."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const title = input[0];
const price = parseInt(input[1], 10);

// Viết Constructor function Course và gán phương thức vào prototype

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const title = input[0];
const price = parseInt(input[1], 10);

function Course(title, price) {
    this.title = title;
    this.price = price;
}

Course.prototype.getFormattedPrice = function() {
    return this.price.toLocaleString("vi-VN") + " VNĐ";
};

const c = new Course(title, price);

console.log("Khoa hoc:", c.title);
console.log("Hoc phi:", c.getFormattedPrice());
""",
            "test_cases": [
                {
                    "input": "JavaScript_Pro 1500000",
                    "expected_output": "Khoa hoc: JavaScript_Pro\nHoc phi: 1.500.000 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "Algorithm 500000",
                    "expected_output": "Khoa hoc: Algorithm\nHoc phi: 500.000 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Toán tử `new` trong JavaScript thực hiện những công việc ngầm định nào khi được gọi?",
            "explanation": "Toán tử new thực hiện 4 bước: (1) Tạo đối tượng mới rỗng {}, (2) Gắn prototype của đối tượng mới trỏ vào Constructor.prototype, (3) Ràng buộc this trỏ vào đối tượng mới và chạy hàm Constructor, (4) Trả về đối tượng mới đó.",
            "options": [
                {"key": "A", "text": "Chỉ đơn giản là gọi hàm với quyền admin.", "is_correct": False},
                {"key": "B", "text": "Tạo đối tượng rỗng mới, liên kết prototype của nó với Constructor.prototype, gán this vào đối tượng đó và trả về nó.", "is_correct": True},
                {"key": "C", "text": "Sao chép toàn bộ mã nguồn của file vào bộ nhớ.", "is_correct": False},
                {"key": "D", "text": "Xóa toàn bộ các biến cục bộ.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-12",
        "chapter_id": "JS2-CH-12",
        "module_folder": "Module 04",
        "filename": "Lesson_12_03.md",
        "lesson_id": "JS2-12.03",
        "title": "Bài 12.3: Cú pháp class, constructor & Instance Methods trong Modern JS",
        "objective": "Làm chủ cú pháp class trong ES6 (Syntactic Sugar của Prototype), phương thức khởi tạo constructor và các phương thức thể hiện (Instance Methods).",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS2-12.03
title: "Cú pháp class, constructor & Instance Methods trong Modern JS"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["class", "constructor", "Instance Method", "ES6 Classes", "OOP"]
prerequisites: ["JS2-12.02"]
---

# Cú pháp class, constructor & Instance Methods trong Modern JS

## 1. Khái niệm & Vấn đề thực tế
Từ ES6, JavaScript bổ sung từ khóa `class` giúp cú pháp lập trình hướng đối tượng trở nên thân thuộc, trực quan và chuẩn mực giống như các ngôn ngữ hiện đại khác.

Bản chất bên dưới: `class` trong JavaScript thực chất là **Đường cú pháp (Syntactic Sugar)** bao bọc lấy cơ chế Prototype truyền thống. Khi khai báo phương thức trong `class`, nó tự động được gắn vào `Class.prototype`.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
class BankAccount {
    // Hàm khởi tạo: chạy khi gọi new BankAccount(...)
    constructor(accountNumber, balance = 0) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    // Instance Method: tự động nằm trên BankAccount.prototype
    deposit(amount) {
        this.balance += amount;
        return this.balance;
    }

    withdraw(amount) {
        if (amount > this.balance) return false;
        this.balance -= amount;
        return true;
    }
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const acc = new BankAccount("VIB-101", 100000);
acc.deposit(50000);
console.log("Số dư sau nạp:", acc.balance); // 150000

acc.withdraw(30000);
console.log("Số dư sau rút:", acc.balance); // 120000
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Class KHÔNG được hoisted**: Bạn không thể tạo instance bằng `new MyClass()` trước dòng khai báo `class MyClass`. Class tuân thủ quy tắc TDZ giống như `let` và `const`.
- **Class luôn chạy ở chế độ Strict Mode (`"use strict"`)** một cách tự động.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `class Name { constructor() {} method() {} }`.
2. Phương thức trong class tự động nằm trên prototype.
3. Không thể gọi class nếu thiếu từ khóa `new`.
""",
        "exercise": {
            "title": "Xây dựng lớp quản lý tài khoản ngân hàng BankAccount",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng cú pháp ES6 `class` để thiết kế lớp `BankAccount` với phương thức khởi tạo và các instance methods nạp/rút tiền.

### Yêu cầu đề bài:
Nhập vào 3 số nguyên từ stdin:
1. `initBalance`: Số dư ban đầu.
2. `dep`: Số tiền nạp vào.
3. `withd`: Số tiền rút ra.

Xây dựng lớp:
```javascript
class BankAccount {
    constructor(balance) {
        this.balance = balance;
    }
    deposit(amount) {
        this.balance += amount;
    }
    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}
```
Thực hiện tuần tự:
1. `const acc = new BankAccount(initBalance);`
2. Nạp tiền: `acc.deposit(dep);`
3. Rút tiền: `const success = acc.withdraw(withd);`

In ra 2 dòng kết quả:
```text
Rut tien thanh cong: <success>
So du con lai: <acc.balance> VNĐ
```

### Ví dụ:
* **Đầu vào:** `500000 200000 300000`
* **Đầu ra:**
```text
Rut tien thanh cong: true
So du con lai: 400000 VNĐ
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng từ khóa `class BankAccount`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["class BankAccount","constructor","deposit","withdraw","new BankAccount","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu định nghĩa class BankAccount đầy đủ constructor, deposit và withdraw."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const initBalance = parseInt(input[0], 10);
const dep = parseInt(input[1], 10);
const withd = parseInt(input[2], 10);

// Xây dựng class BankAccount và thực hiện các thao tác

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const initBalance = parseInt(input[0], 10);
const dep = parseInt(input[1], 10);
const withd = parseInt(input[2], 10);

class BankAccount {
    constructor(balance) {
        this.balance = balance;
    }
    deposit(amount) {
        this.balance += amount;
    }
    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}

const acc = new BankAccount(initBalance);
acc.deposit(dep);
const success = acc.withdraw(withd);

console.log("Rut tien thanh cong:", success);
console.log("So du con lai: " + acc.balance + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "500000 200000 300000",
                    "expected_output": "Rut tien thanh cong: true\nSo du con lai: 400000 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "100000 50000 200000",
                    "expected_output": "Rut tien thanh cong: false\nSo du con lai: 150000 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Khẳng định nào sau đây là ĐÚNG về bản chất của từ khóa `class` trong ES6 JavaScript?",
            "explanation": "class trong JavaScript là 'Syntactic Sugar' (đường cú pháp) xây dựng phía trên mô hình kế thừa nguyên mẫu (Prototypal Inheritance). Các method trong class thực chất được gán vào prototype của hàm khởi tạo tương ứng.",
            "options": [
                {"key": "A", "text": "JavaScript đã chuyển hẳn sang mô hình Class-based giống C++ và từ bỏ Prototype.", "is_correct": False},
                {"key": "B", "text": "Class thực chất là Syntactic Sugar bao bọc cơ chế Prototypal Inheritance truyền thống.", "is_correct": True},
                {"key": "C", "text": "Class trong JavaScript được hoisted toàn bộ lên đầu file.", "is_correct": False},
                {"key": "D", "text": "Không thể dùng từ khóa new với class.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-12",
        "chapter_id": "JS2-CH-12",
        "module_folder": "Module 04",
        "filename": "Lesson_12_04.md",
        "lesson_id": "JS2-12.04",
        "title": "Bài 12.4: Kế thừa hướng đối tượng với extends & Hàm khởi tạo cha super()",
        "objective": "Làm chủ tính kế thừa (Inheritance) trong ES6 Classes bằng từ khóa extends, cơ chế gọi hàm khởi tạo cha super() và ghi đè phương thức (Method Overriding).",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS2-12.04
title: "Kế thừa hướng đối tượng với extends & Hàm khởi tạo cha super()"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["extends", "super", "Inheritance", "Kế thừa", "Method Overriding"]
prerequisites: ["JS2-12.03"]
---

# Kế thừa hướng đối tượng với extends & Hàm khởi tạo cha super()

## 1. Khái niệm & Vấn đề thực tế
Kế thừa (Inheritance) cho phép một lớp con (Subclass / Child class) tái sử dụng toàn bộ thuộc tính và phương thức của lớp cha (Superclass / Parent class), đồng thời bổ sung thêm các đặc tính chuyên biệt của riêng mình.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getDetails() {
        return `${this.name}, ${this.age} tuổi`;
    }
}

// Kế thừa bằng extends
class Student extends Person {
    constructor(name, age, studentId) {
        // BẮT BUỘC gọi super() trước khi dùng 'this' trong lớp con
        super(name, age);
        this.studentId = studentId;
    }

    // Ghi đè phương thức (Method Overriding)
    getDetails() {
        return `${super.getDetails()} - Mã SV: ${this.studentId}`;
    }
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const sv = new Student("Văn Nam", 21, "SV2026");
console.log(sv.getDetails());
// "Văn Nam, 21 tuổi - Mã SV: SV2026"
```

- Dòng `super(name, age)` gọi hàm khởi tạo của lớp cha `Person`, thiết lập xong các trường `name` và `age`.
- `super.getDetails()` gọi phương thức của lớp cha rồi nối thêm dữ liệu.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dùng `this` trước `super()`**: Trong constructor của lớp con, nếu bạn viết `this.studentId = id;` trước `super()`, JavaScript Engine sẽ ném lỗi ngay: `ReferenceError: Must call super constructor in derived class before accessing 'this'`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `class Child extends Parent` để kế thừa.
2. Bắt buộc gọi `super(...)` ở dòng đầu tiên trong constructor của lớp con.
3. Dùng `super.methodName()` để tái sử dụng logic của lớp cha khi override.
""",
        "exercise": {
            "title": "Thiết kế hệ thống nhân sự với extends và super",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Cài đặt lớp cha `Employee` và lớp con `Manager` kế thừa bằng `extends`, sử dụng `super()` trong constructor.

### Yêu cầu đề bài:
Nhập vào 3 thông tin từ stdin:
1. `name`: Tên quản lý (chuỗi).
2. `baseSalary`: Lương cơ bản (số nguyên).
3. `bonus`: Tiền thưởng chức vụ (số nguyên).

Xây dựng:
1. Lớp `Employee`:
   * `constructor(name, baseSalary)`
   * Phương thức `getTotalSalary()`: trả về `this.baseSalary`.
2. Lớp `Manager extends Employee`:
   * `constructor(name, baseSalary, bonus)`: gọi `super(name, baseSalary)` và gán `this.bonus = bonus`.
   * Ghi đè phương thức `getTotalSalary()`: trả về `super.getTotalSalary() + this.bonus`.

Khởi tạo đối tượng:
`const m = new Manager(name, baseSalary, bonus);`
In ra màn hình theo định dạng 2 dòng:
```text
Quan ly: <m.name>
Tong thu nhap: <m.getTotalSalary()> VNĐ
```

### Ví dụ:
* **Đầu vào:** `Tran_Nam 20000000 5000000`
* **Đầu ra:**
```text
Quan ly: Tran_Nam
Tong thu nhap: 25000000 VNĐ
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `class Manager extends Employee` và gọi `super(name, baseSalary)`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["class Employee","class Manager extends Employee","super(name, baseSalary)","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng class Manager extends Employee và gọi super(name, baseSalary)."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const name = input[0];
const baseSalary = parseInt(input[1], 10);
const bonus = parseInt(input[2], 10);

// Xây dựng Employee và Manager kế thừa

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const name = input[0];
const baseSalary = parseInt(input[1], 10);
const bonus = parseInt(input[2], 10);

class Employee {
    constructor(name, baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }
    getTotalSalary() {
        return this.baseSalary;
    }
}

class Manager extends Employee {
    constructor(name, baseSalary, bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
    }
    getTotalSalary() {
        return super.getTotalSalary() + this.bonus;
    }
}

const m = new Manager(name, baseSalary, bonus);

console.log("Quan ly:", m.name);
console.log("Tong thu nhap: " + m.getTotalSalary() + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "Tran_Nam 20000000 5000000",
                    "expected_output": "Quan ly: Tran_Nam\nTong thu nhap: 25000000 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "Le_Hoa 15000000 3000000",
                    "expected_output": "Quan ly: Le_Hoa\nTong thu nhap: 18000000 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Điều gì sẽ xảy ra nếu lập trình viên cố gắng truy cập từ khóa `this` bên trong constructor của lớp con TRƯỚC KHI gọi hàm `super()`?",
            "explanation": "Trong JavaScript ES6, constructor của lớp con bắt buộc phải gọi super() trước để lớp cha khởi tạo đối tượng. Nếu truy cập 'this' trước super(), JavaScript Engine sẽ lập tức ném ra lỗi ReferenceError.",
            "options": [
                {"key": "A", "text": "Chương trình vẫn chạy bình thường và bỏ qua lớp cha.", "is_correct": False},
                {"key": "B", "text": "Engine ném ra lỗi ReferenceError: Must call super constructor before accessing 'this'.", "is_correct": True},
                {"key": "C", "text": "Biến this nhận giá trị mặc định là null.", "is_correct": False},
                {"key": "D", "text": "Lớp con tự động nhân đôi thuộc tính của lớp cha.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-12",
        "chapter_id": "JS2-CH-12",
        "module_folder": "Module 04",
        "filename": "Lesson_12_05.md",
        "lesson_id": "JS2-12.05",
        "title": "Bài 12.5: Phương thức tĩnh static, Getter/Setter & Private Fields (#)",
        "objective": "Làm chủ các tính năng OOP nâng cao trong Modern JavaScript: thuộc tính tĩnh static, hàm getter/setter kiểm soát dữ liệu và trường riêng tư Private Fields (#).",
        "difficulty": "HARD",
        "duration_minutes": 25,
        "order_index": 5,
        "content": """---
lessonId: JS2-12.05
title: "Phương thức tĩnh static, Getter/Setter & Private Fields (#)"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["static", "get", "set", "Private fields", "#private", "Encapsulation"]
prerequisites: ["JS2-12.04"]
---

# Phương thức tĩnh static, Getter/Setter & Private Fields (#)

## 1. Khái niệm & Vấn đề thực tế
Để hoàn thiện mô hình Lập trình hướng đối tượng (OOP) chuyên nghiệp, JavaScript cung cấp:
1. **`static`**: Thuộc tính/phương thức thuộc về bản thân Class chứ không thuộc về instance (thường dùng làm hàm tiện ích, factory method).
2. **`get` / `set`**: Cho phép truy cập và gán giá trị như thuộc tính thông thường nhưng thực chất chạy qua hàm logic để kiểm định (Validation).
3. **Private Fields (`#field`)**: Tính năng đóng gói bảo mật thực thụ (ra mắt từ ES2022), ngăn chặn tuyệt đối việc truy cập hoặc sửa đổi từ bên ngoài Class.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
class UserAccount {
    // 1. Private field (phải khai báo với dấu # ở đầu)
    #password;

    constructor(username, password) {
        this.username = username;
        this.#password = password;
    }

    // 2. Getter & Setter
    get passwordMasked() {
        return "*".repeat(this.#password.length);
    }

    // 3. Static method
    static compareUsers(u1, u2) {
        return u1.username === u2.username;
    }
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const user = new UserAccount("viet", "super_secret_123");

console.log(user.username);         // "viet"
console.log(user.passwordMasked);   // "****************" (Getter chạy như thuộc tính)

// user.#password -> LỖI SyntaxError: Private field '#password' must be declared in an enclosing class!
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Tên Getter/Setter trùng với tên thuộc tính**: Nếu bạn viết `get age() { return this.age; }`, nó sẽ gọi đệ quy chính nó vô hạn và gây lỗi `RangeError: Maximum call stack size exceeded`. Luôn lưu trữ dữ liệu thực vào biến private như `#age` hoặc `_age`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `static` gọi qua tên Class: `ClassName.method()`.
2. `get prop()` và `set prop(val)` giúp kiểm soát quyền truy cập.
3. Ký tự `#` bảo vệ trường dữ liệu an toàn 100% (Hard Private).
""",
        "exercise": {
            "title": "Đóng gói mật khẩu tài khoản với Private Field và Getter",
            "difficulty": "HARD",
            "problem_description": """### Mục tiêu:
Xây dựng lớp `SecureAccount` có trường riêng tư `#password` và getter kiểm soát an toàn.

### Yêu cầu đề bài:
Nhập vào 2 chuỗi từ stdin:
1. `username`: Tên tài khoản.
2. `password`: Mật khẩu.

Xây dựng lớp `SecureAccount`:
* Khai báo trường riêng tư: `#password;`
* `constructor(username, password)`: gán `this.username = username;` và `this.#password = password;`
* Getter `get maskedPassword()`: trả về chuỗi gồm các dấu sao `*` có số lượng bằng đúng độ dài của `#password` (dùng `"*".repeat(this.#password.length)`).
* Phương thức tĩnh: `static isValidPassword(pwd)`: trả về `true` nếu `pwd.length >= 6`, ngược lại `false`.

Khởi tạo đối tượng: `const acc = new SecureAccount(username, password);`
In ra màn hình theo định dạng 3 dòng:
```text
Tai khoan: <acc.username>
Mat khau an: <acc.maskedPassword>
Do dai hop le: <SecureAccount.isValidPassword(password)>
```

### Ví dụ:
* **Đầu vào:** `admin 12345678`
* **Đầu ra:**
```text
Tai khoan: admin
Mat khau an: ********
Do dai hop le: true
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng Private Field `#password`, getter `get maskedPassword` và `static isValidPassword`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["#password","get maskedPassword","static isValidPassword","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng #password, getter maskedPassword và static isValidPassword."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const username = input[0];
const password = input[1];

// Xây dựng SecureAccount với #password, getter và static method

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const username = input[0];
const password = input[1];

class SecureAccount {
    #password;
    constructor(username, password) {
        this.username = username;
        this.#password = password;
    }
    get maskedPassword() {
        return "*".repeat(this.#password.length);
    }
    static isValidPassword(pwd) {
        return pwd.length >= 6;
    }
}

const acc = new SecureAccount(username, password);

console.log("Tai khoan:", acc.username);
console.log("Mat khau an:", acc.maskedPassword);
console.log("Do dai hop le:", SecureAccount.isValidPassword(password));
""",
            "test_cases": [
                {
                    "input": "admin 12345678",
                    "expected_output": "Tai khoan: admin\nMat khau an: ********\nDo dai hop le: true",
                    "is_hidden": False
                },
                {
                    "input": "user 123",
                    "expected_output": "Tai khoan: user\nMat khau an: ***\nDo dai hop le: false",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Tính năng Private Fields bắt đầu bằng ký tự `#` (ví dụ `#secret`) trong ES2022 mang lại lợi ích bảo mật nào vượt trội so với quy ước đặt tên dấu gạch dưới `_secret` trước đây?",
            "explanation": "Quy ước dấu gạch dưới _secret chỉ là thỏa thuận phong cách lập trình giữa các lập trình viên, mã bên ngoài vẫn có thể tự do đọc và ghi đè. Trong khi đó, trường bắt đầu bằng ký hiệu '#' được JavaScript Engine bảo vệ cứng ở mức ngôn ngữ (Hard Private), việc cố truy cập từ bên ngoài sẽ lập tức gây lỗi cú pháp SyntaxError ngay từ giai đoạn parse.",
            "options": [
                {"key": "A", "text": "Dấu # giúp thuộc tính tự động mã hóa AES-256.", "is_correct": False},
                {"key": "B", "text": "Dấu # là Private thực sự ở mức ngôn ngữ, cấm tuyệt đối mã bên ngoài truy cập và sẽ ném lỗi SyntaxError nếu vi phạm.", "is_correct": True},
                {"key": "C", "text": "Dấu # giúp thuộc tính chạy nhanh gấp đôi.", "is_correct": False},
                {"key": "D", "text": "Dấu # cho phép thuộc tính kế thừa qua 10 thế hệ.", "is_correct": False}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"🚀 Seeding Course 2 Modules 11 & 12 ({len(lessons)} lessons)...")
    save_and_seed_lessons("Khóa 2 - JavaScript Nâng cao", lessons)
