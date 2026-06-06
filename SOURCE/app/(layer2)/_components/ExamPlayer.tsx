// ExamPlayer — phần client của Exam Player (Layer 2, GĐ 2 M2.6).
// Giữ state làm bài qua useExamPlayer (useReducer — tracer code M1.5).
// Nộp bài gọi submitExam() Server Action (batch on submit, Q2=A) — action tự redirect.
"use client";

import { useTransition } from "react";
import { submitExam } from "@/app/(layer2)/actions";
import { QuestionRenderer } from "./QuestionRenderer";
import { QuestionPagination } from "./QuestionPagination";
import { useExamPlayer } from "@/hooks/useExamPlayer";
import type { PublicQuestion } from "@/types/question";

interface ExamPlayerProps {
  attemptId: string;
  examTitle: string;
  questions: PublicQuestion[];
}

export function ExamPlayer({
  attemptId,
  examTitle,
  questions,
}: ExamPlayerProps) {
  const { current, answers, selectAnswer, goto, next, prev } = useExamPlayer(
    questions.length,
  );
  const [submitting, startSubmit] = useTransition();

  const question = questions[current];

  const answeredIndices = questions
    .map((q, i) => (answers[q.id] ? i : -1))
    .filter((i) => i >= 0);
  const remaining = questions.length - answeredIndices.length;

  function submit() {
    startSubmit(async () => {
      await submitExam(attemptId, answers);
    });
  }

  return (
    <main>
      <h1>{examTitle}</h1>

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
      <button type="button" onClick={submit} disabled={submitting}>
        {submitting ? "Đang nộp…" : "Nộp bài"}
      </button>
    </main>
  );
}
