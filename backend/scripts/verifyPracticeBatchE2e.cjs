// Exercises the same authenticated API sequence as the learner UI, with an isolated QA account.
require('dotenv').config({quiet:true});
const assert=require('node:assert/strict');
const {randomBytes}=require('node:crypto');
const fs=require('node:fs'),path=require('node:path');
const jwt=require('jsonwebtoken'),bcrypt=require('bcryptjs');
const {prisma}=require('../dist/infrastructure/database/prisma');
const {consumeSse}=require('../dist/modules/adaptive/sse');
const {getRun}=require('../dist/modules/adaptive/adaptiveRepository');
const base=process.env.ADAPTIVE_TEST_URL||'http://127.0.0.1:3000';
const topic=process.env.ADAPTIVE_TEST_TOPIC||'Tập hợp duy nhất (Set) & Các phép toán tập hợp';
const summary={kind:'AUTHENTICATED_REAL_BATCH',expected:4,started_at:new Date().toISOString(),runs:[]};
const summaryPath=path.resolve(__dirname,'../../reviews/ai-pipeline/measurements/',
 process.env.ADAPTIVE_TEST_SUMMARY||'practice-batch-e2e-latest.json');
const save=()=>fs.writeFileSync(summaryPath,JSON.stringify(summary,null,2));
let token;
async function api(route,body){
 const response=await fetch(base+'/api/learning-path'+route,{method:body?'POST':'GET',
  headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
  ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(70000)});
 const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));return data;
}
async function send(body,index){
 const response=await fetch(base+'/api/learning-path/chat/reply-stream',{method:'POST',
  headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(body),signal:AbortSignal.timeout(340000)});
 assert.equal(response.status,200);let report;
 await consumeSse(response.body,async event=>{
  if(event.type==='agent_step'&&event.record?.status!=='RUNNING') console.log(JSON.stringify({index,agent:event.record.agent,status:event.record.status}));
  if(event.type==='complete')report=event.pipeline;
  if(event.type==='error')throw Error(event.error);
 });
 assert.ok(report,'Terminal SSE report');
 const deadline=Date.now()+20*60000;
 while(['WAITING_PROVIDER','RUNNING'].includes(report.status)&&Date.now()<deadline){
  await new Promise(resolve=>setTimeout(resolve,5000));
  report=(await api('/adaptive/runs/'+report.trace_id)).data;
 }
 summary.runs.push({index,trace_id:report.trace_id,status:report.status,title:report.exercise?.title,error:report.error});save();
 assert.equal(report.status,'SUCCEEDED',JSON.stringify(report.error));
 return report;
}
async function main(){
 const resume=process.argv.includes('--resume');
 if(resume) Object.assign(summary,JSON.parse(fs.readFileSync(summaryPath,'utf8')));
 const suffix=Date.now().toString(36);
 const user=resume
  ? await prisma.user.findUnique({where:{id:summary.fixture_user_id}})
  : await prisma.user.create({data:{username:'batch_qa_'+suffix,email:'batch_qa_'+suffix+'@example.invalid',password:await bcrypt.hash(randomBytes(32).toString('hex'),10)}});
 assert.ok(user?.username.startsWith('batch_qa_'),'Only an isolated QA account may be resumed');
 token=jwt.sign({id:user.id,username:user.username,role:'STUDENT'},process.env.JWT_SECRET,{expiresIn:'2h'});
 const originalRequest=`Tạo 4 bài ${topic} bằng Python`;
 const conceptId=process.env.ADAPTIVE_TEST_CONCEPT||'PY-SET-01';
 const session=resume
  ? await prisma.pathChatSession.findFirst({where:{id:summary.session_id,userId:user.id}})
  : await prisma.pathChatSession.create({data:{userId:user.id,initialGoal:originalRequest,messages:{create:[
  {sender:'USER',content:originalRequest},
  {sender:'AI_TUTOR',content:`Bạn muốn tiếp tục chủ đề ${topic}?`,metadata:{pendingConfirmation:{type:'PREREQUISITE_OVERRIDE',language:'python',target_concept_id:conceptId,exercise_count:4,original_user_request:originalRequest}}}
 ]}}});
 assert.ok(session,'QA session must exist');
 summary.fixture_user_id=user.id;summary.session_id=session.id;save();
 const previous=resume?await prisma.adaptiveGenerationRun.findMany({where:{sessionId:session.id,status:'SUCCEEDED'}}):[];
 const first=resume?previous.find(run=>run.traceId===summary.runs.find(item=>item.index===1)?.trace_id)?.report
  :await send({sessionId:session.id,content:`Vẫn tạo bài ${topic} cho tôi`},1);
 assert.ok(first?.exercise,'Verified first exercise required');
 assert.equal(first.exercise_count,4);
 const titles=[first.exercise.title];
 for(let index=2;index<=4;index++){
  const existing=previous.find(run=>run.request?.batch_parent_trace_id===first.trace_id
   && Number(run.request?.batch_index)===index)?.report;
  const next=existing||await send({sessionId:session.id,content:`Tạo 1 bài thực hành khác về ${topic} bằng python. Tránh trùng các bài đã tạo: ${titles.join('; ')}.`,batchParentTraceId:first.trace_id,batchIndex:index,target_concept_id:first.exercise.concept_id,language:first.exercise.language},index);
  if(existing&&!summary.runs.some(run=>run.index===index)){
   summary.runs.push({index,trace_id:next.trace_id,status:next.status,title:next.exercise?.title,error:next.error});save();
  }
  assert.equal(next.status,'SUCCEEDED',JSON.stringify(next.error));
  titles.push(next.exercise.title);
 }
 const published=await api('/adaptive/start-exercise',{exercise_id:first.exercise.exercise_id});
 assert.equal(published.exerciseCount,4);
 const detail=await api('/'+published.pathId);
 const lesson=detail.data.lessons.find(item=>item.practiceExercises?.length===4);
 assert.ok(lesson,'Practice tab receives all four exercises');
 assert.equal(new Set(lesson.practiceExercises.map(item=>item.id)).size,4);
 assert.ok(!JSON.stringify(detail).includes('reference_solution'));
 assert.ok(!JSON.stringify(detail).includes('solutionCode'));
 const chat=(await api('/chat/session/'+session.id)).session;
 assert.equal(chat.messages.filter(m=>m.metadata?.practiceBatch?.status==='READY').length,1,'One final response frame');
 assert.equal(chat.messages.filter(m=>m.sender==='AI_TUTOR').length,2,'Only seeded clarification plus one response, no continuation bubbles');
 summary.path_id=published.pathId;summary.exercise_count=lesson.practiceExercises.length;
 summary.sandbox=[];
 for(const run of summary.runs){
  const full=await getRun(run.trace_id,user.id);
  const check=[...full.report.agent_traces].reverse().find(s=>s.agent==='SandboxValidator'&&s.output?.passed);
  const cases=check?.output?.test_results||[];
  assert.ok(cases.length>0&&cases.every(c=>c.executed&&c.passed&&c.image==='aws-docker'));
  summary.sandbox.push({trace_id:run.trace_id,passed:cases.length,provider:'aws-docker'});
 }
 summary.status='PASSED';summary.ended_at=new Date().toISOString();save();
 console.log(JSON.stringify(summary));
}
async function cleanup(){
 const prior=JSON.parse(fs.readFileSync(summaryPath,'utf8'));
 assert.equal(prior.kind,'AUTHENTICATED_REAL_BATCH');
 assert.equal(prior.status,'PASSED');
 const user=await prisma.user.findUnique({where:{id:prior.fixture_user_id},select:{id:true,username:true}});
 const path=await prisma.personalizedPath.findUnique({where:{id:prior.path_id},select:{userId:true}});
 assert.ok(user?.username.startsWith('batch_qa_'));
 assert.equal(path?.userId,user.id);
 await prisma.user.delete({where:{id:user.id}});
 console.log('Removed isolated QA account and its generated practice path.');
}
(process.argv.includes('--cleanup')?cleanup():main())
 .catch(e=>{if(!process.argv.includes('--cleanup')){summary.status='FAILED';summary.error=e.message;save();}console.error(e.message);process.exitCode=1;})
 .finally(()=>prisma.$disconnect());
