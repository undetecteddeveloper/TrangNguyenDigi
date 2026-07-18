# Task 6.4 — S-03 Review & edit + Publish

**Phase**: 6 · **Depends on**: 4.1, 4.2, 3.2 · **Type**: Implementation

## Goal
Build `/me/exams/[id]` (the review-&-edit surface) per UI Spec S-03: `ReviewScreen` (metadata summary + StatusBadge), `ExtractionErrorPanel` (per-`Câu N` + whole-file errors from assembly, `role="alert"`, links to the affected card), `AssembledQuestionList` (per-question card: plain-text stem, **QuestionFigure** for the image, choices A–D, correct answer captioned "from your answer file"; essay → model answer read-only + "Essay — stored, not auto-scored yet"), `QuestionEditor` (in-place edit of stem/choices/correct answer/image add-replace-remove/essay; re-validates), `PublishBar` (Publish disabled until clean+reviewed; Save changes for a published exam; Delete). Guard: non-owner/missing → redirect `/me/exams`. Publish → `/me/exams?published=1`.

## Files
New: `SOURCE/app/(layer4)/me/exams/[id]/page.tsx` + `_components/{ReviewScreen,ExtractionErrorPanel,AssembledQuestionList,QuestionEditor,PublishBar}.tsx`, `loading.tsx`. Reuses `QuestionFigure` (Task 3.2), `DeleteDialog` (Task 6.3).

## ACs / metrics
AC-013/014/015/016/017/018; images AC-010/011/023.

## Verification / Acceptance
Golden states 3 (clean MCQ with image + "from your answer file"), 4 (errors + Publish disabled), 5 (essay). Editing a mis-read choice re-validates and enables Publish; the cropped figure shows on its question; Publish persists `published` and redirects; editing a published exam saves field changes.

## References
UI Spec §ReviewScreen/ExtractionErrorPanel/AssembledQuestionList/QuestionEditor/PublishBar, D4/D5/D6/D12; Design Doc §Data Contracts (saveExam/publishExam).
