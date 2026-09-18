import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import GlobalShell from "@/components/global-shell";
import { courses, publicCourse } from "@/lib/content";

export const metadata: Metadata = { title: "Practice console" };

export default function PracticePage() {
  return (
    <GlobalShell>
      <div className="global-page-head"><span className="mono">COMMON SYSTEM / PRACTICE</span><h1>Practice console</h1><p>Choose a course, try a skill, and keep the stakes low.</p></div>
      <Link className="practice-feature" href="/practice/passages">
        <span className="practice-feature-index mono">LIVE MODULE / 01</span>
        <span className="practice-feature-icon"><Sparkles size={22} /></span>
        <span><strong>Passage Practice</strong><small>Analyse a random extract from Project Gutenberg and receive focused feedback from MiniMax M3.</small></span>
        <ArrowUpRight size={20} />
      </Link>
      <div className="global-directory-list">
        {courses.map((course, index) => {
          const practice = publicCourse(course.id).items.filter((item) => item.section === "practice");
          return <section className="global-directory-group" key={course.id}>
            <div className="global-directory-course"><span>0{index + 1}</span><h2>{course.shortTitle}</h2></div>
            <div>{practice.map((item) => <Link href={`/courses/${course.id}/practice/${item.id}`} key={item.id}><span><strong>{item.title}</strong><small>{item.summary}</small></span><ArrowUpRight size={18} /></Link>)}</div>
          </section>;
        })}
      </div>
    </GlobalShell>
  );
}
