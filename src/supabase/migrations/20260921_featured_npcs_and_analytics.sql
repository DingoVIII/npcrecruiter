-- Apply in Supabase SQL editor before deploying this update.
-- Public featured NPC library and privacy-conscious event tracking.
create table if not exists public.featured_npcs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  gender text not null default 'Not specified',
  species text not null,
  occupation text not null,
  appearance text[] not null default '{}',
  personality text not null,
  roleplaying_cue text not null,
  quest_title text not null,
  quest_hook text not null,
  full_adventure text not null,
  portrait_url text,
  character_card_url text,
  clean_video_url text,
  youtube_video_id text,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists featured_npcs_public_order
  on public.featured_npcs(published, display_order, created_at desc);

alter table public.featured_npcs enable row level security;
create policy "Anyone can read published featured NPCs"
  on public.featured_npcs for select to anon, authenticated
  using (published = true);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text,
  event_name text not null,
  page_path text not null,
  featured_npc_id uuid references public.featured_npcs(id) on delete set null,
  success boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at
  on public.analytics_events(created_at desc);
create index if not exists analytics_events_event_name
  on public.analytics_events(event_name, created_at desc);
create index if not exists analytics_events_featured_npc
  on public.analytics_events(featured_npc_id, event_name, created_at desc);

alter table public.analytics_events enable row level security;
-- Events are written by the service-role API and read by the admin dashboard only.

insert into storage.buckets (id, name, public)
values ('featured-media', 'featured-media', true)
on conflict (id) do update set public = excluded.public;

alter table public.site_visits
  add column if not exists session_id text;

create index if not exists site_visits_session_created
  on public.site_visits(session_id, created_at desc);
