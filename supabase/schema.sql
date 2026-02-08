-- ============================================================
-- Deadware Risk Scanner — Supabase Database Setup
-- ============================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  plan text not null default 'free',
  scans_used integer not null default 0,
  polar_customer_id text,
  polar_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. RLS policies — users can only read/update their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Increment scan count function (called from client via RPC)
create or replace function public.increment_scan_count(user_id uuid)
returns void as $$
begin
  update public.profiles
  set scans_used = scans_used + 1,
      updated_at = now()
  where id = user_id;
end;
$$ language plpgsql security definer;
