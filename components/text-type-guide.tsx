import Link from "next/link";
import Markdown from "@/components/markdown";
import InfographicGuide from "@/components/infographic-guide";
import TextTypeExample from "@/components/text-type-example";
import AdvertisementGuide from "@/components/advertisement-guide";
import AdvertisementOverview from "@/components/advertisement-overview";
import { getTextTypeExample } from "@/lib/text-type-guides";

export default function TextTypeGuide({ body, itemId, href, showExample }: { body: string; itemId: string; href: string; showExample: boolean }) {
  const marker = "## Worked example\n";
  const boundary = body.indexOf(marker);
  const overview = boundary >= 0 ? body.slice(0, boundary) : body;
  const worked = boundary >= 0 ? body.slice(boundary + marker.length) : "";
  const example = getTextTypeExample(itemId);
  if (!example) return <Markdown>{body}</Markdown>;
  const { title, description, kind } = example;
  return <>
    <nav className="text-type-view-nav" aria-label="Guide views">
      <Link href={href} aria-current={!showExample ? "page" : undefined}>Overview</Link>
      {worked && <Link href={`${href}?view=example`} aria-current={showExample ? "page" : undefined}>Worked example</Link>}
    </nav>
    {showExample && worked ? <>
      <div className="text-type-view-heading"><span className="mono">WORKED EXAMPLE / 01</span><h2>{title}</h2><Link href={href}>← Return to the text-type overview</Link></div>
      {kind === "infographic" ? <InfographicGuide body={worked} /> : kind === "advertisement" ? <AdvertisementGuide body={worked} href={href} /> : <div className="text-type-guide"><Markdown>{worked}</Markdown><TextTypeExample itemId={itemId}/></div>}
    </> : <>
      {kind === "advertisement" ? <AdvertisementOverview body={overview} href={href} /> : <div className="text-type-overview"><Markdown>{overview}</Markdown></div>}
      {worked && <section className="text-type-example-directory"><span className="mono">APPLY THE OVERVIEW</span><h2>Worked examples</h2><Link href={`${href}?view=example`}><strong>{title} ↗</strong><span>{description}</span></Link></section>}
    </>}
  </>;
}
