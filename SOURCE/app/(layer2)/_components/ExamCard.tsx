// ExamCard — một mục đề trong Exam Browser (Layer 2).
// GĐ 1: cấu trúc tối giản, chưa style (xem PROJECT_ROADMAP.md M1.3).
// GĐ 3 (M3.1) sẽ style theo visual language "Focused / tối giản".

import Link from "next/link";
import type { Exam } from "@/types/exam";

export function ExamCard({ exam }: { exam: Exam }) {
  return (
    <li>
      <Link href={`/exams/${exam.id}`}>
        <h3>{exam.title}</h3>
        <p>
          Môn: {exam.subject} · Lớp {exam.grade} · {exam.questionIds.length} câu
          · {exam.durationMinutes} phút
        </p>
      </Link>
    </li>
  );
}
