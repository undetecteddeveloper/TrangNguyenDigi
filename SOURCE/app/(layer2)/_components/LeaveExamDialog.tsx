"use client";

// LeaveExamDialog — modal cảnh báo rời trang làm bài (S#28 Q3, Layer 2).
// Theme Mực & Sơn mài: card nền background + viền hairline, KHÔNG đổ bóng
// (DESIGN.md Elevation & Depth) — phân lớp bằng scrim đen sơn mài mờ.
// Nút chính "Leave" đỏ son (hành động rời = hành động chính user đang muốn);
// "Cancel" outline phụ. Esc hoặc click scrim = Cancel.

import { useEffect } from "react";

interface LeaveExamDialogProps {
  open: boolean;
  onCancel: () => void;
  onLeave: () => void;
}

export function LeaveExamDialog({
  open,
  onCancel,
  onLeave,
}: LeaveExamDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-exam-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
    >
      {/* Scrim — click ra ngoài = Hủy. */}
      <button
        aria-hidden
        tabIndex={-1}
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-[#1B1512]/40"
      />
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-background p-6">
        <h2
          id="leave-exam-title"
          className="font-serif text-xl text-foreground"
        >
          Leave this exam?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your answers haven&apos;t been submitted yet. If you leave now, the
          progress of this attempt will be lost.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[4px] border border-border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="rounded-[4px] bg-brand px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-brand-foreground transition-opacity hover:opacity-90"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
