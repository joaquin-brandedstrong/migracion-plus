# Migración Plus Academy

Bilingual (ES/EN) digital learning platform + book store for legal/migration education.

This is the foundation slice scaffolded in session 1. The Stripe/PayPal checkout, full
admin dashboard, AI assistant + RAG, Twilio SMS automation, and lesson player are
deferred to follow-up sessions — see `docs/CLIENT_HANDOFF.md` for the roadmap.

## Stack

- **Framework**: Next.js 14 App Router (RSC, TypeScript strict)
- **Styling**: Tailwind CSS (shared preset in `packages/config`) + custom design tokens (CSS variables, light/dark)
- **UI primitives**: Radix UI + custom components in `packages/ui` (GlassCard, Button, ThemeToggle, …)
- **Animation**: Framer Motion 11 (shared variants in `@migracionplus/ui/motion`)
- **i18n**: next-intl with `[locale]` routing (`es` default, `en`)
- **Database / Auth / Storage / Realtime**: Supabase
- **Forms**: react-hook-form + Zod
- **Server state**: TanStack Query 5
- **Theme**: next-themes (`data-theme` attribute)
- **Monorepo**: npm workspaces + Turborepo

## Prerequisites

- Node.js ≥ 20 (we use 22 in dev)
- npm ≥ 10 (ships with Node 20+)
- Supabase CLI (`brew install supabase/tap/supabase` or [other installs](https://supabase.com/docs/guides/cli))

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in real values (see .env.example)
cp .env.example .env.local

# 3. Set up Supabase (full step-by-step in docs/SUPABASE_SETUP.md)
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                          # creates the `migracionplus` schema

# 4. Seed (creates admin user, categories, demo data)
SEED_ADMIN_PASSWORD='strong-password-here' npm run db:seed

# 5. Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000` (redirects to `/es`).

## Workspace layout

```
.
├── apps/
│   └── web/                 # Next.js app — public marketing + auth + dashboard shell
├── packages/
│   ├── config/              # Shared tailwind preset, eslint config, tsconfigs
│   ├── db/                  # Supabase migrations, RLS policies, typed row interfaces, seed
│   ├── i18n/                # Locale list + es/en message catalogs
│   └── ui/                  # GlassCard, Button, ThemeToggle, motion variants, …
├── brand-assets/
│   └── source/              # Drop the 8 source files from migracionplus.com here
└── docs/
    └── CLIENT_HANDOFF.md    # Spanish handover doc for the client
```

## Useful scripts

```bash
npm run dev               # Run apps/web in development
npm run build             # Build everything (turbo orchestration)
npm run typecheck         # Type-check across the monorepo
npm run lint              # Lint
npm run format            # Prettier write
npm run db:seed           # Seed Supabase with demo data
```

## What's in the foundation slice

- ✅ Monorepo + Turborepo + npm workspaces
- ✅ Design system: GlassCard, Button, Input, ThemeToggle, motion variants, gradient mesh
- ✅ Tailwind preset + CSS variable theme tokens (light/dark, prefers-reduced-motion)
- ✅ Bilingual routing (es/en), next-intl message catalogs
- ✅ Public marketing pages: home (hero + value props + featured courses + how it works + books spotlight + testimonials + AI teaser + FAQ + final CTA + footer), `/cursos`, `/cursos/[slug]`, `/libros`, `/libros/[slug]`, `/sobre-nosotros` (with legal disclaimer), `/contacto`, `/blog`
- ✅ Auth pages: `/iniciar-sesion`, `/registro`, `/recuperar`, `/verificar-email` (custom forms wired to Supabase Auth)
- ✅ Middleware protecting `/dashboard`, `/aprender`, `/admin`, `/checkout`
- ✅ Supabase migrations (full schema from spec section 5.1) + RLS policies (RLS.md)
- ✅ Static seed data so marketing pages render before Supabase is connected
- ✅ Dashboard placeholder with handoff message
- ✅ Legal page placeholders with "pending review" banner

## Deferred to follow-up sessions

- Lesson player (video, transcript, notes, AI rail)
- Stripe + PayPal checkout flows + webhook handlers
- AI assistant ("Plus") with RAG over course transcripts (pgvector)
- Twilio SMS automation, opt-in/STOP keyword handling, campaigns
- Full admin dashboard (course CRUD, user management, leads kanban, AI content tools)
- Email templates (Resend + React Email)
- Analytics (PostHog) + monitoring (Sentry)
- Playwright E2E tests
- Real brand assets (logos, OG image, favicon) — placeholders are in `apps/web/public/brand/`

## Brand assets

The PRE-FLIGHT step from the original brief asked for 8 source files in
`brand-assets/source/`. Place them there, then run the palette extraction script
(see `brand-assets/PALETTE_NOTES.md`). Until that's done, the FALLBACK palette
from the brief is in use.
