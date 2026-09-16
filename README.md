# Mr Rinka — English classroom

Public course pages for IB English A: Language & Literature, IB English A: Literature, and English 10. Graphite and citron design with a GitHub-backed teacher editor.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Visit `http://127.0.0.1:3000`. For a stable local production preview, use `npm run build` then `npm start`. If the local file watcher reaches its operating-system limit, use the production preview while editing and rebuild after changes.

## Content and editing

- Course content lives in `content/<course-id>.json` and is validated by `lib/schema.ts`.
- `/admin` is the teacher editor. `/admin/preview` is a clearly labeled sandbox that cannot publish.
- Admin access is restricted to the numeric GitHub user ID in `ADMIN_GITHUB_ID`.
- Saves create GitHub commits on `CONTENT_BRANCH`. Connect the repository to Vercel so those commits deploy automatically.
- Saves compare the loaded file SHA with GitHub. If another edit landed, export your unsaved copy and reload to merge the changes rather than overwriting them.
- Drafts are excluded from public course pages. This repository is public, so draft source text is still visible on GitHub. Do not store confidential material here.
- Uploads support PDF, PNG, JPG, WebP, and TXT up to 2 MB. Uploaded files are public after deployment even if their page is a draft. Use HTTPS links to shared documents for other formats or larger files.
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
