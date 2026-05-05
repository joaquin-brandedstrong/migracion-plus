# Deployment guide

## Hosting

- **Web app**: Vercel
- **Database / Auth / Storage / Realtime**: Supabase (one project per environment: `staging` and `production`)
- **Email**: Resend
- **Video**: Mux *or* Cloudflare Stream — pick one before going live
- **SMS**: Twilio (production sender requires A2P 10DLC registration — allow 2-4 weeks)
- **Payments**: Stripe + PayPal (test → live keys)

## First-time setup

### 1. Create Supabase project

```bash
supabase login
supabase init                             # creates supabase/ folder
supabase link --project-ref <your-ref>
supabase db push                          # applies migrations from packages/db/migrations
```

The migrations enable `pgcrypto` and `vector`, create all tables from the spec,
and install RLS policies. See `packages/db/RLS.md` for the rationale matrix.

### 2. Seed

```bash
SEED_ADMIN_PASSWORD='your-strong-pw' npm run db:seed
```

This creates the admin and instructor users. The full course/lesson seeding
script is left as a follow-up — populate via the admin dashboard once it's
built.

### 3. Provision Vercel

```bash
# In the repo root
npx vercel link
npx vercel env pull .env.local            # pulls env from Vercel into local
```

Add the env vars listed in `.env.example` to the Vercel project settings, and
mark the `NEXT_PUBLIC_*` ones for "Build" exposure. Service-role keys must be
**Sensitive** and only available at runtime.

### 4. Configure webhooks

| Provider | URL | Events |
|---|---|---|
| Stripe | `https://your-domain/api/webhooks/stripe` | `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*` |
| PayPal | `https://your-domain/api/webhooks/paypal` | Capture, subscription |
| Twilio inbound | `https://your-domain/api/webhooks/twilio/incoming` | SMS keyword handling (STOP/START/HELP) |

(The route handlers themselves are NOT yet implemented — they're part of the deferred slice.)

## Promotion flow

```
feature branch → preview deploy on Vercel → review → merge to main → production deploy
```

A preview URL is generated for every PR. Run smoke tests there before merging.

## Rollback

Vercel keeps every deployment. Use the dashboard's "Promote to Production"
button to roll back to a known-good commit; the instant rollback completes in
seconds without re-building.

## Migrations

Never edit a committed migration file. Add a new file:

```bash
supabase migration new add_user_settings_table
# edit the new file, then:
supabase db push
```

To run migrations in CI before promotion, add `supabase db push` after the
build step (see `.github/workflows/deploy.yml` — to be added in a follow-up).

## Monitoring

- **Sentry** (errors, both client and server) — set `SENTRY_DSN`
- **PostHog** (product analytics) — set `NEXT_PUBLIC_POSTHOG_KEY`
- **Vercel Analytics** (Core Web Vitals) — auto-enabled when deploying to Vercel
- **Supabase logs** — for DB query / auth / storage debugging

## Known follow-up work before production

1. Real brand assets (logos, OG image, favicon) — replace placeholders in `apps/web/public/brand/`
2. Real legal copy — replace the placeholder pages under `apps/web/src/app/[locale]/(legal)/`
3. Stripe + PayPal webhook handlers in `apps/web/src/app/api/webhooks/`
4. Twilio compliance (A2P 10DLC), opt-in flow, STOP/HELP keyword handler
5. AI assistant + pgvector embedding pipeline
6. Lesson player + progress tracking
7. Full admin dashboard
8. Playwright E2E tests + axe-core accessibility checks in CI
