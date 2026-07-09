// Result — /exams/[id]/attempt/[attemptId]/result (Layer 2). M2.6 → GĐ 3 M3.1 Task 4.
// Server Component: đọc kết quả đã chấm + lưu trong DB qua getResult().
// Attempt chưa nộp / không tồn tại / không thuộc user → redirect về trang đề (Q2=A).
// Bố cục theo TEMPLATE/L2/resultpage_L2_mobile.png: block điểm · chủ đề + save/share ·
// nav (Chi tiết → page riêng / Trở về homepage / Làm lại). Visual "tờ giấy trắng".

import Link from "next/link";
import { redirect } from "next/navigation";
import { getResult } from "@/app/(layer2)/queries";
import { ScoreCard } from "@/app/(layer2)/_components/ScoreCard";
import { TopicBreakdown } from "@/app/(layer2)/_components/TopicBreakdown";
import { ResultActions } from "@/app/(layer2)/_components/ResultActions";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { id, attemptId } = await params;
  const data = await getResult(attemptId);

  if (!data) {
    redirect(`/exams/${id}`);
  }

  const { examTitle, result } = data;

  return (
    <div className="bg-background">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-5 px-6 py-8">
        <ScoreCard examTitle={examTitle} result={result} />

        {/* Chủ đề (trái) · Lưu/Chia sẻ + Trở về (phải) — engineer feedback: đổi
            justify-between → justify-start (gap-3 cố định) để 2 nhóm nút bên
            phải nằm SÁT nhau ngay dưới nhau, không bị kéo giãn hở khoảng
            trống theo chiều cao (do items-stretch khớp cột trái cao hơn). */}
        <div className="grid grid-cols-[1fr_auto] items-stretch gap-4">
          <TopicBreakdown topics={result.topicBreakdown} />
          <div className="flex w-28 flex-col justify-start gap-3 sm:w-36">
            <ResultActions />
            {/* Trở về homepage → "/" (placeholder; homepage thật ở UI L1 — Q4). */}
            <Link
              href="/"
              className="flex items-center justify-center rounded-xl border border-border bg-card px-3 py-4 text-center text-sm text-foreground transition-colors hover:border-brand"
            >
              Trở về
            </Link>
          </div>
        </div>

        {/* Nav cuối: Chi tiết (page riêng, Q5) · Làm lại (→ Detail, tạo attempt mới). */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/exams/${id}/attempt/${attemptId}/result/detail`}
            className="rounded-lg border border-brand bg-brand px-4 py-3 text-center text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Xem chi tiết
          </Link>
          <Link
            href={`/exams/${id}`}
            className="rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-brand"
          >
            Làm lại
          </Link>
        </div>
      </main>
    </div>
  );
}
