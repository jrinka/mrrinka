import { podcastExample } from "@/lib/podcast-example";
import { letterExample } from "@/lib/letter-example";
import WebpageGuide from "@/components/webpage-guide";
import { articleExample } from "@/lib/article-example";
import { speechExample } from "@/lib/speech-example";
import { opinionExample } from "@/lib/opinion-example";
import BlogGuide from "@/components/blog-guide";
import CyclingGuide from "@/components/cycling-guide";
import ElephantAppealGuide from "@/components/elephant-appeal-guide";
import CartoonGuide from "@/components/cartoon-guide";
import LiteraryReadingGuide from "@/components/literary-reading-guide";
import { caughtExample } from "@/lib/caught-example";
import { paperweightExample } from "@/lib/paperweight-example";
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

export default function TextTypeGuide({ body, itemId, href, showExample, exampleChoice }: { body: string; itemId: string; href: string; showExample: boolean; exampleChoice?: "wwf" | "cycling" | "paperweight" | "caught" }) {
  const marker = "## Worked example\n";
  const boundary = body.indexOf(marker);
  const overview = boundary >= 0 ? body.slice(0, boundary) : body;
  const allWorked = boundary >= 0 ? body.slice(boundary + marker.length) : "";
  const example = getTextTypeExample(itemId);
  if (!example) return <Markdown>{body}</Markdown>;
  const { title, description, kind } = example;
  const firstAdditional = kind === "charity-appeal" ? { key: "wwf", marker: "WWF", title: "WWF — Adopt a snow leopard", label: "WWF · adoption webpage", primaryLabel: "Elephant Sanctuary · exam appeal", description: "Additional example: compare how a live adoption webpage connects personal concern with ongoing conservation support." } : kind === "infographic" ? { key: "cycling", marker: "Cycling", title: "The Benefits of Shifting to Cycling — ITDP", label: "Cycling · policy argument", primaryLabel: "Early years · health guidance", description: "Additional example: connect everyday journeys, projected benefits and policy action, with careful reading of charts and qualifications." } : kind === "poetry" ? { key: "paperweight", marker: "Paperweight", title: "The Paperweight — Gjertrud Schnackenberg", label: "The Paperweight · perspective & ambiguity", primaryLabel: "Up-Hill · dialogue & reassurance", description: "Follow shifts in perspective, time and scale, and develop a supported reading that makes room for uncertainty." } : undefined;
  const additionalOptions = firstAdditional ? [firstAdditional, ...(kind === "poetry" ? [{ key: "caught", marker: "Caught", title: "Caught — Susan Adams", label: "Caught · imagery & attachment", primaryLabel: firstAdditional.primaryLabel, description: "Follow changing comparisons and distinguish attraction, constraint and the choice to return." }] : [])] : [];
  const parts = allWorked.split(/## Additional worked example: ([^\n]+)\n/);
  const primaryWorked = parts[0];
  const availableExamples = additionalOptions.flatMap(option => {
    const index = parts.findIndex((part, index) => index % 2 === 1 && part === option.marker);
    return index >= 0 && parts[index + 1]?.trim() ? [{ ...option, body: parts[index + 1] }] : [];
  });
  const additional = availableExamples.find(option => option.key === exampleChoice);
  const additionalWorked = additional?.body ?? "";
  const isAdditional = Boolean(additional);
  const worked = isAdditional ? additionalWorked : primaryWorked;
  const readingHref = `${href}?view=example${isAdditional ? `&example=${additional?.key}` : ""}`;
  return <>
    <nav className="text-type-view-nav" aria-label="Guide views">
      <Link href={href} aria-current={!showExample ? "page" : undefined}>Overview</Link>
      {worked && <Link href={`${href}?view=example`} aria-current={showExample ? "page" : undefined}>Worked example</Link>}
    </nav>
    {showExample && worked ? <>
      <div className="text-type-view-heading"><span className="mono">WORKED EXAMPLE / {String(isAdditional ? availableExamples.findIndex(option => option.key === additional?.key) + 2 : 1).padStart(2, "0")}</span><h2>{isAdditional ? additional?.title : title}</h2><Link href={href}>← Return to the text-type overview</Link></div>
      <p className="hint">This walkthrough develops one supported reading. A different interpretation can work if it explains the text’s details and addresses evidence that complicates it.</p>
      {availableExamples.length > 0 && <nav className="text-type-view-nav" aria-label="Choose a worked example"><Link href={`${href}?view=example`} aria-current={!isAdditional ? "page" : undefined}>{firstAdditional?.primaryLabel}</Link>{availableExamples.map(option => <Link key={option.key} href={`${href}?view=example&example=${option.key}`} aria-current={additional?.key === option.key ? "page" : undefined}>{option.label}</Link>)}</nav>}
      {kind === "webpage" ? <WebpageGuide body={worked} href={href} /> : kind === "blog" ? <BlogGuide body={worked} href={href} /> : kind === "cartoon" ? <CartoonGuide body={worked} href={href} /> : kind === "podcast" || kind === "letter" || kind === "article" || kind === "speech" || kind === "opinion" || kind === "prose" || kind === "poetry" ? <LiteraryReadingGuide key={`${itemId}:${isAdditional ? additional?.key : "primary"}`} body={worked} href={href} exampleHref={readingHref} example={kind === "podcast" ? podcastExample : kind === "letter" ? letterExample : kind === "article" ? articleExample : kind === "speech" ? speechExample : kind === "opinion" ? opinionExample : kind === "poetry" ? (additional?.key === "caught" ? caughtExample : isAdditional ? paperweightExample : poetryExample) : proseExample} /> : kind === "infographic" ? (isAdditional ? <CyclingGuide body={worked} href={href} /> : <InfographicGuide body={worked} />) : kind === "advertisement" ? <AdvertisementGuide body={worked} href={href} /> : kind === "charity-appeal" ? (isAdditional ? <CharityAppealGuide body={worked} href={href} /> : <ElephantAppealGuide body={worked} href={href} />) : kind === "drama" ? <DramaGuide body={worked} href={href} /> : kind === "nonfiction" ? <NonfictionGuide body={worked} href={href} /> : <Markdown>{worked}</Markdown>}
    </> : <>
      {kind === "webpage" || kind === "podcast" || kind === "letter" || kind === "article" || kind === "speech" || kind === "opinion" || kind === "blog" || kind === "cartoon" || kind === "poetry" || kind === "prose" || kind === "advertisement" || kind === "charity-appeal" || kind === "drama" || kind === "nonfiction" ? <TextTypeOverview body={overview} href={href} guideTitle={kind === "podcast" ? "Podcasts/interviews" : kind === "letter" ? "Letters" : kind === "webpage" ? "Webpages" : kind === "article" ? "Articles" : kind === "speech" ? "Speech" : kind === "opinion" ? "Opinion/commentary" : kind === "blog" ? "Blog post" : kind === "cartoon" ? "Cartoons" : kind === "poetry" ? "Poetry" : kind === "prose" ? "Prose fiction" : kind === "advertisement" ? "Advertisement" : kind === "drama" ? "Drama" : kind === "nonfiction" ? "Prose non-fiction" : "Charitable appeal"} exampleLabel={kind === "podcast" ? "Happiness Lab worked example" : kind === "letter" ? "Steinbeck worked example" : kind === "webpage" ? "Redwoods worked example" : kind === "article" ? "Lensa worked example" : kind === "speech" ? "Helen Clark worked example" : kind === "opinion" ? "Netball worked example" : kind === "blog" ? "Emberton worked example" : kind === "cartoon" ? "Andy Singer worked example" : kind === "poetry" ? "Up-Hill worked example" : kind === "prose" ? "Moon Tiger worked example" : kind === "advertisement" ? "FIJI Water worked example" : kind === "drama" ? "Bovell worked example" : kind === "nonfiction" ? "Fisher worked example" : "Elephant Sanctuary worked example"} /> : <div className="text-type-overview"><Markdown>{overview}</Markdown></div>}
      {worked && <section className="text-type-example-directory"><span className="mono">APPLY THE OVERVIEW</span><h2>Worked examples</h2><Link href={`${href}?view=example`}><strong>{title} ↗</strong><span>{description}</span></Link>{availableExamples.map(option => <Link key={option.key} href={`${href}?view=example&example=${option.key}`}><strong>{option.title} ↗</strong><span>{option.description}</span></Link>)}</section>}
    </>}
  </>;
}
