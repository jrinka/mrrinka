# Mr Rinka — English classroom

Public course pages for IB English A: Language & Literature and Literature, with shared English skills and practice. English 10 remains as legacy editor data and routes. Graphite and citron design with a GitHub-backed teacher editor.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Visit `http://127.0.0.1:3000`. For a stable local production preview, use `npm run build` then `npm start`. If the local file watcher reaches its operating-system limit, use the production preview while editing and rebuild after changes.

## Content and editing

- Course content lives in `content/<course-id>.json` and is validated by `lib/schema.ts`.
- Each IB course opens on Assessments, with Text types as its second course tab. The Literature index is titled Literary forms. Both use the `text-types` section in the teacher editor. Shared analytical methods stay under Skills & Methods. Published guides appear in the course index, while planned topics are plain text until a guide is ready. Link directly from an assessment to a relevant guide and back, rather than copying guidance into both.
- `/admin` is the teacher editor. `/admin/preview` is a clearly labeled sandbox that cannot publish.
- Admin access is restricted to the numeric GitHub user ID in `ADMIN_GITHUB_ID`.
- Saves create GitHub commits on `CONTENT_BRANCH`. Connect the repository to Vercel so those commits deploy automatically.
- Saves compare the loaded file SHA with GitHub. If another edit landed, export your unsaved copy and reload to merge the changes rather than overwriting them.
- Drafts are excluded from public course pages. This repository is public, so draft source text is still visible on GitHub. Do not store confidential material here.
- Uploads support PDF, PNG, JPG, WebP, and TXT up to 50 MB, uploaded directly to Cloudflare R2. Uploaded files are public immediately even if their page is a draft. Use HTTPS links to shared documents for other formats or larger files. Existing `/uploads/` links remain valid.
- The starter close-reading and paragraph activities run in the browser. Writing is not submitted or persisted; students can download or copy it.
- To add content with Codex, pull the latest repository first and edit the same course JSON files. Preserve stable IDs and existing user edits. New custom practice components can be added in code and registered in the schema/editor.

## Vercel and GitHub sign-in

1. Import `jrinka/mrrinka` into Vercel. Use the Next.js preset and repository root; the default build command is `npm run build`.
2. Register a GitHub OAuth app with your stable Vercel site URL as its homepage and `<SITE_URL>/api/auth/callback` as its callback.
3. Add these server-only environment variables in Vercel, then redeploy:
   - `SITE_URL`: the exact HTTPS site origin, no trailing path.
   - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: from that OAuth app.
   - `SESSION_SECRET`: at least 32 random characters; generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `ADMIN_GITHUB_ID`: `264626020` (jrinka).
   - `CONTENT_REPOSITORY`: `jrinka/mrrinka`.
   - `CONTENT_BRANCH`: `main`.
4. Visit `/admin`, sign in, save a small edit, and verify the corresponding GitHub commit and Vercel deployment before relying on publishing.
5. When switching to `mrrinka.com`, update `SITE_URL` and the OAuth app homepage/callback together. Add both the bare and www domains in Vercel; copy the exact DNS values shown there into Cloudflare.

OAuth uses PKCE and a short-lived, encrypted, HttpOnly session cookie. The app requests GitHub's `public_repo` scope to save this public repository; GitHub OAuth scopes cover public repositories generally, while this server only writes the configured repository's course and upload paths. All mutation endpoints check the request origin, live GitHub identity, and server-side content validation. No credentials belong in Git or browser JavaScript.

## Images

Use stylistic photographs without visible faces. Every image must have alt text, photographer credit, and a source URL. Credit is visible on banners, cards, and detail pages. Free Unsplash images can be replaced with selections from the owner's account.

- Language & Literature: [Julia Taubitz](https://unsplash.com/photos/arrow-and-text-on-dark-floor-Nbj2ruj2c10).
- Literature: [Zoshua Colah](https://unsplash.com/es/fotos/estanterias-llenas-de-libros-de-colores-sdD9aUgSl2U).
- English 10: [Clay Banks](https://unsplash.com/photos/open-notebook-with-pen-and-pencils-on-desk-n9AaeihA9HI/).
- [Unsplash License](https://unsplash.com/license).

## Checks

```sh
npm test
npm run typecheck
npm run build
```

The repository includes starter teaching content, not a complete course or official IB assessment documentation. Add the actual class texts, tasks, and criteria through the editor.

## AI feedback provider

The three feedback routes (Passage Practice, Analysis/Comparison Refineries, and IO/HLE inquiry workshops) share one server-side model adapter. With `MINIMAX_APIKEY` alone, they use MiniMax M3. To switch them all to Kimi K3 on Fireworks, add `FIREWORKS_API_KEY` to the Vercel project's **Environment Variables** for Production and redeploy. A nonempty Fireworks key takes priority; removing it and redeploying returns to M3. The model and host shown to students and recorded in exports follow the selected provider. Never use a `NEXT_PUBLIC_` prefix or commit either key.

Test with invented student work after adding the key, including an on-task inquiry and a request to write assessment content. The existing scope and output checks remain in place, but a new model can behave differently. The provider switch does not alter any student-facing assessment rules.
The repeatable synthetic check and its human-review rubric are in [`docs/AI-CANARY.md`](docs/AI-CANARY.md).

## Resource storage (Cloudflare R2)

Selected guides and AI tools have a small fixed-choice feedback control. Votes are saved as anonymous JSON objects under `site-feedback/v1/` in the existing R2 bucket; the teacher sees only 30-day totals at `/admin/feedback`. A browser cookie and conditional write allow one vote per tool or page per day. No student draft, AI response, note, contact detail, or per-vote notification is collected. This bucket has a public asset domain, so keep this feature limited to these non-sensitive choices; free-text reports would need separate private storage and abuse controls.

New uploads use the `mrrinka-resources` Standard bucket at `https://resources.mrrinka.com`.
Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, and `R2_PUBLIC_URL` in Vercel production. Keep credentials server-only and scoped to Object Read & Write for this bucket.

Bucket CORS allows PUT, GET, HEAD from `https://mrrinka.com` and `https://mrrinka.vercel.app`, with content-type and x-amz-* headers. Upload URLs expire after ten minutes and fix the object key, content type, and size. Upload confirmation verifies size and a file signature before attaching the link. Only the authenticated teacher can initiate or confirm uploads. Interrupted uploads may remain in the bucket; remove unused files through Cloudflare.

Files become public upon upload, including files attached to drafts. Deleting a link does not delete its file. Course pages still save to GitHub and deploy through Vercel; file bytes no longer enter the repository. PDF links open using their application/pdf content type. R2 Standard usage beyond free allowances is billed by Cloudflare.
