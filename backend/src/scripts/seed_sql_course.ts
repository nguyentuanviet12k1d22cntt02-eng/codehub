import { prisma } from '../config/prisma';
import * as fs from 'fs';
import * as path from 'path';

function extractQuizQuestions(markdown: string) {
    const questions: any[] = [];
    const quizRegex = /###\s*(?:🎯\s*)?([^\n]+)\n+([\s\S]*?)(?=(?:\n###\s*|\n##\s*|\n---\s*|$))/g;
    let match;
    let index = 1;
    while ((match = quizRegex.exec(markdown)) !== null) {
        const rawTitle = match[1].replace(/^[^\w\s\u00C0-\u1EF9]+/u, '').trim();
        const blockContent = match[2].trim();

        // Chỉ lấy các block trắc nghiệm có options A, B, C, D
        const options: { key: string; text: string }[] = [];
        const optionRegex = /(?:^|\n)\s*[-*]\s*([A-D])\.\s*([\s\S]*?)(?=(?:\n\s*[-*]\s*[A-D]\.|\n\s*\*\(|\n\s*\(|\n\s*Đáp án|$))/g;
        let optMatch;

        while ((optMatch = optionRegex.exec(blockContent)) !== null) {
            options.push({
                key: optMatch[1].trim(),
                text: optMatch[2].trim().replace(/\n+/g, ' ')
            });
        }

        if (options.length >= 2) {
            const ansMatch = /(?:\*\(|\()?\s*Đáp án\s*(?:đúng)?\s*:\s*\**([A-D])\**\s*[-–—:]?\s*([\s\S]*?)(?:\)\*|\)|$)/i.exec(blockContent);
            const correctAnswer = ansMatch ? ansMatch[1].toUpperCase().trim() : 'A';
            const rawExplanation = ansMatch && ansMatch[2] ? ansMatch[2].replace(/\)\*$/, '').replace(/\)$/, '').trim() : '';
            const questionText = blockContent.split(/[-*]\s*[A-D]\./)[0].trim();

            questions.push({
                question: questionText,
                level: rawTitle || `Câu hỏi ${index}`,
                explanation: rawExplanation || 'Chúc mừng bạn đã chọn đáp án chính xác!',
                orderIndex: index,
                options: options.map(opt => ({
                    key: opt.key,
                    text: opt.text,
                    isCorrect: opt.key === correctAnswer
                }))
            });
            index++;
        }
    }
    return questions;
}

const exercisesByLesson: Record<string, any[]> = {
    'SQL-01.01': [
        {
            title: 'Xem Toàn Bộ Danh Sách Khách Hàng (SELECT *)',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Hãy viết câu lệnh T-SQL để truy xuất toàn bộ thông tin các cột từ bảng khách hàng \`sales.Customers\`.

#### Bảng Dữ Liệu \`sales.Customers\`:
| CustomerID | FullName | City | Country | TotalSpent |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Nguyễn Văn An | Hà Nội | Việt Nam | 15000000.00 |
| 2 | Trần Thị Mai | TP. Hồ Chí Minh | Việt Nam | 4500000.00 |
| 3 | Lê Hoàng Long | Hà Nội | Việt Nam | 28000000.00 |`,
            starterCode: `-- Viết câu lệnh SELECT * từ bảng sales.Customers\nSELECT \nFROM sales.Customers;\n`,
            solutionCode: `SELECT * FROM sales.Customers;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `CustomerID | FullName | City | Country | TotalSpent
1 | Nguyễn Văn An | Hà Nội | Việt Nam | 15000000.00
2 | Trần Thị Mai | TP. Hồ Chí Minh | Việt Nam | 4500000.00
3 | Lê Hoàng Long | Hà Nội | Việt Nam | 28000000.00
4 | Phạm Minh Tuấn | Đà Nẵng | Việt Nam | 0.00
5 | John Smith | Tokyo | Nhật Bản | 32000000.00
6 | Kenji Sato | Tokyo | Nhật Bản | 8000000.00`,
                    isHidden: false
                }
            ]
        },
        {
            title: 'Kiểm Tra Toàn Bộ Nhân Sự (hr.Employees)',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Ban giám đốc muốn xem toàn bộ danh sách nhân sự hiện tại trong công ty. Hãy viết câu lệnh lấy tất cả các cột từ bảng \`hr.Employees\`.`,
            starterCode: `-- Viết câu lệnh xem toàn bộ bảng hr.Employees\nSELECT \nFROM hr.Employees;\n`,
            solutionCode: `SELECT * FROM hr.Employees;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `EmployeeID | FullName | Department | Salary | HireDate
1 | Trần Văn Bình | Công nghệ thông tin | 25000000.00 | 2022-03-15
2 | Lê Thị Cẩm | Kế toán | 16500000.00 | 2023-07-01
3 | Phạm Quốc Dũng | Công nghệ thông tin | 32000000.00 | 2021-11-20
4 | Nguyễn Hoàng Em | Kinh doanh | 14000000.00 | 2024-02-10
5 | Vũ Thị Hà | Kinh doanh | 18500000.00 | 2023-01-15
6 | Đỗ Minh Trí | Nhân sự | 15000000.00 | 2022-09-01`,
                    isHidden: false
                }
            ]
        }
    ],
    'SQL-01.02': [
        {
            title: 'Truy Vấn Danh Sách Định Danh Nhân Viên',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Hệ thống chấm công chỉ cần 2 thông tin: Mã nhân viên (\`EmployeeID\`) và Họ tên (\`FullName\`). Hãy viết truy vấn lấy 2 cột này từ bảng \`hr.Employees\`.`,
            starterCode: `-- Viết câu lệnh SELECT 2 cột EmployeeID, FullName từ hr.Employees\nSELECT \nFROM hr.Employees;\n`,
            solutionCode: `SELECT EmployeeID, FullName FROM hr.Employees;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `EmployeeID | FullName
1 | Trần Văn Bình
2 | Lê Thị Cẩm
3 | Phạm Quốc Dũng
4 | Nguyễn Hoàng Em
5 | Vũ Thị Hà
6 | Đỗ Minh Trí`,
                    isHidden: false
                }
            ]
        },
        {
            title: 'Lấy Mã Khách Hàng Và Thành Phố Cư Trú',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Bộ phận phân tích địa bàn cần danh sách mã khách hàng (\`CustomerID\`) và thành phố (\`City\`) từ bảng \`sales.Customers\`.`,
            starterCode: `-- Viết câu lệnh SELECT CustomerID, City từ sales.Customers\nSELECT \nFROM sales.Customers;\n`,
            solutionCode: `SELECT CustomerID, City FROM sales.Customers;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `CustomerID | City
1 | Hà Nội
2 | TP. Hồ Chí Minh
3 | Hà Nội
4 | Đà Nẵng
5 | Tokyo
6 | Tokyo`,
                    isHidden: false
                }
            ]
        }
    ],
    'SQL-01.03': [
        {
            title: 'In Thông Điệp Chào Mừng (Literal Expression)',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Hãy viết câu lệnh T-SQL để hiển thị một chuỗi thông điệp \`Hello SQL Server\` và đặt tên cột kết quả là \`Message\`.`,
            starterCode: `-- Viết câu lệnh SELECT in thông điệp\nSELECT 'Hello SQL Server' AS Message;\n`,
            solutionCode: `SELECT 'Hello SQL Server' AS Message;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `Message
Hello SQL Server`,
                    isHidden: false
                }
            ]
        },
        {
            title: 'Xem Bảng Tồn Kho Thiết Bị (sales.Inventory)',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Hãy truy xuất toàn bộ dữ liệu từ bảng tồn kho thiết bị văn phòng \`sales.Inventory\`.`,
            starterCode: `-- Viết câu lệnh SELECT * từ sales.Inventory\nSELECT \nFROM sales.Inventory;\n`,
            solutionCode: `SELECT * FROM sales.Inventory;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `ItemID | ItemName | UnitPrice | Quantity
101 | Bàn Phím Cơ AKKO | 1200000.00 | 15
102 | Chuột Logitech MX Master 3S | 2450000.00 | 10
103 | Màn hình Dell UltraSharp 27" | 8900000.00 | 5`,
                    isHidden: false
                }
            ]
        }
    ],
    'SQL-02.01': [
        {
            title: 'Truy Xuất Thông Tin Menu Bán Hàng',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Ứng dụng di động cần hiển thị danh mục sản phẩm cho khách hàng xem. Hãy viết câu lệnh T-SQL để lấy ra **3 thông tin**: Mã sản phẩm (\`ProductID\`), Tên sản phẩm (\`ProductName\`), và Đơn giá (\`UnitPrice\`) từ bảng \`sales.Products\`.`,
            starterCode: `-- Viết câu lệnh SELECT chỉ định 3 cột theo yêu cầu\nSELECT \nFROM sales.Products;\n`,
            solutionCode: `SELECT ProductID, ProductName, UnitPrice FROM sales.Products;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `ProductID | ProductName | UnitPrice
1 | iPhone 15 Pro Max | 29990000.00
2 | Samsung Galaxy S24 Ultra | 27990000.00
3 | MacBook Air M2 | 24490000.00
4 | Dell XPS 13 Plus | 32500000.00
5 | Sony WH-1000XM5 | 6990000.00
6 | Bàn phím cơ văn phòng | 850000.00
7 | Samsung Galaxy A15 | 4500000.00
8 | Asus TUF Gaming | 19500000.00`,
                    isHidden: false
                }
            ]
        },
        {
            title: 'Báo Cáo Tồn Kho Cho Bộ Phận Kho Vận',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Thủ kho cần kiểm tra tình trạng hàng hóa còn lại trong kho. Hãy viết truy vấn T-SQL lấy danh sách gồm 3 thông tin: Tên sản phẩm (\`ProductName\`), Danh mục (\`CategoryName\`), và Số lượng tồn kho (\`UnitsInStock\`) từ bảng \`sales.Products\`.`,
            starterCode: `-- Viết câu lệnh truy vấn lấy ProductName, CategoryName, UnitsInStock\nSELECT \nFROM sales.Products;\n`,
            solutionCode: `SELECT ProductName, CategoryName, UnitsInStock FROM sales.Products;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `ProductName | CategoryName | UnitsInStock
iPhone 15 Pro Max | Điện thoại | 25
Samsung Galaxy S24 Ultra | Điện thoại | 18
MacBook Air M2 | Laptop | 12
Dell XPS 13 Plus | Laptop | 8
Sony WH-1000XM5 | Phụ kiện | 40
Bàn phím cơ văn phòng | Phụ kiện | 4
Samsung Galaxy A15 | Điện thoại | 50
Asus TUF Gaming | Laptop | 3`,
                    isHidden: false
                }
            ]
        }
    ],
    'SQL-02.02': [
        {
            title: 'Lấy Danh Sách Thành Phố Khách Hàng Duy Nhất',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Phòng Marketing cần biết công ty đang có khách hàng ở những thành phố nào mà không muốn bị trùng lặp tên thành phố. Hãy viết câu lệnh lấy cột \`City\` duy nhất từ bảng \`sales.Customers\`.`,
            starterCode: `-- Sử dụng DISTINCT để lấy danh sách thành phố duy nhất\nSELECT DISTINCT \nFROM sales.Customers;\n`,
            solutionCode: `SELECT DISTINCT City FROM sales.Customers;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `City
Hà Nội
TP. Hồ Chí Minh
Đà Nẵng
Tokyo`,
                    isHidden: false
                }
            ]
        },
        {
            title: 'Lấy Danh Sách Các Phòng Ban Trong Công Ty',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Hãy viết câu lệnh truy xuất danh sách tất cả các phòng ban (\`Department\`) **duy nhất** có nhân viên làm việc từ bảng \`hr.Employees\`.`,
            starterCode: `-- Viết câu lệnh DISTINCT Department\nSELECT DISTINCT Department FROM hr.Employees;\n`,
            solutionCode: `SELECT DISTINCT Department FROM hr.Employees;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `Department
Công nghệ thông tin
Kế toán
Kinh doanh
Nhân sự`,
                    isHidden: false
                }
            ]
        },
        {
            title: 'Tính Giá Kèm Thuế VAT Và Đặt Bí Danh',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Viết câu lệnh hiển thị: Tên sản phẩm (\`ProductName\`), Đơn giá gốc (\`UnitPrice\`), và Giá sau thuế 10% (\`UnitPrice * 1.1\`) được đặt tên bí danh là \`PriceWithTax\` từ bảng \`sales.Products\`.`,
            starterCode: `-- Viết câu lệnh tính toán cột và đặt bí danh\nSELECT ProductName, UnitPrice, UnitPrice * 1.1 AS PriceWithTax \nFROM sales.Products;\n`,
            solutionCode: `SELECT ProductName, UnitPrice, UnitPrice * 1.1 AS PriceWithTax FROM sales.Products;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `ProductName | UnitPrice | PriceWithTax
iPhone 15 Pro Max | 29990000.00 | 32989000.00
Samsung Galaxy S24 Ultra | 27990000.00 | 30789000.00
MacBook Air M2 | 24490000.00 | 26939000.00
Dell XPS 13 Plus | 32500000.00 | 35750000.00
Sony WH-1000XM5 | 6990000.00 | 7689000.00
Bàn phím cơ văn phòng | 850000.00 | 935000.00
Samsung Galaxy A15 | 4500000.00 | 4950000.00
Asus TUF Gaming | 19500000.00 | 21450000.00`,
                    isHidden: false
                }
            ]
        }
    ],
    'SQL-02.03': [
        {
            title: 'Lọc Nhân Viên Phòng Công Nghệ Thông Tin',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Trưởng phòng IT cần danh sách nhân viên thuộc bộ phận mình. Hãy viết câu lệnh lấy ra: \`EmployeeID\`, \`FullName\`, \`Salary\` từ bảng \`hr.Employees\` với điều kiện phòng ban là \`Công nghệ thông tin\`.`,
            starterCode: `-- Viết câu lệnh SELECT với WHERE Department = 'Công nghệ thông tin'\nSELECT \nFROM hr.Employees\nWHERE Department = 'Công nghệ thông tin';\n`,
            solutionCode: `SELECT EmployeeID, FullName, Salary FROM hr.Employees WHERE Department = 'Công nghệ thông tin';`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `EmployeeID | FullName | Salary
1 | Trần Văn Bình | 25000000.00
3 | Phạm Quốc Dũng | 32000000.00`,
                    isHidden: false
                }
            ]
        },
        {
            title: 'Lọc Sản Phẩm Cần Nhập Thêm Hàng (Tồn Kho Thấp)',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Hãy viết câu lệnh tìm các sản phẩm có số lượng tồn kho (\`UnitsInStock\`) dưới 10 chiếc (\`< 10\`) từ bảng \`sales.Products\`. Kết quả hiển thị: \`ProductID\`, \`ProductName\`, \`UnitsInStock\`.`,
            starterCode: `-- Lọc sản phẩm có UnitsInStock < 10\nSELECT ProductID, ProductName, UnitsInStock \nFROM sales.Products\nWHERE UnitsInStock < 10;\n`,
            solutionCode: `SELECT ProductID, ProductName, UnitsInStock FROM sales.Products WHERE UnitsInStock < 10;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `ProductID | ProductName | UnitsInStock
4 | Dell XPS 13 Plus | 8
6 | Bàn phím cơ văn phòng | 4
8 | Asus TUF Gaming | 3`,
                    isHidden: false
                }
            ]
        }
    ],
    'SQL-02.04': [
        {
            title: 'Lọc Điện Thoại Có Mức Giá Phổ Thông',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Khách hàng muốn tìm sản phẩm thuộc danh mục \`Điện thoại\` VÀ có mức giá dưới 10.000.000 VNĐ (\`UnitPrice < 10000000\`). Hãy viết truy vấn lấy \`ProductID\`, \`ProductName\`, \`UnitPrice\` từ bảng \`sales.Products\`.`,
            starterCode: `-- Kết hợp điều kiện AND giữa CategoryName và UnitPrice\nSELECT ProductID, ProductName, UnitPrice \nFROM sales.Products\nWHERE CategoryName = 'Điện thoại' AND UnitPrice < 10000000;\n`,
            solutionCode: `SELECT ProductID, ProductName, UnitPrice FROM sales.Products WHERE CategoryName = 'Điện thoại' AND UnitPrice < 10000000;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `ProductID | ProductName | UnitPrice
7 | Samsung Galaxy A15 | 4500000.00`,
                    isHidden: false
                }
            ]
        },
        {
            title: 'Lọc Khách Hàng Tiềm Năng Hoặc VIP',
            difficulty: 'EASY',
            problemDescription: `### Yêu Cầu Đề Bài:
Hãy viết câu lệnh tìm các khách hàng ở thành phố \`Hà Nội\` HOẶC có tổng chi tiêu từ 25.000.000 trở lên (\`TotalSpent >= 25000000\`) từ bảng \`sales.Customers\`. Kết quả hiển thị: \`CustomerID\`, \`FullName\`, \`City\`, \`TotalSpent\`.`,
            starterCode: `-- Kết hợp điều kiện OR\nSELECT CustomerID, FullName, City, TotalSpent \nFROM sales.Customers\nWHERE City = 'Hà Nội' OR TotalSpent >= 25000000;\n`,
            solutionCode: `SELECT CustomerID, FullName, City, TotalSpent FROM sales.Customers WHERE City = 'Hà Nội' OR TotalSpent >= 25000000;`,
            testCases: [
                {
                    input: '',
                    expectedOutput: `CustomerID | FullName | City | TotalSpent
1 | Nguyễn Văn An | Hà Nội | 15000000.00
3 | Lê Hoàng Long | Hà Nội | 28000000.00
5 | John Smith | Tokyo | 32000000.00`,
                    isHidden: false
                }
            ]
        }
    ]
};

async function main() {
    console.log('🚀 Bắt đầu đồng bộ hóa toàn bộ khóa học SQL Server lên PostgreSQL...');

    // 1. Lấy thông tin tài khoản Admin
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (!admin) {
        throw new Error('Chưa tìm thấy tài khoản Admin. Vui lòng chạy seeder trước.');
    }

    // 2. Tạo hoặc Cập nhật Khóa học SQL Server
    const sqlCourseId = 'e2b5c7a1-4f8d-4e9b-9c3a-8b7d6e5f4a3b';
    const course = await prisma.course.upsert({
        where: { id: sqlCourseId },
        update: {
            title: 'Lập trình Cơ sở Dữ liệu SQL Server (T-SQL) Toàn Diện',
            description: 'Khóa học làm chủ Microsoft SQL Server và T-SQL từ nền tảng thiết kế CSDL đến truy vấn chuyên sâu và tối ưu hóa hiệu năng.',
            level: 'BASIC' as any,
            status: 'PUBLISHED' as any,
            thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
            createdBy: admin.id
        },
        create: {
            id: sqlCourseId,
            title: 'Lập trình Cơ sở Dữ liệu SQL Server (T-SQL) Toàn Diện',
            description: 'Khóa học làm chủ Microsoft SQL Server và T-SQL từ nền tảng thiết kế CSDL đến truy vấn chuyên sâu và tối ưu hóa hiệu năng.',
            level: 'BASIC' as any,
            status: 'PUBLISHED' as any,
            thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
            createdBy: admin.id
        }
    });
    console.log(`✅ Khóa học: ${course.title} (ID: ${course.id})`);

    // 3. Tạo hoặc Cập nhật Module 1
    const module1 = await prisma.module.upsert({
        where: { moduleId: 'SQL-MOD-01' },
        update: {
            title: 'Module 1: Nền tảng & Truy vấn cơ bản (DQL Basics)',
            objective: 'Nắm vững bản chất CSDL quan hệ, thiết kế bảng dữ liệu và làm chủ các câu lệnh truy vấn lọc dữ liệu trong T-SQL.',
            duration: '6 giờ',
            orderIndex: 1,
            courseId: course.id
        },
        create: {
            moduleId: 'SQL-MOD-01',
            title: 'Module 1: Nền tảng & Truy vấn cơ bản (DQL Basics)',
            objective: 'Nắm vững bản chất CSDL quan hệ, thiết kế bảng dữ liệu và làm chủ các câu lệnh truy vấn lọc dữ liệu trong T-SQL.',
            duration: '6 giờ',
            orderIndex: 1,
            courseId: course.id
        }
    });

    // ==========================================
    // 4. CHAPTER 1
    // ==========================================
    let chapter1 = await prisma.chapter.findFirst({
        where: {
            moduleId: module1.id,
            chapterId: 'SQL-CH-01'
        }
    });

    if (chapter1) {
        chapter1 = await prisma.chapter.update({
            where: { id: chapter1.id },
            data: {
                title: 'Chapter 1: Tổng quan Cơ sở dữ liệu quan hệ & Môi trường SQL Server',
                objective: 'Làm quen với các khái niệm cốt lõi của RDBMS, thiết kế khóa và công cụ SSMS.',
                orderIndex: 1
            }
        });
    } else {
        chapter1 = await prisma.chapter.create({
            data: {
                chapterId: 'SQL-CH-01',
                title: 'Chapter 1: Tổng quan Cơ sở dữ liệu quan hệ & Môi trường SQL Server',
                objective: 'Làm quen với các khái niệm cốt lõi của RDBMS, thiết kế khóa và công cụ SSMS.',
                orderIndex: 1,
                moduleId: module1.id
            }
        });
    }
    console.log(`\n✅ Chapter: ${chapter1.title}`);

    const chapter1Dir = path.resolve(__dirname, '../../../docs/Dữ liệu nội dung bài học/SQL/Cấu trúc bài học/Chapter 01');
    const chapter1Lessons = [
        {
            filename: 'Bài 1.1 - Cơ sở dữ liệu quan hệ RDBMS và Bảng dữ liệu.md',
            lessonId: 'SQL-01.01',
            title: 'Bài 1.1: Cơ sở dữ liệu quan hệ (RDBMS) là gì? Khái niệm Bảng, Dòng, Cột, Lược đồ',
            orderIndex: 1,
            durationMinutes: 20,
            difficulty: 'EASY',
            keyKnowledge: 'RDBMS, Table, Row, Column, Schema, Data Integrity, Atomicity'
        },
        {
            filename: 'Bài 1.2 - Khóa chính, Khóa ngoại và Mối quan hệ giữa các bảng.md',
            lessonId: 'SQL-01.02',
            title: 'Bài 1.2: Khóa chính (Primary Key), Khóa ngoại (Foreign Key) và Mối quan hệ giữa các bảng',
            orderIndex: 2,
            durationMinutes: 25,
            difficulty: 'EASY',
            keyKnowledge: 'Primary Key, Foreign Key, Relationships (1-1, 1-N, N-N), Referential Integrity'
        },
        {
            filename: 'Bài 1.3 - Cài đặt SQL Server, làm quen SSMS và Chạy câu lệnh T-SQL đầu tiên.md',
            lessonId: 'SQL-01.03',
            title: 'Bài 1.3: Cài đặt SQL Server, làm quen giao diện SSMS & Chạy câu lệnh T-SQL đầu tiên',
            orderIndex: 3,
            durationMinutes: 25,
            difficulty: 'EASY',
            keyKnowledge: 'SQL Server Developer, SSMS, Object Explorer, Query Editor, GO, Unicode N Prefix, T-SQL'
        }
    ];

    for (const item of chapter1Lessons) {
        const filePath = path.join(chapter1Dir, item.filename);
        if (fs.existsSync(filePath)) {
            const rawContent = fs.readFileSync(filePath, 'utf8');
            const existing = await prisma.lesson.findFirst({
                where: { chapterId: chapter1.id, lessonId: item.lessonId }
            });
            let lessonRecord = existing;
            if (existing) {
                lessonRecord = await prisma.lesson.update({
                    where: { id: existing.id },
                    data: {
                        title: item.title,
                        content: rawContent,
                        orderIndex: item.orderIndex,
                        durationMinutes: item.durationMinutes,
                        difficulty: item.difficulty,
                        keyKnowledge: item.keyKnowledge,
                        isFree: true
                    }
                });
                console.log(`   🔄 Đã cập nhật: ${item.lessonId}`);
            } else {
                lessonRecord = await prisma.lesson.create({
                    data: {
                        lessonId: item.lessonId,
                        chapterId: chapter1.id,
                        title: item.title,
                        content: rawContent,
                        orderIndex: item.orderIndex,
                        durationMinutes: item.durationMinutes,
                        difficulty: item.difficulty,
                        keyKnowledge: item.keyKnowledge,
                        isFree: true
                    }
                });
                console.log(`   ✨ Đã tạo mới: ${item.lessonId}`);
            }

            if (lessonRecord) {
                // Đồng bộ câu hỏi trắc nghiệm vào Database
                const quizzes = extractQuizQuestions(rawContent);
                if (quizzes.length > 0) {
                    await prisma.lessonQuizQuestion.deleteMany({ where: { lessonId: lessonRecord.id } });
                    for (const q of quizzes) {
                        await prisma.lessonQuizQuestion.create({
                            data: {
                                lessonId: lessonRecord.id,
                                question: q.question,
                                level: q.level,
                                explanation: q.explanation,
                                orderIndex: q.orderIndex,
                                options: {
                                    create: q.options
                                }
                            }
                        });
                    }
                    console.log(`      🎯 Đã nạp ${quizzes.length} câu hỏi trắc nghiệm vào Database!`);
                }

                // Đồng bộ bài tập thực hành vào Database
                if (exercisesByLesson[item.lessonId]) {
                    await prisma.codingExercise.deleteMany({ where: { lessonId: lessonRecord.id } });
                    for (const ex of exercisesByLesson[item.lessonId]) {
                        await prisma.codingExercise.create({
                            data: {
                                lessonId: lessonRecord.id,
                                title: ex.title,
                                difficulty: ex.difficulty,
                                problemDescription: ex.problemDescription,
                                starterCode: ex.starterCode,
                                solutionCode: ex.solutionCode,
                                testCases: {
                                    create: ex.testCases
                                }
                            }
                        });
                    }
                    console.log(`      ⚡ Đã nạp ${exercisesByLesson[item.lessonId].length} bài tập thực hành cho ${item.lessonId}!`);
                }
            }
        }
    }

    // ==========================================
    // 5. CHAPTER 2
    // ==========================================
    let chapter2 = await prisma.chapter.findFirst({
        where: {
            moduleId: module1.id,
            chapterId: 'SQL-CH-02'
        }
    });

    if (chapter2) {
        chapter2 = await prisma.chapter.update({
            where: { id: chapter2.id },
            data: {
                title: 'Chapter 2: Truy xuất & Lọc dữ liệu cơ bản',
                objective: 'Làm chủ cú pháp SELECT, FROM, loại bỏ trùng lặp DISTINCT, đặt bí danh AS và lọc dữ liệu với WHERE, AND, OR, NOT.',
                orderIndex: 2
            }
        });
    } else {
        chapter2 = await prisma.chapter.create({
            data: {
                chapterId: 'SQL-CH-02',
                title: 'Chapter 2: Truy xuất & Lọc dữ liệu cơ bản',
                objective: 'Làm chủ cú pháp SELECT, FROM, loại bỏ trùng lặp DISTINCT, đặt bí danh AS và lọc dữ liệu với WHERE, AND, OR, NOT.',
                orderIndex: 2,
                moduleId: module1.id
            }
        });
    }
    console.log(`\n✅ Chapter: ${chapter2.title}`);

    const chapter2Dir = path.resolve(__dirname, '../../../docs/Dữ liệu nội dung bài học/SQL/Cấu trúc bài học/Chapter02');
    const chapter2Lessons = [
        {
            filename: 'Bài 2.1 - Cú pháp lệnh SELECT và FROM - Lấy tất cả cột vs Lấy cột chỉ định.md',
            lessonId: 'SQL-02.01',
            title: 'Bài 2.1: Cú pháp lệnh SELECT và FROM: Lấy tất cả cột vs. Lấy cột chỉ định',
            orderIndex: 1,
            durationMinutes: 20,
            difficulty: 'EASY',
            keyKnowledge: 'SELECT, FROM, Logical Query Processing, Column Projection, Performance'
        },
        {
            filename: 'Bài 2.2 - Loại bỏ trùng lặp với DISTINCT và Đặt bí danh cột với AS.md',
            lessonId: 'SQL-02.02',
            title: 'Bài 2.2: Loại bỏ trùng lặp với DISTINCT và Đặt bí danh cột với AS',
            orderIndex: 2,
            durationMinutes: 20,
            difficulty: 'EASY',
            keyKnowledge: 'DISTINCT, AS, Column Alias, Expression Alias, Logical Processing Order'
        },
        {
            filename: 'Bài 2.3 - Lọc điều kiện cơ bản với mệnh đề WHERE.md',
            lessonId: 'SQL-02.03',
            title: 'Bài 2.3: Lọc điều kiện cơ bản với mệnh đề WHERE (Toán tử so sánh)',
            orderIndex: 3,
            durationMinutes: 25,
            difficulty: 'EASY',
            keyKnowledge: 'WHERE, Comparison Operators, Numeric/Text/Date Filtering, SARGable Predicates'
        },
        {
            filename: 'Bài 2.4 - Kết hợp nhiều điều kiện logic với AND, OR, NOT và Thứ tự ưu tiên.md',
            lessonId: 'SQL-02.04',
            title: 'Bài 2.4: Kết hợp nhiều điều kiện logic: AND, OR, NOT và Thứ tự ưu tiên toán tử',
            orderIndex: 4,
            durationMinutes: 25,
            difficulty: 'EASY',
            keyKnowledge: 'AND, OR, NOT, Operator Precedence, Truth Table, Parentheses Grouping'
        }
    ];

    for (const item of chapter2Lessons) {
        const filePath = path.join(chapter2Dir, item.filename);
        if (fs.existsSync(filePath)) {
            const rawContent = fs.readFileSync(filePath, 'utf8');
            const existing = await prisma.lesson.findFirst({
                where: { chapterId: chapter2.id, lessonId: item.lessonId }
            });
            let lessonRecord = existing;
            if (existing) {
                lessonRecord = await prisma.lesson.update({
                    where: { id: existing.id },
                    data: {
                        title: item.title,
                        content: rawContent,
                        orderIndex: item.orderIndex,
                        durationMinutes: item.durationMinutes,
                        difficulty: item.difficulty,
                        keyKnowledge: item.keyKnowledge,
                        isFree: true
                    }
                });
                console.log(`   🔄 Đã cập nhật: ${item.lessonId} - ${item.title}`);
            } else {
                lessonRecord = await prisma.lesson.create({
                    data: {
                        lessonId: item.lessonId,
                        chapterId: chapter2.id,
                        title: item.title,
                        content: rawContent,
                        orderIndex: item.orderIndex,
                        durationMinutes: item.durationMinutes,
                        difficulty: item.difficulty,
                        keyKnowledge: item.keyKnowledge,
                        isFree: true
                    }
                });
                console.log(`   ✨ Đã tạo mới: ${item.lessonId} - ${item.title}`);
            }

            if (lessonRecord) {
                // Đồng bộ câu hỏi trắc nghiệm vào Database
                const quizzes = extractQuizQuestions(rawContent);
                if (quizzes.length > 0) {
                    await prisma.lessonQuizQuestion.deleteMany({ where: { lessonId: lessonRecord.id } });
                    for (const q of quizzes) {
                        await prisma.lessonQuizQuestion.create({
                            data: {
                                lessonId: lessonRecord.id,
                                question: q.question,
                                level: q.level,
                                explanation: q.explanation,
                                orderIndex: q.orderIndex,
                                options: {
                                    create: q.options
                                }
                            }
                        });
                    }
                    console.log(`      🎯 Đã nạp ${quizzes.length} câu hỏi trắc nghiệm vào Database!`);
                }

                // Đồng bộ bài tập thực hành vào Database
                if (exercisesByLesson[item.lessonId]) {
                    await prisma.codingExercise.deleteMany({ where: { lessonId: lessonRecord.id } });
                    for (const ex of exercisesByLesson[item.lessonId]) {
                        await prisma.codingExercise.create({
                            data: {
                                lessonId: lessonRecord.id,
                                title: ex.title,
                                difficulty: ex.difficulty,
                                problemDescription: ex.problemDescription,
                                starterCode: ex.starterCode,
                                solutionCode: ex.solutionCode,
                                testCases: {
                                    create: ex.testCases
                                }
                            }
                        });
                    }
                    console.log(`      ⚡ Đã nạp ${exercisesByLesson[item.lessonId].length} bài tập thực hành cho ${item.lessonId}!`);
                }
            }
        } else {
            console.error(`❌ Không tìm thấy file: ${filePath}`);
        }
    }

    console.log('\n🎉 ĐỒNG BỘ NỘI DUNG CHAPTER 1 & 2 LÊN DATABASE THÀNH CÔNG!');
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi nạp dữ liệu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
