import Link from "next/link";
import Markdown from "./markdown";
import { splitGuideSections } from "@/lib/guide-sections";

export default function TextTypeOverview({ body, href, guideTitle, exampleLabel }: { body: string; href: string; guideTitle: string; exampleLabel: string }) {
  const sections = splitGuideSections(body);
  return <div className="advertisement-overview-layout">
    <nav className="advertisement-contents" aria-label={`${guideTitle} overview contents`}>
      <span className="mono">IN THIS GUIDE</span>
      <ol>{sections.map(section => <li key={section.id}><Link href={`${href}#${section.id}`}>{section.title}</Link></li>)}</ol>
      <Link className="advertisement-contents-example" href={`${href}?view=example`}><span className="mono">PUT IT INTO PRACTICE</span>{exampleLabel} →</Link>
    </nav>
    <div className="text-type-overview advertisement-overview-copy">
      {sections.map(section => <section key={section.id} aria-labelledby={section.id}><h2 id={section.id}>{section.title}</h2><Markdown>{section.body}</Markdown></section>)}
    </div>
  </div>;
}
