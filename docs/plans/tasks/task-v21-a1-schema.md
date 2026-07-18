# Task A1 — Schema v2.1 delta + Gate A re-run

**Phase**: A (foundation) · **Depends on**: — · **Type**: Implementation + Manual apply + Verification

## Goal
Append the v2.1 DDL (Design Doc §v2.1 Schema delta) to `SOURCE/supabase/schema.sql`, idempotent:
- `questions.part_number int not null default 1`
- `questions.sub_answers jsonb` (server-only answer data for `true_false` — same confinement discipline as `correct_answer`)
- widen `questions_type_check` → `('mcq','essay','true_false','short_answer')`
- `exams.parts jsonb` (nullable; `[{number, title}]`)

Engineer applies by hand in the Supabase SQL Editor, then re-run Gate A.

## Files
Edited: `supabase/schema.sql`.

## ACs / metrics
AC-030 (data substrate), AC-033 (defaults keep old rows intact). Standing convention: Gate A re-run after every schema edit.

## Verification / Acceptance
`cd SOURCE && npx tsx supabase/test-rls.ts` → ALL PASS after apply. Old rows read back with `part_number=1`, `sub_answers=null`, `parts=null`. Schema re-applies idempotently (run twice, no error).

## References
Design Doc §v2.1 Schema delta; ADR-0005.
