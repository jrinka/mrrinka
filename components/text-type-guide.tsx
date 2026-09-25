import ElephantAppealGuide from "@/components/elephant-appeal-guide";
import CartoonGuide from "@/components/cartoon-guide";
import LiteraryReadingGuide from "@/components/literary-reading-guide";
import { poetryExample } from "@/lib/poetry-example";
import { proseExample } from "@/lib/prose-example";
import Link from "next/link";
import Markdown from "@/components/markdown";
import InfographicGuide from "@/components/infographic-guide";
import AdvertisementGuide from "@/components/advertisement-guide";
import TextTypeOverview from "@/components/text-type-overview";
import NonfictionGuide from "@/components/nonfiction-guide";
import DramaGuide from "@/components/drama-guide";
import CharityAppealGuide from "@/components/charity-appeal-guide";
import { getTextTypeExample } from "@/lib/text-type-guides";

export default function TextTypeGuide({ body, itemId, href, showExample, exampleChoice }: { body: string; itemId: string; href: string; showExample: boolean; exampleChoice?: "wwf" }) {
  const marker = "## Worked example\n";
  const boundary = body.indexOf(marker);
  const overview = boundary >= 0 ? body.slice(0, boundary) : body;
  const allWorked = boundary >= 0 ? body.slice(boundary + marker.length) : "";
  const [primaryWorked, additionalWorked = ""] = allWorked.split("## Additional worked example: WWF\n");
  const isWwf = exampleChoice === "wwf" && Boolean(additionalWorked);
  const worked = isWwf ? additionalWorked : primaryWorked;
  const example = getTextTypeExample(itemId);
  if (!example) return <Markdown>{body}</Markdown>;
  const { title, description, kind } = example;
  return <>
    <nav className="text-type-view-nav" aria-label="Guide views">
      <Link href={href} aria-current={!showExample ? "page" : undefined}>Overview</Link>
      {worked && <Link href={`${href}?view=example`} aria-current={showExample ? "page" : undefined}>Worked example</Link>}
    </nav>
    {showExample && worked ? <>
      <div className="text-type-view-heading"><span className="mono">WORKED EXAMPLE / {isWwf ? "02" : "01"}</span><h2>{isWwf ? "WWF — Adopt a snow leopard" : title}</h2><Link href={href}>← Return to the text-type overview</Link></div>
      {kind === "charity-appeal" && additionalWorked && <nav className="text-type-view-nav" aria-label="Choose a worked example"><Link href={`${href}?view=example`} aria-current={!isWwf ? "page" : undefined}>Elephant Sanctuary · exam appeal</Link><Link href={`${href}?view=example&example=wwf`} aria-current={isWwf ? "page" : undefined}>WWF · adoption webpage</Link></nav>}
      {kind === "cartoon" ? <CartoonGuide body={worked} href={href} /> : kind === "prose" || kind === "poetry" ? <LiteraryReadingGuide key={itemId} body={worked} href={href} example={kind === "poetry" ? poetryExample : proseExample} /> : kind === "infographic" ? <InfographicGuide body={worked} /> : kind === "advertisement" ? <AdvertisementGuide body={worked} href={href} /> : kind === "charity-appeal" ? (isWwf ? <CharityAppealGuide body={worked} href={href} /> : <ElephantAppealGuide body={worked} href={href} />) : kind === "drama" ? <DramaGuide body={worked} href={href} /> : kind === "nonfiction" ? <NonfictionGuide body={worked} href={href} /> : <Markdown>{worked}</Markdown>}
    </> : <>
      {kind === "cartoon" || kind === "poetry" || kind === "prose" || kind === "advertisement" || kind === "charity-appeal" || kind === "drama" || kind === "nonfiction" ? <TextTypeOverview body={overview} href={href} guideTitle={kind === "cartoon" ? "Cartoons" : kind === "poetry" ? "Poetry" : kind === "prose" ? "Prose fiction" : kind === "advertisement" ? "Advertisement" : kind === "drama" ? "Drama" : kind === "nonfiction" ? "Prose non-fiction" : "Charitable appeal"} exampleLabel={kind === "cartoon" ? "Andy Singer worked example" : kind === "poetry" ? "Up-Hill worked example" : kind === "prose" ? "Moon Tiger worked example" : kind === "advertisement" ? "FIJI Water worked example" : kind === "drama" ? "Bovell worked example" : kind === "nonfiction" ? "Fisher worked example" : "Elephant Sanctuary worked example"} /> : <div className="text-type-overview"><Markdown>{overview}</Markdown></div>}
      {worked && <section className="text-type-example-directory"><span className="mono">APPLY THE OVERVIEW</span><h2>Worked examples</h2><Link href={`${href}?view=example`}><strong>{title} ↗</strong><span>{description}</span></Link>{kind === "charity-appeal" && additionalWorked && <Link href={`${href}?view=example&example=wwf`}><strong>WWF — Adopt a snow leopard ↗</strong><span>Additional example: compare how a live adoption webpage connects personal concern with ongoing conservation support.</span></Link>}</section>}
    </>}
  </>;
}
