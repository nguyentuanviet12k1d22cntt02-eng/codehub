import sys
from js_seeder_helper import save_and_seed_lessons

sys.stdout.reconfigure(encoding='utf-8')

lessons = [
    # ========================================================
    # MODULE 9: Đối tượng (Object) & Cấu trúc dữ liệu nâng cao
    # ========================================================
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-09",
        "chapter_id": "JS2-CH-09",
        "module_folder": "Module 01",
        "filename": "Lesson_09_01.md",
        "lesson_id": "JS2-09.01",
        "title": "Bài 9.1: Khởi tạo Object (Object Literal), Dot notation vs Bracket notation",
        "objective": "Làm chủ cú pháp khai báo đối tượng bằng Object Literal, phân biệt cách truy cập bằng dấu chấm (.) và dấu ngoặc vuông ([]).",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS2-09.01
title: "Khởi tạo Object (Object Literal), Dot notation vs Bracket notation"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Object Literal", "Dot notation", "Bracket notation", "Properties", "Key-Value"]
prerequisites: ["JS1-08.04"]
---

# Khởi tạo Object (Object Literal), Dot notation vs Bracket notation

## 1. Khái niệm & Vấn đề thực tế
Trong khi mảng (Array) lưu danh sách có thứ tự theo số nguyên, thì Đối tượng (Object) lưu trữ tập hợp các cặp **khóa - giá trị (Key - Value)** không có thứ tự, đại diện cho các thực thể trong đời thực (Người dùng, Sản phẩm, Cấu hình hệ thống).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Khởi tạo Object Literal**:
  ```javascript
  const user = {
      name: "Hoàng",
      age: 22,
      "user-role": "admin" // Khóa có ký tự đặc biệt phải bọc trong nháy
  };
  ```
- **Dot notation (Dấu chấm)**: `user.name` (ngắn gọn, trực quan nhưng chỉ dùng khi tên khóa là định danh hợp lệ).
- **Bracket notation (Dấu ngoặc vuông)**: `user["name"]` hoặc `user[variableKey]` (bắt buộc khi tên khóa chứa ký tự đặc biệt hoặc được lưu trong một biến động).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const car = {
    brand: "Toyota",
    year: 2024
};

const propName = "brand";
console.log(car.brand);      // "Toyota" (Dot notation)
console.log(car[propName]);   // "Toyota" (Bracket notation với biến động)
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên đặt dấu ngoặc kép khi dùng bracket**: `obj[name]` sẽ tìm biến `name` thay vì chuỗi `"name"`.
- **Lỗi `obj.prop-name`**: Dấu gạch ngang bị hiểu nhầm là phép trừ, phải viết `obj["prop-name"]`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `obj.key` cho thuộc tính cố định.
2. Dùng `obj[key]` khi tên thuộc tính đến từ biến hoặc chứa dấu gạch ngang/khoảng trắng.
""",
        "exercise": {
            "title": "Truy cập thuộc tính động của đối tượng sản phẩm",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng Bracket notation (`[]`) để truy xuất giá trị của một thuộc tính đối tượng dựa vào tên khóa nhận động từ stdin.

### Yêu cầu đề bài:
Cho đối tượng sản phẩm:
```javascript
const product = {
    id: "P001",
    name: "Laptop Gaming",
    price: 25000000,
    stock: 15
};
```

Nhập vào một chuỗi `propKey` từ stdin (ví dụ: `"name"` hoặc `"price"`).
Dùng Bracket notation để trích xuất giá trị của thuộc tính đó từ `product`.
In kết quả ra màn hình theo định dạng:
```text
Thuoc tinh <propKey>: <gia_tri>
```

### Ví dụ:
* **Đầu vào:** `name`
* **Đầu ra:** `Thuoc tinh name: Laptop Gaming`
* **Đầu vào:** `price`
* **Đầu ra:** `Thuoc tinh price: 25000000`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng Bracket notation (`product[propKey]`).

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["product[","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng cú pháp Bracket notation product[propKey]."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const product = {
    id: "P001",
    name: "Laptop Gaming",
    price: 25000000,
    stock: 15
};

const propKey = input[0];

// Truy xuất thuộc tính động và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const product = {
    id: "P001",
    name: "Laptop Gaming",
    price: 25000000,
    stock: 15
};

const propKey = input[0];

console.log(`Thuoc tinh ${propKey}: ${product[propKey]}`);
""",
            "test_cases": [
                {
                    "input": "name",
                    "expected_output": "Thuoc tinh name: Laptop Gaming",
                    "is_hidden": False
                },
                {
                    "input": "price",
                    "expected_output": "Thuoc tinh price: 25000000",
                    "is_hidden": True
                },
                {
                    "input": "stock",
                    "expected_output": "Thuoc tinh stock: 15",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Trong trường hợp nào ta BẮT BUỘC phải dùng Bracket notation `obj[key]` thay vì Dot notation `obj.key`?",
            "explanation": "Bracket notation bắt buộc phải dùng khi tên thuộc tính được lưu trữ trong một biến động, hoặc khi tên thuộc tính chứa các ký tự đặc biệt (như dấu gạch nối, khoảng trắng) hoặc bắt đầu bằng chữ số.",
            "options": [
                {"key": "A", "text": "Khi đối tượng có nhiều hơn 5 thuộc tính.", "is_correct": False},
                {"key": "B", "text": "Khi tên thuộc tính được lưu trong biến hoặc chứa ký tự đặc biệt như dấu gạch nối.", "is_correct": True},
                {"key": "C", "text": "Khi giá trị của thuộc tính là kiểu số nguyên.", "is_correct": False},
                {"key": "D", "text": "Khi khai báo đối tượng bằng từ khóa const.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-09",
        "chapter_id": "JS2-CH-09",
        "module_folder": "Module 01",
        "filename": "Lesson_09_02.md",
        "lesson_id": "JS2-09.02",
        "title": "Bài 9.2: Thêm, sửa, xóa thuộc tính với delete & Toán tử in",
        "objective": "Thao tác linh hoạt với thuộc tính đối tượng: gán mới, cập nhật, xóa hoàn toàn bằng toán tử delete và kiểm tra sự tồn tại bằng toán tử in.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS2-09.02
title: "Thêm, sửa, xóa thuộc tính với delete & Toán tử in"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["delete", "Toán tử in", "hasOwnProperty", "Mutation", "Object properties"]
prerequisites: ["JS2-09.01"]
---

# Thêm, sửa, xóa thuộc tính với delete & Toán tử in

## 1. Khái niệm & Vấn đề thực tế
Một đối tượng trong JavaScript có tính chất mở (open / extensible): ta có thể tự do thêm thuộc tính mới, sửa đổi giá trị thuộc tính cũ hoặc xóa bỏ hoàn toàn thuộc tính nhạy cảm (như mật khẩu trước khi trả dữ liệu về).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Thêm/Sửa thuộc tính**: Gán trực tiếp `obj.newKey = value;`.
- **Xóa thuộc tính**: Dùng toán tử đơn ngôi `delete obj.key;`.
- **Kiểm tra tồn tại**: Dùng toán tử `"key" in obj` (trả về `true` nếu `key` tồn tại trong `obj` hoặc prototype của nó).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const student = {
    name: "Minh",
    age: 20,
    password: "secret_password"
};

// 1. Thêm thuộc tính mới
student.email = "minh@mcode.com";

// 2. Xóa thuộc tính nhạy cảm
delete student.password;

// 3. Kiểm tra xem password còn tồn tại không
console.log("password" in student); // false
console.log("email" in student);    // true
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Gán `obj.key = undefined` KHÔNG tương đương `delete obj.key`**: Gán `undefined` thì thuộc tính vẫn tồn tại trong object (vẫn duyệt thấy trong vòng lặp và `"key" in obj` vẫn trả về `true`). Chỉ có `delete` mới xóa sạch hoàn toàn key khỏi bộ nhớ.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Thêm/sửa bằng phép gán `=`.
2. Xóa key bằng toán tử `delete`.
3. Kiểm tra sự tồn tại của key bằng `"key" in obj`.
""",
        "exercise": {
            "title": "Quản lý và dọn dẹp thuộc tính nhạy cảm của tài khoản",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng toán tử `delete` để xóa thuộc tính và toán tử `in` để kiểm tra.

### Yêu cầu đề bài:
Cho đối tượng tài khoản:
```javascript
const account = {
    username: "user_vip",
    role: "STUDENT",
    secretKey: "SECRET_12345"
};
```

Đọc từ stdin một chuỗi `newRole` để cập nhật cho thuộc tính `role`.
1. Cập nhật `account.role = newRole`.
2. Dùng toán tử `delete` để xóa bỏ hoàn toàn thuộc tính `secretKey`.
3. Kiểm tra xem `"secretKey"` còn tồn tại trong `account` hay không bằng toán tử `in`.

In ra màn hình 2 dòng:
```text
Role moi: <account.role>
Ton tai secretKey: <true | false>
```

### Ví dụ:
* **Đầu vào:** `TEACHER`
* **Đầu ra:**
```text
Role moi: TEACHER
Ton tai secretKey: false
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng toán tử `delete` và toán tử `in`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["delete"," in ","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng cả toán tử delete và toán tử in."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const account = {
    username: "user_vip",
    role: "STUDENT",
    secretKey: "SECRET_12345"
};

const newRole = input[0];

// Cập nhật role, xóa secretKey và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const account = {
    username: "user_vip",
    role: "STUDENT",
    secretKey: "SECRET_12345"
};

const newRole = input[0];
account.role = newRole;

delete account.secretKey;

console.log("Role moi:", account.role);
console.log("Ton tai secretKey:", "secretKey" in account);
""",
            "test_cases": [
                {
                    "input": "TEACHER",
                    "expected_output": "Role moi: TEACHER\nTon tai secretKey: false",
                    "is_hidden": False
                },
                {
                    "input": "ADMIN",
                    "expected_output": "Role moi: ADMIN\nTon tai secretKey: false",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Điều gì khác biệt giữa việc gán `obj.token = undefined` và `delete obj.token`?",
            "explanation": "Khi gán obj.token = undefined, thuộc tính 'token' vẫn tồn tại trong object (phép toán 'token' in obj vẫn trả về true). Chỉ khi dùng delete obj.token thì thuộc tính mới bị xóa hoàn toàn khỏi đối tượng.",
            "options": [
                {"key": "A", "text": "Cả hai cách đều xóa sạch thuộc tính khỏi đối tượng như nhau.", "is_correct": False},
                {"key": "B", "text": "Gán undefined vẫn giữ lại thuộc tính trong đối tượng, còn delete sẽ xóa bỏ hoàn toàn thuộc tính đó.", "is_correct": True},
                {"key": "C", "text": "delete chỉ xóa được các thuộc tính kiểu số.", "is_correct": False},
                {"key": "D", "text": "Gán undefined tiêu tốn ít bộ nhớ hơn delete.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-09",
        "chapter_id": "JS2-CH-09",
        "module_folder": "Module 01",
        "filename": "Lesson_09_03.md",
        "lesson_id": "JS2-09.03",
        "title": "Bài 9.3: Duyệt Object với for...in, Object.keys, values & entries",
        "objective": "Làm chủ các phương thức tĩnh Object.keys(), Object.values(), Object.entries() và vòng lặp for...in để duyệt và xử lý dữ liệu cặp key-value.",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS2-09.03
title: "Duyệt Object với for...in, Object.keys, values & entries"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Object.keys", "Object.values", "Object.entries", "for...in", "Duyệt đối tượng"]
prerequisites: ["JS2-09.02"]
---

# Duyệt Object với for...in, Object.keys, values & entries

## 1. Khái niệm & Vấn đề thực tế
Vì Object không có chỉ mục số thứ tự tuần tự như Array, ta không thể dùng vòng lặp `for` thông thường hay `for...of` trực tiếp lên Object.

Modern JavaScript cung cấp bộ ba phương thức tĩnh của `Object` biến đổi đối tượng thành các mảng để dễ dàng duyệt và tính toán:
1. `Object.keys(obj)`: Mảng chứa danh sách các tên thuộc tính (keys).
2. `Object.values(obj)`: Mảng chứa danh sách các giá trị (values).
3. `Object.entries(obj)`: Mảng chứa các cặp `[key, value]`.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
const inventory = { apples: 10, oranges: 5, bananas: 12 };

// 1. Duyệt qua mảng values để tính tổng
const totalItems = Object.values(inventory).reduce((sum, qty) => sum + qty, 0);

// 2. Duyệt qua mảng entries với for...of
for (const [fruit, qty] of Object.entries(inventory)) {
    console.log(`${fruit}: ${qty}`);
}
```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const prices = {
    pen: 5000,
    notebook: 15000,
    ruler: 8000
};

const keys = Object.keys(prices);     // ["pen", "notebook", "ruler"]
const values = Object.values(prices); // [5000, 15000, 8000]

console.log("Số mặt hàng:", keys.length); // 3
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Hạn chế dùng `for...in` thuần túy**: Vòng lặp `for...in` sẽ duyệt qua cả các thuộc tính kế thừa trong prototype chain. Chuẩn mực hiện đại ưu tiên dùng `Object.keys()` hoặc `Object.entries()` kết hợp với `for...of` hoặc Array methods.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `Object.keys()`: Lấy danh sách tên thuộc tính.
2. `Object.values()`: Lấy danh sách giá trị.
3. `Object.entries()`: Lấy mảng các cặp `[key, value]`.
""",
        "exercise": {
            "title": "Tính tổng doanh số bán hàng từ bảng dữ liệu",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng `Object.values()` hoặc `Object.entries()` để tính toán tổng doanh số và số lượng mặt hàng từ một đối tượng giỏ hàng.

### Yêu cầu đề bài:
Cho đối tượng lưu trữ doanh thu của 3 mặt hàng:
```javascript
const sales = {
    sanPhamA: 150000,
    sanPhamB: 280000,
    sanPhamC: 120000
};
```

Đọc từ stdin một số nguyên `sanPhamDMoney` (doanh thu của sản phẩm D mới phát sinh).
1. Thêm `sales.sanPhamD = sanPhamDMoney`.
2. Dùng `Object.keys(sales)` để lấy tổng số lượng mặt hàng.
3. Dùng `Object.values(sales)` kết hợp `.reduce()` để tính tổng doanh số của tất cả các mặt hàng.

In kết quả ra màn hình theo định dạng 2 dòng:
```text
Tong mat hang: <soLuongMatHang>
Tong doanh so: <tongDoanhSo> VNĐ
```

### Ví dụ:
* **Đầu vào:** `50000`
* **Đầu ra:**
```text
Tong mat hang: 4
Tong doanh so: 600000 VNĐ
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `Object.keys()` và `Object.values()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["Object.keys","Object.values","reduce","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng Object.keys() và Object.values()."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const sales = {
    sanPhamA: 150000,
    sanPhamB: 280000,
    sanPhamC: 120000
};

const dMoney = parseInt(input[0], 10);

// Cập nhật sales, tính toán và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const sales = {
    sanPhamA: 150000,
    sanPhamB: 280000,
    sanPhamC: 120000
};

const dMoney = parseInt(input[0], 10);
sales.sanPhamD = dMoney;

const count = Object.keys(sales).length;
const total = Object.values(sales).reduce((acc, val) => acc + val, 0);

console.log("Tong mat hang:", count);
console.log("Tong doanh so: " + total + " VNĐ");
""",
            "test_cases": [
                {
                    "input": "50000",
                    "expected_output": "Tong mat hang: 4\nTong doanh so: 600000 VNĐ",
                    "is_hidden": False
                },
                {
                    "input": "100000",
                    "expected_output": "Tong mat hang: 4\nTong doanh so: 650000 VNĐ",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Phương thức `Object.entries({ a: 1, b: 2 })` trả về cấu trúc dữ liệu nào?",
            "explanation": "Object.entries() trả về một mảng chứa các mảng con 2 phần tử dạng [key, value], cụ thể là [['a', 1], ['b', 2]].",
            "options": [
                {"key": "A", "text": "['a', 'b']", "is_correct": False},
                {"key": "B", "text": "[1, 2]", "is_correct": False},
                {"key": "C", "text": "[['a', 1], ['b', 2]]", "is_correct": True},
                {"key": "D", "text": "{ a: 1, b: 2 }", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-09",
        "chapter_id": "JS2-CH-09",
        "module_folder": "Module 01",
        "filename": "Lesson_09_04.md",
        "lesson_id": "JS2-09.04",
        "title": "Bài 9.4: Nested Object & Sao chép tham chiếu vs Deep Clone",
        "objective": "Hiểu bản chất tham chiếu bộ nhớ (Reference Type) của Object, sự khác biệt giữa Shallow Copy và Deep Clone với structuredClone().",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS2-09.04
title: "Nested Object & Sao chép tham chiếu vs Deep Clone"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Nested Object", "Reference Type", "Shallow Copy", "Deep Clone", "structuredClone"]
prerequisites: ["JS2-09.03"]
---

# Nested Object & Sao chép tham chiếu vs Deep Clone

## 1. Khái niệm & Vấn đề thực tế
Khác với kiểu dữ liệu nguyên thủy được sao chép theo giá trị (Pass-by-value), Đối tượng trong JavaScript là **Kiểu dữ liệu tham chiếu (Reference Type)**: biến chỉ lưu giữ địa chỉ vùng nhớ trỏ đến đối tượng trên Heap.

Nếu bạn viết `const b = a;`, cả `a` và `b` cùng trỏ chung một vùng nhớ. Khi sửa `b.name`, `a.name` cũng bị thay đổi theo!

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Shallow Copy (Sao chép nông)**:
  - `{ ...obj }` hoặc `Object.assign({}, obj)`
  - Chỉ sao chép các thuộc tính cấp 1. Nếu bên trong có đối tượng con (Nested Object), đối tượng con vẫn bị trỏ chung tham chiếu!
- **Deep Clone (Sao chép sâu)**:
  - Chuẩn hiện đại: `structuredClone(obj)` (hỗ trợ tích hợp sẵn trong Node.js và trình duyệt hiện đại).
  - Tạo ra một bản sao độc lập 100% ở mọi tầng lồng nhau.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const original = {
    user: "Linh",
    settings: { theme: "light" }
};

// Sử dụng structuredClone để sao chép sâu
const deepCopied = structuredClone(original);
deepCopied.settings.theme = "dark";

console.log("Original theme:", original.settings.theme);   // "light" (không bị đổi!)
console.log("Copied theme:", deepCopied.settings.theme);   // "dark"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Lạm dụng `JSON.parse(JSON.stringify(obj))`**: Cách này cũ, chậm và làm mất các giá trị đặc biệt như `Date`, `Map`, `Set`, `undefined`. Hãy dùng `structuredClone()` chuẩn mực.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Phép gán `=` chỉ sao chép địa chỉ tham chiếu.
2. Dùng `{ ...obj }` khi object phẳng (1 cấp).
3. Dùng `structuredClone(obj)` khi object lồng nhau nhiều cấp (Nested Object).
""",
        "exercise": {
            "title": "Cập nhật cấu hình người dùng an toàn bằng Deep Clone",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng hàm `structuredClone()` để sao chép sâu (Deep Clone) một đối tượng lồng nhau, sau đó cập nhật thuộc tính con mà không làm biến đổi đối tượng gốc.

### Yêu cầu đề bài:
Cho đối tượng cấu hình ban đầu:
```javascript
const baseConfig = {
    appName: "MCodeApp",
    database: {
        host: "localhost",
        port: 5432
    }
};
```

Nhập vào từ stdin số nguyên `newPort` đại diện cho cổng kết nối mới.
1. Dùng `structuredClone(baseConfig)` để tạo bản sao sâu `customConfig`.
2. Cập nhật `customConfig.database.port = newPort`.
3. In ra cổng của cả đối tượng gốc và đối tượng bản sao để kiểm chứng:
```text
Goc port: <baseConfig.database.port>
Moi port: <customConfig.database.port>
```

### Ví dụ:
* **Đầu vào:** `8080`
* **Đầu ra:**
```text
Goc port: 5432
Moi port: 8080
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng hàm `structuredClone()`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["structuredClone","database.port","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng hàm structuredClone() để sao chép sâu đối tượng."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const baseConfig = {
    appName: "MCodeApp",
    database: {
        host: "localhost",
        port: 5432
    }
};

const newPort = parseInt(input[0], 10);

// Thực hiện Deep Clone bằng structuredClone và cập nhật port

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const baseConfig = {
    appName: "MCodeApp",
    database: {
        host: "localhost",
        port: 5432
    }
};

const newPort = parseInt(input[0], 10);

const customConfig = structuredClone(baseConfig);
customConfig.database.port = newPort;

console.log("Goc port:", baseConfig.database.port);
console.log("Moi port:", customConfig.database.port);
""",
            "test_cases": [
                {
                    "input": "8080",
                    "expected_output": "Goc port: 5432\nMoi port: 8080",
                    "is_hidden": False
                },
                {
                    "input": "3306",
                    "expected_output": "Goc port: 5432\nMoi port: 3306",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Vì sao phương thức sao chép Spread `{ ...obj }` được gọi là 'Shallow Copy' (sao chép nông)?",
            "explanation": "Toán tử Spread {...obj} chỉ sao chép giá trị của các thuộc tính ở tầng thứ nhất. Nếu một thuộc tính chứa đối tượng con (Nested Object), nó chỉ sao chép địa chỉ tham chiếu của đối tượng con đó, khiến cả hai đối tượng vẫn cùng chia sẻ đối tượng con bên trong.",
            "options": [
                {"key": "A", "text": "Vì nó chỉ sao chép được tối đa 2 thuộc tính.", "is_correct": False},
                {"key": "B", "text": "Vì nó chỉ sao chép tầng ngoài cùng; các đối tượng con lồng bên trong vẫn bị dùng chung tham chiếu.", "is_correct": True},
                {"key": "C", "text": "Vì nó tự động xóa các thuộc tính kiểu chuỗi.", "is_correct": False},
                {"key": "D", "text": "Vì nó chạy chậm hơn JSON.parse.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-09",
        "chapter_id": "JS2-CH-09",
        "module_folder": "Module 01",
        "filename": "Lesson_09_05.md",
        "lesson_id": "JS2-09.05",
        "title": "Bài 9.5: Optional Chaining (?.) & Nullish Coalescing (??)",
        "objective": "Ngăn chặn lỗi sập ứng dụng 'Cannot read properties of undefined' với Optional Chaining (?.) và đặt giá trị mặc định chính xác bằng Nullish Coalescing (??).",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 5,
        "content": """---
lessonId: JS2-09.05
title: "Optional Chaining (?.) & Nullish Coalescing (??)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Optional Chaining", "?.", "Nullish Coalescing", "??", "TypeError", "ES2020"]
prerequisites: ["JS2-09.04"]
---

# Optional Chaining (?.) & Nullish Coalescing (??)

## 1. Khái niệm & Vấn đề thực tế
Lỗi kinh điển nhất trong toàn bộ thế giới JavaScript là:
`TypeError: Cannot read properties of undefined (reading 'xyz')`.
Lỗi này xảy ra khi cố truy cập thuộc tính con của một đối tượng bị `null` hoặc `undefined`.

ES2020 mang đến hai toán tử cứu cánh:
1. **Optional Chaining (`?.`)**: Dừng ngay và trả về `undefined` nếu vế trước là `null` hoặc `undefined`, không ném ra lỗi!
2. **Nullish Coalescing (`??`)**: Cung cấp giá trị dự phòng (fallback) CHỈ KHI vế trái là `null` hoặc `undefined` (khác với `||` vốn bắt cả `0` và `""`).

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Optional Chaining**: `obj?.prop?.subProp`
- **Nullish Coalescing**: `val ?? defaultValue`
  - So sánh với toán tử OR `||`:
    - `0 || 10` -> Kết quả là `10` (vì `0` là Falsy).
    - `0 ?? 10` -> Kết quả là `0` (vì `0` không phải `null` hay `undefined`).

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const user = {
    id: 1,
    profile: {
        avatar: null
    }
};

// 1. Truy cập an toàn không bị sập chương trình
const street = user?.address?.street; // undefined (không báo lỗi TypeError!)

// 2. Thiết lập giá trị mặc định chính xác với ??
const userScore = 0;
const score = userScore ?? 100; // 0 (giữ nguyên điểm 0 của người dùng!)
console.log("Score:", score);
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Dùng nhầm `||` cho các thiết lập số**: Nếu cấu hình cho phép người dùng đặt `timeout = 0` hoặc `volume = 0`, dùng `volume || 50` sẽ biến `0` thành `50` (sai lệch ý muốn). Luôn dùng `volume ?? 50`!

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `?.` để tránh lỗi sụp đổ chương trình khi đọc dữ liệu lồng nhau.
2. Dùng `??` khi muốn đặt giá trị mặc định cho `null` hoặc `undefined` mà vẫn giữ nguyên số `0`, `false` và chuỗi rỗng `""`.
""",
        "exercise": {
            "title": "Đọc cấu hình hệ thống an toàn với ?. và ??",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng Optional Chaining (`?.`) và Nullish Coalescing (`??`) để đọc cấu hình an toàn từ một đối tượng có thể bị khuyết thiếu thuộc tính.

### Yêu cầu đề bài:
Cho đối tượng cài đặt hệ thống:
```javascript
const appConfig = {
    server: {
        host: "127.0.0.1",
        port: 0 // Người dùng chủ động đặt port 0 (ngẫu nhiên)
    }
    // Thuộc tính timeout không được định nghĩa
};
```

Đọc từ stdin một số nguyên `defaultTimeout` đại diện cho thời gian chờ dự phòng.
1. Đọc cổng `server.port` an toàn bằng `appConfig?.server?.port ?? 3000`.
2. Đọc thời gian chờ `server.timeout` an toàn bằng `appConfig?.server?.timeout ?? defaultTimeout`.

In ra màn hình theo định dạng 2 dòng:
```text
Port: <port>
Timeout: <timeout>
```

### Ví dụ:
* **Đầu vào:** `5000`
* **Đầu ra:**
```text
Port: 0
Timeout: 5000
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng toán tử `?.` và `??`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["?.","??","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng toán tử ?. và ??."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const appConfig = {
    server: {
        host: "127.0.0.1",
        port: 0
    }
};

const defaultTimeout = parseInt(input[0], 10);

// Đọc an toàn port và timeout bằng ?. và ??

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const appConfig = {
    server: {
        host: "127.0.0.1",
        port: 0
    }
};

const defaultTimeout = parseInt(input[0], 10);

const port = appConfig?.server?.port ?? 3000;
const timeout = appConfig?.server?.timeout ?? defaultTimeout;

console.log("Port:", port);
console.log("Timeout:", timeout);
""",
            "test_cases": [
                {
                    "input": "5000",
                    "expected_output": "Port: 0\nTimeout: 5000",
                    "is_hidden": False
                },
                {
                    "input": "10000",
                    "expected_output": "Port: 0\nTimeout: 10000",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Điểm khác biệt cốt lõi giữa toán tử OR `(a || b)` và Nullish Coalescing `(a ?? b)` là gì?",
            "explanation": "Toán tử '||' coi tất cả các giá trị Falsy (bao gồm cả số 0, false, chuỗi rỗng \"\") là điều kiện để kích hoạt giá trị dự phòng. Trong khi đó, toán tử '??' chỉ kích hoạt giá trị dự phòng khi biến vế trái mang giá trị 'null' hoặc 'undefined'.",
            "options": [
                {"key": "A", "text": "Toán tử ?? chỉ dùng được cho kiểu chuỗi.", "is_correct": False},
                {"key": "B", "text": "Toán tử || kích hoạt cho mọi giá trị Falsy (gồm 0, false, \"\"), còn ?? chỉ kích hoạt khi giá trị là null hoặc undefined.", "is_correct": True},
                {"key": "C", "text": "Toán tử ?? chạy chậm hơn || nhiều lần.", "is_correct": False},
                {"key": "D", "text": "Cả hai toán tử cho kết quả hoàn toàn giống nhau trong mọi trường hợp.", "is_correct": False}
            ]
        }
    },

    # ========================================================
    # MODULE 10: Modern JavaScript (ES6+) & Kỹ thuật viết code sạch
    # ========================================================
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-10",
        "chapter_id": "JS2-CH-10",
        "module_folder": "Module 02",
        "filename": "Lesson_10_01.md",
        "lesson_id": "JS2-10.01",
        "title": "Bài 10.1: Phân rã mảng & đối tượng nâng cao (Destructuring Assignment)",
        "objective": "Làm chủ cú pháp Destructuring cho cả Array và Object, đổi tên biến khi phân rã và hoán đổi giá trị hai biến mà không cần biến tạm.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 1,
        "content": """---
lessonId: JS2-10.01
title: "Phân rã mảng & đối tượng nâng cao (Destructuring Assignment)"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Destructuring", "Array Destructuring", "Object Destructuring", "Hoán đổi biến", "ES6"]
prerequisites: ["JS2-09.05"]
---

# Phân rã mảng & đối tượng nâng cao (Destructuring Assignment)

## 1. Khái niệm & Vấn đề thực tế
Trước ES6, để lấy từng thuộc tính của đối tượng hoặc từng phần tử của mảng gán vào biến riêng, ta phải viết từng dòng lặp đi lặp lại (`const a = obj.a; const b = obj.b;`).

**Destructuring Assignment (Gán phân rã)** cho phép "giải nén" các giá trị từ mảng hoặc thuộc tính từ đối tượng thành các biến riêng biệt chỉ với một dòng mã.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Object Destructuring**:
  ```javascript
  const user = { name: "An", age: 25, role: "admin" };
  const { name, age } = user; // Trích xuất name và age
  const { role: userRole } = user; // Đổi tên biến role thành userRole
  ```
- **Array Destructuring**:
  ```javascript
  const coords = [10.5, 106.8];
  const [lat, lng] = coords;
  ```
- **Kỹ thuật hoán đổi 2 biến không cần biến trung gian `temp`**:
  ```javascript
  let a = 1, b = 2;
  [a, b] = [b, a]; // a thành 2, b thành 1!
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const response = {
    status: 200,
    data: { id: 101, title: "Learn JS" }
};

// Phân rã lồng nhau
const { status, data: { title } } = response;
console.log(status); // 200
console.log(title);  // "Learn JS"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên dấu chấm phẩy trước `[a, b] = [b, a]`**: Khi hoán đổi biến ở đầu dòng, nếu dòng trước đó thiếu `;`, JS Engine sẽ hiểu nhầm thành lời gọi hàm hoặc truy cập index mảng.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `{ prop1, prop2 } = obj` cho Object.
2. Dùng `[first, second] = arr` cho Array.
3. Hoán đổi biến siêu gọn: `[x, y] = [y, x]`.
""",
        "exercise": {
            "title": "Hoán đổi biến và phân rã đối tượng sinh viên",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Áp dụng cú pháp Destructuring để hoán đổi giá trị hai số nguyên và phân rã các trường thông tin của đối tượng.

### Yêu cầu đề bài:
Nhập vào 2 số nguyên $X$ và $Y$ từ stdin.
1. Sử dụng cú pháp Array Destructuring `[x, y] = [y, x]` để hoán đổi giá trị của $x$ và $y$.
2. Cho đối tượng sinh viên:
```javascript
const student = {
    fullName: "Tran Van Nam",
    gpa: 8.8
};
```
Sử dụng Object Destructuring để trích xuất `fullName` và đổi tên `gpa` thành `diemTB`.

In ra kết quả theo định dạng 3 dòng:
```text
Sau hoan doi: x = <x>, y = <y>
Sinh vien: <fullName>
Diem TB: <diemTB>
```

### Ví dụ:
* **Đầu vào:** `5 9`
* **Đầu ra:**
```text
Sau hoan doi: x = 9, y = 5
Sinh vien: Tran Van Nam
Diem TB: 8.8
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cú pháp hoán đổi `[x, y] = [y, x]`.
* Bắt buộc sử dụng Object Destructuring `{ fullName, gpa: diemTB }`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["[x, y] = [y, x]","fullName","gpa: diemTB","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng [x, y] = [y, x] và { fullName, gpa: diemTB }."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

let x = parseInt(input[0], 10);
let y = parseInt(input[1], 10);

const student = {
    fullName: "Tran Van Nam",
    gpa: 8.8
};

// Hoán đổi x, y bằng destructuring và phân rã student

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

let x = parseInt(input[0], 10);
let y = parseInt(input[1], 10);

[x, y] = [y, x];

const student = {
    fullName: "Tran Van Nam",
    gpa: 8.8
};

const { fullName, gpa: diemTB } = student;

console.log(`Sau hoan doi: x = ${x}, y = ${y}`);
console.log("Sinh vien:", fullName);
console.log("Diem TB:", diemTB);
""",
            "test_cases": [
                {
                    "input": "5 9",
                    "expected_output": "Sau hoan doi: x = 9, y = 5\nSinh vien: Tran Van Nam\nDiem TB: 8.8",
                    "is_hidden": False
                },
                {
                    "input": "100 200",
                    "expected_output": "Sau hoan doi: x = 200, y = 100\nSinh vien: Tran Van Nam\nDiem TB: 8.8",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Cú pháp `const { role: userRole } = user;` có ý nghĩa là gì?",
            "explanation": "Cú pháp này trích xuất giá trị của thuộc tính 'role' từ đối tượng 'user' nhưng đổi tên biến lưu trữ thành 'userRole'.",
            "options": [
                {"key": "A", "text": "Gán giá trị của userRole vào thuộc tính role của user.", "is_correct": False},
                {"key": "B", "text": "Trích xuất thuộc tính 'role' và đặt tên biến mới là 'userRole'.", "is_correct": True},
                {"key": "C", "text": "Tạo ra một hàm tên là userRole.", "is_correct": False},
                {"key": "D", "text": "So sánh xem role có bằng userRole hay không.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-10",
        "chapter_id": "JS2-CH-10",
        "module_folder": "Module 02",
        "filename": "Lesson_10_02.md",
        "lesson_id": "JS2-10.02",
        "title": "Bài 10.2: Toán tử lan truyền (Spread Operator ...) cho Array và Object",
        "objective": "Làm chủ toán tử Spread (...), kỹ thuật gộp mảng, hợp nhất đối tượng (Object merge) và ghi đè thuộc tính cấu hình.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 2,
        "content": """---
lessonId: JS2-10.02
title: "Toán tử lan truyền (Spread Operator ...) cho Array và Object"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Spread Operator", "...", "Gộp mảng", "Hợp nhất Object", "ES6"]
prerequisites: ["JS2-10.01"]
---

# Toán tử lan truyền (Spread Operator ...) cho Array và Object

## 1. Khái niệm & Vấn đề thực tế
Toán tử lan truyền (**Spread Operator `...`**) cho phép "trải phẳng" toàn bộ các phần tử của một mảng hoặc các cặp key-value của một đối tượng vào một mảng hoặc đối tượng mới.

Đây là công cụ chủ chốt giúp viết code theo phong cách **Bất biến (Immutable State)**: tạo dữ liệu mới dựa trên dữ liệu cũ mà không làm biến đổi mảng hay đối tượng gốc.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Trải mảng**:
  ```javascript
  const arr1 = [1, 2];
  const arr2 = [3, 4];
  const mergedArr = [...arr1, ...arr2, 5]; // [1, 2, 3, 4, 5]
  ```
- **Hợp nhất đối tượng**:
  ```javascript
  const defaultSettings = { theme: "light", fontSize: 14 };
  const userSettings = { fontSize: 16 };

  // Thuộc tính xuất hiện sau sẽ ghi đè thuộc tính phía trước
  const finalSettings = { ...defaultSettings, ...userSettings };
  // { theme: "light", fontSize: 16 }
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const numbers = [12, 45, 7, 89];

// Dùng spread để truyền mảng vào hàm Math.max()
const maxVal = Math.max(...numbers);
console.log("Số lớn nhất:", maxVal); // 89
```

- `Math.max()` yêu cầu các đối số riêng lẻ (`Math.max(a, b, c)`). Toán tử `...numbers` đã bóc tách mảng thành các đối số độc lập.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Thứ tự ghi đè khi Spread Object**: Thuộc tính nào đặt phía sau sẽ đè lên thuộc tính phía trước có cùng tên.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. `...arr`: Trải phẳng phần tử mảng.
2. `...obj`: Sao chép và hợp nhất thuộc tính đối tượng.
3. Luôn đặt thuộc tính tùy chỉnh phía sau thuộc tính mặc định để ghi đè.
""",
        "exercise": {
            "title": "Hợp nhất cấu hình ứng dụng bằng Spread Operator",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng toán tử Spread (`...`) để gộp mảng và hợp nhất đối tượng cấu hình.

### Yêu cầu đề bài:
Cho các thông tin mặc định:
```javascript
const defaultTags = ["javascript", "es6"];
const defaultTheme = { mode: "dark", fontSize: 14 };
```

Nhập vào từ stdin một chuỗi `newTag` (ví dụ `"react"`) và một số nguyên `newFontSize` (ví dụ `18`).
1. Dùng toán tử Spread để tạo `finalTags` gồm tất cả các tag cũ cộng thêm `newTag` vào cuối.
2. Dùng toán tử Spread để tạo `finalTheme` hợp nhất từ `defaultTheme` và ghi đè `fontSize: newFontSize`.

In ra màn hình theo định dạng 3 dòng:
```text
Tags: <finalTags cách nhau bởi dấu phẩy và khoảng trắng>
Mode: <finalTheme.mode>
Font size: <finalTheme.fontSize>
```

### Ví dụ:
* **Đầu vào:** `web 18`
* **Đầu ra:**
```text
Tags: javascript, es6, web
Mode: dark
Font size: 18
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng toán tử Spread `...`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["...defaultTags","...defaultTheme","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng toán tử Spread ... cho cả mảng và đối tượng."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const defaultTags = ["javascript", "es6"];
const defaultTheme = { mode: "dark", fontSize: 14 };

const newTag = input[0];
const newFontSize = parseInt(input[1], 10);

// Hợp nhất tags và theme bằng toán tử Spread ...

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const defaultTags = ["javascript", "es6"];
const defaultTheme = { mode: "dark", fontSize: 14 };

const newTag = input[0];
const newFontSize = parseInt(input[1], 10);

const finalTags = [...defaultTags, newTag];
const finalTheme = { ...defaultTheme, fontSize: newFontSize };

console.log("Tags:", finalTags.join(", "));
console.log("Mode:", finalTheme.mode);
console.log("Font size:", finalTheme.fontSize);
""",
            "test_cases": [
                {
                    "input": "web 18",
                    "expected_output": "Tags: javascript, es6, web\nMode: dark\nFont size: 18",
                    "is_hidden": False
                },
                {
                    "input": "backend 20",
                    "expected_output": "Tags: javascript, es6, backend\nMode: dark\nFont size: 20",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Trong phép hợp nhất `{ a: 1, b: 2, ...{ b: 5, c: 10 } }`, giá trị của thuộc tính `b` trong đối tượng kết quả là bao nhiêu?",
            "explanation": "Khi trải phẳng đối tượng bằng toán tử Spread, các thuộc tính xuất hiện sau sẽ ghi đè lên các thuộc tính đã tồn tại trước đó nếu trùng tên key. Do đó, b: 5 sẽ ghi đè lên b: 2.",
            "options": [
                {"key": "A", "text": "2", "is_correct": False},
                {"key": "B", "text": "5", "is_correct": True},
                {"key": "C", "text": "7", "is_correct": False},
                {"key": "D", "text": "undefined", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-10",
        "chapter_id": "JS2-CH-10",
        "module_folder": "Module 02",
        "filename": "Lesson_10_03.md",
        "lesson_id": "JS2-10.03",
        "title": "Bài 10.3: Gom tham số với Rest Parameters (...args) trong hàm",
        "objective": "Làm chủ cú pháp Rest Parameters (...args) để gom số lượng đối số vô định thành một mảng thực thụ, thay thế đối tượng cũ arguments.",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 3,
        "content": """---
lessonId: JS2-10.03
title: "Gom tham số với Rest Parameters (...args) trong hàm"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Rest Parameters", "...args", "Variadic function", "arguments", "ES6"]
prerequisites: ["JS2-10.02"]
---

# Gom tham số với Rest Parameters (...args) trong hàm

## 1. Khái niệm & Vấn đề thực tế
Khi viết các hàm tiện ích có thể nhận số lượng đối số không cố định (ví dụ hàm tính tổng `sum(1, 2, 3, 4, ...)`, hàm log định dạng), trước ES6 lập trình viên phải dùng biến ẩn `arguments` (vốn là một đối tượng giống mảng - array-like nhưng không có các hàm như `map`, `reduce`).

ES6 ra mắt **Rest Parameters (`...args`)**, gom toàn bộ các đối số còn lại thành một **mảng JavaScript thực thụ (Array)**.

---

## 2. Cú pháp & Quy tắc cốt lõi
```javascript
function fn(firstParam, ...restParams) {
    // firstParam là đối số đầu tiên
    // restParams là một MẢNG chứa toàn bộ các đối số còn lại
}
```

- **Quy tắc duy nhất**: Rest parameter bắt buộc phải là **tham số cuối cùng** trong danh sách khai báo hàm. Mỗi hàm chỉ được phép có duy nhất một Rest parameter.

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
function sumAll(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

console.log(sumAll(10, 20));             // 30
console.log(sumAll(1, 2, 3, 4, 5, 6));   // 21
```

- Mọi đối số truyền vào đều được tự động gom vào mảng `numbers`. Ta có thể dùng trực tiếp hàm `.reduce()` của mảng mà không cần chuyển đổi.

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Đặt Rest Parameter ở giữa danh sách**: `function test(...args, last) {}` -> Báo lỗi cú pháp `SyntaxError: Rest parameter must be last formal parameter`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Cú pháp: `...paramName` ở vị trí cuối cùng trong danh sách tham số.
2. Biến rest là một mảng thuần túy, sở hữu đầy đủ các phương thức `.map()`, `.filter()`, `.reduce()`.
""",
        "exercise": {
            "title": "Hàm tính toán thống kê với số lượng tham số tùy ý",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Viết hàm sử dụng cú pháp Rest Parameters (`...numbers`) để tính giá trị trung bình cộng của một danh sách các số.

### Yêu cầu đề bài:
Nhập vào danh sách các số thực từ stdin (cách nhau bởi khoảng trắng).
Viết hàm:
`function computeAverage(title, ...numbers)`
* `title`: Tiêu đề chuỗi đại diện cho danh mục thống kê.
* `...numbers`: Gom tất cả các số thực truyền vào thành mảng.
* Tính trung bình cộng: $\\text{avg} = \\frac{\\sum \\text{numbers}}{\\text{numbers.length}}$.

Gọi hàm với tiêu đề `"Diem trung binh"` và các số vừa đọc được.
In ra kết quả theo đúng định dạng:
```text
<title>: <avg lam tron 2 chu so thap phan>
```

### Ví dụ:
* **Đầu vào:** `8.5 7.0 9.5 6.0`
* **Đầu ra:** `Diem trung binh: 7.75`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cú pháp Rest Parameters `...numbers`.
* Sử dụng `.toFixed(2)` để định dạng kết quả.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["...numbers","toFixed","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng cú pháp Rest Parameters ...numbers trong hàm."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const nums = input.map(Number);

// Định nghĩa hàm computeAverage sử dụng Rest Parameters và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const nums = input.map(Number);

function computeAverage(title, ...numbers) {
    const sum = numbers.reduce((acc, cur) => acc + cur, 0);
    const avg = sum / numbers.length;
    return `${title}: ${avg.toFixed(2)}`;
}

console.log(computeAverage("Diem trung binh", ...nums));
""",
            "test_cases": [
                {
                    "input": "8.5 7.0 9.5 6.0",
                    "expected_output": "Diem trung binh: 7.75",
                    "is_hidden": False
                },
                {
                    "input": "10.0 10.0 10.0",
                    "expected_output": "Diem trung binh: 10.00",
                    "is_hidden": True
                },
                {
                    "input": "5.5 6.5",
                    "expected_output": "Diem trung binh: 6.00",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Quy tắc bắt buộc nào sau đây áp dụng cho Rest Parameter trong khai báo hàm JavaScript?",
            "explanation": "Rest Parameter bắt buộc phải đứng ở vị trí cuối cùng trong danh sách các tham số của hàm và mỗi hàm chỉ được phép có tối đa một Rest Parameter duy nhất.",
            "options": [
                {"key": "A", "text": "Nó bắt buộc phải đứng ở vị trí tham số đầu tiên.", "is_correct": False},
                {"key": "B", "text": "Nó bắt buộc phải là tham số cuối cùng trong danh sách tham số.", "is_correct": True},
                {"key": "C", "text": "Một hàm có thể có 2 Rest Parameters cùng lúc.", "is_correct": False},
                {"key": "D", "text": "Nó chỉ dùng được với Arrow Function.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-10",
        "chapter_id": "JS2-CH-10",
        "module_folder": "Module 02",
        "filename": "Lesson_10_04.md",
        "lesson_id": "JS2-10.04",
        "title": "Bài 10.4: Shorthand Properties & Computed Property Names trong ES6",
        "objective": "Tối ưu hóa mã nguồn khai báo Object với Property Value Shorthand, Method Shorthand và thuộc tính tính toán động Computed Property Names [expr].",
        "difficulty": "EASY",
        "duration_minutes": 25,
        "order_index": 4,
        "content": """---
lessonId: JS2-10.04
title: "Shorthand Properties & Computed Property Names trong ES6"
difficulty: "Dễ"
estimatedDuration: "25 phút"
keywords: ["Shorthand Properties", "Computed Property Names", "Object enhancements", "ES6"]
prerequisites: ["JS2-10.03"]
---

# Shorthand Properties & Computed Property Names trong ES6

## 1. Khái niệm & Vấn đề thực tế
Khi khởi tạo Object từ các biến có sẵn, việc lặp lại `{ name: name, age: age }` rất dư thừa.
ES6 mang đến hai cải tiến cú pháp xuất sắc:
1. **Property Value Shorthand**: Khi tên thuộc tính trùng với tên biến, chỉ cần viết `{ name, age }`.
2. **Computed Property Names**: Cho phép đặt tên thuộc tính bằng một biểu thức tính toán động đặt trong cặp ngoặc vuông `[expression]` ngay tại thời điểm khởi tạo Object Literal.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Shorthand property**:
  ```javascript
  const username = "viet";
  const role = "admin";
  const user = { username, role }; // Tự hiểu là { username: "viet", role: "admin" }
  ```
- **Computed Property Names**:
  ```javascript
  const dynamicKey = "score_" + 2026;
  const record = {
      id: 1,
      [dynamicKey]: 95 // Tên thuộc tính được tính toán động
  };
  // record = { id: 1, score_2026: 95 }
  ```

---

## 3. Ví dụ trực quan & Phân tích từng dòng

```javascript
const field = "language";
const langName = "JavaScript";

const course = {
    title: "Web Core",
    [field]: langName // Khởi tạo thuộc tính động 'language': 'JavaScript'
};

console.log(course.language); // "JavaScript"
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Quên dấu ngoặc vuông khi tính toán key**: Viết `{ field: langName }` sẽ tạo ra thuộc tính mang tên chữ `"field"` thay vì giá trị của biến `field`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Tên biến trùng tên key: viết tắt `{ varName }`.
2. Tên key động: bọc trong ngoặc vuông `{[expr]: value}`.
""",
        "exercise": {
            "title": "Tạo đối tượng nhật ký với thuộc tính tính toán động",
            "difficulty": "EASY",
            "problem_description": """### Mục tiêu:
Sử dụng cú pháp Shorthand Property và Computed Property Name `[key]` để khởi tạo đối tượng.

### Yêu cầu đề bài:
Nhập vào 2 chuỗi từ stdin:
1. `metricName`: Tên chỉ số đo lường (ví dụ `"cpuUsage"` hoặc `"memory"`).
2. `metricValue`: Giá trị của chỉ số đó (ví dụ `"45%"` hoặc `"1.2GB"`).

Khai báo biến:
`const status = "ACTIVE";`
Hãy khởi tạo một đối tượng `metricLog` duy nhất chứa:
* Thuộc tính shorthand: `status`
* Thuộc tính động bằng Computed Property Name: `[metricName]: metricValue`

In đối tượng đã tạo ra màn hình dưới dạng chuỗi JSON bằng `JSON.stringify(metricLog)`.

### Ví dụ:
* **Đầu vào:** `cpuUsage 45%`
* **Đầu ra:** `{"status":"ACTIVE","cpuUsage":"45%"}`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng Computed Property Name `[metricName]` và Shorthand property `status`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["status,","[metricName]","JSON.stringify","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu dùng cú pháp Shorthand property và Computed Property Name [metricName]."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const metricName = input[0];
const metricValue = input[1];
const status = "ACTIVE";

// Khởi tạo metricLog và in ra dạng JSON

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const metricName = input[0];
const metricValue = input[1];
const status = "ACTIVE";

const metricLog = {
    status,
    [metricName]: metricValue
};

console.log(JSON.stringify(metricLog));
""",
            "test_cases": [
                {
                    "input": "cpuUsage 45%",
                    "expected_output": "{\"status\":\"ACTIVE\",\"cpuUsage\":\"45%\"}",
                    "is_hidden": False
                },
                {
                    "input": "memory 1.2GB",
                    "expected_output": "{\"status\":\"ACTIVE\",\"memory\":\"1.2GB\"}",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Tính năng 'Computed Property Names' trong ES6 cho phép làm điều gì?",
            "explanation": "Computed Property Names cho phép đặt một biểu thức JavaScript bất kỳ bên trong cặp dấu ngoặc vuông [expression] để tính toán tên của thuộc tính đối tượng ngay tại thời điểm định nghĩa Object Literal.",
            "options": [
                {"key": "A", "text": "Tính toán tự động giá trị thuộc tính số học.", "is_correct": False},
                {"key": "B", "text": "Sử dụng một biểu thức nằm trong dấu [ ] để làm tên thuộc tính khi khai báo Object Literal.", "is_correct": True},
                {"key": "C", "text": "Tự động xóa các thuộc tính trùng lặp.", "is_correct": False},
                {"key": "D", "text": "Chuyển đối tượng thành mảng.", "is_correct": False}
            ]
        }
    },
    {
        "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
        "module_id": "JS2-MOD-10",
        "chapter_id": "JS2-CH-10",
        "module_folder": "Module 02",
        "filename": "Lesson_10_05.md",
        "lesson_id": "JS2-10.05",
        "title": "Bài 10.5: Cấu trúc dữ liệu Set và Map trong JavaScript ES6",
        "objective": "Làm chủ cấu trúc Set (tập hợp các giá trị duy nhất, không trùng lặp) và Map (tập hợp key-value linh hoạt cho phép mọi kiểu dữ liệu làm key).",
        "difficulty": "MEDIUM",
        "duration_minutes": 25,
        "order_index": 5,
        "content": """---
lessonId: JS2-10.05
title: "Cấu trúc dữ liệu Set và Map trong JavaScript ES6"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Set", "Map", "Unique values", "Key-Value Collection", "ES6 Data Structures"]
prerequisites: ["JS2-10.04"]
---

# Cấu trúc dữ liệu Set và Map trong JavaScript ES6

## 1. Khái niệm & Vấn đề thực tế
Trước ES6, JavaScript chỉ có Array và Object.
- Nhược điểm của Object khi làm từ điển (dictionary): chỉ cho phép khóa (key) là `string` hoặc `symbol`.
- Nhược điểm của Array: cho phép trùng lặp, việc lọc các phần tử trùng tốn $O(N^2)$ nếu dùng lồng vòng lặp.

ES6 bổ sung hai cấu trúc dữ liệu chuẩn mực:
1. **`Set`**: Tập hợp các phần tử **duy nhất** (không bao giờ chứa giá trị trùng lặp).
2. **`Map`**: Cấu trúc cặp `[key, value]` cho phép **mọi kiểu dữ liệu** (kể cả object, hàm, số) làm key.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Tập hợp `Set`**:
  ```javascript
  const uniqueNums = new Set([1, 2, 2, 3, 3, 4]); // Set(4) {1, 2, 3, 4}
  uniqueNums.add(5);
  uniqueNums.has(3); // true
  console.log(uniqueNums.size); // 5

  // Kỹ thuật kinh điển: Lọc trùng lặp mảng chỉ với 1 dòng mã
  const cleanArr = [...new Set(duplicatedArr)];
  ```
- **Từ điển `Map`**:
  ```javascript
  const map = new Map();
  map.set("name", "Nam");
  map.set(101, "Mã phòng thi"); // Số làm key!
  console.log(map.get(101));    // "Mã phòng thi"
  console.log(map.has("name")); // true
  ```

---

## 3. Ví dụ trực quan: Đếm tần suất xuất hiện với Map

```javascript
const words = ["js", "python", "js", "cpp", "js"];
const counter = new Map();

for (const w of words) {
    const currentCount = counter.get(w) ?? 0;
    counter.set(w, currentCount + 1);
}

console.log("Số lần xuất hiện của js:", counter.get("js")); // 3
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **So sánh object trong Set/Map**: Hai object độc lập `{ id: 1 }` và `{ id: 1 }` có địa chỉ tham chiếu khác nhau nên Set vẫn coi là 2 phần tử khác biệt.
- **Dùng thuộc tính `.size` thay vì `.length`**: Cả `Set` và `Map` đều sử dụng thuộc tính `.size` để đo số lượng phần tử.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `new Set(arr)` để loại bỏ mọi phần tử trùng lặp.
2. Dùng `new Map()` khi cần lưu key-value có kiểu key đặc biệt hoặc cần bảo toàn thứ tự thêm vào.
3. Cả hai đều có phương thức `.add()` / `.set()`, `.has()`, `.delete()`, `.size`.
""",
        "exercise": {
            "title": "Loại bỏ phần tử trùng lặp và đếm số lượng duy nhất",
            "difficulty": "MEDIUM",
            "problem_description": """### Mục tiêu:
Sử dụng cấu trúc dữ liệu `Set` để loại bỏ các phần tử trùng lặp trong mảng nhận từ stdin và xuất danh sách duy nhất.

### Yêu cầu đề bài:
Nhập vào một danh sách các từ hoặc số nguyên từ stdin (cách nhau bởi khoảng trắng).
1. Khởi tạo một đối tượng `Set` từ danh sách đầu vào để loại bỏ các phần tử trùng lặp.
2. Lấy số lượng phần tử duy nhất bằng thuộc tính `.size`.
3. Chuyển `Set` ngược lại thành mảng bằng toán tử Spread `[...mySet]`.

In ra màn hình theo đúng định dạng 2 dòng:
```text
So luong duy nhat: <set.size>
Danh sach: <danh_sach_cach_nhau_boi_dau_phay_va_khoang_trang>
```

### Ví dụ:
* **Đầu vào:** `cam tao cam xoai tao chuoi`
* **Đầu ra:**
```text
So luong duy nhat: 4
Danh sach: cam, tao, xoai, chuoi
```

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng `new Set()` và thuộc tính `.size`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["new Set","size","...","console.log"],"forbiddenKeywords":[],"customErrorMessage":"Bài tập yêu cầu sử dụng new Set() và thuộc tính .size để lọc trùng lặp."} -->""",
            "starterCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

// Sử dụng Set để loại bỏ trùng lặp và in kết quả

""",
            "solutionCode": """const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);

const uniqueSet = new Set(input);
const uniqueList = [...uniqueSet];

console.log("So luong duy nhat:", uniqueSet.size);
console.log("Danh sach:", uniqueList.join(", "));
""",
            "test_cases": [
                {
                    "input": "cam tao cam xoai tao chuoi",
                    "expected_output": "So luong duy nhat: 4\nDanh sach: cam, tao, xoai, chuoi",
                    "is_hidden": False
                },
                {
                    "input": "1 2 2 3 3 3 4",
                    "expected_output": "So luong duy nhat: 4\nDanh sach: 1, 2, 3, 4",
                    "is_hidden": True
                },
                {
                    "input": "a a a a",
                    "expected_output": "So luong duy nhat: 1\nDanh sach: a",
                    "is_hidden": True
                }
            ]
        },
        "quiz": {
            "question": "Cách nhanh và chuẩn nhất trong Modern JavaScript để loại bỏ toàn bộ phần tử trùng lặp trong một mảng `arr` là gì?",
            "explanation": "Cú pháp '[...new Set(arr)]' truyền mảng arr vào hàm khởi tạo Set để tự động lọc bỏ các phần tử trùng lặp, sau đó dùng toán tử Spread [...] để trải ngược các phần tử duy nhất về một mảng mới.",
            "options": [
                {"key": "A", "text": "arr.filter((v, i) => arr.indexOf(v) === i)", "is_correct": False},
                {"key": "B", "text": "[...new Set(arr)]", "is_correct": True},
                {"key": "C", "text": "new Map(arr).toArray()", "is_correct": False},
                {"key": "D", "text": "arr.sort().unique()", "is_correct": False}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"🚀 Seeding Course 2 Modules 9 & 10 ({len(lessons)} lessons)...")
    save_and_seed_lessons("Khóa 2 - JavaScript Nâng cao", lessons)
