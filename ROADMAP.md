# Sandhills Select Baseball — Product Roadmap

---

## Core Principle: No-Code Content Management

All content that admins need to update regularly must be editable through a visual admin interface — no code changes, no developer required. This is achieved via a **headless CMS** (recommended: Sanity or Payload CMS), which gives admins a clean, form-based studio separate from the codebase.

**What this means in practice:**
- Admins log in to an admin portal (web-based, mobile-friendly)
- They create announcements, events, schedules, and team updates using simple forms and a rich text editor
- Changes publish to the live site immediately (or on a schedule)
- No files are edited, no code is touched, no developer is called

**Content that lives in the CMS (admin-owned):**
- Announcements and news posts
- Events (name, date, location, description, registration details)
- Team pages (name, age group, coaches, roster info)
- Schedules (games and practices per team)
- Homepage hero content, org info, photos

**Content managed by code (developer-owned, rarely changes):**
- Site layout and design
- Payment integration logic
- Reimbursement workflow
- Authentication and permissions

---

## Core Principle: Automated Reimbursement

The current process — coaches emailing combined receipts, admins cutting physical checks, coaches picking up and depositing — is replaced end-to-end. The goal is: **coach submits on their phone, admin approves with one tap, money moves automatically**.

**Recommended payment partner: Stripe Connect**
Stripe Connect is built for platforms that move money to third parties (the coaches). It handles ACH direct deposit, compliance, and identity verification. Since the org will already use Stripe for event payments (5.4), using Stripe Connect for reimbursements keeps everything in one payment system.

**Automated reimbursement flow:**
1. Coach photographs receipt(s) in the mobile app and submits with amount, category, and notes
2. System optionally uses OCR to pre-fill merchant name and amount from the photo
3. Admin receives an in-app and email notification of a pending reimbursement request
4. Admin reviews receipt image and details in the approval dashboard
5. Admin approves with one tap — no manual data entry
6. Stripe Connect initiates an ACH direct deposit to the coach's linked bank account
7. Coach receives a push notification and email confirming payment is on the way
8. Both sides have a permanent, itemized record in the system

**Coach one-time setup:**
- Coach connects their bank account via Stripe's secure onboarding (similar to setting up direct deposit)
- This is done once in the app — no re-entry per submission

---

## Core Principle: Highlights & Social Media

Coaches can post player and team highlights directly from the app. Approved highlights publish to the organization's website and automatically post to connected social media accounts — no admin copy-paste required.

**Highlight submission flow:**
1. Coach creates a highlight in the app — photo, video, or text; optionally tags a player, team, or game/event
2. Highlight enters a pending queue; admin reviews for content and player safety (important for a youth org)
3. Admin approves with one tap, optionally edits the caption before publishing
4. On approval, highlight is published to the website's highlights gallery and simultaneously posted to all connected social accounts
5. Coach receives a push notification confirming the post went live

**Social media integrations (recommended):**
- **Instagram** — via Meta Graph API (photos, Reels for video)
- **Facebook** — via Meta Graph API (posts, albums)
- **X (Twitter)** — via X API (text + media posts)

**Important design note — youth content safety:**
Because this involves minors, admin review before any public or social post is strongly recommended by default. The approval step is a single tap but should not be skippable without deliberate admin configuration.

---

## 1. Public / Visitor-Facing

- **1.1** Homepage — org overview, latest announcements, upcoming events (all CMS-driven)
- **1.2** Team Directory — list of teams with roster summaries, coach info
- **1.3** Schedule Board — game/practice schedules per team, filterable by team or date
- **1.4** Events Page — event listings with details, dates, locations
- **1.5** Event Registration & Payment — online signup and payment for events (tournaments, tryouts, banquets, etc.)
- **1.6** Contact Form — visitor can message a specific team's coach(es) or org admins
- **1.7** News / Announcements Feed — public-facing announcements posted by admins
- **1.8** Highlights Gallery — approved photos and videos from coaches, filterable by team; embedded social posts optional

---

## 2. Organization Admin Features

- **2.1** Admin Dashboard — overview of org activity, pending items, revenue
- **2.2** Announcement Publisher — rich text editor, image upload, publish immediately or schedule
- **2.3** Event Manager — create events, set registration limits, pricing tiers, deadlines; no code required
- **2.4** Payment Dashboard — view event registrations, payment status, export reports
- **2.5** Schedule Manager — add/edit games and practices per team; visible on public schedule board immediately
- **2.6** Team Management — create teams, assign coaches, manage rosters
- **2.7** User & Role Management — manage coach accounts, admin accounts, permissions
- **2.8** Messaging Inbox — receive and reply to contact form messages
- **2.9** Reimbursement Approval Queue — review pending submissions with receipt image, amount, category, and coach notes; approve or deny with one tap
- **2.10** Batch Approval — select and approve multiple reimbursement submissions at once for efficiency
- **2.11** Reimbursement Ledger — full history of all reimbursements by coach, team, date, category, and status (pending, approved, paid, denied)
- **2.12** Denial with Reason — when denying a reimbursement, admin provides a reason that is sent to the coach automatically
- **2.13** Spending Limits — optional per-team or per-category budget caps; system flags submissions that would exceed limits
- **2.14** Notification Blasts — push/email/SMS announcements to coaches or families
- **2.15** Draft / Preview Mode — admins can preview an announcement or event before publishing
- **2.16** Reimbursement Export — export ledger to CSV or PDF for bookkeeping and non-profit reporting
- **2.17** Highlights Approval Queue — review coach-submitted highlights before they publish; edit caption, approve or reject
- **2.18** Social Media Account Manager — connect and manage the org's Facebook, Instagram, and X accounts from one settings page
- **2.19** Per-Platform Post Control — when approving a highlight, choose which platforms to post to (website only, Instagram, Facebook, X, or all)

---

## 3. Coach Features

- **3.1** Coach Dashboard — team schedule, pending items, messages
- **3.2** Roster View — view their team's players and contact info
- **3.3** Bank Account Setup — one-time secure onboarding via Stripe to link direct deposit account
- **3.4** Receipt Submission — photograph receipt, confirm auto-filled amount and merchant (OCR-assisted), select expense category, add notes, submit
- **3.5** Multi-Receipt Request — group multiple receipts into a single reimbursement request (e.g., one tournament trip)
- **3.6** Reimbursement History — full status history per submission: submitted, under review, approved, paid, or denied with reason
- **3.7** Highlight Submission — post a photo, video, or text highlight; tag a player or team; add a caption; submit for admin review
- **3.8** Highlight History — view status of submitted highlights (pending, approved and posted, rejected with reason)
- **3.9** Schedule Visibility — view and confirm their team's schedule
- **3.10** Messaging — receive and reply to visitor messages routed to their team

---

## 4. Mobile App (Companion — iOS & Android)

- **4.1** Coach Login — secure auth, role-based access
- **4.2** Receipt Capture — in-app camera with auto-crop and image enhancement for legibility
- **4.3** OCR Pre-fill — app reads merchant name and total amount from receipt photo; coach confirms or corrects before submitting
- **4.4** Expense Submission — confirm amount, select category (meals, fuel, lodging, equipment, entry fees, etc.), add notes, attach to a trip/event, submit
- **4.5** Multi-Receipt Bundling — attach multiple photos to one reimbursement request
- **4.6** Submission Status Tracker — real-time status per request (submitted → under review → approved → paid); push notification at each stage
- **4.7** Highlight Creator — select photo or video from camera roll or capture in-app; add caption; tag player(s), team, or event; submit for review
- **4.8** Highlight Status Feed — see whether submitted highlights are pending, approved and live, or rejected with admin note
- **4.9** Schedule View — personal team schedule with calendar sync option
- **4.10** Announcement Feed — org announcements in-app (pulled from CMS)
- **4.11** Messaging — in-app chat or message thread with admins

---

## 5. Shared / Infrastructure

- **5.1** Authentication & Roles — visitor, coach, admin, super-admin
- **5.2** Email Notifications — registration confirmations, receipt status updates, new messages
- **5.3** Push Notifications — mobile app alerts for approvals, announcements, schedule changes, highlight post confirmations
- **5.4** Payment Processing — Stripe for inbound payments (event fees, dues); Stripe Connect for outbound reimbursements (ACH direct deposit to coaches)
- **5.5** File / Image Storage — receipt images, highlight photos/videos, gallery media, documents
- **5.6** Audit Log — track who approved what, when
- **5.7** Headless CMS — admin studio for no-code content management (Sanity or Payload CMS recommended)
- **5.8** Role-gated CMS Access — admins can publish; coaches have read-only or limited access
- **5.9** Social Media API Integrations — Meta Graph API (Facebook + Instagram), X API; OAuth-based account connection managed by super-admin
- **5.10** Video Storage & Transcoding — uploaded highlight videos need compression and format conversion before web and social delivery (recommend Cloudflare Stream or Mux)
