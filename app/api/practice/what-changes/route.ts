import { changeFeedbackRequest, getChangeFeedback } from '../../../../lib/what-changes-feedback';
import { changeExercises } from '../../../../lib/what-changes';
import { feedbackProvider } from '../../../../lib/feedback-service';
export const maxDuration = 120;
const headers = { 'Cache-Control': 'no-store' };
export async function POST(request: Request) {
  const parsed = changeFeedbackRequest.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !changeExercises.some(e => e.id === parsed.data.exerciseId)) {
    return Response.json({ error: 'Choose an available comparison and write at least 20 characters of your own explanation.' }, { status: 400, headers });
  }
  if (!process.env.FIREWORKS_API_KEY?.trim()) {
    return Response.json({ error: 'AI feedback is unavailable. Your notes are still here; use the authored reading and complication.' }, { status: 503, headers });
  }
  try {
    const result = await getChangeFeedback(parsed.data);
    return Response.json({ ...result, model: feedbackProvider().name }, { headers });
  } catch {
    // Never log student writing, provider responses, or request bodies.
    return Response.json({ error: 'AI feedback could not be completed. Your notes are still here; use the authored reading or try again.' }, { status: 502, headers });
  }
}
