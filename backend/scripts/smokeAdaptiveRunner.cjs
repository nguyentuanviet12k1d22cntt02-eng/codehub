// Real Docker smoke test, one language per invocation.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {runExercise}=require('../dist/modules/adaptive/adaptiveRunner');
const language=process.argv[2]||'python';
const output=path.resolve(__dirname,'../../reviews/ai-pipeline/'+language+'-docker-smoke.json');
const sources={
 python:'def helper(n):\n    return n * 2\ndef solution(n):\n    return helper(n)',
 javascript:'function solution(n) { return n * 2; }',
 cpp:'#include <iostream>\nint main(){int n;std::cin>>n;std::cout<<n*2;return 0;}',
 sql:'SELECT n * 2 FROM numbers ORDER BY n'
};
const execution={mode:language==='cpp'?'stdio':language==='sql'?'sql':'function',
 entrypoint:'solution',comparator:language==='cpp'?'text':'json',...(language==='sql'?{dialect:'sqlite',ordered:true}:{call_style_required:true})};
const specification={language,target_concept:'SMOKE',difficulty:'EASY',execution,required_constructs:[],forbidden_constructs:[]};
const draft={starter_code:'',reference_solution:sources[language],test_cases:[2,5,0,-3].map((n,i)=>({
 ...(language==='cpp'?{input:String(n)}:language==='sql'?{input:''}:{arguments:[n],call_style:'spread'}),
 expected_output:language==='sql'?JSON.stringify([[n*2]]):String(n*2),is_hidden:i>=2,category:i>=2?'boundary':'normal',
 explanation:'Real runner smoke fixture',...(language==='sql'?{fixture_sql:'CREATE TABLE numbers(n INTEGER); INSERT INTO numbers VALUES ('+n+');'}:{})
}))};
(async()=>{
 const result=await runExercise(draft,specification);
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify({kind:'REAL_DOCKER_SMOKE',created_at:new Date().toISOString(),language,result},null,2));
 console.log(JSON.stringify({language,passed:result.passed,cases:result.test_results.map(t=>({passed:t.passed,status:t.status,actual:t.actual,stderr:t.stderr.slice(0,300)})),report:output}));
 assert.equal(result.passed,true);
})().catch(e=>{console.error(e.message);process.exitCode=1;});
