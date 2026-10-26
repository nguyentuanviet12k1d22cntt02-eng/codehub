import { createHash, createHmac, timingSafeEqual } from 'crypto';

export function canonical(value: any): any {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));
    return value;
}
export const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
export function internalHeaders(body: string) {
    const secret = process.env.ADAPTIVE_INTERNAL_SECRET || process.env.JWT_SECRET;
    if (!secret) throw Error('INTERNAL_SECRET_REQUIRED');
    const timestamp = Math.floor(Date.now()/1000).toString();
    return {'Content-Type':'application/json','X-Adaptive-Time':timestamp,
        'X-Adaptive-Signature':createHmac('sha256',secret).update(timestamp+'.'+body).digest('hex')};
}
export function verifyInternal(body: Buffer, timestamp: string, signature: string): boolean {
    const secret = process.env.ADAPTIVE_INTERNAL_SECRET || process.env.JWT_SECRET;
    if (!secret || !timestamp || !/^\d+$/.test(timestamp) || !/^[a-f0-9]{64}$/.test(signature || '') || Math.abs(Date.now()/1000-Number(timestamp))>120) return false;
    const expected = createHmac('sha256',secret).update(timestamp+'.').update(body).digest();
    return timingSafeEqual(expected,Buffer.from(signature,'hex'));
}

const resumeCoreAgents=['AdaptiveExercisePlanner','ExerciseGeneratorAgent','SchemaValidator','ConstraintValidator'];
const resumeOptionalAgents=['SandboxValidator','ExplanationTutorAgent','KnowledgeRetrievalService'];
const conceptIdPattern=/^(?:PY|JS|CPP|SQL)-[A-Z0-9-]+$/;

/**
 * Recover the latest graph concept that the deterministic planner already
 * accepted.  A retry must not ask the intent router to infer the topic again:
 * doing so can turn PY-LIST-02 back into a loose label such as "array".
 */
export function verifiedTargetConcept(report: any): string|undefined {
    const records=Array.isArray(report?.agent_traces)?report.agent_traces:[];
    for(let index=records.length-1;index>=0;index--) {
        const record=records[index];
        const candidate=record?.agent==='AdaptiveExercisePlanner' && record?.status==='SUCCEEDED'
            ? record?.output?.target_concept : undefined;
        if(typeof candidate==='string' && conceptIdPattern.test(candidate)) return candidate;
    }
    return undefined;
}

/**
 * Build the smallest server-owned checkpoint that the Python orchestrator can
 * genuinely resume.  The complete evidence remains in PostgreSQL; this only
 * removes transport receipts, model request/response copies, and inputs that
 * `_resume_verified_candidate` never reads.
 */
export function resumeCheckpoint(report: any): any {
    const latest=new Map<string,any>();
    let repairFeedback:any;
    let lastGeneratorSequence=0,lastRejectedSequence=0;
    for(const record of Array.isArray(report?.agent_traces)?report.agent_traces:[]) {
        if(record?.agent==='ExerciseGeneratorAgent' && record.status==='SUCCEEDED')
            lastGeneratorSequence=Number(record.sequence)||lastGeneratorSequence;
        if(record?.agent==='CriticEvaluatorAgent' && record.status==='REJECTED'
            && record.output?.is_approved===false
            && ['EXERCISE','BOTH'].includes(record.output?.feedback_target)) {
            repairFeedback=record.output;
            lastRejectedSequence=Number(record.sequence)||lastRejectedSequence;
        }
        // A new draft must never inherit an older draft's passing receipts.
        if(record?.agent==='AdaptiveExercisePlanner' && record.status==='SUCCEEDED') latest.clear();
        if(record?.agent==='ExerciseGeneratorAgent' && record.status==='SUCCEEDED') {
            for(const agent of ['SchemaValidator','ConstraintValidator','SandboxValidator','ExplanationTutorAgent','CriticEvaluatorAgent']) latest.delete(agent);
        }
        if(['SchemaValidator','ConstraintValidator','SandboxValidator'].includes(record?.agent)) latest.delete(record.agent);
        if(record?.status==='SUCCEEDED' && [...resumeCoreAgents,...resumeOptionalAgents].includes(record.agent)) latest.set(record.agent,record);
    }
    const coreReady=resumeCoreAgents.every(agent=>latest.has(agent))
        && latest.get('SchemaValidator')?.output?.passed===true
        && latest.get('ConstraintValidator')?.output?.passed===true;
    if(!coreReady) return {trace_id:report?.trace_id,intent:report?.intent,exercise_count:report?.exercise_count,agent_traces:[]};
    const selected=[...resumeCoreAgents];
    if(latest.get('SandboxValidator')?.output?.passed===true) selected.push('SandboxValidator');
    if(latest.has('ExplanationTutorAgent')) selected.push('ExplanationTutorAgent');
    if(latest.has('KnowledgeRetrievalService')) selected.push('KnowledgeRetrievalService');
    return {
        trace_id:report?.trace_id,
        intent:report?.intent,
        exercise_count:report?.exercise_count,
        ...(repairFeedback?{repair_feedback:repairFeedback}:{}),
        rejected_current_candidate:lastRejectedSequence>0&&lastRejectedSequence>lastGeneratorSequence,
        agent_traces:selected.map(agent=>{
            const record=latest.get(agent);
            return {agent:record.agent,status:record.status,output:record.output};
        }),
    };
}
export function reviewCheckpoint(report:any):any {
    return {
        trace_id:report?.trace_id,
        intent:report?.intent,
        exercise_count:report?.exercise_count,
        started_at:report?.started_at,
        agent_traces:(Array.isArray(report?.agent_traces)?report.agent_traces:[])
            .filter((record:any)=>['SUCCEEDED','REJECTED'].includes(record?.status)&&record?.output!==undefined)
            .map((record:any)=>({
                id:record.id,sequence:record.sequence,agent:record.agent,method:record.method,
                status:record.status,attempt:record.attempt,stage_attempt:record.stage_attempt,
                run_attempt:record.run_attempt,started_at:record.started_at,ended_at:record.ended_at,
                duration_ms:record.duration_ms,output:record.output,output_hash:record.output_hash,
            })),
    };
}
export function mergeReviewReport(previous:any,next:any):any {
    const oldRecords=Array.isArray(previous?.agent_traces)?previous.agent_traces:[];
    const oldIds=new Set(oldRecords.map((record:any)=>record?.id).filter(Boolean));
    const appended=(Array.isArray(next?.agent_traces)?next.agent_traces:[])
        .filter((record:any)=>!record?.id||!oldIds.has(record.id));
    return {...next,agent_traces:[...oldRecords,...appended]};
}
export function publicExercise(exercise: any): any {
    if (!exercise || typeof exercise !== 'object') return null;
    const fields=['title','exercise_id','concept_id','concept_name','language','difficulty','difficulty_stars','problem_statement','quick_theory','starter_code','hints','constraints','common_pitfall_warning','theoryContent','execution','trace_id','qc_status','harness_version','artifact_hash'];
    const view=Object.fromEntries(fields.filter(k=>k in exercise).map(k=>[k,exercise[k]]));
    view.test_cases=Array.isArray(exercise.test_cases) ? exercise.test_cases.filter((t:any)=>t?.is_hidden===false).map((t:any)=>({input:t.input ?? JSON.stringify(t.arguments),expected_output:t.expected_output,is_hidden:false,category:t.category,explanation:t.explanation})) : [];
    return view;
}
export function publicCase(tc: any): any {
    return tc.is_hidden ? {case_index:tc.case_index,is_hidden:true,category:tc.category,passed:tc.passed,executed:tc.executed,
        status:tc.status,runtime_ms:tc.runtime_ms,image:tc.image,harness_version:tc.harness_version}
        : Object.fromEntries(Object.entries(tc).filter(([key])=>key!=='fixture_sql'));
}
export function publicRecord(record: any): any {
    const {input,output,model_calls,...metadata}=record;
    let safeOutput: any;
    if (record.agent==='ExerciseGeneratorAgent') safeOutput=publicExercise(output);
    else if (record.agent==='SandboxValidator') safeOutput=output && {...output,errors:undefined,test_results:output.test_results?.map(publicCase)};
    else if (record.agent==='CriticEvaluatorAgent') safeOutput=output && {is_approved:output.is_approved,score:output.score,feedback_target:output.feedback_target,
        theory_approved:output.theory_approved,exercise_approved:output.exercise_approved,compatibility_approved:output.compatibility_approved,
        note:'Nhận xét chi tiết được lưu trong báo cáo quản trị.'};
    else if (['IntentRouterAgent','ClarificationAgent','GeneralChatAgent','PrerequisiteAdvisorAgent',
        'AdaptiveExercisePlanner','KnowledgeRetrievalService','ExplanationTutorAgent','SchemaValidator',
        'ConstraintValidator','PublicationGate','LearnerStateService'].includes(record.agent)) safeOutput=output;
    else safeOutput=output && {passed:output.passed,approved:output.approved};
    return {...metadata, output:safeOutput, model_calls:(model_calls||[]).map(({input,output,private_response_excerpt,...receipt}:any)=>receipt),
        error:record.error ? {code:record.error.code,message:'Bước này thất bại; mã lỗi được lưu cùng báo cáo.'}:undefined};
}

function publicPipelineError(error: any): {code?: string; message: string}|undefined {
    if (!error) return undefined;
    const code=typeof error.code==='string'?error.code:undefined;
    const detail=typeof error.message==='string'?error.message.trim():'';
    // Only forward a short, known learner-facing diagnosis. Infrastructure,
    // provider and database details remain in the administrator-only report.
    const safeMessages=new Set([
        'Chưa xác định được chủ đề cần học trong đồ thị tri thức',
        'Chủ đề đã có trong đồ thị nhưng học liệu kiểm định chưa được phát hành',
        'Chưa ánh xạ được yêu cầu vào mã concept đã phát hành; cần làm rõ chủ đề',
    ]);
    return {code,message:safeMessages.has(detail)
        ? detail
        : 'AI Tutor chưa hoàn thành yêu cầu này. Bạn có thể xem bước lỗi và thử lại sau.'};
}

export function publicReport(report: any): any {
    if (!report) return null;
    return {...report,exercise:publicExercise(report.exercise),agent_traces:(report.agent_traces||[]).map(publicRecord),
        error:publicPipelineError(report.error)};
}
export function publicTutorMessageData(report:any,previousMetadata:any={}) {
    const safe=publicReport(report);
    const previous=previousMetadata && typeof previousMetadata==='object' && !Array.isArray(previousMetadata)?previousMetadata:{};
    const batchParent=safe.status==='SUCCEEDED'&&safe.exercise&&Number(safe.exercise_count)>1;
    return {content:batchParent?`Đang tạo ${safe.exercise_count} bài thực hành. Đã kiểm định bài 1/${safe.exercise_count}; hệ thống tiếp tục tự tạo các bài còn lại.`:safe.reply,
        metadata:{...previous,intent:safe.intent,
        pipeline:{trace_id:safe.trace_id,status:safe.status,schema_version:safe.schema_version,error:safe.error},
        agentTraces:safe.agent_traces,exercise:batchParent?null:safe.exercise,
        suggestedOptions:batchParent?[]:safe.suggested_options||[],
        practiceBatch:batchParent?{status:'GENERATING',expectedCount:Number(safe.exercise_count),completedCount:1,rootTraceId:safe.trace_id}
            :safe.status==='FAILED'&&previous.practiceBatch?{...previous.practiceBatch,status:'FAILED'}:previous.practiceBatch,
        pendingConfirmation:safe.pending_confirmation||null,step:batchParent?'PRACTICE_BATCH':safe.exercise?'EXERCISE_READY':'CHAT'}};
}
export function sanitizeLegacy(value: any): any {
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.filter(v=>!(v?.isHidden || (v?.is_hidden && v?.executed===undefined))).map(v=>v?.is_hidden?publicCase(v):sanitizeLegacy(v));
    if (!value || typeof value!=='object') return value;
    return Object.fromEntries(Object.entries(value).filter(([key])=>!['reference_solution','solutionCode','solutionCodes','fixture_sql','correctOption','spec_snapshot'].includes(key)).map(([key,v])=>[key,sanitizeLegacy(v)]));
}
