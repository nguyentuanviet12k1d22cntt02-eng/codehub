import * as fs from 'fs';

const problems = JSON.parse(fs.readFileSync('scripts/mod2_problems.json', 'utf-8'));

for (let i = 0; i < problems.length; i++) {
  const p = problems[i];
  console.log(`\n========================================`);
  console.log(`[${i + 1}/30] ID: ${p.id} | Title: "${p.title}"`);
  console.log(`Desc: ${p.problemDescription.replace(/\n\n+/g, '\n').slice(0, 300)}...`);
  console.log(`TC count: ${p.testCases.length}`);
  for (let j = 0; j < Math.min(2, p.testCases.length); j++) {
    console.log(`  TC ${j + 1}: In=${JSON.stringify(p.testCases[j].input)} -> Exp=${JSON.stringify(p.testCases[j].expectedOutput)}`);
  }
}
