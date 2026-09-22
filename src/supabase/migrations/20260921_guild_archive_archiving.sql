-- Apply in Supabase SQL editor before deploying this update.
-- Archive state is independent for saved casts and individual Quest Giver NPCs.
alter table public.casts
  add column if not exists archived_at timestamptz;

alter table public.saved_npcs
  add column if not exists archived_at timestamptz;

create index if not exists casts_user_archived_created
  on public.casts(user_id, archived_at, created_at desc);

create index if not exists saved_npcs_user_archived_created
  on public.saved_npcs(user_id, archived_at, created_at desc);
