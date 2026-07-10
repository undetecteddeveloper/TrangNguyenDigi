// QuestionPagination — điều hướng giữa các câu (Layer 2). GĐ 3 M3.1 Task 2–3.
// Mỗi câu là một ô vuông: chưa làm = hairline mờ, đã làm = nền brand mờ,
// đang xem = brand solid. Câu đã đánh dấu (flag) có chấm nhỏ ở góc trên-phải.
// Điều hướng chỉ qua các ô (nút prev/next đã bỏ — engineer).
// (Swipe cho mobile — UI-LAYER-MAP 8.2 — xử lý ở task responsive sau.)

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
    <nav>
      <ol className="flex flex-wrap gap-2">
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
                className={`relative flex size-9 items-center justify-center rounded-md border text-sm tabular-nums transition-colors ${
                  isCurrent
                    ? "border-brand bg-brand text-brand-foreground"
                    : isAnswered
                      ? "border-brand/30 bg-brand/8 text-foreground hover:border-brand"
                      : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
                }`}
              >
                {i + 1}
                {isFlagged && (
                  <span
                    aria-hidden
                    className={`absolute -right-0.5 -top-0.5 size-2 rounded-full ring-2 ring-background ${
                      isCurrent ? "bg-background" : "bg-brand"
                    }`}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
