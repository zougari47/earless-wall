alter table public.profiles 
add column created_at timestamptz not null default now(),
add column onboarding_completed boolean not null default false;
