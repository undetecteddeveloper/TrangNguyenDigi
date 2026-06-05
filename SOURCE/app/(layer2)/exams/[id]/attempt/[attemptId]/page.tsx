// Exam Player — /exams/[id]/attempt/[attemptId] (Layer 2).
// GĐ 1, M1.4: render câu hỏi + điều hướng next/prev (Q3=A: một câu/trang).
//
// State hiện tại dùng useState (currentIndex + answers) — đủ cho M1.4.
// M1.5 sẽ nâng lên useReducer (examPlayerStore) khi logic state phức tạp hơn.
// M1.6 thêm computeScore + nút "Nộp bài"; M1.7 thêm ResultView.

"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { getFakeExam, getFakeQuestions } from "@/lib/fake-data/exams";
import { QuestionRenderer } from "@/app/(layer2)/_components/QuestionRenderer";
import { QuestionPagination } from "@/app/(layer2)/_components/QuestionPagination";
import type { ChoiceId } from "@/types/question";

export default function ExamPlayerPage() {
  const params = useParams<{ id: string; attemptId: string }>();
  const examId = params.id;

  const exam = getFakeExam(examId);
  const questions = getFakeQuestions(examId);

  // answers: map questionId -> đáp án đã chọn (M1.5 sẽ chuyển sang useReducer).
  const [answers, setAnswers] = useState<Record<string, ChoiceId>>({});
  const [current, setCurrent] = useState(0);

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

  function selectAnswer(choice: ChoiceId) {
    setAnswers((prev) => ({ ...prev, [question.id]: choice }));
  }

  const isLast = current === questions.length - 1;

  return (
    <main>
      <h1>{exam.title}</h1>

      <QuestionRenderer
        index={current + 1}
        total={questions.length}
        question={question}
        selectedAnswer={answers[question.id]}
        onSelectAnswer={selectAnswer}
      />

      <QuestionPagination
        current={current}
        total={questions.length}
        answeredIndices={answeredIndices}
        onJump={setCurrent}
        onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
        onNext={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
      />

      {/* Nộp bài: logic chấm điểm (computeScore) thuộc M1.6, kết quả M1.7. */}
      {isLast && (
        <button type="button" disabled title="Chấm điểm sẽ thêm ở M1.6">
          Nộp bài (sắp có — M1.6)
        </button>
      )}
    </main>
  );
}
