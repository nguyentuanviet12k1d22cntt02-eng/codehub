import sys
from js_seeder_helper import save_and_seed_lessons

sys.stdout.reconfigure(encoding='utf-8')

lessons = [
    # ========================================================
    # MODULE 7: Mảng (Array) & Các phương thức xử lý mảng
    # ========================================================
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-07",
        "chapter_id": "JS1-CH-07",
        "module_folder": "Module 07",
        "filename": "Lesson_07_01.md",
        "lesson_id": "JS1-07.01",
        "title": "Bài 7.1: Khởi tạo mảng, chỉ mục index và thuộc tính length",
        "objective": "Làm chủ cấu trúc mảng động trong JS, đánh số chỉ mục từ 0, công thức lấy phần tử cuối và thuộc tính length.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS1-07.01
title: "Khởi tạo mảng, chỉ mục index và thuộc tính length"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Array", "Mảng", "index", "length", "Cấu trúc dữ liệu"]
prerequisites: ["JS1-06.04"]
---

# Khởi tạo mảng, chỉ mục index và thuộc tính length

## 1. Khái niệm & Vấn đề thực tế
Mảng (Array) là cấu trúc dữ liệu có thứ tự dùng để lưu trữ một danh sách các phần tử. Trong JavaScript, mảng là mảng động (kích thước tự co giãn) và có thể chứa hỗn hợp nhiều kiểu dữ liệu khác nhau.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Khởi tạo mảng bằng cú pháp mảng nguyên mẫu (Array Literal)**:
  ```javascript
  const fruits = ["Táo", "Cam", "Xoài"];
  const numbers = [10, 20, 30, 40];
  ```
- **Chỉ mục (Zero-based Index)**: Phần tử đầu tiên có chỉ mục `0`, phần tử thứ hai có chỉ mục `1`,...
- **Thuộc tính `length`**: Trả về tổng số phần tử đang có trong mảng.
- **Phần tử cuối cùng**: Luôn nằm ở chỉ mục `arr[arr.length - 1]`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const scores = [8.5, 9.0, 7.5, 10.0];

console.log("Số lượng điểm:", scores.length);       // 4
console.log("Điểm đầu tiên:", scores[0]);           // 8.5
console.log("Điểm cuối cùng:", scores[scores.length - 1]); // 10.0
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Truy cập chỉ mục ngoài phạm vi**: Trong JS, nếu truy cập `scores[100]` khi mảng chỉ có 4 phần tử, chương trình **không báo lỗi IndexOutOfBounds** mà trả về giá trị `undefined`.
- **Gán `arr.length = 0`**: Kỹ thuật này sẽ xóa sạch toàn bộ phần tử trong mảng ngay lập tức.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Mảng bắt đầu từ vị trí index `0`.
2. Phần tử cuối cùng là `arr[arr.length - 1]`.
3. Truy cập index không tồn tại trả về `undefined`.
""",
        "exercise": {
            "title": "Trích xuất thông tin mảng số nguyên",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Đọc danh sách các số nguyên từ stdin vào mảng, trích xuất độ dài, phần tử đầu tiên và phần tử cuối cùng.

### Yêu cầu đề bài:
Nhập vào một danh sách các số nguyên từ stdin (các số ngăn cách nhau bởi khoảng trắng).
Hãy lưu các số vào một mảng `numbers` (đã ép sang kiểu số nguyên).

In ra màn hình theo đúng định dạng 3 dòng:
```text
So luong: <numbers.length>
Dau tien: <numbers[0]>
Cuoi cung: <numbers[numbers.length - 1]>
```

### Ví dụ:
* **Đầu vào:** `12 45 78 23 99`
* **Đầu ra:**
```text
So luong: 5
Dau tien: 12
Cuoi cung: 99
```

### Ràng buộc kỹ thuật:
* Sử dụng thuộc tính `.length` và cú pháp truy cập chỉ mục `[]`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["length","[","]","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng thuộc tính length và truy cập phần tử mảng bằng []."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

// Chuyển mảng chuỗi input thành mảng số nguyên và in thông tin

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const numbers = input.map(Number);

console.log("So luong:", numbers.length);
console.log("Dau tien:", numbers[0]);
console.log("Cuoi cung:", numbers[numbers.length - 1]);
""",
            "test_cases": [
                {
                    "input": "12 45 78 23 99",
                    "expected_output": "So luong: 5\nDau tien: 12\nCuoi cung: 99",
                    "is_hidden": False
                },
                {
                    "input": "7",
                    "expected_output": "So luong: 1\nDau tien: 7\nCuoi cung: 7",
                    "is_hidden": True
                },
                {
                    "input": "100 200 300",
                    "expected_output": "So luong: 3\nDau tien: 100\nCuoi cung: 300",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Trong JavaScript, điều gì xảy ra nếu bạn cố gắng đọc một phần tử tại vị trí `arr[10]` của một mảng chỉ có 3 phần tử?",
            "explanation": "JavaScript không ném ra lỗi IndexOutOfBoundsException như Java/C++. Nếu truy cập vào một chỉ mục không tồn tại, nó sẽ trả về giá trị 'undefined'.",
            "options": [
                {"key": "A", "text": "Chương trình dừng lại và ném ra lỗi ArrayIndexOutOfBoundsError.", "is_correct": False},
                {"key": "B", "text": "Trả về giá trị đặc biệt undefined.", "is_correct": True},
                {"key": "C", "text": "Trả về giá trị null.", "is_correct": False},
                {"key": "D", "text": "Trả về số 0.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-07",
        "chapter_id": "JS1-CH-07",
        "module_folder": "Module 07",
        "filename": "Lesson_07_02.md",
        "lesson_id": "JS1-07.02",
        "title": "Bài 7.2: Thao tác biến đổi mảng (push, pop, shift, unshift, slice, splice)",
        "objective": "Phân biệt các phương thức làm thay đổi mảng gốc (mutating: push, pop, shift, unshift, splice) và phương thức thuần túy không đổi (immutable: slice).",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS1-07.02
title: "Thao tác biến đổi mảng (push, pop, shift, unshift, slice, splice)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["push", "pop", "shift", "unshift", "splice", "slice", "Mutation"]
prerequisites: ["JS1-07.01"]
---

# Thao tác biến đổi mảng (push, pop, shift, unshift, slice, splice)

## 1. Khái niệm & Vấn đề thực tế
Khi quản lý danh sách công việc (Todo List) hay hàng đợi giao dịch, ta liên tục cần thêm mới hoặc loại bỏ phần tử ở đầu/cuối hoặc giữa danh sách.

Trong JavaScript, có hai nhóm phương thức quan trọng:
1. **Mutating Methods (Làm thay đổi mảng gốc)**: `push()`, `pop()`, `shift()`, `unshift()`, `splice()`.
2. **Non-mutating Methods (Trả về mảng mới, giữ nguyên mảng gốc)**: `slice()`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Thao tác ở cuối mảng**:
  - `arr.push(val)`: Thêm phần tử vào **cuối** mảng (trả về length mới).
  - `arr.pop()`: Xóa và trả về phần tử ở **cuối** mảng.
- **Thao tác ở đầu mảng**:
  - `arr.unshift(val)`: Thêm phần tử vào **đầu** mảng.
  - `arr.shift()`: Xóa và trả về phần tử ở **đầu** mảng.
- **Trích xuất & Cắt sửa**:
  - `arr.slice(start, end)`: Trích xuất một mảng con từ chỉ mục `start` đến trước `end` (mảng gốc không đổi).
  - `arr.splice(start, deleteCount, ...items)`: Xóa `deleteCount` phần tử từ `start` và có thể chèn thêm phần tử mới vào vị trí đó (mảng gốc bị thay đổi).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const queue = ["An", "Binh"];

queue.push("Chi"); // ["An", "Binh", "Chi"]
const served = queue.shift(); // Phục vụ "An", queue còn ["Binh", "Chi"]

console.log("Đã phục vụ:", served);
console.log("Còn lại:", queue.join(", "));
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Nhầm lẫn giữa `slice` và `splice`**: `slice` KHÔNG làm thay đổi mảng gốc, còn `splice` CẮT TRỰC TIẾP vào mảng gốc.
- **Hiệu năng của `shift()`/`unshift()`**: Vì phải đánh chỉ mục lại toàn bộ phần tử phía sau, `shift()` chậm hơn nhiều so với `pop()`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cuối mảng: `push` (thêm), `pop` (xóa).
2. Đầu mảng: `unshift` (thêm), `shift` (xóa).
3. `slice` sao chép an toàn; `splice` can thiệp trực tiếp mảng gốc.
""",
        "exercise": {
            "title": "Mô phỏng hàng đợi phục vụ khách hàng",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng các phương thức `push()`, `shift()` và `join()` để mô phỏng quy trình hàng đợi (Queue FIFO).

### Yêu cầu đề bài:
Cho một hàng đợi ban đầu gồm 2 khách hàng:
`const queue = ["Khach_A", "Khach_B"];`

Đọc từ stdin 2 tên khách hàng mới đến sau (ngăn cách bởi dấu cách).
1. Dùng `push()` để thêm lần lượt 2 khách hàng mới vào cuối hàng đợi.
2. Dùng `shift()` để phục vụ người đầu tiên trong hàng đợi và lưu vào biến `firstServed`.
3. In ra thông báo khách đã được phục vụ và danh sách những người còn đang chờ theo định dạng:
```text
Da phuc vu: <firstServed>
Dang cho: <danh_sach_con_lai_cach_nhau_boi_dau_phay_va_dau_cach>
```

### Ví dụ:
* **Đầu vào:** `Khach_C Khach_D`
* **Đầu ra:**
```text
Da phuc vu: Khach_A
Dang cho: Khach_B, Khach_C, Khach_D
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `push()`, `shift()` và `join(", ")`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["push","shift","join","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng các phương thức mảng push(), shift() và join()."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const queue = ["Khach_A", "Khach_B"];

// Thêm khách mới, phục vụ khách đầu và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const queue = ["Khach_A", "Khach_B"];
queue.push(input[0]);
queue.push(input[1]);

const firstServed = queue.shift();

console.log("Da phuc vu:", firstServed);
console.log("Dang cho:", queue.join(", "));
""",
            "test_cases": [
                {
                    "input": "Khach_C Khach_D",
                    "expected_output": "Da phuc vu: Khach_A\nDang cho: Khach_B, Khach_C, Khach_D",
                    "is_hidden": False
                },
                {
                    "input": "Nam Hoa",
                    "expected_output": "Da phuc vu: Khach_A\nDang cho: Khach_B, Nam, Hoa",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Phương thức nào sau đây KHÔNG làm biến đổi (mutate) mảng gốc?",
            "explanation": "Phương thức 'slice(start, end)' tạo ra một bản sao nông (shallow copy) của một phần mảng mà hoàn toàn không làm biến đổi mảng ban đầu. Trong khi đó, push(), shift(), splice() đều trực tiếp làm biến đổi mảng gốc.",
            "options": [
                {"key": "A", "text": "splice()", "is_correct": False},
                {"key": "B", "text": "push()", "is_correct": False},
                {"key": "C", "text": "slice()", "is_correct": True},
                {"key": "D", "text": "shift()", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-07",
        "chapter_id": "JS1-CH-07",
        "module_folder": "Module 07",
        "filename": "Lesson_07_03.md",
        "lesson_id": "JS1-07.03",
        "title": "Bài 7.3: Tìm kiếm và kiểm tra trong mảng (indexOf, includes, find, some, every)",
        "objective": "Làm chủ các phương thức tìm kiếm giá trị đơn giản và hàm kiểm tra điều kiện logic bậc cao trong mảng.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS1-07.03
title: "Tìm kiếm và kiểm tra trong mảng (indexOf, includes, find, some, every)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["includes", "indexOf", "find", "some", "every", "Tìm kiếm mảng"]
prerequisites: ["JS1-07.02"]
---

# Tìm kiếm và kiểm tra trong mảng (indexOf, includes, find, some, every)

## 1. Khái niệm & Vấn đề thực tế
Khi làm việc với danh sách dữ liệu, việc kiểm tra xem một phần tử có tồn tại hay không, tìm vị trí của nó hoặc kiểm định xem tất cả/ít nhất một phần tử có thỏa mãn tiêu chí nào đó là thao tác xảy ra thường xuyên.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Kiểm tra sự tồn tại đơn giản**:
  - `arr.includes(val)`: Trả về `true` nếu mảng chứa `val`, ngược lại `false`.
  - `arr.indexOf(val)`: Trả về chỉ mục index đầu tiên tìm thấy, hoặc `-1` nếu không có.
- **Kiểm tra theo hàm điều kiện (Predicate Function)**:
  - `arr.find(item => condition)`: Trả về **phần tử đầu tiên** thỏa mãn điều kiện (hoặc `undefined` nếu không tìm thấy).
  - `arr.some(item => condition)`: Trả về `true` nếu có **ít nhất một** phần tử thỏa mãn điều kiện.
  - `arr.every(item => condition)`: Trả về `true` khi và chỉ khi **toàn bộ** các phần tử đều thỏa mãn điều kiện.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const scores = [6.5, 8.0, 4.5, 9.5];

// Có bạn nào bị điểm dưới trung bình (< 5.0) không?
const hasFailed = scores.some(score => score < 5.0);
console.log("Có điểm dưới TB:", hasFailed); // true (vì có 4.5)

// Tất cả đều trên 4.0 chứ?
const allAbove4 = scores.every(score => score >= 4.0);
console.log("Tất cả >= 4.0:", allAbove4); // true
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dùng `indexOf` kiểm tra tồn tại**: Trước ES6, người ta phải viết `arr.indexOf(x) !== -1`. Từ ES7 (ES2016), hãy dùng `arr.includes(x)` để mã nguồn trực quan hơn.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `includes()`: Kiểm tra giá trị trực tiếp.
2. `some()`: Ít nhất 1 phần tử thỏa mãn.
3. `every()`: 100% phần tử phải thỏa mãn.
""",
        "exercise": {
            "title": "Kiểm định chất lượng điểm thi của lớp học",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng phương thức `some()` và `every()` để đánh giá danh sách điểm thi nhận từ stdin.

### Yêu cầu đề bài:
Nhập vào danh sách điểm thi (các số thực cách nhau bởi khoảng trắng) từ stdin.
Chuyển đổi các giá trị thành mảng số thực `scores`.

Hãy kiểm tra:
1. `hasFailing`: Có học sinh nào bị điểm liệt (`< 4.0`) hay không (dùng `scores.some()`).
2. `isAllPass`: Tất cả học sinh có đạt chuẩn qua môn (`>= 5.0`) hay không (dùng `scores.every()`).

In kết quả ra màn hình theo đúng định dạng 2 dòng:
```text
Co diem liet: <true | false>
Tat ca qua mon: <true | false>
```

### Ví dụ:
* **Đầu vào:** `6.5 8.0 7.2 9.0 5.5`
* **Đầu ra:**
```text
Co diem liet: false
Tat ca qua mon: true
```
* **Đầu vào:** `6.0 3.5 8.5 7.0`
* **Đầu ra:**
```text
Co diem liet: true
Tat ca qua mon: false
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng phương thức `some()` và `every()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["some","every","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng cả hai phương thức some() và every()."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const scores = input.map(Number);

// Kiểm tra điểm liệt và qua môn bằng some() và every()

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const scores = input.map(Number);

const hasFailing = scores.some(s => s < 4.0);
const isAllPass = scores.every(s => s >= 5.0);

console.log("Co diem liet:", hasFailing);
console.log("Tat ca qua mon:", isAllPass);
""",
            "test_cases": [
                {
                    "input": "6.5 8.0 7.2 9.0 5.5",
                    "expected_output": "Co diem liet: false\nTat ca qua mon: true",
                    "is_hidden": False
                },
                {
                    "input": "6.0 3.5 8.5 7.0",
                    "expected_output": "Co diem liet: true\nTat ca qua mon: false",
                    "is_hidden": True
                },
                {
                    "input": "5.0 5.0 4.5",
                    "expected_output": "Co diem liet: false\nTat ca qua mon: false",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Phương thức `every()` trên mảng rỗng `[].every(x => x > 10)` sẽ trả về kết quả là gì?",
            "explanation": "Trong toán học và logic hình thức, tính chất chân lý phổ quát (vacuous truth) quy định rằng một phát biểu 'với mọi x trong tập rỗng' luôn luôn đúng. Do đó [].every(...) luôn trả về true.",
            "options": [
                {"key": "A", "text": "false", "is_correct": False},
                {"key": "B", "text": "true", "is_correct": True},
                {"key": "C", "text": "undefined", "is_correct": False},
                {"key": "D", "text": "Ném lỗi TypeError.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-07",
        "chapter_id": "JS1-CH-07",
        "module_folder": "Module 07",
        "filename": "Lesson_07_04.md",
        "lesson_id": "JS1-07.04",
        "title": "Bài 7.4: Biến đổi và tổng hợp mảng (map, filter, reduce, sort)",
        "objective": "Làm chủ bộ 4 Higher-Order Array Methods cốt lõi trong lập trình hàm (Functional Programming) của Modern JavaScript.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS1-07.04
title: "Biến đổi và tổng hợp mảng (map, filter, reduce, sort)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["map", "filter", "reduce", "sort", "Higher-Order Function", "Functional Programming"]
prerequisites: ["JS1-07.03"]
---

# Biến đổi và tổng hợp mảng (map, filter, reduce, sort)

## 1. Khái niệm & Vấn đề thực tế
Bộ 4 phương thức `map`, `filter`, `reduce` và `sort` tạo nên linh hồn của phong cách viết code JavaScript hiện đại: thay vì dùng vòng lặp `for` thủ công dài dòng, ta sử dụng các hàm bậc cao để biến đổi dữ liệu một cách trong sáng, biểu cảm (Declarative Programming).

---

## 2. Cú pháp & Quy tắc cốt lõi
1. **`filter(fn)`**: Lọc và trả về mảng mới chỉ chứa các phần tử thỏa mãn hàm điều kiện.
2. **`map(fn)`**: Biến đổi từng phần tử thành một giá trị mới và trả về mảng kết quả có cùng độ dài.
3. **`reduce((acc, cur) => ..., initialVal)`**: Tích lũy toàn bộ mảng thành một giá trị duy nhất (tổng, tích, object gom nhóm).
4. **`sort((a, b) => a - b)`**: Sắp xếp mảng (mặc định JS sắp xếp theo chuỗi UTF-16, do đó muốn sắp xếp số bắt buộc phải truyền comparator `(a, b) => a - b`).

---

## 3. Ví dụ trực quan: Xâu chuỗi phương thức (Chaining)

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

// Lấy các số chẵn, bình phương lên rồi tính tổng
const total = numbers
    .filter(n => n % 2 === 0) // [2, 4, 6]
    .map(n => n * n)          // [4, 16, 36]
    .reduce((sum, n) => sum + n, 0); // 56

console.log("Tổng bình phương các số chẵn:", total); // 56
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lỗi `sort()` không truyền comparator**: `[10, 2, 5].sort()` sẽ cho ra `[10, 2, 5]` vì `"10"` đứng trước `"2"` theo bảng mã ký tự! Luôn viết `arr.sort((a, b) => a - b)`.
- **`sort()` biến đổi trực tiếp mảng gốc**: Nếu không muốn mảng gốc bị đổi vị trí, hãy sao chép trước: `[...arr].sort(...)`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `filter`: lọc bớt phần tử.
2. `map`: biến đổi từng phần tử.
3. `reduce`: gom toàn bộ mảng về 1 giá trị.
4. `sort`: luôn truyền `(a, b) => a - b` khi sắp xếp số.
""",
        "exercise": {
            "title": "Lọc số chẵn, bình phương và tính tổng",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Xâu chuỗi (chaining) các phương thức `filter()`, `map()`, và `reduce()` để xử lý mảng số nguyên từ stdin.

### Yêu cầu đề bài:
Nhập vào một danh sách các số nguyên từ stdin (cách nhau bởi khoảng trắng).
Hãy thực hiện theo quy trình:
1. Dùng `filter()` để chỉ giữ lại các số chẵn ($n \\pmod 2 === 0$).
2. Dùng `map()` để tính bình phương của mỗi số chẵn đó ($n^2$).
3. Dùng `reduce()` để tính tổng của toàn bộ các số đã bình phương (giá trị khởi tạo tích lũy là `0`).

In kết quả ra màn hình theo định dạng:
```text
Tong ket qua: <tong>
```

### Ví dụ:
* **Đầu vào:** `1 2 3 4 5 6`
* **Đầu ra:** `Tong ket qua: 56` (vì $2^2 + 4^2 + 6^2 = 4 + 16 + 36 = 56$)
* **Đầu vào:** `1 3 5`
* **Đầu ra:** `Tong ket qua: 0` (vì không có số chẵn nào)

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `filter()`, `map()`, `reduce()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["filter","map","reduce","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu kết hợp cả 3 phương thức filter, map và reduce."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const nums = input.map(Number);

// Áp dụng filter -> map -> reduce để tính kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const nums = input.map(Number);

const result = nums
    .filter(n => n % 2 === 0)
    .map(n => n * n)
    .reduce((acc, cur) => acc + cur, 0);

console.log("Tong ket qua:", result);
""",
            "test_cases": [
                {
                    "input": "1 2 3 4 5 6",
                    "expected_output": "Tong ket qua: 56",
                    "is_hidden": False
                },
                {
                    "input": "1 3 5",
                    "expected_output": "Tong ket qua: 0",
                    "is_hidden": True
                },
                {
                    "input": "2 4 8",
                    "expected_output": "Tong ket qua: 84",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Vì sao khi sắp xếp mảng số `[10, 5, 2, 20]` bằng phương thức `sort()` mặc định không truyền tham số, kết quả lại là `[10, 2, 20, 5]`?",
            "explanation": "Mặc định, phương thức sort() của JavaScript chuyển đổi tất cả các phần tử sang chuỗi ký tự rồi so sánh theo thứ tự bảng mã Unicode/UTF-16. Ký tự '1' đứng trước '2', '2' đứng trước '5', do đó '10' được xếp trước '2'.",
            "options": [
                {"key": "A", "text": "Vì đây là lỗi của trình thông dịch V8.", "is_correct": False},
                {"key": "B", "text": "Vì mặc định sort() ép các phần tử về chuỗi rồi so sánh theo thứ tự từ điển UTF-16.", "is_correct": True},
                {"key": "C", "text": "Vì sort() chỉ hỗ trợ mảng có ít hơn 3 phần tử.", "is_correct": False},
                {"key": "D", "text": "Vì các số nguyên cần phải chia hết cho 2.", "is_correct": False}
            ]
        }
    },

    # ========================================================
    # MODULE 8: Chuỗi (String) & Kỹ thuật xử lý văn bản
    # ========================================================
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-08",
        "chapter_id": "JS1-CH-08",
        "module_folder": "Module 08",
        "filename": "Lesson_08_01.md",
        "lesson_id": "JS1-08.01",
        "title": "Bài 8.1: Khai báo chuỗi, ký tự thoát & Template Literals (ES6)",
        "objective": "Làm chủ cú pháp Template Literals với dấu backtick, nội suy biểu thức ${} và các ký tự thoát đặc biệt (Escape Sequences).",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS1-08.01
title: "Khai báo chuỗi, ký tự thoát & Template Literals (ES6)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Template Literals", "Backtick", "Escape Sequence", "Nội suy chuỗi", "ES6"]
prerequisites: ["JS1-07.04"]
---

# Khai báo chuỗi, ký tự thoát & Template Literals (ES6)

## 1. Khái niệm & Vấn đề thực tế
Trước ES6, để ghép biến và biểu thức vào một chuỗi dài nhiều dòng, lập trình viên phải dùng toán tử `+` và ký tự xuống dòng `\\n` rất rối mắt và dễ nhầm lẫn.

ES6 giới thiệu **Template Literals** (sử dụng dấu huyền - backtick `` ` ``), cho phép nội suy biến trực tiếp với cú pháp `${expression}` và viết chuỗi nhiều dòng hoàn toàn tự nhiên.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Ký tự thoát (Escape Sequences)**:
  - `\\n`: Xuống dòng.
  - `\\t`: Tab cách dòng.
  - `\\\"`, `\\'`: Thoát dấu ngoặc kép / đơn.
  - `\\\\`: Ký tự dấu gạch chéo ngược.
- **Template Literals**:
  ```javascript
  const name = "Hoàng";
  const year = 2026;
  const message = `Xin chào ${name}, chào mừng đến năm ${year}!`;
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const item = "Khóa học JavaScript";
const price = 450000;
const vat = 0.1;

// Nội suy biểu thức toán học trực tiếp trong chuỗi
const invoice = `Đơn hàng: ${item}
Tổng thanh toán: ${price * (1 + vat)} VNĐ`;

console.log(invoice);
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Nhầm dấu backtick `` ` `` với dấu nháy đơn `'`**: Cú pháp `${...}` chỉ hoạt động bên trong cặp dấu backtick `` ` ``.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng backtick `` ` `` cho mọi chuỗi có chứa biến hoặc cần xuống dòng.
2. Cú pháp `${biểu_thức}` cho phép đặt bất kỳ phép tính hoặc lời gọi hàm hợp lệ nào vào bên trong chuỗi.
""",
        "exercise": {
            "title": "Tạo thẻ thông tin học viên bằng Template Literals",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng Template Literals (dấu backtick `` ` ``) và nội suy biểu thức `${}` để xuất thông tin định dạng.

### Yêu cầu đề bài:
Nhập vào 3 thông tin từ stdin:
1. `name`: Tên sinh viên (ví dụ `"Nguyen_Van_A"`).
2. `course`: Mã môn học (ví dụ `"JS-CORE"`).
3. `score`: Điểm tổng kết (số thực, ví dụ `8.5`).

Hãy dùng Template Literals để tạo và in ra chính xác 3 dòng:
```text
Hoc vien: <name>
Mon hoc: <course>
Ket qua: <score >= 5.0 ? "DAT" : "HOC LAI">
```

### Ví dụ:
* **Đầu vào:** `Nguyen_Van_A JS-CORE 8.5`
* **Đầu ra:**
```text
Hoc vien: Nguyen_Van_A
Mon hoc: JS-CORE
Ket qua: DAT
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cú pháp Template Literals (dấu backtick `` ` ``) và `${}`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["`","${","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng Template Literals với dấu backtick và cú pháp nội suy ${}."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const name = input[0];
const course = input[1];
const score = parseFloat(input[2]);

// In thẻ thông tin sử dụng Template Literals

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const name = input[0];
const course = input[1];
const score = parseFloat(input[2]);

const output = `Hoc vien: ${name}
Mon hoc: ${course}
Ket qua: ${score >= 5.0 ? "DAT" : "HOC LAI"}`;

console.log(output);
""",
            "test_cases": [
                {
                    "input": "Nguyen_Van_A JS-CORE 8.5",
                    "expected_output": "Hoc vien: Nguyen_Van_A\nMon hoc: JS-CORE\nKet qua: DAT",
                    "is_hidden": False
                },
                {
                    "input": "Tran_Thi_B JS-CORE 4.0",
                    "expected_output": "Hoc vien: Tran_Thi_B\nMon hoc: JS-CORE\nKet qua: HOC LAI",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Ký hiệu nào sau đây được sử dụng để định nghĩa một Template Literal trong JavaScript?",
            "explanation": "Template Literals được bao bọc bởi cặp ký tự dấu huyền (backtick ` `), nằm ở góc trên cùng bên trái bàn phím (chung phím với dấu ~).",
            "options": [
                {"key": "A", "text": "Dấu nháy kép \" \"", "is_correct": False},
                {"key": "B", "text": "Dấu nháy đơn ' '", "is_correct": False},
                {"key": "C", "text": "Dấu huyền (backtick) ` `", "is_correct": True},
                {"key": "D", "text": "Dấu gạch chéo kép //", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-08",
        "chapter_id": "JS1-CH-08",
        "module_folder": "Module 08",
        "filename": "Lesson_08_02.md",
        "lesson_id": "JS1-08.02",
        "title": "Bài 8.2: Độ dài chuỗi, toUpperCase(), toLowerCase() & trim()",
        "objective": "Nắm vững tính bất biến (immutability) của chuỗi trong JS và các phương thức chuẩn hóa văn bản cơ bản.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS1-08.02
title: "Độ dài chuỗi, toUpperCase(), toLowerCase() & trim()"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["String immutability", "toUpperCase", "toLowerCase", "trim", "length"]
prerequisites: ["JS1-08.01"]
---

# Độ dài chuỗi, toUpperCase(), toLowerCase() & trim()

## 1. Khái niệm & Vấn đề thực tế
Dữ liệu chuỗi thu nhận từ bàn phím hoặc tệp tin thường bị lẫn khoảng trắng ở đầu và cuối chuỗi, hoặc chữ hoa/chữ thường không đồng nhất.
Để chuẩn hóa dữ liệu so sánh, ta sử dụng các phương thức xử lý chuỗi tích hợp sẵn.

> **QUY TẮC CỐT LÕI**: Chuỗi trong JavaScript là **Bất biến (Immutable)**. Mọi phương thức xử lý chuỗi đều **trả về chuỗi mới**, không bao giờ làm thay đổi chuỗi gốc.

---

## 2. Cú pháp & Quy tắc cốt lõi
- `str.length`: Số lượng ký tự trong chuỗi.
- `str.trim()`: Loại bỏ toàn bộ khoảng trắng, tab, dấu xuống dòng ở hai đầu chuỗi.
- `str.toUpperCase()`: Chuyển toàn bộ thành chữ in hoa.
- `str.toLowerCase()`: Chuyển toàn bộ thành chữ in thường.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const rawEmail = "   Admin@Mcode.com   \\n";

// Chuẩn hóa email: xóa khoảng trắng 2 đầu và đưa về chữ thường
const cleanEmail = rawEmail.trim().toLowerCase();

console.log(cleanEmail); // "admin@mcode.com"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Tưởng chuỗi bị thay đổi**:
  ```javascript
  let str = "hello";
  str.toUpperCase();
  console.log(str); // Vẫn là "hello"! Vì chuỗi là immutable, phải gán lại: str = str.toUpperCase();
  ```

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Chuỗi là Immutable: luôn nhận kết quả vào biến mới hoặc gán lại.
2. Luôn dùng `.trim()` và `.toLowerCase()` khi chuẩn hóa tài khoản/email người dùng.
""",
        "exercise": {
            "title": "Chuẩn hóa và đo độ dài chuỗi văn bản",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Áp dụng `trim()`, `toUpperCase()` và `.length` để làm sạch và đo lường chuỗi văn bản.

### Yêu cầu đề bài:
Nhận vào một chuỗi văn bản từ stdin (có thể chứa khoảng trắng thừa ở hai đầu).
1. Dùng `.trim()` để loại bỏ khoảng trắng dư thừa ở hai đầu.
2. Chuyển đổi chuỗi đã làm sạch thành chữ in HOA bằng `.toUpperCase()`.
3. Đo độ dài của chuỗi sau khi làm sạch.

In ra màn hình theo đúng định dạng 2 dòng:
```text
Chuoi chuan hoa: <chuoi_in_hoa>
Do dai: <do_dai>
```

### Ví dụ:
* **Đầu vào:** `   javascript language   `
* **Đầu ra:**
```text
Chuoi chuan hoa: JAVASCRIPT LANGUAGE
Do dai: 19
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `trim()` và `toUpperCase()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["trim","toUpperCase","length","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng các phương thức trim(), toUpperCase() và thuộc tính length."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8');

// Chuẩn hóa chuỗi và in thông tin theo yêu cầu

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8');

const cleaned = input.trim().toUpperCase();

console.log("Chuoi chuan hoa:", cleaned);
console.log("Do dai:", cleaned.length);
""",
            "test_cases": [
                {
                    "input": "   javascript language   ",
                    "expected_output": "Chuoi chuan hoa: JAVASCRIPT LANGUAGE\nDo dai: 19",
                    "is_hidden": False
                },
                {
                    "input": "  Hello World  ",
                    "expected_output": "Chuoi chuan hoa: HELLO WORLD\nDo dai: 11",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Tính chất 'Bất biến' (Immutability) của kiểu dữ liệu String trong JavaScript có nghĩa là gì?",
            "explanation": "Tính bất biến nghĩa là một khi chuỗi đã được tạo ra trong bộ nhớ, nội dung của nó không thể bị thay đổi trực tiếp. Mọi hàm xử lý như toUpperCase(), trim(), replace() đều tạo ra và trả về một chuỗi mới hoàn toàn.",
            "options": [
                {"key": "A", "text": "Không thể gán lại giá trị mới cho biến lưu chuỗi.", "is_correct": False},
                {"key": "B", "text": "Các phương thức xử lý chuỗi luôn trả về chuỗi mới chứ không làm thay đổi chuỗi gốc ban đầu.", "is_correct": True},
                {"key": "C", "text": "Chuỗi không thể chứa các ký tự số.", "is_correct": False},
                {"key": "D", "text": "Độ dài chuỗi luôn luôn là hằng số cố định bằng 10.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-08",
        "chapter_id": "JS1-CH-08",
        "module_folder": "Module 08",
        "filename": "Lesson_08_03.md",
        "lesson_id": "JS1-08.03",
        "title": "Bài 8.3: Tìm kiếm & Trích xuất chuỗi (includes, startsWith, endsWith, slice)",
        "objective": "Làm chủ các phương thức kiểm tra tiền tố, hậu tố và kỹ thuật cắt chuỗi linh hoạt bằng slice().",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS1-08.03
title: "Tìm kiếm & Trích xuất chuỗi (includes, startsWith, endsWith, slice)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["startsWith", "endsWith", "includes", "slice", "Trích xuất chuỗi"]
prerequisites: ["JS1-08.02"]
---

# Tìm kiếm & Trích xuất chuỗi (includes, startsWith, endsWith, slice)

## 1. Khái niệm & Vấn đề thực tế
Khi kiểm tra định dạng tên tệp (đuôi `.js`, `.png`), mã định danh sinh viên hay kiểm tra một từ khóa có nằm trong văn bản hay không, JavaScript cung cấp bộ công cụ tìm kiếm và cắt chuỗi vô cùng tiện lợi.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Kiểm tra vị trí và tiền tố/hậu tố**:
  - `str.includes(sub)`: Kiểm tra xem `sub` có xuất hiện ở bất kỳ đâu trong chuỗi hay không.
  - `str.startsWith(prefix)`: Kiểm tra xem chuỗi có **bắt đầu** bằng `prefix` hay không.
  - `str.endsWith(suffix)`: Kiểm tra xem chuỗi có **kết thúc** bằng `suffix` hay không.
- **Cắt chuỗi bằng `str.slice(startIndex, endIndex)`**:
  - Trích xuất phần chuỗi từ chỉ mục `startIndex` đến trước `endIndex`.
  - Hỗ trợ chỉ mục âm: `str.slice(-4)` lấy 4 ký tự cuối cùng của chuỗi!

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const filename = "app_server.js";

console.log(filename.startsWith("app")); // true
console.log(filename.endsWith(".js"));   // true

// Lấy phần mở rộng (extension)
const ext = filename.slice(-3);
console.log("Extension:", ext); // ".js"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Phân biệt hoa thường**: Các phương thức tìm kiếm chuỗi phân biệt chữ hoa/thường (`"JS".startsWith("js")` trả về `false`). Hãy đưa về `.toLowerCase()` trước khi kiểm tra nếu cần tìm kiếm không phân biệt hoa thường.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `startsWith()`, `endsWith()`, `includes()` trả về kết quả `boolean`.
2. `slice(start, end)` cho phép dùng chỉ mục âm để cắt từ đuôi chuỗi.
""",
        "exercise": {
            "title": "Kiểm định mã sinh viên hợp lệ",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng `startsWith()` và `endsWith()` để kiểm tra tính hợp lệ của mã định danh sinh viên từ stdin.

### Yêu cầu đề bài:
Nhập vào một chuỗi `studentId` từ stdin.
Quy định mã sinh viên hợp lệ của học viện:
1. Bắt đầu bằng tiền tố: `"MCODE-"`
2. Kết thúc bằng hậu tố năm: `"-2026"`

Nếu thỏa mãn cả hai điều kiện trên, in ra:
```text
Hop le: true
```
Nếu không thỏa mãn, in ra:
```text
Hop le: false
```

### Ví dụ:
* **Đầu vào:** `MCODE-SV01-2026`
* **Đầu ra:** `Hop le: true`
* **Đầu vào:** `KHOA-SV02-2026`
* **Đầu ra:** `Hop le: false`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `startsWith()` và `endsWith()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["startsWith","endsWith","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng cả hai phương thức startsWith() và endsWith()."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const studentId = input[0];

// Kiểm tra mã sinh viên theo quy định

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const studentId = input[0];

const isValid = studentId.startsWith("MCODE-") && studentId.endsWith("-2026");

console.log("Hop le:", isValid);
""",
            "test_cases": [
                {
                    "input": "MCODE-SV01-2026",
                    "expected_output": "Hop le: true",
                    "is_hidden": False
                },
                {
                    "input": "KHOA-SV02-2026",
                    "expected_output": "Hop le: false",
                    "is_hidden": True
                },
                {
                    "input": "MCODE-TEST-2025",
                    "expected_output": "Hop le: false",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Phương thức `\"JavaScript\".slice(-6)` sẽ trả về chuỗi kết quả nào?",
            "explanation": "Khi truyền chỉ mục âm vào phương thức slice(), nó sẽ đếm ngược từ cuối chuỗi. 6 ký tự cuối cùng của từ 'JavaScript' chính là 'Script'.",
            "options": [
                {"key": "A", "text": "\"Java\"", "is_correct": False},
                {"key": "B", "text": "\"Script\"", "is_correct": True},
                {"key": "C", "text": "\"avaScr\"", "is_correct": False},
                {"key": "D", "text": "\"JavaScript\"", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-08",
        "chapter_id": "JS1-CH-08",
        "module_folder": "Module 08",
        "filename": "Lesson_08_04.md",
        "lesson_id": "JS1-08.04",
        "title": "Bài 8.4: Tách ghép & Thay thế chuỗi (split, join, replace, replaceAll)",
        "objective": "Làm chủ kỹ thuật chuyển đổi qua lại giữa chuỗi và mảng bằng split/join và thay thế ký tự bằng replace/replaceAll.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS1-08.04
title: "Tách ghép & Thay thế chuỗi (split, join, replace, replaceAll)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["split", "join", "replace", "replaceAll", "Chuẩn hóa chuỗi"]
prerequisites: ["JS1-08.03"]
---

# Tách ghép & Thay thế chuỗi (split, join, replace, replaceAll)

## 1. Khái niệm & Vấn đề thực tế
Cặp đôi `split()` và `join()` là cầu nối trực tiếp giữa hai cấu trúc dữ liệu cơ bản nhất trong JavaScript: **String** và **Array**.
- `split()`: Băm nhỏ một chuỗi thành mảng các từ/thành phần con dựa trên dấu phân cách.
- `join()`: Ghép các phần tử trong mảng lại thành một chuỗi duy nhất.

Ngoài ra, `replace()` và `replaceAll()` (ES2021) giúp thay thế nhanh chóng các từ hoặc mẫu ký tự trong văn bản.

---

## 2. Cú pháp & Quy tắc cốt lõi
- `str.split(separator)`: Tách chuỗi thành mảng.
- `arr.join(separator)`: Ghép mảng thành chuỗi.
- `str.replace(target, replacement)`: Chỉ thay thế **lần xuất hiện đầu tiên** của `target`.
- `str.replaceAll(target, replacement)`: Thay thế **tất cả mọi lần xuất hiện** của `target`.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const sentence = "hoc-lap-trinh-javascript-thuan";

// 1. Tách chuỗi thành mảng các từ
const words = sentence.split("-"); // ["hoc", "lap", "trinh", "javascript", "thuan"]

// 2. Ghép lại bằng dấu cách
const cleanSentence = words.join(" ");
console.log(cleanSentence); // "hoc lap trinh javascript thuan"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lầm tưởng `replace()` thay thế toàn bộ**: `str.replace("a", "b")` chỉ đổi đúng chữ `a` đầu tiên. Muốn đổi hết hãy dùng `str.replaceAll("a", "b")` hoặc biểu thức chính quy `/a/g`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `split` biến Chuỗi thành Mảng.
2. `join` biến Mảng thành Chuỗi.
3. Dùng `replaceAll` khi cần đổi tất cả ký tự trong toàn bộ văn bản.
""",
        "exercise": {
            "title": "Chuẩn hóa câu văn từ danh sách từ khóa",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng `split()`, `join()` và `replaceAll()` để định dạng lại văn bản nhận từ stdin.

### Yêu cầu đề bài:
Nhập vào một chuỗi các từ được ngăn cách bởi dấu gạch dưới `_` từ stdin (ví dụ: `"lap_trinh_javascript_co_ban"`).
1. Sử dụng `.replaceAll("_", " ")` hoặc `split("_").join(" ")` để chuyển toàn bộ dấu gạch dưới thành dấu cách.
2. Tách chuỗi đã đổi thành mảng các từ bằng `split(" ")`.
3. In ra số lượng từ trong câu.
4. Ghép lại các từ đó nhưng ngăn cách bằng dấu gạch ngang `-`.

In ra màn hình theo đúng định dạng 3 dòng:
```text
Cau hoan chinh: <cau_ngan_cach_bang_dau_cach>
So tu: <so_luong_tu>
Noi lai: <cau_ngan_cach_bang_dau_gach_ngang>
```

### Ví dụ:
* **Đầu vào:** `lap_trinh_javascript_co_ban`
* **Đầu ra:**
```text
Cau hoan chinh: lap trinh javascript co ban
So tu: 4
Noi lai: lap-trinh-javascript-co-ban
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `split()` và `join()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["split","join","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng cả hai phương thức split() và join()."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const rawStr = input[0];

// Xử lý chuỗi bằng split và join theo yêu cầu

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const rawStr = input[0];

const words = rawStr.split("_");
const spaceStr = words.join(" ");
const dashStr = words.join("-");

console.log("Cau hoan chinh:", spaceStr);
console.log("So tu:", words.length);
console.log("Noi lai:", dashStr);
""",
            "test_cases": [
                {
                    "input": "lap_trinh_javascript_co_ban",
                    "expected_output": "Cau hoan chinh: lap trinh javascript co ban\nSo tu: 4\nNoi lai: lap-trinh-javascript-co-ban",
                    "is_hidden": False
                },
                {
                    "input": "mcode_online_learning",
                    "expected_output": "Cau hoan chinh: mcode online learning\nSo tu: 3\nNoi lai: mcode-online-learning",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Sự khác biệt giữa phương thức `str.replace(\"-\", \" \")` và `str.replaceAll(\"-\", \" \")` là gì?",
            "explanation": "Phương thức replace() chỉ tìm và thay thế ký tự khớp đầu tiên mà nó bắt gặp, các ký tự còn lại phía sau không bị đổi. Phương thức replaceAll() (ra mắt từ ES2021) thay thế tất cả mọi lần xuất hiện của ký tự đó trong toàn bộ chuỗi.",
            "options": [
                {"key": "A", "text": "replace() thay thế tất cả, còn replaceAll() chỉ thay thế cái đầu tiên.", "is_correct": False},
                {"key": "B", "text": "replace() chỉ thay thế lần xuất hiện đầu tiên, còn replaceAll() thay thế tất cả mọi lần xuất hiện trong chuỗi.", "is_correct": True},
                {"key": "C", "text": "replaceAll() làm thay đổi trực tiếp chuỗi gốc mà không tạo chuỗi mới.", "is_correct": False},
                {"key": "D", "text": "Cả hai phương thức hoạt động hoàn toàn giống hệt nhau.", "is_correct": False}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"🚀 Seeding Course 1 Modules 7 & 8 ({len(lessons)} lessons)...")
    save_and_seed_lessons("Khóa 1 - JavaScript Cơ bản", lessons)
