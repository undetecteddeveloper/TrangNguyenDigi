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
      </Link>
    </li>
  );
}
