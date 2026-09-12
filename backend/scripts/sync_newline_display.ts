import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log('🔄 Đang đồng bộ hóa ký tự xuống dòng trong DB và file script...');

    // 1. Cập nhật trong DB cho tất cả bài C++
    const exercises = await prisma.codingExercise.findMany({
        include: {
            lesson: true
        }
    });

    let updatedCount = 0;
    for (const ex of exercises) {
        if (!ex.lesson?.lessonId?.startsWith('CPP-') && !ex.lesson?.lessonId?.startsWith('CPP2-')) {
            continue;
        }

        let desc = ex.problemDescription || '';
        // If desc has `'\n'` as a real newline: `' \n '`
        if (desc.includes("'\n'")) {
            desc = desc.replace(/'\n'/g, "'\\n'");
            await prisma.codingExercise.update({
                where: { id: ex.id },
                data: { problemDescription: desc }
            });
            updatedCount++;
            console.log(`  ✅ Updated DB for [${ex.lesson.lessonId}] ${ex.title}`);
        }
    }

    console.log(`🎉 Đã cập nhật ${updatedCount} bài trong Database!`);

    // 2. Cập nhật trong 3 file seed script
    const files = [
        path.resolve(__dirname, 'seed_cpp_module_1.ts'),
        path.resolve(__dirname, 'seed_cpp_modules_2_to_7.ts'),
        path.resolve(__dirname, 'seed_cpp_advanced.ts')
    ];

    for (const f of files) {
        let content = fs.readFileSync(f, 'utf-8');
        // Replace \`'\\n'\` where it has single slash with double slash
        // In file, it is: \`'\\n'\`
        // We want: \`'\\\\n'\`
        const fixed = content.replace(/\\`'\\n'\\`/g, "\\`'\\\\n'\\`");
        if (fixed !== content) {
            fs.writeFileSync(f, fixed, 'utf-8');
            console.log(`  ✅ Fixed seed file: ${path.basename(f)}`);
        }
    }

    console.log('✨ HOÀN TẤT ĐỒNG BỘ TOÀN DIỆN!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
