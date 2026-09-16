import { randomBytes, createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  configured,
  cookieOptions,
  flowCookie,
  seal,
  siteOrigin,
} from "@/lib/auth";
export async function GET() {
  if (!configured())
    return NextResponse.json(
      { error: "Editor sign-in has not been connected yet." },
      { status: 503 },
    );
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${siteOrigin()}/api/auth/callback`,
    scope: "public_repo",
    state,
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256",
    allow_signup: "false",
  });
  const response = NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
  );
  response.cookies.set(
    flowCookie,
    await seal({ state, verifier }, "oauth", 600),
    cookieOptions(600),
  );
  return response;
}
