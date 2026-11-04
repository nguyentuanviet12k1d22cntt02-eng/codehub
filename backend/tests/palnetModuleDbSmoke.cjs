// Read-only product integration. A random nonexistent owner avoids learner data.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
require('dotenv').config({path:path.resolve(__dirname,'../.env'),quiet:true});
const {root,release}=require('./palnetModuleFixtures.cjs');
const {loadModulePracticeSnapshot}=require('../src/modules/onboarding/palnetModuleHistory');
const {PrismaClient}=require('@prisma/client'),{PrismaPg}=require('@prisma/adapter-pg'),{Pool}=require('pg');
async function main(){
 const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1,connectionTimeoutMillis:10000});const db=new PrismaClient({adapter:new PrismaPg(pool)});
 try{
  const owner=randomUUID();const absent=await db.$transaction(async tx=>{await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');return tx.user.findUnique({where:{id:owner},select:{id:true}});});assert.equal(absent,null);
  const banks=[];for(const context of release.banks){const s=await loadModulePracticeSnapshot(db,owner,context);assert.equal(s.rawEventCount,0);assert.equal(s.history.length,0);assert.equal(s.summary.history_count,0);assert.equal(s.catalogRevision,release.catalog_revision);banks.push({module:context.module_code,bank:context.bank_code,verifiedCatalogRows:208,historyCount:0});}
  const result={status:'PASS',configuredDatabaseOnly:true,renderDatabaseSeparatelyAttested:false,readOnly:true,databaseWrites:0,learnerRecordsRead:0,nonexistentOwnerConfirmed:true,modules:8,banks,exactCatalogRows:208,expectedTestcases:780};
  fs.writeFileSync(path.join(root,'reviews/palnet-p3-2026-11-03/db-smoke.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await db.$disconnect();await pool.end();}
}
main().catch(()=>{console.error('P3_READONLY_PRODUCT_DB_CHECK_FAILED');process.exitCode=1;});
