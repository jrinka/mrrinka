import ReferencePlate from "@/components/reference-plate";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { courseSectionName, type CourseItem } from "@/lib/schema";
import { plannedTextTypes } from "@/lib/text-type-guides";

export default function TextTypeIndex({ courseId, items }: { courseId: "language-literature" | "literature"; items: CourseItem[] }) {
  const label = courseSectionName(courseId, "text-types");
  const planned = plannedTextTypes[courseId].filter(title => !items.some(item => item.title.toLowerCase() === title.toLowerCase()));
  const language = courseId === "language-literature";
  return <>
    <div className="reference-intro"><div className="text-type-index-head">
      <span className="mono">IB ENGLISH A / COURSE REFERENCE</span>
      <h1>{label}</h1>
      <p className="intro">{language
        ? "How do format, audience, purpose and visual choices work together? Use these guides to ask better questions of non-literary texts, not to hunt for a required checklist."
        : "How do voice, form and structure make meaning? Use these guides to notice possibilities in literary texts, not to assign a fixed effect to a device."}</p>
      <p className="text-type-index-note">{language
        ? "Categories can overlap: a charity appeal might be a speech, a blog post or an infographic. Start with the actual text in front of you."
        : "A work can cross forms and genres. Follow its particular choices before relying on a label."}</p>
    </div>
    <ReferencePlate kind="texts" /></div>
    <p><Link href="/resources/analysis-reference">Explore literary, rhetorical and image-analysis terms ↗</Link></p>
    <div className="text-type-directory">
      <section className="text-type-available" aria-labelledby="available-guides"><div className="section-heading"><h2 id="available-guides">Available guides</h2><span className="mono">{String(items.length).padStart(2,"0")} / OPEN</span></div>
        <div className="text-type-links">{items.map((item,index) => <Link href={`/courses/${courseId}/text-types/${item.id}`} key={item.id}><span className="mono">{String(index+1).padStart(2,"0")}</span><span><strong>{item.title}</strong><small>{item.summary}</small></span><ArrowUpRight size={19} aria-hidden="true"/></Link>)}</div>
        {!items.length && <p>No guides are published yet.</p>}
      </section>
      {planned.length > 0 && <aside className="text-type-planned"><span className="mono">PLANNED / NOT YET OPEN</span><h2>Next on the shelf</h2><p>These are planned topics. They will become links when their guides are ready.</p><ul>{planned.map(title=><li key={title}>{title}</li>)}</ul></aside>}
    </div>
  </>;
}
