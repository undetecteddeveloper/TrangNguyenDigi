// MyExamsList — danh sách đề của user (UI Spec §MyExamsList / Task 6.3).
// Mới nhất trước (query đã order); empty → khối gạch đứt + link Upload.
// Banner ?published=1 (D13) do page truyền `justPublished`. Server-safe.

import Link from "next/link";
import type { MyExamListItem } from "@/app/(layer4)/queries";
import { ExamRow } from "./ExamRow";

export function MyExamsList({
  exams,
  justPublished,
}: {
  exams: MyExamListItem[];
  justPublished: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      {justPublished && (
        <div
          role="status"
          className="rounded-lg border border-[#3f7d4f] bg-[#3f7d4f]/8 px-4 py-3 text-sm text-[#2f6b3f]"
        >
          ✓ Your exam is published and now visible in the catalog.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-foreground">My exams</h1>
        <Link
          href="/upload"
          className="rounded-[4px] bg-brand px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-brand-foreground transition-opacity hover:opacity-90"
        >
          Upload an exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t uploaded any exams yet.
          </p>
          <Link
            href="/upload"
            className="text-sm text-brand underline-offset-4 hover:underline"
          >
            Upload an exam
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {exams.map((exam) => (
            <ExamRow key={exam.id} item={exam} />
          ))}
        </ul>
      )}
    </div>
  );
}
