-- ===========================================================================
-- Migración Plus Academy · Row Level Security policies
-- All tables in the migracionplus schema get RLS. Service-role keys bypass
-- RLS for server-side jobs (webhooks, seed scripts, cron).
-- ===========================================================================

-- helpers, scoped to the migracionplus schema
create or replace function migracionplus.is_admin()
returns boolean
language sql
security definer
stable
set search_path = migracionplus, public
as $$
  select exists (
    select 1 from migracionplus.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function migracionplus.is_instructor_or_admin()
returns boolean
language sql
security definer
stable
set search_path = migracionplus, public
as $$
  select exists (
    select 1 from migracionplus.profiles
    where id = auth.uid() and role in ('instructor', 'admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table migracionplus.profiles enable row level security;
drop policy if exists profiles_select_all on migracionplus.profiles;
create policy profiles_select_all on migracionplus.profiles for select using (true);
drop policy if exists profiles_update_own on migracionplus.profiles;
create policy profiles_update_own on migracionplus.profiles for update using (auth.uid() = id);
drop policy if exists profiles_admin_all on migracionplus.profiles;
create policy profiles_admin_all on migracionplus.profiles for all using (migracionplus.is_admin());

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
alter table migracionplus.categories enable row level security;
drop policy if exists categories_select_all on migracionplus.categories;
create policy categories_select_all on migracionplus.categories for select using (true);
drop policy if exists categories_admin_write on migracionplus.categories;
create policy categories_admin_write on migracionplus.categories for all using (migracionplus.is_admin());

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
alter table migracionplus.courses enable row level security;
drop policy if exists courses_select_published on migracionplus.courses;
create policy courses_select_published on migracionplus.courses for select using (
  is_published = true or instructor_id = auth.uid() or migracionplus.is_admin()
);
drop policy if exists courses_modify_owner_or_admin on migracionplus.courses;
create policy courses_modify_owner_or_admin on migracionplus.courses for all using (
  instructor_id = auth.uid() or migracionplus.is_admin()
);

-- ---------------------------------------------------------------------------
-- modules / lessons follow course visibility
-- ---------------------------------------------------------------------------
alter table migracionplus.modules enable row level security;
drop policy if exists modules_select on migracionplus.modules;
create policy modules_select on migracionplus.modules for select using (
  exists (
    select 1 from migracionplus.courses c
    where c.id = modules.course_id
      and (c.is_published = true or c.instructor_id = auth.uid() or migracionplus.is_admin())
  )
);
drop policy if exists modules_write on migracionplus.modules;
create policy modules_write on migracionplus.modules for all using (
  exists (
    select 1 from migracionplus.courses c
    where c.id = modules.course_id
      and (c.instructor_id = auth.uid() or migracionplus.is_admin())
  )
);

alter table migracionplus.lessons enable row level security;
drop policy if exists lessons_select on migracionplus.lessons;
create policy lessons_select on migracionplus.lessons for select using (
  exists (
    select 1 from migracionplus.modules m
    join migracionplus.courses c on c.id = m.course_id
    where m.id = lessons.module_id
      and (c.is_published = true or c.instructor_id = auth.uid() or migracionplus.is_admin())
  )
);
drop policy if exists lessons_write on migracionplus.lessons;
create policy lessons_write on migracionplus.lessons for all using (
  exists (
    select 1 from migracionplus.modules m
    join migracionplus.courses c on c.id = m.course_id
    where m.id = lessons.module_id
      and (c.instructor_id = auth.uid() or migracionplus.is_admin())
  )
);

-- ---------------------------------------------------------------------------
-- quizzes
-- ---------------------------------------------------------------------------
alter table migracionplus.quizzes enable row level security;
drop policy if exists quizzes_select on migracionplus.quizzes;
create policy quizzes_select on migracionplus.quizzes for select using (true);
drop policy if exists quizzes_admin_write on migracionplus.quizzes;
create policy quizzes_admin_write on migracionplus.quizzes for all using (migracionplus.is_instructor_or_admin());

-- ---------------------------------------------------------------------------
-- enrollments / progress
-- ---------------------------------------------------------------------------
alter table migracionplus.enrollments enable row level security;
drop policy if exists enrollments_select on migracionplus.enrollments;
create policy enrollments_select on migracionplus.enrollments for select using (
  user_id = auth.uid()
  or exists (
    select 1 from migracionplus.courses c
    where c.id = enrollments.course_id and c.instructor_id = auth.uid()
  )
  or migracionplus.is_admin()
);
drop policy if exists enrollments_admin_write on migracionplus.enrollments;
create policy enrollments_admin_write on migracionplus.enrollments for all using (migracionplus.is_admin());

alter table migracionplus.lesson_progress enable row level security;
drop policy if exists lp_user on migracionplus.lesson_progress;
create policy lp_user on migracionplus.lesson_progress for all using (user_id = auth.uid() or migracionplus.is_admin());

alter table migracionplus.quiz_attempts enable row level security;
drop policy if exists qa_user on migracionplus.quiz_attempts;
create policy qa_user on migracionplus.quiz_attempts for all using (user_id = auth.uid() or migracionplus.is_admin());

-- ---------------------------------------------------------------------------
-- subscriptions / payments / books / book_purchases
-- ---------------------------------------------------------------------------
alter table migracionplus.subscriptions enable row level security;
drop policy if exists subs_select on migracionplus.subscriptions;
create policy subs_select on migracionplus.subscriptions for select using (user_id = auth.uid() or migracionplus.is_admin());
drop policy if exists subs_admin_write on migracionplus.subscriptions;
create policy subs_admin_write on migracionplus.subscriptions for all using (migracionplus.is_admin());

alter table migracionplus.payments enable row level security;
drop policy if exists payments_select on migracionplus.payments;
create policy payments_select on migracionplus.payments for select using (user_id = auth.uid() or migracionplus.is_admin());
drop policy if exists payments_admin_write on migracionplus.payments;
create policy payments_admin_write on migracionplus.payments for all using (migracionplus.is_admin());

alter table migracionplus.books enable row level security;
drop policy if exists books_select on migracionplus.books;
create policy books_select on migracionplus.books for select using (is_published = true or migracionplus.is_admin());
drop policy if exists books_admin_write on migracionplus.books;
create policy books_admin_write on migracionplus.books for all using (migracionplus.is_admin());

alter table migracionplus.book_purchases enable row level security;
drop policy if exists bp_select on migracionplus.book_purchases;
create policy bp_select on migracionplus.book_purchases for select using (user_id = auth.uid() or migracionplus.is_admin());
drop policy if exists bp_admin_write on migracionplus.book_purchases;
create policy bp_admin_write on migracionplus.book_purchases for all using (migracionplus.is_admin());

-- ---------------------------------------------------------------------------
-- AI conversations / messages
-- ---------------------------------------------------------------------------
alter table migracionplus.ai_conversations enable row level security;
drop policy if exists ai_conv_user on migracionplus.ai_conversations;
create policy ai_conv_user on migracionplus.ai_conversations for all using (user_id = auth.uid() or migracionplus.is_admin());

alter table migracionplus.ai_messages enable row level security;
drop policy if exists ai_msg_user on migracionplus.ai_messages;
create policy ai_msg_user on migracionplus.ai_messages for all using (
  exists (
    select 1 from migracionplus.ai_conversations c
    where c.id = ai_messages.conversation_id
      and (c.user_id = auth.uid() or migracionplus.is_admin())
  )
);

-- ---------------------------------------------------------------------------
-- leads / SMS · admin only
-- ---------------------------------------------------------------------------
alter table migracionplus.leads enable row level security;
drop policy if exists leads_admin on migracionplus.leads;
create policy leads_admin on migracionplus.leads for all using (migracionplus.is_admin());

alter table migracionplus.sms_campaigns enable row level security;
drop policy if exists sc_admin on migracionplus.sms_campaigns;
create policy sc_admin on migracionplus.sms_campaigns for all using (migracionplus.is_admin());

alter table migracionplus.sms_messages enable row level security;
drop policy if exists sm_admin on migracionplus.sms_messages;
create policy sm_admin on migracionplus.sms_messages for all using (migracionplus.is_admin());

-- ---------------------------------------------------------------------------
-- coupons / reviews / audit
-- ---------------------------------------------------------------------------
alter table migracionplus.coupons enable row level security;
drop policy if exists coupons_select on migracionplus.coupons;
create policy coupons_select on migracionplus.coupons for select using (is_active = true);
drop policy if exists coupons_admin_write on migracionplus.coupons;
create policy coupons_admin_write on migracionplus.coupons for all using (migracionplus.is_admin());

alter table migracionplus.reviews enable row level security;
drop policy if exists reviews_select on migracionplus.reviews;
create policy reviews_select on migracionplus.reviews for select using (
  is_published = true or user_id = auth.uid() or migracionplus.is_admin()
);
drop policy if exists reviews_user_insert on migracionplus.reviews;
create policy reviews_user_insert on migracionplus.reviews for insert with check (user_id = auth.uid());
drop policy if exists reviews_user_update on migracionplus.reviews;
create policy reviews_user_update on migracionplus.reviews for update using (user_id = auth.uid() or migracionplus.is_admin());
drop policy if exists reviews_user_delete on migracionplus.reviews;
create policy reviews_user_delete on migracionplus.reviews for delete using (user_id = auth.uid() or migracionplus.is_admin());

alter table migracionplus.audit_log enable row level security;
drop policy if exists audit_admin on migracionplus.audit_log;
create policy audit_admin on migracionplus.audit_log for select using (migracionplus.is_admin());
