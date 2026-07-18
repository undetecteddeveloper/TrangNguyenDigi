# Task A3 — Assembler composite join (GATE C)

**Phase**: A (foundation) · **Depends on**: A2 · **Type**: Implementation + Quality (GATE)

## Goal
Fix the root cause of the live answer-loss bug: `assembleExamLenient`/`validateAssembledExam` join answers **and images** by the composite key `` `${part}:${number}` `` instead of the flat `number` (Design Doc §v2.1 Assembly delta). Validate the 2 new types:
- `true_false`: 2–4 sub-items, distinct ids a–d (`WRONG_SUB_ITEM_COUNT`); publish-clean requires a boolean per sub-item from the answer file (`ANSWER_MISSING`).
- `short_answer`: non-empty expected value ≤ `MAX_SHORT_ANSWER` (`SHORT_ANSWER_TOO_LONG`).
- Type mismatch between question/answer at the same (part, number) → `ANSWER_MISSING` (existing rule generalized).

Unchanged: answer-file authority, `topic = subject`, lenient/validate split, all v2.0 error codes.

## Files
Edited: `lib/ugc/assembleExam.ts`, `lib/ugc/__tests__/assembleExam.test.ts`.

## ACs / metrics
AC-030 (zero cross-part overwrites), AC-031/032 (new-type validation), AC-033 (old-format regression). PRD metric 2 (answer fidelity, now part-qualified).

## Verification / Acceptance — **GATE C**
`npx vitest run lib/ugc` green. Proof obligations: (1) fixture with "Câu 1" in parts I, II, III + full answer set → each keeps its own answer and image, zero overwrites; (2) all pre-existing v2.0 single-part fixtures pass **unmodified** (part defaults to 1); (3) each new error code returns literal `code`+`partNumber`+`questionNumber`. **Gate C blocks Phases C/D.**

## References
Design Doc §v2.1 Assembly delta; ADR-0005 (composite identity + kill criterion).
