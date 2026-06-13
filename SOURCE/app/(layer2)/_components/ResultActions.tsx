// ResultActions — 2 ô Save PDF + Share ở màn Result (Layer 2). GĐ 3 M3.1 Task 4.
// Template: 2 ô vuông cạnh block chủ đề. Q3: icon TRỐNG + nhãn "save"/"share",
// CHƯA có function (placeholder) → button vô hại, disabled để báo "chưa hoạt động".
// Visual "tờ giấy trắng": card hairline, KHÔNG fill màu (màu template tượng trưng, Q6).

const ACTIONS = [
  { key: "save", label: "save" },
  { key: "share", label: "share" },
] as const;

export function ResultActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ACTIONS.map((a) => (
        <button
          key={a.key}
          type="button"
          disabled
          title="Tính năng sẽ có sau"
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-brand/40 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {/* Icon trống — ô vuông hairline placeholder (Q3). */}
          <span aria-hidden className="size-6 rounded-md border border-border" />
          <span className="font-mono text-xs lowercase tracking-wide">
            {a.label}
          </span>
        </button>
      ))}
    </div>
  );
}
