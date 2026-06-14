// Exam Detail — /exams/[id] (Layer 2).
// Server Component: xem thông tin đề trước khi bắt đầu (GĐ 2 M2.5, thay fake-data).
// GĐ 3 M3.2: visual language L2 "tờ giấy trắng" — SiteHeader + back link + eyebrow
// môn/lớp + tiêu đề serif + ô meta (số câu/thời gian) + nút brand. Mobile-first.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getExam } from "@/app/(layer2)/queries";
import { SiteHeader } from "@/app/(layer2)/_components/SiteHeader";
import { StartAttemptButton } from "@/app/(layer2)/_components/StartAttemptButton";

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getExam(id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-xl px-6 py-10">
        <Link
          href="/exams"
          className="eyebrow inline-flex items-center gap-1 transition-colors hover:text-brand"
        >
          ← Tất cả đề
        </Link>

        <div className="mt-6 flex items-baseline justify-between gap-3">
          <span className="eyebrow">{exam.subject}</span>
          <span className="eyebrow tabular-nums">Lớp {exam.grade}</span>
        </div>
        <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{exam.title}</h1>

        <dl className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <dt className="eyebrow">Số câu</dt>
            <dd className="mt-2 font-serif text-2xl tabular-nums text-foreground">
              {exam.questionIds.length}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <dt className="eyebrow">Thời gian</dt>
            <dd className="mt-2 font-serif text-2xl tabular-nums text-foreground">
              {exam.durationMinutes}{" "}
              <span className="text-base text-muted-foreground">phút</span>
            </dd>
          </div>
        </dl>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          Khi bắt đầu, đồng hồ đếm ngược sẽ chạy. Hết giờ, bài làm tự động được nộp.
        </p>

        <div className="mt-8">
          <StartAttemptButton examId={exam.id} />
        </div>
      </main>
    </div>
  );
}
