import {useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {getModulePracticeRecommendation} from '../services/modulePracticeRecommendation';
import {bindPracticeRecommendation,RecommendationError} from '../services/modulePracticeContracts';
import type {ModulePracticeRecommendation,PracticeBank,RecommendationErrorCode} from '../services/modulePracticeContracts';
import {LatestPracticeRequest} from '../services/latestPracticeRequest';
export interface PracticeRecommendationState {status:'idle'|'loading'|'ready'|'error';value:ModulePracticeRecommendation|null;error:RecommendationErrorCode|null}
export function usePracticeRecommendation(scope:string){
    const [state,setState]=useState<PracticeRecommendationState>({status:'idle',value:null,error:null});
    const gate=useRef(new LatestPracticeRequest()),currentScope=useRef(scope);
    useLayoutEffect(()=>{currentScope.current=scope;},[scope]);
    useEffect(()=>()=>gate.current.cancel(),[scope]);
    const invalidate=useCallback(()=>{gate.current.cancel();setState({status:'idle',value:null,error:null});},[]);
    const refresh=useCallback(async(bank:PracticeBank,passed:ReadonlyMap<string,string>=new Map(),requestedBankId=bank.id)=>{
        const ticket=gate.current.begin(bank.id),scopeAtStart=scope;
        setState({status:'loading',value:null,error:null});
        try{
            const raw=await getModulePracticeRecommendation(requestedBankId,ticket.signal);
            if(!gate.current.current(ticket)||currentScope.current!==scopeAtStart)return null;
            const value=bindPracticeRecommendation(raw,bank,passed);
            if(!gate.current.accept(ticket,value))throw new RecommendationError('STALE_DECISION');
            setState({status:'ready',value,error:null});return value;
        }catch(error){
            if(!gate.current.current(ticket)||currentScope.current!==scopeAtStart)return null;
            const code=error instanceof RecommendationError?error.code:'SERVICE_UNAVAILABLE';
            setState({status:'error',value:null,error:code});return null;
        }
    },[scope]);
    const markCommitted=useCallback((bankId:string)=>gate.current.markCommitted(bankId),[]);
    return {state,refresh,invalidate,markCommitted};
}
