// Result — /exams/[id]/attempt/[attemptId]/result (Layer 2). M2.6.
// Server Component (GĐ 2): đọc kết quả đã chấm + lưu trong DB qua getResult().
// Attempt chưa nộp / không tồn tại / không thuộc user → redirect về trang đề (Q2=A).
// (Trước đây GĐ 1 đọc sessionStorage + chấm điểm client-side.)

import Link from "next/link";
import { redirect } from "next/navigation";
import { getResult } from "@/app/(layer2)/queries";
import { ScoreCard } from "@/app/(layer2)/_components/ScoreCard";
import { TopicBreakdown } from "@/app/(layer2)/_components/TopicBreakdown";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { id, attemptId } = await params;
  const data = await getResult(attemptId);

  if (!data) {
    redirect(`/exams/${id}`);
  }

  const { examTitle, result, questionContent } = data;

  return (
    <main>
      <h1>Kết quả: {examTitle}</h1>

      <ScoreCard result={result} />
      <TopicBreakdown topics={result.topicBreakdown} />

      <section>
        <h2>Chi tiết từng câu</h2>
        <ol>
          {result.perQuestion.map((r, i) => (
            <li key={r.questionId}>
              <p>
                Câu {i + 1}: {questionContent[r.questionId]}
              </p>
              <p>
                Bạn chọn: {r.selected ?? "(bỏ trống)"} · Đáp án đúng: {r.correct}{" "}
                · {r.isCorrect ? "Đúng" : "Sai"}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* "Làm lại" → màn Detail, nơi tạo attempt mới (Q1=B). */}
      <Link href={`/exams/${id}`}>Làm lại</Link>
    </main>
  );
}
