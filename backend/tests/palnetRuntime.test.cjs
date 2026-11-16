const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('crypto'),Module=require('module'),path=require('path');
process.env.ADAPTIVE_INTERNAL_SECRET=crypto.randomBytes(32).toString('hex');
process.env.TS_NODE_PROJECT=path.resolve(__dirname,'../tsconfig.json');
require('ts-node/register/transpile-only');
const {pythonContentVersion,pythonCodeHash,PYTHON_GRADING_EVIDENCE,trustedPythonFeedback}=require('../src/modules/onboarding/pythonModelEvidence');
const {planPythonBasicsRoadmap}=require('../src/modules/onboarding/roadmapPlanner');
const exercise={id:'e1',lessonId:'l1',title:'Source item',problemDescription:'frozen source',starterCode:null,
 testCases:[{id:'tc1',input:'1',expectedOutput:'1',isHidden:true}]};
const now=new Date(),ready=new Date(now.getTime()-1000),submitted=new Date(now.getTime()-2000);
const submission={id:'s1',userId:'owner',exerciseId:'e1',language:'PYTHON',status:'PASSED',code:'print(1)',submittedAt:submitted};
const event={id:'event1',sourceRecordId:'s1',sourceType:'COURSE_SUBMISSION',itemId:'e1',userId:'owner',
 language:'PYTHON',dataOrigin:'REAL',status:'PASSED',isCorrect:true,codeHash:pythonCodeHash(submission.code),
 contentVersion:pythonContentVersion(exercise),testsTotal:1,testsPassed:1,
 payload:{gradingContract:PYTHON_GRADING_EVIDENCE,feedbackReadyAt:ready.toISOString()}};
const feedback=e=>trustedPythonFeedback([e],[submission],[exercise],new Map([['l1','PY-BASICS-01']]),now);
test('versioned server grade accepted; hidden data stay behind fingerprint',()=>{
 const rows=feedback(event);assert.equal(rows.length,1);assert(!JSON.stringify(rows).includes('expectedOutput'));
});
test('changed testcase invalidates historical evidence',()=>{
 const changed=structuredClone(exercise);changed.testCases[0].expectedOutput='2';
 assert.notEqual(pythonContentVersion(changed),event.contentVersion);
 assert.equal(trustedPythonFeedback([event],[submission],[changed],new Map([['l1','PY-BASICS-01']]),now).length,0);
});
for(const [name,mutate] of [
 ['code hash mismatch',e=>e.codeHash='0'.repeat(64)],
 ['cross-user evidence',e=>e.userId='other'],
 ['synthetic event in real session',e=>e.dataOrigin='SYNTHETIC'],
 ['future feedback',e=>e.payload.feedbackReadyAt=new Date(now.getTime()+1).toISOString()],
 ['no testcase evidence',e=>e.testsTotal=0],
 ['PASS without all tests',e=>e.testsPassed=0],
 ['unversioned old grade',e=>e.contentVersion='legacy'],
]){
 test('reject '+name,()=>{const e=structuredClone(event);mutate(e);assert.equal(feedback(e).length,0);});
}
const lessons=[
 {lessonId:'intro',primarySkillId:'PY-BASICS-01',prerequisiteLessonIds:[],curriculumOrder:1},
 {lessonId:'math',primarySkillId:'PY-BASICS-03',prerequisiteLessonIds:['intro'],curriculumOrder:2},
 {lessonId:'string',primarySkillId:'PY-STRING-01',prerequisiteLessonIds:['intro'],curriculumOrder:3},
];
const advice={probabilities:{'PY-BASICS-01':.1,'PY-BASICS-03':.2,'PY-STRING-01':.8},
 modelVersion:'python70-r02-s20261102-advisory-v1',checkpointSha256:'db460b5c17a155e0bdd68d8c6a7c19eb23707c6d68957dad6ddcee03540af20a',
 historyCount:1,cutoff:now.toISOString(),inputSha256:'a'.repeat(64),fallback:null};
test('real model scores may change branch order, never prerequisites',()=>{
 const p=planPythonBasicsRoadmap(lessons,new Set(),{},advice);
 assert.deepEqual(p.map(x=>x.lesson.lessonId),['intro','string','math']);
 assert(p.every(x=>x.effectivePolicy==='PALNET_ADVISORY'));
});
test('incomplete or nonfinite model signal returns deterministic rules',()=>{
 const bad=structuredClone(advice);bad.probabilities['PY-STRING-01']=NaN;
 const p=planPythonBasicsRoadmap(lessons,new Set(),{},bad);
 assert.deepEqual(p.map(x=>x.lesson.lessonId),['intro','math','string']);
 assert(p.every(x=>x.effectivePolicy==='CURRICULUM_ORDER'));
});
const db={codingExercise:{findMany:async()=>[exercise]},learningInteraction:{findMany:async()=>[event]},
 submission:{findMany:async()=>[submission]}};
const originalLoad=Module._load;
Module._load=function(name,parent,isMain){
 const resolved=Module._resolveFilename(name,parent);
 if(String(resolved).replace(/\\/g,'/').endsWith('/infrastructure/database/prisma.ts'))return{prisma:db};
 return originalLoad.apply(this,arguments);
};
const {getPalnetAdvice}=require('../src/modules/onboarding/palnetRuntimeClient');
Module._load=originalLoad;
const {internalHeaders}=require('../src/modules/adaptive/adaptiveEvidence');
const catalog={graphVersion:'2.1',goalId:'GOAL_PY_BASICS',lessons:[{contentId:'l1',primarySkillId:'PY-BASICS-01'}]};
const originalFetch=global.fetch;
function response(body,change){
 const request=JSON.parse(body),value={status:'READY',request_id:request.request_id,user_id:request.user_id,
 input_sha256:crypto.createHash('sha256').update(body).digest('hex'),model_version:advice.modelVersion,
 feature_version:'python70-causal-feedback/1.0',policy_version:'palnet-correctness-order/1.0',graph_sha256:request.graph_sha256,
 evaluation_status:'SYNTHETIC_EXPLORATORY',checkpoint_sha256:advice.checkpointSha256,history_count:1,
 cutoff:request.cutoff,probabilities:{'PY-BASICS-01':.123}};
 if(change)change(value);
 const text=JSON.stringify(value);
 return new Response(text,{status:200,headers:internalHeaders(text)});
}
test('signed client binds exact request and records provenance',async()=>{
 try{global.fetch=async(_url,opts)=>response(opts.body);
 const a=await getPalnetAdvice('owner',catalog);assert.equal(a.modelVersion,advice.modelVersion);
 assert.equal(a.probabilities['PY-BASICS-01'],.123);assert.equal(a.inputSha256.length,64);
 }finally{global.fetch=originalFetch;}
});
test('cross-user signed reply is rejected',async()=>{
 try{global.fetch=async(_url,opts)=>response(opts.body,r=>r.user_id='other');
 assert.equal((await getPalnetAdvice('owner',catalog)).fallback,'MODEL_RESPONSE_CONTRACT_INVALID');
 }finally{global.fetch=originalFetch;}
});
test('unsigned response and outage fall back without blocking roadmap',async()=>{
 try{
 global.fetch=async()=>new Response('{}',{status:200});
 assert.equal((await getPalnetAdvice('owner',catalog)).fallback,'MODEL_RESPONSE_SIGNATURE_INVALID');
 global.fetch=async()=>{throw new Error('network unavailable')};
 assert.equal((await getPalnetAdvice('owner',catalog)).fallback,'MODEL_OR_HISTORY_UNAVAILABLE');
 }finally{global.fetch=originalFetch;}
});
test('feature disable switch avoids HTTP and history reads',async()=>{
 process.env.PALNET_RUNTIME_ENABLED='false';
 try{
 global.fetch=()=>{throw new Error('should not call')};
 assert.equal((await getPalnetAdvice('owner',catalog)).fallback,'MODEL_DISABLED');
 }finally{delete process.env.PALNET_RUNTIME_ENABLED;global.fetch=originalFetch;}
});

