# Individual Oral speaking card prototype

Unpublished review draft based on the existing October 9 private timing prototype. No production route, public asset, course content, or hosting configuration is changed. The hosted private prototype is also unchanged.

The card contains ten editable cues arranged 1 / 2 / 2 / 2 / 2 / 1. Whitespace-based word counts are visible for every cue. About 30–35 words is optional drafting guidance, never an IB rule or enforced cap. Shorter and longer notes are preserved. Students practice explaining their reasoning in fresh words rather than memorizing scripts.

Language & Literature distinguishes the literary work from the non-literary body of work; Literature uses two literary works. Whole-first ordering moves each section's cues with it. The existing timer retains a 0:30 introduction, four 2:15 analytical sections, and a 0:30 conclusion. Checkpoints remain recommendations; transitions are student-marked and the timer continues beyond 10:00.

Word, PDF, and Markdown card downloads are created in the browser. The Word writer comes from the existing private prototype. PDF uses the repository's installed pdfmake engine and embedded fonts with a compact card layout; the shared practice-record export API remains available in the client bundle. Markdown is structured for round-trip import. No student text is sent with an asset request.

Plain-text import accepts exactly ten cues, one per nonempty line, with optional bullet or number markers. Indented continuation lines are supported, as are this card's Markdown headings. Imported cues map to the displayed section order. Import validates the whole outline and asks before replacing current notes; invalid or oversized files leave the card untouched. Blank cues round-trip through numbered Markdown slots. This is a text importer, not a Word/PDF parser.

Notes, reflection, and timings exist only in page memory. Refresh starts an empty card and reflection. Timer reset preserves the current card for another rehearsal. There is no automatic persistence, submission, student account, audio recording, AI request, or remote asset dependency. Hosting access controls belong to the private host, not to the student tool. The brief card is explicitly distinguished from the detailed preparation worksheet and rehearsal reflection. Optional browser agent tools expose timing only, never notes or reflection.

From the repository root:

```bash
node prototypes/io-speaking-card/build.mjs
node --test prototypes/io-speaking-card/tests/*.test.mjs
npm run typecheck
node --import tsx --test tests/*.test.ts
npm run build
```

The standalone build copies static source to `dist/` and bundles the installed export dependencies locally. `dist/` is ignored and is outside Next's production routes and public assets. Serve that directory with a local static server for manual browser review. No publishing helper is invoked.

Validation: 13 prototype checks cover structure, counts without truncation, course/order retention, atomic imports and cancellation, Markdown round trips, Word ZIP/XML, real bundled PDF output, timer controls, fresh-page clearing, and absence of persistence/submission APIs in application modules. Representative Word and PDF cards were independently opened, rendered, and visually inspected; 35-word cue samples fit one page. Longer notes can create additional pages. Repository tests, TypeScript, and production build also passed.

Remaining publication gate: native browser layout, actual browser download/import dialogs, keyboard navigation, and network/storage inspection could not be verified in this environment. The DOM harness checks application listeners but does not substitute for browser QA. Do that review before publishing or integrating with mrrinka.com. No student-facing publication is proposed until that check is complete.
