// UploadGuide — hướng dẫn tệp tốt trông thế nào (UI Spec §UploadGuide, AC-028 /
// Task 6.2). Tĩnh, server-safe.

import { LIMITS } from "@/lib/ugc/limits";

const MAX_MB = Math.round(LIMITS.MAX_FILE_BYTES / (1024 * 1024));

export function UploadGuide() {
  return (
    <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
      <h2 className="text-base font-medium text-foreground">
        How this works
      </h2>
      <p className="mt-2">
        Upload two files. Our AI reads them and assembles an exam you review
        before publishing — the answers always come from your answer file, never
        guessed.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h3 className="font-medium text-foreground">Question file</h3>
          <p className="mt-1">
            A clear scan or PDF of the exam questions. Each question numbered
            (Câu 1, Câu 2, …); MCQs with four options A–D. Figures are kept and
            attached to their question.
          </p>
          <p className="mt-1 italic">
            e.g. “Câu 1: … A. … B. … C. … D. …”
          </p>
        </div>
        <div>
          <h3 className="font-medium text-foreground">Answer file</h3>
          <p className="mt-1">
            The answer key mapping each question number to its answer (a letter
            A–D for MCQ, or the model answer for essay questions).
          </p>
          <p className="mt-1 italic">e.g. “1: B, 2: D, 3: A …”</p>
        </div>
      </div>

      <p className="mt-4 text-xs">
        Limits: PNG, JPEG, WebP, or PDF · up to {MAX_MB} MB per file · PDF up to{" "}
        {LIMITS.MAX_PDF_PAGES} pages · up to {LIMITS.MAX_QUESTIONS} questions.
      </p>
    </aside>
  );
}
