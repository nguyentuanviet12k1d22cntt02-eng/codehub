import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log('🚀 Bắt đầu triển khai Khóa học C++ Cơ bản (CPP-BASIC) lên hệ thống...');

    // 1. Lấy thông tin tài khoản Admin để liên kết Course Creator
    let admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (!admin) {
        // Nếu chưa có Admin, tìm người dùng đầu tiên
        admin = await prisma.user.findFirst();
    }

    if (!admin) {
        throw new Error('Chưa tìm thấy người dùng trong Database. Vui lòng tạo tài khoản trước.');
    }

    console.log(`👤 Admin / Creator: ${admin.username} (${admin.email})`);

    // 2. Tạo hoặc Cập nhật Khóa học C++ Cơ bản
    const cppCourseId = 'c7b5c7a1-4f8d-4e9b-9c3a-8b7d6e5f4a11';
    const course = await prisma.course.upsert({
        where: { id: cppCourseId },
        update: {
            title: 'Lập trình C++ Cơ bản & Tư duy Thuật toán (C++ Foundations)',
            description: 'Khóa học làm chủ ngôn ngữ C++ hiện đại từ con số 0: cú pháp chuẩn C++17, cấu trúc rẽ nhánh, vòng lặp, hàm, mảng, chuỗi và giải thuật cơ sở.',
            level: 'BASIC' as any,
            status: 'PUBLISHED' as any,
            thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
            createdBy: admin.id
        },
        create: {
            id: cppCourseId,
            title: 'Lập trình C++ Cơ bản & Tư duy Thuật toán (C++ Foundations)',
            description: 'Khóa học làm chủ ngôn ngữ C++ hiện đại từ con số 0: cú pháp chuẩn C++17, cấu trúc rẽ nhánh, vòng lặp, hàm, mảng, chuỗi và giải thuật cơ sở.',
            level: 'BASIC' as any,
            status: 'PUBLISHED' as any,
            thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
            createdBy: admin.id
        }
    });
    console.log(`✅ Khóa học: ${course.title} (ID: ${course.id})`);

    // 3. Đăng ký toàn bộ 7 Modules của Khóa học 1
    const modulesData = [
        {
            moduleId: 'CPP-MOD-01',
            title: 'Module 1: Nhập môn Lập trình và Môi trường C++ Hiện đại',
            objective: 'Hiểu bản chất 4 giai đoạn biên dịch, cấu trúc chương trình C++17, thao tác I/O stream và kiểm soát tràn số.',
            duration: '8 giờ',
            orderIndex: 1
        },
        {
            moduleId: 'CPP-MOD-02',
            title: 'Module 2: Cấu trúc Rẽ nhánh và Tư duy Logic Điều kiện',
            objective: 'Làm chủ quyết định logic, cơ chế đoản mạch short-circuit, kỹ thuật Early Return và switch-case.',
            duration: '10 giờ',
            orderIndex: 2
        },
        {
            moduleId: 'CPP-MOD-03',
            title: 'Module 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển',
            objective: 'Tự động hóa tác vụ lặp, làm chủ vòng lặp for/while/do-while và chuyên đề số học (nguyên tố, GCD, Palindrome, Fibonacci).',
            duration: '12 giờ',
            orderIndex: 3
        },
        {
            moduleId: 'CPP-MOD-04',
            title: 'Module 4: Hàm (Functions) và Kỹ thuật Phân rã Bài toán',
            objective: 'Phân rã chương trình, cơ chế truyền tham trị, tham chiếu (&), tham chiếu hằng (const &) và đệ quy.',
            duration: '10 giờ',
            orderIndex: 4
        },
        {
            moduleId: 'CPP-MOD-05',
            title: 'Module 5: Mảng 1 Chiều và std::vector Động',
            objective: 'Lưu trữ dữ liệu tuyến tính, thuật toán sắp xếp (Bubble, Selection, Insertion) và mảng động std::vector chuẩn Modern C++.',
            duration: '12 giờ',
            orderIndex: 5
        },
        {
            moduleId: 'CPP-MOD-06',
            title: 'Module 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản',
            objective: 'Thao tác bảng mã ASCII, phương thức chuỗi hiện đại, bẫy trôi lệnh cin.ignore() và chuẩn hóa văn bản.',
            duration: '10 giờ',
            orderIndex: 6
        },
        {
            moduleId: 'CPP-MOD-07',
            title: 'Module 7: Mảng 2 Chiều và Bài toán Ma trận Thực tế',
            objective: 'Làm việc với bảng dữ liệu hàng-cột, bố cục bộ nhớ Row-major và hoàn thiện Dự án Mini Game Cờ Caro / Tic-Tac-Toe.',
            duration: '12 giờ',
            orderIndex: 7
        }
    ];

    const createdModules: Record<string, any> = {};
    for (const m of modulesData) {
        const mod = await prisma.module.upsert({
            where: { moduleId: m.moduleId },
            update: {
                title: m.title,
                objective: m.objective,
                duration: m.duration,
                orderIndex: m.orderIndex,
                courseId: course.id
            },
            create: {
                moduleId: m.moduleId,
                title: m.title,
                objective: m.objective,
                duration: m.duration,
                orderIndex: m.orderIndex,
                courseId: course.id
            }
        });
        createdModules[m.moduleId] = mod;
        console.log(`  📁 [Module ${m.orderIndex}]: ${mod.title}`);
    }

    // 4. Tạo Chapter 1 trong Module 1
    const module1 = createdModules['CPP-MOD-01'];
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
                objective: 'Làm quen quy trình biên dịch C++ và viết chương trình đầu tiên.',
                orderIndex: 1
            }
        });
    } else {
        chapter1 = await prisma.chapter.update({
            where: { id: chapter1.id },
            data: {
                title: 'Chương 1: Tổng quan và Môi trường thực thi',
                objective: 'Làm quen quy trình biên dịch C++ và viết chương trình đầu tiên.',
                orderIndex: 1
            }
        });
    }
    console.log(`    📂 [Chapter 1]: ${chapter1.title}`);

    // 5. Đọc nội dung Markdown của Bài 1.1 từ docs
    const lesson1Path = path.resolve(__dirname, '../../docs/Dữ liệu nội dung bài học/C++/Khóa 1 - C++ Cơ bản/Module 01/Lesson_01_01.md');
    let lesson1Content = '';
    if (fs.existsSync(lesson1Path)) {
        lesson1Content = fs.readFileSync(lesson1Path, 'utf-8');
    } else {
        console.warn('⚠️ Không tìm thấy file Lesson_01_01.md, dùng nội dung fallback');
        lesson1Content = `# Bài 1.1: Tổng quan ngôn ngữ C++ và Quy trình Biên dịch`;
    }

    // 6. Tạo hoặc Cập nhật Lesson 1.1
    let lesson1 = await prisma.lesson.findFirst({
        where: {
            chapterId: chapter1.id,
            lessonId: 'CPP-01.01'
        }
    });

    if (!lesson1) {
        lesson1 = await prisma.lesson.create({
            data: {
                chapterId: chapter1.id,
                lessonId: 'CPP-01.01',
                title: 'Bài 1.1: Tổng quan ngôn ngữ C++ và Quy trình Biên dịch',
                objective: 'Nắm vững 4 giai đoạn biên dịch C++ và viết chương trình Hello World chuẩn C++17.',
                content: lesson1Content,
                difficulty: 'EASY',
                durationMinutes: 15,
                isFree: true,
                orderIndex: 1
            }
        });
    } else {
        lesson1 = await prisma.lesson.update({
            where: { id: lesson1.id },
            data: {
                title: 'Bài 1.1: Tổng quan ngôn ngữ C++ và Quy trình Biên dịch',
                objective: 'Nắm vững 4 giai đoạn biên dịch C++ và viết chương trình Hello World chuẩn C++17.',
                content: lesson1Content,
                difficulty: 'EASY',
                durationMinutes: 15,
                isFree: true,
                orderIndex: 1
            }
        });
    }
    console.log(`      📝 [Lesson 1.1]: ${lesson1.title} (ID: ${lesson1.id})`);

    // 7. Tạo Bài tập Lập trình (Coding Exercise) cho Lesson 1.1
    let exercise1 = await prisma.codingExercise.findFirst({
        where: {
            lessonId: lesson1.id,
            title: 'Chương trình C++ đầu tiên: Giới thiệu bản thân'
        }
    });

    const exDescription = `### Yêu Cầu Đề Bài:
Hãy viết một chương trình C++ hoàn chỉnh sử dụng \`std::cout\` để in ra màn hình 2 dòng thông tin:
* Dòng 1: \`Ho va ten: Nguyen Tuan Viet\`
* Dòng 2: \`Muc tieu: Lam chu C++ va tro thanh Backend / Game Engineer!\`

### Ràng buộc kỹ thuật:
* Mỗi dòng xuất kết thúc bằng ký tự xuống dòng \`'\\n'\`.
* Chương trình trả về mã kết thúc \`0\`.`;

    const exStarter = `// Viết chương trình C++ đầu tiên của bạn tại đây
#include <iostream>

int main() {
    // Gõ câu lệnh xuất dữ liệu của bạn ở đây:
    
    return 0;
}
`;

    const exSolution = `#include <iostream>

int main() {
    std::cout << "Ho va ten: Nguyen Tuan Viet" << '\\n';
    std::cout << "Muc tieu: Lam chu C++ va tro thanh Backend / Game Engineer!" << '\\n';
    return 0;
}
`;

    if (!exercise1) {
        exercise1 = await prisma.codingExercise.create({
            data: {
                lessonId: lesson1.id,
                title: 'Chương trình C++ đầu tiên: Giới thiệu bản thân',
                difficulty: 'EASY' as any,
                problemDescription: exDescription,
                starterCode: exStarter,
                solutionCode: exSolution
            }
        });
    } else {
        exercise1 = await prisma.codingExercise.update({
            where: { id: exercise1.id },
            data: {
                difficulty: 'EASY' as any,
                problemDescription: exDescription,
                starterCode: exStarter,
                solutionCode: exSolution
            }
        });
    }
    console.log(`        💻 [Coding Exercise]: ${exercise1.title}`);

    // 8. Tạo Test Cases cho Exercise
    await prisma.testCase.deleteMany({
        where: { exerciseId: exercise1.id }
    });

    const expectedText = `Ho va ten: Nguyen Tuan Viet\nMuc tieu: Lam chu C++ va tro thanh Backend / Game Engineer!\n`;
    await prisma.testCase.create({
        data: {
            exerciseId: exercise1.id,
            input: '',
            expectedOutput: expectedText,
            isHidden: false
        }
    });
    console.log(`        🧪 [Test Cases]: Đã nạp test case kiểm thử đầu ra.`);

    // 9. Tạo Câu hỏi Trắc nghiệm (Quiz Question) cho Lesson 1.1
    await prisma.lessonQuizQuestion.deleteMany({
        where: { lessonId: lesson1.id }
    });

    await prisma.lessonQuizQuestion.create({
        data: {
            lessonId: lesson1.id,
            question: 'Giai đoạn nào trong quá trình xây dựng chương trình C++ chịu trách nhiệm kết hợp các file đối tượng (.obj/.o) và nạp các thư viện chuẩn (như iostream) để tạo ra file thực thi cuối cùng .exe?',
            explanation: 'Trình liên kết (Linker) là bước thứ 4 có nhiệm vụ kết nối các hàm ngoài và thư viện chuẩn vào file mã máy để tạo ra tệp thực thi độc lập .exe.',
            orderIndex: 1,
            options: {
                create: [
                    { key: 'A', text: 'Preprocessor (Trình tiền xử lý)', isCorrect: false },
                    { key: 'B', text: 'Compiler (Trình biên dịch)', isCorrect: false },
                    { key: 'C', text: 'Assembler (Trình hợp dịch)', isCorrect: false },
                    { key: 'D', text: 'Linker (Trình liên kết)', isCorrect: true }
                ]
            }
        }
    });
    console.log(`        ❓ [Quiz Question]: Đã nạp câu hỏi trắc nghiệm củng cố kiến thức.`);

    console.log('\n🎉 TRIỂN KHAI HOÀN TẤT THÀNH CÔNG!');
    console.log(`🌐 Bạn có thể xem khóa học ngay tại: http://localhost:5173/course/${course.id}`);
    console.log(`📖 Và học bài 1.1 tại: http://localhost:5173/lesson/${lesson1.id}`);
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi triển khai khóa học C++:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
