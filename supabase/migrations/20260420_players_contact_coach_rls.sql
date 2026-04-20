-- Add contact fields to players
alter table public.players
  add column email text,
  add column phone text;

-- Allow coaches to manage players on their own teams
create policy "players: coach insert own team"
  on public.players for insert
  with check (
    get_user_role() = 'coach'
    and exists (
      select 1 from public.coach_teams
      where team_id = players.team_id and coach_id = auth.uid()
    )
  );

create policy "players: coach update own team"
  on public.players for update
  using (
    get_user_role() = 'coach'
    and exists (
      select 1 from public.coach_teams
      where team_id = players.team_id and coach_id = auth.uid()
    )
  );

create policy "players: coach delete own team"
  on public.players for delete
  using (
    get_user_role() = 'coach'
    and exists (
      select 1 from public.coach_teams
      where team_id = players.team_id and coach_id = auth.uid()
    )
  );
