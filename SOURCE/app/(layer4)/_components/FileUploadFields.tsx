"use client";

// FileUploadFields — 2 picker file (câu hỏi + đáp án) (UI Spec §FileUploadFields
// / Task 6.2). Hiện chip tên file đã chọn + nút gỡ; hint loại/kích thước/số
// trang. Controlled bởi UploadForm (giữ selection khi lỗi). Cả 2 file bắt buộc.

import { useRef } from "react";
import { LIMITS } from "@/lib/ugc/limits";

const MAX_MB = Math.round(LIMITS.MAX_FILE_BYTES / (1024 * 1024));
const ACCEPT = LIMITS.ALLOWED_MIME.join(",");

interface FilePickerProps {
  id: string;
  label: string;
  hint: string;
  file: File | null;
  onSelect: (file: File | null) => void;
  disabled?: boolean;
}

function FilePicker({ id, label, hint, file, onSelect, disabled }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <span className="block text-sm font-medium text-foreground">
        {label} <span className="text-brand">*</span>
      </span>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>

      {file ? (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-[4px] border border-border bg-card px-3 py-2">
          <span className="min-w-0 truncate text-sm text-foreground">
            {file.name}
          </span>
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            disabled={disabled}
            className="shrink-0 text-xs text-muted-foreground underline-offset-4 hover:text-brand hover:underline disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="mt-2 flex cursor-pointer items-center justify-center rounded-[4px] border border-dashed border-border px-3 py-4 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
        >
          Choose a file…
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT}
        disabled={disabled}
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
        className="sr-only"
      />
    </div>
  );
}

interface FileUploadFieldsProps {
  questionFile: File | null;
  answerFile: File | null;
  onSelectQuestion: (file: File | null) => void;
  onSelectAnswer: (file: File | null) => void;
  disabled?: boolean;
}

export function FileUploadFields({
  questionFile,
  answerFile,
  onSelectQuestion,
  onSelectAnswer,
  disabled,
}: FileUploadFieldsProps) {
  const hint = `PNG, JPEG, WebP, or PDF · up to ${MAX_MB} MB · PDF up to ${LIMITS.MAX_PDF_PAGES} pages`;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FilePicker
        id="question-file"
        label="Question file"
        hint={hint}
        file={questionFile}
        onSelect={onSelectQuestion}
        disabled={disabled}
      />
      <FilePicker
        id="answer-file"
        label="Answer file"
        hint={hint}
        file={answerFile}
        onSelect={onSelectAnswer}
        disabled={disabled}
      />
    </div>
  );
}
