"use client";

// ReviewScreen — container S-03 review & edit (UI Spec §ReviewScreen / Task 6.4).
// Giữ bản sao AssembledExam sửa được; validate LIVE bằng validateAssembledExam
// (thuần, client-safe) để bật/tắt Publish + đổ ExtractionErrorPanel. Save →
// saveExam (persist nháp/đề published). Publish → save trước rồi publishExam.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveExam, publishExam } from "@/app/(layer4)/actions";
import { validateAssembledExam } from "@/lib/ugc/assembleExam";
import type { AssembledExam, AssembledQuestion, SaveExamPatch } from "@/lib/ugc/types";
import { StatusBadge } from "./StatusBadge";
import { ExtractionErrorPanel } from "./ExtractionErrorPanel";
import { AssembledQuestionList } from "./AssembledQuestionList";
import { PublishBar } from "./PublishBar";

interface ReviewScreenProps {
  examId: string;
  status: string;
  initialExam: AssembledExam;
}

/** State → SaveExamPatch (subject/grade cố định — không gửi).
 * v2.1: id composite `p{part}q{n}` (khớp id do extractAndAssemble tạo);
 * true_false gửi subItems + subAnswers; short_answer dùng essayAnswer. */
function toPatch(examId: string, exam: AssembledExam): SaveExamPatch {
  return {
    meta: {
      title: exam.meta.title,
      durationMinutes: exam.meta.durationMinutes,
      school: exam.meta.school ?? null,
      schoolYear: exam.meta.schoolYear ?? null,
      semester: exam.meta.semester ?? null,
    },
    questions: exam.questions.map((q) => ({
      id: `${examId}-p${q.part}q${q.number}`,
      stem: q.stem,
      choices: q.choices,
      subItems: q.subItems,
      correctAnswer: q.correctAnswer ?? null,
      subAnswers: q.subAnswers ?? null,
      essayAnswer: q.essayAnswer ?? null,
      imageUrl: q.imageUrl ?? null,
    })),
  };
}

export function ReviewScreen({ examId, status: initialStatus, initialExam }: ReviewScreenProps) {
  const [exam, setExam] = useState<AssembledExam>(initialExam);
  const [status, setStatus] = useState(initialStatus);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const errors = validateAssembledExam(exam);
  const isPublished = status === "published";
  const canPublish = errors.length === 0;

  // v2.1: danh tính câu = (part, number) — "Câu 1" các phần khác nhau độc lập.
  function onChangeQuestion(part: number, number: number, patch: Partial<AssembledQuestion>) {
    setDirty(true);
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.part === part && q.number === number ? { ...q, ...patch } : q
      ),
    }));
  }

  async function persist(): Promise<boolean> {
    setSaving(true);
    setError(null);
    const result = await saveExam(examId, toPatch(examId, exam));
    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return false;
    }
    setDirty(false);
    // Đề chưa published: status có thể đổi review↔failed theo validate.
    if (!isPublished) setStatus(errors.length > 0 ? "failed" : "review");
    router.refresh();
    return true;
  }

  async function onPublish() {
    if (!canPublish) return;
    setPublishing(true);
    setError(null);
    // Lưu chỉnh sửa trước (publishExam validate từ DB).
    const saved = await saveExam(examId, toPatch(examId, exam));
    if (saved.error) {
      setPublishing(false);
      setError(saved.error.message);
      return;
    }
    const result = await publishExam(examId);
    setPublishing(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    router.push("/me/exams?published=1");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div>
        <Link
          href="/me/exams"
          className="eyebrow hover:text-brand inline-flex items-center gap-1 transition-colors"
        >
          ← My exams
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-foreground text-2xl">{exam.meta.title}</h1>
          <StatusBadge status={status} />
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {exam.meta.subject} · Grade {exam.meta.grade} · {exam.meta.durationMinutes} min ·{" "}
          {exam.questions.length} question
          {exam.questions.length === 1 ? "" : "s"}
        </p>
        {isPublished && (
          <p className="text-muted-foreground mt-2 text-sm">
            This exam is published. Edits are saved live and stay complete.
          </p>
        )}
      </div>

      <ExtractionErrorPanel errors={errors} />

      <AssembledQuestionList
        questions={exam.questions}
        parts={exam.parts}
        errors={errors}
        onChangeQuestion={onChangeQuestion}
      />

      <PublishBar
        isPublished={isPublished}
        canPublish={canPublish}
        saving={saving}
        publishing={publishing}
        dirty={dirty}
        error={error}
        examId={examId}
        examTitle={exam.meta.title}
        onSave={persist}
        onPublish={onPublish}
      />
    </div>
  );
}
