# Recess / Brain Break

Migrated from Mr. Rinka's Brain Break source on 2026-09-22. The original twelve games, banks, classroom controls, timers, drawing tools, exports, credits, and Recess Zine styles are preserved.

`npm run build:recess` builds this source into `public/recess.html` and hashed files under `public/recess-assets`. The main development and production build commands run it automatically. Rebuild it after editing Recess while a development server is running.

Next.js rewrites `/recess` to that standalone document. Use a normal HTML anchor to enter or leave it, not Next.js client-side routing: its CSS must stay isolated from the teaching site's global styles. No iframe, external application host, API, database, account, or external font request is required. Optional attribution links still lead to their original sources.

The original layout font imports are replaced by equivalent Fontsource packages bundled onto our domain. Their OFL licenses are copied alongside the generated assets. UI controls use the original Base UI wrappers; `variants.css` retains their shadcn state variants. The only visible navigation change is a link back to the classroom homepage.

Generated output is ignored by Git; edit the source here. Do not copy deployment credentials, `.openai` configuration, caches, or dependencies from the original project.

## The Numbers Department

Four further games live in `math/`: Equation Pending (generated six/eight-character equations), Twenty-Four, Somehow (validated banks and exact arithmetic), One Small Adjustment (seven-segment match moves), and What Are the Odds? (original questions with enumerated outcome grids). Arithmetic uses a bounded parser and exact fractions, never `eval`. Tests validate every shipped puzzle and the equation generator. Timers are optional and do not lock out play. Hints and explanations appear only after a player requests them. Any true one-match equation and any valid make-24 expression are accepted. Equation swaps use a narrower, documented commutative-operation rule.

Activity downloads offer plain text (default) or Markdown; Markdown fences the record to preserve equations and student input. New rounds reset work and timers. Rebuild Recess after source changes; restart a production preview server (`npm run start`) after rebuilding assets because it indexes public filenames at startup.
