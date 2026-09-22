// Real integration run: real providers, real Docker, real PostgreSQL. No test doubles.
require('dotenv').config({quiet:true});
const {prisma}=require('../dist/infrastructure/database/prisma');
const {getRun,learnerContext}=require('../dist/modules/adaptive/adaptiveRepository');
const {consumeSse}=require('../dist/modules/adaptive/sse');
const {randomUUID,randomBytes}=require('crypto');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const base=process.env.ADAPTIVE_TEST_URL||'http://127.0.0.1:3000';
const output=path.resolve(__dirname,'../../reviews/ai-pipeline');
const PIPELINE_STREAM_TIMEOUT_MS=340000;
const args=process.argv.slice(2);
const promptIndex=args.indexOf('--prompt-base64');
const customPrompt=promptIndex===-1?null:Buffer.from(args[promptIndex+1]||'', 'base64').toString('utf8');
const languages=args.filter((value,index)=>index!==promptIndex&&index!==promptIndex+1&&value!=='ui-fixture');
if(!languages.length) languages.push('python','javascript','cpp','sql');
if(customPrompt&&languages.length!==1) throw Error('--prompt-base64 requires exactly one language');
const summaryFile=languages.length===4?'live-summary.json':languages.join('-')+'-latest-summary.json';
const prompts={
python:'Tạo một bài tập Python mức dễ luyện vòng lặp while, bắt buộc dùng while, không dùng for và không dùng sum. Hàm solution nhận một số nguyên n từ 0 đến 100 và trả tổng từ 1 đến n.',
javascript:'Tạo bài tập JavaScript mức dễ về hàm. Hàm solution nhận mảng số nguyên và trả số phần tử dương, bao gồm tình huống mảng rỗng.',
cpp:'Tạo bài tập C++ mức dễ về vòng lặp while: nhập một số nguyên n từ 0 đến 100 và in tổng các số từ 1 đến n. Bắt buộc dùng while.',
sql:'Tạo bài tập SQL mức dễ về SELECT và WHERE: liệt kê tên học viên có điểm từ 8 trở lên. Dùng SQLite, kiểm tra cả dữ liệu rỗng và điểm bằng 8.'
};
let user,token;
async function api(url,body,method='POST'){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),70000);
 try {
  const response=await fetch(base+'/api/learning-path'+url,{method,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(method==='GET'?{}:{body:JSON.stringify(body)}),signal:controller.signal});
  return {status:response.status,data:await response.json()};
 } finally { clearTimeout(timer); }
}
async function main(){
 fs.mkdirSync(output,{recursive:true});
 const suffix=Date.now().toString(36),password=randomBytes(24).toString('hex');
 user=await prisma.user.create({data:{username:'pipeline_qa_'+suffix,email:'pipeline_qa_'+suffix+'@example.invalid',password:await bcrypt.hash(password,10)}});
 if(process.argv.includes('ui-fixture')) {
  fs.writeFileSync(path.join(output,'.env.local'),'QA_EMAIL='+user.email+'\nQA_PASSWORD='+password+'\n');
  console.log('Created isolated UI fixture. Credentials are in reviews/ai-pipeline/.env.local (gitignored).');return;
 }
 token=jwt.sign({id:user.id,username:user.username,role:'STUDENT'},process.env.JWT_SECRET,{expiresIn:'30m'});
 const summary={kind:'REAL_END_TO_END',started_at:new Date().toISOString(),fixture_user_id:user.id,runs:[]};
 for(const language of languages){
  let terminal;const events=[];
  console.log('Starting real pipeline: '+language);
  const streamController=new AbortController(),streamTimer=setTimeout(()=>streamController.abort(),PIPELINE_STREAM_TIMEOUT_MS);
  try {
  const response=await fetch(base+'/api/learning-path/chat/start-stream',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({goal:customPrompt||prompts[language],language}),signal:streamController.signal});
   assert.equal(response.status,200,'Chat stream HTTP');
   await consumeSse(response.body,async event=>{
    events.push(event);
    if(event.type==='agent_step'&&event.record.status!=='RUNNING') console.log(language+': '+event.record.agent+' '+event.record.status);
    if(event.type==='complete') terminal=event;
    if(event.type==='error') throw Error(event.error);
   });
  } finally { clearTimeout(streamTimer); }
  assert.ok(terminal,'SSE has terminal event');
  const traceId=terminal.pipeline.trace_id;
  const full=await getRun(traceId,user.id);
  fs.writeFileSync(path.join(output,language+'-live-report.json'),JSON.stringify(full.report,null,2));
  fs.writeFileSync(path.join(output,language+'-public-report.json'),JSON.stringify(terminal.pipeline,null,2));
  const item={language,trace_id:traceId,status:full.status,checks:{},model_calls:full.report.agent_traces.flatMap(r=>r.model_calls||[]).map(({provider,model,response_id,status,usage})=>({provider,model,response_id,status,usage}))};
  summary.runs.push(item);
  fs.writeFileSync(path.join(output,summaryFile),JSON.stringify(summary,null,2));
  if(full.status!=='SUCCEEDED'){item.error=full.report.error;console.log('Run failed: '+JSON.stringify(item.error));continue;}
  assert.equal(full.report.fallback_used,false);
  assert.ok(item.model_calls.filter(c=>c.status==='SUCCEEDED').length>=3);
  const ex=terminal.exercise;assert.ok(ex&&ex.exercise_id);
  assert.ok(!('reference_solution' in ex));
  assert.ok(!ex.test_cases.some(c=>c.is_hidden));
  const publicJson=JSON.stringify(terminal.pipeline);
  assert.ok(!publicJson.includes('"reference_solution"'));
  assert.ok(!publicJson.includes('"fixture_sql"'));
  item.checks.public_response_protects_answers=true;
  const report=await api('/adaptive/runs/'+traceId,undefined,'GET');assert.equal(report.status,200);
  const adminReport=await api('/adaptive/runs/'+traceId+'?full=true',undefined,'GET');assert.equal(adminReport.status,403);
  item.checks.persisted_report_and_role_check=true;
  const opened=await api('/adaptive/start-exercise',{exercise_id:ex.exercise_id,exercise:{reference_solution:'forged'}});
  assert.equal(opened.status,200,JSON.stringify(opened));
  const reopened=await api('/adaptive/start-exercise',{exercise_id:ex.exercise_id});
  assert.equal(reopened.data.pathId,opened.data.pathId);
  item.checks.publishing_is_idempotent_and_ignores_client_artifact=true;
  const detail=await api('/'+opened.data.pathId,undefined,'GET');assert.equal(detail.status,200);
  assert.ok(!JSON.stringify(detail.data).includes('"solutionCode"'));
  item.checks.lesson_does_not_leak_solution=true;
  const submissionId=randomUUID();
  const request={exerciseId:ex.exercise_id,submissionId,code:full.artifact.reference_solution};
  const grade=await api('/submit-exercise',request);
  assert.equal(grade.status,200,JSON.stringify(grade));assert.equal(grade.data.isPassed,true);
  const before=await learnerContext(user.id,full.session_id);
  const duplicate=await api('/submit-exercise',request);assert.equal(duplicate.status,200);
  const after=await learnerContext(user.id,full.session_id);
  assert.deepEqual(before.states,after.states);
  const newPass=await api('/submit-exercise',{...request,submissionId:randomUUID()});
  assert.equal(newPass.data.adaptiveFeedback.delta,0);
  const wrongCode={python:'def solution(n):\n    return -999',javascript:'function solution(a) { return -999; }',cpp:'#include <iostream>\nint main(){std::cout << -999;}',sql:'SELECT 999;'}[language];
  const wrong=await api('/submit-exercise',{...request,submissionId:randomUUID(),code:wrongCode});
  assert.equal(wrong.data.isPassed,false);assert.equal(wrong.data.adaptiveFeedback.delta,0);
  item.checks.real_submission_pass_wrong_answer_fail=true;
  item.checks.no_duplicate_mastery_increase=true;
  item.grading=grade.data;item.wrong_grading=wrong.data;
  fs.writeFileSync(path.join(output,language+'-grading.json'),JSON.stringify({correct:grade.data,duplicate:duplicate.data,repeated:newPass.data,wrong:wrong.data},null,2));
  console.log(language+': published and graded; duplicate mastery protected');
 }
 summary.ended_at=new Date().toISOString();
 summary.status=summary.runs.every(r=>r.status==='SUCCEEDED')?'PASSED':'FAILED';
 fs.writeFileSync(path.join(output,summaryFile),JSON.stringify(summary,null,2));
 console.log(JSON.stringify({status:summary.status,runs:summary.runs.map(({language,status,trace_id})=>({language,status,trace_id}))}));
 if(summary.status!=='PASSED')process.exitCode=1;
}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(async()=>{await prisma.$disconnect();});
