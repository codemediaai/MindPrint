-- ═══════════════════════════════════════════
-- MindPrint — Database Schema
-- Mindroot Foundation
-- Run this in your Supabase SQL editor
-- ═══════════════════════════════════════════

-- Users table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique not null,
  name text,
  eprint_email text,
  print_time time default '05:30',
  calendar_connected boolean default false,
  calendar_refresh_token text,
  stripe_customer_id text,
  stripe_subscription_id text,
  active boolean default true
);

-- Journal entries
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  date date not null,
  week integer not null,
  virtue text not null,
  went_well text,
  improve text,
  notes text,
  daily_challenge_done boolean default false,
  xp_earned integer default 0
);

-- Delivery log
create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  date date not null,
  week integer not null,
  virtue text not null,
  status text not null check (status in ('delivered', 'failed', 'skipped')),
  error text
);

-- XP totals (materialized for fast reads)
create table if not exists public.xp_totals (
  user_id uuid primary key references public.users(id) on delete cascade,
  total_xp integer default 0,
  streak_days integer default 0,
  longest_streak integer default 0,
  last_active_date date
);

-- Indexes
create index if not exists idx_journal_user_date on public.journal_entries(user_id, date);
create index if not exists idx_deliveries_user_date on public.deliveries(user_id, date);
create index if not exists idx_users_active on public.users(active) where active = true;

-- Row Level Security
alter table public.users enable row level security;
alter table public.journal_entries enable row level security;
alter table public.deliveries enable row level security;
alter table public.xp_totals enable row level security;

-- Users can only read/update their own data
create policy "Users read own data" on public.users
  for select using (auth.uid() = id);
create policy "Users update own data" on public.users
  for update using (auth.uid() = id);

-- Journal entries are private per user
create policy "Users read own journal" on public.journal_entries
  for select using (auth.uid() = user_id);
create policy "Users insert own journal" on public.journal_entries
  for insert with check (auth.uid() = user_id);
create policy "Users update own journal" on public.journal_entries
  for update using (auth.uid() = user_id);

-- Delivery log is read-only for users
create policy "Users read own deliveries" on public.deliveries
  for select using (auth.uid() = user_id);

-- XP totals are read-only for users
create policy "Users read own xp" on public.xp_totals
  for select using (auth.uid() = user_id);
