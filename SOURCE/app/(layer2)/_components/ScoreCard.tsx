// ScoreCard — điểm tổng ở màn Result (Layer 2). M1.7.
// GĐ 1: text thuần. GĐ 3 (M3.1) style "big number, prominent" (UI-LAYER-MAP 4.4).

import type { ScoreResult } from "@/types/result";

export function ScoreCard({ result }: { result: ScoreResult }) {
  return (
    <section>
      <p>Điểm</p>
      <p>{result.totalScore.toFixed(2)} / 10</p>
      <p>
        Đúng {result.correct}/{result.total} câu
      </p>
    </section>
  );
}
