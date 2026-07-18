"use client";

// QuestionEditor — sửa tại chỗ một câu (UI Spec §QuestionEditor / Task 6.4 + D1).
// Chế độ xem: stem plain-text, QuestionFigure cho hình, lựa chọn A–D, đáp án
// đúng chú thích "from your answer file"; essay → đáp án mẫu read-only +
// "Essay — stored, not auto-scored yet". v2.1 (ADR-0005) thêm 2 variant:
// true_false (4 ý a–d, mỗi ý toggle Đ/S theo file đáp án) và short_answer
// (giá trị mong đợi) — cả hai "stored, not auto-scored yet" như essay.
// Chế độ sửa: input stem/choices/ý/đáp án + gỡ hình. Thay đổi đẩy lên
// ReviewScreen (re-validate live).
//
// Ghi chú phạm vi: THÊM/THAY hình từ màn review chưa hỗ trợ (cần action upload
// hình riêng — ngoài 5 action Task 4.1); MVP chỉ cho GỠ hình (đặt imageUrl=null).
// Hình ban đầu đến từ bước trích xuất.

import { useState } from "react";
import { QuestionFigure } from "@/components/shared/QuestionFigure";
import { LIMITS } from "@/lib/ugc/limits";
import type { AssembledQuestion, ChoiceId, SubItemId } from "@/lib/ugc/types";

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];
const SUB_ITEM_IDS: SubItemId[] = ["a", "b", "c", "d"];

const TYPE_LABEL: Record<AssembledQuestion["type"], string> = {
  mcq: "Multiple choice",
  essay: "Essay",
  true_false: "True/False (Đúng/Sai)",
  short_answer: "Short answer",
};

interface QuestionEditorProps {
  question: AssembledQuestion;
  /** Cập nhật một phần câu này (ReviewScreen giữ state tổng). */
  onChange: (patch: Partial<AssembledQuestion>) => void;
  /** Câu này có lỗi (để viền cảnh báo). */
  hasError: boolean;
}

export function QuestionEditor({
  question,
  onChange,
  hasError,
}: QuestionEditorProps) {
  const [editing, setEditing] = useState(false);
  const q = question;

  return (
    <li
      id={`p${q.part}q${q.number}`}
      className={`scroll-mt-20 rounded-lg border p-5 ${
        hasError ? "border-brand" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">Câu {q.number}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{TYPE_LABEL[q.type]}</span>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-brand hover:underline"
          >
            {editing ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Stem */}
      {editing ? (
        <textarea
          value={q.stem}
          onChange={(e) => onChange({ stem: e.target.value })}
          maxLength={LIMITS.MAX_STEM}
          rows={3}
          className="mt-3 w-full resize-y rounded-[4px] border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-brand"
          placeholder="Question text"
        />
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-foreground">{q.stem}</p>
      )}

      {/* Hình */}
      {q.imageUrl && (
        <div className="mt-3">
          <QuestionFigure
            url={q.imageUrl}
            questionNumber={q.number}
            className="max-h-72 w-auto"
          />
          {editing && (
            <button
              type="button"
              onClick={() => onChange({ imageUrl: undefined })}
              className="mt-1 text-xs text-muted-foreground underline-offset-4 hover:text-brand hover:underline"
            >
              Remove image
            </button>
          )}
        </div>
      )}

      {/* MCQ: lựa chọn + đáp án đúng */}
      {q.type === "mcq" && (
        <div className="mt-4 flex flex-col gap-2">
          {CHOICE_IDS.map((cid) => {
            const choice = q.choices?.find((c) => c.id === cid);
            const isCorrect = q.correctAnswer === cid;
            return (
              <div key={cid} className="flex items-center gap-3">
                <button
                  type="button"
                  aria-pressed={isCorrect}
                  aria-label={`Mark choice ${cid} correct`}
                  onClick={() => onChange({ correctAnswer: cid })}
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                    isCorrect
                      ? "border-[#3f7d4f] bg-[#3f7d4f] text-white"
                      : "border-border text-muted-foreground hover:border-brand"
                  }`}
                >
                  {cid}
                </button>
                {editing ? (
                  <input
                    value={choice?.text ?? ""}
                    onChange={(e) => {
                      const others = (q.choices ?? []).filter(
                        (c) => c.id !== cid,
                      );
                      const next = [
                        ...others,
                        { id: cid, text: e.target.value },
                      ].sort(
                        (a, b) =>
                          CHOICE_IDS.indexOf(a.id) - CHOICE_IDS.indexOf(b.id),
                      );
                      onChange({ choices: next });
                    }}
                    maxLength={LIMITS.MAX_CHOICE}
                    className="flex-1 rounded-[4px] border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
                    placeholder={`Choice ${cid}`}
                  />
                ) : (
                  <span className="flex-1 text-sm text-foreground">
                    {choice?.text ?? (
                      <span className="text-brand">— empty —</span>
                    )}
                  </span>
                )}
              </div>
            );
          })}
          <p className="mt-1 text-xs text-muted-foreground">
            Correct answer{" "}
            {q.correctAnswer ? (
              <>
                <span className="text-foreground">{q.correctAnswer}</span> — from
                your answer file
              </>
            ) : (
              <span className="text-brand">not set</span>
            )}
          </p>
        </div>
      )}

      {/* true_false (v2.1): 4 ý a–d, mỗi ý toggle Đ/S theo file đáp án */}
      {q.type === "true_false" && (
        <div className="mt-4 flex flex-col gap-2">
          {SUB_ITEM_IDS.map((sid) => {
            const item = q.subItems?.find((s) => s.id === sid);
            if (!item && !editing) return null;
            const answer = q.subAnswers?.[sid];
            return (
              <div key={sid} className="flex items-center gap-3">
                <span className="w-4 shrink-0 text-xs font-medium text-muted-foreground">
                  {sid})
                </span>
                {editing ? (
                  <input
                    value={item?.text ?? ""}
                    onChange={(e) => {
                      const others = (q.subItems ?? []).filter((s) => s.id !== sid);
                      const next = [...others, { id: sid, text: e.target.value }].sort(
                        (a, b) => SUB_ITEM_IDS.indexOf(a.id) - SUB_ITEM_IDS.indexOf(b.id),
                      );
                      onChange({ subItems: next });
                    }}
                    maxLength={LIMITS.MAX_CHOICE}
                    className="flex-1 rounded-[4px] border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
                    placeholder={`Statement ${sid})`}
                  />
                ) : (
                  <span className="flex-1 text-sm text-foreground">
                    {item?.text ?? <span className="text-brand">— empty —</span>}
                  </span>
                )}
                {/* Toggle Đ/S — đáp án của ý này (từ file đáp án, sửa được). */}
                <div className="flex shrink-0 gap-1" role="group" aria-label={`Answer for ${sid})`}>
                  {([true, false] as const).map((v) => {
                    const active = answer === v;
                    return (
                      <button
                        key={String(v)}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onChange({ subAnswers: { ...q.subAnswers, [sid]: v } })}
                        className={`rounded-[4px] border px-2 py-0.5 text-xs font-medium transition-colors ${
                          active
                            ? v
                              ? "border-[#3f7d4f] bg-[#3f7d4f] text-white"
                              : "border-brand bg-brand text-white"
                            : "border-border text-muted-foreground hover:border-brand"
                        }`}
                      >
                        {v ? "Đ" : "S"}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <p className="mt-1 text-xs text-muted-foreground">
            Đ/S per statement — from your answer file.{" "}
            <span className="italic">Stored, not auto-scored yet.</span>
          </p>
        </div>
      )}

      {/* short_answer (v2.1): giá trị mong đợi */}
      {q.type === "short_answer" && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Expected answer — from your answer file
          </p>
          {editing ? (
            <input
              value={q.essayAnswer ?? ""}
              onChange={(e) => onChange({ essayAnswer: e.target.value })}
              maxLength={LIMITS.MAX_SHORT_ANSWER}
              className="mt-1 w-full rounded-[4px] border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-brand"
              placeholder="e.g. 1260 / 1,04"
            />
          ) : (
            <p className="mt-1 rounded-[4px] border border-border bg-card px-3 py-1.5 text-sm text-foreground">
              {q.essayAnswer ?? <span className="text-brand">— empty —</span>}
            </p>
          )}
          <p className="mt-1 text-xs italic text-muted-foreground">
            Short answer — stored, not auto-scored yet.
          </p>
        </div>
      )}

      {/* Essay: đáp án mẫu */}
      {q.type === "essay" && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">Model answer</p>
          {editing ? (
            <textarea
              value={q.essayAnswer ?? ""}
              onChange={(e) => onChange({ essayAnswer: e.target.value })}
              maxLength={LIMITS.MAX_ESSAY_ANSWER}
              rows={4}
              className="mt-1 w-full resize-y rounded-[4px] border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-brand"
            />
          ) : (
            <p className="mt-1 whitespace-pre-wrap rounded-[4px] border border-border bg-card p-3 text-sm text-foreground">
              {q.essayAnswer ?? <span className="text-brand">— empty —</span>}
            </p>
          )}
          <p className="mt-1 text-xs italic text-muted-foreground">
            Essay — stored, not auto-scored yet.
          </p>
        </div>
      )}
    </li>
  );
}
