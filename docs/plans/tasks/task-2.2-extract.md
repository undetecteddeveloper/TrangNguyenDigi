# Task 2.2 — AI extractors + image crop (server-only)

**Phase**: 2 (extraction/assembly) · **Depends on**: 2.1 · **Type**: Implementation + Quality

## Goal
Implement the server-side AI steps and the image cropper:
- `SOURCE/lib/ugc/extractQuestions.ts` — one multimodal Claude call (`@anthropic-ai/sdk`, model `claude-opus-4-8` or `claude-sonnet-5`) with a **structured output** schema = `ExtractedQuestion[]`. Reads the question file (image/PDF); numbers questions; classifies mcq/essay; transcribes stem + 4 choices (mcq); returns `imageBox` for any figure. **Instructed NOT to mark a correct answer.**
- `SOURCE/lib/ugc/extractAnswers.ts` — one Claude call (cheap model `claude-haiku-4-5`), structured output = `ExtractedAnswer[]` (number → letter | text). Reads, does not solve.
- `SOURCE/lib/ugc/cropImages.ts` — pure code + Storage: for each `imageBox`, prefer the **PDF-embedded** image; else crop the bounding box (`sharp`) from the rendered page; upload to `exam-images/{examId}/q{n}.png`; return the URL. Per-figure failure → `IMAGE_CROP_FAILED(n)`.

**Server-only**: these modules import the AI SDK and read the key from server env; they must never be imported by a client component. Add a **build-time check** asserting the AI key is not present in the client bundle (PRD metric 6).

## Files
New: `lib/ugc/{extractQuestions,extractAnswers,cropImages}.ts` + mapping unit tests (mocked SDK); a bundle-check script/config.

## ACs / metrics
AC-006/007/010/011. PRD metric 6 (no key exposure).

## Verification / Acceptance
Unit tests mock the SDK boundary and assert the mapping SDK-response → `Extracted*` and the `EXTRACTION_FAILED` path (no network/cost in unit tests). The build-time check confirms the key is absent from the client bundle. A small **manual/integration** run against real fixture files is done in the pilot (metric 3), not in the unit suite.

## References
Design Doc §AI Extraction & Assembly (Contracts); ADR-0004 (two-call extraction, server-only, image strategy); claude-api skill (multimodal document/image input, structured outputs, model IDs).
