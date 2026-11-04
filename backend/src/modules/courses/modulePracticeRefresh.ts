import {moduleRelease} from '../onboarding/palnetModuleRelease';
/** Call only after the submission transaction commits. This hint does not itself trigger inference. */
export function modulePracticeRefreshHint(language:string,bankId:string,submissionId:string,contentVersion?:string) {
    if(language!=='PYTHON')return null;
    try{
        const context=moduleRelease().banks.find(b=>b.bank_id===bankId);if(!context)return null;
        return {schemaVersion:'module-practice-refresh/1.0',bankId,submissionId,refreshRequired:true,
            ...(contentVersion&&/^python-content-v1:[a-f0-9]{64}$/.test(contentVersion)?{contentVersion}:{}),
            recommendationUrl:'/api/courses/module-practice/'+encodeURIComponent(bankId)+'/recommendation'};
    }catch{return null;}
}
