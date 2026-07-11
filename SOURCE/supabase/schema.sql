-- ============================================================================
-- TrangNguyenDigi — Database Schema (GĐ 2 M2.2)
-- Thiết kế đơn giản theo quyết định C&D Q1=A:
--   - questions/exams chỉ giữ cột cần thiết cho Core Loop.
--   - KHÔNG có confidence_score / quarantine / view published_questions
--     (để dành Post-MVP Layer 4).
-- Cách dùng: paste toàn bộ file này vào Supabase SQL Editor → Run.
-- Idempotent: chạy lại nhiều lần không lỗi.
-- Tham chiếu BACK-END-ARCHITECTURE-MAP.md Mục 3, 4, 8.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Logic L1 — Identity
-- ----------------------------------------------------------------------------

create table if not exists public.user_profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role         text not null default 'student',
  created_at   timestamptz not null default now()
);

-- Tự tạo user_profiles khi có user mới trong auth.users (chuẩn Supabase).
-- SECURITY DEFINER để bypass RLS lúc insert tự động.
-- S#24: OAuth (Google/Facebook) không set 'display_name' trong
-- raw_user_meta_data — chỉ có 'full_name'/'name' (Google) hoặc 'name'
-- (Facebook). Fallback chain: display_name → full_name → name → phần
-- trước "@" của email (KHÔNG dùng email đầy đủ — lộ email trên UI).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Logic L4 (tối giản) — Content: questions & exams
-- ----------------------------------------------------------------------------

create table if not exists public.questions (
  id             text primary key,
  content        text not null,
  choices        jsonb not null,                 -- [{ id: 'A'|'B'|'C'|'D', text }]
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  subject        text not null,
  grade          int  not null,
  topic          text not null
);

create table if not exists public.exams (
  id               text primary key,
  title            text not null,
  question_ids     text[] not null,               -- thứ tự câu hỏi trong đề
  duration_minutes int  not null,
  subject          text not null,
  grade            int  not null,
  -- S#27: metadata cho Filter/ExamCard (School/Year/Semester + sort Newest/Oldest).
  school           text,                          -- trường biên soạn/nguồn đề (free-text)
  school_year      int,                           -- niên khóa ra đề, vd 2024
  semester         text,                          -- 'HK1' | 'HK2' (constraint bên dưới)
  created_at       timestamptz not null default now()
);

-- S#27 migration — DB đã tồn tại từ trước KHÔNG nhận cột mới qua
-- `create table if not exists` → ALTER riêng, idempotent.
alter table public.exams add column if not exists school text;
alter table public.exams add column if not exists school_year int;
alter table public.exams add column if not exists semester text;
alter table public.exams add column if not exists created_at timestamptz not null default now();

alter table public.exams drop constraint if exists exams_semester_check;
alter table public.exams add constraint exams_semester_check
  check (semester is null or semester in ('HK1', 'HK2'));

-- ----------------------------------------------------------------------------
-- Logic L2 — Core Loop: attempts, answers, results
-- ----------------------------------------------------------------------------

create table if not exists public.exam_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  exam_id      text not null references public.exams (id),
  status       text not null default 'in_progress',  -- 'in_progress' | 'submitted'
  started_at   timestamptz not null default now(),
  submitted_at timestamptz
);

create table if not exists public.attempt_answers (
  id          uuid primary key default gen_random_uuid(),
  attempt_id  uuid not null references public.exam_attempts (id) on delete cascade,
  question_id text not null references public.questions (id),
  answer      text check (answer in ('A', 'B', 'C', 'D')),  -- null = bỏ trống
  flagged     boolean not null default false,
  unique (attempt_id, question_id)
);

create table if not exists public.exam_results (
  id              uuid primary key default gen_random_uuid(),
  attempt_id      uuid not null unique references public.exam_attempts (id) on delete cascade,
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  total_score     numeric(4, 2) not null,           -- thang 10
  correct         int not null,
  total           int not null,
  per_question    jsonb not null,                   -- PerQuestionResult[]
  topic_breakdown jsonb not null,                   -- TopicResult[]
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.user_profiles   enable row level security;
alter table public.questions        enable row level security;
alter table public.exams            enable row level security;
alter table public.exam_attempts    enable row level security;
alter table public.attempt_answers  enable row level security;
alter table public.exam_results     enable row level security;

-- user_profiles — user chỉ đọc/sửa profile của mình -------------------------
drop policy if exists "profiles_select_own" on public.user_profiles;
create policy "profiles_select_own" on public.user_profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.user_profiles;
create policy "profiles_update_own" on public.user_profiles
  for update using (id = auth.uid());

-- questions — mọi authenticated user đọc được -------------------------------
drop policy if exists "questions_select_authenticated" on public.questions;
create policy "questions_select_authenticated" on public.questions
  for select to authenticated using (true);

-- exams — mọi authenticated user đọc được -----------------------------------
drop policy if exists "exams_select_authenticated" on public.exams;
create policy "exams_select_authenticated" on public.exams
  for select to authenticated using (true);

-- exam_attempts — user chỉ thao tác attempt của mình ------------------------
drop policy if exists "attempts_select_own" on public.exam_attempts;
create policy "attempts_select_own" on public.exam_attempts
  for select using (user_id = auth.uid());

drop policy if exists "attempts_insert_own" on public.exam_attempts;
create policy "attempts_insert_own" on public.exam_attempts
  for insert with check (user_id = auth.uid());

drop policy if exists "attempts_update_own" on public.exam_attempts;
create policy "attempts_update_own" on public.exam_attempts
  for update using (user_id = auth.uid());

-- attempt_answers — chỉ khi attempt thuộc về user --------------------------
drop policy if exists "answers_select_own" on public.attempt_answers;
create policy "answers_select_own" on public.attempt_answers
  for select using (
    exists (
      select 1 from public.exam_attempts a
      where a.id = attempt_answers.attempt_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "answers_insert_own" on public.attempt_answers;
create policy "answers_insert_own" on public.attempt_answers
  for insert with check (
    exists (
      select 1 from public.exam_attempts a
      where a.id = attempt_answers.attempt_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "answers_update_own" on public.attempt_answers;
create policy "answers_update_own" on public.attempt_answers
  for update using (
    exists (
      select 1 from public.exam_attempts a
      where a.id = attempt_answers.attempt_id and a.user_id = auth.uid()
    )
  );

-- exam_results — user chỉ đọc/ghi kết quả của mình --------------------------
drop policy if exists "results_select_own" on public.exam_results;
create policy "results_select_own" on public.exam_results
  for select using (user_id = auth.uid());

drop policy if exists "results_insert_own" on public.exam_results;
create policy "results_insert_own" on public.exam_results
  for insert with check (user_id = auth.uid());
