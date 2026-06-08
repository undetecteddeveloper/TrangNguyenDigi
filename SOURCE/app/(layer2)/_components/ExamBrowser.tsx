// ExamBrowser — danh sách đề trong Exam Browser (Layer 2). GĐ 3 M3.1 (LÀM LẠI).
// Danh sách block DỌC 1 cột (khớp TEMPLATE/L2/L2_mobile.png: *Block1/2/3 xếp dọc).
// Empty state khi lọc không ra kết quả. Lọc do ExamFilters (overlay) đảm nhiệm.

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
    <ul className="flex flex-col gap-4">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </ul>
  );
}
