# Text types next build

## Start here

Continue Mr Rinka's site in this repository. Read AGENTS.md and docs/TEXT-TYPE-SOURCES.md. Pull current main before editing course JSON; retain stable IDs and teacher edits. Current branch github-main pushes to origin main; GitHub integration deploys to Vercel. Live site https://mrrinka.com. Check build and actual browser flows before pushing; confirm Vercel status afterward.

## Agreed organisation

IB course navigation has Assessments and Text types (Literature calls this Literary forms). Each individual guide opens a GENERAL OVERVIEW covering uses, common features/techniques, audience and purpose, vocabulary and a reading method. A separately linked worked-example view demonstrates these principles in a particular source. Add more examples later without displacing the overview. Do not organise around a single model text.

Current guides: Advertisement (Lang/Lit, cf482e4c-3555-4e12-afca-b63396aec3ea), Infographic (Lang/Lit, c1e54cf5-1489-440b-a98c-3e7107bacc62), Charitable appeal (Lang/Lit, b0a0e8bb-7dfb-4fd6-8da0-a19d3dc95e92), and Poetry (Literature, 8889a1cf-bfb4-4930-bc54-b693504ae80a). Main URLs open Overview; ?view=example opens the model. components/text-type-guide.tsx splits editable body at ## Worked example. Example metadata explicitly identifies Infographic, Advertisement, Charitable appeal and Poetry; unknown IDs do not fall back to poetry.

Overview is currently continuous prose, NOT collapsible. Assistant proposed collapsible headings with first section open and expand/collapse-all; user then discussed serif styling but did not explicitly request the accordion implementation. Clarify or include it as a considered next improvement, do not claim it exists. The infographic worked-example sections ARE collapsible. An empty initial accordion caused by leading whitespace was fixed in 2eb8eaa.

## Next content priorities

Advertisement uses FIJI Water; Charitable appeal uses WWF’s snow-leopard adoption page. Becky stays in Paper 1. Remaining priorities:

1. Blog post.
2. Opinion/commentary, distinguishing opinion from explainers rather than treating a publisher (Guardian / The Conversation) as a genre.
3. Speech.

The planned shelf in lib/text-type-guides.ts follows the agreed order above. Literature currently plans prose fiction, drama and literary nonfiction. Work on one strong guide at a time.

## Sources and teaching principles

Infographic example is original 2019 Physical activity for early years, DHSC, Crown copyright/OGL, local PNG/PDF. It appeared in May 2021 TZ2 SL Paper 1 text 2. Source history/attribution in docs/TEXT-TYPE-SOURCES.md. Do not substitute the current GOV.UK graphic; it was revised. Never invent wording or numerical labels absent from the source. Existing viewer provides close-ups, transcript and TXT/MD student notebook exports; preserve them.

Poetry uses Christina Rossetti's public-domain Up-Hill. Its example links to the Literature P1 companion.

New canonical reference: /resources/analysis-reference (lib/analysis-reference.json). 50 literary/rhetorical terms and 61 visual-analysis entries adapted from Mr Rinka's source documents, with contextual nuance under Possible analysis. Common effects are useful, not forbidden: low angles commonly empower, but that power may be ironic, threatening or heroic. Do not hedge every statement or imply any interpretation is equally valid. /resources/analytical-language holds tone, verbs, transitions and stems. Link these banks rather than duplicate them in every guide. Details in docs/ANALYSIS-REFERENCE.md.

Reference Word originals and companion image-guide PDF were updated in OneDrive; originals backed up outside the public repo. No automatic OneDrive sync. Search Resource Library / Skills + Reference and numbered course folders for teaching sources. Avoid the broad English SharePoint shortcut unless a specific requested source requires it. Do not publish student data, confidential assessment material or local filesystem details.

## Design

Graphite #25282B, citron #D8ED61, warm paper; industrial futurism with antique illustration contrast. Desktop/laptops primary. Navigation must be clear; cryptic keywords are decorative only. Sorts Mill Goudy is used sparingly for text-type h2 headings, model titles and infographic accordion headings. Sans-serif remains for body guidance, subheadings, controls, navigation and vocabulary labels. Do not turn every element into a serif or add busy decoration.

Wellcome plates: sign-alphabet on Language & Literature Text types (SIGNUM), Dr Williams’ Library by J. and H.S. Storer, 1826, on Literary forms (FOLIO), and universal sundial on Calendar (MERIDIAN). Credits are compact linked WELLCOME with title/accessible detail; public domain verified via catalogue API. Text-types sheet is cropped closely through CSS into a landscape-ish panel equal in height to adjacent text, not displayed as a tiny complete portrait. Preserve subtle hover zoom and reduced-motion behavior. Original assets remain unchanged. Calendar keeps its distinct full sundial framing. Main homepage underscore now uses true citron.

## Other pending September 24 notes

Calendar assessment snapshot is useful but not daily-critical; DX is authoritative. Source HTML cycle-calendar in OneDrive Current Inbox embeds newer assessments than its separate stale JSON: Oct8 E10 seminar 10.6 + LL P1.2; Oct9 E10 seminar 10.4/10.5; Oct13 Lit P1. Use current source on next pass, not this dated note alone. Do not build live sync unnecessarily. Upcoming assessments panel not yet implemented. Existing Wellcome links need a broader audit; no blanket replacement URL has been verified. The new /collections/works path was tested and failed; original /works route can respond. New art is hosted locally.

## Verification

npm run build; npm run typecheck where appropriate. Tests: node --import tsx --test tests/*.test.ts avoids tsx CLI sandbox pipe errors (57 passed). agent-browser CLI unavailable in prior checks; Playwright via installed @playwright/test and /Applications/Google Chrome.app/Contents/MacOS/Google Chrome used for browser checks. Local server may require sandbox escalation. Never expose environment secrets. Existing canary/AI setup not involved in these static guides.

## Advertisement continuation

The user clarified that Becky belongs in the Paper 1 section and selected the supplied FIJI Water commercial advertisement for this guide. Do not duplicate Becky as its worked example. Preserve the landscape composition and the six guided close-ups; connect image, headline, copy, product and slogan to a single argument about preference. See docs/TEXT-TYPE-SOURCES.md for scan provenance and limits. The overview remains general and continuous, with a separate example view and student notebook. Kagi is the user’s preferred search/extraction tool where available.

Teaching emphasis: appeal labels are not a default tripartite thesis/paragraph plan. Pathos must name a particular emotion and explain its construction; ethos can establish credibility as well as draw on existing reputation; logos means reasoning connecting evidence to a conclusion, not the mere presence of numbers. Keep the treatment brief and contextual.

## Advertisement usability pass

Laptop and larger tablets take priority; mobile parity is not a goal. The Advertisement overview remains continuous prose, now with a sticky contents list and audience/purpose before techniques. The FIJI worked example follows Orient → Analyse → Write: nine selectable sections with previous/next controls, section URLs, and browser-history support. Commentary and source sit side by side above 850px; the source stays visible while reading. Six source views can be compared independently of the section; an accessible enlarged viewer preserves the wide composition. Question and transcript are available beside the reading. Student notes remain mounted across section changes and still export TXT/MD. Print reveals all nine sections and the complete ad. Stable guide IDs and the editable ## Worked example boundary are preserved.

Verified in an isolated production build: TypeScript, 57 existing tests, and Chrome flows at 1280×800, 1512×982, 1024×768 and a narrow fallback. Checks cover section links after reload, back/forward, retained notes and TXT/MD export, enlarged source/Escape/focus return, dark mode, printing all sections, and existing Infographic/Poetry examples. In-page section navigation uses native history to avoid duplicate hashes after reload.

## Charitable appeal

New Lang/Lit guide `b0a0e8bb-7dfb-4fd6-8da0-a19d3dc95e92`, title Charitable appeal. The general overview covers communicative purpose across forms, donor/beneficiary/intermediary roles, need, efficacy, credibility, practical requests, sustained relationships, representation, language/design and a reading method. It is broad enough for humanitarian, conservation and community appeals. Keep the overview independent of WWF. The shared continuous-prose overview component is now `components/text-type-overview.tsx`; Advertisement retains its existing layout and labels.

The separate worked example uses WWF-UK’s snow-leopard adoption webpage as checked on 24 September 2026. Eight sections follow Orient → Analyse → Write, with source notes alongside, explicit links to the complete original, and a small credited opening-image/headline excerpt. The excerpt is not the whole page. Do not silently treat it as evidence of payment-panel or gift-pack layout. The walkthrough identifies the reviewed monthly options (£5/£8/£10), custom and one-off alternatives, adoption benefits and the collective scope of funds. Do not import the older teacher prospect’s £3 price, named tiger biography or a predetermined guilt arc into this source.

Teaching stance: analyse how admiration and protective concern become a manageable contribution, then connect the personal framing with wider conservation work. Do not assume symbolic adoption is literal ownership or deception, or that donor benefits invalidate the cause. Original thesis, paragraph and notebook support a connected reading. Section navigation uses native browser history; notes stay mounted across steps; TXT/MD exports include source URL and review date. Preserve the editable `## Worked example` boundary.

Verification: isolated production build and TypeScript passed; all 60 existing tests passed, including the new guide in the course-reference test. Browser checks covered guide discovery, overview contents, all eight reading sections, keyboard focus, source image/links, enlarged view/Escape, reload/back/forward, note retention and TXT/MD export, 1280px and 1512px laptops, 1024px tablet landscape, narrow fallback, dark mode and printing. Existing Advertisement, Infographic and Poetry flows also passed.

The user requested removal of the bottom-of-page “Continue exploring” cards. The shared course-item renderer no longer displays those recommendation sections. Primary navigation and in-content guidance links remain the routes between lessons.
