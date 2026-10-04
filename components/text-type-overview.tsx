import Link from "next/link";
import Markdown from "./markdown";
import { isLongGuideSection, splitGuideSections } from "@/lib/guide-sections";
import GuideNavigation from "./guide-navigation";

export default function TextTypeOverview({ body, href, guideTitle, exampleLabel }: { body: string; href: string; guideTitle: string; exampleLabel: string }) {
  const sections = splitGuideSections(body);
  return <GuideNavigation key={href}>
    <nav className="advertisement-contents" aria-label={`${guideTitle} overview contents`}>
      <span className="mono">IN THIS GUIDE</span>
      <ol>{sections.map(section => <li key={section.id}><a href={`${href}#${section.id}`}>{section.title}</a></li>)}</ol>
      <Link className="advertisement-contents-example" href={`${href}?view=example`}><span className="mono">PUT IT INTO PRACTICE</span>{exampleLabel} →</Link>
    </nav>
    <div className="text-type-overview advertisement-overview-copy">
      {sections.map((section, index) => <section key={section.id} aria-labelledby={section.id}>
        {index > 0 && isLongGuideSection(section.body) ? <details className="guide-long-section">
          <summary><h2 id={section.id}>{section.title}</h2><span className="mono guide-disclosure-hint">Read section</span></summary>
          <Markdown>{section.body}</Markdown>
        </details> : <><h2 id={section.id} tabIndex={-1}>{section.title}</h2><Markdown>{section.body}</Markdown></>}
      </section>)}
    </div>
  </GuideNavigation>;
}
