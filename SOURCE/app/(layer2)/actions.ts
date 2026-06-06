// Logic Layer 2 — Writes / Server Actions (GĐ 2 M2.6).
// Persist attempt theo Q2=A (batch on submit): submitExam ghi toàn bộ answers +
// chấm điểm server-side một lần. Xem BACK-END-ARCHITECTURE-MAP.md Mục 4.2.
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeScore } from "@/lib/scoring/computeScore";
import type { ChoiceId, Question } from "@/types/question";

/**
 * Tạo attempt mới cho đề → trả attemptId thật từ DB (thay crypto.randomUUID GĐ 1).
 * user_id tự gán = auth.uid() (default cột + RLS). Redirect thẳng vào player.
 */
export async function startAttempt(examId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({ exam_id: examId })
    .select("id")
    .single();
  if (error) throw error;

  redirect(`/exams/${examId}/attempt/${data.id}`);
}

/**
 * Nộp bài: batch-insert answers, chấm điểm server-side với đáp án từ DB,
 * lưu exam_results, khóa attempt. Idempotent — đã nộp thì redirect thẳng kết quả.
 */
export async function submitExam(
  attemptId: string,
  answers: Record<string, ChoiceId>,
) {
  const supabase = await createClient();

  // 1. Lấy attempt (RLS đảm bảo thuộc về user hiện tại).
  const { data: attempt, error: attemptErr } = await supabase
    .from("exam_attempts")
    .select("id, exam_id, status")
    .eq("id", attemptId)
    .maybeSingle();
  if (attemptErr) throw attemptErr;
  if (!attempt) redirect("/exams");
  const examId = attempt.exam_id as string;

  // Đã nộp rồi → không chấm lại.
  if (attempt.status === "submitted") {
    redirect(`/exams/${examId}/attempt/${attemptId}/result`);
  }

  // 2. Lấy câu hỏi ĐẦY ĐỦ (kèm correct_answer) theo thứ tự đề — server-only.
  const { data: examRow, error: examErr } = await supabase
    .from("exams")
    .select("question_ids")
    .eq("id", examId)
    .single();
  if (examErr) throw examErr;
  const questionIds = examRow.question_ids as string[];

  const { data: qRows, error: qErr } = await supabase
    .from("questions")
    .select("id, content, choices, correct_answer, subject, grade, topic")
    .in("id", questionIds);
  if (qErr) throw qErr;

  const byId = new Map(
    (qRows as Array<Record<string, unknown>>).map((r) => [
      r.id as string,
      {
        id: r.id as string,
        content: r.content as string,
        choices: r.choices as Question["choices"],
        correctAnswer: r.correct_answer as ChoiceId,
        subject: r.subject as string,
        grade: r.grade as number,
        topic: r.topic as string,
      } satisfies Question,
    ]),
  );
  const questions = questionIds
    .map((id) => byId.get(id))
    .filter((q): q is Question => q !== undefined);

  // 3. Batch-insert answers (null nếu bỏ trống).
  const answerRows = questions.map((q) => ({
    attempt_id: attemptId,
    question_id: q.id,
    answer: answers[q.id] ?? null,
  }));
  const { error: ansErr } = await supabase
    .from("attempt_answers")
    .upsert(answerRows, { onConflict: "attempt_id,question_id" });
  if (ansErr) throw ansErr;

  // 4. Chấm điểm server-side (tracer code computeScore — M1.6).
  const score = computeScore(questions, answers);

  // 5. Lưu kết quả (user_id default auth.uid()).
  const { error: resErr } = await supabase.from("exam_results").insert({
    attempt_id: attemptId,
    total_score: score.totalScore,
    correct: score.correct,
    total: score.total,
    per_question: score.perQuestion,
    topic_breakdown: score.topicBreakdown,
  });
  if (resErr) throw resErr;

  // 6. Khóa attempt.
  const { error: updErr } = await supabase
    .from("exam_attempts")
    .update({ status: "submitted", submitted_at: new Date().toISOString() })
    .eq("id", attemptId);
  if (updErr) throw updErr;

  redirect(`/exams/${examId}/attempt/${attemptId}/result`);
}
