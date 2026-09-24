# Text types next build

## Start here

Continue Mr Rinka's site in this repository. Read AGENTS.md and docs/TEXT-TYPE-SOURCES.md. Pull current main before editing course JSON; retain stable IDs and teacher edits. Current branch github-main pushes to origin main; GitHub integration deploys to Vercel. Live site https://mrrinka.com. Check build and actual browser flows before pushing; confirm Vercel status afterward.

## Agreed organisation

IB course navigation has Assessments and Text types (Literature calls this Literary forms). Each individual guide opens a GENERAL OVERVIEW covering uses, common features/techniques, audience and purpose, vocabulary and a reading method. A separately linked worked-example view demonstrates these principles in a particular source. Add more examples later without displacing the overview. Do not organise around a single model text.

Current guides: Advertisement (Lang/Lit, cf482e4c-3555-4e12-afca-b63396aec3ea), Infographic (Lang/Lit, c1e54cf5-1489-440b-a98c-3e7107bacc62) and Poetry (Literature, 8889a1cf-bfb4-4930-bc54-b693504ae80a). Main URLs open Overview; ?view=example opens the model. components/text-type-guide.tsx splits editable body at ## Worked example. Example metadata explicitly identifies Infographic, Advertisement and Poetry; unknown IDs do not fall back to poetry.

Overview is currently continuous prose, NOT collapsible. Assistant proposed collapsible headings with first section open and expand/collapse-all; user then discussed serif styling but did not explicitly request the accordion implementation. Clarify or include it as a considered next improvement, do not claim it exists. The infographic worked-example sections ARE collapsible. An empty initial accordion caused by leading whitespace was fixed in 2eb8eaa.

## Next content priorities

Advertisement is now built using FIJI Water; Becky stays in Paper 1. Remaining priorities:

1. Charity appeal.
2. Blog post.
3. Opinion/commentary, distinguishing opinion from explainers rather than treating a publisher (Guardian / The Conversation) as a genre.
4. Speech.

The planned shelf in lib/text-type-guides.ts follows the agreed order above. Literature currently plans prose fiction, drama and literary nonfiction. Work on one strong guide at a time.

## Sources and teaching principles

Infographic example is original 2019 Physical activity for early years, DHSC, Crown copyright/OGL, local PNG/PDF. It appeared in May 2021 TZ2 SL Paper 1 text 2. Source history/attribution in docs/TEXT-TYPE-SOURCES.md. Do not substitute the current GOV.UK graphic; it was revised. Never invent wording or numerical labels absent from the source. Existing viewer provides close-ups, transcript and TXT/MD student notebook exports; preserve them.

Poetry uses Christina Rossetti's public-domain Up-Hill. Its example links to the Literature P1 companion.

New canonical reference: /resources/analysis-reference (lib/analysis-reference.json). 50 literary/rhetorical terms and 61 visual-analysis entries adapted from Mr Rinka's source documents, with contextual nuance under Possible analysis. Common effects are useful, not forbidden: low angles commonly empower, but that power may be ironic, threatening or heroic. Do not hedge every statement or imply any interpretation is equally valid. /resources/analytical-language holds tone, verbs, transitions and stems. Link these banks rather than duplicate them in every guide. Details in docs/ANALYSIS-REFERENCE.md.

Reference Word originals and companion image-guide PDF were updated in OneDrive; originals backed up outside the public repo. No automatic OneDrive sync. Search Resource Library / Skills + Reference and numbered course folders for teaching sources. Avoid the broad English SharePoint shortcut unless a specific requested source requires it. Do not publish student data, confidential assessment material or local filesystem details.

## Design

Graphite #25282B, citron #D8ED61, warm paper; industrial futurism with antique illustration contrast. Desktop/laptops primary. Navigation must be clear; cryptic keywords are decorative only. Sorts Mill Goudy is used sparingly for text-type h2 headings, model titles and infographic accordion headings. Sans-serif remains for body guidance, subheadings, controls, navigation and vocabulary labels. Do not turn every element into a serif or add busy decoration.

Wellcome plates: sign-alphabet on both text-type landing pages (SIGNUM), universal sundial on Calendar (MERIDIAN). Credits are compact linked WELLCOME with title/accessible detail; public domain verified via catalogue API. Text-types sheet is cropped closely through CSS into a landscape-ish panel equal in height to adjacent text, not displayed as a tiny complete portrait. Preserve subtle hover zoom and reduced-motion behavior. Original assets remain unchanged. Calendar keeps its distinct full sundial framing. Main homepage underscore now uses true citron.

## Other pending September 24 notes

Calendar assessment snapshot is useful but not daily-critical; DX is authoritative. Source HTML cycle-calendar in OneDrive Current Inbox embeds newer assessments than its separate stale JSON: Oct8 E10 seminar 10.6 + LL P1.2; Oct9 E10 seminar 10.4/10.5; Oct13 Lit P1. Use current source on next pass, not this dated note alone. Do not build live sync unnecessarily. Upcoming assessments panel not yet implemented. Existing Wellcome links need a broader audit; no blanket replacement URL has been verified. The new /collections/works path was tested and failed; original /works route can respond. New art is hosted locally.

## Verification

npm run build; npm run typecheck where appropriate. Tests: node --import tsx --test tests/*.test.ts avoids tsx CLI sandbox pipe errors (57 passed). agent-browser CLI unavailable in prior checks; Playwright via installed @playwright/test and /Applications/Google Chrome.app/Contents/MacOS/Google Chrome used for browser checks. Local server may require sandbox escalation. Never expose environment secrets. Existing canary/AI setup not involved in these static guides.

## Advertisement continuation

The user clarified that Becky belongs in the Paper 1 section and selected the supplied FIJI Water commercial advertisement for this guide. Do not duplicate Becky as its worked example. Preserve the landscape composition and the six guided close-ups; connect image, headline, copy, product and slogan to a single argument about preference. See docs/TEXT-TYPE-SOURCES.md for scan provenance and limits. The overview remains general and continuous, with a separate example view and student notebook. Kagi is the user’s preferred search/extraction tool where available.

Teaching emphasis: appeal labels are not a default tripartite thesis/paragraph plan. Pathos must name a particular emotion and explain its construction; ethos can establish credibility as well as draw on existing reputation; logos means reasoning connecting evidence to a conclusion, not the mere presence of numbers. Keep the treatment brief and contextual.
