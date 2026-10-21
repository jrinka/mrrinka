import { inquiryFeedback, workshopRequest } from "@/lib/inquiry-workshop";
import { feedbackProvider, hleProvider } from "@/lib/feedback-service";
import { hlePolicyVersion } from "@/lib/hle-coaching";
export const maxDuration=120;
export async function POST(request:Request){
  const parsed=workshopRequest.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message??"Check the required fields."},{status:400});
  try{
    return Response.json({...await inquiryFeedback(parsed.data),model:(parsed.data.kind === "line-of-inquiry" ? hleProvider() : feedbackProvider()).name,policyVersion:parsed.data.kind === "line-of-inquiry" ? hlePolicyVersion : "2026-10-21-inquiry-v4",createdAt:new Date().toISOString()},{headers:{"Cache-Control":"no-store"}});
  }catch(error){
    console.error("Inquiry feedback failure",error instanceof SyntaxError?"Invalid model JSON":error instanceof Error&&error.name==="ZodError"?"Invalid model schema":error instanceof Error?error.message:"Unknown error");
    return Response.json({error:"The feedback service did not complete its checks. Your writing is still here. Please try again."},{status:502});
  }
}
