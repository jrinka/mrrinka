import { askModel, closeAnalysisProvider, type ModelObservation } from "./feedback-service";
import { closeFeedbackFailureCode } from "./close-analysis";
const stages=["scope","coaching","output-review"] as const;
type Stage=typeof stages[number];
export type CloseDiagnostic={requestId:string;event:"stage"|"request";stage:Stage;outcome:string;elapsedMs:number;reasoningEffort?:"low";timeoutMs?:number;maxTokens?:number;httpStatus?:number;finishReason?:ModelObservation["finishReason"];usage?:ModelObservation["usage"];failureCode?:ReturnType<typeof closeFeedbackFailureCode>};
export function createCloseAnalysisTrace(requestId:string, log:(event:CloseDiagnostic)=>void=event=>console.info("Close Analysis diagnostic",JSON.stringify(event)), transport=askModel) {
 let index=0;
 let stage:Stage="scope";
 const started=performance.now();
 const emit=(event:CloseDiagnostic)=>{try{log(event);}catch{/* Logging cannot block feedback. */}};
 const ask:typeof askModel=async(system,material,maxTokens=4096)=>{
   stage=stages[index++];
   if(!stage) throw new Error("Unexpected feedback stage");
   const currentStage=stage;
   const timeoutMs=stage==="coaching"?50000:30000;
   return transport(system,material,maxTokens,timeoutMs,closeAnalysisProvider(),observation=>emit({requestId,event:"stage",stage:currentStage,timeoutMs,maxTokens,reasoningEffort:"low",...observation}),{reasoningEffort:"low"});
 };
 return {ask,finish(outcome:"feedback"|"refused"|"failed",error?:unknown){emit({requestId,event:"request",stage,outcome,elapsedMs:Math.round(performance.now()-started),...(error===undefined?{}:{failureCode:closeFeedbackFailureCode(error)})});}};
}
