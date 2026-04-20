-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('super_admin', 'admin', 'coach');
create type announcement_status as enum ('draft', 'published');
create type event_status as enum ('draft', 'published');
create type payment_status as enum ('pending', 'paid', 'refunded');
create type schedule_type as enum ('game', 'practice', 'scrimmage');
create type reimbursement_status as enum ('pending', 'under_review', 'approved', 'denied', 'paid');
create type highlight_type as enum ('photo', 'video', 'text');
create type highlight_status as enum ('pending', 'approved', 'rejected');
create type recipient_type as enum ('team', 'admin');

-- ============================================================
-- TABLES
-- ============================================================

create table public.profiles (
  id                        uuid primary key references auth.users(id) on delete cascade,
  full_name                 text not null,
  email                     text not null,
  role                      user_role not null default 'coach',
  stripe_connect_account_id text,
  stripe_connect_onboarded  boolean not null default false,
  created_at                timestamptz not null default now()
);

-- ============================================================
-- HELPER FUNCTION (defined after profiles table)
-- ============================================================

create or replace function get_user_role()
returns user_role
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create table public.teams (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  age_group  text not null,
  season     text not null,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.coach_teams (
  coach_id      uuid not null references public.profiles(id) on delete cascade,
  team_id       uuid not null references public.teams(id) on delete cascade,
  is_head_coach boolean not null default false,
  primary key (coach_id, team_id)
);

create table public.players (
  id             uuid primary key default gen_random_uuid(),
  team_id        uuid not null references public.teams(id) on delete cascade,
  full_name      text not null,
  jersey_number  text,
  position       text,
  created_at     timestamptz not null default now()
);

create table public.announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text not null,
  author_id    uuid not null references public.profiles(id) on delete restrict,
  status       announcement_status not null default 'draft',
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

create table public.events (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  description           text,
  location              text not null,
  start_date            timestamptz not null,
  end_date              timestamptz not null,
  age_groups            text[] not null default '{}',
  registration_open     boolean not null default false,
  registration_deadline timestamptz,
  price_cents           integer not null default 0,
  max_registrations     integer,
  status                event_status not null default 'draft',
  created_at            timestamptz not null default now()
);

create table public.event_registrations (
  id                       uuid primary key default gen_random_uuid(),
  event_id                 uuid not null references public.events(id) on delete cascade,
  player_name              text not null,
  registrant_name          text not null,
  registrant_email         text not null,
  age_group                text not null,
  stripe_payment_intent_id text,
  payment_status           payment_status not null default 'pending',
  amount_paid_cents        integer not null default 0,
  created_at               timestamptz not null default now()
);

create table public.schedule_entries (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams(id) on delete cascade,
  type       schedule_type not null,
  opponent   text,
  location   text not null,
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  notes      text,
  created_at timestamptz not null default now()
);

create table public.expense_categories (
  id   smallint primary key generated always as identity,
  name text not null unique
);

insert into public.expense_categories (name) values
  ('Meals'),
  ('Fuel'),
  ('Lodging'),
  ('Equipment'),
  ('Entry Fees'),
  ('Other');

create table public.reimbursement_requests (
  id                 uuid primary key default gen_random_uuid(),
  coach_id           uuid not null references public.profiles(id) on delete restrict,
  team_id            uuid not null references public.teams(id) on delete restrict,
  title              text not null,
  notes              text,
  total_amount_cents integer not null default 0,
  status             reimbursement_status not null default 'pending',
  denial_reason      text,
  approved_by        uuid references public.profiles(id) on delete set null,
  approved_at        timestamptz,
  stripe_transfer_id text,
  paid_at            timestamptz,
  created_at         timestamptz not null default now()
);

create table public.receipts (
  id                       uuid primary key default gen_random_uuid(),
  reimbursement_request_id uuid not null references public.reimbursement_requests(id) on delete cascade,
  image_url                text,
  merchant_name            text,
  amount_cents             integer not null,
  category_id              smallint not null references public.expense_categories(id) on delete restrict,
  expense_date             date not null,
  notes                    text,
  created_at               timestamptz not null default now()
);

create table public.highlights (
  id                uuid primary key default gen_random_uuid(),
  coach_id          uuid not null references public.profiles(id) on delete restrict,
  team_id           uuid not null references public.teams(id) on delete restrict,
  type              highlight_type not null,
  caption           text not null,
  media_url         text,
  status            highlight_status not null default 'pending',
  rejection_reason  text,
  approved_by       uuid references public.profiles(id) on delete set null,
  approved_at       timestamptz,
  facebook_post_id  text,
  instagram_post_id text,
  x_post_id         text,
  created_at        timestamptz not null default now()
);

create table public.messages (
  id             uuid primary key default gen_random_uuid(),
  sender_name    text not null,
  sender_email   text not null,
  recipient_type recipient_type not null,
  team_id        uuid references public.teams(id) on delete set null,
  subject        text not null,
  body           text not null,
  read           boolean not null default false,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index on public.profiles (role);
create index on public.profiles (email);
create index on public.teams (active);
create index on public.teams (age_group);
create index on public.teams (season);
create index on public.coach_teams (team_id);
create index on public.coach_teams (coach_id);
create index on public.players (team_id);
create index on public.announcements (status);
create index on public.announcements (published_at desc);
create index on public.events (status);
create index on public.events (start_date);
create index on public.events (registration_open);
create index on public.events using gin (age_groups);
create index on public.event_registrations (event_id);
create index on public.event_registrations (registrant_email);
create index on public.event_registrations (payment_status);
create index on public.schedule_entries (team_id);
create index on public.schedule_entries (starts_at);
create index on public.reimbursement_requests (coach_id);
create index on public.reimbursement_requests (team_id);
create index on public.reimbursement_requests (status);
create index on public.receipts (reimbursement_request_id);
create index on public.receipts (expense_date);
create index on public.highlights (coach_id);
create index on public.highlights (team_id);
create index on public.highlights (status);
create index on public.messages (recipient_type);
create index on public.messages (team_id);
create index on public.messages (read);
create index on public.messages (created_at desc);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles               enable row level security;
alter table public.teams                  enable row level security;
alter table public.coach_teams            enable row level security;
alter table public.players                enable row level security;
alter table public.announcements          enable row level security;
alter table public.events                 enable row level security;
alter table public.event_registrations    enable row level security;
alter table public.schedule_entries       enable row level security;
alter table public.expense_categories     enable row level security;
alter table public.reimbursement_requests enable row level security;
alter table public.receipts               enable row level security;
alter table public.highlights             enable row level security;
alter table public.messages               enable row level security;

-- ============================================================
-- RLS POLICIES — profiles
-- ============================================================

create policy "profiles: own read"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: admin read all"
  on public.profiles for select
  using (get_user_role() in ('admin', 'super_admin'));

create policy "profiles: own update"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- RLS POLICIES — teams
-- ============================================================

create policy "teams: public read"
  on public.teams for select using (true);

create policy "teams: admin insert"
  on public.teams for insert
  with check (get_user_role() in ('admin', 'super_admin'));

create policy "teams: admin update"
  on public.teams for update
  using (get_user_role() in ('admin', 'super_admin'));

create policy "teams: admin delete"
  on public.teams for delete
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — coach_teams
-- ============================================================

create policy "coach_teams: public read"
  on public.coach_teams for select using (true);

create policy "coach_teams: admin insert"
  on public.coach_teams for insert
  with check (get_user_role() in ('admin', 'super_admin'));

create policy "coach_teams: admin update"
  on public.coach_teams for update
  using (get_user_role() in ('admin', 'super_admin'));

create policy "coach_teams: admin delete"
  on public.coach_teams for delete
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — players
-- ============================================================

create policy "players: public read"
  on public.players for select using (true);

create policy "players: admin insert"
  on public.players for insert
  with check (get_user_role() in ('admin', 'super_admin'));

create policy "players: admin update"
  on public.players for update
  using (get_user_role() in ('admin', 'super_admin'));

create policy "players: admin delete"
  on public.players for delete
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — announcements
-- ============================================================

create policy "announcements: public read published"
  on public.announcements for select
  using (status = 'published');

create policy "announcements: admin read all"
  on public.announcements for select
  using (get_user_role() in ('admin', 'super_admin'));

create policy "announcements: admin insert"
  on public.announcements for insert
  with check (get_user_role() in ('admin', 'super_admin'));

create policy "announcements: admin update"
  on public.announcements for update
  using (get_user_role() in ('admin', 'super_admin'));

create policy "announcements: admin delete"
  on public.announcements for delete
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — events
-- ============================================================

create policy "events: public read published"
  on public.events for select
  using (status = 'published');

create policy "events: admin read all"
  on public.events for select
  using (get_user_role() in ('admin', 'super_admin'));

create policy "events: admin insert"
  on public.events for insert
  with check (get_user_role() in ('admin', 'super_admin'));

create policy "events: admin update"
  on public.events for update
  using (get_user_role() in ('admin', 'super_admin'));

create policy "events: admin delete"
  on public.events for delete
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — event_registrations
-- ============================================================

create policy "event_registrations: admin read all"
  on public.event_registrations for select
  using (get_user_role() in ('admin', 'super_admin'));

create policy "event_registrations: anyone insert"
  on public.event_registrations for insert
  with check (true);

create policy "event_registrations: own email read"
  on public.event_registrations for select
  using (
    auth.uid() is not null
    and registrant_email = (select email from public.profiles where id = auth.uid())
  );

-- ============================================================
-- RLS POLICIES — schedule_entries
-- ============================================================

create policy "schedule_entries: public read"
  on public.schedule_entries for select using (true);

create policy "schedule_entries: admin insert"
  on public.schedule_entries for insert
  with check (get_user_role() in ('admin', 'super_admin'));

create policy "schedule_entries: admin update"
  on public.schedule_entries for update
  using (get_user_role() in ('admin', 'super_admin'));

create policy "schedule_entries: admin delete"
  on public.schedule_entries for delete
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — expense_categories
-- ============================================================

create policy "expense_categories: public read"
  on public.expense_categories for select using (true);

-- ============================================================
-- RLS POLICIES — reimbursement_requests
-- ============================================================

create policy "reimbursement_requests: coach read own"
  on public.reimbursement_requests for select
  using (coach_id = auth.uid());

create policy "reimbursement_requests: coach insert own"
  on public.reimbursement_requests for insert
  with check (coach_id = auth.uid() and get_user_role() = 'coach');

create policy "reimbursement_requests: admin read all"
  on public.reimbursement_requests for select
  using (get_user_role() in ('admin', 'super_admin'));

create policy "reimbursement_requests: admin update"
  on public.reimbursement_requests for update
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — receipts
-- ============================================================

create policy "receipts: coach read own"
  on public.receipts for select
  using (
    exists (
      select 1 from public.reimbursement_requests rr
      where rr.id = receipts.reimbursement_request_id
        and rr.coach_id = auth.uid()
    )
  );

create policy "receipts: coach insert own"
  on public.receipts for insert
  with check (
    get_user_role() = 'coach'
    and exists (
      select 1 from public.reimbursement_requests rr
      where rr.id = receipts.reimbursement_request_id
        and rr.coach_id = auth.uid()
    )
  );

create policy "receipts: coach update own"
  on public.receipts for update
  using (
    get_user_role() = 'coach'
    and exists (
      select 1 from public.reimbursement_requests rr
      where rr.id = receipts.reimbursement_request_id
        and rr.coach_id = auth.uid()
    )
  );

create policy "receipts: coach delete own"
  on public.receipts for delete
  using (
    get_user_role() = 'coach'
    and exists (
      select 1 from public.reimbursement_requests rr
      where rr.id = receipts.reimbursement_request_id
        and rr.coach_id = auth.uid()
    )
  );

create policy "receipts: admin read all"
  on public.receipts for select
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — highlights
-- ============================================================

create policy "highlights: public read approved"
  on public.highlights for select
  using (status = 'approved');

create policy "highlights: coach read own"
  on public.highlights for select
  using (coach_id = auth.uid());

create policy "highlights: coach insert own"
  on public.highlights for insert
  with check (coach_id = auth.uid() and get_user_role() = 'coach');

create policy "highlights: admin read all"
  on public.highlights for select
  using (get_user_role() in ('admin', 'super_admin'));

create policy "highlights: admin insert"
  on public.highlights for insert
  with check (get_user_role() in ('admin', 'super_admin'));

create policy "highlights: admin update"
  on public.highlights for update
  using (get_user_role() in ('admin', 'super_admin'));

create policy "highlights: admin delete"
  on public.highlights for delete
  using (get_user_role() in ('admin', 'super_admin'));

-- ============================================================
-- RLS POLICIES — messages
-- ============================================================

create policy "messages: anyone insert"
  on public.messages for insert
  with check (true);

create policy "messages: admin read all"
  on public.messages for select
  using (get_user_role() in ('admin', 'super_admin'));

create policy "messages: coach read own team"
  on public.messages for select
  using (
    recipient_type = 'team'
    and team_id is not null
    and exists (
      select 1 from public.coach_teams ct
      where ct.team_id = messages.team_id
        and ct.coach_id = auth.uid()
    )
  );
