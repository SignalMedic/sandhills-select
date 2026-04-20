-- Add waiver support to events
alter table public.events add column if not exists waiver_text text;

-- Add missing registration fields
alter table public.event_registrations add column if not exists player_dob date;
alter table public.event_registrations add column if not exists position text;
alter table public.event_registrations add column if not exists registrant_phone text;
alter table public.event_registrations add column if not exists waiver_accepted boolean not null default false;
alter table public.event_registrations add column if not exists waiver_signature text;
alter table public.event_registrations add column if not exists notes text;
