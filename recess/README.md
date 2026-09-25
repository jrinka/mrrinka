# Recess / Brain Break

Migrated from Mr. Rinka's Brain Break source on 2026-09-22. The original twelve games, banks, classroom controls, timers, drawing tools, exports, credits, and Recess Zine styles are preserved.

`npm run build:recess` builds this source into `public/recess.html` and hashed files under `public/recess-assets`. The main development and production build commands run it automatically. Rebuild it after editing Recess while a development server is running.

Next.js rewrites `/recess` to that standalone document. Use a normal HTML anchor to enter or leave it, not Next.js client-side routing: its CSS must stay isolated from the teaching site's global styles. No iframe, external application host, API, database, account, or external font request is required. Optional attribution links still lead to their original sources.

The original layout font imports are replaced by equivalent Fontsource packages bundled onto our domain. Their OFL licenses are copied alongside the generated assets. UI controls use the original Base UI wrappers; `variants.css` retains their shadcn state variants. The only visible navigation change is a link back to the classroom homepage.

Generated output is ignored by Git; edit the source here. Do not copy deployment credentials, `.openai` configuration, caches, or dependencies from the original project.

## The Numbers Department

Four further games live in `math/`: Equation Pending (generated six/eight-character equations), Twenty-Four, Somehow (validated banks and exact arithmetic), One Small Adjustment (seven-segment match moves), and What Are the Odds? (original questions with enumerated outcome grids). Arithmetic uses a bounded parser and exact fractions, never `eval`. Tests validate every shipped puzzle and the equation generator. Timers are optional and do not lock out play. Hints and explanations appear only after a player requests them. Any true one-match equation and any valid make-24 expression are accepted. Equation swaps use a narrower, documented commutative-operation rule.

Activity downloads offer plain text (default) or Markdown; Markdown fences the record to preserve equations and student input. New rounds reset work and timers. Rebuild Recess after source changes; restart a production preview server (`npm run start`) after rebuilding assets because it indexes public filenames at startup.

## Hangman

Hangman replaces Six-Word Stories in slot 7. It supports mouse/touch and physical keyboard guesses, six misses, a shuffled word bank, masked teacher words of 4–12 letters, answer reveal, and activity exports. Repeated guesses do not cost another chance; finished rounds lock guessing until a new word starts.

## Bank sizes and rotation (September 2026)

- Wordle: 632 unique five-letter words, up from 61 (the old bank also contained the six-letter SATIRE). Existing five-letter vocabulary is combined with historical answers from the community [Wordle Answers Archive](https://mdahlman.github.io/wordle/), dated June 19, 2021–February 15, 2023. Its 605 uncommented archive rows were deduplicated; SISSY, FANNY, OPIUM, BOOZE, CIGAR and WENCH were omitted from the classroom defaults. Commented alternative/original-schedule rows were excluded. This is an independent classroom bank, not a claim to reproduce the current NYT schedule. The source was accessed September 25, 2026; there is no runtime download.
- Hangman: 716 words. Uses the five-letter bank plus longer classroom vocabulary and anagram words up to 12 letters, with duplicates removed.
- Anagram Race: 80 source words (was 20). Reverse Dictionary: 100 definitions. Quick Debate: 100 prompts. Word Ladder: 60 paths. Red Letter/Yellow Letter: 180 categories with 1,556 examples. Scattergories: 180 categories.
- Masterpiece: 60 original prompts (was 24); Blob: 32 prompts (was 12) and eight independently rotated shapes. Inventions: all 960 subject/purpose pairs rotate before any pair repeats. Memory: all 32 objects rotate in batches of eight before refilling.
- Make-24: 100 standard and 36 division-required puzzles (was 12 and 5); all have solver-verified solutions. Matchsticks: 100 solvable, initially false equations (was 17). Odds: 24 original questions (was 12), validated against enumerated outcomes. Equation Pending: 160 six-character and 2,614 eight-character equations. It now deduplicates commutative equivalents, so operand swaps cannot appear as separate puzzles.

`decks.ts` stores each bank's remaining indices, fingerprint, and previous draw in local browser storage. Opening another game, returning, reloading, or starting a later visit on the same browser preserves rotation. Each complete bank is exhausted before it refills, with the previous draw avoided at the boundary when possible. Separate difficulty levels, categories, and games have independent decks. New bank contents reset only the affected deck. Teacher custom Wordle banks use a separate rotation; the words themselves are not stored. Clearing browser data or using another browser starts a fresh rotation. When storage is unavailable, rotation still works for the current page visit. No Kimi calls or other API changes are included; future AI work could propose additions for review before inclusion in these banks.
