# Task 7 — QA (AC sweep, gates re-run, e2e, a11y)

**Phase**: 7 · **Depends on**: all · **Type**: Quality Assurance (final)

## Goal
Cross-cutting verification against every AC and the Verification Strategy.

## Checklist
- [ ] Walk AC-001…029 against the Design Doc AC Traceability Matrix.
- [ ] **Gate A**: `cd SOURCE && npx tsx supabase/test-rls.ts` → R-a…R-o green (re-run); confirm every server rule is DB/Storage-enforced (UI hiding never the guard); confirm logging excludes tokens/raw AI payloads.
- [ ] **Gate B**: `npx vitest run components/shared` → RichText XSS + seeded-regression + QuestionFigure image-origin green.
- [ ] Assembly fixtures green (`npx vitest run lib/ugc`): answer fidelity (metric 2), image mapping (metric 4), error codes, boundaries.
- [ ] AI-key no-bundle check passes (metric 6).
- [ ] AC-027 before/after catalog count equal (metric 5).
- [ ] Accessibility: axe on `/upload`, `/me/exams`, `/me/exams/[id]`, extended `/exams` + `/exams/[id]` → 0 serious/critical; manual keyboard pass incl. Delete/Report dialogs (focus trap + return).
- [ ] End-to-end: upload question+answer files → extract → review → correct a mis-read field → Publish → exam in `/exams` → attempt (MCQ) → result renders single-topic breakdown (no `computeScore` change). Image case: figure shows on its question in review + player. Report → duplicate blocked.
- [ ] `tsc`/ESLint/Prettier clean across changed files; build succeeds.
- [ ] Resolve Open Items with product: O-1 (grade 6–12 scope), O-2 (essay in player/result). O-3…O-6 recorded as engineering decisions.

## References
Design Doc §Verification Strategy, §AC Traceability Matrix, §Open Items; PRD metrics 1–6.
