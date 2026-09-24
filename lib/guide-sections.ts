export type GuideSection = { id: string; title: string; body: string };

export function splitGuideSections(body: string): GuideSection[] {
  const sections: GuideSection[] = [];
  const heading = /^## (.+)\r?$/gm;
  const matches = [...body.matchAll(heading)];
  const lead = body.slice(0, matches[0]?.index ?? body.length).trim();
  if (lead) sections.push({ id: "introduction", title: "Introduction", body: lead });
  matches.forEach((match, index) => {
    const title = match[1].trim();
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let id = base;
    let suffix = 2;
    while (sections.some(section => section.id === id)) id = `${base}-${suffix++}`;
    sections.push({ id, title, body: body.slice(match.index! + match[0].length, matches[index + 1]?.index ?? body.length).trim() });
  });
  return sections;
}
