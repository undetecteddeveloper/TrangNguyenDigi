// UGC Exam Upload v2.1 — assembler THUẦN, AUTHORITATIVE (ADR-0004 + ADR-0005).
//
// Join câu hỏi với đáp án THEO DANH TÍNH COMPOSITE (part, number) — v2.1 sửa
// tận gốc bug ghi đè: đề chuẩn quốc gia 2025 đánh số câu LẠI TỪ 1 theo từng
// PHẦN, nên khoá join phẳng theo number làm "Câu 1" của Phần II/III đè lên
// Phần I. Đề cũ không chia phần = trường hợp suy biến part=1 (không code path
// riêng). mcq lấy correct_answer từ FILE ĐÁP ÁN (không bao giờ do AI suy
// luận); true_false lấy Đ/S từng ý; short_answer/essay lấy essay_answer; gắn
// hình theo cùng khoá composite; topic := subject của đề. Validate toàn bộ và
// trả về MỌI lỗi (không fail-fast) để ExtractionErrorPanel liệt kê đủ.
//
// Tách 2 tầng (Task 4.1):
//   - assembleExamLenient: join KHÔNG chặn — luôn dựng được AssembledExam kể cả
//     khi thiếu đáp án (correctAnswer/subAnswers/essayAnswer để undefined).
//     Dùng để persist bản nháp trạng thái 'failed' cho tác giả sửa trong S-03.
//   - validateAssembledExam: validate thuần trên AssembledExam — dùng chung bởi
//     assembleExam, publishExam (gate publish, AC-013/016) và màn review S-03.
//
// BẢO ĐẢM: giá trị persist LUÔN là kết quả assemble này — raw AI output không
// bao giờ được persist.

import { makeUgcError } from "./errorCopy";
import { LIMITS } from "./limits";
import type {
  AssembledExam,
  AssembledQuestion,
  ChoiceId,
  ExamMeta,
  ExtractedAnswer,
  ExtractedPart,
  ExtractedQuestion,
  Result,
  SubAnswers,
  SubItemId,
  UgcError,
} from "./types";

const CHOICE_IDS: readonly ChoiceId[] = ["A", "B", "C", "D"];
const SUB_ITEM_IDS: readonly SubItemId[] = ["a", "b", "c", "d"];

/** Khoá join composite (ADR-0005) — dùng chung cho map đáp án VÀ map hình. */
export function qKey(part: number, number: number): string {
  return `${part}:${number}`;
}

/** Đúng 4 lựa chọn, id là đúng tập {A,B,C,D} (không trùng, không thiếu). */
function hasValidChoiceSet(
  choices: AssembledQuestion["choices"]
): choices is NonNullable<AssembledQuestion["choices"]> {
  if (!choices || choices.length !== 4) return false;
  const ids = new Set(choices.map((c) => c.id));
  return CHOICE_IDS.every((id) => ids.has(id));
}

/** 2–4 ý, id thuộc {a,b,c,d}, không trùng. */
function hasValidSubItemSet(
  subItems: AssembledQuestion["subItems"]
): subItems is NonNullable<AssembledQuestion["subItems"]> {
  if (!subItems) return false;
  if (subItems.length < LIMITS.MIN_SUB_ITEMS || subItems.length > LIMITS.MAX_SUB_ITEMS)
    return false;
  const ids = new Set(subItems.map((s) => s.id));
  return ids.size === subItems.length && subItems.every((s) => SUB_ITEM_IDS.includes(s.id));
}

/** Đề có chia phần không — quyết định nhãn lỗi "Phần P Câu N" vs "Câu N". */
function isMultiPart(parts: ExtractedPart[], questions: { part: number }[]): boolean {
  return parts.length > 0 || questions.some((q) => q.part !== 1);
}

/**
 * Join lenient: LUÔN dựng AssembledExam (câu thiếu đáp án giữ undefined),
 * kèm lỗi cấp join (ANSWER_COUNT_MISMATCH). Không validate nội dung từng câu —
 * việc đó thuộc validateAssembledExam.
 */
export function assembleExamLenient(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
  images: Map<string, string>,
  meta: ExamMeta,
  parts: ExtractedPart[] = []
): { exam: AssembledExam; joinErrors: UgcError[] } {
  const joinErrors: UgcError[] = [];

  const answerByKey = new Map<string, ExtractedAnswer>();
  for (const a of answers) answerByKey.set(qKey(a.part, a.number), a);
  const questionKeys = new Set(questions.map((q) => qKey(q.part, q.number)));
  // "unmatched" = đáp án không trỏ tới câu hỏi nào + câu hỏi không có đáp án.
  const orphanAnswers = answers.filter((a) => !questionKeys.has(qKey(a.part, a.number)));
  const unanswered = questions.filter((q) => !answerByKey.has(qKey(q.part, q.number)));
  if (answers.length !== questions.length) {
    joinErrors.push(
      makeUgcError("ANSWER_COUNT_MISMATCH", null, {
        answerCount: answers.length,
        questionCount: questions.length,
        unmatchedCount: orphanAnswers.length + unanswered.length,
      })
    );
  }

  const assembled: AssembledQuestion[] = [];
  const sorted = [...questions].sort((a, b) => a.part - b.part || a.number - b.number);
  for (const q of sorted) {
    const answer = answerByKey.get(qKey(q.part, q.number));

    let correctAnswer: ChoiceId | undefined;
    let subAnswers: SubAnswers | undefined;
    let essayAnswer: string | undefined;
    // Đáp án phải ĐÚNG LOẠI với câu hỏi — file đáp án đưa sai dạng (vd. text
    // tự luận cho câu mcq) thì coi như thiếu (validate sẽ báo ANSWER_MISSING).
    if (q.type === "mcq") {
      if (answer && answer.type === "mcq") correctAnswer = answer.letter;
    } else if (q.type === "true_false") {
      if (answer && answer.type === "true_false" && answer.values.length > 0) {
        subAnswers = {};
        for (const v of answer.values) subAnswers[v.id] = v.value;
      }
    } else if (q.type === "short_answer") {
      if (answer && answer.type === "short_answer" && answer.value.trim().length > 0) {
        essayAnswer = answer.value;
      }
    } else {
      if (answer && answer.type === "essay" && answer.text.trim().length > 0) {
        essayAnswer = answer.text;
      }
    }

    assembled.push({
      part: q.part,
      number: q.number,
      type: q.type,
      stem: q.stem,
      choices: q.type === "mcq" ? q.choices : undefined,
      subItems: q.type === "true_false" ? q.subItems : undefined,
      correctAnswer,
      subAnswers,
      essayAnswer,
      imageUrl: images.get(qKey(q.part, q.number)),
      topic: meta.subject, // ADR-0004: topic mặc định = môn học
    });
  }

  return { exam: { meta, parts, questions: assembled }, joinErrors };
}

/**
 * Validate thuần trên AssembledExam — trả về MỌI lỗi (rỗng = sạch, đủ điều
 * kiện publish). Dùng bởi assembleExam, publishExam và màn review S-03.
 */
export function validateAssembledExam(exam: AssembledExam): UgcError[] {
  const errors: UgcError[] = [];

  if (exam.questions.length < LIMITS.MIN_QUESTIONS) {
    return [makeUgcError("NO_QUESTIONS_FOUND", null)];
  }
  if (exam.questions.length > LIMITS.MAX_QUESTIONS) {
    return [makeUgcError("TOO_MANY_QUESTIONS", null)];
  }

  // Đề 1 phần giữ nhãn "Câu N" như v2.0; đề nhiều phần → "Phần P Câu N".
  const multiPart = isMultiPart(exam.parts, exam.questions);

  for (const q of exam.questions) {
    const n = q.number;
    const partNumber = multiPart ? q.part : undefined;

    if (q.stem.trim().length === 0) {
      errors.push(makeUgcError("EMPTY_STEM", n, { partNumber }));
    } else if (q.stem.length > LIMITS.MAX_STEM) {
      errors.push(makeUgcError("STEM_TOO_LONG", n, { partNumber }));
    }

    if (q.type === "mcq") {
      const choiceCount = q.choices?.length ?? 0;
      if (!hasValidChoiceSet(q.choices)) {
        errors.push(makeUgcError("WRONG_CHOICE_COUNT", n, { partNumber, choiceCount }));
      } else {
        for (const c of q.choices) {
          if (c.text.trim().length === 0) {
            errors.push(makeUgcError("EMPTY_CHOICE", n, { partNumber, choiceLabel: c.id }));
          } else if (c.text.length > LIMITS.MAX_CHOICE) {
            errors.push(makeUgcError("CHOICE_TOO_LONG", n, { partNumber, choiceLabel: c.id }));
          }
        }
      }
      if (!q.correctAnswer) {
        errors.push(makeUgcError("ANSWER_MISSING", n, { partNumber }));
      }
    } else if (q.type === "true_false") {
      const subItemCount = q.subItems?.length ?? 0;
      if (!hasValidSubItemSet(q.subItems)) {
        errors.push(makeUgcError("WRONG_SUB_ITEM_COUNT", n, { partNumber, subItemCount }));
      } else {
        for (const s of q.subItems) {
          if (s.text.trim().length === 0) {
            errors.push(makeUgcError("EMPTY_CHOICE", n, { partNumber, choiceLabel: s.id }));
          } else if (s.text.length > LIMITS.MAX_CHOICE) {
            errors.push(makeUgcError("CHOICE_TOO_LONG", n, { partNumber, choiceLabel: s.id }));
          }
        }
        // Mỗi ý phải có đáp án Đ/S từ file đáp án (publish-clean).
        const missing = q.subItems.some((s) => typeof q.subAnswers?.[s.id] !== "boolean");
        if (missing) {
          errors.push(makeUgcError("ANSWER_MISSING", n, { partNumber }));
        }
      }
    } else if (q.type === "short_answer") {
      if (!q.essayAnswer || q.essayAnswer.trim().length === 0) {
        errors.push(makeUgcError("ANSWER_MISSING", n, { partNumber }));
      } else if (q.essayAnswer.length > LIMITS.MAX_SHORT_ANSWER) {
        errors.push(makeUgcError("SHORT_ANSWER_TOO_LONG", n, { partNumber }));
      }
    } else {
      if (!q.essayAnswer || q.essayAnswer.trim().length === 0) {
        errors.push(makeUgcError("ANSWER_MISSING", n, { partNumber }));
      } else if (q.essayAnswer.length > LIMITS.MAX_ESSAY_ANSWER) {
        errors.push(makeUgcError("ESSAY_ANSWER_TOO_LONG", n, { partNumber }));
      }
    }
  }

  return errors;
}

/** Join + validate — hợp đồng gốc (Design Doc §Contracts). */
export function assembleExam(
  questions: ExtractedQuestion[],
  answers: ExtractedAnswer[],
  images: Map<string, string>,
  meta: ExamMeta,
  parts: ExtractedPart[] = []
): Result<AssembledExam> {
  // Lỗi cấp toàn file trả về MỘT MÌNH (khớp copy hướng dẫn re-upload).
  if (questions.length < LIMITS.MIN_QUESTIONS) {
    return { ok: false, errors: [makeUgcError("NO_QUESTIONS_FOUND", null)] };
  }
  if (questions.length > LIMITS.MAX_QUESTIONS) {
    return { ok: false, errors: [makeUgcError("TOO_MANY_QUESTIONS", null)] };
  }

  const { exam, joinErrors } = assembleExamLenient(questions, answers, images, meta, parts);
  const errors = [...joinErrors, ...validateAssembledExam(exam)];

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: exam };
}
