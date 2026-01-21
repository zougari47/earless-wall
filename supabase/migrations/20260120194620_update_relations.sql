-- Drop existing foreign keys referencing auth.users
alter table public.contacts
  drop constraint if exists contacts_user_id_fkey,
  drop constraint if exists contacts_friend_id_fkey;

-- Add new foreign keys referencing public.profiles
alter table public.contacts
  add constraint contacts_user_id_fkey
  foreign key (user_id)
  references public.profiles(id)
  on delete cascade;

alter table public.contacts
  add constraint contacts_friend_id_fkey
  foreign key (friend_id)
  references public.profiles(id)
  on delete cascade;
