alter table public.announcements add column if not exists pinned boolean not null default false;
