# Recess / Brain Break

Migrated from Mr. Rinka's Brain Break source on 2026-09-22. The original twelve games, banks, classroom controls, timers, drawing tools, exports, credits, and Recess Zine styles are preserved.

`npm run build:recess` builds this source into `public/recess.html` and hashed files under `public/recess-assets`. The main development and production build commands run it automatically. Rebuild it after editing Recess while a development server is running.

Next.js rewrites `/recess` to that standalone document. Use a normal HTML anchor to enter or leave it, not Next.js client-side routing: its CSS must stay isolated from the teaching site's global styles. No iframe, external application host, API, database, account, or external font request is required. Optional attribution links still lead to their original sources.

The original layout font imports are replaced by equivalent Fontsource packages bundled onto our domain. Their OFL licenses are copied alongside the generated assets. UI controls use the original Base UI wrappers; `variants.css` retains their shadcn state variants. The only visible navigation change is a link back to the classroom homepage.

Generated output is ignored by Git; edit the source here. Do not copy deployment credentials, `.openai` configuration, caches, or dependencies from the original project.
