"use client";

// UploadForm — container S-01 (UI Spec §UploadForm / Task 6.2). MỘT nơi giữ
// state: metadata + 2 file. KHÔNG BAO GIỜ clear khi lỗi (giữ nguyên để sửa).
// Extract disabled tới khi metadata hợp lệ (client) + đủ 2 file. Gọi
// extractAndAssemble (server): thành công → action tự redirect /me/exams/[id];
// thất bại → hiện lỗi, giữ nguyên form.

import { useState, useTransition } from "react";
import { extractAndAssemble } from "@/app/(layer4)/actions";
import { LIMITS } from "@/lib/ugc/limits";
import type { UgcActionError } from "@/lib/ugc/types";
import {
  MetadataFields,
  type ExamMetaFormValue,
} from "./MetadataFields";
import { FileUploadFields } from "./FileUploadFields";
import { UploadGuide } from "./UploadGuide";
import { ExtractionProgress } from "./ExtractionProgress";

const EMPTY_META: ExamMetaFormValue = {
  title: "",
  subject: "",
  grade: "",
  durationMinutes: "",
  school: "",
  schoolYear: "",
  semester: "",
};

/** Check nhẹ phía client để bật/tắt nút Extract (server validate authoritative). */
function metaLooksValid(m: ExamMetaFormValue): boolean {
  const grade = Number(m.grade);
  const duration = Number(m.durationMinutes);
  return (
    m.title.trim().length > 0 &&
    m.subject.trim().length > 0 &&
    Number.isInteger(grade) &&
    grade >= LIMITS.MIN_GRADE &&
    grade <= LIMITS.MAX_GRADE &&
    Number.isInteger(duration) &&
    duration >= LIMITS.MIN_DURATION &&
    duration <= LIMITS.MAX_DURATION
  );
}

export function UploadForm() {
  const [meta, setMeta] = useState<ExamMetaFormValue>(EMPTY_META);
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [error, setError] = useState<UgcActionError | null>(null);
  const [pending, startTransition] = useTransition();

  const canExtract =
    metaLooksValid(meta) && !!questionFile && !!answerFile && !pending;

  function onSubmit() {
    if (!canExtract || !questionFile || !answerFile) return;
    setError(null);
    const fd = new FormData();
    fd.set("title", meta.title);
    fd.set("subject", meta.subject);
    fd.set("grade", meta.grade);
    fd.set("durationMinutes", meta.durationMinutes);
    fd.set("school", meta.school);
    fd.set("schoolYear", meta.schoolYear);
    fd.set("semester", meta.semester);
    fd.set("questionFile", questionFile);
    fd.set("answerFile", answerFile);

    startTransition(async () => {
      // Thành công → action gọi redirect() (ném NEXT_REDIRECT, Next xử lý).
      // Chỉ nhận về giá trị khi THẤT BẠI.
      const result = await extractAndAssemble(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl text-foreground">Upload an exam</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the details, attach your question and answer files, then extract.
        </p>
      </div>

      <UploadGuide />

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-brand bg-brand/8 px-4 py-3 text-sm text-brand"
        >
          {error.message}
          {error.errors && error.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-5">
              {error.errors.map((e, i) => (
                <li key={i}>{e.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg text-foreground">Details</h2>
        <MetadataFields
          value={meta}
          onChange={(patch) => setMeta((m) => ({ ...m, ...patch }))}
          fieldErrors={error?.fieldErrors}
          disabled={pending}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg text-foreground">Files</h2>
        <FileUploadFields
          questionFile={questionFile}
          answerFile={answerFile}
          onSelectQuestion={setQuestionFile}
          onSelectAnswer={setAnswerFile}
          disabled={pending}
        />
      </section>

      {pending && <ExtractionProgress />}

      {/* ExtractBar */}
      <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
        {!canExtract && !pending && (
          <p className="text-xs text-muted-foreground">
            Fill in the required details and attach both files to continue.
          </p>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canExtract}
          className="rounded-[4px] bg-brand px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Extracting…" : "Extract"}
        </button>
      </div>
    </div>
  );
}
