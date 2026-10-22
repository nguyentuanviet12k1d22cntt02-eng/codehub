// Harmless backend diagnostic. Never prints the signing secret or submitted source.
require('dotenv').config({path: require('path').join(__dirname, '..', '.env'), quiet: true});
const {internalHeaders} = require('../dist/modules/adaptive/adaptiveEvidence');

const base = (process.env.PROBE_BACKEND_URL || 'https://codehub-backend-nmr4.onrender.com').replace(/\/$/, '');
const javascript = process.env.PROBE_LANGUAGE === 'javascript';
const sql = process.env.PROBE_LANGUAGE === 'sql';
const body = JSON.stringify({
    specification: {
        language: sql ? 'sql' : javascript ? 'javascript' : 'python',
        target_concept: sql ? 'SQL-SELECT-01' : javascript ? 'JS-ARRAY-HOF-01' : 'PY-DICT-01', difficulty: 'EASY',
        execution: sql ? {mode: 'sql', comparator: 'json', dialect: 'sqlite', ordered: true}
            : {mode: 'function', entrypoint: 'solution', comparator: 'json', call_style_required: true},
        required_constructs: [], forbidden_constructs: []
    },
    exercise: {
        reference_solution: sql ? 'SELECT n FROM numbers WHERE n > 1 ORDER BY n'
            : javascript ? 'function solution(numbers) { return numbers.filter(n => n % 2 === 0).map(n => n * 2).reduce((sum, n) => sum + n, 0); }'
                : 'def solution(n): return n + 1', starter_code: '',
        test_cases: Array.from({length: 4}, () => ({
            ...(sql ? {input: '', fixture_sql: 'CREATE TABLE numbers(n INTEGER); INSERT INTO numbers VALUES (1),(2),(3);'}
                : {arguments: javascript ? [[1, 2, 3, 4]] : [2], call_style: 'spread'}),
            expected_output: sql ? '[[2],[3]]' : javascript ? '12' : '3',
            is_hidden: true, category: 'normal', explanation: 'probe'
        }))
    }
});

(async () => {
    const response = await fetch(base + '/api/internal/adaptive/validate', {
        method: 'POST', headers: internalHeaders(body), body, signal: AbortSignal.timeout(90000)
    });
    const result = await response.json();
    const sandboxVerified = result.passed === true && result.test_results?.length === 4
        && result.test_results.every(item => item.passed === true && item.executed === true && item.image === 'aws-docker');
    console.log(JSON.stringify({language: sql ? 'sql' : javascript ? 'javascript' : 'python', http: response.status, status: result.status,
        passed: result.passed, sandbox_verified: sandboxVerified, errors: result.errors,
        cases: result.test_results?.map(item => ({status: item.status, executed: item.executed,
            image: item.image, stderr: item.stderr?.slice(0, 160)}))}, null, 2));
    if (!response.ok || !sandboxVerified) process.exitCode = 1;
})().catch(error => {console.error(error.name + ': ' + error.message); process.exitCode = 1;});
