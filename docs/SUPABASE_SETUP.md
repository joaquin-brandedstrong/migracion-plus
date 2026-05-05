# Supabase setup · Step-by-step

This app shares its Supabase project with your other sites. To keep tables
isolated, everything lives in the `migracionplus` schema. The shared `auth`
schema (where users live) stays shared across all apps — that's intentional
so a single login carries across your platform.

## What you do (interactive — I can't run these for you)

> Replace `<project-ref>` with the project ref from
> `https://<project-ref>.supabase.co`.

### 1. Install the Supabase CLI (one time)

```bash
# macOS / Linux
brew install supabase/tap/supabase
# or:  npm i -g supabase
supabase --version
```

### 2. Authenticate (browser OAuth — once per machine)

```bash
supabase login
```

This opens a browser window to authorize the CLI against your Supabase
account. Once it succeeds, the token is cached in `~/.supabase/`.

### 3. Link the local repo to your existing project

```bash
cd /home/hexamorphical/Documents/web/migracion-plus
supabase link --project-ref <project-ref>
```

When prompted for the **DB password**, paste the rotated password (the one
you reset *after* the leak). The CLI stores it in
`~/.supabase/<project-ref>.json`, encrypted at rest.

### 4. Verify nothing in the migration will collide with sibling apps

Before applying, do a dry-run:

```bash
supabase db diff --linked --schema migracionplus -f /tmp/migracionplus-preview.sql
```

This compares your local migration files against the linked project's
current state and writes the would-be SQL to `/tmp/migracionplus-preview.sql`.
Open that file and confirm it only touches the `migracionplus` schema (and
the one trigger named `on_auth_user_created_migracionplus` on `auth.users`,
which is tagged with our suffix to avoid clashing with other apps).

### 5. Apply migrations

```bash
supabase db push
```

This runs `0001_schema.sql` and `0002_rls.sql` in order, creating the
`migracionplus` schema, all tables, RLS policies, and helper functions.

### 6. Expose the schema via the REST API

The `supabase/config.toml` in this repo lists `migracionplus` in
`api.schemas`. For that to take effect on the *hosted* project (not just
local), open:

> Supabase Dashboard → **Project Settings → API → Exposed schemas**

and add `migracionplus` to the list (alongside whatever's already there).
Save.

Without this step, the supabase-js client will return errors like
`schema "migracionplus" must be listed in db-schemas`.

### 7. Pull credentials into `.env.local`

```bash
# In the repo root
supabase status                   # shows API URL and anon key for the linked project
```

Copy:

- `API URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` (from the dashboard, never echoed by the CLI) → `SUPABASE_SERVICE_ROLE_KEY`

into `.env.local`.

### 8. Seed (optional — creates the admin user)

```bash
SEED_ADMIN_PASSWORD='your-strong-password' npm run db:seed
```

This calls `auth.admin.createUser()` to create the admin and instructor
accounts, then promotes their role to `'admin'` / `'instructor'` in
`migracionplus.profiles`. The trigger `on_auth_user_created_migracionplus`
auto-creates the profile row from `auth.users`.

### 9. Verify

```bash
npm run dev
```

Visit `http://localhost:3000`, click **Crear cuenta**, sign up with a test
email, then check the dashboard:

- Supabase Dashboard → **Table Editor** → schema dropdown → switch from
  `public` to `migracionplus` → confirm `profiles` has the new row.
- Other apps in the project should still work normally — their tables in
  `public` (or other schemas) are untouched.

## What's namespaced vs. shared

| Object | Schema | Shared with sibling apps? |
|---|---|---|
| All app tables (`profiles`, `courses`, `lessons`, …) | `migracionplus` | **No** — fully isolated |
| RLS helper functions (`is_admin`, `is_instructor_or_admin`) | `migracionplus` | No |
| `updated_at` trigger function | `migracionplus` | No |
| User accounts (`auth.users`) | `auth` | **Yes** — single sign-on across your platform |
| `pgcrypto`, `vector` extensions | `extensions` | Yes (extensions are project-wide) |
| Storage buckets | (project-wide) | Naming convention recommended: prefix bucket names with `migracionplus_` |

## Rollback

To remove this app from the project entirely:

```sql
-- Run in the SQL editor as a Supabase project owner
drop schema migracionplus cascade;
drop trigger if exists on_auth_user_created_migracionplus on auth.users;
```

This nukes only `migracionplus` and the trigger we installed on `auth.users`.
Sibling apps in `public` are untouched.

## Troubleshooting

- **`schema "migracionplus" must be listed in db-schemas`**: skipped step 6
  in the dashboard. Add `migracionplus` to Exposed Schemas.
- **`permission denied for schema migracionplus`**: the grants in
  `0001_schema.sql` weren't applied (or got reverted). Re-run the migration.
- **Trigger fires but profile row never appears**: the function
  `migracionplus.handle_new_user` lost its `SECURITY DEFINER`. Re-apply
  `0001_schema.sql`.
- **Sign-up succeeds but RLS denies queries**: check that the user has a
  matching row in `migracionplus.profiles`. The trigger should handle this,
  but if you imported users another way, you may need to backfill.
