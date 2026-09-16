import { NextResponse } from "next/server";
import { sameOrigin, siteOrigin, sessionCookie } from "@/lib/auth";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const response = NextResponse.redirect(`${siteOrigin()}/admin`, 303);
  response.cookies.delete(sessionCookie);
  return response;
}
