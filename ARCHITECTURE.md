# Architecture

## System Architecture

Paperwork is a React single-page application built with TypeScript and Vite. Tailwind CSS provides responsive layout and consistent visual states, while Lucide supplies accessible, familiar control icons.

Tiptap is the editor engine. `@tiptap/react`, `@tiptap/starter-kit`, and the Underline extension produce a structured rich-text document model and serialize editor content to HTML for persistence. The import pipeline parses `.txt` and `.md` files into Tiptap-compatible HTML, preserving supported headings, emphasis, ordered lists, and unordered lists.

Supabase provides backend persistence and identity:

- Postgres stores profiles, documents, and document-access grants.
- Supabase Auth establishes the authenticated user identity.
- Supabase Storage holds private imported-file attachments.
- Postgres Row-Level Security (RLS) enforces document access.

The frontend is deployable to Vercel. A deployment requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables, plus Supabase Auth site and redirect URLs configured for the deployed domain.

## Core Security Model: Row-Level Security

Security is enforced at the Postgres tier, not by client-side visibility. Document policies compare `auth.uid()` to a document's `owner_id`, or confirm a matching `document_access` grant for the same authenticated `user_id`. Owners can create, edit, delete, and manage sharing. Collaborators can read and edit only documents explicitly shared with them.

The `document_access` table is itself owner-managed: its RLS policies permit the document owner to add, inspect, update, and revoke access. Security-definer helper functions evaluate access without recursive policy evaluation. Storage policies reuse the same owner-or-collaborator rule for private attachment paths.

Client-side state controls presentation only. Hiding Share or Delete controls is a usability feature, not authorization. A malicious or modified browser request still reaches the database policies and is rejected when it does not satisfy the RLS predicates.

## Resilience & State Synchronization

Tiptap delegates content changes through a stable callback reference. The application schedules persistence with a `useCallback`-based 800 ms debounce, which batches typing bursts and prevents one API update per keystroke.

The editor exposes four persistence states:

- `Idle`
- `Saving...`
- `Saved to database`
- `Saved locally (offline)`

When the browser is offline, or Supabase returns a network-style failure, the latest document HTML is retained in `localStorage` under a document-specific key. This prevents a temporary connectivity failure from discarding the user's draft. Successful remote saves remove the offline cache. Automatic reconnect retry and conflict resolution remain follow-up work.

## Engineering Trade-offs & Scope Cuts

The 4-6 hour scope prioritized robust single-user persistence, explicit Markdown/text parsing, and granular database authorization over real-time collaboration transport. Production-grade real-time editing requires more than a websocket subscription: it needs a shared editing protocol, CRDT conflict handling, cursor presence, connection recovery, and an operational strategy for document updates.

Yjs or Tiptap Collaboration is therefore intentionally deferred. The current architecture establishes a secure persistence and access-control baseline that can support that work without treating browser state as authoritative.

## Future Engineering Roadmap

- Add multi-user cursors and concurrent editing with Tiptap Collaboration and a Yjs-backed provider.
- Add `viewer` and `editor` roles to `document_access`, enforced through RLS policies.
- Add a Postgres document-version snapshot table with restore and diff workflows.
- Retry locally cached saves after reconnect and provide a conflict-resolution experience.
- Add attachment management, document title editing, PDF/ePub export, and browser-level authorization regression tests.
