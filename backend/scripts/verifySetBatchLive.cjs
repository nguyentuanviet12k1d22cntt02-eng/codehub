// Live verification through the signed local pipeline, real providers and EC2 sandbox.
// Never prints credentials, solution source or hidden-test contents.
require('dotenv').config({quiet:true});
const {randomUUID}=require('node:crypto');
const {internalHeaders,resumeCheckpoint}=require('../dist/modules/adaptive/adaptiveEvidence');
const {consumeSse}=require('../dist/modules/adaptive/sse');
const {isRetryableProviderFailure}=require('../dist/modules/adaptive/adaptive.controller');
const fs=require('node:fs');
const path=require('node:path');
async function main(){
 const summary=[];
 const total=Number(process.argv[2]||4);
 const topic='Tập hợp duy nhất (Set) & Các phép toán tập hợp';
 for(let index=1;index<=total;index++){
  let report;
  const request={user_id:randomUUID(),trace_id:'trace_qa_'+randomUUID().replaceAll('-',''),language:'python',
   target_concept_id:'PY-SET-01',messages:[{sender:'USER',content:`Vẫn tạo bài ${topic} cho tôi`}],
   learner_context:{language:'python',states:{},
    recent_exercises:summary.map(s=>({title:s.title,concept_id:'PY-SET-01'})),
    pending_confirmation:{type:'PREREQUISITE_OVERRIDE',language:'python',target_concept_id:'PY-SET-01',exercise_count:total,
     original_user_request:`Tạo ${total} bài tập Set bằng Python. Bài ${index}: luyện ${['giao','hợp','hiệu','hiệu đối xứng'][index-1]||'giao'} tập hợp; tránh lặp bài: ${summary.map(s=>s.title).join('; ')}`}}};
  for(let attempt=1;attempt<=3;attempt++){
   const body=JSON.stringify({...request,run_attempt:attempt,...(report?{resume_report:resumeCheckpoint(report)}:{})});
   const response=await fetch((process.env.AI_SERVICE_URL||'http://127.0.0.1:8000')+'/pal-net/adaptive-tutor-agent/stream',
    {method:'POST',headers:internalHeaders(body),body,signal:AbortSignal.timeout(335000)});
   if(!response.ok) throw Error('PIPELINE_HTTP_'+response.status);
   let next;
   await consumeSse(response.body,async event=>{
    if(event.type==='agent_step'&&event.record?.status!=='RUNNING') console.log(JSON.stringify({index,attempt,agent:event.record?.agent,status:event.record?.status,duration_ms:event.record?.duration_ms}));
    if(event.type==='complete') next=event.data;
    if(event.type==='error') throw Error(event.error);
   });
   if(!next) throw Error('NO_REPORT');
   report={...next,agent_traces:[...(report?.agent_traces||[]),...next.agent_traces]};
   if(!isRetryableProviderFailure(report.error?.code)) break;
  }
  const sandbox=[...report.agent_traces].reverse().find(s=>s.agent==='SandboxValidator'&&s.output?.passed);
  const cases=sandbox?.output?.test_results||[];
  summary.push({index,trace_id:report.trace_id,status:report.status,count:report.exercise_count,title:report.exercise?.title,
   error:report.error,passed_cases:cases.filter(c=>c.passed&&c.executed).length,total_cases:cases.length,
   providers:[...new Set(cases.map(c=>c.image))],
   publication_gate:report.agent_traces.some(s=>s.agent==='PublicationGate'&&s.output?.approved),
   critic:report.agent_traces.filter(s=>s.agent==='CriticEvaluatorAgent').map(s=>s.output)});
  fs.writeFileSync(path.resolve(__dirname,'../../reviews/ai-pipeline/measurements/set-batch-live-latest.json'),JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary.at(-1)));
  if(report.status!=='SUCCEEDED'){process.exitCode=1;break;}
 }
 console.log(JSON.stringify({completed:summary.filter(s=>s.status==='SUCCEEDED').length,expected:total}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
