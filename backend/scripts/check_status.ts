import { prisma } from '../src/infrastructure/database/prisma';

async function run() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, level: true, status: true }
  });
  console.log('Courses:', JSON.stringify(courses, null, 2));
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  console.log('Admin:', admin?.id, admin?.email);
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
