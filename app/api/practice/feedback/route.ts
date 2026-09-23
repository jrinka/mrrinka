import { z } from "zod";
import { feedbackProvider, policyVersion, safeFeedback } from "@/lib/feedback-service";
export const maxDuration = 120;
const requestSchema = z.object({ passage:z.string().trim().min(40).max(6000), response:z.string().trim().min(1).max(8000), previousResponse:z.string().max(8000).default("") }).strict();
export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({error:"Passage or response is invalid"}, {status:400});
  try {
    const result = await safeFeedback({kind:"passage", evidence:parsed.data.passage, draft:parsed.data.response, previousDraft:parsed.data.previousResponse});
    return Response.json({feedback:result.refused ? result.message : result.feedback, refused:result.refused, model:feedbackProvider().name, policyVersion, createdAt:new Date().toISOString()}, {headers:{"Cache-Control":"no-store"}});
  } catch (error) {
    console.error("Feedback failure", error instanceof SyntaxError ? "Invalid model JSON" : error instanceof Error && error.name === "ZodError" ? "Invalid model schema" : error instanceof Error ? error.message : "Unknown error");
    return Response.json({error:"Feedback could not be safely completed. Please try again."}, {status:502});
  }
}
