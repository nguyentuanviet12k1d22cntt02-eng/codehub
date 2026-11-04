const test=require('node:test'),assert=require('node:assert/strict');
const f=require('./palnetP4Fixtures.cjs');
const {getPythonModulePracticeDecision}=require('../src/modules/courses/pythonModulePracticeService');
const {modulePracticeRefreshHint}=require('../src/modules/courses/modulePracticeRefresh');

test('non-Python/unmapped submissions have no refresh hint; mapped hint contains no learner or code',()=>{
 assert.equal(modulePracticeRefreshHint('CPP',f.release.banks[0].bank_id,'s'),null);assert.equal(modulePracticeRefreshHint('PYTHON','unmapped','s'),null);
 const h=modulePracticeRefreshHint('PYTHON',f.release.banks[0].bank_id,'synthetic-submission');assert.equal(h.refreshRequired,true);assert.equal(h.bankId,f.release.banks[0].bank_id);assert(!JSON.stringify(h).includes(f.principal.id));
});
for(const passed of [true,false])test('real submit controller refresh hint and subsequent decision only after '+(passed?'PASS':'FAILED')+' transaction commits',async()=>{
 process.env.PALNET_MODULE_PRACTICE_ENABLED='false';
 const db=f.fakeDB();db.state.cutoff=new Date(Date.now()+60000).toISOString();const item=f.release.rows[0],exercise=db.state.ex[0],sourceCode=exercise.solutionCode;
 db.codingExercise={findUnique:async()=>exercise};db.submission={count:async()=>1,findMany:async()=>[]};
 let commit,entered,stagedSub,stagedEvent;
 const gate=new Promise(r=>commit=r),enteredPromise=new Promise(r=>entered=r),readTransaction=db.$transaction;
 db.$transaction=async(fn,options)=>{
  if(options)return readTransaction(fn,options);
  const tx={submission:{create:async q=>{stagedSub={...q.data,id:'synthetic-committed-submission',submittedAt:new Date()};return stagedSub;}},learningInteraction:{updateMany:async q=>{stagedEvent=q.data;return {count:1};}},lessonProgress:{upsert:async()=>({})}};
  const result=await fn(tx);entered();await gate;
  db.state.subs.push(stagedSub);db.state.events.push({id:'synthetic-committed-event',sourceType:'COURSE_SUBMISSION',sourceRecordId:stagedSub.id,userId:f.principal.id,language:'PYTHON',dataOrigin:'REAL',itemId:item.exercise_id,status:stagedSub.status,isCorrect:passed,submittedAt:stagedSub.submittedAt,courseId:item.course_id,lessonId:item.bank_id,...stagedEvent});return result;
 };
 const {submitExercise}=f.loadController(db,'../src/modules/exercises/exerciseController',{
  '/infrastructure/queue/queueService.ts':{codeExecutionQueue:{pushBatchJob:async()=>exercise.testCases.map(t=>({status:'SUCCESS',stdout:passed?t.expectedOutput:'deliberate unit mismatch',stderr:'',runtimeMs:5}))}},
  '/infrastructure/analysis/staticCodeAnalyzer.ts':{StaticCodeAnalyzer:{analyze:()=>({isValid:true,error:null,warnings:[]})}},
  '/modules/exercises/exercise.service.ts':{exerciseService:{}}
 });
 const res=f.response();let error;const submitting=submitExercise({params:{id:item.exercise_id},user:f.principal,body:{code:sourceCode}},res,e=>error=e);
 await enteredPromise;assert.equal(res.body,null);assert.equal(db.state.events.length,0);
 const before=await getPythonModulePracticeDecision(db,f.principal,db.state.lessons[0]);assert.equal(before.firstOpportunityCount,30);
 commit();await submitting;assert.equal(error,undefined);assert.equal(res.code,200);assert.equal(res.body.allPassed,passed);assert.equal(res.body.recommendationRefresh.refreshRequired,true);assert.equal(res.body.recommendationRefresh.submissionId,'synthetic-committed-submission');assert.equal(res.body.recommendationRefresh.contentVersion,stagedEvent.contentVersion);
 const after=await getPythonModulePracticeDecision(db,f.principal,db.state.lessons[0]);assert.equal(after.firstOpportunityCount,29);assert.notEqual(after.historyRevision,before.historyRevision);assert.notEqual(after.selectionRevision,before.selectionRevision);assert.notEqual(after.exerciseId,item.exercise_id);if(passed)assert.equal(after.passedCount,1);else assert.equal(after.retryCount,1);
 delete process.env.PALNET_MODULE_PRACTICE_ENABLED;
});
