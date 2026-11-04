import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import {parsePracticeRecommendation,RecommendationError} from './modulePracticeContracts';
export * from './modulePracticeContracts';

export async function getModulePracticeRecommendation(bankId:string,signal?:AbortSignal) {
    const token=localStorage.getItem('token');if(!token)throw new RecommendationError('AUTH_REQUIRED');
    try{
        const response=await axios.get(`${API_BASE_URL}/api/courses/module-practice/${encodeURIComponent(bankId)}/recommendation`,{headers:{Authorization:`Bearer ${token}`},signal,timeout:20000});
        if(localStorage.getItem('token')!==token)throw new RecommendationError('SESSION_CHANGED');
        return parsePracticeRecommendation(response.data);
    }catch(error){
        if(signal?.aborted||axios.isCancel(error)||error instanceof RecommendationError)throw error;
        if(axios.isAxiosError(error)){
            if(error.response?.status===409&&['AMBIGUOUS_MODULE_PRACTICE','MODULE_CONTEXT_CHANGED'].includes(error.response.data?.code))throw new RecommendationError('BANK_CONTEXT_CHANGED');
            const code=({401:'AUTH_REQUIRED',403:'ACCESS_DENIED',404:'BANK_NOT_FOUND',409:'STALE_DECISION'} as const)[error.response?.status as 401|403|404|409];
            throw new RecommendationError(code??(error.code==='ECONNABORTED'?'REQUEST_TIMEOUT':'SERVICE_UNAVAILABLE'));
        }
        throw new RecommendationError('SERVICE_UNAVAILABLE');
    }
}
