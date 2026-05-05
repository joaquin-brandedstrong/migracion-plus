# CLAUDE.md — Notes for future Claude Code sessions

This file is loaded into context whenever a Claude Code session opens this repo.
Keep it short and high-signal — facts that aren't already discoverable from the
file tree or git history.

## Project shape

- npm workspaces + Turborepo monorepo. Single Next.js app under `apps/web`. Shared packages under `packages/*`. **Always use `npm`, never `pnpm` or `yarn`** — the lockfile is `package-lock.json`.
- Bilingual ES/EN with next-intl `[locale]` routing. Default locale is `es`. Messages live in `packages/i18n/messages/{es,en}.json`.
- Theming via `next-themes` with `data-theme` attribute. Color tokens are CSS vars in `apps/web/src/app/globals.css`. The Tailwind preset in `packages/config/tailwind-preset.ts` references both raw brand colors and the semantic CSS-var tokens (`bg`, `fg`, `border`, …).
- All custom components live in `packages/ui`. Apps consume them as `import { GlassCard, Button } from '@migracionplus/ui'`.
- Animation variants are centralized in `@migracionplus/ui/motion`. Don't define one-off motion objects in feature components — extend the shared set instead.

## Hard rules

- **Never give legal advice in user-facing copy or in the AI assistant**. The product is education + form-help, not legal services. The disclaimer block in `apps/web/src/app/[locale]/sobre-nosotros/page.tsx` is canonical — keep its wording in sync if changed.
- **Never log PII to Sentry**. Once Sentry is wired, scrub via `beforeSend` for SSN, passport numbers, A-numbers, addresses.
- **Webhooks use the service-role key**, which bypasses RLS. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It's only used in `app/api/**` route handlers.
- **All app tables live in the `migracionplus` Postgres schema**, not `public`. The Supabase project is shared with other apps. Both `client.ts` and `server.ts` set `db: { schema: 'migracionplus' }`. RLS helper functions are also schema-scoped (`migracionplus.is_admin()`). Auth users live in the shared `auth` schema by design (single sign-on across the platform). When writing new SQL, always qualify with `migracionplus.<table>`.
- **No hex colors in components.** Use Tailwind tokens (`brand-700`, `accent-500`, `fg-muted`) or CSS variables. The Tailwind config is the source of truth.
- **Don't import lorem ipsum.** Use realistic ES/EN immigration-education content.

## Where things live

| Concern | File |
|---|---|
| Shared design tokens | `packages/config/tailwind-preset.ts`, `apps/web/src/app/globals.css` |
| Shared motion variants | `packages/ui/src/motion.ts` |
| i18n message catalogs | `packages/i18n/messages/{es,en}.json` |
| i18n routing config | `apps/web/src/i18n/routing.ts`, `apps/web/src/i18n/request.ts` |
| Auth gate middleware | `apps/web/src/middleware.ts` |
| Supabase clients | `apps/web/src/lib/supabase/{client,server}.ts` |
| DB schema | `packages/db/migrations/0001_schema.sql` |
| RLS policies + rationale | `packages/db/migrations/0002_rls.sql`, `packages/db/RLS.md` |
| DB row types | `packages/db/src/types.ts` (regenerate via `supabase gen types typescript`) |
| Seed script | `packages/db/scripts/seed.ts` |
| Static seed for marketing pages | `apps/web/src/data/seed.ts` (until Supabase is wired) |

## Coding conventions

- Server Components by default; opt into Client Components only when needed (`'use client'` at the top).
- Forms: `react-hook-form` + Zod resolver. Errors render inline beneath each field.
- Server actions and API routes go under `apps/web/src/app/api/`.
- Catch network/auth errors at the form level — show a Spanish message; don't crash.
- Use `getTranslations({ locale, namespace })` in server components, `useTranslations(namespace)` in client components.

## Things that are intentionally placeholders (don't "fix" without asking)

- `apps/web/public/brand/logo-{light,dark}.svg` are simple wordmarks. Replace once `brand-assets/source/` is populated.
- `apps/web/public/{favicon.ico,apple-touch-icon.png,brand/og-image.png}` are programmatically generated placeholders.
- The "Best Seller", "Nuevo" badges and rating numbers in `apps/web/src/data/seed.ts` are demo data. They'll be sourced from real DB rows once Supabase is wired.
- Legal pages (`/terminos`, `/privacidad`, `/politicas`, `/aviso-legal`) carry a "pending client legal review" banner deliberately. Don't fill in real legal copy — the client provides that.

## What's NOT yet built

(Tracked in README.md "Deferred" section.) If a user asks about checkout, AI
assistant behavior, lesson player progress saving, or admin CRUD — those flows
are scaffolded routes/types only. Confirm scope before writing implementation.
