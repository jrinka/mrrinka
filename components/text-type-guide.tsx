import WebpageGuide from "@/components/webpage-guide";
import { articleExample } from "@/lib/article-example";
import { speechExample } from "@/lib/speech-example";
import { opinionExample } from "@/lib/opinion-example";
import BlogGuide from "@/components/blog-guide";
import CyclingGuide from "@/components/cycling-guide";
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

export default function TextTypeGuide({ body, itemId, href, showExample, exampleChoice }: { body: string; itemId: string; href: string; showExample: boolean; exampleChoice?: "wwf" | "cycling" }) {
  const marker = "## Worked example\n";
  const boundary = body.indexOf(marker);
  const overview = boundary >= 0 ? body.slice(0, boundary) : body;
  const allWorked = boundary >= 0 ? body.slice(boundary + marker.length) : "";
  const example = getTextTypeExample(itemId);
  if (!example) return <Markdown>{body}</Markdown>;
  const { title, description, kind } = example;
  const additional = kind === "charity-appeal" ? { key: "wwf", marker: "WWF", title: "WWF — Adopt a snow leopard", label: "WWF · adoption webpage", primaryLabel: "Elephant Sanctuary · exam appeal", description: "Additional example: compare how a live adoption webpage connects personal concern with ongoing conservation support." } : kind === "infographic" ? { key: "cycling", marker: "Cycling", title: "The Benefits of Shifting to Cycling — ITDP", label: "Cycling · policy argument", primaryLabel: "Early years · health guidance", description: "Additional example: connect everyday journeys, projected benefits and policy action, with careful reading of charts and qualifications." } : undefined;
  const [primaryWorked, additionalWorked = ""] = additional ? allWorked.split(`## Additional worked example: ${additional.marker}\n`) : [allWorked, ""];
  const isAdditional = Boolean(additionalWorked && exampleChoice === additional?.key);
  const worked = isAdditional ? additionalWorked : primaryWorked;
  return <>
    <nav className="text-type-view-nav" aria-label="Guide views">
      <Link href={href} aria-current={!showExample ? "page" : undefined}>Overview</Link>
      {worked && <Link href={`${href}?view=example`} aria-current={showExample ? "page" : undefined}>Worked example</Link>}
    </nav>
    {showExample && worked ? <>
      <div className="text-type-view-heading"><span className="mono">WORKED EXAMPLE / {isAdditional ? "02" : "01"}</span><h2>{isAdditional ? additional?.title : title}</h2><Link href={href}>← Return to the text-type overview</Link></div>
      {additional && additionalWorked && <nav className="text-type-view-nav" aria-label="Choose a worked example"><Link href={`${href}?view=example`} aria-current={!isAdditional ? "page" : undefined}>{additional.primaryLabel}</Link><Link href={`${href}?view=example&example=${additional.key}`} aria-current={isAdditional ? "page" : undefined}>{additional.label}</Link></nav>}
      {kind === "webpage" ? <WebpageGuide body={worked} href={href} /> : kind === "blog" ? <BlogGuide body={worked} href={href} /> : kind === "cartoon" ? <CartoonGuide body={worked} href={href} /> : kind === "article" || kind === "speech" || kind === "opinion" || kind === "prose" || kind === "poetry" ? <LiteraryReadingGuide key={itemId} body={worked} href={href} example={kind === "article" ? articleExample : kind === "speech" ? speechExample : kind === "opinion" ? opinionExample : kind === "poetry" ? poetryExample : proseExample} /> : kind === "infographic" ? (isAdditional ? <CyclingGuide body={worked} href={href} /> : <InfographicGuide body={worked} />) : kind === "advertisement" ? <AdvertisementGuide body={worked} href={href} /> : kind === "charity-appeal" ? (isAdditional ? <CharityAppealGuide body={worked} href={href} /> : <ElephantAppealGuide body={worked} href={href} />) : kind === "drama" ? <DramaGuide body={worked} href={href} /> : kind === "nonfiction" ? <NonfictionGuide body={worked} href={href} /> : <Markdown>{worked}</Markdown>}
    </> : <>
      {kind === "webpage" || kind === "article" || kind === "speech" || kind === "opinion" || kind === "blog" || kind === "cartoon" || kind === "poetry" || kind === "prose" || kind === "advertisement" || kind === "charity-appeal" || kind === "drama" || kind === "nonfiction" ? <TextTypeOverview body={overview} href={href} guideTitle={kind === "webpage" ? "Webpages" : kind === "article" ? "Articles" : kind === "speech" ? "Speech" : kind === "opinion" ? "Opinion/commentary" : kind === "blog" ? "Blog post" : kind === "cartoon" ? "Cartoons" : kind === "poetry" ? "Poetry" : kind === "prose" ? "Prose fiction" : kind === "advertisement" ? "Advertisement" : kind === "drama" ? "Drama" : kind === "nonfiction" ? "Prose non-fiction" : "Charitable appeal"} exampleLabel={kind === "webpage" ? "Redwoods worked example" : kind === "article" ? "Lensa worked example" : kind === "speech" ? "Helen Clark worked example" : kind === "opinion" ? "Netball worked example" : kind === "blog" ? "Emberton worked example" : kind === "cartoon" ? "Andy Singer worked example" : kind === "poetry" ? "Up-Hill worked example" : kind === "prose" ? "Moon Tiger worked example" : kind === "advertisement" ? "FIJI Water worked example" : kind === "drama" ? "Bovell worked example" : kind === "nonfiction" ? "Fisher worked example" : "Elephant Sanctuary worked example"} /> : <div className="text-type-overview"><Markdown>{overview}</Markdown></div>}
      {worked && <section className="text-type-example-directory"><span className="mono">APPLY THE OVERVIEW</span><h2>Worked examples</h2><Link href={`${href}?view=example`}><strong>{title} ↗</strong><span>{description}</span></Link>{additional && additionalWorked && <Link href={`${href}?view=example&example=${additional.key}`}><strong>{additional.title} ↗</strong><span>{additional.description}</span></Link>}</section>}
    </>}
  </>;
}
