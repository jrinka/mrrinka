import { GuidePlate } from "@/components/archive-art";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GlobalShell from "@/components/global-shell";
import { ibCourses, publicCourse } from "@/lib/content";

export const metadata: Metadata = { title: "Skills & Methods" };

export default function ResourcesPage() {
  const shared = new Map<
    string,
    {
      item: ReturnType<typeof publicCourse>["items"][number];
      courseId: (typeof ibCourses)[number]["id"];
      courses: string[];
    }
  >();

  for (const course of ibCourses) {
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
      <div className="illustrated-guide-head"><div className="global-page-head"><span className="mono">SHARED SKILLS / METHODS</span><h1>Skills & Methods</h1><p>General English resources for reading, analysis, and writing—useful in English 10, IB, and beyond.</p></div><GuidePlate kind="methods" /></div>
      <div className="global-directory-list">
        <section className="global-directory-group">
          <div className="global-directory-course"><span>01</span><h2>Shared methods</h2></div>
          <div><Link href="/resources/observation-to-analysis"><span><strong>From observation to analysis</strong><small>Evidence, meaning and an interactive magic-sentence workshop.</small></span><ArrowUpRight size={18}/></Link><Link href="/resources/analytical-language"><span><strong>Tone, transitions, verbs &amp; sentence stems</strong><small>Reference banks for choosing precise language and connecting ideas.</small></span><ArrowUpRight size={18}/></Link><Link href="/resources/unpacking-questions"><span><strong>Unpacking Paper 1 &amp; Paper 2 questions</strong><small>Worked breakdowns and original comparison prompts to practise with.</small></span><ArrowUpRight size={18}/></Link><Link href="/resources/hle-inquiries"><span><strong>HLE: how an inquiry develops</strong><small>Worked examples with Lady Susan and Timon of Athens.</small></span><ArrowUpRight size={18}/></Link><Link href="/resources/paper-1-introductions"><span><strong>Paper 1: Introductions &amp; thesis statements</strong><small>A shared step-by-step method, with separate literary and non-literary worked examples.</small></span><ArrowUpRight size={18} /></Link><Link href="/resources/critical-lenses"><span><strong>Critical Lenses</strong><small>Questions that open up a reading, with examples, further reading, and thinkers’ biographies.</small></span><ArrowUpRight size={18} /></Link>{[...shared.values()].filter(({item})=>item.title!=="From observation to analysis").map(({ item, courseId, courses: usedIn }) => <Link href={`/courses/${courseId}/resources/${item.id}`} key={item.title}><span><strong>{item.title}</strong><small>{item.summary} · Used in {usedIn.join(", ")}</small></span><ArrowUpRight size={18} /></Link>)}</div>
        </section>
      </div>
    </GlobalShell>
  );
}
