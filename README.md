# Paperwork

A lightweight collaborative rich-text editor built with React, TypeScript, Vite, Tailwind CSS, Tiptap, and Supabase.

## Prerequisites

- Node.js 20 or later
- A Supabase project
- Two email addresses that can receive Supabase confirmation emails

## Setup

1. In the Supabase Dashboard, open **SQL Editor** and run [the migration](supabase/migrations/20260901000000_document_editor.sql).
2. In **Authentication > Providers > Email**, enable Email. For a short local test, disable **Confirm email**; otherwise confirm both user emails after signup.
3. Copy `.env.example` to `.env` and set the project URL and anon key from **Project Settings > API**:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_DEMO_ALICE_EMAIL=alice@example.com
   VITE_DEMO_ALICE_PASSWORD=use-a-password-of-at-least-six-characters
   VITE_DEMO_BOB_EMAIL=bob@example.com
   VITE_DEMO_BOB_PASSWORD=use-a-password-of-at-least-six-characters
   ```

4. Create Alice and Bob using the app's **Sign up** flow, or add the users in **Authentication > Users**. The profile trigger creates their `profiles` rows automatically.
5. Install dependencies and start the app:

   ```powershell
   npm install
   npm run dev
   ```

6. Open the URL printed by Vite, normally `http://127.0.0.1:5173`.

## Deploy To GitHub Pages

1. Create an empty GitHub repository, then initialize this folder, commit its contents, and push the `main` branch.
2. On GitHub, open **Settings > Pages** and set **Source** to **GitHub Actions**.
3. In **Settings > Secrets and variables > Actions**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as repository secrets or variables. Add the optional demo-account values only if you want the one-click demo buttons enabled.
4. Push to `main` or run the **Deploy GitHub Pages** workflow manually from the repository's **Actions** tab.
5. GitHub publishes the site at `https://<github-user>.github.io/<repository-name>/`. Add this URL to Supabase **Authentication > URL Configuration** as the Site URL and an allowed redirect URL.

The workflow in `.github/workflows/deploy-pages.yml` builds the Vite app with the repository base path automatically. `.env` is ignored by Git; never commit Supabase credentials.

## Automated Checks

Run the focused parser test:

```powershell
npm test
```

Run the production type-check and build:

```powershell
npm run build
```

Expected result: both commands exit successfully and Vitest reports two passing tests.

## End-to-End Test Workflow

Open one normal browser window and one private/incognito window so Alice and Bob maintain independent Supabase sessions.

1. In the normal window, use **Login as Alice**. Confirm that **My documents** is selected and it initially shows no documents.
2. Click the new-document icon in the left sidebar. Confirm an `Untitled document` appears with the `Owner` badge and the editor reports `Saved` after the first change.
3. Write `Alice's shared plan`, select it, and exercise Bold, Italic, Underline, Heading 1, Heading 2, Bulleted List, and Numbered List. Refresh the page after `Saved`; all formatting should persist.
4. Create a local file named `notes.md`:

   ```markdown
   # Imported notes
   **Important** *detail*
   ```

   Drop it onto the upload area or use the upload icon. Confirm the text appends to the editor and a file appears in the `document-attachments/<document-id>/` path in **Storage**.
5. Click **Share**, enter Bob's email address, and click **Grant access**. Confirm the modal reports success.
6. In the private window, use **Login as Bob**. Open **Shared with me**. Confirm Alice's document appears with the `Shared` badge and without a Share button.
7. As Bob, add a final paragraph. Wait for `Saved`, then refresh. Confirm Bob's edit persists.
8. Return to Alice's window and refresh. Confirm Bob's content is visible. The current time-boxed implementation persists on save and refresh; it does not include live cursor or presence updates.
9. As Bob, verify there is no UI action to share or delete Alice's document. In Supabase, verify Bob cannot insert or delete rows in `document_access`; the RLS policy allows only the owner.

## Expected RLS Results

| User | Own document | Shared document | Unshared document |
| --- | --- | --- | --- |
| Alice (owner) | Read, edit, delete, share | N/A | N/A |
| Bob (collaborator) | N/A | Read and edit | Cannot read or edit |

## Project Structure

- `src/components` - authentication, editor, sharing, upload, and document dashboard components
- `src/lib/supabase.ts` - Supabase client initialization
- `src/utils/fileParser.ts` - `.txt` and Markdown import conversion
- `supabase/migrations` - database, RLS, Storage bucket, and policy setup
