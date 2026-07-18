// ExamRow — một hàng đề trong "My exams" (UI Spec §ExamRow / Task 6.3).
// Action theo status (D9): processing→không; failed→Review & fix + Delete;
// review→Continue review + Delete; draft→Continue + Delete; published→Edit +
// Delete (tiêu đề link tới đề live). Server-safe (DeleteDialog là client con).

import Link from "next/link";
import type { MyExamListItem } from "@/app/(layer4)/queries";
import { StatusBadge } from "./StatusBadge";
import { DeleteDialog } from "./DeleteDialog";

const REVIEW_HREF = (id: string) => `/me/exams/${id}`;

/** Nhãn hành động chính theo status (null = không có action chính). */
function primaryAction(item: MyExamListItem): { label: string; href: string } | null {
  switch (item.status) {
    case "failed":
      return { label: "Review & fix", href: REVIEW_HREF(item.id) };
    case "review":
      return { label: "Continue review", href: REVIEW_HREF(item.id) };
    case "draft":
      return { label: "Continue", href: REVIEW_HREF(item.id) };
    case "published":
      return { label: "Edit", href: REVIEW_HREF(item.id) };
    default:
      return null; // processing
  }
}

export function ExamRow({ item }: { item: MyExamListItem }) {
  const primary = primaryAction(item);
  // Published: tiêu đề trỏ tới đề live; còn lại trỏ màn review (nếu có action).
  const titleHref =
    item.status === "published"
      ? `/exams/${item.id}`
      : primary?.href ?? null;

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          {titleHref ? (
            <Link
              href={titleHref}
              className="truncate text-lg text-foreground transition-colors hover:text-brand"
            >
              {item.title}
            </Link>
          ) : (
            <span className="truncate text-lg text-foreground">{item.title}</span>
          )}
          <StatusBadge status={item.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {item.subject} · Grade {item.grade} · {item.questionCount} question
          {item.questionCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {primary && (
          <Link
            href={primary.href}
            className="rounded-[4px] border border-border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-accent"
          >
            {primary.label}
          </Link>
        )}
        <DeleteDialog examId={item.id} examTitle={item.title} />
      </div>
    </li>
  );
}
