# Sandhills Select Baseball — Project Context

Last updated: 2026-04-19

---

## What This Is

A website and companion mobile app for **Sandhills Select Baseball**, a non-profit youth travel baseball organization in the Sandhills region of North Carolina. The platform serves three types of users: **visitors** (public), **coaches**, and **admins**.

---

## Accounts & Services

| Service | Account | Notes |
|---|---|---|
| Supabase | signalmedic project | Project ref: `jekxvhymskngjdjwvjnl` |
| GitHub | github.com/SignalMedic/sandhills-select | Main branch = production |
| Vercel | Not yet connected | Will host the Next.js web app |
| Stripe | Not yet set up | Needed for event payments + coach reimbursements |
| Sanity | Not yet set up | CMS for admin content management |
| Mux | Not yet set up | Video storage and transcoding for highlights |
| Resend | Not yet set up | Transactional email |

**Credentials stored locally** (never committed to git):
- `web/.env.local` — Supabase URL and anon key

---

## Tech Stack

| Layer | Choice |
|---|---|
| Web framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (to be wired up) |
| CMS | Sanity (not yet set up) |
| Mobile app | React Native + Expo (not yet started) |
| Payments | Stripe + Stripe Connect (not yet set up) |
| Video | Mux (not yet set up) |
| Email | Resend (not yet set up) |
| Hosting | Vercel (not yet connected) |

---

## Repository Structure

```
SandhillsSelectWebsite/
├── ROADMAP.md                          # Full feature list with numbered items (1.1–5.10)
├── CONTEXT.md                          # This file
├── supabase/
│   ├── config.toml                     # Supabase CLI config, linked to remote project
│   └── migrations/
│       └── 20260419_initial_schema.sql # Full database schema (already applied)
└── web/                                # Next.js web app
    ├── public/
    │   ├── logo.png                    # Org logo (background removed)
    │   └── logo.svg                    # SVG fallback (can be deleted)
    ├── src/
    │   ├── app/
    │   │   ├── globals.css             # Tailwind v4 config + brand colors
    │   │   ├── layout.tsx              # Root layout with Navbar + Footer
    │   │   └── page.tsx                # Homepage
    │   ├── components/
    │   │   ├── Navbar.tsx              # Sticky navy navbar, mobile hamburger menu
    │   │   └── Footer.tsx              # Navy footer with links
    │   └── lib/
    │       └── supabase/
    │           ├── client.ts           # Browser-side Supabase client
    │           └── server.ts           # Server-side Supabase client (RSC)
    └── .env.local                      # Supabase credentials (gitignored)
```

---

## Brand

- **Colors:** Navy `#071D49`, Red `#C8102E`, White `#FFFFFF`
- **Fonts:** Oswald (display/headings), Inter (body) — both via Google Fonts
- **Logo:** Red 5-pointed star with navy accents and "SS" lettering
- **Feel:** Bold and athletic

---

## Database Schema (Supabase)

All tables are in the `public` schema with RLS enabled. Migration file: `supabase/migrations/20260419_initial_schema.sql`.

### Tables

| Table | Purpose |
|---|---|
| `profiles` | Extends Supabase auth users. Roles: `super_admin`, `admin`, `coach` |
| `teams` | Baseball teams within the org |
| `coach_teams` | Junction: which coaches are on which teams, head coach flag |
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
- Public can read: published announcements, published events, teams, schedule, approved highlights
- Coaches can: read/write their own reimbursements, receipts, highlights; read their team's messages
- Admins can: read/write everything
- Anyone can: insert messages, insert event registrations

### Helper function
`get_user_role()` — returns the role of the currently authenticated user from `profiles`. Used in all RLS policies.

---

## Supabase ↔ GitHub Integration

- Supabase is connected to `SignalMedic/sandhills-select` on the `main` branch
- Any new migration file pushed to `main` is automatically applied to the production database
- **Workflow for schema changes:**
  1. `supabase migration new <description>` — creates a timestamped file in `supabase/migrations/`
  2. Write the SQL in that file
  3. `git add`, `git commit`, `git push`
  4. Supabase applies it automatically

---

## What's Built

### Homepage (`web/src/app/page.tsx`)
- Hero section — navy background, logo, headline, two CTAs
- Announcements section — 3-column card grid (placeholder data)
- Upcoming Events section — cards with red accent stripe (placeholder data)
- Teams section — 4 team cards (placeholder data)
- CTA strip — red background, register/contact buttons

### Navbar (`web/src/components/Navbar.tsx`)
- Sticky, navy background
- Logo + "Sandhills Select Baseball" wordmark
- Links: Teams, Schedule, Events, News, Highlights, Contact
- Red "Register" CTA button
- Mobile hamburger menu

### Footer (`web/src/components/Footer.tsx`)
- Navy background
- Logo + org description
- Quick links column
- Contact column
- Copyright line

---

## What's Built (continued)

### Public Pages
- `/teams` — active teams with head coach, queries `teams` + `coach_teams` + `profiles`
- `/schedule` — upcoming entries grouped by date, queries `schedule_entries`
- `/events` — published events split into upcoming/past, register CTA when open
- `/news` — published announcements reverse chronological
- `/highlights` — approved coach highlights (photo/video/text)
- `/contact` — server action form routing to org or specific team, inserts into `messages`

### Authentication
- `/login` — email/password, role-based redirect (admin → `/admin`, coach → `/coach`)
- Middleware — refreshes session every request, protects `/admin` and `/coach` routes
- Auth trigger — `handle_new_user()` auto-creates `profiles` row on user signup
- `requireAdmin()` / `requireCoach()` helpers used in dashboard layouts
- Route groups: `(public)` has Navbar/Footer; `admin` and `coach` have sidebar layouts

### Admin Dashboard (shell)
- `/admin` — stats: pending reimbursements, pending highlights, unread messages; quick actions
- Sidebar nav: Dashboard, Announcements, Events, Schedule, Teams, Reimbursements, Highlights, Messages

### Coach Dashboard (shell)
- `/coach` — upcoming schedule, recent reimbursements with status, recent highlights
- Sidebar nav: Dashboard, My Schedule, Roster, Submit Receipt, Reimbursements, Post Highlight, Messages

### Notes
- First admin user must be created manually via Supabase Auth dashboard
- Profile must be inserted manually for users created before the trigger was applied
- To create coaches: use Supabase Auth dashboard → Add user (trigger auto-creates profile with coach role)

---

## What's Next (in order)

1. ~~**Public pages**~~ ✓
2. ~~**Authentication**~~ ✓
3. **Admin dashboard** — announcements, events, schedules, reimbursement approvals, team management
4. **Coach dashboard** — receipt submission, highlights submission, messages
5. **Mobile app** — React Native + Expo companion app for coaches
6. **Vercel deployment** — connect repo, set env vars, go live
7. **Integrations** — Stripe, Sanity CMS, Mux video, Resend email, social media APIs

---

## Design Decisions & Rationale

- **No-code CMS (Sanity):** Admins update content via a visual studio — no code changes needed
- **Stripe Connect:** Handles outbound ACH reimbursements to coaches' bank accounts. Each coach onboards once via Stripe's secure flow
- **Supabase over Firebase:** Postgres is portable; Firebase's NoSQL is not. Abstraction layers on auth/storage protect against lock-in
- **Next.js + React Native:** Same TypeScript/React knowledge applies to both web and mobile
- **RLS enabled at DB level:** Security enforced in the database, not just in application code
- **SVG logo preferred:** Scales perfectly, supports transparency — replace `logo.png` with a proper transparent SVG when available
