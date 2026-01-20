create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  username text not null unique,
  name text not null,

  primary key (id)
);

alter table public.profiles enable row level security;

-- Allow users to read their own row
create policy select_own_profile on public.profiles
  for select
  using (id = auth.uid());

-- Allow users to insert their own row
create policy insert_own_profile on public.profiles
  for insert
  with check (id = auth.uid());

-- Allow users to update their own row
create policy update_own_profile on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

---------------------------------------------------
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  friend_id uuid not null references auth.users on delete cascade,
  status text not null default 'pending', -- pending, accepted, blocked
  created_at timestamptz not null default now(),

  unique(user_id, friend_id)
);

alter table public.contacts enable row level security;

-- Allow users to see their own contacts
create policy select_own_contacts on public.contacts
  for select
  using (user_id = auth.uid() or friend_id = auth.uid());

-- Allow users to insert a contact (send request)
create policy insert_own_contacts on public.contacts
  for insert
  with check (user_id = auth.uid());

-- Allow users to update a contact (accept/block)
create policy update_own_contacts on public.contacts
  for update
  using (user_id = auth.uid() or friend_id = auth.uid())
  with check (user_id = auth.uid() or friend_id = auth.uid());
