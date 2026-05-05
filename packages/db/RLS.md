# Row Level Security · Rationale

All tables live in the `migracionplus` schema (see `0001_schema.sql`) and have
RLS enabled. Two helper SECURITY-DEFINER functions in the same schema
encapsulate role checks: `migracionplus.is_admin()` and
`migracionplus.is_instructor_or_admin()`. They read from
`migracionplus.profiles` and are used inside policy expressions to keep
policies short and consistent.

The Supabase clients are configured with `db: { schema: 'migracionplus' }`,
and the `supabase/config.toml` exposes the schema via the REST API. Auth
tables (`auth.users`, etc.) are intentionally left in the shared `auth`
schema — they're shared across all apps on this Supabase project, which is
the intended behavior since users should authenticate once for the whole
platform.

| Table | Read | Write |
|---|---|---|
| `profiles` | All authenticated users (we expose names + avatars on course/instructor cards). | Self-update; admin can update any. |
| `categories` | Everyone. | Admin only. |
| `courses` | Published courses readable by everyone; drafts visible to owning instructor and admins. | Instructor of the course; admin. |
| `modules`, `lessons` | Inherits from parent course. | Inherits from parent course. |
| `quizzes` | Everyone (questions are not user-specific). | Instructor or admin. |
| `enrollments` | User sees their own; instructor sees enrollments of their courses; admin sees all. | Admin (server-side, called from Stripe/PayPal webhooks via service-role key). |
| `lesson_progress`, `quiz_attempts` | User sees their own; admin sees all. | User writes their own; admin writes any. |
| `subscriptions`, `payments`, `book_purchases` | User sees their own; admin all. | Admin only (webhooks use service-role key, which bypasses RLS). |
| `books` | Published readable; drafts admin-only. | Admin. |
| `ai_conversations`, `ai_messages` | User owns. | User owns. |
| `leads`, `sms_campaigns`, `sms_messages` | Admin only. | Admin only (form submissions use service-role key from `/api/contact`). |
| `coupons` | Active coupons readable by everyone (so checkout can validate). | Admin. |
| `reviews` | Published reviews + user's own (drafts) + admin. | User writes/updates/deletes own; admin can moderate. |
| `audit_log` | Admin only. | Service-role inserts only (no user-facing INSERT policy). |

## Notes

- **Service-role key bypasses RLS.** All webhook handlers (Stripe, PayPal,
  Twilio inbound) and server-side cron jobs MUST use the service-role key
  (`SUPABASE_SERVICE_ROLE_KEY`). Never expose this key to the browser.
- **Storage buckets** need separate policies. Plan to use buckets named
  `course-videos` (signed URLs only), `book-pdfs` (signed URLs only),
  `avatars` (public read, owner write), and `course-thumbnails` (public read,
  instructor/admin write).
- **`profiles.role`** is the single source of truth for authorization. Never
  trust JWT custom claims for role checks because they can be set by any
  client during signup. The trigger `handle_new_user` always seeds new
  profiles with `role = 'student'`.
- **`pgvector`** index is provisioned but not yet built — wait until you have
  enough lessons seeded (≥ 100 rows) before building the IVFFlat index, then
  uncomment the line in `0001_schema.sql`.
