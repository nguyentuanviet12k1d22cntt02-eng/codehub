import { Response } from 'express';
import { randomUUID, createHash } from 'crypto';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import { internalHeaders, mergeReviewReport, publicCase, publicExercise, publicRecord, publicReport, reviewCheckpoint, sanitizeLegacy } from './adaptiveEvidence';
import { claimReviewRun, createRun, deferRun, finishRetryRun, finishRun, getRun, getRunForExercise, getSubmissionForGuidance, learnerContext, reserveSubmission, saveStage, storeGrading } from './adaptiveRepository';
import { runExercise } from './adaptiveRunner';
import { consumeSse } from './sse';
import { getEvidenceBasedUserMastery } from '../recommendations/recommendationController';
import { AI_TUTOR_LOCKED_MESSAGE, getTutorAvailability } from '../ai-tutor/tutorAvailability';
import { awsDockerConfigurationReady } from '../../infrastructure/sandbox/aws-docker/docker-grader.client';
import { evidencePracticeGuidance, isGraderFailure, requestPracticeGuidance } from './practiceGuidance';

const idSchema=z.string().uuid();
const sessionsRunning=new Set<string>();
const retryableProviderCodes=new Set(['PROVIDER_TIMEOUT','PROVIDER_NETWORK_ERROR','PROVIDER_SERVER_ERROR','PROVIDER_RATE_LIMITED','PROVIDER_DEADLINE_EXCEEDED','PROVIDER_RESPONSE_INVALID','PROVIDER_COOLDOWN','PROVIDER_FULL_POOL_OUTAGE','STAGE_BUDGET_EXHAUSTED','RUN_DEADLINE_EXCEEDED','LLM_BUDGET_EXCEEDED','SANDBOX_BACKEND_TIMEOUT','SANDBOX_BACKEND_UNREACHABLE']);
export const isRetryableProviderFailure=(code?:string)=>Boolean(code&&retryableProviderCodes.has(code));
export const providerRetryDelay=(error:any,retryCount=0)=>{
    const requested=Number(error?.details?.retry_after_seconds);
    const exponential=Math.min(300,30*(retryCount+1));
    return Number.isFinite(requested)&&requested>0?Math.min(300,Math.max(exponential,Math.floor(requested))):exponential;
};
// The AI service permits a 300-second real-provider run. Leave a small
// transport margin so the backend can receive and persist its final SSE frame.
export const upstreamPipelineTimeoutMs=330000;

export function confirmedLanguageForReply(content:string,pending:any):string|undefined {
    if(!pending||typeof pending!=='object') return undefined;
    const answer=content.trim().toLocaleLowerCase('vi-VN').replace(/\s+/g,' ');
    if(pending.type==='ROUTING_CLARIFICATION')
        return ({python:'python',javascript:'javascript','c++':'cpp',cpp:'cpp',sql:'sql'} as Record<string,string>)[answer];
    if(pending.type==='LEARNING_MODE_SELECTION'&&['học lý thuyết','làm bài thực hành'].includes(answer)) {
        const language=String(pending.language||'').toLowerCase();
        if(['python','javascript','cpp','sql'].includes(language)) return language;
    }
    return undefined;
}

export function recoverLearningModeConfirmation(content:string,pending:any,messages:any[]):any|null {
    if(pending?.type!=='ROUTING_CLARIFICATION') return null;
    const choice=String(pending.original_user_request||'').trim().toLocaleLowerCase('vi-VN');
    if(!['học lý thuyết','làm bài thực hành'].includes(choice)) return null;
    const language=confirmedLanguageForReply(content,pending);
    if(!language) return null;
    const tutorMessages=messages.filter(message=>message.sender==='AI_TUTOR');
    const earlier=tutorMessages.at(-2)?.metadata?.pendingConfirmation;
    if(earlier?.type!=='LEARNING_MODE_SELECTION'||earlier.language!==language||!earlier.target_concept_id) return null;
    return {...earlier,resumed_mode_choice:choice};
}

export function confirmedSessionLanguage(messages:any[]):string|undefined {
    const valid=new Set(['python','javascript','cpp','sql']);
    for(const message of [...messages].reverse()) {
        if(message.sender!=='AI_TUTOR') continue;
        const metadata=message.metadata||{};
        const pending=metadata.pendingConfirmation;
        if(valid.has(pending?.language)) return pending.language;
        const records=Array.isArray(metadata.agentTraces)?metadata.agentTraces:[];
        const routing=[...records].reverse().find((record:any)=>record?.agent==='IntentRouterAgent'
            && record?.status==='SUCCEEDED'&&record?.output?.language_confirmed===true);
        if(valid.has(routing?.output?.language)) return routing.output.language;
        if(valid.has(metadata.exercise?.language)) return metadata.exercise.language;
    }
    return undefined;
}

export function validExerciseBatchContinuation(parent:any,sessionId:string,conceptId:string,language:string,index:number):boolean {
    const count=Number(parent?.report?.exercise_count);
    return Number.isInteger(index)&&index>=2&&index<=5
        && Number.isInteger(count)&&count>=index&&count<=5
        && parent?.session_id===sessionId&&parent?.status==='SUCCEEDED'
        && parent?.artifact?.concept_id===conceptId
        && parent?.artifact?.language===language;
}

async function chat(req:AuthenticatedRequest,res:Response,isStart:boolean,stream:boolean,autoPublish=false) {
    const userId=req.user!.id;
    let traceId:string|undefined,session:any,report:any,userMessage:any;
    let batchContinuation=false;
    let batchTotal:number|undefined;
    const send=(value:any)=>{if(!res.destroyed)res.write('data: '+JSON.stringify(value)+'\n\n');};
    const abort=new AbortController();
    try {
        const availability = await getTutorAvailability();
        if (!availability.enabled) {
            res.status(423).json({ success: false, error: 'AI_TUTOR_LOCKED', message: AI_TUTOR_LOCKED_MESSAGE });
            return;
        }
        const content=z.string().trim().min(1).max(6000).parse(isStart ? req.body.goal : req.body.content);
        if(isStart) session=await prisma.pathChatSession.create({data:{userId,initialGoal:content},include:{messages:true}});
        else {
            const sessionId=idSchema.parse(req.body.sessionId);
            session=await prisma.pathChatSession.findFirst({where:{id:sessionId,userId},include:{messages:{orderBy:{createdAt:'desc'},take:20}}});
            if(!session){res.status(404).json({success:false,error:'Không tìm thấy phiên chat'});return;}
        }
        if(!isStart) session.messages.reverse();
        const previousTutorMessage=[...(session.messages||[])].reverse().find((message:any)=>message.sender==='AI_TUTOR');
        if(previousTutorMessage?.metadata?.pipeline?.status==='AWAITING_AGENT_APPROVAL') {
            res.status(409).json({success:false,error:'PIPELINE_RESUMING',
                message:'Lượt xử lý trước đang được tiếp tục tự động. Hãy đợi hoàn tất rồi gửi yêu cầu mới.'});
            return;
        }
        if(sessionsRunning.has(session.id)){res.status(409).json({success:false,error:'Phiên này đang xử lý một yêu cầu'});return;}
        if(req.body.batchParentTraceId!==undefined) {
            const parentTrace=z.string().regex(/^trace_[A-Za-z0-9_-]{8,80}$/).parse(req.body.batchParentTraceId);
            const batchIndex=z.number().int().min(2).max(5).parse(req.body.batchIndex);
            const parent=await getRun(parentTrace,userId);
            batchContinuation=validExerciseBatchContinuation(parent,session.id,
                String(req.body.target_concept_id||''),String(req.body.language||''),batchIndex);
            if(!batchContinuation){res.status(400).json({success:false,error:'Lượt tạo bài tiếp theo không hợp lệ'});return;}
            batchTotal=Number(parent.report.exercise_count);
        }
        sessionsRunning.add(session.id);
        // Continuations are internal steps of one learner request, not new chat turns.
        userMessage=batchContinuation?{sender:'USER',content}:await prisma.pathChatMessage.create({data:{sessionId:session.id,sender:'USER',content}});
        traceId='trace_'+randomUUID().replace(/-/g,'');
        let pendingConfirmation=previousTutorMessage?.metadata?.pendingConfirmation;
        const previousPipeline=previousTutorMessage?.metadata?.pipeline;
        if(previousPipeline?.trace_id && ['WAITING_PROVIDER','RUNNING'].includes(previousPipeline.status)) {
            const completedRun=await getRun(previousPipeline.trace_id,userId);
            if(completedRun?.session_id===session.id && completedRun.status==='AWAITING_CONFIRMATION')
                pendingConfirmation=completedRun.report?.pending_confirmation||null;
        }
        const selectedLanguage=confirmedLanguageForReply(content,pendingConfirmation);
        pendingConfirmation=recoverLearningModeConfirmation(content,pendingConfirmation,session.messages)||pendingConfirmation;
        const confirmedLanguage=selectedLanguage||confirmedLanguageForReply(content,pendingConfirmation);
        const sessionLanguage=!confirmedLanguage&&!req.body.language?confirmedSessionLanguage(session.messages):undefined;
        const context:any=await learnerContext(userId,session.id,confirmedLanguage||req.body.language||sessionLanguage);
        if(sessionLanguage) context.language_source='previous';
        const masteryProfile=await getEvidenceBasedUserMastery(userId,context.language);
        context.states=masteryProfile.evidence||{};
        context.mastery_source='EVIDENCE_BASED_UNIFIED';
        context.mastery_stats=masteryProfile.stats;
        context.sandbox_configured=awsDockerConfigurationReady();
        if(pendingConfirmation?.target_concept_id||['ROUTING_CLARIFICATION','EXERCISE_COUNT_SELECTION'].includes(pendingConfirmation?.type)) context.pending_confirmation=pendingConfirmation;
        if(batchContinuation) {
            context.batch_continuation=true;
            context.batch_index=req.body.batchIndex;
            context.batch_total=batchTotal;
        }
        const request={user_id:userId,session_id:session.id,trace_id:traceId,
            messages:[...session.messages,userMessage].slice(-20).map((m:any)=>({sender:m.sender,content:m.content})),
            language:confirmedLanguage||req.body.language||(context.language_source==='default'?null:context.language),
            target_concept_id:req.body.target_concept_id||null,learner_context:context,
            run_attempt:1,sequence_offset:0,review_mode:false,
            ...(batchContinuation?{batch_parent_trace_id:req.body.batchParentTraceId,batch_index:req.body.batchIndex}:{} )};
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
    const isBatchParent=!batchContinuation&&safe.status==='SUCCEEDED'&&safe.exercise&&Number(safe.exercise_count)>1;
    const aiMessage=batchContinuation?null:await prisma.pathChatMessage.create({data:{sessionId:session.id,sender:'AI_TUTOR',
        content:isBatchParent?`Đang tạo ${safe.exercise_count} bài thực hành. Đã kiểm định bài 1/${safe.exercise_count}; hệ thống tiếp tục tự tạo các bài còn lại.`:safe.reply,
        metadata:{intent:safe.intent,pipeline:{trace_id:safe.trace_id,status:safe.status,schema_version:safe.schema_version,error:safe.error},
            agentTraces:safe.agent_traces,exercise:isBatchParent?null:safe.exercise,
            suggestedOptions:isBatchParent?[]:safe.suggested_options||[],
            practiceBatch:isBatchParent?{status:'GENERATING',expectedCount:Number(safe.exercise_count),completedCount:1,rootTraceId:safe.trace_id}:undefined,
            pendingConfirmation:safe.pending_confirmation||null,step:isBatchParent?'PRACTICE_BATCH':safe.exercise?'EXERCISE_READY':'CHAT'}}});
    const payload={type:'complete',success:true,sessionId:session.id,
        ...(batchContinuation?{}:{userMessage,aiMessage}),
        ...(isStart&&aiMessage?{messages:[userMessage,aiMessage]}:{}),pipeline:safe,exercise:safe.exercise};
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

export async function continueAgentReviewStream(req:AuthenticatedRequest,res:Response) {
    const send=(value:any)=>{if(!res.destroyed)res.write('data: '+JSON.stringify(value)+'\n\n');};
    let traceId:string|undefined,run:any,report:any;
    const abort=new AbortController();
    try {
        const availability=await getTutorAvailability();
        if(!availability.enabled) {
            res.status(423).json({success:false,error:'AI_TUTOR_LOCKED',message:AI_TUTOR_LOCKED_MESSAGE});
            return;
        }
        traceId=z.string().trim().regex(/^trace_[A-Za-z0-9_-]{8,80}$/).parse(req.body.traceId);
        run=await claimReviewRun(traceId,req.user!.id);
        if(!run) {
            const existing=await getRun(traceId,req.user!.id);
            res.status(existing?409:404).json({success:false,
                error:existing?'AGENT_REVIEW_NOT_WAITING':'REPORT_NOT_FOUND'});
            return;
        }
        const priorRecords=Array.isArray(run.report?.agent_traces)?run.report.agent_traces:[];
        const sequenceOffset=priorRecords.reduce((highest:number,record:any)=>Math.max(highest,Number(record.sequence)||0),0);
        const request={...run.request,trace_id:traceId,review_mode:true,resume_report:reviewCheckpoint(run.report),
            sequence_offset:sequenceOffset,run_attempt:Number(run.request?.run_attempt||1)};
        const body=JSON.stringify(request);
        res.setHeader('Content-Type','text/event-stream');res.setHeader('Cache-Control','no-cache');
        res.setHeader('X-Accel-Buffering','no');res.flushHeaders();
        send({type:'review_resumed',trace_id:traceId});
        const timer=setTimeout(()=>abort.abort(),upstreamPipelineTimeoutMs);
        try {
            const upstream=await fetch((process.env.AI_SERVICE_URL||'http://127.0.0.1:8000')+'/pal-net/adaptive-tutor-agent/stream',
                {method:'POST',headers:internalHeaders(body),body,signal:abort.signal});
            if(!upstream.ok||!upstream.body) throw Error('AI_SERVICE_HTTP_'+upstream.status);
            await consumeSse(upstream.body,async event=>{
                if(event.type==='agent_step'&&event.record) {
                    await saveStage(traceId!,event.record);
                    send({...event,record:publicRecord(event.record)});
                } else if(event.type==='complete') report=event.data;
                else if(event.type==='error') throw Error(event.error||'AI_STREAM_FAILED');
            });
            if(!report||report.trace_id!==traceId) throw Error('AI_STREAM_INCOMPLETE');
            report=mergeReviewReport(run.report,report);
            if(report.exercise && (report.status!=='SUCCEEDED'||!report.agent_traces?.some((step:any)=>
                step.agent==='PublicationGate'&&step.status==='SUCCEEDED'&&step.output?.approved===true))) throw Error('PUBLICATION_GATE_MISSING');
            if(isRetryableProviderFailure(report.error?.code)) {
                report={...report,status:'WAITING_PROVIDER',reply:'Provider tạm thời chưa trả được kết quả hợp lệ. Bước hiện tại sẽ được tự thử lại.'};
                await deferRun(traceId,report,providerRetryDelay(report.error,Number(run.retry_count||0)));
            }
        } finally {clearTimeout(timer);}
    } catch(error:any) {
        if(!traceId||!run) {
            if(!res.headersSent) res.status(error instanceof z.ZodError?400:503).json({success:false,error:'REVIEW_CONTINUE_FAILED'});
            else {send({type:'error',error:'REVIEW_CONTINUE_FAILED'});res.end();}
            return;
        }
        report={trace_id:traceId,schema_version:'4.0',status:'FAILED',exercise:null,
            agent_traces:run.report?.agent_traces||[],fallback_used:false,
            reply:'Pipeline dừng khi chạy bước kế tiếp. Kết quả các bước đã duyệt vẫn được giữ nguyên.',
            error:{code:error.name==='AbortError'?'RUN_DEADLINE_EXCEEDED':'TRANSPORT_OR_STORAGE_ERROR',message:error.message}};
    }
    const aiMessage=await finishRetryRun(traceId!,run.session_id,report);
    const safe=publicReport(report);
    send({type:'complete',success:true,sessionId:run.session_id,aiMessage,pipeline:safe,exercise:safe.exercise});
    res.end();
}

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

export function publicPracticeExercise(run:any) {
    const ex=run.artifact;
    return {id:run.exercise_id,title:ex.title,difficulty:ex.difficulty==='CHALLENGE'?'HARD':ex.difficulty,
        problemDescription:ex.problem_statement,starterCode:ex.starter_code,language:ex.language.toUpperCase(),
        testCases:(ex.test_cases||[]).filter((test:any)=>!test.is_hidden).map((test:any,index:number)=>({
            id:`${run.exercise_id}-${index}`,input:test.input??JSON.stringify(test.arguments),
            expectedOutput:test.expected_output,isHidden:false}))};
}

async function publishExerciseBatch(selected:any,userId:string) {
    const parentTrace=selected.request?.batch_parent_trace_id||selected.trace_id;
    const parent=await getRun(parentTrace,userId);
    const expected=Number(parent?.report?.exercise_count);
    if(!parent || !Number.isInteger(expected) || expected<2 || expected>5 || parent.session_id!==selected.session_id)
        throw Error('BATCH_INVALID');
    const candidates:any[]=await prisma.$queryRawUnsafe(
        "SELECT * FROM adaptive_generation_runs WHERE user_id=$1::uuid AND session_id=$2::uuid AND (trace_id=$3 OR request->>'batch_parent_trace_id'=$3) ORDER BY created_at ASC",
        userId,parent.session_id,parentTrace);
    const ordered=[parent,...candidates.filter(run=>run.trace_id!==parentTrace).sort((a,b)=>Number(a.request?.batch_index)-Number(b.request?.batch_index))];
    if(ordered.length!==expected || new Set(ordered.map(run=>run.exercise_id)).size!==expected ||
        ordered.some((run,index)=>run.status!=='SUCCEEDED'||run.artifact?.qc_status!=='VERIFIED'||
            !run.report?.agent_traces?.some((step:any)=>step.agent==='PublicationGate'&&step.status==='SUCCEEDED'&&step.output?.approved===true)||
            run.artifact?.concept_id!==parent.artifact?.concept_id||run.artifact?.language!==parent.artifact?.language||
            (index>0 && (run.request?.batch_parent_trace_id!==parentTrace||Number(run.request?.batch_index)!==index+1))))
        throw Error('BATCH_INCOMPLETE');
    return prisma.$transaction(async tx=>{
        const locked:any[]=await tx.$queryRawUnsafe(
            'SELECT trace_id,path_id FROM adaptive_generation_runs WHERE trace_id=ANY($1::text[]) ORDER BY trace_id FOR UPDATE',
            ordered.map(run=>run.trace_id));
        if(locked.length!==expected) throw Error('BATCH_INCOMPLETE');
        const published=locked.find(run=>run.path_id)?.path_id;
        if(published) {
            if(locked.some(run=>run.path_id!==published)) throw Error('BATCH_ALREADY_PUBLISHED');
            return {pathId:published,exerciseId:selected.exercise_id,exerciseCount:expected};
        }
        const first=parent.artifact;
        const path=await tx.personalizedPath.create({data:{userId,title:first.concept_name||first.title,
            description:first.quick_theory,targetSkills:[first.concept_id],
            palNetAvgScore:first.spec_snapshot?.learner_evidence?.mastery??0,
            lessons:{create:{title:first.concept_name||first.title,orderIndex:1,targetSkillId:first.concept_id,
                theoryContent:first.theoryContent,practiceExercises:ordered.map(publicPracticeExercise),
                exercise:{create:{id:parent.exercise_id,title:first.title,
                    difficulty:first.difficulty==='CHALLENGE'?'HARD':first.difficulty,
                    problemDescription:first.problem_statement,starterCode:first.starter_code,
                    solutionCode:first.reference_solution,language:first.language.toUpperCase(),qcStatus:'VERIFIED',
                    testCases:{create:first.test_cases.map((test:any)=>({input:test.input??JSON.stringify(test.arguments),
                        expectedOutput:test.expected_output,isHidden:test.is_hidden}))}}}}}}});
        await tx.$executeRawUnsafe('UPDATE adaptive_generation_runs SET path_id=$2::uuid WHERE trace_id=ANY($1::text[])',
            ordered.map(run=>run.trace_id),path.id);
        const messages:any[]=await tx.$queryRawUnsafe(
            "SELECT id,metadata FROM path_chat_messages WHERE session_id=$1::uuid AND sender='AI_TUTOR' AND metadata->'pipeline'->>'trace_id'=$2 ORDER BY created_at DESC LIMIT 1",
            parent.session_id,parentTrace);
        if(messages[0]) {
            const previous=messages[0].metadata||{};
            await tx.pathChatMessage.update({where:{id:messages[0].id},data:{
                content:`Đã tạo đủ ${expected} bài thực hành về ${first.concept_name||first.title}. Mở phần Thực hành lập trình để chọn và làm từng bài.`,
                metadata:{...previous,exercise:null,suggestedOptions:[],step:'PRACTICE_BATCH_READY',
                    practiceBatch:{status:'READY',expectedCount:expected,completedCount:expected,
                        rootTraceId:parentTrace,pathId:path.id,titles:ordered.map(run=>run.artifact.title)}}}});
        }
        await tx.pathChatSession.updateMany({where:{id:parent.session_id,userId},data:{createdPathId:path.id}});
        return {pathId:path.id,exerciseId:selected.exercise_id,exerciseCount:expected};
    });
}

export async function startExercise(req:AuthenticatedRequest,res:Response) {
    try {
        const exerciseId=idSchema.parse(req.body.exercise_id);
        const run=await getRunForExercise(exerciseId,req.user!.id);
        if(!run||run.status!=='SUCCEEDED'||run.artifact?.qc_status!=='VERIFIED'){res.status(409).json({success:false,error:'Bài tập chưa được kiểm định'});return;}
        const output=Number(run.report?.exercise_count)>1 || run.request?.batch_parent_trace_id
            ? await publishExerciseBatch(run,req.user!.id) : await publishRun(run,req.user!.id);
        res.json({success:true,...output});
    } catch(error:any){res.status(error instanceof z.ZodError?400:error.message==='BATCH_INCOMPLETE'?409:500)
        .json({success:false,error:error.message==='BATCH_INCOMPLETE'?'Chưa tạo đủ bài đã kiểm định trong nhóm; vui lòng thử lại sau.':'Không mở được bài từ bản đã kiểm định'});}
}

export async function markExerciseBatchFailed(req:AuthenticatedRequest,res:Response) {
    try {
        const traceId=z.string().regex(/^trace_[A-Za-z0-9_-]{8,80}$/).parse(req.body.parentTraceId);
        const parent=await getRun(traceId,req.user!.id);
        const expected=Number(parent?.report?.exercise_count);
        if(!parent || parent.path_id || !Number.isInteger(expected) || expected<2 || expected>5) {
            res.status(409).json({success:false,error:'BATCH_NOT_PENDING'});return;
        }
        const rows:any[]=await prisma.$queryRawUnsafe(
            "SELECT COUNT(*)::int AS completed FROM adaptive_generation_runs WHERE user_id=$1::uuid AND session_id=$2::uuid AND status='SUCCEEDED' AND artifact->>'qc_status'='VERIFIED' AND (trace_id=$3 OR request->>'batch_parent_trace_id'=$3)",
            req.user!.id,parent.session_id,traceId);
        const completed=Math.min(expected,Number(rows[0]?.completed||0));
        const messages:any[]=await prisma.$queryRawUnsafe(
            "SELECT id,metadata FROM path_chat_messages WHERE session_id=$1::uuid AND sender='AI_TUTOR' AND metadata->'pipeline'->>'trace_id'=$2 ORDER BY created_at DESC LIMIT 1",
            parent.session_id,traceId);
        if(messages[0]) await prisma.pathChatMessage.update({where:{id:messages[0].id},data:{
            content:`Mới kiểm định được ${completed}/${expected} bài. Chưa phát hành bộ bài vì chưa đủ số lượng bạn yêu cầu.`,
            metadata:{...messages[0].metadata,exercise:null,suggestedOptions:[],step:'PRACTICE_BATCH_FAILED',
                practiceBatch:{status:'FAILED',expectedCount:expected,completedCount:completed,rootTraceId:traceId}}}});
        res.json({success:true,completedCount:completed,expectedCount:expected});
    } catch(error:any){res.status(error instanceof z.ZodError?400:500).json({success:false,error:'BATCH_UPDATE_FAILED'});}
}

export function publicGrading(stored:any, code:string, run:any) {
    const results=(stored.test_results||[]).map((tc:any)=>{
        const safe=publicCase(tc);
        return {...safe,testCaseId:String(tc.case_index),input:tc.is_hidden?'Hidden':tc.input,expectedOutput:tc.is_hidden?'Hidden':tc.expected,
            actualOutput:tc.is_hidden?(tc.passed?'Passed':'Mismatch'):tc.actual,errorMessage:tc.is_hidden?undefined:tc.stderr};
    });
    const passed=results.filter((r:any)=>r.passed).length;
    const graderFailure=isGraderFailure(stored);
    return {success:!graderFailure,isPassed:stored.passed===true,passedCases:passed,totalCases:results.length,
        score:results.length?Math.round(passed/results.length*100):0,results,status:stored.status,
        adaptiveFeedback:stored.mastery_event,submission_id:stored.submission_id,
        guidance:evidencePracticeGuidance(code,stored,run),
        error:graderFailure?'GRADER_UNAVAILABLE':undefined};
}

export async function analyzePracticeSubmission(req:AuthenticatedRequest,res:Response) {
    try {
        const submissionId=idSchema.parse(req.body.submissionId);
        const submission=await getSubmissionForGuidance(submissionId,req.user!.id);
        if(!submission){res.status(404).json({success:false,error:'SUBMISSION_NOT_FOUND'});return;}
        if(submission.status==='RUNNING'||!submission.result){res.status(409).json({success:false,error:'SUBMISSION_IN_PROGRESS'});return;}
        const run=await getRunForExercise(submission.exercise_id,req.user!.id);
        if(!run || run.trace_id!==submission.trace_id || !run.artifact){res.status(409).json({success:false,error:'EXERCISE_NOT_PUBLISHED'});return;}
        const guidance=await requestPracticeGuidance(submission.code,submission.result,run);
        res.json({success:true,submissionId,guidance});
    } catch(error:any) {
        res.status(error instanceof z.ZodError?400:503).json({success:false,error:error instanceof z.ZodError?'INVALID_SUBMISSION_ID':'PRACTICE_AI_UNAVAILABLE'});
    }
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
            res.json(publicGrading(existing.result,existing.code,run));return;
        }
        reserved=true;
        const execution=await runExercise(run.artifact,run.artifact.spec_snapshot,code);
        const result=await storeGrading(id,req.user!.id,run,{...execution,submission_id:id});
        if(result.passed) {
            const progress:any[]=await prisma.$queryRawUnsafe(
                "SELECT COUNT(DISTINCT r.exercise_id)::int AS total, COUNT(DISTINCT CASE WHEN s.status='PASSED' THEN r.exercise_id END)::int AS passed FROM adaptive_generation_runs r LEFT JOIN adaptive_submissions s ON s.trace_id=r.trace_id AND s.user_id=r.user_id WHERE r.path_id=$1::uuid AND r.user_id=$2::uuid",
                run.path_id,req.user!.id);
            if(progress[0]?.total>0 && progress[0]?.passed>=progress[0]?.total)
                await prisma.personalizedLesson.updateMany({where:{pathId:run.path_id},data:{isCompleted:true}});
        }
        res.status(isGraderFailure(result)?503:200).json(publicGrading(result,code,run));
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
        const selected=rows[0];
        const output=Number(selected.report?.exercise_count)>1 || selected.request?.batch_parent_trace_id
            ? await publishExerciseBatch(selected,req.user!.id) : await publishRun(selected,req.user!.id);
        res.json({success:true,data:{id:output.pathId},...output});
    } catch {res.status(400).json({success:false,error:'Không xác nhận được bài học'});}
}

export async function getSession(req:AuthenticatedRequest,res:Response) {
    const session=await prisma.pathChatSession.findFirst({where:{id:String(req.params.sessionId),userId:req.user!.id},include:{messages:{orderBy:{createdAt:'asc'}}}});
    if(!session){res.status(404).json({success:false});return;}
    res.json({success:true,session:sanitizeLegacy(session)});
}
