// Result Detail — /exams/[id]/attempt/[attemptId]/result/detail (Layer 2). GĐ 3 M3.1 Task 4.
// Page riêng cho phần "Chi tiết từng câu" (Q5): tách khỏi màn Result để giữ Result gọn.
// Server Component: đọc getResult(); chưa nộp / không thuộc user → redirect trang đề.
// Hiển thị mỗi câu: nội dung (markdown+LaTeX) + 4 lựa chọn, tô đáp án đúng (brand) và
// đáp án user chọn sai (destructive). Visual nhất quán L2 "tờ giấy trắng / focused".

import Link from "next/link";
import { redirect } from "next/navigation";
import { getResult } from "@/app/(layer2)/queries";
import { SiteHeader } from "@/app/(layer2)/_components/SiteHeader";
import { RichText } from "@/components/shared/RichText";

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { id, attemptId } = await params;
  const data = await getResult(attemptId);

  if (!data) {
    redirect(`/exams/${id}`);
  }

  const { examId, examTitle, result, questions } = data;
  const resultHref = `/exams/${examId}/attempt/${attemptId}/result`;

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <header className="flex flex-col gap-2">
          <span className="eyebrow">Chi tiết bài làm</span>
          <h1 className="font-serif text-2xl leading-snug text-foreground">
            {examTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            Đúng{" "}
            <span className="font-medium text-foreground tabular-nums">
              {result.correct}/{result.total}
            </span>{" "}
            câu
          </p>
        </header>

        <ol className="mt-8 flex flex-col gap-8">
          {result.perQuestion.map((r, i) => {
            const q = questions[r.questionId];
            const status = r.isCorrect
              ? { label: "Đúng", cls: "text-brand" }
              : r.selected
                ? { label: "Sai", cls: "text-destructive" }
                : { label: "Bỏ trống", cls: "text-muted-foreground" };

            return (
              <li
                key={r.questionId}
                className="flex flex-col gap-4 border-t border-border pt-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="eyebrow">Câu {i + 1}</span>
                  <span className={`text-xs font-medium ${status.cls}`}>
                    {status.label}
                  </span>
                </div>

                {q && (
                  <RichText
                    text={q.content}
                    className="font-serif text-lg leading-relaxed text-foreground"
                  />
                )}

                <ul className="flex flex-col gap-2">
                  {q?.choices.map((choice) => {
                    const isCorrect = choice.id === r.correct;
                    const isSelectedWrong =
                      choice.id === r.selected && r.selected !== r.correct;

                    const rowCls = isCorrect
                      ? "border-brand bg-brand/8"
                      : isSelectedWrong
                        ? "border-destructive bg-destructive/8"
                        : "border-border bg-card";
                    const badgeCls = isCorrect
                      ? "border-brand bg-brand text-brand-foreground"
                      : isSelectedWrong
                        ? "border-destructive bg-destructive text-white"
                        : "border-border text-muted-foreground";

                    return (
                      <li
                        key={choice.id}
                        className={`flex items-start gap-3 rounded-lg border p-3 ${rowCls}`}
                      >
                        <span
                          aria-hidden
                          className={`flex size-7 shrink-0 items-center justify-center rounded-md border font-mono text-sm font-medium ${badgeCls}`}
                        >
                          {choice.id}
                        </span>
                        <RichText
                          text={choice.text}
                          inline
                          className="pt-0.5 text-base leading-relaxed text-card-foreground"
                        />
                        {isCorrect && (
                          <span className="ml-auto shrink-0 self-center font-mono text-[0.65rem] uppercase tracking-wide text-brand">
                            Đáp án đúng
                          </span>
                        )}
                        {isSelectedWrong && (
                          <span className="ml-auto shrink-0 self-center font-mono text-[0.65rem] uppercase tracking-wide text-destructive">
                            Bạn chọn
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 border-t border-border pt-6">
          <Link
            href={resultHref}
            className="inline-block rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand"
          >
            ← Quay lại kết quả
          </Link>
        </div>
      </main>
    </div>
  );
}
