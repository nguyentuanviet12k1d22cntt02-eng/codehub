import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
    try {
        console.log('🔧 Đang tạo admin user...');

        // Check if admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: 'admin' },
                    { email: 'admin@example.com' }
                ]
            }
        });

        if (existingAdmin) {
            console.log('⚠️  Admin user đã tồn tại!');
            console.log(`Username: ${existingAdmin.username}`);
            console.log(`Email: ${existingAdmin.email}`);
            console.log(`Role: ${existingAdmin.role}`);

            if (existingAdmin.role !== 'ADMIN') {
                console.log('🔄 Đang cập nhật role thành ADMIN...');
                await prisma.user.update({
                    where: { id: existingAdmin.id },
                    data: { role: 'ADMIN' }
                });
                console.log('✅ Đã cập nhật role thành ADMIN!');
            }

            return;
        }

        // Create new admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'ADMIN',
                gender: 'MALE'
            }
        });

        console.log('✅ Tạo admin user thành công!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 Thông tin đăng nhập:');
        console.log(`   Username: admin`);
        console.log(`   Email: admin@example.com`);
        console.log(`   Password: admin123`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔗 Truy cập: http://localhost:5173/admin');
        console.log('');
        console.log('⚠️  QUAN TRỌNG: Hãy đổi mật khẩu sau khi đăng nhập lần đầu!');

    } catch (error) {
        console.error('❌ Lỗi khi tạo admin user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
