# ADR-0006 Gemini Extraction Protocol — Provider Reality and Native Bounding-Box Format

## Status

Proposed — 2026-07-17. **Amends** ADR-0004 (which assumed the Claude API) and the Design Doc v2.0 §AI Extraction. Records two related decisions: (a) the AI provider is **Google Gemini** (already swapped in code on 2026-07-17, previously undocumented in the ADR chain); (b) the bounding-box contract moves to **Gemini's native trained format**, fixing a live failure where 0/21 questions with figures were detected.

## Context

### Provider swap (already executed, recorded here)

ADR-0004/Design Doc v2.0 specified the Claude API (`claude-opus-4-8` questions / `claude-haiku-4-5` answers). During live QA (2026-07-17) the engineer's Anthropic account had no billing credit; the product owner chose the **Gemini free tier** over topping up, accepting two stated trade-offs: free-tier rate limits are **per Google Cloud project, not per app user** (concurrent uploads can throttle the whole site), and Vietnamese/math OCR quality was less proven. The swap was an adapter-layer change only (`lib/ugc/gemini.ts`, `fileRef.ts`, both extractors, tests, no-bundle-check markers); the pipeline architecture was untouched. Model names were then corrected the same day after real-key testing showed the 2.5/2.0 generations return 404/429 for new accounts — **only `client.models.list()` against the real key is authoritative for model availability**. Current models: `gemini-3.5-flash` (questions, multimodal), `gemini-3.1-flash-lite` (answers).

### Bounding-box failure (the live bug this ADR fixes)

v2.0 asked the model for `imageBox: {x, y, w, h}` normalized **0..1** (top-left + width/height) — a format invented by our prompt. Live test 2026-07-17: a 7-page PDF with several figure-bearing questions extracted with **`imageBox: null` on all 21 questions** — the crop stage (`cropImages`, mupdf+sharp) never ran, because it is purely downstream of the AI's localization output.

Google documents that Gemini is **specifically trained** to emit bounding boxes as `[ymin, xmin, ymax, xmax]`, normalized to integers **0–1000** ([Gemini image understanding docs](https://ai.google.dev/gemini-api/docs/image-understanding); [bounding-box reference](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/bounding-box-detection)). Asking in a foreign dialect (`{x,y,w,h}/0..1`) while the schema offers `null` as an easy exit is the most probable cause of the total (0%, not partial) detection failure: the model has no calibrated way to answer and takes the escape hatch.

## Decision

1. **Provider of record: Google Gemini** (`@google/genai`), server-only, same key-confinement discipline (import "server-only" + build-time no-bundle check with Gemini markers). Model ids live in `lib/ugc/gemini.ts` only and must be re-verified against `client.models.list()` when changed.
2. **Bounding boxes use Gemini's native trained protocol**: schema field `box2d: [ymin, xmin, ymax, xmax]`, integers 0–1000, plus `page` (1-based) for PDFs; prompt wording follows Google's documented convention. Conversion to pixel rects happens **once, at the code boundary** (`boxToPixels` in `cropImages.ts`); everything downstream (crop, storage, review) is unchanged.
3. **Staged fallback if detection is still weak after the protocol fix** (decided by measured results on real files, in order): (a) separate dedicated localization call ("find all figures on this page", no transcription duties); (b) send PDF pages as individual page images instead of one inline PDF blob. Neither is built until the protocol fix is measured insufficient — avoid paying latency/complexity for an unproven need.

### Kill criterion

On the real-file fixture set (đề 2025 Toán with known figures), the protocol fix must detect **> 0** figures with usable crops. If detection stays at 0, escalate to fallback (a) before touching any other layer.

## Consequences

**Positive**: aligns with the model's training instead of fighting it; zero change to crop/storage/review layers (conversion isolated in `boxToPixels`); documented staged escalation prevents speculative over-engineering.

**Negative**: `BoundingBox` type changes shape (breaking internal change — types, extractor schema, `boxToPixels`, tests all move together in one task); bbox coordinates in any previously-persisted drafts are incompatible (acceptable: no production data; failed drafts are re-runnable).

**Neutral**: free-tier rate-limit risk stands as accepted; revisit paid tier or provider swap-back if OCR quality or quota becomes the bottleneck (the adapter layer keeps that cheap).

## Related Information

- [Gemini image understanding / object detection docs](https://ai.google.dev/gemini-api/docs/image-understanding) — native `[ymin, xmin, ymax, xmax]` 0–1000 convention
- Provider-swap detail + verified SDK surface: project memory `ugc-gemini-provider-swap`; PROCESS.md §S#33
- Live failure evidence: pipeline log 2026-07-17 (`[6/8] Cắt hình … — 0 câu có hình`), user-confirmed figures present in the file
- Code touchpoints: `SOURCE/lib/ugc/{gemini,types,extractQuestions,cropImages}.ts`, `SOURCE/scripts/check-ai-key-bundle.mjs`
