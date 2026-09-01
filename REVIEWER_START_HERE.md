# Paperwork Review Guide

## Start Here

- Live app: https://tombeng027.github.io/paperwork-editor/
- Source repository: https://github.com/tombeng027/paperwork-editor
- Walkthrough video and submission folder: https://drive.google.com/drive/folders/1Czgk8nCFVjObHRuSJMefxeYhb8iVJVmO?usp=sharing

## Demo Accounts

| User | Email | Password |
| --- | --- | --- |
| Alice | `alice@test.com` | `password123` |
| Bob | `bob@test.com` | `password123` |

## Quick Review Flow

1. Open the live app and log in as Alice.
2. Create a document, edit the title, type content, and try the formatting toolbar.
3. Wait briefly and confirm the status changes to `Saved to database`.
4. Use **Share** to grant access to Bob.
5. Open the live app in an incognito/private window and log in as Bob.
6. Open **Shared with me**, edit Alice's document, and save.
7. Confirm Bob does not have Share or Delete controls. Refresh Alice's page to confirm Bob's change persisted.

## What Is Included

- `Paperwork-source.zip` contains the complete source code without local credentials or dependencies.
- `README.md` contains local setup, GitHub Pages deployment, and detailed testing instructions.
- `ARCHITECTURE.md` explains the technical design, security model, resilience, and scope decisions.
- `AI_WORKFLOW.md` explains the AI-assisted engineering workflow and verification process.
- `SUBMISSION.md` summarizes the delivered features, links, credentials, and known scope cuts.
- `WALKTHROUGH_VIDEO_URL.txt` contains the walkthrough folder link.

## Scope Note

Paperwork supports document creation, rich-text editing, auto-save, offline draft recovery, file import, sharing, and database-enforced access rules. Real-time cursor presence and simultaneous CRDT collaboration were intentionally left out of this time-boxed implementation.
