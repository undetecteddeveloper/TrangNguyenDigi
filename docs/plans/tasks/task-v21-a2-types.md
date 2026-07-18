# Task A2 — Types/limits/errorCopy v2.1

**Phase**: A (foundation) · **Depends on**: — · **Type**: Implementation + Quality

## Goal
Pure type/constant layer for the multi-part model (Design Doc §v2.1 Types delta):
- `types.ts`: `QuestionType` (4 values), `SubItemId`, `part` on `ExtractedQuestion`/all `ExtractedAnswer` variants, `subItems` on questions, `true_false`/`short_answer` answer variants, `ExtractedPart`; **`BoundingBox` → `{page, box2d:[ymin,xmin,ymax,xmax]}` 0–1000 ints (ADR-0006)**; `UgcError.partNumber: number | null`; new codes `WRONG_SUB_ITEM_COUNT`, `SHORT_ANSWER_TOO_LONG`. `AssembledQuestion` gains `part`, `subItems?`, `subAnswers?`, `shortAnswer?` (reuses `essayAnswer` storage — decide the TS field name here and keep it consistent).
- `limits.ts`: `MAX_PARTS: 5`, `MAX_SHORT_ANSWER: 100`.
- `errorCopy.ts`: part-aware copy — "Phần {p} Câu {n} — …" when multi-part, "Câu {n}" otherwise; copy for the 2 new codes.

## Files
Edited: `lib/ugc/{types,limits,errorCopy}.ts` (+ compile fallout in dependents is Task A3/B1/B2 scope — this task may leave dependents temporarily red ONLY if committed together with A3; prefer sequencing A2+A3 in one working session).

## Verification / Acceptance
`tsc --noEmit` clean **after A3 lands** (A2+A3 back-to-back); errorCopy unit tests updated for part-aware rendering; new codes covered.

## References
Design Doc §v2.1 Types delta; ADR-0005; ADR-0006 (bbox type).
