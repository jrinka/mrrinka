import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GuidePlate } from "@/components/archive-art";
import AiGuidanceBadge from "@/components/ai-guidance-badge";
import RefineryLinks from "@/components/refinery-links";
import GlobalShell from "@/components/global-shell";
import { ibCourses, publicCourse } from "@/lib/content";
import { classPassageHref, paragraphCheckHref, retiredPracticeGuides } from "@/lib/practice-guides";

export const metadata: Metadata = { title: "Practice" };

const featured = [
  { href: "/practice/passages", label: "Literature", title: "Passage Practice", description: "Read an unfamiliar literary extract, write about one choice, and request feedback or download your work.", ai: true },
  { href: "/practice/close-analysis", label: "Language & Literature", title: "Close Analysis", description: "Choose an advertisement, advertorial, or manifesto. Explain one choice in a paragraph and revise it.", ai: true },
  { href: "/practice/what-changes", label: "Compare", title: "What changes?", description: "Compare two versions of a text or image. Explain what changed, then reveal a worked reading.", ai: true },
  { href: "/practice/flashcards", label: "Review terms", title: "Term flashcards", description: "Test your understanding of literary and visual terms. Revisit the ones you want to practice.", ai: false },
];

export default function PracticePage() {
  const courses = ibCourses.map(course => publicCourse(course.id));
  const assessments = courses.flatMap(course => course.items
    .filter(item => item.section === "assessment")
    .map(item => ({ title: item.title, courseName: course.shortTitle, href: `/courses/${course.id}/assessment/${item.id}` })));
  // Paper 2 is shared. IO rehearsal uses the course-specific selections.
  const paperTwo = assessments.find(item => item.title === "Paper 2");
  const orals = assessments.filter(item => item.title === "Individual Oral");

  const activities = new Map<string, {
    item: ReturnType<typeof publicCourse>["items"][number];
    versions: { href: string; course: string }[];
  }>();
  for (const course of courses) {
    for (const item of course.items.filter(item => item.section === "practice" && !retiredPracticeGuides.has(item.id))) {
      const key = JSON.stringify([item.title, item.summary, item.practiceKind]);
      const activity = activities.get(key) ?? { item, versions: [] };
      activity.versions.push({ href: `/courses/${course.id}/practice/${item.id}`, course: course.shortTitle });
      activities.set(key, activity);
    }
  }

  return (
    <GlobalShell>
      <div className="illustrated-guide-head">
        <div className="global-page-head">
          <span className="mono">READ / WRITE / REVISE</span>
          <h1>Practice</h1>
          <p className="practice-routine-links">Working with a text from class? <Link href={classPassageHref}>Read a passage</Link> or <Link href={paragraphCheckHref}>check a paragraph you’ve written</Link>.</p>
        </div>
        <GuidePlate kind="practice" />
      </div>
      {featured.map(activity => (
        <Link className="practice-feature" href={activity.href} key={activity.href}>
          <span className="practice-feature-index mono">{activity.label}</span>
          <span><strong>{activity.title}</strong><small>{activity.description}</small></span>
          <span className="practice-feature-actions">{activity.ai && <AiGuidanceBadge />}<ArrowUpRight size={20} aria-hidden="true" /></span>
        </Link>
      ))}

      <section className="practice-reading" aria-label="Independent reading">
        <div>
          <h2>Read today’s poem</h2>
          <p>Read the <a href="https://www.poetryfoundation.org/poems/poem-of-the-day">Poetry Foundation’s Poem of the Day</a>. Mark a shift in the poem. Which words helped you notice it?</p>
          <Link href="/resources/reading-methods/tpcastt">Use the TPCASTT guide</Link>
        </div>
        <div>
          <h2>Read an opinion piece</h2>
          <p>Choose a column from <a href="https://www.nytimes.com/section/opinion">New York Times Opinion</a> or <a href="https://www.theguardian.com/us/commentisfree">Guardian Opinion</a>. Who is the writer trying to persuade? Explain how one phrase appeals to that audience.</p>
          <Link href="/resources/reading-methods/soapstone">Use the SOAPSTone guide</Link>
        </div>
      </section>

      <section className="refinery-directory">
        <h2>Refineries</h2>
        <p>Explore an idea or get feedback on a draft. You can download a record of your work. Follow your teacher’s rules for using AI on assessed work.</p>
        <RefineryLinks related={{
          comparison: <>
            {paperTwo && <Link href={`${paperTwo.href}#practice`}>Draw a past Paper 2 question</Link>}
            <Link href="/resources/unpacking-questions#original-practice-question">Try an original practice question</Link>
          </>,
          "global-issue": orals.length > 0 && <>
            <span>Rehearse your IO</span>
            {orals.map(oral => <Link key={oral.href} href={`${oral.href}#personal-preparation-tools`} aria-label={`Rehearse your IO in ${oral.courseName}`}>{oral.courseName}</Link>)}
          </>,
        }} />
      </section>

      {activities.size > 0 && <section className="global-directory-group">
        <div className="global-directory-course"><h2>Course practice</h2></div>
        <div className="practice-skill-list">{[...activities.values()].map(({ item, versions }) => (
          <article className="practice-skill" key={item.id}>
            <Link className="practice-skill-title" href={versions[0].href}><strong>{item.title}</strong><ArrowUpRight size={18} aria-hidden="true" /></Link>
            <p>{item.summary}</p>
            <nav className="practice-course-links" aria-label={`${item.title}: course versions`}>
              {versions.map(version => <Link href={version.href} key={version.href}>{version.course}</Link>)}
            </nav>
          </article>
        ))}</div>
      </section>}
    </GlobalShell>
  );
}
