alter table public.events add column if not exists is_recurring boolean not null default false;
alter table public.events add column if not exists recurrence_days integer[];
alter table public.events add column if not exists recurrence_time time without time zone;
