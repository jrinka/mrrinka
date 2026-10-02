import { closeFeedbackFailureCode, closeRequest } from "@/lib/close-analysis";
import { closeAnalysisLiveEnabled, closeSources } from "@/lib/close-analysis-sources";
import { askCloseAnalysisModel, closeAnalysisProvider, closeAnalysisPolicyVersion, safeFeedback } from "@/lib/feedback-service";
export const maxDuration=120;
export async function POST(request:Request){
 const parsed=closeRequest.safeParse(await request.json().catch(()=>null));
 if(!parsed.success) return Response.json({error:"Choose one feature, add precise evidence and your own short paragraph, and describe your focus."},{status:400});
 const input=parsed.data;
 const source=(await closeSources()).find(source=>source.id===input.sourceId);
 if(!source) return Response.json({error:"Choose an available source."},{status:400});
 if(!closeAnalysisLiveEnabled()) return Response.json({error:"AI feedback is currently unavailable. Your writing is still here. Use the self-review questions and download your record."},{status:503});
 try {
 const result=await safeFeedback({kind:"analysis",course:"language-literature",evidence:`Creator: ${source.credit}\nContext: ${source.context}\nSource text / neutral description (no image access): ${source.transcript}\nStudent selection: ${input.area}\nFeature: ${input.feature}\nStudent evidence (not independently verified): ${input.evidence}`,draft:input.draft,previousDraft:input.previousDraft,reflection:input.reflection,prompt:source.prompt,closeAnalysis:true}, askCloseAnalysisModel);
 return Response.json({...result,model:closeAnalysisProvider().name,policyVersion:closeAnalysisPolicyVersion,createdAt:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
 } catch (error) {const failureCode=closeFeedbackFailureCode(error);console.warn("Close Analysis feedback unavailable",failureCode);return Response.json({failureCode,error:"Feedback could not be safely completed. Your writing is still here; try again."},{status:502});}
}
