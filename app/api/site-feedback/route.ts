import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieOptions, sameOrigin } from "@/lib/auth";
import { feedbackCookie, feedbackKey, feedbackRequest, feedbackTargets } from "@/lib/site-feedback";
import { feedbackProvider } from "@/lib/feedback-service";
import { r2Config } from "@/lib/r2";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json({ error: "Invalid request type." }, { status: 415 });
  if (Number(request.headers.get("content-length")) > 512)
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const raw = await request.text();
  if (raw.length > 512) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return NextResponse.json({ error: "Invalid feedback." }, { status: 400 }); }
  const parsed = feedbackRequest.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
  const { target, choice } = parsed.data;
  const existing = (await cookies()).get(feedbackCookie)?.value;
  const visitor = existing && /^[0-9a-f-]{36}$/.test(existing) ? existing : randomUUID();
  const now = new Date();
  const model = feedbackTargets[target].type === "ai" ? feedbackProvider().name : "none";
  const secret = process.env.SESSION_SECRET;
  if (!secret) return NextResponse.json({ error: "Feedback is unavailable." }, { status: 503 });
  try {
    const { client, bucket } = r2Config();
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: feedbackKey(now, target, visitor, secret),
      Body: JSON.stringify({ target, choice, model, createdAt: now.toISOString() }),
      ContentType: "application/json",
      CacheControl: "no-store",
      IfNoneMatch: "*",
    }));
    const response = NextResponse.json({ saved: true });
    response.cookies.set(feedbackCookie, visitor, cookieOptions(60 * 60 * 24 * 365));
    return response;
  } catch (error) {
    if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 412) {
      const response = NextResponse.json({ saved: false, alreadyCounted: true });
      response.cookies.set(feedbackCookie, visitor, cookieOptions(60 * 60 * 24 * 365));
      return response;
    }
    console.error("Site feedback storage failed", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "Feedback could not be saved right now." }, { status: 503 });
  }
}
