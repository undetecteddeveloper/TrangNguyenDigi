// Exam Detail — /exams/[id] (Layer 2).
// Server Component: xem thông tin đề trước khi bắt đầu (GĐ 2 M2.5, thay fake-data).
// GĐ 3 M3.2: visual language L2 "tờ giấy trắng" — SiteHeader + back link + eyebrow
// môn/lớp + tiêu đề serif + ô meta (số câu/thời gian) + nút brand. Mobile-first.
// Feedback: bỏ eyebrow môn/lớp + dòng hướng dẫn; back link "Trang trước"; căn giữa toàn bộ.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getExam } from "@/app/(layer2)/queries";
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
    <div className="bg-background">
      <main className="mx-auto flex w-full max-w-xl flex-col px-6 py-10">
        {/* "Trang trước" canh TRÁI block tổng quan (self-start), nội dung dưới căn giữa. */}
        <Link
          href="/exams"
          className="preload-fade eyebrow inline-flex items-center gap-1 self-start transition-colors hover:text-brand"
          style={{ "--preload-order": 1 } as React.CSSProperties}
        >
          ← Back
        </Link>

        {/* preload order 2 — khối tổng quan fade sau navbar + back link (S#21). */}
        <div
          className="preload-fade mt-6 flex flex-col items-center text-center"
          style={{ "--preload-order": 2 } as React.CSSProperties}
        >
          <h1 className="text-3xl leading-tight sm:text-4xl">{exam.title}</h1>

          <dl className="mt-8 grid w-full max-w-md grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <dt className="eyebrow">Questions</dt>
              <dd className="mt-2 font-serif text-2xl tabular-nums text-foreground">
                {exam.questionIds.length}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <dt className="eyebrow">Duration</dt>
              <dd className="mt-2 font-serif text-2xl tabular-nums text-foreground">
                {exam.durationMinutes}{" "}
                <span className="text-base text-muted-foreground">min</span>
              </dd>
            </div>
            {/* Difficulty (S#26) — hàng dưới, CĂN GIỮA (không lệch một bên):
                span cả 2 cột rồi tự thu về đúng bề rộng 1 cột (50% − nửa gap).
                Data model chưa có độ khó → giá trị tượng trưng "—" (đồng bộ
                ExamCard "Level —"), data thật ở milestone sau. */}
            <div className="col-span-2 w-[calc(50%-0.5rem)] justify-self-center rounded-lg border border-border bg-card p-5">
              <dt className="eyebrow">Difficulty</dt>
              <dd className="mt-2 font-serif text-2xl text-muted-foreground">
                —
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <StartAttemptButton examId={exam.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
