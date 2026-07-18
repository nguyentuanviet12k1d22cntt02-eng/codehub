import { prisma } from '../config/prisma';
import { exercisesData } from './exercises_data';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log('Bắt đầu nạp dữ liệu mẫu...');
    
    // Đọc nội dung bài học từ file txt/md để tránh lỗi escape ký tự
    const lesson1Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 01/Lession1.txt');
    const lesson1Content = fs.readFileSync(lesson1Path, 'utf8');

    const lesson2Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 01/Lession2.txt');
    const lesson2Content = fs.readFileSync(lesson2Path, 'utf8');

    const lesson3Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 01/Lession3.txt');
    const lesson3Content = fs.readFileSync(lesson3Path, 'utf8');

    const lesson4Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 02/Lession1.md');
    const lesson4Content = fs.readFileSync(lesson4Path, 'utf8');

    const lesson5Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 02/Lession2.md');
    const lesson5Content = fs.readFileSync(lesson5Path, 'utf8');

    const lesson6Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 02/Lession3.md');
    const lesson6Content = fs.readFileSync(lesson6Path, 'utf8');

    const lesson7Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 02/Lession4.md');
    const lesson7Content = fs.readFileSync(lesson7Path, 'utf8');

    const lesson8Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 04/Lession1.md');
    const lesson8Content = fs.readFileSync(lesson8Path, 'utf8');

    const lesson9Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 04/Lession2.md');
    const lesson9Content = fs.readFileSync(lesson9Path, 'utf8');

    const lesson10Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 04/Lession3.md');
    const lesson10Content = fs.readFileSync(lesson10Path, 'utf8');

    const lesson11Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 04/Lession4.md');
    const lesson11Content = fs.readFileSync(lesson11Path, 'utf8');

    const lesson12Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 03/Lession1.md');
    const lesson12Content = fs.readFileSync(lesson12Path, 'utf8');

    const lesson13Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 03/Lession2.md');
    const lesson13Content = fs.readFileSync(lesson13Path, 'utf8');

    const lesson14Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 03/Lession3.md');
    const lesson14Content = fs.readFileSync(lesson14Path, 'utf8');

    const lesson15Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 05/Lession1.md');
    const lesson15Content = fs.readFileSync(lesson15Path, 'utf8');

    const lesson16Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 05/Lession2.md');
    const lesson16Content = fs.readFileSync(lesson16Path, 'utf8');

    const lesson17Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 05/Lession3.md');
    const lesson17Content = fs.readFileSync(lesson17Path, 'utf8');

    const lesson18Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 05/Lession4.md');
    const lesson18Content = fs.readFileSync(lesson18Path, 'utf8');

    const lesson19Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 06/Lession1.md');
    const lesson19Content = fs.readFileSync(lesson19Path, 'utf8');

    const lesson20Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 06/Lession2.md');
    const lesson20Content = fs.readFileSync(lesson20Path, 'utf8');

    const lesson21Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 06/Lession3.md');
    const lesson21Content = fs.readFileSync(lesson21Path, 'utf8');

    const lesson22Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 06/Lession4.md');
    const lesson22Content = fs.readFileSync(lesson22Path, 'utf8');

    const lesson23Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 07/Lession1.md');
    const lesson23Content = fs.readFileSync(lesson23Path, 'utf8');

    const lesson24Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 07/Lession2.md');
    const lesson24Content = fs.readFileSync(lesson24Path, 'utf8');

    const lesson25Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 07/Lession3.md');
    const lesson25Content = fs.readFileSync(lesson25Path, 'utf8');

    const lesson26Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 07/Lession4.md');
    const lesson26Content = fs.readFileSync(lesson26Path, 'utf8');

    const lesson27Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 07/Lession5.md');
    const lesson27Content = fs.readFileSync(lesson27Path, 'utf8');

    const lesson28Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 08/Lession1.md');
    const lesson28Content = fs.readFileSync(lesson28Path, 'utf8');

    const lesson29Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 08/Lession2.md');
    const lesson29Content = fs.readFileSync(lesson29Path, 'utf8');

    const lesson30Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 08/Lession3.md');
    const lesson30Content = fs.readFileSync(lesson30Path, 'utf8');

    const lesson31Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 09/Lession1.md');
    const lesson31Content = fs.readFileSync(lesson31Path, 'utf8');

    const lesson32Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 09/Lession2.md');
    const lesson32Content = fs.readFileSync(lesson32Path, 'utf8');

    const lesson33Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 09/Lession3.md');
    const lesson33Content = fs.readFileSync(lesson33Path, 'utf8');

    const lesson34Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 09/Lession4.md');
    const lesson34Content = fs.readFileSync(lesson34Path, 'utf8');

    const lesson35Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 10/Lession1.md');
    const lesson35Content = fs.readFileSync(lesson35Path, 'utf8');

    const lesson36Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 10/Lession2.md');
    const lesson36Content = fs.readFileSync(lesson36Path, 'utf8');

    const lesson37Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 10/Lession3.md');
    const lesson37Content = fs.readFileSync(lesson37Path, 'utf8');

    const lesson38Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 11/Lession1.md');
    const lesson38Content = fs.readFileSync(lesson38Path, 'utf8');

    const lesson39Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 11/Lession2.md');
    const lesson39Content = fs.readFileSync(lesson39Path, 'utf8');

    const lesson40Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 12/Lession1.md');
    const lesson40Content = fs.readFileSync(lesson40Path, 'utf8');

    const lesson41Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 12/Lession2.md');
    const lesson41Content = fs.readFileSync(lesson41Path, 'utf8');

    const lesson42Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 12/Lession3.md');
    const lesson42Content = fs.readFileSync(lesson42Path, 'utf8');

    const lesson43Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 13/Lession1.md');
    const lesson43Content = fs.readFileSync(lesson43Path, 'utf8');

    const lesson44Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 13/Lession2.md');
    const lesson44Content = fs.readFileSync(lesson44Path, 'utf8');

    const lesson45Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 13/Lession3.md');
    const lesson45Content = fs.readFileSync(lesson45Path, 'utf8');

    const lesson46Path = path.join(__dirname, '../../../Dữ liệu nội dung bài học/Cấu trúc bài học/Chapter 13/Lession4.md');
    const lesson46Content = fs.readFileSync(lesson46Path, 'utf8');

    // --- VIẾT LOGIC NẠP DỮ LIỆU CỦA BẠN TẠI ĐÂY ---
    const author = await prisma.user.upsert({
        where: { email: 'author@mcode.vn' },
        update: {},
        create: {
            username: 'python_teacher',
            email: 'author@mcode.vn',
            password: await bcrypt.hash('10092004', 10), // Mật khẩu mẫu
            role: 'ADMIN', // Hoặc TEACHER
            gender: 'MALE'
        }
    })

    // Xóa các khóa học cũ do author này tạo để nạp lại sạch sẽ tránh trùng lặp
    await prisma.course.deleteMany({
        where: {
            createdBy: author.id
        }
    });

    const pythonCourse = await prisma.course.create({
        data: {
            title: 'Lập trình Python cơ bản cho người mới bắt đầu',
            description: 'Khóa học lập trình Python nền tảng từ con số 0.',
            level: 'BASIC',
            status: 'PUBLISHED',
            createdBy: author.id, // Liên kết tới User vừa tạo ở trên

            // Tạo các Module lồng bên trong Course
            modules: {
                create: [
                    {
                        moduleId: 'MOD-01',
                        title: 'Module 1: Nhập môn Python và Lập trình cơ bản',
                        objective: 'Làm quen với môi trường lập trình Python, cú pháp cơ bản và các phép toán.',
                        keyKnowledge: 'Giới thiệu Python, in dữ liệu, chú thích, biến và kiểu dữ liệu cơ bản',
                        prerequisite: 'Không có',
                        skillsAcquired: 'Viết được mã nguồn cơ bản, khai báo biến, tính toán biểu thức',
                        duration: '2 Giờ',
                        orderIndex: 1,
                        
                        // Tạo các chương (Chapters) lồng bên trong Module
                        chapters: {
                            create: [
                                {
                                    chapterId: 'CH-01',
                                    title: 'Chapter 1: Tính Toán Cơ Bản và Tương Tác Với Dữ Liệu Trong Python',
                                    objective: 'Nắm vững cách in dữ liệu ra màn hình và các phép tính số học cơ bản',
                                    coreKnowledge: 'Phép toán cộng trừ nhân chia, in kết quả, chú thích mã nguồn',
                                    skillsAcquired: 'Thực hiện tính toán trên Python, chú thích giải thích mã nguồn',
                                    orderIndex: 1,

                                    // Tạo các bài học (Lessons) lồng bên trong Chapter 1
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-01.01',
                                                title: 'Máy tính và Ngôn ngữ lập trình',
                                                objective: 'Hiểu được bản chất của việc lập trình là quá trình giao tiếp và ra lệnh cho máy tính. Nắm được khái niệm cơ bản về thuật toán thông qua các ví dụ đời sống. Nhận thức được vai trò của Python như một ngôn ngữ bậc cao giúp con người dễ dàng điều khiển máy tính.',
                                                keyKnowledge: 'Cách máy tính xử lý thông tin (khái quát về Mã máy/Nhị phân). Sự khác biệt giữa Mã máy (Machine Code) và Ngôn ngữ lập trình bậc cao (High-level Language). Vai trò cơ bản của Trình thông dịch (Interpreter) trong Python.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson1Content,

                                                // Tạo bài tập thực hành (CodingExercises) lồng bên trong Lesson 1
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.01'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-01.02',
                                                title: 'Môi trường lập trình Python',
                                                objective: 'Hiểu về môi trường lập trình Python, các loại IDE phổ biến, chế độ tương tác và chế độ soạn thảo mã nguồn.',
                                                keyKnowledge: 'Khái niệm môi trường lập trình, IDE/IDLE, cách hoạt động của Interactive Mode và Script Mode.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson2Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.02'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-01.03',
                                                title: 'Chương trình Python đầu tiên',
                                                objective: 'Nắm vững cách viết một chương trình Python hoàn chỉnh, sử dụng chú thích và hiểu các lỗi cú pháp cơ bản.',
                                                keyKnowledge: 'Thứ tự thực thi mã nguồn từ trên xuống dưới, cách viết chú thích với dấu #, lỗi cú pháp (SyntaxError) và lỗi thụt đầu dòng (IndentationError).',
                                                difficulty: 'Dễ',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson3Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.03'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    chapterId: 'CH-02',
                                    title: 'Chapter 2: Dữ liệu và Toán tử',
                                    objective: 'Nắm vững cách máy tính lưu trữ và tính toán.',
                                    coreKnowledge: 'Biến, Kiểu dữ liệu cơ bản, Toán tử số học & gán.',
                                    skillsAcquired: 'Thực hiện các phép tính toán học qua code.',
                                    orderIndex: 2,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-01.04',
                                                title: 'Khái niệm Biến và Cách đặt tên',
                                                objective: 'Hiểu cách cấp phát bộ nhớ để lưu dữ liệu.',
                                                keyKnowledge: 'Định nghĩa biến, Quy tắc đặt tên PEP8.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 25,
                                                content: lesson4Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.04'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-01.05',
                                                title: 'Các kiểu dữ liệu nguyên thủy',
                                                objective: 'Phân biệt các kiểu dữ liệu int, float, bool trong Python và cách sử dụng hàm type().',
                                                keyKnowledge: 'Khái niệm kiểu dữ liệu nguyên thủy, kiểu số nguyên (int), kiểu số thực (float), kiểu logic (bool).',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson5Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.05'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-01.06',
                                                title: 'Toán tử số học',
                                                objective: 'Biết cách ra lệnh cho Python thực hiện các phép toán số học cơ bản như cộng, trừ, nhân, chia, chia nguyên, chia dư, lũy thừa.',
                                                keyKnowledge: 'Toán tử số học +, -, *, /, //, %, ** và độ ưu tiên toán tử.',
                                                difficulty: 'Cơ bản',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 30,
                                                content: lesson6Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.06'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-01.07',
                                                title: 'Toán tử gán và Cập nhật biến',
                                                objective: 'Nắm được luồng thay đổi giá trị của biến thông qua các toán tử gán rút gọn.',
                                                keyKnowledge: 'Toán tử gán rút gọn +=, -=, *=, /= và cách tránh lỗi logic đặt nhầm vị trí dấu.',
                                                difficulty: 'Cơ bản',
                                                orderIndex: 4,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson7Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.07'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    chapterId: 'CH-03',
                                    title: 'Chapter 3: Tương tác cơ bản',
                                    objective: 'Biết cách giao tiếp hai chiều với chương trình.',
                                    coreKnowledge: 'Hàm print(), input(), ép kiểu dữ liệu.',
                                    skillsAcquired: 'Tạo chương trình tính toán có sự tham gia của người dùng.',
                                    orderIndex: 3,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-01.08',
                                                title: 'Hàm xuất dữ liệu (Print)',
                                                objective: 'Gửi thông điệp ra màn hình.',
                                                keyKnowledge: 'Cú pháp print(), tham số sep, end.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson12Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.08'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-01.09',
                                                title: 'Hàm nhập dữ liệu (Input)',
                                                objective: 'Nhận dữ liệu từ bàn phím.',
                                                keyKnowledge: 'Cú pháp input(), bản chất dữ liệu đầu vào.',
                                                difficulty: 'Cơ bản',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson13Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.09'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-01.10',
                                                title: 'Ép kiểu dữ liệu (Type Casting)',
                                                objective: 'Đồng nhất kiểu dữ liệu để tính toán.',
                                                keyKnowledge: 'Các hàm int(), float(), str().',
                                                difficulty: 'Cơ bản',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 25,
                                                content: lesson14Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-01.10'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        moduleId: 'MOD-02',
                        title: 'Module 2: Luồng điều khiển chương trình',
                        objective: 'Phá vỡ luồng code tuần tự, cung cấp khả năng ra quyết định và lặp lại công việc cho chương trình.',
                        keyKnowledge: 'Boolean logic, Toán tử so sánh/logic, Điều kiện (if/else), Vòng lặp (while/for).',
                        prerequisite: 'Hoàn thành MOD-01 (Cần hiểu Biến và Input/Output).',
                        skillsAcquired: 'Xây dựng các kịch bản phân loại, xử lý các bài toán có tính chu kỳ (tính tổng dãy số, kiểm tra tính chẵn lẻ...).',
                        duration: '6 Giờ',
                        orderIndex: 2,
                        chapters: {
                            create: [
                                {
                                    chapterId: 'CH-04',
                                    title: 'Chapter 4: Cấu trúc rẽ nhánh',
                                    objective: 'Xây dựng tư duy "Nếu - Thì".',
                                    coreKnowledge: 'Luồng điều kiện if, elif, else, Logic kết hợp.',
                                    skillsAcquired: 'Kiểm soát chương trình hành động theo ngữ cảnh.',
                                    orderIndex: 1,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-02.01',
                                                title: 'Biểu thức Logic & Toán tử so sánh',
                                                objective: 'Hiểu và sử dụng các toán tử so sánh để tạo ra các biểu thức logic Boolean.',
                                                keyKnowledge: 'Toán tử so sánh ==, !=, >, <, >=, <= và kiểu dữ liệu Boolean.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson8Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-02.01'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-02.02',
                                                title: 'Khái niệm rẽ nhánh và Lệnh if',
                                                objective: 'Nắm vững câu lệnh if và tầm quan trọng của quy tắc thụt lề (indentation).',
                                                keyKnowledge: 'Cú pháp if, dấu hai chấm, và quy tắc thụt lề.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 25,
                                                content: lesson9Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-02.02'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-02.03',
                                                title: 'Lệnh if-else và if-elif-else',
                                                objective: 'Sử dụng else và elif để giải quyết bài toán rẽ nhiều nhánh.',
                                                keyKnowledge: 'Từ khóa else, elif và thứ tự ưu tiên kiểm tra điều kiện.',
                                                difficulty: 'Trung bình',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 35,
                                                content: lesson10Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-02.03'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-02.04',
                                                title: 'Toán tử Logic kết hợp',
                                                objective: 'Kết hợp nhiều điều kiện so sánh bằng các toán tử and, or, not.',
                                                keyKnowledge: 'Cách hoạt động của and, or, not và độ ưu tiên toán tử logic.',
                                                difficulty: 'Trung bình',
                                                orderIndex: 4,
                                                isFree: true,
                                                durationMinutes: 30,
                                                content: lesson11Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-02.04'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    chapterId: 'CH-05',
                                    title: 'Chapter 5: Cấu trúc lặp',
                                    objective: 'Tự động hóa các tác vụ lặp lại.',
                                    coreKnowledge: 'Vòng lặp while, for, điều hướng break/continue.',
                                    skillsAcquired: 'Rút gọn code, giải quyết bài toán chu kỳ/dãy số.',
                                    orderIndex: 2,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-02.05',
                                                title: 'Tư duy lặp và Vòng lặp while',
                                                objective: 'Lặp dựa trên điều kiện chưa xác định trước.',
                                                keyKnowledge: 'Cú pháp while, nhận diện vòng lặp vô tận.',
                                                difficulty: 'Trung bình',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 35,
                                                content: lesson15Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-02.05'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-02.06',
                                                title: 'Dãy số với hàm range()',
                                                objective: 'Tạo một tập hợp số nguyên có quy luật.',
                                                keyKnowledge: 'Hàm range(start, stop, step).',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 25,
                                                content: lesson16Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-02.06'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-02.07',
                                                title: 'Vòng lặp for',
                                                objective: 'Lặp qua một số lần biết trước.',
                                                keyKnowledge: 'Cú pháp for ... in range().',
                                                difficulty: 'Trung bình',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 35,
                                                content: lesson17Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-02.07'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-02.08',
                                                title: 'Điều hướng lặp: break & continue',
                                                objective: 'Kiểm soát và can thiệp sâu vào vòng lặp.',
                                                keyKnowledge: 'Lệnh break, continue.',
                                                difficulty: 'Trung bình',
                                                orderIndex: 4,
                                                isFree: true,
                                                durationMinutes: 30,
                                                content: lesson18Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-02.08'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        moduleId: 'MOD-03',
                        title: 'Module 3: Cấu trúc dữ liệu cốt lõi',
                        objective: 'Hiểu và sử dụng thành thạo các cấu trúc dữ liệu cơ bản của Python.',
                        keyKnowledge: 'Chuỗi (String), Danh sách (List), Bộ dữ liệu (Tuple), Tập hợp (Set) và Từ điển (Dictionary).',
                        prerequisite: 'Hoàn thành MOD-02 (Cấu trúc lặp và rẽ nhánh).',
                        skillsAcquired: 'Lưu trữ, quản lý và biến đổi các tập hợp dữ liệu phức tạp.',
                        duration: '8 Giờ',
                        orderIndex: 3,
                        chapters: {
                            create: [
                                {
                                    chapterId: 'CH-06',
                                    title: 'Chapter 6: Xử lý Chuỗi (String)',
                                    objective: 'Làm quen với thao tác trên văn bản, chuỗi ký tự.',
                                    coreKnowledge: 'Index, Slicing, Phương thức chuỗi, F-string.',
                                    skillsAcquired: 'Truy xuất ký tự, cắt ghép chuỗi, định dạng và chuẩn hóa văn bản.',
                                    orderIndex: 1,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-03.01',
                                                title: 'Chuỗi như một Mảng: Indexing',
                                                objective: 'Hiểu cấu trúc tuần tự của chuỗi và truy xuất ký tự qua index.',
                                                keyKnowledge: 'Index dương, index âm, tính chất bất biến (immutable), lỗi IndexError.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson19Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.01'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.02',
                                                title: 'Cắt chuỗi (Slicing)',
                                                objective: 'Nắm vững cú pháp cắt chuỗi con [start:stop:step].',
                                                keyKnowledge: 'Biên stop không lấy, mặc định start/stop/step, đảo ngược chuỗi.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson20Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.02'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.03',
                                                title: 'Các phương thức chuỗi phổ biến',
                                                objective: 'Biết sử dụng các hàm xử lý chuỗi tích hợp sẵn.',
                                                keyKnowledge: 'upper, lower, strip, replace, split, join, tính chất bất biến.',
                                                difficulty: 'Dễ',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson21Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.03'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.04',
                                                title: 'Định dạng chuỗi (F-string)',
                                                objective: 'Sử dụng F-string để nhúng biến vào văn bản.',
                                                keyKnowledge: 'Cú pháp f"{}", biểu thức nhúng, ưu điểm của F-string.',
                                                difficulty: 'Dễ',
                                                orderIndex: 4,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson22Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.04'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    chapterId: 'CH-07',
                                    title: 'Chapter 7: Cấu trúc Tuần tự (List & Tuple)',
                                    objective: 'Quản lý tập hợp phần tử có thứ tự.',
                                    coreKnowledge: 'Khai báo List, Tuple, thêm/sửa/xóa phần tử, duyệt mảng, tìm kiếm & sắp xếp.',
                                    skillsAcquired: 'Sử dụng linh hoạt List (mutable) và Tuple (immutable) trong bài toán cụ thể.',
                                    orderIndex: 2,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-03.05',
                                                title: 'Khái niệm List & Khởi tạo',
                                                objective: 'Hiểu cấu trúc mảng động List trong Python.',
                                                keyKnowledge: 'Khai báo [], truy xuất qua index, hàm len(), lỗi IndexError.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson23Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.05'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.06',
                                                title: 'Cập nhật & Sửa đổi List',
                                                objective: 'Thay đổi các phần tử và kích thước của List.',
                                                keyKnowledge: 'append, insert, remove, pop, tính chất mutable.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson24Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.06'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.07',
                                                title: 'Duyệt mảng bằng Vòng lặp',
                                                objective: 'Sử dụng vòng lặp duyệt qua List để xử lý hàng loạt.',
                                                keyKnowledge: 'for item in list, for i in range(len(list)), enumerate().',
                                                difficulty: 'Trung bình',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson25Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.07'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.08',
                                                title: 'Sắp xếp và Tìm kiếm cơ bản',
                                                objective: 'Tìm kiếm phần tử và sắp xếp danh sách tăng/giảm.',
                                                keyKnowledge: 'in operator, index(), sort(), sorted(), reverse=True.',
                                                difficulty: 'Trung bình',
                                                orderIndex: 4,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson26Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.08'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.09',
                                                title: 'Tuple: Danh sách bất biến',
                                                objective: 'Hiểu đặc trưng bất biến và hiệu năng của Tuple.',
                                                keyKnowledge: 'Khai báo (), tính bất biến (immutable), ứng dụng bảo vệ dữ liệu.',
                                                difficulty: 'Dễ',
                                                orderIndex: 5,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson27Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.09'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    chapterId: 'CH-08',
                                    title: 'Chapter 8: Tập hợp và Ánh xạ (Set & Dict)',
                                    objective: 'Lọc trùng lặp và liên kết dữ liệu cặp khóa-giá trị.',
                                    coreKnowledge: 'Set và các phép toán tập hợp, Dictionary và ánh xạ Key-Value, phương thức get().',
                                    skillsAcquired: 'Sử dụng Set để giải quyết bài toán độc bản, dùng Dict để tổ chức hồ sơ/đối tượng có cấu trúc.',
                                    orderIndex: 3,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-03.10',
                                                title: 'Set: Tập hợp toán học',
                                                objective: 'Nắm vững đặc trưng duy nhất (unique) và không thứ tự của Set.',
                                                keyKnowledge: 'Khai báo {}, hàm set(), add, discard, phép toán giao (&), hợp (|), hiệu (-).',
                                                difficulty: 'Trung bình',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson28Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.10'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.11',
                                                title: 'Dictionary: Cấu trúc Key-Value',
                                                objective: 'Hiểu cấu trúc ánh xạ Key-Value của Dictionary.',
                                                keyKnowledge: 'Khai báo {}, Key duy nhất, truy xuất bằng Key, so sánh với List.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson29Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.11'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-03.12',
                                                title: 'Thao tác trên Dictionary',
                                                objective: 'Thêm, sửa, xóa phần tử và duyệt qua Dictionary.',
                                                keyKnowledge: 'gán key=val, get(), del, keys(), values(), items().',
                                                difficulty: 'Trung bình',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson30Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-03.12'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        moduleId: 'MOD-04',
                        title: 'Module 4: Tái sử dụng & Tổ chức mã nguồn',
                        objective: 'Làm quen với tư duy hàm đóng gói, quản lý ngoại lệ và lập trình hướng module.',
                        keyKnowledge: 'Hàm (def, arguments, return, scope), Ngoại lệ (try-except, finally, raise), Module (import, standard library).',
                        prerequisite: 'Hoàn thành MOD-03 (Cấu trúc dữ liệu cốt lõi).',
                        skillsAcquired: 'Viết code sạch sẽ, đóng gói tái sử dụng, phòng ngừa lỗi sập ứng dụng và sử dụng thư viện chuẩn.',
                        duration: '6 Giờ',
                        orderIndex: 4,
                        chapters: {
                            create: [
                                {
                                    chapterId: 'CH-09',
                                    title: 'Chapter 9: Hàm (Function)',
                                    objective: 'Tư duy đóng gói mã nguồn để tái sử dụng.',
                                    coreKnowledge: 'Cú pháp def, tham số và đối số, giá trị trả về return, phạm vi biến (scope).',
                                    skillsAcquired: 'Định nghĩa và gọi hàm thành thạo, quản lý tham số mặc định và tầm vực biến.',
                                    orderIndex: 1,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-04.01',
                                                title: 'Tư duy đóng gói và Lệnh def',
                                                objective: 'Hiểu khái niệm hàm và cú pháp định nghĩa hàm.',
                                                keyKnowledge: 'Từ khóa def, thụt lề khối lệnh, lệnh gọi hàm, NameError.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson31Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.01'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-04.02',
                                                title: 'Tham số và Đối số',
                                                objective: 'Phân biệt và truyền nhận dữ liệu qua hàm.',
                                                keyKnowledge: 'Parameters vs Arguments, đối số vị trí, đối số từ khóa, tham số mặc định.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson32Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.02'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-04.03',
                                                title: 'Trả về kết quả (Return)',
                                                objective: 'Hiểu cách đưa dữ liệu tính toán từ hàm ra ngoài.',
                                                keyKnowledge: 'Từ khóa return, None value, khác biệt print vs return, lệnh return dừng hàm.',
                                                difficulty: 'Dễ',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson33Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.03'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-04.04',
                                                title: 'Phạm vi của Biến (Scope)',
                                                objective: 'Kiểm soát tầm vực biến cục bộ và biến toàn cục.',
                                                keyKnowledge: 'Local variable, Global variable, từ khóa global, lỗi UnboundLocalError.',
                                                difficulty: 'Trung bình',
                                                orderIndex: 4,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson34Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.04'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    chapterId: 'CH-10',
                                    title: 'Chapter 10: Xử lý Ngoại lệ (Exception)',
                                    objective: 'Dự phòng và quản lý các sự cố phát sinh khi chạy chương trình.',
                                    coreKnowledge: 'Các lỗi Runtime thông dụng, cấu trúc try-except bắt lỗi, Finally dọn dẹp bộ nhớ, chủ động ném lỗi với raise.',
                                    skillsAcquired: 'Viết code an toàn, không bị sập (crash) đột ngột trước các dữ liệu bất thường.',
                                    orderIndex: 2,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-04.05',
                                                title: 'Nhận diện Ngoại lệ (Exceptions)',
                                                objective: 'Phân biệt lỗi cú pháp với lỗi runtime và các dạng ngoại lệ thông dụng.',
                                                keyKnowledge: 'ZeroDivisionError, ValueError, TypeError, IndexError, KeyError.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson35Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.05'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-04.06',
                                                title: 'Bắt lỗi với Try-Except',
                                                objective: 'Ứng dụng try-except để bao bọc mã nguồn nguy hiểm.',
                                                keyKnowledge: 'try-except block, bắt nhiều ngoại lệ độc lập, tránh bắt lỗi mù (bare except).',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson36Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.06'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-04.07',
                                                title: 'Luồng Finally và Ném lỗi chủ động',
                                                objective: 'Giải phóng tài nguyên hệ thống và tự kích hoạt ngoại lệ.',
                                                keyKnowledge: 'Từ khóa finally, lệnh dọn dẹp bắt buộc, từ khóa raise phát hiện dữ liệu phi logic.',
                                                difficulty: 'Trung bình',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson37Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.07'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    chapterId: 'CH-11',
                                    title: 'Chapter 11: Module và Thư viện',
                                    objective: 'Tổ chức mã nguồn khoa học và sử dụng kho thư viện chuẩn.',
                                    coreKnowledge: 'Khái niệm module, lệnh import, from-import, đổi tên định danh as, khám phá thư viện math, random, datetime.',
                                    skillsAcquired: 'Phân rã chương trình lớn thành các module sạch sẽ, ứng dụng linh hoạt thư viện chuẩn.',
                                    orderIndex: 3,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-04.08',
                                                title: 'Khái niệm Module và Lệnh Import',
                                                objective: 'Nắm giữ cơ chế tổ chức file mã nguồn và nạp thư viện.',
                                                keyKnowledge: 'Module .py, import, from import, import as, lỗi circular import.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson38Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.08'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-04.09',
                                                title: 'Khám phá Standard Library',
                                                objective: 'Khai thác thư viện chuẩn có sẵn của Python.',
                                                keyKnowledge: 'Học thuyết Batteries Included, module math, random, datetime, định dạng ngày strftime.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson39Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-04.09'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        moduleId: 'MOD-05',
                        title: 'Module 5: Lưu trữ và Trừu tượng hóa (File & Basic OOP)',
                        objective: 'Làm quen với việc đọc ghi tập tin và tiếp cận phương pháp lập trình hướng đối tượng cơ bản.',
                        keyKnowledge: 'File I/O (open, read, write, with context), OOP cơ bản (class, object, attributes, methods, __init__, inheritance).',
                        prerequisite: 'Hoàn thành MOD-04 (Tái sử dụng & Tổ chức mã nguồn).',
                        skillsAcquired: 'Lưu trữ dữ liệu bền vững trên ổ cứng, tổ chức và thiết kế mã nguồn theo phong cách hướng đối tượng chuyên nghiệp.',
                        duration: '6 Giờ',
                        orderIndex: 5,
                        chapters: {
                            create: [
                                {
                                    chapterId: 'CH-12',
                                    title: 'Chapter 12: Xử lý Tập tin (File I/O)',
                                    objective: 'Làm quen với thao tác lưu trữ dữ liệu bền vững vào ổ cứng.',
                                    coreKnowledge: 'Cơ chế bộ nhớ RAM vs Disk, hàm open, các chế độ mode r/w/a, đọc ghi file văn bản, Context Manager với with.',
                                    skillsAcquired: 'Đọc ghi tệp tin thành thạo, kiểm soát tài nguyên tránh rò rỉ bộ nhớ bằng cấu trúc with.',
                                    orderIndex: 1,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-05.01',
                                                title: 'Cấu trúc bộ nhớ và Hàm open()',
                                                objective: 'Hiểu bản chất lưu trữ RAM vs Disk và cách liên kết tệp tin.',
                                                keyKnowledge: 'Phân biệt RAM và Disk, hàm open, các mode mở file r, w, a, đóng file close.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson40Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-05.01'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-05.02',
                                                title: 'Đọc và Ghi File Text',
                                                objective: 'Thực hiện đọc ghi dữ liệu dạng chuỗi văn bản.',
                                                keyKnowledge: 'Phương thức read, readline, write, duyệt file bằng for, lỗi TypeError khi ghi số.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson41Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-05.02'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-05.03',
                                                title: "Context Manager với từ khóa 'with'",
                                                objective: 'Áp dụng cú pháp mở file an toàn và hiện đại.',
                                                keyKnowledge: 'Cú pháp with open as, cơ chế tự động close(), an toàn ngoại lệ, ValueError trên file đã đóng.',
                                                difficulty: 'Dễ',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson42Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-05.03'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    chapterId: 'CH-13',
                                    title: 'Chapter 13: OOP Cơ bản',
                                    objective: 'Làm quen với mô hình lập trình hướng đối tượng.',
                                    coreKnowledge: 'Khái niệm Lớp (Class) và Đối tượng (Object), Thuộc tính (Attributes) và Phương thức (Methods), tham số self, hàm dựng __init__, Kế thừa (Inheritance) và super().',
                                    skillsAcquired: 'Chuyển đổi thực tế sang đối tượng lập trình, tái sử dụng mã nguồn và tùy biến lớp con.',
                                    orderIndex: 2,
                                    lessons: {
                                        create: [
                                            {
                                                lessonId: 'LS-05.04',
                                                title: 'Tư duy Hướng đối tượng (Class vs Object)',
                                                objective: 'Phân biệt mô hình bản thiết kế và đối tượng cụ thể.',
                                                keyKnowledge: 'Tư duy OOP, Class blueprint, Object instance, PascalCase, từ khóa class.',
                                                difficulty: 'Dễ',
                                                orderIndex: 1,
                                                isFree: true,
                                                durationMinutes: 15,
                                                content: lesson43Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-05.04'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-05.05',
                                                title: 'Thuộc tính và Phương thức',
                                                objective: 'Gắn biến và hàm vào cấu trúc lớp.',
                                                keyKnowledge: 'Attributes vs Methods, tham số self đại diện đối tượng, TypeError khi thiếu self.',
                                                difficulty: 'Dễ',
                                                orderIndex: 2,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson44Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-05.05'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-05.06',
                                                title: 'Phương thức Khởi tạo (__init__)',
                                                objective: 'Thiết lập tham số ban đầu cho đối tượng.',
                                                keyKnowledge: 'Hàm dựng constructor __init__, gán thuộc tính self, lỗi gán ngược, TypeError thiếu đối số.',
                                                difficulty: 'Dễ',
                                                orderIndex: 3,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson45Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-05.06'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            },
                                            {
                                                lessonId: 'LS-05.07',
                                                title: 'Khái quát về Kế thừa (Inheritance)',
                                                objective: 'Tái sử dụng mã nguồn và mở rộng lớp con từ lớp cha.',
                                                keyKnowledge: 'Superclass vs Subclass, cú pháp kế thừa, Method Overriding ghi đè, hàm super().',
                                                difficulty: 'Trung bình',
                                                orderIndex: 4,
                                                isFree: true,
                                                durationMinutes: 20,
                                                content: lesson46Content,
                                                codingExercises: {
                                                    create: (exercisesData['LS-05.07'] || []).map(ex => ({
                                                        title: ex.title,
                                                        difficulty: ex.difficulty,
                                                        problemDescription: ex.problemDescription,
                                                        starterCode: ex.starterCode,
                                                        solutionCode: ex.solutionCode,
                                                        testCases: {
                                                            create: ex.testCases.map(tc => ({
                                                                input: tc.input,
                                                                expectedOutput: tc.expectedOutput,
                                                                isHidden: tc.isHidden
                                                            }))
                                                        }
                                                    }))
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    console.log('Nạp dữ liệu thành công!');
}

main()
    .catch((e) => {
        console.error('Lỗi khi nạp dữ liệu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
