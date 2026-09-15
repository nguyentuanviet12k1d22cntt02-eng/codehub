import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/mod5_dump.json', 'utf-8'));

console.log(`\n=== CHI TIẾT TỪNG LESSON TRONG MODULE 5 ===\n`);
for (const lesson of data) {
  console.log(`Lesson [${lesson.lessonId}] "${lesson.title}": ${lesson.exercises.length} bài`);
  let validCount = 0;
  let placeholderCount = 0;
  for (const ex of lesson.exercises) {
    const isPlaceholder = ex.solutionCode?.includes('In ra') || ex.solutionCode?.includes('val_0 = input()');
    if (isPlaceholder || !ex.solutionCode || ex.tcCount < 3) {
      placeholderCount++;
    } else {
      validCount++;
    }
  }
  console.log(`   - Chuẩn: ${validCount} bài | Cần cập nhật: ${placeholderCount} bài`);
}
