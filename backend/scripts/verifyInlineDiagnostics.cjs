// Real EC2 grading + optional live model, limited to an existing isolated QA account.
require('dotenv').config({quiet:true});
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {randomUUID}=require('node:crypto'),jwt=require('jsonwebtoken');
const {prisma}=require('../dist/infrastructure/database/prisma');
const repo=require('../dist/modules/adaptive/adaptiveRepository');
const {runExercise}=require('../dist/modules/adaptive/adaptiveRunner');
const {evidencePracticeGuidance}=require('../dist/modules/adaptive/practiceGuidance');
const fixture=require('../../reviews/ai-pipeline/measurements/generation-reliability-2026-10-24.json');
const output=path.resolve(__dirname,'../../reviews/ai-pipeline/measurements/inline-diagnostics-2026-10-24.json');
async function main(){
    const user=await prisma.user.findUnique({where:{id:fixture.fixture_user_id}});
    assert.ok(user?.username.startsWith('reliability_qa_'));
    const token=jwt.sign({id:user.id,username:user.username,role:'STUDENT'},process.env.JWT_SECRET,{expiresIn:'1h'});
    const api=async(route,body)=>{
        const response=await fetch('http://127.0.0.1:3001/api/learning-path/'+route,{method:'POST',
            headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(body),signal:AbortSignal.timeout(70000)});
        const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));return data;
    };
    const run=await repo.getRun(fixture.root_trace_id,user.id);
    const receipt={kind:'INLINE_DIAGNOSTICS_QA',at:new Date().toISOString(),path_id:run.path_id,cases:[]};
    for(const [kind,code] of [['syntax','print("Hello)'],['logic','text = input()\nfor ch in text:\n    pass'],['success',run.artifact.reference_solution]]){
        const submissionId=randomUUID();
        const grading=await api('submit-exercise',{exerciseId:run.exercise_id,submissionId,code});
        assert.equal(grading.guidance.analysisKind,kind);
        let feedback;
        if(kind==='syntax'){
            assert.equal(grading.guidance.diagnostic.line,1);assert.equal(grading.guidance.diagnostic.column,7);
            assert.doesNotMatch(grading.guidance.reason+' '+grading.guidance.hint,/for|vòng lặp/);
            feedback=await api('practice-guidance',{submissionId});
            assert.deepEqual(feedback.guidance,grading.guidance);
        }else if(kind==='logic'){
            feedback=await api('practice-guidance',{submissionId});
            if(feedback.guidance.diagnostic)assert.equal(feedback.guidance.diagnostic.line,3);
        }else assert.equal(grading.isPassed,true);
        receipt.cases.push({kind,submissionId,grading,feedback});
        fs.writeFileSync(output,JSON.stringify(receipt,null,2));
        console.log(JSON.stringify({kind,guidance:feedback?.guidance||grading.guidance}));
    }
    // These direct sandbox checks create no course, exercise, mastery or submission records.
    receipt.language_syntax=[];
    for(const [language,code] of [['javascript','console.log("Hello);'],['cpp','#include <iostream>\nint main() { std::cout << "Hello; }']]){
        const spec={language,target_concept:'QA',difficulty:'EASY',execution:{mode:'stdio',entrypoint:'solution',comparator:'text'},required_constructs:['for'],forbidden_constructs:[]};
        const draft={reference_solution:code,starter_code:'',test_cases:Array.from({length:4},()=>({input:'',expected_output:'',is_hidden:false,category:'normal',explanation:'QA'}))};
        const result=await runExercise(draft,spec,code);
        const guidance=evidencePracticeGuidance(code,result,{artifact:{language,spec_snapshot:spec}});
        assert.equal(guidance.analysisKind,'syntax');assert.ok(guidance.diagnostic?.line);
        receipt.language_syntax.push({language,guidance,status:result.status,stderr:result.test_results[0]?.stderr});
        console.log(JSON.stringify({language,guidance}));
    }
    receipt.status='PASSED';fs.writeFileSync(output,JSON.stringify(receipt,null,2));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;}).finally(async()=>{await prisma.$disconnect();process.exit(process.exitCode||0);});
