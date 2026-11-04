// Explicit integration smoke, not a unit runner. Only loopback and synthetic fixtures.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),net=require('node:net'),{spawn}=require('node:child_process'),Module=require('node:module');
process.env.ADAPTIVE_INTERNAL_SECRET=crypto.randomBytes(32).toString('hex');
process.env.PALNET_MODULE_PRACTICE_ENABLED='true';process.env.PALNET_MODULE_PRACTICE_MODULES='';process.env.PALNET_RUNTIME_ENABLED='true';
const {root,release,snapshot,evidence,owner}=require('./palnetModuleFixtures.cjs');
const {requestModulePracticeAdvice}=require('../src/modules/onboarding/palnetModuleClient');
const {signedPalnetExchange}=require('../src/modules/onboarding/palnetTransport');
const F=JSON.parse(fs.readFileSync(path.join(root,'reviews/palnet-p3-2026-11-03/parity-fixtures.json'),'utf8'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function freePort(){const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;await new Promise(r=>s.close(r));return p;}
function body(c,summary=true){const context=release.banks[0],targets=[...new Set(release.rows.filter(r=>r.bank_id===context.bank_id).map(r=>r.skill_id))];return JSON.stringify({schema_version:'palnet-advisory-request/2.0',request_id:crypto.randomUUID(),user_id:owner,language:'PYTHON',context,...release.pins,cutoff:F.cutoff,catalog_revision:release.catalog_revision,history_revision:c.historyRevision,target_skill_ids:targets,[summary?'summary':'history']:summary?c.summary:c.history});}
async function main(){
 const port=await freePort();process.env.AI_SERVICE_URL=`http://127.0.0.1:${port}`;
 const child=spawn(process.env.PYTHON||'python',['-m','uvicorn','scripts.palnet_p3_server:app','--host','127.0.0.1','--port',String(port),'--no-access-log','--log-level','error'],{cwd:path.join(root,'ai-service'),env:{...process.env,OMP_NUM_THREADS:'2',MKL_NUM_THREADS:'2'},windowsHide:true,stdio:['ignore','ignore','pipe']});
 let childError=null;child.on('error',e=>{childError=e;});let stderr='';child.stderr.on('data',b=>{stderr=(stderr+b.toString()).slice(-2000);});
 try{
  let ready=false;for(let i=0;i<200;i++){if(childError)throw Error('LOCAL_PYTHON_START_FAILED');if(child.exitCode!==null)throw Error('LOCAL_PYTHON_EXITED');try{const res=await fetch(process.env.AI_SERVICE_URL+'/health',{signal:AbortSignal.timeout(500)});if(res.ok&&(await res.json()).module_practice_r03.available){ready=true;break;}}catch{}await wait(100);}assert(ready,'LOCAL_R03_NOT_READY');
  const banks=[];for(const context of release.banks){const targets=[...new Set(release.rows.filter(r=>r.bank_id===context.bank_id).map(r=>r.skill_id))],advice=await requestModulePracticeAdvice(snapshot(80,context),targets);assert.equal(advice.fallback,null);assert.equal(advice.modelVersion,release.pins.model_version);assert.equal(Object.keys(advice.probabilities).length,targets.length);banks.push({module:context.module_code,bank:context.bank_code,targetSkills:targets.length});}
  const lengths=[];for(const c of F.cases){const sum=await signedPalnetExchange(body(c),5000);assert.equal(sum.fallback,null);assert.equal(sum.result.history_count,c.summary.history_count);assert.equal(sum.result.source_event_count,c.n);assert.equal(sum.result.status,c.n?'READY':'FALLBACK');if(c.n<=2000){const raw=await signedPalnetExchange(body(c,false),5000);assert.equal(raw.fallback,null);assert.deepEqual(raw.result.probabilities,sum.result.probabilities);}lengths.push(c.n);}
  assert.equal((await fetch(process.env.AI_SERVICE_URL+'/internal/palnet/predict',{method:'POST',body:'{}'})).status,401);
  // Import the real compatibility adapter with a fixture-only DB; no connection to application DB.
  const e=evidence(1),now=Date.now();e.submissions[0].submittedAt=new Date(now-2000);e.events[0].submittedAt=e.submissions[0].submittedAt;e.events[0].payload.feedbackReadyAt=new Date(now-1000).toISOString();
  const db={codingExercise:{findMany:async()=>e.ex},learningInteraction:{findMany:async()=>e.events},submission:{findMany:async()=>e.submissions}};
  const original=Module._load;let getPalnetAdvice;
  try{Module._load=function(name,parent,isMain){const resolved=Module._resolveFilename(name,parent);if(String(resolved).replace(/\\/g,'/').endsWith('/infrastructure/database/prisma.ts'))return{prisma:db};return original.apply(this,arguments);};({getPalnetAdvice}=require('../src/modules/onboarding/palnetRuntimeClient'));}finally{Module._load=original;}
  const old=await getPalnetAdvice(owner,{goalId:'GOAL_PY_BASICS',graphVersion:'2.1',lessons:[{contentId:release.rows[0].bank_id,primarySkillId:release.rows[0].skill_id}]});assert.equal(old.fallback,null);assert.equal(old.modelVersion,'python70-r01-s20261102-advisory-v1');
  const result={status:'PASS',transport:'Node signed client -> loopback HTTP -> FastAPI production router -> real checkpoint',modules:8,banks,lengths,rawSummaryHttpParity:[0,1,2000],longSummaryHttp:[2001,10000],unsignedRequestStatus:401,roadmapV1RealCheckpoint:true,syntheticFixtures:true,databaseWrites:0,externalAiCalls:0};
  fs.writeFileSync(path.join(root,'reviews/palnet-p3-2026-11-03/http-smoke.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{if(child.exitCode===null){child.kill();await Promise.race([new Promise(r=>child.once('exit',r)),wait(2000)]);}}
}
main().catch(e=>{console.error('P3_LOCAL_HTTP_SMOKE_FAILED: '+e.message);process.exitCode=1;});
