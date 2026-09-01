# Submission

## Deployment

- Source repository: https://github.com/tombeng027/paperwork-editor
- Live deployment URL: https://tombeng027.github.io/paperwork-editor/
- Walkthrough video: https://drive.google.com/drive/folders/1Czgk8nCFVjObHRuSJMefxeYhb8iVJVmO?usp=sharing
- Google Drive submission folder: https://drive.google.com/drive/folders/1Czgk8nCFVjObHRuSJMefxeYhb8iVJVmO?usp=sharing
- Deployment target: GitHub Pages, built and deployed by `.github/workflows/deploy-pages.yml`.

## Local Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and add the Supabase project URL and publishable key.
3. Run [the primary schema migration](supabase/migrations/20260901000000_document_editor.sql) in Supabase SQL Editor.
4. For an existing database created before the RLS correction, run [the one-time RLS repair](supabase/repairs/fix_document_rls_recursion.sql).
5. Create the two Auth users below in Supabase, then run [the demo profile seed migration](supabase/migrations/20260901000001_seed_demo_profiles.sql).
6. Start the app with `npm run dev`.

For GitHub Pages, configure the Supabase and demo-account values as GitHub Actions repository secrets. The deployment workflow builds with the required repository base path and publishes on each push to `main`.

Quality gates:

```powershell
npm test
npm run test:e2e
npm run build
```

`test:e2e` uses a dedicated account supplied through `E2E_EMAIL` and `E2E_PASSWORD`; it skips cleanly when those variables are not provided to avoid modifying demo data.

## Repository Structure

- `src/` - React application source.
- `src/components/` - Auth, editor, document list and tabs, sharing, file upload, and UI controls.
- `src/lib/` - Supabase client initialization.
- `src/utils/` - File parser and its co-located Vitest unit tests.
- `supabase/migrations/` - Schema, RLS, Storage, and demo-profile migrations.
- `supabase/repairs/` - One-time correction script for pre-existing databases.
- Root Markdown files - architecture, AI workflow, setup instructions, and submission notes.
- `WALKTHROUGH_VIDEO_URL.txt` - final video URL handoff artifact.

There is no separate `tests/` directory: parser tests live beside the utility they verify in `src/utils/`, which keeps the small codebase easy to navigate.

## Demo Access Credentials

| User | Email | Password |
| --- | --- | --- |
| Alice | `alice@test.com` | `password123` |
| Bob | `bob@test.com` | `password123` |

These are development-only demo credentials. Before sharing this submission, verify the deployed `SUPABASE_DEMO` GitHub secret and the two Supabase Auth users use the stated password; do not publish personal credentials or production accounts.

## Feature Matrix

- [x] Document Creation & Rich Text Formatting: Bold, Italic, Underline, H1/H2, Bulleted Lists, and Numbered Lists.
- [x] Auto-save & LocalStorage Persistence: 800 ms debounced database saves with a local offline fallback.
- [x] File Ingestion: `.md` and `.txt` import into the active draft and private attachments in Supabase Storage.
- [x] Explicit Access Sharing & RLS Security: owner-only sharing management and owner-or-collaborator database authorization.
- [x] Automated testing: Vitest integration/parser coverage plus an opt-in Playwright document lifecycle suite.
- [x] Open-document tabs: closeable tabs with an empty dashboard state when no document is open.
- [ ] Real-time Collaborative Cursors: intentionally deprioritized and documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## QA Notes

The release checks are `npm run lint`, `npm test`, `npm run test:e2e`, and `npm run build`. The Playwright lifecycle test is intentionally skipped until `E2E_EMAIL` and `E2E_PASSWORD` are provided for a dedicated non-reviewer Supabase account. Vite emits a non-blocking bundle-size advisory for the Tiptap editor bundle; code splitting is a post-submission optimization.
