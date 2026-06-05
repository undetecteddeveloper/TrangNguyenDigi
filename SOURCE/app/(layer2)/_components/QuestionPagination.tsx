// QuestionPagination — điều hướng giữa các câu (Layer 2).
// GĐ 1: nút prev/next + danh sách số câu, chưa style (M1.4).
// GĐ 3: mobile chuyển sang swipe (xem UI-LAYER-MAP Mục 8.2).

interface QuestionPaginationProps {
  current: number; // index 0-based của câu đang xem
  total: number;
  /** Các index đã có đáp án — đánh dấu "đã làm". */
  answeredIndices: number[];
  onJump: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function QuestionPagination({
  current,
  total,
  answeredIndices,
  onJump,
  onPrev,
  onNext,
}: QuestionPaginationProps) {
  const answered = new Set(answeredIndices);

  return (
    <nav>
      <button type="button" onClick={onPrev} disabled={current === 0}>
        ← Câu trước
      </button>

      <ol>
        {Array.from({ length: total }, (_, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onJump(i)}
              aria-current={i === current ? "true" : undefined}
            >
              {i + 1}
              {answered.has(i) ? " ✓" : ""}
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={onNext}
        disabled={current === total - 1}
      >
        Câu sau →
      </button>
    </nav>
  );
}
