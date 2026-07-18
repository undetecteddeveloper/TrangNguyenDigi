// StatusBadge — nhãn trạng thái đề UGC (UI Spec D9 / Task 6.3).
// Phân biệt được cả khi GRAYSCALE: mỗi status có glyph + CHỮ riêng (không chỉ
// dựa màu). Server-safe, thuần.

import { cn } from "@/lib/utils";

type Status = "processing" | "review" | "draft" | "published" | "failed";

const CONFIG: Record<
  Status,
  { glyph: string; label: string; className: string }
> = {
  processing: {
    glyph: "◌",
    label: "Processing",
    className: "border-border text-muted-foreground",
  },
  review: {
    glyph: "◑",
    label: "Needs review",
    className: "border-[#B8863B] text-[#8a6420]",
  },
  draft: {
    glyph: "○",
    label: "Draft",
    className: "border-border text-muted-foreground",
  },
  published: {
    glyph: "●",
    label: "Published",
    className: "border-[#3f7d4f] text-[#2f6b3f]",
  },
  failed: {
    glyph: "▲",
    label: "Needs fixing",
    className: "border-brand text-brand",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const cfg = CONFIG[status as Status] ?? CONFIG.processing;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
        className,
      )}
    >
      <span aria-hidden>{cfg.glyph}</span>
      {cfg.label}
    </span>
  );
}
