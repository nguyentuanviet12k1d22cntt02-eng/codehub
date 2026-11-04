import fs from 'fs';
import path from 'path';
import {moduleRelease,sha,ModuleContext,ModuleRelease} from '../onboarding/palnetModuleRelease';
import {ModuleAdvice} from '../onboarding/palnetModuleClient';

export const SELECTION_POLICY = 'palnet-module-practice-selection/1.0';
export interface PracticeItem {
    id:string; title:string; difficulty:string; skillId:string; contentVersion:string; sourcePosition:number;
}
export interface ItemAttempt {
    passed:boolean; failedAt:string|null; quarantine:string|null;
}
export interface PracticePools {
    first:PracticeItem[]; retry:PracticeItem[]; passed:number; quarantined:number;
    total:number; quarantineReason:string|null; attempts:Record<string,ItemAttempt>;
}
export interface ModulePracticeDecision {
    schemaVersion:'module-practice-recommendation/2.0'; language:'PYTHON';
    mode:'PALNET_ADVISORY'|'RULE_BASED'|'MANUAL'|'COMPLETE'; reason:string;
    decisionId:string; context:ModuleContext; cutoff:string;
    policyVersion:string; mappingVersion:string; catalogRevision:string|null;
    historyRevision:string|null; selectionRevision:string|null;
    exerciseId:string|null; contentVersion:string|null; title:string|null; difficulty:string|null; skillId:string|null;
    availableCount:number; firstOpportunityCount:number; retryCount:number; passedCount:number; quarantinedCount:number; totalCount:number;
    modelVersion:string|null; checkpointSha256:string|null; manifestSha256:string|null;
    graphVersion:string|null; featureVersion:string|null; modelPolicyVersion:string|null;
    predictedCorrectness:number|null; evaluationStatus:'SYNTHETIC_EXPLORATORY'|null;
}
const compare=(a:string,b:string)=>a<b?-1:a>b?1:0;
const level=(x:string)=>({EASY:1,MEDIUM:2,HARD:3}[x]??99);
export const catalogOrder=(a:PracticeItem,b:PracticeItem)=>a.sourcePosition-b.sourcePosition||compare(a.id,b.id);
export const ruleOrder=(a:PracticeItem,b:PracticeItem)=>level(a.difficulty)-level(b.difficulty)||catalogOrder(a,b);

/** The pinned mapping supplies review approval and catalog order; historical R02 support labels are ignored. */
export function selectionItems(exercises:any[],context:ModuleContext,release:ModuleRelease=moduleRelease()):PracticeItem[] {
    const raw=fs.readFileSync(path.join(__dirname,'../../infrastructure/data/pythonModulePracticeMapping.v2.json'));
    if(sha(raw)!==release.pins.mapping_sha256)throw Error('CATALOG_REVIEW_REQUIRED');
    const mapping=JSON.parse(raw.toString('utf8'));
    const expected=release.rows.filter(r=>r.bank_id===context.bank_id);
    if(exercises.length!==expected.length||new Set(exercises.map(e=>e.id)).size!==expected.length)throw Error('CATALOG_REVIEW_REQUIRED');
    return exercises.map(e=>{
        const row=expected.find(r=>r.exercise_id===e.id),m=mapping.rows.find((r:any)=>r.exerciseId===e.id);
        if(!row||!m||m.contentEligibility!=='CONTENT_ELIGIBLE'||m.mappingStatus!=='REVIEWED'||m.sandbox?.status!=='PASS'
            ||m.contentVersion!==row.content_version||m.primarySkillId!==row.skill_id||m.bankCode!==context.bank_code
            ||!Number.isInteger(m.sourcePosition)||!['EASY','MEDIUM','HARD'].includes(e.difficulty))throw Error('CATALOG_REVIEW_REQUIRED');
        return {id:e.id,title:e.title,difficulty:e.difficulty,skillId:row.skill_id,contentVersion:row.content_version,sourcePosition:m.sourcePosition};
    }).sort(catalogOrder);
}

export function practicePools(items:PracticeItem[],attempts:Record<string,ItemAttempt>):PracticePools {
    const result:PracticePools={first:[],retry:[],passed:0,quarantined:0,total:items.length,quarantineReason:null,attempts};
    for(const item of items){
        const a=attempts[item.id];
        if(a?.passed){result.passed++;continue;}
        if(a?.quarantine){result.quarantined++;if(!result.quarantineReason||a.quarantine==='LEGACY_ATTEMPT_VERSION_UNVERIFIED')result.quarantineReason=a.quarantine;continue;}
        if(a?.failedAt)result.retry.push(item);else result.first.push(item);
    }
    return result;
}

export function selectPractice(pools:PracticePools,release:ModuleRelease,advice:ModuleAdvice|null,fallback:string) {
    if(!pools.first.length){
        if(pools.retry.length){
            const candidate=[...pools.retry].sort((a,b)=>Date.parse(pools.attempts[b.id]!.failedAt!)-Date.parse(pools.attempts[a.id]!.failedAt!)||catalogOrder(a,b))[0]!;
            return {mode:'RULE_BASED' as const,reason:'RETRY_RULE',candidate,probability:null};
        }
        const complete=pools.total>0&&pools.passed===pools.total;
        return {mode:complete?'COMPLETE' as const:'MANUAL' as const,reason:complete?'ALL_CURRENT_ELIGIBLE_PASSED':pools.quarantineReason||'NO_ELIGIBLE_EXERCISES',candidate:null,probability:null};
    }
    const skills=[...new Set(pools.first.map(i=>i.skillId))];
    const supported=skills.every(s=>release.qualified_skill_ids.includes(s));
    const valid=supported&&advice?.fallback===null&&advice.modelVersion===release.pins.model_version
        &&Object.keys(advice.probabilities).length===skills.length
        &&skills.every(s=>Number.isFinite(advice.probabilities[s])&&advice.probabilities[s]!>=0&&advice.probabilities[s]!<=1);
    if(valid){
        const order=new Map(release.skill_ids.map((s,i)=>[s,i]));
        const candidate=[...pools.first].sort((a,b)=>advice!.probabilities[b.skillId]!-advice!.probabilities[a.skillId]!
            ||order.get(a.skillId)!-order.get(b.skillId)!||ruleOrder(a,b))[0]!;
        return {mode:'PALNET_ADVISORY' as const,reason:'FIRST_OPPORTUNITY_MODEL_RANKED',candidate,probability:advice!.probabilities[candidate.skillId]!};
    }
    return {mode:'RULE_BASED' as const,reason:!supported?'SKILL_SUPPORT_GAP':fallback,candidate:[...pools.first].sort(ruleOrder)[0]!,probability:null};
}
