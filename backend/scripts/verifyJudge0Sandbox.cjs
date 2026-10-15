// Run manually after setting SANDBOX_PROVIDER=judge0. Uses only harmless code.
const {SandboxService} = require('../dist/infrastructure/sandbox/sandbox.service');
const {runExercise} = require('../dist/modules/adaptive/adaptiveRunner');

if (process.env.SANDBOX_PROVIDER?.toLowerCase() !== 'judge0') {
    throw new Error('Set SANDBOX_PROVIDER=judge0 before running this check.');
}

const cases = [
    {language:'python', mode:'function', code:'def solution(n): return n + 1',
        test:{arguments:[2], call_style:'spread'}, expected:'3', comparator:'json'},
    {language:'javascript', mode:'function', code:'function solution(n) { return n + 1; }',
        test:{arguments:[2], call_style:'spread'}, expected:'3', comparator:'json'},
    {language:'python', mode:'stdio', code:'print(int(input()) + 1)',
        test:{input:'2\n'}, expected:'3', comparator:'text'},
    {language:'javascript', mode:'stdio', code:"const fs = require('fs'); console.log(Number(fs.readFileSync(0, 'utf8')) + 1);",
        test:{input:'2\n'}, expected:'3', comparator:'text'},
    {language:'cpp', mode:'stdio', code:'#include <iostream>\nint main() { int n; std::cin >> n; std::cout << n + 1; }',
        test:{input:'2\n'}, expected:'3', comparator:'text'},
    {language:'sql', mode:'sql', code:'SELECT value FROM numbers;',
        test:{input:'', fixture_sql:'CREATE TABLE numbers (value INTEGER); INSERT INTO numbers VALUES (3);'},
        expected:'[[3]]', comparator:'json'}
];

(async () => {
    const sandbox = new SandboxService();
    for (const item of cases) {
        const spec = {language:item.language, target_concept:'SMOKE-CHECK', difficulty:'EASY',
            execution:{mode:item.mode, entrypoint:'solution', comparator:item.comparator,
                ...(item.language==='sql' ? {dialect:'sqlite', ordered:true} : {})},
            required_constructs:[], forbidden_constructs:[]};
        const draft = {reference_solution:item.code, starter_code:'',
            test_cases:Array.from({length:4},()=>({
                ...item.test, expected_output:item.expected, is_hidden:true,
                category:'normal', explanation:'smoke check'
            }))};
        const qc = await runExercise(draft,spec);
        console.log(`AI ${item.language}: ${qc.status}, ${qc.test_results.length}/4 cases, passed=${qc.passed}`);
        if (!qc.passed) {
            console.error(qc.errors || qc.error, qc.test_results.map(t=>({status:t.status,stderr:t.stderr})));
            process.exitCode=1;
        }
    }
    const regular = await sandbox.execute('print(7)', 'PYTHON', {timeoutMs:3000});
    console.log(`Regular python: ${regular.status}, stdout=${regular.stdout.trim()}`);
    if (regular.status!=='SUCCESS' || regular.stdout.trim()!=='7') process.exitCode=1;
})().catch(error=>{console.error(error.message);process.exitCode=1;});
