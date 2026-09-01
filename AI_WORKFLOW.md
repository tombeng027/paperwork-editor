# AI Workflow

## AI Tooling Used

- GitHub Copilot / Cursor for implementation assistance, iteration, debugging, and code review.
- Gemini for requirement refinement and review prompts.

AI was used as an engineering force multiplier. Design decisions, security boundaries, local environment configuration, and final verification remained deliberate implementation responsibilities.

## High-Leverage AI Contributions

AI accelerated delivery in the repetitive but high-context parts of the build:

- Initial Supabase schema, migrations, triggers, Storage policies, and RLS policy drafts.
- React and TypeScript component scaffolding for authentication, document navigation, tabs, editor controls, sharing, uploads, and delete behavior.
- Initial Vitest coverage for the raw-text and Markdown parser.
- Rapid diagnosis of database policy recursion and its replacement with narrow security-definer access helpers.

## AI Output Refactored or Rejected

- **Rejected:** Naive keystroke-based synchronization that would write to Supabase after every character. The final implementation uses a stable `useCallback` debounce with an 800 ms delay.
- **Refactored:** Permissive or circular RLS policy drafts. The final model checks document ownership or an explicit `document_access` record, while owner-only policies protect sharing management.
- **Corrected:** Tiptap hook callback behavior. The editor keeps the current `onChange` handler in a ref, preventing stale callback behavior and avoiding unnecessary editor reinitialization on parent renders.
- **Extended:** Basic parsing into a file-oriented import utility, `parseFileToContent(file)`, which validates file types, produces a cleaned filename-derived title, and parses Markdown headings and lists into Tiptap-compatible HTML.

## Verification & Testing Strategy

Automated verification uses Vitest for file ingestion and component integration behavior. The suite covers Markdown heading conversion, inline formatting, list conversion, filename extension stripping, document creation, title persistence, toolbar commands, and debounced HTML saves. Playwright provides a real-browser document lifecycle test that creates, renames, formats, saves, and reloads a document using a dedicated QA account. `npm run build` runs TypeScript compilation and a Vite production build.

Manual verification uses separate Alice and Bob browser sessions. The workflow verifies document creation, formatting persistence, sharing, collaborator edits, owner-only deletion, private attachment upload, and RLS enforcement. The demo accounts are `alice@test.com` and `bob@test.com`; their Auth users must be created in Supabase before the profile seed migration is run.
