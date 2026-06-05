// Result — /exams/[id]/attempt/[attemptId]/result (Layer 2). M1.7.
// ResultView: đọc bài làm từ sessionStorage (bridge GĐ 1, Q=A), chấm điểm
// bằng computeScore, hiển thị điểm + breakdown + chi tiết từng câu.
// GĐ 2 (M2.6) thay sessionStorage bằng getResult(attemptId) từ DB.

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFakeExam, getFakeQuestions } from "@/lib/fake-data/exams";
import { computeScore } from "@/lib/scoring/computeScore";
import { ScoreCard } from "@/app/(layer2)/_components/ScoreCard";
import { TopicBreakdown } from "@/app/(layer2)/_components/TopicBreakdown";
import type { ChoiceId, Question } from "@/types/question";
import type { ScoreResult } from "@/types/result";

interface StoredAttempt {
  examId: string;
  answers: Record<string, ChoiceId>;
}

export default function ResultPage() {
  const params = useParams<{ id: string; attemptId: string }>();
  const router = useRouter();
  const examId = params.id;
  const attemptId = params.attemptId;

  const [result, setResult] = useState<ScoreResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(`attempt:${attemptId}`);
    if (!raw) {
      setMissing(true);
      return;
    }
    const stored: StoredAttempt = JSON.parse(raw);
    const qs = getFakeQuestions(stored.examId);
    setQuestions(qs);
    setResult(computeScore(qs, stored.answers));
  }, [attemptId]);

  if (missing) {
    return (
      <main>
        <p>Không có dữ liệu bài làm. Vui lòng làm lại.</p>
        <button type="button" onClick={() => router.push(`/exams/${examId}`)}>
          Về trang đề
        </button>
      </main>
    );
  }

  if (!result) {
    return (
      <main>
        <p>Đang chấm điểm…</p>
      </main>
    );
  }

  const exam = getFakeExam(examId);
  const questionById = new Map(questions.map((q) => [q.id, q]));

  return (
    <main>
      <h1>Kết quả{exam ? `: ${exam.title}` : ""}</h1>

      <ScoreCard result={result} />
      <TopicBreakdown topics={result.topicBreakdown} />

      <section>
        <h2>Chi tiết từng câu</h2>
        <ol>
          {result.perQuestion.map((r, i) => (
            <li key={r.questionId}>
              <p>
                Câu {i + 1}: {questionById.get(r.questionId)?.content}
              </p>
              <p>
                Bạn chọn: {r.selected ?? "(bỏ trống)"} · Đáp án đúng: {r.correct}{" "}
                · {r.isCorrect ? "Đúng" : "Sai"}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* "Làm lại" → màn Detail, nơi sinh attemptId mới (Q1=B). */}
      <button type="button" onClick={() => router.push(`/exams/${examId}`)}>
        Làm lại
      </button>
    </main>
  );
}
