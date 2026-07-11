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

          {/* S#28: điền data DB thật vào page — thêm School/Year/Semester
              (null → "None"). 6 ô = lưới 2×3 đều → bỏ hack căn giữa col-span
              của ô Difficulty (S#26, chỉ cần khi lẻ ô). Difficulty giữ "—"
              (tính năng chưa xây — tính từ rating user, tương lai). */}
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
            <div className="rounded-lg border border-border bg-card p-5">
              <dt className="eyebrow">School</dt>
              <dd
                className={`mt-2 font-serif text-lg leading-snug ${
                  exam.school ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {exam.school ?? "None"}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <dt className="eyebrow">Year</dt>
              <dd
                className={`mt-2 font-serif text-2xl tabular-nums ${
                  exam.schoolYear !== undefined
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {exam.schoolYear ?? "None"}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <dt className="eyebrow">Semester</dt>
              <dd
                className={`mt-2 font-serif text-2xl ${
                  exam.semester ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {exam.semester ?? "None"}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
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
