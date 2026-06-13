// ScoreCard — block tổng kết điểm ở màn Result (Layer 2). M1.7 → GĐ 3 M3.1 Task 4.
// Template `resultpage_L2_mobile.png` block lớn: tên đề · số câu đúng · sai · thời gian.
// Visual "tờ giấy trắng": nền card, hairline, điểm lớn nổi bật (UI-LAYER-MAP 4.4) —
// KHÔNG fill màu (màu template chỉ tượng trưng, Q6).

import type { ScoreResult } from "@/types/result";

export function ScoreCard({
  examTitle,
  result,
}: {
  examTitle: string;
  result: ScoreResult;
}) {
  const wrong = result.total - result.correct;

  return (
    <section className="rounded-xl border border-border bg-card p-6 text-center sm:p-8">
      <span className="eyebrow">Kết quả</span>
      <h1 className="mt-2 font-serif text-2xl leading-snug text-card-foreground">
        {examTitle}
      </h1>

      {/* Điểm lớn nổi bật — thang 10. */}
      <p className="mt-5 flex items-baseline justify-center gap-1">
        <span className="font-serif text-6xl leading-none text-brand tabular-nums">
          {result.totalScore.toFixed(1)}
        </span>
        <span className="font-serif text-2xl text-muted-foreground">/10</span>
      </p>

      {/* Thống kê: đúng · sai · thời gian (thời gian tượng trưng — Q1). */}
      <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center">
        <div className="flex flex-col gap-1">
          <dt className="eyebrow">Câu đúng</dt>
          <dd className="font-serif text-xl text-foreground tabular-nums">
            {result.correct}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="eyebrow">Câu sai</dt>
          <dd className="font-serif text-xl text-foreground tabular-nums">
            {wrong}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="eyebrow">Thời gian</dt>
          <dd className="font-serif text-xl text-muted-foreground tabular-nums">
            —
          </dd>
        </div>
      </dl>
    </section>
  );
}
