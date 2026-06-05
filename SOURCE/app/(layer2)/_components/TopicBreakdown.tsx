// TopicBreakdown — kết quả theo chủ đề ở màn Result (Layer 2). M1.7.
// GĐ 1: list text. GĐ 3 (M3.1) chuyển thành bar chart đơn giản.

import type { TopicResult } from "@/types/result";

export function TopicBreakdown({ topics }: { topics: TopicResult[] }) {
  if (topics.length === 0) return null;

  return (
    <section>
      <h2>Theo chủ đề</h2>
      <ul>
        {topics.map((t) => (
          <li key={t.topic}>
            {t.topic}: {t.correct}/{t.total}
          </li>
        ))}
      </ul>
    </section>
  );
}
