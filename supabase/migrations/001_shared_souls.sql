-- Migration: Create shared_souls table for share/[id] feature
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

create table if not exists shared_souls (
  id text primary key,
  soul jsonb not null,
  created_at timestamptz default now()
);

-- Enable RLS (optional, souls are public by design)
alter table shared_souls enable row level security;

-- Allow anyone to read any shared soul (needed for embed/links)
create policy "Anyone can read shared souls"
  on shared_souls for select
  using (true);

-- Allow anyone to insert (no auth required for sharing)
create policy "Anyone can share a soul"
  on shared_souls for insert
  with check (true);
