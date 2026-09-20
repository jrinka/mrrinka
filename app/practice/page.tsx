import { GuidePlate } from "@/components/archive-art";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import RefineryLinks from "@/components/refinery-links";
import GlobalShell from "@/components/global-shell";
import { courses, publicCourse } from "@/lib/content";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  // Combine identical activities, while preserving independently edited versions.
  const activities = new Map<string, {
    item: ReturnType<typeof publicCourse>["items"][number];
    versions: { href: string; course: string }[];
  }>();
  for (const course of courses) {
    for (const item of publicCourse(course.id).items.filter(item => item.section === "practice")) {
      const key = JSON.stringify([item.title, item.summary, item.body, item.practiceKind, item.links]);
      const activity = activities.get(key) ?? { item, versions: [] };
      activity.versions.push({ href: `/courses/${course.id}/practice/${item.id}`, course: course.shortTitle });
      activities.set(key, activity);
    }
  }
  return (
    <GlobalShell>
      <div className="illustrated-guide-head"><div className="global-page-head"><span className="mono">READ / WRITE / REVISE</span><h1>Practice</h1><p>Choose a skill to work on. Start with a supplied passage or bring a text from class.</p></div><GuidePlate kind="practice" /></div>
      <Link className="practice-feature" href="/practice/passages">
        <span className="practice-feature-index mono">AI FEEDBACK</span>
        <span className="practice-feature-icon"><Sparkles size={22} /></span>
        <span><strong>Passage Practice</strong><small>Read a supplied passage, develop your analysis, and receive focused AI feedback to help you revise.</small></span>
        <ArrowUpRight size={20} />
      </Link>
      <section className="refinery-directory"><h2>Refineries</h2><p>Develop your own thinking with task-specific questions and feedback.</p><RefineryLinks /></section>
      <div className="global-directory-list">
        <section className="global-directory-group">
          <div className="global-directory-course"><span>01</span><h2>Bring your own text</h2></div>
          <div className="practice-skill-list">{[...activities.values()].map(({ item, versions }) => (
            <article className="practice-skill" key={item.id}>
              <Link className="practice-skill-title" href={versions[0].href}><strong>{item.title}</strong><ArrowUpRight size={18} aria-hidden="true" /></Link>
              <p>{item.summary}</p>
              <span className="practice-skill-mode mono">GUIDED WORKSPACE · SELF-REVIEW</span>
              <nav className="practice-course-links" aria-label={`${item.title}: course versions`}>
                {versions.map(version => <Link href={version.href} key={version.href}>{version.course}</Link>)}
              </nav>
            </article>
          ))}</div>
        </section>
      </div>
      <p className="intro">Need a method before you start? <Link href="/resources">Explore Skills &amp; Methods.</Link></p>
    </GlobalShell>
  );
}
