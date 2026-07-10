// ExamBrowser — danh sách đề trong Exam Browser (Layer 2).
// Lưới ExamCard responsive: 1 cột (mobile) → 2 (sm) → 3 (lg) với gap đều
// (S#19 — container /exams nới max-w-6xl để đủ chỗ 3 card/hàng). Empty state
// khi lọc không ra kết quả. Lọc do ExamFilters (overlay) đảm nhiệm.

import type { Exam } from "@/types/exam";
import { ExamCard } from "./ExamCard";

export function ExamBrowser({ exams }: { exams: Exam[] }) {
  if (exams.length === 0) {
    return (
      <div className="flex min-h-50 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
        <p className="font-serif text-lg text-foreground">No matching exams</p>
        <p className="text-sm text-muted-foreground">
          Try removing some filters to see more exams.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </ul>
  );
}
