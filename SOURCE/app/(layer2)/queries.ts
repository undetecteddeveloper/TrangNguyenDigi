// Logic Layer 2 — Reads (GĐ 2 M2.5/M2.6). Server-only: dùng Supabase server client.
// Gọi từ Server Component. Thay getFakeExams/getFakeExam/getFakeQuestions của GĐ 1.
// Xem BACK-END-ARCHITECTURE-MAP.md Mục 4.2.
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { resolveSignedImageUrl } from "@/lib/ugc/imageUrl";
import type { Exam } from "@/types/exam";
import type { Choice, PublicQuestion } from "@/types/question";
import type { ScoreResult } from "@/types/result";

// --- Mappers (snake_case DB → camelCase type) ----------------------------

type ExamRow = {
  id: string;
  title: string;
  question_ids: string[];
  duration_minutes: number;
  subject: string;
  grade: number;
  school: string | null;
  school_year: number | null;
  semester: string | null;
  author_display_name: string | null;
  parts: { number: number; title: string }[] | null;
};

// Cột đề dùng chung cho mọi query exams (S#27: school/school_year/semester;
// UGC v2.0: author_display_name cho byline; v2.1: parts cho heading phần).
const EXAM_COLUMNS =
  "id, title, question_ids, duration_minutes, subject, grade, school, school_year, semester, author_display_name, parts";

function toExam(row: ExamRow): Exam {
  return {
    id: row.id,
    title: row.title,
    questionIds: row.question_ids,
    durationMinutes: row.duration_minutes,
    subject: row.subject,
    grade: row.grade,
    school: row.school ?? undefined,
    schoolYear: row.school_year ?? undefined,
    semester: row.semester ?? undefined,
    authorDisplayName: row.author_display_name ?? undefined,
    parts: row.parts ?? undefined,
  };
}

// --- Reads ----------------------------------------------------------------

/** Sort cho Exam Browser: theo created_at. "hardest" TẠM BỎ QUA (chờ rating). */
export type ExamSort = "newest" | "oldest";

export interface ExamFilters {
  subject?: string;
  grade?: number;
  school?: string;
  schoolYear?: number;
  semester?: string;
  sort?: ExamSort;
}

/** Đề cho Exam Browser, lọc tuỳ chọn theo môn/lớp/trường/niên khóa/học kỳ (S#27). */
export async function listExams(filters?: ExamFilters): Promise<Exam[]> {
  const supabase = await createClient();
  // R-7 guard (UGC v2.0): chỉ đề published vào catalog — dù RLS cho tác giả đọc
  // đề chưa published của mình, filter tường minh này chặn nó lọt vào browser.
  let query = supabase.from("exams").select(EXAM_COLUMNS).eq("status", "published");
  if (filters?.subject) query = query.eq("subject", filters.subject);
  if (filters?.grade !== undefined && !Number.isNaN(filters.grade)) {
    query = query.eq("grade", filters.grade);
  }
  if (filters?.school) query = query.eq("school", filters.school);
  if (filters?.schoolYear !== undefined && !Number.isNaN(filters.schoolYear)) {
    query = query.eq("school_year", filters.schoolYear);
  }
  if (filters?.semester) query = query.eq("semester", filters.semester);
  // Newest/Oldest theo created_at; mặc định giữ order id (ổn định như trước).
  if (filters?.sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (filters?.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("id");
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ExamRow[]).map(toExam);
}

/** Giá trị khả dụng để dựng bộ lọc (distinct, đã sort) — S#27 thêm school/year/semester. */
export async function listExamFacets(): Promise<{
  subjects: string[];
  grades: number[];
  schools: string[];
  years: number[];
  semesters: string[];
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("subject, grade, school, school_year, semester");
  if (error) throw error;
  const rows = data as unknown as {
    subject: string;
    grade: number;
    school: string | null;
    school_year: number | null;
    semester: string | null;
  }[];
  const subjects = [...new Set(rows.map((r) => r.subject))].sort((a, b) =>
    a.localeCompare(b, "vi")
  );
  const grades = [...new Set(rows.map((r) => r.grade))].sort((a, b) => a - b);
  const schools = [
    ...new Set(rows.map((r) => r.school).filter((s): s is string => s !== null)),
  ].sort((a, b) => a.localeCompare(b, "vi"));
  const years = [
    ...new Set(rows.map((r) => r.school_year).filter((y): y is number => y !== null)),
  ].sort((a, b) => b - a); // năm mới nhất lên đầu
  const semesters = [
    ...new Set(rows.map((r) => r.semester).filter((s): s is string => s !== null)),
  ].sort();
  return { subjects, grades, schools, years, semesters };
}

/** Một đề published theo id, hoặc null. R-7 guard: chỉ published (catalog/player). */
export async function getExam(id: string): Promise<Exam | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select(EXAM_COLUMNS)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? toExam(data as unknown as ExamRow) : null;
}

/**
 * Đề + danh sách câu hỏi cho Player — KHÔNG kèm `correctAnswer` (bảo mật).
 * Câu hỏi được sắp theo đúng thứ tự `questionIds`. null nếu đề không tồn tại.
 */
export async function getExamForPlayer(
  id: string
): Promise<{ exam: Exam; questions: PublicQuestion[] } | null> {
  const supabase = await createClient();
  const exam = await getExam(id);
  if (!exam) return null;

  // KHÔNG select correct_answer / essay_answer / sub_answers (đáp án — mọi
  // dạng đều server-only, kể cả Đ/S từng ý của true_false — v2.1 ADR-0005).
  // UGC v2.0: thêm question_type + image_url; v2.1: part_number (cột choices
  // với true_false chứa các Ý a–d — nội dung, an toàn để render).
  const { data, error } = await supabase
    .from("questions")
    .select("id, content, choices, subject, grade, topic, question_type, part_number, image_url")
    .in("id", exam.questionIds);
  if (error) throw error;

  const rows = data as Array<{
    id: string;
    content: string;
    choices: PublicQuestion["choices"];
    subject: string;
    grade: number;
    topic: string;
    question_type: string | null;
    part_number: number | null;
    image_url: string | null;
  }>;

  // Đổi image_url đã lưu → signed URL (bucket private) để player render được.
  const byId = new Map<string, PublicQuestion>();
  await Promise.all(
    rows.map(async (r) => {
      const questionType =
        (r.question_type as "mcq" | "essay" | "true_false" | "short_answer" | null) ?? "mcq";
      byId.set(r.id, {
        id: r.id,
        content: r.content,
        // true_false: cột choices chứa các ý a–d → map sang subItems.
        choices: questionType === "true_false" ? [] : r.choices,
        subItems:
          questionType === "true_false"
            ? (r.choices as unknown as PublicQuestion["subItems"])
            : undefined,
        subject: r.subject,
        grade: r.grade,
        topic: r.topic,
        questionType,
        partNumber: r.part_number ?? 1,
        imageUrl: await resolveSignedImageUrl(supabase, r.image_url),
      });
    })
  );
  const questions = exam.questionIds
    .map((qid) => byId.get(qid))
    .filter((q): q is PublicQuestion => q !== undefined);

  return { exam, questions };
}

// --- Result ---------------------------------------------------------------

type ResultRow = {
  total_score: number;
  correct: number;
  total: number;
  per_question: ScoreResult["perQuestion"];
  topic_breakdown: ScoreResult["topicBreakdown"];
};

/** Nội dung một câu để render màn Chi tiết (post-submit nên kèm được lựa chọn).
 * v2.1: kèm loại câu + đáp án lưu trữ của câu KHÔNG chấm (true_false/short/
 * essay) — màn Chi tiết là SAU KHI NỘP, xem được đáp án (như mcq đã hiển thị
 * correct từ per_question). subItems của true_false nằm trong cột choices. */
export type ResultQuestion = {
  content: string;
  choices: Choice[];
  questionType: "mcq" | "essay" | "true_false" | "short_answer";
  subItems?: { id: "a" | "b" | "c" | "d"; text: string }[];
  subAnswers?: Partial<Record<"a" | "b" | "c" | "d", boolean>>;
  essayAnswer?: string;
};

export type ExamResult = {
  examId: string;
  examTitle: string;
  result: ScoreResult;
  /** questionId → nội dung + lựa chọn (để render Chi tiết từng câu, Task 4). */
  questions: Record<string, ResultQuestion>;
};

/**
 * Kết quả của một attempt đã nộp. null nếu attempt không tồn tại / chưa nộp /
 * không thuộc về user (RLS lọc) → caller redirect về trang đề (Q2=A).
 */
export async function getResult(attemptId: string): Promise<ExamResult | null> {
  const supabase = await createClient();

  const { data: resultRow, error: resultErr } = await supabase
    .from("exam_results")
    .select("total_score, correct, total, per_question, topic_breakdown")
    .eq("attempt_id", attemptId)
    .maybeSingle();
  if (resultErr) throw resultErr;
  if (!resultRow) return null;

  const { data: attempt, error: attemptErr } = await supabase
    .from("exam_attempts")
    .select("exam_id")
    .eq("id", attemptId)
    .maybeSingle();
  if (attemptErr) throw attemptErr;
  if (!attempt) return null;

  const exam = await getExam(attempt.exam_id as string);
  if (!exam) return null;

  const row = resultRow as ResultRow;
  const result: ScoreResult = {
    totalScore: row.total_score,
    correct: row.correct,
    total: row.total,
    perQuestion: row.per_question,
    topicBreakdown: row.topic_breakdown,
  };

  // Nội dung + lựa chọn câu hỏi để render Chi tiết (post-submit nên hiển thị được).
  // v2.1: kèm question_type + đáp án lưu trữ cho câu không chấm (hiển thị sau nộp).
  const { data: qs, error: qErr } = await supabase
    .from("questions")
    .select("id, content, choices, question_type, sub_answers, essay_answer")
    .in(
      "id",
      result.perQuestion.map((p) => p.questionId)
    );
  if (qErr) throw qErr;
  const questions: Record<string, ResultQuestion> = {};
  for (const q of qs as Array<{
    id: string;
    content: string;
    choices: Choice[];
    question_type: ResultQuestion["questionType"] | null;
    sub_answers: ResultQuestion["subAnswers"] | null;
    essay_answer: string | null;
  }>) {
    const questionType = q.question_type ?? "mcq";
    questions[q.id] = {
      content: q.content,
      choices: questionType === "true_false" ? [] : q.choices,
      questionType,
      subItems:
        questionType === "true_false"
          ? (q.choices as unknown as ResultQuestion["subItems"])
          : undefined,
      subAnswers: q.sub_answers ?? undefined,
      essayAnswer: q.essay_answer ?? undefined,
    };
  }

  return { examId: exam.id, examTitle: exam.title, result, questions };
}
