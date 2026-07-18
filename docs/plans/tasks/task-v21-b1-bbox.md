# Task B1 — Native bbox protocol (GATE D)

**Phase**: B (AI protocol) · **Depends on**: A2 · **Type**: Implementation + Quality + Real-file check (GATE)

## Goal
Fix the 0/21 figure-detection failure (ADR-0006) by speaking Gemini's trained bounding-box dialect:
- `extractQuestions.ts`: JSON schema field `imageBox` → `{page, box2d}` where `box2d` is `[ymin, xmin, ymax, xmax]`, **integers 0–1000**; prompt wording follows Google's documented convention (detect figures/diagrams per question; `null` only when the question truly has no figure).
- `cropImages.ts::boxToPixels`: convert `box2d/1000 × (width,height)` → pixel rect — the ONLY conversion point; crop/upload/storage unchanged.

## Files
Edited: `lib/ugc/{extractQuestions,cropImages}.ts`, `lib/ugc/__tests__/{extractors,assembleExam}.test.ts` (bbox fixtures reshaped).

## Verification / Acceptance — **GATE D**
- Unit: mapper accepts valid `box2d`, rejects malformed (wrong arity/range); `boxToPixels` converts corners correctly incl. clamping (unit fixtures with known rects).
- **Real-file check (kill criterion)**: run the extractor against the 2025 Toán fixture (pages with known figures — lăng trụ, hình hộp, đồ thị) → **> 0 questions return a box2d, and the resulting crops visually contain the figure**. If detection stays 0 → STOP, escalate per ADR-0006 staged fallback (dedicated localization call → per-page images); do NOT tune other layers.
- `vitest` + `tsc` green.

## References
ADR-0006; Design Doc §v2.1 Extraction delta; [Gemini image-understanding docs](https://ai.google.dev/gemini-api/docs/image-understanding).
