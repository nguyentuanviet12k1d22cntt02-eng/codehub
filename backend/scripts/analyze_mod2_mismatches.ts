import * as fs from 'fs';

const problems = JSON.parse(fs.readFileSync('scripts/mod2_problems.json', 'utf-8'));

for (const p of problems) {
  console.log(`\n========================================`);
  console.log(`Title: "${p.title}"`);
  console.log(`StarterCode: ${p.starterCode || 'None'}`);
  console.log(`Constraints in desc: ${p.problemDescription.match(/<!-- CONSTRAINTS: (.*) -->/)?.[1] || 'None'}`);
  console.log(`First TC: Input=${JSON.stringify(p.testCases[0]?.input)} -> Expected=${JSON.stringify(p.testCases[0]?.expectedOutput)}`);
}
