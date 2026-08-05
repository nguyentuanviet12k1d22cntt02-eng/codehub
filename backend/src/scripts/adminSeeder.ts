import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';

/**
 * Script để seed dữ liệu demo cho admin panel testing
 */
async function seedAdminData() {
    console.log('🌱 Đang seed dữ liệu demo cho Admin Panel...\n');

    try {
        // 1. Tạo admin user nếu chưa có
        console.log('1️⃣ Tạo Admin User...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.upsert({
            where: { username: 'admin' },
            update: { role: 'ADMIN' },
            create: {
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'ADMIN',
                gender: 'MALE'
            }
        });
        console.log('   ✅ Admin user: admin / admin123\n');

        // 2. Tạo một số demo users
        console.log('2️⃣ Tạo Demo Users...');
        const demoUsers = [];

        for (let i = 1; i <= 5; i++) {
            const user = await prisma.user.upsert({
                where: { username: `student${i}` },
                update: {},
                create: {
                    username: `student${i}`,
                    email: `student${i}@example.com`,
                    password: await bcrypt.hash('password123', 10),
                    role: 'STUDENT',
                    gender: i % 2 === 0 ? 'MALE' : 'FEMALE'
                }
            });
            demoUsers.push(user);
        }

        const teacher = await prisma.user.upsert({
            where: { username: 'teacher1' },
            update: {},
            create: {
                username: 'teacher1',
                email: 'teacher1@example.com',
                password: await bcrypt.hash('password123', 10),
                role: 'TEACHER',
                gender: 'MALE'
            }
        });

        console.log(`   ✅ Đã tạo ${demoUsers.length + 1} demo users\n`);

        // 3. Tạo demo courses
        console.log('3️⃣ Tạo Demo Courses...');
        const demoCourse = await prisma.course.upsert({
            where: { id: '00000000-0000-0000-0000-000000000001' },
            update: {},
            create: {
                id: '00000000-0000-0000-0000-000000000001',
                title: 'Python Cơ Bản - Demo Course',
                description: 'Khóa học Python dành cho người mới bắt đầu',
                level: 'BASIC',
                status: 'PUBLISHED',
                createdBy: teacher.id
            }
        });
        console.log('   ✅ Đã tạo demo course\n');

        // 4. Tạo enrollments
        console.log('4️⃣ Tạo Enrollments...');
        for (const user of demoUsers.slice(0, 3)) {
            await prisma.enrollment.upsert({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: demoCourse.id
                    }
                },
                update: {},
                create: {
                    userId: user.id,
                    courseId: demoCourse.id
                }
            });
        }
        console.log('   ✅ Đã tạo enrollments\n');

        // 5. Tạo demo practice problems nếu chưa có
        console.log('5️⃣ Kiểm tra Practice Problems...');
        const problemCount = await prisma.practiceProblem.count();
        console.log(`   ℹ️  Hiện có ${problemCount} practice problems\n`);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ SEED HOÀN TẤT!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📋 Thông tin đăng nhập Admin:');
        console.log('   URL: http://localhost:5173/admin');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('\n📋 Demo Users:');
        console.log('   student1, student2, student3, student4, student5');
        console.log('   Password: password123');
        console.log('\n📋 Demo Teacher:');
        console.log('   Username: teacher1');
        console.log('   Password: password123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Lỗi khi seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedAdminData();
