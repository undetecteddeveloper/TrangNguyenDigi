# Task E1 — Real-file e2e + regression sweep (v2.1 QA)

**Phase**: E (QA) · **Depends on**: all v2.1 tasks · **Type**: Verification

## Goal
Prove v2.1 end-to-end on real data and prove v2.0 behavior is untouched.

## Checklist

**National-format e2e (AC-030/031/032)** — fixture: official 2025 Toán, **one exam code** (4 pages) as the question file + its answer page as the answer file:
- [ ] Upload → extract → all 22 questions land under correct (part, number); zero join errors from numbering collisions
- [ ] PHẦN II grids: every sub-item Đ/S matches the printed key; PHẦN III values match
- [ ] > 0 figures detected & crops visually correct (Gate D held)
- [ ] Review: 3 part sections, TF/short editors work, publish gate opens when clean
- [ ] Publish → catalog → attempt (all types answerable, "Not auto-scored" labels) → result (/12 score base, non-MCQ listed)
- [ ] Network/payload check: `sub_answers`/`essay_answer`/`correct_answer` absent from all player responses

**Old-format regression (AC-033)**:
- [ ] Full vitest suite green with v2.0 fixtures unmodified
- [ ] Existing seeded exam: browse → attempt → result unchanged
- [ ] v2.0-style single-part upload (simple mcq+essay files) → identical behavior to before (no part headings shown)

**Standing gates**:
- [ ] Gate A (`npx tsx supabase/test-rls.ts`) ALL PASS
- [ ] Gate B (XSS/regression/image-origin fixtures) green
- [ ] `tsc`, eslint, `next build`, `npm run check:bundle` all clean
- [ ] axe + keyboard pass on the changed surfaces (S-03 editors, player TF/short controls)

## References
Work Plan §v2.1 Completion Criteria; ADR-0005/0006 kill criteria; PRD v2.1 AC-030…033.
