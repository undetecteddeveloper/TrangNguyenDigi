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
          className="eyebrow inline-flex items-center gap-1 self-start transition-colors hover:text-brand"
        >
          ← Trang trước
        </Link>

        <div className="mt-6 flex flex-col items-center text-center">
          <h1 className="text-3xl leading-tight sm:text-4xl">{exam.title}</h1>

          <dl className="mt-8 grid w-full max-w-md grid-cols-2 gap-4">
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

          <div className="mt-8">
            <StartAttemptButton examId={exam.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
