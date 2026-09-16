import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone">
      <span className="mono">404 / NOT FOUND</span>
      <h1>This page isn’t available.</h1>
      <p>It may be a draft or the link may have changed.</p>
      <Link className="button" href="/">
        Back to courses
      </Link>
    </main>
  );
}
