'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
process.env.JWT_SECRET=crypto.randomBytes(32).toString('hex');
const f=require('./palnetP4Fixtures.cjs');
function controller(db,mail){
 const original=global.setInterval;global.setInterval=()=>({unref(){}});
 try{return f.loadController(db,'../src/modules/auth/authController',{'/infrastructure/email/emailService.ts':{sendVerificationOtp:mail}});}
 finally{global.setInterval=original;}
}
test('public registration rejects ADMIN before database access or OTP delivery',async()=>{
 let dbCalls=0,mails=0;
 const db={user:{findFirst:async()=>{dbCalls++;return null;}}};
 const c=controller(db,async()=>{mails++;return true;}),res=f.response(),log=console.error;
 try{console.error=()=>{};await c.register({body:{username:'synthetic-check',email:'synthetic@example.invalid',password:crypto.randomBytes(16).toString('hex'),role:'ADMIN'}},res,()=>{});}
 finally{console.error=log;}
 assert.equal(res.code,400);assert.equal(dbCalls,0);assert.equal(mails,0);
});
test('student registration still reaches the OTP flow with mocked delivery and no persisted user',async()=>{
 let reads=0,mails=0;
 const db={user:{findFirst:async()=>{reads++;return null;}}};
 const c=controller(db,async()=>{mails++;return true;}),res=f.response();
 await c.register({body:{username:'synthetic-check',email:'synthetic@example.invalid',password:crypto.randomBytes(16).toString('hex'),role:'STUDENT'}},res,()=>{});
 assert.equal(res.code,200);assert.equal(res.body.requireOtp,true);assert.equal(reads,1);assert.equal(mails,1);
});
test('release metadata cannot be mutated across concurrent decisions',()=>{
 const {moduleRelease}=require('../src/modules/onboarding/palnetModuleRelease');
 const r=moduleRelease(),skill=r.rows[0].skill_id;
 assert.throws(()=>{r.rows[0].skill_id='UNTRUSTED';},TypeError);
 assert.equal(moduleRelease().rows[0].skill_id,skill);
});
