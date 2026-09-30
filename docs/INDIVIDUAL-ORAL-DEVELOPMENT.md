# Individual Oral implementation

Implementation completed on 30 September 2026. Publication authorized after the final language pass; verify the release through the deployment status for its commit.

## Editing

The canonical teaching content is the Individual Oral item in `content/language-literature.json`, ID `82d7dfa3-e66b-4f94-8c58-91733c967e6c`. Literature inherits this body through its existing shared reference. Course-specific selection labels are supplied by the guide.

Add school rules under **What to bring into the assessment → Follow your teacher’s preparation instructions**. No local word count per bullet point has been supplied. Do not invent one or present a school rule as an IB-wide requirement.

Keep section headings stable: their anchors connect the navigation and interactive tools. The timing map, timer, example commentary and printable resource links are in `components/individual-oral-guide.tsx` and `components/individual-oral-tools.tsx`. Printable source is `scripts/build-io-resources.mjs`; regenerate with `npm run build:io` (also included in dev/build).

## Teaching decisions

- Explain the full task progressively, including independent analysis of both selections through one issue. Comparison is not required.
- Recommended timing: 0:30 introduction, four 2:15 analytical sections, 0:30 conclusion. Explain the IB balance requirement separately from this recommended teaching structure.
- Keep extract and wider analysis together for each selection; either order is workable. Frequent switching is difficult to track and does not itself earn marks.
- Mini-IO is half-IO practice only.
- Use detailed outline for your own practice and brief speaking cues in student-facing preparation guidance.
- Explain permitted teacher support and the restriction on evaluating a rehearsal of the final assessed oral.
- Include the official outline with at most 10 brief bullet points and clean copies of both extracts in the assessment checklist.

## Source basis and limits

The local Language A: language and literature guide is the first-assessment-2021 edition, published February 2019 and updated August 2019, despite its local filename calling it updated. Printed pages 54–57 support extract size, manageable volume where line counting does not apply, and outline/material requirements.

The supplied 2023 handbook instructions, printed pages 168–170, support assessment materials and teacher-support boundaries. The supplied teacher support material, printed pages 50–54, supports part/whole analysis, balance, flexible structure and comparison being optional. These materials were used for factual checking, not reproduced.

The IB Studies in language and literature FAQ, November 2019 edition, page 8, directly addresses graphic novels and film: no definite graphic-extract length; teachers judge manageable volume; film written dialogue and matching stills; one continuous extract. It does not supply a fixed still count. A publicly indexed copy was checked at https://www.scribd.com/document/1047315845/IO-Frequently-Asked-Questions-Studies-in-Language-and-Literature-1911-2-e-Copy . This is a dated source, not verification of a new 2026 FAQ. Session-specific teacher instructions should take precedence if subsequently supplied.

Existing canonical criterion explanations were preserved. Third-party decks, full rubrics and private student material were not copied. The short analytical example and six printable sheets are original teaching resources.

## Verification

- Production build and TypeScript checks passed; 76 tests passed.
- Both course routes checked for labels, navigation, order changes, example reveal, wording, and Refinery destination.
- Timer checked for start, pause, resume, reset, checkpoints, completion and each practice mode.
- Desktop, mobile overflow and dark theme checked; no browser page errors.
- Six printable pages rendered to PDF: planning is two pages per course, outline and reflection one each. Layouts inspected.

## Q&A clarification

The final five minutes now have a dedicated student-facing section. Teacher questions help students address gaps, develop interpretations and demonstrate further understanding. Answers inform A, B and D; C assesses the prepared response and cannot be repaired through Q&A. Checked against the guide (printed page 57) and the IB 2026 examiner instructions, Criterion C: https://ibpublishing.ibo.org/exinst/apps/exinst/index.html?chapter=1&doc=EX_instructions_2026_e&part=8 .

## Shared literary forms

Added the two course selection requirements to the opening descriptor and a shared extract-formatting section for poetry, drama and prose. Poetry retains original lineation; a short complete poem is not combined with another poem to fill 40 lines. Drama distinguishes speaking turns from lines, preserves directions and speaker labels, and asks the teacher to confirm edition-dependent counting. No universal IB convention for standalone character names, shared verse lines or typography was located, so none is claimed. Graphic novels are relevant to both courses; film and other non-literary examples are labeled for Language & Literature.

## Rehearsal tools and final language pass

Three orders are available in the map and timer: extract/whole then extract/whole, whole/extract then whole/extract, and extract/whole then whole/extract. Rehearsal notes save in browser storage under a separate key per course, with a plain-text download and a visible fallback when storage is unavailable. Resetting the timer does not erase notes.

The final language pass simplified abstract wording, clarified extract versus wider analysis, checked US spelling, preserved criterion explanations and added links to both course guides. Agreed edition and translation guidance uses A Doll’s House as an example. Student-facing IO content and printables were checked for the prohibited preparation term.

Terminology: use work as a whole, and body of work for the non-literary selection, throughout the teaching content and tools.

## Signposting

A dedicated section follows structure and timing. It defines signposting, gives original spoken examples for each main transition, models a transition into analysis using the existing invented story, and links the existing shared analytical-language resource. The reviewed IO checklist informed the organization emphasis; third-party wording was not copied.

Reviewed the publicly linked IB English Guys Signposting and Transitions handout and added direct handout/video links. Its one-minute introduction/conclusion and two-minute analytical sections differ from this site’s agreed timing model; the student-facing resource note makes that distinction explicit. Original examples remain on the site; the handout is not reproduced.

## Natural finish near ten minutes

Added a short attributed quotation from IB Examiner Instructions 2026, Criterion C, printed page 16. The guide recommends aiming for 10:00, treating approximately 9:30–10:30 as breathing room rather than a fixed penalty boundary, and protecting Q&A time. The timing map calls 10:00 a target; the practice timer still stops there and explicitly refers students to the natural-finish guidance.
