// Uses the existing isolated QA account only. Never runs against a learner.
require('dotenv').config({quiet:true});
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const {randomUUID} = require('node:crypto');
const jwt = require('jsonwebtoken');
const {prisma} = require('../dist/infrastructure/database/prisma');
const repo = require('../dist/modules/adaptive/adaptiveRepository');
const fixtureFile = path.resolve(__dirname,'../../reviews/ai-pipeline/measurements/generation-reliability-2026-10-24.json');
const outputFile = path.resolve(__dirname,'../../reviews/ai-pipeline/measurements/practice-guidance-resilience-2026-10-24.json');
const fixture = JSON.parse(fs.readFileSync(fixtureFile,'utf8'));
let receipt, token;
async function load() {
    const user = await prisma.user.findUnique({where:{id:fixture.fixture_user_id}});
    assert.ok(user?.username.startsWith('reliability_qa_'));
    token = jwt.sign({id:user.id,username:user.username,role:'STUDENT'},process.env.JWT_SECRET,{expiresIn:'2h'});
    return user;
}
async function api(route, body) {
    const started = Date.now();
    const response = await fetch('http://127.0.0.1:3001/api/learning-path/'+route,{
        method:'POST', headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
        body:JSON.stringify(body),signal:AbortSignal.timeout(70000),
    });
    const data=await response.json();
    assert.equal(response.status,200,JSON.stringify(data));
    assert.equal(data.success,true);
    assert.ok(data.guidance?.title && data.guidance?.reason && data.guidance?.hint);
    return {data,elapsed_ms:Date.now()-started};
}
async function verify() {
    await load();
    if(process.argv.includes('--online')) {
        receipt=JSON.parse(fs.readFileSync(outputFile,'utf8'));
        receipt.online=[];
        for(const item of receipt.offline.filter(item=>['wrong','correct'].includes(item.kind))) {
            const result=await api('practice-guidance',{submissionId:item.submission_id});
            assert.equal(result.data.submissionId,item.submission_id);
            receipt.online.push({kind:item.kind,...result});
        }
    } else {
        const run=await repo.getRun(fixture.root_trace_id,fixture.fixture_user_id);
        assert.ok(run?.path_id && run.artifact?.qc_status==='VERIFIED');
        receipt={kind:'PRACTICE_GUIDANCE_RESILIENCE_QA',fixture_user_id:fixture.fixture_user_id,
            path_id:run.path_id,exercise_id:run.exercise_id,started_at:new Date().toISOString(),offline:[]};
        for(const [kind,code] of [
            ['wrong','text = input()\nfor ch in text:\n    pass'],
            ['missing-for','print(input())'],
            ['syntax','for ch in input()\n    print(ch)'],
            ['correct',run.artifact.reference_solution],
        ]) {
            const submissionId=randomUUID();
            const grade=await api('submit-exercise',{exerciseId:run.exercise_id,submissionId,code});
            assert.equal(grade.data.guidance.source,'EVIDENCE');
            assert.equal(grade.data.isPassed,kind==='correct');
            const feedback=await api('practice-guidance',{submissionId});
            assert.equal(feedback.data.submissionId,submissionId);
            assert.equal(feedback.data.guidance.source,'EVIDENCE');
            assert.deepEqual(feedback.data.guidance,grade.data.guidance);
            receipt.offline.push({kind,submission_id:submissionId,grade,feedback});
            fs.writeFileSync(outputFile,JSON.stringify(receipt,null,2));
            console.log(JSON.stringify({kind,source:feedback.data.guidance.source,title:feedback.data.guidance.title,
                grading_ms:grade.elapsed_ms,analysis_ms:feedback.elapsed_ms}));
        }
    }
    receipt.ended_at=new Date().toISOString();receipt.status='PASSED';
    fs.writeFileSync(outputFile,JSON.stringify(receipt,null,2));
    console.log(JSON.stringify({status:receipt.status,online:receipt.online?.map(r=>({kind:r.kind,source:r.data.guidance.source,elapsed_ms:r.elapsed_ms}))}));
}
async function serveOffline() {
    await load();
    repo.dueRetries=async()=>[]; // Fault injection is limited to this QA process.
    process.env.PORT='3001';
    process.env.AI_SERVICE_URL='http://127.0.0.1:9'; // No provider call; real EC2 grading is unchanged.
    require('../dist/app');
}
const serving=process.argv.includes('--serve-offline');
(serving?serveOffline():verify()).catch(error=>{console.error(error.message);process.exitCode=1;})
    .finally(async()=>{if(!serving){await prisma.$disconnect();process.exit(process.exitCode||0);}});
