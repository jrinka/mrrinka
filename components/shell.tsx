"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  FilePenLine,
  Library,
  Terminal,
  ArrowUpRight,
} from "lucide-react";
import type { CourseId } from "@/lib/schema";
const fallbackChoices = [
  {
    id: "language-literature",
    short: "IB Lang & Lit",
    side: "Language & Literature",
  },
  { id: "literature", short: "IB Literature", side: "Literature" },
  { id: "english-10", short: "English 10", side: "English 10" },
];
const nav = [
  { slug: "", label: "Overview", icon: LayoutDashboard },
  { slug: "/units", label: "Units & texts", icon: BookOpen },
  { slug: "/assessment", label: "Assessment", icon: FilePenLine },
  { slug: "/resources", label: "Resources", icon: Library },
  { slug: "/practice", label: "Interactive practice", icon: Terminal },
];
export default function Shell({
  courseId,
  children,
  courseLabels,
}: {
  courseId: CourseId;
  children: React.ReactNode;
  courseLabels: { id: string; short: string; side: string }[];
}) {
  const choices = courseLabels.length ? courseLabels : fallbackChoices;
  const path = usePathname();
  const course = choices.find((c) => c.id === courseId)!;
  const base = `/courses/${courseId}`;
  return (
    <div className="site">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="topbar">
        <Link className="wordmark" href="/">
          mr rinka<span>_</span>
        </Link>
        <nav aria-label="Courses" className="course-tabs">
          {choices.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              aria-current={c.id === courseId ? "page" : undefined}
            >
              {c.short}
            </Link>
          ))}
        </nav>
        <span className="top-note">READ / THINK / MAKE</span>
      </header>
      <div className="site-grid">
        <aside className="sidebar">
          <div className="mono side-kicker">
            COURSE / 0{choices.indexOf(course) + 1}
          </div>
          <div className="side-title">{course.side}</div>
          <nav aria-label="Course sections">
            {nav.map((n, i) => {
              const active = n.slug
                ? path.startsWith(base + n.slug)
                : path === base;
              return (
                <Link
                  key={n.label}
                  href={base + n.slug}
                  aria-current={active ? "page" : undefined}
                >
                  <n.icon size={17} aria-hidden="true" />
                  <span>{n.label}</span>
                  <small className="mono">0{i + 1}</small>
                </Link>
              );
            })}
          </nav>
          <div className="side-bottom">
            <span className="side-arrow">↳</span>
            <p className="mono">
              A space for
              <br />
              curious minds.
            </p>
            <Link href="/admin">
              Teacher editor <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </aside>
        <main id="content" className="main">
          {children}
        </main>
      </div>
      <footer className="footer mono">
        <span>MRRINKA.COM</span>
        <span>
          “We read books to find out who we are.” —{" "}
          <a href="https://www.theguardian.com/books/2018/jan/24/a-life-in-quotes-ursula-k-le-guin">
            Ursula K. Le Guin
          </a>
        </span>
      </footer>
    </div>
  );
}
