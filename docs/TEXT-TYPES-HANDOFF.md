# Text types next build

## Start here

Continue Mr Rinka's site in this repository. Read AGENTS.md and docs/TEXT-TYPE-SOURCES.md. Pull current main before editing course JSON; retain stable IDs and teacher edits. Current branch github-main pushes to origin main; GitHub integration deploys to Vercel. Live site https://mrrinka.com. Check build and actual browser flows before pushing; confirm Vercel status afterward.

## Latest priority and language pass (25 September 2026)

The user moved the language and usability pass ahead of further contrasting examples. That pass is now complete locally, with publication checks to follow. Original teaching prose and interface labels use US spelling; source quotations, transcripts, original titles and proper names remain intact. Simplified abstract or ornate explanations in course guidance and models; revised reference entries where a possible effect sounded automatic. Color, gaze, framing and other choices must be interpreted in context. Common associations remain useful, but are not fixed answers. A compact note on each worked-example view identifies it as one supported reading, allowing alternatives that explain the evidence and address complications.

Preserved stable course IDs and existing section hashes after US spelling changes, including source-view mappings. Source-link labels stay together at laptop/tablet widths. No additional exit cards or navigation were added. Validation: production build, TypeScript and 70 tests passed; 110 source fields compared unchanged. Browser checks covered all 15 overviews and worked-example views and 109 reading sections, plus source-follow/whole-source views, enlargement, history/focus, retained notes, TXT/MD exports, laptop/tablet/narrow layouts, dark mode and complete print on representative text/image readers. Additional WWF and Cycling views remained available.

Next content options remain a sequential comic, North and South alongside Moon Tiger, and a contrasting poem, selected from the supplied bank. Do not treat older pending-language-pass notes below as the current queue.

### Paper 2 practice idea — queued, not built

The user reports that the same past-paper folder also contains a catalogue of all past Paper 2 questions. Review that bank before implementation. Proposed introductory activity: show a random supplied question, let students choose two works they have read, and ask them to craft a comparative thesis responding to that question. Keep possible responses open to alternatives supported by the works. This turn records the idea; it does not implement the activity or verify the bank's completeness.

## Current agreed plan (25 September 2026)

This plan supersedes the historical queues below. The user approved articles next, then useful additions drawn from the existing past-paper bank, with a language clarity pass at the end.

1. COMPLETED: Articles overview and separate Lensa worked example (see completion note below). Original brief: build a general News and feature articles overview with a separate worked example. The reviewed Lensa AI article from The Conversation (November 2024 TZ2 Text 1) is the leading candidate. Distinguish reporting, explanation and opinion; a publisher is not a genre. Treat the article's technical and legal claims in their original publication context, not as current guidance.
2. Follow with useful additions that introduce distinct reading challenges. Prioritise Webpages (Redwoods Treewalk, May 2025 TZ2 Text 1), Letters (Murthy or Steinbeck), and Podcasts/interviews (The Happiness Lab, May 2023 TZ1 Text 1). Review each supplied exam text before committing to its treatment.
3. Expand existing guides where that is more useful than creating another category: a sequential comic alongside Cartoons, North and South alongside Moon Tiger for Prose fiction, and a contrasting poem alongside Up-Hill. Select from the user's catalogued paper bank as needed; these are candidates, not completed additions. Posters can sit within Advertisement and further conservation appeals within Charitable appeal.
4. Finish with a language clarity pass across the new overviews, commentary, models, prompts and interface labels. User additionally requested a site-wide US spelling pass (analyze, practice, organize, etc.). Apply to original teaching text and interface labels; preserve source quotations, transcripts, original titles and proper names. Aim for accessible grade 11–12 explanations without simplifying the ideas. Remove ornate or needlessly abstract phrasing; preserve source quotations, useful terminology and analytical precision. Models should remain achievable under timed conditions.

Maintain overview-first organisation, separate worked examples, laptop-first reading space and restrained navigation. Both current planned shelves are empty because the previous queue is complete; this section records the new agreed work. Record completion here as the work proceeds.

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

## Student-facing language

Keep explanations accessible to grades 11–12 without simplifying the ideas. Retain useful analytical terminology, explain it where needed, and avoid ornate phrasing or abstract nouns that hide a straightforward relationship. The September 24 language pass revised the course guidance, worked examples, critical lenses, reading methods and reference explanations. Keep source quotations intact. Ethos/pathos/logos entries now match the contextual teaching guidance above.


## Drama

Drama is now a Literature guide, ID `5131f911-d916-4135-8415-ce6ad59606ff`. Overview first, with a separate seven-section Bovell worked example. Read dialogue as action: connect speech with reply, distinguish script evidence from possible performance, and follow changes in the relationship. Preserve the accessible source transcript, explicit silence, editorial labels and original PDF link. The reader pairs selected exchanges with commentary, can keep the whole extract open, supports section URLs/history and exports student notes as TXT/MD. Source details and date limitations are recorded in TEXT-TYPE-SOURCES.md. Literature’s remaining planned forms are Prose fiction and Literary nonfiction.

Drama verification: production build and TypeScript passed; 14 relevant content/resource/export checks passed. Chrome checks covered overview-first discovery, all seven sections, source-follow and whole-extract modes, keyboard focus, reload/back/forward, note retention and TXT/MD exports, original PDF availability, 1280px/1512px laptops, 1024px tablet, narrow fallback, dark mode and complete printed source/commentary. Poetry, Advertisement and Charitable appeal remained available through the shared renderer.


## Prose non-fiction

Literature guide `63208637-86ff-4f34-b522-dad42e9ab1ac` opens a general overview covering overlapping sub-types, perspective, retrospection, scene/summary/reflection, description and evidence. A separate seven-section Fisher worked example uses text 2 of the supplied May 2026 paper. Source-follow/whole-extract views, original exam-page image, footnotes and TXT/MD notebook exports follow the Drama reader pattern. The complete supplied exam also resolves Drama’s date as May 2026; its attribution has been updated. Literature now plans only Prose fiction. Preserve accessible grade 11–12 language and the distinction between figurative distress and literal events.


## Prose fiction and expanded Poetry (25 September 2026)

Prose fiction is now built, ID `197e1470-54d4-470b-a22a-414e4d4d00b9`, with a general overview and separate seven-section Moon Tiger example selected by the user. Literature’s planned shelf is empty: all four core forms have guides. Poetry retains `8889a1cf-bfb4-4930-bc54-b693504ae80a` and the Up-Hill source, with a fuller overview and eight-section close reading. Both use `components/literary-reading-guide.tsx` and typed source configurations, offering source-follow/whole-source modes, section URLs/history, mounted notebooks, TXT/MD exports and complete print output. Poetry imports the existing Paper 1 poem to preserve consistency. Source provenance and limits are in TEXT-TYPE-SOURCES.md. Preserve grade 11–12 clarity and laptop-first side-by-side reading.

Verification: both guides passed the isolated production build, TypeScript and 14 content/resource/export checks. Chrome checks covered overview discovery and contents, every reading section, source-follow and whole-source views, focus, reload/back/forward, retained notes, TXT/MD exports, original source images, 1280px and 1512px laptops, 1024px tablet, narrow fallback, dark mode and complete print output. Paper 1, Drama and Prose non-fiction remained functional. Moon Tiger splits Claudia’s source into search/climb and quarrel/fall reading groups so the fall commentary opens beside its relevant evidence.


## Cartoons (25 September 2026)

User paused Blog post while finding a source and supplied Andy Singer’s The History of Technology for Cartoons. New Lang/Lit guide `64dc8a9a-f80c-4e62-8a60-55a641a7b7f7` has a general overview and seven-step separate worked example. The whole two-panel cartoon stays beside the commentary, with enlargement, transcript/image description and TXT/MD notebook. Only the cartoon is published; the complete exam page remains a private reference. Preserve the exact supplied question. Blog post remains planned, followed by Opinion/commentary and Speech. Source provenance and interpretive limits are in TEXT-TYPE-SOURCES.md.

Cartoons verification: production build, TypeScript and 10 content/export checks passed. Chrome verified overview discovery, all seven sections, reload/back/forward, heading focus, enlargement/Escape/focus return, transcript, retained notes and TXT/MD downloads, source image, Paper 1 link, 1280px/1512px laptops, 1024px tablet, narrow fallback, dark mode and full print output. Source scroll resets on section changes so both panels are immediately available.


## Elephant Sanctuary primary appeal example

The user approved making the self-contained 2018 Elephant Sanctuary appeal the main Charitable appeal example while retaining WWF as an additional example. Overview unchanged. Primary opens at ?view=example; WWF at ?view=example&example=wwf, with its section links/history retaining that choice. One compact example switcher sits above the reading, and both examples appear in the overview directory. The course body retains both, separated by `## Additional worked example: WWF`. Elephant reader offers two complete pages, four close-ups, enlargement, transcript/image descriptions, eight reading steps, retained notes and TXT/MD exports. Print includes both complete appeal pages and all commentary. Only the appeal images are published, not the exam PDF or unrelated sports column.

Elephant appeal verification: overview and WWF commentary compared with the previous commit and preserved exactly. Production build, TypeScript and 10 content/export checks passed. Chrome checked both example entries and switching, all eight primary reading steps, source selection/enlargement, transcript, history/focus, retained section notes, TXT/MD downloads, 1280px/1512px laptop and 1024px tablet layouts, narrow fallback, dark mode, both complete source pages in print, and WWF deep links/reload/history. Export notes before switching examples.


## Cycling infographic additional example

Infographic now retains early-years activity as example 01 and adds ITDP cycling as example 02 at ?view=example&example=cycling. Eight-step reader, two full infographic pages, four close-ups, enlargement, transcript/descriptions, notebook and complete print. Emphasise conditional projections and cycling’s contribution within the wider scenario. Source details in TEXT-TYPE-SOURCES.md. The shared two-example routing supports WWF and Cycling explicitly, with no change to default examples or stable guide IDs.

Cycling verification: original infographic overview and early-years commentary preserved exactly. Production build, TypeScript and 10 content/export checks passed. Chrome checked all eight reading sections, source views/enlargement, transcript, history/focus, retained notes and TXT/MD downloads, laptop/tablet/narrow layouts, dark mode, both complete pages in print, cycling deep links, return to early-years, and regression switching between Elephant Sanctuary and WWF.


## Blog post (25 September 2026)

Blog post is built at `a6b9e918-4b25-4ae8-9f6c-08bd45c89173`. The general overview covers overlapping personal, travel, advice, opinion and specialist blogs; audience, persona, voice, structure and visible digital features. The separate Emberton example uses the supplied May 2024 TZ1 exam version, not additions from the longer current website. It follows Orient → Analyse → Write across eight sections, with two full source pages, three close-ups, enlargement, accessible transcript, persistent section notes and TXT/MD exports. A concise model paragraph shows an achievable connected reading. Keep the mathematical-certainty discussion contextual and the allowance for compatible goals explicit.

The planned shelf now contains Opinion/commentary and Speech. Candidate sources already reviewed: McClintock’s netball column (November 2023 TZ2) and Helen Clark’s eulogy for Hillary (November 2020 Text C). Neither is built or independently authorised by this Blog post build.

Blog verification: production build, TypeScript and 10 content/export checks passed. Chrome verified overview discovery and contents, all eight sections, five source views, enlargement/Escape/focus, transcript and source notes, reload/back/forward, previous/next, retained notes and TXT/MD exports, 1280px/1512px laptops, 1024px tablet, narrow fallback, dark mode and print showing both source pages and all commentary. Existing Cycling, WWF and Cartoons examples passed regression checks. The graph close-up was tightened after visual review for readable equation and axes in the side panel.


## Opinion/commentary (25 September 2026)

Opinion/commentary is built at `9860d817-e8b4-4a15-b499-b0df6b780f28`, with a general overview distinguishing opinion, reporting and explanation and covering forms, audience, reasoning, tone, credibility and structure. Its separate eight-step McClintock netball example uses the supplied November 2023 TZ2 exam version of the May 2019 column. It traces mock attack, affection, self-deprecation, a change from ranking to shared feeling, and the final invitation. A short model paragraph demonstrates the relationship between voice and argument.

The shared `LiteraryReadingGuide` now also supports this non-literary text through the existing typed configuration. Optional image and whole-view label fields add an expandable original-layout image and “Whole column” button for this example only. Readable passages follow the analysis or remain complete by choice. Notes remain mounted across sections and export TXT/MD; print reveals the whole transcript and commentary. Existing poetry/prose configuration and behaviour are preserved.

The remaining planned text type is Speech. Helen Clark’s eulogy for Hillary (November 2020 Text C) is the recommended next source, but this build does not implement it.

Opinion verification: production build, TypeScript and 10 content/export checks passed. Chrome verified overview discovery and contents, eight reading sections, source-follow/whole-column persistence, original layout image, section URLs/history/focus, previous/next, retained notes and TXT/MD exports, 1280px/1512px laptop and 1024px tablet layouts, narrow fallback, dark mode and print showing all source passages and commentary. Poetry, Moon Tiger and Blog passed regression checks.


## Speech (25 September 2026)

Speech is built at `501e5fac-47a8-4c41-a081-ac57220685c2`. Its general overview covers overlapping speech purposes, speaker/occasion/audience, structure, language shaped for listening, credibility/emotion/reasoning and a reading method. It distinguishes transcript evidence from possible performance.

The separate eight-step Helen Clark eulogy example uses the supplied November 2020 Text C adaptation. An original practice guiding question is clearly labelled because the source came from the older comparative examination. Five readable passage groups follow the commentary or remain complete through “Whole speech”; two source-region image links preserve the supplied layout and footnotes. Notes persist between sections and export TXT/MD with question credit. Print reveals all passages and commentary. Existing shared-reader behaviour is retained.

Both planned shelves are now empty: the agreed Language & Literature queue and four Literature forms are built. This means the planned set is complete, not that every possible IB text type is covered. Further additions should follow the user’s priorities.

Speech verification: production build, TypeScript and 10 content/export checks passed. Chrome verified overview discovery and contents, all eight sections, source-follow/whole-speech persistence, both source pages, practice-question label, reload/back/forward and focus, previous/next, retained notes and TXT/MD exports, 1280px/1512px laptops, 1024px tablet, narrow fallback, dark mode and print revealing all five source groups and all commentary. Moon Tiger, Poetry and Blog passed regression checks.


## Articles (25 September 2026)

Articles is built at `b773dc6e-4794-4c80-a99f-8cdd183b20f4`. Seven overview sections cover news, features and explainers, angle, evidence, structure, language and a practical reading method. A separate eight-step Lensa example uses the supplied November 2024 TZ2 Text 1 adaptation of Murphy’s December 2022 article. Supplied guiding question retained. Four readable source groups, headline, original first-page layout and two cropped source-page links support the existing shared reader. Notes persist between sections and export TXT/MD; print reveals complete transcript and commentary. No shared reader behaviour changed.

Validation: production build, TypeScript and 10 content/export tests passed. Chrome checked overview-first discovery, all eight steps, source-follow/whole-article views, original-layout expansion, source links, section URLs/reload/history/focus, previous/next, retained notes, TXT/MD exports, 1280px/1512px laptops, 1024px tablet, narrow fallback, dark mode and complete printed source/commentary. Existing Moon Tiger, Poetry and Blog examples passed regression checks. A local language clarity review is complete; the agreed final pass across all new additions remains pending. Next priority: Webpages, with Redwoods Treewalk as the reviewed candidate, then the useful additions in the current plan above.


## Webpages (25 September 2026)

Webpages is built at `81d752ad-9f14-43a5-a7b5-34e14a7a7803`. A seven-section general overview covers purpose, overlapping forms, visitors, visual hierarchy, navigation, language/images/trust and reading method. The separate eight-step Redwoods Treewalk example uses the supplied May 2025 TZ2 text. Two full source pages plus five close-ups support independent comparison, enlargement, transcript, persistent notes and TXT/MD exports. Print reveals both complete source pages and every commentary section. Existing guides and their IDs are preserved.

Production build, TypeScript and 10 content/export tests passed. Browser checks covered overview discovery/contents, eight sections, seven source views, enlargement/Escape/focus return, transcript/source notes, reload/back/forward, previous/next, retained notes and both export formats, 1280px/1512px laptops, 1024px tablet, narrow fallback, dark mode and complete print output. Existing Cycling, WWF and Cartoons examples passed regression checks. The React review preserved hooks before conditional returns, effect cleanup, mounted notebook state, labelled controls and semantic source/section navigation.

Current queue: Articles and Webpages complete. Letters next (review Murthy and Steinbeck candidates), then Podcasts/interviews, then useful contrasting examples in existing categories as agreed. A local clarity review of Webpages is complete; the final language pass across all additions remains pending.


## Letters (25 September 2026)

Letters is built at `027cb949-724f-4872-bef8-4f2599684139`. Seven overview sections cover personal/formal/public letters, relationship, the absent reply, conventions, voice and reading method. The separate eight-step Steinbeck example uses the supplied November 2013 text of his 1958 letter to Thom. The standalone question is labelled original because the source came from a comparative paper. Five source groups follow the reading or remain complete through Whole letter; two faithful source crops, persistent notebook, TXT/MD exports and full printed transcript/commentary use the existing shared reader without changing its behaviour.

Build, TypeScript and 10 content/export checks passed. Chrome verified discovery, overview contents, eight sections, source-follow/whole-letter controls, source links, practice-question label, reload/back/forward/focus, previous/next, retained notes, TXT/MD exports, 1280px/1512px laptop and 1024px tablet layouts, narrow fallback, dark mode and complete print. Moon Tiger, Poetry and Blog passed regression checks. Source footnote correction is explained in TEXT-TYPE-SOURCES.md. Local clarity review complete; final language pass across the additions remains pending.

Next: Podcasts/interviews, with The Happiness Lab (May 2023 TZ1 Text 1) as the reviewed candidate. Articles, Webpages and Letters are complete.


## Podcasts/interviews (25 September 2026)

Published guide ID `746d8c8a-0c8a-4ba0-9f37-0e38ffdcf686`. Seven overview sections distinguish medium from interview format, speaker roles, development of the exchange, spoken language, evidence, framing and a reading method. The separate eight-step Happiness Lab example uses the supplied May 2023 TZ1 text and exact guiding question. Five editorial source groups retain timestamps, speaker labels, the banner description and repeated wording. Whole transcript, original-page expansion, both source crops, persistent notebook, TXT/MD exports and full print use the existing shared reader.

New teaching text uses US spelling. The shared reader’s visible Analyze phase label has been changed; internal metadata keys remain stable. AGENTS.md records the US spelling convention. The comprehensive language clarity and US spelling pass remains pending after the agreed additions; do not claim the whole site is converted yet.

Build, TypeScript and 10 content/export tests passed. Chrome verified overview discovery/contents, all eight sections, source-follow/whole-transcript controls, original-layout expansion, source links, supplied-question label, history/focus, previous/next, retained notes, TXT/MD exports, 1280px/1512px laptops, 1024px tablet, narrow fallback, dark mode and complete print. Moon Tiger, Poetry and Blog passed regression checks. React review preserved hook order, cleanup, mounted notes and semantic controls.

Articles, Webpages, Letters and Podcasts/interviews are complete. Next phase: useful contrasting examples within existing guides (sequential comic, North and South prose extract, contrasting poem), followed by the final clarity and US spelling audit.
