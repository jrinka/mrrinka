import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GlobalShell from "@/components/global-shell";
import { courses, publicCourse } from "@/lib/content";

export const metadata: Metadata = { title: "Skills & Methods" };

export default function ResourcesPage() {
  const shared = new Map<
    string,
    {
      item: ReturnType<typeof publicCourse>["items"][number];
      courseId: (typeof courses)[number]["id"];
      courses: string[];
    }
  >();

  for (const course of courses) {
    for (const item of publicCourse(course.id).items.filter(
      (candidate) => candidate.section === "resources",
    )) {
      const existing = shared.get(item.title.toLowerCase());
      if (existing) existing.courses.push(course.shortTitle);
      else
        shared.set(item.title.toLowerCase(), {
          item,
          courseId: course.id,
          courses: [course.shortTitle],
        });
    }
  }

  return (
    <GlobalShell>
      <div className="global-page-head"><span className="mono">SHARED SKILLS / METHODS</span><h1>Skills & Methods</h1><p>Methods, guides, and models that can be used across courses and assessment tasks.</p></div>
      <div className="global-directory-list">
        <section className="global-directory-group">
          <div className="global-directory-course"><span>01</span><h2>Shared methods</h2></div>
          <div><Link href="/resources/critical-lenses"><span><strong>Critical Lenses</strong><small>Questions that open up a reading, with examples, further reading, and thinkers’ biographies.</small></span><ArrowUpRight size={18} /></Link>{[...shared.values()].map(({ item, courseId, courses: usedIn }) => <Link href={`/courses/${courseId}/resources/${item.id}`} key={item.title}><span><strong>{item.title}</strong><small>{item.summary} · Used in {usedIn.join(", ")}</small></span><ArrowUpRight size={18} /></Link>)}</div>
        </section>
      </div>
    </GlobalShell>
  );
}
