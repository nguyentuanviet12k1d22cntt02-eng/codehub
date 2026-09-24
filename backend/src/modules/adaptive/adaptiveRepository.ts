import { prisma } from '../../infrastructure/database/prisma';
import { calculateMasteryUpdate } from './masteryPolicy';

// Additive schema only. All value-bearing queries below are parameterized.
export const schemaStatements = [
"CREATE TABLE IF NOT EXISTS adaptive_generation_runs (trace_id text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,session_id uuid NOT NULL REFERENCES path_chat_sessions(id) ON DELETE CASCADE,status text NOT NULL DEFAULT 'RUNNING',request jsonb NOT NULL,report jsonb NOT NULL DEFAULT '{\"agent_traces\":[]}',artifact jsonb,exercise_id uuid UNIQUE,path_id uuid,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now())",
"CREATE INDEX IF NOT EXISTS adaptive_runs_user_session ON adaptive_generation_runs(user_id,session_id,created_at DESC)",
"CREATE TABLE IF NOT EXISTS adaptive_submissions (submission_id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,trace_id text NOT NULL REFERENCES adaptive_generation_runs(trace_id) ON DELETE CASCADE,exercise_id uuid NOT NULL,code_hash text NOT NULL,code text NOT NULL,status text NOT NULL,result jsonb,created_at timestamptz NOT NULL DEFAULT now())",
"CREATE TABLE IF NOT EXISTS adaptive_learner_states (user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,language text NOT NULL,concept_id text NOT NULL,mastery double precision NOT NULL DEFAULT 0.4 CHECK(mastery>=0 AND mastery<=1),attempts integer NOT NULL DEFAULT 0,failure_streak integer NOT NULL DEFAULT 0,evidence_weight double precision NOT NULL DEFAULT 0,updated_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,language,concept_id))",
"CREATE TABLE IF NOT EXISTS adaptive_mastery_events (submission_id uuid PRIMARY KEY REFERENCES adaptive_submissions(submission_id) ON DELETE CASCADE,user_id uuid NOT NULL,concept_id text NOT NULL,previous_mastery double precision NOT NULL,new_mastery double precision NOT NULL,delta double precision NOT NULL,policy_version text NOT NULL,evidence jsonb NOT NULL,created_at timestamptz NOT NULL DEFAULT now())"
,
"ALTER TABLE adaptive_generation_runs ADD COLUMN IF NOT EXISTS retry_count integer NOT NULL DEFAULT 0",
"ALTER TABLE adaptive_generation_runs ADD COLUMN IF NOT EXISTS next_attempt_at timestamptz",
"ALTER TABLE adaptive_learner_states ADD COLUMN IF NOT EXISTS evidence_weight double precision NOT NULL DEFAULT 0",
"CREATE INDEX IF NOT EXISTS adaptive_mastery_events_user_time ON adaptive_mastery_events(user_id,created_at,submission_id)",
"CREATE INDEX IF NOT EXISTS adaptive_runs_retry_queue ON adaptive_generation_runs(status,next_attempt_at)"
];
let ready: Promise<unknown> | undefined;
export function ensureStorage() {
    if (!ready) {
        ready = (async () => {
            for (const sql of schemaStatements) {
                try {
                    await prisma.$executeRawUnsafe(sql);
                } catch (e: any) {
                    console.warn(`[ensureStorage] Notice: ${e.message}`);
                }
            }
        })().catch(error => {
            ready = undefined;
            console.error('[ensureStorage] Error initializing storage:', error);
        });
    }
    return ready;
}
const rows = (sql:string,...args:any[]):Promise<any[]> => prisma.$queryRawUnsafe(sql,...args);
export async function createRun(traceId:string,userId:string,sessionId:string,request:any) {
    await ensureStorage();
    await prisma.$executeRawUnsafe('INSERT INTO adaptive_generation_runs(trace_id,user_id,session_id,request) VALUES($1,$2::uuid,$3::uuid,$4::jsonb)',traceId,userId,sessionId,JSON.stringify(request));
}
export async function saveStage(traceId:string,record:any) {
    await prisma.$executeRawUnsafe("UPDATE adaptive_generation_runs SET report=jsonb_set(report,'{agent_traces}',COALESCE((SELECT jsonb_agg(x) FROM jsonb_array_elements(report->'agent_traces') x WHERE x->>'id'<>$2),'[]'::jsonb)||$3::jsonb),updated_at=now() WHERE trace_id=$1",traceId,record.id,JSON.stringify([record]));
}
export async function finishRun(traceId:string,report:any) {
    await prisma.$executeRawUnsafe('UPDATE adaptive_generation_runs SET status=$2,report=$3::jsonb,artifact=$4::jsonb,exercise_id=$5::uuid,updated_at=now() WHERE trace_id=$1',
        traceId,report.status,JSON.stringify(report),report.exercise?JSON.stringify(report.exercise):null,report.exercise?.exercise_id||null);
}
export async function deferRun(traceId:string,report:any,delaySeconds=30) {
    await prisma.$executeRawUnsafe("UPDATE adaptive_generation_runs SET status='WAITING_PROVIDER',report=$2::jsonb,retry_count=retry_count+1,next_attempt_at=now()+($3::text||' seconds')::interval,updated_at=now() WHERE trace_id=$1",traceId,JSON.stringify(report),String(delaySeconds));
}
export async function dueRetries(limit=2) {
    await ensureStorage();
    return rows("SELECT * FROM adaptive_generation_runs WHERE status='WAITING_PROVIDER' AND retry_count<3 AND next_attempt_at<=now() ORDER BY next_attempt_at LIMIT $1",limit);
}
export async function claimRetry(traceId:string) {
    return (await rows("UPDATE adaptive_generation_runs SET status='RUNNING',updated_at=now() WHERE trace_id=$1 AND status='WAITING_PROVIDER' AND next_attempt_at<=now() RETURNING *",traceId))[0];
}
export async function getRun(traceId:string,userId:string) {
    await ensureStorage();
    return (await rows('SELECT * FROM adaptive_generation_runs WHERE trace_id=$1 AND user_id=$2::uuid',traceId,userId))[0];
}
export async function getRunForExercise(exerciseId:string,userId:string) {
    await ensureStorage();
    return (await rows('SELECT * FROM adaptive_generation_runs WHERE exercise_id=$1::uuid AND user_id=$2::uuid',exerciseId,userId))[0];
}
export async function learnerContext(userId:string,sessionId:string,requestedLanguage?:string) {
    await ensureStorage();
    const recent=await rows('SELECT artifact FROM adaptive_generation_runs WHERE user_id=$1::uuid AND artifact IS NOT NULL ORDER BY created_at DESC LIMIT 8',userId);
    const sessionRecent=await rows('SELECT artifact FROM adaptive_generation_runs WHERE user_id=$1::uuid AND session_id=$2::uuid AND artifact IS NOT NULL ORDER BY created_at DESC LIMIT 1',userId,sessionId);
    const last=sessionRecent[0]?.artifact;
    const language=(requestedLanguage||last?.language||'python').toLowerCase();
    const snapshot=await getAdaptiveMasterySnapshot(userId,language);
    return {states:snapshot.states,
        recent_exercises:recent.filter(r=>(r.artifact.language||'').toLowerCase()===language).map(r=>r.artifact.concept_id),
        last_concept_id:last?.language?.toLowerCase()===language?last?.concept_id:undefined,
        last_difficulty:last?.language?.toLowerCase()===language?last?.difficulty:undefined,language};
}

export async function getAdaptiveMasterySnapshot(userId:string,language:string) {
    await ensureStorage();
    const normalizedLanguage=(language||'python').toLowerCase();
    const events=await rows(
        "SELECT e.concept_id,e.policy_version,e.evidence,e.created_at,s.status,s.exercise_id,COALESCE(r.artifact->>'difficulty','MEDIUM') AS difficulty FROM adaptive_mastery_events e JOIN adaptive_submissions s ON s.submission_id=e.submission_id JOIN adaptive_generation_runs r ON r.trace_id=s.trace_id WHERE e.user_id=$1::uuid AND s.status IN ('PASSED','FAILED') AND lower(COALESCE(r.artifact->>'language',''))=lower($2) ORDER BY e.created_at ASC,e.submission_id ASC",
        userId,normalizedLanguage
    );
    const stateByConcept:Record<string,any>={};
    const seenExercises=new Set<string>();
    const observations:any[]=[];
    for(const row of events) {
        const state=stateByConcept[row.concept_id]||{
            mastery:.4,attempts:0,passed:0,failed:0,failure_streak:0,
            evidence_weight:0,passed_evidence:0,failed_evidence:0,
            last_assessed_at:null,source:'ADAPTIVE_SANDBOX'
        };
        const payload=row.evidence?.evidence||row.evidence||{};
        const totalCases=Math.max(1,Number(payload.total_cases||1));
        const rawPassedCases=Number(payload.passed_cases);
        const passedCases=Number.isFinite(rawPassedCases)?rawPassedCases:row.status==='PASSED'?totalCases:0;
        const exerciseKey=`${row.concept_id}:${row.exercise_id}`;
        const repeatedExercise=seenExercises.has(exerciseKey);
        const update=calculateMasteryUpdate({previousMastery:Number(state.mastery),priorAttempts:Number(state.attempts),
            priorEvidenceWeight:Number(state.evidence_weight),
            passedCases,totalCases,difficulty:String(row.difficulty||'MEDIUM').toUpperCase(),repeatedExercise});
        seenExercises.add(exerciseKey);
        state.mastery=update.nextMastery;
        state.attempts+=1;
        state.passed+=row.status==='PASSED'?1:0;
        state.failed+=row.status==='PASSED'?0:1;
        state.failure_streak=row.status==='PASSED'?0:state.failure_streak+1;
        state.evidence_weight+=update.observationWeight;
        state.passed_evidence+=update.observationWeight*update.observedScore;
        state.failed_evidence+=update.observationWeight*(1-update.observedScore);
        state.confidence=Math.round((1-Math.exp(-state.evidence_weight/3))*10000)/10000;
        state.last_assessed_at=row.created_at;
        stateByConcept[row.concept_id]=state;
        observations.push({
            concept_id:row.concept_id,exercise_id:row.exercise_id,status:row.status,
            passed_cases:passedCases,total_cases:totalCases,difficulty:String(row.difficulty||'MEDIUM').toUpperCase(),
            repeated_exercise:repeatedExercise,assessed_at:row.created_at,source:'ADAPTIVE_SANDBOX'
        });
    }
    return {
        states:stateByConcept,
        observations,
        verified_activity_dates:events.map(row=>row.created_at)
    };
}
export async function reserveSubmission(id:string,userId:string,run:any,code:string,codeHash:string) {
    const inserted=await prisma.$executeRawUnsafe("INSERT INTO adaptive_submissions(submission_id,user_id,trace_id,exercise_id,code_hash,code,status) VALUES($1::uuid,$2::uuid,$3,$4::uuid,$5,$6,'RUNNING') ON CONFLICT DO NOTHING",id,userId,run.trace_id,run.exercise_id,codeHash,code);
    if(inserted) return null;
    const row=(await rows('SELECT * FROM adaptive_submissions WHERE submission_id=$1::uuid AND user_id=$2::uuid',id,userId))[0];
    if(!row || row.code_hash!==codeHash || row.trace_id!==run.trace_id) throw Error('SUBMISSION_ID_CONFLICT');
    return row;
}
export async function storeGrading(id:string,userId:string,run:any,result:any) {
    return prisma.$transaction(async tx=>{
        const locked:any[]=await tx.$queryRawUnsafe('SELECT * FROM adaptive_submissions WHERE submission_id=$1::uuid FOR UPDATE',id);
        if(locked[0]?.status!=='RUNNING') return locked[0]?.result;
        const artifact=run.artifact, passed=result.passed===true;
        let event:any=null;
        if(result.status!=='INFRA_ERROR') {
            await tx.$executeRawUnsafe('INSERT INTO adaptive_learner_states(user_id,language,concept_id) VALUES($1::uuid,$2,$3) ON CONFLICT DO NOTHING',userId,artifact.language,artifact.concept_id);
            const states:any[]=await tx.$queryRawUnsafe('SELECT * FROM adaptive_learner_states WHERE user_id=$1::uuid AND language=$2 AND concept_id=$3 FOR UPDATE',userId,artifact.language,artifact.concept_id);
            const state=states[0];
            const prior:any[]=await tx.$queryRawUnsafe("SELECT submission_id FROM adaptive_submissions WHERE user_id=$1::uuid AND exercise_id=$2::uuid AND submission_id<>$3::uuid AND status IN ('PASSED','FAILED') LIMIT 1",userId,run.exercise_id,id);
            const testResults=Array.isArray(result.test_results)?result.test_results:[];
            const totalCases=Math.max(1,testResults.length||artifact.test_cases?.length||1);
            const passedCases=testResults.length
                ? testResults.filter((test:any)=>test.passed===true).length
                : passed ? totalCases : 0;
            const update=calculateMasteryUpdate({previousMastery:Number(state.mastery),priorAttempts:Number(state.attempts||0),
                priorEvidenceWeight:Number(state.evidence_weight||0),
                passedCases,totalCases,difficulty:artifact.difficulty,repeatedExercise:prior.length>0});
            const {nextMastery:next,delta,observedScore,observationWeight,confidenceBefore,confidenceAfter}=update;
            const outcomeReason=passed?'VERIFIED_PASS':'VERIFIED_PARTIAL_OR_FAILED_ATTEMPT';
            event={submission_id:id,concept_id:artifact.concept_id,previous_mastery:Number(state.mastery),new_mastery:next,delta,
                policy_version:'evidence_policy_v4',reason:`${prior.length?'REPEATED':'NEW'}_${outcomeReason}`,
                evidence:{trace_id:run.trace_id,harness_version:result.harness_version,passed_cases:passedCases,total_cases:totalCases,
                    observed_score:observedScore,observation_weight:observationWeight,confidence_before:confidenceBefore,confidence_after:confidenceAfter}};
            await tx.$executeRawUnsafe('UPDATE adaptive_learner_states SET mastery=$4,attempts=attempts+1,failure_streak=$5,evidence_weight=evidence_weight+$6,updated_at=now() WHERE user_id=$1::uuid AND language=$2 AND concept_id=$3',userId,artifact.language,artifact.concept_id,next,passed?0:state.failure_streak+1,observationWeight);
            await tx.$executeRawUnsafe("INSERT INTO adaptive_mastery_events(submission_id,user_id,concept_id,previous_mastery,new_mastery,delta,policy_version,evidence) VALUES($1::uuid,$2::uuid,$3,$4,$5,$6,'evidence_policy_v4',$7::jsonb)",id,userId,artifact.concept_id,state.mastery,next,delta,JSON.stringify(event));
        }
        const stored={...result,mastery_event:event};
        await tx.$executeRawUnsafe('UPDATE adaptive_submissions SET status=$2,result=$3::jsonb WHERE submission_id=$1::uuid',id,result.status==='INFRA_ERROR'?'INFRA_ERROR':passed?'PASSED':'FAILED',JSON.stringify(stored));
        return stored;
    });
}
