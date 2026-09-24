import Image from "next/image";
import Link from "next/link";
import { literatureExample as poem } from "@/lib/literature-example";
import { textTypeGuideIds } from "@/lib/text-type-guides";

export default function TextTypeExample({ itemId }: { itemId: string }) {
  if (itemId === textTypeGuideIds.infographic) return <aside className="text-type-example" aria-label="Worked example: original infographic">
    <div className="text-type-example-head"><span className="mono">WORKED EXAMPLE / 01</span><span className="mono">INFOGRAPHIC</span></div>
    <figure>
      <Image src="/examples/reading-format-infographic.svg" width={760} height={550} sizes="(max-width: 1050px) 90vw, 430px" loading="eager" alt="A fictional class reading survey. The headline says most students chose print; bars show print 22 of 40, digital 12 of 40, and audio 6 of 40. Print and its 55 percent figure receive the strongest visual emphasis." />
      <figcaption>Original teaching example · fictional figures, not a real survey.</figcaption>
    </figure>
    <div className="text-type-example-note"><h2>Follow the emphasis</h2><p>The title says “most”; the largest number and citron bar direct attention to print. The smaller format bars and the sample note narrow what the claim can reasonably mean.</p></div>
  </aside>;

  if (itemId === textTypeGuideIds.poetry) return <aside className="text-type-example" aria-label="Worked example: Up-Hill by Christina Rossetti">
    <div className="text-type-example-head"><span className="mono">WORKED EXAMPLE / 01</span><span className="mono">POETRY</span></div>
    <div className="text-type-example-poem"><h2>{poem.title}</h2><p className="mono">CHRISTINA ROSSETTI</p>{poem.stanzas.map((stanza, index) => <p key={index}>{stanza.map((line, lineIndex) => <span key={lineIndex}>{line}<br /></span>)}</p>)}</div>
    <p className="text-type-example-source"><a href={poem.source} target="_blank" rel="noopener noreferrer">Academy of American Poets ↗</a> · Public-domain poem. <Link href="/courses/literature/assessment/a718b887-02ee-4e53-acb5-808ef5214809#worked-example">See the Paper 1 worked analysis →</Link></p>
  </aside>;

  return null;
}
