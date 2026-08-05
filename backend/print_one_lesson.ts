import * as fs from 'fs';
import * as path from 'path';

const jsonPath = path.join(__dirname, 'src', 'prisma', 'seed_course_data.json');
const courseData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

courseData.forEach((mod: any) => {
    mod.chapters.forEach((ch: any) => {
        ch.lessons.forEach((l: any) => {
            if (l.lessonId === 'LS-06.01') {
                console.log('--- CONTENT OF LS-06.01 ---');
                console.log(l.content);
            }
        });
    });
});
