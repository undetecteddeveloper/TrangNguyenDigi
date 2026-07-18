# Task B2 — Parts + 4-type extraction

**Phase**: B (AI protocol) · **Depends on**: A2, B1 · **Type**: Implementation + Quality + Real-file check

## Goal
Teach both extractors the national 3-part structure (Design Doc §v2.1 Extraction delta):
- `extractQuestions.ts`: schema/prompt returns `{parts: [{number,title}], questions: [...]}`; detects part headers ("PHẦN I." etc.; unheaded file → single part, `parts: []`); numbers questions **within their part**; classifies `mcq` / `true_false` (cluster with sub-items a–d) / `short_answer` / `essay`; transcribes sub-item statements for TF clusters. Still NEVER marks correct answers.
- `extractAnswers.ts`: schema/prompt reads the answer page's per-part tables — PHẦN I letter row, PHẦN II Đ/S matrix (per-sub-item booleans), PHẦN III value row — returning part-qualified entries per the `ExtractedAnswer` v2.1 union.

## Files
Edited: `lib/ugc/{extractQuestions,extractAnswers}.ts`, `lib/ugc/__tests__/extractors.test.ts`.

## Verification / Acceptance
- Unit (mocked SDK): mapper accepts/normalizes all 4 types + parts; rejects malformed (bad sub-item id, non-boolean Đ/S value, missing part); single-part payload (no headers) maps to `part: 1` everywhere.
- **Real-file spot check**: 2025 Toán fixture (1 exam code + its answer page) → 12 mcq (P-I) + 4 true_false×4 sub-items (P-II) + 6 short_answer (P-III); answer grid values match the printed key (e.g., mã 0101: I.1=C…; II Câu 1 a=Đ,b=S,c=S,d=S; III Câu 1=1260).
- `vitest` + `tsc` green; old single-part mock fixtures still pass.

## References
Design Doc §v2.1 Extraction delta; ADR-0005; official 2025 structure (ADR-0005 references).
