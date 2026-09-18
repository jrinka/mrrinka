import Link from "next/link";

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="global-site">
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="global-header">
        <Link className="wordmark" href="/">mr rinka<span>_</span></Link>
        <nav aria-label="Main navigation">
          <Link href="/#courses">Courses</Link>
          <Link href="/calendar">My calendar</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/practice">Practice</Link>
        </nav>
        <span className="top-note">READ / THINK / MAKE</span>
      </header>
      <main id="content" className="global-main">{children}</main>
      <footer className="footer mono global-footer">
        <span>MRRINKA.COM</span>
        <span>ENGLISH / LANGUAGE / LITERATURE</span>
      </footer>
    </div>
  );
}
