import { model, policyVersion, refineryRequest, safeFeedback } from "@/lib/feedback-service";
export const maxDuration = 120;
export async function POST(request: Request) {
  const parsed = refineryRequest.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({error:"Add your own draft, supporting evidence, course, and acknowledgment."}, {status:400});
  try {
    return Response.json({...await safeFeedback(parsed.data), model, policyVersion, createdAt:new Date().toISOString()}, {headers:{"Cache-Control":"no-store"}});
  } catch (error) {
    console.error("Feedback failure", error instanceof SyntaxError ? "Invalid model JSON" : error instanceof Error && error.name === "ZodError" ? "Invalid model schema" : error instanceof Error ? error.message : "Unknown error");
    return Response.json({error:"Feedback could not be safely completed. Your draft is still here; please try again."}, {status:502});
  }
}
