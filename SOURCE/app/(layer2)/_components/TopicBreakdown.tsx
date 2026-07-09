// TopicBreakdown — kết quả theo chủ đề ở màn Result (Layer 2). M1.7 → GĐ 3 M3.1 Task 4.
// Template block "Số câu đúng <loại A/B/C>": mỗi dòng là một chủ đề (topic) của đề,
// nhãn "Câu <topic>" (Q2), kèm thanh tiến độ mảnh (accent brand tiết chế, không fill màu).

import type { TopicResult } from "@/types/result";

export function TopicBreakdown({ topics }: { topics: TopicResult[] }) {
  if (topics.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <span className="eyebrow">Chủ đề</span>
      <ul className="mt-3 flex flex-col gap-3">
        {topics.map((t) => {
          const pct = t.total > 0 ? (t.correct / t.total) * 100 : 0;
          return (
            <li key={t.topic} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-foreground">Câu {t.topic}</span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {t.correct}/{t.total}
                </span>
              </div>
              {/* Thanh tiến độ: nền hairline, phần đúng tô brand. */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
