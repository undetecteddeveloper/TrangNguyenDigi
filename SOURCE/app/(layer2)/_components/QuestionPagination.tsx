// QuestionPagination — sidebar điều hướng giữa các câu (Layer 2). GĐ 3 M3.1 Task 2–3.
// Đồng bộ TEMPLATE/L2/ExamPage: card hairline bo góc 8px, lưới 4 cột, mỗi câu
// một ô vuông — đang xem = viền 2px accent, đã làm = nền brand, chưa làm =
// hairline; câu đánh dấu có chấm nhỏ ở góc trên-phải.
// (Swipe cho mobile — UI-LAYER-MAP 8.2 — xử lý ở ExamPlayer.)

interface QuestionPaginationProps {
  current: number; // index 0-based của câu đang xem
  total: number;
  /** Các index đã có đáp án — đánh dấu "đã làm". */
  answeredIndices: number[];
  /** Các index được đánh dấu để xem lại (flag). */
  flaggedIndices: number[];
  onJump: (index: number) => void;
}

export function QuestionPagination({
  current,
  total,
  answeredIndices,
  flaggedIndices,
  onJump,
}: QuestionPaginationProps) {
  const answered = new Set(answeredIndices);
  const flagged = new Set(flaggedIndices);

  return (
    <div className="rounded-lg border border-border p-5">
      <div className="eyebrow mb-3.5">Questions</div>
      <nav>
        <ol className="grid grid-cols-4 gap-2">
          {Array.from({ length: total }, (_, i) => {
            const isCurrent = i === current;
            const isAnswered = answered.has(i);
            const isFlagged = flagged.has(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  aria-current={isCurrent ? "true" : undefined}
                  aria-label={`Question ${i + 1}${isAnswered ? " (answered)" : ""}${
                    isFlagged ? " (flagged)" : ""
                  }`}
                  className={`relative flex aspect-square w-full items-center justify-center rounded text-sm tabular-nums transition-colors ${
                    isCurrent
                      ? "border-2 border-ring text-foreground"
                      : isAnswered
                        ? "border border-transparent bg-brand text-brand-foreground hover:opacity-90"
                        : "border border-border text-muted-foreground hover:border-ring/50 hover:text-foreground"
                  }`}
                >
                  {i + 1}
                  {isFlagged && (
                    <span
                      aria-hidden
                      className="absolute -top-1 -right-1 size-2 rounded-full bg-ring ring-2 ring-background"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
