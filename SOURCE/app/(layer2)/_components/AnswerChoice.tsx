// AnswerChoice — một lựa chọn đáp án trong Exam Player (Layer 2). GĐ 3 M3.1 Task 2.
// Visual "Focused / tờ giấy trắng": card hairline, radio native ẩn (giữ a11y),
// nhãn chữ cái A/B/C/D dạng mono, accent chàm chỉ khi chọn/hover.
// Controlled qua props selected/onSelect.

import type { Choice, ChoiceId } from "@/types/question";

interface AnswerChoiceProps {
  /** name của nhóm radio — để mỗi câu là một nhóm độc lập. */
  name: string;
  choice: Choice;
  selected: boolean;
  onSelect: (id: ChoiceId) => void;
}

export function AnswerChoice({
  name,
  choice,
  selected,
  onSelect,
}: AnswerChoiceProps) {
  return (
    <label
      className={`group flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
        selected
          ? "border-brand bg-brand/8"
          : "border-border bg-card hover:border-brand/40 hover:bg-accent"
      }`}
    >
      {/* Radio thật ẩn đi (giữ keyboard + screen reader), card là affordance thị giác. */}
      <input
        type="radio"
        name={name}
        value={choice.id}
        checked={selected}
        onChange={() => onSelect(choice.id)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`flex size-7 shrink-0 items-center justify-center rounded-md border font-mono text-sm font-medium transition-colors ${
          selected
            ? "border-brand bg-brand text-brand-foreground"
            : "border-border text-muted-foreground group-hover:border-brand/40"
        }`}
      >
        {choice.id}
      </span>
      <span className="pt-0.5 text-base leading-relaxed text-card-foreground">
        {choice.text}
      </span>
    </label>
  );
}
