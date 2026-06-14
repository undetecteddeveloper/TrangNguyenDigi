// ExamPlayer — phần client của Exam Player (Layer 2). GĐ 3 M3.1 Task 2–3.
// Giữ state làm bài qua useExamPlayer (useReducer — tracer code M1.5): câu, đáp án, flag.
// Nộp bài gọi submitExam() Server Action (batch on submit, Q2=A) — action tự redirect.
// Task 3: ExamTimer đếm ngược → hết giờ auto-submit (PA A); FlagButton đánh dấu câu.
// Visual "focus mode" (UI-LAYER-MAP 4.2): SiteHeader + top bar sticky (timer · tên đề ·
// flag), nội dung căn giữa cột hẹp, không sidebar/distraction.
// M3.2 Task 1: mobile vuốt trái/phải chuyển câu (useSwipe); desktop dùng phím ← → .
"use client";

import { useEffect, useRef, useTransition } from "react";
import { submitExam } from "@/app/(layer2)/actions";
import { SiteHeader } from "./SiteHeader";
import { ExamTimer } from "./ExamTimer";
import { FlagButton } from "./FlagButton";
import { QuestionRenderer } from "./QuestionRenderer";
import { QuestionPagination } from "./QuestionPagination";
import { useExamPlayer } from "@/hooks/useExamPlayer";
import { useSwipe } from "@/hooks/useSwipe";
import type { PublicQuestion } from "@/types/question";

interface ExamPlayerProps {
  attemptId: string;
  examTitle: string;
  durationMinutes: number;
  questions: PublicQuestion[];
}

export function ExamPlayer({
  attemptId,
  examTitle,
  durationMinutes,
  questions,
}: ExamPlayerProps) {
  const { current, answers, flags, selectAnswer, toggleFlag, goto, next, prev } =
    useExamPlayer(questions.length);
  const [submitting, startSubmit] = useTransition();
  const submittedRef = useRef(false);

  // Mobile: vuốt trái → câu sau, vuốt phải → câu trước (gắn lên vùng đọc câu hỏi).
  const swipe = useSwipe({ onSwipeLeft: next, onSwipeRight: prev });

  // Desktop: phím ← → chuyển câu. Bỏ qua khi focus đang ở ô chọn đáp án (radio)
  // để mũi tên vẫn dùng để chọn A/B/C/D theo hành vi gốc của radio group.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const question = questions[current];

  const answeredIndices = questions
    .map((q, i) => (answers[q.id] ? i : -1))
    .filter((i) => i >= 0);
  const flaggedIndices = questions
    .map((q, i) => (flags[q.id] ? i : -1))
    .filter((i) => i >= 0);
  const remaining = questions.length - answeredIndices.length;

  // Nộp bài — chống gọi trùng (nút thủ công + auto-submit hết giờ).
  function submit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    startSubmit(async () => {
      await submitExam(attemptId, answers);
    });
  }

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      {/* Top bar — timer · tên đề (giữa) · flag, sticky ngay dưới SiteHeader (h-14). */}
      <div className="sticky top-14 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid h-12 w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-6">
          <ExamTimer durationMinutes={durationMinutes} onTimeUp={submit} />
          <span className="truncate text-center font-serif text-sm text-muted-foreground">
            {examTitle}
          </span>
          <div className="flex justify-end">
            <FlagButton
              flagged={Boolean(flags[question.id])}
              onToggle={() => toggleFlag(question.id)}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        {/* Vùng đọc câu hỏi — bắt cử chỉ vuốt ngang để chuyển câu trên mobile. */}
        <div onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd}>
          <QuestionRenderer
            index={current + 1}
            total={questions.length}
            question={question}
            selectedAnswer={answers[question.id]}
            onSelectAnswer={(choice) => selectAnswer(question.id, choice)}
          />
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <QuestionPagination
            current={current}
            total={questions.length}
            answeredIndices={answeredIndices}
            flaggedIndices={flaggedIndices}
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
