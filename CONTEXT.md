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
| Auth | Supabase Auth |
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
├── ROADMAP.md
├── CONTEXT.md                          # This file
├── supabase/
│   ├── config.toml
│   └── migrations/
│       ├── 20260419_initial_schema.sql # Full DB schema (applied)
│       └── 20260420_auth_trigger.sql   # handle_new_user() trigger (applied)
└── web/
    ├── public/
    │   └── logo.png                    # Org logo (background removed)
    └── src/
        ├── proxy.ts                    # Session refresh + route protection (Next.js 16 renamed from middleware.ts)
        ├── app/
        │   ├── globals.css             # Tailwind v4 config + brand colors
        │   ├── layout.tsx              # Root layout (html/body/fonts only)
        │   ├── (public)/               # Route group: Navbar + Footer
        │   │   ├── layout.tsx
        │   │   ├── page.tsx            # Homepage
        │   │   ├── teams/page.tsx
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
        │   │   ├── layout.tsx          # Sidebar nav, requireAdmin()
        │   │   ├── page.tsx            # Dashboard: stats + quick actions
        │   │   ├── announcements/
        │   │   │   ├── page.tsx        # List (draft/published)
        │   │   │   ├── AnnouncementForm.tsx
        │   │   │   ├── actions.ts      # create, update, togglePublish, delete
        │   │   │   ├── new/page.tsx
        │   │   │   └── [id]/page.tsx   # Edit + publish/unpublish + delete
        │   │   ├── events/
        │   │   │   ├── page.tsx        # List with status + registration badges
        │   │   │   ├── EventForm.tsx
        │   │   │   ├── actions.ts      # create, update, togglePublish, toggleRegistration, delete
        │   │   │   ├── new/page.tsx
        │   │   │   └── [id]/page.tsx   # Edit + registrations list
        │   │   ├── schedule/
        │   │   │   ├── page.tsx        # All entries grouped by date, delete per entry
        │   │   │   ├── ScheduleForm.tsx
        │   │   │   ├── actions.ts      # create, delete
        │   │   │   └── new/page.tsx
        │   │   ├── teams/
        │   │   │   ├── page.tsx        # List with head coach + player count
        │   │   │   ├── TeamForm.tsx
        │   │   │   ├── actions.ts      # create, update, toggleActive, assignCoach, removeCoach, addPlayer, removePlayer
        │   │   │   ├── new/page.tsx
        │   │   │   └── [id]/
        │   │   │       ├── page.tsx    # Edit team + manage coaches + manage roster
        │   │   │       └── InlineForm.tsx
        │   │   ├── reimbursements/
        │   │   │   ├── page.tsx        # List with status tabs (pending/under_review/approved/paid/denied)
        │   │   │   ├── actions.ts      # updateReimbursementStatus
        │   │   │   └── [id]/
        │   │   │       ├── page.tsx    # Detail: receipts list + status update form
        │   │   │       └── StatusForm.tsx
        │   │   ├── highlights/
        │   │   │   ├── page.tsx        # List with status tabs (pending/approved/rejected)
        │   │   │   ├── actions.ts      # approveHighlight, rejectHighlight
        │   │   │   └── [id]/
        │   │   │       ├── page.tsx    # Detail: preview + approve/reject
        │   │   │       └── RejectForm.tsx
        │   │   └── messages/
        │   │       ├── page.tsx        # Inbox with unread filter, unread highlighted blue
        │   │       ├── actions.ts      # markMessageRead
        │   │       └── [id]/page.tsx   # Full message, auto-marks read, reply via email link
        │   ├── coach/
        │   │   ├── layout.tsx          # Sidebar nav, requireCoach()
        │   │   └── page.tsx            # Dashboard: upcoming schedule, reimbursements, highlights
        │   └── auth/callback/          # Supabase auth callback handler
        ├── components/
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   └── DeleteButton.tsx        # Reusable confirm-before-delete client component
        └── lib/
            └── supabase/
                ├── client.ts           # Browser Supabase client
                ├── server.ts           # Server Supabase client (RSC/actions)
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

### Public Site
- **Homepage** — hero, announcements preview, upcoming events, teams grid, CTA strip
- **Navbar** — sticky navy, logo, nav links, red Register CTA, mobile hamburger
- **Footer** — navy, logo, quick links, contact info
- `/teams` — active teams with head coach, queries live DB
- `/schedule` — upcoming entries grouped by date
- `/events` — published events split upcoming/past, register CTA when open
- `/news` — published announcements reverse chronological
- `/highlights` — approved coach highlights (photo/video/text)
- `/contact` — form routing to org or specific team, inserts into `messages`

### Authentication
- `/login` — email/password, redirects admin → `/admin`, coach → `/coach`
- `proxy.ts` — session refresh every request, protects `/admin` and `/coach` routes
- Auth trigger — `handle_new_user()` auto-creates `profiles` row on signup
- `requireAdmin()` / `requireCoach()` server helpers
- Route groups: `(public)` has Navbar/Footer; `admin` and `coach` have sidebar layouts

### Admin Dashboard (complete)
- `/admin` — stats cards (pending reimbursements, pending highlights, unread messages), quick actions
- `/admin/announcements` — list, create draft, edit, publish/unpublish, delete
- `/admin/events` — list, create, edit, publish/unpublish, open/close registration, delete, view registrations
- `/admin/schedule` — all entries across all teams grouped by date, add entry (select team + type), delete
- `/admin/teams` — list, create, manage page: edit details, assign coaches by email, add/remove players
- `/admin/reimbursements` — tabbed by status, detail view with full receipt list, approve/deny/status update
- `/admin/highlights` — tabbed by status, detail view with media preview, approve/reject with reason
- `/admin/messages` — inbox with unread filter, detail auto-marks read, reply via email link

### Coach Dashboard (shell only — pages not yet built)
- `/coach` — dashboard: upcoming schedule, recent reimbursements, recent highlights
- Sidebar links to pages not yet built: My Schedule, Roster, Submit Receipt, Reimbursements, Post Highlight, Messages

### Notes
- First admin user must be created manually via Supabase Auth dashboard + manual profile insert
- To create coaches: Supabase Auth dashboard → Add user (trigger auto-creates profile with `coach` role)
- `DeleteButton.tsx` is a shared reusable client component for confirm-before-delete across admin pages

---

## What's Next (in order)

1. ~~**Public pages**~~ ✓
2. ~~**Authentication**~~ ✓
3. ~~**Admin dashboard**~~ ✓
4. **Coach dashboard** — submit receipts, reimbursement history, post highlights, view messages, view schedule, view roster
5. **Vercel deployment** — connect repo, set env vars, go live
6. **Mobile app** — React Native + Expo companion app for coaches
7. **Integrations** — Stripe, Sanity CMS, Mux video, Resend email, social media APIs

---

## Design Decisions & Rationale

- **No-code CMS (Sanity):** Admins update content via a visual studio — no code changes needed
- **Stripe Connect:** Handles outbound ACH reimbursements to coaches' bank accounts. Each coach onboards once via Stripe's secure flow
- **Supabase over Firebase:** Postgres is portable; Firebase's NoSQL is not. Abstraction layers on auth/storage protect against lock-in
- **Next.js + React Native:** Same TypeScript/React knowledge applies to both web and mobile
- **RLS enabled at DB level:** Security enforced in the database, not just in application code
- **proxy.ts (formerly middleware.ts):** Next.js 16 renamed the file convention; functionality identical
