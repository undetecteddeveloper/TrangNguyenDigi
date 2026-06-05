// Exam Player — /exams/[id]/attempt/[attemptId] (Layer 2).
// GĐ 1: render câu hỏi (một câu/trang), bắt đáp án (M1.5), nộp bài (M1.6/M1.7).
//
// State qua useExamPlayer (useReducer — M1.5).
// Nộp bài: lưu answers vào sessionStorage rồi điều hướng sang Result page.
// GĐ 2 (M2.6) thay bridge này bằng submitExam() Server Action + DB.

"use client";

import { useParams, useRouter } from "next/navigation";
import { getFakeExam, getFakeQuestions } from "@/lib/fake-data/exams";
import { QuestionRenderer } from "@/app/(layer2)/_components/QuestionRenderer";
import { QuestionPagination } from "@/app/(layer2)/_components/QuestionPagination";
import { useExamPlayer } from "@/hooks/useExamPlayer";

export default function ExamPlayerPage() {
  const params = useParams<{ id: string; attemptId: string }>();
  const router = useRouter();
  const examId = params.id;
  const attemptId = params.attemptId;

  const exam = getFakeExam(examId);
  const questions = getFakeQuestions(examId);

  const { current, answers, selectAnswer, goto, next, prev } = useExamPlayer(
    questions.length,
  );

  if (!exam || questions.length === 0) {
    return (
      <main>
        <p>Không tìm thấy đề.</p>
      </main>
    );
  }

  const question = questions[current];

  const answeredIndices = questions
    .map((q, i) => (answers[q.id] ? i : -1))
    .filter((i) => i >= 0);
  const remaining = questions.length - answeredIndices.length;

  function submit() {
    // Bridge GĐ 1 (Q=A): lưu bài làm để Result page chấm điểm.
    sessionStorage.setItem(
      `attempt:${attemptId}`,
      JSON.stringify({ examId, answers }),
    );
    router.push(`/exams/${examId}/attempt/${attemptId}/result`);
  }

  return (
    <main>
      <h1>{exam.title}</h1>

      <QuestionRenderer
        index={current + 1}
        total={questions.length}
        question={question}
        selectedAnswer={answers[question.id]}
        onSelectAnswer={(choice) => selectAnswer(question.id, choice)}
      />

      <QuestionPagination
        current={current}
        total={questions.length}
        answeredIndices={answeredIndices}
        onJump={goto}
        onPrev={prev}
        onNext={next}
      />

      {remaining > 0 && <p>Còn {remaining} câu chưa làm.</p>}
      <button type="button" onClick={submit}>
        Nộp bài
      </button>
    </main>
  );
}
