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
    moduleTitle: string;
    moduleObjective: string;
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
    // ========================================================
    // MODULE 1: KIỂU DỮ LIỆU TỰ ĐỊNH NGHĨA & CĂN CHỈNH BỘ NHỚ
    // ========================================================
    {
        moduleNumber: 1,
        moduleId: 'CPP2-MOD-01',
        moduleTitle: 'Module 1: Kiểu Dữ liệu Tự định nghĩa & Căn chỉnh Bộ nhớ (Memory Alignment)',
        moduleObjective: 'Làm chủ cấu trúc struct, enum class, union, bit-fields và cơ chế padding/alignment ở mức độ phần cứng.',
        chapterId: 'CPP2-CH-01',
        chapterTitle: 'Chương 1: Kiểu Dữ liệu Tự định nghĩa & Căn chỉnh Bộ nhớ',
        chapterObjective: 'Làm chủ enum class, bit-fields, cơ chế memory alignment của CPU và type-safe union với std::variant.',
        file: 'Lesson_01_01.md',
        lessonId: 'CPP2-01.01',
        title: 'Bài 1.1: Kiểu liệt kê enum class (Scoped Enums) và Kỹ thuật Bit-fields',
        objective: 'Khắc phục nhược điểm của C-style enum bằng enum class và tối ưu dung lượng với bit-fields.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 1,
        exercise: {
            title: 'Tối ưu hóa cờ trạng thái thiết bị bằng Bit-fields',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Thiết kế cấu trúc \`DeviceStatus\` sử dụng bit-field gồm:
* \`power\`: 1 bit (0: Tắt, 1: Bật)
* \`wifi\`: 1 bit (0: Mất mạng, 1: Đã kết nối)
* \`batteryLevel\`: 4 bits (Biểu diễn mức pin từ 0 đến 15)
Nhập vào 3 số nguyên $p, w, b$ đại diện cho 3 trạng thái trên.
Gán vào struct và in ra kích thước của struct cùng thông báo:
\`Size: <size> bytes - Power: <p> - Wifi: <w> - Pin: <b>\`

### Ví dụ:
* **Đầu vào:** \`1 1 12\`
* **Đầu ra:** \`Size: 4 bytes - Power: 1 - Wifi: 1 - Pin: 12\``,
            starterCode: `#include <iostream>

struct DeviceStatus {
    // Khai báo các trường bit-field tại đây
};

int main() {
    unsigned int p, w, b;
    if (std::cin >> p >> w >> b) {
        // Gán và in kết quả
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

struct DeviceStatus {
    unsigned int power : 1;
    unsigned int wifi : 1;
    unsigned int batteryLevel : 4;
};

int main() {
    unsigned int p, w, b;
    if (std::cin >> p >> w >> b) {
        DeviceStatus dev;
        dev.power = p;
        dev.wifi = w;
        dev.batteryLevel = b;
        std::cout << "Size: " << sizeof(DeviceStatus) << " bytes - Power: " 
                  << dev.power << " - Wifi: " << dev.wifi << " - Pin: " << dev.batteryLevel << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '1 1 12', expectedOutput: 'Size: 4 bytes - Power: 1 - Wifi: 1 - Pin: 12\n', isHidden: false },
                { input: '0 0 5', expectedOutput: 'Size: 4 bytes - Power: 0 - Wifi: 0 - Pin: 5\n', isHidden: false },
                { input: '1 0 15', expectedOutput: 'Size: 4 bytes - Power: 1 - Wifi: 0 - Pin: 15\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Ưu điểm lớn nhất của `enum class` (Scoped Enums) so với `enum` truyền thống trong C++ là gì?',
            explanation: 'enum class ngăn chặn ô nhiễm không gian tên (phải gọi qua TênEnum::GiaTri) và cấm việc ép kiểu ngầm định nguy hiểm sang kiểu số nguyên int.',
            options: [
                { key: 'A', text: 'Tự động tăng tốc độ xử lý của CPU', isCorrect: false },
                { key: 'B', text: 'Có phạm vi tên riêng và ngăn chặn ép kiểu ngầm định sang int', isCorrect: true },
                { key: 'C', text: 'Cho phép gán số thực double vào enum', isCorrect: false },
                { key: 'D', text: 'Tự động giải phóng bộ nhớ Stack', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 1,
        moduleId: 'CPP2-MOD-01',
        moduleTitle: 'Module 1: Kiểu Dữ liệu Tự định nghĩa & Căn chỉnh Bộ nhớ (Memory Alignment)',
        moduleObjective: 'Làm chủ cấu trúc struct, enum class, union, bit-fields và cơ chế padding/alignment ở mức độ phần cứng.',
        chapterId: 'CPP2-CH-01',
        chapterTitle: 'Chương 1: Kiểu Dữ liệu Tự định nghĩa & Căn chỉnh Bộ nhớ',
        chapterObjective: 'Làm chủ enum class, bit-fields, cơ chế memory alignment của CPU và type-safe union với std::variant.',
        file: 'Lesson_01_02.md',
        lessonId: 'CPP2-01.02',
        title: 'Bài 1.2: Cấu trúc struct và Cơ chế Căn chỉnh Bộ nhớ (Padding & Alignment)',
        objective: 'Giải mã cơ chế Data Alignment của CPU, hiện tượng chèn padding và kỹ thuật sắp xếp trường tối ưu RAM.',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 2,
        exercise: {
            title: 'Sắp xếp trường struct để đạt dung lượng bộ nhớ tối thiểu',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Một struct ban đầu gồm 4 trường được khai báo lộn xộn:
\`\`\`cpp
struct BadLayout {
    char a;      // 1 byte
    double b;    // 8 bytes
    char c;      // 1 byte
    int d;       // 4 bytes
};
\`\`\`
1. Hãy tạo struct \`GoodLayout\` chứa 4 trường trên nhưng được sắp xếp lại thứ tự tối ưu nhất để kích thước \`sizeof(GoodLayout)\` là nhỏ nhất.
2. In ra kích thước \`sizeof(BadLayout)\` và \`sizeof(GoodLayout)\` trên 2 dòng.

### Định dạng đầu ra mong muốn:
\`\`\`text
Bad: 24 bytes
Good: 16 bytes
\`\`\``,
            starterCode: `#include <iostream>

struct BadLayout {
    char a;
    double b;
    char c;
    int d;
};

// Khai báo GoodLayout tại đây

int main() {
    // In kích thước BadLayout và GoodLayout
    return 0;
}
`,
            solutionCode: `#include <iostream>

struct BadLayout {
    char a;
    double b;
    char c;
    int d;
};

struct GoodLayout {
    double b; // 8 bytes (0-7)
    int d;    // 4 bytes (8-11)
    char a;   // 1 byte  (12)
    char c;   // 1 byte  (13)
    // 2 bytes padding đuôi (14-15) -> Tổng đúng 16 bytes!
};

int main() {
    std::cout << "Bad: " << sizeof(BadLayout) << " bytes\\n";
    std::cout << "Good: " << sizeof(GoodLayout) << " bytes\\n";
    return 0;
}
`,
            testCases: [
                { input: '', expectedOutput: 'Bad: 24 bytes\nGood: 16 bytes\n', isHidden: false }
            ]
        },
        quiz: {
            question: 'Tại sao trình biên dịch C++ lại chèn các byte đệm rác (Padding) vào bên trong cấu trúc struct?',
            explanation: 'CPU đọc bộ nhớ RAM theo từng khối Word (4 hoặc 8 bytes). Việc chèn padding giúp mỗi biến bắt đầu tại địa chỉ chia hết cho kích thước của nó, cho phép CPU đọc dữ liệu chỉ trong 1 chu kỳ bộ nhớ duy nhất.',
            options: [
                { key: 'A', text: 'Để làm tăng dung lượng file exe', isCorrect: false },
                { key: 'B', text: 'Để căn chỉnh địa chỉ ô nhớ theo khối Word của CPU giúp tăng tối đa tốc độ truy xuất RAM', isCorrect: true },
                { key: 'C', text: 'Do RAM bị lỗi phần cứng', isCorrect: false },
                { key: 'D', text: 'Để mã hóa bảo vệ các trường dữ liệu', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 1,
        moduleId: 'CPP2-MOD-01',
        moduleTitle: 'Module 1: Kiểu Dữ liệu Tự định nghĩa & Căn chỉnh Bộ nhớ (Memory Alignment)',
        moduleObjective: 'Làm chủ cấu trúc struct, enum class, union, bit-fields và cơ chế padding/alignment ở mức độ phần cứng.',
        chapterId: 'CPP2-CH-01',
        chapterTitle: 'Chương 1: Kiểu Dữ liệu Tự định nghĩa & Căn chỉnh Bộ nhớ',
        chapterObjective: 'Làm chủ enum class, bit-fields, cơ chế memory alignment của CPU và type-safe union với std::variant.',
        file: 'Lesson_01_03.md',
        lessonId: 'CPP2-01.03',
        title: 'Bài 1.3: Hợp tập Union và std::variant (Type-Safe Union C++17)',
        objective: 'Hiểu bản chất vùng nhớ dùng chung của union và làm chủ std::variant an toàn kiểu tuyệt đối trong Modern C++.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 3,
        exercise: {
            title: 'Hàm xử lý dữ liệu đa kiểu an toàn với std::variant',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một ký tự $type$ (\`'i'\` cho số nguyên, \`'d'\` cho số thực) và giá trị tương ứng.
Sử dụng \`std::variant<int, double>\` để lưu trữ giá trị này.
* Nếu là số nguyên: nhân đôi giá trị và in ra.
* Nếu là số thực: cộng thêm 0.5 và in ra.

### Ví dụ:
* **Đầu vào:** \`i 25\` -> **Đầu ra:** \`50\`
* **Đầu vào:** \`d 3.5\` -> **Đầu ra:** \`4\``,
            starterCode: `#include <iostream>
#include <variant>

int main() {
    char type;
    if (std::cin >> type) {
        // Sử dụng std::variant xử lý
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <variant>

int main() {
    char type;
    if (std::cin >> type) {
        std::variant<int, double> v;
        if (type == 'i') {
            int val;
            std::cin >> val;
            v = val;
            std::cout << (std::get<int>(v) * 2) << "\\n";
        } else if (type == 'd') {
            double val;
            std::cin >> val;
            v = val;
            std::cout << (std::get<double>(v) + 0.5) << "\\n";
        }
    }
    return 0;
}
`,
            testCases: [
                { input: 'i 25', expectedOutput: '50\n', isHidden: false },
                { input: 'd 3.5', expectedOutput: '4\n', isHidden: false },
                { input: 'i -10', expectedOutput: '-20\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Điểm khác biệt cốt lõi giữa C-style union truyền thống và std::variant trong C++17 là gì?',
            explanation: 'std::variant lưu giữ thông tin kiểu dữ liệu hiện tại (type-safe) và ném ngoại lệ std::bad_variant_access nếu truy xuất sai kiểu, trong khi union truyền thống cho phép đọc nhầm ô nhớ không an toàn.',
            options: [
                { key: 'A', text: 'std::variant chạy chậm hơn 100 lần', isCorrect: false },
                { key: 'B', text: 'std::variant an toàn kiểu tuyệt đối, kiểm soát chặt chẽ kiểu dữ liệu đang kích hoạt', isCorrect: true },
                { key: 'C', text: 'std::variant chỉ dùng được với số nguyên', isCorrect: false },
                { key: 'D', text: 'union chiếm nhiều bộ nhớ hơn std::variant', isCorrect: false }
            ]
        }
    },

    // ========================================================
    // MODULE 2: CON TRỎ CHUYÊN SÂU & BỘ NHỚ ĐỘNG
    // ========================================================
    {
        moduleNumber: 2,
        moduleId: 'CPP2-MOD-02',
        moduleTitle: 'Module 2: Con trỏ Chuyên sâu, Bộ nhớ Động và Con trỏ Thông minh',
        moduleObjective: 'Khám phá chiều sâu bộ nhớ máy tính, con trỏ hàm, các thảm họa bộ nhớ và giải pháp Modern C++ Smart Pointers.',
        chapterId: 'CPP2-CH-02',
        chapterTitle: 'Chương 2: Con trỏ Chuyên sâu & Con trỏ Thông minh',
        chapterObjective: 'Làm chủ phân vùng RAM (Stack, Heap), con trỏ cấp 2, con trỏ hàm callbacks và Smart Pointers.',
        file: 'Lesson_02_01.md',
        lessonId: 'CPP2-02.01',
        title: 'Bài 2.1: Kiến trúc Bộ nhớ Máy tính: Phân tích Stack, Heap, Data & Code Segment',
        objective: 'Nắm vững bản đồ bộ nhớ tiến trình C++, cơ chế vận hành của Call Stack và so sánh đặc tính Stack vs Heap.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 1,
        exercise: {
            title: 'Khám phá sự phân tách địa chỉ giữa Stack và Heap',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết chương trình C++ khai báo:
* Một biến số nguyên cục bộ \`stackVar\` trên Stack.
* Một biến số nguyên cấp phát động \`heapVar\` bằng toán tử \`new\` trên Heap.
So sánh hai địa chỉ ô nhớ:
* Nếu địa chỉ của \`stackVar\` lớn hơn địa chỉ của \`heapVar\`, in ra: \`Stack o dia chi cao hon Heap\`
* Ngược lại, in ra: \`Heap o dia chi cao hon Stack\`
Đừng quên giải phóng bộ nhớ Heap sau khi kiểm tra!`,
            starterCode: `#include <iostream>

int main() {
    int stackVar = 10;
    int* heapVar = new int(20);

    // So sánh địa chỉ và in kết quả

    delete heapVar;
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int stackVar = 10;
    int* heapVar = new int(20);

    if ((void*)&stackVar > (void*)heapVar) {
        std::cout << "Stack o dia chi cao hon Heap\\n";
    } else {
        std::cout << "Heap o dia chi cao hon Stack\\n";
    }

    delete heapVar;
    return 0;
}
`,
            testCases: [
                { input: '', expectedOutput: 'Stack o dia chi cao hon Heap\n', isHidden: false }
            ]
        },
        quiz: {
            question: 'Hiện tượng "Stack Overflow" xảy ra do nguyên nhân cơ bản nào?',
            explanation: 'Vùng nhớ Stack có dung lượng mặc định rất nhỏ (1-8 MB). Nếu chương trình gọi đệ quy vô hạn hoặc khai báo mảng cục bộ quá lớn trên Stack, con trỏ ngăn xếp sẽ vượt quá giới hạn và gây lỗi sập hệ thống.',
            options: [
                { key: 'A', text: 'Quên giải phóng con trỏ bằng lệnh delete', isCorrect: false },
                { key: 'B', text: 'Đệ quy quá sâu hoặc khai báo mảng cục bộ vượt quá dung lượng giới hạn của Stack', isCorrect: true },
                { key: 'C', text: 'Ổ cứng bị đầy không thể ghi file', isCorrect: false },
                { key: 'D', text: 'CPU bị quá nhiệt khi chạy vòng lặp', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 2,
        moduleId: 'CPP2-MOD-02',
        moduleTitle: 'Module 2: Con trỏ Chuyên sâu, Bộ nhớ Động và Con trỏ Thông minh',
        moduleObjective: 'Khám phá chiều sâu bộ nhớ máy tính, con trỏ hàm, các thảm họa bộ nhớ và giải pháp Modern C++ Smart Pointers.',
        chapterId: 'CPP2-CH-02',
        chapterTitle: 'Chương 2: Con trỏ Chuyên sâu & Con trỏ Thông minh',
        chapterObjective: 'Làm chủ phân vùng RAM (Stack, Heap), con trỏ cấp 2, con trỏ hàm callbacks và Smart Pointers.',
        file: 'Lesson_02_02.md',
        lessonId: 'CPP2-02.02',
        title: 'Bài 2.2: Số học Con trỏ (Pointer Arithmetic), Con trỏ Cấp 2 và Con trỏ Hàm',
        objective: 'Làm chủ phép toán số học con trỏ, thay đổi con trỏ qua tham chiếu cấp 2 và thiết kế Callback với con trỏ hàm.',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 2,
        exercise: {
            title: 'Sắp xếp mảng tùy biến với Con trỏ hàm Callback',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào số lượng phần tử $N$ và $N$ số nguyên tiếp theo.
Dòng tiếp theo nhập một ký tự $mode$:
* Nếu $mode = \`'A'\`$: sắp xếp mảng Tăng dần (Ascending).
* Nếu $mode = \`'D'\`$: sắp xếp mảng Giảm dần (Descending).
Hãy viết hàm sắp xếp nhận con trỏ hàm so sánh \`bool (*cmp)(int, int)\` và in mảng sau khi sắp xếp trên một dòng.

### Ví dụ:
* **Đầu vào:**
\`\`\`text
4
15 3 8 20
A
\`\`\`
* **Đầu ra:** \`3 8 15 20\``,
            starterCode: `#include <iostream>

bool cmpAsc(int a, int b) { return a > b; }
bool cmpDesc(int a, int b) { return a < b; }

// Viết hàm sortWithCallback tại đây

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        // Nhập mảng, chế độ và sắp xếp
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <utility>

bool cmpAsc(int a, int b) { return a > b; }
bool cmpDesc(int a, int b) { return a < b; }

void sortWithCallback(int* arr, int n, bool (*cmp)(int, int)) {
    for (int i = 0; i < n - 1; ++i) {
        for (int j = 0; j < n - 1 - i; ++j) {
            if (cmp(arr[j], arr[j + 1])) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        int arr[100];
        for (int i = 0; i < n; ++i) std::cin >> arr[i];
        char mode;
        std::cin >> mode;

        if (mode == 'A') {
            sortWithCallback(arr, n, cmpAsc);
        } else {
            sortWithCallback(arr, n, cmpDesc);
        }

        for (int i = 0; i < n; ++i) {
            std::cout << arr[i] << (i + 1 == n ? "" : " ");
        }
        std::cout << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '4\n15 3 8 20\nA', expectedOutput: '3 8 15 20\n', isHidden: false },
                { input: '4\n15 3 8 20\nD', expectedOutput: '20 15 8 3\n', isHidden: false },
                { input: '3\n5 1 9\nA', expectedOutput: '1 5 9\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong C++, biểu thức số học con trỏ `ptr + 3` sẽ làm tăng địa chỉ trong ô nhớ lên bao nhiêu bytes nếu ptr là con trỏ kiểu `double*` (8 bytes)?',
            explanation: 'Số học con trỏ luôn nhân bước nhảy với kích thước kiểu dữ liệu cơ sở: 3 × sizeof(double) = 3 × 8 = 24 bytes.',
            options: [
                { key: 'A', text: '3 bytes', isCorrect: false },
                { key: 'B', text: '12 bytes', isCorrect: false },
                { key: 'C', text: '24 bytes', isCorrect: true },
                { key: 'D', text: '48 bytes', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 2,
        moduleId: 'CPP2-MOD-02',
        moduleTitle: 'Module 2: Con trỏ Chuyên sâu, Bộ nhớ Động và Con trỏ Thông minh',
        moduleObjective: 'Khám phá chiều sâu bộ nhớ máy tính, con trỏ hàm, các thảm họa bộ nhớ và giải pháp Modern C++ Smart Pointers.',
        chapterId: 'CPP2-CH-02',
        chapterTitle: 'Chương 2: Con trỏ Chuyên sâu & Con trỏ Thông minh',
        chapterObjective: 'Làm chủ phân vùng RAM (Stack, Heap), con trỏ cấp 2, con trỏ hàm callbacks và Smart Pointers.',
        file: 'Lesson_02_03.md',
        lessonId: 'CPP2-02.03',
        title: 'Bài 2.3: Cấp phát động (new/delete) và 4 Thảm họa Bộ nhớ Kinh điển',
        objective: 'Nhận diện và phòng chống 4 thảm họa: Memory Leak, Dangling Pointer, Double Free và Use-After-Free.',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 3,
        exercise: {
            title: 'Cấp phát và Giải phóng Ma trận động 2D an toàn 100%',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết chương trình cấp phát động ma trận $R \\times C$ bằng con trỏ cấp 2 \`int**\`.
Nhập các phần tử, tính tổng toàn bộ ma trận và in ra kết quả.
Sau đó giải phóng toàn bộ các hàng và mảng con trỏ, gán \`nullptr\` an toàn tuyệt đối.

### Ví dụ:
* **Đầu vào:**
\`\`\`text
2 2
5 10
15 20
\`\`\`
* **Đầu ra:** \`50\``,
            starterCode: `#include <iostream>

int main() {
    int r, c;
    if (std::cin >> r >> c && r > 0 && c > 0) {
        // Cấp phát, tính toán và giải phóng sạch sẽ
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int r, c;
    if (std::cin >> r >> c && r > 0 && c > 0) {
        int** mat = new int*[r];
        for (int i = 0; i < r; ++i) mat[i] = new int[c];

        long long sum = 0;
        for (int i = 0; i < r; ++i) {
            for (int j = 0; j < c; ++j) {
                std::cin >> mat[i][j];
                sum += mat[i][j];
            }
        }
        std::cout << sum << "\\n";

        for (int i = 0; i < r; ++i) {
            delete[] mat[i];
            mat[i] = nullptr;
        }
        delete[] mat;
        mat = nullptr;
    }
    return 0;
}
`,
            testCases: [
                { input: '2 2\n5 10\n15 20', expectedOutput: '50\n', isHidden: false },
                { input: '1 3\n1 2 3', expectedOutput: '6\n', isHidden: false },
                { input: '2 3\n10 20 30\n40 50 60', expectedOutput: '210\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao việc gán `p = nullptr;` ngay sau khi gọi `delete p;` được coi là nguyên tắc phòng thủ vàng trong C++?',
            explanation: 'Gán nullptr triệt tiêu con trỏ treo (Dangling Pointer) và ngăn chặn thảm họa Double Free, bởi vì theo chuẩn C++, gọi delete trên một con trỏ nullptr là hoàn toàn an toàn và không gây lỗi sập hệ thống.',
            options: [
                { key: 'A', text: 'Để ép CPU giải phóng RAM ngay lập tức', isCorrect: false },
                { key: 'B', text: 'Để loại bỏ con trỏ treo và phòng chống thảm họa Double Free', isCorrect: true },
                { key: 'C', text: 'Bắt buộc bởi trình biên dịch nếu không sẽ không thể build', isCorrect: false },
                { key: 'D', text: 'Để biến con trỏ thành kiểu hằng const', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 2,
        moduleId: 'CPP2-MOD-02',
        moduleTitle: 'Module 2: Con trỏ Chuyên sâu, Bộ nhớ Động và Con trỏ Thông minh',
        moduleObjective: 'Khám phá chiều sâu bộ nhớ máy tính, con trỏ hàm, các thảm họa bộ nhớ và giải pháp Modern C++ Smart Pointers.',
        chapterId: 'CPP2-CH-02',
        chapterTitle: 'Chương 2: Con trỏ Chuyên sâu & Con trỏ Thông minh',
        chapterObjective: 'Làm chủ phân vùng RAM (Stack, Heap), con trỏ cấp 2, con trỏ hàm callbacks và Smart Pointers.',
        file: 'Lesson_02_04.md',
        lessonId: 'CPP2-02.04',
        title: 'Bài 2.4: Con trỏ Thông minh Modern C++ (Smart Pointers) và Nguyên lý RAII',
        objective: 'Làm chủ std::unique_ptr, std::shared_ptr, std::weak_ptr và nguyên lý RAII giải phóng bộ nhớ tự động 100%.',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 4,
        exercise: {
            title: 'Quản lý tài nguyên an toàn bằng std::unique_ptr',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Sử dụng \`std::unique_ptr<int[]>\` để cấp phát một mảng động gồm $N$ số nguyên từ bàn phím.
Tìm giá trị lớn nhất trong mảng và in ra màn hình.
Không được sử dụng bất kỳ lệnh \`delete\` hay \`delete[]\` thủ công nào trong toàn bộ chương trình (để Smart Pointer tự thu hồi tự động).

### Ví dụ:
* **Đầu vào:**
\`\`\`text
5
12 45 7 89 23
\`\`\`
* **Đầu ra:** \`89\``,
            starterCode: `#include <iostream>
#include <memory>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        // Cấp phát mảng bằng std::make_unique và tìm max
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <memory>

int main() {
    int n;
    if (std::cin >> n && n > 0) {
        std::unique_ptr<int[]> arr = std::make_unique<int[]>(n);
        for (int i = 0; i < n; ++i) std::cin >> arr[i];

        int maxVal = arr[0];
        for (int i = 1; i < n; ++i) {
            if (arr[i] > maxVal) maxVal = arr[i];
        }
        std::cout << maxVal << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '5\n12 45 7 89 23', expectedOutput: '89\n', isHidden: false },
                { input: '3\n-5 -20 -1', expectedOutput: '-1\n', isHidden: false },
                { input: '4\n10 10 10 10', expectedOutput: '10\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Khi nào một vùng nhớ được quản lý bởi `std::shared_ptr` sẽ thực sự được giải phóng khỏi bộ nhớ Heap?',
            explanation: 'std::shared_ptr duy trì một bộ đếm tham chiếu (use_count). Chỉ khi đối tượng shared_ptr cuối cùng sở hữu nó bị hủy hoặc reset (use_count giảm về đúng 0), bộ nhớ Heap mới được giải phóng.',
            options: [
                { key: 'A', text: 'Ngay khi hàm đầu tiên kết thúc', isCorrect: false },
                { key: 'B', text: 'Khi bộ đếm tham chiếu (use_count) giảm về đúng bằng 0', isCorrect: true },
                { key: 'C', text: 'Sau 10 giây kể từ khi cấp phát', isCorrect: false },
                { key: 'D', text: 'Phải gọi hàm delete thủ công', isCorrect: false }
            ]
        }
    },

    // ========================================================
    // MODULE 3: TỆP TIN NHỊ PHÂN & CƠ SỞ DỮ LIỆU BẢN GHI
    // ========================================================
    {
        moduleNumber: 3,
        moduleId: 'CPP2-MOD-03',
        moduleTitle: 'Module 3: Tệp tin Nhị phân (Binary File I/O) và Cơ sở Dữ liệu Bản ghi',
        moduleObjective: 'Làm việc với tệp nhị phân, định dạng byte thô, truy xuất ngẫu nhiên và xây dựng engine lưu trữ bản ghi.',
        chapterId: 'CPP2-CH-03',
        chapterTitle: 'Chương 3: Tệp tin Nhị phân & Cơ sở Dữ liệu Bản ghi',
        chapterObjective: 'Làm chủ read/write nhị phân, con trỏ tệp seekg/seekp và cấu trúc file database có header.',
        file: 'Lesson_03_01.md',
        lessonId: 'CPP2-03.01',
        title: 'Bài 3.1: Phân biệt Tệp Văn bản (Text File) và Tệp Nhị phân (Binary File)',
        objective: 'Hiểu ưu thế tốc độ và dung lượng của binary file, sử dụng cờ std::ios::binary và hàm read/write.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 1,
        exercise: {
            title: 'Ghi và đọc số nguyên 64-bit ra file nhị phân',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên 64-bit $X$ (\`long long\`).
Ghi số $X$ ra tệp nhị phân \`data.bin\` bằng \`write()\`.
Sau đó mở lại file ở chế độ đọc nhị phân, đọc vào biến mới bằng \`read()\` và in ra màn hình.

### Ví dụ:
* **Đầu vào:** \`987654321012345\`
* **Đầu ra:** \`987654321012345\``,
            starterCode: `#include <iostream>
#include <fstream>

int main() {
    long long x;
    if (std::cin >> x) {
        // Ghi và đọc file nhị phân data.bin
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <fstream>

int main() {
    long long x;
    if (std::cin >> x) {
        const char* path = "data.bin";
        {
            std::ofstream out(path, std::ios::binary);
            out.write(reinterpret_cast<const char*>(&x), sizeof(x));
        }
        long long loaded = 0;
        {
            std::ifstream in(path, std::ios::binary);
            in.read(reinterpret_cast<char*>(&loaded), sizeof(loaded));
        }
        std::cout << loaded << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '987654321012345', expectedOutput: '987654321012345\n', isHidden: false },
                { input: '-1000000000', expectedOutput: '-1000000000\n', isHidden: false },
                { input: '0', expectedOutput: '0\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao khi làm việc với tệp nhị phân trên Windows, việc khai báo cờ `std::ios::binary` là bắt buộc?',
            explanation: 'Nếu không có cờ binary, hệ điều hành Windows sẽ tự động biến đổi byte 0x0A (\'\\n\') thành cặp 2 bytes 0x0D 0x0A (\'\\r\\n\'), làm hỏng hoàn toàn cấu trúc dữ liệu nhị phân.',
            options: [
                { key: 'A', text: 'Để mã hóa bảo vệ tệp bằng mật khẩu', isCorrect: false },
                { key: 'B', text: 'Để ngăn Windows tự động chuyển đổi ký tự xuống dòng làm sai lệch byte dữ liệu', isCorrect: true },
                { key: 'C', text: 'Để tăng tốc độ quay của đĩa cứng HDD', isCorrect: false },
                { key: 'D', text: 'Để tự động nén file', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 3,
        moduleId: 'CPP2-MOD-03',
        moduleTitle: 'Module 3: Tệp tin Nhị phân (Binary File I/O) và Cơ sở Dữ liệu Bản ghi',
        moduleObjective: 'Làm việc với tệp nhị phân, định dạng byte thô, truy xuất ngẫu nhiên và xây dựng engine lưu trữ bản ghi.',
        chapterId: 'CPP2-CH-03',
        chapterTitle: 'Chương 3: Tệp tin Nhị phân & Cơ sở Dữ liệu Bản ghi',
        chapterObjective: 'Làm chủ read/write nhị phân, con trỏ tệp seekg/seekp và cấu trúc file database có header.',
        file: 'Lesson_03_02.md',
        lessonId: 'CPP2-03.02',
        title: 'Bài 3.2: Đọc Ghi Cấu trúc Bản ghi và Định vị Con trỏ Tệp ngẫu nhiên (Random Access)',
        objective: 'Làm chủ kỹ thuật truy xuất ngẫu nhiên O(1) bản ghi bất kỳ bằng seekg, seekp, tellg và tellp.',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 2,
        exercise: {
            title: 'Truy xuất ngẫu nhiên bản ghi thứ K trong file nhị phân',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Cho struct \`Item\` gồm \`id\` (\`int\`) và \`price\` (\`double\`).
File nhị phân \`items.db\` chứa danh sách 5 mặt hàng:
* Index 0: ID 101, Price 10.0
* Index 1: ID 102, Price 25.5
* Index 2: ID 103, Price 50.0
* Index 3: ID 104, Price 75.0
* Index 4: ID 105, Price 99.9
Nhập vào một số nguyên $K$ ($0 \\le K < 5$). Sử dụng \`seekg\` nhảy trực tiếp đến bản ghi thứ $K$ và in ra:
\`ID: <id> - Price: <price>\``,
            starterCode: `#include <iostream>
#include <fstream>

struct Item {
    int id;
    double price;
};

int main() {
    int k;
    if (std::cin >> k) {
        // Truy xuất ngẫu nhiên bản ghi k
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <fstream>

struct Item {
    int id;
    double price;
};

int main() {
    const char* path = "items.db";
    {
        std::ofstream out(path, std::ios::binary);
        Item items[5] = {
            {101, 10.0}, {102, 25.5}, {103, 50.0}, {104, 75.0}, {105, 99.9}
        };
        out.write(reinterpret_cast<const char*>(items), sizeof(items));
    }

    int k;
    if (std::cin >> k && k >= 0 && k < 5) {
        std::ifstream in(path, std::ios::binary);
        in.seekg(k * sizeof(Item), std::ios::beg);
        Item item;
        in.read(reinterpret_cast<char*>(&item), sizeof(Item));
        std::cout << "ID: " << item.id << " - Price: " << item.price << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '2', expectedOutput: 'ID: 103 - Price: 50\n', isHidden: false },
                { input: '0', expectedOutput: 'ID: 101 - Price: 10\n', isHidden: false },
                { input: '4', expectedOutput: 'ID: 105 - Price: 99.9\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao struct dùng để ghi trực tiếp ra tệp nhị phân bắt buộc KHÔNG ĐƯỢC chứa thuộc tính `std::string`?',
            explanation: 'std::string chỉ chứa con trỏ trỏ tới vùng nhớ Heap trong RAM hiện tại. Nếu ghi thô ra file, bạn chỉ lưu được địa chỉ con trỏ rác; khi khởi động lại chương trình hoặc mở trên máy khác, con trỏ đó trở thành Dangling Pointer gây sập chương trình.',
            options: [
                { key: 'A', text: 'Vì std::string chỉ chạy được trên Linux', isCorrect: false },
                { key: 'B', text: 'Vì std::string chứa con trỏ động tới RAM, ghi thô ra file sẽ chỉ lưu địa chỉ rác', isCorrect: true },
                { key: 'C', text: 'Vì C++ cấm mở file khi có chuỗi văn bản', isCorrect: false },
                { key: 'D', text: 'Vì std::string tốn nhiều hơn 1 GB RAM', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 3,
        moduleId: 'CPP2-MOD-03',
        moduleTitle: 'Module 3: Tệp tin Nhị phân (Binary File I/O) và Cơ sở Dữ liệu Bản ghi',
        moduleObjective: 'Làm việc với tệp nhị phân, định dạng byte thô, truy xuất ngẫu nhiên và xây dựng engine lưu trữ bản ghi.',
        chapterId: 'CPP2-CH-03',
        chapterTitle: 'Chương 3: Tệp tin Nhị phân & Cơ sở Dữ liệu Bản ghi',
        chapterObjective: 'Làm chủ read/write nhị phân, con trỏ tệp seekg/seekp và cấu trúc file database có header.',
        file: 'Lesson_03_03.md',
        lessonId: 'CPP2-03.03',
        title: 'Bài 3.3: Xây dựng Mini Database Engine: File Header, Bản ghi và Chỉ mục Index',
        objective: 'Tự tay thiết kế cấu trúc tệp cơ sở dữ liệu hoàn chỉnh có File Header, Magic Number và đếm số lượng bản ghi.',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 3,
        exercise: {
            title: 'Kiểm tra tính hợp lệ của File Database bằng Magic Number',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Cho cấu trúc File Header của database:
\`\`\`cpp
struct Header {
    char magic[4]; // Phải chính xác là "MDB1"
    int recordCount;
};
\`\`\`
Viết chương trình kiểm tra file \`test.db\`:
* Nếu 4 bytes đầu đúng là \`"MDB1"\`, in ra: \`CSDL Hop Le - So ban ghi: <count>\`
* Ngược lại, in ra: \`CSDL Khong Hop Le\``,
            starterCode: `#include <iostream>
#include <fstream>
#include <cstring>

struct Header {
    char magic[4];
    int recordCount;
};

int main() {
    // Kiểm tra tính hợp lệ của Header file
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <fstream>
#include <cstring>

struct Header {
    char magic[4];
    int recordCount;
};

int main() {
    const char* path = "test.db";
    {
        std::ofstream out(path, std::ios::binary);
        Header h;
        std::memcpy(h.magic, "MDB1", 4);
        h.recordCount = 42;
        out.write(reinterpret_cast<const char*>(&h), sizeof(Header));
    }

    std::ifstream in(path, std::ios::binary);
    Header loaded;
    in.read(reinterpret_cast<char*>(&loaded), sizeof(Header));

    if (std::memcmp(loaded.magic, "MDB1", 4) == 0) {
        std::cout << "CSDL Hop Le - So ban ghi: " << loaded.recordCount << "\\n";
    } else {
        std::cout << "CSDL Khong Hop Le\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '', expectedOutput: 'CSDL Hop Le - So ban ghi: 42\n', isHidden: false }
            ]
        },
        quiz: {
            question: 'Khi chèn thêm một bản ghi vào cuối file database nhị phân, vì sao ta bắt buộc phải ghi đè lại File Header ở đầu file?',
            explanation: 'Vì trường recordCount (số lượng bản ghi hiện có) nằm trong File Header phải được tăng lên 1 để ở những lần mở tiếp theo, database engine nhận biết được bản ghi mới vừa được chèn.',
            options: [
                { key: 'A', text: 'Để đổi mật khẩu bảo vệ file', isCorrect: false },
                { key: 'B', text: 'Để cập nhật số lượng bản ghi (recordCount) giúp hệ thống quản lý chính xác dung lượng', isCorrect: true },
                { key: 'C', text: 'Để xóa các bản ghi cũ', isCorrect: false },
                { key: 'D', text: 'Để chuyển đổi file sang định dạng JSON', isCorrect: false }
            ]
        }
    },

    // ========================================================
    // MODULE 4: TIỀN XỬ LÝ & DỰ ÁN ĐA TỆP
    // ========================================================
    {
        moduleNumber: 4,
        moduleId: 'CPP2-MOD-04',
        moduleTitle: 'Module 4: Tiền xử lý (Preprocessor) và Quản lý Dự án Đa tệp (.h và .cpp)',
        moduleObjective: 'Học cách tổ chức dự án phần mềm chuyên nghiệp, phân tách Header và Implementation, kiểm soát chu kỳ build và Makefile.',
        chapterId: 'CPP2-CH-04',
        chapterTitle: 'Chương 4: Tiền xử lý & Quản lý Dự án Đa tệp',
        chapterObjective: 'Làm chủ chỉ thị preprocessor, tách biệt .h và .cpp, liên kết Linker và viết Makefile tự động hóa.',
        file: 'Lesson_04_01.md',
        lessonId: 'CPP2-04.01',
        title: 'Bài 4.1: Chỉ thị Tiền xử lý (#define, #ifdef, #pragma once) và Macro Nguy hiểm',
        objective: 'Hiểu bản chất thay thế chuỗi của Preprocessor, tránh bẫy macro hàm và làm chủ #pragma once.',
        difficulty: 'MEDIUM',
        durationMinutes: 20,
        orderIndex: 1,
        exercise: {
            title: 'Viết Macro kiểm tra điều kiện an toàn với đầy đủ ngoặc',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết một macro \`CLAMP(val, minVal, maxVal)\` để giới hạn giá trị của \`val\` trong đoạn \`[minVal, maxVal]\`:
* Nếu \`val < minVal\`, trả về \`minVal\`.
* Nếu \`val > maxVal\`, trả về \`maxVal\`.
* Ngược lại trả về \`val\`.
Nhập 3 số nguyên $v, low, high$. Sử dụng macro và in ra giá trị sau khi clamp.

### Ví dụ:
* **Đầu vào:** \`15 0 10\` -> **Đầu ra:** \`10\`
* **Đầu vào:** \`-5 0 10\` -> **Đầu ra:** \`0\``,
            starterCode: `#include <iostream>

// Định nghĩa macro CLAMP an toàn tại đây

int main() {
    int v, low, high;
    if (std::cin >> v >> low >> high) {
        // Gọi macro và in kết quả
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

#define CLAMP(val, minVal, maxVal) (((val) < (minVal)) ? (minVal) : (((val) > (maxVal)) ? (maxVal) : (val)))

int main() {
    int v, low, high;
    if (std::cin >> v >> low >> high) {
        std::cout << CLAMP(v, low, high) << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '15 0 10', expectedOutput: '10\n', isHidden: false },
                { input: '-5 0 10', expectedOutput: '0\n', isHidden: false },
                { input: '7 0 10', expectedOutput: '7\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao trong Modern C++, việc sử dụng `inline constexpr` được khuyến khích thay thế hoàn toàn macro `#define`?',
            explanation: 'inline constexpr có kiểu dữ liệu rõ ràng (Type-safe), tuân thủ quy tắc phạm vi (Scope), nằm trong bảng ký hiệu của Debugger và không gây ra các tác dụng phụ nguy hiểm của phép toán tăng/giảm.',
            options: [
                { key: 'A', text: 'Vì constexpr bắt buộc phải viết bằng tiếng Anh', isCorrect: false },
                { key: 'B', text: 'Vì constexpr an toàn kiểu, tuân thủ Scope, hỗ trợ Debugger và loại bỏ tác dụng phụ', isCorrect: true },
                { key: 'C', text: 'Vì macro #define chỉ dùng được trên hệ điều hành Linux', isCorrect: false },
                { key: 'D', text: 'Vì constexpr chạy chậm hơn macro', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 4,
        moduleId: 'CPP2-MOD-04',
        moduleTitle: 'Module 4: Tiền xử lý (Preprocessor) và Quản lý Dự án Đa tệp (.h và .cpp)',
        moduleObjective: 'Học cách tổ chức dự án phần mềm chuyên nghiệp, phân tách Header và Implementation, kiểm soát chu kỳ build và Makefile.',
        chapterId: 'CPP2-CH-04',
        chapterTitle: 'Chương 4: Tiền xử lý & Quản lý Dự án Đa tệp',
        chapterObjective: 'Làm chủ chỉ thị preprocessor, tách biệt .h và .cpp, liên kết Linker và viết Makefile tự động hóa.',
        file: 'Lesson_04_02.md',
        lessonId: 'CPP2-04.02',
        title: 'Bài 4.2: Cấu trúc Dự án Đa tệp: Tách biệt Interface (.h) và Implementation (.cpp)',
        objective: 'Làm chủ quy tắc vàng: Khai báo trong Header (.h), cài đặt thân hàm trong Source (.cpp), từ khóa extern và Linker.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 2,
        exercise: {
            title: 'Tổ chức hàm tính giai thừa và lũy thừa dạng module',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Mô phỏng cấu trúc module toán học:
* Hàm \`long long fact(int n)\`: Tính giai thừa $n!$.
* Hàm \`long long power(int base, int exp)\`: Tính $base^{exp}$.
Trong chương trình, nhập vào 3 số $n, b, e$. Gọi 2 hàm trên và in kết quả trên 2 dòng.

### Ví dụ:
* **Đầu vào:** \`5 2 4\`
* **Đầu ra:**
\`\`\`text
120
16
\`\`\``,
            starterCode: `#include <iostream>

// Khai báo Function Prototype (mô phỏng .h)
long long fact(int n);
long long power(int base, int exp);

int main() {
    int n, b, e;
    if (std::cin >> n >> b >> e) {
        std::cout << fact(n) << "\\n";
        std::cout << power(b, e) << "\\n";
    }
    return 0;
}

// Cài đặt thân hàm (mô phỏng .cpp)
`,
            solutionCode: `#include <iostream>

long long fact(int n) {
    long long res = 1;
    for (int i = 1; i <= n; ++i) res *= i;
    return res;
}

long long power(int base, int exp) {
    long long res = 1;
    for (int i = 0; i < exp; ++i) res *= base;
    return res;
}

int main() {
    int n, b, e;
    if (std::cin >> n >> b >> e) {
        std::cout << fact(n) << "\\n";
        std::cout << power(b, e) << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '5 2 4', expectedOutput: '120\n16\n', isHidden: false },
                { input: '3 3 3', expectedOutput: '6\n27\n', isHidden: false },
                { input: '0 5 0', expectedOutput: '1\n1\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Lỗi Linker "multiple definition of symbol" thường xảy ra do sai lầm nào trong thiết kế dự án đa tệp?',
            explanation: 'Nếu viết thân hàm thông thường trực tiếp trong file Header (.h), khi file .h này được include vào nhiều file .cpp khác nhau, mỗi file .o đều chứa một bản định nghĩa thân hàm, khiến Linker báo lỗi định nghĩa trùng lặp.',
            options: [
                { key: 'A', text: 'Do thiếu lệnh return trong hàm main', isCorrect: false },
                { key: 'B', text: 'Do định nghĩa thân hàm thông thường trực tiếp trong file Header và include vào nhiều file .cpp', isCorrect: true },
                { key: 'C', text: 'Do sử dụng con trỏ nullptr', isCorrect: false },
                { key: 'D', text: 'Do RAM của máy tính bị đầy', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 4,
        moduleId: 'CPP2-MOD-04',
        moduleTitle: 'Module 4: Tiền xử lý (Preprocessor) và Quản lý Dự án Đa tệp (.h và .cpp)',
        moduleObjective: 'Học cách tổ chức dự án phần mềm chuyên nghiệp, phân tách Header và Implementation, kiểm soát chu kỳ build và Makefile.',
        chapterId: 'CPP2-CH-04',
        chapterTitle: 'Chương 4: Tiền xử lý & Quản lý Dự án Đa tệp',
        chapterObjective: 'Làm chủ chỉ thị preprocessor, tách biệt .h và .cpp, liên kết Linker và viết Makefile tự động hóa.',
        file: 'Lesson_04_03.md',
        lessonId: 'CPP2-04.03',
        title: 'Bài 4.3: Tự động hóa Biên dịch với Makefile và Cờ g++ Tối ưu hóa (-O2, -Wall)',
        objective: 'Hiểu cơ chế Incremental Build của Makefile và sử dụng các cờ g++ chuẩn mực (-O2, -Wall, -Wextra).',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 3,
        exercise: {
            title: 'Mô phỏng quy tắc biến đổi phần mở rộng trong Makefile',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Trong Makefile, quy tắc đổi đuôi từ danh sách file \`.cpp\` sang \`.o\` là: \`$(SRCS:.cpp=.o)\`.
Nhập vào danh sách gồm 3 tên file mã nguồn C++ (ngăn cách bởi dấu cách).
Hãy in ra danh sách các file đối tượng \`.o\` tương ứng.

### Ví dụ:
* **Đầu vào:** \`main.cpp math.cpp utils.cpp\`
* **Đầu ra:** \`main.o math.o utils.o\``,
            starterCode: `#include <iostream>
#include <string>

int main() {
    std::string f1, f2, f3;
    if (std::cin >> f1 >> f2 >> f3) {
        // Đổi đuôi .cpp sang .o và in ra
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <string>

std::string toObj(std::string s) {
    if (s.length() >= 4 && s.substr(s.length() - 4) == ".cpp") {
        return s.substr(0, s.length() - 4) + ".o";
    }
    return s;
}

int main() {
    std::string f1, f2, f3;
    if (std::cin >> f1 >> f2 >> f3) {
        std::cout << toObj(f1) << " " << toObj(f2) << " " << toObj(f3) << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: 'main.cpp math.cpp utils.cpp', expectedOutput: 'main.o math.o utils.o\n', isHidden: false },
                { input: 'app.cpp server.cpp db.cpp', expectedOutput: 'app.o server.o db.o\n', isHidden: false },
                { input: 'a.cpp b.cpp c.cpp', expectedOutput: 'a.o b.o c.o\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Lợi ích lớn nhất của cơ chế Biên dịch gia tăng (Incremental Compilation) trong Makefile là gì?',
            explanation: 'Make dựa vào mốc thời gian timestamp để chỉ biên dịch lại các file .cpp nào có thay đổi kể từ lần build trước, giúp tiết kiệm thời gian chờ đợi biên dịch cho lập trình viên.',
            options: [
                { key: 'A', text: 'Tự động sửa lỗi cú pháp trong code', isCorrect: false },
                { key: 'B', text: 'Chỉ biên dịch lại các file mã nguồn bị thay đổi, giữ nguyên các file đối tượng cũ', isCorrect: true },
                { key: 'C', text: 'Tự động gửi code lên GitHub', isCorrect: false },
                { key: 'D', text: 'Giảm dung lượng ổ cứng', isCorrect: false }
            ]
        }
    },

    // ========================================================
    // MODULE 5: ĐỆ QUY NÂNG CAO & QUAY LUI
    // ========================================================
    {
        moduleNumber: 5,
        moduleId: 'CPP2-MOD-05',
        moduleTitle: 'Module 5: Đệ quy Nâng cao và Kỹ thuật Quay lui (Backtracking)',
        moduleObjective: 'Nâng tầm tư duy giải thuật với các bài toán tìm kiếm không gian trạng thái, đệ quy có nhớ (Memoization) và giải thuật vét cạn thông minh.',
        chapterId: 'CPP2-CH-05',
        chapterTitle: 'Chương 5: Đệ quy Nâng cao & Quay lui',
        chapterObjective: 'Làm chủ đệ quy có nhớ memoization, kỹ thuật quay lui sinh nhị phân, hoán vị và bài toán N quân hậu.',
        file: 'Lesson_05_01.md',
        lessonId: 'CPP2-05.01',
        title: 'Bài 5.1: Đệ quy có nhớ (Memoization) - Bước đệm đến Quy hoạch Động',
        objective: 'Hiểu bản chất cây đệ quy gối nhau O(2ᴺ) và kỹ thuật bảng nhớ cache giảm độ phức tạp xuống O(N).',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 1,
        exercise: {
            title: 'Tối ưu hóa đệ quy Fibonacci bằng mảng Memoization',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên $N$ ($0 \\le N \\le 60$).
Cài đặt hàm tính số Fibonacci thứ $N$ có áp dụng kỹ thuật Đệ quy có nhớ (Memoization) để chương trình chạy tức thì trong $O(N)$.
In ra kết quả số Fibonacci thứ $N$.

### Ví dụ:
* **Đầu vào:** \`10\` -> **Đầu ra:** \`55\`
* **Đầu vào:** \`50\` -> **Đầu ra:** \`12586269025\``,
            starterCode: `#include <iostream>
#include <vector>

std::vector<long long> memo(100, -1);

long long fib(int n) {
    // Cài đặt đệ quy có nhớ
    return 0;
}

int main() {
    int n;
    if (std::cin >> n) {
        std::cout << fib(n) << "\\n";
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <vector>

std::vector<long long> memo(100, -1);

long long fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}

int main() {
    int n;
    if (std::cin >> n) {
        std::cout << fib(n) << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '10', expectedOutput: '55\n', isHidden: false },
                { input: '50', expectedOutput: '12586269025\n', isHidden: false },
                { input: '0', expectedOutput: '0\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Khủng hoảng bùng nổ hàm mũ O(2ᴺ) trong hàm đệ quy Fibonacci ngây thơ xảy ra do nguyên nhân cốt lõi nào?',
            explanation: 'Các bài toán con bị gọi lặp đi lặp lại hàng triệu lần (Overlapping Subproblems) mà không có cơ chế lưu nhớ kết quả, khiến cây đệ quy phân nhánh nhân đôi ở mỗi tầng.',
            options: [
                { key: 'A', text: 'Do biến kết quả bị tràn số', isCorrect: false },
                { key: 'B', text: 'Do các bài toán con bị tính toán trùng lặp vô số lần trên cây đệ quy', isCorrect: true },
                { key: 'C', text: 'Do đệ quy không thể chạy trên kiến trúc 64-bit', isCorrect: false },
                { key: 'D', text: 'Do thiếu lệnh return', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 5,
        moduleId: 'CPP2-MOD-05',
        moduleTitle: 'Module 5: Đệ quy Nâng cao và Kỹ thuật Quay lui (Backtracking)',
        moduleObjective: 'Nâng tầm tư duy giải thuật với các bài toán tìm kiếm không gian trạng thái, đệ quy có nhớ (Memoization) và giải thuật vét cạn thông minh.',
        chapterId: 'CPP2-CH-05',
        chapterTitle: 'Chương 5: Đệ quy Nâng cao & Quay lui',
        chapterObjective: 'Làm chủ đệ quy có nhớ memoization, kỹ thuật quay lui sinh nhị phân, hoán vị và bài toán N quân hậu.',
        file: 'Lesson_05_02.md',
        lessonId: 'CPP2-05.02',
        title: 'Bài 5.2: Kỹ thuật Quay lui (Backtracking): Sinh Chuỗi Nhị phân và Sinh Hoán vị',
        objective: 'Làm chủ mô hình duyệt DFS không gian trạng thái: Thử chọn -> Đệ quy -> Hoàn tác (Backtrack).',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 2,
        exercise: {
            title: 'Liệt kê tất cả các chuỗi nhị phân độ dài N bằng Quay lui',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào một số nguyên dương $N$ ($1 \\le N \\le 10$).
Sử dụng thuật toán Quay lui để sinh và in ra tất cả các chuỗi nhị phân độ dài $N$ theo thứ tự từ điển, mỗi chuỗi trên một dòng.

### Ví dụ:
* **Đầu vào:** \`2\`
* **Đầu ra:**
\`\`\`text
00
01
10
11
\`\`\``,
            starterCode: `#include <iostream>

int n;
int a[20];

void backtrack(int k) {
    // Cài đặt thuật toán quay lui sinh nhị phân
}

int main() {
    if (std::cin >> n && n > 0) {
        backtrack(1);
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int n;
int a[20];

void printSol() {
    for (int i = 1; i <= n; ++i) std::cout << a[i];
    std::cout << "\\n";
}

void backtrack(int k) {
    for (int v = 0; v <= 1; ++v) {
        a[k] = v;
        if (k == n) printSol();
        else backtrack(k + 1);
    }
}

int main() {
    if (std::cin >> n && n > 0) {
        backtrack(1);
    }
    return 0;
}
`,
            testCases: [
                { input: '2', expectedOutput: '00\n01\n10\n11\n', isHidden: false },
                { input: '1', expectedOutput: '0\n1\n', isHidden: false },
                { input: '3', expectedOutput: '000\n001\n010\n011\n100\n101\n110\n111\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Bước "Hoàn tác trạng thái" (Backtrack Step) trong thuật toán Quay lui có ý nghĩa cốt lõi gì?',
            explanation: 'Bước hoàn tác (như used[val] = false) giúp trả lại nguyên vẹn trạng thái ban đầu của hệ thống sau khi duyệt xong một nhánh đệ quy, để các nhánh tìm kiếm tiếp theo có thể tái sử dụng tài nguyên đó.',
            options: [
                { key: 'A', text: 'Để xóa bộ nhớ RAM', isCorrect: false },
                { key: 'B', text: 'Khôi phục lại trạng thái ban đầu để các nhánh rẽ kế tiếp có thể thử nghiệm độc lập', isCorrect: true },
                { key: 'C', text: 'Để kết thúc chương trình sớm', isCorrect: false },
                { key: 'D', text: 'Để tăng tốc độ xung nhịp CPU', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 5,
        moduleId: 'CPP2-MOD-05',
        moduleTitle: 'Module 5: Đệ quy Nâng cao và Kỹ thuật Quay lui (Backtracking)',
        moduleObjective: 'Nâng tầm tư duy giải thuật với các bài toán tìm kiếm không gian trạng thái, đệ quy có nhớ (Memoization) và giải thuật vét cạn thông minh.',
        chapterId: 'CPP2-CH-05',
        chapterTitle: 'Chương 5: Đệ quy Nâng cao & Quay lui',
        chapterObjective: 'Làm chủ đệ quy có nhớ memoization, kỹ thuật quay lui sinh nhị phân, hoán vị và bài toán N quân hậu.',
        file: 'Lesson_05_03.md',
        lessonId: 'CPP2-05.03',
        title: 'Bài 5.3: Bài toán N Quân hậu (N-Queens) và Kỹ thuật Cắt tỉa Nhánh cận',
        objective: 'Cài đặt thuật toán kinh điển N-Queens với kỹ thuật đánh dấu 2 đường chéo và cắt tỉa nhánh cụt trong O(1).',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 3,
        exercise: {
            title: 'Đếm số lượng cách xếp N Quân hậu an toàn trên bàn cờ NxN',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào số nguyên $N$ ($1 \\le N \\le 10$).
Sử dụng thuật toán Quay lui có Cắt tỉa nhánh cận để đếm xem có bao nhiêu cách đặt $N$ quân hậu lên bàn cờ $N \\times N$ sao cho không quân nào ăn được quân nào.
In ra tổng số cách tìm được.

### Ví dụ:
* **Đầu vào:** \`4\` -> **Đầu ra:** \`2\`
* **Đầu vào:** \`8\` -> **Đầu ra:** \`92\``,
            starterCode: `#include <iostream>

int n;
int countSolutions = 0;

// Cài đặt hàm solveNQueens với 3 mảng đánh dấu

int main() {
    if (std::cin >> n && n > 0) {
        // Đếm và in kết quả
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int n;
int countSolutions = 0;
bool colUsed[30]{false};
bool diagMain[60]{false};
bool diagAnti[60]{false};

void solve(int row) {
    for (int col = 1; col <= n; ++col) {
        if (!colUsed[col] && !diagMain[row - col + n] && !diagAnti[row + col]) {
            colUsed[col] = true;
            diagMain[row - col + n] = true;
            diagAnti[row + col] = true;

            if (row == n) countSolutions++;
            else solve(row + 1);

            colUsed[col] = false;
            diagMain[row - col + n] = false;
            diagAnti[row + col] = false;
        }
    }
}

int main() {
    if (std::cin >> n && n > 0) {
        solve(1);
        std::cout << countSolutions << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '4', expectedOutput: '2\n', isHidden: false },
                { input: '8', expectedOutput: '92\n', isHidden: false },
                { input: '1', expectedOutput: '1\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong bài toán N-Queens, công thức nào giúp xác định chỉ số mảng đánh dấu của Đường chéo phụ (ngược) từ tọa độ hàng i và cột j?',
            explanation: 'Tất cả các ô trên cùng một đường chéo ngược đều có tổng tọa độ hàng và cột bằng nhau: i + j.',
            options: [
                { key: 'A', text: 'i * j', isCorrect: false },
                { key: 'B', text: 'i + j', isCorrect: true },
                { key: 'C', text: 'i - j', isCorrect: false },
                { key: 'D', text: 'i / j', isCorrect: false }
            ]
        }
    },

    // ========================================================
    // MODULE 6: NGOẠI LỆ & TỐI ƯU HÓA CACHE
    // ========================================================
    {
        moduleNumber: 6,
        moduleId: 'CPP2-MOD-06',
        moduleTitle: 'Module 6: Xử lý Ngoại lệ Hệ thống và Tối ưu hóa Hiệu năng Bộ nhớ Cache',
        moduleObjective: 'Xây dựng các chương trình kiên cố chịu lỗi cao và hiểu cách mã nguồn tương tác với bộ nhớ đệm Cache phần cứng.',
        chapterId: 'CPP2-CH-06',
        chapterTitle: 'Chương 6: Ngoại lệ Hệ thống & Tối ưu Hiệu năng Cache',
        chapterObjective: 'Làm chủ try/catch/throw/noexcept, nguyên lý Spatial/Temporal Locality của Cache Line và đồ án binary database engine.',
        file: 'Lesson_06_01.md',
        lessonId: 'CPP2-06.01',
        title: 'Bài 6.1: Cơ chế Xử lý Ngoại lệ Hệ thống (try, catch, throw, noexcept)',
        objective: 'Hiểu cơ chế Stack Unwinding, kế thừa std::exception và tối ưu hàm với từ khóa noexcept.',
        difficulty: 'MEDIUM',
        durationMinutes: 25,
        orderIndex: 1,
        exercise: {
            title: 'Bắt ngoại lệ chia cho 0 với std::runtime_error',
            difficulty: 'MEDIUM',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết hàm \`double safeDivide(double a, double b)\`.
* Nếu $b == 0$, ném ngoại lệ \`std::runtime_error("Loi chia cho 0")\`.
* Ngược lại trả về $a / b$.
Trong \`main()\`, nhập 2 số $a, b$. Gọi hàm trong khối \`try-catch\`:
* Nếu thành công: in kết quả phép chia.
* Nếu bắt được ngoại lệ: in ra thông điệp của \`e.what()\`.

### Ví dụ:
* **Đầu vào:** \`10 2\` -> **Đầu ra:** \`5\`
* **Đầu vào:** \`10 0\` -> **Đầu ra:** \`Loi chia cho 0\``,
            starterCode: `#include <iostream>
#include <stdexcept>

// Cài đặt hàm safeDivide

int main() {
    double a, b;
    if (std::cin >> a >> b) {
        // try-catch an toàn
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <stdexcept>

double safeDivide(double a, double b) {
    if (b == 0.0) {
        throw std::runtime_error("Loi chia cho 0");
    }
    return a / b;
}

int main() {
    double a, b;
    if (std::cin >> a >> b) {
        try {
            std::cout << safeDivide(a, b) << "\\n";
        } catch (const std::exception& e) {
            std::cout << e.what() << "\\n";
        }
    }
    return 0;
}
`,
            testCases: [
                { input: '10 2', expectedOutput: '5\n', isHidden: false },
                { input: '10 0', expectedOutput: 'Loi chia cho 0\n', isHidden: false },
                { input: '7 2', expectedOutput: '3.5\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao việc ném ngoại lệ từ bên trong một hàm Hủy (Destructor) bị nghiêm cấm tuyệt đối trong C++?',
            explanation: 'Nếu một ngoại lệ thứ hai bị ném ra từ Destructor trong khi hệ thống đang xử lý một ngoại lệ trước đó (Stack Unwinding), C++ không thể xử lý đồng thời 2 ngoại lệ và lập tức gọi std::terminate() để cưỡng chế sập toàn bộ tiến trình.',
            options: [
                { key: 'A', text: 'Vì Destructor không có kiểu trả về', isCorrect: false },
                { key: 'B', text: 'Vì nếu ném lỗi trong lúc đang Stack Unwinding, hệ thống sẽ sập lập tức (std::terminate)', isCorrect: true },
                { key: 'C', text: 'Vì Destructor chỉ chạy trên Heap', isCorrect: false },
                { key: 'D', text: 'Vì Destructor chỉ dùng được cho struct', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 6,
        moduleId: 'CPP2-MOD-06',
        moduleTitle: 'Module 6: Xử lý Ngoại lệ Hệ thống và Tối ưu hóa Hiệu năng Bộ nhớ Cache',
        moduleObjective: 'Xây dựng các chương trình kiên cố chịu lỗi cao và hiểu cách mã nguồn tương tác với bộ nhớ đệm Cache phần cứng.',
        chapterId: 'CPP2-CH-06',
        chapterTitle: 'Chương 6: Ngoại lệ Hệ thống & Tối ưu Hiệu năng Cache',
        chapterObjective: 'Làm chủ try/catch/throw/noexcept, nguyên lý Spatial/Temporal Locality của Cache Line và đồ án binary database engine.',
        file: 'Lesson_06_02.md',
        lessonId: 'CPP2-06.02',
        title: 'Bài 6.2: Tối ưu hóa Hiệu năng Cache-Friendly Code (Spatial & Temporal Locality)',
        objective: 'Giải mã bí mật CPU Cache Line 64 bytes, nguyên lý lân cận không gian/thời gian và tại sao std::vector luôn thắng Linked List.',
        difficulty: 'HARD',
        durationMinutes: 30,
        orderIndex: 2,
        exercise: {
            title: 'Duyệt ma trận theo hàng Cache-friendly',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào kích thước $R$ và $C$ và ma trận số nguyên kích thước $R \\times C$.
Viết vòng lặp theo đúng chuẩn **Cache-Friendly (Duyệt theo hàng: Hàng ở ngoài, Cột ở trong)** để tính tổng toàn bộ các phần tử.
In ra kết quả tổng.

### Ví dụ:
* **Đầu vào:**
\`\`\`text
2 3
1 2 3
4 5 6
\`\`\`
* **Đầu ra:** \`21\``,
            starterCode: `#include <iostream>

int main() {
    int r, c;
    if (std::cin >> r >> c && r > 0 && c > 0) {
        // Duyệt ma trận theo hàng Cache-friendly
    }
    return 0;
}
`,
            solutionCode: `#include <iostream>

int main() {
    int r, c;
    if (std::cin >> r >> c && r > 0 && c > 0) {
        int mat[100][100];
        for (int i = 0; i < r; ++i) {
            for (int j = 0; j < c; ++j) {
                std::cin >> mat[i][j];
            }
        }

        long long total = 0;
        // Duyệt theo hàng (Spatial Locality tối đa):
        for (int i = 0; i < r; ++i) {
            for (int j = 0; j < c; ++j) {
                total += mat[i][j];
            }
        }
        std::cout << total << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '21\n', isHidden: false },
                { input: '1 1\n99', expectedOutput: '99\n', isHidden: false },
                { input: '2 2\n-5 10\n15 -20', expectedOutput: '0\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Tại sao việc duyệt ma trận 2 chiều theo hàng (`matrix[i][j]`) lại chạy nhanh hơn từ 5 đến 10 lần so với việc duyệt theo cột (`matrix[j][i]`)?',
            explanation: 'Trong C++, mảng 2D được bố trí liên tiếp theo cơ chế Row-Major. Khi duyệt theo hàng, CPU sẽ tải sẵn 64 bytes lân cận vào Cache Line (Spatial Locality), tạo ra tỷ lệ Cache Hit liên tục. Duyệt theo cột làm bước nhảy ô nhớ quá xa, gây Cache Miss liên tục.',
            options: [
                { key: 'A', text: 'Vì biến i luôn chạy nhanh hơn biến j', isCorrect: false },
                { key: 'B', text: 'Vì duyệt theo hàng tận dụng tối đa hiện tượng Cache Hit nhờ các phần tử nằm liên tiếp trong RAM', isCorrect: true },
                { key: 'C', text: 'Vì hệ điều hành chặn việc duyệt theo cột', isCorrect: false },
                { key: 'D', text: 'Vì duyệt theo cột tốn nhiều điện năng hơn', isCorrect: false }
            ]
        }
    },
    {
        moduleNumber: 6,
        moduleId: 'CPP2-MOD-06',
        moduleTitle: 'Module 6: Xử lý Ngoại lệ Hệ thống và Tối ưu hóa Hiệu năng Bộ nhớ Cache',
        moduleObjective: 'Xây dựng các chương trình kiên cố chịu lỗi cao và hiểu cách mã nguồn tương tác với bộ nhớ đệm Cache phần cứng.',
        chapterId: 'CPP2-CH-06',
        chapterTitle: 'Chương 6: Ngoại lệ Hệ thống & Tối ưu Hiệu năng Cache',
        chapterObjective: 'Làm chủ try/catch/throw/noexcept, nguyên lý Spatial/Temporal Locality của Cache Line và đồ án binary database engine.',
        file: 'Lesson_06_03.md',
        lessonId: 'CPP2-06.03',
        title: 'Bài 6.3: Đồ án Kết khóa: Hệ thống Quản trị Bản ghi Nhị phân (Binary Record Storage Engine)',
        objective: 'Tích hợp toàn diện POD struct, Smart Pointers, File I/O nhị phân, Random Access và Exception Handling vào Đồ án kết khóa.',
        difficulty: 'HARD',
        durationMinutes: 35,
        orderIndex: 3,
        exercise: {
            title: 'Cập nhật số dư tài khoản trực tiếp trong file nhị phân (In-place update)',
            difficulty: 'HARD',
            problemDescription: `### Yêu Cầu Đề Bài:
Cho cấu trúc tài khoản lưu trong file \`acc.dat\`:
\`\`\`cpp
#pragma pack(push, 1)
struct Account {
    int id;          // 4 bytes
    char name[32];   // 32 bytes
    double balance;  // 8 bytes (Offset bắt đầu từ byte 36)
};
#pragma pack(pop)
\`\`\`
Nhập vào chỉ số bản ghi $idx$ và số dư mới $newBal$.
Sử dụng \`seekp\` nhảy trực tiếp đến trường \`balance\` của bản ghi đó và cập nhật số dư.
Đọc lại bản ghi và in ra: \`ID: <id> - New Balance: <balance>\`.

### Ví dụ:
* **Đầu vào:** \`1 5500.5\`
* **Đầu ra:** \`ID: 102 - New Balance: 5500.5\``,
            starterCode: `#include <iostream>
#include <fstream>
#include <cstring>

#pragma pack(push, 1)
struct Account {
    int id;
    char name[32];
    double balance;
};
#pragma pack(pop)

int main() {
    // Khởi tạo file acc.dat và cập nhật số dư in-place
    return 0;
}
`,
            solutionCode: `#include <iostream>
#include <fstream>
#include <cstring>

#pragma pack(push, 1)
struct Account {
    int id;
    char name[32];
    double balance;
};
#pragma pack(pop)

int main() {
    const char* path = "acc.dat";
    {
        std::ofstream out(path, std::ios::binary);
        Account accs[2] = {
            {101, "User A", 1000.0},
            {102, "User B", 2000.0}
        };
        out.write(reinterpret_cast<const char*>(accs), sizeof(accs));
    }

    int idx;
    double newBal;
    if (std::cin >> idx >> newBal && idx >= 0 && idx < 2) {
        std::fstream file(path, std::ios::in | std::ios::out | std::ios::binary);
        std::streampos pos = idx * sizeof(Account) + offsetof(Account, balance);
        file.seekp(pos, std::ios::beg);
        file.write(reinterpret_cast<const char*>(&newBal), sizeof(double));
        file.close();

        std::ifstream in(path, std::ios::binary);
        in.seekg(idx * sizeof(Account), std::ios::beg);
        Account updated;
        in.read(reinterpret_cast<char*>(&updated), sizeof(Account));
        std::cout << "ID: " << updated.id << " - New Balance: " << updated.balance << "\\n";
    }
    return 0;
}
`,
            testCases: [
                { input: '1 5500.5', expectedOutput: 'ID: 102 - New Balance: 5500.5\n', isHidden: false },
                { input: '0 999.0', expectedOutput: 'ID: 101 - New Balance: 999\n', isHidden: false },
                { input: '1 0.0', expectedOutput: 'ID: 102 - New Balance: 0\n', isHidden: true }
            ]
        },
        quiz: {
            question: 'Trong kiến trúc Storage Engine nhị phân, toán tử `offsetof(StructName, MemberName)` có vai trò gì?',
            explanation: 'Toán tử offsetof trả về chính xác số byte khoảng cách từ đầu struct đến trường thành viên mong muốn, cho phép con trỏ tệp seekp nhảy chính xác tới trường đó để cập nhật in-place mà không cần ghi đè các trường khác.',
            options: [
                { key: 'A', text: 'Đo kích thước toàn bộ struct', isCorrect: false },
                { key: 'B', text: 'Tính độ lệch byte của trường thành viên so với vị trí bắt đầu của struct', isCorrect: true },
                { key: 'C', text: 'Mã hóa trường thành viên', isCorrect: false },
                { key: 'D', text: 'Xóa trường thành viên khỏi RAM', isCorrect: false }
            ]
        }
    }
];

async function main() {
    console.log('🚀 Bắt đầu triển khai KHÓA HỌC 2: C++ NÂNG CAO & LẬP TRÌNH HỆ THỐNG (CPP-ADVANCED)...');

    // 1. Tìm Admin
    let admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });
    if (!admin) admin = await prisma.user.findFirst();
    if (!admin) throw new Error('Chưa có người dùng trong DB.');

    // 2. Tạo hoặc Cập nhật Course 2
    const cppAdvCourseId = 'd8c6d8b2-5f9e-4f0c-0d4b-9c8e7f6a5b22';
    const course = await prisma.course.upsert({
        where: { id: cppAdvCourseId },
        update: {
            title: 'Lập trình C++ Nâng cao & Lập trình Hệ thống (C++ Advanced & Systems)',
            description: 'Khóa học chuyên sâu về kiến trúc phần cứng, phân vùng bộ nhớ RAM (Stack, Heap, BSS), con trỏ nâng cao, Smart Pointers, file nhị phân, tiền xử lý đa tệp, đệ quy có nhớ, quay lui và tối ưu hóa CPU Cache.',
            level: 'ADVANCED' as any,
            status: 'PUBLISHED' as any,
            thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            createdBy: admin.id
        },
        create: {
            id: cppAdvCourseId,
            title: 'Lập trình C++ Nâng cao & Lập trình Hệ thống (C++ Advanced & Systems)',
            description: 'Khóa học chuyên sâu về kiến trúc phần cứng, phân vùng bộ nhớ RAM (Stack, Heap, BSS), con trỏ nâng cao, Smart Pointers, file nhị phân, tiền xử lý đa tệp, đệ quy có nhớ, quay lui và tối ưu hóa CPU Cache.',
            level: 'ADVANCED' as any,
            status: 'PUBLISHED' as any,
            thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            createdBy: admin.id
        }
    });
    console.log(`✅ Khóa học: ${course.title} (ID: ${course.id})`);

    // 3. Nhóm các bài học theo Module
    const modulesMap = new Map<string, LessonSeedItem[]>();
    for (const item of lessonsToSeed) {
        if (!modulesMap.has(item.moduleId)) {
            modulesMap.set(item.moduleId, []);
        }
        modulesMap.get(item.moduleId)!.push(item);
    }

    let modOrder = 1;
    for (const [moduleId, items] of modulesMap.entries()) {
        const firstItem = items[0];
        console.log(`\n======================================================`);
        console.log(`📦 Module ${modOrder}: ${moduleId} - ${firstItem.moduleTitle}`);
        console.log(`======================================================`);

        // Tạo hoặc cập nhật Module
        let mod = await prisma.module.findUnique({
            where: { moduleId: moduleId }
        });

        if (!mod) {
            mod = await prisma.module.create({
                data: {
                    courseId: course.id,
                    moduleId: moduleId,
                    title: firstItem.moduleTitle,
                    objective: firstItem.moduleObjective,
                    duration: '10 giờ',
                    orderIndex: modOrder
                }
            });
            console.log(`  ➕ Tạo mới Module: ${mod.title}`);
        } else {
            mod = await prisma.module.update({
                where: { id: mod.id },
                data: {
                    courseId: course.id,
                    title: firstItem.moduleTitle,
                    objective: firstItem.moduleObjective,
                    orderIndex: modOrder
                }
            });
            console.log(`  📂 Cập nhật Module: ${mod.title}`);
        }
        modOrder++;

        // Tạo hoặc cập nhật Chapter
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
            console.log(`  ➕ Tạo mới Chapter: ${chapter.title}`);
        } else {
            chapter = await prisma.chapter.update({
                where: { id: chapter.id },
                data: {
                    title: firstItem.chapterTitle,
                    objective: firstItem.chapterObjective
                }
            });
            console.log(`  📂 Cập nhật Chapter: ${chapter.title}`);
        }

        // Thư mục chứa tài liệu markdown
        const docsDir = path.resolve(
            __dirname,
            `../../docs/Dữ liệu nội dung bài học/C++/Khóa 2 - C++ Nâng cao/Module ${String(firstItem.moduleNumber).padStart(2, '0')}`
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
    console.log('🎉 HOÀN TẤT TRIỂN KHAI TOÀN BỘ KHÓA 2: C++ NÂNG CAO!');
    console.log(`🎉 Khóa học gồm 6 Modules và 19 bài học chuyên sâu đã được nạp thành công.`);
    console.log(`🌐 Xem khóa học tại: http://localhost:5173/course/${course.id}`);
    console.log('======================================================\n');
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi triển khai Khóa C++ Nâng cao:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
