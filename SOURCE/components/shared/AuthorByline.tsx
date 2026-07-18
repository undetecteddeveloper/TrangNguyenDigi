// AuthorByline — dòng "by {tên tác giả}" cho đề UGC (ADR-0003 / Task 5.2).
// Render CHỈ khi có author_display_name; đề seed (author_id null) → trả null,
// KHÔNG chiếm chỗ trống (AC-021). Server-safe, thuần.

import { cn } from "@/lib/utils";

interface AuthorBylineProps {
  /** Tên hiển thị tác giả; undefined/null (đề seed) → không render. */
  name: string | null | undefined;
  className?: string;
}

export function AuthorByline({ name, className }: AuthorBylineProps) {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  return (
    <p className={cn("text-sm text-[var(--block-fg-muted)]", className)}>
      by <span className="text-foreground">{trimmed}</span>
    </p>
  );
}
