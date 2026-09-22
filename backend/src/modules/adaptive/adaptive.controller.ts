import { Response } from 'express';
import { randomUUID, createHash } from 'crypto';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import { internalHeaders, publicCase, publicExercise, publicRecord, publicReport, sanitizeLegacy } from './adaptiveEvidence';
import { createRun, deferRun, finishRun, getRun, getRunForExercise, learnerContext, reserveSubmission, saveStage, storeGrading } from './adaptiveRepository';
import { runExercise } from './adaptiveRunner';
import { consumeSse } from './sse';

const idSchema=z.string().uuid();
const sessionsRunning=new Set<string>();
const retryableProviderCodes=new Set(['PROVIDER_TIMEOUT','PROVIDER_NETWORK_ERROR','PROVIDER_SERVER_ERROR','PROVIDER_RATE_LIMITED','PROVIDER_DEADLINE_EXCEEDED','PROVIDER_RESPONSE_INVALID','PROVIDER_COOLDOWN','PROVIDER_FULL_POOL_OUTAGE','STAGE_BUDGET_EXHAUSTED','RUN_DEADLINE_EXCEEDED']);
export const isRetryableProviderFailure=(code?:string)=>Boolean(code&&retryableProviderCodes.has(code));
export const providerRetryDelay=(error:any,retryCount=0)=>{
    const requested=Number(error?.details?.retry_after_seconds);
    const exponential=Math.min(300,30*(retryCount+1));
    return Number.isFinite(requested)&&requested>0?Math.min(300,Math.max(exponential,Math.floor(requested))):exponential;
};
// The AI service permits a 300-second real-provider run. Leave a small
// transport margin so the backend can receive and persist its final SSE frame.
export const upstreamPipelineTimeoutMs=330000;

async function chat(req:AuthenticatedRequest,res:Response,isStart:boolean,stream:boolean,autoPublish=false) {
    const userId=req.user!.id;
    let traceId:string|undefined,session:any,report:any,userMessage:any;
    const send=(value:any)=>{if(!res.destroyed)res.write('data: '+JSON.stringify(value)+'\n\n');};
    const abort=new AbortController();
    try {
        const content=z.string().trim().min(1).max(6000).parse(isStart ? req.body.goal : req.body.content);
        if(isStart) session=await prisma.pathChatSession.create({data:{userId,initialGoal:content},include:{messages:true}});
        else {
            const sessionId=idSchema.parse(req.body.sessionId);
            session=await prisma.pathChatSession.findFirst({where:{id:sessionId,userId},include:{messages:{orderBy:{createdAt:'desc'},take:20}}});
            if(!session){res.status(404).json({success:false,error:'Không tìm thấy phiên chat'});return;}
        }
        if(!isStart) session.messages.reverse();
        if(sessionsRunning.has(session.id)){res.status(409).json({success:false,error:'Phiên này đang xử lý một yêu cầu'});return;}
        sessionsRunning.add(session.id);
        userMessage=await prisma.pathChatMessage.create({data:{sessionId:session.id,sender:'USER',content}});
        traceId='trace_'+randomUUID().replace(/-/g,'');
        const context=await learnerContext(userId,session.id,req.body.language);
        const request={user_id:userId,session_id:session.id,trace_id:traceId,
            messages:[...session.messages,userMessage].slice(-20).map((m:any)=>({sender:m.sender,content:m.content})),
            language:req.body.language||context.language||'python',target_concept_id:req.body.target_concept_id||null,learner_context:context,
            run_attempt:1,sequence_offset:0};
        await createRun(traceId,userId,session.id,request);
        if(stream) {
            res.setHeader('Content-Type','text/event-stream');res.setHeader('Cache-Control','no-cache');res.setHeader('X-Accel-Buffering','no');res.flushHeaders();
            send({type:'session_created',sessionId:session.id,trace_id:traceId});
        }
        const body=JSON.stringify(request);
        const timer=setTimeout(()=>abort.abort(),upstreamPipelineTimeoutMs);
        try {
            const upstream=await fetch((process.env.AI_SERVICE_URL||'http://127.0.0.1:8000')+'/pal-net/adaptive-tutor-agent/stream',
                {method:'POST',headers:internalHeaders(body),body,signal:abort.signal});
            if(!upstream.ok||!upstream.body) throw Error('AI_SERVICE_HTTP_'+upstream.status);
            await consumeSse(upstream.body,async event=>{
                if(event.type==='agent_step' && event.record) {
                    await saveStage(traceId!,event.record);
                    if(stream)send({...event,record:publicRecord(event.record)});
                } else if(event.type==='complete') report=event.data;
                else if(event.type==='error') throw Error(event.error||'AI_STREAM_FAILED');
            });
            if(!report || report.trace_id!==traceId) throw Error('AI_STREAM_INCOMPLETE');
            // No artifact may enter storage without a genuine completed publication gate.
            if(report.exercise && (report.status!=='SUCCEEDED' || !report.agent_traces?.some((s:any)=>s.agent==='PublicationGate'&&s.status==='SUCCEEDED'&&s.output?.approved===true))) throw Error('PUBLICATION_GATE_MISSING');
            if (isRetryableProviderFailure(report.error?.code)) {
                report={...report,status:'WAITING_PROVIDER',reply:'Provider tạm thời chưa trả được kết quả hợp lệ. Yêu cầu được giữ lại để tự thử lại; chưa có bài nào được phát hành.'};
                await deferRun(traceId,report,providerRetryDelay(report.error,0));
            } else await finishRun(traceId,report);
        } finally { clearTimeout(timer); }
    } catch(error:any) {
        if(!traceId || !session) {
            res.status(error instanceof z.ZodError?400:503).json({success:false,error:error instanceof z.ZodError?'Yêu cầu không hợp lệ':'Không khởi tạo được pipeline'});
            return;
        }
        const saved=await getRun(traceId,userId);
        report={trace_id:traceId,schema_version:'4.0',status:'FAILED',exercise:null,agent_traces:saved?.report?.agent_traces||[],
            reply:'Kết nối pipeline dừng trước khi hoàn thành. Các bước đã chạy được lưu trong báo cáo.',error:{code:error.name==='AbortError'?'RUN_DEADLINE_EXCEEDED':'TRANSPORT_OR_STORAGE_ERROR',message:error.message},fallback_used:false};
        await finishRun(traceId,report);
    } finally {
        if(session) sessionsRunning.delete(session.id);
    }
    if(!report || !session) return;
    const safe=publicReport(report);
    const aiMessage=await prisma.pathChatMessage.create({data:{sessionId:session.id,sender:'AI_TUTOR',content:safe.reply,
        metadata:{intent:safe.intent,pipeline:{trace_id:safe.trace_id,status:safe.status,schema_version:safe.schema_version,error:safe.error},
            agentTraces:safe.agent_traces,exercise:safe.exercise,suggestedOptions:safe.suggested_options||[],step:safe.exercise?'EXERCISE_READY':'CHAT'}}});
    const payload={type:'complete',success:true,sessionId:session.id,userMessage,aiMessage,
        ...(isStart?{messages:[userMessage,aiMessage]}:{}),pipeline:safe,exercise:safe.exercise};
    if(autoPublish && report.exercise) {
        const run=await getRun(traceId!,userId);
        const published=await publishRun(run,userId);
        res.json({success:true,data:{id:published.pathId},...published,trace_id:traceId});
    } else if(autoPublish) res.status(422).json({success:false,error:'PIPELINE_NOT_APPROVED',pipeline:safe});
    else if(stream){send(payload);res.end();} else res.json(payload);
}

export const startChat=(req:AuthenticatedRequest,res:Response)=>chat(req,res,true,false).catch(()=>{if(!res.headersSent)res.status(503).json({success:false,error:'STORAGE_UNAVAILABLE'});else res.end();});
export const replyChat=(req:AuthenticatedRequest,res:Response)=>chat(req,res,false,false).catch(()=>{if(!res.headersSent)res.status(503).json({success:false,error:'STORAGE_UNAVAILABLE'});else res.end();});
export const startChatStream=(req:AuthenticatedRequest,res:Response)=>chat(req,res,true,true).catch(()=>{if(!res.headersSent)res.status(503).json({success:false,error:'STORAGE_UNAVAILABLE'});else {res.write('data: {"type":"error","error":"STORAGE_UNAVAILABLE"}\n\n');res.end();}});
export const replyChatStream=(req:AuthenticatedRequest,res:Response)=>chat(req,res,false,true).catch(()=>{if(!res.headersSent)res.status(503).json({success:false,error:'STORAGE_UNAVAILABLE'});else {res.write('data: {"type":"error","error":"STORAGE_UNAVAILABLE"}\n\n');res.end();}});

export async function reportRun(req:AuthenticatedRequest,res:Response) {
    try {
        const row=await getRun(String(req.params.traceId),req.user!.id);
        if(!row){res.status(404).json({error:'REPORT_NOT_FOUND'});return;}
        const full=req.query.full==='true';
        if(full) {
            const user=await prisma.user.findUnique({where:{id:req.user!.id},select:{role:true}});
            if(user?.role!=='ADMIN'){res.status(403).json({error:'ADMIN_REPORT_REQUIRED'});return;}
        }
        const report={...row.report,trace_id:row.trace_id,status:row.status};
        res.json({success:true,data:full?report:publicReport(report)});
    } catch {res.status(503).json({error:'REPORT_STORAGE_UNAVAILABLE'});}
}

async function publishRun(run:any,userId:string) {
    const exerciseId=run.exercise_id;
    return prisma.$transaction(async tx=>{
            const locked:any[]=await tx.$queryRawUnsafe('SELECT path_id FROM adaptive_generation_runs WHERE trace_id=$1 FOR UPDATE',run.trace_id);
            if(locked[0].path_id) return {pathId:locked[0].path_id,exerciseId};
            const ex=run.artifact;
            const path=await tx.personalizedPath.create({data:{userId:userId,title:ex.title,description:ex.quick_theory,
                targetSkills:[ex.concept_id],palNetAvgScore:ex.spec_snapshot?.learner_evidence?.mastery??0,
                lessons:{create:{title:ex.title,orderIndex:1,targetSkillId:ex.concept_id,theoryContent:ex.theoryContent,
                    exercise:{create:{id:exerciseId,title:ex.title,difficulty:ex.difficulty==='CHALLENGE'?'HARD':ex.difficulty,
                        problemDescription:ex.problem_statement,starterCode:ex.starter_code,solutionCode:ex.reference_solution,language:ex.language.toUpperCase(),qcStatus:'VERIFIED',
                        testCases:{create:ex.test_cases.map((t:any)=>({input:t.input ?? JSON.stringify(t.arguments),expectedOutput:t.expected_output,isHidden:t.is_hidden}))}}}}}}});
            await tx.$executeRawUnsafe('UPDATE adaptive_generation_runs SET path_id=$2::uuid WHERE trace_id=$1',run.trace_id,path.id);
            await tx.pathChatSession.updateMany({where:{id:run.session_id,userId:userId},data:{createdPathId:path.id}});
            return {pathId:path.id,exerciseId};
        });
}

export async function startExercise(req:AuthenticatedRequest,res:Response) {
    try {
        const exerciseId=idSchema.parse(req.body.exercise_id);
        const run=await getRunForExercise(exerciseId,req.user!.id);
        if(!run||run.status!=='SUCCEEDED'||run.artifact?.qc_status!=='VERIFIED'){res.status(409).json({success:false,error:'Bài tập chưa được kiểm định'});return;}
        const output=await publishRun(run,req.user!.id);
        res.json({success:true,...output});
    } catch(error:any){res.status(error instanceof z.ZodError?400:500).json({success:false,error:'Không mở được bài từ bản đã kiểm định'});}
}

function publicGrading(stored:any) {
    const results=(stored.test_results||[]).map((tc:any)=>{
        const safe=publicCase(tc);
        return {...safe,testCaseId:String(tc.case_index),input:tc.is_hidden?'Hidden':tc.input,expectedOutput:tc.is_hidden?'Hidden':tc.expected,
            actualOutput:tc.is_hidden?(tc.passed?'Passed':'Mismatch'):tc.actual,errorMessage:tc.is_hidden?undefined:tc.stderr};
    });
    const passed=results.filter((r:any)=>r.passed).length;
    return {success:stored.status!=='INFRA_ERROR',isPassed:stored.passed===true,passedCases:passed,totalCases:results.length,
        score:results.length?Math.round(passed/results.length*100):0,results,status:stored.status,
        adaptiveFeedback:stored.mastery_event,submission_id:stored.submission_id,error:stored.status==='INFRA_ERROR'?'SANDBOX_UNAVAILABLE':undefined};
}

export async function submitExercise(req:AuthenticatedRequest,res:Response) {
    let id:string|undefined,run:any,reserved=false;
    try {
        id=idSchema.parse(req.body.submissionId);
        const exerciseId=idSchema.parse(req.body.exerciseId),code=z.string().min(1).max(20000).parse(req.body.code);
        run=await getRunForExercise(exerciseId,req.user!.id);
        if(!run) {res.status(409).json({success:false,error:'Bài cũ chưa có đặc tả kiểm định V3; hãy tạo bài mới'});return;}
        if(!run.path_id || run.status!=='SUCCEEDED') {res.status(409).json({success:false,error:'EXERCISE_NOT_PUBLISHED'});return;}
        const existing=await reserveSubmission(id,req.user!.id,run,code,createHash('sha256').update(code).digest('hex'));
        if(existing) {
            if(existing.status==='RUNNING'){res.status(409).json({success:false,error:'SUBMISSION_IN_PROGRESS'});return;}
            res.json(publicGrading(existing.result));return;
        }
        reserved=true;
        const execution=await runExercise(run.artifact,run.artifact.spec_snapshot,code);
        const result=await storeGrading(id,req.user!.id,run,{...execution,submission_id:id});
        if(result.passed) await prisma.personalizedLesson.updateMany({where:{pathId:run.path_id},data:{isCompleted:true}});
        res.status(result.status==='INFRA_ERROR'?503:200).json(publicGrading(result));
    } catch(error:any) {
        if(id&&run&&reserved) await storeGrading(id,req.user!.id,run,{passed:false,status:'INFRA_ERROR',test_results:[],submission_id:id,error:'GRADING_INTERRUPTED'}).catch(()=>{});
        res.status(error instanceof z.ZodError?400:409).json({success:false,error:error.message==='SUBMISSION_ID_CONFLICT'?'SUBMISSION_ID_CONFLICT':'GRADING_UNAVAILABLE'});
    }
}

export const retiredMastery=(_req:AuthenticatedRequest,res:Response)=>{res.status(410).json({success:false,error:'Năng lực được cập nhật từ kết quả nộp bài trên server'});};
export const generatePath=(req:AuthenticatedRequest,res:Response)=>{
    req.body.goal=req.body.goal||'Tạo bài tập khởi đầu cho lộ trình học '+(req.body.language||'Python');
    return chat(req,res,true,false,true).catch(()=>{if(!res.headersSent)res.status(503).json({success:false,error:'PIPELINE_UNAVAILABLE'});});
};
export async function confirmPath(req:AuthenticatedRequest,res:Response) {
    try {
        const sessionId=idSchema.parse(req.body.sessionId);
        const rows:any[]=await prisma.$queryRawUnsafe("SELECT * FROM adaptive_generation_runs WHERE user_id=$1::uuid AND session_id=$2::uuid AND status='SUCCEEDED' AND artifact IS NOT NULL ORDER BY created_at DESC LIMIT 1",req.user!.id,sessionId);
        if(!rows[0]){res.status(409).json({success:false,error:'Chưa có bài đã kiểm định trong phiên này'});return;}
        const output=await publishRun(rows[0],req.user!.id);
        res.json({success:true,data:{id:output.pathId},...output});
    } catch {res.status(400).json({success:false,error:'Không xác nhận được bài học'});}
}

export async function getSession(req:AuthenticatedRequest,res:Response) {
    const session=await prisma.pathChatSession.findFirst({where:{id:String(req.params.sessionId),userId:req.user!.id},include:{messages:{orderBy:{createdAt:'asc'}}}});
    if(!session){res.status(404).json({success:false});return;}
    res.json({success:true,session:sanitizeLegacy(session)});
}
