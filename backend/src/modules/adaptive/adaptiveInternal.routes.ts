import express, { Router } from 'express';
import { verifyInternal } from './adaptiveEvidence';
import { runExercise } from './adaptiveRunner';

export const adaptiveInternalRouter=Router();
adaptiveInternalRouter.post('/validate',express.raw({type:'application/json',limit:'512kb'}),async(req,res)=>{
    if(!Buffer.isBuffer(req.body)||!verifyInternal(req.body,String(req.headers['x-adaptive-time']||''),String(req.headers['x-adaptive-signature']||''))) {
        res.status(401).json({error:'INVALID_INTERNAL_SIGNATURE'});return;
    }
    try {
        const payload=JSON.parse(req.body.toString('utf8'));
        res.json(await runExercise(payload.exercise,payload.specification));
    } catch(error:any) {
        res.status(400).json({passed:false,status:'INVALID_REQUEST',errors:[error.name==='ZodError'?'CONTRACT_INVALID':error.message],test_results:[]});
    }
});
