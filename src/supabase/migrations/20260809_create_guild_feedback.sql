-- NPC Recruiter
-- Private in-app Guild Feedback
-- Run once in Supabase SQL Editor or through your normal migration workflow.

create extension if not exists pgcrypto;

create table if not exists public.guild_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (
    char_length(trim(comment)) between 1 and 4000
  ),
  allow_contact boolean not null default false,
  page_path text null,
  app_version text null,
  user_agent text null,
  created_at timestamptz not null default now()
);

create index if not exists guild_feedback_created_at_idx
  on public.guild_feedback (created_at desc);

create index if not exists guild_feedback_user_id_idx
  on public.guild_feedback (user_id);

alter table public.guild_feedback enable row level security;

-- Signed-in users may submit feedback only as themselves.
drop policy if exists "guild_feedback_insert_own" on public.guild_feedback;

create policy "guild_feedback_insert_own"
on public.guild_feedback
for insert
to authenticated
with check (auth.uid() = user_id);

-- Deliberately no public/authenticated SELECT policy.
-- Guildmaster reads are performed server-side with the service role
-- after requireAdmin() succeeds.
