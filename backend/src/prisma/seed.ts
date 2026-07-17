import { prisma } from '../config/prisma';
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
                                                    create: [
                                                        {
                                                            title: 'Chương trình Hello World',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Viết chương trình Python in ra dòng chữ "Hello, World!"',
                                                            starterCode: '# Hãy viết câu lệnh print ở đây\n',
                                                            solutionCode: 'print("Hello, World!")',

                                                            // Tạo các Test Cases cho bài tập
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Hello, World!\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Sử dụng lệnh in cơ bản',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Viết chương trình in ra dòng chữ "Học Python thật thú vị!"',
                                                            starterCode: '# Viết lệnh in của bạn ở đây\n',
                                                            solutionCode: 'print("Học Python thật thú vị!")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Học Python thật thú vị!\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Viết chú thích và in nhiều dòng',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết một chú thích bất kỳ bắt đầu bằng dấu #, sau đó dùng 2 lệnh print để in ra 2 dòng chữ lần lượt là "Xin chào" và "Tên tôi là Python".',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: '# Chú thích dòng lệnh\nprint("Xin chào")\nprint("Tên tôi là Python")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Xin chào\nTên tôi là Python\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Khai báo biến cơ bản',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy tạo một biến tên là `course_title` và gán cho nó giá trị chuỗi là `"Học Python cùng MCODE"`. Sau đó dùng lệnh `print()` để in giá trị của biến đó ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'course_title = "Học Python cùng MCODE"\nprint(course_title)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Học Python cùng MCODE\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        {
                                                            title: 'Tính toán hóa đơn áo thun',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo biến `so_ao_thun` gán giá trị `5`, `gia_moi_ao` gán giá trị `120000`. Khai báo biến `tong_tien` lưu kết quả tích của hai biến trên và in `tong_tien` ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'so_ao_thun = 5\ngia_moi_ao = 120000\ntong_tien = so_ao_thun * gia_moi_ao\nprint(tong_tien)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '600000\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Khai báo kiểu dữ liệu nguyên thủy',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy khai báo 3 biến: `tuoi` gán giá trị số nguyên `15`, `diem_so` gán giá trị số thực `8.5`, và `is_student` gán giá trị logic `True`. Sau đó in ra giá trị của từng biến này trên 3 dòng riêng biệt.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'tuoi = 15\ndiem_so = 8.5\nis_student = True\nprint(tuoi)\nprint(diem_so)\nprint(is_student)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '15\n8.5\nTrue\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        {
                                                            title: 'Kiểm tra kiểu dữ liệu với type()',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo biến `chieu_cao` gán giá trị `1.75`. Sử dụng hàm `type()` kết hợp với `print()` để in ra kiểu dữ liệu của biến này.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'chieu_cao = 1.75\nprint(type(chieu_cao))',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: "<class 'float'>\n",
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Tính toán chia chia lấy dư pizza',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Một nhóm bạn gồm `4` người đi ăn pizza hết tổng cộng `350000` đồng. Hãy tính số tiền mỗi người phải trả khi chia đều và gán vào biến `so_tien_moi_nguoi`. Tính số tiền dư không thể chia đều và gán vào biến `so_tien_du`. In cả hai biến ra màn hình lần lượt trên 2 dòng.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'so_tien_moi_nguoi = 350000 / 4\nso_tien_du = 350000 % 4\nprint(so_tien_moi_nguoi)\nprint(so_tien_du)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '87500.0\n0\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Cập nhật ví tiết kiệm',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khởi tạo biến `tien_tiet_kiem = 100000`. Dùng toán tử gán rút gọn để cộng thêm `50000`, sau đó tiếp tục dùng toán tử gán rút gọn nhân đôi số tiền tiết kiệm hiện tại. In giá trị biến `tien_tiet_kiem` cuối cùng ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'tien_tiet_kiem = 100000\ntien_tiet_kiem += 50000\ntien_tiet_kiem *= 2\nprint(tien_tiet_kiem)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '300000\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Định dạng ngày xuất bản',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy khai báo 3 biến chứa ngày tháng năm: `ngay = 16`, `thang = 7`, `nam = 2026`. Sử dụng một câu lệnh `print()` duy nhất với tham số `sep` để in ra màn hình chuỗi ngày tháng năm có dạng `16/7/2026`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'ngay = 16\nthang = 7\nnam = 2026\nprint(ngay, thang, nam, sep="/")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '16/7/2026\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Nhập món ăn yêu thích',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết một chương trình yêu cầu người dùng nhập vào món ăn yêu thích của họ bằng câu lệnh `input()` (không ghi prompt text bên trong). Sau đó in ra màn hình dòng chữ `"Món ăn yêu thích của bạn là: [tên món ăn]"`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'mon_an = input()\nprint("Món ăn yêu thích của bạn là:", mon_an)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: 'Phở bò\n',
                                                                        expectedOutput: 'Món ăn yêu thích của bạn là: Phở bò\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Cộng thêm 100',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết một chương trình yêu cầu người dùng nhập vào một số nguyên từ bàn phím bằng câu lệnh `input()` (không ghi prompt text bên trong). Hãy cộng số đó với `100` rồi in kết quả ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'so_nhap = int(input())\nprint(so_nhap + 100)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '50\n',
                                                                        expectedOutput: '150\n',
                                                                        isHidden: false
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
                                                    create: [
                                                        {
                                                            title: 'Kiểm tra sốt',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo hai biến `nhiet_do = 38.5` và `nhiet_do_binh_thuong = 37.0`. Hãy tạo một biểu thức so sánh kiểm tra xem `nhiet_do` có lớn hơn `nhiet_do_binh_thuong` hay không và lưu kết quả vào biến `is_sot`. In kết quả của `is_sot` ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'nhiet_do = 38.5\nnhiet_do_binh_thuong = 37.0\nis_sot = nhiet_do > nhiet_do_binh_thuong\nprint(is_sot)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'True\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Kiểm tra ví mua vé phim',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy khai báo hai biến `so_tien_hien_co = 15000` và `gia_ve_xem_phim = 45000`. Viết một câu lệnh `if` kiểm tra xem `so_tien_hien_co` có nhỏ hơn `gia_ve_xem_phim` hay không. Nếu đúng, hãy in ra màn hình dòng chữ `"Bạn không đủ tiền mua vé xem phim!"`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'so_tien_hien_co = 15000\ngia_ve_xem_phim = 45000\nif so_tien_hien_co < gia_ve_xem_phim:\n    print("Bạn không đủ tiền mua vé xem phim!")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Bạn không đủ tiền mua vé xem phim!\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Phân loại độ tuổi',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo biến `so_tuoi = 15`. Viết cấu trúc `if-elif-else` để phân loại độ tuổi: nếu `so_tuoi >= 18` in ra `"Người lớn"`, ngược lại nếu `so_tuoi >= 12` in ra `"Thiếu niên"`, ngược lại in ra `"Trẻ em"`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'so_tuoi = 15\nif so_tuoi >= 18:\n    print("Người lớn")\nelif so_tuoi >= 12:\n    print("Thiếu niên")\nelse:\n    print("Trẻ em")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Thiếu niên\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Xét duyệt giảm giá',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo 3 biến: `co_the_thanh_vien = True`, `la_cuoi_tuan = True`, và `hoa_don = 250000`. Viết câu lệnh `if` kiểm tra xem khách hàng có thẻ thành viên **và** hóa đơn lớn hơn `200000` đồng, **hoặc** khách hàng có thẻ thành viên nhưng đi mua sắm vào ngày cuối tuần. Nếu thỏa mãn điều kiện, hãy in ra dòng chữ `"Được giảm giá 10%!"`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'co_the_thanh_vien = True\nla_cuoi_tuan = True\nhoa_don = 250000\nif (co_the_thanh_vien and hoa_don > 200000) or (co_the_thanh_vien and la_cuoi_tuan):\n    print("Được giảm giá 10%!")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Được giảm giá 10%!\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Vòng lặp while cơ bản',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy khởi tạo biến `so_du = 3`. Hãy viết một vòng lặp `while` kiểm tra điều kiện `so_du > 0`. Bên trong vòng lặp, hãy in ra màn hình dòng chữ `"Đang hoạt động"` và giảm `so_du` đi 1 đơn vị sau mỗi lần lặp.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'so_du = 3\nwhile so_du > 0:\n    print("Đang hoạt động")\n    so_du -= 1',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Đang hoạt động\nĐang hoạt động\nĐang hoạt động\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Sinh dãy số chia hết cho 5',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy dùng hàm `range()` kết hợp với hàm `list()` để tạo ra và in ra màn hình danh sách các số chia hết cho 5 trong khoảng từ 5 đến 30 (bao gồm cả số 30). Kết quả mong muốn hiển thị là: `[5, 10, 15, 20, 25, 30]`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'day_so = list(range(5, 31, 5))\nprint(day_so)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '[5, 10, 15, 20, 25, 30]\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'In số lẻ tuần tự',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết chương trình sử dụng vòng lặp `for` kết hợp với hàm `range()` để in ra màn hình các số lẻ từ 1 đến 7 (bao gồm cả số 7), mỗi số được in trên một dòng riêng biệt.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'for i in range(1, 8, 2):\n    print(i)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '1\n3\n5\n7\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Ngắt vòng lặp khẩn cấp',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết chương trình sử dụng vòng lặp `for` duyệt qua các số trong `range(1, 6)`. Nếu gặp số `4`, hãy dùng lệnh `break` để thoát vòng lặp. Với các số khác, hãy in giá trị của số đó ra màn hình (mỗi số trên một dòng).',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'for i in range(1, 6):\n    if i == 4:\n        break\n    print(i)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '1\n2\n3\n',
                                                                        isHidden: false
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
                                                    create: [
                                                        {
                                                            title: 'Lấy ký tự đặc trưng',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo biến `s = "MCODE"`. Hãy in ra màn hình ký tự đầu tiên và ký tự cuối cùng của chuỗi `s` trên 2 dòng riêng biệt.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 's = "MCODE"\nprint(s[0])\nprint(s[-1])',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'M\nE\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Cắt ghép tên file',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo biến `file_name = "report_2026.pdf"`. Hãy cắt chuỗi để lấy ra chuỗi `"2026"` (gán vào biến `year`) và chuỗi `"pdf"` (gán vào biến `ext`). Sau đó in ra màn hình hai biến này cách nhau bởi dấu gạch ngang (ví dụ: `"2026-pdf"`).',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'file_name = "report_2026.pdf"\nyear = file_name[7:11]\next = file_name[-3:]\nprint(f"{year}-{ext}")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '2026-pdf\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Chuẩn hóa tên đăng nhập',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo biến `raw_username = "  STUDENT_01  "`. Hãy thực hiện loại bỏ khoảng trắng dư thừa ở hai đầu và chuyển toàn bộ chuỗi thành chữ thường. In kết quả cuối cùng ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'raw_username = "  STUDENT_01  "\nclean_username = raw_username.strip().lower()\nprint(clean_username)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'student_01\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Tạo câu chào tự động',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo 3 biến: `name = "Duy"`, `math_score = 9`, và `english_score = 8`. Sử dụng F-string để in ra màn hình câu thông báo: `"Học sinh Duy có điểm trung bình là 8.5"` (trong đó 8.5 là kết quả tính toán trực tiếp điểm trung bình của hai môn trong f-string).',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'name = "Duy"\nmath_score = 9\nenglish_score = 8\nprint(f"Học sinh {name} có điểm trung bình là {(math_score + english_score) / 2}")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Học sinh Duy có điểm trung bình là 8.5\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Truy xuất điểm thi',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khởi tạo danh sách `diem_so = [8.5, 7.0, 9.5, 6.0]`. Hãy in ra màn hình phần tử có giá trị lớn nhất trong danh sách (sử dụng chỉ số index tương ứng) và độ dài của danh sách này trên 2 dòng riêng biệt.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'diem_so = [8.5, 7.0, 9.5, 6.0]\nprint(diem_so[2])\nprint(len(diem_so))',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '9.5\n4\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Quản lý giỏ hàng',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Cho danh sách `shopping = ["Táo", "Bột mì"]`. Thực hiện lần lượt:\n1. Thêm `"Sữa"` vào cuối danh sách.\n2. Thay thế phần tử thứ hai `"Bột mì"` bằng `"Bơ"`.\n3. Xóa phần tử đầu tiên khỏi danh sách.\nIn danh sách kết quả cuối cùng ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'shopping = ["Táo", "Bột mì"]\nshopping.append("Sữa")\nshopping[1] = "Bơ"\nshopping.pop(0)\nprint(shopping)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: "['Bơ', 'Sữa']\n",
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Tính tổng điểm giỏi',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Cho danh sách điểm `scores = [6.5, 8.0, 5.5, 9.0, 7.5]`. Viết chương trình sử dụng vòng lặp duyệt qua danh sách và tính tổng các điểm số lớn hơn hoặc bằng 7.0. In tổng đó ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'scores = [6.5, 8.0, 5.5, 9.0, 7.5]\ntong = 0.0\nfor s in scores:\n    if s >= 7.0:\n        tong += s\nprint(tong)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '24.5\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Sắp xếp điểm số',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Cho danh sách điểm học viên `scores = [8, 5, 9, 7]`. Hãy sắp xếp danh sách này theo thứ tự giảm dần và in kết quả ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'scores = [8, 5, 9, 7]\nscores.sort(reverse=True)\nprint(scores)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '[9, 8, 7, 5]\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Khởi tạo tọa độ',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy khởi tạo một Tuple tên là `point` chứa hai số 15 và 30 đại diện cho tọa độ x và y. Hãy in ra màn hình phần tử y (tọa độ thứ hai) của Tuple đó.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'point = (15, 30)\nprint(point[1])',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '30\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Lọc trùng số điện thoại',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Cho danh sách số điện thoại trùng lặp `phones = ["090", "091", "090", "098", "091"]`. Hãy loại bỏ các phần tử trùng lặp, sắp xếp tăng dần và in kết quả ra màn hình dưới dạng một List (sử dụng: `list(sorted(set(phones)))`).',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'phones = ["090", "091", "090", "098", "091"]\nunique_phones = list(sorted(set(phones)))\nprint(unique_phones)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: "['090', '091', '098']\n",
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Thông tin sản phẩm',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy khởi tạo một Dictionary tên là `product` lưu trữ thông tin gồm: `"name"` là `"Laptop"`, `"price"` là `15000000`. Hãy in ra màn hình giá bán (`"price"`) của sản phẩm đó.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'product = {\n    "name": "Laptop",\n    "price": 15000000\n}\nprint(product["price"])',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '15000000\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Quản lý tồn kho',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Cho từ điển kho hàng `stock = {"táo": 10, "cam": 5}`. Hãy thực hiện:\n1. Thêm mặt hàng `"chuối"` với số lượng là `20`.\n2. Cập nhật số lượng mặt hàng `"cam"` lên thành `12`.\n3. Xóa mặt hàng `"táo"` khỏi kho hàng.\nIn từ điển `stock` ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'stock = {"táo": 10, "cam": 5}\nstock["chuối"] = 20\nstock["cam"] = 12\ndel stock["táo"]\nprint(stock)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: "{'cam': 12, 'chuối': 20}\n",
                                                                        isHidden: false
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
                                                    create: [
                                                        {
                                                            title: 'Hàm in khẩu hiệu',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy định nghĩa một hàm tên là `show_slogan` không nhận tham số đầu vào. Hàm sẽ in ra màn hình chuỗi: `"Học Python thật thú vị!"`. Đừng quên viết câu lệnh gọi hàm này hoạt động ở dòng cuối cùng.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'def show_slogan():\n    print("Học Python thật thú vị!")\n\nshow_slogan()',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Học Python thật thú vị!\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Hàm chào tên riêng',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Định nghĩa một hàm tên là `say_hello` nhận vào một tham số `name`. Hàm sẽ in ra màn hình chuỗi: `"Xin chào, {name}!"`. Gọi hàm này với đối số truyền vào là `"MCode"`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'def say_hello(name):\n    print(f"Xin chào, {name}!")\n\nsay_hello("MCode")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Xin chào, MCode!\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Hàm tính diện tích',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Định nghĩa hàm `calc_area` nhận vào tham số là chiều rộng `width` và chiều cao `height` của hình chữ nhật. Hàm sẽ tính toán và **trả về** (bằng lệnh `return`) diện tích hình chữ nhật đó. Gọi hàm này với kích thước `5` và `10`, lưu kết quả vào biến `area` và in giá trị biến đó ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'def calc_area(width, height):\n    return width * height\n\narea = calc_area(5, 10)\nprint(area)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '50\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Tăng biến toàn cục',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Khai báo biến toàn cục `score = 10`. Hãy định nghĩa hàm `add_score()` sử dụng từ khóa `global` để cộng thêm `5` điểm vào biến toàn cục `score`. Gọi hàm này và in ra màn hình giá trị của biến `score` sau khi gọi.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'score = 10\ndef add_score():\n    global score\n    score += 5\n\nadd_score()\nprint(score)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '15\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Lấy mẫu chia cho 0',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết chương trình thực hiện phép tính chia `10 / 0` nằm trong khối `try-except`, bắt ngoại lệ `ZeroDivisionError` và in ra dòng chữ `"Lỗi chia cho 0"`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'try:\n    10 / 0\nexcept ZeroDivisionError:\n    print("Lỗi chia cho 0")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Lỗi chia cho 0\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Ép kiểu an toàn',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết chương trình nhận vào một chuỗi từ câu lệnh `input()`. Thử ép kiểu chuỗi đó sang số nguyên bằng `int()`. Nếu thành công, hãy in số nguyên đó ra màn hình. Nếu xảy ra lỗi `ValueError`, hãy bắt lỗi và in ra màn hình dòng chữ `"Không phải số nguyên"`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 's = input()\ntry:\n    n = int(s)\n    print(n)\nexcept ValueError:\n    print("Không phải số nguyên")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '123\n',
                                                                        expectedOutput: '123\n',
                                                                        isHidden: false
                                                                    },
                                                                    {
                                                                        input: 'abc\n',
                                                                        expectedOutput: 'Không phải số nguyên\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Kiểm tra số âm',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy định nghĩa hàm `check_positive` nhận vào tham số `n`. Nếu `n` nhỏ hơn `0`, hãy dùng lệnh `raise ValueError("Số âm")`. Hãy viết chương trình gọi hàm này với giá trị nhập từ `input()` (được ép kiểu sang số nguyên). Sử dụng `try-except` để bắt `ValueError` và in ra thông báo lỗi đó ra màn hình, và trong khối `finally` hãy luôn in ra chữ `"Xong"`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'def check_positive(n):\n    if n < 0:\n        raise ValueError("Số âm")\n\ntry:\n    val = int(input())\n    check_positive(val)\nexcept ValueError as e:\n    print(e)\nfinally:\n    print("Xong")',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '5\n',
                                                                        expectedOutput: 'Xong\n',
                                                                        isHidden: false
                                                                    },
                                                                    {
                                                                        input: '-2\n',
                                                                        expectedOutput: 'Số âm\nXong\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Sử dụng hàm math.floor',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy import thư viện `math` và dùng hàm `math.floor(x)` để làm tròn xuống một số thực nhập từ bàn phím bằng `float(input())`. In kết quả đã làm tròn đó ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'import math\nval = float(input())\nprint(math.floor(val))',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '5.7\n',
                                                                        expectedOutput: '5\n',
                                                                        isHidden: false
                                                                    },
                                                                    {
                                                                        input: '2.1\n',
                                                                        expectedOutput: '2\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Chọn phần tử ngẫu nhiên cố định',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy import thư viện `random`. Để kết quả ngẫu nhiên luôn cố định cho việc kiểm tra testcase, chương trình đã đặt sẵn hạt giống `random.seed(42)` cho bạn. Bạn chỉ cần viết lệnh dùng hàm `random.choice(items)` để lấy ra một phần tử ngẫu nhiên từ danh sách `items = ["Táo", "Cam", "Bưởi"]` và in phần tử đó ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'import random\nrandom.seed(42)\nitems = ["Táo", "Cam", "Bưởi"]\nprint(random.choice(items))',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Bưởi\n',
                                                                        isHidden: false
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
                                                    create: [
                                                        {
                                                            title: 'Mở file cấu hình',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết một dòng lệnh sử dụng hàm `open()` để mở một tập tin tên là `"config.txt"` ở chế độ ghi tiếp dữ liệu (`"a"`) có mã hóa `"utf-8"`. Lưu đối tượng file này vào biến `f`, sau đó đóng file bằng lệnh `f.close()`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'f = open("config.txt", "a", encoding="utf-8")\nf.close()',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Ghi điểm số',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy viết chương trình mở tập tin tên là `"scores.txt"` ở chế độ ghi mới (`"w"`), mã hóa `"utf-8"`. Hãy ghi hai dòng chữ sau vào tập tin, mỗi dòng kết thúc bằng ký tự xuống dòng `\\n`:\n1. `"Math: 9.5"\\n`\n2. `"English: 8.0"\\n`\nĐóng tập tin lại sau khi ghi xong. Sau khi đóng tập tin, hãy mở lại tập tin đó ở chế độ đọc, đọc toàn bộ nội dung của nó và in ra màn hình để kiểm tra.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'f = open("scores.txt", "w", encoding="utf-8")\nf.write("Math: 9.5\\n")\nf.write("English: 8.0\\n")\nf.close()\n\nf = open("scores.txt", "r", encoding="utf-8")\nprint(f.read(), end="")\nf.close()',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Math: 9.5\nEnglish: 8.0\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Đọc ghi an toàn',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Sử dụng cấu trúc `with open(...)` để mở tập tin `"log.txt"` ở chế độ ghi mới (`"w"`), mã hóa `"utf-8"`. Ghi vào tập tin chuỗi `"System: Active"`. Sau đó, tiếp tục dùng cấu trúc `with open(...)` để mở lại tập tin đó ở chế độ đọc, đọc nội dung và in ra màn hình.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'with open("log.txt", "w", encoding="utf-8") as f:\n    f.write("System: Active")\n\nwith open("log.txt", "r", encoding="utf-8") as f:\n    print(f.read())',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'System: Active\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Khởi tạo đối tượng Xe',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy định nghĩa một lớp trống tên là `Car` (dùng từ khóa `pass`). Sau đó khởi tạo một đối tượng cụ thể từ lớp này và gán vào biến `my_car`. In kiểu dữ liệu của biến `my_car` ra màn hình (sử dụng hàm `type(my_car)`).',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'class Car:\n    pass\n\nmy_car = Car()\nprint(type(my_car))',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: "<class '__main__.Car'>\n",
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Phương thức của Mèo',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Định nghĩa lớp `Cat` có thuộc tính lớp `legs = 4`. Định nghĩa thêm một phương thức tên là `meow(self)` in ra màn hình chuỗi `"Meo meo!"`. Khởi tạo đối tượng `my_cat = Cat()`, in ra thuộc tính `legs` của nó và gọi phương thức `meow()`.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'class Cat:\n    legs = 4\n    def meow(self):\n        print("Meo meo!")\n\nmy_cat = Cat()\nprint(my_cat.legs)\nmy_cat.meow()',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: '4\nMeo meo!\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Thiết lập Học sinh',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy định nghĩa lớp `Student` có phương thức khởi tạo `__init__(self, name, age)`. Trong phương thức khởi tạo, hãy gán các giá trị tham số này cho các thuộc tính đối tượng `self.name` và `self.age`. Khởi tạo đối tượng `s = Student("Minh", 16)`, in ra màn hình thuộc tính `name` và `age` của đối tượng cách nhau bởi một khoảng trắng.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'class Student:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\ns = Student("Minh", 16)\nprint(s.name, s.age)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Minh 16\n',
                                                                        isHidden: false
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
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
                                                    create: [
                                                        {
                                                            title: 'Lớp con kế thừa Xe điện',
                                                            difficulty: 'EASY',
                                                            problemDescription: 'Hãy định nghĩa lớp cha `Vehicle` có phương thức khởi tạo `__init__(self, brand)` gán thuộc tính `self.brand = brand`. Định nghĩa lớp con `ElectricCar` kế thừa từ `Vehicle`. Trong lớp con `ElectricCar`, định nghĩa phương thức `__init__(self, brand, battery_capacity)` sử dụng hàm `super().__init__(brand)` để kế thừa thuộc tính `brand`, và tự gán thuộc tính `self.battery_capacity = battery_capacity`. Khởi tạo đối tượng `ev = ElectricCar("Tesla", 85)`. In thương hiệu và dung lượng pin của xe ra màn hình cách nhau bởi khoảng trắng.',
                                                            starterCode: '# Viết code của bạn ở đây\n',
                                                            solutionCode: 'class Vehicle:\n    def __init__(self, brand):\n        self.brand = brand\n\nclass ElectricCar(Vehicle):\n    def __init__(self, brand, battery_capacity):\n        super().__init__(brand)\n        self.battery_capacity = battery_capacity\n\nev = ElectricCar("Tesla", 85)\nprint(ev.brand, ev.battery_capacity)',
                                                            testCases: {
                                                                create: [
                                                                    {
                                                                        input: '',
                                                                        expectedOutput: 'Tesla 85\n',
                                                                        isHidden: false
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
