# Glow Vie Beauty Clinic

A premium, luxury beauty clinic website with a full appointment booking system,
client dashboard, and admin panel — built with Next.js 14 (App Router), TypeScript,
Tailwind CSS, Prisma, and PostgreSQL.

## What's included

- Public site: Home, About, Services (+ detail pages), Gallery, Testimonials, FAQ, Contact
- Real-time-checked booking wizard (service → specialist → date → time → info → review → confirm)
- Availability engine that respects working hours, breaks, holidays, and existing bookings
- Client accounts: register/login, dashboard to view/cancel/reschedule appointments
- Admin panel: dashboard overview, appointments (approve/reject/complete/search/filter),
  services CRUD, gallery, testimonials, and working days/hours/holidays management
- JWT-based auth (httpOnly cookie) with role-based access (CLIENT / ADMIN)
- Brand system already wired into Tailwind (dusty pink palette, Cormorant Garamond +
  Poppins, rounded corners, soft shadows, sparkle motif, scroll/fade animations)

## What's intentionally stubbed (needs your keys/config)

These features have working code paths but need external credentials to fully activate:

- **Image uploads** — the admin Gallery/Services forms currently take a pasted image URL.
  Wire up Cloudinary's upload widget (`CLOUDINARY_*` env vars are already scaffolded) to
  add real drag-and-drop file uploads.
- **Emails** — appointment confirmation/reminder emails are marked with `// TODO` in
  `src/app/api/appointments/route.ts` and `src/app/api/contact/route.ts`. Add an SMTP
  provider (Resend, SendGrid, etc.) and a small mailer using the `SMTP_*` env vars.
- **Instagram feed** — `InstagramSection.tsx` currently shows static placeholder images.
  Swap in a real fetch to the Instagram Graph API using `INSTAGRAM_ACCESS_TOKEN`.
- **Logo** — no logo file was provided, so `src/components/Logo.tsx` renders a text
  wordmark using the brand palette and typography. Swap it for an `<Image>` once you have
  a final logo file.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up PostgreSQL

Create a free Postgres database with [Supabase](https://supabase.com), [Neon](https://neon.tech),
or [Railway](https://railway.app) — or run Postgres locally. Copy the connection string.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in at minimum:
- `DATABASE_URL` — your Postgres connection string (pooled, e.g. port 6543 on Supabase)
- `DIRECT_URL` — the direct (non-pooled) connection string, e.g. port 5432 on Supabase.
  Prisma needs this for running migrations, since pooled connections (PgBouncer) don't
  support them. If your provider only gives you one connection string, set both
  `DATABASE_URL` and `DIRECT_URL` to that same value.
- `JWT_SECRET` — generate one with `openssl rand -base64 48`

### 4. Push the schema and seed demo data

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

This creates all tables and seeds 12 demo services, testimonials, working hours
(Mon–Sat, closed Sunday), and an admin account:

```
Email:    admin@glowvie.com
Password: GlowVieAdmin123!
```

**Change this password (or the admin user directly in the database) before going live.**

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`. Admin panel is at `/admin/login`.

## Project structure

```
src/
  app/                 → pages & API routes (Next.js App Router)
    api/                 → all backend endpoints (auth, services, appointments, etc.)
    admin/(dashboard)/   → admin panel pages (behind auth middleware)
    dashboard/           → client account dashboard (behind auth middleware)
    book/                → the booking wizard page
  components/          → shared UI (Navbar, Footer, BookingWizard, cards, etc.)
  lib/
    prisma.ts            → Prisma client singleton
    auth.ts               → JWT signing/verification, password hashing
    availability.ts       → core slot-generation logic (the heart of the booking system)
  middleware.ts        → protects /admin/* and /dashboard/* routes
prisma/
  schema.prisma        → full data model
  seed.ts               → demo data + admin account
```

## Deployment

This is a standard Next.js app and deploys cleanly to Vercel, Railway, or any Node host.
Remember to:
1. Set all env vars in your hosting provider's dashboard
2. Run `npx prisma migrate deploy` against your production database
3. Run the seed script once (or manually create your admin user) in production

## Notes on the availability engine

`src/lib/availability.ts` is the core of the booking system. For a given service and date,
it looks at:
1. Whether the clinic is open that weekday (`WorkingHours`)
2. Whether that date is marked as a holiday (`Holiday`)
3. The service's duration, to generate valid start times without overlap
4. Any break window configured for that day
5. Existing `PENDING`/`APPROVED` appointments, to exclude already-booked times
6. The current time, to exclude past slots on the current day

The same function is called both when *displaying* slots to a client and again,
server-side, when a booking is *submitted* — so a slot can never be double-booked even if
two people are looking at the calendar at the same time.
