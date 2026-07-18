# Task 2.1 — Types, limits, errorCopy, assembler + fixtures

**Phase**: 2 (extraction/assembly) · **Depends on**: 0.1 (vitest) · **Type**: Implementation + Quality

## Goal
Implement the pure-code core of the pipeline:
- `SOURCE/lib/ugc/types.ts` — `ChoiceId`, `BoundingBox`, `ExtractedQuestion`, `ExtractedAnswer`, `UgcErrorCode`, `UgcError`, `Result<T>`, `AssembledExam` (Design Doc §AI Extraction & Assembly → Types).
- `SOURCE/lib/ugc/limits.ts` — `LIMITS` constants (max questions/file bytes/pages, field lengths, grade 6–12, upload rate guard).
- `SOURCE/lib/ugc/errorCopy.ts` — `UgcErrorCode` → review-panel copy map.
- `SOURCE/lib/ugc/assembleExam.ts` — **pure, authoritative**: join questions to answers **by number**; MCQ `correct_answer := answer.letter` (from the answer file, never invented); essay `essay_answer := answer.text`; attach `images.get(n)`; `topic := meta.subject`; validate (counts match, 4 A–D choices + one correct per MCQ, non-empty stem, lengths). Returns `Result<AssembledExam>` with typed `Câu N` errors.
- `SOURCE/lib/ugc/__tests__/assembleExam.test.ts`.

**Remove** the obsolete v1.1 `SOURCE/lib/ugc/parseExam.ts` and `__tests__/parseExam.test.ts` (superseded).

## Files
New: `lib/ugc/{types,limits,errorCopy,assembleExam}.ts`, `lib/ugc/__tests__/assembleExam.test.ts`. Removed: `lib/ugc/parseExam.ts`, `lib/ugc/__tests__/parseExam.test.ts`.

## ACs / metrics
AC-008/009/010/012/013. PRD metric 2 (answer fidelity), metric 4 (image mapping).

## Verification / Acceptance
`npx vitest run lib/ugc` green. Proof obligations: assembling questions + a known answer map reproduces those answers exactly (metric 2); a figure on Câu 5 attaches its URL to Câu 5 only (metric 4); each error code (`WRONG_CHOICE_COUNT`, `ANSWER_COUNT_MISMATCH`, `ANSWER_MISSING`, `EMPTY_STEM`, `EMPTY_CHOICE`, `TOO_MANY_QUESTIONS`, length limits) returns the literal `code`+`questionNumber`; boundaries (at limit passes, +1 fails). `tsc` strict clean.

## References
Design Doc §AI Extraction & Assembly; ADR-0004 (assembly authoritative, answer authority, topic default).
