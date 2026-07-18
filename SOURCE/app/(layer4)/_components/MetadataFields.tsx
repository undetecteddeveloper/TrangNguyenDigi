"use client";

// MetadataFields — nhóm input metadata đề (UI Spec §MetadataFields, D10 / Task 6.2).
// Controlled hoàn toàn bởi UploadForm (không tự giữ state — không mất khi lỗi).
// fieldErrors từ server (validation) map theo tên field.

import { LIMITS } from "@/lib/ugc/limits";

export type ExamMetaFormValue = {
  title: string;
  subject: string;
  grade: string;
  durationMinutes: string;
  school: string;
  schoolYear: string;
  semester: string;
};

interface MetadataFieldsProps {
  value: ExamMetaFormValue;
  onChange: (patch: Partial<ExamMetaFormValue>) => void;
  fieldErrors?: Record<string, string>;
  disabled?: boolean;
}

const labelCls = "block text-sm font-medium text-foreground";
const inputCls =
  "mt-1.5 w-full rounded-[4px] border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-brand disabled:opacity-60";
const errCls = "mt-1 text-xs text-brand";

export function MetadataFields({
  value,
  onChange,
  fieldErrors,
  disabled,
}: MetadataFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="meta-title" className={labelCls}>
          Title <span className="text-brand">*</span>
        </label>
        <input
          id="meta-title"
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          maxLength={LIMITS.MAX_TITLE}
          disabled={disabled}
          className={inputCls}
          aria-invalid={!!fieldErrors?.title}
        />
        {fieldErrors?.title && <p className={errCls}>{fieldErrors.title}</p>}
      </div>

      <div>
        <label htmlFor="meta-subject" className={labelCls}>
          Subject <span className="text-brand">*</span>
        </label>
        <input
          id="meta-subject"
          value={value.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          disabled={disabled}
          className={inputCls}
          aria-invalid={!!fieldErrors?.subject}
        />
        {fieldErrors?.subject && <p className={errCls}>{fieldErrors.subject}</p>}
      </div>

      <div>
        <label htmlFor="meta-grade" className={labelCls}>
          Grade <span className="text-brand">*</span>
        </label>
        <input
          id="meta-grade"
          type="number"
          inputMode="numeric"
          min={LIMITS.MIN_GRADE}
          max={LIMITS.MAX_GRADE}
          value={value.grade}
          onChange={(e) => onChange({ grade: e.target.value })}
          disabled={disabled}
          className={inputCls}
          aria-invalid={!!fieldErrors?.grade}
        />
        {fieldErrors?.grade && <p className={errCls}>{fieldErrors.grade}</p>}
      </div>

      <div>
        <label htmlFor="meta-duration" className={labelCls}>
          Duration (minutes) <span className="text-brand">*</span>
        </label>
        <input
          id="meta-duration"
          type="number"
          inputMode="numeric"
          min={LIMITS.MIN_DURATION}
          max={LIMITS.MAX_DURATION}
          value={value.durationMinutes}
          onChange={(e) => onChange({ durationMinutes: e.target.value })}
          disabled={disabled}
          className={inputCls}
          aria-invalid={!!fieldErrors?.durationMinutes}
        />
        {fieldErrors?.durationMinutes && (
          <p className={errCls}>{fieldErrors.durationMinutes}</p>
        )}
      </div>

      <div>
        <label htmlFor="meta-school" className={labelCls}>
          School <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="meta-school"
          value={value.school}
          onChange={(e) => onChange({ school: e.target.value })}
          maxLength={LIMITS.MAX_SCHOOL}
          disabled={disabled}
          className={inputCls}
          aria-invalid={!!fieldErrors?.school}
        />
        {fieldErrors?.school && <p className={errCls}>{fieldErrors.school}</p>}
      </div>

      <div>
        <label htmlFor="meta-year" className={labelCls}>
          Year <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="meta-year"
          type="number"
          inputMode="numeric"
          min={LIMITS.MIN_YEAR}
          max={LIMITS.MAX_YEAR}
          value={value.schoolYear}
          onChange={(e) => onChange({ schoolYear: e.target.value })}
          disabled={disabled}
          className={inputCls}
          aria-invalid={!!fieldErrors?.schoolYear}
        />
        {fieldErrors?.schoolYear && (
          <p className={errCls}>{fieldErrors.schoolYear}</p>
        )}
      </div>

      <div>
        <label htmlFor="meta-semester" className={labelCls}>
          Semester <span className="text-muted-foreground">(optional)</span>
        </label>
        <select
          id="meta-semester"
          value={value.semester}
          onChange={(e) => onChange({ semester: e.target.value })}
          disabled={disabled}
          className={inputCls}
          aria-invalid={!!fieldErrors?.semester}
        >
          <option value="">None</option>
          <option value="HK1">HK1</option>
          <option value="HK2">HK2</option>
        </select>
        {fieldErrors?.semester && (
          <p className={errCls}>{fieldErrors.semester}</p>
        )}
      </div>
    </div>
  );
}
