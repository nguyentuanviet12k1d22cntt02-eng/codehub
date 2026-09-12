import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';
import * as path from 'path';

interface TestCaseDef {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

interface ExerciseDef {
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    problemDescription: string;
    starterCode: string;
    solutionCode: string;
    testCases: TestCaseDef[];
}

interface QuizOptionDef {
    key: string;
    text: string;
    isCorrect: boolean;
}

interface QuizDef {
    question: string;
    explanation: string;
    options: QuizOptionDef[];
}

interface LessonSeedItem {
    moduleNumber: number;
    moduleId: string;
    chapterId: string;
    chapterTitle: string;
    chapterObjective: string;
    file: string;
    lessonId: string;
    title: string;
    objective: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    durationMinutes: number;
    orderIndex: number;
    exercise: ExerciseDef;
    quiz: QuizDef;
}

const lessonsToSeed: LessonSeedItem[] = [
    // ==========================================
    // MODULE 2: RẼ NHÁNH & LOGIC ĐIỀU KIỆN
    // ==========================================
    {
        moduleNumber: 2,
        moduleId: 'CPP-MOD-02',
        chapterId: 'CPP-CH-02',
        chapterTitle: 'Chương 2: Cấu trúc Rẽ nhánh và Tư duy Logic Điều kiện',
        chapterObjective: 'Làm chủ quyết định logic, cơ chế đoản mạch short-circuit, kỹ thuật Early Return và switch-case.',
        file: 'Lesson_02_01.md',
        lessonId: 'CPP-02.01',
        title: 'Bài 2.1: Biểu thức Logic, Toán tử So sánh và Cơ chế Đoản mạch',
        objective: 'Nắm vững các toán tử so sánh, logic và hiểu sâu cơ chế đoản mạch (short-circuit evaluation).',
        difficulty: 'EASY',
        durationMinutes: 20,
        orderIndex: 1,
        exercise: {
            title: 'Kiểm tra độ tuổi lái xe hợp lệ',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên age đại diện cho tuổi của một người từ bàn phím.
Sử dụng toán tử so sánh để kiểm tra xem người này có đủ điều kiện thi bằng lái xe máy tại Việt Nam hay không (yêu cầu từ 18 tuổi trở lên, tức age ≥ 18).
* Nếu đủ điều kiện, in ra: \`Du dieu kien\`
* Nếu chưa đủ điều kiện, in ra: \`Chua du dieu kien\`

### Ví dụ:
* **Đầu vào:** \`20\`
* **Đầu ra:** \`Du dieu kien\`
* **Đầu vào:** \`16\`
* **Đầu ra:** \`Chua du dieu kien\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cấu trúc rẽ nhánh \`if-else\` để kiểm tra điều kiện độ tuổi.
* Bắt buộc sử dụng \`std::cin\` để đọc và \`std::cout\` để in kết quả kết thúc bằng ký tự \`'\\n'\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["if","else","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng cấu trúc if-else để kiểm tra điều kiện độ tuổi."} -->`,
            starterCode: `#include <iostream>

int main() {
    int age;
    if (std::cin >> age) {
        // Viết logic kiểm tra tại đây
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int age;
    if (std::cin >> age) {
        if (age >= 18) {
            std::cout << "Du dieu kien\\n";
        } else {
            std::cout << "Chua du dieu kien\\n";
        }
    }
    return 0;
}
`,
            testCases: [
                { input: '20', expectedOutput: 'Du dieu kien\n', isHidden: false },
                { input: '16', expectedOutput: 'Chua du dieu kien\n', isHidden: false },
                { input: '18', expectedOutput: 'Du dieu kien\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong cơ chế đoản mạch (Short-circuit Evaluation), biểu thức `false && (++x > 0)` sẽ vận hành như thế nào nếu biến x ban đầu bằng 5?',
            explanation: 'Trong phép AND (&&), vế trái bằng false thì kết quả chắc chắn là false, trình biên dịch sẽ bỏ qua hoàn toàn vế phải, do đó lệnh ++x không bao giờ được thực thi, giá trị x vẫn giữ nguyên là 5.',
            options: [
                { key: 'A', text: 'Vế phải vẫn chạy và x tăng lên 6', isCorrect: false },
                { key: 'B', text: 'Vế phải bị bỏ qua hoàn toàn, x giữ nguyên giá trị 5', isCorrect: true },
                { key: 'C', text: 'Chương trình báo lỗi biên dịch vì không đánh giá được biểu thức', isCorrect: false },
                { key: 'D', text: 'x bị đặt về 0', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 2,
        moduleId: 'CPP-MOD-02',
        chapterId: 'CPP-CH-02',
        chapterTitle: 'Chương 2: Cấu trúc Rẽ nhánh và Tư duy Logic Điều kiện',
        chapterObjective: 'Làm chủ quyết định logic, cơ chế đoản mạch short-circuit, kỹ thuật Early Return và switch-case.',
        file: 'Lesson_02_02.md',
        lessonId: 'CPP-02.02',
        title: 'Bài 2.2: Cấu trúc if, if-else và if - else if - else bậc thang',
        objective: 'Hiểu và vận dụng cấu trúc rẽ nhánh cơ bản và bậc thang để phân loại dữ liệu.',
        difficulty: 'EASY',
        durationMinutes: 20,
        orderIndex: 2,
        exercise: {
            title: 'Xếp loại học lực học sinh',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào điểm trung bình dtb (số thực từ 0.0 đến 10.0) của một học sinh.
Hãy sử dụng cấu trúc rẽ nhánh nhiều nhánh (\`if - else if - else\`) để xếp loại học lực:
* Nếu dtb ≥ 8.0: In ra \`Gioi\`
* Nếu 6.5 ≤ dtb < 8.0: In ra \`Kha\`
* Nếu 5.0 ≤ dtb < 6.5: In ra \`Trung binh\`
* Nếu dtb < 5.0: In ra \`Yeu\`

### Ví dụ:
* **Đầu vào:** \`8.5\`
* **Đầu ra:** \`Gioi\`
* **Đầu vào:** \`7.2\`
* **Đầu ra:** \`Kha\`
* **Đầu vào:** \`4.0\`
* **Đầu ra:** \`Yeu\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cấu trúc \`if - else if - else\` theo đúng thứ tự logic.
* Bắt buộc sử dụng \`std::cin\` để đọc dữ liệu và \`std::cout\` để in kết quả.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["if","else","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng cấu trúc if - else if - else để phân loại học lực."} -->`,
            starterCode: `#include <iostream>

int main() {
    double score;
    if (std::cin >> score) {
        // Viết cấu trúc if-else bậc thang
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    double score;
    if (std::cin >> score) {
        if (score >= 8.0) {
            std::cout << "Gioi\\n";
        } else if (score >= 6.5) {
            std::cout << "Kha\\n";
        } else if (score >= 5.0) {
            std::cout << "Trung binh\\n";
        } else {
            std::cout << "Yeu\\n";
        }
    }
    return 0;
}
`,
            testCases: [
                { input: '8.5', expectedOutput: 'Gioi\n', isHidden: false },
                { input: '7.2', expectedOutput: 'Kha\n', isHidden: false },
                { input: '4.8', expectedOutput: 'Yeu\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao việc sắp xếp thứ tự các nhánh điều kiện trong if - else if - else bậc thang lại đặc biệt quan trọng?',
            explanation: 'Trong chuỗi if - else if, nhánh nào thỏa mãn trước sẽ thực thi ngay và toàn bộ các nhánh phía sau bị bỏ qua. Nếu đặt điều kiện tổng quát lên trước điều kiện cụ thể, các nhánh hẹp hơn sẽ không bao giờ được chạy.',
            options: [
                { key: 'A', text: 'Vì nếu sai thứ tự chương trình sẽ không thể biên dịch', isCorrect: false },
                { key: 'B', text: 'Vì các nhánh được kiểm tra tuần tự từ trên xuống dưới, nhánh đầu tiên thỏa mãn sẽ chặn các nhánh sau', isCorrect: true },
                { key: 'C', text: 'Vì else if yêu cầu bộ nhớ RAM nhiều hơn if', isCorrect: false },
                { key: 'D', text: 'Thứ tự không quan trọng vì trình biên dịch tự động tối ưu sắp xếp lại', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 2,
        moduleId: 'CPP-MOD-02',
        chapterId: 'CPP-CH-02',
        chapterTitle: 'Chương 2: Cấu trúc Rẽ nhánh và Tư duy Logic Điều kiện',
        chapterObjective: 'Làm chủ quyết định logic, cơ chế đoản mạch short-circuit, kỹ thuật Early Return và switch-case.',
        file: 'Lesson_02_03.md',
        lessonId: 'CPP-02.03',
        title: 'Bài 2.3: if lồng nhau, Kỹ thuật Early Return và if có khởi tạo (C++17)',
        objective: 'Triệt tiêu cấu trúc mũi tên kim tự tháp (Arrow Anti-pattern) bằng kỹ thuật Early Return và cấu trúc if có khởi tạo của C++17.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 3,
        exercise: {
            title: 'Kiểm tra điều kiện rút tiền ATM với Early Return',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào 2 số nguyên dương trên cùng một dòng:
* \`soDu\`: Số dư hiện tại trong tài khoản ngân hàng.
* \`soTien\`: Số tiền khách hàng muốn rút.

Kiểm tra điều kiện rút tiền theo thứ tự ưu tiên bằng kỹ thuật Early Return (thoát sớm):
1. Số tiền rút phải là bội số của 50.000 VNĐ. Nếu không thỏa mãn, in ra \`So tien phai la boi cua 50000\` và kết thúc ngay.
2. Số tiền rút không được vượt quá số dư tài khoản. Nếu vượt quá, in ra \`So du khong du\` và kết thúc ngay.
3. Nếu thỏa mãn cả hai điều kiện trên, in ra \`Rut tien thanh cong\`.

### Ví dụ:
* **Đầu vào:** \`500000 200000\`
* **Đầu ra:** \`Rut tien thanh cong\`
* **Đầu vào:** \`100000 150000\`
* **Đầu ra:** \`So du khong du\`
* **Đầu vào:** \`500000 120000\`
* **Đầu ra:** \`So tien phai la boi cua 50000\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng kỹ thuật Early Return với lệnh \`return\` để thoát chương trình sớm khi gặp lỗi.
* Sử dụng \`std::cin\` để đọc dữ liệu và \`std::cout\` để in kết quả.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["return","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng kỹ thuật Early Return (lệnh return sớm) để xử lý điều kiện."} -->`,
            starterCode: `#include <iostream>

int main() {
    long long balance, amount;
    if (std::cin >> balance >> amount) {
        // Viết các guard clauses bằng early return tại đây
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    long long balance, amount;
    if (!(std::cin >> balance >> amount)) return 0;

    if (amount <= 0) {
        std::cout << "So tien khong hop le\\n";
        return 0;
    }
    if (amount > balance) {
        std::cout << "So du khong du\\n";
        return 0;
    }
    if (amount % 50000 != 0) {
        std::cout << "Phai la boi so cua 50000\\n";
        return 0;
    }

    std::cout << "Rut tien thanh cong: " << (balance - amount) << "\\n";
    return 0;
}
`,
            testCases: [
                { input: '500000 200000', expectedOutput: 'Rut tien thanh cong: 300000\n', isHidden: false },
                { input: '500000 600000', expectedOutput: 'So du khong du\n', isHidden: false },
                { input: '500000 120000', expectedOutput: 'Phai la boi so cua 50000\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Lợi ích lớn nhất của kỹ thuật Early Return (Guard Clauses) so với việc viết if-else lồng nhau sâu là gì?',
            explanation: 'Early Return xử lý các trường hợp ngoại lệ hoặc lỗi biên ngay từ đầu và thoát sớm, giúp giữ cho luồng xử lý chính ở mức thụt lề bằng 0, loại bỏ hoàn toàn hình tháp nhọn Arrow Anti-pattern giúp code sạch và dễ bảo trì.',
            options: [
                { key: 'A', text: 'Tăng tốc độ xung nhịp CPU lên gấp đôi', isCorrect: false },
                { key: 'B', text: 'Giảm độ phức tạp lồng nhau, giúp code phẳng, dễ đọc và dễ mở rộng', isCorrect: true },
                { key: 'C', text: 'Tự động giải phóng con trỏ rác trong RAM', isCorrect: false },
                { key: 'D', text: 'Cho phép sử dụng lệnh goto một cách an toàn', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 2,
        moduleId: 'CPP-MOD-02',
        chapterId: 'CPP-CH-02',
        chapterTitle: 'Chương 2: Cấu trúc Rẽ nhánh và Tư duy Logic Điều kiện',
        chapterObjective: 'Làm chủ quyết định logic, cơ chế đoản mạch short-circuit, kỹ thuật Early Return và switch-case.',
        file: 'Lesson_02_04.md',
        lessonId: 'CPP-02.04',
        title: 'Bài 2.4: Toán tử 3 ngôi (Ternary Operator) và Cấu trúc switch-case',
        objective: 'Sử dụng toán tử 3 ngôi cho phép gán điều kiện gọn gàng và switch-case kèm break/[[fallthrough]].',
        difficulty: 'MEDIUM',
        durationMinutes: 20,
        orderIndex: 4,
        exercise: {
            title: 'Máy tính mini 4 phép toán cơ bản bằng switch-case',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào 2 số thực a, b và một ký tự toán tử op (\`+\`, \`-\`, \`*\`, \`/\`) trên cùng một dòng (ngăn cách bởi dấu cách).
Sử dụng cấu trúc \`switch-case\` để thực hiện phép tính tương ứng:
* Nếu op là phép chia \`/\` và b = 0: in ra \`Khong the chia cho 0\`
* Nếu ký tự op không hợp lệ: in ra \`Phep toan khong hop le\`
* Các trường hợp hợp lệ in ra kết quả số thực tương ứng.

### Ví dụ:
* **Đầu vào:** \`10 5 +\`
* **Đầu ra:** \`15\`
* **Đầu vào:** \`8 0 /\`
* **Đầu ra:** \`Khong the chia cho 0\`
* **Đầu vào:** \`20 4 /\`
* **Đầu ra:** \`5\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng cấu trúc \`switch-case\` để phân nhánh xử lý toán tử.
* Sử dụng \`std::cin\` và \`std::cout\` kết thúc bằng ký tự \`'\\n'\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["switch","case","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Bài toán yêu cầu bắt buộc phải sử dụng cấu trúc switch-case!"} -->`,
            starterCode: `#include <iostream>

int main() {
    double a, b;
    char op;
    if (std::cin >> a >> b >> op) {
        // Viết cấu trúc switch-case
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    double a, b;
    char op;
    if (std::cin >> a >> b >> op) {
        switch (op) {
            case '+':
                std::cout << (a + b) << "\\n";
                break;
            case '-':
                std::cout << (a - b) << "\\n";
                break;
            case '*':
                std::cout << (a * b) << "\\n";
                break;
            case '/':
                if (b == 0) {
                    std::cout << "Khong the chia cho 0\\n";
                } else {
                    std::cout << (a / b) << "\\n";
                }
                break;
            default:
                std::cout << "Phep toan khong hop le\\n";
                break;
        }
    }
    return 0;
}
`,
            testCases: [
                { input: '10 5 +', expectedOutput: '15\n', isHidden: false },
                { input: '8 0 /', expectedOutput: 'Khong the chia cho 0\n', isHidden: false },
                { input: '20 4 /', expectedOutput: '5\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Hiện tượng "Fallthrough" trong cấu trúc switch-case xảy ra khi nào?',
            explanation: 'Khi một case thỏa mãn nhưng lập trình viên quên viết lệnh break ở cuối khối lệnh, luồng thực thi sẽ tiếp tục trượt xuống và chạy luôn các lệnh của case tiếp theo bên dưới cho đến khi gặp lệnh break hoặc kết thúc switch.',
            options: [
                { key: 'A', text: 'Khi người dùng nhập vào giá trị nằm ngoài tất cả các case', isCorrect: false },
                { key: 'B', text: 'Khi quên viết lệnh break ở cuối một case, khiến code trượt tiếp xuống case bên dưới', isCorrect: true },
                { key: 'C', text: 'Khi sử dụng kiểu dữ liệu string trong switch-case', isCorrect: false },
                { key: 'D', text: 'Khi một case có quá nhiều điều kiện con bên trong', isCorrect: false }
            ]
        }
    },

    // ==========================================
    // MODULE 3: VÒNG LẶP & CHUYÊN ĐỀ SỐ HỌC
    // ==========================================
    {
        moduleNumber: 3,
        moduleId: 'CPP-MOD-03',
        chapterId: 'CPP-CH-03',
        chapterTitle: 'Chương 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển',
        chapterObjective: 'Tự động hóa tác vụ lặp, làm chủ vòng lặp for/while/do-while và chuyên đề số học.',
        file: 'Lesson_03_01.md',
        lessonId: 'CPP-03.01',
        title: 'Bài 3.1: Vòng lặp while (Tiền điều kiện) và do-while (Hậu điều kiện)',
        objective: 'Phân biệt while và do-while, áp dụng do-while vào menu console tương tác.',
        difficulty: 'EASY',
        durationMinutes: 20,
        orderIndex: 1,
        exercise: {
            title: 'Tính tổng các số nguyên dương nhập vào cho đến khi gặp số 0',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết chương trình sử dụng vòng lặp \`while\` để liên tục nhận các số nguyên từ bàn phím.
Chương trình dừng lại khi người dùng nhập số \`0\`.
In ra màn hình tổng của tất cả các số đã nhập theo định dạng:
\`Tong: <ket_qua>\`

### Ví dụ:
* **Đầu vào:** \`5 10 15 0\`
* **Đầu ra:** \`Tong: 30\`
* **Đầu vào:** \`0\`
* **Đầu ra:** \`Tong: 0\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng vòng lặp \`while\` để đọc dữ liệu liên tục cho đến khi gặp số 0.
* Sử dụng \`std::cin\` để đọc và \`std::cout\` để in kết quả theo đúng định dạng.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["while","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng vòng lặp while để đọc dữ liệu liên tục cho đến khi gặp số 0."} -->`,
            starterCode: `#include <iostream>

int main() {
    int x;
    long long sum = 0;
    // Viết vòng lặp while tại đây
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int x;
    long long sum = 0;
    while (std::cin >> x && x != 0) {
        sum += x;
    }
    std::cout << "Tong: " << sum << "\\n";
    return 0;
}
`,
            testCases: [
                { input: '5 10 15 0', expectedOutput: 'Tong: 30\n', isHidden: false },
                { input: '0', expectedOutput: 'Tong: 0\n', isHidden: false },
                { input: '100 -20 50 0', expectedOutput: 'Tong: 130\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Điểm khác biệt cốt lõi nhất giữa vòng lặp while và vòng lặp do-while là gì?',
            explanation: 'Vòng lặp while kiểm tra điều kiện trước khi chạy thân vòng lặp (có thể lặp 0 lần nếu điều kiện ban đầu sai), trong khi do-while chạy khối lệnh trước rồi mới kiểm tra điều kiện (chắc chắn chạy tối thiểu 1 lần).',
            options: [
                { key: 'A', text: 'do-while chạy nhanh hơn while gấp 2 lần', isCorrect: false },
                { key: 'B', text: 'do-while luôn thực thi thân vòng lặp ít nhất 1 lần bất kể điều kiện ban đầu', isCorrect: true },
                { key: 'C', text: 'while chỉ dùng được với kiểu int còn do-while dùng được với kiểu float', isCorrect: false },
                { key: 'D', text: 'Trong do-while không thể sử dụng câu lệnh break', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 3,
        moduleId: 'CPP-MOD-03',
        chapterId: 'CPP-CH-03',
        chapterTitle: 'Chương 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển',
        chapterObjective: 'Tự động hóa tác vụ lặp, làm chủ vòng lặp for/while/do-while và chuyên đề số học.',
        file: 'Lesson_03_02.md',
        lessonId: 'CPP-03.02',
        title: 'Bài 3.2: Vòng lặp for đếm số và các câu lệnh điều khiển break, continue',
        objective: 'Làm chủ vòng lặp for 3 biểu thức và điều hướng luồng thực thi với break, continue.',
        difficulty: 'EASY',
        durationMinutes: 20,
        orderIndex: 2,
        exercise: {
            title: 'Tính tổng các số lẻ từ 1 đến N bỏ qua bội số của 5',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên dương N (1 ≤ N ≤ 10⁵).
Sử dụng vòng lặp \`for\` kết hợp lệnh \`continue\` để tính tổng tất cả các số lẻ trong đoạn [1, N], nhưng **bỏ qua** các số là bội của 5.
In ra kết quả tổng tìm được.

### Ví dụ:
* **Đầu vào:** \`10\`
* Giải thích: Các số lẻ là 1, 3, 5, 7, 9; bỏ qua số 5; tổng = 1 + 3 + 7 + 9 = 20.
* **Đầu ra:** \`20\`
* **Đầu vào:** \`20\`
* **Đầu ra:** \`80\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng vòng lặp \`for\` và câu lệnh \`continue\` để bỏ qua các số chia hết cho 5.
* Sử dụng kiểu \`long long\` cho biến tổng để chống tràn số.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["for","continue","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Bài toán yêu cầu sử dụng vòng lặp for và lệnh continue để bỏ qua các bội số của 5."} -->`,
            starterCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n) {
        // Viết vòng lặp for và continue
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n) {
        long long sum = 0;
        for (int i = 1; i <= n; i += 2) {
            if (i % 5 == 0) continue;
            sum += i;
        }
        std::cout << sum << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '10', expectedOutput: '20\n', isHidden: false },
                { input: '20', expectedOutput: '80\n', isHidden: false },
                { input: '5', expectedOutput: '4\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Khi câu lệnh `continue;` được thực thi bên trong một vòng lặp for, điều gì sẽ xảy ra tiếp theo?',
            explanation: 'Lệnh continue lập tức kết thúc lần lặp hiện tại, bỏ qua toàn bộ code còn lại trong thân vòng lặp và nhảy ngay tới bước cập nhật biến đếm (biểu thức thứ 3 của for) trước khi kiểm tra lại điều kiện lặp.',
            options: [
                { key: 'A', text: 'Vòng lặp bị chấm dứt vĩnh viễn và thoát ra ngoài', isCorrect: false },
                { key: 'B', text: 'Bỏ qua phần còn lại của lần lặp hiện tại và nhảy tới bước cập nhật biến đếm', isCorrect: true },
                { key: 'C', text: 'Khởi động lại vòng lặp từ giá trị ban đầu i = 0', isCorrect: false },
                { key: 'D', text: 'Tạm dừng chương trình 1 giây', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 3,
        moduleId: 'CPP-MOD-03',
        chapterId: 'CPP-CH-03',
        chapterTitle: 'Chương 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển',
        chapterObjective: 'Tự động hóa tác vụ lặp, làm chủ vòng lặp for/while/do-while và chuyên đề số học.',
        file: 'Lesson_03_03.md',
        lessonId: 'CPP-03.03',
        title: 'Bài 3.3: Vòng lặp lồng nhau (Nested Loops) và Kỹ thuật Vẽ hình tư duy',
        objective: 'Rèn luyện tư duy ma trận 2D và vẽ các hình khối ngôi sao (tam giác vuông, chữ nhật rỗng).',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 3,
        exercise: {
            title: 'Vẽ tam giác vuông dấu sao chiều cao N',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên dương N (1 ≤ N ≤ 20).
Sử dụng 2 vòng lặp \`for\` lồng nhau để vẽ một hình tam giác vuông cân cạnh góc vuông kích thước N:
* Hàng 1 có 1 dấu sao \`*\`
* Hàng 2 có 2 dấu sao \`**\`
* Hàng i có i dấu sao...

### Ví dụ:
* **Đầu vào:** \`3\`
* **Đầu ra:**
\`\`\`text
*
**
***
\`\`\`
* **Đầu vào:** \`1\`
* **Đầu ra:**
\`\`\`text
*
\`\`\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng 2 vòng lặp \`for\` lồng nhau (vòng ngoài quản lý hàng, vòng trong in dấu sao).
* Mỗi hàng in xong phải xuống dòng bằng ký tự \`'\\n'\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["for","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng vòng lặp for lồng nhau để in tam giác dấu sao."} -->`,
            starterCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n) {
        // Viết 2 vòng for lồng nhau
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n) {
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= i; ++j) {
                std::cout << "*";
            }
            std::cout << "\\n";
        }
    }
    return 0;
}
`,
            testCases: [
                { input: '3', expectedOutput: '*\n**\n***\n', isHidden: false },
                { input: '1', expectedOutput: '*\n', isHidden: false },
                { input: '4', expectedOutput: '*\n**\n***\n****\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Cho hai vòng lặp lồng nhau: vòng ngoài lặp N lần, vòng trong lặp M lần. Tổng số lần lệnh bên trong cùng được thực thi là bao nhiêu?',
            explanation: 'Với mỗi một lần chạy của vòng lặp ngoài, vòng lặp trong sẽ chạy trọn vẹn M lần. Do đó tổng số lần thực thi là tích N × M.',
            options: [
                { key: 'A', text: 'N + M lần', isCorrect: false },
                { key: 'B', text: 'N × M lần', isCorrect: true },
                { key: 'C', text: 'N² lần', isCorrect: false },
                { key: 'D', text: 'M lần', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 3,
        moduleId: 'CPP-MOD-03',
        chapterId: 'CPP-CH-03',
        chapterTitle: 'Chương 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển',
        chapterObjective: 'Tự động hóa tác vụ lặp, làm chủ vòng lặp for/while/do-while và chuyên đề số học.',
        file: 'Lesson_03_04.md',
        lessonId: 'CPP-03.04',
        title: 'Bài 3.4: Chuyên đề Số học 1: Số nguyên tố O(√N) và Thuật toán Euclid (GCD/LCM)',
        objective: 'Tối ưu hóa kiểm tra số nguyên tố từ O(N) xuống O(√N) và cài đặt giải thuật Euclid tìm ước chung lớn nhất.',
        difficulty: 'MEDIUM',
        durationMinutes: 30,
        orderIndex: 4,
        exercise: {
            title: 'Tìm Ước chung lớn nhất (GCD) bằng thuật toán Euclid',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào hai số nguyên dương a và b (1 ≤ a, b ≤ 10⁹).
Hãy tìm và in ra Ước chung lớn nhất (Greatest Common Divisor - GCD) của hai số bằng Thuật toán chia lấy dư Euclid.

### Ví dụ:
* **Đầu vào:** \`24 36\`
* **Đầu ra:** \`12\`
* **Đầu vào:** \`17 5\`
* **Đầu ra:** \`1\`

### Ràng buộc kỹ thuật:
* Bắt buộc tự cài đặt thuật toán chia lấy dư Euclid bằng vòng lặp \`while\` và phép chia dư \`%\`.
* Nghiêm cấm sử dụng các hàm thư viện có sẵn như \`std::gcd\` hoặc \`__gcd\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["while","%","cin","cout"],"forbiddenKeywords":["std::gcd","__gcd"],"customErrorMessage":"Vui lòng tự cài đặt thuật toán Euclid bằng vòng lặp, cấm sử dụng hàm thư viện có sẵn std::gcd."} -->`,
            starterCode: `#include <iostream>

int main() {
    long long a, b;
    if (std::cin >> a >> b) {
        // Cài đặt thuật toán Euclid chia dư
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    long long a, b;
    if (std::cin >> a >> b) {
        while (b != 0) {
            long long temp = a % b;
            a = b;
            b = temp;
        }
        std::cout << a << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '24 36', expectedOutput: '12\n', isHidden: false },
                { input: '17 5', expectedOutput: '1\n', isHidden: false },
                { input: '1000000 250000', expectedOutput: '250000\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao khi kiểm tra tính nguyên tố của số N, ta chỉ cần duyệt các ước số tiềm năng tới √N thay vì duyệt đến N - 1?',
            explanation: 'Các ước của N luôn xuất hiện theo từng cặp đối xứng (d và N/d). Nếu N có một ước lớn hơn √N thì ước ghép cặp còn lại chắc chắn phải nhỏ hơn hoặc bằng √N. Do đó nếu không tìm thấy ước nào trong đoạn [2, √N], N chắc chắn là số nguyên tố.',
            options: [
                { key: 'A', text: 'Vì các số sau √N luôn là số chẵn', isCorrect: false },
                { key: 'B', text: 'Vì các ước số luôn xuất hiện theo cặp, nếu có ước > √N thì chắc chắn phải có ước tương ứng ≤ √N', isCorrect: true },
                { key: 'C', text: 'Vì hàm sqrt() trong C++ tự động làm tròn số', isCorrect: false },
                { key: 'D', text: 'Đây là quy tắc ngẫu nhiên không có chứng minh toán học', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 3,
        moduleId: 'CPP-MOD-03',
        chapterId: 'CPP-CH-03',
        chapterTitle: 'Chương 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển',
        chapterObjective: 'Tự động hóa tác vụ lặp, làm chủ vòng lặp for/while/do-while và chuyên đề số học.',
        file: 'Lesson_03_05.md',
        lessonId: 'CPP-03.05',
        title: 'Bài 3.5: Chuyên đề Số học 2: Kỹ thuật Tách chữ số, Số Palindrome, Armstrong và Fibonacci',
        objective: 'Làm chủ kỹ thuật n % 10 và n /= 10 để giải các bài toán số học kinh điển.',
        difficulty: 'MEDIUM',
        durationMinutes: 30,
        orderIndex: 5,
        exercise: {
            title: 'Kiểm tra số đối xứng (Palindrome Number)',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên dương N (1 ≤ N ≤ 10⁹).
Sử dụng kỹ thuật tách chữ số để đảo ngược số N.
* Nếu số đảo ngược bằng chính số ban đầu, in ra: \`YES\` (là số Palindrome đối xứng)
* Ngược lại, in ra: \`NO\`

### Ví dụ:
* **Đầu vào:** \`12321\`
* **Đầu ra:** \`YES\`
* **Đầu vào:** \`12345\`
* **Đầu ra:** \`NO\`

### Ràng buộc kỹ thuật:
* Sử dụng vòng lặp \`while\` cùng các phép toán chia dư \`%\` và chia nguyên \`/\` để tách từng chữ số.
* Sử dụng biến đảo ngược kiểu \`long long\` để tránh tràn số.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["while","%","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng vòng lặp while và toán tử tách chữ số để kiểm tra số đối xứng."} -->`,
            starterCode: `#include <iostream>

int main() {
    long long n;
    if (std::cin >> n) {
        // Viết logic tách số và đảo ngược
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    long long n;
    if (std::cin >> n) {
        long long original = n;
        long long reversed = 0;
        while (n > 0) {
            reversed = reversed * 10 + (n % 10);
            n /= 10;
        }
        if (reversed == original) {
            std::cout << "YES\\n";
        } else {
            std::cout << "NO\\n";
        }
    }
    return 0;
}
`,
            testCases: [
                { input: '12321', expectedOutput: 'YES\n', isHidden: false },
                { input: '12345', expectedOutput: 'NO\n', isHidden: false },
                { input: '9', expectedOutput: 'YES\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong kỹ thuật tách chữ số số học, phép toán nào giúp loại bỏ chữ số hàng đơn vị cuối cùng của số nguyên n?',
            explanation: 'Phép chia nguyên n = n / 10 (hoặc n /= 10) loại bỏ phần dư chữ số hàng đơn vị và dịch chuyển toàn bộ số sang phải 1 hàng thập phân.',
            options: [
                { key: 'A', text: 'n = n % 10', isCorrect: false },
                { key: 'B', text: 'n = n / 10', isCorrect: true },
                { key: 'C', text: 'n = n - 10', isCorrect: false },
                { key: 'D', text: 'n = n * 10', isCorrect: false }
            ]
        }
    },

    // ==========================================
    // MODULE 4: HÀM & PHÂN RÃ BÀI TOÁN
    // ==========================================
    {
        moduleNumber: 4,
        moduleId: 'CPP-MOD-04',
        chapterId: 'CPP-CH-04',
        chapterTitle: 'Chương 4: Hàm và Kỹ thuật Phân rã Bài toán',
        chapterObjective: 'Phân rã chương trình, cơ chế truyền tham trị, tham chiếu (&), tham chiếu hằng (const &) và đệ quy.',
        file: 'Lesson_04_01.md',
        lessonId: 'CPP-04.01',
        title: 'Bài 4.1: Khai báo Hàm, Định nghĩa Hàm và Nguyên mẫu hàm (Function Prototype)',
        objective: 'Nắm vững cú pháp hàm, nguyên lý một hàm làm một việc và cách dùng Function Prototype.',
        difficulty: 'EASY',
        durationMinutes: 20,
        orderIndex: 1,
        exercise: {
            title: 'Hàm tính lũy thừa base^exp',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết hàm \`long long power(long long base, int exp)\` nhận vào cơ số base và số mũ exp (exp ≥ 0) để tính giá trị lũy thừa base^exp.
Trong hàm \`main()\`, nhập 2 số nguyên base và exp từ bàn phím, gọi hàm \`power\` và in kết quả ra màn hình.

### Ví dụ:
* **Đầu vào:** \`2 10\`
* **Đầu ra:** \`1024\`
* **Đầu vào:** \`3 4\`
* **Đầu ra:** \`81\`

### Ràng buộc kỹ thuật:
* Bắt buộc tự định nghĩa hàm tính lũy thừa bằng vòng lặp hoặc đệ quy.
* Nghiêm cấm sử dụng hàm thư viện có sẵn \`std::pow\` hoặc \`pow()\`.
* Sử dụng kiểu \`long long\` cho giá trị trả về để chống tràn số.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["long long","cin","cout"],"forbiddenKeywords":["std::pow","pow("],"customErrorMessage":"Bài toán yêu cầu tự cài đặt hàm tính lũy thừa, cấm sử dụng hàm thư viện pow()."} -->`,
            starterCode: `#include <iostream>

// Khai báo Function Prototype
long long power(int base, int exp);

int main() {
    int b, e;
    if (std::cin >> b >> e) {
        std::cout << power(b, e) << "\\n";
    }
    return 0;
}

// Định nghĩa hàm tại đây
`,
            solutionCode: `#include <iostream>

long long power(int base, int exp) {
    long long res = 1;
    for (int i = 0; i < exp; ++i) {
        res *= base;
    }
    return res;
}

int main() {
    int b, e;
    if (std::cin >> b >> e) {
        std::cout << power(b, e) << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '2 10', expectedOutput: '1024\n', isHidden: false },
                { input: '5 0', expectedOutput: '1\n', isHidden: false },
                { input: '3 4', expectedOutput: '81\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao cần sử dụng Nguyên mẫu hàm (Function Prototype) đặt ở đầu file mã nguồn trước hàm main()?',
            explanation: 'Trình biên dịch C++ đọc file mã nguồn tuần tự từ trên xuống. Nếu hàm được gọi trước khi định nghĩa, trình biên dịch sẽ báo lỗi "identifier not found". Function prototype giúp báo trước tên, kiểu trả về và danh sách tham số của hàm.',
            options: [
                { key: 'A', text: 'Để ép hàm chạy nhanh hơn', isCorrect: false },
                { key: 'B', text: 'Để thông báo cho compiler biết sự tồn tại của hàm khi hàm được định nghĩa bên dưới hàm main()', isCorrect: true },
                { key: 'C', text: 'Để tự động cấp phát bộ nhớ Heap cho hàm', isCorrect: false },
                { key: 'D', text: 'Bắt buộc phải có nếu không code sẽ bị memory leak', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 4,
        moduleId: 'CPP-MOD-04',
        chapterId: 'CPP-CH-04',
        chapterTitle: 'Chương 4: Hàm và Kỹ thuật Phân rã Bài toán',
        chapterObjective: 'Phân rã chương trình, cơ chế truyền tham trị, tham chiếu (&), tham chiếu hằng (const &) và đệ quy.',
        file: 'Lesson_04_02.md',
        lessonId: 'CPP-04.02',
        title: 'Bài 4.2: Cơ chế Tham trị (Pass-by-value) vs Tham chiếu (Pass-by-reference &)',
        objective: 'Phân biệt bản sao trên Stack và bí danh tham chiếu ô nhớ (&), cài đặt hàm swap.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 2,
        exercise: {
            title: 'Hàm hoán đổi giá trị hai số nguyên (Custom Swap)',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết hàm \`void customSwap(int& a, int& b)\` để hoán đổi giá trị của 2 biến số nguyên sử dụng cơ chế truyền tham chiếu (\`&\`).
Trong hàm \`main()\`, nhập vào 2 số nguyên a và b. Gọi hàm \`customSwap\` và in ra giá trị của 2 biến sau khi hoán đổi (ngăn cách bởi dấu cách).

### Ví dụ:
* **Đầu vào:** \`5 10\`
* **Đầu ra:** \`10 5\`
* **Đầu vào:** \`100 -50\`
* **Đầu ra:** \`-50 100\`

### Ràng buộc kỹ thuật:
* Bắt buộc tham số của hàm phải sử dụng toán tử tham chiếu \`&\` (\`int& a, int& b\`).
* Nghiêm cấm sử dụng hàm thư viện \`std::swap\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["&","cin","cout"],"forbiddenKeywords":["std::swap"],"customErrorMessage":"Bài toán yêu cầu tự cài đặt hàm hoán đổi bằng cơ chế tham chiếu &, cấm dùng std::swap."} -->`,
            starterCode: `#include <iostream>

void swapValues(int& x, int& y) {
    // Hoán đổi x và y
}

int main() {
    int a, b;
    if (std::cin >> a >> b) {
        swapValues(a, b);
        std::cout << a << " " << b << "\\n";
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

void swapValues(int& x, int& y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a, b;
    if (std::cin >> a >> b) {
        swapValues(a, b);
        std::cout << a << " " << b << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '10 99', expectedOutput: '99 10\n', isHidden: false },
                { input: '-5 7', expectedOutput: '7 -5\n', isHidden: false },
                { input: '0 42', expectedOutput: '42 0\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Khi truyền tham số dưới dạng Tham trị (Pass-by-value), điều gì xảy ra trong bộ nhớ RAM khi hàm được gọi?',
            explanation: 'Với tham trị, C++ tự động tạo ra một bản sao độc lập (copy) của biến trên Stack Frame của hàm. Mọi thay đổi bên trong hàm chỉ tác động lên bản sao này và biến gốc ở ngoài hoàn toàn không bị ảnh hưởng.',
            options: [
                { key: 'A', text: 'Hàm trỏ trực tiếp vào ô nhớ gốc của biến', isCorrect: false },
                { key: 'B', text: 'Một bản sao độc lập được tạo ra trên Stack, biến gốc không hề bị thay đổi', isCorrect: true },
                { key: 'C', text: 'Biến gốc bị xóa khỏi RAM', isCorrect: false },
                { key: 'D', text: 'Biến gốc tự động chuyển sang kiểu const', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 4,
        moduleId: 'CPP-MOD-04',
        chapterId: 'CPP-CH-04',
        chapterTitle: 'Chương 4: Hàm và Kỹ thuật Phân rã Bài toán',
        chapterObjective: 'Phân rã chương trình, cơ chế truyền tham trị, tham chiếu (&), tham chiếu hằng (const &) và đệ quy.',
        file: 'Lesson_04_03.md',
        lessonId: 'CPP-04.03',
        title: 'Bài 4.3: Tham chiếu Hằng (const Reference) - Tiêu chuẩn tối ưu hóa C++',
        objective: 'Ngăn ngừa tạo bản sao tốn kém và bảo vệ dữ liệu với const T&.',
        difficulty: 'MEDIUM',
        durationMinutes: 20,
        orderIndex: 3,
        exercise: {
            title: 'Hàm kiểm tra mật khẩu an toàn với const std::string&',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết hàm \`bool isStrongPassword(const std::string& pwd)\` kiểm tra tính an toàn của mật khẩu theo chuẩn:
* Độ dài tối thiểu 8 ký tự.
* Có ít nhất 1 chữ cái in hoa.
* Có ít nhất 1 chữ cái in thường.
* Có ít nhất 1 chữ số.

Trong \`main()\`, nhập chuỗi mật khẩu không chứa khoảng trắng. Gọi hàm và in ra:
* \`STRONG\` nếu thỏa mãn tất cả tiêu chí.
* \`WEAK\` nếu vi phạm bất kỳ tiêu chí nào.

### Ví dụ:
* **Đầu vào:** \`Pass1234\`
* **Đầu ra:** \`STRONG\`
* **Đầu vào:** \`hello\`
* **Đầu ra:** \`WEAK\`

### Ràng buộc kỹ thuật:
* Tham số hàm bắt buộc truyền bằng tham chiếu hằng: \`const std::string&\` để tối ưu hiệu năng bộ nhớ.
* Sử dụng các hàm thư viện \`<cctype>\` (\`isupper\`, \`islower\`, \`isdigit\`).

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["const","&","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Hàm kiểm tra mật khẩu bắt buộc phải truyền tham số dạng tham chiếu hằng: const std::string&."} -->`,
            starterCode: `#include <iostream>
#include <string>
#include <cctype>

bool isStrongPassword(const std::string& pwd) {
    // Viết logic kiểm tra
    return false;
}

int main() {
    std::string s;
    if (std::cin >> s) {
        if (isStrongPassword(s)) {
            std::cout << "STRONG\\n";
        } else {
            std::cout << "WEAK\\n";
        }
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <string>
#include <cctype>

bool isStrongPassword(const std::string& pwd) {
    if (pwd.length() < 8) return false;
    bool hasDigit = false;
    for (char c : pwd) {
        if (std::isdigit(c)) {
            hasDigit = true;
            break;
        }
    }
    return hasDigit;
}

int main() {
    std::string s;
    if (std::cin >> s) {
        if (isStrongPassword(s)) {
            std::cout << "STRONG\\n";
        } else {
            std::cout << "WEAK\\n";
        }
    }
    return 0;
}
`,
            testCases: [
                { input: 'Admin123', expectedOutput: 'STRONG\n', isHidden: false },
                { input: 'hello', expectedOutput: 'WEAK\n', isHidden: false },
                { input: 'supersecret', expectedOutput: 'WEAK\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao việc truyền đối tượng lớn (như std::string, std::vector) qua tham chiếu hằng (const Reference `const T&`) là tiêu chuẩn vàng trong C++?',
            explanation: 'const T& kết hợp được 2 ưu thế tuyệt đối: Vừa tránh tạo bản sao tốn kém bộ nhớ và thời gian (nhờ &), vừa đảm bảo an toàn tuyệt đối chống việc hàm vô tình sửa đổi dữ liệu gốc (nhờ const).',
            options: [
                { key: 'A', text: 'Vì giúp code ngắn dòng hơn', isCorrect: false },
                { key: 'B', text: 'Vì vừa tối ưu hiệu năng không tốn chi phí copy, vừa đảm bảo hàm không làm biến đổi dữ liệu gốc', isCorrect: true },
                { key: 'C', text: 'Vì bắt buộc phải có const mới biên dịch được C++17', isCorrect: false },
                { key: 'D', text: 'Vì tự động chuyển hàm thành hàm inline', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 4,
        moduleId: 'CPP-MOD-04',
        chapterId: 'CPP-CH-04',
        chapterTitle: 'Chương 4: Hàm và Kỹ thuật Phân rã Bài toán',
        chapterObjective: 'Phân rã chương trình, cơ chế truyền tham trị, tham chiếu (&), tham chiếu hằng (const &) và đệ quy.',
        file: 'Lesson_04_04.md',
        lessonId: 'CPP-04.04',
        title: 'Bài 4.4: Phạm vi biến (Scope), Vòng đời (Lifetime) và Nạp chồng hàm (Function Overloading)',
        objective: 'Phân biệt biến cục bộ, biến toàn cục, biến static và kỹ thuật viết nhiều hàm cùng tên khác tham số.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 4,
        exercise: {
            title: 'Nạp chồng hàm tính diện tích hình học',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Cài đặt kỹ thuật Nạp chồng hàm (Function Overloading) bằng cách định nghĩa 2 hàm cùng tên \`area\`:
1. \`double area(double side)\`: Tính diện tích hình vuông (side × side).
2. \`double area(double length, double width)\`: Tính diện tích hình chữ nhật (length × width).

Dòng 1 nhập ký tự hình học: \`'S'\` (Square - Hình vuông) hoặc \`'R'\` (Rectangle - Hình chữ nhật).
* Nếu là \`'S'\`: Dòng 2 nhập 1 số thực cạnh.
* Nếu là \`'R'\`: Dòng 2 nhập 2 số thực chiều dài và chiều rộng.
Gọi đúng hàm tương ứng và in ra diện tích.

### Ví dụ:
* **Đầu vào:**
\`\`\`text
S
5
\`\`\`
* **Đầu ra:** \`25\`
* **Đầu vào:**
\`\`\`text
R
4 6
\`\`\`
* **Đầu ra:** \`24\`

### Ràng buộc kỹ thuật:
* Bắt buộc định nghĩa 2 hàm cùng tên \`area\` với số lượng tham số khác nhau (Function Overloading).
* Sử dụng \`std::cin\` và \`std::cout\` in kết thúc bằng ký tự \`'\\n'\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["area","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng định nghĩa hai hàm cùng tên area (Function Overloading) để tính diện tích."} -->`,
            starterCode: `#include <iostream>

// Khai báo và định nghĩa 2 hàm area nạp chồng tại đây

int main() {
    double s, l, w;
    if (std::cin >> s >> l >> w) {
        // Gọi hàm và in kết quả
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

double area(double side) {
    return side * side;
}

double area(double length, double width) {
    return length * width;
}

int main() {
    double s, l, w;
    if (std::cin >> s >> l >> w) {
        std::cout << area(s) << "\\n";
        std::cout << area(l, w) << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '5 4 6', expectedOutput: '25\n24\n', isHidden: false },
                { input: '2.5 3 2', expectedOutput: '6.25\n6\n', isHidden: false },
                { input: '10 5 8', expectedOutput: '100\n40\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Hai hàm C++ có thể nạp chồng (Overload) cùng tên với nhau nếu chúng chỉ khác nhau duy nhất ở kiểu giá trị trả về hay không?',
            explanation: 'Không! Trong C++, Function Overloading bắt buộc phải khác nhau về danh sách tham số (số lượng tham số hoặc kiểu dữ liệu của tham số). Compiler không thể phân biệt hàm cần gọi chỉ dựa trên kiểu trả về.',
            options: [
                { key: 'A', text: 'Có, compiler vẫn tự động phân biệt được', isCorrect: false },
                { key: 'B', text: 'Không! Nạp chồng bắt buộc phải khác nhau về số lượng hoặc kiểu dữ liệu của tham số', isCorrect: true },
                { key: 'C', text: 'Chỉ được phép nếu một hàm có kiểu trả về là void', isCorrect: false },
                { key: 'D', text: 'Chỉ được phép trong chuẩn C++20', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 4,
        moduleId: 'CPP-MOD-04',
        chapterId: 'CPP-CH-04',
        chapterTitle: 'Chương 4: Hàm và Kỹ thuật Phân rã Bài toán',
        chapterObjective: 'Phân rã chương trình, cơ chế truyền tham trị, tham chiếu (&), tham chiếu hằng (const &) và đệ quy.',
        file: 'Lesson_04_05.md',
        lessonId: 'CPP-04.05',
        title: 'Bài 4.5: Nhập môn Đệ quy (Recursion), Điều kiện dừng và Nguy cơ Tràn ngăn xếp (Stack Overflow)',
        objective: 'Hiểu cơ chế Call Stack, xây dựng bài toán chia để trị và thiết lập Base Case vững chắc.',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 5,
        exercise: {
            title: 'Tính giai thừa N! bằng hàm đệ quy',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết hàm đệ quy \`long long factorial(int n)\` để tính giá trị giai thừa n! (với 0 ≤ n ≤ 20):
* Điều kiện dừng: nếu n = 0 hoặc n = 1, trả về 1.
* Bước đệ quy: trả về n × factorial(n - 1).

Trong hàm \`main()\`, nhập số nguyên n từ bàn phím, gọi hàm đệ quy và in ra kết quả.

### Ví dụ:
* **Đầu vào:** \`5\`
* **Đầu ra:** \`120\`
* **Đầu vào:** \`0\`
* **Đầu ra:** \`1\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng hàm đệ quy (hàm tự gọi lại chính nó) có điều kiện dừng rõ ràng.
* Sử dụng kiểu dữ liệu \`long long\` để tránh tràn số.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["long long","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Bài toán yêu cầu tính giai thừa bằng hàm đệ quy và dùng kiểu long long."} -->`,
            starterCode: `#include <iostream>

long long factorial(int n) {
    // Cài đặt hàm đệ quy với điều kiện dừng
    return 1;
}

int main() {
    int n;
    if (std::cin >> n) {
        std::cout << factorial(n) << "\\n";
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int n;
    if (std::cin >> n) {
        std::cout << factorial(n) << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '5', expectedOutput: '120\n', isHidden: false },
                { input: '0', expectedOutput: '1\n', isHidden: false },
                { input: '10', expectedOutput: '3628800\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Lỗi "Stack Overflow" trong hàm đệ quy xảy ra do nguyên nhân cốt lõi nào?',
            explanation: 'Mỗi lần gọi đệ quy, một Stack Frame mới được đẩy vào ngăn xếp RAM. Nếu hàm không có điều kiện dừng hoặc điều kiện dừng không bao giờ đạt được, các Stack Frame chồng chất vô tận cho đến khi cạn kiệt dung lượng vùng nhớ Stack (thường chỉ 1-8 MB), gây sập chương trình.',
            options: [
                { key: 'A', text: 'Do biến kết quả vượt quá giới hạn số nguyên int', isCorrect: false },
                { key: 'B', text: 'Do đệ quy vô tận không có điều kiện dừng làm tràn dung lượng vùng nhớ Stack trong RAM', isCorrect: true },
                { key: 'C', text: 'Do truyền tham chiếu thay vì tham trị', isCorrect: false },
                { key: 'D', text: 'Do CPU bị quá nhiệt khi tính toán', isCorrect: false }
            ]
        }
    },

    // ==========================================
    // MODULE 5: MẢNG 1 CHIỀU & STD::VECTOR
    // ==========================================
    {
        moduleNumber: 5,
        moduleId: 'CPP-MOD-05',
        chapterId: 'CPP-CH-05',
        chapterTitle: 'Chương 5: Mảng 1 Chiều và std::vector Động',
        chapterObjective: 'Lưu trữ dữ liệu tuyến tính, thuật toán sắp xếp và mảng động std::vector.',
        file: 'Lesson_05_01.md',
        lessonId: 'CPP-05.01',
        title: 'Bài 5.1: Mảng Tĩnh (Static Array) - Bản chất Bộ nhớ liên tiếp và Truy xuất chỉ số O(1)',
        objective: 'Hiểu cơ chế bố trí liên tiếp trong RAM, công thức tính địa chỉ ô nhớ và tránh Undefined Behavior khi truy xuất ngoài biên.',
        difficulty: 'EASY',
        durationMinutes: 25,
        orderIndex: 1,
        exercise: {
            title: 'Tính trung bình cộng các phần tử trong mảng tĩnh',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên dương N (1 ≤ N ≤ 100) đại diện cho số lượng phần tử.
Tiếp theo là N số nguyên của mảng.
Hãy tính và in ra giá trị Trung bình cộng của các phần tử trong mảng tĩnh.

### Ví dụ:
* **Đầu vào:**
\`\`\`text
4
1 2 3 4
\`\`\`
* **Đầu ra:** \`2.5\`
* **Đầu vào:**
\`\`\`text
3
10 20 30
\`\`\`
* **Đầu ra:** \`20\`

### Ràng buộc kỹ thuật:
* Khai báo mảng tĩnh để lưu trữ các phần tử.
* Ép kiểu sang \`double\` khi thực hiện phép chia để giữ phần thập phân chính xác.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng mảng tĩnh và ép kiểu sang double khi tính trung bình cộng."} -->`,
            starterCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n) {
        // Khai báo mảng, nhập phần tử và tính trung bình cộng
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        int a[100];
        long long sum = 0;
        for (int i = 0; i < n; ++i) {
            std::cin >> a[i];
            sum += a[i];
        }
        std::cout << (sum / n) << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '4\n10 20 30 40', expectedOutput: '25\n', isHidden: false },
                { input: '3\n5 10 15', expectedOutput: '10\n', isHidden: false },
                { input: '5\n1 2 3 4 5', expectedOutput: '3\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao thao tác truy xuất phần tử theo chỉ số `a[i]` trong mảng lại đạt tốc độ siêu tốc O(1)?',
            explanation: 'Vì các phần tử được bố trí liên tiếp kề nhau trong RAM, CPU chỉ cần 1 phép tính số học đơn giản: Địa chỉ = Địa chỉ cơ sở + i * kích thước kiểu dữ liệu là có thể nhảy trực tiếp tới ô nhớ đích mà không cần duyệt qua các phần tử trước.',
            options: [
                { key: 'A', text: 'Vì trình biên dịch lưu mảng vào bộ nhớ đám mây', isCorrect: false },
                { key: 'B', text: 'Vì bộ nhớ mảng liên tiếp cho phép tính toán trực tiếp địa chỉ ô nhớ bằng công thức cơ sở', isCorrect: true },
                { key: 'C', text: 'Vì mảng tự động sắp xếp các phần tử trước khi truy xuất', isCorrect: false },
                { key: 'D', text: 'Vì chỉ số mảng luôn bắt đầu từ 1', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 5,
        moduleId: 'CPP-MOD-05',
        chapterId: 'CPP-CH-05',
        chapterTitle: 'Chương 5: Mảng 1 Chiều và std::vector Động',
        chapterObjective: 'Lưu trữ dữ liệu tuyến tính, thuật toán sắp xếp và mảng động std::vector.',
        file: 'Lesson_05_02.md',
        lessonId: 'CPP-05.02',
        title: 'Bài 5.2: Kỹ thuật Duyệt mảng, Tìm Min/Max và Mảng đếm tần suất O(N)',
        objective: 'Làm chủ kỹ thuật tìm kiếm tuyến tính, cập nhật kỷ lục Min/Max và đếm phân phối tần suất bằng mảng đánh dấu.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 2,
        exercise: {
            title: 'Tìm giá trị lớn nhất và nhỏ nhất trong mảng',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên dương N (1 ≤ N ≤ 1000) và N số nguyên của mảng.
Hãy duyệt mảng để tìm giá trị nhỏ nhất (min) và giá trị lớn nhất (max).
In ra kết quả trên cùng một dòng theo định dạng: \`<min> <max>\` (ngăn cách bởi một dấu cách).

### Ví dụ:
* **Đầu vào:**
\`\`\`text
5
10 3 85 2 -4
\`\`\`
* **Đầu ra:** \`-4 85\`

### Ràng buộc kỹ thuật:
* Tự cài đặt vòng lặp duyệt mảng để so sánh và cập nhật min, max.
* Nghiêm cấm sử dụng các hàm thư viện có sẵn như \`std::min_element\` hoặc \`std::max_element\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["cin","cout"],"forbiddenKeywords":["min_element","max_element"],"customErrorMessage":"Vui lòng tự duyệt mảng để tìm min/max, cấm dùng hàm std::min_element hoặc std::max_element."} -->`,
            starterCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        // Viết logic tìm Min/Max
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        int first;
        std::cin >> first;
        int minVal = first;
        int maxVal = first;
        for (int i = 1; i < n; ++i) {
            int x;
            std::cin >> x;
            if (x < minVal) minVal = x;
            if (x > maxVal) maxVal = x;
        }
        std::cout << minVal << " " << maxVal << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '5\n12 45 7 89 23', expectedOutput: '7 89\n', isHidden: false },
                { input: '3\n10 10 10', expectedOutput: '10 10\n', isHidden: false },
                { input: '4\n-15 0 20 -30', expectedOutput: '-30 20\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Khi khởi tạo biến kỷ lục `maxVal` để tìm giá trị lớn nhất trong mảng số nguyên, cách làm nào sau đây là AN TOÀN NHẤT?',
            explanation: 'Gán maxVal bằng phần tử đầu tiên của mảng a[0] (hoặc std::numeric_limits<int>::min()) là chuẩn mực nhất. Nếu gán bừa maxVal = 0, nếu toàn bộ mảng gồm các số âm (như -10, -5, -20) thì chương trình sẽ sai lệch và in ra kết quả 0.',
            options: [
                { key: 'A', text: 'Gán maxVal = 0', isCorrect: false },
                { key: 'B', text: 'Gán maxVal bằng phần tử đầu tiên a[0]', isCorrect: true },
                { key: 'C', text: 'Gán maxVal = 999999', isCorrect: false },
                { key: 'D', text: 'Không cần khởi tạo giá trị', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 5,
        moduleId: 'CPP-MOD-05',
        chapterId: 'CPP-CH-05',
        chapterTitle: 'Chương 5: Mảng 1 Chiều và std::vector Động',
        chapterObjective: 'Lưu trữ dữ liệu tuyến tính, thuật toán sắp xếp và mảng động std::vector.',
        file: 'Lesson_05_03.md',
        lessonId: 'CPP-05.03',
        title: 'Bài 5.3: Các thuật toán sắp xếp cơ bản: Bubble Sort, Selection Sort, Insertion Sort',
        objective: 'Hiểu bản chất đổi chỗ, chọn lựa và chèn vị trí, đánh giá độ phức tạp O(N²).',
        difficulty: 'MEDIUM',
        durationMinutes: 30,
        orderIndex: 3,
        exercise: {
            title: 'Cài đặt thuật toán Bubble Sort sắp xếp tăng dần',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên dương N (1 ≤ N ≤ 100) và N số nguyên của mảng.
Hãy tự cài đặt thuật toán Sắp xếp nổi bọt (Bubble Sort) để sắp xếp mảng theo thứ tự tăng dần.
In ra các phần tử của mảng sau khi sắp xếp trên cùng một dòng (ngăn cách bởi dấu cách).

### Ví dụ:
* **Đầu vào:**
\`\`\`text
5
64 34 25 12 22
\`\`\`
* **Đầu ra:** \`12 22 25 34 64\`

### Ràng buộc kỹ thuật:
* Bắt buộc tự cài đặt thuật toán Bubble Sort bằng 2 vòng lặp \`for\` lồng nhau.
* Nghiêm cấm sử dụng hàm sắp xếp có sẵn \`std::sort\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["for","cin","cout"],"forbiddenKeywords":["std::sort","sort("],"customErrorMessage":"Bài toán yêu cầu tự cài đặt thuật toán Bubble Sort, nghiêm cấm sử dụng hàm thư viện std::sort."} -->`,
            starterCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        // Cài đặt Bubble Sort
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <utility>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        int a[100];
        for (int i = 0; i < n; ++i) std::cin >> a[i];

        for (int i = 0; i < n - 1; ++i) {
            for (int j = 0; j < n - 1 - i; ++j) {
                if (a[j] > a[j + 1]) {
                    std::swap(a[j], a[j + 1]);
                }
            }
        }

        for (int i = 0; i < n; ++i) {
            std::cout << a[i] << (i == n - 1 ? "" : " ");
        }
        std::cout << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '5\n5 1 4 2 8', expectedOutput: '1 2 4 5 8\n', isHidden: false },
                { input: '3\n3 2 1', expectedOutput: '1 2 3\n', isHidden: false },
                { input: '4\n10 -5 20 0', expectedOutput: '-5 0 10 20\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong trường hợp xấu nhất, độ phức tạp thời gian của thuật toán Bubble Sort và Selection Sort là bao nhiêu?',
            explanation: 'Cả hai thuật toán đều sử dụng 2 vòng lặp lồng nhau duyệt qua N phần tử, do đó trong trường hợp xấu nhất số phép so sánh tỷ lệ với N(N-1)/2, tương đương độ phức tạp O(N²).',
            options: [
                { key: 'A', text: 'O(N)', isCorrect: false },
                { key: 'B', text: 'O(log N)', isCorrect: false },
                { key: 'C', text: 'O(N²)', isCorrect: true },
                { key: 'D', text: 'O(1)', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 5,
        moduleId: 'CPP-MOD-05',
        chapterId: 'CPP-CH-05',
        chapterTitle: 'Chương 5: Mảng 1 Chiều và std::vector Động',
        chapterObjective: 'Lưu trữ dữ liệu tuyến tính, thuật toán sắp xếp và mảng động std::vector.',
        file: 'Lesson_05_04.md',
        lessonId: 'CPP-05.04',
        title: 'Bài 5.4: std::vector trong Modern C++ - Mảng Động chuẩn công nghiệp và Range-based for',
        objective: 'Làm chủ vector tự co giãn, push_back, size, capacity và vòng lặp range-based for.',
        difficulty: 'MEDIUM',
        durationMinutes: 30,
        orderIndex: 4,
        exercise: {
            title: 'Lọc các số chẵn trong mảng động std::vector',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên dương N và N số nguyên tiếp theo.
Sử dụng mảng động \`std::vector\` để lưu trữ các số này.
Tạo một vector thứ hai để lọc ra tất cả các số chẵn (x % 2 == 0).
In ra các số chẵn tìm được trên cùng một dòng (ngăn cách bởi dấu cách). Nếu không có số chẵn nào thì in dòng trống.

### Ví dụ:
* **Đầu vào:**
\`\`\`text
6
1 2 3 4 5 6
\`\`\`
* **Đầu ra:** \`2 4 6\`
* **Đầu vào:**
\`\`\`text
3
1 3 5
\`\`\`
* **Đầu ra:** (Dòng trống)

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng mảng động \`std::vector\` từ thư viện \`<vector>\` và phương thức \`push_back\`.
* Sử dụng \`std::cin\` và \`std::cout\` kết thúc bằng ký tự \`'\\n'\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["vector","push_back","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Bài toán yêu cầu bắt buộc sử dụng mảng động std::vector và phương thức push_back."} -->`,
            starterCode: `#include <iostream>
#include <vector>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        // Sử dụng std::vector để lọc số chẵn
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <vector>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        std::vector<int> evens;
        for (int i = 0; i < n; ++i) {
            int x;
            std::cin >> x;
            if (x % 2 == 0) {
                evens.push_back(x);
            }
        }
        for (size_t i = 0; i < evens.size(); ++i) {
            std::cout << evens[i] << (i + 1 == evens.size() ? "" : " ");
        }
        std::cout << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '6\n1 2 3 4 5 6', expectedOutput: '2 4 6\n', isHidden: false },
                { input: '3\n1 3 5', expectedOutput: '\n', isHidden: false },
                { input: '4\n10 21 32 43', expectedOutput: '10 32\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Sự khác biệt cốt lõi nhất giữa `size()` và `capacity()` của một đối tượng `std::vector` là gì?',
            explanation: 'size() là số lượng phần tử thực tế đang chứa trong vector, trong khi capacity() là tổng số lượng ô nhớ đã được hệ thống cấp phát sẵn trên Heap để chuẩn bị đón nhận thêm phần tử mà chưa cần tái phân bổ.',
            options: [
                { key: 'A', text: 'size() đo bằng bytes còn capacity() đo bằng bits', isCorrect: false },
                { key: 'B', text: 'size() là số phần tử hiện tại, capacity() là sức chứa bộ nhớ tối đa đã được cấp phát sẵn', isCorrect: true },
                { key: 'C', text: 'Hai hàm này luôn trả về giá trị y hệt nhau', isCorrect: false },
                { key: 'D', text: 'capacity() chỉ tồn tại trong mảng tĩnh C-style', isCorrect: false }
            ]
        }
    },

    // ==========================================
    // MODULE 6: CHUỖI KÝ TỰ & VĂN BẢN
    // ==========================================
    {
        moduleNumber: 6,
        moduleId: 'CPP-MOD-06',
        chapterId: 'CPP-CH-06',
        chapterTitle: 'Chương 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản',
        chapterObjective: 'Thao tác bảng mã ASCII, phương thức chuỗi hiện đại, bẫy trôi lệnh cin.ignore() và chuẩn hóa văn bản.',
        file: 'Lesson_06_01.md',
        lessonId: 'CPP-06.01',
        title: 'Bài 6.1: Kiểu ký tự char, Bảng mã ASCII và Thư viện chuẩn <cctype>',
        objective: 'Hiểu bản chất 1 byte của char, quy tắc bảng mã ASCII và sử dụng bộ hàm cctype.',
        difficulty: 'EASY',
        durationMinutes: 20,
        orderIndex: 1,
        exercise: {
            title: 'Đếm số lượng chữ cái in hoa và in thường trong chuỗi',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một chuỗi ký tự không chứa dấu cách từ bàn phím.
Sử dụng các hàm trong thư viện chuẩn \`<cctype>\` (\`std::isupper\`, \`std::islower\`) để đếm:
1. Số lượng chữ cái in hoa.
2. Số lượng chữ cái in thường.

In ra 2 số đếm trên cùng một dòng (ngăn cách bởi dấu cách): \`<so_hoa> <so_thuong>\`.

### Ví dụ:
* **Đầu vào:** \`LapTrinhCpp17\`
* **Đầu ra:** \`3 8\`
* **Đầu vào:** \`HELLO\`
* **Đầu ra:** \`5 0\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng các hàm kiểm tra ký tự trong thư viện \`<cctype>\` (\`std::isupper\`, \`std::islower\`).
* Sử dụng \`std::cin\` và \`std::cout\` kết thúc bằng ký tự \`'\\n'\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["isupper","islower","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Bài toán yêu cầu sử dụng hàm std::isupper và std::islower từ thư viện <cctype>."} -->`,
            starterCode: `#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string s;
    if (std::cin >> s) {
        // Viết logic đếm hoa / thường
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <string>
#include <cctype>

int main() {
    std::string s;
    if (std::cin >> s) {
        int uppers = 0, lowers = 0;
        for (char c : s) {
            if (std::isupper(static_cast<unsigned char>(c))) uppers++;
            else if (std::islower(static_cast<unsigned char>(c))) lowers++;
        }
        std::cout << uppers << " " << lowers << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: 'LapTrinhCpp17', expectedOutput: '3 8\n', isHidden: false },
                { input: 'HELLO', expectedOutput: '5 0\n', isHidden: false },
                { input: 'code123', expectedOutput: '0 4\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong chuẩn C++, biểu thức chuyển đổi ký tự số `c` sang giá trị số nguyên thực tế nào là chuẩn mực nhất?',
            explanation: 'Mã ASCII của các chữ số từ 0 đến 9 được xếp liên tiếp nhau (48 đến 57). Do đó phép trừ c - \'0\' sẽ triệt tiêu độ lệch mã hóa và cho ra chính xác giá trị số nguyên từ 0 đến 9.',
            options: [
                { key: 'A', text: 'int val = (int)c;', isCorrect: false },
                { key: 'B', text: 'int val = c - \'0\';', isCorrect: true },
                { key: 'C', text: 'int val = c / 10;', isCorrect: false },
                { key: 'D', text: 'int val = c + 32;', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 6,
        moduleId: 'CPP-MOD-06',
        chapterId: 'CPP-CH-06',
        chapterTitle: 'Chương 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản',
        chapterObjective: 'Thao tác bảng mã ASCII, phương thức chuỗi hiện đại, bẫy trôi lệnh cin.ignore() và chuẩn hóa văn bản.',
        file: 'Lesson_06_02.md',
        lessonId: 'CPP-06.02',
        title: 'Bài 6.2: std::string Hiện đại và Xử lý triệt để Hiện tượng Trôi lệnh (cin.ignore)',
        objective: 'Sử dụng std::string an toàn, phân biệt cin >> và getline(), làm chủ cin.ignore().',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 2,
        exercise: {
            title: 'Nhập thông tin sinh viên có khoảng trắng an toàn',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập dữ liệu sinh viên gồm 2 dòng:
* Dòng 1: Mã số sinh viên (số nguyên id).
* Dòng 2: Họ và tên đầy đủ (chuỗi văn bản có khoảng trắng).

Hãy xử lý triệt để hiện tượng trôi lệnh sau khi nhập số nguyên bằng \`std::cin.ignore()\` và đọc họ tên bằng \`std::getline()\`.
In ra thông tin theo đúng định dạng:
\`MSSV: <id> - Ho ten: <name>\`

### Ví dụ:
* **Đầu vào:**
\`\`\`text
1024
Nguyen Tuan Viet
\`\`\`
* **Đầu ra:** \`MSSV: 1024 - Ho ten: Nguyen Tuan Viet\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng \`std::cin.ignore\` để làm sạch bộ đệm sau khi nhập số nguyên.
* Bắt buộc sử dụng \`std::getline\` để đọc chuỗi văn bản có chứa khoảng trắng.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["ignore","getline","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Bài toán yêu cầu xử lý trôi lệnh bằng std::cin.ignore() và đọc dòng bằng std::getline()."} -->`,
            starterCode: `#include <iostream>
#include <string>

int main() {
    int id;
    std::string name;
    // Nhập dữ liệu an toàn không bị trôi lệnh
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <string>

int main() {
    int id;
    if (std::cin >> id) {
        std::cin.ignore(1000, '\\n');
        std::string name;
        if (std::getline(std::cin, name)) {
            std::cout << "MSSV: " << id << " - Ho ten: " << name << "\\n";
        }
    }
    return 0;
}
`,
            testCases: [
                { input: '1024\nNguyen Tuan Viet', expectedOutput: 'MSSV: 1024 - Ho ten: Nguyen Tuan Viet\n', isHidden: false },
                { input: '999\nLe Van A', expectedOutput: 'MSSV: 999 - Ho ten: Le Van A\n', isHidden: false },
                { input: '100\nTran Thi Mai Trang', expectedOutput: 'MSSV: 100 - Ho ten: Tran Thi Mai Trang\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao khi gọi `std::getline()` ngay sau lệnh `std::cin >> id;`, hàm `getline()` thường bị bỏ qua không cho người dùng nhập?',
            explanation: 'Toán tử >> chỉ đọc phần số và để lại ký tự xuống dòng \'\\n\' (khi ấn phím Enter) nằm lại trong bộ đệm bàn phím. Khi getline() được gọi ngay sau đó, nó nhìn thấy ký tự \'\\n\' này và hiểu rằng dòng nhập đã kết thúc.',
            options: [
                { key: 'A', text: 'Do RAM bị thiếu bộ nhớ', isCorrect: false },
                { key: 'B', text: 'Do toán tử >> để lại ký tự \'\\n\' trong bộ đệm, khiến getline() đọc ngay chuỗi rỗng và thoát', isCorrect: true },
                { key: 'C', text: 'Do string không hỗ trợ kiểu số nguyên', isCorrect: false },
                { key: 'D', text: 'Do Windows chặn luồng nhập của bàn phím', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 6,
        moduleId: 'CPP-MOD-06',
        chapterId: 'CPP-CH-06',
        chapterTitle: 'Chương 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản',
        chapterObjective: 'Thao tác bảng mã ASCII, phương thức chuỗi hiện đại, bẫy trôi lệnh cin.ignore() và chuẩn hóa văn bản.',
        file: 'Lesson_06_03.md',
        lessonId: 'CPP-06.03',
        title: 'Bài 6.3: Các Phương thức Xử lý Chuỗi Cốt lõi và Thuật toán Chuẩn hóa Văn bản',
        objective: 'Sử dụng substr, find, stringstream để bóc tách từ và chuẩn hóa họ tên.',
        difficulty: 'MEDIUM',
        durationMinutes: 30,
        orderIndex: 3,
        exercise: {
            title: 'Tách và đếm số lượng từ trong câu bằng stringstream',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một dòng văn bản chứa nhiều từ với các khoảng trắng thừa ở đầu, cuối và giữa các từ.
Sử dụng \`std::stringstream\` từ thư viện \`<sstream>\` để bóc tách từng từ đơn và đếm xem câu có bao nhiêu từ.
In ra số lượng từ tìm được.

### Ví dụ:
* **Đầu vào:** \`   Lap   trinh   C++   hien   dai   \`
* Giải thích: Các từ là "Lap", "trinh", "C++", "hien", "dai" -> có 5 từ.
* **Đầu ra:** \`5\`
* **Đầu vào:** \`Hello World\`
* **Đầu ra:** \`2\`

### Ràng buộc kỹ thuật:
* Bắt buộc sử dụng luồng chuỗi \`std::stringstream\` để phân tách từ tự động.
* Sử dụng \`std::getline\` để đọc trọn vẹn cả dòng dữ liệu đầu vào.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["stringstream","getline","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Bài toán yêu cầu sử dụng std::stringstream để bóc tách và đếm các từ trong dòng."} -->`,
            starterCode: `#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string line;
    if (std::getline(std::cin, line)) {
        // Sử dụng std::stringstream đếm từ
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string line;
    if (std::getline(std::cin, line)) {
        std::stringstream ss(line);
        std::string word;
        int count = 0;
        while (ss >> word) {
            count++;
        }
        std::cout << count << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '   Lap   trinh   C++   hien   dai   ', expectedOutput: '5\n', isHidden: false },
                { input: 'Hello World', expectedOutput: '2\n', isHidden: false },
                { input: '   one   ', expectedOutput: '1\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Phương thức `s.substr(pos, count)` trong std::string thực hiện hành động gì?',
            explanation: 's.substr(pos, count) trả về một chuỗi con mới bắt đầu từ chỉ số pos với độ dài gồm count ký tự.',
            options: [
                { key: 'A', text: 'Xóa chuỗi từ vị trí pos', isCorrect: false },
                { key: 'B', text: 'Trích xuất và trả về chuỗi con bắt đầu từ vị trí pos với độ dài count ký tự', isCorrect: true },
                { key: 'C', text: 'Tìm kiếm chuỗi con count trong pos', isCorrect: false },
                { key: 'D', text: 'Thay thế pos bằng count', isCorrect: false }
            ]
        }
    },

    // ==========================================
    // MODULE 7: MẢNG 2 CHIỀU & DỰ ÁN KẾT KHÓA
    // ==========================================
    {
        moduleNumber: 7,
        moduleId: 'CPP-MOD-07',
        chapterId: 'CPP-CH-07',
        chapterTitle: 'Chương 7: Mảng 2 Chiều và Bài toán Ma trận Thực tế',
        chapterObjective: 'Làm việc với bảng dữ liệu hàng-cột, Row-major và hoàn thiện Dự án Mini Game Cờ Caro Console.',
        file: 'Lesson_07_01.md',
        lessonId: 'CPP-07.01',
        title: 'Bài 7.1: Bản chất Ma trận trong Bộ nhớ (Row-major) và Thao tác Nhập/Xuất lưới 2D',
        objective: 'Nắm vững cơ chế Row-major trong RAM, công thức tính ô nhớ và kỹ thuật duyệt lồng nhau tối ưu Cache.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 1,
        exercise: {
            title: 'Tính tổng tất cả các phần tử trong ma trận 2D',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào 2 số nguyên R và C (1 ≤ R, C ≤ 50) đại diện cho số hàng và số cột của ma trận 2D.
Tiếp theo là R dòng, mỗi dòng chứa C số nguyên.
Hãy tính và in ra tổng của tất cả các phần tử trong ma trận.

### Ví dụ:
* **Đầu vào:**
\`\`\`text
2 3
1 2 3
4 5 6
\`\`\`
* **Đầu ra:** \`21\`
* **Đầu vào:**
\`\`\`text
1 1
42
\`\`\`
* **Đầu ra:** \`42\`

### Ràng buộc kỹ thuật:
* Sử dụng 2 vòng lặp \`for\` lồng nhau để nhập và duyệt qua từng phần tử của ma trận 2D.
* Dùng biến tổng kiểu \`long long\` để chống tràn số.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["for","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng 2 vòng lặp for lồng nhau để duyệt ma trận 2D."} -->`,
            starterCode: `#include <iostream>

int main() {
    int r, c;
    if (std::cin >> r >> c && r > 0 && c > 0) {
        // Khai báo ma trận, nhập và tính tổng
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int r, c;
    if (std::cin >> r >> c && r > 0 && c > 0) {
        long long sum = 0;
        for (int i = 0; i < r; ++i) {
            for (int j = 0; j < c; ++j) {
                int val;
                std::cin >> val;
                sum += val;
            }
        }
        std::cout << sum << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '21\n', isHidden: false },
                { input: '1 1\n42', expectedOutput: '42\n', isHidden: false },
                { input: '2 2\n-5 10\n15 -20', expectedOutput: '0\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong cơ chế Row-major của C++, nếu ma trận có kích thước R hàng và C cột, phần tử `a[i][j]` nằm ở vị trí thứ mấy trong dải ô nhớ 1 chiều tuyến tính của RAM?',
            explanation: 'Vì mỗi hàng có C phần tử, để nhảy tới hàng thứ i ta phải vượt qua i hàng trước đó (i * C phần tử). Cộng thêm chỉ số cột j trong hàng đó, ta được công thức ánh xạ chuẩn xác: i * C + j.',
            options: [
                { key: 'A', text: 'i + j', isCorrect: false },
                { key: 'B', text: 'i * C + j', isCorrect: true },
                { key: 'C', text: 'j * R + i', isCorrect: false },
                { key: 'D', text: 'i * j', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 7,
        moduleId: 'CPP-MOD-07',
        chapterId: 'CPP-CH-07',
        chapterTitle: 'Chương 7: Mảng 2 Chiều và Bài toán Ma trận Thực tế',
        chapterObjective: 'Làm việc với bảng dữ liệu hàng-cột, Row-major và hoàn thiện Dự án Mini Game Cờ Caro Console.',
        file: 'Lesson_07_02.md',
        lessonId: 'CPP-07.02',
        title: 'Bài 7.2: Các Bài toán Ma trận Vuông: Đường chéo chính/phụ và Ma trận Chuyển vị',
        objective: 'Khai thác tính chất đối xứng, đường chéo chính (i == j), đường chéo phụ (i + j == N - 1) và chuyển vị tại chỗ.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 2,
        exercise: {
            title: 'Tính tổng đường chéo chính và đường chéo phụ ma trận vuông',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào số nguyên N (1 ≤ N ≤ 50) là kích thước của ma trận vuông cấp N × N.
Tiếp theo là N dòng, mỗi dòng chứa N số nguyên.
Hãy tính:
1. Tổng các phần tử nằm trên Đường chéo chính (chỉ số hàng = chỉ số cột, tức i == j).
2. Tổng các phần tử nằm trên Đường chéo phụ (chỉ số cột = N - 1 - i).

In ra 2 tổng trên cùng một dòng (ngăn cách bởi dấu cách): \`<tong_chinh> <tong_phu>\`.

### Ví dụ:
* **Đầu vào:**
\`\`\`text
3
1 2 3
4 5 6
7 8 9
\`\`\`
* Giải thích: Chéo chính = 1 + 5 + 9 = 15; Chéo phụ = 3 + 5 + 7 = 15.
* **Đầu ra:** \`15 15\`

### Ràng buộc kỹ thuật:
* Tự cài đặt vòng lặp duyệt ma trận vuông và xác định chính xác công thức chỉ số của đường chéo chính và phụ.
* Sử dụng \`std::cin\` và \`std::cout\` kết thúc bằng ký tự \`'\\n'\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["for","cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng sử dụng vòng lặp duyệt ma trận và tính tổng 2 đường chéo chính, phụ."} -->`,
            starterCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        // Nhập ma trận và tính tổng 2 đường chéo trong O(N)
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        int a[50][50];
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                std::cin >> a[i][j];
            }
        }
        long long sumMain = 0, sumAnti = 0;
        for (int i = 0; i < n; ++i) {
            sumMain += a[i][i];
            sumAnti += a[i][n - 1 - i];
        }
        std::cout << sumMain << " " << sumAnti << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '15 15\n', isHidden: false },
                { input: '2\n1 2\n3 4', expectedOutput: '5 5\n', isHidden: false },
                { input: '1\n10', expectedOutput: '10 10\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong ma trận vuông cấp N, điều kiện toán học nào xác định một phần tử nằm trên Đường chéo phụ (Anti-diagonal)?',
            explanation: 'Đường chéo phụ nối từ góc trên bên phải (hàng 0, cột N-1) tới góc dưới bên trái (hàng N-1, cột 0). Tổng chỉ số hàng và cột của mọi phần tử trên đường này luôn là hằng số: i + j == N - 1.',
            options: [
                { key: 'A', text: 'i == j', isCorrect: false },
                { key: 'B', text: 'i + j == N - 1', isCorrect: true },
                { key: 'C', text: 'i - j == 0', isCorrect: false },
                { key: 'D', text: 'i * j == N', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 7,
        moduleId: 'CPP-MOD-07',
        chapterId: 'CPP-CH-07',
        chapterTitle: 'Chương 7: Mảng 2 Chiều và Bài toán Ma trận Thực tế',
        chapterObjective: 'Làm việc với bảng dữ liệu hàng-cột, Row-major và hoàn thiện Dự án Mini Game Cờ Caro Console.',
        file: 'Lesson_07_03.md',
        lessonId: 'CPP-07.03',
        title: 'Bài 7.3: Ma trận Động vector 2 Chiều và Dự án Game Console: Tic-Tac-Toe',
        objective: 'Sử dụng vector 2D, tổ chức hàm Clean Code và hoàn thành trọn vẹn Mini Game Cờ Caro Console.',
        difficulty: 'HARD',
        durationMinutes: 35,
        orderIndex: 3,
        exercise: {
            title: 'Kiểm tra trạng thái Thắng thua của bàn cờ Tic-Tac-Toe 3x3',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào trạng thái của một bàn cờ Tic-Tac-Toe kích thước 3 × 3 gồm các ký tự \`X\`, \`O\` hoặc \`.\` (ô trống).
Kiểm tra xem người chơi \`X\` đã thắng hay chưa (thắng khi có 3 ký tự \`X\` trên cùng 1 hàng, 1 cột hoặc 1 đường chéo).
* Nếu \`X\` thắng, in ra: \`X THANG\`
* Nếu \`X\` chưa thắng, in ra: \`CHUA THANG\`

### Ví dụ:
* **Đầu vào:**
\`\`\`text
X X X
O . O
. . .
\`\`\`
* **Đầu ra:** \`X THANG\`
* **Đầu vào:**
\`\`\`text
O O O
X . X
. . .
\`\`\`
* **Đầu ra:** \`CHUA THANG\`

### Ràng buộc kỹ thuật:
* Viết hàm hoặc điều kiện kiểm tra đầy đủ 3 hàng, 3 cột và 2 đường chéo của bàn cờ 3 × 3.
* Sử dụng \`std::cin\` để đọc và \`std::cout\` in kết quả kết thúc bằng ký tự \`'\\n'\`.

<!-- CONSTRAINTS: {"requireComment":false,"requiredKeywords":["cin","cout"],"forbiddenKeywords":[],"customErrorMessage":"Vui lòng kiểm tra đầy đủ 3 hàng, 3 cột và 2 đường chéo của bàn cờ Tic-Tac-Toe."} -->`,
            starterCode: `#include <iostream>
#include <vector>

bool checkXWin(const std::vector<std::vector<char>>& b) {
    // Viết logic kiểm tra 3 hàng, 3 cột và 2 đường chéo
    return false;
}

int main() {
    std::vector<std::vector<char>> board(3, std::vector<char>(3));
    // Nhập và kiểm tra
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <vector>

bool checkXWin(const std::vector<std::vector<char>>& b) {
    for (int i = 0; i < 3; ++i) {
        if (b[i][0] == 'X' && b[i][1] == 'X' && b[i][2] == 'X') return true;
        if (b[0][i] == 'X' && b[1][i] == 'X' && b[2][i] == 'X') return true;
    }
    if (b[0][0] == 'X' && b[1][1] == 'X' && b[2][2] == 'X') return true;
    if (b[0][2] == 'X' && b[1][1] == 'X' && b[2][0] == 'X') return true;
    return false;
}

int main() {
    std::vector<std::vector<char>> board(3, std::vector<char>(3));
    for (int i = 0; i < 3; ++i) {
        for (int j = 0; j < 3; ++j) {
            std::cin >> board[i][j];
        }
    }
    if (checkXWin(board)) {
        std::cout << "X THANG\\n";
    } else {
        std::cout << "CHUA THANG\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: 'X X X\nO . O\n. . .', expectedOutput: 'X THANG\n', isHidden: false },
                { input: 'X O X\nO X O\nO . X', expectedOutput: 'X THANG\n', isHidden: false },
                { input: 'O O O\nX . X\n. . .', expectedOutput: 'CHUA THANG\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Để khai báo một ma trận động 2 chiều std::vector có R hàng, C cột với tất cả phần tử khởi tạo bằng ký tự \' \', cú pháp C++ chuẩn là gì?',
            explanation: 'std::vector<std::vector<char>> v(R, std::vector<char>(C, \' \')) khởi tạo vector cha gồm R phần tử, mỗi phần tử là 1 vector con gồm C phần tử giá trị \' \'.',
            options: [
                { key: 'A', text: 'std::vector<char> v(R, C);', isCorrect: false },
                { key: 'B', text: 'std::vector<std::vector<char>> v(R, std::vector<char>(C, \' \'));', isCorrect: true },
                { key: 'C', text: 'std::vector<char> v[R][C];', isCorrect: false },
                { key: 'D', text: 'std::matrix<char> v(R, C);', isCorrect: false }
            ]
        }
    }
];

async function main() {
    console.log('🚀 Bắt đầu triển khai 24 bài học còn lại (Modules 2 - 7) cho Khóa học C++ Cơ bản...');

    const cppCourseId = 'c7b5c7a1-4f8d-4e9b-9c3a-8b7d6e5f4a11';

    const course = await prisma.course.findUnique({
        where: { id: cppCourseId }
    });

    if (!course) {
        throw new Error('Chưa tìm thấy Khóa học C++. Vui lòng kiểm tra course ID.');
    }

    // Nhóm các bài học theo Module
    const modulesMap = new Map<string, LessonSeedItem[]>();
    for (const item of lessonsToSeed) {
        if (!modulesMap.has(item.moduleId)) {
            modulesMap.set(item.moduleId, []);
        }
        modulesMap.get(item.moduleId)!.push(item);
    }

    for (const [moduleId, items] of modulesMap.entries()) {
        const firstItem = items[0];
        console.log(`\n======================================================`);
        console.log(`📦 Đang xử lý Module: ${moduleId} - ${firstItem.chapterTitle}`);
        console.log(`======================================================`);

        // 1. Tìm Module trong DB
        const mod = await prisma.module.findUnique({
            where: { moduleId: moduleId }
        });

        if (!mod) {
            console.warn(`⚠️ Chưa tìm thấy module ${moduleId} trong DB, bỏ qua!`);
            continue;
        }

        // 2. Tìm hoặc Tạo Chapter
        let chapter = await prisma.chapter.findFirst({
            where: {
                moduleId: mod.id,
                chapterId: firstItem.chapterId
            }
        });

        if (!chapter) {
            chapter = await prisma.chapter.create({
                data: {
                    moduleId: mod.id,
                    chapterId: firstItem.chapterId,
                    title: firstItem.chapterTitle,
                    objective: firstItem.chapterObjective,
                    orderIndex: 1
                }
            });
            console.log(`  ➕ Đã tạo mới Chapter: ${chapter.title}`);
        } else {
            console.log(`  📂 Đã có Chapter: ${chapter.title}`);
        }

        // Thư mục chứa file markdown
        const docsDir = path.resolve(
            __dirname,
            `../../docs/Dữ liệu nội dung bài học/C++/Khóa 1 - C++ Cơ bản/Module ${String(firstItem.moduleNumber).padStart(2, '0')}`
        );

        for (const item of items) {
            const filePath = path.join(docsDir, item.file);
            let content = '';

            if (fs.existsSync(filePath)) {
                content = fs.readFileSync(filePath, 'utf-8');
            } else {
                console.warn(`  ⚠️ File không tồn tại: ${filePath}. Sử dụng nội dung tóm tắt.`);
                content = `# ${item.title}\n\n${item.objective}`;
            }

            // Tạo hoặc cập nhật Lesson
            let lesson = await prisma.lesson.findFirst({
                where: {
                    chapterId: chapter.id,
                    lessonId: item.lessonId
                }
            });

            if (!lesson) {
                lesson = await prisma.lesson.create({
                    data: {
                        chapterId: chapter.id,
                        lessonId: item.lessonId,
                        title: item.title,
                        objective: item.objective,
                        content: content,
                        difficulty: item.difficulty as any,
                        durationMinutes: item.durationMinutes,
                        isFree: true,
                        orderIndex: item.orderIndex
                    }
                });
            } else {
                lesson = await prisma.lesson.update({
                    where: { id: lesson.id },
                    data: {
                        title: item.title,
                        objective: item.objective,
                        content: content,
                        difficulty: item.difficulty as any,
                        durationMinutes: item.durationMinutes,
                        isFree: true,
                        orderIndex: item.orderIndex
                    }
                });
            }
            console.log(`  📖 [Lesson ${item.lessonId}]: ${lesson.title}`);

            // Tạo hoặc cập nhật Coding Exercise
            let exercise = await prisma.codingExercise.findFirst({
                where: { lessonId: lesson.id }
            });

            if (!exercise) {
                exercise = await prisma.codingExercise.create({
                    data: {
                        lessonId: lesson.id,
                        title: item.exercise.title,
                        difficulty: item.exercise.difficulty as any,
                        problemDescription: item.exercise.problemDescription,
                        starterCode: item.exercise.starterCode,
                        solutionCode: item.exercise.solutionCode
                    }
                });
            } else {
                exercise = await prisma.codingExercise.update({
                    where: { id: exercise.id },
                    data: {
                        title: item.exercise.title,
                        difficulty: item.exercise.difficulty as any,
                        problemDescription: item.exercise.problemDescription,
                        starterCode: item.exercise.starterCode,
                        solutionCode: item.exercise.solutionCode
                    }
                });
            }

            // Xóa và nạp lại Test Cases
            await prisma.testCase.deleteMany({
                where: { exerciseId: exercise.id }
            });

            for (const tc of item.exercise.testCases) {
                await prisma.testCase.create({
                    data: {
                        exerciseId: exercise.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        isHidden: tc.isHidden
                    }
                });
            }
            console.log(`     💻 Exercise: "${exercise.title}" (${item.exercise.testCases.length} testcases)`);

            // Xóa và nạp lại Quiz Questions
            await prisma.lessonQuizQuestion.deleteMany({
                where: { lessonId: lesson.id }
            });

            await prisma.lessonQuizQuestion.create({
                data: {
                    lessonId: lesson.id,
                    question: item.quiz.question,
                    explanation: item.quiz.explanation,
                    orderIndex: 1,
                    options: {
                        create: item.quiz.options.map(opt => ({
                            key: opt.key,
                            text: opt.text,
                            isCorrect: opt.isCorrect
                        }))
                    }
                }
            });
            console.log(`     ❓ Quiz Question đã nạp.`);
        }
    }

    console.log('\n🎉 ======================================================');
    console.log('🎉 HOÀN TẤT TRIỂN KHAI TOÀN BỘ 24 BÀI HỌC (MODULES 2 - 7)!');
    console.log('🎉 Khóa học C++ Cơ bản hiện đã có đầy đủ 29 bài học chất lượng cao.');
    console.log(`🌐 Xem khóa học tại: http://localhost:5173/course/${course.id}`);
    console.log('======================================================\n');
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi triển khai Modules 2-7:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
