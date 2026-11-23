#!/usr/bin/env node
// Fires N simultaneous submissions through the same queue and client the backend uses, then prints latency stats.
//   AWS_DOCKER_GRADER_URL=https://<host> AWS_DOCKER_GRADER_TOKEN=<token> node scripts/loadtest_grader.cjs [count] [PYTHON|CPP]
// Run `npm run build` first. It sends only small, harmless programs; it never touches the database.
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.SANDBOX_PROVIDER = 'AWS_DOCKER';
const { codeExecutionQueue } = require('../dist/infrastructure/queue/queueService');

const count = Math.max(1, Math.min(60, Number(process.argv[2]) || 30));
const language = (process.argv[3] || 'PYTHON').toUpperCase();
const programs = {
    PYTHON: 'n = int(input())\nprint(sum(i * i for i in range(n)))\n',
    CPP: '#include <iostream>\nint main(){long long n,s=0;std::cin>>n;for(long long i=0;i<n;i++)s+=i*i;std::cout<<s<<std::endl;}\n',
};
if (!programs[language]) { console.error('Language must be PYTHON or CPP'); process.exit(2); }

const pct = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];

(async () => {
    console.log(`Submitting ${count} ${language} jobs at once to ${process.env.AWS_DOCKER_GRADER_URL || '(URL not set)'}`);
    const started = Date.now();
    const outcomes = await Promise.all(Array.from({ length: count }, async (_, i) => {
        const t0 = Date.now();
        try {
            const results = await codeExecutionQueue.pushBatchJob(programs[language], language, ['1000', '2000', '3000']);
            const inputs = [1000, 2000, 3000];
            const expected = inputs.map(n => { let sum = 0; for (let x = 0; x < n; x++) sum += x * x; return String(sum); });
            const correct = results.every((r, k) => r.status === 'SUCCESS' && r.stdout.trim() === expected[k]);
            return { ok: correct, ms: Date.now() - t0, error: correct ? null : 'WRONG_OR_FAILED_RESULT' };
        } catch (error) {
            return { ok: false, ms: Date.now() - t0, error: String(error.message || error) };
        }
    }));
    const done = outcomes.filter(o => o.ok).map(o => o.ms).sort((a, b) => a - b);
    const errors = {};
    outcomes.filter(o => !o.ok).forEach(o => { errors[o.error] = (errors[o.error] || 0) + 1; });
    console.log(`Finished in ${((Date.now() - started) / 1000).toFixed(1)} s: ${done.length}/${count} correct`);
    if (done.length) console.log(`Latency  min ${done[0]} ms | median ${pct(done, 0.5)} ms | p90 ${pct(done, 0.9)} ms | max ${done[done.length - 1]} ms`);
    if (Object.keys(errors).length) console.log('Errors:', errors);
    process.exit(done.length === count ? 0 : 1);
})();
