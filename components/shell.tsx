"use client";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  FilePenLine,
  Library,
  Terminal,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
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
  const [collapsed, setCollapsed] = useState(false);
  const courseNav = courseId === "english-10" ? nav : [
    { slug: "/assessment", label: "Assessments", icon: FilePenLine },
    { slug: "/resources", label: "Skills & methods", icon: Library },
    { slug: "/practice", label: "Practice", icon: Terminal },
  ];
  const activeNavIndex = courseNav.findIndex((item) =>
    item.slug ? path.startsWith(base + item.slug) : path === base,
  );

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("mrrinka-sidebar") === "closed");
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("mrrinka-sidebar", next ? "closed" : "open");
      return next;
    });
  }

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
      <div className={`site-grid ${collapsed ? "sidebar-is-collapsed" : ""}`}>
        <aside className="sidebar">
          <button
            className="side-toggle"
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand course navigation" : "Collapse course navigation"}
            aria-expanded={!collapsed}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            <span>{collapsed ? "OPEN" : "CLOSE"}</span>
          </button>
          <div className="mono side-kicker">
            <span>COURSE / </span>0{choices.indexOf(course) + 1}
          </div>
          <div className="side-title">{course.side}</div>
          <nav
            aria-label="Course sections"
            className="course-nav"
            style={{ "--active-nav-index": Math.max(activeNavIndex, 0) } as CSSProperties}
          >
            {courseNav.map((n, i) => {
              const active = n.slug
                ? path.startsWith(base + n.slug)
                : path === base;
              return (
                <Link
                  key={n.label}
                  href={base + n.slug}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? n.label : undefined}
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
