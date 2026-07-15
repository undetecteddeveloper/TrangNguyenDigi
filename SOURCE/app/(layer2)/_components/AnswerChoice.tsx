// AnswerChoice — một lựa chọn đáp án trong Exam Player (Layer 2). GĐ 3 M3.1 Task 2.
// Visual đồng bộ TEMPLATE/L2/ExamPage: hàng hairline bo góc 4px, radio native ẩn
// (giữ a11y), text đầy đủ chiều rộng (không có badge chữ cái), viền brand 2px
// khi chọn. Controlled qua props selected/onSelect.

import type { Choice, ChoiceId } from "@/types/question";
import { RichText } from "@/components/shared/RichText";

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
      className={`flex cursor-pointer items-center rounded border px-4 py-3 transition-colors ${
        selected
          ? "border-2 border-brand py-[11px]"
          : "border-border bg-card hover:border-ring/50 hover:bg-accent"
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
      <RichText
        text={choice.text}
        inline
        className="flex-1 text-base leading-relaxed text-card-foreground"
      />
    </label>
  );
}
