import Link from "next/link";
import { configured, session } from "@/lib/auth";
import Editor from "@/components/editor";
export const metadata = {
  title: "Teacher editor",
  robots: { index: false, follow: false },
};
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const auth = await session();
  if (auth) return <Editor login={auth.login} />;
  const { error } = await searchParams;
  return (
    <main className="login-page">
      <Link href="/" className="wordmark">
        mr rinka<span>_</span>
      </Link>
      <div className="login-card">
        <span className="mono">TEACHER WORKSPACE</span>
        <h1>
          Your classroom.
          <br />
          Your content.
        </h1>
        <p>
          Add units, update resources, and publish practice activities. Students
          can read the site without signing in.
        </p>
        {error && (
          <p className="error" role="alert">
            {error === "denied"
              ? "This GitHub account does not have editor access."
              : "Sign-in did not finish. Please try again."}
          </p>
        )}
        {configured() ? (
          <a className="button" href="/api/auth/login">
            Sign in with GitHub
          </a>
        ) : (
          <>
            <div className="notice">
              The editor is built, but GitHub sign-in and publishing still need
              to be connected.
            </div>
            <Link href="/admin/preview" className="button">
              Preview the editor
            </Link>
          </>
        )}
        <Link href="/" className="back">
          Back to public courses
        </Link>
      </div>
    </main>
  );
}
