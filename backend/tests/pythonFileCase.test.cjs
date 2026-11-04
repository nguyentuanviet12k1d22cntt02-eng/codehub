const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
process.env.TS_NODE_PROJECT=path.resolve(__dirname,'../tsconfig.json');require('ts-node/register/transpile-only');
process.env.SANDBOX_PROVIDER='AWS_DOCKER';
const {parsePythonFileCase,preparePythonFileExecution}=require('../src/infrastructure/sandbox/pythonFileCase');
const client=require('../src/infrastructure/sandbox/aws-docker/docker-grader.client');
const {SandboxService}=require('../src/infrastructure/sandbox/sandbox.service');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const repairs=read('reviews/palnet-content-repair-2026-11-03/repairs.json'),prior=read('reviews/palnet-content-repair-2026-11-03/all-208.before.json');
const {exercisesData}=require('../prisma/seed/exercises_data');
const envelope=(overrides={})=>JSON.stringify({__pythonFileCase:'1.0',stdin:'',files:{'in.txt':'data\n'},expectedFiles:{'out.txt':'result\n'},preserveInputFiles:true,...overrides});
const row=key=>repairs.find(r=>r.sourceKey===key).seed;

test('canonical seed changes exactly 30 IDs; other 178 items and all identities remain intact',()=>{
 const scope=Object.fromEntries(Object.entries(exercisesData).filter(([key])=>/^LS-0[1-8]\.MP/.test(key))),changed=[];
 for(const [bank,items]of Object.entries(prior)){
  assert.equal(scope[bank].length,items.length);
  items.forEach((old,i)=>{assert.equal(scope[bank][i].id,old.id);if(JSON.stringify(old)!==JSON.stringify(scope[bank][i]))changed.push(old.id);});
 }
 assert.equal(changed.length,30);assert.deepEqual(new Set(changed),new Set(repairs.map(r=>r.exerciseId)));
 for(const r of repairs)assert.deepEqual(scope[r.sourceKey.split(':')[0]].find(e=>e.id===r.exerciseId),r.seed);
});
test('regression cases distinguish fractional money, near boundaries, whitespace, pair order and ATM branches',()=>{
 assert.ok(row('LS-01.MP:027').testCases.some(t=>t.expectedOutput==='0.06\n'));
 assert.ok(row('LS-02.MP:013').testCases.some(t=>t.input==='89.5\n'&&t.expectedOutput==='Giỏi\n'));
 assert.ok(row('LS-02.MP:018').testCases.some(t=>t.input==='4.0\n5\nTrue\n'&&t.expectedOutput.includes('Từ chối')));
 assert.ok(row('LS-05.MP:022').testCases.some(t=>t.input==='5 2 3 0\n5\n'&&t.expectedOutput==='(2, 3)\n(0, 5)\n'));
 assert.ok(row('LS-07.MP:007').testCases.some(t=>t.input==='11000000\n'&&t.expectedOutput==='Số dư không đủ\n'));
 for(const k of ['LS-04.MP:001','LS-04.MP:003','LS-04.MP:006','LS-04.MP:007','LS-04.MP:009','LS-04.MP:012']){assert.ok(!row(k).solutionCode.includes('.strip()'));assert.ok(row(k).testCases.some(t=>t.input.startsWith(' ')));}
});
test('11 file exercises have varying/empty fixtures and actual artifact expectations; readonly refs do not create fixtures',()=>{
 const fileRows=repairs.filter(r=>parsePythonFileCase(r.seed.testCases[0].input));assert.equal(fileRows.length,11);
 let writing=0;for(const r of fileRows){assert.ok(r.seed.testCases.length>=2);for(const t of r.seed.testCases){const c=parsePythonFileCase(t.input);assert.equal(c.stdin,'');assert.equal(c.preserveInputFiles,true);}if(Object.keys(parsePythonFileCase(r.seed.testCases[0].input).expectedFiles).length)writing++;}
 assert.equal(writing,5);assert.equal(parsePythonFileCase(row('LS-08.MP:001').testCases[0].input).files['doc.txt'],'Học lập trình Python cơ bản cùng với MCode\n');
 for(const k of ['LS-08.MP:001','LS-08.MP:003','LS-08.MP:004','LS-08.MP:005','LS-08.MP:012','LS-08.MP:025'])assert.ok(!row(k).solutionCode.includes('"w"'));
});
test('file parser leaves normal stdin unchanged and rejects invalid schema/unknown version/traversal/absolute paths',()=>{
 for(const s of ['abc\n','{"files":{"a.txt":"x"}}','{"note":"ordinary json"}'])assert.equal(parsePythonFileCase(s),null);
 for(const s of [envelope({__pythonFileCase:'2.0'}),envelope({extra:true}),envelope({stdin:10}),envelope({preserveInputFiles:false}),'{"__pythonFileCase":'])assert.throws(()=>parsePythonFileCase(s));
 for(const name of ['../x.txt','/x.txt','C:\\x.txt','sub/x.txt','.hidden.txt','x.txt/../../z'])assert.throws(()=>parsePythonFileCase(envelope({files:{[name]:'x'}})));
});
test('file envelope bounds input, number of files and bytes including multibyte unicode',()=>{
 assert.throws(()=>parsePythonFileCase(envelope({stdin:'x'.repeat(16001)})));
 assert.throws(()=>parsePythonFileCase(envelope({files:{'a.txt':'ế'.repeat(6000)}})));
 assert.throws(()=>parsePythonFileCase(envelope({files:Object.fromEntries(Array.from({length:9},(_,i)=>[i+'.txt','']))})));
});
test('prepared payload carries source as data and supplies a fixed runner; source is never run on host',()=>{
 const code='raise RuntimeError("must not run on host")\n',p=preparePythonFileExecution(code,envelope(),5000),value=JSON.parse(p.input);
 assert.equal(value.code,code);assert.equal(value.timeoutSeconds,4.75);assert.equal(value.fileCase.expectedFiles['out.txt'],'result\n');assert.ok(p.code.includes('subprocess.run'));assert.ok(p.code.includes('path.is_symlink()'));
 assert.equal(preparePythonFileExecution(code,'plain input',5000),null);
 assert.throws(()=>preparePythonFileExecution('x'.repeat(50001),envelope(),5000));
});
test('normal Python and JavaScript batching retains original dispatch',async()=>{
 const old=client.executeAwsDockerBatch,calls=[];client.executeAwsDockerBatch=async(...a)=>{calls.push(a);return a[2].map(()=>({status:'SUCCESS',stdout:'',stderr:'',runtimeMs:1}));};
 try{const s=new SandboxService();await s.executeBatch('print(1)','PYTHON',['a','b'],{timeoutMs:2000});await s.executeBatch('console.log(1)','JAVASCRIPT',[envelope()],{timeoutMs:2000});assert.equal(calls.length,2);assert.deepEqual(calls[0].slice(0,3),['print(1)','PYTHON',['a','b']]);assert.equal(calls[1][1],'JAVASCRIPT');assert.equal(calls[1][0],'console.log(1)');}finally{client.executeAwsDockerBatch=old;}
});
test('file batch uses one input per request in order and single-run shares same wrapper',async()=>{
 const old=client.executeAwsDockerBatch,calls=[];client.executeAwsDockerBatch=async(...a)=>{calls.push(a);return [{status:'SUCCESS',stdout:'',stderr:'',runtimeMs:1}];};
 try{const s=new SandboxService();const a=envelope(),b=envelope({files:{'in.txt':'second'}});await s.executeBatch('pass','PYTHON',[a,b],{timeoutMs:2000});assert.equal(calls.length,2);assert.ok(calls.every(c=>c[2].length===1));assert.equal(JSON.parse(calls[1][2][0]).fileCase.files['in.txt'],'second');await s.execute('pass','PYTHON',{inputData:a,timeoutMs:2000});assert.equal(calls[0][0],calls[2][0]);}finally{client.executeAwsDockerBatch=old;}
});
test('invalid later file case cannot dispatch an earlier case',async()=>{
 const old=client.executeAwsDockerBatch;let count=0;client.executeAwsDockerBatch=async()=>{count++;return [];};
 try{await assert.rejects(new SandboxService().executeBatch('pass','PYTHON',[envelope(),envelope({files:{'../x.txt':'x'}})]));assert.equal(count,0);}finally{client.executeAwsDockerBatch=old;}
});
test('recursion keeps dedicated new skill graph; R01/R02 graph vocabulary remains 35',()=>{
 const old=read('backend/src/infrastructure/data/pythonSkillGraph.json'),next=read('backend/src/infrastructure/data/pythonSkillGraph.content-repair.v2.2.json');assert.equal(old.skills.length,35);assert.equal(next.skills.length,36);assert.deepEqual(next.skills.slice(0,35),old.skills);assert.ok(next.skills.some(s=>s.id==='PY-FUNC-07'));assert.ok(row('LS-07.MP:017').problemDescription.includes('"recursion"'));assert.ok(row('LS-08.MP:022').solutionCode.includes('class User:'));assert.ok(row('LS-08.MP:013').solutionCode.includes('def __init__(self, isbn, title, author)'));
});
