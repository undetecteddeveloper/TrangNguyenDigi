// ExamCard — một block đề trong Exam Browser (Layer 2). GĐ 3 M3.1 (LÀM LẠI).
// Khớp *Block trong TEMPLATE/L2/L2_mobile.png:
//   <Tên đề>            → exam.title (giữ nguyên — engineer Q2=B)
//   (Nội dung): Trường, Mức độ → tượng trưng (chưa có data — engineer Q1)
// Meta thật (môn/lớp, câu/phút) giữ lại vì hữu ích cho việc chọn đề.
// Visual language "Focused / tối giản": thẻ giấy hairline, tiêu đề serif,
// accent chàm chỉ khi hover.

import Link from "next/link";
import type { Exam } from "@/types/exam";

export function ExamCard({ exam }: { exam: Exam }) {
  return (
    <li>
      <Link
        href={`/exams/${exam.id}`}
        className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand focus-visible:border-brand focus-visible:outline-none"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow">{exam.subject}</span>
          <span className="eyebrow tabular-nums">Lớp {exam.grade}</span>
        </div>

        <h3 className="text-xl leading-snug text-card-foreground transition-colors group-hover:text-brand">
          {exam.title}
        </h3>

        {/* (Nội dung) — tượng trưng theo template; data thật ở milestone sau. */}
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Trường</dt>
          <dd className="text-muted-foreground">—</dd>
          <dt className="text-muted-foreground">Mức độ</dt>
          <dd className="text-muted-foreground">—</dd>
        </dl>

        <div className="mt-1 flex items-center gap-5 border-t border-border pt-3 text-sm text-muted-foreground">
          <span className="flex items-baseline gap-1.5">
            <span className="font-medium tabular-nums text-foreground">
              {exam.questionIds.length}
            </span>
            câu
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-medium tabular-nums text-foreground">
              {exam.durationMinutes}
            </span>
            phút
          </span>
        </div>
      </Link>
    </li>
  );
}
