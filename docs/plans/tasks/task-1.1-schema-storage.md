# Task 1.1 — Schema + Storage DDL + apply by hand

**Phase**: 1 (DB/Storage foundation) · **Depends on**: — · **Type**: Implementation + Integration

## Goal
Append the Design Doc v2.0 §"Schema & DB Enforcement" DDL to `SOURCE/supabase/schema.sql`, create the two Storage buckets, and apply everything by hand in the Supabase SQL Editor (no migration framework). Idempotent (`add column if not exists`, `drop … if exists`, `is distinct from`). Vietnamese inline comments matching the file style.

File order of the appended DDL: `exams` columns + status CHECK → `questions` columns (`question_type`/`image_url`/`essay_answer`) + type CHECK → `exam_reports` table → replaced SELECT policies (`exams_select_visible`, `questions_select_visible` — published-or-author, **no admin**) → author WRITE policies (`exams_insert/update/delete_author`, `questions_insert/update/delete_author`) → `reports_insert_own` + `reports_select_own` → `profiles_update_own` with `with check` → Storage `storage.objects` policies for `exam-images` (published=public-ish/author) and `exam-uploads` (author-only) → **backfill LAST** (`update exams set status='published' where author_id is null …`).

**Explicitly NOT included** (removed in v2.0): `is_admin()`, the pending-cap trigger, the transition-guard trigger, the role-preservation trigger, any admin RLS branch.

## Files
- `SOURCE/supabase/schema.sql` (edit) — appended DDL + a documented "apply in SQL Editor" manual step.
- Storage: create buckets `exam-images` and `exam-uploads` (dashboard/API), path convention `{bucket}/{exam_id}/{filename}`.

## ACs / metrics
AC-017/018/019/021/023/024/025/026/027; enables the rest. PRD metrics 1/5.

## Verification / Acceptance
DDL applies cleanly; re-applying is a no-op (idempotence spot-check). `select count(*)` before/after confirms seeded rows are `published` and seeded `questions` default `question_type='mcq'` (AC-027). The image-policy dependency on the `exams` row existing is honored (the action creates the `exams` row before uploading images — noted for Task 4.1). **Blocks Task 1.2.**

## References
Design Doc §Schema & DB Enforcement 1–9; ADR-0001 (Decision, Enforcement placement, Backfill).
