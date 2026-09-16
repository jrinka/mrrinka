import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { EncryptJWT, jwtDecrypt } from "jose";
export const sessionCookie = "rinka-session";
export const flowCookie = "rinka-oauth";
export const requiredEnv = [
  "SITE_URL",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "SESSION_SECRET",
  "ADMIN_GITHUB_ID",
  "CONTENT_REPOSITORY",
] as const;
export function configured() {
  return (
    requiredEnv.every((k) => Boolean(process.env[k])) &&
    (process.env.SESSION_SECRET?.length || 0) >= 32
  );
}
export function siteOrigin() {
  const url = new URL(process.env.SITE_URL || "https://mrrinka.com");
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:")
    throw new Error("SITE_URL must use HTTPS.");
  return url.origin;
}
function key() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
    throw new Error("Editor sign-in is not configured.");
  return createHash("sha256").update(process.env.SESSION_SECRET).digest();
}
export async function seal(
  payload: Record<string, unknown>,
  purpose: string,
  seconds: number,
) {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setIssuer("mrrinka")
    .setAudience(purpose)
    .setExpirationTime(`${seconds}s`)
    .encrypt(key());
}
export async function unseal(value: string, purpose: string) {
  return (
    await jwtDecrypt(value, key(), { issuer: "mrrinka", audience: purpose })
  ).payload;
}
export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
export type AdminSession = { token: string; id: string; login: string };
export async function session(): Promise<AdminSession | null> {
  try {
    const value = (await cookies()).get(sessionCookie)?.value;
    if (!value) return null;
    const p = await unseal(value, "admin");
    if (
      p.id !== process.env.ADMIN_GITHUB_ID ||
      typeof p.token !== "string" ||
      typeof p.login !== "string"
    )
      return null;
    return { token: p.token, id: String(p.id), login: p.login };
  } catch {
    return null;
  }
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === siteOrigin();
}
export async function githubFetch(
  path: string,
  token: string,
  init: RequestInit = {},
) {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init.headers,
    },
    signal: AbortSignal.timeout(20000),
  });
}
export async function authorizedSession() {
  const s = await session();
  if (!s) return null;
  const response = await githubFetch("/user", s.token);
  if (!response.ok) return null;
  const user = await response.json();
  return String(user.id) === process.env.ADMIN_GITHUB_ID ? s : null;
}
export function repoPath() {
  const repo = process.env.CONTENT_REPOSITORY || "";
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo))
    throw new Error("Repository is not configured.");
  return `/repos/${repo}`;
}
export function contentBranch() {
  return process.env.CONTENT_BRANCH || "main";
}
