// ExamBrowser — danh sách đề trong Exam Browser (Layer 2).
// Lưới ExamCard 2 cột × n hàng (n phụ thuộc số đề từ DB). Empty state khi lọc
// không ra kết quả. Lọc do ExamFilters (overlay) đảm nhiệm.

import type { Exam } from "@/types/exam";
import { ExamCard } from "./ExamCard";

export function ExamBrowser({ exams }: { exams: Exam[] }) {
  if (exams.length === 0) {
    return (
      <div className="flex min-h-50 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
        <p className="font-serif text-lg text-foreground">Không có đề phù hợp</p>
        <p className="text-sm text-muted-foreground">
          Thử bỏ bớt bộ lọc để xem thêm đề.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </ul>
  );
}
