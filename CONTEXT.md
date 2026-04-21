# Sandhills Select Baseball — Project Context

Last updated: 2026-04-21

---

## What This Is

A website and companion mobile app for **Sandhills Select Baseball**, a non-profit youth travel baseball organization in the Sandhills region of North Carolina. The platform serves three types of users: **visitors** (public), **coaches**, and **admins**.

---

## Accounts & Services

| Service | Account | Notes |
|---|---|---|
| Supabase | signalmedic project | Project ref: `jekxvhymskngjdjwvjnl` — use SQL editor for migrations |
| GitHub | github.com/SignalMedic/sandhills-select | Main branch = production |
| Cloudflare Workers | sandhills-select | Live at `sandhills-select.canary-radio-company.workers.dev`; auto-deploys on push to `main` via GitHub Actions |
| Stripe | Not yet set up | Needed for event payments + coach reimbursements |
| Sanity | Not yet set up | CMS for admin content management |
| Mux | Not yet set up | Video storage and transcoding for highlights |
| Resend | Not yet set up | Transactional email |

**Credentials stored locally** (never committed to git):
- `web/.env.local` — Supabase URL and anon key

**Custom domain:** `sandhillsselect.us` — registered and DNS pointing at Worker via CNAME, but Cloudflare zone/account mismatch is preventing full wiring. Currently accessible only via workers.dev URL.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Web framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |
| CMS | Sanity (not yet set up) |
| Mobile app | React Native + Expo (not yet started) |
| Payments | Stripe + Stripe Connect (not yet set up) |
| Video | Mux (not yet set up) |
| Email | Resend (not yet set up) |
| Hosting | Cloudflare Workers (via `@opennextjs/cloudflare`) |

---

## Deployment

- **Build & deploy:** `npm run deploy` → `opennextjs-cloudflare build && opennextjs-cloudflare deploy`
- **CI/CD:** `.github/workflows/deploy.yml` — pushes to `main` auto-deploy to Cloudflare Workers
- **Wrangler config:** `web/wrangler.jsonc` — `nodejs_compat` + `global_fetch_strictly_public` flags required
- **OpenNext config:** `web/open-next.config.ts`
- **Note:** `src/middleware.ts` must use the name `middleware` (not `proxy`) for OpenNext to detect it correctly

---

## Repository Structure

```
SandhillsSelectWebsite/
├── ROADMAP.md
├── CONTEXT.md                          # This file
├── .github/
│   └── workflows/
│       └── deploy.yml                  # Auto-deploy to Cloudflare Workers on push to main
├── supabase/
│   └── migrations/                     # Applied manually via Supabase SQL editor
│       ├── 20260419_initial_schema.sql
│       ├── 20260420_auth_trigger.sql
│       ├── 20260420_announcement_media_url.sql
│       ├── 20260420_announcement_pinned.sql
│       ├── 20260420_event_recurrence.sql
│       ├── 20260420_event_recurrence_end_time.sql
│       ├── 20260420_event_registration_fields.sql
│       ├── 20260420_highlights_storage.sql
│       ├── 20260420_players_contact_coach_rls.sql
│       ├── 20260420_players_email_phone.sql
│       ├── 20260420_receipts_storage.sql
│       └── 20260420_team_links_public_profiles.sql
└── web/
    ├── wrangler.jsonc                   # Cloudflare Workers config
    ├── open-next.config.ts
    ├── public/
    │   └── logo.png
    └── src/
        ├── middleware.ts                # Session refresh + route protection
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── (public)/
        │   │   ├── layout.tsx
        │   │   ├── page.tsx            # Homepage
        │   │   ├── teams/page.tsx      # Teams with coaches + team links
        │   │   ├── schedule/page.tsx
        │   │   ├── events/page.tsx
        │   │   ├── news/page.tsx
        │   │   ├── highlights/page.tsx
        │   │   └── contact/
        │   │       ├── page.tsx
        │   │       ├── ContactForm.tsx
        │   │       └── actions.ts
        │   ├── login/
        │   │   ├── page.tsx
        │   │   └── actions.ts
        │   ├── admin/
        │   │   ├── layout.tsx
        │   │   ├── page.tsx            # Dashboard stats + quick actions
        │   │   ├── announcements/      # List, create, edit, publish/unpublish, delete
        │   │   ├── events/             # List, create, edit, publish, registration, registrations list
        │   │   ├── schedule/           # All entries grouped by date, add/delete
        │   │   ├── teams/
        │   │   │   ├── page.tsx
        │   │   │   ├── TeamForm.tsx
        │   │   │   ├── actions.ts      # create, update, toggleActive, assignCoach, removeCoach,
        │   │   │   │                   # updateCoachName, addPlayer, updatePlayer, removePlayer,
        │   │   │   │                   # addTeamLink, removeTeamLink
        │   │   │   ├── new/page.tsx
        │   │   │   └── [id]/
        │   │   │       ├── page.tsx    # Edit team + coaches (with inline name edit) + roster + links
        │   │   │       ├── InlineForm.tsx  # CoachAssignForm, CoachEditNameForm, PlayerAddForm
        │   │   │       └── TeamInfoForm.tsx
        │   │   ├── reimbursements/
        │   │   │   ├── page.tsx        # Filters (status/team/date), summary cards, breakdowns, list
        │   │   │   ├── FiltersBar.tsx  # Client component: status tabs, team select, date range
        │   │   │   ├── actions.ts
        │   │   │   ├── export/
        │   │   │   │   └── route.ts    # ZIP export: CSV + all receipt images, respects filters
        │   │   │   └── [id]/
        │   │   │       ├── page.tsx
        │   │   │       └── StatusForm.tsx
        │   │   ├── highlights/         # List, detail with media preview, approve/reject
        │   │   └── messages/           # Inbox, detail auto-marks read, reply via email link
        │   ├── coach/
        │   │   ├── layout.tsx          # Sidebar: Dashboard, Schedule, Roster, Reimbursements,
        │   │   │                       # Post Highlight, Messages, Contacts, Profile
        │   │   ├── page.tsx            # Dashboard
        │   │   ├── schedule/           # Upcoming schedule entries for coach's teams
        │   │   ├── roster/             # View/edit players + manage team links per team
        │   │   │   ├── page.tsx
        │   │   │   └── actions.ts      # addPlayer, updatePlayer, removePlayer, addTeamLink, removeTeamLink
        │   │   ├── reimbursements/     # List + detail with receipts + resubmit after denial
        │   │   │   ├── page.tsx
        │   │   │   ├── actions.ts      # createRequest, addReceipt, removeReceipt, resubmitRequest
        │   │   │   └── [id]/page.tsx
        │   │   ├── receipts/new/       # Standalone receipt/request creation flow
        │   │   ├── highlights/         # Submission form + history
        │   │   │   └── new/page.tsx
        │   │   ├── messages/           # Messages routed to coach's teams
        │   │   ├── contact/            # Contact directory
        │   │   └── profile/            # Update full_name
        │   │       ├── page.tsx
        │   │       ├── ProfileForm.tsx
        │   │       └── actions.ts
        │   └── auth/callback/
        ├── components/
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   ├── MobileNav.tsx
        │   ├── PageHeader.tsx
        │   ├── DeleteButton.tsx
        │   ├── PlayerRoster.tsx        # Shared roster table with inline edit
        │   └── TeamLinksSection.tsx    # Shared add/remove links UI (used in admin + coach)
        └── lib/
            └── supabase/
                ├── client.ts
                ├── server.ts
                └── auth.ts             # getCurrentProfile, requireAdmin, requireCoach, signOut
```

---

## Brand

- **Colors:** Navy `#071D49`, Red `#C8102E`, White `#FFFFFF`
- **Fonts:** Oswald (display/headings), Inter (body) — both via Google Fonts
- **Logo:** Red 5-pointed star with navy accents and "SS" lettering
- **Feel:** Bold and athletic

---

## Database Schema (Supabase)

All tables are in the `public` schema with RLS enabled. Applied via Supabase SQL editor.

### Tables

| Table | Purpose |
|---|---|
| `profiles` | Extends Supabase auth users. Roles: `super_admin`, `admin`, `coach` |
| `teams` | Baseball teams within the org |
| `coach_teams` | Junction: which coaches are on which teams, head coach flag |
| `team_links` | External URLs per team (website, social, etc.) shown on public page |
| `players` | Roster members per team |
| `announcements` | News/announcements posted by admins (draft/published) |
| `events` | Tournaments, tryouts, banquets with registration settings |
| `event_registrations` | Signups for events with Stripe payment tracking |
| `schedule_entries` | Games, practices, scrimmages per team |
| `expense_categories` | Lookup: Meals, Fuel, Lodging, Equipment, Entry Fees, Other |
| `reimbursement_requests` | Coach expense submissions with approval workflow |
| `receipts` | Individual receipts attached to reimbursement requests |
| `highlights` | Coach-submitted photos/videos/text with approval + social posting |
| `messages` | Contact form submissions routed to teams or admins |

### Key RLS rules
- Public can read: published announcements, published events, teams, team_links, schedule, approved highlights, coach/admin profiles (name only accessible due to SELECT restriction)
- Coaches can: read/write their own reimbursements, receipts, highlights; read their team's messages; manage players and team_links on their own teams; update their own profile
- Admins can: read/write everything
- Anyone can: insert messages, insert event registrations

### Helper function
`get_user_role()` — returns the role of the currently authenticated user from `profiles`. Used in all RLS policies.

---

## Schema Notes

- **Migrations are applied manually** via the Supabase SQL editor — not auto-applied from the repo
- Migration files in the repo serve as version history only
- `profiles.full_name` defaults to the email prefix at signup (e.g. `john.smith` from `john.smith@gmail.com`) — admins can correct names inline on the team detail page; coaches can update via `/coach/profile`
- Reimbursement totals are computed dynamically from `receipts.amount_cents` at render time, not stored on `reimbursement_requests`

---

## What's Built

### Public Site (complete)
- Homepage, Navbar, Footer
- `/teams` — active teams with head coach, other coaches, team links (pill buttons)
- `/schedule` — upcoming entries grouped by date
- `/events` — published events, upcoming/past split, register CTA
- `/news` — published announcements
- `/highlights` — approved highlights (photo/video/text)
- `/contact` — form routing to org or specific team

### Authentication (complete)
- `/login` — email/password, role-based redirect
- `middleware.ts` — session refresh every request, protects `/admin` and `/coach`
- Auth trigger auto-creates `profiles` row on signup
- `requireAdmin()` / `requireCoach()` server helpers

### Admin Dashboard (complete)
- Stats, announcements, events, schedule, teams (with coach name editing + team links), reimbursements (with filters/summaries/ZIP export), highlights approval, messages

### Coach Dashboard (complete)
- Dashboard with upcoming schedule + recent reimbursements + highlights
- Schedule, Roster (with team links management), Reimbursements (submit, history, resubmit after denial), Post Highlight, Messages, Contact, Profile (update name)

---

## What's Next (in order)

1. **Custom domain** — resolve Cloudflare zone/account mismatch so `sandhillsselect.us` routes to the Worker
2. **Stripe integration** — event registration payments (inbound) + Stripe Connect for coach reimbursement ACH (outbound)
3. **Transactional email (Resend)** — reimbursement status notifications, event registration confirmations, announcement blasts
4. **Mobile app** — React Native + Expo companion for coaches (receipt capture, OCR, highlight submission)
5. **Sanity CMS** — replace hardcoded homepage content with admin-editable CMS
6. **Mux video** — proper video storage/transcoding for highlight videos
7. **Social media integrations** — auto-post approved highlights to Instagram, Facebook, X

---

## Design Decisions & Rationale

- **Cloudflare Workers over Vercel:** User already had Cloudflare; `@opennextjs/cloudflare` supports Next.js 16 (legacy `next-on-pages` only supports ≤15)
- **Totals computed from receipts:** Avoids sync issues from RLS blocking stored `total_amount_cents` updates; always accurate
- **No-code CMS (Sanity, future):** Admins update content without developer involvement
- **Stripe Connect:** Handles outbound ACH reimbursements; each coach onboards once
- **Supabase over Firebase:** Postgres is portable; RLS enforces security at DB level
- **Next.js + React Native:** Same TypeScript/React knowledge for both web and mobile
