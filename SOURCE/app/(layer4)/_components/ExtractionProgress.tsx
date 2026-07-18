// ExtractionProgress — trạng thái đang trích xuất (UI Spec §ExtractionProgress,
// AC-029 / Task 6.2). role="status" polite, không chặn thao tác đọc.

export function ExtractionProgress() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg border border-[#B8863B] bg-[#B8863B]/8 px-4 py-3 text-sm text-[#8a6420]"
    >
      <span
        aria-hidden
        className="size-4 shrink-0 animate-spin rounded-full border-2 border-[#B8863B]/40 border-t-[#B8863B]"
      />
      <span>
        Reading your files and assembling the exam… this can take a moment.
        You&apos;ll review everything before it&apos;s published.
      </span>
    </div>
  );
}
