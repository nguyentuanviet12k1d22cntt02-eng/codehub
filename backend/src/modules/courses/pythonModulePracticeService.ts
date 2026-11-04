import {randomUUID} from 'crypto';
import {moduleRelease,moduleEnabled,ModuleContext} from '../onboarding/palnetModuleRelease';
import {requestModulePracticeAdvice,ModuleAdvice} from '../onboarding/palnetModuleClient';
import {ModuleSnapshot} from '../onboarding/palnetModuleHistory';
import {PracticePrincipal,PracticeLesson,PracticeHttpError,checkPracticeAccess,contextForPractice,loadPracticeSelectionSnapshot,SelectionSnapshot} from './pythonModulePracticeSnapshot';
import {practicePools,selectPractice,SELECTION_POLICY,ModulePracticeDecision} from './pythonModulePracticePolicy';

type Advise=(snapshot:ModuleSnapshot,targets:string[],decisionId:string)=>Promise<ModuleAdvice>;
type Trace={decisionId:string;inputSha256:string|null;historyRevision:string|null;selectionRevision:string|null;modelVersion:string|null;reason:string};
export interface PracticeDependencies {advise?:Advise;trace?:(value:Trace)=>void}
function normalizedFallback(reason:string|null):string {
    if(!reason)return 'MODEL_CONTRACT_INVALID';
    if(reason==='MODEL_DISABLED'||reason==='COLD_START'||reason==='SKILL_SUPPORT_GAP'||reason==='HISTORY_UNVERIFIED')return reason;
    if(reason.includes('CONTRACT')||reason.includes('SIGNATURE'))return 'MODEL_CONTRACT_INVALID';
    return 'MODEL_UNAVAILABLE';
}
function baseDecision(context:ModuleContext):ModulePracticeDecision {
    const r=moduleRelease();return {schemaVersion:'module-practice-recommendation/2.0',language:'PYTHON',mode:'MANUAL',reason:'CATALOG_REVIEW_REQUIRED',decisionId:randomUUID(),context,cutoff:new Date().toISOString(),policyVersion:SELECTION_POLICY,mappingVersion:r.pins.mapping_version!,catalogRevision:null,historyRevision:null,selectionRevision:null,exerciseId:null,contentVersion:null,title:null,difficulty:null,skillId:null,availableCount:0,firstOpportunityCount:0,retryCount:0,passedCount:0,quarantinedCount:0,totalCount:0,modelVersion:null,checkpointSha256:null,manifestSha256:null,graphVersion:null,featureVersion:null,modelPolicyVersion:null,predictedCorrectness:null,evaluationStatus:null};
}
function buildDecision(snapshot:SelectionSnapshot,advice:ModuleAdvice|null,fallback:string,id:string):ModulePracticeDecision {
    const pools=practicePools(snapshot.items,snapshot.attempts),choice=selectPractice(pools,moduleRelease(),advice,fallback),item=choice.candidate;
    const model=choice.mode==='PALNET_ADVISORY'?advice:null;
    return {...baseDecision(snapshot.history.context),mode:choice.mode,reason:choice.reason,decisionId:id,cutoff:snapshot.history.cutoff,catalogRevision:snapshot.history.catalogRevision,historyRevision:snapshot.history.historyRevision,selectionRevision:snapshot.selectionRevision,exerciseId:item?.id??null,contentVersion:item?.contentVersion??null,title:item?.title??null,difficulty:item?.difficulty??null,skillId:item?.skillId??null,availableCount:pools.first.length+pools.retry.length,firstOpportunityCount:pools.first.length,retryCount:pools.retry.length,passedCount:pools.passed,quarantinedCount:pools.quarantined,totalCount:pools.total,modelVersion:model?.modelVersion??null,checkpointSha256:model?.checkpointSha256??null,manifestSha256:model?.manifestSha256??null,graphVersion:model?.graphVersion??null,featureVersion:model?.featureVersion??null,modelPolicyVersion:model?.policyVersion??null,predictedCorrectness:choice.probability??null,evaluationStatus:model?'SYNTHETIC_EXPLORATORY':null};
}

/** Stateless decisions: no saved decision/cache can overwrite a newer request. P5 owns browser response ordering. */
export async function getPythonModulePracticeDecision(db:any,principal:PracticePrincipal,lesson:PracticeLesson,deps:PracticeDependencies={}):Promise<ModulePracticeDecision> {
    checkPracticeAccess(principal,lesson);const context=contextForPractice(lesson),release=moduleRelease();
    let snapshot:SelectionSnapshot;
    try{snapshot=await loadPracticeSelectionSnapshot(db,principal,context);}catch(error){if(error instanceof PracticeHttpError)throw error;return {...baseDecision(context),reason:error instanceof Error&&error.message==='CATALOG_REVIEW_REQUIRED'?'CATALOG_REVIEW_REQUIRED':'HISTORY_UNVERIFIED'};}
    for(let attempt=0;attempt<2;attempt++){
        const id=randomUUID(),pools=practicePools(snapshot.items,snapshot.attempts);
        if(!pools.first.length)return buildDecision(snapshot,null,'COLD_START',id);
        const targets=[...new Set(pools.first.map(i=>i.skillId))];
        if(!targets.every(s=>release.qualified_skill_ids.includes(s)))return buildDecision(snapshot,null,'SKILL_SUPPORT_GAP',id);
        let enabled=false;try{enabled=moduleEnabled(context.module_code);}catch{return buildDecision(snapshot,null,'MODEL_CONTRACT_INVALID',id);}
        if(!enabled)return buildDecision(snapshot,null,'MODEL_DISABLED',id);
        if(!snapshot.history.summary.history_count)return buildDecision(snapshot,null,snapshot.history.rawEventCount?'HISTORY_UNVERIFIED':'COLD_START',id);
        let advice:ModuleAdvice|null=null;
        try{advice=await (deps.advise||requestModulePracticeAdvice)(snapshot.history,targets,id);}catch{}
        // No database transaction is held while awaiting the AI. Re-read after it resolves.
        let latest:SelectionSnapshot;
        try{latest=await loadPracticeSelectionSnapshot(db,principal,context);}catch(error){if(error instanceof PracticeHttpError)throw error;return {...baseDecision(context),reason:error instanceof Error&&error.message==='CATALOG_REVIEW_REQUIRED'?'CATALOG_REVIEW_REQUIRED':'HISTORY_UNVERIFIED'};}
        if(latest.history.catalogRevision!==snapshot.history.catalogRevision||latest.history.historyRevision!==snapshot.history.historyRevision||latest.selectionRevision!==snapshot.selectionRevision){
            snapshot=latest;if(attempt===0)continue;throw new PracticeHttpError(409,'DECISION_STALE_RETRY');
        }
        const result=buildDecision(snapshot,advice,normalizedFallback(advice?.fallback??null),id);
        const trace:Trace={decisionId:id,inputSha256:advice?.inputSha256??null,historyRevision:result.historyRevision,selectionRevision:result.selectionRevision,modelVersion:result.modelVersion,reason:result.reason};
        if(deps.trace)deps.trace(trace);else console.info('[module-practice-decision]',JSON.stringify(trace));
        return result;
    }
    throw new PracticeHttpError(409,'DECISION_STALE_RETRY');
}
