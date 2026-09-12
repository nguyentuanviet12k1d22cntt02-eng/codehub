import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log('🚀 Bắt đầu triển khai trọn bộ 5 bài học của Module 1 (CPP-MOD-01)...');

    const cppCourseId = 'c7b5c7a1-4f8d-4e9b-9c3a-8b7d6e5f4a11';

    // 1. Kiểm tra khóa học C++
    const course = await prisma.course.findUnique({
        where: { id: cppCourseId }
    });

    if (!course) {
        throw new Error('Chưa tìm thấy Khóa học C++. Vui lòng chạy seed_cpp_course trước.');
    }

    // 2. Tìm Module 1
    const module1 = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-01' }
    });

    if (!module1) {
        throw new Error('Chưa tìm thấy Module 1 (CPP-MOD-01).');
    }

    // 3. Tìm hoặc Tạo Chapter 1
    let chapter1 = await prisma.chapter.findFirst({
        where: {
            moduleId: module1.id,
            chapterId: 'CPP-CH-01'
        }
    });

    if (!chapter1) {
        chapter1 = await prisma.chapter.create({
            data: {
                moduleId: module1.id,
                chapterId: 'CPP-CH-01',
                title: 'Chương 1: Tổng quan và Môi trường thực thi',
                objective: 'Làm chủ quy trình biên dịch C++, cấu trúc chương trình C++17, kiểu dữ liệu và toán tử cơ sở.',
                orderIndex: 1
            }
        });
    }

    console.log(`📂 [Chapter 1]: ${chapter1.title}`);

    // Thư mục chứa tài liệu markdown
    const docsDir = path.resolve(__dirname, '../../docs/Dữ liệu nội dung bài học/C++/Khóa 1 - C++ Cơ bản/Module 01');

    // 4. Danh sách 5 bài học của Module 1
    const lessonsData = [
        {
            file: 'Lesson_01_01.md',
            lessonId: 'CPP-01.01',
            title: 'Bài 1.1: Tổng quan ngôn ngữ C++ và Quy trình Biên dịch',
            objective: 'Nắm vững 4 giai đoạn biên dịch C++ và viết chương trình Hello World chuẩn C++17.',
            difficulty: 'EASY',
            durationMinutes: 15,
            orderIndex: 1,
            exercise: {
                title: 'Chương trình C++ đầu tiên: Giới thiệu bản thân',
                difficulty: 'EASY',
                problemDescription: `### Yêu Cầu Đề Bài:
Hãy viết một chương trình C++ hoàn chỉnh sử dụng \`std::cout\` để in ra màn hình 2 dòng thông tin:
* Dòng 1: \`Ho va ten: Nguyen Tuan Viet\`
* Dòng 2: \`Muc tieu: Lam chu C++ va tro thanh Backend / Game Engineer!\`

### Ràng buộc kỹ thuật:
* Mỗi dòng xuất kết thúc bằng ký tự xuống dòng \`'\\n'\`.
* Chương trình trả về mã kết thúc \`0\`.`,
                starterCode: `// Viết chương trình C++ đầu tiên của bạn tại đây
#include <iostream>

int main() {
    // Gõ câu lệnh xuất dữ liệu của bạn ở đây:
    
    return 0;
}
`,
                solutionCode: `#include <iostream>

int main() {
    std::cout << "Ho va ten: Nguyen Tuan Viet" << '\\n';
    std::cout << "Muc tieu: Lam chu C++ va tro thanh Backend / Game Engineer!" << '\\n';
    return 0;
}
`,
                testCases: [
                    {
                        input: '',
                        expectedOutput: `Ho va ten: Nguyen Tuan Viet\nMuc tieu: Lam chu C++ va tro thanh Backend / Game Engineer!\n`,
                        isHidden: false
                    }
                ]
            },
            quiz: {
                question: 'Giai đoạn nào trong quá trình xây dựng chương trình C++ chịu trách nhiệm kết hợp các file đối tượng (.obj/.o) và nạp các thư viện chuẩn (như iostream) để tạo ra file thực thi cuối cùng .exe?',
                explanation: 'Trình liên kết (Linker) là bước thứ 4 có nhiệm vụ kết nối các hàm ngoài và thư viện chuẩn vào file mã máy để tạo ra tệp thực thi độc lập .exe.',
                options: [
                    { key: 'A', text: 'Preprocessor (Trình tiền xử lý)', isCorrect: false },
                    { key: 'B', text: 'Compiler (Trình biên dịch)', isCorrect: false },
                    { key: 'C', text: 'Assembler (Trình hợp dịch)', isCorrect: false },
                    { key: 'D', text: 'Linker (Trình liên kết)', isCorrect: true }
                ]
            }
        },
        {
            file: 'Lesson_01_02.md',
            lessonId: 'CPP-01.02',
            title: 'Bài 1.2: Cấu trúc chương trình C++ chuẩn C++17 và Thao tác I/O cơ bản',
            objective: 'Làm chủ dòng xuất std::cout, dòng nhập std::cin, phân biệt hiệu năng std::endl vs \'\\n\' và quy tắc namespace.',
            difficulty: 'EASY',
            durationMinutes: 20,
            orderIndex: 2,
            exercise: {
                title: 'Tính tổng hai số nguyên từ dòng nhập bàn phím',
                difficulty: 'EASY',
                problemDescription: `### Yêu Cầu Đề Bài:
Viết chương trình C++ nhận vào 2 số nguyên $a$ và $b$ từ bàn phím (ngăn cách bởi dấu cách hoặc dấu xuống dòng).
Hãy tính tổng của 2 số và in ra màn hình theo đúng định dạng:
\`Tong: <ket_qua>\`

### Ví dụ:
* **Đầu vào:** \`15 27\`
* **Đầu ra:** \`Tong: 42\`

### Ràng buộc kỹ thuật:
* Sử dụng \`std::cin >> a >> b;\` để đọc dữ liệu.
* In kết quả kết thúc bằng ký tự \`'\\n'\`.`,
                starterCode: `#include <iostream>

int main() {
    // 1. Khai báo biến
    
    // 2. Nhập dữ liệu với std::cin
    
    // 3. Tính toán và in ra: Tong: <ket_qua>
    
    return 0;
}
`,
                solutionCode: `#include <iostream>

int main() {
    int a = 0, b = 0;
    if (std::cin >> a >> b) {
        std::cout << "Tong: " << (a + b) << '\\n';
    }
    return 0;
}
`,
                testCases: [
                    {
                        input: '15 27',
                        expectedOutput: 'Tong: 42\n',
                        isHidden: false
                    },
                    {
                        input: '100 -25',
                        expectedOutput: 'Tong: 75\n',
                        isHidden: true
                    }
                ]
            },
            quiz: {
                question: 'Tại sao trong các bài toán thuật toán và dự án hiệu năng cao, các kỹ sư C++ luôn khuyến nghị sử dụng ký tự \'\\n\' thay vì std::endl?',
                explanation: 'std::endl tương đương với \'\\n\' << std::flush. Việc ép xả buffer sau mỗi dòng khiến chương trình phải thực hiện rất nhiều System Call xuống hệ điều hành, gây nghẽn hiệu năng nghiêm trọng.',
                options: [
                    { key: 'A', text: 'Vì std::endl tốn nhiều bộ nhớ RAM hơn \'\\n\'', isCorrect: false },
                    { key: 'B', text: 'Vì std::endl không tương thích với chuẩn C++17', isCorrect: false },
                    { key: 'C', text: 'Vì std::endl tự động thực hiện thao tác flush xả bộ đệm liên tục, làm giảm mạnh tốc độ thực thi I/O', isCorrect: true },
                    { key: 'D', text: 'Vì std::endl chỉ hoạt động được trên hệ điều hành Windows', isCorrect: false }
                ]
            }
        },
        {
            file: 'Lesson_01_03.md',
            lessonId: 'CPP-01.03',
            title: 'Bài 1.3: Biến, Hằng số (const & constexpr) và Khởi tạo dữ liệu Clean Code',
            objective: 'Hiểu sâu bản chất ô nhớ RAM, quy chuẩn Uniform Initialization {}, phân biệt const và constexpr.',
            difficulty: 'EASY',
            durationMinutes: 20,
            orderIndex: 3,
            exercise: {
                title: 'Tính chu vi và diện tích hình tròn với hằng số const PI',
                difficulty: 'EASY',
                problemDescription: `### Yêu Cầu Đề Bài:
Hãy khai báo hằng số số thực \`const double PI = 3.14159;\`.
Viết chương trình nhận vào bán kính $r$ (số thực dương) của hình tròn từ bàn phím.
Hãy tính và in ra:
* Dòng 1: \`Chu vi: <gia_tri>\` (Công thức: $C = 2 \\times PI \\times r$)
* Dòng 2: \`Dien tich: <gia_tri>\` (Công thức: $S = PI \\times r \\times r$)

### Ví dụ:
* **Đầu vào:** \`5.0\`
* **Đầu ra:**
\`\`\`text
Chu vi: 31.4159
Dien tich: 78.5398
\`\`\``,
                starterCode: `#include <iostream>

int main() {
    const double PI = 3.14159;
    // Khai báo bán kính r và tính toán:
    
    return 0;
}
`,
                solutionCode: `#include <iostream>

int main() {
    const double PI = 3.14159;
    double r = 0.0;
    if (std::cin >> r) {
        double chuVi = 2.0 * PI * r;
        double dienTich = PI * r * r;
        std::cout << "Chu vi: " << chuVi << '\\n';
        std::cout << "Dien tich: " << dienTich << '\\n';
    }
    return 0;
}
`,
                testCases: [
                    {
                        input: '5.0',
                        expectedOutput: 'Chu vi: 31.4159\nDien tich: 78.5398\n',
                        isHidden: false
                    },
                    {
                        input: '10.0',
                        expectedOutput: 'Chu vi: 62.8318\nDien tich: 314.159\n',
                        isHidden: true
                    }
                ]
            },
            quiz: {
                question: 'Trong C++17, từ khóa nào sau đây được dùng để định nghĩa một hằng số mà giá trị của nó BẮT BUỘC phải được tính toán và xác định cố định ngay tại thời điểm biên dịch (Compile-time)?',
                explanation: 'constexpr (Constant Expression) yêu cầu biểu thức phải được tính toán ngay tại thời gian biên dịch, giúp tối ưu hiệu năng tối đa và có thể dùng làm kích thước mảng tĩnh.',
                options: [
                    { key: 'A', text: 'const', isCorrect: false },
                    { key: 'B', text: 'constexpr', isCorrect: true },
                    { key: 'C', text: 'static', isCorrect: false },
                    { key: 'D', text: 'volatile', isCorrect: false }
                ]
            }
        },
        {
            file: 'Lesson_01_04.md',
            lessonId: 'CPP-01.04',
            title: 'Bài 1.4: Hệ thống Kiểu dữ liệu nguyên thủy và Lỗi tràn số (Overflow)',
            objective: 'Nắm vững kích thước các kiểu dữ liệu, đo bộ nhớ bằng sizeof(), kiểm soát tràn số nguyên với long long.',
            difficulty: 'MEDIUM',
            durationMinutes: 25,
            orderIndex: 4,
            exercise: {
                title: 'Tính tích hai số nguyên lớn chống tràn số',
                difficulty: 'MEDIUM',
                problemDescription: `### Yêu Cầu Đề Bài:
Nhập vào 2 số nguyên $a$ và $b$ từ bàn phím (với $1 \\le a, b \\le 10^9$).
Hãy tính và in ra tích của hai số $a \\times b$.

### Ví dụ:
* **Đầu vào:** \`1000000000 1000000000\` (Hai số $10^9$)
* **Đầu ra:** \`1000000000000000000\` ($10^{18}$)

### Ràng buộc kỹ thuật:
* Vì tích có thể đạt tới $10^{18}$ (vượt xa giới hạn $2 \\times 10^9$ của \`int\`), bắt buộc phải sử dụng kiểu \`long long\` để chống tràn số.`,
                starterCode: `#include <iostream>

int main() {
    // Chú ý chọn kiểu dữ liệu phù hợp chống tràn số (Overflow):
    
    return 0;
}
`,
                solutionCode: `#include <iostream>

int main() {
    long long a = 0, b = 0;
    if (std::cin >> a >> b) {
        long long tich = a * b;
        std::cout << tich << '\\n';
    }
    return 0;
}
`,
                testCases: [
                    {
                        input: '1000000000 1000000000',
                        expectedOutput: '1000000000000000000\n',
                        isHidden: false
                    },
                    {
                        input: '123456789 987654321',
                        expectedOutput: '121932631112635269\n',
                        isHidden: true
                    }
                ]
            },
            quiz: {
                question: 'Cho hai biến nguyên 32-bit: int x = 1000000; (1 triệu) và int y = 2000000; (2 triệu). Câu lệnh nào dưới đây tính tích của hai số mà chắc chắn không bị lỗi tràn số nguyên (Overflow)?',
                explanation: 'Phép nhân 1LL * x * y ép kiểu biểu thức sang long long (64-bit) ngay từ toán hạng đầu tiên, do đó toàn bộ phép nhân được tính trên không gian 64-bit an toàn.',
                options: [
                    { key: 'A', text: 'long long ketQua = x * y;', isCorrect: false },
                    { key: 'B', text: 'long long ketQua = 1LL * x * y;', isCorrect: true },
                    { key: 'C', text: 'int ketQua = x * y;', isCorrect: false },
                    { key: 'D', text: 'double ketQua = x * y;', isCorrect: false }
                ]
            }
        },
        {
            file: 'Lesson_01_05.md',
            lessonId: 'CPP-01.05',
            title: 'Bài 1.5: Toán tử số học, Toán tử gán và Kỹ thuật Ép kiểu an toàn (static_cast)',
            objective: 'Khắc chế bẫy chia nguyên, làm chủ toán tử chia lấy dư %, tiền tố ++i và ép kiểu chuẩn static_cast.',
            difficulty: 'MEDIUM',
            durationMinutes: 25,
            orderIndex: 5,
            exercise: {
                title: 'Quy đổi thời gian từ giây sang Giờ, Phút, Giây',
                difficulty: 'MEDIUM',
                problemDescription: `### Yêu Cầu Đề Bài:
Viết chương trình nhận vào một số nguyên dương $T$ biểu thị tổng số giây.
Hãy quy đổi và in ra thời gian theo định dạng:
\`<gio> gio <phut> phut <giay> giay\`

### Ví dụ:
* **Đầu vào:** \`3665\`
* **Đầu ra:** \`1 gio 1 phut 5 giay\`

### Gợi ý thuật toán:
* 1 giờ = 3600 giây.
* Số giờ = \`T / 3600\`.
* Số phút = \`(T % 3600) / 60\`.
* Số giây = \`T % 60\`.`,
                starterCode: `#include <iostream>

int main() {
    int T = 0;
    // Nhập tổng số giây và quy đổi:
    
    return 0;
}
`,
                solutionCode: `#include <iostream>

int main() {
    int tongGiay = 0;
    if (std::cin >> tongGiay) {
        int gio = tongGiay / 3600;
        int phut = (tongGiay % 3600) / 60;
        int giay = tongGiay % 60;
        std::cout << gio << " gio " << phut << " phut " << giay << " giay\\n";
    }
    return 0;
}
`,
                testCases: [
                    {
                        input: '3665',
                        expectedOutput: '1 gio 1 phut 5 giay\n',
                        isHidden: false
                    },
                    {
                        input: '7200',
                        expectedOutput: '2 gio 0 phut 0 giay\n',
                        isHidden: true
                    },
                    {
                        input: '86399',
                        expectedOutput: '23 gio 59 phut 59 giay\n',
                        isHidden: true
                    }
                ]
            },
            quiz: {
                question: 'Đoạn mã C++ sau đây sẽ in ra giá trị gì trên màn hình console?\nint a = 7;\nint b = 2;\ndouble c = static_cast<double>(a) / b;\nstd::cout << c;',
                explanation: 'static_cast<double>(a) biến đổi giá trị của a thành số thực 7.0. Khi một số thực chia cho một số nguyên (7.0 / 2), C++ tự động nâng cấp toán hạng còn lại thành số thực, cho kết quả chính xác là 3.5.',
                options: [
                    { key: 'A', text: '3', isCorrect: false },
                    { key: 'B', text: '3.5', isCorrect: true },
                    { key: 'C', text: '3.0', isCorrect: false },
                    { key: 'D', text: 'Lỗi biên dịch', isCorrect: false }
                ]
            }
        }
    ];

    // 5. Lặp qua từng bài học để nạp vào DB
    for (const item of lessonsData) {
        const filePath = path.join(docsDir, item.file);
        let content = '';
        if (fs.existsSync(filePath)) {
            content = fs.readFileSync(filePath, 'utf-8');
        } else {
            console.warn(`⚠️ Không tìm thấy ${item.file}, dùng fallback content`);
            content = `# ${item.title}`;
        }

        // Tạo hoặc update Lesson
        let lesson = await prisma.lesson.findFirst({
            where: {
                chapterId: chapter1.id,
                lessonId: item.lessonId
            }
        });

        if (!lesson) {
            lesson = await prisma.lesson.create({
                data: {
                    chapterId: chapter1.id,
                    lessonId: item.lessonId,
                    title: item.title,
                    objective: item.objective,
                    content,
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
                    content,
                    difficulty: item.difficulty as any,
                    durationMinutes: item.durationMinutes,
                    isFree: true,
                    orderIndex: item.orderIndex
                }
            });
        }
        console.log(`  📝 [Lesson ${item.orderIndex}]: ${lesson.title} (${lesson.id})`);

        // Tạo hoặc update Coding Exercise
        let exercise = await prisma.codingExercise.findFirst({
            where: {
                lessonId: lesson.id,
                title: item.exercise.title
            }
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
                    difficulty: item.exercise.difficulty as any,
                    problemDescription: item.exercise.problemDescription,
                    starterCode: item.exercise.starterCode,
                    solutionCode: item.exercise.solutionCode
                }
            });
        }

        // Xóa và tạo lại Test Cases
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
        console.log(`      💻 Exercise: "${exercise.title}" (${item.exercise.testCases.length} testcases)`);

        // Xóa và tạo lại Quiz Questions
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
        console.log(`      ❓ Quiz Question đã nạp.`);
    }

    console.log('\n🎉 HOÀN TẤT TRIỂN KHAI TOÀN BỘ MODULE 1!');
    console.log(`🌐 Xem khóa học tại: http://localhost:5173/course/${course.id}`);
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi triển khai Module 1:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
