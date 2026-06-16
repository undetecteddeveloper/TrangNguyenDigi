import Link from "next/link";
import type { Exam } from "@/types/exam";

export function ExamCard({ exam }: { exam: Exam }) {
  return (
    <li className="h-full">
      <Link
        href={`/exams/${exam.id}`}
        className="group flex h-full flex-col gap-3 rounded-lg border border-[color:var(--block-border)] bg-[var(--block-bg)] p-5 transition-all duration-200 hover:border-[color:var(--block-hover)] hover:shadow-[0_8px_24px_rgba(255,255,255,0.35)] focus-visible:border-[color:var(--block-hover)] focus-visible:outline-none"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow text-[var(--block-fg-muted)]">
            {exam.subject}
          </span>
          <span className="eyebrow tabular-nums text-[var(--block-fg-muted)]">
            Lớp {exam.grade}
          </span>
        </div>

        <h3 className="text-xl leading-snug text-[var(--block-fg)] transition-colors group-hover:text-[var(--block-hover)]">
          {exam.title}
        </h3>

        {/* (Nội dung) — tượng trưng theo template; data thật ở milestone sau. */}
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-[var(--block-fg-muted)]">Trường</dt>
          <dd className="text-[var(--block-fg-muted)]">—</dd>
          <dt className="text-[var(--block-fg-muted)]">Mức độ</dt>
          <dd className="text-[var(--block-fg-muted)]">—</dd>
        </dl>
      </Link>
    </li>
  );
}
