import { prisma } from '../config/prisma';

async function main() {
    try {
        console.log('🔍 Listing users before cleanup...');
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });

        console.log('Current users list:');
        console.log(JSON.stringify(allUsers, null, 2));

        // Let's filter user IDs to delete
        // We keep: 'admin', and users whose username or email contains 'nguyentuanviet'
        const usersToDelete = allUsers.filter(user => {
            const usernameLower = user.username.toLowerCase();
            const emailLower = user.email.toLowerCase();

            // Keep if admin
            if (usernameLower === 'admin' || user.role === 'ADMIN') {
                return false;
            }

            // Keep if contains 'nguyentuanviet' or exact 'nguyentuanviet'
            if (usernameLower.includes('nguyentuanviet') || emailLower.includes('nguyentuanviet')) {
                return false;
            }

            // Delete others
            return true;
        });

        console.log(`🧹 Found ${usersToDelete.length} users to delete out of ${allUsers.length} total users.`);

        if (usersToDelete.length > 0) {
            const deleteIds = usersToDelete.map(u => u.id);

            console.log('🗑️ Deleting submissions for filtered users...');
            const subDel = await prisma.submission.deleteMany({
                where: { userId: { in: deleteIds } }
            });
            console.log(`✅ Deleted ${subDel.count} submissions.`);

            console.log('🗑️ Deleting practiceSubmissions for filtered users...');
            const pracSubDel = await prisma.practiceSubmission.deleteMany({
                where: { userId: { in: deleteIds } }
            });
            console.log(`✅ Deleted ${pracSubDel.count} practice submissions.`);

            console.log('🗑️ Deleting enrollments for filtered users...');
            const enrollDel = await prisma.enrollment.deleteMany({
                where: { userId: { in: deleteIds } }
            });
            console.log(`✅ Deleted ${enrollDel.count} enrollments.`);

            console.log('🗑️ Deleting lessonProgress for filtered users...');
            const progressDel = await prisma.lessonProgress.deleteMany({
                where: { userId: { in: deleteIds } }
            });
            console.log(`✅ Deleted ${progressDel.count} lesson progress records.`);

            console.log('🗑️ Deleting aiReviews for filtered users...');
            const aiDel = await prisma.aIReview.deleteMany({
                where: { userId: { in: deleteIds } }
            });
            console.log(`✅ Deleted ${aiDel.count} AI reviews.`);

            console.log('🗑️ Deleting certificates for filtered users...');
            const certDel = await prisma.certificate.deleteMany({
                where: { userId: { in: deleteIds } }
            });
            console.log(`✅ Deleted ${certDel.count} certificates.`);

            console.log('🗑️ Deleting users...');
            const userDel = await prisma.user.deleteMany({
                where: { id: { in: deleteIds } }
            });
            console.log(`✅ Deleted ${userDel.count} users.`);
        } else {
            console.log('✨ No matching student users to delete.');
        }

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
