import { microdramasExample } from "@/lib/microdramas-example";
import { divisionsExample } from "@/lib/divisions-example";
import { bayAtNiceExample } from "@/lib/bay-at-nice-example";
import { advertorialExample } from "@/lib/advertorial-example";
import ComicGuide from "@/components/comic-guide";
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

export default function TextTypeGuide({ body, itemId, href, showExample, exampleChoice }: { body: string; itemId: string; href: string; showExample: boolean; exampleChoice?: string }) {
  const marker = "## Worked example\n";
  const boundary = body.indexOf(marker);
  const overview = boundary >= 0 ? body.slice(0, boundary) : body;
  const allWorked = boundary >= 0 ? body.slice(boundary + marker.length) : "";
  const example = getTextTypeExample(itemId);
  if (!example) return <Markdown>{body}</Markdown>;
  const { title, shortTitle, description, kind, additional: additionalOptions = [] } = example;
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
      {(primaryWorked || availableExamples.length > 0) && <span className="example-tab-label mono">Worked examples</span>}
      {primaryWorked && <Link href={`${href}?view=example`} title={title}
        aria-label={`Worked example 1 · ${shortTitle}`} aria-current={showExample && !isAdditional ? "page" : undefined}>
        1 · {shortTitle}
      </Link>}
      {availableExamples.map((option, index) => (
        <Link key={option.key} href={`${href}?view=example&example=${option.key}`} title={option.title}
          aria-label={`Worked example ${index + 2} · ${option.shortTitle}`} aria-current={showExample && additional?.key === option.key ? "page" : undefined}>
          {index + 2} · {option.shortTitle}
        </Link>
      ))}
    </nav>
    {showExample && worked ? <>
      <div className="text-type-view-heading"><span className="mono">WORKED EXAMPLE {isAdditional ? availableExamples.findIndex(option => option.key === additional?.key) + 2 : 1}</span><h2>{isAdditional ? additional?.title : title}</h2></div>
      <p className="hint">This walkthrough develops one supported reading. A different interpretation can work if it explains the text’s details and addresses evidence that complicates it.</p>
      {kind === "advertorial" ? <div className="advertorial-reading"><LiteraryReadingGuide body={worked} href={href} example={advertorialExample} /></div> : kind === "webpage" ? <WebpageGuide body={worked} href={href} /> : kind === "blog" ? <BlogGuide body={worked} href={href} /> : kind === "cartoon" ? (isAdditional ? <ComicGuide body={worked} exampleHref={readingHref} /> : <CartoonGuide body={worked} href={href} />) : kind === "podcast" || kind === "letter" || kind === "article" || kind === "speech" || kind === "opinion" || kind === "prose" || kind === "poetry" ? <LiteraryReadingGuide key={`${itemId}:${isAdditional ? additional?.key : "primary"}`} body={worked} href={href} exampleHref={readingHref} example={kind === "podcast" ? podcastExample : kind === "letter" ? letterExample : kind === "article" ? (isAdditional ? microdramasExample : articleExample) : kind === "speech" ? speechExample : kind === "opinion" ? opinionExample : kind === "poetry" ? (additional?.key === "caught" ? caughtExample : isAdditional ? paperweightExample : poetryExample) : proseExample} /> : kind === "infographic" ? (isAdditional ? <CyclingGuide body={worked} href={href} /> : <InfographicGuide body={worked} />) : kind === "advertisement" ? <AdvertisementGuide body={worked} href={href} /> : kind === "charity-appeal" ? (isAdditional ? <CharityAppealGuide body={worked} href={href} /> : <ElephantAppealGuide body={worked} href={href} />) : kind === "drama" ? (isAdditional ? <LiteraryReadingGuide key="bay-at-nice" body={worked} href={href} exampleHref={readingHref} example={bayAtNiceExample} /> : <DramaGuide body={worked} href={href} />) : kind === "nonfiction" ? (isAdditional ? <LiteraryReadingGuide key="divisions" body={worked} href={href} exampleHref={readingHref} example={divisionsExample} /> : <NonfictionGuide body={worked} href={href} />) : <Markdown>{worked}</Markdown>}
    </> : <>
      <TextTypeOverview body={overview} href={href} guideTitle={kind === "infographic" ? "Infographic" : kind === "advertorial" ? "Advertorial" : kind === "podcast" ? "Podcasts/interviews" : kind === "letter" ? "Letters" : kind === "webpage" ? "Webpages" : kind === "article" ? "Articles" : kind === "speech" ? "Speech" : kind === "opinion" ? "Opinion/commentary" : kind === "blog" ? "Blog post" : kind === "cartoon" ? "Cartoons and comics" : kind === "poetry" ? "Poetry" : kind === "prose" ? "Prose fiction" : kind === "advertisement" ? "Advertisement" : kind === "drama" ? "Drama" : kind === "nonfiction" ? "Prose non-fiction" : "Charitable appeal"} exampleLabel={`Worked example 1 · ${shortTitle}`} />
      {worked && <section className="text-type-example-directory"><span className="mono">APPLY THE OVERVIEW</span><h2>Worked examples</h2><Link href={`${href}?view=example`}><strong>Worked Example 1 · {title} ↗</strong><span>{description}</span></Link>{availableExamples.map((option, index) => <Link key={option.key} href={`${href}?view=example&example=${option.key}`}><strong>Worked Example {index + 2} · {option.title} ↗</strong><span>{option.description}</span></Link>)}</section>}
    </>}
  </>;
}
