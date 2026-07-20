// UGC Exam Upload v2.1 — map UgcErrorCode → copy cho ExtractionErrorPanel
// (Design Doc §Error-code → review-panel copy + §v2.1). Message bake sẵn vào
// UgcError để UI chỉ việc hiển thị. v2.1: nhãn câu nhận biết PHẦN — caller
// truyền partNumber CHỈ với đề nhiều phần (đề 1 phần giữ nguyên "Câu N").

import { LIMITS } from "./limits";
import type { MetaFieldName, UgcError, UgcErrorCode } from "./types";

/** Tham số tuỳ code — chỉ dùng field liên quan. */
export type UgcErrorParams = {
  /** Phần chứa câu lỗi — CHỈ truyền với đề nhiều phần (nhãn "Phần P Câu N");
   * bỏ qua với đề 1 phần (nhãn "Câu N" như v2.0). */
  partNumber?: number;
  /** WRONG_CHOICE_COUNT: số lựa chọn đọc được. */
  choiceCount?: number;
  /** WRONG_SUB_ITEM_COUNT: số ý đọc được. */
  subItemCount?: number;
  /** EMPTY_CHOICE / CHOICE_TOO_LONG: nhãn lựa chọn (A–D). */
  choiceLabel?: string;
  /** ANSWER_COUNT_MISMATCH: số đáp án / số câu hỏi / số không khớp. */
  answerCount?: number;
  questionCount?: number;
  unmatchedCount?: number;
  /** META_INCOMPLETE / META_INVALID: field metadata bị lỗi (v2.2, ADR-0007). */
  field?: MetaFieldName;
};

/** Nhãn hiển thị của field metadata trong copy lỗi META_*. */
const META_FIELD_LABELS: Record<MetaFieldName, string> = {
  title: "the title",
  subject: "the subject",
  grade: "the grade",
  durationMinutes: "the duration",
  school: "the school",
  schoolYear: "the school year",
  semester: "the semester",
};

/** Khoảng hợp lệ để copy META_INVALID nêu đích danh giới hạn. */
const META_FIELD_RANGES: Partial<Record<MetaFieldName, string>> = {
  grade: `${LIMITS.MIN_GRADE}–${LIMITS.MAX_GRADE}`,
  durationMinutes: `${LIMITS.MIN_DURATION}–${LIMITS.MAX_DURATION} minutes`,
  schoolYear: `${LIMITS.MIN_YEAR}–${LIMITS.MAX_YEAR}`,
};

/** Nhãn định danh câu: "Phần 2 Câu 3" (đề nhiều phần) hoặc "Câu 3". */
function label(n: number | null, part: number | undefined): string {
  return part != null ? `Phần ${part} Câu ${n}` : `Câu ${n}`;
}

function message(
  code: UgcErrorCode,
  n: number | null,
  p: UgcErrorParams,
): string {
  const q = label(n, p.partNumber);
  switch (code) {
    case "NO_QUESTIONS_FOUND":
      return "No questions were recognized in the question file. Re-upload a clearer file.";
    case "TOO_MANY_QUESTIONS":
      return `Too many questions — an exam can have at most ${LIMITS.MAX_QUESTIONS}.`;
    case "WRONG_CHOICE_COUNT":
      return `${q} — ${p.choiceCount ?? 0} choices were read; an MCQ needs exactly 4 (A–D). Edit below or re-upload.`;
    case "EMPTY_STEM":
      return `${q} — the question text is empty; add it below.`;
    case "EMPTY_CHOICE":
      return `${q} — choice ${p.choiceLabel ?? "?"} is empty.`;
    case "ANSWER_COUNT_MISMATCH":
      return `The answer file has ${p.answerCount ?? 0} answers but the question file has ${p.questionCount ?? 0} questions (${p.unmatchedCount ?? 0} unmatched).`;
    case "ANSWER_MISSING":
      return `${q} — no answer found in your answer file. Add it to the file or set it below.`;
    case "IMAGE_CROP_FAILED":
      return `${q} — the image couldn't be cropped. Re-upload the file or remove the image.`;
    case "EXTRACTION_FAILED":
      return "Couldn't read your files right now. Please try again.";
    case "FILE_TOO_LARGE":
      return `That file is too large (max ${Math.round(LIMITS.MAX_FILE_BYTES / (1024 * 1024))} MB).`;
    case "TOO_MANY_PAGES":
      return `That file has too many pages (max ${LIMITS.MAX_PDF_PAGES}).`;
    case "STEM_TOO_LONG":
      return `${q} — the question text is too long (max ${LIMITS.MAX_STEM} characters).`;
    case "CHOICE_TOO_LONG":
      return `${q} — choice ${p.choiceLabel ?? "?"} is too long (max ${LIMITS.MAX_CHOICE} characters).`;
    case "ESSAY_ANSWER_TOO_LONG":
      return `${q} — the model answer is too long (max ${LIMITS.MAX_ESSAY_ANSWER} characters).`;
    case "WRONG_SUB_ITEM_COUNT":
      return `${q} — ${p.subItemCount ?? 0} sub-items were read; a true/false question needs ${LIMITS.MIN_SUB_ITEMS}–${LIMITS.MAX_SUB_ITEMS} items (a–d). Edit below or re-upload.`;
    case "SHORT_ANSWER_TOO_LONG":
      return `${q} — the expected answer is too long (max ${LIMITS.MAX_SHORT_ANSWER} characters).`;
    // v2.2 (ADR-0007) — lỗi metadata: sort TRÊN lỗi từng câu, link tới khối
    // metadata (không tới card câu).
    case "META_INCOMPLETE":
      return `Exam details — ${p.field ? META_FIELD_LABELS[p.field] : "a required field"} is missing. Add it above before publishing.`;
    case "META_INVALID": {
      const range = p.field ? META_FIELD_RANGES[p.field] : undefined;
      return `Exam details — ${p.field ? META_FIELD_LABELS[p.field] : "a field"} is out of range${range ? ` (${range})` : ""}. Correct it above.`;
    }
    case "META_EXTRACTION_FAILED":
      return "Exam details — we couldn't read the exam details from your file. Fill them in above.";
  }
}

/** Tạo UgcError với message đã bake. partNumber lấy từ params (null nếu không
 * truyền — lỗi toàn file hoặc đề 1 phần). */
export function makeUgcError(
  code: UgcErrorCode,
  questionNumber: number | null,
  params: UgcErrorParams = {},
): UgcError {
  return {
    code,
    questionNumber,
    partNumber: params.partNumber ?? null,
    message: message(code, questionNumber, params),
    ...(params.field !== undefined && { field: params.field }),
  };
}
