import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  cookieOptions,
  flowCookie,
  sessionCookie,
  seal,
  unseal,
  siteOrigin,
  githubFetch,
} from "@/lib/auth";
export async function GET(request: Request) {
  const jar = await cookies();
  const value = jar.get(flowCookie)?.value;
  jar.delete(flowCookie);
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!value || !code || !state) throw new Error("Invalid login");
    const flow = await unseal(value, "oauth");
    if (flow.state !== state || typeof flow.verifier !== "string")
      throw new Error("Invalid state");
    const exchange = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${siteOrigin()}/api/auth/callback`,
          code_verifier: flow.verifier,
        }),
        signal: AbortSignal.timeout(20000),
      },
    );
    const result = await exchange.json();
    if (!exchange.ok || typeof result.access_token !== "string")
      throw new Error("Exchange failed");
    const profile = await githubFetch("/user", result.access_token);
    if (!profile.ok) throw new Error("Profile failed");
    const user = await profile.json();
    if (String(user.id) !== process.env.ADMIN_GITHUB_ID)
      return NextResponse.redirect(`${siteOrigin()}/admin?error=denied`);
    const maxAge = Math.min(
      21600,
      typeof result.expires_in === "number" ? result.expires_in : 21600,
    );
    const response = NextResponse.redirect(`${siteOrigin()}/admin`);
    response.cookies.set(
      sessionCookie,
      await seal(
        { token: result.access_token, id: String(user.id), login: user.login },
        "admin",
        maxAge,
      ),
      cookieOptions(maxAge),
    );
    return response;
  } catch {
    return NextResponse.redirect(`${siteOrigin()}/admin?error=signin`);
  }
}
