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

const resumeCoreAgents=['AdaptiveExercisePlanner','ExerciseGeneratorAgent','SchemaValidator','ConstraintValidator','SandboxValidator'];
const resumeOptionalAgents=['ExplanationTutorAgent','KnowledgeRetrievalService'];

/**
 * Build the smallest server-owned checkpoint that the Python orchestrator can
 * genuinely resume.  The complete evidence remains in PostgreSQL; this only
 * removes transport receipts, model request/response copies, and inputs that
 * `_resume_verified_candidate` never reads.
 */
export function resumeCheckpoint(report: any): any {
    const latest=new Map<string,any>();
    for(const record of Array.isArray(report?.agent_traces)?report.agent_traces:[]) {
        if(record?.status==='SUCCEEDED' && [...resumeCoreAgents,...resumeOptionalAgents].includes(record.agent)) latest.set(record.agent,record);
    }
    const coreReady=resumeCoreAgents.every(agent=>latest.has(agent))
        && latest.get('SchemaValidator')?.output?.passed===true
        && latest.get('ConstraintValidator')?.output?.passed===true
        && latest.get('SandboxValidator')?.output?.passed===true;
    if(!coreReady) return {trace_id:report?.trace_id,intent:report?.intent,agent_traces:[]};
    const selected=[...resumeCoreAgents];
    if(latest.has('ExplanationTutorAgent')) selected.push('ExplanationTutorAgent');
    else if(latest.has('KnowledgeRetrievalService')) selected.push('KnowledgeRetrievalService');
    return {
        trace_id:report?.trace_id,
        intent:report?.intent,
        agent_traces:selected.map(agent=>{
            const record=latest.get(agent);
            return {agent:record.agent,status:record.status,output:record.output};
        }),
    };
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
    else if (['IntentRouterAgent','AdaptiveExercisePlanner','KnowledgeRetrievalService','ExplanationTutorAgent','PublicationGate','LearnerStateService'].includes(record.agent)) safeOutput=output;
    else safeOutput=output && {passed:output.passed,approved:output.approved};
    return {...metadata, output:safeOutput, model_calls:(model_calls||[]).map(({input,output,private_response_excerpt,...receipt}:any)=>receipt),
        error:record.error ? {code:record.error.code,message:'Bước này thất bại; mã lỗi được lưu cùng báo cáo.'}:undefined};
}
export function publicReport(report: any): any {
    if (!report) return null;
    return {...report,exercise:publicExercise(report.exercise),agent_traces:(report.agent_traces||[]).map(publicRecord),
        error:report.error ? {code:report.error.code,message:'Pipeline chưa đạt; xem trạng thái từng bước.'}:undefined};
}
export function sanitizeLegacy(value: any): any {
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.filter(v=>!(v?.isHidden || (v?.is_hidden && v?.executed===undefined))).map(v=>v?.is_hidden?publicCase(v):sanitizeLegacy(v));
    if (!value || typeof value!=='object') return value;
    return Object.fromEntries(Object.entries(value).filter(([key])=>!['reference_solution','solutionCode','solutionCodes','fixture_sql','correctOption','spec_snapshot'].includes(key)).map(([key,v])=>[key,sanitizeLegacy(v)]));
}
