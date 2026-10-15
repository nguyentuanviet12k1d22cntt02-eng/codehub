// Harmless production diagnostic. Never prints the signing secret or submitted source.
require('dotenv').config({path: require('path').join(__dirname, '..', '.env'), quiet: true});
const {internalHeaders} = require('../dist/modules/adaptive/adaptiveEvidence');

const base = (process.env.PROBE_BACKEND_URL || 'https://codehub-backend-nmr4.onrender.com').replace(/\/$/, '');
const body = JSON.stringify({
    specification: {
        language: 'python', target_concept: 'PY-DICT-01', difficulty: 'EASY',
        execution: {mode: 'function', entrypoint: 'solution', comparator: 'json', call_style_required: true},
        required_constructs: [], forbidden_constructs: []
    },
    exercise: {
        reference_solution: 'def solution(n): return n + 1', starter_code: '',
        test_cases: Array.from({length: 4}, () => ({
            arguments: [2], call_style: 'spread', expected_output: '3',
            is_hidden: true, category: 'normal', explanation: 'probe'
        }))
    }
});

(async () => {
    const response = await fetch(base + '/api/internal/adaptive/validate', {
        method: 'POST', headers: internalHeaders(body), body, signal: AbortSignal.timeout(90000)
    });
    const result = await response.json();
    console.log(JSON.stringify({http: response.status, status: result.status,
        passed: result.passed, errors: result.errors,
        cases: result.test_results?.map(item => ({status: item.status, executed: item.executed,
            image: item.image, stderr: item.stderr?.slice(0, 160)}))}, null, 2));
    if (!response.ok || result.passed !== true) process.exitCode = 1;
})().catch(error => {console.error(error.name + ': ' + error.message); process.exitCode = 1;});
