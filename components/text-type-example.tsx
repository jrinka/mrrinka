import Link from "next/link";
import { literatureExample as poem } from "@/lib/literature-example";
import { textTypeGuideIds } from "@/lib/text-type-guides";

export default function TextTypeExample({ itemId }: { itemId: string }) {
  if (itemId === textTypeGuideIds.poetry) return <aside className="text-type-example" aria-label="Worked example: Up-Hill by Christina Rossetti">
    <div className="text-type-example-head"><span className="mono">WORKED EXAMPLE / 01</span><span className="mono">POETRY</span></div>
    <div className="text-type-example-poem"><h2>{poem.title}</h2><p className="mono">CHRISTINA ROSSETTI</p>{poem.stanzas.map((stanza, index) => <p key={index}>{stanza.map((line, lineIndex) => <span key={lineIndex}>{line}<br /></span>)}</p>)}</div>
    <p className="text-type-example-source"><a href={poem.source} target="_blank" rel="noopener noreferrer">Academy of American Poets ↗</a> · Public-domain poem. <Link href="/courses/literature/assessment/a718b887-02ee-4e53-acb5-808ef5214809#worked-example">See the Paper 1 worked analysis →</Link></p>
  </aside>;

  return null;
}
