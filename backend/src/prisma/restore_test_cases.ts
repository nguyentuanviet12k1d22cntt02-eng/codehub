import { prisma } from '../config/prisma';
import { exercisesData } from './exercises_data';

async function main() {
    console.log('Bắt đầu khôi phục test cases mẫu cho các bài tập chính khóa...');

    let restoredExercisesCount = 0;
    let restoredTestCasesCount = 0;

    for (const [lessonId, exercises] of Object.entries(exercisesData)) {
        for (const ex of exercises) {
            // Tìm bài tập trong DB theo tiêu đề
            const dbExercise = await prisma.codingExercise.findFirst({
                where: {
                    title: ex.title
                }
            });

            if (!dbExercise) {
                console.log(`⚠️ Không tìm thấy bài tập: "${ex.title}" trong Database`);
                continue;
            }

            // Xóa các test cases tự động/sai lệch hiện tại của bài tập này
            await prisma.testCase.deleteMany({
                where: {
                    exerciseId: dbExercise.id
                }
            });

            // Thêm lại các test cases được định nghĩa thủ công chính xác trong exercises_data.ts
            if (ex.testCases && ex.testCases.length > 0) {
                await prisma.testCase.createMany({
                    data: ex.testCases.map(tc => ({
                        exerciseId: dbExercise.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        isHidden: tc.isHidden
                    }))
                });
                restoredTestCasesCount += ex.testCases.length;
            }

            restoredExercisesCount++;
        }
    }

    console.log(`✅ Hoàn thành khôi phục:`);
    console.log(`   - Số bài tập được khôi phục: ${restoredExercisesCount}`);
    console.log(`   - Tổng số test cases được nạp lại: ${restoredTestCasesCount}`);
}

main()
    .catch((e) => {
        console.error('Lỗi khi chạy khôi phục test cases:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
