import sys
from js_seeder_helper import save_and_seed_lessons

sys.stdout.reconfigure(encoding='utf-8')

lessons = [
    # ========================================================
    # MODULE 5: Vòng lặp & Thuật toán lặp
    # ========================================================
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-05",
        "chapter_id": "JS1-CH-05",
        "module_folder": "Module 05",
        "filename": "Lesson_05_01.md",
        "lesson_id": "JS1-05.01",
        "title": "Bài 5.1: Vòng lặp for cơ bản và kỹ thuật duyệt dãy số",
        "objective": "Làm chủ cấu trúc 3 thành phần của vòng lặp for, biến đếm let và kỹ thuật tính tổng, đếm tích lũy.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS1-05.01
title: "Vòng lặp for cơ bản và kỹ thuật duyệt dãy số"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["for loop", "Vòng lặp for", "Biến đếm", "Tích lũy", "Iteration"]
prerequisites: ["JS1-04.04"]
---

# Vòng lặp for cơ bản và kỹ thuật duyệt dãy số

## 1. Khái niệm & Vấn đề thực tế
Khi cần thực hiện một công việc lặp đi lặp lại nhiều lần với số lần lặp biết trước (ví dụ: in từ 1 đến 100, tính tổng các số chẵn, duyệt qua từng phần tử), vòng lặp `for` là công cụ kinh điển và hiệu quả nhất.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
for (khoi_tao; dieu_kien_lap; buoc_nhay) {
    // Khối mã được thực thi mỗi lần lặp
}
```

1. **Khởi tạo (`khoi_tao`)**: Chạy duy nhất 1 lần khi bắt đầu vòng lặp (thường là `let i = 0`).
2. **Điều kiện lặp (`dieu_kien_lap`)**: Được kiểm tra trước mỗi vòng lặp. Nếu `true` thì chạy tiếp, nếu `false` thì thoát vòng lặp.
3. **Bước nhảy (`buoc_nhay`)**: Chạy sau mỗi lần thân vòng lặp hoàn thành (ví dụ `i++`, `i += 2`, `i--`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
let total = 0;

for (let i = 1; i <= 5; i++) {
    total += i; // Cộng dồn i vào total
}

console.log("Tổng từ 1 đến 5 là:", total); // 15
```

- Vòng lặp chạy 5 lần với `i` lần lượt nhận giá trị: 1, 2, 3, 4, 5.
- Tại `i = 6`, điều kiện `6 <= 5` trở thành `false`, vòng lặp dừng lại.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dùng `var` thay vì `let` cho biến đếm**: Nếu dùng `var i`, biến `i` sẽ bị rò rỉ ra ngoài phạm vi vòng lặp. Luôn luôn khai báo `let i = 0`.
- **Lỗi lặp vô tận (Infinite Loop)**: Quên cập nhật bước nhảy hoặc viết sai điều kiện khiến điều kiện luôn luôn là `true`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cấu trúc `for (let i = start; i <= end; i++)`.
2. Luôn dùng `let` để biến đếm có phạm vi cục bộ (block scope) bên trong vòng lặp.
""",
        "exercise": {
            "title": "Tính tổng các số chẵn từ 1 đến N",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng vòng lặp `for` để tính tổng tất cả các số nguyên chẵn trong đoạn từ $1$ đến $N$.

### Yêu cầu đề bài:
Nhập vào một số nguyên dương $N$ từ stdin ($N \\ge 1$).
Hãy dùng vòng lặp `for` để tính tổng:
$$S = \\sum_{i=1, i \\text{ chẵn}}^{N} i$$

In kết quả ra màn hình theo đúng định dạng:
```text
Tong so chan: <S>
```

### Ví dụ:
* **Đầu vào:** `10`
* **Đầu ra:** `Tong so chan: 30` (vì $2 + 4 + 6 + 8 + 10 = 30$)
* **Đầu vào:** `5`
* **Đầu ra:** `Tong so chan: 6` (vì $2 + 4 = 6$)

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng vòng lặp `for`.
* Khai báo biến đếm bằng từ khóa `let`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["for","let","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng vòng lặp for với biến đếm let."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const n = parseInt(input[0], 10);

// Dùng vòng lặp for để tính tổng số chẵn

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const n = parseInt(input[0], 10);

let sum = 0;
for (let i = 1; i <= n; i++) {
    if (i % 2 === 0) {
        sum += i;
    }
}

console.log("Tong so chan:", sum);
""",
            "test_cases": [
                {
                    "input": "10",
                    "expected_output": "Tong so chan: 30",
                    "is_hidden": False
                },
                {
                    "input": "5",
                    "expected_output": "Tong so chan: 6",
                    "is_hidden": True
                },
                {
                    "input": "1",
                    "expected_output": "Tong so chan: 0",
                    "is_hidden": True
                },
                {
                    "input": "20",
                    "expected_output": "Tong so chan: 110",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Vì sao biến đếm trong vòng lặp for bắt buộc phải được khai báo bằng từ khóa `let` thay vì `var`?",
            "explanation": "Từ khóa 'let' tạo ra biến có phạm vi khối lệnh (block scope), biến đếm chỉ tồn tại trong vòng lặp và được tạo mới trong từng bước lặp. Nếu dùng 'var', biến bị rò rỉ ra toàn bộ hàm hoặc phạm vi toàn cục gây ô nhiễm biến.",
            "options": [
                {"key": "A", "text": "Vì từ khóa var chạy chậm hơn let gấp nhiều lần.", "is_correct": False},
                {"key": "B", "text": "Vì let giúp biến đếm bị giới hạn trong phạm vi khối (block scope), tránh rò rỉ ra bên ngoài.", "is_correct": True},
                {"key": "C", "text": "Vì var không thể tăng giá trị bằng toán tử ++.", "is_correct": False},
                {"key": "D", "text": "Vì vòng lặp for không chấp nhận từ khóa var về mặt cú pháp.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-05",
        "chapter_id": "JS1-CH-05",
        "module_folder": "Module 05",
        "filename": "Lesson_05_02.md",
        "lesson_id": "JS1-05.02",
        "title": "Bài 5.2: Vòng lặp điều kiện while và do...while",
        "objective": "Hiểu sự khác biệt giữa while (kiểm tra trước) và do...while (chạy trước ít nhất 1 lần) và cài đặt thuật toán Euclid.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS1-05.02
title: "Vòng lặp điều kiện while và do...while"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["while", "do while", "Vòng lặp điều kiện", "Euclid", "UCLN"]
prerequisites: ["JS1-05.01"]
---

# Vòng lặp điều kiện while và do...while

## 1. Khái niệm & Vấn đề thực tế
Khi số lần lặp **chưa biết trước** mà phụ thuộc vào một trạng thái hoặc điều kiện biến đổi liên tục (ví dụ: chia dần số cho đến khi bằng 0, lặp đến khi đạt độ chính xác sai số), vòng lặp `while` và `do...while` là lựa chọn tối ưu.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Vòng lặp `while` (Kiểm tra trước)**:
  ```javascript
  while (condition) {
      // Thực thi khi condition là true
      // Cần có câu lệnh làm thay đổi condition để tránh lặp vô hạn
  }
  ```
  Nếu `condition` ngay từ đầu là `false`, khối lệnh **không bao giờ chạy**.

- **Vòng lặp `do...while` (Kiểm tra sau)**:
  ```javascript
  do {
      // Luôn chạy ÍT NHẤT 1 LẦN trước khi kiểm tra điều kiện
  } while (condition);
  ```

---

## 3. Ví dụ trực quan: Thuật toán Euclid tìm Ước chung lớn nhất (UCLN)

```javascript
let a = 48;
let b = 18;

// Thuật toán Euclid lặp: UCLN(a, b) = UCLN(b, a % b) cho đến khi b === 0
while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
}

console.log("UCLN là:", a); // 6
```

- Vòng lặp tự động kết thúc ngay khi `b === 0`, giá trị còn lại của `a` chính là UCLN.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên câu lệnh cập nhật**: Nếu trong thân `while` không có dòng lệnh nào làm biến đổi điều kiện dừng, CPU sẽ bị chiếm dụng 100% (treo chương trình).

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `while` khi số lần lặp phụ thuộc điều kiện biến thiên.
2. Dùng `do...while` khi chắc chắn cần khối lệnh chạy ít nhất một lần.
""",
        "exercise": {
            "title": "Tìm Ước chung lớn nhất (UCLN) bằng thuật toán Euclid",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Cài đặt vòng lặp `while` để tìm Ước chung lớn nhất (UCLN) của hai số nguyên dương $A$ và $B$ bằng giải thuật Euclid.

### Yêu cầu đề bài:
Nhập vào 2 số nguyên dương $A$ và $B$ từ stdin.
Dùng vòng lặp `while` áp dụng công thức Euclid:
Trong khi $B \\ne 0$:
1. Đặt biến tạm $\\text{temp} = B$
2. Cập nhật $B = A \\pmod B$
3. Cập nhật $A = \\text{temp}$

Khi vòng lặp kết thúc, in ra màn hình:
```text
UCLN: <A>
```

### Ví dụ:
* **Đầu vào:** `48 18`
* **Đầu ra:** `UCLN: 6`
* **Đầu vào:** `17 5`
* **Đầu ra:** `UCLN: 1`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng vòng lặp `while`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["while","%","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng vòng lặp while để tìm UCLN theo thuật toán Euclid."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

let a = parseInt(input[0], 10);
let b = parseInt(input[1], 10);

// Cài đặt vòng lặp while tìm UCLN

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

let a = parseInt(input[0], 10);
let b = parseInt(input[1], 10);

while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
}

console.log("UCLN:", a);
""",
            "test_cases": [
                {
                    "input": "48 18",
                    "expected_output": "UCLN: 6",
                    "is_hidden": False
                },
                {
                    "input": "17 5",
                    "expected_output": "UCLN: 1",
                    "is_hidden": True
                },
                {
                    "input": "100 25",
                    "expected_output": "UCLN: 25",
                    "is_hidden": True
                },
                {
                    "input": "81 27",
                    "expected_output": "UCLN: 27",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Điểm khác biệt cốt lõi giữa vòng lặp `while` và `do...while` là gì?",
            "explanation": "Khối lệnh trong vòng lặp do...while luôn luôn được thực thi ít nhất một lần trước khi biểu thức điều kiện được kiểm tra, trong khi vòng lặp while kiểm tra điều kiện ngay từ đầu và có thể không chạy lần nào nếu điều kiện là false.",
            "options": [
                {"key": "A", "text": "while chạy nhanh hơn do...while.", "is_correct": False},
                {"key": "B", "text": "do...while luôn chạy thân vòng lặp ít nhất 1 lần trước khi kiểm tra điều kiện.", "is_correct": True},
                {"key": "C", "text": "while không thể dùng với biến số nguyên.", "is_correct": False},
                {"key": "D", "text": "do...while không cho phép dùng lệnh break.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-05",
        "chapter_id": "JS1-CH-05",
        "module_folder": "Module 05",
        "filename": "Lesson_05_03.md",
        "lesson_id": "JS1-05.03",
        "title": "Bài 5.3: Điều khiển luồng lặp với break, continue và tránh lặp vô tận",
        "objective": "Làm chủ lệnh break (ngắt lặp sớm), continue (bỏ qua bước hiện tại) và kỹ thuật thiết lập cờ chặn an toàn.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS1-05.03
title: "Điều khiển luồng lặp với break, continue và tránh lặp vô tận"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["break", "continue", "Điều khiển luồng", "Vòng lặp", "Early exit"]
prerequisites: ["JS1-05.02"]
---

# Điều khiển luồng lặp với break, continue và tránh lặp vô tận

## 1. Khái niệm & Vấn đề thực tế
Trong nhiều bài toán tìm kiếm, ta chỉ cần tìm phần tử đầu tiên thỏa mãn điều kiện rồi dừng lại ngay (để tiết kiệm thời gian chạy). Hoặc khi gặp một số phần tử không hợp lệ, ta muốn bỏ qua bước tính toán đó và chuyển ngay sang lần lặp kế tiếp.

Hai câu lệnh `break` và `continue` cung cấp khả năng can thiệp trực tiếp vào chu kỳ lặp.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`break`**: Thoát ra khỏi vòng lặp gần nhất chứa nó ngay lập tức.
- **`continue`**: Dừng việc thực thi các câu lệnh còn lại của **bước lặp hiện tại** và nhảy ngay sang bước lặp kế tiếp (kiểm tra điều kiện hoặc tăng bước nhảy).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Ví dụ 1: Dùng break để dừng tìm kiếm ngay khi thấy kết quả
for (let i = 1; i <= 100; i++) {
    if (i % 7 === 0 && i % 11 === 0) {
        console.log("Số đầu tiên chia hết cho 7 và 11 là:", i); // 77
        break; // Thoát vòng lặp ngay, không cần chạy tiếp đến 100
    }
}

// Ví dụ 2: Dùng continue để bỏ qua số lẻ, chỉ in số chẵn
for (let i = 1; i <= 5; i++) {
    if (i % 2 !== 0) {
        continue; // Bỏ qua phần in bên dưới nếu i là số lẻ
    }
    console.log("Số chẵn:", i);
}
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng continue trong while**: Trong vòng lặp `while`, nếu đặt `continue` trước câu lệnh tăng biến đếm (`i++`), biến `i` sẽ không bao giờ tăng và dẫn đến **vòng lặp vô hạn**.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `break`: Thoát hẳn khỏi vòng lặp.
2. `continue`: Bỏ qua lượt lặp hiện tại và nhảy tới lượt tiếp theo.
""",
        "exercise": {
            "title": "Tìm số nguyên dương đầu tiên chia hết cho cả 7 và 13 lớn hơn K",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng vòng lặp kết hợp lệnh `break` để tìm số nguyên dương nhỏ nhất lớn hơn một ngưỡng $K$ cho trước.

### Yêu cầu đề bài:
Nhập vào một số nguyên dương $K$ từ stdin ($K \\ge 1$).
Hãy tìm số nguyên dương $x > K$ nhỏ nhất sao cho $x$ đồng thời chia hết cho cả $7$ và $13$ ($x \\pmod 7 = 0$ và $x \\pmod{13} = 0$).

Khi tìm thấy, in kết quả ra màn hình:
```text
Ket qua: <x>
```

### Ví dụ:
* **Đầu vào:** `50`
* **Đầu ra:** `Ket qua: 91` (vì $7 \\times 13 = 91 > 50$)
* **Đầu vào:** `100`
* **Đầu ra:** `Ket qua: 182` (vì $91 \\times 2 = 182 > 100$)

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng lệnh `break` để thoát vòng lặp ngay khi tìm thấy kết quả.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["break","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng câu lệnh break để ngắt vòng lặp."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const k = parseInt(input[0], 10);

// Tìm số nhỏ nhất x > k chia hết cho cả 7 và 13

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const k = parseInt(input[0], 10);

let x = k + 1;
while (true) {
    if (x % 7 === 0 && x % 13 === 0) {
        console.log("Ket qua:", x);
        break;
    }
    x++;
}
""",
            "test_cases": [
                {
                    "input": "50",
                    "expected_output": "Ket qua: 91",
                    "is_hidden": False
                },
                {
                    "input": "100",
                    "expected_output": "Ket qua: 182",
                    "is_hidden": True
                },
                {
                    "input": "200",
                    "expected_output": "Ket qua: 273",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Khi lệnh `continue` được thực thi bên trong thân của một vòng lặp for, điều gì sẽ xảy ra tiếp theo?",
            "explanation": "Lệnh continue sẽ ngay lập tức bỏ qua các câu lệnh còn lại trong thân vòng lặp của lần lặp hiện tại, chuyển đến phần biểu thức bước nhảy (ví dụ i++) rồi kiểm tra điều kiện lặp cho chu kỳ tiếp theo.",
            "options": [
                {"key": "A", "text": "Vòng lặp dừng lại hoàn toàn.", "is_correct": False},
                {"key": "B", "text": "Bỏ qua các câu lệnh còn lại trong chu kỳ hiện tại và chuyển sang bước nhảy của chu kỳ tiếp theo.", "is_correct": True},
                {"key": "C", "text": "Biến đếm bị reset về giá trị 0.", "is_correct": False},
                {"key": "D", "text": "Chương trình thoát khỏi toàn bộ hàm.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-05",
        "chapter_id": "JS1-CH-05",
        "module_folder": "Module 05",
        "filename": "Lesson_05_04.md",
        "lesson_id": "JS1-05.04",
        "title": "Bài 5.4: Vòng lặp lồng nhau (Nested Loops) & Cú pháp for...of cơ bản",
        "objective": "Làm chủ vòng lặp lồng nhau 2 chiều, vẽ hình ma trận và duyệt tuần tự các phần tử bằng cú pháp for...of.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS1-05.04
title: "Vòng lặp lồng nhau (Nested Loops) & Cú pháp for...of cơ bản"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Nested loops", "for...of", "Ma trận", "Duyệt chuỗi", "ES6"]
prerequisites: ["JS1-05.03"]
---

# Vòng lặp lồng nhau (Nested Loops) & Cú pháp for...of cơ bản

## 1. Khái niệm & Vấn đề thực tế
Khi thao tác với dữ liệu đa chiều (bảng dữ liệu, ma trận 2D, tọa độ lưới) hoặc in các hình mẫu ký tự, ta cần đặt một vòng lặp bên trong một vòng lặp khác (**Nested Loops**).
Bên cạnh đó, ES6 cung cấp cú pháp `for...of` giúp duyệt qua từng giá trị của các đối tượng có thể lặp (Iterable: chuỗi, mảng) một cách cực kỳ trong sáng.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Vòng lặp lồng nhau**:
  - Với mỗi một bước lặp của vòng lặp ngoài (hàng), vòng lặp trong (cột) sẽ chạy trọn vẹn toàn bộ chu kỳ của nó.
- **Cú pháp `for...of`**:
  ```javascript
  for (const item of iterable) {
      // Sử dụng item trực tiếp mà không cần index
  }
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Duyệt từng ký tự trong chuỗi bằng for...of
const message = "MCODE";
for (const char of message) {
    console.log(char);
}
```

- Không cần dùng biến đếm `i` hay truy cập `message[i]`, `for...of` tự động trích xuất từng ký tự một.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Độ phức tạp thời gian ($O(N^2)$)**: Vòng lặp lồng nhau chạy theo cấp số nhân số bước tính. Hãy cẩn thận khi $N$ lớn.
- **Trùng tên biến đếm**: Vòng lặp ngoài thường đặt là `i`, vòng lặp trong đặt là `j`. Tránh dùng chung tên biến `i`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Vòng lặp lồng nhau dùng để xử lý dữ liệu 2 chiều (hàng và cột).
2. Dùng `for (const x of arr/str)` để đọc trực tiếp từng giá trị.
""",
        "exercise": {
            "title": "Vẽ hình tam giác vuông dấu sao",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng vòng lặp lồng nhau hoặc phương thức lặp chuỗi để in ra hình tam giác vuông có chiều cao $H$ nhận từ stdin.

### Yêu cầu đề bài:
Nhập vào một số nguyên dương $H$ từ stdin ($1 \\le H \\le 20$).
In ra hình tam giác vuông gồm $H$ dòng.
Dòng thứ $i$ ($1 \\le i \\le H$) chứa chính xác $i$ ký tự dấu sao `*`.

### Ví dụ:
* **Đầu vào:** `4`
* **Đầu ra:**
```text
*
**
***
****
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng vòng lặp `for`.
* In ra chính xác $H$ dòng.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["for","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng vòng lặp for để vẽ tam giác sao."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const h = parseInt(input[0], 10);

// Dùng vòng lặp để in ra hình tam giác vuông có chiều cao h

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const h = parseInt(input[0], 10);

for (let i = 1; i <= h; i++) {
    let row = "";
    for (let j = 1; j <= i; j++) {
        row += "*";
    }
    console.log(row);
}
""",
            "test_cases": [
                {
                    "input": "4",
                    "expected_output": "*\n**\n***\n****",
                    "is_hidden": False
                },
                {
                    "input": "1",
                    "expected_output": "*",
                    "is_hidden": True
                },
                {
                    "input": "5",
                    "expected_output": "*\n**\n***\n****\n*****",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Cú pháp `for...of` trong JavaScript được dùng để duyệt qua cái gì?",
            "explanation": "Cú pháp for...of (ra mắt từ ES6) dùng để duyệt trực tiếp qua các GIÁ TRỊ (values) của các đối tượng có tính chất lặp (Iterable objects như Array, String, Set, Map).",
            "options": [
                {"key": "A", "text": "Duyệt qua các thuộc tính (keys) của một Object thông thường.", "is_correct": False},
                {"key": "B", "text": "Duyệt trực tiếp qua các giá trị (values) của một tập hợp có thể lặp (như Array, String).", "is_correct": True},
                {"key": "C", "text": "Chỉ dùng để duyệt qua các số nguyên.", "is_correct": False},
                {"key": "D", "text": "Duyệt qua các tên hàm có trong bộ nhớ.", "is_correct": False}
            ]
        }
    },

    # ========================================================
    # MODULE 6: Hàm (Function) & Phạm vi biến cơ bản
    # ========================================================
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-06",
        "chapter_id": "JS1-CH-06",
        "module_folder": "Module 06",
        "filename": "Lesson_06_01.md",
        "lesson_id": "JS1-06.01",
        "title": "Bài 6.1: Khai báo hàm (Function Declaration) vs Biểu thức hàm (Function Expression)",
        "objective": "Phân biệt Function Declaration và Function Expression, cơ chế Hoisting của hàm và cách gọi hàm an toàn.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS1-06.01
title: "Khai báo hàm (Function Declaration) vs Biểu thức hàm (Function Expression)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Function Declaration", "Function Expression", "Hoisting", "Hàm", "Cú pháp hàm"]
prerequisites: ["JS1-05.04"]
---

# Khai báo hàm (Function Declaration) vs Biểu thức hàm (Function Expression)

## 1. Khái niệm & Vấn đề thực tế
Hàm (Function) là khối mã độc lập được đặt tên, thực hiện một nhiệm vụ cụ thể và có thể được tái sử dụng nhiều lần trong toàn bộ chương trình, giúp tuân thủ nguyên lý **DRY (Don't Repeat Yourself)**.

Trong JavaScript, có hai cách định nghĩa hàm truyền thống:
1. **Function Declaration**: `function tenHam() { ... }`
2. **Function Expression**: `const tenHam = function() { ... };`

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Function Declaration**:
  - Được hưởng cơ chế **Hoisting** toàn bộ: có thể gọi hàm trước dòng khai báo mà không bị lỗi.
- **Function Expression**:
  - Hàm được gán vào một biến. Biến tuân theo quy tắc khai báo (`const`/`let`), KHÔNG thể gọi hàm trước dòng khởi tạo biến đó.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// 1. Function Declaration (có thể gọi trước)
sayHello(); // Chạy bình thường!

function sayHello() {
    console.log("Xin chào!");
}

// 2. Function Expression
const calculateArea = function(width, height) {
    return width * height;
};

console.log(calculateArea(5, 10)); // 50
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Gọi Function Expression trước khi gán**: Sẽ gây lỗi `ReferenceError: Cannot access before initialization`.
- **Thực hành tốt nhất**: Đặt tên hàm bằng động từ (ví dụ `calculateTotal`, `getUserName`, `validateEmail`) để thể hiện rõ hành động.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Function Declaration được hoisted lên đầu phạm vi.
2. Function Expression gán hàm vào biến `const`, an toàn và dễ kiểm soát luồng mã.
""",
        "exercise": {
            "title": "Viết hàm kiểm tra số nguyên tố",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Định nghĩa hàm `isPrime(n)` để kiểm tra xem một số nguyên $N$ nhập từ stdin có phải là số nguyên tố hay không.

### Yêu cầu đề bài:
Nhập vào một số nguyên $N$ từ stdin.
Viết hàm `isPrime(n)`:
* Số nguyên tố là số nguyên lớn hơn 1 và chỉ chia hết cho 1 và chính nó.
* Trả về `true` nếu $n$ là số nguyên tố, ngược lại trả về `false`.

Sau đó, gọi hàm `isPrime(N)` và in kết quả ra console theo đúng định dạng:
```text
So nguyen to: <true | false>
```

### Ví dụ:
* **Đầu vào:** `7`
* **Đầu ra:** `So nguyen to: true`
* **Đầu vào:** `12`
* **Đầu ra:** `So nguyen to: false`
* **Đầu vào:** `1`
* **Đầu ra:** `So nguyen to: false`

### Ràng buộc kỹ thuật:
* Bắt buộc định nghĩa hàm `function isPrime(n)`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["function","isPrime","return","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu viết hàm function isPrime(n) có return giá trị boolean."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const n = parseInt(input[0], 10);

// Định nghĩa hàm isPrime(n) tại đây

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const n = parseInt(input[0], 10);

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

console.log("So nguyen to:", isPrime(n));
""",
            "test_cases": [
                {
                    "input": "7",
                    "expected_output": "So nguyen to: true",
                    "is_hidden": False
                },
                {
                    "input": "12",
                    "expected_output": "So nguyen to: false",
                    "is_hidden": True
                },
                {
                    "input": "1",
                    "expected_output": "So nguyen to: false",
                    "is_hidden": True
                },
                {
                    "input": "29",
                    "expected_output": "So nguyen to: true",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Sự khác biệt quan trọng nhất về mặt cơ chế giữa Function Declaration và Function Expression là gì?",
            "explanation": "Function Declaration được JavaScript Engine 'hoisted' (nâng lên đầu phạm vi) trong giai đoạn biên dịch, cho phép gọi hàm trước khi khai báo. Function Expression được lưu vào biến nên không thể gọi trước khi biến đó được khởi tạo.",
            "options": [
                {"key": "A", "text": "Function Expression chạy nhanh hơn Function Declaration 2 lần.", "is_correct": False},
                {"key": "B", "text": "Function Declaration được hoisted toàn bộ và có thể gọi trước dòng định nghĩa, còn Function Expression thì không.", "is_correct": True},
                {"key": "C", "text": "Function Declaration không thể nhận tham số đầu vào.", "is_correct": False},
                {"key": "D", "text": "Function Expression không thể trả về giá trị bằng lệnh return.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-06",
        "chapter_id": "JS1-CH-06",
        "module_folder": "Module 06",
        "filename": "Lesson_06_02.md",
        "lesson_id": "JS1-06.02",
        "title": "Bài 6.2: Tham số, đối số & Tham số mặc định (Default Parameters)",
        "objective": "Làm chủ khái niệm Parameters vs Arguments, xử lý tham số bị thiếu (undefined) và cú pháp Default Parameters trong ES6.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS1-06.02
title: "Tham số, đối số & Tham số mặc định (Default Parameters)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Parameters", "Arguments", "Default Parameters", "ES6", "undefined"]
prerequisites: ["JS1-06.01"]
---

# Tham số, đối số & Tham số mặc định (Default Parameters)

## 1. Khái niệm & Vấn đề thực tế
- **Tham số (Parameter)**: Biến được định nghĩa trong danh sách khai báo hàm (chỗ nhận dữ liệu).
- **Đối số (Argument)**: Giá trị thực tế được truyền vào hàm khi gọi thực thi.

Trước ES6, nếu một đối số bị người dùng bỏ quên không truyền vào, nó sẽ nhận giá trị `undefined`, dễ làm sai lệch phép tính (ví dụ `undefined * 5 = NaN`). Từ ES6, tính năng **Default Parameters** cho phép thiết lập sẵn giá trị mặc định cho tham số.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
function greet(name = "bạn", title = "Học viên") {
    console.log("Xin chào", title, name);
}

greet();                 // "Xin chào Học viên bạn"
greet("Lan");            // "Xin chào Học viên Lan"
greet("Minh", "Giảng viên"); // "Xin chào Giảng viên Minh"
```

- Giá trị mặc định chỉ được kích hoạt khi đối số tương ứng là `undefined` hoặc không được truyền vào.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function calculateBill(price, quantity = 1, discountRate = 0.05) {
    const rawTotal = price * quantity;
    const discount = rawTotal * discountRate;
    return rawTotal - discount;
}

console.log(calculateBill(100000));       // Mua 1 cái, giảm 5% -> 95000
console.log(calculateBill(100000, 3));    // Mua 3 cái, giảm 5% -> 285000
console.log(calculateBill(100000, 3, 0.1)); // Giảm 10% -> 270000
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Đặt tham số mặc định ở đầu danh sách**: Luôn đặt các tham số có giá trị mặc định ở **cuối cùng** trong danh sách tham số để người dùng không phải truyền `undefined` ở các vị trí đầu.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `function fn(param = defaultValue)`.
2. Giá trị mặc định giúp hàm linh hoạt và tránh phát sinh lỗi `NaN`.
""",
        "exercise": {
            "title": "Tính hóa đơn tiền hàng có chiết khấu mặc định",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Viết hàm có tham số mặc định để tính tổng tiền thanh toán sau chiết khấu.

### Yêu cầu đề bài:
Nhập vào 2 số từ stdin:
1. `price`: Đơn giá (số nguyên).
2. `quantity`: Số lượng mua (số nguyên).

Định nghĩa hàm:
`function computeTotal(price, quantity = 1, discountRate = 0.05)`
* Tính tổng tiền ban đầu: `raw = price * quantity`
* Tính tiền chiết khấu: `discount = raw * discountRate`
* Trả về số tiền cuối cùng: `raw - discount`

Gọi hàm với 2 đối số `price` và `quantity` (để tỷ lệ chiết khấu nhận giá trị mặc định là `0.05`).
In ra màn hình theo định dạng:
```text
Thanh toan: <ket_qua> VNĐ
```

### Ví dụ:
* **Đầu vào:** `100000 2`
* **Đầu ra:** `Thanh toan: 190000 VNĐ` (vì $200000 - 5\\% = 190000$)

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cú pháp tham số mặc định `discountRate = 0.05`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["function","computeTotal","=","return","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu định nghĩa hàm computeTotal với tham số mặc định discountRate = 0.05."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const price = parseInt(input[0], 10);
const quantity = parseInt(input[1], 10);

// Viết hàm computeTotal có tham số mặc định

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const price = parseInt(input[0], 10);
const quantity = parseInt(input[1], 10);

function computeTotal(price, quantity = 1, discountRate = 0.05) {
    const raw = price * quantity;
    const discount = raw * discountRate;
    return raw - discount;
}

console.log("Thanh toan: " + computeTotal(price, quantity) + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "100000 2",
                    "expected_output": "Thanh toan: 190000 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "50000 4",
                    "expected_output": "Thanh toan: 190000 VNĐ",
                    "is_hidden": True
                },
                {
                    "input": "200000 1",
                    "expected_output": "Thanh toan: 190000 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Khi nào giá trị mặc định của tham số (Default Parameter) được kích hoạt trong JavaScript?",
            "explanation": "Trong JavaScript ES6, giá trị mặc định chỉ được áp dụng khi đối số truyền vào tại vị trí đó bị bỏ qua (omitted) hoặc có giá trị chính xác là 'undefined'. Nếu truyền 'null', giá trị 'null' vẫn được giữ nguyên mà không kích hoạt giá trị mặc định.",
            "options": [
                {"key": "A", "text": "Khi đối số truyền vào là null hoặc 0.", "is_correct": False},
                {"key": "B", "text": "Chỉ khi đối số bị bỏ trống hoặc được truyền giá trị là undefined.", "is_correct": True},
                {"key": "C", "text": "Mỗi khi hàm được gọi lần đầu tiên.", "is_correct": False},
                {"key": "D", "text": "Khi đối số là chuỗi rỗng \"\".", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-06",
        "chapter_id": "JS1-CH-06",
        "module_folder": "Module 06",
        "filename": "Lesson_06_03.md",
        "lesson_id": "JS1-06.03",
        "title": "Bài 6.3: Lệnh return, giá trị trả về và hàm không trả về (undefined)",
        "objective": "Làm chủ lệnh return để trả kết quả và dừng hàm sớm, hiểu giá trị mặc định undefined khi hàm không có return.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS1-06.03
title: "Lệnh return, giá trị trả về và hàm không trả về (undefined)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["return", "Giá trị trả về", "undefined", "Void function", "Hàm thuần"]
prerequisites: ["JS1-06.02"]
---

# Lệnh return, giá trị trả về và hàm không trả về (undefined)

## 1. Khái niệm & Vấn đề thực tế
Một hàm thường nhận dữ liệu đầu vào (parameters), tính toán xử lý và xuất kết quả đầu ra cho nơi gọi hàm sử dụng tiếp thông qua lệnh `return`.

Nếu một hàm không có lệnh `return`, hoặc chỉ viết `return;` mà không chỉ định giá trị, JavaScript sẽ tự động trả về giá trị đặc biệt là `undefined`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **`return expression;`**: Đánh giá biểu thức `expression`, gửi kết quả về cho bên gọi và **kết thúc thực thi hàm ngay lập tức**.
- Mọi câu lệnh đặt phía sau lệnh `return` trong cùng khối hàm đều là **mã chết (unreachable code)** và không bao giờ được chạy.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function findMax(a, b, c) {
    let max = a;
    if (b > max) max = b;
    if (c > max) max = c;
    return max; // Trả về giá trị lớn nhất
}

const result = findMax(12, 45, 29);
console.log("Số lớn nhất:", result); // 45
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Xuống dòng ngay sau `return`**: Như đã học ở bài ASI, không xuống dòng giữa từ khóa `return` và biểu thức trả về.
- **Nhầm lẫn giữa `console.log()` và `return`**: `console.log()` chỉ in chữ ra màn hình, KHÔNG trả về giá trị cho biến nhận. Muốn nhận kết quả để tính toán tiếp, bắt buộc phải dùng `return`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `return` trả kết quả và dừng hàm lập tức.
2. Hàm không có `return` ngầm định trả về `undefined`.
""",
        "exercise": {
            "title": "Viết hàm tìm số lớn nhất trong ba số",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Viết hàm `findMax3(a, b, c)` sử dụng câu lệnh `return` để trả về giá trị lớn nhất trong 3 số nguyên nhận từ stdin.

### Yêu cầu đề bài:
Nhập vào 3 số nguyên $a, b, c$ từ stdin.
Viết hàm:
`function findMax3(a, b, c)`
* Trả về số lớn nhất trong 3 số.

In ra màn hình theo đúng định dạng:
```text
Max: <gia_tri_lon_nhat>
```

### Ví dụ:
* **Đầu vào:** `15 42 29`
* **Đầu ra:** `Max: 42`

### Ràng buộc kỹ thuật:
* Bắt buộc có hàm `findMax3` và sử dụng lệnh `return`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["function","findMax3","return","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu viết hàm findMax3 có lệnh return kết quả."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const a = parseInt(input[0], 10);
const b = parseInt(input[1], 10);
const c = parseInt(input[2], 10);

// Định nghĩa hàm findMax3 và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const a = parseInt(input[0], 10);
const b = parseInt(input[1], 10);
const c = parseInt(input[2], 10);

function findMax3(x, y, z) {
    let max = x;
    if (y > max) max = y;
    if (z > max) max = z;
    return max;
}

console.log("Max:", findMax3(a, b, c));
""",
            "test_cases": [
                {
                    "input": "15 42 29",
                    "expected_output": "Max: 42",
                    "is_hidden": False
                },
                {
                    "input": "99 12 5",
                    "expected_output": "Max: 99",
                    "is_hidden": True
                },
                {
                    "input": "10 20 88",
                    "expected_output": "Max: 88",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Nếu một hàm trong JavaScript hoàn thành việc thực thi mà không có bất kỳ lệnh return nào, giá trị trả về của hàm đó là gì?",
            "explanation": "Trong JavaScript, nếu một hàm kết thúc mà không bắt gặp câu lệnh return nào (hoặc chỉ viết return; rỗng), hàm đó sẽ tự động trả về giá trị mặc định là 'undefined'.",
            "options": [
                {"key": "A", "text": "null", "is_correct": False},
                {"key": "B", "text": "0", "is_correct": False},
                {"key": "C", "text": "undefined", "is_correct": True},
                {"key": "D", "text": "false", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
        "module_id": "JS1-MOD-06",
        "chapter_id": "JS1-CH-06",
        "module_folder": "Module 06",
        "filename": "Lesson_06_04.md",
        "lesson_id": "JS1-06.04",
        "title": "Bài 6.4: Cú pháp Arrow Function & Phạm vi hàm (Function Scope)",
        "objective": "Làm chủ cú pháp hàm mũi tên (Arrow Function) trong ES6, cú pháp rút gọn một dòng (implicit return) và phạm vi biến cục bộ.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS1-06.04
title: "Cú pháp Arrow Function & Phạm vi hàm (Function Scope)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Arrow Function", "=>", "Implicit return", "Scope", "ES6"]
prerequisites: ["JS1-06.03"]
---

# Cú pháp Arrow Function & Phạm vi hàm (Function Scope)

## 1. Khái niệm & Vấn đề thực tế
Từ ES6, JavaScript giới thiệu cú pháp **Arrow Function (Hàm mũi tên `=>`)** mang lại cách viết hàm cực kỳ ngắn gọn, thanh lịch và trực quan.

Ngoài ra, mỗi hàm khi được gọi sẽ tạo ra một **Phạm vi hàm (Function Scope)**: các biến khai báo bên trong hàm chỉ có thể được truy cập từ bên trong hàm đó, không thể truy cập từ bên ngoài.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Cú pháp đầy đủ**:
  ```javascript
  const add = (a, b) => {
      return a + b;
  };
  ```
- **Cú pháp rút gọn (Implicit Return - Trả về ngầm định)**:
  Nếu thân hàm chỉ có duy nhất một biểu thức tính toán trả về, ta có thể bỏ cả dấu ngoặc nhọn `{}` lẫn từ khóa `return`:
  ```javascript
  const add = (a, b) => a + b;
  ```
- **Nếu chỉ có 1 tham số**: có thể bỏ cả ngoặc tròn:
  ```javascript
  const square = x => x * x;
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
// Chuyển đổi nhiệt độ C sang F bằng Arrow Function rút gọn
const cToF = c => (c * 9/5) + 32;

console.log("0 độ C = " + cToF(0) + " độ F");   // 32
console.log("100 độ C = " + cToF(100) + " độ F"); // 212
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Bao bọc ngoặc nhọn nhưng quên return**:
  `const add = (a, b) => { a + b };` -> Kết quả trả về `undefined` vì khi dùng `{}` bắt buộc phải có từ khóa `return`!

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `(params) => expression`.
2. Bỏ `{}` thì tự động return giá trị biểu thức.
3. Biến khai báo trong hàm có phạm vi cục bộ riêng biệt.
""",
        "exercise": {
            "title": "Chuyển đổi độ C sang độ F bằng Arrow Function",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng cú pháp Arrow Function (`=>`) rút gọn để viết hàm chuyển đổi nhiệt độ từ Celsius sang Fahrenheit.

### Yêu cầu đề bài:
Nhập vào một số thực `celsius` từ stdin.
Viết hàm mũi tên:
`const toFahrenheit = c => (c * 9 / 5) + 32;`

In kết quả ra màn hình định dạng:
```text
Nhiet do F: <ket_qua>
```

### Ví dụ:
* **Đầu vào:** `25`
* **Đầu ra:** `Nhiet do F: 77`
* **Đầu vào:** `0`
* **Đầu ra:** `Nhiet do F: 32`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cú pháp Arrow Function (`=>`).

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["=>","console.log"],"forbiddenKeywords":["function "],"customErrorMessage":"Bài tập yêu cầu sử dụng cú pháp Arrow Function (=>) thay cho từ khóa function."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const celsius = parseFloat(input[0]);

// Định nghĩa toFahrenheit bằng Arrow Function và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const celsius = parseFloat(input[0]);

const toFahrenheit = c => (c * 9 / 5) + 32;

console.log("Nhiet do F:", toFahrenheit(celsius));
""",
            "test_cases": [
                {
                    "input": "25",
                    "expected_output": "Nhiet do F: 77",
                    "is_hidden": False
                },
                {
                    "input": "0",
                    "expected_output": "Nhiet do F: 32",
                    "is_hidden": True
                },
                {
                    "input": "100",
                    "expected_output": "Nhiet do F: 212",
                    "is_hidden": True
                },
                {
                    "input": "-40",
                    "expected_output": "Nhiet do F: -40",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Biểu thức `const multiply = (x, y) => { x * y };` khi gọi `multiply(2, 3)` sẽ trả về kết quả gì?",
            "explanation": "Khi thân Arrow Function được bao bọc bởi cặp dấu ngoặc nhọn '{}', JavaScript Engine hiểu đó là một khối mã lệnh (block statement) chứ không còn là implicit return nữa. Vì thiếu từ khóa 'return', hàm sẽ trả về 'undefined'.",
            "options": [
                {"key": "A", "text": "6", "is_correct": False},
                {"key": "B", "text": "undefined", "is_correct": True},
                {"key": "C", "text": "NaN", "is_correct": False},
                {"key": "D", "text": "Báo lỗi cú pháp SyntaxError.", "is_correct": False}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"🚀 Seeding Course 1 Modules 5 & 6 ({len(lessons)} lessons)...")
    save_and_seed_lessons("Khóa 1 - JavaScript Cơ bản", lessons)
