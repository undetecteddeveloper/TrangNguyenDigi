// Logic Layer 2 — Reads (GĐ 2 M2.5/M2.6). Server-only: dùng Supabase server client.
// Gọi từ Server Component. Thay getFakeExams/getFakeExam/getFakeQuestions của GĐ 1.
// Xem BACK-END-ARCHITECTURE-MAP.md Mục 4.2.
import "server-only";

import { createClient } from "@/lib/supabase/server";
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
};

// Cột đề dùng chung cho mọi query exams (S#27: thêm school/school_year/semester).
const EXAM_COLUMNS =
  "id, title, question_ids, duration_minutes, subject, grade, school, school_year, semester";

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
  let query = supabase.from("exams").select(EXAM_COLUMNS);
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
    a.localeCompare(b, "vi"),
  );
  const grades = [...new Set(rows.map((r) => r.grade))].sort((a, b) => a - b);
  const schools = [
    ...new Set(rows.map((r) => r.school).filter((s): s is string => s !== null)),
  ].sort((a, b) => a.localeCompare(b, "vi"));
  const years = [
    ...new Set(
      rows.map((r) => r.school_year).filter((y): y is number => y !== null),
    ),
  ].sort((a, b) => b - a); // năm mới nhất lên đầu
  const semesters = [
    ...new Set(rows.map((r) => r.semester).filter((s): s is string => s !== null)),
  ].sort();
  return { subjects, grades, schools, years, semesters };
}

/** Một đề theo id, hoặc null nếu không tồn tại. */
export async function getExam(id: string): Promise<Exam | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select(EXAM_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toExam(data as unknown as ExamRow) : null;
}

/**
 * Đề + danh sách câu hỏi cho Player — KHÔNG kèm `correctAnswer` (bảo mật).
 * Câu hỏi được sắp theo đúng thứ tự `questionIds`. null nếu đề không tồn tại.
 */
export async function getExamForPlayer(
  id: string,
): Promise<{ exam: Exam; questions: PublicQuestion[] } | null> {
  const supabase = await createClient();
  const exam = await getExam(id);
  if (!exam) return null;

  const { data, error } = await supabase
    .from("questions")
    .select("id, content, choices, subject, grade, topic") // KHÔNG select correct_answer
    .in("id", exam.questionIds);
  if (error) throw error;

  const byId = new Map(
    (data as PublicQuestion[]).map((q) => [q.id, q]),
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

/** Nội dung một câu để render màn Chi tiết (post-submit nên kèm được lựa chọn). */
export type ResultQuestion = { content: string; choices: Choice[] };

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
  const { data: qs, error: qErr } = await supabase
    .from("questions")
    .select("id, content, choices")
    .in(
      "id",
      result.perQuestion.map((p) => p.questionId),
    );
  if (qErr) throw qErr;
  const questions: Record<string, ResultQuestion> = {};
  for (const q of qs as { id: string; content: string; choices: Choice[] }[]) {
    questions[q.id] = { content: q.content, choices: q.choices };
  }

  return { examId: exam.id, examTitle: exam.title, result, questions };
}
