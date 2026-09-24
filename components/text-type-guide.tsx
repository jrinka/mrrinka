import Link from "next/link";
import Markdown from "@/components/markdown";
import InfographicGuide from "@/components/infographic-guide";
import TextTypeExample from "@/components/text-type-example";
import { textTypeGuideIds } from "@/lib/text-type-guides";

export default function TextTypeGuide({ body, itemId, href, showExample }: { body: string; itemId: string; href: string; showExample: boolean }) {
  const marker = "## Worked example\n";
  const boundary = body.indexOf(marker);
  const overview = boundary >= 0 ? body.slice(0, boundary) : body;
  const worked = boundary >= 0 ? body.slice(boundary + marker.length) : "";
  const infographic = itemId === textTypeGuideIds.infographic;
  const title = infographic ? "Physical activity for early years" : "Up-Hill — Christina Rossetti";
  return <>
    <nav className="text-type-view-nav" aria-label="Guide views">
      <Link href={href} aria-current={!showExample ? "page" : undefined}>Overview</Link>
      {worked && <Link href={`${href}?view=example`} aria-current={showExample ? "page" : undefined}>Worked example</Link>}
    </nav>
    {showExample && worked ? <>
      <div className="text-type-view-heading"><span className="mono">WORKED EXAMPLE / 01</span><h2>{title}</h2><Link href={href}>← Return to the text-type overview</Link></div>
      {infographic ? <InfographicGuide body={worked} /> : <div className="text-type-guide"><Markdown>{worked}</Markdown><TextTypeExample itemId={itemId}/></div>}
    </> : <>
      <div className="text-type-overview"><Markdown>{overview}</Markdown></div>
      {worked && <section className="text-type-example-directory"><span className="mono">APPLY THE OVERVIEW</span><h2>Worked examples</h2><Link href={`${href}?view=example`}><strong>{title} ↗</strong><span>{infographic ? "Follow an audience inference, examine the visual choices, and build an analytical response beside the source." : "Read the poem beside an analysis of voice, repeated questions and the developing promise of rest."}</span></Link></section>}
    </>}
  </>;
}
