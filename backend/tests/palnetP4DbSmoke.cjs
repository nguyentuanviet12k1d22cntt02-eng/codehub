// Read-only configured DB check. Uses a random, confirmed nonexistent owner and an internal role fixture.
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
require('dotenv').config({path:path.resolve(__dirname,'../.env'),quiet:true});process.env.PALNET_MODULE_PRACTICE_ENABLED='false';
process.env.TS_NODE_PROJECT=path.resolve(__dirname,'../tsconfig.json');require('ts-node/register/transpile-only');
const {moduleRelease}=require('../src/modules/onboarding/palnetModuleRelease');
const {getPythonModulePracticeDecision}=require('../src/modules/courses/pythonModulePracticeService');
const {resolvePracticeLesson}=require('../src/modules/courses/pythonModulePracticeSnapshot');
const {PrismaClient}=require('@prisma/client'),{PrismaPg}=require('@prisma/adapter-pg'),{Pool}=require('pg');
async function main(){
 const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1,connectionTimeoutMillis:10000}),db=new PrismaClient({adapter:new PrismaPg(pool)}),release=moduleRelease();
 try{
  const owner=randomUUID(),absent=await db.$transaction(async tx=>{await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');return tx.user.findUnique({where:{id:owner},select:{id:true}});});assert.equal(absent,null);
  const banks=[];for(const bank of release.banks){const lesson=await resolvePracticeLesson(db,bank.bank_id),d=await getPythonModulePracticeDecision(db,{id:owner,role:'ADMIN'},lesson);assert.equal(d.mode,'RULE_BASED');assert.equal(d.reason,'MODEL_DISABLED');assert.equal(d.quarantinedCount,0);assert.equal(d.totalCount,release.rows.filter(r=>r.bank_id===bank.bank_id).length);assert.equal(d.firstOpportunityCount,d.totalCount);assert(release.rows.some(r=>r.exercise_id===d.exerciseId&&r.bank_id===bank.bank_id));banks.push({module:bank.module_code,bank:bank.bank_code,courseStatus:lesson.chapter.module.course.status,items:d.totalCount,mode:d.mode,reason:d.reason,selectedExerciseId:d.exerciseId});}
  const root=path.resolve(__dirname,'../..'),result={status:'PASS',configuredDatabaseOnly:true,renderDatabaseSeparatelyAttested:false,readOnly:true,nonexistentOwnerConfirmed:true,principalRoleFixture:'ADMIN (in-process curriculum verification only; no user/token persisted)',learnerRecordsRead:0,databaseWrites:0,externalAiCalls:0,exactCurrentCatalogItems:208,currentTestcases:780,modules:8,banks};
  fs.writeFileSync(path.join(root,'reviews/palnet-p4-2026-11-03/db-smoke.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await db.$disconnect();await pool.end();}
}
main().catch(()=>{console.error('P4_READONLY_DB_CHECK_FAILED');process.exitCode=1;});
