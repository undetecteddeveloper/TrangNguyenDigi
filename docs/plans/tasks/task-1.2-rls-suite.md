# Task 1.2 — RLS + Storage suite (GATE A)

**Phase**: 1 (DB/Storage foundation) · **Depends on**: 1.1 · **Type**: Quality + Verification GATE

## Goal
Extend `SOURCE/supabase/test-rls.ts` with an **author** and a **non-author** user set (no admin user — admin removed) and the cases R-a…R-o from Design Doc §Test Strategy, using the existing `assert()` harness (service-role for setup; anon key + real sign-in for RLS; Storage read/write via the signed clients).

Cases: R-a/R-b/R-c non-published exam/questions unreadable by non-author + anon; R-d author reads own non-published; R-e non-author reads a **published** exam+questions (positive control); R-f non-author write on another's exam/questions rejected; R-g author deletes own (any status); R-h non-owner `update user_profiles` rejected; R-i non-author reads another's `exam_reports` = 0, own = 1; R-j report insert on non-published rejected; R-k duplicate report unique violation; R-l backfill count preserved; **R-m** non-author reads a non-published exam's image object = 0; **R-n** published image readable / author reads own non-published image; **R-o** non-author reads another's `exam-uploads` file = 0.

## Files
- `SOURCE/supabase/test-rls.ts` (edit).

## ACs / metrics
R-a…R-c/R-m/R-o → metric 1 / AC-024; R-e/R-n → AC-017/021/011/023; R-f/R-g/R-h → AC-018/019; R-i/R-j/R-k → AC-025/026; R-l → metric 5 / AC-027.

## Verification / Acceptance
`cd SOURCE && npx tsx supabase/test-rls.ts` prints all R-a…R-o passing, each asserting a literal expected row/object count or error. **This is Gate A — do not proceed to Phases 4/5/6 until green.** Re-run after every subsequent schema edit.

## References
Design Doc §Test Strategy (RLS + Storage suite); ADR-0001 (kill criterion).
