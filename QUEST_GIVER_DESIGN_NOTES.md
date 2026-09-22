# Quest Giver visual update

This is a local-only design update based on the previous registration draft. No GitHub, Vercel, or Supabase changes were made.

## Changed
- `src/app/quest-giver/page.tsx`
- `src/app/quest-giver/quest-giver.module.css` (new)

## Features
- Two-column desktop workspace with a portrait/character column and independently scrolling parchment adventure journal.
- Responsive single-column layout on smaller screens.
- Portrait placeholder and commission action (2 Guild Tokens), image display when generated, and separate portrait link.
- Full quest generation (1 Guild Token), full quest read view, adventure download, and optional editing.
- Existing save/sign-in handoff, text download, editable character fields, session storage, and anonymous allowance retained.
- Once a full quest exists, the charge button is replaced with download/edit controls to avoid accidental repeat charges.

## Testing
Dependency installation timed out in this environment. This update has NOT passed a TypeScript build or browser testing here. On your Windows machine, back up your current folder and copy only the two changed files into your current local test project. Run `npm run build`, then `npm run dev` and check `/quest-giver`. Do not deploy until build and functional tests pass.

## Database note
This design update does not require a migration. The prior quest-generation transaction update is separate. The portrait endpoint uses existing `portrait_generation` transaction type.
