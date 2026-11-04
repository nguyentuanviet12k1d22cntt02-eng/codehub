// Actual authenticated Express route -> signed client -> FastAPI R03, with an in-memory DB fixture.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),net=require('node:net'),{spawn}=require('node:child_process');
process.env.ADAPTIVE_INTERNAL_SECRET=crypto.randomBytes(32).toString('hex');process.env.JWT_SECRET=crypto.randomBytes(32).toString('hex');process.env.PALNET_MODULE_PRACTICE_ENABLED='true';process.env.PALNET_MODULE_PRACTICE_MODULES='';
const f=require('./palnetP4Fixtures.cjs'),express=require('express'),jwt=require('jsonwebtoken');
const {authenticateToken}=require('../src/shared/middleware/auth');
const {practicePools,selectPractice}=require('../src/modules/courses/pythonModulePracticePolicy');
const {loadPracticeSelectionSnapshot}=require('../src/modules/courses/pythonModulePracticeSnapshot');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function freePort(){const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;await new Promise(r=>s.close(r));return p;}
async function main(){
 const aiPort=await freePort();process.env.AI_SERVICE_URL=`http://127.0.0.1:${aiPort}`;
 const child=spawn(process.env.PYTHON||'python',['-m','uvicorn','scripts.palnet_p3_server:app','--host','127.0.0.1','--port',String(aiPort),'--no-access-log','--log-level','error'],{cwd:path.join(f.root,'ai-service'),env:{...process.env,OMP_NUM_THREADS:'2',MKL_NUM_THREADS:'2'},windowsHide:true,stdio:'ignore'});
 let childError;child.on('error',e=>childError=e);let server;const originalFetch=global.fetch;
 try{
  let ready=false;for(let i=0;i<200;i++){if(childError||child.exitCode!==null)throw Error('LOCAL_AI_START_FAILED');try{const r=await originalFetch(process.env.AI_SERVICE_URL+'/health',{signal:AbortSignal.timeout(500)});if(r.ok&&(await r.json()).module_practice_r03.available){ready=true;break;}}catch{}await wait(100);}assert(ready,'LOCAL_AI_NOT_READY');
  const db=f.fakeDB();const {getModulePracticeRecommendation}=f.loadController(db),app=express();
  app.get('/api/courses/module-practice/:id/recommendation',authenticateToken,getModulePracticeRecommendation);app.use((_err,_req,res,_next)=>res.status(500).json({code:'TEST_SERVER_ERROR'}));
  server=await new Promise(r=>{const s=app.listen(0,'127.0.0.1',()=>r(s));});const base=`http://127.0.0.1:${server.address().port}`;
  const token=jwt.sign({...f.principal,username:'SYNTHETIC_P4_NOT_PERSISTED'},process.env.JWT_SECRET,{expiresIn:'5m'});let calls=0,lastScores;
  global.fetch=async(url,opts)=>{const u=new URL(url);if(u.pathname==='/local-pilot/module-practice/score')throw Error('OLD_PYTHON_PILOT_USED');const response=await originalFetch(url,opts);if(u.pathname==='/internal/palnet/predict'){calls++;lastScores=(await response.clone().json()).probabilities;}return response;};
  const get=async bank=>{const r=await originalFetch(base+'/api/courses/module-practice/'+encodeURIComponent(bank.bank_id)+'/recommendation',{headers:{Authorization:'Bearer '+token}});assert.equal(r.status,200);return r.json();};
  const banks=[];
  for(const bank of f.release.banks){
   const row=f.release.rows.find(r=>r.bank_id===bank.bank_id);db.add(row);
   const d=await get(bank);assert.equal(d.mode,'PALNET_ADVISORY');assert.equal(d.modelVersion,f.release.pins.model_version);assert.equal(d.reason,'FIRST_OPPORTUNITY_MODEL_RANKED');assert.equal(d.predictedCorrectness,lastScores[d.skillId]);assert.notEqual(d.exerciseId,row.exercise_id);
   const snapshot=await loadPracticeSelectionSnapshot(db,f.principal,bank),pools=practicePools(snapshot.items,snapshot.attempts),a=f.advice(snapshot.history,Object.keys(lastScores),d.decisionId);a.probabilities=lastScores;const expected=selectPractice(pools,f.release,a,'x');assert.equal(d.exerciseId,expected.candidate.id);assert.equal(d.contentVersion,expected.candidate.contentVersion);
   banks.push({module:bank.module_code,bank:bank.bank_code,mode:d.mode,exerciseId:d.exerciseId,skillId:d.skillId,predictedCorrectness:d.predictedCorrectness});
  }
  const bank=f.release.banks.at(-1),before=await get(bank);db.add(f.release.rows.find(r=>r.exercise_id===before.exerciseId),{status:'PASSED'});const after=await get(bank);assert.notEqual(after.exerciseId,before.exerciseId);assert.notEqual(after.historyRevision,before.historyRevision);assert.notEqual(after.selectionRevision,before.selectionRevision);
  for(const row of f.release.rows.filter(r=>r.bank_id===bank.bank_id))db.add(row,{status:'PASSED'});let d=await get(bank);assert.equal(d.mode,'COMPLETE');assert.equal(d.exerciseId,null);
  db.state.events=[];db.state.subs=[];const one=f.release.banks[0];for(const row of f.release.rows.filter(r=>r.bank_id===one.bank_id))db.add(row);const callsBeforeRetry=calls;d=await get(one);assert.equal(d.mode,'RULE_BASED');assert.equal(d.reason,'RETRY_RULE');assert.equal(d.predictedCorrectness,null);assert.equal(calls,callsBeforeRetry);
  db.state.events=[];db.state.subs=[];d=await get(one);assert.equal(d.reason,'COLD_START');assert.equal(calls,callsBeforeRetry);
  assert.equal((await originalFetch(base+'/api/courses/module-practice/'+one.bank_id+'/recommendation')).status,401);
  const result={status:'PASS',transport:'JWT-authenticated Express route -> production controller/service -> signed Node client -> loopback FastAPI -> actual R03 checkpoint',modules:8,banks,inferenceCalls:calls,currentPassRefresh:true,complete:true,retryRuleWithoutInference:true,coldStartWithoutInference:true,missingAuthenticationStatus:401,database:'in-memory synthetic fixture',databaseWrites:0,externalCalls:0,fullApplicationStartupTested:false};
  fs.writeFileSync(path.join(f.root,'reviews/palnet-p4-2026-11-03/http-smoke.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{global.fetch=originalFetch;if(server)await new Promise(r=>server.close(r));if(child.exitCode===null){child.kill();await Promise.race([new Promise(r=>child.once('exit',r)),wait(2000)]);}}
}
main().catch(e=>{console.error('P4_LOCAL_HTTP_FAILED: '+e.message);process.exitCode=1;});
