// FlagButton — đánh dấu câu hiện tại để xem lại (Layer 2). GĐ 3 M3.1 Task 3.
// State sống trong useExamPlayer (in-memory session, không persist DB) — controlled
// qua props flagged/onToggle. Active = accent chàm + cờ tô đặc.
"use client";

interface FlagButtonProps {
  flagged: boolean;
  onToggle: () => void;
}

export function FlagButton({ flagged, onToggle }: FlagButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={flagged}
      title={flagged ? "Bỏ đánh dấu câu này" : "Đánh dấu câu này để xem lại"}
      className={`flex items-center gap-1.5 transition-colors ${
        flagged ? "text-brand" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-4"
        fill={flagged ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path d="M3.5 1.5v13" strokeLinecap="round" />
        <path d="M3.5 2.5h8.5l-2 3 2 3H3.5z" />
      </svg>
    </button>
  );
}
