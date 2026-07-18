import Link from "next/link";
import type { Exam } from "@/types/exam";
import { AuthorByline } from "@/components/shared/AuthorByline";

export function ExamCard({ exam }: { exam: Exam }) {
  return (
    <li className="h-full">
      {/* hover shadow (S#26): engineer yêu cầu đích danh — exception quy tắc
          "không đổ bóng" DESIGN.md cho riêng ExamCard; tông ấm đen sơn mài
          thay đen lạnh. */}
      <Link
        href={`/exams/${exam.id}`}
        className="group flex h-full flex-col gap-3 rounded-lg border border-[color:var(--block-border)] bg-[var(--block-bg)] p-5 transition-[border-color,box-shadow] duration-200 hover:border-[color:var(--block-hover)] hover:shadow-[0_8px_24px_rgba(27,21,18,0.12)] focus-visible:border-[color:var(--block-hover)] focus-visible:outline-none"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow text-[var(--block-fg-muted)]">{exam.subject}</span>
          <span className="eyebrow text-[var(--block-fg-muted)] tabular-nums">
            Grade {exam.grade}
          </span>
        </div>

        <h3 className="text-xl leading-snug text-[var(--block-fg)] transition-colors group-hover:text-[var(--block-hover)]">
          {exam.title}
        </h3>

        {/* Byline UGC (Task 5.2) — chỉ hiện với đề có tác giả; đề seed bỏ qua. */}
        <AuthorByline name={exam.authorDisplayName} />

        {/* S#27: School data thật từ DB — null → "None" (S#28 Q2). Level giữ
            "—" (tính năng chưa xây — tính từ rating user, tương lai). */}
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-[var(--block-fg-muted)]">School</dt>
          <dd className="text-[var(--block-fg-muted)]">{exam.school ?? "None"}</dd>
          <dt className="text-[var(--block-fg-muted)]">Level</dt>
          <dd className="text-[var(--block-fg-muted)]">—</dd>
        </dl>
      </Link>
    </li>
  );
}
