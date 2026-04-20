-- Allow public to read coach profiles (for team cards on public site)
create policy "profiles: public read coaches"
  on public.profiles for select
  using (role in ('coach', 'admin'));

-- Team external links
create table public.team_links (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams(id) on delete cascade,
  label      text not null,
  url        text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index on public.team_links (team_id, sort_order);

alter table public.team_links enable row level security;

create policy "team_links: public read"
  on public.team_links for select
  using (true);

create policy "team_links: admin all"
  on public.team_links for all
  using (get_user_role() = 'admin');

create policy "team_links: coach manage own team"
  on public.team_links for all
  using (
    exists (
      select 1 from public.coach_teams
      where coach_teams.team_id = team_links.team_id
        and coach_teams.coach_id = auth.uid()
    )
  );
