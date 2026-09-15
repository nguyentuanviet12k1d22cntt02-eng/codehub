import * as fs from 'fs';

const problems = JSON.parse(fs.readFileSync('scripts/mod3_problems.json', 'utf-8'));
let out = '';

for (let i = 0; i < problems.length; i++) {
  const p = problems[i];
  out += `\n======================================================\n`;
  out += `[${i + 1}/30] Lesson: ${p.lessonId} | Title: "${p.title}" | Diff: ${p.difficulty}\n`;
  out += `--- PROBLEM DESCRIPTION ---\n`;
  out += p.problemDescription + '\n';
  out += `--- TEST CASES (${p.testCases.length}) ---\n`;
  for (let j = 0; j < p.testCases.length; j++) {
    const tc = p.testCases[j];
    out += `  TC ${j + 1} (Hidden: ${tc.isHidden}): Input=${JSON.stringify(tc.input)} -> Expected=${JSON.stringify(tc.expectedOutput)}\n`;
  }
}

fs.writeFileSync('scripts/mod3_full_dump.txt', out, 'utf-8');
console.log('Saved mod3_full_dump.txt');
