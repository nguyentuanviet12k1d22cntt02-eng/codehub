// Real authenticated workflow, isolated account, real model calls and EC2 Docker.
// --prepare creates only a QA fixture; --serve scopes the retry worker to that user.
require('dotenv').config({quiet:true});
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {randomBytes,randomUUID}=require('node:crypto');
const jwt=require('jsonwebtoken'),bcrypt=require('bcryptjs');
const {prisma}=require('../dist/infrastructure/database/prisma');
const repo=require('../dist/modules/adaptive/adaptiveRepository');
const {consumeSse}=require('../dist/modules/adaptive/sse');
const output=path.resolve(__dirname,'../../reviews/ai-pipeline/measurements/generation-reliability-2026-10-24.json');
const base='http://127.0.0.1:3001';
const topic='Vòng lặp for ... in range() & Duyệt phần tử';
let summary,token;
const save=()=>fs.writeFileSync(output,JSON.stringify(summary,null,2));
async function load(){
 summary=JSON.parse(fs.readFileSync(output,'utf8'));
 assert.equal(summary.kind,'GENERATION_RELIABILITY_QA');
 const user=await prisma.user.findUnique({where:{id:summary.fixture_user_id}});
 assert.ok(user?.username.startsWith('reliability_qa_'),'Never use a learner account');
 token=jwt.sign({id:user.id,username:user.username,role:'STUDENT'},process.env.JWT_SECRET,{expiresIn:'2h'});
 return user;
}
async function api(route,body){
 const response=await fetch(base+'/api/learning-path'+route,{method:body?'POST':'GET',
  headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
  ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(70000)});
 const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));return data;
}
async function send(body,index,start=false){
 const response=await fetch(base+'/api/learning-path/chat/'+(start?'start-stream':'reply-stream'),{
  method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
  body:JSON.stringify(body),signal:AbortSignal.timeout(340000)});
 assert.equal(response.status,200);let report;
 await consumeSse(response.body,async event=>{
  if(event.type==='session_created'){summary.session_id=event.sessionId;save();}
  if(event.type==='agent_step'&&event.record?.status!=='RUNNING')console.log(JSON.stringify({index,agent:event.record.agent,
   status:event.record.status,providers:event.record.model_calls?.map(c=>({provider:c.provider,status:c.status}))}));
  if(event.type==='complete')report=event.pipeline;
  if(event.type==='error')throw Error(event.error);
 });
 assert.ok(report,'Terminal SSE report required');
 return settle(report,index);
}
async function settle(report,index){
 const deadline=Date.now()+15*60000;
 while(['WAITING_PROVIDER','RUNNING'].includes(report.status)&&Date.now()<deadline){
  await new Promise(resolve=>setTimeout(resolve,5000));
  report=(await api('/adaptive/runs/'+report.trace_id)).data;
 }
 const receipt={index,trace_id:report.trace_id,status:report.status,error:report.error,
  title:report.exercise?.title,pending_type:report.pending_confirmation?.type};
 const previous=summary.turns.findIndex(item=>item.trace_id===report.trace_id);
 if(previous<0)summary.turns.push(receipt);else summary.turns[previous]=receipt;
 save();
 return report;
}
async function main(){
 await load();const resume=process.argv.includes('--resume');
 if(resume){
  if(summary.error)summary.feedback_attempts=[...(summary.feedback_attempts||[]),{
   at:summary.continued_at,status:'FAILED',error:summary.error}];
  summary.continued_at=new Date().toISOString();summary.status='RUNNING';delete summary.error;save();
 }
 else{
 if(summary.started_at)summary.previous_attempts=[...(summary.previous_attempts||[]),{
  started_at:summary.started_at,turns:summary.turns,status:summary.status,error:summary.error}];
 summary.started_at=new Date().toISOString();summary.status='RUNNING';summary.turns=[];delete summary.error;save();
 }
 let first;
 if(resume){
  assert.ok(summary.root_trace_id,'Resume requires a verified first exercise');
  first=await settle((await api('/adaptive/runs/'+summary.root_trace_id)).data,1);
 }else{
 const count=await send({goal:'Tạo bài tập vòng lặp for trong Python'},'clarify-count',true);
 assert.equal(count.status,'AWAITING_CONFIRMATION');
 assert.equal(count.pending_confirmation?.type,'EXERCISE_COUNT_SELECTION');
 assert.equal(count.exercise,null);
 const readiness=await send({sessionId:summary.session_id,content:'4 bài'},'confirm-count');
 assert.equal(readiness.pending_confirmation?.type,'PREREQUISITE_OVERRIDE');
 assert.equal(readiness.pending_confirmation?.language,'python');
 assert.equal(readiness.pending_confirmation?.exercise_count,4);
 assert.equal(readiness.pending_confirmation?.target_concept_id,'PY-FLOW-03');
 const override=readiness.suggested_options.find(text=>text.startsWith('Vẫn tạo bài'));
 assert.ok(override);
 first=await send({sessionId:summary.session_id,content:override},1);
 }
 assert.equal(first.status,'SUCCEEDED',JSON.stringify(first.error));
 assert.equal(first.exercise_count,4);summary.root_trace_id=first.trace_id;save();
 const titles=[first.exercise.title],reports=[first];
 for(let index=2;index<=4;index++){
  const existing=resume?await prisma.$queryRawUnsafe("SELECT trace_id FROM adaptive_generation_runs WHERE user_id=$1::uuid AND session_id=$2::uuid AND request->>'batch_parent_trace_id'=$3 AND request->>'batch_index'=$4 ORDER BY created_at DESC LIMIT 1",
   summary.fixture_user_id,summary.session_id,first.trace_id,String(index)):[];
  const next=existing[0]?await settle((await api('/adaptive/runs/'+existing[0].trace_id)).data,index):await send({sessionId:summary.session_id,
   content:`Tạo 1 bài thực hành khác về ${topic} bằng python. Tránh trùng các bài đã tạo: ${titles.join('; ')}.`,
   batchParentTraceId:first.trace_id,batchIndex:index,target_concept_id:first.exercise.concept_id,language:'python'},index);
  assert.equal(next.status,'SUCCEEDED',JSON.stringify(next.error));reports.push(next);titles.push(next.exercise.title);
 }
 const publish=await api('/adaptive/start-exercise',{exercise_id:first.exercise.exercise_id});
 assert.equal(publish.exerciseCount,4);summary.path_id=publish.pathId;save();
 const duplicate=await api('/adaptive/start-exercise',{exercise_id:first.exercise.exercise_id});
 assert.equal(duplicate.pathId,publish.pathId,'Publication must be idempotent');
 const detail=(await api('/'+publish.pathId)).data;
 const lesson=detail.lessons.find(item=>item.practiceExercises?.length===4);
 assert.ok(lesson,'Four exercises in the same practice tab');
 assert.equal(new Set(lesson.practiceExercises.map(item=>item.id)).size,4);
 assert.ok(!JSON.stringify(detail).includes('reference_solution'));
 assert.ok(!JSON.stringify(detail).includes('solutionCode'));
 const chat=(await api('/chat/session/'+summary.session_id)).session;
 assert.equal(chat.messages.filter(m=>m.metadata?.practiceBatch?.status==='READY').length,1);
 assert.equal(chat.messages.filter(m=>m.sender==='AI_TUTOR').length,3,'Two clarifications and one final batch, no continuation bubbles');
 summary.sandbox=[];
 for(const report of reports){
  const run=await repo.getRun(report.trace_id,summary.fixture_user_id);
  const check=[...run.report.agent_traces].reverse().find(s=>s.agent==='SandboxValidator'&&s.output?.passed);
  const cases=check?.output?.test_results||[];
  assert.ok(cases.length>=4&&cases.every(c=>c.executed&&c.passed&&c.image==='aws-docker'));
  assert.equal(run.artifact.concept_id,'PY-FLOW-03');
  assert.ok(run.artifact.spec_snapshot.required_constructs.includes('for'));
  assert.ok(run.artifact.spec_snapshot.forbidden_constructs.includes('while'));
  assert.ok(!/\bwhile\b|^\s*def\s/m.test(run.artifact.reference_solution));
  summary.sandbox.push({trace_id:run.trace_id,passed:cases.length,provider:'aws-docker',title:run.artifact.title,
   generation_calls:run.report.agent_traces.filter(s=>s.agent==='ExerciseGeneratorAgent').length});
 }
 // Verify both real grading and the separate AI assistant using the saved source/result.
 summary.generation_status='PASSED';summary.feedback_status='RUNNING';save();
 const wrong=await api('/submit-exercise',{submissionId:randomUUID(),exerciseId:first.exercise.exercise_id,
  code:'text = input()\nfor ch in text:\n    pass'});
 assert.equal(wrong.isPassed,false);assert.ok(wrong.submission_id);
 const wrongFeedback=await api('/practice-guidance',{submissionId:wrong.submission_id});
 assert.equal(wrongFeedback.guidance.source,'AI');
 const full=await repo.getRun(first.trace_id,summary.fixture_user_id);
 const correct=await api('/submit-exercise',{submissionId:randomUUID(),exerciseId:first.exercise.exercise_id,code:full.artifact.reference_solution});
 assert.equal(correct.isPassed,true);
 const correctFeedback=await api('/practice-guidance',{submissionId:correct.submission_id});
 assert.equal(correctFeedback.guidance.analysisKind,'success');
 assert.equal(correctFeedback.guidance.diagnostic,undefined);
 summary.practice_feedback={wrong:wrongFeedback.guidance,correct:correctFeedback.guidance};
 summary.feedback_status='PASSED';
 summary.exercise_count=lesson.practiceExercises.length;summary.status='PASSED';summary.ended_at=new Date().toISOString();save();
 console.log(JSON.stringify(summary));
}
async function prepare(){
 const suffix=Date.now().toString(36);
 const user=await prisma.user.create({data:{username:'reliability_qa_'+suffix,email:'reliability_qa_'+suffix+'@example.invalid',
  password:await bcrypt.hash(process.env.ADAPTIVE_TEST_PASSWORD||randomBytes(32).toString('hex'),10)}});
 summary={kind:'GENERATION_RELIABILITY_QA',fixture_user_id:user.id,fixture_email:user.email,turns:[],status:'PREPARED'};save();
 console.log(JSON.stringify({fixture_user_id:user.id,fixture_email:user.email}));
}
async function serve(){
 await load();
 // Runtime-only test isolation, never change the production worker or other users.
 repo.dueRetries=()=>prisma.$queryRawUnsafe("SELECT * FROM adaptive_generation_runs WHERE user_id=$1::uuid AND status='WAITING_PROVIDER' AND retry_count<3 AND next_attempt_at<=now() ORDER BY next_attempt_at LIMIT 2",summary.fixture_user_id);
 process.env.PORT='3001';process.env.AI_SERVICE_URL='http://127.0.0.1:8001';
 require('../dist/app');
}
const serving=process.argv.includes('--serve');
(serving?serve():process.argv.includes('--prepare')?prepare():main())
 .catch(error=>{if(summary&&!serving){summary.status='FAILED';summary.error=error.message;
  if(summary.feedback_status==='RUNNING')summary.feedback_status='FAILED';save();}console.error(error.message);process.exitCode=1;})
 .finally(async()=>{if(!serving){await prisma.$disconnect();process.exit(process.exitCode||0);}});
