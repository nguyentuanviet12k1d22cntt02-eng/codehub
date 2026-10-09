import { prisma } from '../src/infrastructure/database/prisma';

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

const exercises: ExerciseDef[] = [
    // =========================================================================
    // CẤP ĐỘ DỄ (EASY) - 10 BÀI
    // =========================================================================
    {
        title: 'Lời chào lập trình viên C++',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Viết chương trình C++ in ra thông điệp chào mừng sau đây ra màn hình (mỗi câu nằm trên 1 dòng riêng biệt):
\`\`\`text
Chao mung ban den voi ngon ngu C++!
Phien ban chuan: C++17.
Chuc ban hoc tot!
\`\`\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Không có dữ liệu đầu vào.
* **Đầu ra (Output):** 3 dòng văn bản chính xác như mô tả.
* **Ràng buộc:** Bắt buộc sử dụng \`std::cout\` và ký tự xuống dòng \`'\\n'\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
(Không có đầu vào)
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
Chao mung ban den voi ngon ngu C++!
Phien ban chuan: C++17.
Chuc ban hoc tot!
\`\`\`

**Giải thích:** Chương trình in lần lượt 3 dòng chữ ra màn hình console và kết thúc bằng \`return 0;\`.`,
        starterCode: `#include <iostream>

int main() {
    // Viết các câu lệnh std::cout của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    std::cout << "Chao mung ban den voi ngon ngu C++!\n";
    std::cout << "Phien ban chuan: C++17.\n";
    std::cout << "Chuc ban hoc tot!\n";
    return 0;
}
`,
        testCases: [
            { input: '', expectedOutput: 'Chao mung ban den voi ngon ngu C++!\nPhien ban chuan: C++17.\nChuc ban hoc tot!\n', isHidden: false }
        ]
    },
    {
        title: 'Tính tổng, hiệu và tích của hai số nguyên',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Nhập vào hai số nguyên a và b từ bàn phím. Hãy tính và in ra:
* Dòng 1: Tổng của a và b (a + b)
* Dòng 2: Hiệu của a trừ b (a - b)
* Dòng 3: Tích của a và b (a * b)

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên a và b cách nhau bởi dấu cách (-10000 <= a, b <= 10000).
* **Đầu ra (Output):** 3 dòng tương ứng lần lượt là tổng, hiệu và tích.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
12 5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
17
7
60
\`\`\`

**Giải thích chi tiết:**
* Tổng: 12 + 5 = 17
* Hiệu: 12 - 5 = 7
* Tích: 12 * 5 = 60`,
        starterCode: `#include <iostream>

int main() {
    int a = 0, b = 0;
    // Nhập dữ liệu và thực hiện tính toán:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int a = 0, b = 0;
    std::cin >> a >> b;
    std::cout << a + b << '\n';
    std::cout << a - b << '\n';
    std::cout << a * b << '\n';
    return 0;
}
`,
        testCases: [
            { input: '12 5\n', expectedOutput: '17\n7\n60\n', isHidden: false },
            { input: '0 0\n', expectedOutput: '0\n0\n0\n', isHidden: false },
            { input: '-10 15\n', expectedOutput: '5\n-25\n-150\n', isHidden: true }
        ]
    },
    {
        title: 'Chu vi và Diện tích Hình chữ nhật',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Một mảnh đất hình chữ nhật có chiều dài d và chiều rộng r là các số nguyên dương. Hãy viết chương trình tính chu vi và diện tích mảnh đất.
* Chu vi = 2 * (d + r)
* Diện tích = d * r

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương d và r cách nhau bởi dấu cách (1 <= d, r <= 1000).
* **Đầu ra (Output):** Chu vi và diện tích in trên cùng một dòng, cách nhau một khoảng trắng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
8 5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
26 40
\`\`\`

**Giải thích chi tiết:**
* Chu vi = 2 * (8 + 5) = 2 * 13 = 26.
* Diện tích = 8 * 5 = 40.`,
        starterCode: `#include <iostream>

int main() {
    int d = 0, r = 0;
    // Nhập d, r và tính chu vi, diện tích:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int d = 0, r = 0;
    std::cin >> d >> r;
    int chuVi = 2 * (d + r);
    int dienTich = d * r;
    std::cout << chuVi << " " << dienTich << '\n';
    return 0;
}
`,
        testCases: [
            { input: '8 5\n', expectedOutput: '26 40\n', isHidden: false },
            { input: '10 20\n', expectedOutput: '60 200\n', isHidden: false },
            { input: '100 100\n', expectedOutput: '400 10000\n', isHidden: true }
        ]
    },
    {
        title: 'Phép chia lấy nguyên và chia lấy dư (Chia kẹo)',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Cô giáo có N cái kẹo cần chia đều cho K bạn học sinh. Em hãy tính xem mỗi bạn được nhận bao nhiêu cái kẹo trọn vẹn và còn thừa lại bao nhiêu cái không thể chia đều.
* Sử dụng toán tử chia nguyên \`/\` để lấy số kẹo mỗi bạn.
* Sử dụng toán tử chia lấy dư \`%\` để lấy số kẹo còn thừa.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương N và K (K > 0, N >= 0).
* **Đầu ra (Output):** Hai số nguyên cách nhau một khoảng trắng: số kẹo mỗi bạn nhận và số kẹo còn dư.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
27 5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
5 2
\`\`\`

**Giải thích chi tiết:**
* 27 chia 5 được thương là 5 (mỗi bạn nhận 5 cái kẹo).
* 27 chia 5 dư 2 (còn thừa 2 cái kẹo không thể chia tiếp).`,
        starterCode: `#include <iostream>

int main() {
    int n = 0, k = 0;
    // Nhập n, k và in kết quả chia nguyên, chia dư:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0, k = 0;
    std::cin >> n >> k;
    std::cout << n / k << " " << n % k << '\n';
    return 0;
}
`,
        testCases: [
            { input: '27 5\n', expectedOutput: '5 2\n', isHidden: false },
            { input: '10 2\n', expectedOutput: '5 0\n', isHidden: false },
            { input: '100 7\n', expectedOutput: '14 2\n', isHidden: true }
        ]
    },
    {
        title: 'Cập nhật biến với toán tử gán rút gọn',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Ban đầu bạn có tài khoản tiết kiệm với số tiền S nghìn đồng.
1. Bạn được thưởng thêm X nghìn đồng (\`S += X\`).
2. Bạn mua đồ dùng học tập hết Y nghìn đồng (\`S -= Y\`).
3. Số tiền còn lại được ngân hàng nhân đôi lên nhân dịp khuyến mãi (\`S *= 2\`).
Hãy in ra số tiền cuối cùng trong tài khoản.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên S, X, Y (S, X, Y >= 0, S + X >= Y).
* **Đầu ra (Output):** Một số nguyên duy nhất là số tiền sau 3 bước cập nhật.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
100 50 30
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
240
\`\`\`

**Giải thích chi tiết:**
* Ban đầu S = 100.
* Thưởng thêm 50: S = 100 + 50 = 150.
* Tiêu dùng 30: S = 150 - 30 = 120.
* Nhân đôi: S = 120 * 2 = 240 nghìn đồng.`,
        starterCode: `#include <iostream>

int main() {
    int s = 0, x = 0, y = 0;
    // Nhập s, x, y và dùng toán tử +=, -=, *=:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int s = 0, x = 0, y = 0;
    std::cin >> s >> x >> y;
    s += x;
    s -= y;
    s *= 2;
    std::cout << s << '\n';
    return 0;
}
`,
        testCases: [
            { input: '100 50 30\n', expectedOutput: '240\n', isHidden: false },
            { input: '50 10 20\n', expectedOutput: '80\n', isHidden: false },
            { input: '0 100 25\n', expectedOutput: '150\n', isHidden: true }
        ]
    },
    {
        title: 'Đổi nhiệt độ từ Celsius sang Fahrenheit',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Viết chương trình nhập vào nhiệt độ C (độ Celsius). Hãy chuyển đổi và in ra nhiệt độ tương ứng theo thang độ Fahrenheit (F).
* Công thức chuyển đổi: \`F = C * 1.8 + 32\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực C (kiểu \`double\`).
* **Đầu ra (Output):** Một số thực F kết quả.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
25.5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
77.9
\`\`\`

**Giải thích chi tiết:**
\`F = 25.5 * 1.8 + 32 = 45.9 + 32 = 77.9\` độ Fahrenheit.`,
        starterCode: `#include <iostream>

int main() {
    double c = 0.0;
    // Nhập c và tính f:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    double c = 0.0;
    std::cin >> c;
    double f = c * 1.8 + 32.0;
    std::cout << f << '\n';
    return 0;
}
`,
        testCases: [
            { input: '25.5\n', expectedOutput: '77.9\n', isHidden: false },
            { input: '0\n', expectedOutput: '32\n', isHidden: false },
            { input: '100\n', expectedOutput: '212\n', isHidden: true }
        ]
    },
    {
        title: 'Tìm ký tự liền sau trong bảng mã ASCII',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Nhập vào một ký tự chữ cái thường c (từ \`'a'\` đến \`'y'\`). Hãy in ra ký tự đứng ngay sau nó trong bảng chữ cái tiếng Anh bằng cách sử dụng toán tử tăng \`++c\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự c kiểu \`char\`.
* **Đầu ra (Output):** Ký tự liền sau c.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
m
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
n
\`\`\`

**Giải thích chi tiết:**
Ký tự đứng ngay sau chữ \`'m'\` là chữ \`'n'\` (mã ASCII của 'm' là 109, tăng lên 1 thành 110 là mã của 'n').`,
        starterCode: `#include <iostream>

int main() {
    char c = ' ';
    // Nhập c và dùng toán tử tăng ++c:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    char c = ' ';
    std::cin >> c;
    c++;
    std::cout << c << '\n';
    return 0;
}
`,
        testCases: [
            { input: 'm\n', expectedOutput: 'n\n', isHidden: false },
            { input: 'a\n', expectedOutput: 'b\n', isHidden: false },
            { input: 'x\n', expectedOutput: 'y\n', isHidden: true }
        ]
    },
    {
        title: 'Khám phá kiểu Logic (bool)',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Viết chương trình khai báo một biến \`bool\` mang tên \`daHoanThanhBaiHoc\` gán giá trị \`true\`, và một biến \`bool\` mang tên \`canXemLai\` gán giá trị \`false\`. Xuất giá trị của hai biến ra màn hình trên cùng một dòng cách nhau bởi dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Không có dữ liệu đầu vào.
* **Đầu ra (Output):** Giá trị số nguyên đại diện cho \`true\` và \`false\` trong C++.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
(Không có đầu vào)
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
1 0
\`\`\`

**Giải thích chi tiết:** Trong C++, giá trị logic \`true\` được xuất thành số \`1\`, còn giá trị \`false\` được xuất thành số \`0\`.`,
        starterCode: `#include <iostream>

int main() {
    // Khai báo 2 biến bool và in ra màn hình:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    bool daHoanThanhBaiHoc = true;
    bool canXemLai = false;
    std::cout << daHoanThanhBaiHoc << " " << canXemLai << '\n';
    return 0;
}
`,
        testCases: [
            { input: '', expectedOutput: '1 0\n', isHidden: false }
        ]
    },
    {
        title: 'Hằng số tính Chu vi và Diện tích Hình tròn',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Nhập vào bán kính R (R > 0) của một hình tròn. Định nghĩa hằng số \`PI = 3.14159\` bằng từ khóa \`const double\`. Hãy tính chu vi và diện tích của hình tròn.
* Chu vi = \`2 * PI * R\`
* Diện tích = \`PI * R * R\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực R (kiểu \`double\`).
* **Đầu ra (Output):** Chu vi và diện tích in trên 2 dòng riêng biệt.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
4.5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
28.2743
63.6172
\`\`\`

**Giải thích chi tiết:**
* Chu vi = 2 * 3.14159 * 4.5 = 28.2743
* Diện tích = 3.14159 * 4.5 * 4.5 = 63.6172`,
        starterCode: `#include <iostream>

int main() {
    const double PI = 3.14159;
    double r = 0.0;
    // Nhập r và tính chu vi, diện tích:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    const double PI = 3.14159;
    double r = 0.0;
    std::cin >> r;
    std::cout << 2 * PI * r << '\n';
    std::cout << PI * r * r << '\n';
    return 0;
}
`,
        testCases: [
            { input: '4.5\n', expectedOutput: '28.2743\n63.6172\n', isHidden: false },
            { input: '1.0\n', expectedOutput: '6.28318\n3.14159\n', isHidden: true }
        ]
    },
    {
        title: 'Hoán đổi giá trị hai biến dùng biến trung gian',
        difficulty: 'EASY',
        problemDescription: `### Đề bài:
Nhập vào hai số nguyên A và B. Hãy hoán đổi giá trị của A và B cho nhau (bằng cách dùng một biến tạm \`temp\`), sau đó in ra giá trị mới của A và B trên cùng một dòng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên A, B cách nhau bởi dấu cách.
* **Đầu ra (Output):** Hai số A, B sau khi đã đổi chỗ.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
10 99
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
99 10
\`\`\`

**Giải thích chi tiết:**
Biến tạm \`temp\` lưu giữ giá trị 10 của A, sau đó gán A = B (99), rồi gán B = temp (10). Kết quả A và B đã hoán đổi hoàn hảo.`,
        starterCode: `#include <iostream>

int main() {
    int a = 0, b = 0;
    // Nhập a, b và hoán đổi giá trị:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int a = 0, b = 0;
    std::cin >> a >> b;
    int temp = a;
    a = b;
    b = temp;
    std::cout << a << " " << b << '\n';
    return 0;
}
`,
        testCases: [
            { input: '10 99\n', expectedOutput: '99 10\n', isHidden: false },
            { input: '5 -7\n', expectedOutput: '-7 5\n', isHidden: false },
            { input: '100 0\n', expectedOutput: '0 100\n', isHidden: true }
        ]
    },

    // =========================================================================
    // CẤP ĐỘ TRUNG BÌNH (MEDIUM) - 10 BÀI
    // =========================================================================
    {
        title: 'Điểm trung bình ba môn (Bẫy chia số nguyên)',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Nhập vào điểm thi 3 môn Toán, Văn, Anh của một học sinh là các số nguyên từ 0 đến 10. Hãy tính và in ra điểm trung bình cộng của 3 môn dưới dạng số thực \`double\`.

### Lưu ý cạm bẫy:
Nếu viết \`(toan + van + anh) / 3\`, C++ sẽ thực hiện phép chia nguyên và vứt bỏ phần thập phân. Hãy sử dụng ép kiểu \`static_cast<double>\` hoặc chia cho \`3.0\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên cách nhau một khoảng trắng.
* **Đầu ra (Output):** Một số thực duy nhất là điểm trung bình cộng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
8 7 8
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
7.66667
\`\`\`

**Giải thích chi tiết:**
Tổng điểm = 8 + 7 + 8 = 23. Điểm trung bình = 23 / 3 = 7.66667.`,
        starterCode: `#include <iostream>

int main() {
    int toan = 0, van = 0, anh = 0;
    // Nhập điểm và tính điểm trung bình số thực:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int toan = 0, van = 0, anh = 0;
    std::cin >> toan >> van >> anh;
    double tb = static_cast<double>(toan + van + anh) / 3.0;
    std::cout << tb << '\n';
    return 0;
}
`,
        testCases: [
            { input: '8 7 8\n', expectedOutput: '7.66667\n', isHidden: false },
            { input: '9 9 9\n', expectedOutput: '9\n', isHidden: false },
            { input: '5 6 7\n', expectedOutput: '6\n', isHidden: true }
        ]
    },
    {
        title: 'Đổi thời gian từ Giây sang Giờ - Phút - Giây',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Nhập vào tổng số giây N (N >= 0). Hãy quy đổi thời gian trên thành số giờ, số phút và số giây tương ứng.
* 1 giờ = 3600 giây
* 1 phút = 60 giây

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (0 <= N <= 86400).
* **Đầu ra (Output):** Ba số nguyên lần lượt là Giờ, Phút, Giây cách nhau bởi dấu hai chấm \`:\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
3754
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
1:2:34
\`\`\`

**Giải thích chi tiết:**
* 3754 / 3600 = 1 giờ, số giây còn lại là 3754 % 3600 = 154 giây.
* 154 / 60 = 2 phút, số giây còn lại là 154 % 60 = 34 giây.
* Kết quả định dạng: 1:2:34.`,
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    // Nhập n và tách giờ, phút, giây bằng toán tử / và %:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int gio = n / 3600;
    int duGiay = n % 3600;
    int phut = duGiay / 60;
    int giay = duGiay % 60;
    std::cout << gio << ":" << phut << ":" << giay << '\n';
    return 0;
}
`,
        testCases: [
            { input: '3754\n', expectedOutput: '1:2:34\n', isHidden: false },
            { input: '3600\n', expectedOutput: '1:0:0\n', isHidden: false },
            { input: '86399\n', expectedOutput: '23:59:59\n', isHidden: true }
        ]
    },
    {
        title: 'Tách và tính tổng các chữ số của số có 3 chữ số',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Nhập vào số nguyên dương N có đúng 3 chữ số (100 <= N <= 999). Hãy bóc tách chữ số hàng trăm, hàng chục, hàng đơn vị và in ra tổng của 3 chữ số này.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N.
* **Đầu ra (Output):** Một số nguyên duy nhất là tổng các chữ số.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
845
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
17
\`\`\`

**Giải thích chi tiết:**
* Hàng trăm: 845 / 100 = 8.
* Hàng chục: (845 / 10) % 10 = 84 % 10 = 4.
* Hàng đơn vị: 845 % 10 = 5.
* Tổng = 8 + 4 + 5 = 17.`,
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    // Nhập n và tách từng hàng bằng / và %:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int tram = n / 100;
    int chuc = (n / 10) % 10;
    int donVi = n % 10;
    std::cout << tram + chuc + donVi << '\n';
    return 0;
}
`,
        testCases: [
            { input: '845\n', expectedOutput: '17\n', isHidden: false },
            { input: '100\n', expectedOutput: '1\n', isHidden: false },
            { input: '999\n', expectedOutput: '27\n', isHidden: true }
        ]
    },
    {
        title: 'Đảo ngược số nguyên có 2 chữ số',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Nhập vào một số nguyên dương N có 2 chữ số (10 <= N <= 99). Hãy tạo ra và in ra số đảo ngược của N.
* Ví dụ: 73 đảo ngược thành 37.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N có 2 chữ số.
* **Đầu ra (Output):** Số nguyên đảo ngược.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
73
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
37
\`\`\`

**Giải thích chi tiết:**
Số 73 có hàng chục là 7, hàng đơn vị là 3. Số đảo ngược là \`3 * 10 + 7 = 37\`.`,
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    // Nhập n và in số đảo ngược:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int chuc = n / 10;
    int donVi = n % 10;
    std::cout << donVi * 10 + chuc << '\n';
    return 0;
}
`,
        testCases: [
            { input: '73\n', expectedOutput: '37\n', isHidden: false },
            { input: '50\n', expectedOutput: '5\n', isHidden: false },
            { input: '91\n', expectedOutput: '19\n', isHidden: true }
        ]
    },
    {
        title: 'Đổi ký tự thường sang ký tự hoa bằng mã ASCII',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Trong bảng mã ASCII, mã của chữ thường luôn lớn hơn mã của chữ hoa tương ứng đúng 32 đơn vị (ví dụ \`'a'\` là 97, \`'A'\` là 65).
Nhập vào một ký tự thường c (từ \`'a'\` đến \`'z'\`), hãy in ra ký tự in hoa tương ứng mà không dùng hàm thư viện.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự thường c.
* **Đầu ra (Output):** Ký tự in hoa tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
g
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
G
\`\`\`

**Giải thích chi tiết:**
Lấy mã ASCII của \`'g'\` trừ đi 32 và ép kiểu về \`char\`: \`static_cast<char>('g' - 32)\` cho ra kết quả \`'G'\`.`,
        starterCode: `#include <iostream>

int main() {
    char c = ' ';
    // Nhập c và trừ đi 32:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    char c = ' ';
    std::cin >> c;
    char hoa = static_cast<char>(c - 32);
    std::cout << hoa << '\n';
    return 0;
}
`,
        testCases: [
            { input: 'g\n', expectedOutput: 'G\n', isHidden: false },
            { input: 'a\n', expectedOutput: 'A\n', isHidden: false },
            { input: 'z\n', expectedOutput: 'Z\n', isHidden: true }
        ]
    },
    {
        title: 'Tính cước viễn thông và thuế VAT',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Một thuê bao điện thoại có cước hàng tháng như sau:
* Phí thuê bao cố định: 25000 VNĐ.
* Mỗi phút gọi tốn 1200 VNĐ.
* Thuế giá trị gia tăng (VAT): 10% trên tổng cước phí dịch vụ.
Nhập vào số phút gọi m trong tháng (m >= 0). Hãy tính tổng số tiền (bao gồm VAT) khách hàng phải thanh toán.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Số phút gọi m (số nguyên >= 0).
* **Đầu ra (Output):** Tổng số tiền cước thanh toán.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
50
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
93500
\`\`\`

**Giải thích chi tiết:**
* Cước dịch vụ: 25000 + 50 * 1200 = 85000 VNĐ.
* Thuế VAT 10%: 8500 VNĐ.
* Tổng tiền phải trả: 85000 + 8500 = 93500 VNĐ.`,
        starterCode: `#include <iostream>

int main() {
    int m = 0;
    // Nhập m và tính cước phí có VAT:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int m = 0;
    std::cin >> m;
    int cuoc = 25000 + m * 1200;
    double tong = cuoc * 1.10;
    std::cout << tong << '\n';
    return 0;
}
`,
        testCases: [
            { input: '50\n', expectedOutput: '93500\n', isHidden: false },
            { input: '0\n', expectedOutput: '27500\n', isHidden: false },
            { input: '100\n', expectedOutput: '159500\n', isHidden: true }
        ]
    },
    {
        title: 'Tính tiền mua xăng và tiền thừa hoàn lại',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Bác Nam mang M đồng vào cây xăng để mua L lít xăng với đơn giá P đồng/lít.
Hãy tính:
1. Số tiền bác Nam cần trả cho lượng xăng đã mua (lấy phần nguyên).
2. Số tiền thừa nhân viên cần hoàn trả.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số M (số nguyên), L (số thực), P (số nguyên) trên cùng một dòng.
* **Đầu ra (Output):** Tiền xăng và tiền thừa cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
200000 7.5 24000
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
180000 20000
\`\`\`

**Giải thích chi tiết:**
* Tiền xăng: 7.5 * 24000 = 180000 VNĐ.
* Tiền thừa trả lại: 200000 - 180000 = 20000 VNĐ.`,
        starterCode: `#include <iostream>

int main() {
    long long m = 0;
    double l = 0.0;
    long long p = 0;
    // Nhập dữ liệu và tính toán:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long m = 0;
    double l = 0.0;
    long long p = 0;
    std::cin >> m >> l >> p;
    long long tienXang = static_cast<long long>(l * p);
    long long tienThua = m - tienXang;
    std::cout << tienXang << " " << tienThua << '\n';
    return 0;
}
`,
        testCases: [
            { input: '200000 7.5 24000\n', expectedOutput: '180000 20000\n', isHidden: false },
            { input: '100000 4.0 25000\n', expectedOutput: '100000 0\n', isHidden: false },
            { input: '500000 10.5 20000\n', expectedOutput: '210000 290000\n', isHidden: true }
        ]
    },
    {
        title: 'Thấu hiểu toán tử Tiền tố và Hậu tố (++x vs x++)',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Cho biến nguyên x được nhập từ bàn phím.
1. Tính y = x++ * 2.
2. Tiếp tục tính z = ++x * 2.
In ra giá trị của y, z và giá trị cuối cùng của x trên cùng một dòng cách nhau bởi dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên x.
* **Đầu ra (Output):** Ba số nguyên y, z, x cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
10 14 7
\`\`\`

**Giải thích chi tiết:**
* Ban đầu x = 5.
* \`y = x++ * 2\`: Lấy giá trị x = 5 đem nhân 2 ra y = 10, sau đó x tăng lên 6.
* \`z = ++x * 2\`: x tăng từ 6 lên 7 trước, sau đó nhân 2 ra z = 14.
* Giá trị cuối cùng của x là 7.`,
        starterCode: `#include <iostream>

int main() {
    int x = 0;
    // Nhập x và thực hiện theo đúng thứ tự đề bài:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int x = 0;
    std::cin >> x;
    int y = x++ * 2;
    int z = ++x * 2;
    std::cout << y << " " << z << " " << x << '\n';
    return 0;
}
`,
        testCases: [
            { input: '5\n', expectedOutput: '10 14 7\n', isHidden: false },
            { input: '1\n', expectedOutput: '2 6 3\n', isHidden: false },
            { input: '10\n', expectedOutput: '20 24 12\n', isHidden: true }
        ]
    },
    {
        title: 'Tính lương thực lĩnh sau thuế và bảo hiểm',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Lương thực lĩnh của nhân viên được tính như sau:
* Lương gộp = Lương cơ bản * Hệ số lương.
* Trừ bảo hiểm xã hội bắt buộc: 10.5% của Lương gộp.
* Trừ thuế thu nhập cá nhân: 5% của Lương gộp.
(Tổng các khoản trích trừ là 15.5%).
Nhập vào Lương cơ bản (số nguyên) và Hệ số lương (số thực). Hãy tính và in ra Lương thực lĩnh.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Lương cơ bản (nguyên) và Hệ số lương (thực) cách nhau một khoảng trắng.
* **Đầu ra (Output):** Lương thực lĩnh (số thực).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
10000000 1.5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
12675000
\`\`\`

**Giải thích chi tiết:**
* Lương gộp: 10000000 * 1.5 = 15000000 VNĐ.
* Tổng trích trừ (15.5%): 15000000 * 0.155 = 2325000 VNĐ.
* Lương thực lĩnh: 15000000 - 2325000 = 12675000 VNĐ.`,
        starterCode: `#include <iostream>

int main() {
    long long luongCoBan = 0;
    double heSo = 0.0;
    // Nhập dữ liệu và tính thực lĩnh:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long luongCoBan = 0;
    double heSo = 0.0;
    std::cin >> luongCoBan >> heSo;
    double luongGop = luongCoBan * heSo;
    double thucLinh = luongGop * (1.0 - 0.155);
    std::cout << thucLinh << '\n';
    return 0;
}
`,
        testCases: [
            { input: '10000000 1.5\n', expectedOutput: '12675000\n', isHidden: false },
            { input: '8000000 1.0\n', expectedOutput: '6760000\n', isHidden: false },
            { input: '20000000 2.0\n', expectedOutput: '33800000\n', isHidden: true }
        ]
    },
    {
        title: 'Bình phương khoảng cách hình học phẳng',
        difficulty: 'MEDIUM',
        problemDescription: `### Đề bài:
Trong mặt phẳng tọa độ Oxy, cho 2 điểm A(x1, y1) và B(x2, y2) có tọa độ nguyên. Hãy tính và in ra bình phương khoảng cách Euclidean giữa hai điểm:
\`d^2 = (x2 - x1)^2 + (y2 - y1)^2\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Bốn số nguyên x1, y1, x2, y2 cách nhau một khoảng trắng.
* **Đầu ra (Output):** Một số nguyên là bình phương khoảng cách giữa hai điểm.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
1 2 4 6
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
25
\`\`\`

**Giải thích chi tiết:**
* dx = 4 - 1 = 3
* dy = 6 - 2 = 4
* d^2 = 3 * 3 + 4 * 4 = 9 + 16 = 25.`,
        starterCode: `#include <iostream>

int main() {
    int x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    // Nhập tọa độ và tính bình phương khoảng cách:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    std::cin >> x1 >> y1 >> x2 >> y2;
    int dx = x2 - x1;
    int dy = y2 - y1;
    std::cout << dx * dx + dy * dy << '\n';
    return 0;
}
`,
        testCases: [
            { input: '1 2 4 6\n', expectedOutput: '25\n', isHidden: false },
            { input: '0 0 3 4\n', expectedOutput: '25\n', isHidden: false },
            { input: '-1 -1 2 3\n', expectedOutput: '25\n', isHidden: true }
        ]
    },

    // =========================================================================
    // CẤP ĐỘ KHÓ / THỬ THÁCH (HARD) - 10 BÀI
    // =========================================================================
    {
        title: 'Tích số nguyên cực lớn & Cạm bẫy Tràn số (Integer Overflow)',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Nhập vào hai số nguyên dương a và b (1 <= a, b <= 1,000,000,000). Hãy tính và in ra tích \`a * b\`.

### Cạm bẫy tràn số ô nhớ:
Tích có thể đạt 10^18, vượt xa giới hạn tối đa của kiểu \`int\` 32-bit (khoảng 2 tỷ). Nếu khai báo biến kiểu \`int\` chương trình sẽ bị tràn số và in ra số âm ngẫu nhiên. Hãy khai báo biến bằng kiểu số nguyên 64-bit \`long long\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên a, b (1 <= a, b <= 10^9).
* **Đầu ra (Output):** Tích của hai số.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
1000000000 1000000000
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
1000000000000000000
\`\`\`

**Giải thích chi tiết:**
Tích của 10^9 và 10^9 là 10^18, cần biến \`long long\` 64-bit để lưu trữ chính xác.`,
        starterCode: `#include <iostream>

int main() {
    // Chú ý chọn kiểu dữ liệu phù hợp để tránh tràn số:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long a = 0, b = 0;
    std::cin >> a >> b;
    std::cout << a * b << '\n';
    return 0;
}
`,
        testCases: [
            { input: '1000000000 1000000000\n', expectedOutput: '1000000000000000000\n', isHidden: false },
            { input: '123456789 987654321\n', expectedOutput: '121932631112635269\n', isHidden: false },
            { input: '2000000000 3\n', expectedOutput: '6000000000\n', isHidden: true }
        ]
    },
    {
        title: 'Tổng dãy số tự nhiên từ 1 đến N (Công thức Gauss)',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Nhập vào số nguyên dương N (1 <= N <= 1,000,000,000). Hãy tính tổng các số tự nhiên từ 1 đến N:
\`S = 1 + 2 + 3 + ... + N = N * (N + 1) / 2\`

### Ràng buộc kỹ thuật:
Không sử dụng vòng lặp. Lưu ý tích \`N * (N + 1)\` có thể đạt 10^18 nên bắt buộc phải tính toán trong kiểu \`long long\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (1 <= N <= 10^9).
* **Đầu ra (Output):** Tổng các số từ 1 đến N.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
1000000
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
500000500000
\`\`\`

**Giải thích chi tiết:**
\`S = 1000000 * 1000001 / 2 = 500,000,500,000\`.`,
        starterCode: `#include <iostream>

int main() {
    long long n = 0;
    // Nhập n và áp dụng công thức Gauss:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long n = 0;
    std::cin >> n;
    long long tong = n * (n + 1) / 2;
    std::cout << tong << '\n';
    return 0;
}
`,
        testCases: [
            { input: '1000000\n', expectedOutput: '500000500000\n', isHidden: false },
            { input: '10\n', expectedOutput: '55\n', isHidden: false },
            { input: '1000000000\n', expectedOutput: '500000000500000000\n', isHidden: true }
        ]
    },
    {
        title: 'Bài toán Chia trần (Ceil Division) không dùng thư viện và if',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Một đoàn du lịch có N người. Mỗi chiếc xe chở được tối đa K người. Hãy tính số xe tối thiểu cần thuê để chở hết tất cả mọi người (kể cả xe cuối chỉ có 1 người thì vẫn phải tính là 1 xe).
* Công thức làm tròn lên (Ceiling Division) của hai số nguyên dương N và K không dùng \`if\` hay hàm thư viện:
\`Số xe = (N + K - 1) / K\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương N và K (K > 0).
* **Đầu ra (Output):** Số lượng xe ít nhất cần thuê.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
31 10
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
4
\`\`\`

**Giải thích chi tiết:**
* Đoàn có 31 người, xe chở tối đa 10 người.
* 3 xe đầu chở được 30 người, còn dư 1 người bắt buộc phải thuê thêm 1 xe nữa.
* Tổng số xe cần thuê là 4 xe.
* Áp dụng công thức: \`(31 + 10 - 1) / 10 = 40 / 10 = 4\` xe.`,
        starterCode: `#include <iostream>

int main() {
    long long n = 0, k = 0;
    // Áp dụng công thức chia trần:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long n = 0, k = 0;
    std::cin >> n >> k;
    long long soXe = (n + k - 1) / k;
    std::cout << soXe << '\n';
    return 0;
}
`,
        testCases: [
            { input: '31 10\n', expectedOutput: '4\n', isHidden: false },
            { input: '30 10\n', expectedOutput: '3\n', isHidden: false },
            { input: '1 10\n', expectedOutput: '1\n', isHidden: true }
        ]
    },
    {
        title: 'Đổi tiền theo cơ số tối ưu (Không dùng vòng lặp)',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Một máy ATM chi trả số tiền T nghìn đồng (với T là bội số của 10). Máy có 5 loại mệnh giá: 500k, 200k, 100k, 50k, và 10k.
Hãy xác định số tờ tiền của từng loại mệnh giá sao cho tổng số tờ tiền là ít nhất có thể (dùng phép chia lấy nguyên và chia lấy dư liên tiếp).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên T (nghìn đồng, T >= 10).
* **Đầu ra (Output):** 5 số nguyên cách nhau một khoảng trắng biểu thị số tờ lần lượt của: 500k, 200k, 100k, 50k, 10k.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
880
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
1 1 1 1 3
\`\`\`

**Giải thích chi tiết:**
* 880 / 500 = 1 tờ 500k, còn dư 380k.
* 380 / 200 = 1 tờ 200k, còn dư 180k.
* 180 / 100 = 1 tờ 100k, còn dư 80k.
* 80 / 50 = 1 tờ 50k, còn dư 30k.
* 30 / 10 = 3 tờ 10k, còn dư 0k.`,
        starterCode: `#include <iostream>

int main() {
    long long t = 0;
    // Nhập t và phân rã cơ số mệnh giá tiền:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long t = 0;
    std::cin >> t;
    long long to500 = t / 500; t %= 500;
    long long to200 = t / 200; t %= 200;
    long long to100 = t / 100; t %= 100;
    long long to50 = t / 50; t %= 50;
    long long to10 = t / 10;
    std::cout << to500 << " " << to200 << " " << to100 << " " << to50 << " " << to10 << '\n';
    return 0;
}
`,
        testCases: [
            { input: '880\n', expectedOutput: '1 1 1 1 3\n', isHidden: false },
            { input: '500\n', expectedOutput: '1 0 0 0 0\n', isHidden: false },
            { input: '370\n', expectedOutput: '0 1 1 1 2\n', isHidden: true }
        ]
    },
    {
        title: 'Trích xuất chữ số và đối xứng số 4 chữ số',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Nhập vào một số nguyên dương N có đúng 4 chữ số (1000 <= N <= 9999).
Gọi các chữ số từ trái sang phải lần lượt là d1, d2, d3, d4. Hãy tính hiệu số:
\`KetQua = (d1 + d3) - (d2 + d4)\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N có đúng 4 chữ số.
* **Đầu ra (Output):** Một số nguyên là hiệu số tính được.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
3852
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
-2
\`\`\`

**Giải thích chi tiết:**
* d1 = 3, d2 = 8, d3 = 5, d4 = 2.
* Tổng vị trí lẻ: d1 + d3 = 3 + 5 = 8.
* Tổng vị trí chẵn: d2 + d4 = 8 + 2 = 10.
* Hiệu số = 8 - 10 = -2.`,
        starterCode: `#include <iostream>

int main() {
    int n = 0;
    // Tách 4 chữ số và tính hiệu:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    int n = 0;
    std::cin >> n;
    int d1 = n / 1000;
    int d2 = (n / 100) % 10;
    int d3 = (n / 10) % 10;
    int d4 = n % 10;
    std::cout << (d1 + d3) - (d2 + d4) << '\n';
    return 0;
}
`,
        testCases: [
            { input: '3852\n', expectedOutput: '-2\n', isHidden: false },
            { input: '1234\n', expectedOutput: '-2\n', isHidden: false },
            { input: '9182\n', expectedOutput: '14\n', isHidden: true }
        ]
    },
    {
        title: 'Tối ưu tính giá trị đa thức bậc 3 (Lược đồ Horner)',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Cho đa thức bậc 3: \`P(x) = a * x^3 + b * x^2 + c * x + d\`. Nhập vào các hệ số nguyên a, b, c, d và giá trị x.
Hãy tính giá trị P(x) bằng lược đồ Horner nhằm tối ưu số phép tính nhân:
\`P(x) = ((a * x + b) * x + c) * x + d\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** 5 số nguyên a, b, c, d, x trên cùng một dòng cách nhau bởi dấu cách.
* **Đầu ra (Output):** Giá trị của đa thức P(x).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
2 3 -4 5 2
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
25
\`\`\`

**Giải thích chi tiết:**
* Thay x = 2: P(2) = 2*(2^3) + 3*(2^2) - 4*(2) + 5 = 16 + 12 - 8 + 5 = 25.
* Tính theo Horner: ((2*2 + 3)*2 - 4)*2 + 5 = (7*2 - 4)*2 + 5 = 10*2 + 5 = 25.`,
        starterCode: `#include <iostream>

int main() {
    long long a = 0, b = 0, c = 0, d = 0, x = 0;
    // Nhập dữ liệu và tính theo công thức Horner:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long a = 0, b = 0, c = 0, d = 0, x = 0;
    std::cin >> a >> b >> c >> d >> x;
    long long p = ((a * x + b) * x + c) * x + d;
    std::cout << p << '\n';
    return 0;
}
`,
        testCases: [
            { input: '2 3 -4 5 2\n', expectedOutput: '25\n', isHidden: false },
            { input: '1 0 0 0 3\n', expectedOutput: '27\n', isHidden: false },
            { input: '1 1 1 1 1\n', expectedOutput: '4\n', isHidden: true }
        ]
    },
    {
        title: 'Mã hóa Caesar cho 1 chữ cái bằng phép Modulo xoay vòng',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Trong mật mã Caesar, một chữ cái in hoa được mã hóa bằng cách dịch chuyển nó về phía sau K vị trí trong bảng 26 chữ cái tiếng Anh (từ \`'A'\` đến \`'Z'\`). Nếu dịch vượt quá chữ \`'Z'\`, nó sẽ tự động quay trở lại đầu bảng là chữ \`'A'\`.
Nhập vào một ký tự in hoa c và số bước dịch chuyển K (K >= 0). Hãy in ra ký tự sau khi mã hóa mà không dùng câu lệnh điều kiện \`if\`.

### Công thức xoay vòng:
* Vị trí cũ: \`viTriCu = c - 'A'\` (từ 0 đến 25)
* Vị trí mới: \`viTriMoi = (viTriCu + K) % 26\`
* Ký tự mới: \`static_cast<char>('A' + viTriMoi)\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự in hoa c và số nguyên K cách nhau bởi dấu cách.
* **Đầu ra (Output):** Ký tự sau khi đã mã hóa xoay vòng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
Y 4
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
C
\`\`\`

**Giải thích chi tiết:**
Chữ 'Y' là chữ thứ 24 (tính từ 0). Dịch 4 bước: (24 + 4) % 26 = 28 % 26 = 2, ứng với chữ 'C'.`,
        starterCode: `#include <iostream>

int main() {
    char c = ' ';
    int k = 0;
    // Dùng modulo 26 để xoay vòng:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    char c = ' ';
    int k = 0;
    std::cin >> c >> k;
    int viTriCu = c - 'A';
    int viTriMoi = (viTriCu + k) % 26;
    char ketQua = static_cast<char>('A' + viTriMoi);
    std::cout << ketQua << '\n';
    return 0;
}
`,
        testCases: [
            { input: 'Y 4\n', expectedOutput: 'C\n', isHidden: false },
            { input: 'A 3\n', expectedOutput: 'D\n', isHidden: false },
            { input: 'Z 26\n', expectedOutput: 'Z\n', isHidden: true }
        ]
    },
    {
        title: 'Tính thời gian tương lai trên đồng hồ 24 giờ',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Đồng hồ điện tử hiện tại đang chỉ H giờ M phút (0 <= H <= 23, 0 <= M <= 59). Sau X phút nữa (X >= 0), đồng hồ sẽ hiển thị mấy giờ mấy phút?
* Sử dụng modulo \`% (24 * 60)\` để tự động xoay vòng sang ngày mới mà không cần dùng câu lệnh \`if\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên H, M, X cách nhau bởi dấu cách.
* **Đầu ra (Output):** Hai số nguyên cách nhau một khoảng trắng biểu thị Giờ và Phút mới.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
22 45 150
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
1 15
\`\`\`

**Giải thích chi tiết:**
* Tổng phút: 22 * 60 + 45 + 150 = 1515 phút.
* 1 ngày có 24 * 60 = 1440 phút.
* Phút trong ngày mới: 1515 % 1440 = 75 phút.
* Giờ mới: 75 / 60 = 1 giờ; Phút mới: 75 % 60 = 15 phút.`,
        starterCode: `#include <iostream>

int main() {
    long long h = 0, m = 0, x = 0;
    // Nhập dữ liệu và tính giờ, phút mới:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long h = 0, m = 0, x = 0;
    std::cin >> h >> m >> x;
    long long tongPhut = h * 60 + m + x;
    long long phutTrongNgay = tongPhut % (24 * 60);
    long long gioMoi = phutTrongNgay / 60;
    long long phutMoi = phutTrongNgay % 60;
    std::cout << gioMoi << " " << phutMoi << '\n';
    return 0;
}
`,
        testCases: [
            { input: '22 45 150\n', expectedOutput: '1 15\n', isHidden: false },
            { input: '10 0 60\n', expectedOutput: '11 0\n', isHidden: false },
            { input: '23 50 15\n', expectedOutput: '0 5\n', isHidden: true }
        ]
    },
    {
        title: 'Thể tích và Diện tích toàn phần Hình nón cụt',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Cho hình nón cụt có bán kính đáy lớn R, bán kính đáy nhỏ r, và chiều cao h (R > r > 0, h > 0).
Thể tích hình nón cụt được tính theo công thức:
\`V = (1.0 / 3.0) * PI * h * (R * R + r * r + R * r)\`
Định nghĩa hằng số \`const double PI = 3.14159265;\`. Hãy viết chương trình tính và in ra thể tích V.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số thực R, r, h cách nhau bởi dấu cách.
* **Đầu ra (Output):** Thể tích V của hình nón cụt.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
5.0 2.0 6.0
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
245.044
\`\`\`

**Giải thích chi tiết:**
* \`V = (1.0 / 3.0) * 3.14159265 * 6.0 * (5.0^2 + 2.0^2 + 5.0 * 2.0)\`
* \`V = 2.0 * 3.14159265 * (25 + 4 + 10) = 2.0 * 3.14159265 * 39 = 245.044\`.`,
        starterCode: `#include <iostream>

int main() {
    const double PI = 3.14159265;
    double R = 0.0, r = 0.0, h = 0.0;
    // Nhập R, r, h và tính thể tích:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    const double PI = 3.14159265;
    double R = 0.0, r = 0.0, h = 0.0;
    std::cin >> R >> r >> h;
    double v = (1.0 / 3.0) * PI * h * (R * R + r * r + R * r);
    std::cout << v << '\n';
    return 0;
}
`,
        testCases: [
            { input: '5.0 2.0 6.0\n', expectedOutput: '245.044\n', isHidden: false },
            { input: '3.0 1.0 4.0\n', expectedOutput: '54.4543\n', isHidden: true }
        ]
    },
    {
        title: 'Kiểm tra tính chia hết không dùng câu lệnh điều kiện',
        difficulty: 'HARD',
        problemDescription: `### Đề bài:
Cho hai số nguyên dương A và B (B > 0). Hãy in ra \`1\` (true) nếu A chia hết cho B, ngược lại in ra \`0\` (false) mà tuyệt đối không dùng câu lệnh \`if/else\`.

### Gợi ý giải pháp:
Biểu thức so sánh \`(A % B == 0)\` trả về kết quả kiểu \`bool\`. Khi xuất ra \`std::cout\`, C++ sẽ tự động in \`1\` cho \`true\` và \`0\` cho \`false\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên dương A và B cách nhau bởi dấu cách.
* **Đầu ra (Output):** In ra \`1\` nếu A chia hết cho B, ngược lại in ra \`0\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
20 5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
1
\`\`\`

**Giải thích chi tiết:**
20 chia hết cho 5 (phép chia dư \`20 % 5 == 0\` là đúng), chương trình in ra số 1.`,
        starterCode: `#include <iostream>

int main() {
    long long a = 0, b = 0;
    // Kiểm tra chia hết bằng kiểu bool:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

int main() {
    long long a = 0, b = 0;
    std::cin >> a >> b;
    bool chiaHet = (a % b == 0);
    std::cout << chiaHet << '\n';
    return 0;
}
`,
        testCases: [
            { input: '20 5\n', expectedOutput: '1\n', isHidden: false },
            { input: '21 5\n', expectedOutput: '0\n', isHidden: false },
            { input: '100 10\n', expectedOutput: '1\n', isHidden: true }
        ]
    }
];

async function seedCppPractice() {
    console.log('🚀 Bắt đầu cập nhật toàn bộ 30 bài tập chuẩn hóa Module 1 C++ vào Database...');

    // 1. Tìm Module 1 của C++
    const module1 = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-01' }
    });

    if (!module1) {
        throw new Error('❌ Không tìm thấy Module 1 (CPP-MOD-01)! Vui lòng chạy seed_cpp_course trước.');
    }

    // 2. Tìm Chapter 1
    const chapter1 = await prisma.chapter.findFirst({
        where: {
            moduleId: module1.id,
            chapterId: 'CPP-CH-01'
        }
    });

    if (!chapter1) {
        throw new Error('❌ Không tìm thấy Chapter 1 của Module 1!');
    }

    // 3. Upsert bài học tổng hợp CPP-01.MP
    const lessonMp = await prisma.lesson.upsert({
        where: {
            id: 'c1b10000-0001-4000-8000-000000000001'
        },
        update: {
            lessonId: 'CPP-01.MP',
            title: 'Bài tập thực hành tổng hợp Module 1: C++ Cơ bản',
            objective: 'Hệ thống bài tập ôn tập chuyên sâu 30 bài (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức I/O, Biến, Toán tử và Ép kiểu của Module 1 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 60,
            isFree: true,
            orderIndex: 6,
            chapterId: chapter1.id,
            content: `# Bài tập thực hành tổng hợp Module 1: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 1: Nhập môn Lập trình và Môi trường C++ Hiện đại**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài rèn luyện cú pháp, I/O và các phép toán đơn giản.
* ⚔️ **Trung bình (Medium):** 10 bài vận dụng bóc tách số học, phân biệt kiểu dữ liệu và ép kiểu an toàn.
* 👑 **Khó / Thử thách (Hard):** 10 bài thuật toán số học chuyên sâu, kiểm soát tràn số nguyên (Overflow) và làm tròn không dùng điều kiện.

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        },
        create: {
            id: 'c1b10000-0001-4000-8000-000000000001',
            lessonId: 'CPP-01.MP',
            title: 'Bài tập thực hành tổng hợp Module 1: C++ Cơ bản',
            objective: 'Hệ thống bài tập ôn tập chuyên sâu 30 bài (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức I/O, Biến, Toán tử và Ép kiểu của Module 1 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 60,
            isFree: true,
            orderIndex: 6,
            chapterId: chapter1.id,
            content: `# Bài tập thực hành tổng hợp Module 1: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 1: Nhập môn Lập trình và Môi trường C++ Hiện đại**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài rèn luyện cú pháp, I/O và các phép toán đơn giản.
* ⚔️ **Trung bình (Medium):** 10 bài vận dụng bóc tách số học, phân biệt kiểu dữ liệu và ép kiểu an toàn.
* 👑 **Khó / Thử thách (Hard):** 10 bài thuật toán số học chuyên sâu, kiểm soát tràn số nguyên (Overflow) và làm tròn không dùng điều kiện.

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        }
    });

    console.log(`✅ Đã đồng bộ Bài học tổng hợp: [${lessonMp.lessonId}] ${lessonMp.title} (ID: ${lessonMp.id})`);

    // 4. Cập nhật lần lượt 30 Coding Exercises và Test Cases
    let successCount = 0;
    for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];

        // Tìm hoặc tạo CodingExercise
        let dbExercise = await prisma.codingExercise.findFirst({
            where: {
                lessonId: lessonMp.id,
                title: ex.title
            }
        });

        const exPayload = {
            lessonId: lessonMp.id,
            title: ex.title,
            difficulty: ex.difficulty as any,
            problemDescription: ex.problemDescription,
            starterCode: ex.starterCode,
            solutionCode: ex.solutionCode
        };

        if (dbExercise) {
            dbExercise = await prisma.codingExercise.update({
                where: { id: dbExercise.id },
                data: exPayload
            });
        } else {
            dbExercise = await prisma.codingExercise.create({
                data: exPayload
            });
        }

        // Xóa test cases cũ và nạp lại
        await prisma.testCase.deleteMany({
            where: { exerciseId: dbExercise.id }
        });

        for (const tc of ex.testCases) {
            await prisma.testCase.create({
                data: {
                    exerciseId: dbExercise.id,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    isHidden: tc.isHidden
                }
            });
        }

        successCount++;
        console.log(`   [${i + 1}/30] [${ex.difficulty}] Đã cập nhật chuẩn hóa: "${ex.title}" (${ex.testCases.length} testcases)`);
    }

    console.log(`\n🎉 THÀNH CÔNG! Đã cập nhật xong ${successCount} bài tập thực hành Module 1 C++ lên Database!`);
}

seedCppPractice()
    .catch((err) => {
        console.error('❌ Lỗi khi cập nhật bài tập C++:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
