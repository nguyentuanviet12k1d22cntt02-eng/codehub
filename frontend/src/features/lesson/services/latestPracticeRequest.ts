import {isPythonPracticeDecision} from './modulePracticeContracts';
import type {ModulePracticeRecommendation} from './modulePracticeContracts';
export class LatestPracticeRequest {
    private serial=0;
    private bank='';
    private controller:AbortController|null=null;
    private cutoff=-Infinity;
    private lastSelectionRevision:string|null=null;
    private preCommitRevision:string|null=null;
    begin(bank:string){
        this.cancel();if(this.bank!==bank){this.cutoff=-Infinity;this.lastSelectionRevision=null;this.preCommitRevision=null;this.bank=bank;}
        const controller=new AbortController();this.controller=controller;
        return {serial:this.serial,bank,signal:controller.signal};
    }
    current(ticket:{serial:number;bank:string;signal:AbortSignal}){return ticket.serial===this.serial&&ticket.bank===this.bank&&!ticket.signal.aborted;}
    accept(ticket:{serial:number;bank:string;signal:AbortSignal},value:ModulePracticeRecommendation){
        if(!this.current(ticket))return false;
        if(isPythonPracticeDecision(value)){
            const cutoff=Date.parse(value.cutoff);
            if(cutoff<this.cutoff||(this.preCommitRevision!==null&&value.selectionRevision===this.preCommitRevision))return false;
            this.cutoff=cutoff;
            if(value.selectionRevision!==null){this.lastSelectionRevision=value.selectionRevision;this.preCommitRevision=null;}
        }
        return true;
    }
    markCommitted(bank:string){if(this.bank===bank){this.preCommitRevision=this.lastSelectionRevision;this.cancel();}}
    cancel(){this.serial++;this.controller?.abort();this.controller=null;}
}
