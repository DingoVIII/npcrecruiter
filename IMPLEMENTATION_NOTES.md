# NPC Recruiter registration barrier: local implementation draft

This is a **local, untested draft**, not a production-ready release. No push, deployment, or database migration was performed.

## Implemented in this draft
- Anonymous four-NPC recruitment (3 calls per day, per network IP) and one-NPC Quest Giver (8 calls per day, separate counter). Authenticated users retain the existing unlimited text recruitment behaviour; paid Guild Tokens remain separate.
- Separate quest giver page, editable NPC and quick quest hook, text download, sessionStorage draft, free selected-NPC saving after sign-in, full quest for 1 token, portrait for 2 tokens, new saved-NPC library.
- Homepage links to both generators. Existing cast and portrait features are retained.
- Server-side Redis limits fail closed if Redis is missing. Existing anonymous traffic tracker remains; the proposed dedicated conversion funnel was NOT implemented.

## Required before release
1. Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and manual end-to-end tests with staging Supabase and Stripe. Dependencies could not be installed in this environment (npm ci timed out). **None of these checks passed here.**
2. Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in staging and production. Verify forwarded IP handling on Vercel and test daily counters; a shared IP shares the allowance. The rate limiter consumes an allowance on API errors; decide whether to refund failed generations before release.
3. Review and apply `src/supabase/migrations/20260921_saved_npcs.sql` in a staging database, then test RLS, signup with and without email confirmation, and authenticated saves.
4. Audit spend/refund concurrency and retry behaviour for quest and portrait routes. For production, add idempotency and durable job records to avoid double charging on retries/timeouts. The quest portrait route currently runs synchronously; Vercel timeouts must be tested and preferably moved into existing portrait job workflow.
5. Test anonymous cast UI end to end. Existing authenticated autosave, portrait workflows and four-character Guild Archive were preserved, but have not been regression tested. Review whether to hide authenticated-only portrait controls for anonymous users.
6. Populate landing page featured free character, portrait, full quest, and video when actual approved media is available. No demo assets were supplied; do not fabricate them.
7. Add explicit generation/save/registration/purchase conversion events with privacy-conscious consent/retention rules. The existing traffic tracker alone is insufficient.
8. **Security:** public repository includes `stripe_backup_code.txt`. Review exposure and rotate any credential/recovery code in it. This archive intentionally excludes that file and the Git history, but removing it from a future commit will not remove historical exposure.

No credentials are bundled in this draft. No real token charges were made.
