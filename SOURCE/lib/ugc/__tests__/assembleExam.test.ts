// Fixtures cho assembleExam (Task 2.1) — proof obligations:
//   metric 2: answer fidelity — đáp án ra đúng y file đáp án;
//   metric 4: image mapping — hình gắn đúng câu, chỉ câu đó;
//   mỗi error code trả literal code + questionNumber; boundary tại limit.

import { describe, expect, it } from "vitest";
import { assembleExam } from "../assembleExam";
import { LIMITS } from "../limits";
import type {
  ChoiceId,
  ExamMeta,
  ExtractedAnswer,
  ExtractedQuestion,
} from "../types";

const META: ExamMeta = {
  title: "Đề kiểm tra Toán",
  subject: "Toán",
  grade: 10,
  durationMinutes: 45,
};

function mcq(number: number, overrides: Partial<ExtractedQuestion> = {}): ExtractedQuestion {
  return {
    part: 1,
    number,
    type: "mcq",
    stem: `Câu ${number}: 1 + ${number} = ?`,
    choices: (["A", "B", "C", "D"] as ChoiceId[]).map((id, i) => ({
      id,
      text: `${number + i}`,
    })),
    ...overrides,
  };
}

function mcqAnswer(number: number, letter: ChoiceId): ExtractedAnswer {
  return { part: 1, number, type: "mcq", letter };
}

function errorTuples(result: ReturnType<typeof assembleExam>) {
  if (result.ok) throw new Error("expected errors");
  return result.errors.map((e) => [e.code, e.questionNumber]);
}

describe("assembleExam — answer fidelity (metric 2)", () => {
  it("tái tạo chính xác answer map từ file đáp án, không suy luận", () => {
    const questions = [mcq(1), mcq(2), { ...mcq(3), type: "essay" as const, choices: undefined }];
    const answers: ExtractedAnswer[] = [
      mcqAnswer(1, "B"),
      mcqAnswer(2, "D"),
      { part: 1, number: 3, type: "essay", text: "Chứng minh bằng quy nạp." },
    ];
    const result = assembleExam(questions, answers, new Map(), META);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const byNumber = new Map(result.value.questions.map((q) => [q.number, q]));
    expect(byNumber.get(1)?.correctAnswer).toBe("B");
    expect(byNumber.get(2)?.correctAnswer).toBe("D");
    expect(byNumber.get(2)?.essayAnswer).toBeUndefined();
    expect(byNumber.get(3)?.essayAnswer).toBe("Chứng minh bằng quy nạp.");
    expect(byNumber.get(3)?.correctAnswer).toBeUndefined();
  });

  it("topic mặc định = subject cho mọi câu (ADR-0004)", () => {
    const result = assembleExam([mcq(1)], [mcqAnswer(1, "A")], new Map(), META);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.questions.every((q) => q.topic === "Toán")).toBe(true);
  });

  it("sắp xếp câu theo số tăng dần", () => {
    const result = assembleExam(
      [mcq(2), mcq(1)],
      [mcqAnswer(1, "A"), mcqAnswer(2, "C")],
      new Map(),
      META,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.questions.map((q) => q.number)).toEqual([1, 2]);
  });
});

describe("assembleExam — image mapping (metric 4)", () => {
  it("hình của Câu 5 gắn vào ĐÚNG Câu 5, các câu khác không có hình", () => {
    const questions = [1, 2, 3, 4, 5].map((n) => mcq(n));
    const answers = [1, 2, 3, 4, 5].map((n) => mcqAnswer(n, "A"));
    const images = new Map([["1:5", "https://storage.example/exam-images/e1/q5.png"]]);
    const result = assembleExam(questions, answers, images, META);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const q of result.value.questions) {
      if (q.number === 5)
        expect(q.imageUrl).toBe("https://storage.example/exam-images/e1/q5.png");
      else expect(q.imageUrl).toBeUndefined();
    }
  });
});

describe("assembleExam — error codes (literal code + questionNumber)", () => {
  it("NO_QUESTIONS_FOUND khi không có câu hỏi", () => {
    const result = assembleExam([], [], new Map(), META);
    expect(errorTuples(result)).toEqual([["NO_QUESTIONS_FOUND", null]]);
  });

  it("TOO_MANY_QUESTIONS khi vượt MAX_QUESTIONS (boundary: MAX pass, MAX+1 fail)", () => {
    const atLimit = Array.from({ length: LIMITS.MAX_QUESTIONS }, (_, i) => mcq(i + 1));
    const atLimitAnswers = atLimit.map((q) => mcqAnswer(q.number, "A"));
    expect(assembleExam(atLimit, atLimitAnswers, new Map(), META).ok).toBe(true);

    const overLimit = Array.from(
      { length: LIMITS.MAX_QUESTIONS + 1 },
      (_, i) => mcq(i + 1),
    );
    const result = assembleExam(overLimit, [], new Map(), META);
    expect(errorTuples(result)).toEqual([["TOO_MANY_QUESTIONS", null]]);
  });

  it("WRONG_CHOICE_COUNT khi mcq không có đúng 4 lựa chọn A–D", () => {
    const bad = mcq(2, { choices: mcq(2).choices!.slice(0, 3) });
    const result = assembleExam(
      [mcq(1), bad],
      [mcqAnswer(1, "A"), mcqAnswer(2, "A")],
      new Map(),
      META,
    );
    expect(errorTuples(result)).toContainEqual(["WRONG_CHOICE_COUNT", 2]);
  });

  it("WRONG_CHOICE_COUNT khi id lựa chọn trùng nhau (4 phần tử nhưng không đủ A–D)", () => {
    const dup = mcq(1);
    dup.choices = [
      { id: "A", text: "1" },
      { id: "A", text: "2" },
      { id: "C", text: "3" },
      { id: "D", text: "4" },
    ];
    const result = assembleExam([dup], [mcqAnswer(1, "A")], new Map(), META);
    expect(errorTuples(result)).toContainEqual(["WRONG_CHOICE_COUNT", 1]);
  });

  it("EMPTY_STEM khi nội dung câu trống", () => {
    const result = assembleExam(
      [mcq(1, { stem: "   " })],
      [mcqAnswer(1, "A")],
      new Map(),
      META,
    );
    expect(errorTuples(result)).toContainEqual(["EMPTY_STEM", 1]);
  });

  it("EMPTY_CHOICE khi một lựa chọn trống (kèm nhãn trong message)", () => {
    const q = mcq(3);
    q.choices![1] = { id: "B", text: "" };
    const result = assembleExam([q], [mcqAnswer(3, "A")], new Map(), META);
    expect(errorTuples(result)).toContainEqual(["EMPTY_CHOICE", 3]);
    if (!result.ok) {
      const err = result.errors.find((e) => e.code === "EMPTY_CHOICE");
      expect(err?.message).toContain("choice B");
    }
  });

  it("ANSWER_COUNT_MISMATCH khi số đáp án khác số câu hỏi", () => {
    const result = assembleExam(
      [mcq(1), mcq(2)],
      [mcqAnswer(1, "A"), mcqAnswer(2, "B"), mcqAnswer(9, "C")],
      new Map(),
      META,
    );
    expect(errorTuples(result)).toContainEqual(["ANSWER_COUNT_MISMATCH", null]);
  });

  it("ANSWER_MISSING cho câu không có đáp án trong file", () => {
    const result = assembleExam(
      [mcq(1), mcq(2)],
      [mcqAnswer(1, "A"), mcqAnswer(9, "C")], // câu 2 thiếu; số lượng vẫn khớp
      new Map(),
      META,
    );
    expect(errorTuples(result)).toContainEqual(["ANSWER_MISSING", 2]);
  });

  it("ANSWER_MISSING khi loại đáp án không khớp loại câu (essay text cho mcq)", () => {
    const result = assembleExam(
      [mcq(1)],
      [{ part: 1, number: 1, type: "essay", text: "tự luận" }],
      new Map(),
      META,
    );
    expect(errorTuples(result)).toContainEqual(["ANSWER_MISSING", 1]);
  });

  it("STEM_TOO_LONG: đúng MAX_STEM pass, MAX_STEM+1 fail", () => {
    const atLimit = mcq(1, { stem: "x".repeat(LIMITS.MAX_STEM) });
    expect(assembleExam([atLimit], [mcqAnswer(1, "A")], new Map(), META).ok).toBe(true);

    const over = mcq(1, { stem: "x".repeat(LIMITS.MAX_STEM + 1) });
    const result = assembleExam([over], [mcqAnswer(1, "A")], new Map(), META);
    expect(errorTuples(result)).toContainEqual(["STEM_TOO_LONG", 1]);
  });

  it("CHOICE_TOO_LONG: đúng MAX_CHOICE pass, MAX_CHOICE+1 fail", () => {
    const atLimit = mcq(1);
    atLimit.choices![0] = { id: "A", text: "y".repeat(LIMITS.MAX_CHOICE) };
    expect(assembleExam([atLimit], [mcqAnswer(1, "A")], new Map(), META).ok).toBe(true);

    const over = mcq(1);
    over.choices![0] = { id: "A", text: "y".repeat(LIMITS.MAX_CHOICE + 1) };
    const result = assembleExam([over], [mcqAnswer(1, "A")], new Map(), META);
    expect(errorTuples(result)).toContainEqual(["CHOICE_TOO_LONG", 1]);
  });

  it("ESSAY_ANSWER_TOO_LONG: đúng MAX_ESSAY_ANSWER pass, +1 fail", () => {
    const essay: ExtractedQuestion = {
      part: 1,
      number: 1,
      type: "essay",
      stem: "Chứng minh định lý.",
    };
    const atLimit = assembleExam(
      [essay],
      [{ part: 1, number: 1, type: "essay", text: "z".repeat(LIMITS.MAX_ESSAY_ANSWER) }],
      new Map(),
      META,
    );
    expect(atLimit.ok).toBe(true);

    const over = assembleExam(
      [essay],
      [{ part: 1, number: 1, type: "essay", text: "z".repeat(LIMITS.MAX_ESSAY_ANSWER + 1) }],
      new Map(),
      META,
    );
    expect(errorTuples(over)).toContainEqual(["ESSAY_ANSWER_TOO_LONG", 1]);
  });

  it("gom NHIỀU lỗi trong một lần assemble (không fail-fast)", () => {
    const result = assembleExam(
      [mcq(1, { stem: "" }), mcq(2, { choices: [] })],
      [mcqAnswer(1, "A")],
      new Map(),
      META,
    );
    const tuples = errorTuples(result);
    expect(tuples).toContainEqual(["EMPTY_STEM", 1]);
    expect(tuples).toContainEqual(["WRONG_CHOICE_COUNT", 2]);
    expect(tuples).toContainEqual(["ANSWER_MISSING", 2]);
    expect(tuples).toContainEqual(["ANSWER_COUNT_MISMATCH", null]);
  });
});

// ---------------------------------------------------------------------------
// v2.1 GATE C (ADR-0005) — khoá join composite (part, number) + 2 dạng câu mới.
// ---------------------------------------------------------------------------

/** Câu true_false chuẩn PHẦN II — 4 ý a–d. */
function tf(part: number, number: number): ExtractedQuestion {
  return {
    part,
    number,
    type: "true_false",
    stem: `Cho hàm số f(x) — xét các mệnh đề sau.`,
    subItems: (["a", "b", "c", "d"] as const).map((id) => ({
      id,
      text: `mệnh đề ${id})`,
    })),
  };
}

/** Câu short_answer chuẩn PHẦN III. */
function shortQ(part: number, number: number): ExtractedQuestion {
  return { part, number, type: "short_answer", stem: `Tính giá trị biểu thức số ${number}.` };
}

const PARTS_2025 = [
  { number: 1, title: "PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn" },
  { number: 2, title: "PHẦN II. Câu trắc nghiệm đúng sai" },
  { number: 3, title: "PHẦN III. Câu trắc nghiệm trả lời ngắn" },
];

describe("v2.1 GATE C — composite join (part, number): zero cross-part overwrites (AC-030)", () => {
  it("'Câu 1' ở cả 3 phần giữ đáp án + hình RIÊNG, không đè nhau", () => {
    const questions: ExtractedQuestion[] = [
      { ...mcq(1), part: 1 },
      tf(2, 1),
      shortQ(3, 1),
    ];
    const answers: ExtractedAnswer[] = [
      { part: 1, number: 1, type: "mcq", letter: "C" },
      {
        part: 2,
        number: 1,
        type: "true_false",
        values: [
          { id: "a", value: true },
          { id: "b", value: false },
          { id: "c", value: false },
          { id: "d", value: false },
        ],
      },
      { part: 3, number: 1, type: "short_answer", value: "1260" },
    ];
    const images = new Map([["1:1", "https://storage.example/exam-images/e1/p1q1.png"]]);

    const result = assembleExam(questions, answers, images, META, PARTS_2025);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const byKey = new Map(result.value.questions.map((q) => [`${q.part}:${q.number}`, q]));
    // Phần I Câu 1: mcq — đáp án C, CÓ hình.
    expect(byKey.get("1:1")?.correctAnswer).toBe("C");
    expect(byKey.get("1:1")?.imageUrl).toBe("https://storage.example/exam-images/e1/p1q1.png");
    // Phần II Câu 1: true_false — Đ/S đúng theo lưới, KHÔNG bị đè bởi phần khác.
    expect(byKey.get("2:1")?.subAnswers).toEqual({ a: true, b: false, c: false, d: false });
    expect(byKey.get("2:1")?.correctAnswer).toBeUndefined();
    expect(byKey.get("2:1")?.imageUrl).toBeUndefined();
    // Phần III Câu 1: short_answer — giá trị từ file đáp án (cột essayAnswer).
    expect(byKey.get("3:1")?.essayAnswer).toBe("1260");
    expect(result.value.parts).toEqual(PARTS_2025);
  });

  it("đề cấu trúc 2025 thu nhỏ (2 mcq + 1 TF + 2 short, số câu lặp giữa phần) join sạch", () => {
    const questions: ExtractedQuestion[] = [
      { ...mcq(1), part: 1 },
      { ...mcq(2), part: 1 },
      tf(2, 1),
      shortQ(3, 1),
      shortQ(3, 2),
    ];
    const answers: ExtractedAnswer[] = [
      { part: 1, number: 1, type: "mcq", letter: "A" },
      { part: 1, number: 2, type: "mcq", letter: "D" },
      {
        part: 2,
        number: 1,
        type: "true_false",
        values: [
          { id: "a", value: true },
          { id: "b", value: true },
          { id: "c", value: false },
          { id: "d", value: true },
        ],
      },
      { part: 3, number: 1, type: "short_answer", value: "1,04" },
      { part: 3, number: 2, type: "short_answer", value: "96,5" },
    ];
    const result = assembleExam(questions, answers, new Map(), META, PARTS_2025);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // Thứ tự: sort theo (part, number).
    expect(result.value.questions.map((q) => `${q.part}:${q.number}`)).toEqual([
      "1:1",
      "1:2",
      "2:1",
      "3:1",
      "3:2",
    ]);
  });

  it("nhãn lỗi mang 'Phần P Câu N' với đề nhiều phần; partNumber trên UgcError", () => {
    // TF thiếu đáp án ý d → ANSWER_MISSING tại (2, 1).
    const answers: ExtractedAnswer[] = [
      {
        part: 2,
        number: 1,
        type: "true_false",
        values: [
          { id: "a", value: true },
          { id: "b", value: false },
          { id: "c", value: true },
        ],
      },
    ];
    const result = assembleExam([tf(2, 1)], answers, new Map(), META, PARTS_2025);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const err = result.errors.find((e) => e.code === "ANSWER_MISSING");
    expect(err?.partNumber).toBe(2);
    expect(err?.questionNumber).toBe(1);
    expect(err?.message).toContain("Phần 2 Câu 1");
  });

  it("đề 1 phần giữ nhãn 'Câu N' như v2.0 (không có 'Phần')", () => {
    const result = assembleExam([mcq(1, { stem: "" })], [mcqAnswer(1, "A")], new Map(), META);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const err = result.errors.find((e) => e.code === "EMPTY_STEM");
    expect(err?.partNumber).toBeNull();
    expect(err?.message).toContain("Câu 1");
    expect(err?.message).not.toContain("Phần");
  });
});

describe("v2.1 — validate true_false (AC-031)", () => {
  const tfAnswer = (values: { id: "a" | "b" | "c" | "d"; value: boolean }[]): ExtractedAnswer => ({
    part: 2,
    number: 1,
    type: "true_false",
    values,
  });
  const fullValues = (["a", "b", "c", "d"] as const).map((id) => ({ id, value: id === "a" }));

  it("TF đầy đủ 4 ý + 4 đáp án Đ/S → sạch", () => {
    const result = assembleExam([tf(2, 1)], [tfAnswer([...fullValues])], new Map(), META, PARTS_2025);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.questions[0].subAnswers).toEqual({
      a: true,
      b: false,
      c: false,
      d: false,
    });
  });

  it("WRONG_SUB_ITEM_COUNT khi ít hơn MIN_SUB_ITEMS ý", () => {
    const bad = { ...tf(2, 1), subItems: tf(2, 1).subItems!.slice(0, 1) };
    const result = assembleExam([bad], [tfAnswer([...fullValues])], new Map(), META, PARTS_2025);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.map((e) => [e.code, e.partNumber, e.questionNumber])).toContainEqual([
      "WRONG_SUB_ITEM_COUNT",
      2,
      1,
    ]);
  });

  it("WRONG_SUB_ITEM_COUNT khi id ý trùng nhau", () => {
    const bad = {
      ...tf(2, 1),
      subItems: [
        { id: "a" as const, text: "x" },
        { id: "a" as const, text: "y" },
        { id: "c" as const, text: "z" },
        { id: "d" as const, text: "w" },
      ],
    };
    const result = assembleExam([bad], [tfAnswer([...fullValues])], new Map(), META, PARTS_2025);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.code === "WRONG_SUB_ITEM_COUNT")).toBe(true);
  });

  it("ANSWER_MISSING khi một ý không có đáp án Đ/S", () => {
    const result = assembleExam(
      [tf(2, 1)],
      [tfAnswer(fullValues.slice(0, 3))],
      new Map(),
      META,
      PARTS_2025,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.code === "ANSWER_MISSING")).toBe(true);
  });

  it("ANSWER_MISSING khi đáp án sai LOẠI (mcq letter cho câu TF)", () => {
    const result = assembleExam(
      [tf(2, 1)],
      [{ part: 2, number: 1, type: "mcq", letter: "A" }],
      new Map(),
      META,
      PARTS_2025,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.code === "ANSWER_MISSING")).toBe(true);
  });
});

describe("v2.1 — validate short_answer (AC-032)", () => {
  it("giá trị hợp lệ (kể cả số thập phân kiểu VN '1,04') → sạch, lưu ở essayAnswer", () => {
    const result = assembleExam(
      [shortQ(3, 1)],
      [{ part: 3, number: 1, type: "short_answer", value: "1,04" }],
      new Map(),
      META,
      PARTS_2025,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.questions[0].essayAnswer).toBe("1,04");
  });

  it("SHORT_ANSWER_TOO_LONG: đúng MAX_SHORT_ANSWER pass, +1 fail", () => {
    const at = assembleExam(
      [shortQ(3, 1)],
      [{ part: 3, number: 1, type: "short_answer", value: "9".repeat(LIMITS.MAX_SHORT_ANSWER) }],
      new Map(),
      META,
      PARTS_2025,
    );
    expect(at.ok).toBe(true);

    const over = assembleExam(
      [shortQ(3, 1)],
      [
        {
          part: 3,
          number: 1,
          type: "short_answer",
          value: "9".repeat(LIMITS.MAX_SHORT_ANSWER + 1),
        },
      ],
      new Map(),
      META,
      PARTS_2025,
    );
    expect(over.ok).toBe(false);
    if (over.ok) return;
    expect(over.errors.some((e) => e.code === "SHORT_ANSWER_TOO_LONG")).toBe(true);
  });

  it("ANSWER_MISSING khi thiếu giá trị", () => {
    const result = assembleExam([shortQ(3, 1)], [], new Map(), META, PARTS_2025);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.code === "ANSWER_MISSING")).toBe(true);
  });
});
