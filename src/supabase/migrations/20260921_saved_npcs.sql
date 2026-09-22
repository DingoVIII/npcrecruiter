-- Apply in Supabase SQL editor before deploying this update.
create table if not exists public.saved_npcs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  npc jsonb not null,
  quest_hook text,
  full_quest text,
  created_at timestamptz not null default now()
);
create index if not exists saved_npcs_user_created on public.saved_npcs(user_id, created_at desc);
alter table public.saved_npcs enable row level security;
create policy "Members read their own NPCs" on public.saved_npcs for select to authenticated using ((select auth.uid()) = user_id);
create policy "Members save their own NPCs" on public.saved_npcs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Members update their own NPCs" on public.saved_npcs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Members delete their own NPCs" on public.saved_npcs for delete to authenticated using ((select auth.uid()) = user_id);
