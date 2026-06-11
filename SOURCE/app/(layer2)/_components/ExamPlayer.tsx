// ExamPlayer — phần client của Exam Player (Layer 2). GĐ 3 M3.1 Task 2 (style).
// Giữ state làm bài qua useExamPlayer (useReducer — tracer code M1.5).
// Nộp bài gọi submitExam() Server Action (batch on submit, Q2=A) — action tự redirect.
// Visual "focus mode" (UI-LAYER-MAP 4.2): SiteHeader + top bar tiến độ sticky,
// nội dung căn giữa cột hẹp, không sidebar/distraction. (Timer + flag: Task 3.)
"use client";

import { useTransition } from "react";
import { submitExam } from "@/app/(layer2)/actions";
import { SiteHeader } from "./SiteHeader";
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
  const { current, answers, selectAnswer, goto } = useExamPlayer(
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
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      {/* Top bar — tên đề căn giữa, sticky ngay dưới SiteHeader (h-14). */}
      <div className="sticky top-14 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-2xl items-center justify-center px-6">
          <span className="truncate font-serif text-sm text-muted-foreground">
            {examTitle}
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <QuestionRenderer
          index={current + 1}
          total={questions.length}
          question={question}
          selectedAnswer={answers[question.id]}
          onSelectAnswer={(choice) => selectAnswer(question.id, choice)}
        />

        <div className="mt-10 border-t border-border pt-6">
          <QuestionPagination
            current={current}
            total={questions.length}
            answeredIndices={answeredIndices}
            onJump={goto}
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          {remaining > 0 && (
            <p className="text-sm text-muted-foreground">
              Còn{" "}
              <span className="font-medium text-foreground tabular-nums">
                {remaining}
              </span>{" "}
              câu chưa làm.
            </p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="w-full rounded-lg bg-brand px-6 py-3 font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-12"
          >
            {submitting ? "Đang nộp…" : "Nộp bài"}
          </button>
        </div>
      </main>
    </div>
  );
}
