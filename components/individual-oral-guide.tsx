import Link from "next/link";
import Markdown from "./markdown";
import { splitGuideSections } from "@/lib/guide-sections";
import { ioLegacyAnchors, ioSelections, ioWholeLabel, type IOCourse } from "@/lib/individual-oral";
import { IOTimingMap, IOPracticeTimer, IORehearsalNotes } from "./individual-oral-tools";
import IOSectionControls from "./individual-oral-sections";
import styles from "./individual-oral.module.css";

export default function IndividualOralGuide({ body, course }: { body: string; course: IOCourse }) {
  const sections = splitGuideSections(body);
  return <div className={styles.guide} data-io-guide>
    <nav className={styles.contents} aria-label="Individual Oral guide contents">
      <span className="mono">BUILD YOUR UNDERSTANDING</span>
      <ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
      <a className={styles.quickLink} href="#structure-and-timing">See the timing map →</a>
      <a className={styles.quickLink} href="#analysis-planning-sheets">Open the planning sheets →</a>
    </nav>
    <div className={styles.reading}>
      <aside className={styles.course} aria-label="Your course requirements">
        <span className="mono">{course === "literature" ? "IB ENGLISH A: LITERATURE" : "IB ENGLISH A: LANGUAGE & LITERATURE"}</span>
        <h2>Your two selections</h2><div className={styles.selectionPair}>{ioSelections(course).map((label, index) => <div key={label}><span className="mono">0{index + 1}</span><strong>{label}</strong><p>Close analysis of an extract<br/>+ analysis of the {ioWholeLabel(course, index)}</p></div>)}</div>
        <p><strong>One global issue connects them.</strong> You analyze how each presents it.</p>
      </aside>
      <IOSectionControls />
      {sections.map((section, index) => <section className={styles.section} id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
        {ioLegacyAnchors[section.id] && <span id={ioLegacyAnchors[section.id]} className={styles.anchor} />}
        <details data-io-section open={index === 0}>
        <summary className={styles.sectionSummary}><span className="mono">{String(index + 1).padStart(2, "0")} / INDIVIDUAL ORAL</span>
        <h2 id={`${section.id}-title`}>{section.title}</h2></summary>
        <div className={styles.sectionBody}>
        {section.id === "structure-and-timing" && <IOTimingMap course={course} />}
        <Markdown>{section.body}</Markdown>
        {section.id === "personal-preparation-tools" && <><IOPracticeTimer course={course} /><IORehearsalNotes key={course} course={course} /></>}
        {section.id === "find-and-test-a-global-issue" && <aside className={styles.tool}><h3>Explore or test your issue</h3><p>Bring a studied text and an observation, or your own provisional issue and supporting evidence. The Global Issue Refinery asks questions to help you develop your thinking. Use it when I permit this AI support.</p><Link className="button secondary" href={`/practice/refineries/global-issue?course=${course}`}>Open the Global Issue Refinery →</Link></aside>}
        {section.id === "learn-from-a-short-example" && <details className={styles.example}><summary>Read a possible analysis and feedback</summary><p>The public slogan gives the impression that every worker can contribute. Mara's action complicates that promise: folding and hiding the complaint makes her concern physically smaller and less visible. Placing it beneath her work badge connects that concealment to her position as an employee. In the later scene, the distinction between an attendance list and a list of authorized speakers develops the same issue. Being included in the workplace does not give Mara control over whether her concern can be heard.</p><h3>What makes this analysis useful?</h3><p>It explains the tension between two details, connects an action to the issue, and analyzes a different choice in the later moment. The reference to the work as a whole develops the interpretation instead of repeating the extract.</p><h3>What should the speaker qualify?</h3><p>The fragments do not tell us exactly why Mara hides the complaint. Fear of a consequence is a possible inference, not an established fact. A full oral would need more evidence about the work and a second selection. This short example is not enough to award a criterion mark.</p><p><strong>Try again:</strong> Explain the relationship between presence and permission in the later moment using your own words.</p></details>}
        {section.id === "analysis-planning-sheets" && <div className={styles.resources}>{[
          ["planning", "Analysis planning sheets", "Two pages: evidence, choices, interpretation and connections to the work as a whole."],
        ].map(([slug, title, description]) => <article key={slug}><h3>{title}</h3><p>{description}</p><a href={`/io-resources/${course}-${slug}.html`} target="_blank" rel="noopener noreferrer">Open printable sheet ↗</a><a href={`/io-resources/${course}-${slug}.html`} download>Save offline copy ↓</a></article>)}</div>}
        </div></details>
      </section>)}
    </div>
  </div>;
}
