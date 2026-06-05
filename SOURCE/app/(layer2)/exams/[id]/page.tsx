// Exam Detail — /exams/[id] (Layer 2).
// Server Component: xem thông tin đề trước khi bắt đầu (GĐ 1, M1.3 / Q1=B).

import { notFound } from "next/navigation";
import { getFakeExam } from "@/lib/fake-data/exams";
import { StartAttemptButton } from "@/app/(layer2)/_components/StartAttemptButton";

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = getFakeExam(id);

  if (!exam) {
    notFound();
  }

  return (
    <main>
      <h1>{exam.title}</h1>
      <p>
        Môn: {exam.subject} · Lớp {exam.grade} · {exam.questionIds.length} câu ·{" "}
        {exam.durationMinutes} phút
      </p>
      <StartAttemptButton examId={exam.id} />
    </main>
  );
}
