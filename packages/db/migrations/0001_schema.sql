-- ===========================================================================
-- Migración Plus Academy · Initial schema (isolated in `migracionplus` schema)
-- All tables from build-prompt section 5.1, namespaced so they coexist with
-- other apps sharing the same Supabase project.
--
-- Apply via Supabase CLI:   supabase db push
-- Or via SQL editor in the dashboard, in this order:
--     0001_schema.sql  →  0002_rls.sql
-- ===========================================================================

-- Required extensions live in Supabase's `extensions` schema by convention.
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "vector" with schema extensions;

-- ---------------------------------------------------------------------------
-- Dedicated schema for this app
-- ---------------------------------------------------------------------------
create schema if not exists migracionplus;

-- Grants: PostgREST (Supabase's API layer) needs USAGE on the schema and
-- table-level grants are handled by RLS once policies are installed.
grant usage on schema migracionplus to anon, authenticated, service_role;
alter default privileges in schema migracionplus
  grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges in schema migracionplus
  grant select on tables to anon;
alter default privileges in schema migracionplus
  grant usage, select on sequences to authenticated, service_role;
alter default privileges in schema migracionplus
  grant execute on functions to authenticated, service_role;

-- Subsequent CREATE TABLE statements land in migracionplus by default.
set search_path to migracionplus, extensions, public;

-- ---------------------------------------------------------------------------
-- profiles · extends auth.users (which lives in the shared `auth` schema)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  preferred_locale text not null default 'es' check (preferred_locale in ('es', 'en')),
  phone text,
  phone_verified boolean default false,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  bio text,
  marketing_opt_in boolean default false,
  sms_opt_in boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger: auto-create migracionplus.profiles row when a user is added to
-- auth.users. Marked SECURITY DEFINER so it runs as the function owner and
-- can insert into our schema regardless of the originating role.
create or replace function migracionplus.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = migracionplus, public, auth
as $$
begin
  insert into migracionplus.profiles (id, full_name, preferred_locale, marketing_opt_in)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'preferred_locale', 'es'),
    coalesce((new.raw_user_meta_data->>'marketing_opt_in')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop any pre-existing trigger that might have been installed by another app
-- using the same auth.users table.
drop trigger if exists on_auth_user_created_migracionplus on auth.users;
create trigger on_auth_user_created_migracionplus
  after insert on auth.users
  for each row execute function migracionplus.handle_new_user();

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_es text not null,
  name_en text not null,
  description_es text,
  description_en text,
  icon text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- courses, modules, lessons, quizzes
-- ---------------------------------------------------------------------------
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  slug_en text unique,
  category_id uuid references migracionplus.categories(id),
  instructor_id uuid references migracionplus.profiles(id),
  title_es text not null,
  title_en text not null,
  subtitle_es text,
  subtitle_en text,
  description_es text,
  description_en text,
  thumbnail_url text,
  trailer_video_url text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  duration_minutes int,
  language text[] default array['es']::text[],
  price_cents int not null default 0,
  compare_at_price_cents int,
  currency text not null default 'USD',
  is_published boolean default false,
  is_featured boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_courses_category on courses(category_id) where is_published = true;
create index if not exists idx_courses_featured on courses(is_featured) where is_published = true;

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references migracionplus.courses(id) on delete cascade,
  title_es text not null,
  title_en text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references migracionplus.modules(id) on delete cascade,
  title_es text not null,
  title_en text not null,
  description_es text,
  description_en text,
  video_url text,
  video_provider text check (video_provider in ('mux', 'cloudflare', 'youtube', 'vimeo')),
  video_duration_seconds int,
  transcript_es text,
  transcript_en text,
  transcript_embedding extensions.vector(1536), -- text-embedding-3-small
  is_preview boolean default false,
  sort_order int not null default 0,
  resources jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_lessons_module on lessons(module_id);
-- IVFFlat index for RAG over transcripts (build after seeding production data).
-- create index if not exists idx_lessons_embedding on lessons using ivfflat (transcript_embedding extensions.vector_cosine_ops);

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references migracionplus.lessons(id) on delete cascade,
  module_id uuid references migracionplus.modules(id) on delete cascade,
  title_es text not null,
  title_en text not null,
  passing_score int default 70,
  questions jsonb not null,
  created_at timestamptz default now(),
  check (lesson_id is not null or module_id is not null)
);

-- ---------------------------------------------------------------------------
-- enrollments and progress
-- ---------------------------------------------------------------------------
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references migracionplus.profiles(id) on delete cascade,
  course_id uuid not null references migracionplus.courses(id) on delete cascade,
  source text check (source in ('purchase', 'subscription', 'gift', 'admin_grant')),
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  certificate_issued_at timestamptz,
  unique (user_id, course_id)
);

create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references migracionplus.profiles(id) on delete cascade,
  lesson_id uuid not null references migracionplus.lessons(id) on delete cascade,
  watched_seconds int default 0,
  completed boolean default false,
  completed_at timestamptz,
  last_watched_at timestamptz default now(),
  unique (user_id, lesson_id)
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references migracionplus.profiles(id) on delete cascade,
  quiz_id uuid not null references migracionplus.quizzes(id) on delete cascade,
  answers jsonb not null,
  score int not null,
  passed boolean not null,
  attempted_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- payments and subscriptions
-- ---------------------------------------------------------------------------
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references migracionplus.profiles(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique not null,
  plan text not null check (plan in ('monthly', 'annual', 'lifetime')),
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now()
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_es text not null,
  title_en text not null,
  author text not null,
  description_es text,
  description_en text,
  cover_url text not null,
  isbn text,
  format text not null check (format in ('physical', 'digital', 'both')),
  amazon_url text,
  amazon_affiliate_tag text,
  digital_file_url text,
  price_cents int,
  currency text default 'USD',
  is_published boolean default false,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references migracionplus.profiles(id) on delete cascade,
  course_id uuid references migracionplus.courses(id),
  book_id uuid references migracionplus.books(id),
  amount_cents int not null,
  currency text not null default 'USD',
  provider text not null check (provider in ('stripe', 'paypal')),
  provider_payment_id text not null,
  status text not null,
  receipt_url text,
  paid_at timestamptz default now()
);

create table if not exists book_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references migracionplus.profiles(id) on delete cascade,
  book_id uuid not null references migracionplus.books(id),
  payment_id uuid references migracionplus.payments(id),
  download_count int default 0,
  purchased_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- AI assistant
-- ---------------------------------------------------------------------------
create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references migracionplus.profiles(id) on delete cascade,
  title text,
  context jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references migracionplus.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  tokens_in int,
  tokens_out int,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- leads and SMS
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  preferred_locale text default 'es',
  intake_answers jsonb,
  qualification_score int,
  qualification_summary text,
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'enrolled', 'lost')),
  source text,
  assigned_to uuid references migracionplus.profiles(id),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists sms_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message_template_es text not null,
  message_template_en text not null,
  trigger_type text not null check (trigger_type in ('manual', 'enrollment', 'completion', 'abandonment', 'renewal_reminder')),
  audience_filter jsonb,
  status text default 'draft' check (status in ('draft', 'scheduled', 'sending', 'sent', 'paused')),
  scheduled_for timestamptz,
  created_by uuid references migracionplus.profiles(id),
  created_at timestamptz default now()
);

create table if not exists sms_messages (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references migracionplus.sms_campaigns(id),
  user_id uuid references migracionplus.profiles(id),
  to_phone text not null,
  body text not null,
  twilio_sid text,
  status text not null,
  error text,
  sent_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- coupons, reviews, audit log
-- ---------------------------------------------------------------------------
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value int not null,
  applies_to text not null check (applies_to in ('all', 'course', 'subscription', 'book')),
  course_id uuid references migracionplus.courses(id),
  usage_limit int,
  usage_count int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references migracionplus.profiles(id) on delete cascade,
  course_id uuid not null references migracionplus.courses(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_published boolean default true,
  created_at timestamptz default now(),
  unique (user_id, course_id)
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references migracionplus.profiles(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists idx_audit_actor on audit_log(actor_id);
create index if not exists idx_audit_resource on audit_log(resource_type, resource_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function migracionplus.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$
declare r record;
begin
  for r in
    select tablename from pg_tables
    where schemaname = 'migracionplus'
      and tablename in ('profiles', 'courses', 'ai_conversations', 'leads')
  loop
    execute format(
      'drop trigger if exists set_updated_at on migracionplus.%I; '
      'create trigger set_updated_at before update on migracionplus.%I '
      'for each row execute function migracionplus.tg_set_updated_at();',
      r.tablename, r.tablename
    );
  end loop;
end $$;
