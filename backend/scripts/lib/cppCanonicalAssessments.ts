export type CppAssessmentDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CppTestCaseDef {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}

export interface CppExerciseDef {
    title: string;
    difficulty: CppAssessmentDifficulty;
    problemDescription: string;
    starterCode: string;
    solutionCode: string;
    testCases: CppTestCaseDef[];
}

export interface CppQuizOptionDef {
    key: string;
    text: string;
    isCorrect: boolean;
}

export interface CppQuizDef {
    question: string;
    explanation: string;
    options: CppQuizOptionDef[];
}

export interface CppCanonicalAssessment {
    targetSkillId: string;
    exercise: CppExerciseDef;
    quiz: CppQuizDef;
}

const tests = (entries: Array<[string, string, boolean]>): CppTestCaseDef[] =>
    entries.map(([input, expectedOutput, isHidden]) => ({ input, expectedOutput, isHidden }));

function quiz(question: string, explanation: string, correct: string, wrong: string[]): CppQuizDef {
    return {
        question,
        explanation,
        options: [correct, ...wrong].map((text, index) => ({
            key: String.fromCharCode(65 + index),
            text,
            isCorrect: index === 0
        }))
    };
}

function exercise(
    title: string,
    difficulty: CppAssessmentDifficulty,
    problemDescription: string,
    starterCode: string,
    solutionCode: string,
    testCases: CppTestCaseDef[]
): CppExerciseDef {
    return { title, difficulty, problemDescription, starterCode, solutionCode, testCases };
}

/**
 * Assessments in this manifest are deliberately explicit.  A lesson listed here
 * may not silently fall back to an older seed item: the task, reference solution,
 * tests and quiz are one evidence unit for the graph skill named by targetSkillId.
 */
export const cppCanonicalAssessments: Record<string, CppCanonicalAssessment> = {
    'CPP-02.03': {
        targetSkillId: 'CPP-COND-01',
        exercise: exercise(
            'Tra cứu số ngày bằng switch-case', 'EASY',
            'Nhập tháng `m` (1–12). Dùng `switch-case` để in số ngày của tháng: 31, 30 hoặc 28 cho tháng 2. Giá trị ngoài 1–12 in `INVALID`. Mỗi nhánh phải kết thúc rõ ràng để không fall-through.',
            '#include <iostream>\n\nint main() {\n    int month;\n    if (std::cin >> month) {\n        // Dùng switch-case để in số ngày.\n    }\n}\n',
            '#include <iostream>\n\nint main() {\n    int month;\n    if (std::cin >> month) {\n        switch (month) {\n            case 1: case 3: case 5: case 7: case 8: case 10: case 12:\n                std::cout << 31 << "\\n"; break;\n            case 4: case 6: case 9: case 11:\n                std::cout << 30 << "\\n"; break;\n            case 2:\n                std::cout << 28 << "\\n"; break;\n            default:\n                std::cout << "INVALID\\n";\n        }\n    }\n}\n',
            tests([['2', '28\n', false], ['11', '30\n', false], ['13', 'INVALID\n', true]])
        ),
        quiz: quiz('Khi nào `default` trong switch-case được thực thi?', 'default chạy khi giá trị điều khiển không khớp với bất cứ nhãn case nào.', 'Khi không có case nào khớp giá trị.', ['Luôn chạy sau case đầu tiên.', 'Chỉ chạy khi có break.', 'Chỉ chạy với kiểu double.'])
    },
    'CPP-02.04': {
        targetSkillId: 'CPP-COND-01',
        exercise: exercise(
            'Phân loại chẵn lẻ với toán tử ba ngôi', 'EASY',
            'Nhập số nguyên `n`. Dùng toán tử ba ngôi `?:` để in `EVEN` nếu n chẵn, ngược lại in `ODD`.',
            '#include <iostream>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // In EVEN hoặc ODD bằng ?: .\n    }\n}\n',
            '#include <iostream>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        std::cout << (n % 2 == 0 ? "EVEN" : "ODD") << "\\n";\n    }\n}\n',
            tests([['8', 'EVEN\n', false], ['-3', 'ODD\n', true]])
        ),
        quiz: quiz('Toán tử ba ngôi phù hợp nhất cho trường hợp nào?', 'Nó phù hợp khi cần chọn một trong hai biểu thức đơn giản theo một điều kiện.', 'Chọn một trong hai biểu thức đơn giản theo điều kiện.', ['Thay mọi switch nhiều nhánh.', 'Tạo vòng lặp vô hạn.', 'Khai báo hàm đệ quy.'])
    },
    'CPP-03.01': {
        targetSkillId: 'CPP-LOOP-01',
        exercise: exercise(
            'Tổng 1 đến n bằng vòng lặp for', 'EASY',
            'Nhập số nguyên không âm `n` (n ≤ 100000). Dùng vòng lặp `for` tính và in tổng 1 + 2 + ... + n.',
            '#include <iostream>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Dùng for.\n    }\n}\n',
            '#include <iostream>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        long long sum = 0;\n        for (int i = 1; i <= n; ++i) sum += i;\n        std::cout << sum << "\\n";\n    }\n}\n',
            tests([['5', '15\n', false], ['0', '0\n', true]])
        ),
        quiz: quiz('Trong `for (init; condition; update)`, update chạy khi nào?', 'Sau mỗi lần thân vòng lặp chạy xong, trước lần kiểm tra condition tiếp theo.', 'Sau thân vòng lặp và trước lần kiểm tra điều kiện kế tiếp.', ['Trước init.', 'Chỉ khi condition sai.', 'Sau khi vòng lặp kết thúc.'])
    },
    'CPP-03.02': {
        targetSkillId: 'CPP-LOOP-01',
        exercise: exercise(
            'Tổng chữ số bằng vòng lặp while', 'EASY',
            'Nhập số nguyên không âm `n`. Dùng `while` để tính tổng các chữ số của n. Với n = 0, kết quả là 0.',
            '#include <iostream>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Dùng while tách từng chữ số.\n    }\n}\n',
            '#include <iostream>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        int sum = 0;\n        while (n > 0) { sum += n % 10; n /= 10; }\n        std::cout << sum << "\\n";\n    }\n}\n',
            tests([['12345', '15\n', false], ['0', '0\n', true]])
        ),
        quiz: quiz('Vòng lặp while kiểm tra điều kiện ở thời điểm nào?', 'Điều kiện được kiểm tra trước khi thân vòng lặp chạy.', 'Trước khi chạy thân vòng lặp.', ['Sau thân vòng lặp bắt buộc.', 'Chỉ sau lệnh break.', 'Khi chương trình kết thúc.'])
    },
    'CPP-03.03': {
        targetSkillId: 'CPP-LOOP-01',
        exercise: exercise(
            'Nhập lại đến khi có số dương', 'EASY',
            'Đọc các số nguyên liên tiếp. Dùng `do-while` để bỏ qua số không dương và dừng ở số dương đầu tiên; in số đó. Dữ liệu đầu vào luôn có ít nhất một số dương.',
            '#include <iostream>\n\nint main() {\n    int n;\n    // Dùng do-while để đọc đến số dương.\n}\n',
            '#include <iostream>\n\nint main() {\n    int n;\n    do { std::cin >> n; } while (n <= 0);\n    std::cout << n << "\\n";\n}\n',
            tests([['-2 0 7', '7\n', false], ['5', '5\n', true]])
        ),
        quiz: quiz('Đặc điểm phân biệt của do-while là gì?', 'Thân vòng lặp chạy ít nhất một lần rồi mới kiểm tra điều kiện.', 'Thân vòng lặp chạy ít nhất một lần.', ['Không có điều kiện dừng.', 'Không dùng được với int.', 'Không thể dùng cin.'])
    },
    'CPP-03.04': {
        targetSkillId: 'CPP-LOOP-01',
        exercise: exercise(
            'break và continue có kiểm soát', 'MEDIUM',
            'Nhập `n` và `stop`. Duyệt i từ 1 đến n: nếu i bằng stop thì `break`; nếu i lẻ thì `continue`; cộng các i chẵn đã đi qua. In tổng.',
            '#include <iostream>\n\nint main() {\n    int n, stop;\n    if (std::cin >> n >> stop) {\n        // Bắt buộc dùng break và continue.\n    }\n}\n',
            '#include <iostream>\n\nint main() {\n    int n, stop;\n    if (std::cin >> n >> stop) {\n        int sum = 0;\n        for (int i = 1; i <= n; ++i) {\n            if (i == stop) break;\n            if (i % 2 != 0) continue;\n            sum += i;\n        }\n        std::cout << sum << "\\n";\n    }\n}\n',
            tests([['10 7', '12\n', false], ['5 1', '0\n', true]])
        ),
        quiz: quiz('continue tác động thế nào trong một vòng lặp?', 'Nó bỏ phần thân còn lại của lần lặp hiện tại rồi chuyển sang lần lặp kế tiếp.', 'Bỏ phần còn lại của lần lặp hiện tại.', ['Thoát toàn bộ chương trình.', 'Thoát toàn bộ vòng lặp.', 'Khởi tạo lại mọi biến.'])
    },
    'CPP-03.05': {
        targetSkillId: 'CPP-LOOP-01',
        exercise: exercise(
            'In hình chữ nhật bằng vòng lặp lồng nhau', 'MEDIUM',
            'Nhập số hàng `r` và số cột `c` (1–20). Dùng hai vòng lặp lồng nhau in hình chữ nhật gồm dấu `*`, mỗi hàng một dòng.',
            '#include <iostream>\n\nint main() {\n    int r, c;\n    if (std::cin >> r >> c) {\n        // Dùng hai vòng lặp lồng nhau.\n    }\n}\n',
            '#include <iostream>\n\nint main() {\n    int r, c;\n    if (std::cin >> r >> c) {\n        for (int i = 0; i < r; ++i) {\n            for (int j = 0; j < c; ++j) std::cout << "*";\n            std::cout << "\\n";\n        }\n    }\n}\n',
            tests([['2 3', '***\n***\n', false], ['1 1', '*\n', true]])
        ),
        quiz: quiz('Với hai vòng lặp lồng nhau r hàng và c cột, thân trong chạy bao nhiêu lần?', 'r × c lần.', 'r × c lần.', ['r + c lần.', 'Chỉ r lần.', 'Chỉ c lần.'])
    },
    'CPP-05.03': {
        targetSkillId: 'CPP-ARRAY-01',
        exercise: exercise(
            'Đếm tần suất chữ số', 'MEDIUM',
            'Nhập n, tiếp theo là n chữ số trong đoạn 0–9, rồi nhập truy vấn q. Dùng mảng đếm 10 phần tử để in số lần q xuất hiện.',
            '#include <iostream>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Dùng int count[10] = {};\n    }\n}\n',
            '#include <iostream>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        int count[10] = {};\n        for (int i = 0, x; i < n; ++i) { std::cin >> x; ++count[x]; }\n        int q; std::cin >> q;\n        std::cout << count[q] << "\\n";\n    }\n}\n',
            tests([['6 3 1 3 2 3 1 3', '3\n', false], ['4 0 0 9 0 9', '1\n', true]])
        ),
        quiz: quiz('Trong mảng đếm chữ số, `count[x]` biểu diễn gì?', 'Số lần giá trị x xuất hiện, khi x nằm trong miền chỉ số hợp lệ.', 'Số lần giá trị x xuất hiện.', ['Giá trị lớn nhất của mảng.', 'Địa chỉ của x.', 'Số phần tử còn trống.'])
    },
    'CPP-05.04': {
        targetSkillId: 'CPP-ARRAY-01',
        exercise: exercise(
            'Chèn một phần tử vào mảng đã dùng', 'MEDIUM',
            'Nhập n, n số nguyên, vị trí p (0 ≤ p ≤ n) và giá trị x. Chèn x tại p bằng cách dời phần tử sang phải, rồi in mảng mới cách nhau một dấu cách.',
            '#include <iostream>\n\nint main() {\n    int n, a[101];\n    if (std::cin >> n) {\n        // Đọc mảng và chèn phần tử.\n    }\n}\n',
            `#include <iostream>\n\nint main() {\n    int n, a[101];\n    if (std::cin >> n) {\n        for (int i = 0; i < n; ++i) std::cin >> a[i];\n        int p, x; std::cin >> p >> x;\n        for (int i = n; i > p; --i) a[i] = a[i - 1];\n        a[p] = x; ++n;\n        for (int i = 0; i < n; ++i) { if (i) std::cout << ' '; std::cout << a[i]; }\n        std::cout << "\\n";\n    }\n}\n`,
            tests([['3 1 2 4 2 3', '1 2 3 4\n', false], ['0 0 7', '7\n', true]])
        ),
        quiz: quiz('Khi chèn vào mảng tại vị trí p, vì sao phải dời từ cuối về p?', 'Để không ghi đè phần tử chưa được sao chép.', 'Để không ghi đè phần tử chưa sao chép.', ['Để đổi thứ tự mảng ngẫu nhiên.', 'Để giảm n.', 'Để dùng ít bộ nhớ hơn.'])
    },
    'CPP2-01.01': {
        targetSkillId: 'CPP-ENUMVAR-01',
        exercise: exercise(
            'Đèn giao thông với enum class', 'MEDIUM',
            'Nhập một ký tự `R`, `Y` hoặc `G`. Khai báo `enum class Light` và dùng nó để in lần lượt `STOP`, `WAIT`, `GO`. Ký tự khác in `INVALID`.',
            '#include <iostream>\n\nenum class Light { Red, Yellow, Green };\n\nint main() {\n    char c;\n    if (std::cin >> c) {\n        // Chuyển c sang Light và in thông điệp.\n    }\n}\n',
            `#include <iostream>\n\nenum class Light { Red, Yellow, Green };\n\nint main() {\n    char c;\n    if (std::cin >> c) {\n        switch (c) {\n            case 'R': { Light light = Light::Red; (void)light; std::cout << "STOP\\n"; break; }\n            case 'Y': { Light light = Light::Yellow; (void)light; std::cout << "WAIT\\n"; break; }\n            case 'G': { Light light = Light::Green; (void)light; std::cout << "GO\\n"; break; }\n            default: std::cout << "INVALID\\n";\n        }\n    }\n}\n`,
            tests([['R', 'STOP\n', false], ['G', 'GO\n', false], ['X', 'INVALID\n', true]])
        ),
        quiz: quiz('Lợi ích chính của enum class là gì?', 'Nó có phạm vi tên riêng và không tự chuyển ngầm sang int.', 'Có phạm vi tên riêng và không tự chuyển ngầm sang int.', ['Luôn chiếm đúng một byte.', 'Tự sắp xếp enum.', 'Thay thế mọi struct.'])
    },
    'CPP2-01.02': {
        targetSkillId: 'CPP-STRUCT-01',
        exercise: exercise(
            'Bản ghi học viên bằng struct', 'MEDIUM',
            'Nhập mã số nguyên và điểm thực của một học viên. Khai báo `struct Student` có hai trường tương ứng, khởi tạo một đối tượng và in `id score` với điểm đúng một chữ số thập phân.',
            '#include <iostream>\n#include <iomanip>\n\nstruct Student {\n    // Khai báo trường dữ liệu.\n};\n\nint main() {\n    // Đọc, tạo Student và in dữ liệu.\n}\n',
            `#include <iostream>\n#include <iomanip>\n\nstruct Student { int id; double score; };\n\nint main() {\n    Student student{};\n    if (std::cin >> student.id >> student.score) {\n        std::cout << student.id << ' ' << std::fixed << std::setprecision(1) << student.score << "\\n";\n    }\n}\n`,
            tests([['12 8.5', '12 8.5\n', false], ['7 10', '7 10.0\n', true]])
        ),
        quiz: quiz('Padding trong struct có được chuẩn C++ ấn định chính xác cho mọi máy không?', 'Không; layout và padding phụ thuộc implementation/ABI.', 'Không; nó phụ thuộc implementation và ABI.', ['Có, mọi struct cùng kích thước.', 'Luôn bằng 0.', 'Chỉ phụ thuộc tên trường.'])
    },
    'CPP2-01.03': {
        targetSkillId: 'CPP-ENUMVAR-01',
        exercise: exercise(
            'Đọc giá trị an toàn bằng std::variant', 'MEDIUM',
            'Nhập `I value` hoặc `S word`. Dùng `std::variant<int, std::string>` lưu giá trị và in `INT value` hoặc `STRING word` bằng cách kiểm tra alternative.',
            '#include <iostream>\n#include <string>\n#include <variant>\n\nint main() {\n    char kind;\n    if (std::cin >> kind) {\n        // Tạo và đọc std::variant.\n    }\n}\n',
            `#include <iostream>\n#include <string>\n#include <variant>\n\nint main() {\n    char kind;\n    if (std::cin >> kind) {\n        std::variant<int, std::string> value;\n        if (kind == 'I') { int x; std::cin >> x; value = x; }\n        else { std::string s; std::cin >> s; value = s; }\n        if (std::holds_alternative<int>(value)) std::cout << "INT " << std::get<int>(value) << "\\n";\n        else std::cout << "STRING " << std::get<std::string>(value) << "\\n";\n    }\n}\n`,
            tests([['I 42', 'INT 42\n', false], ['S hello', 'STRING hello\n', true]])
        ),
        quiz: quiz('Cách nào tránh `bad_variant_access` khi dùng std::get?', 'Kiểm tra alternative trước bằng holds_alternative hoặc dùng visit.', 'Kiểm tra alternative trước hoặc dùng visit.', ['Luôn gọi get<int>.', 'Ép variant sang void*.', 'Bỏ qua mọi lỗi.'])
    },
    'CPP2-02.01': {
        targetSkillId: 'CPP-VECTOR-01',
        exercise: exercise(
            'Tổng dãy động với std::vector', 'MEDIUM',
            'Nhập n và n số nguyên. Dùng `std::vector<int>` cùng `push_back` để lưu dãy, sau đó in `size sum`. Không được suy luận hay kiểm tra dung lượng từ `capacity()`.',
            '#include <iostream>\n#include <vector>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Lưu dữ liệu bằng vector và tính tổng.\n    }\n}\n',
            `#include <iostream>\n#include <vector>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        std::vector<int> values;\n        long long sum = 0;\n        for (int i = 0, x; i < n; ++i) { std::cin >> x; values.push_back(x); sum += x; }\n        std::cout << values.size() << ' ' << sum << "\\n";\n    }\n}\n`,
            tests([['4 1 2 3 4', '4 10\n', false], ['0', '0 0\n', true]])
        ),
        quiz: quiz('Chuẩn C++ có bảo đảm vector tăng capacity theo đúng một hệ số cố định không?', 'Không; chiến lược tăng capacity là chi tiết implementation.', 'Không; đó là chi tiết implementation.', ['Có, luôn gấp đôi.', 'Có, luôn cộng một.', 'Có, luôn bằng size.'])
    },
    'CPP2-02.02': {
        targetSkillId: 'CPP-VECTOR-01',
        exercise: exercise(
            'Tổng đường chéo ma trận vector', 'MEDIUM',
            'Nhập n (1–20) và ma trận vuông n × n. Lưu bằng `std::vector<std::vector<int>>`, sau đó in tổng đường chéo chính.',
            '#include <iostream>\n#include <vector>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Tạo vector hai chiều và tính đường chéo.\n    }\n}\n',
            '#include <iostream>\n#include <vector>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        std::vector<std::vector<int>> a(n, std::vector<int>(n));\n        for (int i = 0; i < n; ++i) for (int j = 0; j < n; ++j) std::cin >> a[i][j];\n        int sum = 0; for (int i = 0; i < n; ++i) sum += a[i][i];\n        std::cout << sum << "\\n";\n    }\n}\n',
            tests([['2 1 2 3 4', '5\n', false], ['3 1 0 0 0 2 0 0 0 3', '6\n', true]])
        ),
        quiz: quiz('vector<vector<int>> có đảm bảo mọi hàng nằm trong một block liên tiếp duy nhất không?', 'Không; mỗi vector hàng quản lý bộ nhớ riêng.', 'Không; mỗi hàng là một vector quản lý riêng.', ['Có, luôn như mảng 2D tĩnh.', 'Có, vì vector không cấp phát động.', 'Chỉ khi n lẻ.'])
    },
    'CPP2-02.03': {
        targetSkillId: 'CPP-STRUCT-01',
        exercise: exercise(
            'Đọc tuple bằng structured binding', 'MEDIUM',
            'Nhập một tên không có khoảng trắng, điểm số nguyên và hạng số nguyên. Tạo `std::tuple<std::string, int, int>`, dùng structured binding để in `name score rank`.',
            '#include <iostream>\n#include <string>\n#include <tuple>\n\nint main() {\n    // Đọc dữ liệu, tạo tuple và structured binding.\n}\n',
            `#include <iostream>\n#include <string>\n#include <tuple>\n\nint main() {\n    std::string name; int score, rank;\n    if (std::cin >> name >> score >> rank) {\n        std::tuple<std::string, int, int> student{name, score, rank};\n        auto [studentName, studentScore, studentRank] = student;\n        std::cout << studentName << ' ' << studentScore << ' ' << studentRank << "\\n";\n    }\n}\n`,
            tests([['Lan 95 1', 'Lan 95 1\n', false], ['Minh 80 7', 'Minh 80 7\n', true]])
        ),
        quiz: quiz('Structured binding giúp gì khi làm việc với tuple?', 'Nó gán từng thành phần vào các tên biến rõ ràng.', 'Gán từng thành phần vào các tên biến rõ ràng.', ['Tự sắp xếp tuple.', 'Thay đổi kích thước tuple.', 'Tự giải phóng mọi vùng nhớ.'])
    },
    'CPP2-02.04': {
        targetSkillId: 'CPP-PTR-01',
        exercise: exercise(
            'Liên kết hai node', 'HARD',
            'Nhập hai số nguyên a và b. Khai báo `struct Node { int value; Node* next; }`, liên kết node thứ nhất tới node thứ hai qua `next`, rồi in tổng hai giá trị bằng cách dereference liên kết.',
            '#include <iostream>\n\nstruct Node {\n    int value;\n    Node* next;\n};\n\nint main() {\n    // Tạo hai node cục bộ và liên kết chúng.\n}\n',
            '#include <iostream>\n\nstruct Node { int value; Node* next; };\n\nint main() {\n    int a, b;\n    if (std::cin >> a >> b) {\n        Node second{b, nullptr};\n        Node first{a, &second};\n        std::cout << first.value + first.next->value << "\\n";\n    }\n}\n',
            tests([['4 9', '13\n', false], ['-2 5', '3\n', true]])
        ),
        quiz: quiz('Một con trỏ Node* có thể gây lỗi nào nếu được dereference khi null?', 'Lỗi truy cập bộ nhớ không hợp lệ.', 'Lỗi truy cập bộ nhớ không hợp lệ.', ['Tự động tạo node mới.', 'Tự động bằng 0 an toàn.', 'Làm vector tăng capacity.'])
    },
    'CPP2-03.01': {
        targetSkillId: 'CPP-FILE-01',
        exercise: exercise(
            'Tách bản ghi với stringstream', 'MEDIUM',
            'Đọc một dòng theo dạng `name age`, trong đó name không có khoảng trắng. Dùng `std::stringstream` tách tên và tuổi, rồi in `name-age`.',
            '#include <iostream>\n#include <sstream>\n#include <string>\n\nint main() {\n    std::string line;\n    std::getline(std::cin, line);\n    // Dùng stringstream để tách line.\n}\n',
            `#include <iostream>\n#include <sstream>\n#include <string>\n\nint main() {\n    std::string line, name; int age;\n    std::getline(std::cin, line);\n    std::stringstream stream(line);\n    if (stream >> name >> age) std::cout << name << '-' << age << "\\n";\n}\n`,
            tests([['Lan 19', 'Lan-19\n', false], ['Nam 30', 'Nam-30\n', true]])
        ),
        quiz: quiz('stringstream phù hợp để làm gì?', 'Đọc hoặc ghi dữ liệu có cấu trúc từ một chuỗi.', 'Đọc hoặc ghi dữ liệu có cấu trúc từ một chuỗi.', ['Kéo dài vòng đời string_view.', 'Tự mã hóa file nhị phân.', 'Thay thế vector.'])
    },
    'CPP2-03.02': {
        targetSkillId: 'CPP-FILE-01',
        exercise: exercise(
            'Cắt lát an toàn bằng string_view', 'MEDIUM',
            'Nhập một từ s có độ dài ít nhất 3. Tạo `std::string_view` quan sát s và in ba ký tự đầu. View chỉ được dùng khi s còn sống.',
            '#include <iostream>\n#include <string>\n#include <string_view>\n\nint main() {\n    std::string s;\n    if (std::cin >> s) {\n        // Tạo string_view trên s.\n    }\n}\n',
            '#include <iostream>\n#include <string>\n#include <string_view>\n\nint main() {\n    std::string s;\n    if (std::cin >> s) {\n        std::string_view view(s);\n        std::cout << view.substr(0, 3) << "\\n";\n    }\n}\n',
            tests([['abcdef', 'abc\n', false], ['xyz', 'xyz\n', true]])
        ),
        quiz: quiz('string_view có sở hữu bộ nhớ của chuỗi mà nó quan sát không?', 'Không; dữ liệu gốc phải còn sống trong lúc dùng view.', 'Không; dữ liệu gốc phải còn sống.', ['Có, nó sao chép toàn bộ chuỗi.', 'Có, nó tự delete chuỗi.', 'Chỉ với chuỗi dài.'])
    },
    'CPP2-03.03': {
        targetSkillId: 'CPP-FILE-01',
        exercise: exercise(
            'Kiểm tra mã sinh viên bằng regex_match', 'HARD',
            'Nhập một từ. Dùng `std::regex_match` kiểm tra toàn bộ từ có đúng mẫu `SV` theo sau bởi đúng bốn chữ số hay không. In `VALID` hoặc `INVALID`.',
            '#include <iostream>\n#include <regex>\n#include <string>\n\nint main() {\n    std::string code;\n    if (std::cin >> code) {\n        // Dùng regex_match.\n    }\n}\n',
            '#include <iostream>\n#include <regex>\n#include <string>\n\nint main() {\n    std::string code;\n    if (std::cin >> code) {\n        const std::regex pattern("SV[0-9]{4}");\n        std::cout << (std::regex_match(code, pattern) ? "VALID" : "INVALID") << "\\n";\n    }\n}\n',
            tests([['SV1234', 'VALID\n', false], ['xSV1234', 'INVALID\n', false], ['SV12A4', 'INVALID\n', true]])
        ),
        quiz: quiz('Khác biệt chính giữa regex_match và regex_search là gì?', 'regex_match yêu cầu toàn bộ chuỗi khớp; regex_search chỉ cần một đoạn khớp.', 'regex_match yêu cầu toàn bộ chuỗi khớp.', ['Cả hai luôn giống nhau.', 'regex_match chỉ dùng cho số.', 'regex_search không dùng được với string.'])
    },
    'CPP2-04.01': {
        targetSkillId: 'CPP-RECUR-01',
        exercise: exercise(
            'Tìm phần tử lớn nhất bằng chia để trị', 'HARD',
            'Nhập n (n ≥ 1) và n số nguyên. Viết hàm đệ quy tìm max trên đoạn [left, right] bằng cách chia đôi đoạn; in giá trị lớn nhất.',
            '#include <iostream>\n#include <vector>\n\nint findMax(const std::vector<int>& a, int left, int right) {\n    // Base case và bước chia để trị.\n}\n\nint main() {\n    // Đọc dãy và gọi findMax.\n}\n',
            '#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint findMax(const std::vector<int>& a, int left, int right) {\n    if (left == right) return a[left];\n    int mid = left + (right - left) / 2;\n    return std::max(findMax(a, left, mid), findMax(a, mid + 1, right));\n}\n\nint main() {\n    int n; if (std::cin >> n) {\n        std::vector<int> a(n); for (int& x : a) std::cin >> x;\n        std::cout << findMax(a, 0, n - 1) << "\\n";\n    }\n}\n',
            tests([['5 3 9 -1 4 2', '9\n', false], ['1 -7', '-7\n', true]])
        ),
        quiz: quiz('Base case của đệ quy có vai trò gì?', 'Dừng đệ quy trên bài toán đủ nhỏ để lời gọi chắc chắn kết thúc.', 'Dừng đệ quy trên bài toán đủ nhỏ.', ['Tạo thêm lời gọi vô hạn.', 'Thay mọi vòng lặp.', 'Tăng số phần tử của vector.'])
    },
    'CPP2-04.02': {
        targetSkillId: 'CPP-BACKTRACK-01',
        exercise: exercise(
            'Sinh hoán vị bằng quay lui', 'HARD',
            'Nhập n (1–3). Dùng backtracking sinh tất cả hoán vị của các số 1..n theo thứ tự từ điển, mỗi hoán vị trên một dòng, không trùng và phải hoàn tác trạng thái `used`.',
            '#include <iostream>\n#include <vector>\n\nvoid generate(int n, std::vector<int>& current, std::vector<bool>& used) {\n    // Chọn, đệ quy, hoàn tác.\n}\n\nint main() {\n    int n; if (std::cin >> n) {\n        std::vector<int> current; std::vector<bool> used(n + 1);\n        generate(n, current, used);\n    }\n}\n',
            '#include <iostream>\n#include <vector>\n\nvoid generate(int n, std::vector<int>& current, std::vector<bool>& used) {\n    if (static_cast<int>(current.size()) == n) {\n        for (int x : current) std::cout << x;\n        std::cout << "\\n"; return;\n    }\n    for (int x = 1; x <= n; ++x) if (!used[x]) {\n        used[x] = true; current.push_back(x);\n        generate(n, current, used);\n        current.pop_back(); used[x] = false;\n    }\n}\n\nint main() {\n    int n; if (std::cin >> n) { std::vector<int> current; std::vector<bool> used(n + 1); generate(n, current, used); }\n}\n',
            tests([['2', '12\n21\n', false], ['1', '1\n', true]])
        ),
        quiz: quiz('Bước hoàn tác trong backtracking nhằm mục đích gì?', 'Khôi phục trạng thái trước khi thử lựa chọn kế tiếp.', 'Khôi phục trạng thái trước khi thử nhánh khác.', ['Xóa mọi kết quả đã tìm.', 'Làm đệ quy sâu hơn vô hạn.', 'Bỏ base case.'])
    },
    'CPP2-04.03': {
        targetSkillId: 'CPP-BACKTRACK-01',
        exercise: exercise(
            'Đếm nghiệm N-Queens có cắt tỉa', 'HARD',
            'Nhập n (1–8). Đếm số cách đặt n quân hậu sao cho không cùng cột hay đường chéo. Dùng mảng cờ cột và hai đường chéo để cắt tỉa ngay khi nước đi không hợp lệ.',
            '#include <iostream>\n#include <vector>\n\nint solve(int row, int n, std::vector<bool>& col, std::vector<bool>& down, std::vector<bool>& up) {\n    // Cắt tỉa theo cột và đường chéo.\n}\n\nint main() {\n    // Đọc n và in số nghiệm.\n}\n',
            '#include <iostream>\n#include <vector>\n\nint solve(int row, int n, std::vector<bool>& col, std::vector<bool>& down, std::vector<bool>& up) {\n    if (row == n) return 1;\n    int count = 0;\n    for (int c = 0; c < n; ++c) {\n        int d = row - c + n - 1, u = row + c;\n        if (col[c] || down[d] || up[u]) continue;\n        col[c] = down[d] = up[u] = true;\n        count += solve(row + 1, n, col, down, up);\n        col[c] = down[d] = up[u] = false;\n    }\n    return count;\n}\n\nint main() {\n    int n; if (std::cin >> n) {\n        std::vector<bool> col(n), down(2 * n - 1), up(2 * n - 1);\n        std::cout << solve(0, n, col, down, up) << "\\n";\n    }\n}\n',
            tests([['1', '1\n', false], ['4', '2\n', false], ['5', '10\n', true]])
        ),
        quiz: quiz('Trong N-Queens, vì sao dùng chỉ số `row - col + n - 1`?', 'Để đưa chỉ số đường chéo có thể âm về miền chỉ số mảng không âm.', 'Để biến chỉ số đường chéo thành không âm.', ['Để tăng số cột.', 'Để sắp xếp hậu.', 'Để tránh dùng đệ quy.'])
    },
    'CPP2-05.01': {
        targetSkillId: 'CPP-BUILD-01',
        exercise: exercise(
            'Sắp xếp rồi tìm nhị phân', 'MEDIUM',
            'Nhập n, n số nguyên và target. Dùng `std::sort` rồi `std::binary_search` trên range iterator hợp lệ. In `FOUND` hoặc `NOT_FOUND`.',
            '#include <algorithm>\n#include <iostream>\n#include <vector>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Đọc vector, sort trước binary_search.\n    }\n}\n',
            '#include <algorithm>\n#include <iostream>\n#include <vector>\n\nint main() {\n    int n; if (std::cin >> n) {\n        std::vector<int> a(n); for (int& x : a) std::cin >> x;\n        int target; std::cin >> target;\n        std::sort(a.begin(), a.end());\n        std::cout << (std::binary_search(a.begin(), a.end(), target) ? "FOUND" : "NOT_FOUND") << "\\n";\n    }\n}\n',
            tests([['5 4 1 8 2 6 8', 'FOUND\n', false], ['3 3 1 2 9', 'NOT_FOUND\n', true]])
        ),
        quiz: quiz('Tiền điều kiện quan trọng của binary_search là gì?', 'Range phải được sắp xếp theo cùng thứ tự so sánh.', 'Range phải được sắp xếp theo cùng comparator.', ['Range phải là list.', 'Mọi phần tử phải khác nhau.', 'Không cần iterator.'])
    },
    'CPP2-05.02': {
        targetSkillId: 'CPP-CACHE-01',
        exercise: exercise(
            'In giá trị duy nhất có thứ tự bằng std::set', 'MEDIUM',
            'Nhập n và n số nguyên. Lưu vào `std::set<int>` rồi in các giá trị duy nhất theo thứ tự tăng dần, cách nhau một dấu cách.',
            '#include <iostream>\n#include <set>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Chèn vào std::set và duyệt in.\n    }\n}\n',
            `#include <iostream>\n#include <set>\n\nint main() {\n    int n; if (std::cin >> n) {\n        std::set<int> values;\n        for (int i = 0, x; i < n; ++i) { std::cin >> x; values.insert(x); }\n        bool first = true; for (int x : values) { if (!first) std::cout << ' '; std::cout << x; first = false; }\n        std::cout << "\\n";\n    }\n}\n`,
            tests([['6 3 1 3 2 1 4', '1 2 3 4\n', false], ['1 5', '5\n', true]])
        ),
        quiz: quiz('std::set duy trì đặc tính nào?', 'Các khóa duy nhất được duyệt theo thứ tự so sánh.', 'Khóa duy nhất theo thứ tự so sánh.', ['Cho phép cùng khóa vô hạn.', 'Thứ tự duyệt luôn ngẫu nhiên.', 'Truy cập theo chỉ số O(1).'])
    },
    'CPP2-05.03': {
        targetSkillId: 'CPP-CACHE-01',
        exercise: exercise(
            'Đếm truy vấn bằng unordered_map', 'MEDIUM',
            'Nhập n, n số nguyên, sau đó là q. Dùng `std::unordered_map<int, int>` đếm tần suất và in số lần q xuất hiện. Không suy luận thứ tự từ khi duyệt unordered_map.',
            '#include <iostream>\n#include <unordered_map>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Đếm bằng unordered_map.\n    }\n}\n',
            '#include <iostream>\n#include <unordered_map>\n\nint main() {\n    int n; if (std::cin >> n) {\n        std::unordered_map<int, int> frequency;\n        for (int i = 0, x; i < n; ++i) { std::cin >> x; ++frequency[x]; }\n        int q; std::cin >> q;\n        std::cout << frequency[q] << "\\n";\n    }\n}\n',
            tests([['5 2 7 2 2 7 2', '3\n', false], ['3 1 2 3 9', '0\n', true]])
        ),
        quiz: quiz('Độ phức tạp tra cứu của unordered_map thường được mô tả thế nào?', 'Trung bình O(1), nhưng có thể O(n) trong trường hợp xấu.', 'Trung bình O(1), trường hợp xấu có thể O(n).', ['Luôn O(1) tuyệt đối.', 'Luôn O(log n).', 'Luôn O(n²).'])
    },
    'CPP2-06.01': {
        targetSkillId: 'CPP-BITWISE-01',
        exercise: exercise(
            'Kiểm tra một cờ trong bitmask', 'MEDIUM',
            'Nhập `flags` không âm và vị trí bit `b` (0–30). Dùng phép `&` và `(1u << b)` để in `SET` nếu bit b bật, ngược lại `CLEAR`.',
            '#include <iostream>\n\nint main() {\n    unsigned int flags, b;\n    if (std::cin >> flags >> b) {\n        // Kiểm tra bit bằng mask.\n    }\n}\n',
            '#include <iostream>\n\nint main() {\n    unsigned int flags, b;\n    if (std::cin >> flags >> b) {\n        const unsigned int mask = 1u << b;\n        std::cout << ((flags & mask) ? "SET" : "CLEAR") << "\\n";\n    }\n}\n',
            tests([['10 1', 'SET\n', false], ['10 0', 'CLEAR\n', true]])
        ),
        quiz: quiz('Vì sao dùng `1u << b` thay vì dịch một literal signed tùy tiện?', 'Để biểu đạt mask unsigned và tránh các giả định nguy hiểm về dịch bit có dấu.', 'Để biểu đạt mask unsigned an toàn hơn.', ['Để vector tự tăng size.', 'Để thay thế mọi phép toán số.', 'Để bỏ điều kiện biên.'])
    },
    'CPP2-06.02': {
        targetSkillId: 'CPP-EXC-01',
        exercise: exercise(
            'Bảo vệ phép chia bằng ngoại lệ', 'MEDIUM',
            'Nhập a và b. Viết hàm `divide` ném `std::runtime_error` nếu b bằng 0. Trong main, gọi hàm trong `try`, bắt `const std::exception&`; in thương nguyên hoặc `ERROR`.',
            '#include <exception>\n#include <iostream>\n#include <stdexcept>\n\nint divide(int a, int b) {\n    // throw nếu b == 0.\n}\n\nint main() {\n    // try/catch ở biên gọi.\n}\n',
            '#include <exception>\n#include <iostream>\n#include <stdexcept>\n\nint divide(int a, int b) {\n    if (b == 0) throw std::runtime_error("division by zero");\n    return a / b;\n}\n\nint main() {\n    int a, b; if (std::cin >> a >> b) {\n        try { std::cout << divide(a, b) << "\\n"; }\n        catch (const std::exception&) { std::cout << "ERROR\\n"; }\n    }\n}\n',
            tests([['9 3', '3\n', false], ['7 0', 'ERROR\n', false], ['-8 2', '-4\n', true]])
        ),
        quiz: quiz('Nên bắt đối tượng ngoại lệ chuẩn theo cách nào?', 'Bằng `const std::exception&` để tránh sao chép và giữ đa hình.', 'Bằng const reference để tránh sao chép và giữ đa hình.', ['Bằng value luôn luôn.', 'Bằng con trỏ thô.', 'Không cần catch.'])
    },
    'CPP2-06.03': {
        targetSkillId: 'CPP-SMARTPTR-01',
        exercise: exercise(
            'Sở hữu độc quyền với unique_ptr', 'HARD',
            'Nhập n. Dùng `std::make_unique<int>(n)` để tạo `std::unique_ptr<int>` và in bình phương giá trị. Không dùng `new` hoặc `delete` thủ công.',
            '#include <iostream>\n#include <memory>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        // Tạo unique_ptr bằng make_unique.\n    }\n}\n',
            '#include <iostream>\n#include <memory>\n\nint main() {\n    int n;\n    if (std::cin >> n) {\n        auto value = std::make_unique<int>(n);\n        std::cout << (*value) * (*value) << "\\n";\n    }\n}\n',
            tests([['7', '49\n', false], ['-3', '9\n', true]])
        ),
        quiz: quiz('unique_ptr biểu đạt quan hệ ownership nào?', 'Một đối tượng sở hữu độc quyền tài nguyên tại một thời điểm.', 'Sở hữu độc quyền tài nguyên.', ['Sở hữu vô hạn không cần hủy.', 'Mọi nơi cùng sở hữu.', 'Không sở hữu gì.'])
    }
};

export function getCppCanonicalAssessment(lessonId: string): CppCanonicalAssessment | undefined {
    return cppCanonicalAssessments[lessonId];
}

export function requireCppCanonicalAssessment(lessonId: string): CppCanonicalAssessment {
    const assessment = getCppCanonicalAssessment(lessonId);
    if (!assessment) {
        throw new Error(`Thiếu bộ đánh giá chuẩn, không thể nạp bài C++: ${lessonId}`);
    }
    return assessment;
}
