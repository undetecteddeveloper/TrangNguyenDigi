// ExamBrowser — màn chọn đề (Layer 2).
// GĐ 1: list đơn giản, chưa filter/search (filter là GĐ 3 — M3.1).

import type { Exam } from "@/types/exam";
import { ExamCard } from "./ExamCard";

export function ExamBrowser({ exams }: { exams: Exam[] }) {
  if (exams.length === 0) {
    return <p>Chưa có đề nào.</p>;
  }

  return (
    <ul>
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </ul>
  );
}
