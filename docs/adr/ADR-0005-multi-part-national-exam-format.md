# ADR-0005 Multi-Part Exam Structure (National 2025 Format Support)

## Status

Proposed — 2026-07-17. **Amends** ADR-0004 (extraction/assembly contract) and the Design Doc v2.0 data model. Triggered by a real-world test failure: uploading the official 2025 national high-school graduation exam (đề thi tốt nghiệp THPT 2025, môn Toán) produced 18/21 assembly errors and silently dropped answers, because the v2.0 data model cannot represent the exam's structure.

- PRD: `docs/prd/ugc-exam-upload-prd.md` (v2.1 amendment) — scope now includes the national 3-part format.
- Sibling ADRs: ADR-0004 (extraction + assembly — join rule amended here), ADR-0006 (Gemini extraction protocol).

## Context

Since 2025, the Ministry of Education and Training (Bộ GD&ĐT) restructured the national graduation exam for multiple-choice subjects into **three parts** ([official structure, vqa.moet.gov.vn](https://vqa.moet.gov.vn/vi/news/savefile/thong-bao/cau-truc-dinh-dang-de-thi-tot-nghiep-thpt-tu-nam-2025-74.html); [chinhphu.vn summary](https://xaydungchinhsach.chinhphu.vn/cau-truc-de-thi-tot-nghiep-thpt-tu-nam-2025-119240308200554932.htm)):

| Part | Question form | Answer form | Toán 2025 example |
|------|--------------|-------------|--------------------|
| **PHẦN I** | 4-choice MCQ (A–D) | one letter | 12 questions |
| **PHẦN II** | True/False cluster — each question has **4 sub-items a) b) c) d)**, each independently Đúng/Sai | 4 booleans per question | 4 questions |
| **PHẦN III** | Short answer — student writes a numeric/short value | a short string ("1260", "1,04", "96,5") | 6 questions |

Two hard facts break the v2.0 model:

1. **Question numbers restart per part.** "Câu 1" exists three times in one exam (once per part). The v2.0 join key is a flat `number` (`Map<number, ExtractedAnswer>` in `assembleExam.ts`), so answers and images for same-numbered questions in later parts **silently overwrite** earlier ones. This is deterministic data loss, observed in live testing 2026-07-17.
2. **Two of the three answer forms are unrepresentable.** v2.0 knows `mcq` (one A–D letter) and `essay` (free text). True/False-per-sub-item and short-answer have no valid encoding, so even a perfect AI read cannot be stored.

Because schools model their term/mock exams on the national structure, this is the **mainstream format** for the site's target users (THPT teachers/students), not an edge case. The old single-part format (mcq + essay) also remains common (lower grades, legacy exams, Ngữ văn essays) and must keep working unchanged.

**Product decision (owner, 2026-07-17): auto-scoring of the two new question types is a separate future feature.** This ADR covers capture → review → publish → display only; the new types follow the existing essay pattern ("stored, not auto-scored yet").

## Decision

Introduce **parts** as a first-class axis and **two new question types**, keeping the old format as the degenerate single-part case.

- **Composite identity.** A question is identified by `(part, number)` everywhere: extraction output, answer join, image map, DB row id, error messages. The v2.0 flat `number` join in `assembleExam` is replaced by a `${part}:${number}` composite key. Exams without printed part headers extract as `part = 1` — the old format needs no special-casing anywhere downstream.
- **Question type enum grows**: `'mcq' | 'essay' | 'true_false' | 'short_answer'`.
  - `true_false`: statements stored as sub-items `[{id:'a'|'b'|'c'|'d', text}]` (reusing the `choices` jsonb column); correct booleans stored in a **new server-only column `sub_answers` jsonb** (e.g. `{"a":true,"b":false,"c":false,"d":true}`) — never selected by the player query, same confinement discipline as `correct_answer`.
  - `short_answer`: the expected value from the answer file is stored in the existing `essay_answer` column (it is "the model answer as text"; a short numeric string is a degenerate case). No new column.
- **DB schema delta (idempotent)**: `questions.part_number int not null default 1`; widen `questions_type_check` to the 4 values; add `questions.sub_answers jsonb`; add `exams.parts jsonb` (nullable; `[{number, title}]` captured from the printed part headers for display grouping — null for single-part exams). Row id scheme for new uploads: `<examId>-p<part>q<n>` (old `<examId>-q<n>` rows remain valid; the id parser accepts both).
- **Extraction contract (amends ADR-0004)**: the question extractor returns `part` per question and the list of part headers; the answer extractor returns `(part, number, type-specific answer)` including the Đúng/Sai grid of PHẦN II answer tables and short-answer values. The single-call question+image principle of ADR-0004 is unchanged.
- **Display/scoring**: `true_false` and `short_answer` render in review, player, and result with real inputs (toggle Đ/S per sub-item; short text box) but are **not auto-scored** — labeled like essay. `computeScore` continues to score MCQ only; a task verifies it degrades gracefully when non-MCQ types are present.

### Decision Details

| Item | Content |
|------|---------|
| **Decision** | Parts as a first-class axis (`part_number`, composite join key, `exams.parts`); 4 question types; `sub_answers` server-only column; old format = single-part degenerate case; new types stored/displayed, not auto-scored. |
| **Why now** | The national 2025 format is the mainstream input for the target audience; live test showed deterministic answer loss (join-key collision) and unrepresentable answer forms. |
| **Why this** | Composite key removes the collision at its root instead of prompting the AI to renumber (which would corrupt the author's mental model of "Câu N in Phần II"). Reusing `choices`/`essay_answer` keeps the schema delta to 2 columns + 1 widened CHECK. Degenerate single-part case avoids a second code path for old exams. |
| **Known unknowns** | AI accuracy reading PHẦN II answer grids (matrix layout) — verified with real files in the QA task; per-part scoring weights are out of scope (future scoring feature). |
| **Kill criterion** | If assembly with the composite key still mis-joins on the official 2025 Toán fixture (1 exam code + its answer page), the model is wrong — stop and re-design before UI work. |

## Consequences

**Positive**: the national format and the old format flow through one pipeline; no silent overwrites; answer confinement discipline extends unchanged (`sub_answers` treated exactly like `correct_answer`).

**Negative**: touched surface is wide — types, schema, both extractors' prompts/schemas, assembler, actions/queries/fromRows, review editor, player renderer, result page. Mitigated by the degenerate-case design (old format exercises the same code) and by task-level regression fixtures.

**Neutral**: scoring for the new types is deferred by product decision; `PublicQuestion` must additionally omit `sub_answers`.

## Related Information

- Official format: [vqa.moet.gov.vn structure notice](https://vqa.moet.gov.vn/vi/news/savefile/thong-bao/cau-truc-dinh-dang-de-thi-tot-nghiep-thpt-tu-nam-2025-74.html), [moet.gov.vn announcement](https://moet.gov.vn/tintuc/Pages/tin-tong-hop.aspx?ItemID=8979)
- Live failure evidence: PROCESS.md §S#33 (2026-07-17 browser test — 22 answers vs 21 questions, 18 join errors, đề Toán TN THPT 2025)
- Code touchpoints: `SOURCE/lib/ugc/{types,assembleExam,extractQuestions,extractAnswers,fromRows}.ts`, `SOURCE/app/(layer4)/{actions,queries}.ts`, `SOURCE/app/(layer2)/queries.ts`, `SOURCE/supabase/schema.sql`, `SOURCE/types/question.ts`
